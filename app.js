/* Live observation data is fetched and cached here. Curated facts live only in enrichment-data.js. */
const INAT_USER = 'mattbleu';
const API = '/api/inaturalist';
const CACHE_KEY = 'le-sanctuaire-inat-observations-v2';
const SYNC_KEY = 'le-sanctuaire-inat-synced-v1';
const SANBI_STATUSES = ['LC','NT','VU','EN','CR','EW'];
const hasSanbiStatus = item => SANBI_STATUSES.includes(item.status);
const latestValue = item => Date.parse(item.latestISO || item.latest || '') || 0;
const sortSpecies = (a,b) => latestValue(b) - latestValue(a) ||
  a.common.localeCompare(b.common, 'en', {sensitivity:'base'}) || a.scientific.localeCompare(b.scientific);

// Temporary conservative cluster. Replace `polygon` with the surveyed farm boundary later.
const FARM_BOUNDARY = {
  version: 'cluster-2026-08',
  polygon: [
    [19.1335, -33.8950], [19.1380, -33.8950],
    [19.1380, -33.8870], [19.1335, -33.8870]
  ]
};

let DATA = FALLBACK_DATA.map(item => ({...item, ...(MASTER_ENRICHMENT[item.scientific] || {})})).sort(sortSpecies);
let group = 'All';
let filter = 'all';
let season = 'all';
const grid = document.getElementById('grid');
const q = document.getElementById('q');
const gbar = document.getElementById('groups');

function pointInPolygon(lon, lat, polygon = FARM_BOUNDARY.polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i], [xj, yj] = polygon[j];
    const crosses = ((yi > lat) !== (yj > lat)) &&
      (lon < (xj - xi) * (lat - yi) / ((yj - yi) || Number.EPSILON) + xi);
    if (crosses) inside = !inside;
  }
  return inside;
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const SEASONS = {
  summer: {label:'Summer', months:[12,1,2]},
  autumn: {label:'Autumn', months:[3,4,5]},
  winter: {label:'Winter', months:[6,7,8]},
  spring: {label:'Spring', months:[9,10,11]}
};
const seasonsFor = monthNums => Object.values(SEASONS).filter(s => s.months.some(m => monthNums.includes(m))).map(s => s.label);
const qualityLabel = q => ({research:'Research Grade', needs_id:'Needs ID', casual:'Casual'}[q] || 'Needs ID');
const dateLabel = value => value ? new Intl.DateTimeFormat('en-ZA',{day:'2-digit',month:'short',year:'numeric'}).format(new Date(value+'T12:00:00')) : '—';
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
function esc(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}

function familyOf(o) {
  if (o._family) return o._family;
  const ident = (o.identifications || []).find(x => x.current && x.taxon);
  const ancestors = ident?.taxon?.ancestors || [];
  return ancestors.find(x => x.rank === 'family')?.name || '';
}

function groupFor(scientific, family, iconic) {
  const genus = scientific.split(' ')[0];
  if (['Protea','Leucadendron','Leucospermum','Mimetes'].includes(genus) || family === 'Proteaceae') return 'Proteas';
  if (genus === 'Erica' || family === 'Ericaceae') return 'Ericas & heaths';
  if (genus === 'Pelargonium') return 'Pelargoniums';
  if (genus === 'Drosera') return 'Sundews';
  if (['Agathosma','Adenandra','Diosma'].includes(genus)) return 'Buchus & rutaceae';
  if (['Iridaceae','Amaryllidaceae','Orchidaceae','Oxalidaceae','Asparagaceae'].includes(family)) return 'Bulbs & geophytes';
  if (iconic === 'Aves') return 'Birds';
  if (iconic === 'Mammalia') return 'Mammals';
  if (iconic === 'Reptilia') return 'Reptiles';
  if (['Insecta','Arachnida'].includes(iconic)) return 'Invertebrates';
  return iconic === 'Plantae' ? 'Fynbos shrubs & herbs' : 'Other wildlife';
}

function photoUrl(o) {
  const url = o.photos?.[0]?.url || '';
  return url.replace(/\/square\.(jpe?g|png)$/i, '/medium.$1');
}

function aggregate(observations) {
  const buckets = new Map();
  observations.filter(o => o.taxon && o.observed_on).forEach(o => {
    const key = String(o.taxon.id || o.taxon.name);
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(o);
  });
  return [...buckets.values()].map(records => {
    records.sort((a,b) => a.observed_on.localeCompare(b.observed_on));
    const firstObs = records[0], latestObs = records[records.length - 1];
    const taxon = latestObs.taxon;
    const scientific = taxon.name;
    const baseMeta = MASTER_ENRICHMENT[scientific] || {};
    const family = baseMeta.family || familyOf(latestObs);
    const meta = {...baseMeta};
    const common = meta.common || taxon.preferred_common_name || latestObs.species_guess || scientific;
    const monthNums = [...new Set(records.map(o => Number(o.observed_on.slice(5,7))))].sort((a,b)=>a-b);
    const best = records.find(o => o.quality_grade === 'research' && photoUrl(o)) || [...records].reverse().find(o => photoUrl(o)) || latestObs;
    const qualities = records.map(o => o.quality_grade);
    const quality = qualities.includes('research') ? 'Research Grade' : qualities.includes('needs_id') ? 'Needs ID' : 'Casual';
    return {
      ...meta,
      scientific,
      common,
      family,
      group: meta.group || groupFor(scientific, family, taxon.iconic_taxon_name),
      months: monthNums.map(n => MONTHS[n-1]), monthNums,
      count: records.length,
      frequency: records.length === 1 ? 'Single farm record' : records.length < 4 ? 'Occasional on record' : 'Repeatedly recorded',
      quality,
      image: photoUrl(best),
      inat: best.uri || `https://www.inaturalist.org/observations/${best.id}`,
      first: dateLabel(firstObs.observed_on), latest: dateLabel(latestObs.observed_on),
      firstISO: firstObs.observed_on, latestISO: latestObs.observed_on,
      fact: meta.fact || 'A new live record from iNaturalist. Curated ecological notes can be added without changing the observation history.',
      fieldNote: meta.fieldNote || 'This taxon was added by live sync and is awaiting a curated field note.',
      rankNote: meta.rankNote || (taxon.rank && taxon.rank !== 'species' ? `${taxon.rank[0].toUpperCase()+taxon.rank.slice(1)}-level identification` : '')
    };
  }).sort(sortSpecies);
}

async function fetchAllObservations() {
  const response = await fetch(`${API}?refresh=${Date.now()}`, {headers:{Accept:'application/json'}, cache:'no-store'});
  const payload = await response.json().catch(()=>({}));
  if (!response.ok) throw new Error(payload.error || `Sync service returned ${response.status}`);
  if (!Array.isArray(payload.results)) throw new Error('Sync service returned no observations');
  return payload.results;
}

function setSyncState(state, detail, offline=false) {
  document.getElementById('syncState').textContent = state;
  document.getElementById('lastSynced').textContent = detail;
  document.getElementById('syncDot').classList.toggle('offline', offline);
}

async function sync({quiet=false}={}) {
  const button = document.getElementById('syncBtn');
  button.disabled = true; button.textContent = 'Syncing…';
  if (!quiet) setSyncState('Syncing with iNaturalist','Checking mattbleu’s public observations…');
  try {
    const farmObservations = await fetchAllObservations();
    const stamp = new Date().toISOString();
    DATA = aggregate(farmObservations);
    rebuildControls(); render(); updateStats();
    try {
      localStorage.removeItem('le-sanctuaire-inat-observations-v1');
      localStorage.setItem(CACHE_KEY, JSON.stringify(farmObservations));
      localStorage.setItem(SYNC_KEY, stamp);
    } catch (cacheError) {
      console.warn('Live data loaded but could not be saved for offline use', cacheError);
    }
    setSyncState('Live iNaturalist data',`Last synced ${new Intl.DateTimeFormat('en-ZA',{dateStyle:'medium',timeStyle:'short'}).format(new Date(stamp))} · ${farmObservations.length} farm observations`);
  } catch (error) {
    const cached = readCache();
    if (cached) { DATA = aggregate(cached); rebuildControls(); render(); updateStats(); }
    const stamp = localStorage.getItem(SYNC_KEY);
    const reason = error?.message ? ` · ${error.message}` : '';
    setSyncState('Saved data shown — sync unavailable', stamp ? `Last successful sync ${new Intl.DateTimeFormat('en-ZA',{dateStyle:'medium',timeStyle:'short'}).format(new Date(stamp))}${reason}` : `The original saved farm register is available${reason}`, true);
  } finally {
    button.disabled = false; button.textContent = '↻ Sync iNaturalist';
  }
}

function readCache(){try{return JSON.parse(localStorage.getItem(CACHE_KEY))}catch{return null}}
function updateStats(){
  document.getElementById('sppCount').textContent=DATA.length;
  document.getElementById('obsCount').textContent=DATA.reduce((a,b)=>a+b.count,0);
  document.getElementById('verifiedCount').textContent=DATA.filter(hasSanbiStatus).length;
}
function addChip(name,count){const b=document.createElement('button');b.className='chip'+(name==='All'?' active':'');b.dataset.g=name;b.textContent=name+' '+count;gbar.appendChild(b)}
function rebuildGroups(){
  const groups=[...new Set(DATA.map(x=>x.group))];
  if(group!=='All'&&!groups.includes(group))group='All';
  gbar.innerHTML=''; addChip('All',DATA.length); groups.forEach(g=>addChip(g,DATA.filter(x=>x.group===g).length));
}
function rebuildFacetCounts(){
  document.querySelectorAll('#seasons [data-season]').forEach(button=>{
    const key=button.dataset.season;
    const count=key==='all'?DATA.length:DATA.filter(x=>SEASONS[key].months.some(m=>x.monthNums.includes(m))).length;
    button.textContent=`${button.dataset.label} ${count}`;
  });
  document.querySelectorAll('#special [data-f]').forEach(button=>{
    const key=button.dataset.f;
    const count=key==='all'?DATA.length:DATA.filter(x=>{const previous=filter;filter=key;const matches=okSpecial(x);filter=previous;return matches}).length;
    button.textContent=`${button.dataset.label} ${count}`;
  });
}
function rebuildControls(){rebuildGroups();rebuildFacetCounts()}
function okSpecial(x){if(filter==='single')return x.count===1;if(filter==='endemic')return (x.endemism||'').includes('endemic');if(filter==='alien')return !!x.origin;if(filter==='rare')return x.rangeRarity==='rare'||x.rangeRestricted===true;if(filter.startsWith('sanbi-'))return x.status===filter.slice(6).toUpperCase();if(filter==='research')return x.quality==='Research Grade';if(filter==='aug')return x.monthNums.includes(8);return true}
function okSeason(x){return season==='all'||SEASONS[season].months.some(m=>x.monthNums.includes(m))}
function render(){const term=q.value.trim().toLowerCase();const arr=DATA.filter(x=>(group==='All'||x.group===group)&&okSeason(x)&&okSpecial(x)&&(!term||(`${x.common} ${x.scientific} ${x.group} ${x.family}`).toLowerCase().includes(term))).sort(sortSpecies);grid.innerHTML='';arr.forEach(x=>{const c=document.createElement('article');c.className='card';c.tabIndex=0;c.innerHTML=`<div class="pic">${x.image?`<img loading="lazy" src="${esc(x.image)}" alt="${esc(x.common)}">`:''}<span class="label">${esc(x.group)}</span></div><div class="content"><div class="common">${esc(x.common)}</div><div class="latin">${esc(x.scientific)}</div><div class="tags"><span class="tag recent">Latest ${esc(x.latest)}</span>${x.count===1?'<span class="tag gold">Single farm record</span>':''}${hasSanbiStatus(x)?`<span class="tag sanbi status-${esc(x.status.toLowerCase())}">SANBI ${esc(x.status)}</span>`:''}${x.rangeRarity==='rare'||x.rangeRestricted===true?'<span class="tag rare">Rare · restricted range</span>':''}${x.origin?'<span class="tag red">Alien / introduced</span>':''}</div></div>`;c.onclick=()=>openSheet(x);c.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openSheet(x)}};grid.appendChild(c)});document.getElementById('shown').textContent=arr.length+' shown · newest first';const seasonName=season==='all'?'':SEASONS[season].label+' · ';document.getElementById('title').textContent=seasonName+(group==='All'?'Latest observations':group)}
function ecologyRows(x){const fields=[['Knowledge level',x.ecologyScope],['Pollinator / pollination',x.pollinator||x.pollinationStrategy],['Regeneration / propagation',x.regeneration||x.propagationStrategy],['Seed dispersal',x.dispersal||x.seedDispersal],['Fire response',x.fireResponse],['Animal interactions',x.animalInteractions],['Ecosystem / soil role',x.ecosystemRole||x.soilRelationships],['Phenology / flowering',x.phenology||x.flowering],['Habitat',x.habitat],['What to watch for',x.observationPrompt]];return fields.filter(([,v])=>v).map(([k,v])=>`<div class="ecoRow${k==='What to watch for'?' watchRow':''}"><b>${esc(k)}</b><span>${esc(v)}</span></div>`).join('')}
function scientificNameRows(x){const name=x.nameEtymology;if(!name)return '';const fields=[['Genus name',name.genus],['Specific epithet',name.epithet],['Name story',name.combined],['Common-name connection',name.common],['Remember it',name.clue]];const rows=fields.filter(([,v])=>v).map(([k,v])=>`<div class="ecoRow${k==='Remember it'?' memoryRow':''}"><b>${esc(k)}</b><span>${esc(v)}</span></div>`).join('');const note=name.confidence?`<div class="sourceNote">Confidence: ${esc(name.confidence)}${name.source?` · <a href="${esc(name.source)}" target="_blank" rel="noopener">Etymology source</a>`:''}</div>`:'';return rows+note}
function plantZAfricaRows(x){const fields=[['Description',x.pzaDescription],['Conservation context',x.pzaConservation],['Distribution & habitat',x.pzaDistributionHabitat],['Ecology',x.pzaEcology],['Uses',x.pzaUses]];const rows=fields.filter(([,v])=>v).map(([k,v])=>`<div class="ecoRow"><b>${esc(k)}</b><span>${esc(v)}</span></div>`).join('');return rows&&x.pzaSource?`${rows}<div class="sourceNote">Paraphrased from <a href="${esc(x.pzaSource)}" target="_blank" rel="noopener">PlantZAfrica · SANBI</a>. Traditional-use notes are historical context, not medical advice.</div>`:rows}
function openSheet(x){const nameRows=scientificNameRows(x);document.getElementById('mnameSection').hidden=!nameRows;document.getElementById('mname').innerHTML=nameRows;document.getElementById('sheetImage').innerHTML=x.image?`<img class="sheetPic" src="${esc(x.image)}" alt="${esc(x.common)}">`:'';document.getElementById('mc').textContent=x.common;document.getElementById('ms').textContent=x.scientific;document.getElementById('mfam').textContent=x.family||'—';document.getElementById('mmonths').textContent=x.months.join(', ')||'—';document.getElementById('mseasons').textContent=seasonsFor(x.monthNums).join(', ')||'—';document.getElementById('mrecords').textContent=x.count;document.getElementById('mquality').textContent=x.rankNote||x.quality;document.getElementById('mfirst').textContent=x.first;document.getElementById('mlatest').textContent=x.latest;document.getElementById('mfact').textContent=x.interestingFact||x.fact;document.getElementById('mfield').textContent=x.fieldNote;document.getElementById('mecology').innerHTML=ecologyRows(x)||'<div class="ecoEmpty">Detailed ecological relationships have not yet been curated for this taxon.</div>';const pza=plantZAfricaRows(x);document.getElementById('mpzaSection').hidden=!pza;document.getElementById('mpza').innerHTML=pza;let tags=`<span class="tag">${esc(x.group)}</span>`;if(hasSanbiStatus(x))tags+=`<span class="tag sanbi status-${esc(x.status.toLowerCase())}">SANBI ${esc(x.status)}</span>`;if(x.rangeRarity==='rare'||x.rangeRestricted===true)tags+=`<span class="tag rare">Rare · restricted range</span>`;if(x.endemism)tags+=`<span class="tag green">${esc(x.endemism)}</span>`;if(x.origin)tags+=`<span class="tag red">${esc(x.origin)}</span>`;document.getElementById('mtags').innerHTML=tags;const conservation=hasSanbiStatus(x)?`SANBI status: ${x.status} · ${x.statusSource||'SANBI national assessment'}.`:x.status?`SANBI status needs a more precise identification: ${x.status}.`:'SANBI conservation status has not yet been verified for this taxon.';const rarity=x.rangeRarity==='rare'||x.rangeRestricted===true?` Range rarity: ${x.rarityNote||'documented as localized or range-restricted'}. ${x.raritySource||''}`:' Range rarity has not been flagged; this does not automatically mean the species is common.';document.getElementById('mrednote').textContent=conservation+rarity;const a=document.getElementById('minat');a.href=x.inat||'#';a.style.display=x.inat?'inline-block':'none';document.getElementById('sheetBg').classList.add('open');document.body.style.overflow='hidden';window.FarmNotes?.openSpecies({taxonKey:String(x.scientific).toLowerCase().replace(/[^a-z0-9]+/g,'-'),scientific:x.scientific,common:x.common})}
function closeSheet(){document.getElementById('sheetBg').classList.remove('open');document.body.style.overflow=''}

gbar.onclick=e=>{if(!e.target.dataset.g)return;group=e.target.dataset.g;[...gbar.children].forEach(x=>x.classList.toggle('active',x===e.target));render()};
document.getElementById('special').onclick=e=>{const button=e.target.closest('[data-f]');if(!button)return;filter=button.dataset.f;[...e.currentTarget.children].forEach(x=>x.classList.toggle('active',x===button));render()};
document.getElementById('seasons').onclick=e=>{const button=e.target.closest('[data-season]');if(!button)return;season=button.dataset.season;[...e.currentTarget.children].forEach(x=>x.classList.toggle('active',x===button));render()};
q.oninput=render;
document.getElementById('close').onclick=closeSheet;
document.getElementById('sheetBg').onclick=e=>{if(e.target===e.currentTarget)closeSheet()};
document.getElementById('syncBtn').onclick=()=>sync();

const cached=readCache();
if(cached){DATA=aggregate(cached);const stamp=localStorage.getItem(SYNC_KEY);setSyncState('Saved iNaturalist data',stamp?`Last synced ${new Intl.DateTimeFormat('en-ZA',{dateStyle:'medium',timeStyle:'short'}).format(new Date(stamp))}`:'Saved farm observations loaded')}
rebuildControls();updateStats();render();
if('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js?v=19',{updateViaCache:'none'}).then(reg=>reg.update()).catch(()=>{}));
window.addEventListener('load',()=>sync({quiet:true}));

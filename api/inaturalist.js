const INAT_API = 'https://api.inaturalist.org/v1/observations';
const INAT_USER = 'mattbleu';
const FARM_POLYGON = [
  [19.1335, -33.8950], [19.1380, -33.8950],
  [19.1380, -33.8870], [19.1335, -33.8870]
];

function pointInPolygon(lon, lat) {
  let inside = false;
  for (let i = 0, j = FARM_POLYGON.length - 1; i < FARM_POLYGON.length; j = i++) {
    const [xi, yi] = FARM_POLYGON[i], [xj, yj] = FARM_POLYGON[j];
    const crosses = ((yi > lat) !== (yj > lat)) &&
      (lon < (xj - xi) * (lat - yi) / ((yj - yi) || Number.EPSILON) + xi);
    if (crosses) inside = !inside;
  }
  return inside;
}

const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

function compactObservation(observation) {
  const currentIdentification = (observation.identifications || []).find(item => item.current && item.taxon);
  const ancestors = currentIdentification?.taxon?.ancestors || [];
  const family = ancestors.find(item => item.rank === 'family')?.name || '';
  return {
    id: observation.id,
    observed_on: observation.observed_on,
    quality_grade: observation.quality_grade,
    species_guess: observation.species_guess,
    uri: observation.uri,
    _family: family,
    taxon: observation.taxon ? {
      id: observation.taxon.id,
      name: observation.taxon.name,
      preferred_common_name: observation.taxon.preferred_common_name,
      rank: observation.taxon.rank,
      iconic_taxon_name: observation.taxon.iconic_taxon_name
    } : null,
    photos: observation.photos?.[0] ? [{url:observation.photos[0].url}] : []
  };
}

export default async function handler(request, response) {
  if (request.method !== 'GET') return response.status(405).json({error:'Method not allowed'});
  try {
    let page = 1, all = [], total = Infinity;
    while (all.length < total && page <= 50) {
      const url = new URL(INAT_API);
      url.search = new URLSearchParams({user_id:INAT_USER, per_page:'200', page:String(page), order_by:'id', order:'asc'});
      const upstream = await fetch(url, {headers:{Accept:'application/json','User-Agent':'Le-Sanctuaire-Biodiversity/1.0'}});
      if (!upstream.ok) throw new Error(`iNaturalist returned ${upstream.status}`);
      const payload = await upstream.json();
      total = payload.total_results || 0;
      all.push(...(payload.results || []));
      page += 1;
      if (all.length < total) await pause(1100);
    }
    const results = all.filter(observation => {
      const coordinates = observation.geojson?.coordinates;
      return coordinates && pointInPolygon(Number(coordinates[0]), Number(coordinates[1]));
    }).map(compactObservation);
    response.setHeader('Cache-Control','public, s-maxage=60, stale-while-revalidate=300');
    return response.status(200).json({results, fetchedAt:new Date().toISOString(), boundary:'cluster-2026-08'});
  } catch (error) {
    return response.status(502).json({error:error.message || 'Unable to reach iNaturalist'});
  }
}

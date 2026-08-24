/* Scientific-name stories are deliberately separate from observation data.
   Reviewed Greek and Latin roots become practical field memory clues while
   confidence and source information remain visible. */

const ETYMOLOGY_SOURCES = {
  kew: 'https://powo.science.kew.org/',
  latin: 'https://www.biodiversitylibrary.org/item/104617',
};

const GENUS_ETYMOLOGY = {
  Acacia: 'From Greek akakia, an ancient name for a thorny tree; ultimately linked with ake, “point” or “thorn”.',
  Adenandra: 'From Greek aden, “gland”, and aner/andros, “male”, referring to glandular stamens.',
  Agapanthus: 'From Greek agape, “love”, and anthos, “flower”: “love-flower”.',
  Agathosma: 'From Greek agathos, “good”, and osme, “smell”, referring to the aromatic foliage.',
  Aristea: 'From Latin arista, “awn” or “bristle”, referring to pointed or bristle-like parts.',
  Asparagus: 'From the ancient Greek name asparagos; the word long predates modern botanical naming.',
  Athanasia: 'From Greek athanasia, “immortality”, probably referring to the persistent, everlasting flower heads.',
  Berkheya: 'Named for the Dutch botanist and physician Johannes le Francq van Berkhey.',
  Berzelia: 'Named in honour of the Swedish chemist Jöns Jacob Berzelius.',
  Buddleja: 'Named for the English botanist and cleric Adam Buddle.',
  Calodendrum: 'From Greek kalos, “beautiful”, and dendron, “tree”: “beautiful tree”.',
  Citrus: 'The classical Latin name for citron and related citrus trees.',
  Cliffortia: 'Named for George Clifford III, an eighteenth-century Dutch patron of botany.',
  Clutia: 'Named for Carolus Clusius (Charles de l’Écluse), the pioneering Flemish botanist.',
  Combretum: 'From an ancient Latin plant name used by Pliny; its original reference is uncertain.',
  Crassula: 'Diminutive of Latin crassus, “thick”, referring to the characteristically fleshy leaves.',
  Cussonia: 'Named for the French botanist Pierre Cusson.',
  Cyphia: 'From Greek kyphos, “bent” or “humped”, referring to the curved flower form.',
  Diospyros: 'From Greek dios, “divine”, and pyros, “fruit” or “grain”: often rendered “fruit of the gods”.',
  Drosera: 'From Greek droseros, “dewy”, describing the glistening sticky glands.',
  Erepsia: 'From Greek erepsis, “covering” or “roofing”; the precise botanical allusion is uncertain.',
  Erica: 'From the ancient Greek ereike, a name for heath; sometimes linked with ereikein, “to break”.',
  Euryops: 'From Greek eurys, “large”, and ops, “eye” or “appearance”, referring to the conspicuous daisy “eye”.',
  Ficus: 'The classical Latin name for the fig tree.',
  Fumaria: 'From Latin fumus, “smoke”, traditionally linked to the plant’s smoky colour or eye-irritating sap.',
  Haemanthus: 'From Greek haima, “blood”, and anthos, “flower”: “blood-flower”.',
  Hakea: 'Named for Baron Christian Ludwig von Hake, an eighteenth-century German patron of botany.',
  Helichrysum: 'From Greek helios, “sun”, and chrysos, “gold”: “golden sun”, for the bright everlasting heads.',
  Heliophila: 'From Greek helios, “sun”, and philos, “loving”: “sun-loving”.',
  Heliothis: 'From Greek helios, “sun”, with a name referring to the moths’ association with flowers or daylight.',
  Hemimeris: 'From Greek hemi, “half”, and meris, “part”, referring to unequal or partially divided floral parts.',
  Kiggelaria: 'Named for Franz Kiggelaer, a seventeenth-century Dutch botanist and apothecary.',
  Lachenalia: 'Named for the Swiss botanist Werner de Lachenal.',
  Leucadendron: 'From Greek leukos, “white”, and dendron, “tree”, based on the pale-leaved Silver Tree.',
  Lotononis: 'A Greek-derived name based on lotos; the exact intended allusion is uncertain.',
  Maytenus: 'Derived from mayten, a South American vernacular name adopted into botanical Latin.',
  Metalasia: 'From Greek meta, “with/among”, and lasios, “woolly” or “hairy”, referring to the woolly flower heads.',
  Montinia: 'Named in honour of the Swedish physician and botanist Lars Montin.',
  Moraea: 'Named for the English botanist Robert More (Morus), a contemporary of Linnaeus.',
  Muraltia: 'Named for the Swiss botanist and physician Johannes von Muralt.',
  Myrsine: 'From the ancient Greek myrsine, “myrtle”, for the myrtle-like foliage.',
  Osteospermum: 'From Greek osteon, “bone”, and sperma, “seed”, referring to the hard fruits.',
  Oxalis: 'From Greek oxys, “sharp” or “sour”, for the acidic taste of the leaves.',
  Passerina: 'From Latin passer, “sparrow”; the small flowers or fruits were thought sparrow-like.',
  Pelargonium: 'From Greek pelargos, “stork”, referring to the long beak-like fruit.',
  Phylica: 'From Greek phyllikos, “leafy”, referring to the close-set foliage.',
  Podalyria: 'Named for Podalirius, a healer in Greek mythology.',
  Polyarrhena: 'From Greek polys, “many”, and arrhen, “male”, referring to numerous stamens.',
  Protea: 'Named for Proteus, the shape-changing Greek god; Linnaeus used it to evoke the genus’s diversity of forms.',
  Prunus: 'The classical Latin name for plum and related stone-fruit trees.',
  Pseudognaphalium: 'From Greek pseudes, “false”, plus Gnaphalium: “false cudweed”.',
  Pseudoselago: 'From Greek pseudes, “false”, plus Selago: “false Selago”.',
  Psoralea: 'From Greek psoraleos, “scabby” or “rough”, referring to gland-dotted or rough-looking surfaces.',
  Quercus: 'The classical Latin name for an oak.',
  Salvia: 'From Latin salvus, “safe” or “healed”, reflecting the traditional medicinal reputation of sages.',
  Searsia: 'Named for the American botanist Paul B. Sears.',
  Senecio: 'From Latin senex, “old man”, referring to the white-haired seed heads.',
  Seriphium: 'From an ancient Greek plant name; the original application is uncertain.',
  Struthiola: 'Diminutive of Greek strouthion, a name associated with small shrubby plants; exact allusion uncertain.',
  Syncarpha: 'From Greek syn, “together”, and karphos, “chaff”, referring to the joined or clustered papery bracts.',
  Thesium: 'An ancient Greek plant name adopted by Linnaeus; its original meaning is uncertain.',
  Tritoniopsis: 'From Tritonia plus Greek opsis, “resembling”: “looking like Tritonia”.',
  Verbena: 'The classical Latin name for sacred leafy twigs used in ritual.',
};

const EPITHET_ETYMOLOGY = {
  longifolia: '“long-leaved” (longus, long + folium, leaf)', mearnsii: 'honours collector Edgar Alexander Mearns',
  marginata: '“margined”, referring to a distinct leaf edge', praecox: '“early” or “precocious”, usually referring to early flowering',
  crenulata: '“finely scalloped”, referring to small rounded teeth on the leaf margin', spiralis: '“spiral” or “coiled”',
  lignosus: '“woody”', rubicundus: '“reddish” or “ruddy”', trifurcata: '“three-forked”', armata: '“armed”, usually with spines',
  lanuginosa: '“woolly”, covered with soft wool-like hairs', saligna: '“willow-like”', capense: '“of the Cape”',
  polygonifolia: '“Polygonum-leaved”, with leaves resembling those of knotweeds', alaternoides: '“resembling Alaternus”',
  erythrophyllum: '“red-leaved”', capensis: '“of the Cape”', spicata: '“spike-bearing”', bulbosa: '“bulbous”',
  glabra: '“smooth” or “hairless”', cistiflora: '“Cistus-flowered”, with flowers resembling a rockrose',
  trinervia: '“three-nerved”, referring to three prominent veins', anceps: '“two-edged” or “two-sided”',
  grandiflora: '“large-flowered”', hispidula: '“slightly bristly”', lucida: '“shining” or “bright”',
  plukenetii: 'honours the English botanist Leonard Plukenet', quadrangularis: '“four-angled”', taxifolia: '“yew-leaved”',
  abrotanifolius: '“southernwood-leaved”', burkei: 'honours the collector Joseph Burke', muralis: '“of walls”',
  coccineus: '“scarlet”', sanguineus: '“blood-red”', sericea: '“silky”', petiolare: '“with conspicuous petioles”',
  scoparia: '“broom-like”', scutuligera: '“bearing a small shield”', racemosa: '“with flowers in racemes”',
  africana: '“African”', orchioides: '“orchid-like”', rubrum: '“red”', salignum: '“willow-like”',
  involucrata: '“provided with an involucre”, a ring of bracts around the flowers', oleoides: '“olive-like”',
  densa: '“dense” or “crowded”', dregeana: 'honours the German plant collector Johann Franz Drège',
  caryophyllacea: '“clove- or carnation-like”', ochroleuca: '“yellowish-white” or “pale yellow”',
  heisteria: 'honours the German botanist Lorenz Heister', moniliferum: '“necklace-bearing”, referring to bead-like structures',
  commutata: '“changed” or “variable”', lanata: '“woolly”', purpurea: '“purple”', corymbosa: '“corymb-bearing”',
  candicans: '“becoming white” or “whitish”, often from pale hairs', cucullatum: '“hooded”',
  longicaule: '“long-stemmed”', myrrhifolium: '“myrrh-leaved”', coriandrifolium: '“coriander-leaved”',
  tabulare: '“of Table Mountain” or “table-like”', imberbis: '“beardless”, lacking hairs or bristles',
  calyptrata: '“hooded” or “cap-bearing”', reflexa: '“bent backwards”', laurifolia: '“laurel-leaved”',
  nitida: '“shining” or “glossy”', repens: '“creeping”', serotina: '“late”, usually late-flowering or late-ripening',
  undulatum: '“wavy”, commonly referring to leaf margins', serrata: '“saw-toothed”', spuria: '“false” or “spurious”',
  usitata: '“much-used” or “customary”', robur: '“strength”; also the classical name for a robust oak',
  chamelaeagnea: '“resembling Chamaelea”, an older plant name', angustifolia: '“narrow-leaved”',
  tomentosa: '“densely woolly-haired”', burchellii: 'honours the explorer and naturalist William John Burchell',
  cinereum: '“ash-grey”', plumosum: '“feathery”', myrsinites: '“myrtle-like”', canescens: '“becoming grey/white”, from fine hairs',
  scabrum: '“rough”', lata: '“broad”', triticea: '“wheat-like”', bonariensis: '“from Buenos Aires”',
  grandiflora_grandiflora: '“large-flowered”; the repeated subspecies name is the typical subspecies',
};

const ETYMOLOGY_OVERRIDES = {
  'Protea nitida': {combined:'“The shining protea.”',common:'Wagon tree / waboom recalls the historical use of its wood for wagon wheels and brake blocks.',clue:'Look for the pale, glossy blue-green leaves catching the light from a distance; that shine points to nitida.',confidence:'High — species-specific SANBI account',source:'https://pza.sanbi.org/protea-nitida'},
  'Lachenalia orchioides': {combined:'“Lachenal’s orchid-like plant.”',common:'Wild viooltjie is an old Cape name for Lachenalia; it is neither a true violet nor an orchid.',clue:'Remember the apparent contradiction: a “viooltjie” whose epithet says orchid-like; inspect its tubular bulb-flower structure.',confidence:'High for the word roots; visual reference is interpretive',source:'https://powo.science.kew.org/results?q=Lachenalia%20orchioides'},
  'Pelargonium cucullatum': {common:'Wild mallow refers to its mallow-like appearance, while storksbill names in the genus point to the beaked fruit.',clue:'Cucullatum means hooded: look for the hooded or cupped leaf shape, then remember the stork-bill fruit of Pelargonium.'},
  'Leucadendron rubrum': {combined:'“The red white-tree” — Leucadendron is the genus name; rubrum supplies the useful red clue.',common:'Spinning-top conebush refers to the shape of the female cone or fruiting head.',clue:'Use the red involucral leaves or bracts and spinning-top cone as the two quick memory anchors.'},
  'Drosera cistiflora': {common:'Poppy-flowered sundew captures the broad, showy, poppy-like flower; “sundew” describes the sparkling sticky glands.',clue:'Cisti-flora = rockrose-flowered: remember the surprisingly large flower above a dewy insect-trapping plant.'},
};

function etymologyCommonConnection(common, genus, epithetMeaning) {
  if (!common || common.toLowerCase() === genus.toLowerCase()) return 'No reliable common-name connection recorded yet.';
  const value=common.toLowerCase();
  if(value.includes('sundew')) return '“Sundew” describes the sparkling, dew-like sticky glands used to trap insects.';
  if(value.includes('storksbill')) return '“Storksbill” mirrors Pelargonium: both refer to the long, beak-like fruit.';
  if(value.includes('bloodlily')) return '“Bloodlily” directly echoes Haemanthus (“blood-flower”), especially the red-flowered species.';
  if(value.includes('heath')) return 'The common name places it among the Cape heaths (Erica); the epithet provides the finer identification clue.';
  if(value.includes('conebush')) return '“Conebush” points to the conspicuous cone-like female flower and seed heads of Leucadendron.';
  if(value.includes('woolly')||value.includes('velvet')||value.includes('hairy')) return 'The common name highlights hairiness or a soft texture that can be checked in the field.';
  if(value.includes('rough')) return 'The common name reinforces a rough-textured feature, matching the descriptive scientific epithet where applicable.';
  if(value.includes('cape')) return '“Cape” reflects its regional association; use the epithet for the more specific visual clue.';
  return epithetMeaning ? `The common name “${common}” may supply an additional field clue, but its historical derivation still needs a species-specific source.` : 'Common-name origin still needs a species-specific source.';
}

function etymologyFieldClue(scientific, common, epithet, meaning) {
  const value=(meaning||'').toLowerCase();
  if(value.includes('leaf')||value.includes('leaved')) return `Check the leaves first: ${epithet} encodes a leaf-shape or leaf-texture clue.`;
  if(value.includes('flower')) return `Check the flower: ${epithet} records a flower colour, size, arrangement or resemblance.`;
  if(value.includes('woolly')||value.includes('hair')||value.includes('brist')) return `Touch or inspect the surface closely: ${epithet} points to hairs, woolliness or bristles.`;
  if(value.includes('red')||value.includes('purple')||value.includes('scarlet')||value.includes('yellow')||value.includes('white')||value.includes('grey')) return `Use the colour word in ${epithet} as the first visual memory anchor, while allowing for season and plant age.`;
  if(value.includes('honours')||value.includes('named')) return `${epithet} commemorates a person rather than describing the plant; pair the name with the common name “${common || scientific}” and one visible feature from the card.`;
  if(value.includes('cape')||value.includes('afric')||value.includes('buenos aires')||value.includes('table mountain')) return `${epithet} is a place clue, not necessarily an identifying feature; remember the geography together with the plant’s visible field marks.`;
  if(!meaning) return 'Name derivation is not yet secure enough for a field mnemonic; use the visible features elsewhere in the card.';
  return `Let “${epithet}” cue “${meaning.replace(/^“|”$/g,'')}”; confirm which visible structure the original author intended.`;
}

function etymologyFor(scientific, common) {
  const parts=String(scientific||'').split(/\s+/), genus=parts[0], epithet=parts[1]||'';
  if(parts.length<2 || ['Plantae','Magnoliopsida','Fabaceae','Gnaphaliinae'].includes(scientific)) return {
    genus:GENUS_ETYMOLOGY[genus]||'This is a broad taxonomic group rather than a species-level binomial.',
    epithet:'Not applicable at the current identification rank.', combined:'A species-level name is needed before a two-part name story can be made.',
    common:'The common group name is useful, but does not identify a species.', clue:'Refine the identification first; the specific epithet will usually supply the strongest memory clue.',
    confidence:'Broad identification', source:ETYMOLOGY_SOURCES.kew,
  };
  let epithetKey=epithet;
  if(parts.length>2 && parts[2]===epithet) epithetKey=epithet+'_'+parts[2];
  const genusMeaning=GENUS_ETYMOLOGY[genus]||'Genus derivation requires further checking.';
  const epithetMeaning=EPITHET_ETYMOLOGY[epithetKey]||EPITHET_ETYMOLOGY[epithet]||'Specific epithet derivation requires further checking.';
  const descriptive=!/requires further|uncertain|honours|named/i.test(epithetMeaning);
  const base={genus:genusMeaning,epithet:epithetMeaning,
    combined:descriptive?`${genus} + ${epithet}: combine the genus story with the epithet meaning — ${epithetMeaning}.`:`${genus} + ${epithet}: the genus story plus a commemorative or still-unresolved epithet.`,
    common:etymologyCommonConnection(common,genus,epithetMeaning),clue:etymologyFieldClue(scientific,common,epithet,epithetMeaning),
    confidence:(GENUS_ETYMOLOGY[genus]&&(EPITHET_ETYMOLOGY[epithetKey]||EPITHET_ETYMOLOGY[epithet]))?'Working draft — standard botanical roots; verify species-specific allusion':'Needs further research',source:ETYMOLOGY_SOURCES.latin};
  return {...base,...(ETYMOLOGY_OVERRIDES[scientific]||{})};
}

globalThis.ETYMOLOGY_ENRICHMENT={etymologyFor,ETYMOLOGY_SOURCES};

LE SANCTUAIRE BIODIVERSITY — LIVE INATURALIST VERSION

This package preserves the existing 80-taxa guide and adds:
- Le Sanctuaire mountain logo
- Mont Bleu colour palette
- iPhone Home Screen icon
- Updated offline cache
- Live public iNaturalist sync for mattbleu
- Curated enrichment stored separately from observation data
- Replaceable conservative farm-boundary polygon
- Automatic and manual sync with last-synced status

DEPLOYMENT WORKFLOW

The main branch is connected to the existing Vercel project. Updates committed
to main are deployed automatically; manual ZIP uploads are no longer required.

The temporary farm polygon is defined as FARM_BOUNDARY in app.js. It can be
replaced with an exact surveyed boundary without changing the sync logic.

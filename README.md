# Le Sanctuaire Biodiversity

A mobile-first PWA for the species observed at Le Sanctuaire. Public observations sync from iNaturalist user `mattbleu`; curated ecological knowledge and private farm notes are deliberately separate layers.

## What this version does

- Sorts species by their latest observation date (newest first), including after search/filtering.
- Preserves live iNaturalist sync, its offline observation cache, the farm polygon, styling, icons, and Vercel API.
- Reads curated ecological fields from `ecology-enrichment.js`; syncing never changes that file.
- Adds owner-only Farm Notes with add, edit, and delete on mobile.
- Keeps the field guide and iNaturalist sync working when Firebase is unconfigured, offline, or unavailable.

## One-time Firebase setup for Farm Notes

The app works without these steps. Until configured, cards display a short setup message in the Farm Notes area.

1. Go to Firebase Console and create a project (for example `le-sanctuaire-biodiversity`). Google Analytics is optional.
2. Open **Build → Firestore Database → Create database**. Choose a nearby region and start in production mode.
3. Open **Build → Authentication → Get started → Sign-in method** and enable **Email/Password**.
4. Under **Authentication → Users**, add the single owner account you will use on the phone. Copy its **User UID**.
5. Open **Project settings → General → Your apps**, add a Web app, and copy the displayed Firebase configuration.
6. Replace the `null` in `firebase-config.js` with that configuration. `firebase-config.example.js` shows the exact shape. Firebase web config is not a password; access is protected by Authentication and Firestore rules.
7. In `firestore.rules`, replace `PASTE_YOUR_FIREBASE_USER_UID` with the UID copied in step 4.
8. Open **Firestore Database → Rules**, paste the completed `firestore.rules`, and publish it.
9. Commit and deploy. Open a species, sign in under **Farm Notes**, and add a test note.

Do not commit the owner’s password. The app never stores it; Firebase Authentication manages the session.

## Firestore structure

Notes use one top-level collection, `farmNotes`, with an automatically generated document ID:

```text
farmNotes/{noteId}
  taxonKey: "lachenalia-orchioides"
  scientificName: "Lachenalia orchioides"
  commonName: "Wild Viooltjie"
  date: "2026-08-19"
  text: "Observed a bee entering several flowers."
  location: "Upper south-facing seep"
  tags: ["pollinator", "location"]
  ownerUid: "firebase-auth-uid"
  createdAt: server timestamp
  updatedAt: server timestamp
```

The supplied rules allow all note reads and writes only to the one authenticated UID. This is appropriate for a private single-owner app. Keep the fallback deny-by-default behavior: do not add a broad public rule such as `allow read, write: if true`.

If ownership later expands, use a custom-claims or membership-document design rather than adding more UIDs directly throughout the app.

## Ecological enrichment model

`ecology-enrichment.js` is keyed by scientific name and may contain any of:

```js
{
  pollinator, pollinationStrategy,
  regeneration, propagationStrategy,
  seedDispersal, dispersal,
  fireResponse,
  animalInteractions,
  ecosystemRole, soilRelationships,
  phenology, flowering,
  habitat,
  origin, endemism, status, statusSource,
  rangeRarity, rangeRestricted, rarityNote, raritySource,
  etymology, interestingFact
}
```

`status` is reserved for the SANBI conservation codes `LC`, `NT`, `VU`,
`EN`, `CR` and `EW`. Range rarity is deliberately separate: set
`rangeRarity: "rare"` (or `rangeRestricted: true`) only when an authoritative
source describes the taxon as localized or range-restricted, then include a
plain-language `rarityNote` and `raritySource`. A single farm observation is
not evidence of global or regional rarity.

Missing fields are hidden. Add claims only when supported by a reliable source. The older `enrichment-data.js` continues to provide the existing names, grouping, conservation fields, and general facts. The app merges the two curated files at display time, separately from observation data.

## GitHub and Vercel deployment

1. Copy the changed files into the existing GitHub repository (or commit this entire folder).
2. Review `firebase-config.js` and `firestore.rules` before committing.
3. Commit and push to the `main` branch.
4. The already-connected Vercel project should deploy automatically. No build command is required.
5. In Vercel, confirm the deployment contains `/api/inaturalist`, then test **Sync iNaturalist**.
6. On the live site, open a card and test Farm Notes sign-in, add, edit, and delete.
7. If an installed iPhone Home Screen copy looks stale, close/reopen it once; service-worker cache version `v11` replaces the previous shell.

The Firebase config can alternatively be generated during deployment, but this no-build repository intentionally uses the clear `firebase-config.js` approach. Do not place secrets in that file.

## Data separation

- `api/inaturalist.js`, browser cache, and `fallback-data.js`: observation layer.
- `enrichment-data.js` and `ecology-enrichment.js`: curated reference layer.
- Firestore `farmNotes`: private farm-specific knowledge.

An iNaturalist refresh can update dates, photos, counts, and identification quality without overwriting either curated enrichment or Farm Notes.

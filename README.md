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

## Master enrichment model

`le-sanctuaire-taxa-enrichment-master.xlsx` is the editable source of truth for curated taxon knowledge. It contains one `Taxa Enrichment` table with one row per live taxon. The table keeps raw research notes and source URLs separate from the concise `Card ...` and `App ...` fields that are allowed onto the live cards.

The normal update cycle is:

1. Add detailed evidence and source URLs to the relevant row.
2. Set `Refresh status` to `Needs summary refresh`.
3. Ask Codex to refresh the Fybos taxa cards from the master workbook.
4. Codex preserves the detailed evidence, synthesizes the card fields, resets the row to `Live summary`, regenerates `taxa-enrichment-master.js`, validates the site, and publishes it.

`taxa-enrichment-master.js` is the generated web snapshot and is the only curated enrichment file loaded by the app. It includes identity, card summaries, conservation display fields, ecological relationships, PlantZAfrica profiles, scientific-name stories and field memory clues. The older enrichment JavaScript files remain only as lineage for the first consolidation and are not active inputs at runtime.

`status` is reserved for SANBI conservation display values. Range rarity remains a separate measure and is published only when supported by authoritative evidence. A single farm observation is not evidence of global or regional rarity. Traditional-use notes are historical context, not medical advice.

## GitHub and Vercel deployment

1. Copy the changed files into the existing GitHub repository (or commit this entire folder).
2. Review `firebase-config.js` and `firestore.rules` before committing.
3. Commit and push to the `main` branch.
4. The already-connected Vercel project should deploy automatically. No build command is required.
5. In Vercel, confirm the deployment contains `/api/inaturalist`, then test **Sync iNaturalist**.
6. On the live site, open a card and test Farm Notes sign-in, add, edit, and delete.
7. If an installed iPhone Home Screen copy looks stale, close/reopen it once; service-worker cache version `v18` replaces the previous shell.

The Firebase config can alternatively be generated during deployment, but this no-build repository intentionally uses the clear `firebase-config.js` approach. Do not place secrets in that file.

## Data separation

- `api/inaturalist.js`, browser cache, and `fallback-data.js`: observation layer.
- `le-sanctuaire-taxa-enrichment-master.xlsx`: editable curated knowledge source.
- `taxa-enrichment-master.js`: generated live card-summary snapshot.
- Firestore `farmNotes`: private farm-specific knowledge.

An iNaturalist refresh can update dates, photos, counts, and identification quality without overwriting either curated enrichment or Farm Notes.

# Smart Copy

Smart Copy is a focused, installable web app for saving, finding, and copying reusable text. This version modernizes the original 2019 client while keeping the existing smartcopy-195fd Firebase project, accounts, items and users collections, and legacy profile images.

## Requirements

- Node 24.21 LTS
- npm 11 or newer
- Java 21 or newer for the Firebase Emulator Suite

## Local Development

    npm ci
    npm run dev

The checked-in client defaults identify the existing public Firebase web app. To override them, copy .env.example to .env.local. These values are not server credentials; access is enforced by the versioned Firebase rules.

Set VITE_USE_FIREBASE_EMULATORS=true to connect a development build to the local Auth, Firestore, and Storage emulators.

## Quality Checks

    npm run format:check
    npm run lint
    npm test
    npm run test:emulator
    npm run build
    npm audit --omit=dev --audit-level=high

The emulator suite verifies owner-only Firestore and Storage access against canonical and legacy-shaped documents. Google and Facebook authentication must be smoke-tested on a Firebase Hosting preview channel because their callback and popup behavior depends on real provider configuration.

## Firebase Deployment

    npm run deploy:preview
    npm run deploy

Firestore and Storage rules are intentionally deployed separately:

    npx firebase deploy --only firestore:rules,firestore:indexes --project smartcopy-195fd
    npx firebase deploy --only storage --project smartcopy-195fd

The Storage deployment requires the legacy smartcopy-195fd.appspot.com bucket to be active. New uploads use profile pictures/<uid>/...; existing flat profile-image URLs remain readable.

## Data Compatibility

- Snippets remain in items, with missing legacy isStarred values read as false.
- Existing timestamp shapes remain readable; all new writes use server timestamps.
- Profiles remain in users; profilePicture is read as a fallback while new uploads write avatarUrl.
- No bulk migration is required, and schema changes are additive.

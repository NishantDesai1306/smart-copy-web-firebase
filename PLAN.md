# Smart Copy Modernization and UI Upgrade

## Summary

Modernize the 2019 application as one coordinated migration while preserving the existing `smartcopy-195fd` Firebase project, accounts, providers, documents, and files. The finished application will use a current React/Vite/Firebase stack, remove obsolete wrappers and duplicate styling systems, retain PWA support, and replace the dated UI with a responsive, accessible snippet-focused experience.

## Platform and Dependency Changes

- Standardize on Node 24 LTS and npm; remove `yarn.lock`, regenerate a current `package-lock.json`, pin direct dependencies, and add automated dependency updates.
- Replace Create React App with Vite 8.3 and `@vitejs/plugin-react` 6.1. Use a temporary React 18.3 validation step to expose deprecations, then finish on React/React DOM 19.3, following the [React upgrade guidance](https://react.dev/blog/2024/04/25/react-19-upgrade-guide) and [Vite 8 requirements](https://vite.dev/blog/announcing-vite8).
- Upgrade to Firebase 12.19 modular APIs, React Router 8.3, Material UI 9.4 with matching icons and Emotion, Formik 2.4.9, Yup 1.7.1, and Notistack 3.0.2. Rewrite call sites directly instead of carrying Firebase compatibility packages because the application is small. Follow the official [Firebase modular migration](https://firebase.google.com/docs/web/modular-upgrade), [MUI v9 migration](https://mui.com/material-ui/migration/upgrade-to-v9/), and [React Router v8 migration](https://reactrouter.com/upgrading/v7).
- Remove `react-scripts`, both Material UI v3 packages, Redux and its middleware/forms/Firebase wrappers, `redux-auth-wrapper`, `recompose`, `history`, `react-router-dom`, `react-swipeable-views`, `react-copy-to-clipboard`, `random-material-color`, `query-string`, `react-form`, PropTypes, Babel ESLint, and stale TypeScript typings.
- Keep JavaScript/JSX for this migration. Use ESLint 9.39.5 rather than ESLint 10 because the current stable React and accessibility plugins do not yet declare ESLint 10 compatibility; add Prettier 3.9.6.
- Add Vitest 5, React Testing Library 16, Playwright 1.63, axe accessibility checks, Firebase Tools 15.30, and `vite-plugin-pwa` 1.3.

## Application, Data, and UI Implementation

- Replace classes, HOCs, Redux state, and polling notifications with function components, hooks, an `AuthProvider`, local UI state, direct Firestore subscriptions, and Notistack events.
- Preserve all routes: `/`, `/login`, `/signup`, `/forgot-password`, `/dashboard`, and `/dashboard/profile?tab=…`. Implement hook-based authenticated/public route guards and a not-found route.
- Preserve `items` and `users` collections without bulk migration:
  - Normalize snippets as `{ id, owner, content, isStarred, createdAt, updatedAt }`; missing legacy stars become `false`, legacy timestamps remain readable, and new writes use server timestamps.
  - Normalize profiles as `{ email, username, avatarUrl? }`; read legacy `profilePicture` as a fallback and write the canonical `avatarUrl` field on future uploads.
  - Keep existing Storage files readable; place new uploads under a UID-scoped path to prevent username collisions.
- Preserve email/password, Google, and Facebook authentication, password reset, account linking, and provider-specific reauthentication. Remove the deprecated global Google/Facebook scripts and use Firebase’s modular popup APIs with redirect fallback. The old Google platform library is officially [deprecated](https://developers.google.com/identity/gsi/web/guides/migration).
- Register a Web app inside the existing Firebase project, which currently has only an Android app registration, and expose its public client configuration through documented `VITE_FIREBASE_*` variables. No credentials or Firebase data are replaced.
- Redesign the product around its actual job: quickly finding and copying reusable text.
  - Rename “Items” to “Snippets”; use clear actions such as “New snippet,” “Copy,” “Edit,” “Delete,” “All,” and “Favorites.”
  - Give every snippet an explicit Copy button, favorite control, and overflow menu; remove the surprising whole-row copy behavior.
  - Keep search visible on mobile, add useful loading/error/empty states, restore keyboard focus indicators, and provide accessible labels and 44px-or-larger touch targets.
  - Use a cool paper-and-ink palette (`#F6F8FC`, `#FFFFFF`, `#101828`, `#2457FF`, `#00A6A6`, `#F7B32B`), Manrope for interface text, and Roboto Mono only for compact metadata. The signature element is a restrained layered “snippet slip” card with a persistent copy rail.
  - Replace the Flutter/Firebase-branded icon with a platform-neutral, code-native clipboard/snippet SVG and generate current regular and maskable PWA icon sizes.
- Remove Bootstrap, Font Awesome, Google Material Icons, and font CDN dependencies. Implement layout, tokens, responsive behavior, and icons entirely through MUI and bundled assets.
- Replace the hand-written Workbox 4 worker with `vite-plugin-pwa`: precache the application shell, avoid caching Firebase/Auth traffic, retain an offline fallback, clean obsolete caches, and show a non-blocking update snackbar instead of browser `confirm()` prompts. Point Firebase Hosting at `dist`.

## Test and Acceptance Plan

- Unit-test Firebase data normalization, legacy profile compatibility, auth error mapping, form validation, search/filtering, timestamp handling, and clipboard failure/success behavior.
- Component-test route guards, loading/error/empty states, dialogs, snippet controls, responsive search, profile editing, and keyboard navigation.
- Use Firebase Emulator Suite integration tests for user/profile creation, ownership-scoped Firestore CRUD, UID-scoped uploads, password changes, and legacy-shaped documents.
- Add Playwright flows for sign-up/login, create, search, copy, favorite, edit, delete, profile update, password reset, session restoration, unauthorized redirects, and PWA update behavior. Google and Facebook receive manual preview-channel smoke tests because they depend on real provider configuration.
- Verify at 360px, 768px, and 1440px widths; keyboard-only use; 200% zoom; reduced motion; visible focus; and axe checks with no serious violations.
- CI must pass `npm ci`, formatting check, lint, unit/integration tests, production build, Playwright smoke tests, and `npm audit --omit=dev` with no high or critical findings. The production build must have no console errors or missing assets.

## Rollout and Assumptions

- Capture the current Firebase configuration, rules, indexes, and representative legacy document shapes before coding; version equivalent rules locally and test ownership constraints without changing access semantics.
- Deploy first to a Firebase Hosting preview channel, verify authorized domains and Google/Facebook callback settings, test existing accounts and old data, then deploy production.
- Keep the previous Hosting release available for immediate rollback. All schema changes are additive, so rolling back the client will not require reversing data.
- PWA capability and all existing user-facing features remain in scope; new collaboration, sharing, folders, and content-generation features are out of scope.
- “Latest” means the newest stable, mutually compatible versions verified at implementation time, with the explicit ESLint 9 compatibility exception above.

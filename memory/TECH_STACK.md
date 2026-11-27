# Tech Stack & Conventions
Owner: tech-lead. Fill in actual pinned versions at project start.

## Versions
- React: latest (19.x) · TypeScript: latest (strict) · Vite: latest · Tailwind CSS: latest (4.x)
- Firebase Web SDK: latest (modular `firebase/auth`, `firebase/firestore`) · Firebase CLI: latest
- Auth: Firebase Authentication (Facebook OAuth provider) · Hosting: Firebase Hosting · DB: Cloud Firestore
- Testing: Playwright (latest) · Vitest · React Testing Library · `@firebase/rules-unit-testing` · Node: LTS

## Repo structure
```
src/
  api/              # typed Firestore repositories, converters, & Firebase helpers
  components/ui/    # shared design-system primitives
  features/         # feature modules (auth, etc.)
  pages/            # route pages
  hooks/            # custom React hooks (useAuth, etc.)
  lib/              # firebase.ts init, env validation, utilities
tests/
  rules/            # Firestore security rules tests (@firebase/rules-unit-testing)
e2e/                # Playwright E2E specs & fixtures
firestore.rules
firestore.indexes.json
firebase.json
.firebaserc
```

## Commands
- Emulators: `firebase emulators:start` (Auth, Firestore, Hosting)
- Rules tests: `firebase emulators:exec --only firestore "npm run test:rules"`
- Frontend dev: `npm run dev` · unit tests: `npm test` · typecheck: `npm run typecheck` · build: `npm run build`
- E2E: `npx playwright test` (or `firebase emulators:exec --only auth,firestore "npx playwright test"`)
- Deploy: `firebase deploy --only hosting,firestore` (preview: `firebase hosting:channel:deploy <channel>`)
- Security: `npm audit` · `semgrep --config auto`

## Conventions
- TypeScript: ESLint + Prettier, `strict: true`, no `any`
- Tailwind CSS: CSS-first `@theme` tokens in `src/index.css` (v4+)
- Branches: `feature/<ID>-short-name` · Commits: `<ID>: message`

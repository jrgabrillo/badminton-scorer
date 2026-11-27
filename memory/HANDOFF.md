# Handoff Log (append-only, newest at bottom)
Format: `YYYY-MM-DD | agent | ID | what was done | next: agent → ID`
Scrum Master moves entries older than the current sprint to `archive/`.

---

## 2026-11-27 — US-001 Full-page Badminton Scorer
- Scaffolded React 19 + TypeScript (strict) + Vite + Tailwind CSS v4 + Vitest app.
- Implemented split-screen Red vs Blue scoreboard, 3D split-flap page-flip animation (`FlipScoreCard`), floating `+1`/`-1` feedback (`FloatingDelta`), swipe gesture detection with 90° portrait-phone axis remapping (`useSwipeScore`, `usePortraitRotation`), and Swap/Reset controls (`ControlBar`).
- Verified 5/5 unit tests (`npm test`) and clean production build (`npm run build`).

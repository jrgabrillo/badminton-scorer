# Design System
Owner: ui-ux-designer

## Brand
Personality: <e.g. professional, calm, efficient>
Logo / brand colors: <to be provided by PM — 🔴 if missing>

## Tokens (src/index.css → @theme — Tailwind v4+)
- Colors: primary, secondary, neutral, success, warning, danger (50–900)
- Font: <family>, sizes: xs–3xl
- Spacing: Tailwind default 4px scale
- Radius: sm/md/lg · Shadows: sm/md
- Dark mode: class-based

## Components (src/components/ui/)
| Component | Variants | States | Status |
|-----------|----------|--------|--------|
| Button | primary, secondary, ghost, danger | default, hover, focus, disabled, loading | Todo |

## Layout rules
- App shell: sidebar + topbar; content max-w-7xl
- Breakpoints: sm 640 · md 768 · lg 1024 · xl 1280

## Accessibility
WCAG 2.1 AA: contrast ≥ 4.5:1, visible focus, labeled inputs, keyboard navigable.

# CLAUDE.md — ATQM Presentation (internal working agreement)

Four-stage presentation site for **Atom Quantum (ATQM)**. One Next.js app, four routes
(Ruliad disabled, `soon`), shared header. See `ARCHITECTURE.md` for the full map.

> `areth` is the internal name for the chain — **areth == Atom Quantum (ATQM)**. Rendered
> copy uses **"Atom Quantum"**, never "Areth".

## Stack (pinned)

- **Next.js 16** — App Router only (never Pages Router).
- **TypeScript strict** everywhere. No `any`.
- **Tailwind v4**, CSS-first. Tokens in `app/globals.css` (`@theme inline`). No `tailwind.config.js`.
- **shadcn/ui** (new-york) is the UI base. Import primitives from `@/components/ui`.
- Animated/eye-candy sections may come from cult-ui / skiper-ui / aceternity / watermelon —
  but shadcn stays the base and **everything runs through brand tokens**.
- Fonts: **Geologica** (display + body) and **Plus Jakarta Sans** (micro-UI), **self-hosted**
  via `next/font/local` (woff2 in `app/fonts/`). Do not switch back to `next/font/google` — its
  build-time fetch from gstatic is flaky under Turbopack and makes the build need network.
- shadcn primitives are added by hand (the CLI registry returned 403 for `new-york-v4`); copy the
  standard component code into `components/ui/` and install only the Radix package it needs.
- **three.js** (+ `@types/three`) is an **approved** dependency, used **only** for the Atom Boundary
  Labs WebGL hero (lazy via `next/dynamic` `ssr:false`, client-only). Don't pull it into other
  pages — ATQM's hero is hand-rolled Canvas 2D.

## Brand — strict

- Source of truth: **Figma `DESIGN SMM`, node `12190-284`**. Monochrome (`#000` / `#fff`) +
  one accent **brand yellow `#FFD803`**. Single dark theme, **no light mode, no theme toggle**.
- **Never hardcode** colors / spacing / radii. Use tokens: `bg-background`, `text-foreground`,
  `text-primary`, `border`, `bg-card`, `text-muted-foreground`, `rounded-pill`, etc.
- `atqm_docs/atqm_DESIGN.md` is **secondary atmosphere only** (gradients/glow where Figma is
  silent). It does not override Figma colors or fonts.

## Conventions

- **Mobile-first.** Base classes target mobile, then `sm: md: lg:` upward — never the reverse.
  Verify layout at **375px** (iPhone SE) as the minimum supported width.
- **Touch targets ≥ 44×44px.** No hover-only interactions without a touch alternative.
- **Feature-based folders** (`features/atqm/`, `features/shared/`), not layer-based.
- Self-documenting names; functions ≤ ~30 lines, single responsibility; early returns.
- Content language for the ATQM page is **English** (matches the QLOSOPHY tone of voice).
- ATQM copy comes **from `atqm_docs/`** — never invent figures or facts. Keep the docs'
  honest qualifiers (smoke test ≠ production; FN-DSA = draft FIPS 206; CLOB = roadmap).
- The ATQM **product mocks** (`features/atqm/components/mocks/`) are front-end-only interactive
  demos (type → click → `Success`), matched to Figma **Qvanta** node `16820-45026`. No backend.

## Do NOT touch

- `public/qlosophy/` — finished legacy site, served **as-is** (the single copy). No edits to
  its JS/CSS/gifs.
- `atqm_docs/`, `ThermoRuliad Labs_docs/` (especially `ruliad.md`), `screenshots/`, `uploads/` —
  source / pre-existing, leave intact.

## Commands

```bash
npm install      # install deps
npm run dev      # dev server (http://localhost:3000)
npm run build    # production build
npm run lint     # eslint
```

## Stop and ask before

- Deleting/overwriting any existing file, or editing anything under `qlosophy/`.
- Adding a dependency beyond Next + Tailwind + shadcn + the named UI sources (three.js is already
  approved, for the Atom Boundary hero only).
- Any git commit/push.

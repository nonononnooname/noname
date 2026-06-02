# ARCHITECTURE — ATQM Presentation

A three-stage presentation site for the **Atom Quantum (ATQM)** ecosystem, built as a
single Next.js application. Each stage is its own route, reachable from a shared header.

| Stage | Route | Status | Content source |
|---|---|---|---|
| **ATQM** | `/atqm` | Full presentation — 13 sections, built | `atqm_docs/` (Areth = internal name = Atom Quantum) |
| **QLOSOPHY** | `/qlosophy` | Done — embedded **as-is**, untouched | legacy static site (`public/qlosophy/`) |
| **ThermoRuliad Labs** | `/thermoruliad` | Disabled in nav, badge `soon` | — (future: thermodynamic processor lab) |

The site opens on `/atqm`.

---

## Stack & rationale

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 16 (App Router)** | Latest stable; App Router for nested layouts + per-route code. |
| Language | **TypeScript (strict)** | `strict: true`, no `any`. |
| Styling | **Tailwind v4 (CSS-first)** | Tokens live in `app/globals.css` via `@theme inline` — no `tailwind.config.js`. |
| UI base | **shadcn/ui** (new-york) | Primitives copied into `components/ui/`, themed with brand tokens. |
| Animated sections | cult-ui / skiper-ui / aceternity / watermelon | shadcn-compatible component sources; everything routed through brand tokens. |
| Fonts | **Geologica** + **Plus Jakarta Sans** | Brand typefaces; **self-hosted** via `next/font/local` (latin woff2 in `app/fonts/`). |

> **Fonts are self-hosted on purpose.** `next/font/google` fetches the font files
> from `fonts.gstatic.com` at build time, which is flaky under Turbopack and makes the
> build depend on network. The latin variable woff2 for both faces live in `app/fonts/`
> and are loaded with `next/font/local`, so `npm run build` runs fully offline.

---

## Brand tokens — where they live

The **strict** brand book is the Figma file `DESIGN SMM` (node `12190-284`):
monochrome base (`#000000` / `#FFFFFF`) + a single accent **brand yellow `#FFD803`**, Geologica type.

- All tokens are defined once in **`app/globals.css`** — `:root` holds the raw values,
  `@theme inline` exposes them as Tailwind utilities (`bg-background`, `text-primary`, …).
- This is a **single dark-by-design theme** — there is no light mode and no theme toggle.
- `atqm_docs/atqm_DESIGN.md` (the "monopo saigon" reference) is a **secondary atmosphere**
  source only — used for organic gradients / glow where Figma is silent. It does **not**
  override Figma colors or fonts.
- **Never hardcode** colors, spacing, or radii in components — always use tokens.

---

## Directory layout

```
.
├── app/
│   ├── layout.tsx          # root layout: fonts, SiteHeader, <html>/<body>
│   ├── globals.css         # Tailwind v4 entry + brand tokens (@theme inline)
│   ├── fonts/              # self-hosted brand woff2 (Geologica, Plus Jakarta Sans)
│   ├── page.tsx            # "/" — redirects to /atqm
│   ├── atqm/page.tsx       # ATQM presentation — assembles the 13 sections
│   ├── qlosophy/page.tsx   # iframe over the untouched legacy static page
│   └── thermoruliad/page.tsx # "soon" stub
├── features/               # feature-based modules (NOT layer-based)
│   ├── shared/
│   │   ├── nav.ts          # nav items (ATQM, QLOSOPHY, ThermoRuliad=disabled)
│   │   └── components/site-header.tsx   # sticky header + mobile sheet nav
│   └── atqm/
│       ├── data.ts         # all ATQM copy, sourced from atqm_docs/
│       ├── sections.tsx    # the 13 section components
│       └── components/     # reveal (scroll-in) + section primitives
├── components/ui/          # shadcn primitives (button, badge, sheet)
├── lib/utils.ts            # cn() helper
├── public/
│   └── qlosophy/           # legacy QLOSOPHY site, copied verbatim (Phase 2)
├── atqm_docs/              # source content for the ATQM page (not shipped)
├── qlosophy/               # ORIGINAL legacy site (kept; copied into public/)
├── screenshots/ uploads/   # pre-existing assets (untouched)
├── Qlosophy.html           # original landing (kept for reference)
└── Q-Day Tracker.html      # original tracker (kept for reference)
```

`features/` is **feature-based**: a feature owns its components and data together, instead
of splitting by technical layer.

## How QLOSOPHY is embedded

QLOSOPHY is finished and must not change. The legacy folder (`qlosophy/`: vanilla JS,
gifs, canvases) is copied verbatim into `public/qlosophy/` and served as a static page at
`/qlosophy`. No line of `core.js` / `oracle.js` / `machine.js` is edited. The header simply
links to that route.

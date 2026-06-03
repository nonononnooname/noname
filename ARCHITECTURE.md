# ARCHITECTURE — ATQM Presentation

A four-stage presentation site for the **Atom Quantum (ATQM)** ecosystem, built as a
single Next.js application. Each stage is its own route, reachable from a shared header
(Ruliad is a disabled `soon` placeholder, not yet built).

| Stage | Route | Status | Content source |
|---|---|---|---|
| **ATQM** | `/atqm` | Full presentation — 13 sections, built | `atqm_docs/` (Areth = internal name = Atom Quantum) |
| **QLOSOPHY** | `/qlosophy` | Done — embedded **as-is**, untouched | legacy static site (`public/qlosophy/`) |
| **Atom Boundary Labs** | `/atom-boundary` | Full presentation — 11 sections, built | `ThermoRuliad Labs_docs/atomquantum_physics.md` (rebranded Atom Quantum → Atom Boundary) |
| **Ruliad** | `/ruliad` | Disabled in nav, badge `soon` | — (future: `ThermoRuliad Labs_docs/ruliad.md`) |

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
| 3D hero (Atom Boundary) | **three.js** (lazy, client-only) | WebGL morphing-icosahedron hero; brand-recolored (white mesh + yellow fresnel), `next/dynamic` `ssr:false` so it stays out of first paint. ATQM's hero stays hand-rolled Canvas 2D. |
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
│   └── atom-boundary/page.tsx # Atom Boundary Labs — assembles the 11 sections
├── features/               # feature-based modules (NOT layer-based)
│   ├── shared/
│   │   ├── nav.ts          # nav items (ATQM, QLOSOPHY, Atom Boundary Labs, Ruliad=disabled)
│   │   └── components/site-header.tsx   # sticky header + mobile sheet nav
│   ├── atqm/
│   │   ├── data.ts         # all ATQM copy, sourced from atqm_docs/
│   │   ├── sections.tsx    # the 13 section components
│   │   └── components/     # reveal, section primitives, heroes + interactive product mocks (mocks/)
│   └── boundary/           # Atom Boundary Labs — reuses the atqm primitives
│       ├── data.ts         # copy from ThermoRuliad Labs_docs/atomquantum_physics.md
│       ├── sections.tsx    # the 11 section components
│       └── components/     # animated "anomalous matter" hero (three.js, lazy + client-only)
├── components/ui/          # shadcn primitives (button, badge, input, sheet, …)
├── lib/utils.ts            # cn() helper
├── public/
│   └── qlosophy/           # legacy QLOSOPHY site — the single copy, served as-is
├── atqm_docs/              # source content for the ATQM page (not shipped)
├── ThermoRuliad Labs_docs/ # source for Atom Boundary + future Ruliad (not shipped)
└── screenshots/ uploads/   # pre-existing dev assets (untouched)
```

`features/` is **feature-based**: a feature owns its components and data together, instead
of splitting by technical layer.

## How QLOSOPHY is embedded

QLOSOPHY is finished and must not change. Its files (vanilla JS, gifs, canvases) live as a
**single copy** under `public/qlosophy/` and are served verbatim as a static page at
`/qlosophy` (the route is an `<iframe>` over `public/qlosophy/index.html`). No line of
`core.js` / `oracle.js` / `machine.js` is edited. On Vercel these ship as static CDN assets,
so the vanilla JS needs no server runtime. (The earlier duplicate root `qlosophy/` copy was
removed — `public/` is now the only copy.)

## Product mocks (interactive)

The ATQM Products section (`features/atqm/components/mocks/`) renders the Qvanta product
screens (Figma node `16820-45026`) as **front-end-only interactive demos**: type an amount,
click the action, see a `Success` status. No backend, no network. The `MockWindow`
`interactive` prop drops `aria-hidden`; `components/ui/input.tsx` is the shadcn `Input`
these use. The wallet and hardware mocks stay decorative visuals.

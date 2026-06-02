# ATQM presentation — ветка `feat/atqm-ecosystem-products`

> **Гайд для мерджа.** Если ты пришёл из другой ветки и хочешь влить эти изменения — всё здесь.
> Полная карта проекта — в [`ARCHITECTURE.md`](./ARCHITECTURE.md), рабочие правила — в [`CLAUDE.md`](./CLAUDE.md).

## TL;DR

- Что: переделка страницы **`/atqm`** (фронт, Next.js 16 / App Router / Tailwind v4).
- PR: **#1 → база `feat/atqm`** (ветка `feat/atqm-ecosystem-products`, 3 коммита поверх `698f02b`).
- Scope: **только `/atqm`** + ассеты в `public/products/`. Бэкенд, конфиги, `qlosophy/`, легаси-HTML — **не трогались**.

## Что изменилось

1. **Удалены 8 технических секций** из рендера: Substrate, Architecture, Crate map, Consensus, PQ primitives, Transactions, Performance, Modular expansion.
   Их данные/компоненты физически **не удалены**, просто больше не импортируются → это мёртвый код: `features/atqm/components/topo-hero.tsx`, `crate-carousel.tsx` и старые константы в `data.ts` (`SUBSTRATE`, `ARCHITECTURE`, …). Можно вычистить отдельным PR.
2. **Hero** — вместо вращающейся топо-картинки анимированное решётчатое поле (`lattice-hero.tsx`, canvas, reduced-motion-safe).
3. **Ecosystem** — новая секция-орбита: ядро Areth + продукты вокруг (`ecosystem-orbit.tsx`, узлы считаются от числа продуктов).
4. **Products** — мок-интерфейсы DEX / Staking / Bridge / Companion App (`features/atqm/components/mocks/`).
5. **Hardware Wallet** — full-bleed блок-герой как в Figma «POST»: ghosted `TECHNOLOGY`, кольцо, реальный рендер устройства + большой логотип ATOM (`hardware-showcase.tsx`, ассеты в `public/products/`).

Итоговый порядок секций:

```
Hero → Problem → ATQM vs Areth → Ecosystem → Products → Hardware → Roadmap → Pitch
```

## Затронутые файлы (поверхность конфликтов)

```
app/atqm/page.tsx                      # сборка страницы + порядок секций
features/atqm/sections.tsx             # ПЕРЕПИСАН (−352 строки) — главный кандидат на конфликт
features/atqm/data.ts                  # +ECOSYSTEM, +PRODUCTS, +HARDWARE
features/atqm/components/              # lattice-hero, ecosystem-orbit, hardware-showcase, mocks/
public/products/                       # atqm-wallet.png, atom-wordmark.png (новые ассеты)
```

Всё изолировано в `app/atqm/**`, `features/atqm/**`, `public/products/**`. Остальной репозиторий нетронут.

## Как мерджить

### Вариант A — влить PR (рекомендуется)

Ревью → смерджить **PR #1** в `feat/atqm` через GitHub (Squash или обычный merge — на ваше усмотрение).

### Вариант B — забрать изменения в свою ветку напрямую

```bash
git fetch origin
git checkout <твоя-ветка>
git merge origin/feat/atqm-ecosystem-products
# либо, после мерджа PR в feat/atqm:
git merge origin/feat/atqm
```

### Если есть конфликты

Конфликты возможны, только если твоя ветка тоже правила `/atqm`. Самые вероятные точки:
- `features/atqm/sections.tsx` — переписан целиком; обычно проще взять нашу версию (`--theirs` при merge в свою ветку) и перенести свои правки сверху.
- `features/atqm/data.ts`, `app/atqm/page.tsx` — точечные конфликты в импортах/порядке секций.

## Проверка после мерджа

```bash
npm install
npm run dev      # открыть http://localhost:3000/atqm
npm run build    # прод-сборка (на этой ветке проходит зелёной)
npx eslint features/atqm app/atqm
```

## Заметки

- Тексты/цифры продуктов — **плейсхолдер**, правятся в `features/atqm/data.ts`.
- На рендере устройства есть **синие** акценты — единственный не-жёлтый цвет vs строгий бренд (моно + `#FFD803`). По желанию притушить.
- Мёртвый код оставлен намеренно (дифф аддитивный) — чистится отдельно.

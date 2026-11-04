# DESIGN.md: IdentityMD Top Posts

Every value below comes from the source: `src/styles.css`, `src/index.html` and `src/app.js`. `dist/` is an exact copy of those files. **None of these values has been checked in a browser yet**; see `artifacts/validation.md`.

## Overview

This is a single-page feed for people who follow IdentityMD. Their main task is to scan the top posts, narrow them by topic or search, and copy one. The brief asked for dark green with frogs armed with AI. That shows up as a deep green palette, a frog with a dark HUD visor and an antenna (the hero, the favicon and every avatar), and a light green accent that reads as a glowing display.

The page is dense but calm. The first screen shows the page heading, one line saying what it is, the controls, and then the feed. The hero art sits beside the heading at every width instead of above it, so the feed stays on the first screen on phones. Cards are flat and outlined. There is one filled colour (the accent) for selected and primary states.

## Colors

Defined as custom properties in `src/styles.css:2-56`. Hex notation throughout.

| Token | Value | Job |
| --- | --- | --- |
| `--bg` (`--green-900`) | `#0b1f14` | Page background |
| `--surface` (`--green-850`) | `#10291b` | Cards, inputs, chips |
| `--surface-raised` (`--green-800`) | `#123321` | Avatar disc, quiet button hover, toast, inline code |
| `--border` (`--green-700`) | `#1f4a31` | Card, input and chip outlines; footer rule |
| `--green-500` | `#3d8a4b` | Hover border on inputs and chips |
| `--text` (`--green-50`) | `#e9f8ee` | Primary text |
| `--text-muted` | `#a9cbb4` | Lede, labels, handles, dates, stats labels, about copy |
| `--accent` (`--green-300`) | `#7bd88f` | Links, rank, tag text, selected chip fill, primary button fill |
| `--accent-strong` (`--green-200`) | `#9cf7b0` | Link and primary button hover; visor glow in the art |
| `--on-accent` (`--green-950`) | `#06140c` | Text on accent fills; visor colour in the art |
| `--focus` (`--green-200`) | `#9cf7b0` | 3px focus outline |
| `--brown-600` | `#7a3b2e` | Frog lips (art only) |

The avatar tint is set per post through the `--tint` custom property. It takes values from the `tint` field in `src/posts.js`, all mid greens. It is decorative only and carries no meaning.

Contrast ratios have **not been measured** in a browser. They were worked out by hand from the hex values (relative luminance), for example `--text-muted` on `--surface` at about 8.8:1 and `--on-accent` on `--accent` at about 10.9:1. Treat those as unverified estimates.

## Typography

- Family: `--font-sans` = `system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`. No web fonts are loaded. Inline `code` uses `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`.
- Weights: 400 (body), 600 (field labels, chips), 700 (h1, h2, brand, names, rank, stats values, buttons).
- Scale, five sizes (`src/styles.css:31-36`):

| Token | Size | Used for |
| --- | --- | --- |
| `--fs-sm` | 0.875rem | Labels, chips, buttons, meta, tags, stats, footer, toast, result count |
| `--fs-base` | 1rem | Body, post text, names, inputs (16px so mobile browsers do not zoom on focus) |
| `--fs-md` | 1.25rem | Lede |
| `--fs-lg` | 1.75rem | Section heading (`About the feed`) |
| `--fs-xl` | clamp(1.75rem, 1.2rem + 2.6vw, 2.75rem) | Page h1 |

- Line height is 1.5 for body text and 1.15 for headings. The h1 has `letter-spacing: -0.02em`. Nothing else is tracked, and there is no uppercase text.
- Wrapping: headings use `text-wrap: balance` and paragraphs use `text-wrap: pretty`. Post text is capped at 62ch, uses `white-space: pre-line` so authored line breaks survive, and `overflow-wrap: anywhere` so long handles or URLs can't overflow.
- Numbers: rank and stats use `font-variant-numeric: tabular-nums`. Counts are compact (`7.8K`), with the full value in the `title` attribute (`src/app.js` `stat()`).

## Layout

- Spacing uses a 4px base, `--space-1`..`--space-7` = 4, 8, 12, 16, 24, 32, 48px.
- Widths: `--page-max: 72rem` for the header, main and footer, and `--feed-max: 44rem` for the feed and about column. The side gutter `--gutter` is `clamp(1rem, 4vw, 2rem)`.
- Under 48rem: the intro is a two-column grid (text plus art at `clamp(84px, 24vw, 240px)`). Controls are search beside sort, with the chips wrapping below. Cards have 16px padding.
- At 48rem and up: the intro gets more vertical padding, the controls become `22rem` search plus `14rem` sort, and cards get 24px padding.
- At 64rem and up: `main` becomes a two-column grid. The feed is in column 1 and the about panel is in column 2, sticky at the top.
- At 22rem and below (320px phones): search and sort stack into one column and the lede drops to `--fs-base`.
- Order: the h1 is in DOM order before the controls, then the feed, then about. The skip link jumps to the feed.

## Elevation & Depth

The design is deliberately flat, with no shadows anywhere. Depth comes from tone (`--bg`, then `--surface`, then `--surface-raised`) and 1px `--border` outlines. The empty state uses a dashed border to read as a placeholder. The only overlay is the toast (`position: fixed`), which is hidden with `visibility: hidden` when idle so it never covers content.

## Shapes

`--radius-sm: 8px` for inputs, buttons, toast and skip link; `--radius-md: 14px` for post cards and the empty state; `--radius-pill` for topic chips; 50% for avatars. Inline code uses 4px.

## Components

| Component | Source | Notes |
| --- | --- | --- |
| Frog sprite | `src/index.html` `<symbol id="frog">` | Reused with `<use href="#frog">`. Body colour comes from `--tint`. Always `aria-hidden`. |
| Header | `.site-header`, `.brand`, `.header-link` | Brand links to `#top`. "About the feed" is an in-page anchor. Both are at least 44px tall. |
| Field | `.field` with `<label>` + `input[type=search]` / `select` | Visible labels, 44px minimum height, hover border `--green-500`, global focus ring. |
| Topic chip | `.chip` built in `src/app.js` | `<button aria-pressed>` inside `role="group"`. The selected state uses the accent fill plus `aria-pressed="true"`, not colour alone, because text contrast changes too. Pressing scales it to 0.97. |
| Button | `.button` (primary, accent fill) and `.button-quiet` (outlined) | Verb-first labels ("Copy post", "Show all posts"). |
| Post card | `.post` (`li`), `renderPost()` in `src/app.js` | Avatar and rank on the left. On the right: name, handle, `<time>`, text, tag list, a `<dl>` of stats, and a Copy button. Named by `aria-labelledby` pointing at the author name. The rank has visually hidden "Rank " text. |
| Result count | `#result-count` | `role="status"`. Announces "N posts in Topic matching ..." after each change. |
| Empty state | `#empty` | Shown when nothing matches, with a "Show all posts" reset that keeps the sort and returns focus to search. |
| Toast | `#toast` | `role="status"`. Confirms a copy or explains a failed one, and hides after 2.4s. |

Interaction states: hover (border or background tint), `:focus-visible` (3px `--focus` outline offset 2px), `:active` (scale 0.97), selected (`aria-pressed`). Under `prefers-reduced-motion: reduce`, transitions drop to 0.01ms and smooth scrolling is turned off. There are no endless animations.

## Do's and Don'ts

- Start new sections inside `main` with the existing spacing and width tokens. Don't hard-code pixel values.
- Keep one filled accent action per view. Secondary actions use `.button-quiet`.
- Add font sizes only from the five `--fs-*` tokens. Don't add uppercase or tracked labels above headings.
- Use the frog sprite with a `--tint` for any new character art, so the theme stays consistent.
- Keep all asset URLs relative (`./...`). `scripts/build.mjs` fails the build on absolute ones.
- To add a page section: add the markup in `src/index.html` using `.about`'s pattern (an `h2` at `--fs-lg`, muted paragraphs capped at 62ch), then run `npm run build` and `npm run check`.

# IdentityMD Top Posts

A one-page static site that ranks the top posts about IdentityMD. It's dark green and themed around frogs with AI visors. You can search the posts, filter them by topic (Agents, Builders, Sites, Memes), sort by top engagement, newest or most replies, and copy any post. The current filter is kept in the URL hash (for example `#tag=memes&sort=new`), so a filtered view can be shared.

> **About the content.** The twelve posts in `src/posts.js` are a **sample set**. The accounts are fictional and the numbers are illustrative. They were written because no real IdentityMD posts could be fetched while building. The site says this in its "About the feed" section. To publish real posts, replace the array in `src/posts.js` and rebuild.

## Layout

| Path | What it is |
| --- | --- |
| `src/index.html` | Page markup, share metadata, inline frog SVG sprite |
| `src/styles.css` | Design tokens and all styles (see `DESIGN.md`) |
| `src/feed.js` | Pure logic: scoring, search, topic filter, sort, URL hash state |
| `src/posts.js` | Post data (sample) |
| `src/app.js` | DOM rendering and event wiring |
| `src/favicon.svg`, `src/og-image.svg` | Favicon and share image |
| `dist/` | Committed production export (exact copy of `src/`, relative URLs) |
| `scripts/build.mjs` | Build: copies `src/` to `dist/` and rejects absolute asset URLs |
| `scripts/check.mjs` | Syntax check, `dist/` equals `src/`, share metadata, asset links |
| `scripts/preview.mjs` | Local preview server at a subpath |
| `tests/feed.test.cjs` | Interaction-logic tests (`node --test`) |

There are no runtime or build dependencies. `package-lock.json` is a lockfile with no dependencies in it.

## Install, preview, rebuild

Requires Node 18 or newer.

```sh
npm install          # nothing to download; records the empty lockfile
npm run build        # rebuild dist/ from src/
npm test             # search, filter, sort and URL-state tests
npm run check        # syntax check, dist matches src, metadata, relative assets
npm run preview      # serve dist/ at http://localhost:4173/site/ (Ctrl+C to stop)
```

You can also open `dist/index.html` directly from disk. All asset URLs are relative (`./styles.css` and so on), so `dist/` works from an IPFS gateway subpath or an ENS name without changes.

## Validation record

See `artifacts/validation.md` for the full record. In short:

**No command was run while building this submission.** Every shell call failed with the same error: `Sandbox is required but failed to initialize: Failed to create bridge sockets after 5 attempts`. The browser tool also failed, because its Chrome build is not installed on this machine. As a result:

- `npm run build`, `npm test`, `npm run check`, a typecheck and the design probe (`taste.mjs`) were **not run**. Their results are not known.
- `dist/` was written by hand as a file-for-file copy of `src/`. A line-count comparison of every file in the two folders matched. Byte equality was not checked; `npm run check` does that.
- There was no rendered check at 320, 390 or 1440 wide, and no screenshot exists.

There is no TypeScript compiler, because the project has no dependencies. The scripts carry `// @ts-check` with JSDoc types, so `npx -p typescript tsc --noEmit --allowJs --checkJs --target es2020 --lib es2020,dom src/*.js` would typecheck them. That command was not run either.

Before publishing, run `npm run build && npm test && npm run check`, and then the design probe:
`node .imd/reads/skills/design-critic/scripts/taste.mjs --out test/scratch/taste`.

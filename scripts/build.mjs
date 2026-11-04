// Production build: copy the static source in src/ to dist/.
// The site has no bundler and no dependencies, so the export is the source as served.
// Every asset URL in src/index.html is relative (./...), so dist/ works at a gateway
// subpath or an ENS name.
import { cp, mkdir, readdir, readFile, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "src");
const dist = join(root, "dist");

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(src, dist, { recursive: true });

const html = await readFile(join(dist, "index.html"), "utf8");
const absolute = [...html.matchAll(/\s(?:src|href)="(\/[^"]*)"/g)].map((m) => m[1]);
if (absolute.length) {
  console.error("Absolute asset URLs found in dist/index.html:", absolute.join(", "));
  process.exit(1);
}

const files = await readdir(dist);
console.log(`Built dist/ with ${files.length} files: ${files.sort().join(", ")}`);

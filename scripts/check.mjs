// Static checks for the source and the committed export.
// 1. Syntax-check every script with `node --check`.
// 2. Confirm dist/ is an exact copy of src/ (so the committed export matches the source).
// 3. Confirm index.html carries the share metadata and only relative asset URLs.
import { execFileSync } from "node:child_process";
import { readdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
let failures = 0;
const fail = (msg) => {
  failures += 1;
  console.error("FAIL", msg);
};
const pass = (msg) => console.log("ok  ", msg);

for (const file of ["src/feed.js", "src/posts.js", "src/app.js"]) {
  try {
    execFileSync(process.execPath, ["--check", join(root, file)], { stdio: "pipe" });
    pass(`syntax ${file}`);
  } catch (err) {
    fail(`syntax ${file}: ${err.stderr?.toString() ?? err.message}`);
  }
}

const srcFiles = (await readdir(join(root, "src"))).sort();
let distFiles = [];
try {
  distFiles = (await readdir(join(root, "dist"))).sort();
} catch {
  fail("dist/ is missing; run npm run build");
}
if (distFiles.length) {
  if (srcFiles.join() !== distFiles.join()) {
    fail(`dist/ files differ from src/: ${distFiles.join(", ")} vs ${srcFiles.join(", ")}`);
  }
  for (const name of srcFiles) {
    const a = await readFile(join(root, "src", name)).catch(() => null);
    const b = await readFile(join(root, "dist", name)).catch(() => null);
    if (!a || !b || !a.equals(b)) fail(`dist/${name} does not match src/${name}; run npm run build`);
    else pass(`dist/${name} matches source`);
  }
}

const html = await readFile(join(root, "src", "index.html"), "utf8");
const required = {
  title: /<title>[^<]+<\/title>/,
  favicon: /<link rel="icon"[^>]+href="\.\/favicon\.svg"/,
  description: /<meta name="description" content="[^"]+"/,
  "og:title": /<meta property="og:title" content="[^"]+"/,
  "og:image": /<meta property="og:image" content="[^"]+"/,
  viewport: /<meta name="viewport"/
};
for (const [name, re] of Object.entries(required)) {
  if (re.test(html)) pass(`index.html has ${name}`);
  else fail(`index.html is missing ${name}`);
}
for (const m of html.matchAll(/\s(?:src|href)="([^"#][^"]*)"/g)) {
  const url = m[1];
  if (url.startsWith("/") || /^https?:/.test(url)) fail(`non-relative asset URL ${url}`);
  else {
    const local = url.replace(/^\.\//, "").split(/[?#]/)[0];
    if (!srcFiles.includes(local)) fail(`asset ${url} not found in src/`);
    else pass(`asset ${url} exists`);
  }
}

if (failures) {
  console.error(`\n${failures} check(s) failed`);
  process.exit(1);
}
console.log("\nAll checks passed");

// Minimal static preview of dist/ at http://localhost:4173/site/ (a subpath, like a gateway).
// Stop it with Ctrl+C.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const port = Number(process.env.PORT) || 4173;
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml"
};

createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  if (url.pathname === "/" || url.pathname === "/site") {
    res.writeHead(302, { location: "/site/" });
    return res.end();
  }
  if (!url.pathname.startsWith("/site/")) {
    res.writeHead(404);
    return res.end("Not found");
  }
  let rel = decodeURIComponent(url.pathname.slice("/site/".length)) || "index.html";
  rel = normalize(rel).replace(/^(\.\.[/\\])+/, "");
  try {
    const body = await readFile(join(dist, rel));
    res.writeHead(200, { "content-type": types[extname(rel)] ?? "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
}).listen(port, () => {
  console.log(`Previewing dist/ at http://localhost:${port}/site/`);
});

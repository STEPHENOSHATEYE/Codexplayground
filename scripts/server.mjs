import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const port = Number.parseInt(process.env.PORT ?? "4173", 10);
const host = process.env.HOST ?? "0.0.0.0";

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
};

const server = createServer((request, response) => {
  const pathname = new URL(request.url ?? "/", "http://localhost").pathname;
  const requestedPath = pathname === "/" ? "index.html" : pathname.slice(1);
  const safePath = normalize(requestedPath).replace(/^(\.\.(\/|\\|$))+/, "");
  const filePath = join(root, safePath);

  if (!filePath.startsWith(root) || !existsSync(filePath) || !statSync(filePath).isFile()) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  response.writeHead(200, {
    "Content-Type": contentTypes[extname(filePath)] ?? "application/octet-stream",
    "Cache-Control": "no-cache",
  });
  createReadStream(filePath).pipe(response);
});

server.listen(port, host, () => {
  console.log(`TapOn preview is available at http://localhost:${port}`);
});

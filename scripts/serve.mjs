import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { createGzip } from "node:zlib";

const root = resolve(import.meta.dirname, "../apps/web/out");
const port = Number(process.env.PORT ?? 4321);

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".ico": "image/x-icon",
};

const server = createServer((request, response) => {
  const url = new URL(request.url ?? "/", `http://127.0.0.1:${port}`);
  const pathname = decodeURIComponent(url.pathname);
  const candidates = [];

  if (pathname.endsWith("/")) {
    candidates.push(join(root, pathname, "index.html"));
  } else {
    candidates.push(join(root, pathname));
    candidates.push(join(root, `${pathname}.html`));
    candidates.push(join(root, pathname, "index.html"));
  }

  const file = candidates.find((candidate) => {
    const safe = normalize(candidate);
    return safe.startsWith(root) && existsSync(safe) && statSync(safe).isFile();
  });

  if (!file) {
    response.writeHead(404, { "content-type": "text/html; charset=utf-8" });
    response.end("<h1>404</h1>");
    return;
  }

  const type = types[extname(file)] ?? "application/octet-stream";
  const compressible = /^(text\/|application\/(json|javascript)|image\/svg)/.test(type);
  const acceptsGzip = String(request.headers["accept-encoding"] ?? "").includes("gzip");

  response.writeHead(200, {
    "content-type": type,
    "cache-control": "public, max-age=0, must-revalidate",
    ...(compressible && acceptsGzip ? { "content-encoding": "gzip", vary: "Accept-Encoding" } : {}),
  });

  const stream = createReadStream(file);

  if (compressible && acceptsGzip) {
    stream.pipe(createGzip()).pipe(response);
    return;
  }

  stream.pipe(response);
});

server.listen(port, "127.0.0.1", () => {
  console.log(`serve ${root} on http://127.0.0.1:${port}`);
});

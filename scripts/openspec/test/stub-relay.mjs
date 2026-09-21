/**
 * The relay, stubbed over `node:http`: one server every test of a relay call
 * shares, so what each of them reads is the request itself — its method, its
 * path, its headers and its body — rather than a mock of `fetch`.
 *
 * `relay.test.mjs`, `relay-post.test.mjs`, `plan-land-relay.test.mjs` and
 * `reread-job.test.mjs` all import it. Four copies of the same eight lines
 * drift the day a call gains a header or an endpoint moves.
 *
 * The server listens on a loose port on the loopback interface, so nothing
 * here needs a port to be free. A test that spawns a child while the stub is
 * up uses `spawn`, never `spawnSync`: the server answers on this process's own
 * event loop, and a synchronous child would deadlock against it.
 */
import { createServer } from "node:http";

/** A server answering every request through `handler(req, res, body)`, the
 * body read whole first so a handler never has to stream it. */
export function stubRelay(handler) {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", () => handler(req, res, body));
    });
    server.listen(0, "127.0.0.1", () => resolve(server));
  });
}

/** Where the stub is, as a wake's file names it. */
export const urlOf = (server) => `http://127.0.0.1:${server.address().port}`;

/** One JSON answer, the way the relay gives them. */
export function answer(res, status, body = {}) {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(body));
}

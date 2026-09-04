import type { IncomingMessage, ServerResponse } from "node:http";
import { pathToFileURL } from "node:url";
import type { Roots } from "./roots.mts";

type Next = () => void;
type Handler = (req: IncomingMessage, res: ServerResponse, next?: Next) => void;

/** The half of the viewer's `server/mount.mjs` this reads. */
type Mount = { hasPage: () => boolean; mounted: () => Handler };

/** The submodule, from here: `tools/manual/src/store` up to `tools/`. */
const VIEWER = new URL("../../../openspec-viewer/", import.meta.url);

/**
 * The OpenSpec viewer under `/viewer/` on the dev server, live.
 *
 * The built site carries the viewer as files a snapshot wrote; the dev server
 * has no build, and a snapshot on disk would show the spec as it was before
 * the save the reader just made. So the viewer's own mount handler is used
 * instead: it serves the viewer's built page stamped to ask relatively, and
 * answers each of the snapshot's paths from the store as the request arrives
 * — the same page, reading the same working copy this server does.
 *
 * Loaded on the first request rather than at startup, and never fatal: a
 * clone without the submodule initialised, or one that has not built it, gets
 * a page under `/viewer/` saying what to run, and the manual is unaffected.
 * The viewer resolves the store through the openspec CLI, which walks up from
 * wherever it is run to the repository, so starting under `tools/manual` reads
 * the same store `pnpm spec:view` does.
 */
export function viewerMount(roots: Roots): Handler {
  let loaded: Promise<Handler> | undefined;

  const load = async (): Promise<Handler> => {
    // The viewer reads this once, at import, to decide where to run the CLI.
    // The content root is the store here; a consuming repository's manual
    // would point at its own store the same way.
    process.env.OPENSPEC_VIEWER_CWD ??= roots.store;
    let mount: Mount;
    try {
      mount = (await import(
        pathToFileURL(new URL("server/mount.mjs", VIEWER).pathname).href
      )) as Mount;
    } catch {
      return explain(
        "The OpenSpec viewer is not here.",
        "This clone has no tools/openspec-viewer. Run `git submodule update --init tools/openspec-viewer`, then `pnpm manual:viewer` to build it, and reload.",
      );
    }
    if (!mount.hasPage()) {
      return explain(
        "The OpenSpec viewer is not built.",
        "Run `pnpm manual:viewer` once — it builds the submodule — and reload.",
      );
    }
    return mount.mounted();
  };

  return (req, res, next) => {
    loaded ??= load();
    loaded.then(
      (handler) => handler(req, res, next),
      (err: unknown) => {
        loaded = undefined;
        res.statusCode = 500;
        res.setHeader("content-type", "text/plain; charset=utf-8");
        res.end(String(err));
      },
    );
  };
}

/** A page under `/viewer/` that says what to run, in place of the viewer. */
function explain(title: string, detail: string): Handler {
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${title}</title>
    <style>
      body { font: 16px/1.5 system-ui, sans-serif; margin: 4rem auto; max-width: 40rem; padding: 0 1rem; }
      code { font-family: ui-monospace, monospace; }
    </style>
  </head>
  <body>
    <h1>${title}</h1>
    <p>${detail.replace(/`([^`]+)`/g, "<code>$1</code>")}</p>
  </body>
</html>
`;
  return (_req, res) => {
    res.statusCode = 503;
    res.setHeader("content-type", "text/html; charset=utf-8");
    res.setHeader("cache-control", "no-store");
    res.end(html);
  };
}

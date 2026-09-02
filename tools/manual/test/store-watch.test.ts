import { join } from "node:path";
import type { ViteDevServer } from "vite";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { rootsOf } from "../src/store/roots.mts";
import { storeDirs } from "../src/store/snapshot.mts";
import { watchStore } from "../src/store/vite-plugin.mts";

/** The dev server's only way of noticing an edit: none of what the manual
 * renders is a module, so nothing reaches the browser unless this says so. */

const ROOT = "/tmp/manual-watch-store";
const roots = rootsOf(ROOT);

function fakeServer() {
  const watched: string[] = [];
  const announced: string[] = [];
  const listeners: ((file: string) => void)[] = [];
  const server = {
    watcher: {
      add: (dirs: string[]) => watched.push(...dirs),
      on: (_event: string, handler: (file: string) => void) =>
        listeners.push(handler),
    },
    hot: { send: (event: string) => announced.push(event) },
  };
  return {
    watched,
    announced,
    server: server as unknown as ViteDevServer,
    touch: (file: string) => {
      for (const listener of listeners) listener(file);
    },
  };
}

describe("watchStore", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("watches every directory the stamp measures", () => {
    const { watched, server } = fakeServer();
    watchStore(server, roots);
    expect(watched).toEqual(storeDirs(roots));
  });

  it("announces a page edit once per burst", () => {
    const { announced, server, touch } = fakeServer();
    watchStore(server, roots);

    touch(join(ROOT, "docs/prds/index.md"));
    touch(join(ROOT, "docs/prds/index.md"));
    expect(announced).toEqual([]);

    vi.runAllTimers();
    expect(announced).toEqual(["manual-store:changed"]);
  });

  it("announces a spec, a reference, and the design-sync report", () => {
    for (const file of [
      "openspec/specs/store/checkout/spec.md",
      "docs/references/competitors.md",
      ".design-sync/report.json",
    ]) {
      const { announced, server, touch } = fakeServer();
      watchStore(server, roots);
      touch(join(ROOT, file));
      vi.runAllTimers();
      expect(announced, file).toEqual(["manual-store:changed"]);
    }
  });

  it("stays quiet for a file the store does not read", () => {
    const { announced, server, touch } = fakeServer();
    watchStore(server, roots);

    touch(join(ROOT, "tools/manual/src/app.tsx"));
    touch(join(ROOT, "docs/prds-elsewhere/index.md"));
    vi.runAllTimers();
    expect(announced).toEqual([]);
  });
});

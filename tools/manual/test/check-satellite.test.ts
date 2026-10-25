import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { runChecks } from "../check/check-manual.mjs";
import { NO_GIT } from "../src/store/git.mts";
import type { Roots } from "../src/store/roots.mts";
import { writeStore } from "./tmp-store";

/**
 * A manual mounted in another repository: its own `docs/prds/`, somebody else's
 * store. Page rules still hold its pages to account; the store's own coverage
 * is not its PR gate to fail.
 */

const STORE = fileURLToPath(new URL("./fixtures/check/clean", import.meta.url));

const satellite = (files: Record<string, string>): Roots => ({
  store: STORE,
  content: writeStore(files),
  manual: "docs/prds",
  own: false,
});

const CONFIG = "storybookBase: https://storybook.example\ngroups: {}\n";
const PAGE = "---\ntitle: Handbook\n---\n\nWhat this repository builds.\n";

describe("a manual over a store it does not own", () => {
  it("owes the store nothing it did not list", async () => {
    const { findings } = await runChecks(
      satellite({
        "docs/prds/manual.yaml": CONFIG,
        "docs/prds/index.md": PAGE,
      }),
      NO_GIT,
    );
    // In the store's own repository an empty manual fails coverage for every
    // spec, product and topic; here the store is somebody else's to cover.
    expect(findings).toEqual([]);
  });

  it("still holds its own pages to every page rule", async () => {
    const { findings } = await runChecks(
      satellite({
        "docs/prds/manual.yaml": CONFIG,
        "docs/prds/index.md":
          "---\ntitle: Handbook\n---\n\n[[demo-product/gone]]\n",
      }),
      NO_GIT,
    );
    // A ref naming nothing on disk is flagged, though a ref in prose is only a warning.
    expect(findings).toEqual([
      {
        rule: "ref",
        level: "warn",
        path: "docs/prds/index.md",
        reason: "`[[demo-product/gone]]`: nothing named `demo-product/gone`",
      },
    ]);
  });

  it("owes a landing page for what it does list", async () => {
    const { findings } = await runChecks(
      satellite({
        "docs/prds/manual.yaml":
          "storybookBase: https://storybook.example\ngroups:\n  Products:\n    - demo-product\n",
        "docs/prds/products/demo-product/alpha.md": PAGE,
      }),
      NO_GIT,
    );
    expect(findings).toEqual([
      {
        rule: "page",
        level: "fail",
        path: "docs/prds/products/demo-product/index.md",
        reason: "product `demo-product` has no page here",
      },
    ]);
  });
});

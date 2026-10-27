import { describe, expect, it } from "vitest";
import { NO_GIT } from "../src/store/git.mts";
import { rootsOf } from "../src/store/roots.mts";
import { composeStore } from "../src/store/snapshot.mts";
import { checkWarnings } from "../src/store/warnings.mts";
import { writeStore } from "./tmp-store";

const CONFIG =
  "storybookBase: https://storybook.example\n\ngroups:\n  Products:\n    - demo-product\n";

const HOME = "---\ntitle: Demo\n---\n\nA demo store.\n";
const LANDING =
  "---\ntitle: Demo product\nicon: storefront\n---\n\nThe one product.\n";

const ALPHA_PAGE =
  "---\ntitle: Alpha\nspec: demo-product/alpha\n---\n\nAlpha is a demo capability.\n";

const BASE = {
  "docs/prds/manual.yaml": CONFIG,
  "docs/prds/index.md": HOME,
  "docs/prds/products/demo-product/index.md": LANDING,
  "docs/prds/products/demo-product/alpha.md": ALPHA_PAGE,
};

const snapshotOfStore = async (root: string) =>
  composeStore(
    rootsOf(root),
    NO_GIT,
    await checkWarnings(rootsOf(root), NO_GIT),
  ).snapshot;

describe("the assets the snapshot carries", () => {
  it("names every file under docs/prds/assets as the path a page writes", async () => {
    const root = writeStore({
      ...BASE,
      "docs/prds/assets/shot.svg": "<svg />",
      "docs/prds/assets/nested/deep.png": "png",
    });

    expect((await snapshotOfStore(root)).assets).toEqual([
      "assets/nested/deep.png",
      "assets/shot.svg",
    ]);
  });

  it("skips the dotfiles that would make it differ per machine", async () => {
    const root = writeStore({
      ...BASE,
      "docs/prds/assets/.gitkeep": "",
      "docs/prds/assets/.DS_Store": "junk",
      "docs/prds/assets/shot.svg": "<svg />",
    });

    expect((await snapshotOfStore(root)).assets).toEqual(["assets/shot.svg"]);
  });

  it("is empty, never absent, where the store has no assets at all", async () => {
    expect((await snapshotOfStore(writeStore(BASE))).assets).toEqual([]);
  });
});

describe("the warnings the snapshot carries", () => {
  it("carries no warnings for a store the checker finds clean", async () => {
    expect((await snapshotOfStore(writeStore(BASE))).warnings).toEqual([]);
  });
});

describe("the design-sync report the snapshot carries", () => {
  it("is absent where the check has never run", async () => {
    expect(
      (await snapshotOfStore(writeStore(BASE))).designSync,
    ).toBeUndefined();
  });

  it("reads the committed verdict per component set", async () => {
    const root = writeStore({
      ...BASE,
      ".design-sync/report.json": JSON.stringify({
        generatedAt: "2026-08-30T01:00:00.000Z",
        sets: { "Cart Drawer": "warn", Badge: "ok" },
      }),
    });

    expect((await snapshotOfStore(root)).designSync).toEqual({
      generatedAt: "2026-08-30T01:00:00.000Z",
      sets: { "Cart Drawer": "warn", Badge: "ok" },
    });
  });

  it("refuses a report it cannot read rather than passing it off as no drift", async () => {
    const root = writeStore({
      ...BASE,
      ".design-sync/report.json": JSON.stringify({
        generatedAt: "2026-08-30T01:00:00.000Z",
        sets: { Badge: "green" },
      }),
    });

    await expect(snapshotOfStore(root)).rejects.toThrow(
      /`Badge` is `green`, not ok, warn, skipped or fail/,
    );
  });
});

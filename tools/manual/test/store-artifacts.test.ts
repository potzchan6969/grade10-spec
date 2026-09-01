import { describe, expect, it } from "vitest";
import { NO_GIT } from "../src/store/git.mts";
import { rootsOf } from "../src/store/roots.mts";
import { composeStore } from "../src/store/snapshot.mts";
import { checkWarnings } from "../src/store/warnings.mts";
import { writeStore } from "./tmp-store";

const CONFIG =
  "storybookBase: https://storybook.example\n\ngroups:\n  Products:\n    - demo-product\n";

const HOME = "---\ntitle: Demo\n---\n\nA demo store.\n";
const LANDING = "---\ntitle: Demo product\n---\n\nThe one product.\n";

/** A capability page that names its spec and never gets to acceptance — the
 * shelf gap and the unshown journeys, which is two warning rules in one store. */
const ALPHA_PAGE =
  "---\ntitle: Alpha\nspec: demo-product/alpha\n---\n\nAlpha is a demo capability.\n";

const ALPHA_SPEC = [
  "# Alpha",
  "",
  "## Purpose",
  "",
  "Alpha exists so a page has something to embed.",
  "",
  "## User journeys",
  "",
  "### alpha-US-01: Someone does the thing",
  "",
  "They open alpha and do the thing.",
  "",
  "**Accepted by:**",
  "",
  "- alpha-SC-01",
  "",
  "## Requirements",
  "",
  "### Requirement: Alpha does things",
  "",
  "Alpha SHALL do the thing when asked.",
  "",
  "#### Scenario: alpha-SC-01 - it does the thing",
  "",
  "- **WHEN** asked",
  "- **THEN** it does the thing",
  "",
].join("\n");

const BASE = {
  "manual/manual.yaml": CONFIG,
  "manual/index.md": HOME,
  "manual/products/demo-product/index.md": LANDING,
  "manual/products/demo-product/alpha.md": ALPHA_PAGE,
  "openspec/specs/demo-product/alpha/spec.md": ALPHA_SPEC,
};

const snapshotOfStore = async (root: string) =>
  composeStore(
    rootsOf(root),
    NO_GIT,
    await checkWarnings(rootsOf(root), NO_GIT),
  ).snapshot;

describe("the assets the snapshot carries", () => {
  it("names every file under manual/assets as the path a page writes", async () => {
    const root = writeStore({
      ...BASE,
      "manual/assets/shot.svg": "<svg />",
      "manual/assets/nested/deep.png": "png",
    });

    expect((await snapshotOfStore(root)).assets).toEqual([
      "assets/nested/deep.png",
      "assets/shot.svg",
    ]);
  });

  it("skips the dotfiles that would make it differ per machine", async () => {
    const root = writeStore({
      ...BASE,
      "manual/assets/.gitkeep": "",
      "manual/assets/.DS_Store": "junk",
      "manual/assets/shot.svg": "<svg />",
    });

    expect((await snapshotOfStore(root)).assets).toEqual(["assets/shot.svg"]);
  });

  it("is empty, never absent, where the store has no assets at all", async () => {
    expect((await snapshotOfStore(writeStore(BASE))).assets).toEqual([]);
  });
});

describe("the warnings the snapshot carries", () => {
  it("ships the checker's own warnings, page warnings pointing at their page", async () => {
    const warnings = (await snapshotOfStore(writeStore(BASE))).warnings;

    expect(warnings).toEqual([
      {
        rule: "skeleton",
        message:
          "has a `spec` and neither a `::journeys` nor a `::cases` block — missing its acceptance shelf",
        page: "manual/products/demo-product/alpha.md",
      },
      {
        rule: "journeys",
        message:
          "openspec/specs/demo-product/alpha/spec.md: has 1 journey and no page shows them",
      },
    ]);
  });

  it("carries nothing a failure would have stopped the deploy for", async () => {
    const root = writeStore({
      ...BASE,
      "manual/products/demo-product/alpha.md": ALPHA_PAGE.replace(
        "Alpha is a demo capability.",
        '::journeys{id="demo-product/alpha"}',
      ),
    });

    expect((await snapshotOfStore(root)).warnings).toEqual([]);
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

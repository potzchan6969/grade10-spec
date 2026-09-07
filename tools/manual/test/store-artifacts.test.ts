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
 * shelf gap the skeleton rule warns about. */
const ALPHA_PAGE =
  "---\ntitle: Alpha\nspec: demo-product/alpha\n---\n\nAlpha is a demo capability.\n";

const ALPHA_JOURNEYS = [
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
].join("\n");

const ALPHA_SPEC = [
  "# Alpha",
  "",
  "## Purpose",
  "",
  "Alpha exists so a page has something to embed.",
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

const ALPHA_CASES = [
  "# demo-product/alpha Test Cases",
  "",
  "**Status:** pending-review",
  "",
  "## alpha-US-01: Someone does the thing",
  "",
  "**As a** someone,",
  "**I want** the thing to happen,",
  "**so that** it is done.",
  "",
  "### alpha-TC-01: Someone asks for the thing and it happens",
  "",
  "**Description:** Proves the thing happens on ask.",
  "",
  "**Preconditions:**",
  "",
  "- None.",
  "",
  "**Test data:** None — the case takes no input.",
  "",
  "**Steps:**",
  "",
  "| # | Action | Expected result |",
  "| --- | --- | --- |",
  "| 1 | Ask for the thing. | The thing happens. |",
  "",
  "**Properties:**",
  "",
  "- **Severity:** major",
  "- **Priority:** high",
  "- **Status:** draft",
  "- **Behaviour:** positive",
  "- **Type:** smoke",
  "- **Layer:** e2e",
  "- **Automation status:** manual",
  "- **Testability:** automation",
  "- **Trace:** alpha-SC-01",
  "",
].join("\n");

const BASE = {
  "docs/prds/manual.yaml": CONFIG,
  "docs/prds/index.md": HOME,
  "docs/prds/products/demo-product/index.md": LANDING,
  "docs/prds/products/demo-product/alpha.md": ALPHA_PAGE,
  "openspec/specs/demo-product/alpha/spec.md": ALPHA_SPEC,
  "openspec/specs/demo-product/alpha/user-journeys.md": ALPHA_JOURNEYS,
  "openspec/specs/demo-product/alpha/test-cases.md": ALPHA_CASES,
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
  it("ships the checker's own warnings, page warnings pointing at their page", async () => {
    const warnings = (await snapshotOfStore(writeStore(BASE))).warnings;

    expect(warnings).toEqual([
      {
        rule: "skeleton",
        message:
          "has a `spec` and no `::cases` block — missing its acceptance shelf",
        page: "docs/prds/products/demo-product/alpha.md",
      },
      {
        rule: "suite",
        message:
          "openspec/specs/demo-product/alpha/test-cases.md: holds 1 test case and no page shows them",
      },
    ]);
  });

  it("carries nothing a failure would have stopped the deploy for", async () => {
    const root = writeStore({
      ...BASE,
      "docs/prds/products/demo-product/alpha.md": ALPHA_PAGE.replace(
        "Alpha is a demo capability.",
        '::cases{id="demo-product/alpha"}',
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

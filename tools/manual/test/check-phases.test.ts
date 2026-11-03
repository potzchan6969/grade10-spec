import { describe, expect, it } from "vitest";
import { runChecks } from "../check/check-manual.mjs";
import { NO_GIT } from "../src/store/git.mts";
import { writeStore } from "./tmp-store";

const PAGE = "docs/prds/products/demo/alpha.md";
const REGISTRY = `phases:
  - id: auction
    name: Auction
    env: staging-1
    released: 2026-10-01
  - id: store-launch-1
    name: Store Launch 1
    env: staging-1
`;

async function phaseFindings(body: string, registry: string | null = REGISTRY) {
  const root = writeStore({
    [PAGE]: `---\ntitle: Alpha\n---\n\n${body}\n`,
    ...(registry === null ? {} : { "docs/prds/phases.yaml": registry }),
  });
  const { findings } = await runChecks(root, NO_GIT);
  return findings
    .filter((one: { rule: string }) => one.rule.startsWith("phase"))
    .map((one: { level: string; reason: string }) => [one.level, one.reason]);
}

describe("phase blocks", () => {
  it("pass a page placed whole and a rule placed apart", async () => {
    expect(
      await phaseFindings(
        [
          '::phase{id="store-launch-1" priority="P0"}',
          "",
          "## Orders",
          "",
          '::phase{id="store-launch-1" priority="P2" rules="later"}',
          "",
          "- 🚧 **Now** — built first",
          "- 🚧 **Later** — built next",
        ].join("\n"),
      ),
    ).toEqual([]);
  });

  it("fail an unknown phase, a rule the heading lacks, a rule named twice and two whole blocks", async () => {
    expect(
      await phaseFindings(
        [
          "## Orders",
          "",
          '::phase{id="store-launch-9" priority="P0"}',
          "",
          '::phase{id="store-launch-1" priority="P1"}',
          "",
          '::phase{id="store-launch-1" priority="P1" rules="now,ghost"}',
          "",
          '::phase{id="store-launch-1" priority="P2" rules="now"}',
          "",
          "- **Now** — built first",
        ].join("\n"),
      ),
    ).toEqual([
      [
        "fail",
        "`store-launch-9` under `orders` is not a phase — phases.yaml lists auction, store-launch-1",
      ],
      [
        "fail",
        "`orders` carries two whole blocks — one heading, one phase; name the rest with `rules`",
      ],
      [
        "fail",
        "`rules` under `orders` names `ghost`, a rule `orders` does not hold",
      ],
      ["fail", "`now` is named by two blocks, under `orders` and `orders`"],
    ]);
  });

  it("fail a block inside another block, and a block with no registry", async () => {
    expect(
      await phaseFindings(
        ':::callout{kind="note"}\n::phase{id="store-launch-1" priority="P0"}\n:::',
      ),
    ).toEqual([
      [
        "fail",
        '`::phase{id="store-launch-1"}` sits inside a block — put it under the heading whose lines it covers',
      ],
    ]);
    expect(
      await phaseFindings('::phase{id="auction" priority="P0"}', null),
    ).toEqual([
      ["fail", "`auction` is named, but docs/prds/phases.yaml is missing"],
    ]);
  });

  it("warn on a line built in no phase, and on a released phase", async () => {
    expect(
      await phaseFindings(
        [
          "## Orders",
          "",
          '::phase{id="auction" priority="P0"}',
          "",
          "- **Now** — launched",
          "",
          "## Returns",
          "",
          "- 🚧 **Refund** — being built",
        ].join("\n"),
      ),
    ).toEqual([
      [
        "warn",
        "`orders` names Auction, released 2026-10-01 — its lines read as launched once the block is gone",
      ],
      [
        "warn",
        "**Refund** is being built in no phase on a page that names one — Unplanned until a block covers it",
      ],
    ]);
  });
});

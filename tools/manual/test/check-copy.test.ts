import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { runChecks } from "../check/check-manual.mjs";
import { checkCopy } from "../check/copy.mjs";
import { NO_GIT } from "../src/store/git.mts";
import { writeStore } from "./tmp-store";

/**
 * Copy moves without the store, so a label quoted bare in a spec drifts
 * silently. Where the words are the claim the store cites the key and the
 * words together, and the check holds the words to the English catalogs.
 */

const CATALOGS = {
  "packages/i18n/messages/shared/en/auctionListing.json": JSON.stringify({
    verifyAction: "Verify",
    minimumBidIs: "Minimum bid is {amount}.",
    proof: 'Say "yes"\nthen go',
    tabs: { bids: "Bid placed" },
  }),
  "packages/i18n/messages/shared/en/grading.json": JSON.stringify({
    title: "Grading",
  }),
  "packages/i18n/messages/grade10/en/product.json": JSON.stringify({
    store: "Hong Kong Grade10 Store",
  }),
  "packages/i18n/messages/zzz/en/product.json": JSON.stringify({
    store: "ZZZ Store",
  }),
};

const SPEC = "openspec/specs/demo/alpha/spec.md";

const run = (files: Record<string, string>, fix = false) => {
  const root = writeStore({ ...CATALOGS, ...files });
  const found: string[] = [];
  const rewritten = checkCopy(
    root,
    ["openspec", "docs/prds"],
    (_rule: string, path: string, reason: string) =>
      found.push(`${path} — ${reason}`),
    { fix },
  );
  return { root, found: found.sort(), rewritten };
};

const found = (text: string, path = SPEC) => run({ [path]: text }).found;

describe("a message key cited with its words", () => {
  it("passes when the words are what the catalog holds", () => {
    expect(
      found(
        'A `auctionListing.verifyAction` ("Verify") link, and `auctionListing.minimumBidIs` ("Minimum bid is {amount}.").\n',
      ),
    ).toEqual([]);
  });

  it("reads a nested key, and a quote or line break escaped as JSON writes it", () => {
    expect(
      found(
        '`auctionListing.tabs.bids` ("Bid placed") and `auctionListing.proof` ("Say \\"yes\\"\\nthen go")\n',
      ),
    ).toEqual([]);
  });

  it("passes when any brand's English layer holds the words", () => {
    expect(found('`product.store` ("ZZZ Store")\n')).toEqual([]);
  });

  it("reads a citation the line wrap split from its words", () => {
    expect(
      found('the `auctionListing.verifyAction`\n("Verify") link\n'),
    ).toEqual([]);
  });

  it("fails words that drifted from the catalog, naming what it holds", () => {
    expect(
      found('\nA `auctionListing.verifyAction` ("Verify now") link\n'),
    ).toEqual([
      `${SPEC} — line 2: \`auctionListing.verifyAction\` reads "Verify" in the English catalogs, not "Verify now" — \`pnpm check:manual --fix\` rewrites it`,
    ]);
  });

  it("passes a message's opening words and an ellipsis", () => {
    expect(
      found('`auctionListing.minimumBidIs` ("Minimum bid is…")\n'),
    ).toEqual([]);
  });

  it("fails opening words the message does not open with", () => {
    expect(found('`auctionListing.minimumBidIs` ("Minimum is…")\n')).toEqual([
      `${SPEC} — line 1: \`auctionListing.minimumBidIs\` reads "Minimum bid is {amount}." in the English catalogs, not "Minimum is…" — \`pnpm check:manual --fix\` rewrites it`,
    ]);
  });

  it("fails an ellipsis with no words before it", () => {
    expect(found('`auctionListing.verifyAction` ("…")\n')).toHaveLength(1);
  });

  it("fails a key no catalog holds", () => {
    expect(found('`auctionListing.verifyLink` ("Verify")\n')).toEqual([
      `${SPEC} — line 1: \`auctionListing.verifyLink\` names no message in the English catalogs`,
    ]);
  });

  it("fails a key that names a group of messages", () => {
    expect(found('`auctionListing.tabs` ("Bid placed")\n')).toEqual([
      `${SPEC} — line 1: \`auctionListing.tabs\` names a group of messages, not one`,
    ]);
  });

  it("lists every brand's words when they differ, and offers no rewrite", () => {
    expect(found('`product.store` ("The Store")\n')).toEqual([
      `${SPEC} — line 1: \`product.store\` reads "Hong Kong Grade10 Store" or "ZZZ Store" in the English catalogs, not "The Store"`,
    ]);
  });

  it("checks the manual's pages and the in-flight changes too", () => {
    const { found: both } = run({
      "docs/prds/products/demo/alpha.md": '`grading.title` ("Grade")\n',
      "openspec/changes/probe/proposal.md": '`grading.title` ("Grades")\n',
    });
    expect(both).toHaveLength(2);
  });
});

describe("what is not a copy citation", () => {
  it("leaves a bare key, which is usually an event or a setting", () => {
    expect(found("raises `grading.sweep.repair` naming the value\n")).toEqual(
      [],
    );
  });

  it("leaves a namespace no catalog has, and a file name before a test title", () => {
    expect(
      found(
        '`settle.test.ts` ("spends a coupon") and `grading.test.ts` ("grades")\n',
      ),
    ).toEqual([]);
  });

  it("leaves the archive, which is worded as it shipped", () => {
    expect(
      found(
        '`auctionListing.verifyAction` ("Verify now")\n',
        "openspec/changes/archive/2026-01-01-old/proposal.md",
      ),
    ).toEqual([]);
  });

  it("does nothing in a store with no catalogs", () => {
    const root = writeStore({ [SPEC]: '`grading.title` ("Grade")\n' });
    const seen: string[] = [];
    checkCopy(root, ["openspec"], (...one: string[]) => seen.push(one[2]));
    expect(seen).toEqual([]);
  });
});

describe("--fix", () => {
  it("rewrites drifted words to the one value the catalogs hold", () => {
    const {
      root,
      found: left,
      rewritten,
    } = run(
      {
        [SPEC]:
          'A `auctionListing.verifyAction` ("Verify now") link and `auctionListing.minimumBidIs` ("Minimum is {amount}").\n',
      },
      true,
    );
    expect(left).toEqual([]);
    expect(rewritten).toBe(2);
    expect(readFileSync(join(root, SPEC), "utf8")).toBe(
      'A `auctionListing.verifyAction` ("Verify") link and `auctionListing.minimumBidIs` ("Minimum bid is {amount}.").\n',
    );
  });

  it("keeps a shortened citation as short as it was written", () => {
    const { root, rewritten } = run(
      { [SPEC]: '`auctionListing.minimumBidIs` ("Minimum is…")\n' },
      true,
    );
    expect(rewritten).toBe(1);
    expect(readFileSync(join(root, SPEC), "utf8")).toBe(
      '`auctionListing.minimumBidIs` ("Minimum bid…")\n',
    );
  });

  it("leaves what it cannot settle and still reports it", () => {
    const {
      root,
      found: left,
      rewritten,
    } = run(
      {
        [SPEC]:
          '`product.store` ("The Store") and `auctionListing.verifyLink` ("Verify")\n',
      },
      true,
    );
    expect(rewritten).toBe(0);
    expect(left).toHaveLength(2);
    expect(readFileSync(join(root, SPEC), "utf8")).toContain('("The Store")');
  });
});

describe("check:manual", () => {
  it("reports a drifted citation under the `copy` rule", async () => {
    const root = writeStore({
      ...CATALOGS,
      "docs/prds/manual.yaml":
        "storybookBase: https://storybook.example\n\ngroups:\n  Products:\n    - demo\n",
      "docs/prds/index.md": "---\ntitle: Demo\n---\n\nA demo store.\n",
      "docs/prds/products/demo/index.md":
        '---\ntitle: Demo\n---\n\nThe landing, and a `grading.title` ("Grade") heading.\n',
    });
    const { findings } = await runChecks(root, NO_GIT);
    expect(
      findings
        .filter((one) => one.rule === "copy")
        .map((one) => `${one.level} ${one.path}`),
    ).toEqual(["fail docs/prds/products/demo/index.md"]);
  });
});

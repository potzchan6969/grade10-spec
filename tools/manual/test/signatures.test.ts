import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { describe, expect, it } from "vitest";
import type { PageEntry } from "../src/api/types.ts";
import { rootsOf } from "../src/store/roots.mts";
import {
  signWarningCallouts,
  warningRanges,
} from "../src/store/signatures.mts";

const page = (body: string) => `---\ntitle: Demo\n---\n\n${body}\n`;

describe("where the unsigned warnings sit", () => {
  it("spans an unsigned warning and skips every other callout", () => {
    const source = page(
      ':::callout{kind="note"}\nAn aside.\n:::\n\n:::callout{kind="warning"}\nDrifted.\nStill drifted.\n:::\n\n:::callout{kind="warning" author="@echo" date="2026-08-30"}\nOwned by hand.\n:::',
    );
    expect(warningRanges(source)).toEqual([
      { start: 9, end: 12, signed: false },
      { start: 14, end: 16, signed: true },
    ]);
  });

  it("reads past a fence, outside a callout and inside one", () => {
    const source = page(
      'The guide shows the syntax:\n\n```md\n:::callout{kind="warning"}\nNot a block.\n:::\n```\n\n:::callout{kind="warning"}\nA fence in the body:\n\n```\n:::\n```\n\nStill the same callout.\n:::',
    );
    expect(warningRanges(source)).toEqual([
      { start: 13, end: 21, signed: false },
    ]);
  });
});

const git = (root: string, args: string[], env: Record<string, string> = {}) =>
  execFileSync("git", args, {
    cwd: root,
    env: { ...process.env, ...env },
  });

const commit = (root: string, subject: string, author: string, date: string) =>
  git(
    root,
    [
      "-c",
      `user.name=${author}`,
      "-c",
      "user.email=demo@example.com",
      "commit",
      "-am",
      subject,
    ],
    { GIT_AUTHOR_DATE: date, GIT_COMMITTER_DATE: date },
  );

const PAGE_PATH = "manual/products/demo/alpha.md";

function repoWith(source: string): string {
  const root = mkdtempSync(join(tmpdir(), "manual-signatures-"));
  mkdirSync(dirname(join(root, PAGE_PATH)), { recursive: true });
  writeFileSync(join(root, PAGE_PATH), source);
  git(root, ["init", "-q"]);
  git(root, ["add", "."]);
  return root;
}

describe("deriving the signature from git", () => {
  it("signs each unsigned warning with whoever last shaped it", async () => {
    const first = page(
      ':::callout{kind="warning"}\nDrifted.\n:::\n\n:::callout{kind="warning"}\nAlso drifted.\n:::',
    );
    const root = repoWith(first);
    commit(root, "write both", "Echo", "2026-08-30T10:00:00Z");

    writeFileSync(
      join(root, PAGE_PATH),
      first.replace("Also drifted.", "Drifted differently."),
    );
    commit(root, "reword the second", "Foxtrot", "2026-09-01T10:00:00Z");

    const entry: PageEntry = { path: PAGE_PATH, source: first };
    await signWarningCallouts(rootsOf(root), [entry]);
    expect(entry.warningSignatures).toEqual([
      { author: "Echo", date: "2026-08-30" },
      { author: "Foxtrot", date: "2026-09-01" },
    ]);
  });

  it("leaves an uncommitted callout unsigned, not misattributed", async () => {
    const committed = page(':::callout{kind="warning"}\nDrifted.\n:::');
    const root = repoWith(committed);
    commit(root, "write one", "Echo", "2026-08-30T10:00:00Z");

    const grown = `${committed}\n:::callout{kind="warning"}\nBrand new.\n:::\n`;
    writeFileSync(join(root, PAGE_PATH), grown);

    const entry: PageEntry = { path: PAGE_PATH, source: grown };
    await signWarningCallouts(rootsOf(root), [entry]);
    expect(entry.warningSignatures).toEqual([
      { author: "Echo", date: "2026-08-30" },
      null,
    ]);
  });

  it("writes nothing where git cannot answer", async () => {
    const root = mkdtempSync(join(tmpdir(), "manual-signatures-"));
    mkdirSync(dirname(join(root, PAGE_PATH)), { recursive: true });
    const source = page(':::callout{kind="warning"}\nDrifted.\n:::');
    writeFileSync(join(root, PAGE_PATH), source);

    const entry: PageEntry = { path: PAGE_PATH, source };
    await signWarningCallouts(rootsOf(root), [entry]);
    expect(entry.warningSignatures).toBeUndefined();
  });

  it("touches no page without an unsigned warning", async () => {
    const entry: PageEntry = {
      path: PAGE_PATH,
      source: page(':::callout{kind="note"}\nAn aside.\n:::'),
    };
    await signWarningCallouts(rootsOf("/nowhere"), [entry]);
    expect(entry.warningSignatures).toBeUndefined();
  });
});

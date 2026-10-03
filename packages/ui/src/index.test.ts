import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import * as publicEntry from "./index";

const entry = () =>
  readFileSync(new URL("./index.ts", import.meta.url), "utf8");

/* The collector's vault screens left the site for a new design, and the
 * store's blocks for them went with them. */
const RETIRED_VAULT_NAMES = [
  "VaultAcceptOfferDialog",
  "VaultAcceptOfferDialogCopy",
  "VaultAcceptOfferDialogProps",
  "VaultCases",
  "VaultCasesCard",
  "VaultCasesChip",
  "VaultCasesCopy",
  "VaultCasesIcon",
  "VaultCasesProps",
  "VaultCasesTone",
  "VaultCasesEmpty",
  "VaultCasesEmptyCopy",
  "VaultCasesEmptyProps",
  "VaultCasesEmptyStep",
];

describe("the package entry", () => {
  /* A fixture on the entry reaches every application, where it can stand in
   * for brand copy on a live page; stories and tests import it by path. */
  it("ships no story fixture", () => {
    expect(entry().match(/FIXTURE_\w+|fixtures"/g) ?? []).toEqual([]);
  });

  it("exports none of the vault collector blocks (shared-ui-vault-case-SC-01)", () => {
    const named = new Set(entry().match(/\b\w+\b/g));

    expect(RETIRED_VAULT_NAMES.filter((name) => named.has(name))).toEqual([]);
    expect(
      Object.keys(publicEntry).filter((key) => /^Vault/.test(key)),
    ).toEqual([]);
  });

  it("exports no vault-named confirmation or visit card (shared-ui-vault-case-SC-02)", () => {
    expect(
      Object.keys(publicEntry).filter((key) =>
        /^Vault\w*(Confirm|Visit)/.test(key),
      ),
    ).toEqual([]);
  });

  it("lists no vault collector block (shared-ui-vault-case-SC-03)", () => {
    const blocks = readdirSync(new URL("./blocks", import.meta.url));

    expect(blocks).not.toContain("vault-case");
  });
});

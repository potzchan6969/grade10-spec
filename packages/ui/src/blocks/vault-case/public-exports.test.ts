import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import * as publicEntry from "../../index";
import {
  VaultAcceptOfferDialog,
  type VaultAcceptOfferDialogCopy,
  type VaultAcceptOfferDialogProps,
  VaultCasesEmpty,
  type VaultCasesEmptyCopy,
  type VaultCasesEmptyProps,
  type VaultCasesEmptyStep,
} from "../../index";

// Each block carries a `<Name>Props` and a `<Name>Copy` beside it; a type the
// entry stopped exporting fails here rather than in a consumer.
type PublicVaultTypes = [
  VaultAcceptOfferDialogCopy,
  VaultAcceptOfferDialogProps,
  VaultCasesEmptyCopy,
  VaultCasesEmptyProps,
  VaultCasesEmptyStep,
];

const publicVaultTypes: PublicVaultTypes | undefined = undefined;
void publicVaultTypes;

/** The block sources beside this test: every `.tsx` that is not a story. */
function blockSources(): readonly { name: string; source: string }[] {
  const here = path.dirname(fileURLToPath(import.meta.url));
  return readdirSync(here)
    .filter((name) => name.endsWith(".tsx") && !name.endsWith(".stories.tsx"))
    .map((name) => ({
      name,
      source: readFileSync(path.join(here, name), "utf8"),
    }));
}

/** Every module of this capability a consumer reaches through the entry;
 * the glob leaves the tests out, so importing it registers none of them. */
const capabilityModules = import.meta.glob<Record<string, unknown>>(
  ["./*.{ts,tsx}", "!./*.test.ts", "!./*.stories.tsx", "!./fixtures.ts"],
  { eager: true },
);

const CAPABILITY_EXPORTS = ["VaultAcceptOfferDialog", "VaultCasesEmpty"].sort();

describe("vault case public entry", () => {
  // shared-ui-vault-case-SC-01
  it("exports the two named vault blocks", () => {
    expect([VaultAcceptOfferDialog, VaultCasesEmpty]).toEqual(
      Array.from({ length: 2 }, () => expect.any(Function)),
    );
  });

  // shared-ui-vault-case-SC-01: every value the entry publishes from this
  // capability's modules, found by identity rather than by name, so one the
  // contract does not name fails.
  it("publishes exactly the contract's values from this capability", () => {
    const own = new Set(
      Object.values(capabilityModules).flatMap((module) =>
        Object.values(module),
      ),
    );
    const published = Object.entries(publicEntry)
      .filter(([, value]) => own.has(value))
      .map(([name]) => name)
      .sort();
    expect(published).toEqual(CAPABILITY_EXPORTS);
  });

  // shared-ui-vault-case-SC-02
  it("composes the booking cards rather than redrawing them", () => {
    expect([
      publicEntry.BookingConfirmation,
      publicEntry.BookingManageCard,
    ]).toEqual([expect.any(Function), expect.any(Function)]);
    const redrawn = Object.keys(publicEntry).filter((name) =>
      /^Vault\w*(Confirmation|Visit|Booking|ManageCard)/.test(name),
    );
    expect(redrawn).toEqual([]);
  });

  // shared-ui-vault-case-SC-03
  it("imports no message catalog into a block", () => {
    const offenders = blockSources()
      .filter(({ source }) => source.includes("@grade10/i18n"))
      .map(({ name }) => name);
    expect(offenders).toEqual([]);
  });

  // shared-ui-vault-case-SC-03
  it("asks for no data, route or store in a block", () => {
    const reaches =
      /\bfetch\(|XMLHttpRequest|localStorage|sessionStorage|indexedDB|document\.cookie|window\.location|react-router|@tanstack\/|useNavigate|useQuery|useStore/;
    const offenders = blockSources()
      .filter(({ source }) => reaches.test(source))
      .map(({ name }) => name);
    expect(offenders).toEqual([]);
  });
});

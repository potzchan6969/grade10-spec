import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import * as publicEntry from "../../index";
import {
  EmptyPanel,
  type EmptyPanelCopy,
  type EmptyPanelProps,
  FactCard,
  type FactCardCopy,
  type FactCardProps,
  FactCardSkeleton,
  type FactCardSkeletonCopy,
  type FactCardSkeletonProps,
  type FactRow,
  NoteList,
  type NoteListCopy,
  type NoteListItem,
  type NoteListProps,
  StageRail,
  type StageRailCopy,
  type StageRailProps,
  type StageRailStage,
} from "../../index";

// Each block carries a `<Name>Props` and a `<Name>Copy` beside it; a type the
// entry stopped exporting fails here rather than in a consumer.
type PublicPageBlockTypes = [
  EmptyPanelCopy,
  EmptyPanelProps,
  FactCardCopy,
  FactCardProps,
  FactCardSkeletonCopy,
  FactCardSkeletonProps,
  FactRow,
  NoteListCopy,
  NoteListItem,
  NoteListProps,
  StageRailCopy,
  StageRailProps,
  StageRailStage,
];

const publicPageBlockTypes: PublicPageBlockTypes | undefined = undefined;
void publicPageBlockTypes;

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

/** Every module of this capability a consumer reaches through the entry. */
const capabilityModules = import.meta.glob<Record<string, unknown>>(
  ["./*.{ts,tsx}", "!./*.test.ts", "!./*.stories.tsx", "!./fixtures.ts"],
  { eager: true },
);

const CAPABILITY_EXPORTS = [
  "EmptyPanel",
  "FactCard",
  "FactCardSkeleton",
  "NoteList",
  "StageRail",
].sort();

describe("page blocks public entry", () => {
  // shared-ui-page-blocks-SC-01
  it("exports the five named page blocks", () => {
    expect([
      EmptyPanel,
      FactCard,
      FactCardSkeleton,
      NoteList,
      StageRail,
    ]).toEqual(Array.from({ length: 5 }, () => expect.any(Function)));
  });

  // shared-ui-page-blocks-SC-01
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

  // shared-ui-page-blocks-SC-02
  it("imports no message catalog and asks for no data, route or store", () => {
    const reaches =
      /@grade10\/i18n|\bfetch\(|XMLHttpRequest|localStorage|sessionStorage|indexedDB|document\.cookie|window\.location|react-router|@tanstack\/|useNavigate|useQuery|useStore/;
    const offenders = blockSources()
      .filter(({ source }) => reaches.test(source))
      .map(({ name }) => name);
    expect(offenders).toEqual([]);
  });
});

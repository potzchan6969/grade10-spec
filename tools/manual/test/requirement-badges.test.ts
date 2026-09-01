import { describe, expect, it } from "vitest";
import {
  buildIndex,
  changesForRequirement,
  changesForSpec,
} from "../src/api/derive";
import type { ChangeEntry, Delta } from "../src/api/types";
import { changeEntry, snapshotOf, specEntry } from "./manual-fixture";

const SPEC = "demo-product/loyalty";
const ROW = "Members earn points on qualifying spend";

function indexOf(changes: ChangeEntry[], requirements: string[] = [ROW]) {
  return buildIndex(
    snapshotOf({ specs: [specEntry(SPEC, requirements)], changes }),
  );
}

function delta(
  requirements: Delta["requirements"],
  spec = SPEC,
  kinds = ["MODIFIED"],
): Delta {
  return { spec, kinds, requirements };
}

describe("the changes a requirement row wears", () => {
  it("names the change touching it and how", () => {
    const index = indexOf([
      changeEntry("revise-loyalty", [delta([{ name: ROW, kind: "modified" }])]),
    ]);

    expect(changesForRequirement(index, SPEC, ROW)).toEqual([
      { change: index.changeById.get("revise-loyalty"), kind: "modified" },
    ]);
  });

  it("forgives case and interior whitespace on either side", () => {
    const index = indexOf([
      changeEntry("revise-loyalty", [
        delta([
          {
            name: "  members EARN   points on qualifying spend ",
            kind: "removed",
          },
        ]),
      ]),
    ]);

    expect(
      changesForRequirement(
        index,
        SPEC,
        "Members earn\tpoints on qualifying spend",
      ),
    ).toMatchObject([{ kind: "removed" }]);
  });

  it("badges a rename on the row it renames from, never the name to come", () => {
    const index = indexOf([
      changeEntry("rename-row", [delta([{ name: ROW, kind: "renamed" }])]),
    ]);

    expect(changesForRequirement(index, SPEC, ROW)).toMatchObject([
      { kind: "renamed" },
    ]);
    expect(
      changesForRequirement(index, SPEC, "Members earn points on every order"),
    ).toEqual([]);
  });

  it("stacks every change touching one row, newest movement first", () => {
    const index = indexOf([
      changeEntry("older", [delta([{ name: ROW, kind: "modified" }])], {
        lastMoved: "2026-01-05",
      }),
      changeEntry("newer", [delta([{ name: ROW, kind: "added" }])], {
        lastMoved: "2026-06-05",
      }),
    ]);

    expect(
      changesForRequirement(index, SPEC, ROW).map(({ change }) => change.id),
    ).toEqual(["newer", "older"]);
  });

  it("ignores a delta that touches another spec's row of the same name", () => {
    const index = indexOf([
      changeEntry("elsewhere", [
        delta([{ name: ROW, kind: "modified" }], "demo-product/orders"),
      ]),
    ]);

    expect(changesForRequirement(index, SPEC, ROW)).toEqual([]);
  });

  it("badges no row for a delta that names no requirements, ribbon untouched", () => {
    const index = indexOf([changeEntry("whole-spec", [delta([])])]);

    expect(changesForRequirement(index, SPEC, ROW)).toEqual([]);
    expect(changesForSpec(index, SPEC).map((change) => change.id)).toEqual([
      "whole-spec",
    ]);
  });

  it("survives a snapshot built before the reader named requirements", () => {
    const stale = { spec: SPEC, kinds: ["MODIFIED"] } as unknown as Delta;
    const index = indexOf([changeEntry("old-snapshot", [stale])]);

    expect(changesForRequirement(index, SPEC, ROW)).toEqual([]);
  });
});

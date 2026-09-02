import { describe, expect, it } from "vitest";
import { refsOf } from "../src/store/history.mts";

/** What a commit touched, read off its paths alone. The store's layout is the
 * only thing that says whether a file is a page, a spec, or a change — so the
 * layout is what this asks about. */

describe("classifying a commit's paths", () => {
  it("names a manual page by its path", () => {
    expect(refsOf(["docs/prds/products/demo/alpha.md"])).toEqual([
      { kind: "page", path: "docs/prds/products/demo/alpha.md" },
    ]);
  });

  it("names a capability spec by product and capability", () => {
    expect(refsOf(["openspec/specs/demo/alpha/spec.md"])).toEqual([
      { kind: "spec", id: "demo/alpha" },
    ]);
  });

  it("names a platform topic by the directory holding its spec.md", () => {
    expect(refsOf(["openspec/specs/money-amounts/spec.md"])).toEqual([
      { kind: "spec", id: "money-amounts" },
    ]);
  });

  it("names a change in flight", () => {
    expect(refsOf(["openspec/changes/add-alpha/proposal.md"])).toEqual([
      { kind: "change", id: "add-alpha" },
    ]);
  });

  it("strips the archive stamp off a change that shipped", () => {
    expect(
      refsOf(["openspec/changes/archive/2026-08-01-add-alpha/tasks.md"]),
    ).toEqual([{ kind: "archived", id: "add-alpha" }]);
  });

  it("keeps a path no reader claims as a path", () => {
    expect(refsOf(["docs/prds/manual.yaml", "docs/governance/qa.md"])).toEqual([
      { kind: "file", path: "docs/prds/manual.yaml" },
      { kind: "file", path: "docs/governance/qa.md" },
    ]);
  });

  it("names a thing once however many of its files moved", () => {
    expect(
      refsOf([
        "openspec/specs/demo/alpha/spec.md",
        "openspec/specs/demo/alpha/test-cases.md",
        "openspec/changes/add-alpha/tasks.md",
        "openspec/changes/add-alpha/specs/demo/alpha/spec.md",
      ]),
    ).toEqual([
      { kind: "spec", id: "demo/alpha" },
      { kind: "change", id: "add-alpha" },
    ]);
  });
});

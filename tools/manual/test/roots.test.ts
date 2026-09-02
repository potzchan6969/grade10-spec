import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { resolveRoots, rootsOf } from "../src/store/roots.mts";
import { writeStore } from "./tmp-store";

/** Where the manual and its store are. The content root comes from where the
 * command was run, never from where the viewer's own files sit — a consuming
 * repository runs the viewer out of a submodule, and walking up from there
 * would land on the store's own manual instead of theirs. */

const CONFIG = "storybookBase: https://s.example\ngroups: {}\n";

const contentOnly = () => writeStore({ "docs/prds/manual.yaml": CONFIG });

const wholeStore = () =>
  writeStore({
    "docs/prds/manual.yaml": CONFIG,
    "openspec/specs/.gitkeep": "",
  });

describe("resolving the two roots", () => {
  it("treats one directory holding both as the store documenting itself", () => {
    const root = wholeStore();
    const roots = {
      store: root,
      content: root,
      manual: "docs/prds",
      own: true,
    };
    expect(resolveRoots({ MANUAL_ROOT: root })).toEqual(roots);
    expect(rootsOf(root)).toEqual(roots);
  });

  it("splits them when MANUAL_STORE points elsewhere", () => {
    const content = contentOnly();
    const store = wholeStore();
    expect(resolveRoots({ MANUAL_ROOT: content, MANUAL_STORE: store })).toEqual(
      { store, content, manual: "docs/prds", own: false },
    );
  });

  it("finds the content root by walking up from where the command ran", () => {
    const root = wholeStore();
    const roots = resolveRoots({
      INIT_CWD: join(root, "openspec", "specs"),
    });
    expect(roots.content).toBe(root);
    expect(roots.own).toBe(true);
  });

  it("refuses a MANUAL_ROOT with no manual in it", () => {
    expect(() =>
      resolveRoots({ MANUAL_ROOT: writeStore({ "readme.md": "" }) }),
    ).toThrow(/holds no docs\/prds\/manual\.yaml/);
  });

  /** A repository that mounts the viewer keeps its pages where it likes — an
   * engineering manual has no business under `docs/prds`. */
  it("reads the pages from MANUAL_DIR when one is set", () => {
    const root = writeStore({
      "manual/manual.yaml": CONFIG,
      "openspec/specs/.gitkeep": "",
    });
    expect(
      resolveRoots({ MANUAL_ROOT: root, MANUAL_DIR: "manual/" }).manual,
    ).toBe("manual");
    expect(
      resolveRoots({ INIT_CWD: join(root, "manual"), MANUAL_DIR: "manual" })
        .content,
    ).toBe(root);
    expect(() => resolveRoots({ MANUAL_ROOT: root })).toThrow(
      /holds no docs\/prds\/manual\.yaml/,
    );
  });

  it("refuses a MANUAL_DIR that is not a directory inside the repository", () => {
    for (const dir of ["/abs", "../up", "a//b"]) {
      expect(() => resolveRoots({ MANUAL_DIR: dir })).toThrow(
        /not a directory inside the repository/,
      );
    }
  });

  it("refuses a MANUAL_STORE with no specs in it", () => {
    expect(() =>
      resolveRoots({
        MANUAL_ROOT: contentOnly(),
        MANUAL_STORE: contentOnly(),
      }),
    ).toThrow(/holds no openspec\/specs/);
  });

  /** A content repository names its store or is one; guessing a store for it
   * would show somebody else's plan as this repository's. */
  it("refuses a content root that neither is nor names a store", () => {
    expect(() => resolveRoots({ MANUAL_ROOT: contentOnly() })).toThrow(
      /no openspec\/specs and no openspec\/config\.yaml/,
    );
  });
});

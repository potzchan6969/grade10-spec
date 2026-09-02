import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { NO_GIT } from "../src/store/git.mts";
import {
  readReferences,
  readReferencesReadme,
} from "../src/store/read-references.mts";
import { rootsOf } from "../src/store/roots.mts";
import { composeStore } from "../src/store/snapshot.mts";
import { storeEndpoints } from "../src/store/vite-plugin.mts";
import { writeStore } from "./tmp-store";

/** The store's `docs/references/` read for the manual: the list rides the
 * snapshot, each document is its own artifact, and the README is the landing
 * rather than a document. */

const FIXTURE = fileURLToPath(new URL("./fixtures/store", import.meta.url));

describe("the references a store holds", () => {
  const references = readReferences(FIXTURE, NO_GIT);

  it("reads every document but the README, titled by its heading", () => {
    expect(
      references.map(({ slug, path, title }) => [slug, path, title]),
    ).toEqual([
      ["owner-draft", "docs/references/owner-draft.md", "The owner's draft"],
    ]);
    expect(references[0].text).toContain("## Tiers");
  });

  it("keeps the README for the landing", () => {
    expect(readReferencesReadme(FIXTURE)).toContain("never authoritative");
  });

  it("falls back to the slug when a document has no heading, and to nothing when the directory is missing", () => {
    const root = writeStore({
      "docs/references/bare-notes.md": "Some notes.\n",
    });
    expect(readReferences(root, NO_GIT).map((one) => one.title)).toEqual([
      "bare-notes",
    ]);
    expect(readReferencesReadme(root)).toBeUndefined();
    expect(readReferences(writeStore({}), NO_GIT)).toEqual([]);
  });
});

describe("the references over the wire", () => {
  const root = writeStore({
    "docs/prds/manual.yaml": "storybookBase: https://storybook.example\n",
    "docs/prds/index.md": "---\ntitle: Demo\n---\n\nA demo store.\n",
    "docs/references/README.md": "# References\n\nEvidence.\n",
    "docs/references/a-draft.md": "# A draft\n\n## One\n\nText.\n",
  });
  const artifacts = async () => composeStore(rootsOf(root), NO_GIT);
  const endpoints = storeEndpoints(rootsOf(root), artifacts);

  it("lists them in the snapshot without their text, README beside", async () => {
    const { snapshot } = await artifacts();
    expect(snapshot.references).toEqual([
      { slug: "a-draft", path: "docs/references/a-draft.md", title: "A draft" },
    ]);
    expect(snapshot.referencesReadme).toContain("Evidence.");
  });

  it("answers /api/reference/<slug> with the document, and 404 for one the store lacks", async () => {
    const found = await endpoints({ path: "/api/reference/a-draft" });
    expect(found).toMatchObject({ kind: "json", status: 200 });
    expect((found as { body: { text: string } }).body.text).toContain("## One");

    const missing = await endpoints({ path: "/api/reference/never" });
    expect(missing).toMatchObject({ kind: "json", status: 404 });
  });
});

import { join } from "node:path";
import type { ReferenceDocument } from "../api/types.ts";
import { readText, readTextIfExists, walkFiles } from "./disk.mts";
import type { GitIndex } from "./git.mts";
import { leadingTitle, outline } from "./markdown.mts";

/**
 * The store's `docs/references/`: owner's drafts, competitor research, vendor
 * working notes — what a page or a change cites as its evidence. The manual
 * renders them as they are written, one document per file, so a citation
 * lands in the manual rather than on GitHub. Each is its own artifact: the
 * snapshot carries the list, a reader fetches the one they open.
 *
 * `README.md` is the section's own front matter — what a reference is — and
 * is served as the landing, never as a document.
 */
export const REFERENCES_DIR = "docs/references";

export const REFERENCES_README = `${REFERENCES_DIR}/README.md`;

export function readReferences(
  root: string,
  git: GitIndex,
): ReferenceDocument[] {
  return walkFiles(root, join(root, REFERENCES_DIR), ".md")
    .filter((path) => path !== REFERENCES_README)
    .map((path) => {
      const text = readText(join(root, path));
      const slug = path.slice(REFERENCES_DIR.length + 1, -3);
      const document: ReferenceDocument = {
        slug,
        path,
        title: leadingTitle(outline(text)) ?? slug,
        text,
      };
      const lastCommit = git.commitOf(path);
      if (lastCommit) document.lastCommit = lastCommit;
      return document;
    });
}

/** The landing's prose, when the store wrote one. */
export function readReferencesReadme(root: string): string | undefined {
  return readTextIfExists(join(root, REFERENCES_README));
}

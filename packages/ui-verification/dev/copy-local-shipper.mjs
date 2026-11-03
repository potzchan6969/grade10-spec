import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { applyEdits } from "../src/copy-catalog.mjs";

/** A local workbench ships approved copy by writing this checkout's files. */
export function createLocalCopyShipper({ specRoot }) {
  return {
    async ship(edits) {
      const { files, applied, skipped } = await applyEdits(edits, (path) =>
        readFile(resolve(specRoot, path), "utf8").catch((error) => {
          if (error.code === "ENOENT") return null;
          throw error;
        }),
      );
      for (const file of files)
        await writeFile(resolve(specRoot, file.path), file.text);
      return {
        applied,
        skipped,
        shipment: { kind: "files", paths: files.map((file) => file.path) },
      };
    },
  };
}

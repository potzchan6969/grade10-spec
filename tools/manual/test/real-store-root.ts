import { fileURLToPath } from "node:url";
import { findStoreRoot } from "../src/store/disk.mts";

export const storeRoot = findStoreRoot(
  fileURLToPath(new URL(".", import.meta.url)),
);

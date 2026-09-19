import { useCallback, useSyncExternalStore } from "react";
import { useSnapshotIfAny } from "../api/snapshot-provider";
import { browserKeyStore, STORAGE } from "./config";
import { LocalStore, probeLocalStore } from "./local-store";
import type { ContentStore } from "./store";

/**
 * The editor writes to the dev server's working tree and nowhere else: a
 * session probes for it once, and every surface that can edit — a page, the
 * sidebar, the propose dialog — asks this one module-level value rather than
 * being wrapped to find out. A deployed build has no dev server behind it, so
 * `store` stays null there and every editor surface hides itself.
 *
 * The probe waits for the snapshot: the store writes under the manual's
 * directory, and only the snapshot says which directory that is.
 */

export type EditorSession = {
  status: "probing" | "ready";
  store: ContentStore | null;
};

let state: EditorSession = { status: "probing", store: null };

const listeners = new Set<() => void>();

function set(next: EditorSession): void {
  state = next;
  for (const listener of listeners) listener();
}

let probed = false;

function probe(manualDir: string): void {
  if (probed) return;
  probed = true;
  probeLocalStore().then((local) => {
    set({
      status: "ready",
      store: local ? new LocalStore(manualDir) : null,
    });
  });
}

function subscribe(listener: () => void, manualDir: string | null) {
  listeners.add(listener);
  if (manualDir !== null) probe(manualDir);
  return () => {
    listeners.delete(listener);
  };
}

export function useEditorSession(): EditorSession {
  const snapshot = useSnapshotIfAny();
  const manualDir =
    snapshot?.status === "ready" ? snapshot.snapshot.manualDir : null;
  const subscribeWith = useCallback(
    (listener: () => void) => subscribe(listener, manualDir),
    [manualDir],
  );
  // The server snapshot is the probing state: a render with no browser has no
  // dev server to have probed, and every editor surface stays hidden.
  return useSyncExternalStore(
    subscribeWith,
    () => state,
    () => state,
  );
}

/** The dev server writes as whoever is at the keyboard, and a proposal has to
 * name someone — so the handle is asked for once and remembered here. */
export function rememberedHandle(): string {
  return browserKeyStore.get(STORAGE.handle) ?? "";
}

export function rememberHandle(handle: string): void {
  if (handle !== "") browserKeyStore.set(STORAGE.handle, handle);
}

/** The `KeyStore` this session remembers a handle through — `useHandle`'s own
 * seam, read from here rather than imported straight from `./config`, so a
 * test that already mocks this module can set a key on it directly instead
 * of mocking `api/handle` as well. */
export { browserKeyStore };

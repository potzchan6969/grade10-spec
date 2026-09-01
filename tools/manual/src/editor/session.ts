import { useSyncExternalStore } from "react";
import { browserKeyStore, STORAGE } from "./config";
import { LocalStore, probeLocalStore } from "./local-store";
import type { ContentStore } from "./store";

/**
 * The editor writes to the dev server's working tree and nowhere else: a
 * session probes for it once, and every surface that can edit — a page, the
 * sidebar, the propose dialog — asks this one module-level value rather than
 * being wrapped to find out. A deployed build has no dev server behind it, so
 * `store` stays null there and every editor surface hides itself.
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

function probe(): void {
  if (probed) return;
  probed = true;
  probeLocalStore().then((local) => {
    set({ status: "ready", store: local ? new LocalStore() : null });
  });
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  probe();
  return () => listeners.delete(listener);
}

export function useEditorSession(): EditorSession {
  // The server snapshot is the probing state: a render with no browser has no
  // dev server to have probed, and every editor surface stays hidden.
  return useSyncExternalStore(
    subscribe,
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

/** Anything that changed the working tree says so here; the commit bar looks
 * again when it hears it. */
const writeListeners = new Set<() => void>();

export function onStoreWrite(listener: () => void): () => void {
  writeListeners.add(listener);
  return () => writeListeners.delete(listener);
}

export function noteWrite(): void {
  for (const listener of writeListeners) listener();
}

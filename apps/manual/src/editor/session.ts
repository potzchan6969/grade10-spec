import { useSyncExternalStore } from "react";
import { STORAGE } from "./config";
import { browserKeyStore, GithubStore } from "./github-store";
import { LocalStore, probeLocalStore } from "./local-store";
import type { ContentStore, StoreKind } from "./store";

/**
 * Which store is answering, and the token the hosted one needs. It is one
 * module-level value rather than a context: every surface that can edit —
 * a page, the sidebar, the commit bar — asks the same question, and none of
 * them should have to be wrapped to ask it.
 */

export type EditorSession = {
  status: "probing" | "ready";
  store: ContentStore | null;
  kind: StoreKind | null;
  token: string | null;
};

let state: EditorSession = {
  status: "probing",
  store: null,
  kind: null,
  token: browserKeyStore.get(STORAGE.token),
};

const listeners = new Set<() => void>();

function set(patch: Partial<EditorSession>): void {
  state = { ...state, ...patch };
  for (const listener of listeners) listener();
}

/** The GitHub adapter mutates as it learns its login and PR — republish then. */
function bump(): void {
  set({});
}

function github(): Pick<EditorSession, "store" | "kind" | "token"> {
  const token = browserKeyStore.get(STORAGE.token);
  return {
    token,
    kind: "github",
    store: new GithubStore({ token, onChange: bump }),
  };
}

let probed = false;

function probe(): void {
  if (probed) return;
  probed = true;
  probeLocalStore().then((local) => {
    set(
      local
        ? {
            status: "ready",
            store: new LocalStore(),
            kind: "local",
            token: null,
          }
        : { status: "ready", ...github() },
    );
  });
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  probe();
  return () => listeners.delete(listener);
}

export function useEditorSession(): EditorSession {
  return useSyncExternalStore(subscribe, () => state);
}

export function setGithubToken(token: string | null): void {
  if (token) browserKeyStore.set(STORAGE.token, token);
  else browserKeyStore.remove(STORAGE.token);
  // A different token can be a different person; the remembered login and PR
  // belong to the old one.
  browserKeyStore.remove(STORAGE.login);
  browserKeyStore.remove(STORAGE.pr);
  set({ status: "ready", ...github() });
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

import { useSyncExternalStore } from "react";
import { STORAGE } from "./config";
import { browserKeyStore, GithubStore } from "./github-store";
import { LocalStore, probeLocalStore } from "./local-store";
import type { ContentStore, StoreKind } from "./store";
import {
  readVerdict,
  rememberVerdict,
  type TokenVerdict,
  type VerifyResult,
  verifyToken,
} from "./verify";

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
  /** What GitHub said about that token: who it belongs to and when it dies.
   * Null until it passes, which is what keeps the session read-only. */
  verdict: TokenVerdict | null;
};

let state: EditorSession = {
  status: "probing",
  store: null,
  kind: null,
  token: browserKeyStore.get(STORAGE.token),
  verdict: readVerdict(browserKeyStore, browserKeyStore.get(STORAGE.token)),
};

const listeners = new Set<() => void>();

function set(patch: Partial<EditorSession>): void {
  state = { ...state, ...patch };
  for (const listener of listeners) listener();
}

/** The GitHub adapter mutates as it learns its login and PR, and tears up the
 * verdict when GitHub stops recognising the token — republish then, reading
 * the verdict back from where the adapter left it. */
function bump(): void {
  set({ verdict: readVerdict(browserKeyStore, state.token) });
}

function github(): Omit<EditorSession, "status"> {
  const token = browserKeyStore.get(STORAGE.token);
  return {
    token,
    verdict: readVerdict(browserKeyStore, token),
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
            verdict: null,
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

/**
 * Save a token, once GitHub has answered for it. Nothing is stored on a
 * refusal: an unverified token would buy nothing but a read-only session and
 * a stale failure to explain later.
 */
export async function saveGithubToken(
  token: string,
  http: typeof fetch = fetch,
): Promise<VerifyResult> {
  const result = await verifyToken(token, http);
  if (!result.ok) return result;

  browserKeyStore.set(STORAGE.token, token);
  rememberVerdict(browserKeyStore, result.verdict);
  set({ status: "ready", ...github() });
  return result;
}

export function forgetGithubToken(): void {
  browserKeyStore.remove(STORAGE.token);
  browserKeyStore.remove(STORAGE.verified);
  set({ status: "ready", ...github() });
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

import { useSyncExternalStore } from "react";
import {
  canRefresh,
  forgetRenewal,
  needsRefresh,
  readRenewal,
  rememberRenewal,
  renewGrant,
} from "./auth";
import { STORAGE } from "./config";
import { browserKeyStore, GithubStore } from "./github-store";
import { LocalStore, probeLocalStore } from "./local-store";
import type { ContentStore, StoreKind } from "./store";
import {
  readVerdict,
  rememberVerdict,
  type TokenVerdict,
  verifyToken,
} from "./verify";

/**
 * Which store is answering, and the sign-in the hosted one needs. It is one
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
  /** Why the last verification refused, for the settings dialog to show.
   * A session with no token has no problem — it is simply signed out. */
  problem: string | null;
};

let problem: string | null = null;

let state: EditorSession = {
  status: "probing",
  store: null,
  kind: null,
  token: browserKeyStore.get(STORAGE.token),
  verdict: readVerdict(browserKeyStore, browserKeyStore.get(STORAGE.token)),
  problem: null,
};

const listeners = new Set<() => void>();

function set(patch: Partial<EditorSession>): void {
  state = { ...state, ...patch };
  for (const listener of listeners) listener();
}

/** The GitHub adapter mutates as it learns its login, and tears up the
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
    problem,
  };
}

let probed = false;

function probe(): void {
  if (probed) return;
  probed = true;
  probeLocalStore().then((local) => {
    if (local) {
      set({
        status: "ready",
        store: new LocalStore(),
        kind: "local",
        token: null,
        verdict: null,
        problem: null,
      });
      return;
    }
    set({ status: "ready", ...github() });
    // The sign-in landing page stores a token and no verdict; renewal may be
    // due after a long-closed tab. Both settle in the background.
    void ensureFreshSession();
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

/** The session as it stands right now — for the moment after
 * `ensureFreshSession`, when a hook's closure may hold the store a renewal
 * just replaced. */
export function currentSession(): EditorSession {
  return state;
}

/**
 * Renew the token if it is near its end, and verify it if nobody has. Called
 * on boot and before anything writes, deduped so a burst asks once. It never
 * throws — a session that cannot freshen stays read-only with the reason in
 * `problem`, which is a state the UI already knows how to wear.
 */
let freshening: Promise<void> | null = null;

export function ensureFreshSession(): Promise<EditorSession> {
  if (!freshening) {
    freshening = freshen()
      .catch((cause: unknown) => {
        console.warn("manual: the sign-in could not be refreshed", cause);
      })
      .finally(() => {
        freshening = null;
      });
  }
  return freshening.then(() => state);
}

async function freshen(): Promise<void> {
  if (state.kind !== "github") return;
  const token = browserKeyStore.get(STORAGE.token);
  if (!token) return;

  const renewal = readRenewal(browserKeyStore);
  if (needsRefresh(renewal) && renewal) {
    if (!canRefresh(renewal)) {
      problem =
        "The sign-in has fully expired — sign in with GitHub again to keep saving.";
      set({ status: "ready", ...github() });
      return;
    }
    const renewed = await renewGrant(renewal);
    browserKeyStore.set(STORAGE.token, renewed.token);
    rememberRenewal(browserKeyStore, renewed);
    // The verdict names the old token's fingerprint, so the new one starts
    // unverified and the verification below answers for it.
    set({ status: "ready", ...github() });
  }

  const held = browserKeyStore.get(STORAGE.token);
  if (!held || readVerdict(browserKeyStore, held)) return;
  const result = await verifyToken(held);
  if (result.ok) {
    rememberVerdict(browserKeyStore, result.verdict);
    problem = null;
  } else {
    problem = result.reason;
  }
  set({ status: "ready", ...github() });
}

export function signOut(): void {
  browserKeyStore.remove(STORAGE.token);
  browserKeyStore.remove(STORAGE.verified);
  forgetRenewal(browserKeyStore);
  problem = null;
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

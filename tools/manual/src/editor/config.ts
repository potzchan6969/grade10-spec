export const STORAGE = {
  /** Dev only: the handle a proposal's author line carries. */
  handle: "manual.propose.handle",
  /** Set once the first-visit card has been answered — it never returns. */
  welcome: "manual.welcome",
  /** ISO date of the newest history event this reader has seen. */
  recentSeen: "manual.recent.seen",
  /** Which rail branches and sections this reader holds open or shut. */
  nav: "manual.nav",
} as const;

export type KeyStore = {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
};

export const browserKeyStore: KeyStore = {
  get: (key) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* a browser with storage switched off still edits, it just forgets */
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch {
      /* see above */
    }
  },
};

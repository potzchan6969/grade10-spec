import { useState } from "react";
import { browserKeyStore, type KeyStore, STORAGE } from "../editor/config";

/**
 * Who the reader is, chosen once per browser.
 *
 * The board's Mine filter and My turn both need a handle and neither can ask
 * the store for one: the manual has no sign-in, and the hosted build has
 * nobody to sign in as. So it is asked for once and remembered where the
 * editor already remembers a proposal's author — the same key, because a
 * reader who has told the manual who they are has told it once.
 *
 * The store is a seam, not `localStorage`: a render with no browser behind it
 * reads nothing and asks for a handle, which is exactly what a first visit
 * does.
 */

export type HandleChoice = {
  /** The handle this browser remembers, or nothing where none is set. */
  handle?: string;
  remember: (handle: string) => void;
};

export function useHandle(store: KeyStore = browserKeyStore): HandleChoice {
  const [handle, setHandle] = useState(
    () => store.get(STORAGE.handle) ?? undefined,
  );

  return {
    handle: handle === undefined || handle === "" ? undefined : handle,
    remember: (next) => {
      const written = next.replace(/^@/, "").trim().toLowerCase();
      if (written === "") return;
      store.set(STORAGE.handle, written);
      setHandle(written);
    },
  };
}

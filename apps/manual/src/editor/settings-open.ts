import { useSyncExternalStore } from "react";

/**
 * Whether the token dialog is open, as one module-level value.
 *
 * The dialog is mounted once, beside the page's own actions, and the things
 * that need it are elsewhere: a locked Propose control has to be able to say
 * "Settings" and mean it without knowing who mounted the dialog or being
 * wrapped in a provider to find out.
 */

let open = false;
const listeners = new Set<() => void>();

function publish(next: boolean): void {
  if (open === next) return;
  open = next;
  for (const listener of listeners) listener();
}

export function openSettings(): void {
  publish(true);
}

export function setSettingsOpen(next: boolean): void {
  publish(next);
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useSettingsOpen(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => open,
    () => false,
  );
}

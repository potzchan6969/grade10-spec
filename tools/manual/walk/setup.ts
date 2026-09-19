import { createElement, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../src/index.css";
import { afterEach, beforeEach } from "vitest";

export { FROZEN_NOW, freezeClock, unfreezeClock } from "./frozen-clock";

/**
 * Every `console.error` the browser logs during one test - a warning React
 * or a library prints rather than throws, which a walk that only checks the
 * DOM would otherwise read past. Captured per test, in every file that opens
 * the manual, and raised in `afterEach` rather than inside `openManual`
 * itself: a mount's own warnings can still land after the promise resolves,
 * once the fixture arrives and the real content - rather than a loading
 * skeleton - renders.
 */
const consoleErrors: string[] = [];
let originalConsoleError: typeof console.error;

beforeEach(() => {
  consoleErrors.length = 0;
  originalConsoleError = console.error;
  console.error = (...args: unknown[]) => {
    consoleErrors.push(
      args
        .map((one) =>
          one instanceof Error ? (one.stack ?? one.message) : String(one),
        )
        .join(" "),
    );
    originalConsoleError(...args);
  };
});

afterEach(() => {
  console.error = originalConsoleError;
  if (consoleErrors.length > 0) {
    throw new Error(
      `The browser logged ${consoleErrors.length} console error(s):\n\n${consoleErrors.join("\n---\n")}`,
    );
  }
});

/**
 * How a walk opens the manual: the shell `main.tsx` mounts, at an address, with
 * the app's own stylesheet loaded so a class that hides something hides it.
 *
 * The snapshot comes from `public/fixture-snapshot.json`. `?fixture` asks the
 * loader for it outright rather than leaving the walk to the fallback a failed
 * `/api/snapshot` takes, so one fixed tree is what every walk reads.
 *
 * Called once per file: the router reads the address as the module loads, so a
 * second address is a second walk - or a click, which is what a walk does. An
 * existing `#root` is replaced rather than left beside a new one, so a second
 * call in one session mounts once and a query for a heading never meets two.
 */
export async function openManual(path: string): Promise<void> {
  const url = new URL(path, window.location.origin);
  url.searchParams.set("fixture", "");
  window.history.replaceState(null, "", url);

  const { App } = await import("../src/app");
  document.getElementById("root")?.remove();
  const root = document.createElement("div");
  root.id = "root";
  document.body.append(root);
  createRoot(root).render(createElement(StrictMode, null, createElement(App)));
}

/**
 * The `<dd>` beside a `ChangeStatus` row's `<dt>` — the change page's own
 * labelled facts (Hands, Artifacts, Delivery, Rounds, …), scoped by the
 * label because more than one row can carry the same word inside a chip.
 * Shared here rather than copied into every walk that reads the change page,
 * so the one lookup drifts nowhere.
 */
export function rowFor(label: string): Element {
  const term = Array.from(document.querySelectorAll("dt")).find(
    (dt) => dt.textContent?.trim() === label,
  );
  const value = term?.nextElementSibling;
  if (!value) throw new Error(`no "${label}" row on the change page`);
  return value;
}

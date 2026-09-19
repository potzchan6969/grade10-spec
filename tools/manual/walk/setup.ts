import { createElement, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../src/index.css";

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

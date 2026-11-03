import { createContext, use, useEffect, useState } from "react";
import { useSnapshotData } from "../api/snapshot-provider";
import type { Snapshot } from "../api/types";
import { type DeskApi, httpDesk } from "./client";

/** A page under test hands its own desk in here. */
export const DeskContext = createContext<DeskApi | null>(null);

const MODE_KEY = "manual.desk.mode";

/** `?desk=memory` turns on the in-page desk for this tab, so a demo walks a
 * run with no Worker behind it; any other `?desk=` turns it off again. */
function memoryMode(): boolean {
  const asked = new URLSearchParams(window.location.search).get("desk");
  try {
    if (asked === "memory") sessionStorage.setItem(MODE_KEY, "memory");
    else if (asked) sessionStorage.removeItem(MODE_KEY);
    return sessionStorage.getItem(MODE_KEY) === "memory";
  } catch {
    return asked === "memory";
  }
}

let memory: Promise<DeskApi> | null = null;
let http: DeskApi | null = null;

function resolveDesk(snapshot: Snapshot): DeskApi | Promise<DeskApi> {
  if (!memoryMode()) {
    http ??= httpDesk();
    return http;
  }
  memory ??= import("./memory-demo").then(({ demoDesk }) => demoDesk(snapshot));
  return memory;
}

export function useDesk(): DeskApi | null {
  const given = use(DeskContext);
  const snapshot = useSnapshotData();
  const [desk, setDesk] = useState<DeskApi | null>(() => {
    if (given) return given;
    const found = resolveDesk(snapshot);
    return found instanceof Promise ? null : found;
  });
  useEffect(() => {
    if (given || desk) return;
    let mounted = true;
    Promise.resolve(resolveDesk(snapshot)).then((found) => {
      if (mounted) setDesk(found);
    });
    return () => {
      mounted = false;
    };
  }, [given, desk, snapshot]);
  return given ?? desk;
}

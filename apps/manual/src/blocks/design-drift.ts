import type { DesignSyncClass, DesignSyncReport } from "../api/types";

/**
 * Joining a card to the nightly design-sync verdict.
 *
 * The report is keyed by Figma component-set name, and the checker resolves a
 * name to code by stripping everything but letters and digits and matching a
 * component file's basename. A story id ends in that same component name —
 * `store/cart/CartDrawer` is `store-cart-cartdrawer` — so the join is the
 * checker's own key, read off the story id.
 *
 * `::figma` cards are deliberately not joined: they carry a node id, the report
 * carries names, and only Figma holds the mapping between the two. Matching an
 * author's card title against a set name would be a guess, and a wrong drift
 * badge is worse than none.
 */
const norm = (text: string) => text.replace(/[^a-z0-9]/gi, "").toLowerCase();

const RANK: Record<DesignSyncClass, number> = {
  ok: 0,
  skipped: 1,
  warn: 2,
  fail: 3,
};

/** Both the full library name and the local one after the last ` / `, exactly
 * as the checker looks a set up. */
function keysOf(setName: string): string[] {
  const local = setName.includes(" / ")
    ? setName.slice(setName.lastIndexOf(" / ") + 3)
    : setName;
  return [...new Set([norm(setName), norm(local)])];
}

function verdictsByKey(report: DesignSyncReport): Map<string, DesignSyncClass> {
  const byKey = new Map<string, DesignSyncClass>();
  for (const [name, verdict] of Object.entries(report.sets)) {
    for (const key of keysOf(name)) {
      const now = byKey.get(key);
      // Two sets can normalize alike; the worse verdict is the honest one.
      if (now === undefined || RANK[verdict] > RANK[now])
        byKey.set(key, verdict);
    }
  }
  return byKey;
}

/** Every trailing run of the story's title path, joined the way the checker
 * normalizes a name — the component's own name first, then the wider titles it
 * sits under, so `store/cart/Cart Drawer` still finds `Cart Drawer`. */
function candidateKeys(storyId: string): string[] {
  const parts = storyId.split("--")[0].split("-").filter(Boolean);
  const keys: string[] = [];
  for (let i = parts.length - 1; i >= 0; i -= 1) {
    keys.push(parts.slice(i).join(""));
  }
  return keys;
}

/** The verdict the report holds for a story's component set, or undefined when
 * no set answers to it. */
export function designSyncOf(
  report: DesignSyncReport | undefined,
  storyId: string,
): DesignSyncClass | undefined {
  if (!report) return undefined;
  const byKey = verdictsByKey(report);
  for (const key of candidateKeys(storyId)) {
    const verdict = byKey.get(key);
    if (verdict !== undefined) return verdict;
  }
  return undefined;
}

/** Only a disagreement is worth a badge: `ok` matched, and `skipped` means
 * nothing was compared — neither is drift. */
export function isDrifting(verdict: DesignSyncClass | undefined): boolean {
  return verdict === "warn" || verdict === "fail";
}

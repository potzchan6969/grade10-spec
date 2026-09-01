// Explicit extension: the build's own store modules read this too, and they are
// nodenext — the matcher must be the one the cards use, or a maintenance row
// and a badge could disagree about the same set.
import type { DesignSyncClass, DesignSyncReport } from "../api/types.ts";

/**
 * Joining a card to the nightly design-sync verdict.
 *
 * Two joins, and a wrong badge is worse than none, so neither guesses.
 *
 * A `::story` card carries a Storybook id whose tail is the component's own
 * name — `store/cart/CartDrawer` is `store-cart-cartdrawer` — and the report is
 * keyed by Figma set name, so the two meet on that name. What the id cannot say
 * is where the title ends and the name begins, and taking every trailing run as
 * a candidate is how a set called `Page` put a drift badge on three unrelated
 * whole-page cards. So a run has to be specific to be believed: the whole path,
 * or a name with a second word to its name.
 *
 * A `::figma` card carries a node id, and the report now carries the node map
 * the checker always held in memory — every node a link can name, against the
 * set it belongs to. So a frame badges exactly, and a node id the map does not
 * answer to is a frame deleted or renumbered in Figma, which is its own
 * verdict. Where a frame is an assembly rather than a set, `set=` on the block
 * names the set by hand and `check:manual` holds it to the report's own keys.
 */

const norm = (text: string) => text.replace(/[^a-z0-9]/gi, "").toLowerCase();

/** The name after the last ` / `, exactly as the checker looks a set up. */
const localOf = (name: string) =>
  name.includes(" / ") ? name.slice(name.lastIndexOf(" / ") + 3) : name;

const words = (name: string) => name.split(/[\s/]+/).filter(Boolean).length;

const RANK: Record<DesignSyncClass, number> = {
  ok: 0,
  skipped: 1,
  warn: 2,
  fail: 3,
};

/** A card's verdict. `missing` is this side's own reading of the report rather
 * than a class the checker emits: the run knew every node a link can name, and
 * this card's is not one of them. */
export type DesignVerdict = {
  class: DesignSyncClass | "missing";
  /** The component set the card joined to, when it joined to one. */
  set?: string;
  /** Why, in the checker's own words. */
  messages: string[];
  /** When the run that said so happened. */
  generatedAt: string;
};

function verdictFor(
  report: DesignSyncReport,
  set: string,
  cls: DesignSyncClass,
): DesignVerdict {
  return {
    class: cls,
    set,
    messages: report.messages?.[set] ?? [],
    generatedAt: report.generatedAt,
  };
}

/** The set a story card belongs to, or nothing when no set answers to it. Two
 * set names can answer to the same card; the worse verdict is the honest one. */
export function setForStory(
  report: DesignSyncReport,
  storyId: string,
): string | undefined {
  const parts = storyId.split("--")[0].split("-").filter(Boolean);
  if (parts.length === 0) return undefined;
  // A component's name reaches the id as one segment or as several, depending
  // on whether the story title spells it `CartDrawer` or `Cart Drawer`, so the
  // trailing runs are all candidates. What they are held to is specificity.
  const runs = parts.map((_, i) => ({
    key: parts.slice(i).join(""),
    ahead: i,
  }));

  let best: string | undefined;
  for (const name of Object.keys(report.sets)) {
    const hit = [name, localOf(name)].some((form) => {
      const key = norm(form);
      if (key.length === 0) return false;
      const run = runs.find((one) => one.key === key);
      if (run === undefined) return false;
      // The whole path, or a name with a word of its own to spare. A one-word
      // name is a word like `Page`, `Card` or `List` — half a design system is
      // called that, and letting one reach across a path it says nothing about
      // is how a set named `Page` badged three unrelated whole-page cards.
      return run.ahead <= 1 || words(form) >= 2;
    });
    if (!hit) continue;
    if (best === undefined || RANK[report.sets[name]] > RANK[report.sets[best]])
      best = name;
  }
  return best;
}

export function designSyncOf(
  report: DesignSyncReport | undefined,
  storyId: string,
): DesignVerdict | undefined {
  if (!report) return undefined;
  const set = setForStory(report, storyId);
  return set === undefined
    ? undefined
    : verdictFor(report, set, report.sets[set]);
}

/** The `node-id` a Figma URL carries, written the way the report keys it. Figma
 * writes it both ways — `4735-6493` in a copied link, `4735%3A6493` in an older
 * one — and they name the same node. */
export function nodeIdOf(url: string): string | undefined {
  try {
    return new URL(url).searchParams.get("node-id")?.replace(/:/g, "-");
  } catch {
    return undefined;
  }
}

/** The file key out of `/design/<key>/<name>` or `/file/<key>/<name>`. */
export function fileKeyOf(url: string): string | undefined {
  try {
    const [, kind, key] = new URL(url).pathname.split("/");
    return kind === "design" || kind === "file" ? key || undefined : undefined;
  } catch {
    return undefined;
  }
}

export type FrameCard = { url: string; set?: string };

export function designSyncOfFrame(
  report: DesignSyncReport | undefined,
  block: FrameCard,
): DesignVerdict | undefined {
  if (!report) return undefined;

  // Named by hand, because the frame is an assembly and no node id can join it.
  // A hint, never a loss: a name the report does not know falls through to the
  // node id rather than blanking the card, and `check:manual` is where the
  // typo gets said out loud.
  if (block.set !== undefined) {
    const cls = report.sets[block.set];
    if (cls !== undefined) return verdictFor(report, block.set, cls);
  }

  const id = nodeIdOf(block.url);
  if (id === undefined || report.nodes === undefined) return undefined;
  // A link into some other Figma file was never in this run's scope, so its
  // node being unknown here says nothing at all.
  const file = fileKeyOf(block.url);
  if (report.file !== undefined && file !== undefined && file !== report.file)
    return undefined;

  const set = report.nodes[id];
  if (set === undefined)
    return { class: "missing", messages: [], generatedAt: report.generatedAt };
  const cls = report.sets[set];
  // The node is there; it is a frame or a page rather than a checked component
  // set, so there is no verdict to carry — only the node's own name.
  return cls === undefined ? undefined : verdictFor(report, set, cls);
}

/** Every report key at least one card in the manual reaches. What is left over
 * is a set checked every night that nothing shows. */
export function setsReached(
  report: DesignSyncReport,
  stories: string[],
  frames: FrameCard[],
): Set<string> {
  const reached = new Set<string>();
  for (const id of stories) {
    const set = setForStory(report, id);
    if (set !== undefined) reached.add(set);
  }
  for (const frame of frames) {
    const set = designSyncOfFrame(report, frame)?.set;
    if (set !== undefined) reached.add(set);
  }
  return reached;
}

/** Only a disagreement is worth a loud badge: `ok` matched and `skipped` means
 * nothing was compared. A frame the file no longer holds is the loudest of the
 * three — the card points at nothing. */
export function isDrifting(cls: DesignVerdict["class"] | undefined): boolean {
  return cls === "warn" || cls === "fail" || cls === "missing";
}

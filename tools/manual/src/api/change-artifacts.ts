import { requirementAnchor } from "./anchors";
import { humanize } from "./paths";
import type { ChangeArtifact, ChangeDocument } from "./types";

/**
 * What each artifact of a change is for, in the words the people who write
 * them use. The schema names the files; these say who reads each one and
 * what they leave with. An artifact the schema adds beyond these is labelled
 * from its id and described by nothing — better than a description made up.
 */
const KNOWN: Record<string, { label: string; meaning: string }> = {
  proposal: {
    label: "Product",
    meaning: "The PM-driven proposal: why, what changes, and what does not.",
  },
  decisions: {
    label: "Decisions",
    meaning:
      "The interview's record: this change's goals, its edges, and what was settled.",
  },
  specs: {
    label: "Requirements",
    meaning:
      "The detailed illustration of the proposal — the deltas each capability's spec will fold in.",
  },
  "user-journeys": {
    label: "Journeys",
    meaning:
      "Who walks the requirements, and which scenarios accept each story.",
  },
  "test-cases": {
    label: "Test Cases",
    meaning:
      "The cases, drawn blind from the journeys; the product manager lands them with the requirements.",
  },
  "ui-design": {
    label: "UI",
    meaning: "The visual plan: screens, exports, and states.",
  },
  "tech-design": {
    label: "Tech Design",
    meaning: "The technical implementation's high-level design.",
  },
  tasks: {
    label: "Tasks",
    meaning: "The agent-driven implementation plan, claimed group by group.",
  },
};

export function artifactLabel(name: string): string {
  return KNOWN[name]?.label ?? humanize(name);
}

export function artifactMeaning(name: string): string | undefined {
  return KNOWN[name]?.meaning;
}

/** The artifacts a page can open — the ones that exist. A tab onto a file
 * nobody has written is a dead end; what is missing is the strip's question. */
export function presentArtifacts(document: ChangeDocument): ChangeArtifact[] {
  return document.artifacts.filter((artifact) => artifact.present);
}

/**
 * Which tab a change page opens on. The tabs are the change's own files, and
 * which files it has is the schema's decision — so a tab carried over from
 * another change, or typed into the URL, may name nothing here. The first
 * artifact is what keeps that from being a blank page.
 */
export function resolveTab(
  document: ChangeDocument,
  wanted: string | null,
): string | null {
  const present = presentArtifacts(document);
  if (wanted !== null && present.some((one) => one.name === wanted))
    return wanted;
  return present[0]?.name ?? null;
}

/** The tab a deep link lands in. A permanent id — a scenario, a story, a
 * requirement row, a test case — belongs to one of the three files a
 * capability directory holds, so a hash naming one opens that file's tab
 * whatever tab the link was copied from. */
export function tabForHash(
  document: ChangeDocument,
  hash: string,
): string | null {
  const id = decodeURIComponent(hash.replace(/^#/, ""));
  if (id === "") return null;
  for (const kind of ["journeys", "cases", "specs"] as const) {
    if (!idsOfKind(document, kind).has(id)) continue;
    const artifact = document.artifacts.find(
      (one) => one.kind === kind && one.present,
    );
    if (artifact) return artifact.name;
  }
  return null;
}

/** The ids one of the per-capability files issues, across every delta. */
function idsOfKind(
  document: ChangeDocument,
  kind: "specs" | "journeys" | "cases",
): Set<string> {
  const ids = new Set<string>();
  for (const delta of document.deltas) {
    if (kind === "journeys") {
      for (const journey of delta.journeys ?? []) ids.add(journey.id);
      continue;
    }
    if (kind === "cases") {
      for (const testCase of delta.suite?.cases ?? []) ids.add(testCase.id);
      continue;
    }
    for (const section of delta.sections) {
      for (const requirement of section.requirements) {
        ids.add(requirementAnchor(requirement));
        for (const scenario of requirement.scenarios) {
          if (scenario.id) ids.add(scenario.id);
        }
      }
    }
  }
  return ids;
}

/** Every id the requirements reading renders: rows, scenarios, stories, and
 * test cases across all of a change's deltas. */
export function deltaIds(document: ChangeDocument): Set<string> {
  const ids = new Set<string>();
  for (const delta of document.deltas) {
    for (const journey of delta.journeys ?? []) ids.add(journey.id);
    for (const section of delta.sections) {
      for (const requirement of section.requirements) {
        ids.add(requirementAnchor(requirement));
        for (const scenario of requirement.scenarios) {
          if (scenario.id) ids.add(scenario.id);
        }
      }
    }
    for (const testCase of delta.suite?.cases ?? []) ids.add(testCase.id);
  }
  return ids;
}

/** The artifacts the schema asks for that nobody has written yet, in the
 * order they are written. Empty when the schema is unknown — then nothing can
 * say. */
export function missingArtifacts(document: ChangeDocument): ChangeArtifact[] {
  if (!document.schemaKnown) return [];
  return document.artifacts.filter((artifact) => !artifact.present);
}

import type { SpecEntry } from "../api/types.ts";

/**
 * A proposal is a change with nothing in it but the reason for one: the
 * pm-planning manifest and `proposal.md`, and not a byte more. No delta, no
 * tasks.md — the delta is what discussion is for, and a task list would make
 * the board read a thought as ready to implement.
 *
 * Everything here is pure text, so the same rule serves the browser deciding
 * what to draft and the dev server deciding what it will accept.
 */

export const CHANGES_DIR = "openspec/changes";
export const MANIFEST = ".openspec.yaml";
export const PROPOSAL = "proposal.md";
export const PROPOSAL_SCHEMA = "pm-planning";

/** The only names a proposal directory may hold. */
export const PROPOSAL_FILES = [MANIFEST, PROPOSAL] as const;

/** `archive/` is the fold, not a change; a slug that names it would write a
 * proposal into the history of every change ever archived. */
const RESERVED = new Set(["archive"]);

const SLUG = /^[a-z0-9][a-z0-9-]*$/;
const HANDLE = /^[A-Za-z0-9][A-Za-z0-9_-]*$/;
/** A design lives in one place, and a proposal that points anywhere else is
 * pointing at something this store cannot check. */
const FIGMA_HOST = /^(?:[a-z0-9-]+\.)*figma\.com$/i;
const HEADING = /^#{1,6}\s/m;
const AUTHOR_LINE =
  /^\*\*Author:\*\*\s*@([A-Za-z0-9][A-Za-z0-9_-]*)(?:\s+-\s+(\d{4}-\d{2}-\d{2}))?\s*$/m;
const SLUG_LIMIT = 64;

export type ProposalFile = { path: string; content: string };

export type ProposalDraft = {
  slug: string;
  title: string;
  /** The proposer's own words. Prose, no headings — it becomes `## Why`. */
  why: string;
  /** GitHub handle, without the `@`. */
  author: string;
  /** Requirement, scenario, journey or spec ids the proposal points at. */
  cites: string[];
  /** Optional figma.com URL — the frame the proposal is arguing with. */
  figma?: string;
  /** `YYYY-MM-DD`; the proposal's author line and the manifest share it. */
  date: string;
};

export function today(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

/** The slug a title implies. The proposer can overrule it; both go through
 * `slugProblem` before anything is written. */
export function slugOf(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, SLUG_LIMIT)
    .replace(/-+$/, "");
}

export function slugProblem(slug: string): string | null {
  if (slug === "") return "a slug is required";
  if (slug.length > SLUG_LIMIT)
    return `a slug is at most ${SLUG_LIMIT} characters`;
  if (!SLUG.test(slug)) {
    return "a slug is lower-case letters, digits and dashes, starting with a letter or digit";
  }
  if (RESERVED.has(slug)) return `\`${slug}\` is not a change, it is the fold`;
  return null;
}

export function changeDir(slug: string): string {
  return `${CHANGES_DIR}/${slug}`;
}

export function proposalPaths(slug: string): string[] {
  return PROPOSAL_FILES.map((name) => `${changeDir(slug)}/${name}`);
}

/**
 * The allowlist, and the only place a path becomes writable: a file set is a
 * proposal when every path is one of one new change directory's own two files.
 * Anything else — a durable spec, a delta, a second change, a path that climbs
 * — is named in the refusal rather than filtered out quietly.
 */
export function allowedProposal(
  files: ProposalFile[],
): { slug: string } | { error: string } {
  if (files.length === 0)
    return { error: "a proposal writes at least one file" };
  if (files.length > PROPOSAL_FILES.length) {
    return {
      error: `a proposal writes at most ${PROPOSAL_FILES.length} files`,
    };
  }

  const seen = new Set<string>();
  let slug: string | null = null;

  for (const file of files) {
    if (seen.has(file.path))
      return { error: `\`${file.path}\` is written twice` };
    seen.add(file.path);

    const parts = file.path.split("/");
    const name = parts[3];
    if (
      parts.length !== 4 ||
      `${parts[0]}/${parts[1]}` !== CHANGES_DIR ||
      !(PROPOSAL_FILES as readonly string[]).includes(name)
    ) {
      return {
        error: `\`${file.path}\` is not one of a new change's own files (${proposalPaths("<slug>").join(", ")})`,
      };
    }

    const problem = slugProblem(parts[2]);
    if (problem) return { error: `\`${file.path}\`: ${problem}` };
    if (slug !== null && slug !== parts[2]) {
      return {
        error: `\`${file.path}\` belongs to another change than \`${slug}\``,
      };
    }
    slug = parts[2];
  }

  if (!seen.has(`${changeDir(slug as string)}/${PROPOSAL}`)) {
    return { error: `a proposal without \`${PROPOSAL}\` cannot be read` };
  }
  return { slug: slug as string };
}

/** What a directory listing may hold before a withdrawal will touch it. A file
 * nobody here wrote means someone has since made this a real change. */
export function withdrawProblem(slug: string, names: string[]): string | null {
  const shape = slugProblem(slug);
  if (shape) return shape;
  if (names.length === 0) return `\`${slug}\` holds no files`;
  const extra = names.find(
    (name) => !(PROPOSAL_FILES as readonly string[]).includes(name),
  );
  if (extra !== undefined) {
    return `\`${slug}\` holds \`${extra}\` — this is no longer only a proposal, so withdrawing it is not this tool's call`;
  }
  if (!names.includes(PROPOSAL)) return `\`${slug}\` has no \`${PROPOSAL}\``;
  return null;
}

/**
 * The Figma link, normalized, or "" for one that was not given. A designer's
 * whole argument is often a frame, and the host allowlist is what keeps that
 * from becoming an open redirect in a rendered proposal.
 */
export function figmaLink(url: string | undefined): string {
  const wanted = (url ?? "").trim();
  if (wanted === "") return "";
  let parsed: URL;
  try {
    parsed = new URL(wanted);
  } catch {
    return "";
  }
  if (parsed.protocol !== "https:" || !FIGMA_HOST.test(parsed.hostname)) {
    return "";
  }
  return parsed.toString();
}

export function figmaProblem(url: string | undefined): string | null {
  const wanted = (url ?? "").trim();
  if (wanted === "" || figmaLink(wanted) !== "") return null;
  return "a Figma link is an https://…figma.com/… URL";
}

export function draftProblem(draft: ProposalDraft): string | null {
  const slug = slugProblem(draft.slug);
  if (slug) return slug;
  const title = draft.title.trim();
  if (title === "") return "a title is required";
  if (/[\r\n]/.test(title)) return "a title is one line";
  if (draft.why.trim() === "") return "say why — that is the whole proposal";
  if (HEADING.test(draft.why)) {
    return "a heading in the why would split the proposal in two — write prose";
  }
  if (!HANDLE.test(draft.author)) {
    return "an author is a GitHub handle, without the @";
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(draft.date)) return "a date is YYYY-MM-DD";
  return figmaProblem(draft.figma);
}

/**
 * The bytes. `.openspec.yaml` carries the schema and the created date the
 * board reads; `proposal.md` opens with the title, then the author line the
 * store's proposal rules dictate, then the proposer's words, then the ids the
 * row they proposed from already knew.
 */
export function draftProposal(draft: ProposalDraft): ProposalFile[] {
  const problem = draftProblem(draft);
  if (problem) throw new Error(`cannot draft a proposal: ${problem}`);

  const cites = draft.cites.map(citation).filter((id) => id !== "");
  const figma = figmaLink(draft.figma);
  const body = [
    `# ${draft.title.trim()}`,
    "",
    `**Author:** @${draft.author} - ${draft.date}`,
    "",
    "## Why",
    "",
    normalize(draft.why),
  ];
  if (cites.length > 0 || figma !== "") {
    body.push("", "## References", "");
    body.push(...cites.map((id) => `- \`${id}\``));
    if (figma !== "") body.push(`- Figma: ${figma}`);
  }

  return [
    {
      path: `${changeDir(draft.slug)}/${MANIFEST}`,
      content: `schema: ${PROPOSAL_SCHEMA}\ncreated: ${draft.date}\n`,
    },
    {
      path: `${changeDir(draft.slug)}/${PROPOSAL}`,
      content: `${body.join("\n")}\n`,
    },
  ];
}

/** Who the proposal names, for the guard on withdrawing one. Same line the
 * store reader takes the author from. */
export function authorOf(proposal: string): string | null {
  return AUTHOR_LINE.exec(proposal)?.[1] ?? null;
}

function normalize(text: string): string {
  return text
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+$/gm, "")
    .trim();
}

/** An id is rendered as a code span, so a backtick in one would end it. */
function citation(id: string): string {
  return id.replace(/[`\r\n]/g, " ").trim();
}

export type CitableKind =
  | "spec"
  | "requirement"
  | "scenario"
  | "journey"
  | "case";

export type Citable = {
  id: string;
  title: string;
  kind: CitableKind;
  /** Which capability issued it. The picker searches every spec, so a bare
   * requirement name has to say where it lives. */
  spec: string;
};

/**
 * Every id of a spec a proposal can point at, in the order they are read: the
 * capability itself, its requirements by name (the store issues them no id),
 * everything else by the permanent id `refs.ts` resolves against.
 */
export function citablesOf(spec: SpecEntry): Citable[] {
  const found: Citable[] = [
    { id: spec.id, title: spec.title, kind: "spec", spec: spec.id },
  ];
  for (const requirement of spec.requirements) {
    found.push({
      id: requirement.name,
      title: requirement.name,
      kind: "requirement",
      spec: spec.id,
    });
    for (const scenario of requirement.scenarios) {
      if (scenario.id) {
        found.push({
          id: scenario.id,
          title: scenario.name,
          kind: "scenario",
          spec: spec.id,
        });
      }
    }
  }
  for (const journey of spec.journeys ?? []) {
    found.push({
      id: journey.id,
      title: journey.title,
      kind: "journey",
      spec: spec.id,
    });
  }
  for (const testCase of spec.testCases ?? []) {
    found.push({
      id: testCase.id,
      title: testCase.title,
      kind: "case",
      spec: spec.id,
    });
  }
  return found;
}

/**
 * Every id in the store, the page's own spec first. One idea crosses
 * capabilities — a gift card touches loyalty and membership — and a picker
 * that only offered the page's own spec made the second one uncitable, so the
 * proposal never reached the capability it was half about.
 */
export function citablesAcross(
  specs: SpecEntry[],
  first?: SpecEntry,
): Citable[] {
  const rest = first ? specs.filter((one) => one.id !== first.id) : specs;
  return (first ? [first, ...rest] : rest).flatMap(citablesOf);
}

/**
 * The id ceiling the next author has to clear. The durable file's own highest
 * number understates it — the in-flight deltas issued more, and picking the
 * obvious next number collides with a change nobody reading this page can
 * see.
 */
export function issuedCeiling(spec: SpecEntry | undefined): string | null {
  const sc = spec?.issuedThrough?.sc;
  if (!spec || !sc) return null;
  const capability = spec.id.split("/").pop() ?? spec.id;
  return `${capability} has issued ids through SC-${String(sc).padStart(2, "0")}`;
}

/** What a requirement row knows about itself: the spec it lives in, its own
 * heading, and the scenarios that accept it. */
export function citesForRequirement(
  specId: string,
  requirement: { name: string; scenarios: { id?: string }[] },
): string[] {
  return [
    specId,
    requirement.name,
    ...requirement.scenarios.flatMap((scenario) =>
      scenario.id ? [scenario.id] : [],
    ),
  ];
}

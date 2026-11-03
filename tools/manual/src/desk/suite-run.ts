import type { RunCase, RunSpec, RunWalk, Surface } from "../api/desk.ts";
import { caseParts, readSuite } from "../api/suites.ts";
import type { SuiteEntry } from "../api/types.ts";

/**
 * A run read straight from store suites, the way the run sheet selects one:
 * every live case with its parts, its test data, its walks and the suite's
 * shared words. The memory desk opens one for a demo and the tests open one
 * from the real cart suite; the run sheet writes its own.
 */

const SECTION = /^#{2,3}\s+([a-z0-9-]+)#([a-z0-9-]+):\s*(.+?)\s*$/;
const WALK = /^##\s+(Walk\s+\d+):\s*(.+?)\s*$/;
const CASE = /^#{3,4}\s+(\S+[.-]TC\d+):/;
const CASE_ID = /`([^`\s]+[.-]TC\d+)`/g;
const ROW = /^\s*\|(.*)\|\s*$/;
const DIVIDER = /^\s*\|[\s:|-]+\|\s*$/;

const cells = (line: string): string[] =>
  (ROW.exec(line)?.[1] ?? "").split("|").map((cell) => cell.trim());

export function tableOf(
  text: string,
): { header: string[]; rows: string[][] } | undefined {
  const lines = text.split("\n").filter((line) => ROW.test(line));
  if (lines.length < 2 || !DIVIDER.test(lines[1])) return undefined;
  return {
    header: cells(lines[0]),
    rows: lines.slice(2).map(cells),
  };
}

/** The suite's shared test data: placeholder to what the suite says. */
function sharedData(source: string): Record<string, string> {
  const at = source.indexOf("**Shared test data:**");
  if (at === -1) return {};
  const lines = source.slice(at).split("\n");
  const first = lines.findIndex((line) => ROW.test(line));
  let end = first;
  while (end >= 0 && end < lines.length && ROW.test(lines[end])) end += 1;
  const table =
    first === -1 ? undefined : tableOf(lines.slice(first, end).join("\n"));
  const found: Record<string, string> = {};
  for (const [field, value] of table?.rows ?? []) {
    const name = field?.replace(/`/g, "").trim();
    if (name?.startsWith("<")) found[name] = value ?? "";
  }
  return found;
}

function walksOf(suite: SuiteEntry): RunWalk[] {
  const file = suite.path.slice(suite.path.lastIndexOf("/") + 1);
  const lines = suite.source.split("\n");
  const walks: RunWalk[] = [];
  for (let at = 0; at < lines.length; at += 1) {
    const heading = WALK.exec(lines[at]);
    if (!heading) continue;
    let end = at + 1;
    while (end < lines.length && !/^##\s/.test(lines[end])) end += 1;
    const body = lines.slice(at + 1, end);
    const start: string[] = [];
    const route: RunWalk["route"] = [];
    let part: "start" | "route" | null = null;
    for (const line of body) {
      if (/^\*\*Starting state:\*\*/.test(line)) part = "start";
      else if (/^###\s+Route/.test(line)) part = "route";
      else if (part === "start" && /^\s*[-*]\s+/.test(line))
        start.push(line.replace(/^\s*[-*]\s+/, "").trim());
      else if (part === "route" && /^\d+\.\s+/.test(line))
        route.push({
          step: line.replace(/^\d+\.\s+/, "").trim(),
          expect: "",
          cases: [],
        });
      else if (
        part === "route" &&
        /^\s+[-*]\s+/.test(line) &&
        route.length > 0
      ) {
        const step = route[route.length - 1];
        const text = line.replace(/^\s+[-*]\s+/, "").trim();
        step.cases.push(...[...text.matchAll(CASE_ID)].map((one) => one[1]));
        step.expect = text.replace(CASE_ID, "").trim();
      }
    }
    const number = heading[1].replace(/\D/g, "");
    walks.push({
      id: `${file}#walk-${number}`,
      title: `${heading[1]} · ${heading[2]}`,
      suite: suite.path,
      start,
      route,
    });
    at = end - 1;
  }
  return walks;
}

/** The surfaces in play before anyone marks: a person's two unless the
 * title keeps the case to one, and the automated two once it is automated. */
function surfacesOf(title: string, automation?: string): Surface[] {
  const only = /\[(web|mobile) only\]/i.exec(title)?.[1]?.toLowerCase();
  const person: Surface[] =
    only === "web"
      ? ["web"]
      : only === "mobile"
        ? ["mobile"]
        : ["web", "mobile"];
  const automated = /automated/i.test(automation ?? "");
  const auto: Surface[] = !automated
    ? []
    : only === "web"
      ? ["autoWeb"]
      : only === "mobile"
        ? ["autoMobile"]
        : ["autoWeb", "autoMobile"];
  return [...person, ...auto];
}

/** Where each case sits: the page and section of the suite heading above
 * it. */
function placesOf(
  source: string,
): Map<string, { page: string; section: string; title: string }> {
  const places = new Map<
    string,
    { page: string; section: string; title: string }
  >();
  let place: { page: string; section: string; title: string } | null = null;
  for (const line of source.split("\n")) {
    const section = SECTION.exec(line);
    if (section) {
      place = { page: section[1], section: section[2], title: section[3] };
      continue;
    }
    if (/^##\s/.test(line)) place = null;
    const heading = CASE.exec(line);
    if (heading && place) places.set(heading[1], place);
  }
  return places;
}

export function runCasesOf(suite: SuiteEntry, phase?: string): RunCase[] {
  const dir = suite.path.slice(0, suite.path.lastIndexOf("/"));
  const pagesDir = dir.endsWith("/tests")
    ? dir.slice(0, -"/tests".length)
    : dir;
  const product = /\/products\/([^/]+)\//.exec(suite.path)?.[1];
  const domain = /\/products\/[^/]+\/([^/]+)\//.exec(suite.path)?.[1];
  const places = placesOf(suite.source);
  return readSuite(suite)
    .filter((one) => one.status !== "deprecated")
    .map((one) => {
      const parts = caseParts(one.body);
      const data = parts.other.find((part) => part.label === "Test data");
      const table = data ? tableOf(data.text) : undefined;
      const place = places.get(one.id);
      return {
        id: one.id,
        ...(one.marker ? { marker: one.marker, rev: one.rev } : {}),
        title: one.title,
        suite: one.suite,
        level: "page",
        ...(product ? { product } : {}),
        ...(domain ? { domain } : {}),
        ...(place && product && domain
          ? { capability: `${product}/${domain}/${place.page}` }
          : {}),
        ...(one.severity ? { severity: one.severity } : {}),
        ...(one.priority ? { priority: one.priority } : {}),
        ...(one.status ? { status: one.status } : {}),
        traces: (one.traces ?? []).map(
          (trace) =>
            `${trace.page.slice(pagesDir.length + 1).replace(/\.md$/, "")}${trace.section ? `#${trace.section}` : ""}${trace.rule ? `/${trace.rule}` : ""}`,
        ),
        ...(place
          ? {
              page: `${pagesDir}/${place.page}.md`,
              section: place.section,
              sectionTitle: place.title,
            }
          : {}),
        ...(phase ? { phase } : {}),
        ...(parts.lead ? { lead: parts.lead } : {}),
        given: parts.given,
        steps: parts.steps,
        expect: parts.expect,
        ...(parts.other.filter((part) => part !== data).length > 0
          ? { other: parts.other.filter((part) => part !== data) }
          : {}),
        ...(table ? { data: table } : {}),
        surfaces: surfacesOf(one.title, one.automation),
      } satisfies RunCase;
    });
}

export function runSpecFromSuites(
  suites: SuiteEntry[],
  options: {
    name: string;
    env: string;
    selection: string;
    source: string;
    phase?: string;
  },
): RunSpec {
  const cases = suites.flatMap((suite) => runCasesOf(suite, options.phase));
  return {
    name: options.name,
    env: options.env,
    ...(options.phase ? { phase: options.phase } : {}),
    selection: options.selection,
    source: options.source,
    fingerprint: `${options.source.slice(0, 12)}-${cases.length}`,
    cases,
    walks: suites.flatMap(walksOf),
    placeholders: Object.assign(
      {},
      ...suites.map((suite) => sharedData(suite.source)),
    ),
    exclusions: [],
  };
}

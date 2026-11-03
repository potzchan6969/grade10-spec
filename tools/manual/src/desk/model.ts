import {
  BULK_MARKS,
  MARK_LABEL,
  type Mark,
  type MarkInput,
  type MarkValue,
  type Observation,
  type RowObjects,
  type RunCase,
  type RunRow,
  type RunSpec,
  type RunView,
  type Surface,
} from "../api/desk.ts";

/** The run as the page reads it: rows by case, and each row's current mark
 * per surface, newest winning. */
export type RunReading = {
  view: RunView;
  caseById: Map<string, RunCase>;
  rowsByCase: Map<string, RunRow[]>;
  rowByKey: Map<string, RunRow>;
  current: Map<string, Partial<Record<Surface, Mark>>>;
  /** Every mark a row was given, oldest first. */
  history: Map<string, Mark[]>;
};

export function readRun(view: RunView): RunReading {
  const caseById = new Map(view.spec.cases.map((one) => [one.id, one]));
  const rowsByCase = new Map<string, RunRow[]>();
  for (const row of view.rows) {
    const list = rowsByCase.get(row.case) ?? [];
    list.push(row);
    rowsByCase.set(row.case, list);
  }
  for (const list of rowsByCase.values())
    list.sort((a, b) => a.index - b.index);
  const current = new Map<string, Partial<Record<Surface, Mark>>>();
  const history = new Map<string, Mark[]>();
  for (const mark of [...view.marks].sort((a, b) => a.seq - b.seq)) {
    const row = current.get(mark.row) ?? {};
    row[mark.surface] = mark;
    current.set(mark.row, row);
    history.set(mark.row, [...(history.get(mark.row) ?? []), mark]);
  }
  return {
    view,
    caseById,
    rowsByCase,
    rowByKey: new Map(view.rows.map((row) => [row.key, row])),
    current,
    history,
  };
}

/** A row's answer on one surface: its current mark, else to do where the
 * surface is in play and n/a where it never was. */
export function valueOn(
  reading: RunReading,
  row: RunRow,
  surface: Surface,
): MarkValue {
  const marked = reading.current.get(row.key)?.[surface];
  if (marked) return marked.value;
  const testCase = reading.caseById.get(row.case);
  return testCase?.surfaces.includes(surface) ? "todo" : "na";
}

export type Counts = Record<MarkValue, number> & {
  total: number;
  /** Pass over every row but n/a, as the Summary tab counts it; null when
   * nothing is left to count. */
  rate: number | null;
};

export function surfaceCounts(reading: RunReading, surface: Surface): Counts {
  const counts: Counts = {
    todo: 0,
    pass: 0,
    fail: 0,
    blocked: 0,
    skipped: 0,
    na: 0,
    total: 0,
    rate: null,
  };
  for (const row of reading.view.rows) {
    counts[valueOn(reading, row, surface)] += 1;
    counts.total += 1;
  }
  const counted = counts.total - counts.na;
  counts.rate = counted > 0 ? counts.pass / counted : null;
  return counts;
}

/** Worst first, on one surface: a case shows its worst row. */
const WORST: MarkValue[] = ["fail", "blocked", "todo", "skipped", "pass", "na"];

export function caseResult(
  reading: RunReading,
  caseId: string,
  surface: Surface,
): MarkValue {
  const values = (reading.rowsByCase.get(caseId) ?? []).map((row) =>
    valueOn(reading, row, surface),
  );
  return values.reduce<MarkValue>(
    (found, one) => (WORST.indexOf(one) < WORST.indexOf(found) ? one : found),
    "na",
  );
}

/** A case is done on a surface once none of its rows is left to do. */
export const caseDone = (
  reading: RunReading,
  caseId: string,
  surface: Surface,
): boolean =>
  (reading.rowsByCase.get(caseId) ?? []).every(
    (row) => valueOn(reading, row, surface) !== "todo",
  );

/** A bug marked with no issue linked yet reads so until one is pasted. */
export const NO_ISSUE = "bug · no issue yet";

/** `#1532` for an issue's link, else the link's own words. */
export const issueLabel = (link: string): string => {
  const number =
    /\/issues\/(\d+)/.exec(link)?.[1] ?? /^#?(\d+)$/.exec(link.trim())?.[1];
  return number ? `#${number}` : link;
};

/** `TC19` out of `g10.store-cart.TC19`. */
export const shortId = (id: string): string => /[^.]+$/.exec(id)?.[0] ?? id;

// Filters

export const FILTERS = [
  "product",
  "domain",
  "capability",
  "level",
  "severity",
  "priority",
  "phase",
  "result",
] as const;
export type FilterKey = (typeof FILTERS)[number];
export type Filters = Partial<Record<FilterKey, string>>;

export const FILTER_LABEL: Record<FilterKey, string> = {
  product: "Product",
  domain: "Domain",
  capability: "Capability",
  level: "Level",
  severity: "Severity",
  priority: "Priority",
  phase: "Phase",
  result: "Result",
};

const facet = (
  testCase: RunCase,
  key: Exclude<FilterKey, "result">,
): string | undefined => testCase[key];

/** The values a filter can take in this run, in the order cases first use
 * them; a facet no case carries offers nothing. */
export function filterOptions(
  reading: RunReading,
  key: FilterKey,
  surface: Surface,
): string[] {
  const seen = new Set<string>();
  for (const testCase of reading.view.spec.cases) {
    const value =
      key === "result"
        ? caseResult(reading, testCase.id, surface)
        : facet(testCase, key);
    if (value) seen.add(value);
  }
  return key === "result"
    ? WORST.filter((value) => seen.has(value))
    : [...seen];
}

export const filterValueLabel = (key: FilterKey, value: string): string =>
  key === "result" ? MARK_LABEL[value as MarkValue] : value;

/** The cases a filter shows. The run itself is never touched: a filter only
 * changes what shows. */
export function shownCases(
  reading: RunReading,
  filters: Filters,
  surface: Surface,
): Set<string> {
  const shown = new Set<string>();
  for (const testCase of reading.view.spec.cases) {
    const fits = FILTERS.every((key) => {
      const wanted = filters[key];
      if (!wanted) return true;
      return key === "result"
        ? caseResult(reading, testCase.id, surface) === wanted
        : facet(testCase, key) === wanted;
    });
    if (fits) shown.add(testCase.id);
  }
  return shown;
}

// Grouping

export type SectionGroup = {
  key: string;
  title: string;
  cases: RunCase[];
};

export type PageGroup = {
  key: string;
  title: string;
  /** The page's route, where the manual shows it. */
  sections: SectionGroup[];
};

export type WalkGroup = {
  id: string;
  title: string;
  steps: number;
  seen: number;
  /** The walk's cases in route order, each once. */
  cases: string[];
  /** Its cases that still have rows to do on the surface. */
  open: string[];
};

/** The current tick on each route step of each walk. */
export function currentObservations(
  observations: Observation[],
): Map<string, Observation> {
  const current = new Map<string, Observation>();
  for (const one of observations) {
    const key = `${one.walk}#${one.step}`;
    const held = current.get(key);
    if (!held || held.seq < one.seq) current.set(key, one);
  }
  return current;
}

export function walkCases(spec: RunSpec, walkId: string): string[] {
  const walk = spec.walks.find((one) => one.id === walkId);
  if (!walk) return [];
  const ids = new Set(spec.cases.map((one) => one.id));
  return [...new Set(walk.route.flatMap((step) => step.cases))].filter((id) =>
    ids.has(id),
  );
}

export function walkGroups(reading: RunReading, surface: Surface): WalkGroup[] {
  const ticks = currentObservations(reading.view.observations);
  return reading.view.spec.walks.map((walk) => {
    const cases = walkCases(reading.view.spec, walk.id);
    return {
      id: walk.id,
      title: walk.title,
      steps: walk.route.length,
      seen: walk.route.filter(
        (_, step) => ticks.get(`${walk.id}#${step}`)?.seen,
      ).length,
      cases,
      open: cases.filter((id) => !caseDone(reading, id, surface)),
    };
  });
}

/** Cases by page and section, as the run selected them; a case with no
 * page sits under its suite. Groups keep the order the run lists cases. */
export function pageGroups(
  spec: RunSpec,
  pageTitle: (path: string) => string,
): PageGroup[] {
  const pages = new Map<string, PageGroup>();
  for (const testCase of spec.cases) {
    const pageKey = testCase.page ?? `suite:${testCase.suite}`;
    const page = pages.get(pageKey) ?? {
      key: pageKey,
      title: testCase.page
        ? pageTitle(testCase.page)
        : (testCase.capability ?? suiteTitle(testCase.suite)),
      sections: [],
    };
    pages.set(pageKey, page);
    const sectionKey = testCase.section ?? "";
    let section = page.sections.find((one) => one.key === sectionKey);
    if (!section) {
      section = {
        key: sectionKey,
        title:
          testCase.sectionTitle ??
          (testCase.section ? humanize(testCase.section) : "Whole page"),
        cases: [],
      };
      page.sections.push(section);
    }
    section.cases.push(testCase);
  }
  return [...pages.values()];
}

const humanize = (anchor: string) =>
  anchor.replace(/-/g, " ").replace(/^./, (first) => first.toUpperCase());

function suiteTitle(path: string): string {
  const file = path.slice(path.lastIndexOf("/") + 1).replace(/\.md$/, "");
  return humanize(file.replace(/-tcs$/, ""));
}

// Marking

export type MarkCommand =
  | { kind: "send"; marks: MarkInput[] }
  | { kind: "ask-expectation"; row: string }
  | { kind: "refused"; reason: string };

export const NOT_BULK =
  "A pass or a fail is marked one row at a time; many rows at once only as blocked, skipped, n/a or to do.";

/** What pressing a mark does: one row, or every selected row where the mark
 * may go on many; a fail first asks which expectation broke. */
export function markCommand({
  value,
  surface,
  focus,
  selected,
  hasExpectations,
  makeId,
}: {
  value: MarkValue;
  surface: Surface;
  focus: string | null;
  selected: string[];
  hasExpectations: boolean;
  makeId: () => string;
}): MarkCommand {
  const rows = selected.length > 0 ? selected : focus ? [focus] : [];
  if (rows.length === 0) return { kind: "refused", reason: "No row in focus." };
  if (rows.length > 1) {
    if (!BULK_MARKS.includes(value))
      return { kind: "refused", reason: NOT_BULK };
    return {
      kind: "send",
      marks: rows.map((row) => ({ id: makeId(), row, surface, value })),
    };
  }
  if (value === "fail" && hasExpectations)
    return { kind: "ask-expectation", row: rows[0] };
  return {
    kind: "send",
    marks: [{ id: makeId(), row: rows[0], surface, value }],
  };
}

/** A change to a mark is a newer mark: the old one stays in the row's
 * history. */
export function amend(
  mark: Mark,
  patch: Partial<Pick<Mark, "triage" | "issue" | "note" | "expectation">>,
  makeId: () => string,
): MarkInput {
  const next: MarkInput = {
    id: makeId(),
    row: mark.row,
    surface: mark.surface,
    value: mark.value,
    ...(mark.expectation !== undefined
      ? { expectation: mark.expectation }
      : {}),
    ...(mark.triage ? { triage: mark.triage } : {}),
    ...(mark.issue ? { issue: mark.issue } : {}),
    ...(mark.note ? { note: mark.note } : {}),
  };
  for (const [key, value] of Object.entries(patch) as [
    keyof typeof patch,
    unknown,
  ][]) {
    if (value === undefined || value === "") delete next[key];
    else (next as Record<string, unknown>)[key] = value;
  }
  return next;
}

// The case's own parts

/** A data table's column that says what a row should show. */
const EXPECTED_COLUMN = /expect|result|should|shows|footer|list|outcome/i;

export type ExpectationChoice = { index: number; text: string; from: string };

/** What a fail can name: the case's expectation lines, then the row's own
 * expected cells. Positions past the case's lines name the row's cells, left
 * to right, so the mark keeps one number either way. */
export function expectationChoices(
  testCase: RunCase,
  row: RunRow | undefined,
): ExpectationChoice[] {
  const lines = testCase.expect.map((one, index) => ({
    index,
    text: one.text,
    from: one.step ? `Step ${one.step}` : "Expected",
  }));
  const data = testCase.data;
  if (!data || !row || row.index < 1) return lines;
  const cells = data.rows[row.index - 1] ?? [];
  const extra: ExpectationChoice[] = [];
  data.header.forEach((name, column) => {
    if (EXPECTED_COLUMN.test(name) && cells[column])
      extra.push({
        index: testCase.expect.length + column,
        text: cells[column],
        from: name,
      });
  });
  return [...lines, ...extra];
}

export function expectationText(
  testCase: RunCase,
  row: RunRow | undefined,
  index: number | undefined,
): string | undefined {
  if (index === undefined) return undefined;
  return expectationChoices(testCase, row).find((one) => one.index === index)
    ?.text;
}

/** Each step with the expectations keyed to it, and the rest after; a case
 * of one step takes them all beside it. */
export function stepsBeside(testCase: RunCase): {
  steps: { text: string; expect: string[] }[];
  after: string[];
} {
  const steps = testCase.steps.map((text, at) => ({
    text,
    expect: testCase.expect
      .filter((one) => one.step === at + 1)
      .map((one) => one.text),
  }));
  const loose = testCase.expect
    .filter(
      (one) =>
        one.step === undefined || one.step < 1 || one.step > steps.length,
    )
    .map((one) => one.text);
  if (steps.length === 1) {
    steps[0].expect.push(...loose);
    return { steps, after: [] };
  }
  return { steps, after: loose };
}

// Test data in use

const PLACEHOLDER = /<[A-Za-z][^<>\n`|]*?>/g;

export function placeholdersIn(text: string): string[] {
  return text.match(PLACEHOLDER) ?? [];
}

/** Every placeholder the case's own words use, in reading order. */
export function casePlaceholders(testCase: RunCase): string[] {
  const texts = [
    testCase.lead ?? "",
    ...testCase.given,
    ...testCase.steps,
    ...testCase.expect.map((one) => one.text),
    ...(testCase.data
      ? [...testCase.data.header, ...testCase.data.rows.flat()]
      : []),
    ...(testCase.other ?? []).map((one) => one.text),
  ];
  return [...new Set(texts.flatMap(placeholdersIn))];
}

export type PlaceholderAnswer =
  | { kind: "environment"; value: string }
  | { kind: "follows"; from: string; value?: string }
  | { kind: "asked" };

/** The environment's address and a value that follows from another are
 * never asked; everything else is asked on each row. */
export function placeholderAnswer(
  name: string,
  words: string | undefined,
  env: string,
  known: (name: string) => string | undefined = () => undefined,
): PlaceholderAnswer {
  if (name === "<g10url>") return { kind: "environment", value: env };
  const said = (words ?? "").replace(/`/g, "").trim();
  const owner = /^(<[^<>]+>)'s\s/.exec(said);
  if (owner) return { kind: "follows", from: owner[1] };
  if (/^\S*<[^<>]+>\S*$/.test(said)) {
    const [from] = placeholdersIn(said);
    const base = from === "<g10url>" ? env : (known(from) ?? undefined);
    return {
      kind: "follows",
      from,
      ...(base !== undefined ? { value: said.replace(from, base) } : {}),
    };
  }
  return { kind: "asked" };
}

/** Values other rows of this run used for a placeholder, offered and never
 * taken as given. */
export function offeredValues(
  objects: Record<string, RowObjects>,
  name: string,
  exceptRow: string,
): string[] {
  const values = new Set<string>();
  for (const [row, held] of Object.entries(objects)) {
    if (row === exceptRow) continue;
    const value = held[name];
    if (value) values.add(value);
  }
  return [...values];
}

/** The run's surfaces in a person's reach: Web and Mobile, unless an Auto
 * surface is the one chosen. */
export const MARK_KEYS: Record<string, MarkValue> = {
  p: "pass",
  f: "fail",
  b: "blocked",
  s: "skipped",
  n: "na",
  t: "todo",
};

export type KeyCommand =
  | { kind: "case"; step: 1 | -1 }
  | { kind: "row" }
  | { kind: "mark"; value: MarkValue }
  | { kind: "select" }
  | { kind: "clear" }
  | { kind: "list" };

/** The desk's keys, read from a key press outside a field. */
export function keyCommand(event: {
  key: string;
  metaKey?: boolean;
  ctrlKey?: boolean;
  altKey?: boolean;
}): KeyCommand | null {
  if (event.metaKey || event.ctrlKey || event.altKey) return null;
  const key = event.key;
  if (key === "j") return { kind: "case", step: 1 };
  if (key === "k") return { kind: "case", step: -1 };
  if (key === "Enter") return { kind: "row" };
  if (key === "x") return { kind: "select" };
  if (key === "Escape") return { kind: "clear" };
  if (key === "l") return { kind: "list" };
  const value = MARK_KEYS[key];
  return value ? { kind: "mark", value } : null;
}

/** The case `step` away in the order shown, staying put at either end. */
export function stepCase(
  order: string[],
  at: string | null,
  step: 1 | -1,
): string | null {
  if (order.length === 0) return null;
  const now = at ? order.indexOf(at) : -1;
  if (now === -1) return order[step === 1 ? 0 : order.length - 1];
  return order[Math.min(order.length - 1, Math.max(0, now + step))];
}

/** The next row of the case after the one in focus, or the first row of the
 * next case once the case's rows run out. */
export function nextRow(
  reading: RunReading,
  order: string[],
  focus: { case: string | null; row: string | null },
): { case: string | null; row: string | null } {
  if (!focus.case) {
    const first = order[0] ?? null;
    return { case: first, row: first ? firstRow(reading, first) : null };
  }
  const rows = reading.rowsByCase.get(focus.case) ?? [];
  const at = rows.findIndex((row) => row.key === focus.row);
  if (at >= 0 && at < rows.length - 1)
    return { case: focus.case, row: rows[at + 1].key };
  const next = stepCase(order, focus.case, 1);
  if (!next || next === focus.case) return focus;
  return { case: next, row: firstRow(reading, next) };
}

export const firstRow = (reading: RunReading, caseId: string): string | null =>
  reading.rowsByCase.get(caseId)?.[0]?.key ?? null;

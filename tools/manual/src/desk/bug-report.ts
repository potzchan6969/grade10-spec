import {
  type RowObjects,
  type RunCase,
  type RunRow,
  type RunSummary,
  SURFACE_LABEL,
  type Surface,
} from "../api/desk.ts";

/** The application's bug form; its fields are prefilled by id through the
 * address, as GitHub issue forms take them. */
export const BUG_FORM = "https://github.com/9gag/grade10/issues/new";

export type BugReport = {
  testCase: RunCase;
  row: RunRow | undefined;
  run: RunSummary;
  surface: Surface;
  expectation?: string;
  objects: RowObjects;
  note?: string;
  /** The link back to this row on the desk. */
  back: string;
  /** The tester's browser and window width, as the form asks. */
  browser?: string;
};

function rowData(testCase: RunCase, row: RunRow | undefined): string[] {
  if (!testCase.data || !row || row.index < 1) return [];
  const cells = testCase.data.rows[row.index - 1] ?? [];
  return testCase.data.header.map((name, at) => `${name}: ${cells[at] ?? ""}`);
}

/** The bug form's address, filled from the case, the expectation that
 * broke, the objects the row used and the run. */
export function bugReportUrl(report: BugReport): string {
  const { testCase, row, run, surface } = report;
  const data = rowData(testCase, row);
  const objects = Object.entries(report.objects).map(
    ([name, value]) => `${name}: ${value}`,
  );
  const happened = [
    `Run case ${testCase.id}${row && row.index > 0 ? ` row ${row.index}` : ""} failed on ${SURFACE_LABEL[surface]}: ${testCase.title}`,
    "",
    `Expected: ${report.expectation ?? "(not named)"}`,
    ...(report.note ? ["", `Seen: ${report.note}`] : []),
    ...(data.length > 0
      ? ["", "Row data:", ...data.map((one) => `- ${one}`)]
      : []),
    ...(objects.length > 0
      ? ["", "Objects used:", ...objects.map((one) => `- ${one}`)]
      : []),
    "",
    `Desk: ${report.back}`,
  ].join("\n");
  const steps = [
    ...testCase.given.map((one) => `Given ${one}`),
    ...testCase.steps.map((one, at) => `${at + 1}. ${one}`),
  ].join("\n");
  const params = new URLSearchParams({
    template: "bug_report.yml",
    title: `${testCase.title} (${testCase.id})`,
    "what-happened": happened,
    steps,
    where: `${run.env} · run ${run.name} (${run.id})`,
    environment: [SURFACE_LABEL[surface], report.browser]
      .filter(Boolean)
      .join(" · "),
    spec: [testCase.marker ?? testCase.id, ...testCase.traces].join(" · "),
  });
  return `${BUG_FORM}?${params.toString()}`;
}

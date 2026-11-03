import { execFileSync } from "node:child_process";
import { isDeepStrictEqual } from "node:util";

export const PRINT_ENVIRONMENTS = [
  "staging-1",
  "staging-2",
  "uat",
  "preview",
  "prod",
  "staging",
  "production",
];

const PHASE_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function assertCases(cases) {
  if (!Array.isArray(cases) || !cases.length)
    throw new Error("Invalid printed run identity or environment");
  const ids = new Set();
  for (const one of cases) {
    if (
      !/^\S+$/.test(one.id ?? "") ||
      ids.has(one.id) ||
      (one.marker === null
        ? one.rev !== null
        : !/^TC-[\w-]+$/.test(one.marker ?? "") ||
          !Number.isInteger(one.rev) ||
          one.rev < 1)
    )
      throw new Error("Invalid or duplicate printed case or revision");
    ids.add(one.id);
  }
}

/** A printed run in either shape: a Sheet tab, or a run on the run desk. */
export function assertPrintedRun(run) {
  const common =
    PRINT_ENVIRONMENTS.includes(run.env) &&
    /^[a-f0-9]{40}$/.test(run.sourceCommit ?? "") &&
    (run.phase === undefined || PHASE_ID.test(run.phase));
  const identity =
    run.desk === undefined
      ? /^[1-9]\d*-\S+$/.test(run.tab ?? "") &&
        /^[\w-]+$/.test(run.spreadsheetId ?? "") &&
        Number.isInteger(run.sheetId) &&
        run.sheetId >= 0
      : /^[\w-]+$/.test(run.desk) &&
        typeof run.name === "string" &&
        /^[^\n]*\S[^\n]*$/.test(run.name) &&
        run.name === run.name.trim();
  if (!common || !identity)
    throw new Error("Invalid printed run identity or environment");
  assertCases(run.cases);
  return run;
}

const markerSuffix = (marker) =>
  marker?.match(/(?:^|\.)(TC-[\w-]+)$/)?.[1] ?? null;

/** A desk record — `GET /api/desk/runs/:id/record`, or the run's view — as
 *  the run its print commit names. */
export function deskRunOf(record) {
  const { run, spec } = record ?? {};
  if (!run?.id || !spec || !Array.isArray(spec.cases))
    throw new Error("Not a run desk record: it needs the run and its spec");
  const phase = spec.phase ?? run.phase;
  return assertPrintedRun({
    desk: run.id,
    name: spec.name ?? run.name,
    env: spec.env ?? run.env,
    ...(phase ? { phase } : {}),
    sourceCommit: spec.source ?? run.source,
    cases: spec.cases.map((one) => {
      const marker = markerSuffix(one.marker);
      return { id: one.id, marker, rev: marker ? one.rev : null };
    }),
  });
}

export function printedRunOf(record) {
  if (record?.run && record?.spec) return deskRunOf(record);
  const phase = record.snapshot.options?.phase;
  return assertPrintedRun({
    tab: record.tab,
    spreadsheetId: record.spreadsheetId,
    sheetId: record.sheetId,
    env: record.snapshot.env,
    ...(phase ? { phase } : {}),
    sourceCommit: record.sourceCommit,
    cases: record.snapshot.selected.map((one) => ({
      id: one.id,
      marker: markerSuffix(one.markerId),
      rev: one.markerId ? one.rev : null,
    })),
  });
}

export function printCommitMessage(record) {
  const run = record.cases ? assertPrintedRun(record) : printedRunOf(record);
  const subject =
    run.desk === undefined
      ? `chore(auction): record ${run.tab.replace(/^\d+-/, "")} printed run`
      : `chore(qa): record ${run.name} desk run`;
  const identity =
    run.desk === undefined
      ? `Run: ${run.tab}\nSheet: ${run.spreadsheetId}\nTab: ${run.sheetId}\n`
      : `Run: ${run.name}\nDesk: ${run.desk}\n`;
  return (
    `${subject}\n\n${identity}Test environment: ${run.env}\n` +
    (run.phase ? `Phase: ${run.phase}\n` : "") +
    `Source: ${run.sourceCommit}\n\nPrinted cases:\n` +
    run.cases
      .map(
        (one) =>
          `- ${one.id} | ${one.marker ? `${one.marker}@${one.rev}` : "unmarked"}`,
      )
      .join("\n") +
    "\n"
  );
}

export function parsePrintCommit(message) {
  const text = message.replaceAll("\r\n", "\n").trimEnd();
  const start = text.search(/^Run: /m);
  if (start < 0) {
    if (/^Printed cases:$/m.test(text))
      throw new Error("Printed cases block has no Run header");
    return null;
  }
  if (!/^Printed cases:$/m.test(text)) {
    if (/^(Sheet|Desk): /m.test(text))
      throw new Error("Printed run has no case list");
    return null;
  }
  const match =
    /^Run: ([^\n]+)\n(?:Sheet: ([^\n]+)\nTab: (\d+)|Desk: ([^\n]+))\nTest environment: ([^\n]+)\n(?:Phase: ([^\n]+)\n)?Source: ([^\n]+)\n\nPrinted cases:\n([\s\S]+)$/.exec(
      text.slice(start),
    );
  if (!match) throw new Error("Invalid printed run commit format");
  const cases = match[8].split("\n").map((line) => {
    const row = /^- (\S+) \| (TC-[\w-]+)@([1-9]\d*)$/.exec(line);
    if (row) return { id: row[1], marker: row[2], rev: Number(row[3]) };
    const unmarked = /^- (\S+) \| unmarked$/.exec(line);
    if (unmarked) return { id: unmarked[1], marker: null, rev: null };
    throw new Error("Invalid printed case line");
  });
  const identity =
    match[4] === undefined
      ? { tab: match[1], spreadsheetId: match[2], sheetId: Number(match[3]) }
      : { desk: match[4], name: match[1] };
  return assertPrintedRun({
    ...identity,
    env: match[5],
    ...(match[6] === undefined ? {} : { phase: match[6] }),
    sourceCommit: match[7],
    cases,
  });
}

export const printKey = (run) =>
  run.desk === undefined
    ? `${run.spreadsheetId}:${Number(run.tab.split("-")[0])}`
    : `desk:${run.desk}`;

export function printCommits(root, range) {
  const out = execFileSync(
    "git",
    [
      "log",
      "--format=%H%x00%B%x00",
      "--extended-regexp",
      "--grep=^Run: ",
      "--grep=^Printed cases:$",
      range,
    ],
    { cwd: root, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
  );
  const fields = out.split("\0");
  const found = [];
  for (let i = 0; i + 1 < fields.length; i += 2) {
    const run = parsePrintCommit(fields[i + 1]);
    if (run) found.push({ commit: fields[i].trim(), run });
  }
  return found;
}

export function verifyPrintedRun(run, live, sheets) {
  assertPrintedRun(run);
  if (
    live?.state !== "finalized" ||
    !live.finalizedAt ||
    live.confirmedFingerprint !== live.snapshot?.fingerprint
  )
    throw new Error(
      "Only finalized records can merge; finalization is missing or cancelled",
    );
  if (!isDeepStrictEqual(run, printedRunOf(live)))
    throw new Error(
      "Printed run commit is stale; download the current finalized receipt",
    );
  const sheet = sheets.find((one) => one.properties.sheetId === run.sheetId);
  if (!sheet || sheet.properties.title !== run.tab)
    throw new Error(
      `Run ${Number(run.tab.split("-")[0])}: expected tab '${run.tab}' (gid ${run.sheetId}); ${sheet ? `renamed to '${sheet.properties.title}'` : "tab missing"}. https://docs.google.com/spreadsheets/d/${run.spreadsheetId}/edit#gid=${run.sheetId}`,
    );
}

/** A desk print commit merges only while its run is finalized or closed and
 *  names the same cases, revisions, phase and source as the desk holds. */
export function verifyDeskRun(run, live) {
  assertPrintedRun(run);
  if (!["finalized", "closed"].includes(live?.run?.state))
    throw new Error(
      `Desk run ${run.desk} is ${live?.run?.state ?? "missing"}; only a finalized or closed run can merge`,
    );
  if (!isDeepStrictEqual(run, deskRunOf(live)))
    throw new Error(
      `Desk run ${run.desk}: the print commit is stale; download the current record and replace it`,
    );
}

export const DESK_URL = "https://spec.grade10-stg.com";
export const SERVICE_TOKEN_SECRETS = [
  "CF_ACCESS_CLIENT_ID",
  "CF_ACCESS_CLIENT_SECRET",
];
export const MISSING_SERVICE_TOKEN = `The run desk's Access service token is missing: set ${SERVICE_TOKEN_SECRETS.join(" and ")}`;

/** Where the desk answers and the Access service token's headers; `headers`
 *  is null without the token. The secret only ever travels in a header. */
export function deskAccess(env = process.env) {
  const id = env.CF_ACCESS_CLIENT_ID;
  const secret = env.CF_ACCESS_CLIENT_SECRET;
  return {
    base: (env.DESK_URL || DESK_URL).replace(/\/+$/, ""),
    headers:
      id && secret
        ? { "CF-Access-Client-Id": id, "CF-Access-Client-Secret": secret }
        : null,
  };
}

/** One call to the desk's API. Access answers a refused token with its sign-in
 *  page rather than an error, so anything but JSON is refused by name. */
export async function deskRequest(
  access,
  path,
  { method = "GET", body = null, fetcher = fetch } = {},
) {
  if (!access.headers) throw new Error(MISSING_SERVICE_TOKEN);
  const response = await fetcher(`${access.base}/api/desk${path}`, {
    method,
    redirect: "manual",
    headers: {
      ...access.headers,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const json = (response.headers?.get?.("content-type") ?? "").includes(
    "application/json",
  );
  if (!json)
    throw new Error(
      `The desk did not answer ${method} ${path} (HTTP ${response.status}): Access refused the service token or the desk is not deployed at ${access.base}`,
    );
  const answer = await response.json();
  if (!response.ok)
    throw new Error(
      `The desk refused ${method} ${path} (HTTP ${response.status}): ${answer?.error ?? "no reason given"}`,
    );
  return answer;
}

export async function checkPrintedRuns(
  root,
  {
    token,
    spreadsheetId,
    fetcher = fetch,
    base = "origin/main",
    desk = deskAccess(),
  } = {},
) {
  const pending = printCommits(root, `${base}..HEAD`);
  if (!pending.length) return 0;
  const merged = new Set(
    printCommits(root, base).map((one) => printKey(one.run)),
  );
  const seen = new Set();
  for (const { run } of pending) {
    const key = printKey(run);
    if (run.desk === undefined && run.spreadsheetId !== spreadsheetId)
      throw new Error("Printed run does not match the production spreadsheet");
    if (merged.has(key))
      throw new Error("Printed run is already merged and immutable");
    if (seen.has(key))
      throw new Error("More than one print commit for the same run");
    seen.add(key);
  }
  const sheetRuns = pending.filter(({ run }) => run.desk === undefined);
  const deskRuns = pending.filter(({ run }) => run.desk !== undefined);
  if (deskRuns.length && !desk.headers)
    throw new Error(
      `Desk print commits are checked against the run desk. ${MISSING_SERVICE_TOKEN} as repository secrets.`,
    );
  if (sheetRuns.length) {
    if (!token || !spreadsheetId)
      throw new Error("GOOGLE_ACCESS_TOKEN and TCS_SHEET_ID are required");
    const get = async (suffix) => {
      const response = await fetcher(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}${suffix}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!response.ok)
        throw new Error(
          `Cannot verify live run registry: HTTP ${response.status}`,
        );
      return response.json();
    };
    const meta = await get("?fields=sheets.properties");
    const read = await get(`/values/${encodeURIComponent("'_Run records'")}`);
    if (
      read.values?.[0]?.[0] !== "Run ID" ||
      read.values?.[0]?.[1] !== "Record"
    )
      throw new Error("Run registry header is missing or invalid");
    const records = new Map();
    for (const row of read.values.slice(1)) {
      if (!String(row[0] ?? "").trim()) continue;
      const record = JSON.parse(row.slice(1).join(""));
      if (Number(row[0]) !== record.runId || records.has(record.runId))
        throw new Error("Duplicate or mismatched run id in registry");
      records.set(record.runId, record);
    }
    for (const { run } of sheetRuns)
      verifyPrintedRun(
        run,
        records.get(Number(run.tab.split("-")[0])),
        meta.sheets ?? [],
      );
  }
  for (const { run } of deskRuns)
    verifyDeskRun(
      run,
      await deskRequest(desk, `/runs/${encodeURIComponent(run.desk)}/record`, {
        fetcher,
      }),
    );
  return pending.length;
}

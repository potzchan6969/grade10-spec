import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";
import {
  candidatesAt,
  cellRows,
  git,
  invalidatePublishedRun,
  mergedRecord,
  normalizeExclusions,
  parseRecordRows,
  RECORD_HEADERS,
  recordCells,
  recordPath,
  selectionSnapshot,
  transition,
  validateRecord,
} from "./lib/run-sheet-records.mjs";
import { parseSuite } from "./lib/suites.mjs";
import { commitRun, runBranch } from "./run-sheet-record.mjs";
import { checkRecords, verifyRecord } from "./verify-run-record.mjs";

const SUITE = `# demo/thing/widget Test Cases

## demo.thing.US1: A collector reads

<!-- trace:case id=demo.thing.TC-abc rev=2 covers=demo.thing.SC-abc -->
### demo.thing.US1-TC1: Read the lot

**Classification:**
* **Status:** actual
* **Automation status:** manual
* **Testability:** manual
* **Priority:** high

**Pre-conditions:**
customer is on <lot url>.

**Test data:**
| Field | Value |
| --- | --- |
| lot | An open lot |

**Steps:**
1. Open <lot>.

**Expected Results:**
* <lot> is visible.
`;

const journey = parseSuite(SUITE).journeys[0];
const picked = [
  {
    read: {
      rel: "openspec/specs/demo/thing/widget/feature-tcs.md",
      capabilityId: "demo/thing/widget",
      level: "feature",
    },
    tc: { ...journey.cases[0], journey },
  },
];
const options = {
  name: "auction",
  env: "staging",
  selection: "auction regression",
};
const snapshot = selectionSnapshot(picked, options);
const trial = {
  version: 1,
  state: "trial",
  spreadsheetId: "production-sheet",
  runId: 1,
  sheetId: 42,
  tab: "1-auction",
  sourceCommit: "a".repeat(40),
  snapshot,
  copiedFrom: null,
};
const finalize = (record = trial) =>
  transition(record, "finalize", {
    snapshot: record.snapshot,
    confirmed: record.snapshot.fingerprint,
    now: "2026-10-13T04:00:00Z",
  });
const sheets = [{ properties: { sheetId: 42, title: "1-auction" } }];

test("identical print is a no-op; name, scope, environment, TC content or revision changes rewrite", () => {
  assert.equal(transition(trial, "print", { snapshot }), "unchanged");
  for (const changed of [
    selectionSnapshot(picked, { ...options, name: "another" }),
    selectionSnapshot(picked, { ...options, scope: "auction" }),
    selectionSnapshot(picked, { ...options, env: "production" }),
    selectionSnapshot(
      [{ ...picked[0], tc: { ...picked[0].tc, stepTexts: ["Read again."] } }],
      options,
    ),
    selectionSnapshot(
      [{ ...picked[0], tc: { ...picked[0].tc, markerRev: 3 } }],
      options,
    ),
  ])
    assert.equal(transition(trial, "print", { snapshot: changed }), "rewrite");
});

test("a fingerprint does not depend on source commit, input order or unrelated cases", () => {
  const other = {
    ...picked[0],
    tc: { ...picked[0].tc, id: "demo.thing.US1-TC2", tcNum: 2 },
  };
  assert.equal(
    selectionSnapshot([other, picked[0]], options).fingerprint,
    selectionSnapshot([picked[0], other], options).fingerprint,
  );
  const changedJourney = {
    ...journey,
    cases: [
      ...journey.cases,
      { ...other.tc, stepTexts: ["Unselected change"] },
    ],
  };
  assert.equal(
    selectionSnapshot(
      [{ ...picked[0], tc: { ...picked[0].tc, journey: changedJourney } }],
      options,
    ).fingerprint,
    snapshot.fingerprint,
  );
});

test("finalization requires latest content and its exact human confirmation", () => {
  assert.throws(
    () => transition(trial, "finalize", { snapshot, confirmed: "wrong" }),
    /Confirm/,
  );
  assert.throws(
    () =>
      transition(trial, "finalize", {
        snapshot: { ...snapshot, fingerprint: "changed" },
        confirmed: "changed",
      }),
    /latest main/,
  );
  const finalized = finalize();
  assert.equal(finalized.state, "finalized");
  assert.equal(finalized.confirmedFingerprint, snapshot.fingerprint);
  assert.throws(() => transition(finalized, "print", { snapshot }), /reopen/);
  assert.equal(transition(finalized, "reopen").state, "trial");
  assert.equal(transition(finalized, "reopen").confirmedFingerprint, undefined);
  for (const action of ["print", "finalize", "reopen"])
    assert.throws(
      () => transition(finalized, action, { merged: true, snapshot }),
      /merged/,
    );
});

test("intentional exclusions need reasons and cannot overlap the selection", () => {
  assert.throws(
    () => normalizeExclusions([{ id: "omitted", reason: "" }], picked),
    /reason/,
  );
  assert.throws(
    () =>
      normalizeExclusions(
        [{ id: picked[0].tc.id, reason: "redundant" }],
        picked,
      ),
    /both/,
  );
  assert.throws(
    () =>
      normalizeExclusions(
        [
          { id: "omitted", reason: "a" },
          { id: "omitted", reason: "b" },
        ],
        picked,
      ),
    /twice/,
  );
  assert.deepEqual(
    normalizeExclusions(
      [{ id: "omitted", reason: "  covered elsewhere  " }],
      picked,
    ),
    [{ id: "omitted", reason: "covered elsewhere" }],
  );
});

test("registry chunks preserve a long selection and clear trailing old chunks", () => {
  const large = {
    ...trial,
    snapshot: selectionSnapshot(picked, {
      ...options,
      excluded: [{ id: "omitted", reason: "x".repeat(80000) }],
    }),
  };
  const cells = recordCells(large);
  assert.equal(cells.length, 26);
  assert.ok(cells[2].length > 0);
  assert.deepEqual(
    parseRecordRows([RECORD_HEADERS, cells]).get(1).record,
    large,
  );
  const shorter = recordCells(trial);
  assert.equal(shorter[2], "");
  assert.throws(
    () => parseRecordRows([RECORD_HEADERS, shorter, shorter]),
    /Duplicate/,
  );
});

test("a manifest carries stable marker, revision, selected ids and sheet identity, without results", () => {
  const finalized = finalize();
  assert.equal(validateRecord(finalized), finalized);
  assert.equal(finalized.snapshot.selected[0].markerId, "demo.thing.TC-abc");
  assert.equal(finalized.snapshot.selected[0].rev, 2);
  assert.equal(
    recordPath(finalized.spreadsheetId, 1),
    "docs/test-runs/production-sheet/run-1.json",
  );
  assert.throws(() => recordPath("../bad", 1), /Invalid/);
  assert.throws(
    () => validateRecord({ ...finalized, sandbox: true }),
    /production/,
  );
  assert.throws(
    () =>
      validateRecord({
        ...finalized,
        snapshot: { ...snapshot, name: "tampered" },
      }),
    /fingerprint/,
  );
  assert.equal("results" in finalized, false);
});

test("live verification refuses renamed, missing, stale and reopened runs", () => {
  const record = finalize();
  verifyRecord(record, record, sheets);
  assert.throws(
    () => verifyRecord(record, record, []),
    /Run 1.*tab missing.*gid=42/,
  );
  assert.throws(
    () =>
      verifyRecord(record, record, [
        { properties: { sheetId: 42, title: "renamed" } },
      ]),
    /renamed/,
  );
  assert.throws(
    () => verifyRecord(record, transition(record, "reopen"), sheets),
    /cancelled/,
  );
  assert.throws(() => verifyRecord(trial, trial, sheets), /Only finalized/);
});

function fixture(t) {
  const dir = mkdtempSync(join(tmpdir(), "run-record-test-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const root = join(dir, "repo");
  const origin = join(dir, "origin.git");
  mkdirSync(root);
  execFileSync("git", ["init", "--bare", origin], { stdio: "pipe" });
  execFileSync("git", ["init", "-b", "main", root], { stdio: "pipe" });
  git(root, ["config", "user.email", "test@example.com"]);
  git(root, ["config", "user.name", "Run sheet test"]);
  const file = join(root, "openspec/specs/demo/thing/widget/feature-tcs.md");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, SUITE);
  git(root, ["add", "."]);
  git(root, ["commit", "-m", "test: source"]);
  git(root, ["remote", "add", "origin", origin]);
  git(root, ["push", "-u", "origin", "main"]);
  const sourceCommit = git(root, ["rev-parse", "HEAD"]);
  const actual = selectionSnapshot(candidatesAt(root, sourceCommit), options);
  const record = finalize({ ...trial, snapshot: actual, sourceCommit });
  return { root, record, file };
}

test("trial receipts create no branch or commit; finalized receipts create one commit and repeat as no-op", (t) => {
  const { root, record } = fixture(t);
  assert.throws(
    () => commitRun(root, { ...record, state: "trial" }),
    /Trial prints/,
  );
  const result = commitRun(root, record);
  assert.equal(result.branch, runBranch(record));
  assert.equal(git(root, ["rev-list", "--count", "origin/main..HEAD"]), "1");
  assert.equal(commitRun(root, record).changed, false);
  assert.deepEqual(
    JSON.parse(
      readFileSync(
        join(root, recordPath(record.spreadsheetId, record.runId)),
        "utf8",
      ),
    ),
    record,
  );
  assert.equal(git(root, ["status", "--porcelain"]), "");
});

test("replacement keeps one commit and requires explicit replace; merged runs refuse replacement", (t) => {
  const { root, record } = fixture(t);
  commitRun(root, record);
  const replacement = { ...record, finalizedAt: "2026-10-13T05:00:00Z" };
  assert.throws(() => commitRun(root, replacement), /--replace/);
  commitRun(root, replacement, { replace: true });
  assert.equal(git(root, ["rev-list", "--count", "origin/main..HEAD"]), "1");
  git(root, ["push", "origin", "HEAD:main"]);
  assert.throws(
    () => commitRun(root, replacement, { replace: true }),
    /merged/,
  );
  assert.deepEqual(
    mergedRecord(root, record.spreadsheetId, record.runId),
    replacement,
  );
});

test("cancellation removes only the dedicated print commit; unrelated work refuses rewriting", (t) => {
  const { root, record } = fixture(t);
  commitRun(root, record);
  const reopened = transition(record, "reopen");
  assert.equal(commitRun(root, reopened, { cancel: true }).cancelled, true);
  assert.equal(git(root, ["rev-list", "--count", "origin/main..HEAD"]), "0");
  assert.equal(git(root, ["status", "--porcelain"]), "");
  commitRun(root, record);
  writeFileSync(join(root, "unrelated.txt"), "unrelated");
  assert.throws(
    () => commitRun(root, record, { replace: true }),
    /clean checkout/,
  );
  git(root, ["add", "unrelated.txt"]);
  git(root, ["commit", "-m", "test: unrelated"]);
  assert.throws(
    () => commitRun(root, record, { replace: true }),
    /more than one commit/,
  );
});

test("merge checker verifies the production registry and refuses edits to merged manifests", async (t) => {
  const { root, record } = fixture(t);
  commitRun(root, record);
  const fetcher = async (url) => ({
    ok: true,
    json: async () =>
      url.includes("/values/")
        ? { values: [RECORD_HEADERS, recordCells(record)] }
        : { sheets },
  });
  assert.equal(
    await checkRecords(root, {
      token: "test",
      spreadsheetId: record.spreadsheetId,
      fetcher,
    }),
    1,
  );
  await assert.rejects(
    checkRecords(root, {
      token: "test",
      spreadsheetId: record.spreadsheetId,
      fetcher: async () => ({ ok: false, status: 403 }),
    }),
    /HTTP 403/,
  );
  git(root, ["push", "origin", "HEAD:main"]);
  git(root, ["fetch", "origin", "main"]);
  writeFileSync(
    join(root, recordPath(record.spreadsheetId, record.runId)),
    JSON.stringify({ ...record, finalizedAt: "changed" }),
  );
  git(root, ["add", "."]);
  git(root, ["commit", "-m", "test: try editing merged run"]);
  await assert.rejects(
    checkRecords(root, {
      token: "test",
      spreadsheetId: record.spreadsheetId,
      fetcher,
    }),
    /immutable/,
  );
});

test("reopening a published run invalidates that branch's earlier green status", (t) => {
  const { root, record } = fixture(t);
  commitRun(root, record);
  assert.equal(
    invalidatePublishedRun(root, record, {
      postStatus: () => assert.fail("not published"),
    }),
    false,
  );
  git(root, ["push", "origin", runBranch(record)]);
  const seen = [];
  assert.equal(
    invalidatePublishedRun(root, record, {
      postStatus: (sha) => seen.push(sha),
    }),
    true,
  );
  assert.deepEqual(seen, [git(root, ["rev-parse", "HEAD"])]);
});

test("the merge workflow detects JSON manifests and executes only main's checker", (t) => {
  const { root, record } = fixture(t);
  const workflow = parseYaml(
    readFileSync(
      new URL(
        "../../.github/workflows/finalized-run-records.yml",
        import.meta.url,
      ),
      "utf8",
    ),
  );
  const steps = workflow.jobs.verify.steps;
  assert.equal(steps[0].with.ref, "main");
  assert.match(
    steps.find((step) => step.id === "verify").run,
    /^node trusted\/scripts\/openspec\/verify-run-record.mjs/,
  );
  assert.equal(workflow.permissions.statuses, "write");
  const output = join(dirname(root), "github-output.txt");
  const detect = () => {
    writeFileSync(output, "");
    execFileSync(
      "bash",
      [
        "-e",
        "-o",
        "pipefail",
        "-c",
        steps.find((step) => step.id === "changes").run,
      ],
      { cwd: root, env: { ...process.env, GITHUB_OUTPUT: output } },
    );
    return readFileSync(output, "utf8").trim();
  };
  assert.equal(detect(), "records=false");
  commitRun(root, record);
  assert.equal(detect(), "records=true");
});

test("the writer prints, skips identical rewrites, renames, finalizes and locks a merged run", (t) => {
  const { root, file } = fixture(t);
  const sourceRoot = fileURLToPath(new URL("../..", import.meta.url));
  for (const rel of [
    "scripts/openspec/run-sheet.mjs",
    "scripts/openspec/lib/args.mjs",
    "scripts/openspec/lib/suites.mjs",
    "scripts/openspec/lib/decided-by.mjs",
    "scripts/openspec/lib/feature-set.mjs",
    "scripts/openspec/lib/select-cases.mjs",
    "scripts/openspec/lib/run-sheet-layout.mjs",
    "scripts/openspec/lib/run-sheet-records.mjs",
    "tools/manual/src/store/markdown.mts",
  ]) {
    mkdirSync(dirname(join(root, rel)), { recursive: true });
    copyFileSync(join(sourceRoot, rel), join(root, rel));
  }
  writeFileSync(
    file,
    SUITE +
      `

<!-- trace:case id=demo.thing.TC-def rev=1 covers=demo.thing.SC-def -->
### demo.thing.US1-TC2: Read another lot

**Classification:**
* **Status:** actual
* **Priority:** low
* **Automation status:** manual
* **Testability:** manual

**Pre-conditions:** None.

**Steps:**
1. Read another lot.

**Expected Results:**
* Another lot is visible.
`,
  );
  git(root, ["add", "."]);
  git(root, ["commit", "-m", "test: writer"]);
  git(root, ["push", "origin", "main"]);
  const scratch = dirname(root);
  const stateFile = join(scratch, "sheet-state.json");
  const receipt = join(scratch, "run-record.json");
  const mock = join(scratch, "sheets-mock.mjs");
  writeFileSync(
    stateFile,
    JSON.stringify({ next: 40, sheets: [], data: {}, log: [] }),
  );
  writeFileSync(
    mock,
    `
    import {readFileSync, writeFileSync} from 'node:fs';
    const file = process.env.MOCK_SHEETS_STATE;
    globalThis.fetch = async (url, options = {}) => {
      if (!url.startsWith('https://sheets.googleapis.com/')) throw new Error('Unexpected network call');
      const state = JSON.parse(readFileSync(file, 'utf8'));
      const method = options.method ?? 'GET';
      const body = options.body ? JSON.parse(options.body) : null;
      const parsed = new URL(url);
      const path = decodeURIComponent(parsed.pathname);
      state.log.push({method, path, body});
      let answer = {};
      if (method === 'GET' && !path.includes('/values/')) answer = {sheets: state.sheets};
      else if (path.endsWith(':batchUpdate')) {
        const replies = [];
        for (const request of body.requests) {
          if (request.addSheet) {
            const properties = {...request.addSheet.properties, sheetId: state.next++};
            state.sheets.push({properties}); state.data[properties.title] = [];
            replies.push({addSheet: {properties}});
          } else {
            if (request.updateCells || request.appendCells) {
              const change = request.updateCells ?? request.appendCells;
              const sheetId = change.sheetId ?? change.start.sheetId;
              const title = state.sheets.find(one => one.properties.sheetId === sheetId).properties.title;
              const data = state.data[title] ?? [];
              const at = request.appendCells ? data.length : change.start.rowIndex;
              const column = request.appendCells ? 0 : change.start.columnIndex;
              change.rows.forEach((one, offset) => {
                data[at + offset] ??= [];
                one.values.forEach((cell, index) => {
                  data[at + offset][column + index] = Object.values(cell.userEnteredValue)[0];
                });
              });
              state.data[title] = data;
            }
            if (request.deleteSheet) {
              const old = state.sheets.find(one => one.properties.sheetId === request.deleteSheet.sheetId);
              delete state.data[old.properties.title];
              state.sheets = state.sheets.filter(one => one !== old);
            }
            if (request.updateSheetProperties?.fields === 'title') {
              const one = state.sheets.find(one => one.properties.sheetId === request.updateSheetProperties.properties.sheetId);
              state.data[request.updateSheetProperties.properties.title] = state.data[one.properties.title];
              delete state.data[one.properties.title];
              one.properties.title = request.updateSheetProperties.properties.title;
            }
            replies.push({});
          }
        }
        answer = {replies};
      } else if (path.includes('/values/')) {
        const range = path.split('/values/')[1].replace(/:append$/, '');
        const [titlePart, cells = 'A1'] = range.split('!');
        const title = titlePart.slice(1, -1).replace(/''/g, "'");
        const data = state.data[title] ?? [];
        const address = /^([A-Z]+)([0-9]*)/.exec(cells);
        const column = [...address[1]].reduce((n, letter) => n * 26 + letter.charCodeAt(0) - 64, 0) - 1;
        const row = Number(address[2] || 1) - 1;
        if (method === 'GET') answer = {values: data.slice(row).map(one => one.slice(column))};
        else if (path.endsWith(':append')) {
          const start = data.length;
          data.push(...body.values); state.data[title] = data;
          answer = {updates: {updatedRange: titlePart + '!A' + (start + 1) + ':Q' + data.length}};
        } else {
          body.values.forEach((one, offset) => {
            data[row + offset] ??= [];
            one.forEach((value, index) => {data[row + offset][column + index] = value;});
          });
          state.data[title] = data;
        }
      } else throw new Error('Unexpected Sheets operation ' + path);
      writeFileSync(file, JSON.stringify(state));
      return {ok: true, json: async () => answer};
    };
  `,
  );
  const run = (args) =>
    execFileSync(
      process.execPath,
      ["--import", mock, join(root, "scripts/openspec/run-sheet.mjs"), ...args],
      {
        cwd: root,
        encoding: "utf8",
        env: {
          ...process.env,
          GOOGLE_ACCESS_TOKEN: "test-token",
          TCS_SHEET_ID: trial.spreadsheetId,
          TCS_SHEET_SANDBOX_ID: "sandbox-sheet",
          MOCK_SHEETS_STATE: stateFile,
        },
        stdio: ["pipe", "pipe", "pipe"],
      },
    );
  const state = () => JSON.parse(readFileSync(stateFile, "utf8"));
  const readReceipt = () => JSON.parse(readFileSync(receipt, "utf8"));
  const selected = ["--cases", "demo.thing.US1-TC1"];
  const dry = (name) => run(["--name", name, ...selected, "--dry-run"]);
  const fingerprint = (name) =>
    /^Fingerprint: ([a-f0-9]+)$/m.exec(dry(name))[1];
  const first = fingerprint("auction");
  run([
    "--name",
    "auction",
    ...selected,
    "--confirmed",
    first,
    "--record-output",
    receipt,
  ]);
  const printed = readReceipt();
  assert.equal(printed.state, "trial");
  assert.equal(state().data[printed.tab][3][0], "demo.thing.US1-TC1 (TC-abc)");
  const afterFirst = state().log.length;
  assert.match(
    run([
      "--name",
      "auction",
      ...selected,
      "--overwrite",
      "1",
      "--confirmed",
      first,
    ]),
    /Unchanged/,
  );
  assert.ok(
    state()
      .log.slice(afterFirst)
      .every((one) => one.method === "GET"),
  );
  const exclusions = join(scratch, "exclusions.json");
  writeFileSync(
    exclusions,
    JSON.stringify([{ id: "demo.thing.US1-TC1", reason: "covered by run 1" }]),
  );
  const filterArgs = [
    "--name",
    "filtered",
    "--scope",
    "demo/thing/widget",
    "--exclusions-file",
    exclusions,
  ];
  const filterHash = /^Fingerprint: ([a-f0-9]+)$/m.exec(
    run([...filterArgs, "--dry-run"]),
  )[1];
  run([...filterArgs, "--confirmed", filterHash, "--record-output", receipt]);
  assert.deepEqual(
    readReceipt().snapshot.selected.map((one) => one.id),
    ["demo.thing.US1-TC2"],
  );
  assert.equal(readReceipt().snapshot.excluded[0].reason, "covered by run 1");
  writeFileSync(exclusions, "[]");
  const narrowed = [...filterArgs, "--priority", "high"];
  const narrowHash = /^Fingerprint: ([a-f0-9]+)$/m.exec(
    run([...narrowed, "--dry-run"]),
  )[1];
  run([
    ...narrowed,
    "--overwrite",
    "2",
    "--confirmed",
    narrowHash,
    "--record-output",
    receipt,
  ]);
  assert.deepEqual(
    readReceipt().snapshot.selected.map((one) => one.id),
    ["demo.thing.US1-TC1"],
  );
  assert.deepEqual(readReceipt().snapshot.excluded, []);
  const beforeMissingSummary = state();
  const savedSummary = beforeMissingSummary.data.Summary;
  beforeMissingSummary.data.Summary = [savedSummary[0]];
  writeFileSync(stateFile, JSON.stringify(beforeMissingSummary));
  const collisionHash = fingerprint("new-run");
  assert.throws(
    () => run(["--name", "new-run", ...selected, "--confirmed", collisionHash]),
    /already registered/,
  );
  const recovered = state();
  assert.ok(
    recovered.log
      .slice(beforeMissingSummary.log.length)
      .every((one) => one.method === "GET"),
  );
  recovered.data.Summary = savedSummary;
  writeFileSync(stateFile, JSON.stringify(recovered));
  const renamedHash = fingerprint("renamed");
  run([
    "--name",
    "renamed",
    ...selected,
    "--overwrite",
    "1",
    "--confirmed",
    renamedHash,
    "--record-output",
    receipt,
  ]);
  const renamed = readReceipt();
  assert.equal(renamed.runId, printed.runId);
  assert.notEqual(renamed.sheetId, printed.sheetId);
  assert.equal(renamed.tab, "1-renamed");
  assert.ok(
    state().log.some(
      (one) =>
        one.body?.requests?.some((req) => req.deleteSheet) &&
        one.body.requests.some(
          (req) => req.updateSheetProperties?.fields === "title",
        ),
    ),
  );
  run([
    "--finalize",
    "1",
    "--confirmed",
    renamedHash,
    "--record-output",
    receipt,
  ]);
  const finalized = readReceipt();
  assert.equal(finalized.state, "finalized");
  assert.throws(
    () =>
      run([
        "--name",
        "renamed",
        ...selected,
        "--overwrite",
        "1",
        "--confirmed",
        renamedHash,
      ]),
    /reopen/,
  );
  writeFileSync(file, SUITE.replace("An open lot", "A changed lot"));
  git(root, ["add", "."]);
  git(root, ["commit", "-m", "test: TC change"]);
  git(root, ["push", "origin", "main"]);
  run(["--finalize", "1", "--record-output", receipt]);
  assert.deepEqual(readReceipt(), finalized);
  run(["--reopen", "1", "--record-output", receipt]);
  assert.equal(readReceipt().state, "trial");
  assert.throws(
    () => run(["--finalize", "1", "--confirmed", renamedHash]),
    /changed on latest main/,
  );
  const latestHash = fingerprint("renamed");
  run([
    "--name",
    "renamed",
    ...selected,
    "--overwrite",
    "1",
    "--confirmed",
    latestHash,
    "--record-output",
    receipt,
  ]);
  run([
    "--finalize",
    "1",
    "--confirmed",
    latestHash,
    "--record-output",
    receipt,
  ]);
  const latest = readReceipt();
  const manifest = join(root, recordPath(latest.spreadsheetId, latest.runId));
  mkdirSync(dirname(manifest), { recursive: true });
  writeFileSync(manifest, JSON.stringify(latest));
  git(root, ["add", "."]);
  git(root, ["commit", "-m", "test: merged run"]);
  git(root, ["push", "origin", "main"]);
  const before = state().log.length;
  assert.throws(() => run(["--reopen", "1"]), /merged/);
  assert.ok(
    state()
      .log.slice(before)
      .every((one) => one.method === "GET"),
  );
  const beforeSandbox = state().log.length;
  assert.throws(
    () =>
      run(["--name", "sandbox-source", ...selected, "--source-ref", "HEAD"]),
    /only for sandbox/,
  );
  assert.throws(
    () =>
      run([
        "--name",
        "sandbox-source",
        ...selected,
        "--sandbox",
        "--source-ref",
        "HEAD",
        "--sheet",
        trial.spreadsheetId,
      ]),
    /never production/,
  );
  assert.equal(state().log.length, beforeSandbox);
  writeFileSync(file, SUITE.replace("An open lot", "A sandbox-only lot"));
  git(root, ["add", file]);
  git(root, ["commit", "-m", "test: unmerged sandbox source"]);
  const sandboxSource = git(root, ["rev-parse", "HEAD"]);
  const sandboxArgs = [
    "--name",
    "sandbox-source",
    ...selected,
    "--sandbox",
    "--source-ref",
    sandboxSource,
  ];
  const sandboxPreview = run([...sandboxArgs, "--dry-run"]);
  const sandboxHash = /^Fingerprint: ([a-f0-9]+)$/m.exec(sandboxPreview)[1];
  const sandboxOutput = run([...sandboxArgs, "--confirmed", sandboxHash]);
  assert.match(sandboxOutput, /Sandbox:/);
  assert.ok(sandboxOutput.includes(`Source commit: ${sandboxSource}`));
  const sandboxTab = state().sheets.find((one) =>
    one.properties.title.endsWith("-sandbox-source"),
  ).properties.title;
  assert.ok(
    state()
      .data[sandboxTab].flat()
      .some((cell) => String(cell).includes("A sandbox-only lot")),
  );
});

test("cell requests interpret only Summary formula columns; user metadata and JSON remain literal", () => {
  const encoded = cellRows([["=a requested scope", "=SUM(1,2)", '{"id":1}']], {
    formulaColumns: [1],
  });
  assert.deepEqual(
    encoded[0].values.map((one) => one.userEnteredValue),
    [
      { stringValue: "=a requested scope" },
      { formulaValue: "=SUM(1,2)" },
      { stringValue: '{"id":1}' },
    ],
  );
});

test("large Unicode manifests grow beyond 26 columns and clear old trailing chunks", () => {
  const large = {
    ...trial,
    snapshot: selectionSnapshot(picked, {
      ...options,
      excluded: [{ id: "omitted", reason: "😀".repeat(560000) }],
    }),
  };
  const cells = recordCells(large);
  assert.ok(cells.length > 26);
  assert.deepEqual(
    parseRecordRows([RECORD_HEADERS, cells]).get(1).record,
    large,
  );
  for (const chunk of cells.slice(1).filter(Boolean)) {
    assert.ok(chunk.length <= 40000);
    const last = chunk.charCodeAt(chunk.length - 1);
    assert.ok(last < 0xd800 || last > 0xdbff);
  }
  const shorter = recordCells(trial, { columns: cells.length });
  assert.equal(shorter.length, cells.length);
  assert.equal(shorter.at(-1), "");
  assert.throws(
    () => validateRecord({ ...finalize(), results: ["pass"] }),
    /no execution results/,
  );
});

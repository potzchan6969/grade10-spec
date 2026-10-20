// The checkpoint a branch's digest starts from, the facts of what moved since it, and the step that moves it.
// The digest covers the spec store (this repository) and, with --build <dir>, the application repository built from it.
// node checkpoint.mjs range   [--branch <b>] [--to <rev>] [--build <dir>] - prints the run's range as JSON: both repositories, the days and the fresh commits
// node checkpoint.mjs facts   --day <YYYY-MM-DD> [--branch <b>] [--to <rev>] [--build <dir>] - prints the facts one day's page is drawn from as JSON
// A day is a Hong Kong calendar day, and its page covers every commit that landed on the branch that day, whenever the digest runs.
// node checkpoint.mjs advance --to <sha> [--from <sha>] [--build-repo <owner/name> --build-to <sha> [--build-from <sha>]] [--branch <b>]
//   pushes refs/checkpoints/<b>, and the build checkpoint beside it, in one atomic push, refused if another run moved either first
// The build checkpoint lives here, not in the application repository, so one token moves both: refs/checkpoints-of/<owner>/<name>/<b>
// is a commit with no files whose subject is the application commit the last digest covered.
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";

const HK = 8 * 3600 * 1000;
const REMOTE = process.env.CHECKPOINT_REMOTE ?? "origin";
const FIRST_RUN = process.env.CHECKPOINT_FIRST_RUN ?? endOfLastFriday();
const LIMIT = 40;

const AREAS = [
  ["OpenSpec changes", /^openspec\/changes\//],
  ["Requirements", /^openspec\/specs\//],
  ["Product pages", /^docs\/prds\//],
  ["References", /^docs\/references\//],
  [
    "Tokens",
    /^packages\/design-system\/(tokens(\.config)?\.json|src\/themes?\b|src\/theme\.css)/,
  ],
  ["Primitives", /^packages\/design-system\/src\/components\//],
  ["Blocks", /^packages\/ui\/src\/blocks\//],
  ["Copy", /^packages\/i18n\/messages\//],
  ["Stories and pages", /^apps\/preview\//],
  ["Emails", /^apps\/emails\//],
  ["Agent skills", /^\.(claude|codex|cursor|devin)\//],
  ["Governance", /^(docs\/governance\/|AGENTS\.md$|CLAUDE\.md$)/],
  ["Tooling and CI", /^(scripts|tools|\.github)\//],
];

// The application repository's areas: its agent skills, tooling and pin first, then each app and package by name.
const BUILD_AREAS = [
  ["Agent skills", /^\.(claude|codex|cursor|devin)\//],
  ["Tooling and CI", /^(scripts|tools|\.github)\//],
  ["Spec store pin", /^external\//],
  ["Docs", /^docs\//],
];

const [command, ...rest] = process.argv.slice(2);
const option = (name) => {
  const i = rest.indexOf(`--${name}`);
  return i === -1 ? undefined : rest[i + 1];
};
const gitIn = (cwd, ...a) =>
  execFileSync("git", a, {
    cwd,
    encoding: "utf8",
    maxBuffer: 256 * 1024 * 1024,
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
const tryGitIn = (cwd, ...a) => {
  try {
    return gitIn(cwd, ...a);
  } catch {
    return undefined;
  }
};
const git = (...a) => gitIn(undefined, ...a);
const tryGit = (...a) => tryGitIn(undefined, ...a);

const branch =
  option("branch") ??
  process.env.CHECKPOINT_BRANCH ??
  git("rev-parse", "--abbrev-ref", "HEAD");
if (!branch || branch === "HEAD")
  fail("on a detached HEAD: pass --branch <name>");
const ref = `refs/checkpoints/${branch}`;
const buildDir =
  (option("build") ?? process.env.CHECKPOINT_BUILD) &&
  resolve(option("build") ?? process.env.CHECKPOINT_BUILD);

if (command === "range") print(range());
else if (command === "facts") print(facts(range(), option("day")));
else if (command === "advance") advance();
else
  fail(
    "usage: node checkpoint.mjs range|facts|advance [--branch <b>] [--to <rev>] [--build <dir>]",
  );

function range() {
  unshallow(undefined);
  fetchRef(ref);
  const spec = run(undefined, {
    repo: repoOf(undefined),
    ref,
    to: git("rev-parse", option("to") ?? "HEAD"),
    saved: tryGit("rev-parse", "--verify", "--quiet", `${ref}^{commit}`),
  });
  let build = null;
  if (buildDir) {
    unshallow(buildDir);
    gitIn(buildDir, "fetch", "--quiet", REMOTE, branch);
    const repo = repoOf(buildDir);
    if (!repo) fail(`${buildDir}: its ${REMOTE} is not a GitHub repository`);
    const marker = markerRef(repo);
    fetchRef(marker);
    build = {
      dir: buildDir,
      ...run(buildDir, {
        repo,
        ref: marker,
        to: gitIn(buildDir, "rev-parse", "FETCH_HEAD^{commit}"),
        saved: markedCommit(marker),
      }),
    };
  }
  const both = [spec, build].filter(Boolean);
  return {
    branch,
    commits: both.reduce((n, r) => n + r.commits, 0),
    days: [...new Set(both.flatMap((r) => r.days))].sort(),
    spec,
    build,
    fresh: both.flatMap((r) => r.fresh),
  };
}

// One repository's run: from its checkpoint, or from the end of last Friday on a first run, to the branch head.
function run(cwd, { repo, ref, to, saved }) {
  let from = saved;
  let base = "checkpoint";
  if (cwd === undefined && option("from")) {
    from = git("rev-parse", option("from"));
    base = "given";
  }
  if (from && !exists(cwd, from)) {
    // The checkpoint's commit is gone from the repository: start over as on a first run.
    from = undefined;
  } else if (
    from &&
    tryGitIn(cwd, "merge-base", "--is-ancestor", from, to) === undefined
  ) {
    // The branch was rewritten past the checkpoint: start where the two still agree.
    from = tryGitIn(cwd, "merge-base", from, to);
    base = "merge-base";
  }
  if (!from) {
    from =
      tryGitIn(
        cwd,
        "rev-list",
        "-1",
        "--first-parent",
        `--before=${FIRST_RUN}`,
        to,
      ) || gitIn(cwd, "rev-list", "--max-parents=0", to).split("\n").pop();
    base = "first-run";
  }
  const commits = Number(gitIn(cwd, "rev-list", "--count", `${from}..${to}`));
  // The days the new commits landed on, by the time each reached the branch.
  const days = [
    ...new Set(
      gitIn(cwd, "log", "--first-parent", "--format=%cI", `${from}..${to}`)
        .split("\n")
        .filter(Boolean)
        .map(dayOf),
    ),
  ].sort();
  const fresh = lines(gitIn(cwd, "rev-list", "--no-merges", to, `^${from}`));
  return {
    repo,
    ref,
    saved: saved ?? null,
    from,
    to,
    base,
    commits,
    days,
    fresh,
  };
}

// The whole day in one repository, from the branch as it stood at the day's start to the last commit the day landed;
// fresh names the day's commits this run brings, the ones the last post did not cover. Null when nothing landed that day.
function daySpan(cwd, r, date) {
  const start = Date.parse(`${date}T00:00:00Z`) - HK;
  const before = (t) =>
    tryGitIn(
      cwd,
      "rev-list",
      "-1",
      "--first-parent",
      `--before=${new Date(t - 1000).toISOString()}`,
      r.to,
    );
  const to = before(start + 24 * 3600 * 1000);
  if (!to || dayOf(gitIn(cwd, "show", "-s", "--format=%cI", to)) !== date)
    return null;
  const from =
    before(start) ||
    gitIn(cwd, "rev-list", "--max-parents=0", to).split("\n").pop();
  const fresh = lines(
    gitIn(cwd, "rev-list", "--no-merges", to, `^${from}`, `^${r.from}`),
  );
  return { from, to, fresh };
}

function facts(r, date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date ?? ""))
    fail("facts needs --day <YYYY-MM-DD>: one of the days range prints");
  const specDay = daySpan(undefined, r.spec, date);
  const buildDay = r.build && daySpan(r.build.dir, r.build, date);
  if (!specDay && !buildDay) fail(`nothing landed on ${branch} on ${date}`);

  const spec = specDay
    ? specFacts(specDay)
    : { from: null, to: null, ...empty() };
  const build = buildDay
    ? buildFacts(r.spec.to, r.build, buildDay)
    : r.build && { repo: r.build.repo, from: null, to: null, ...empty() };
  return {
    branch,
    repo: r.spec.repo,
    day: date,
    date,
    fromDate: date,
    base: r.spec.base,
    ...spec,
    build: build && { base: r.build.base, ...build },
  };
}

function specFacts(d) {
  const f = repoFacts(undefined, d, AREAS);
  return {
    ...f,
    openspec: openspecMoves(f.files),
    tokens: jsonDiff(d, f.files, /^packages\/design-system\/tokens\.json$/),
    copy: jsonDiff(d, f.files, /^packages\/i18n\/messages\/.*\.json$/),
    components: f.files
      .filter((x) => /^(Primitives|Blocks)$/.test(x.area) && x.status !== "M")
      .map((x) => `${x.status} ${x.path}`)
      .slice(0, LIMIT),
    files: undefined,
  };
}

// The application's day, and which of its commits build which OpenSpec change: those a change's implementation
// record names as its build, and those whose message names the change.
function buildFacts(specTo, b, d) {
  const f = repoFacts(b.dir, d, BUILD_AREAS);
  const day = new Set(f.commits.map((c) => c.sha));
  const links = {};
  const link = (change, how, shas) => {
    const hit = shas.filter((s) => day.has(s));
    if (!hit.length) return;
    links[change] ??= {};
    links[change][how] = [
      ...new Set([
        ...(links[change][how] ?? []),
        ...hit.map((s) => s.slice(0, 9)),
      ]),
    ];
  };
  for (const [change, commit] of builtBy(specTo, b.repo)) {
    if (!exists(b.dir, commit)) continue;
    // A merge builds everything it brought; a single commit builds itself.
    const parents = gitIn(b.dir, "rev-list", "--parents", "-n", "1", commit)
      .split(" ")
      .slice(1);
    link(
      change,
      "recorded",
      parents.length > 1
        ? lines(
            gitIn(b.dir, "rev-list", "--no-merges", commit, `^${parents[0]}`),
          )
        : [commit],
    );
  }
  const ids = changeIds(specTo).sort((a, z) => z.length - a.length);
  for (const line of gitIn(
    b.dir,
    "log",
    "--no-merges",
    "--format=%H%x1f%B%x1e",
    `${d.from}..${d.to}`,
  ).split("\x1e")) {
    const [sha, body = ""] = line.trim().split("\x1f");
    const id = ids.find((id) =>
      new RegExp(`(^|[^a-z0-9-])${id}($|[^a-z0-9-])`).test(body),
    );
    if (sha && id) link(id, "named", [sha]);
  }
  const linked = new Set(
    Object.values(links).flatMap((l) => Object.values(l).flat()),
  );
  for (const c of f.commits)
    c.changes = Object.keys(links).filter((change) =>
      Object.values(links[change]).flat().includes(c.sha.slice(0, 9)),
    );
  return {
    repo: b.repo,
    ...f,
    files: undefined,
    links,
    unlinked: f.commits.filter((c) => !linked.has(c.sha.slice(0, 9))).length,
  };
}

// The commits, pull requests, lines per area, authors and kinds of one repository's day.
function repoFacts(cwd, d, areaList) {
  const span = `${d.from}..${d.to}`;
  // Each commit's own files, so chunks.mjs can group the day's commits by what they touch.
  const touched = new Map();
  let at;
  for (const line of lines(
    gitIn(
      cwd,
      "log",
      "--no-merges",
      "--numstat",
      "-M",
      "--format=%x1e%H",
      span,
    ),
  )) {
    if (line.startsWith("\x1e")) {
      at = line.slice(1);
      touched.set(at, []);
      continue;
    }
    const [added, removed, ...path] = line.split("\t");
    touched.get(at)?.push({
      path: renamedTo(path.join("\t")),
      added: Number(added) || 0,
      removed: Number(removed) || 0,
    });
  }
  const log = lines(
    gitIn(
      cwd,
      "log",
      "--no-merges",
      "--format=%H%x1f%h%x1f%an%x1f%aI%x1f%s",
      span,
    ),
  ).map((line) => {
    const [sha, short, author, date, subject] = line.split("\x1f");
    const cc = subject.match(/^(\w+)(?:\(([^)]+)\))?!?:\s*(.*)$/);
    const own = touched.get(sha) ?? [];
    return {
      sha,
      short,
      author,
      date,
      subject,
      type: cc?.[1] ?? null,
      scope: cc?.[2] ?? null,
      fresh: d.fresh.includes(sha),
      areas: [...new Set(own.map((f) => areaOf(f.path, areaList)))],
      changes: [...new Set(own.flatMap((f) => changeOf(f.path) ?? []))],
      added: own.reduce((n, f) => n + f.added, 0),
      removed: own.reduce((n, f) => n + f.removed, 0),
    };
  });
  const merges = lines(
    gitIn(cwd, "log", "--merges", "--first-parent", "--format=%h%x1f%s", span),
  ).map((line) => {
    const [short, subject] = line.split("\x1f");
    return { short, subject, pr: subject.match(/#(\d+)/)?.[1] ?? null };
  });
  // Every pull request that landed on the branch: a merge commit, or a commit whose subject ends with its number.
  const pulls = lines(
    gitIn(cwd, "log", "--first-parent", "--format=%h%x1f%p%x1f%s", span),
  ).flatMap((line) => {
    const [short, parents, subject] = line.split("\x1f");
    const pr = (subject.match(/^Merge pull request #(\d+)/) ??
      subject.match(/\(#(\d+)\)$/))?.[1];
    return pr ? [{ short, pr, subject, squashed: !parents.includes(" ") }] : [];
  });
  const files = lines(gitIn(cwd, "diff", "--numstat", "-M", span)).map(
    (line) => {
      const [added, removed, ...path] = line.split("\t");
      const name = renamedTo(path.join("\t"));
      return {
        path: name,
        added: Number(added) || 0,
        removed: Number(removed) || 0,
        area: areaOf(name, areaList),
      };
    },
  );
  const status = new Map(
    lines(gitIn(cwd, "diff", "--name-status", "-M", span)).map((line) => {
      const [s, ...paths] = line.split("\t");
      return [paths.at(-1), s[0]];
    }),
  );
  for (const f of files) f.status = status.get(f.path) ?? "M";

  const areas = {};
  for (const f of files) {
    areas[f.area] ??= { files: 0, added: 0, removed: 0, paths: [] };
    const a = areas[f.area];
    a.files += 1;
    a.added += f.added;
    a.removed += f.removed;
    if (a.paths.length < LIMIT) a.paths.push(`${f.status} ${f.path}`);
  }
  const authors = {};
  for (const c of log) authors[c.author] = (authors[c.author] ?? 0) + 1;
  const types = {};
  for (const c of log)
    types[c.type ?? "other"] = (types[c.type ?? "other"] ?? 0) + 1;
  return {
    from: d.from,
    to: d.to,
    commits: log,
    merges,
    pulls,
    authors,
    types,
    areas,
    files,
  };
}

function empty() {
  return {
    commits: [],
    merges: [],
    pulls: [],
    authors: {},
    types: {},
    areas: {},
  };
}

function advance() {
  const to = option("to");
  if (!to) fail("advance needs --to <sha>: the commit the digest was drawn to");
  const refspecs = [];
  const leases = [];
  const updates = [];
  const sha = git("rev-parse", `${to}^{commit}`);
  fetchRef(ref);
  const now = tryGit("rev-parse", "--verify", "--quiet", ref) ?? "";
  const expected = option("from") ?? now;
  if (now !== expected)
    fail(
      `${ref} moved to ${now.slice(0, 7) || "nothing"} since this digest read ${expected.slice(0, 7) || "nothing"}; draw the digest again`,
    );
  refspecs.push(`${sha}:${ref}`);
  leases.push(`--force-with-lease=${ref}:${expected}`);
  updates.push([ref, sha]);
  const out = { branch, ref, from: expected || null, to: sha };

  const repo = option("build-repo");
  if (repo) {
    const buildTo = option("build-to");
    if (!/^[0-9a-f]{40}$/.test(buildTo ?? ""))
      fail("advance needs --build-to <full sha> with --build-repo");
    const marker = markerRef(repo);
    fetchRef(marker);
    const markerNow = tryGit("rev-parse", "--verify", "--quiet", marker) ?? "";
    const buildNow = markedCommit(marker) ?? "";
    const buildExpected = option("build-from") ?? buildNow;
    if (buildNow !== buildExpected)
      fail(
        `${marker} moved to ${buildNow.slice(0, 7) || "nothing"} since this digest read ${buildExpected.slice(0, 7) || "nothing"}; draw the digest again`,
      );
    const tree = execFileSync(
      "git",
      ["hash-object", "-w", "-t", "tree", "--stdin"],
      {
        input: "",
        encoding: "utf8",
      },
    ).trim();
    const commit = git(
      "commit-tree",
      tree,
      "-m",
      buildTo,
      "-m",
      `The ${branch} digest of ${repo} covers ${buildTo}.`,
    );
    refspecs.push(`${commit}:${marker}`);
    leases.push(`--force-with-lease=${marker}:${markerNow}`);
    updates.push([marker, commit]);
    out.build = { repo, ref: marker, from: buildExpected || null, to: buildTo };
  }
  // One atomic push with a lease on each value read: both checkpoints move, or neither does.
  git("push", "--quiet", "--atomic", REMOTE, ...leases, ...refspecs);
  for (const [r, s] of updates) git("update-ref", r, s);
  print(out);
}

// The remote holds the checkpoint: a copy left here by an earlier run never stands in for one the remote lacks.
function fetchRef(name) {
  tryGit("update-ref", "-d", name);
  tryGit("fetch", "--quiet", REMOTE, `+${name}:${name}`);
}

function markerRef(repo) {
  return `refs/checkpoints-of/${repo}/${branch}`;
}

// The application commit a build checkpoint names, or nothing before its first run.
function markedCommit(marker) {
  const subject = tryGit("log", "-1", "--format=%s", marker);
  return /^[0-9a-f]{40}$/.test(subject ?? "") ? subject : undefined;
}

// Every change, active or archived, whose implementation record names a commit of the repository.
function builtBy(rev, repo) {
  const out = [];
  for (const path of lines(
    tryGit("ls-tree", "-r", "--name-only", rev, "openspec/changes") ?? "",
  )) {
    const m = path.match(
      /^openspec\/changes\/(?:archive\/[\d-]+-)?([^/]+)\/implementation\.json$/,
    );
    if (!m) continue;
    for (const r of readJson(rev, path).repositories ?? [])
      if (r.repository === repo && /^[0-9a-f]{7,40}$/.test(r.commit ?? ""))
        out.push([m[1], r.commit]);
  }
  return out;
}

function changeIds(rev) {
  return [
    ...new Set(
      lines(
        tryGit("ls-tree", "-d", "--name-only", `${rev}:openspec/changes`) ?? "",
      )
        .filter((n) => n !== "archive")
        .concat(
          lines(
            tryGit(
              "ls-tree",
              "-d",
              "--name-only",
              `${rev}:openspec/changes/archive`,
            ) ?? "",
          ).map((n) => n.replace(/^\d{4}-\d{2}-\d{2}-/, "")),
        ),
    ),
  ];
}

function openspecMoves(files) {
  const moves = {};
  const touch = (id, what) => {
    moves[id] ??= new Set();
    moves[id].add(what);
  };
  for (const f of files) {
    const archived = f.path.match(
      /^openspec\/changes\/archive\/[\d-]+-([^/]+)\//,
    );
    if (archived) {
      if (f.status === "A" || f.status === "R") touch(archived[1], "archived");
      continue;
    }
    const change = f.path.match(/^openspec\/changes\/([^/]+)\/(.*)$/);
    if (change) {
      const [, id, file] = change;
      if (f.status === "D") touch(id, "left active");
      else if (f.status === "A" && file === "proposal.md")
        touch(id, "proposed");
      else touch(id, `${f.status === "A" ? "added" : "edited"} ${file}`);
    }
    const spec = f.path.match(/^openspec\/specs\/(.+)\/spec\.md$/);
    if (spec)
      touch(
        `spec:${spec[1]}`,
        f.status === "A" ? "new capability" : "requirements moved",
      );
  }
  return Object.fromEntries(
    Object.entries(moves).map(([id, s]) => {
      const list = [...s];
      return [id, list.includes("archived") ? ["archived"] : list.slice(0, 12)];
    }),
  );
}

function jsonDiff(d, files, pattern) {
  const out = [];
  for (const f of files.filter((f) => pattern.test(f.path))) {
    const before = flatten(readJson(d.from, f.path));
    const now = flatten(readJson(d.to, f.path));
    for (const key of new Set([...Object.keys(before), ...Object.keys(now)])) {
      if (before[key] === now[key]) continue;
      out.push({
        file: f.path,
        key,
        before: before[key] ?? null,
        now: now[key] ?? null,
      });
      if (out.length >= LIMIT * 3) return { truncated: true, rows: out };
    }
  }
  return { truncated: false, rows: out };
}

function readJson(rev, path) {
  const text = tryGit("show", `${rev}:${path}`);
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {};
  }
}

function flatten(value, prefix = "", out = {}) {
  if (value !== null && typeof value === "object") {
    for (const [k, v] of Object.entries(value))
      flatten(v, prefix ? `${prefix}.${k}` : k, out);
  } else out[prefix] = String(value);
  return out;
}

function unshallow(cwd) {
  if (tryGitIn(cwd, "rev-parse", "--is-shallow-repository") === "true")
    gitIn(cwd, "fetch", "--quiet", "--unshallow", REMOTE);
}

function exists(cwd, rev) {
  return tryGitIn(cwd, "cat-file", "-e", `${rev}^{commit}`) !== undefined;
}

function lines(text) {
  return text.split("\n").filter(Boolean);
}

function dayOf(iso) {
  return new Date(Date.parse(iso) + HK).toISOString().slice(0, 10);
}

// Midnight after the last Friday before today, on the Hong Kong clock the store counts days on.
function endOfLastFriday(now = new Date()) {
  const day = new Date(now.getTime() + HK);
  const back = (day.getUTCDay() + 2) % 7 || 7;
  const midnight = Date.UTC(
    day.getUTCFullYear(),
    day.getUTCMonth(),
    day.getUTCDate() - back + 1,
  );
  return new Date(midnight - HK).toISOString();
}

// A path's area: the first that claims it, else, in the application, its app or package, else its top folder.
// A rename's numstat path, such as a/{b => c}/d, read as where it now lives.
function renamedTo(path) {
  return path.replace(/\{[^}]* => ([^}]*)\}/, "$1").replace(/^.* => /, "");
}

// The OpenSpec change a path belongs to, active or archived.
function changeOf(path) {
  return (
    path.match(/^openspec\/changes\/archive\/[\d-]+-([^/]+)\//)?.[1] ??
    path.match(/^openspec\/changes\/(?!archive\/)([^/]+)\//)?.[1] ??
    null
  );
}

function areaOf(path, areaList) {
  const named = areaList.find(([, pattern]) => pattern.test(path))?.[0];
  if (named) return named;
  if (areaList === BUILD_AREAS) {
    const unit = path.match(/^(apps\/[^/]+\/[^/]+|packages\/[^/]+)\//)?.[1];
    if (unit) return unit;
  }
  return path.includes("/") ? `${path.split("/")[0]}/` : "Root files";
}

function repoOf(cwd) {
  const url = tryGitIn(cwd, "remote", "get-url", REMOTE) ?? "";
  return url.match(/github\.com[:/](.+?)(?:\.git)?$/)?.[1] ?? null;
}

function print(value) {
  console.log(JSON.stringify(value, null, 2));
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

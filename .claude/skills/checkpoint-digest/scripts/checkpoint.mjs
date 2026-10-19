// The checkpoint a branch's digest starts from, the facts of what moved since it, and the step that moves it.
// node checkpoint.mjs range   [--branch <b>] [--to <rev>]          - prints {branch, from, to, base, commits} as JSON
// node checkpoint.mjs facts   [--branch <b>] [--to <rev>] [--from <rev>] - prints the facts the digest is drawn from as JSON
// node checkpoint.mjs advance --to <sha> [--branch <b>] [--from <sha>] - pushes refs/checkpoints/<b> to <sha>, refused if another run moved it first
import { execFileSync } from "node:child_process";

const REMOTE = process.env.CHECKPOINT_REMOTE ?? "origin";
const FIRST_RUN = process.env.CHECKPOINT_FIRST_RUN ?? "7 days ago";
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

const [command, ...rest] = process.argv.slice(2);
const option = (name) => {
  const i = rest.indexOf(`--${name}`);
  return i === -1 ? undefined : rest[i + 1];
};
const git = (...a) =>
  execFileSync("git", a, {
    encoding: "utf8",
    maxBuffer: 256 * 1024 * 1024,
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
const tryGit = (...a) => {
  try {
    return git(...a);
  } catch {
    return undefined;
  }
};

const branch =
  option("branch") ??
  process.env.CHECKPOINT_BRANCH ??
  git("rev-parse", "--abbrev-ref", "HEAD");
if (!branch || branch === "HEAD")
  fail("on a detached HEAD: pass --branch <name>");
const ref = `refs/checkpoints/${branch}`;

if (command === "range") print(range());
else if (command === "facts") print(facts(range()));
else if (command === "advance") advance();
else
  fail(
    "usage: node checkpoint.mjs range|facts|advance [--branch <b>] [--to <rev>] [--from <rev>]",
  );

function range() {
  if (tryGit("rev-parse", "--is-shallow-repository") === "true")
    git("fetch", "--quiet", "--unshallow", REMOTE);
  tryGit("fetch", "--quiet", REMOTE, `+${ref}:${ref}`);
  const to = git("rev-parse", option("to") ?? "HEAD");
  const saved = tryGit("rev-parse", "--verify", "--quiet", `${ref}^{commit}`);
  let from = option("from") ? git("rev-parse", option("from")) : saved;
  let base = option("from") ? "given" : "checkpoint";
  if (from && tryGit("merge-base", "--is-ancestor", from, to) === undefined) {
    // The branch was rewritten past the checkpoint: start where the two still agree.
    from = tryGit("merge-base", from, to);
    base = "merge-base";
  }
  if (!from) {
    from =
      tryGit("rev-list", "-1", `--before=${FIRST_RUN}`, to) ||
      git("rev-list", "--max-parents=0", to).split("\n").pop();
    base = "first-run";
  }
  const commits = Number(git("rev-list", "--count", `${from}..${to}`));
  return { branch, ref, saved: saved ?? null, from, to, base, commits };
}

function facts(r) {
  const span = `${r.from}..${r.to}`;
  const log = git(
    "log",
    "--no-merges",
    "--format=%H%x1f%h%x1f%an%x1f%aI%x1f%s",
    span,
  )
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [sha, short, author, date, subject] = line.split("\x1f");
      const cc = subject.match(/^(\w+)(?:\(([^)]+)\))?!?:\s*(.*)$/);
      return {
        sha,
        short,
        author,
        date,
        subject,
        type: cc?.[1] ?? null,
        scope: cc?.[2] ?? null,
      };
    });
  const merges = git(
    "log",
    "--merges",
    "--first-parent",
    "--format=%h%x1f%s",
    span,
  )
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [short, subject] = line.split("\x1f");
      return { short, subject, pr: subject.match(/#(\d+)/)?.[1] ?? null };
    });
  const files = git("diff", "--numstat", "-M", span)
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [added, removed, ...path] = line.split("\t");
      const name = path
        .join("\t")
        .replace(/\{[^}]* => ([^}]*)\}/, "$1")
        .replace(/^.* => /, "");
      return {
        path: name,
        added: Number(added) || 0,
        removed: Number(removed) || 0,
        area: areaOf(name),
      };
    });
  const status = new Map(
    git("diff", "--name-status", "-M", span)
      .split("\n")
      .filter(Boolean)
      .map((line) => {
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
    ...r,
    repo: repoOf(),
    date: new Date().toISOString().slice(0, 10),
    fromDate: tryGit("show", "-s", "--format=%cI", r.from) ?? null,
    commits: log,
    merges,
    authors,
    types,
    areas,
    openspec: openspecMoves(files),
    tokens: jsonDiff(r, files, /^packages\/design-system\/tokens\.json$/),
    copy: jsonDiff(r, files, /^packages\/i18n\/messages\/.*\.json$/),
    components: files
      .filter((f) => /^(Primitives|Blocks)$/.test(f.area) && f.status !== "M")
      .map((f) => `${f.status} ${f.path}`)
      .slice(0, LIMIT),
  };
}

function advance() {
  const to = option("to");
  if (!to) fail("advance needs --to <sha>: the commit the digest was drawn to");
  const sha = git("rev-parse", `${to}^{commit}`);
  tryGit("fetch", "--quiet", REMOTE, `+${ref}:${ref}`);
  const now = tryGit("rev-parse", "--verify", "--quiet", ref) ?? "";
  const expected = option("from") ?? now;
  if (now !== expected)
    fail(
      `${ref} moved to ${now.slice(0, 7) || "nothing"} since this digest read ${expected.slice(0, 7) || "nothing"}; draw the digest again`,
    );
  // The lease refuses the push when another run moved the checkpoint after this one read it.
  git(
    "push",
    "--quiet",
    REMOTE,
    `--force-with-lease=${ref}:${expected}`,
    `${sha}:${ref}`,
  );
  git("update-ref", ref, sha);
  print({ branch, ref, from: expected || null, to: sha });
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
      if (f.status === "A") touch(archived[1], "archived");
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

function jsonDiff(r, files, pattern) {
  const out = [];
  for (const f of files.filter((f) => pattern.test(f.path))) {
    const before = flatten(readJson(r.from, f.path));
    const now = flatten(readJson(r.to, f.path));
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

function areaOf(path) {
  return (
    AREAS.find(([, pattern]) => pattern.test(path))?.[0] ??
    (path.includes("/") ? `${path.split("/")[0]}/` : "Root files")
  );
}

function repoOf() {
  const url = tryGit("remote", "get-url", REMOTE) ?? "";
  return url.match(/github\.com[:/](.+?)(?:\.git)?$/)?.[1] ?? null;
}

function print(value) {
  console.log(JSON.stringify(value, null, 2));
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

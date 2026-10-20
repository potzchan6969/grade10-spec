// Capture the screens a page shows from the code that renders them, so a picture is the screen itself, never a drawing of it.
// node shoot.mjs <folder> --plan <plan.json> [--storybook <url>] [--at <commit>]  - captures every shot the plan names into <folder>/shots/
//   --at renders the stories as they stood at that commit of the spec store, from a temporary worktree; a digest's past day needs it
// node shoot.mjs --find <words> [--storybook <url>]               - lists the workbench stories whose id or title holds the words
// node shoot.mjs <folder> --record <image.jpg> --name <name> --from <what rendered it> [--phone]
//   - records a screen a Playwright capture spec took from a running stack, such as an E2E test after it signs in
// A plan is a list of shots: {"name": "region-closed", "story": "<story id>", "args": {"k": "v"}, "phone": true}, or a page any
// running app serves: {"name": "lot", "url": "http://localhost:5173/auction/lot/1"}. Without --storybook it starts the workbench
// from this checkout, or the spec store's under external/grade10-spec, and stops it after. Each capture is recorded in <folder>/shots/shots.json: the build refuses a shot it lacks.
import { execFileSync, spawn } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { createRequire } from "node:module";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { join, relative, resolve } from "node:path";

const DESKTOP = { width: 1280, height: 800 };
const PHONE = { width: 390, height: 844 };
const MAX_HEIGHT = 2400;
const START_TIMEOUT = 240_000;

const args = process.argv.slice(2);
const option = (name) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? undefined : args[i + 1];
};
const root = execFileSync("git", ["rev-parse", "--show-toplevel"], {
  encoding: "utf8",
}).trim();
// The workbench whose stories render the screens: this checkout's, or the spec store's inside the application.
let workbench = [
  join(root, "apps/preview"),
  join(root, "external/grade10-spec/apps/preview"),
].find((d) => existsSync(join(d, ".storybook-workbench")));
const find = option("find");
const atCommit = option("at");
const record = option("record");
const folder = args.find(
  (a, i) =>
    !a.startsWith("--") &&
    !/^--(plan|storybook|find|record|name|from|at)$/.test(args[i - 1]),
);
if (!find && (!folder || !(option("plan") || record)))
  fail(
    "usage: node shoot.mjs <folder> --plan <plan.json> [--storybook <url>], node shoot.mjs <folder> --record <image.jpg> --name <name> --from <what rendered it>, or node shoot.mjs --find <words>",
  );
if (record) {
  recordShot();
  process.exit(0);
}

const plan = find
  ? []
  : JSON.parse(readFileSync(resolve(option("plan")), "utf8"));
if (!Array.isArray(plan)) fail("the plan is a list of shots");
for (const [i, s] of plan.entries()) {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(s?.name ?? ""))
    fail(
      `plan[${i}].name: lowercase words joined by hyphens, such as region-closed`,
    );
  if (!s.story === !s.url) fail(`plan[${i}]: give a story or a url, not both`);
}
if (new Set(plan.map((s) => s.name)).size !== plan.length)
  fail("two shots in the plan share a name");

const needsStorybook = find || plan.some((s) => s.story);
if (atCommit && option("storybook"))
  fail("--at starts its own workbench: leave out --storybook");
let server;
let worktree;
let base = option("storybook")?.replace(/\/$/, "");
try {
  if (atCommit && needsStorybook) checkout(atCommit);
  if (needsStorybook && !base) base = await start();
  const index = needsStorybook ? await stories(base) : {};
  if (find) {
    const words = find.toLowerCase().split(/\s+/);
    for (const e of Object.values(index))
      if (
        words.every((w) =>
          `${e.id} ${e.title} ${e.name}`.toLowerCase().includes(w),
        )
      )
        console.log(`${e.id}  ${e.title} / ${e.name}`);
  } else await shoot(index);
} finally {
  if (server) process.kill(-server.pid, "SIGTERM");
  if (worktree)
    git(worktree.repo, "worktree", "remove", "--force", worktree.dir);
}

// The workbench as it stood at a commit: a temporary worktree of the spec store, installed from the local store without scripts.
function checkout(rev) {
  if (!workbench)
    fail("no workbench here: run from the spec store or the application");
  const repo = resolve(workbench, "../..");
  const sha = git(repo, "rev-parse", "--verify", `${rev}^{commit}`);
  const dir = join(tmpdir(), `shoot-${sha.slice(0, 9)}-${process.pid}`);
  git(repo, "worktree", "add", "-q", "--detach", dir, sha);
  worktree = { repo, dir };
  const install = (mode) =>
    execFileSync(
      "pnpm",
      ["install", mode, "--frozen-lockfile", "--ignore-scripts"],
      { cwd: dir, stdio: "ignore", env: { ...process.env, CI: "true" } },
    );
  // The local store holds every package the checkout uses, but not always the metadata an older lockfile asks for.
  try {
    install("--offline");
  } catch {
    install("--prefer-offline");
  }
  workbench = join(dir, relative(repo, workbench));
}

async function shoot(index) {
  const out = join(resolve(folder), "shots");
  mkdirSync(out, { recursive: true });
  const manifestPath = join(out, "shots.json");
  const manifest = existsSync(manifestPath)
    ? JSON.parse(readFileSync(manifestPath, "utf8"))
    : {};
  const at = (cwd) => ({
    commit: git(cwd, "rev-parse", "--short=9", "HEAD"),
    dirty: Boolean(git(cwd, "status", "--porcelain", "--", "apps", "packages")),
  });
  const stories = workbench && at(join(workbench, "../.."));
  const app = at(root);
  const { chromium } = playwright();
  const browser = await chromium.launch(
    process.env.CHROMIUM_PATH
      ? { executablePath: process.env.CHROMIUM_PATH }
      : {},
  );
  try {
    for (const s of plan) {
      const story = s.story && index[s.story];
      if (s.story && !story)
        throw new Error(
          `${s.name}: no story ${s.story}; find its id with node shoot.mjs --find <words>`,
        );
      const page = await browser.newPage({
        viewport: s.phone ? PHONE : DESKTOP,
        deviceScaleFactor: 2,
        colorScheme: "light",
      });
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      const url = s.story
        ? `${base}/iframe.html?id=${encodeURIComponent(s.story)}&viewMode=story${argsParam(s.args)}`
        : s.url;
      await page.goto(url, { waitUntil: "networkidle" });
      if (s.story) {
        await page.waitForSelector("#storybook-root > *, #root > *", {
          state: "attached",
        });
        if (await page.locator(".sb-show-errordisplay").count())
          throw new Error(
            `${s.name}: the story ${s.story} shows an error: ${await page.locator("#error-message").innerText()}`,
          );
      }
      await page.addStyleTag({
        content: "::-webkit-scrollbar { display: none; }",
      });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(300);
      if (errors.length)
        throw new Error(`${s.name}: the page threw: ${errors[0]}`);
      const height = await page.evaluate(
        () => document.documentElement.scrollHeight,
      );
      const viewport = page.viewportSize();
      const file = `${s.name}.jpg`;
      await page.screenshot({
        path: join(out, file),
        type: "jpeg",
        quality: 78,
        clip: {
          x: 0,
          y: 0,
          width: viewport.width,
          height: Math.min(height, MAX_HEIGHT),
        },
      });
      await page.close();
      manifest[`shots/${file}`] = {
        ...(s.story
          ? {
              story: s.story,
              from: `${story.title} / ${story.name}`,
              args: s.args ?? {},
            }
          : { url: s.url, from: s.url }),
        phone: Boolean(s.phone),
        ...(s.story ? stories : app),
        capturedAt: new Date().toISOString(),
      };
      console.log(`shots/${file}  ${manifest[`shots/${file}`].from}`);
    }
  } finally {
    await browser.close();
  }
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  if (Object.values(manifest).some((m) => m.dirty))
    console.log(
      "warning: apps or packages have changes not committed; the shots show this checkout, not a commit",
    );
}

// The workbench from this checkout, on a free port, until the capture ends.
async function start() {
  if (!workbench)
    throw new Error(
      "no workbench here: pass --storybook <url>, or run from the spec store or the application",
    );
  const port = await freePort();
  server = spawn(
    join(workbench, "node_modules/.bin/storybook"),
    [
      "dev",
      "--config-dir",
      ".storybook-workbench",
      "--port",
      String(port),
      "--ci",
      "--no-open",
      "--quiet",
    ],
    { cwd: workbench, detached: true, stdio: "ignore" },
  );
  const url = `http://127.0.0.1:${port}`;
  const until = Date.now() + START_TIMEOUT;
  while (Date.now() < until) {
    try {
      if ((await fetch(`${url}/index.json`)).ok) return url;
    } catch {}
    await new Promise((r) => setTimeout(r, 2000));
  }
  throw new Error(
    "the workbench did not start in 4 minutes; run pnpm install first",
  );
}

async function stories(url) {
  const answer = await fetch(`${url}/index.json`);
  if (!answer.ok)
    throw new Error(`${url}/index.json answered ${answer.status}`);
  return Object.fromEntries(
    Object.values((await answer.json()).entries)
      .filter((e) => e.type === "story")
      .map((e) => [e.id, e]),
  );
}

function argsParam(values) {
  const pairs = Object.entries(values ?? {}).map(
    ([k, v]) => `${k}:${encodeURIComponent(String(v))}`,
  );
  return pairs.length ? `&args=${pairs.join(";")}` : "";
}

function freePort() {
  return new Promise((done, failed) => {
    const probe = createServer();
    probe.once("error", failed);
    probe.listen(0, "127.0.0.1", () => {
      const { port } = probe.address();
      probe.close(() => done(port));
    });
  });
}

function playwright() {
  for (const at of [workbench, root, process.cwd()].filter(Boolean))
    for (const id of ["playwright", "@playwright/test"]) {
      try {
        return createRequire(join(at, "x.js"))(id);
      } catch {}
    }
  throw new Error("no playwright: run pnpm install, then pnpm setup:browsers");
}

// A screen a capture spec took, kept with what rendered it, at this checkout's commit.
function recordShot() {
  const name = option("name");
  const from = option("from");
  if (!/^[a-z0-9][a-z0-9-]*$/.test(name ?? ""))
    fail("--name: lowercase words joined by hyphens, such as lot-extended");
  if (!from) fail("--from: what rendered it, such as the E2E test's title");
  if (!/\.jpe?g$/i.test(record) || !existsSync(record))
    fail(`${record}: a JPEG the capture spec saved`);
  const out = join(resolve(folder), "shots");
  mkdirSync(out, { recursive: true });
  copyFileSync(record, join(out, `${name}.jpg`));
  const manifestPath = join(out, "shots.json");
  const manifest = existsSync(manifestPath)
    ? JSON.parse(readFileSync(manifestPath, "utf8"))
    : {};
  manifest[`shots/${name}.jpg`] = {
    from,
    recorded: true,
    phone: args.includes("--phone"),
    commit: git(root, "rev-parse", "--short=9", "HEAD"),
    dirty: Boolean(
      git(root, "status", "--porcelain", "--", "apps", "packages"),
    ),
    capturedAt: new Date().toISOString(),
  };
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`shots/${name}.jpg  ${from}`);
}

function git(cwd, ...a) {
  return execFileSync("git", a, { cwd, encoding: "utf8" }).trim();
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

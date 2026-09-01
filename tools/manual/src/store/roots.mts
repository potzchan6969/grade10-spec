import { execFileSync } from "node:child_process";
import { existsSync, realpathSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

/**
 * The two directories everything here reads from. `content` holds the manual —
 * `manual/manual.yaml` and the pages beside it. `store` holds the OpenSpec
 * store — `openspec/specs` and `openspec/changes`. In the store's own
 * repository they are the same directory; a repository that mounts this viewer
 * carries its own `manual/` and points at the store it plans against, so every
 * reader has to say which of the two it means.
 */
export type Roots = { store: string; content: string; own: boolean };

const MANUAL_CONFIG = join("manual", "manual.yaml");

/** The one-repository shape: the manual documents the store it lives in. */
export function rootsOf(root: string): Roots {
  const dir = resolve(root);
  return { store: dir, content: dir, own: true };
}

/**
 * Where the manual and its store are, worked out once at startup.
 *
 * The content root is the nearest directory holding `manual/manual.yaml`,
 * looked for where the person ran the command (`INIT_CWD` under pnpm, else
 * the working directory) — never where this file happens to sit, because a
 * consuming repository runs the viewer out of a submodule and walking up from
 * here would land on the store's own manual instead of theirs.
 *
 * The store is the content repository itself when it carries `openspec/specs`.
 * Otherwise `openspec/config.yaml` names a store id and the `openspec` CLI
 * resolves it through the same per-machine registry `pnpm plan` uses — the
 * registered clone at its own main, not whatever SHA a submodule pins.
 *
 * `MANUAL_ROOT` and `MANUAL_STORE` override the respective search; both fail
 * loudly on a directory that does not hold what they promise.
 */
export function resolveRoots(env: NodeJS.ProcessEnv = process.env): Roots {
  const content = contentRoot(env);
  const store = storeRoot(content, env);
  return {
    store,
    content,
    own: realpathSync(store) === realpathSync(content),
  };
}

function contentRoot(env: NodeJS.ProcessEnv): string {
  const set = env.MANUAL_ROOT;
  if (set) {
    const dir = resolve(set);
    if (!existsSync(join(dir, MANUAL_CONFIG))) {
      throw new Error(`MANUAL_ROOT=${set} holds no ${MANUAL_CONFIG}`);
    }
    return dir;
  }
  for (const from of [env.INIT_CWD, process.cwd()]) {
    if (!from) continue;
    const found = climbTo(resolve(from), MANUAL_CONFIG);
    if (found) return found;
  }
  throw new Error(
    `no ${MANUAL_CONFIG} at or above ${process.cwd()} — run from a repository that has a manual, or set MANUAL_ROOT`,
  );
}

function climbTo(from: string, marker: string): string | undefined {
  for (let dir = from; ; dir = dirname(dir)) {
    if (existsSync(join(dir, marker))) return dir;
    if (dirname(dir) === dir) return undefined;
  }
}

function storeRoot(content: string, env: NodeJS.ProcessEnv): string {
  const set = env.MANUAL_STORE;
  if (set) {
    const dir = resolve(set);
    if (!existsSync(join(dir, "openspec", "specs"))) {
      throw new Error(`MANUAL_STORE=${set} holds no openspec/specs`);
    }
    return dir;
  }
  if (existsSync(join(content, "openspec", "specs"))) return content;
  if (existsSync(join(content, "openspec", "config.yaml"))) {
    return registeredStore(content);
  }
  throw new Error(
    `${content} holds no openspec/specs and no openspec/config.yaml — the manual needs a store to read`,
  );
}

function registeredStore(content: string): string {
  let out: string;
  try {
    out = execFileSync("openspec", ["list", "--json"], {
      cwd: content,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (cause) {
    if ((cause as NodeJS.ErrnoException).code === "ENOENT") {
      throw new Error(
        "the `openspec` CLI is not on PATH — it resolves the store this manual reads; " +
          "install it and `openspec store register <path-to-store>`, or set MANUAL_STORE",
      );
    }
    throw new Error(
      `\`openspec list\` could not resolve the store for ${content}: ${describe(cause)}`,
    );
  }
  // Some commands print a "Using OpenSpec root:" banner before the JSON.
  const parsed: unknown = JSON.parse(out.slice(out.indexOf("{")));
  const path = (parsed as { root?: { path?: unknown } }).root?.path;
  if (typeof path !== "string" || !existsSync(join(path, "openspec"))) {
    throw new Error(
      `\`openspec list\` answered with no usable store path for ${content}`,
    );
  }
  return resolve(path);
}

function describe(cause: unknown): string {
  return cause instanceof Error ? cause.message : String(cause);
}

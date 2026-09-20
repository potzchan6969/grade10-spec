import type {
  CheckoutStanding,
  DeployedHead,
  PullOutcome,
  RelayUrl,
} from "../api/types.ts";
import { git, type GitRun, tryGit } from "./git.mts";

/**
 * What the store answers about `main` moving: the relay a page listens to,
 * how far the checkout stands from `main`, and the pull that catches it up.
 *
 * The relay's url reaches the browser as a file — `/api/relay`, written at
 * build from `RELAY_URL` and answered per request in dev — because a static
 * site has nowhere else to put a deploy-time value. An unset variable is the
 * feature switched off, which is how the site ships until Operations sets it.
 *
 * The standing and the pull are the locally run manual's alone. They read a
 * working tree, so they live here rather than in the app: the browser is told
 * the counts and shown the refusal, and nothing about a checkout is inferred
 * in a page.
 */

/** How long a `git fetch` counts as recent. A page reads the standing every
 * minute per open tab, and every read fetching would be a network call per
 * tab per minute for a number that moves a few times a day. */
const FETCH_EVERY_MS = 60_000;

/** The branch every reading is against. The store's own `main`, named here
 * once: a checkout following another branch is a checkout that has left the
 * one branch the store keeps. */
const MAIN = "main";

/** What a leg that reaches the network is given: a deadline, and a prompt
 * refused rather than waited on. Nobody is at the dev server's terminal to
 * type a password, and a remote that never answers would hold the endpoint
 * open until the tab was closed. */
const OVER_THE_NETWORK: GitRun = {
  env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
  timeout: 30_000,
};

export function relayOf(env: NodeJS.ProcessEnv = process.env): RelayUrl {
  const url = env.RELAY_URL?.trim();
  return url ? { url } : {};
}

/** The two readings a page open in a browser waits on: the relay it listens
 * to, and the head this site was built from. The build writes them as files
 * and the dev server answers them per request, both from here, so a page
 * reads the same keys whichever served it. */
export function liveBodies(
  storeHead: string,
  env: NodeJS.ProcessEnv = process.env,
): { relay: RelayUrl; head: DeployedHead } {
  return { head: { storeHead }, relay: relayOf(env) };
}

/** A git call as this module makes them, so a test reads what each leg was
 * given rather than trusting that it was given anything. */
export type GitCall = (
  root: string,
  args: string[],
  run?: GitRun,
) => Promise<string>;

export type OriginMain = {
  /** Where the checkout stands, with `origin` read at most once a minute. */
  standing: () => Promise<CheckoutStanding>;
  /** Fast-forward onto `main`, or the line the reader is shown instead. */
  pull: () => Promise<PullOutcome>;
};

/**
 * The reading of one checkout, remembered per dev server: the throttle and the
 * pull in flight are this object's, so two tabs polling share one fetch, a
 * second press is told rather than run, and a test holds the clock both are
 * measured on.
 */
export function originMain(
  root: string,
  now: () => number = Date.now,
  call: GitCall = git,
): OriginMain {
  let readAt = 0;
  let fetchedAt: string | undefined;
  /** The pull that is running, while one is. */
  let running: Promise<PullOutcome> | null = null;

  /** Read `origin` where it has not been read this minute. The attempt is what
   * the minute counts from, not the success: a remote that is unreachable or
   * slow would otherwise be asked again per tab per minute. */
  const readOrigin = async (): Promise<void> => {
    if (readAt !== 0 && now() - readAt < FETCH_EVERY_MS) return;
    readAt = now();
    if (!(await hasOrigin(root))) return;
    const at = new Date(readAt).toISOString();
    try {
      await call(root, ["fetch", "origin", MAIN], OVER_THE_NETWORK);
    } catch {
      return;
    }
    fetchedAt = at;
  };

  const standing = async (): Promise<CheckoutStanding> => {
    await readOrigin();
    const [counts, dirty] = await Promise.all([countsOf(root), dirtyOf(root)]);
    return {
      ...counts,
      dirty,
      ...(fetchedAt === undefined ? {} : { fetchedAt }),
    };
  };

  /** One fast-forward at a time. A second press — a second tab, a reader
   * pressing twice — is told rather than run: two pulls over one working tree
   * race each other through git's own index lock. */
  const pull = (): Promise<PullOutcome> => {
    if (running !== null) {
      return Promise.resolve({ error: "A pull is already running." });
    }
    const one = fastForward().finally(() => {
      running = null;
    });
    running = one;
    return one;
  };

  const fastForward = async (): Promise<PullOutcome> => {
    if (!(await hasOrigin(root))) {
      return { error: "Your checkout has no `origin` to pull from." };
    }
    const read = await standing();
    if (read.dirty) {
      return { error: "Your checkout has uncommitted work." };
    }
    if (read.ahead > 0) {
      return {
        error: `Your checkout is ${commits(read.ahead)} ahead of \`main\`.`,
      };
    }
    try {
      await call(root, ["pull", "--ff-only", "origin", MAIN], OVER_THE_NETWORK);
    } catch (refusal) {
      return { error: gitSaid(refusal) };
    }
    const head = (await call(root, ["rev-parse", "HEAD"])).trim();
    return { head, pulled: true };
  };

  return { pull, standing };
}

/** What git said, in one line. A failed call carries git's own complaint on
 * `stderr` and the command it ran in its message, and the line a reader is
 * shown is git's. */
function gitSaid(refusal: unknown): string {
  const said = refusal as {
    stderr?: unknown;
    killed?: boolean;
    message?: unknown;
  };
  const stderr = String(said.stderr ?? "").trim();
  if (stderr !== "") return firstLine(stderr);
  if (said.killed) return "The pull took too long and was stopped.";
  return firstLine(String(said.message ?? "")) || "Git refused the pull.";
}

const firstLine = (text: string): string => text.split("\n")[0].trim();

/** `<ahead>\t<behind>`: the left side is what HEAD has and `origin/main` does
 * not. A clone with no `origin/main` to compare against knows neither count,
 * which reads as level rather than as a failure. */
async function countsOf(
  root: string,
): Promise<{ ahead: number; behind: number }> {
  const counted = await tryGit(root, [
    "rev-list",
    "--left-right",
    "--count",
    `HEAD...origin/${MAIN}`,
  ]);
  const [ahead, behind] = (counted ?? "").trim().split(/\s+/).map(Number);
  return { ahead: ahead || 0, behind: behind || 0 };
}

/** Anything at all in the working tree, untracked files included: a pull is a
 * fast-forward, and a fast-forward over an edit nobody committed loses it. */
async function dirtyOf(root: string): Promise<boolean> {
  const status = await tryGit(root, ["status", "--porcelain"]);
  return (status ?? "").trim() !== "";
}

async function hasOrigin(root: string): Promise<boolean> {
  const remotes = await tryGit(root, ["remote"]);
  return (remotes ?? "").split("\n").includes("origin");
}

function commits(count: number): string {
  return `${count} commit${count === 1 ? "" : "s"}`;
}

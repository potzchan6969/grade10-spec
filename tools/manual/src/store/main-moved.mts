import type { CheckoutStanding, PullOutcome, RelayUrl } from "../api/types.ts";
import { git } from "./git.mts";

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

export function relayOf(env: NodeJS.ProcessEnv = process.env): RelayUrl {
  const url = env.RELAY_URL?.trim();
  return url ? { url } : {};
}

export type OriginMain = {
  /** Where the checkout stands, with `origin` read at most once a minute. */
  standing: () => Promise<CheckoutStanding>;
  /** Fast-forward onto `main`, or the reason it is refused. */
  pull: () => Promise<PullOutcome>;
};

/**
 * The reading of one checkout, remembered per dev server: the throttle is
 * this object's, so two tabs polling share one fetch and a test holds the
 * clock it is measured on.
 */
export function originMain(
  root: string,
  now: () => number = Date.now,
): OriginMain {
  let readAt = 0;
  let fetchedAt: string | undefined;

  /** Read `origin` where it has not been read this minute. False says the
   * counts below are against whatever refs the clone already had. */
  const fetchOrigin = async (): Promise<boolean> => {
    if (readAt !== 0 && now() - readAt < FETCH_EVERY_MS) return true;
    if (!(await hasOrigin(root))) return false;
    if ((await tryGit(root, ["fetch", "origin", MAIN])) === null) return false;
    readAt = now();
    fetchedAt = new Date(readAt).toISOString();
    return true;
  };

  const standing = async (): Promise<CheckoutStanding> => {
    const fetched = await fetchOrigin();
    const [counts, dirty] = await Promise.all([countsOf(root), dirtyOf(root)]);
    return {
      ...counts,
      dirty,
      fetched,
      ...(fetchedAt === undefined ? {} : { fetchedAt }),
    };
  };

  const pull = async (): Promise<PullOutcome> => {
    if (!(await hasOrigin(root))) {
      return { reason: "Your checkout has no `origin` to pull from." };
    }
    const read = await standing();
    if (read.dirty) {
      return { reason: "Your checkout has uncommitted changes." };
    }
    if (read.ahead > 0) {
      return {
        reason: `Your checkout is ${commits(read.ahead)} ahead of \`main\`.`,
      };
    }
    await git(root, ["pull", "--ff-only", "origin", MAIN]);
    const head = (await git(root, ["rev-parse", "HEAD"])).trim();
    return { pulled: true, head };
  };

  return { pull, standing };
}

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

/** A git call whose failure is an answer: a checkout with no `origin`, a ref
 * the clone does not have, a directory that is not a repository. The dev
 * server says what it can read and stays up. */
async function tryGit(root: string, args: string[]): Promise<string | null> {
  try {
    return await git(root, args);
  } catch {
    return null;
  }
}

function commits(count: number): string {
  return `${count} commit${count === 1 ? "" : "s"}`;
}

import { describe, expect, it, vi } from "vitest";
import { REPO } from "../src/editor/config";
import { healthLevel, probeHealth, WORKFLOW } from "../src/shell/health";

/** What the header knows about the site it is being read on. Each of the
 * three questions degrades on its own, and a red deploy outranks everything —
 * a frozen site has to be visible in the tool that froze it. */

const REPO_API = `https://api.github.com/repos/${REPO.owner}/${REPO.repo}`;
const SNAPSHOT = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const LIVE = "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";

const RUN = {
  html_url: "https://github.com/9gag/grade10-spec/actions/runs/42",
  status: "completed",
  conclusion: "success",
  updated_at: "2026-08-30T00:00:00.000Z",
};

function github(routes: Record<string, { status: number; body?: unknown }>) {
  const seen: string[] = [];
  const http = (async (input: string | URL | Request) => {
    const url = String(input);
    seen.push(url);
    const key = Object.keys(routes).find((route) => url.includes(route));
    const answer = key ? routes[key] : { status: 500, body: { message: url } };
    return new Response(
      answer.body === undefined ? "" : JSON.stringify(answer.body),
      { status: answer.status },
    );
  }) as typeof fetch;
  return { http, seen };
}

const HEAD = { status: 200, body: { object: { sha: LIVE } } };
const LEVEL = { status: 200, body: { object: { sha: SNAPSHOT } } };
const GREEN = { status: 200, body: { workflow_runs: [RUN] } };

function ended(conclusion: string | null) {
  return {
    conclusion,
    status: "completed",
    url: RUN.html_url,
    at: RUN.updated_at,
  };
}

describe("healthLevel", () => {
  it("is quiet when the branch is level and the deploy is green", () => {
    expect(
      healthLevel(SNAPSHOT, { head: SNAPSHOT, ahead: 0 }, ended("success")),
    ).toBe("quiet");
  });

  it("warns when the branch has run past the deployed snapshot", () => {
    expect(healthLevel(SNAPSHOT, { head: LIVE, ahead: 2 }, null)).toBe("warn");
  });

  it("goes loud on a failed deploy, whatever the branch is doing", () => {
    expect(
      healthLevel(SNAPSHOT, { head: SNAPSHOT, ahead: 0 }, ended("failure")),
    ).toBe("bad");
  });

  it("says nothing without a live head to compare against", () => {
    expect(healthLevel(SNAPSHOT, null, ended(null))).toBe("quiet");
  });
});

describe("probeHealth", () => {
  it("counts how far the branch is ahead and reads the last deploy", async () => {
    const { http, seen } = github({
      "git/ref/heads/main": HEAD,
      [`compare/${SNAPSHOT}...${LIVE}`]: { status: 200, body: { ahead_by: 3 } },
      [`workflows/${WORKFLOW}/runs`]: GREEN,
    });

    expect(await probeHealth(http, "pat", SNAPSHOT)).toEqual({
      live: { head: LIVE, ahead: 3 },
      deploy: {
        conclusion: "success",
        status: "completed",
        url: RUN.html_url,
        at: RUN.updated_at,
      },
      level: "warn",
    });
    expect(seen.some((url) => url.startsWith(`${REPO_API}/compare/`))).toBe(
      true,
    );
  });

  it("skips the compare when nothing has moved", async () => {
    const { http, seen } = github({
      "git/ref/heads/main": LEVEL,
      [`workflows/${WORKFLOW}/runs`]: GREEN,
    });

    const health = await probeHealth(http, "pat", SNAPSHOT);

    expect(health.level).toBe("quiet");
    expect(health.live).toEqual({ head: SNAPSHOT, ahead: null });
    expect(seen.some((url) => url.includes("/compare/"))).toBe(false);
  });

  it("drops the deploy piece a token cannot read, and keeps the rest", async () => {
    const debug = vi.spyOn(console, "debug").mockImplementation(() => {});
    const { http } = github({
      "git/ref/heads/main": HEAD,
      [`compare/${SNAPSHOT}...${LIVE}`]: { status: 200, body: { ahead_by: 1 } },
      [`workflows/${WORKFLOW}/runs`]: {
        status: 403,
        body: { message: "Resource not accessible by personal access token" },
      },
    });

    const health = await probeHealth(http, "pat", SNAPSHOT);

    expect(health.deploy).toBeNull();
    expect(health.live).toEqual({ head: LIVE, ahead: 1 });
    expect(health.level).toBe("warn");
    // The expected scope gap is a debug note, not a warning on every load.
    expect(debug).toHaveBeenCalled();
    debug.mockRestore();
  });

  it("still says the branch moved when the compare refuses", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { http } = github({
      "git/ref/heads/main": HEAD,
      [`compare/${SNAPSHOT}...${LIVE}`]: { status: 404 },
      [`workflows/${WORKFLOW}/runs`]: GREEN,
    });

    expect((await probeHealth(http, "pat", SNAPSHOT)).live).toEqual({
      head: LIVE,
      ahead: null,
    });
    warn.mockRestore();
  });

  it("goes loud when the last deploy on main failed", async () => {
    const { http } = github({
      "git/ref/heads/main": LEVEL,
      [`workflows/${WORKFLOW}/runs`]: {
        status: 200,
        body: { workflow_runs: [{ ...RUN, conclusion: "failure" }] },
      },
    });

    expect((await probeHealth(http, "pat", SNAPSHOT)).level).toBe("bad");
  });
});

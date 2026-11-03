import {
  type ImageArtifact,
  type ProfileId,
  storyCatalogueRuns,
  type VerificationManifest,
} from "@grade10/ui-verification/model";
import { describe, expect, it } from "vitest";
import type { Approval, ReferenceRecord } from "./archive-client";
import {
  approvalBucket,
  batchPrompt,
  batchTargets,
  buildCases,
  type DashboardCase,
  driftOf,
  orderForApprovals,
  orderForSite,
  type PairResult,
  type PromptContext,
  pairKey,
  pairsToCompare,
  settledWithoutPixels,
  siteOf,
  statusOfFlags,
  storyPlace,
  storyPrompt,
  storyStatuses,
} from "./dashboard-model";

const PROFILES: readonly ProfileId[] = ["desktop", "tablet", "mobile"];
const REGION = { x: 0, y: 0, width: 100, height: 100 };

function image(sha: string): ImageArtifact {
  return {
    key: `ui-verification/${sha}.png`,
    sha256: sha,
    width: 200,
    height: 200,
  };
}

function reference(
  caseId: string,
  profileId: ProfileId,
  sha: string,
  capturedAt: string,
  region = REGION,
): ReferenceRecord {
  return {
    caseId,
    targetId: "site",
    capturePointId: "default",
    referenceId: `ref-${caseId}-${profileId}-${sha}`,
    profileId,
    locale: "en",
    storyId: `story-${caseId}`,
    commit: "c".repeat(40),
    ref: "HEAD",
    verified: true,
    image: image(sha),
    region,
    capturedAt,
    capturedBy: "local-development",
  };
}

function approval(
  record: ReferenceRecord,
  decision: Approval["decision"],
): Approval {
  return {
    caseId: record.caseId,
    targetId: record.targetId,
    capturePointId: record.capturePointId,
    approvalId: `approval-${record.referenceId}`,
    referenceId: record.referenceId,
    profileId: record.profileId,
    locale: record.locale,
    referenceHash: record.image.sha256,
    decision,
    comment: "",
    approver: "local-development",
    createdAt: record.capturedAt,
  };
}

function run(caseIds: readonly string[], createdAt = "2026-11-02T00:00:00Z") {
  return {
    schemaVersion: 1,
    runId: `run-${createdAt}`,
    createdAt,
    checkpoint: {
      app: { ref: "HEAD", commit: "a".repeat(40) },
      reference: { ref: "HEAD", commit: "b".repeat(40) },
    },
    catalogue: caseIds.map((caseId) => ({
      schemaVersion: 1,
      caseId,
      targetId: "site",
      capturePointId: "default",
      storyId: `story-${caseId}`,
      label: `Pages/${caseId}`,
      scoreProfile: "desktop",
      recipe: "e2e/recipe.mjs",
      reference: { storyId: `story-${caseId}` },
      status: "active",
    })),
    captures: caseIds.flatMap((caseId) =>
      PROFILES.map((profileId) => ({
        caseId,
        targetId: "site",
        capturePointId: "default",
        profileId,
        inputFingerprint: "f",
        status: "captured",
        provenance: {
          verified: true,
          appCommit: "a".repeat(40),
          referenceCommit: "b".repeat(40),
          capturedAt: createdAt,
        },
        site: image(`site-${caseId}-${profileId}`),
        reference: image(`run-${caseId}-${profileId}`),
        siteRegion: REGION,
        referenceRegion: REGION,
      })),
    ),
  } as unknown as VerificationManifest;
}

function cases(
  runs: readonly VerificationManifest[],
  references: readonly ReferenceRecord[],
  approvals: readonly Approval[],
): DashboardCase[] {
  return buildCases({
    runs,
    references,
    approvals,
    locale: "en",
    entryOf: () => undefined,
  });
}

/** Every size approved at `sha`, then a newer capture at `next` for one size. */
function approvedThenMoved(
  caseId: string,
  next?: { profile: ProfileId; sha: string },
) {
  const references = PROFILES.map((profile) =>
    reference(
      caseId,
      profile,
      `old-${caseId}-${profile}`,
      "2026-10-01T00:00:00Z",
    ),
  );
  const approvals = references.map((record) => approval(record, "approved"));
  if (next) {
    references.push(
      reference(caseId, next.profile, next.sha, "2026-10-02T00:00:00Z"),
    );
  }
  return { references, approvals };
}

describe("story status", () => {
  it("is approved only when every size is", () => {
    expect(statusOfFlags(["approved", "approved", "approved"])).toBe(
      "approved",
    );
    expect(statusOfFlags(["approved", "not-approved", "approved"])).toBe(
      "not-approved",
    );
  });

  it("gives a story one status, so the four boxes add up", () => {
    expect(statusOfFlags(["changes-requested", "none", "approved"])).toBe(
      "changes-requested",
    );
    expect(statusOfFlags(["none", "none", "none"])).toBe("none");
    expect(statusOfFlags(["none", "approved", "approved"])).toBe(
      "not-approved",
    );
  });

  it("spans every step of a flow story", () => {
    const first = approvedThenMoved("flow");
    const list = cases([run(["flow"])], first.references, first.approvals);
    const stepTwo: DashboardCase = {
      ...list[0],
      key: "step-two",
      sizes: {
        ...list[0].sizes,
        mobile: {
          ...list[0].sizes.mobile,
          status: { ...list[0].sizes.mobile.status, flag: "not-approved" },
        },
      },
    };
    expect(storyStatuses([list[0], stepTwo]).get("story-flow")).toBe(
      "not-approved",
    );
  });
});

describe("drift readings", () => {
  it("settles matching bytes and boxes of another size without pixels", () => {
    const same = { artifact: image("x"), region: REGION };
    expect(
      settledWithoutPixels({ key: "k", reference: same, other: same }),
    ).toEqual({ kind: "compared", ratio: 0 });
    expect(
      settledWithoutPixels({
        key: "k",
        reference: same,
        other: {
          artifact: image("y"),
          region: { ...REGION, width: 50 },
        },
      }),
    ).toEqual({ kind: "size-mismatch" });
    expect(
      settledWithoutPixels({
        key: "k",
        reference: same,
        other: { artifact: image("y"), region: REGION },
      }),
    ).toBeNull();
  });

  it("reads the newest capture against the last approval", () => {
    const { references, approvals } = approvedThenMoved("a", {
      profile: "mobile",
      sha: "new",
    });
    const [item] = cases([run(["a"])], references, approvals);
    const pair = item.sizes.mobile.drift;
    expect(pair).not.toBeNull();
    const results = new Map<string, PairResult>([
      [pair?.key ?? "", { kind: "compared", ratio: 0.246 }],
    ]);
    expect(driftOf(item.sizes.mobile, results)).toEqual({
      kind: "ratio",
      ratio: 0.246,
    });
    expect(driftOf(item.sizes.desktop, new Map())).toEqual({
      kind: "ratio",
      ratio: 0,
    });
  });

  it("has nothing to hold the site to at last approved without a baseline", () => {
    const [item] = cases([run(["a"])], [], []);
    expect(siteOf(item.sizes.desktop, "approved", new Map())).toEqual({
      kind: "no-baseline",
    });
    expect(siteOf(item.sizes.desktop, "run", new Map())).toEqual({
      kind: "pending",
    });
  });

  it("asks for each pair once", () => {
    const [item] = cases([run(["a"])], [], []);
    const pairs = pairsToCompare([item, item], "run");
    expect(pairs).toHaveLength(3);
    expect(new Set(pairs.map((pair) => pair.key)).size).toBe(3);
  });
});

describe("the newest run", () => {
  it("holds a case's evidence, unless that run left it out", () => {
    const newer = run(["a"], "2026-11-02T00:00:00Z");
    const skipped = {
      ...newer,
      runId: "run-newer",
      createdAt: "2026-11-03T00:00:00Z",
      captures: newer.captures.map((capture) => ({
        ...capture,
        status: "not-selected",
        site: undefined,
        reference: undefined,
      })),
    } as unknown as VerificationManifest;
    const [item] = cases([skipped, newer], [], []);
    expect(item.runId).toBe(newer.runId);
  });
});

describe("approvals order", () => {
  function fixture() {
    const drifted = approvedThenMoved("drifted", {
      profile: "mobile",
      sha: "d",
    });
    const small = approvedThenMoved("small", { profile: "mobile", sha: "s" });
    const done = approvedThenMoved("done");
    const list = cases(
      [run(["drifted", "small", "done", "new"])],
      [...drifted.references, ...small.references, ...done.references],
      [...drifted.approvals, ...small.approvals, ...done.approvals],
    );
    const byName = (id: string) =>
      list.find((item) => item.identity.caseId === id) as DashboardCase;
    const results = new Map<string, PairResult>([
      [
        byName("drifted").sizes.mobile.drift?.key ?? "",
        { kind: "compared", ratio: 0.246 },
      ],
      [
        byName("small").sizes.mobile.drift?.key ?? "",
        { kind: "compared", ratio: 0.03 },
      ],
    ]);
    return { list, byName, results };
  }

  it("puts drift over the tolerance first, then no baseline, then the rest", () => {
    const { list, results } = fixture();
    expect(
      orderForApprovals(list, results, false).map(
        (item) => item.identity.caseId,
      ),
    ).toEqual(["drifted", "new", "small"]);
  });

  it("shows approved cases only when asked", () => {
    const { list, byName, results } = fixture();
    expect(approvalBucket(byName("done"), results)).toBe(3);
    expect(orderForApprovals(list, results, true).at(-1)?.identity.caseId).toBe(
      "done",
    );
  });
});

describe("site drift order", () => {
  function fixture() {
    const list = cases([run(["a", "b", "c"])], [], []);
    const pairOf = (id: string, profile: ProfileId) =>
      list.find((item) => item.identity.caseId === id)?.sizes[profile]
        .siteAgainstRun?.key ?? "";
    const results = new Map<string, PairResult>([
      [pairOf("a", "desktop"), { kind: "compared", ratio: 0.3 }],
      [pairOf("b", "mobile"), { kind: "compared", ratio: 0.6 }],
      [pairOf("c", "desktop"), { kind: "compared", ratio: 0.02 }],
    ]);
    return { list, results };
  }

  it("ranks by the highest drift between the sizes", () => {
    const { list, results } = fixture();
    expect(
      orderForSite(list, PROFILES, "run", results).map(
        (item) => item.identity.caseId,
      ),
    ).toEqual(["b", "a", "c"]);
  });

  it("ranks by the focused size alone", () => {
    const { list, results } = fixture();
    expect(
      orderForSite(list, ["desktop"], "run", results).map(
        (item) => item.identity.caseId,
      ),
    ).toEqual(["a", "c", "b"]);
  });
});

describe("fix prompts", () => {
  function fixture() {
    const list = cases([run(["a", "b"])], [], []);
    const pairOf = (id: string) =>
      list.find((item) => item.identity.caseId === id)?.sizes.mobile
        .siteAgainstRun?.key ?? "";
    const context: PromptContext = {
      origin: "https://storybook.test",
      locale: "en",
      mode: "run",
      profiles: PROFILES,
      results: new Map<string, PairResult>([
        [pairOf("a"), { kind: "compared", ratio: 0.26 }],
        [pairOf("b"), { kind: "compared", ratio: 0.06 }],
      ]),
    };
    return { list, context };
  }

  it("reports one story's drifted sizes with the rules to fix it", () => {
    const { list, context } = fixture();
    const text = storyPrompt(list[0], context);
    expect(text).toContain("Mobile (390 × 844): 26.0% of the component region");
    expect(text).toContain("https://storybook.test/?path=/story/story-a");
    expect(text).toContain("Change the site, not external/grade10-spec");
    expect(text).not.toContain("Desktop (");
  });

  it("batches only the stories past the tolerance", () => {
    const { list, context } = fixture();
    const targets = batchTargets(list, context);
    expect(targets.map((item) => item.identity.caseId)).toEqual(["a"]);
    expect(batchPrompt(targets, context)).toContain(
      "Fix these 1 layout drifts",
    );
  });
});

describe("story place", () => {
  it("reads the domain and path from the Storybook title", () => {
    expect(
      storyPlace(
        { title: "Auction/Bidding/Screens/My Auctions", name: "Post Auction" },
        "x",
      ),
    ).toEqual({
      name: "My Auctions · Post Auction",
      path: "Auction / Bidding",
      domain: "Auction",
    });
  });

  it("leaves a Default story's name out", () => {
    expect(
      storyPlace(
        { title: "Site/Navigation/Screens/Not Found", name: "Default" },
        "x",
      ).name,
    ).toBe("Not Found");
  });

  it("keeps a flow's step as its name", () => {
    expect(
      storyPlace(
        { title: "Auction/Flows", name: "Bid and win" },
        "Auction/Flows/Confirm bid",
      ),
    ).toEqual({
      name: "Confirm bid",
      path: "Auction / Flows",
      domain: "Auction",
    });
  });

  it("falls back to the recorded label for a story no longer in the index", () => {
    expect(storyPlace(undefined, "Pages/Not Found/Default page")).toEqual({
      name: "Default page",
      path: "Pages / Not Found",
      domain: "Pages",
    });
  });
});

describe("pair identity", () => {
  it("changes with the box as well as the bytes", () => {
    const side = { artifact: image("x"), region: REGION };
    expect(pairKey(side, side)).not.toBe(
      pairKey(side, { artifact: image("x") }),
    );
  });
});

describe("story cases with no site", () => {
  const catalogue = (caseIds: readonly string[], createdAt: string) =>
    storyCatalogueRuns({
      cases: caseIds.map((caseId) => ({ caseId, storyId: `story-${caseId}` })),
      commit: "d".repeat(40),
      ref: "main",
      createdAt,
    });

  it("draws a row for each story case, judged by its references alone", async () => {
    const stories = await catalogue(["block"], "2026-11-03T00:00:00Z");
    const [row] = cases(stories, [], []);
    expect(row.identity).toEqual({
      caseId: "block",
      targetId: "storybook",
      capturePointId: "story",
    });
    expect(statusOfFlags(PROFILES.map((id) => row.sizes[id].status.flag))).toBe(
      "none",
    );
    expect(siteOf(row.sizes.desktop, "approved", new Map())).toEqual({
      kind: "not-captured",
    });
  });

  it("holds a case a site run declares to its site identity", async () => {
    const stories = await catalogue(["flow", "block"], "2026-11-03T00:00:00Z");
    const rows = cases([run(["flow"]), ...stories], [], []);
    expect(rows.map((row) => row.identity.targetId).sort()).toEqual([
      "site",
      "storybook",
    ]);
  });

  it("reads only the newest catalogue, so a dropped story leaves", async () => {
    const older = await catalogue(["block", "gone"], "2026-11-01T00:00:00Z");
    const newer = await catalogue(["block"], "2026-11-03T00:00:00Z");
    expect(
      cases([...older, ...newer], [], []).map((row) => row.identity.caseId),
    ).toEqual(["block"]);
  });
});

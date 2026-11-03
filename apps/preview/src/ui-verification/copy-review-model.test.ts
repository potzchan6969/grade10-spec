import { describe, expect, it } from "vitest";
import {
  type CopyChangeset,
  type CopyProposal,
  type CopyRecords,
  catalogRows,
  cellStatus,
  EMPTY_RECORDS,
  indexRecords,
} from "./copy-review-model";

const cell = {
  layer: "shared",
  locale: "en",
  namespace: "auction",
  key: "noListings",
};
const ann = { subject: "ann" };

function proposal(overrides: Partial<CopyProposal> = {}): CopyProposal {
  return {
    ...cell,
    id: "p1",
    baseValue: "Old",
    baseHash: "old-hash",
    value: "New",
    issues: [],
    proposer: ann,
    createdAt: "2026-11-03T00:00:01Z",
    ...overrides,
  };
}

function shipped(
  status: CopyChangeset["status"],
  proposalId = "p1",
): CopyChangeset {
  return {
    id: "c1",
    proposalIds: [proposalId],
    skipped: [],
    shipment: {
      kind: "pull-request",
      repo: "9gag/grade10-spec",
      number: 7,
      url: "https://github.com/9gag/grade10-spec/pull/7",
      branch: "copy-review/x",
    },
    status,
    author: ann,
    createdAt: "2026-11-03T00:00:03Z",
  };
}

const state = (records: Partial<CopyRecords>, value: string, hash: string) =>
  cellStatus(indexRecords({ ...EMPTY_RECORDS, ...records }), cell, value, hash)
    .state;

describe("catalogRows", () => {
  it("lists each key once with every locale and its English", () => {
    const shared = {
      en: { auction: { featured: { bidNow: "Bid Now" } } },
      "zh-Hant": { auction: { featured: { bidNow: "立即出價" } } },
      ko: { auction: {} },
    };
    expect(catalogRows("shared", shared, shared)).toEqual([
      {
        id: "shared/auction/featured.bidNow",
        layer: "shared",
        namespace: "auction",
        key: "featured.bidNow",
        reference: "Bid Now",
        values: { en: "Bid Now", "zh-Hant": "立即出價", ko: null },
      },
    ]);
  });
});

describe("cellStatus", () => {
  it("is not reviewed until a review judged this exact value", () => {
    const review = {
      ...cell,
      id: "r1",
      valueHash: "old-hash",
      reviewer: ann,
      createdAt: "2026-11-03T00:00:00Z",
    };
    expect(state({ reviews: [review] }, "Old", "old-hash")).toBe("reviewed");
    expect(state({ reviews: [review] }, "Changed", "new-hash")).toBe("todo");
  });

  it("follows an edit from proposal to approval", () => {
    expect(state({ proposals: [proposal()] }, "Old", "old-hash")).toBe(
      "proposed",
    );
    expect(
      state(
        {
          proposals: [
            proposal({
              issues: [{ severity: "error", kind: "syntax", message: "x" }],
            }),
          ],
        },
        "Old",
        "old-hash",
      ),
    ).toBe("check-failed");
    const decide = (verdict: "approved" | "changes-requested", at: string) => ({
      id: at,
      proposalId: "p1",
      verdict,
      comment: "",
      approver: ann,
      createdAt: at,
    });
    expect(
      state(
        {
          proposals: [proposal()],
          decisions: [
            decide("changes-requested", "2026-11-03T00:00:02Z"),
            decide("approved", "2026-11-03T00:00:03Z"),
          ],
        },
        "Old",
        "old-hash",
      ),
    ).toBe("approved");
  });

  it("ignores an edit proposed against a value the catalog no longer holds", () => {
    expect(state({ proposals: [proposal()] }, "Other", "other-hash")).toBe(
      "todo",
    );
  });

  it("waits for the pin once the merged value is in the catalog", () => {
    const waiting = shipped({
      pullRequest: { state: "merged" },
      site: { pin: "abc", includesMerge: false },
    });
    expect(
      state({ proposals: [proposal()], changesets: [waiting] }, "New", "h"),
    ).toBe("waiting-for-pin");
    const live = shipped({
      pullRequest: { state: "merged" },
      site: { pin: "def", includesMerge: true },
    });
    expect(
      state({ proposals: [proposal()], changesets: [live] }, "New", "h"),
    ).toBe("reviewed");
  });

  it("shows a shipped edit as shipping until its pull request closes", () => {
    const open = shipped({ pullRequest: { state: "open" } });
    expect(
      state({ proposals: [proposal()], changesets: [open] }, "Old", "old-hash"),
    ).toBe("shipping");
    const closed = shipped({ pullRequest: { state: "closed" } });
    expect(
      state(
        { proposals: [proposal()], changesets: [closed] },
        "Old",
        "old-hash",
      ),
    ).toBe("closed");
  });
});

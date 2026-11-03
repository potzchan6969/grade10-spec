import { describe, expect, it } from "vitest";
import {
  type Approval,
  approvalRecord,
  type ReferenceRecord,
  referenceRecord,
} from "./archive-client";
import {
  driftNotice,
  referenceStatus,
  unchangedSinceApproval,
} from "./capture-stamp";
import type { PixelComparison } from "./pixel-compare";

const IDENTITY = {
  caseId: "vc_case",
  targetId: "page",
  capturePointId: "default",
};

const reference = (
  referenceId: string,
  sha256: string,
  capturedAt: string,
  overrides: Partial<ReferenceRecord> = {},
): ReferenceRecord => ({
  ...IDENTITY,
  referenceId,
  profileId: "desktop",
  locale: "zh-Hant",
  storyId: "pages-home--default",
  commit: "b".repeat(40),
  ref: "main",
  verified: true,
  image: {
    key: `ui-verification/${referenceId}/reference.png`,
    sha256,
    width: 1440,
    height: 900,
  },
  region: { x: 0, y: 0, width: 10, height: 10 },
  capturedAt,
  capturedBy: "designer@example.com",
  ...overrides,
});

const approval = (
  approvalId: string,
  of: ReferenceRecord,
  createdAt: string,
  overrides: Partial<Approval> = {},
): Approval => ({
  ...IDENTITY,
  approvalId,
  referenceId: of.referenceId,
  profileId: of.profileId,
  locale: of.locale,
  referenceHash: of.image.sha256,
  decision: "approved",
  comment: "",
  approver: "designer@example.com",
  createdAt,
  ...overrides,
});

const status = (references: ReferenceRecord[], approvals: Approval[]) =>
  referenceStatus(references, approvals, IDENTITY, "desktop", "zh-Hant");

const FIRST = reference("reference-1", "a".repeat(64), "2026-10-29T09:00:00Z");
const SECOND = reference("reference-2", "b".repeat(64), "2026-10-29T10:00:00Z");

describe("reference approval", () => {
  it("starts with nothing captured or approved", () => {
    expect(status([], [])).toMatchObject({
      flag: "none",
      current: null,
      approved: null,
    });
  });

  it("approves the reference it captured", () => {
    const result = status(
      [FIRST],
      [approval("a1", FIRST, "2026-10-29T09:01:00Z")],
    );
    expect(result.flag).toBe("approved");
    expect(result.approved?.reference.referenceId).toBe("reference-1");
  });

  it("flags a newer capture against the last approval", () => {
    const result = status(
      [FIRST, SECOND],
      [approval("a1", FIRST, "2026-10-29T09:01:00Z")],
    );
    expect(result.flag).toBe("not-approved");
    expect(result.current?.referenceId).toBe("reference-2");
    expect(result.approved?.reference.referenceId).toBe("reference-1");
  });

  it("lets a later capture of the same bytes keep the approval", () => {
    const again = reference(
      "reference-3",
      FIRST.image.sha256,
      "2026-10-29T11:00:00Z",
    );
    expect(
      status([FIRST, again], [approval("a1", FIRST, "2026-10-29T09:01:00Z")])
        .flag,
    ).toBe("approved");
  });

  it("lets the newest decision on the current bytes stand", () => {
    const result = status(
      [FIRST],
      [
        approval("a1", FIRST, "2026-10-29T09:01:00Z"),
        approval("a2", FIRST, "2026-10-29T09:02:00Z", {
          decision: "changes-requested",
          comment: "Heading moved",
        }),
      ],
    );
    expect(result.flag).toBe("changes-requested");
    expect(result.history.map((item) => item.approvalId)).toEqual(["a2", "a1"]);
    expect(result.approved?.approval.approvalId).toBe("a1");
  });

  it("ignores other sizes, locales and targets", () => {
    const other = [
      reference("r-m", "c".repeat(64), "2026-10-29T12:00:00Z", {
        profileId: "mobile",
      }),
      reference("r-en", "c".repeat(64), "2026-10-29T12:00:00Z", {
        locale: "en",
      }),
      reference("r-t", "c".repeat(64), "2026-10-29T12:00:00Z", {
        targetId: "content",
      }),
    ];
    expect(status(other, []).current).toBeNull();
  });

  it("reads archived records and names people by email", () => {
    const read = referenceRecord({
      schemaVersion: 1,
      ...FIRST,
      selector: "main",
      image: { ...FIRST.image, sha256: FIRST.image.sha256.toUpperCase() },
      capturedBy: { subject: "sub", email: "designer@example.com" },
    });
    expect(read.image.sha256).toBe(FIRST.image.sha256);
    expect(read.capturedBy).toBe("designer@example.com");
    expect(
      approvalRecord({
        ...approval("a1", FIRST, "2026-10-29T09:01:00Z"),
        approver: { subject: "local-development" },
      }).approver,
    ).toBe("local-development");
  });

  it("refuses records it cannot read", () => {
    expect(() => referenceRecord({ referenceId: "r" })).toThrow(
      "unreadable reference",
    );
    expect(() => approvalRecord({ approvalId: "a" })).toThrow(
      "unreadable approval",
    );
  });
});

describe("reference drift", () => {
  const compared = (ratio: number): PixelComparison => ({
    kind: "compared",
    size: { width: 1, height: 1 },
    ratio,
    differing: 0,
    regions: [],
    diffUrl: "",
  });

  it("stays quiet up to 10% and flags past it", () => {
    expect(driftNotice(undefined)).toBe("");
    expect(driftNotice(compared(0.1))).toBe("");
    expect(driftNotice(compared(0.246))).toBe(
      "Reference drifted 24.6% since approval",
    );
  });

  it("flags a reference whose region changed size", () => {
    expect(
      driftNotice({
        kind: "size-mismatch",
        reference: { width: 1, height: 1 },
        site: { width: 2, height: 1 },
      }),
    ).toBe("Reference size changed since approval");
  });
});

describe("nothing new to approve", () => {
  const approvedFirst = approval("a1", FIRST, "2026-10-29T09:01:00Z");

  it("holds a current reference with no pixel apart from the approved one", () => {
    const result = status([FIRST, SECOND], [approvedFirst]);
    expect(unchangedSinceApproval(result, 0)).toBe(true);
  });

  it("holds the very bytes that were approved before any comparison", () => {
    const again = reference(
      "reference-3",
      FIRST.image.sha256,
      "2026-10-29T11:00:00Z",
    );
    expect(
      unchangedSinceApproval(
        status([FIRST, again], [approvedFirst]),
        undefined,
      ),
    ).toBe(true);
  });

  it("offers approval once a pixel moved, or before it is compared", () => {
    const result = status([FIRST, SECOND], [approvedFirst]);
    expect(unchangedSinceApproval(result, 0.0001)).toBe(false);
    expect(unchangedSinceApproval(result, undefined)).toBe(false);
  });

  it("offers approval with no baseline", () => {
    expect(unchangedSinceApproval(status([SECOND], []), 0)).toBe(false);
  });

  it("lets a change request on the same bytes be reversed", () => {
    const result = status(
      [FIRST],
      [
        approvedFirst,
        approval("a2", FIRST, "2026-10-29T09:05:00Z", {
          decision: "changes-requested",
          comment: "Wrong",
        }),
      ],
    );
    expect(unchangedSinceApproval(result, 0)).toBe(false);
  });
});

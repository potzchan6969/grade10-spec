import { describe, expect, it } from "vitest";
import type { SpecEntry } from "../src/api/types";
import {
  allowedProposal,
  authorOf,
  citablesOf,
  citesForRequirement,
  draftProblem,
  draftProposal,
  type ProposalDraft,
  proposalPaths,
  slugOf,
  slugProblem,
  today,
  withdrawProblem,
} from "../src/editor/propose";
import { NO_GIT } from "../src/store/git.mts";
import { readChanges } from "../src/store/read-changes.mts";
import { writeStore } from "./tmp-store";

/** The bytes a proposal is, and the bytes it must never be. A draft that the
 * store's own reader cannot read back is a proposal nobody will ever see, so
 * the round-trip below is the real assertion here. */

const DRAFT: ProposalDraft = {
  slug: "expire-loyalty-points",
  title: "Loyalty points should expire",
  why: "Collectors hoard points they never spend, and the liability grows every month.",
  author: "echo",
  cites: ["grade10-store/loyalty", "Points never expire", "loyalty-SC-04"],
  date: "2026-08-30",
};

const MANIFEST = "openspec/changes/expire-loyalty-points/.openspec.yaml";
const PROPOSAL = "openspec/changes/expire-loyalty-points/proposal.md";

function filesOf(draft: ProposalDraft = DRAFT): Record<string, string> {
  return Object.fromEntries(
    draftProposal(draft).map((file) => [file.path, file.content]),
  );
}

describe("the draft a proposal writes", () => {
  it("writes the pm-planning manifest and nothing else in it", () => {
    expect(filesOf()[MANIFEST]).toBe(
      "schema: pm-planning\ncreated: 2026-08-30\n",
    );
  });

  it("writes the title, the author line, the why, and the ids cited", () => {
    expect(filesOf()[PROPOSAL]).toBe(
      [
        "# Loyalty points should expire",
        "",
        "**Author:** @echo - 2026-08-30",
        "",
        "## Why",
        "",
        "Collectors hoard points they never spend, and the liability grows every month.",
        "",
        "## References",
        "",
        "- `grade10-store/loyalty`",
        "- `Points never expire`",
        "- `loyalty-SC-04`",
        "",
      ].join("\n"),
    );
  });

  it("leaves out the references when nothing was cited", () => {
    const text = filesOf({ ...DRAFT, cites: [] })[PROPOSAL];
    expect(text).not.toContain("## References");
    expect(text.endsWith("every month.\n")).toBe(true);
  });

  it("writes those two files and no third", () => {
    expect(draftProposal(DRAFT).map((file) => file.path)).toEqual(
      proposalPaths(DRAFT.slug),
    );
  });

  it("dates itself in the store's own format", () => {
    expect(today(new Date("2026-08-30T22:15:00.000Z"))).toBe("2026-08-30");
  });
});

describe("the draft read back through the store reader", () => {
  const changes = readChanges(writeStore(filesOf()), NO_GIT);
  const change = changes[0];

  it("reads as one change, with nothing malformed in it", () => {
    expect(changes).toHaveLength(1);
    expect(change.error).toBeUndefined();
    expect(change.id).toBe("expire-loyalty-points");
  });

  it("carries the schema, the created date and the author", () => {
    expect(change.schema).toBe("pm-planning");
    expect(change.created).toBe("2026-08-30");
    expect(change.author).toBe("echo");
  });

  it("carries the title and the why, the references left out of the why", () => {
    expect(change.title).toBe("Loyalty points should expire");
    expect(change.why).toBe(
      "Collectors hoard points they never spend, and the liability grows every month.",
    );
  });

  it("carries no delta and no task group at all", () => {
    expect(change.deltas).toEqual([]);
    expect(change.taskGroups).toEqual([]);
    expect(change.owners).toEqual([]);
  });
});

describe("what a slug may be", () => {
  it("takes one from the title", () => {
    expect(slugOf("Loyalty points should expire!")).toBe(
      "loyalty-points-should-expire",
    );
  });

  it.each([
    ["archive", /the fold/],
    ["", /required/],
    ["-leading", /lower-case/],
    ["Upper", /lower-case/],
    ["has space", /lower-case/],
    ["dots.in.it", /lower-case/],
    ["a/b", /lower-case/],
  ])("refuses %s", (slug, reason) => {
    expect(slugProblem(slug)).toMatch(reason);
  });

  it("takes an ordinary kebab slug", () => {
    expect(slugProblem("expire-loyalty-points")).toBeNull();
  });
});

describe("the path allowlist", () => {
  const file = (path: string) => ({ path, content: "x" });
  const proposal = file(PROPOSAL);

  it("admits one new change directory's own two files", () => {
    expect(allowedProposal(draftProposal(DRAFT))).toEqual({
      slug: "expire-loyalty-points",
    });
  });

  it.each([
    ["a durable spec", "openspec/specs/grade10-store/loyalty/spec.md"],
    ["a delta", "openspec/changes/expire-loyalty-points/specs/x/spec.md"],
    ["a task list", "openspec/changes/expire-loyalty-points/tasks.md"],
    ["a manual page", "manual/products/grade10-store/loyalty.md"],
    ["a path that climbs", "openspec/changes/../specs/x/spec.md"],
    ["the archive", "openspec/changes/archive/proposal.md"],
    [
      "an archived change",
      "openspec/changes/archive/2026-01-01-old/proposal.md",
    ],
  ])("refuses %s", (_what, path) => {
    const answer = allowedProposal([proposal, file(path)]);
    expect(answer).toHaveProperty("error");
    expect((answer as { error: string }).error).toContain(path.split("/")[2]);
  });

  it("refuses two changes in one write", () => {
    const answer = allowedProposal([
      proposal,
      file("openspec/changes/other-thing/proposal.md"),
    ]);
    expect((answer as { error: string }).error).toMatch(/another change/);
  });

  it("refuses a proposal that has no proposal.md", () => {
    expect(allowedProposal([file(MANIFEST)])).toEqual({
      error: "a proposal without `proposal.md` cannot be read",
    });
  });

  it("refuses the same path twice", () => {
    expect(allowedProposal([proposal, proposal])).toEqual({
      error: `\`${PROPOSAL}\` is written twice`,
    });
  });

  it("refuses more files than a proposal has", () => {
    expect(
      allowedProposal([proposal, file(MANIFEST), file(MANIFEST)]),
    ).toHaveProperty("error");
  });
});

describe("what a withdrawal may touch", () => {
  it("takes a directory holding only a proposal", () => {
    expect(
      withdrawProblem("expire-loyalty-points", [
        ".openspec.yaml",
        "proposal.md",
      ]),
    ).toBeNull();
  });

  it("names the file that makes it more than a proposal", () => {
    expect(
      withdrawProblem("expire-loyalty-points", [
        ".openspec.yaml",
        "proposal.md",
        "tasks.md",
      ]),
    ).toMatch(/`tasks.md`/);
  });

  it("refuses a directory with no proposal in it", () => {
    expect(
      withdrawProblem("expire-loyalty-points", [".openspec.yaml"]),
    ).toMatch(/no `proposal.md`/);
  });

  it("refuses the archive before it reads anything", () => {
    expect(withdrawProblem("archive", ["proposal.md"])).toMatch(/the fold/);
  });
});

describe("what a draft refuses to be", () => {
  it.each([
    ["no title", { title: " " }, /title/],
    ["a title over two lines", { title: "one\ntwo" }, /one line/],
    ["no why", { why: "  " }, /say why/],
    ["a heading in the why", { why: "## Why not\n\nthis" }, /heading/],
    ["a handle nobody has", { author: "@echo" }, /handle/],
    ["a date that is not one", { date: "30-08-2026" }, /YYYY-MM-DD/],
  ])("refuses %s", (_what, patch, reason) => {
    expect(draftProblem({ ...DRAFT, ...patch })).toMatch(reason);
    expect(() => draftProposal({ ...DRAFT, ...patch })).toThrow(reason);
  });

  it("takes the draft it was given", () => {
    expect(draftProblem(DRAFT)).toBeNull();
  });

  it("keeps a backtick in an id from ending the code span", () => {
    const text = filesOf({ ...DRAFT, cites: ["we`ird"] })[PROPOSAL];
    expect(text).toContain("- `we ird`");
  });
});

describe("what a proposal can cite", () => {
  const spec: SpecEntry = {
    id: "demo-product/alpha",
    title: "alpha",
    purpose: "",
    requirements: [
      {
        name: "Alpha does things",
        text: "",
        scenarios: [
          { id: "alpha-SC-01", name: "It happens", text: "" },
          { name: "It has no id", text: "" },
        ],
      },
    ],
    journeys: [
      {
        id: "alpha-US-01",
        title: "Collector does it",
        text: "",
        acceptedBy: [],
      },
    ],
    testCases: [
      { id: "alpha-TC-01", title: "It is tested", traces: [], status: "draft" },
    ],
  };

  it("offers every id the page's own spec issues, and the requirement names", () => {
    expect(citablesOf(spec)).toEqual([
      {
        id: "Alpha does things",
        title: "Alpha does things",
        kind: "requirement",
      },
      { id: "alpha-SC-01", title: "It happens", kind: "scenario" },
      { id: "alpha-US-01", title: "Collector does it", kind: "journey" },
      { id: "alpha-TC-01", title: "It is tested", kind: "case" },
    ]);
  });

  it("cites what a requirement row already knows about itself", () => {
    expect(citesForRequirement(spec.id, spec.requirements[0])).toEqual([
      "demo-product/alpha",
      "Alpha does things",
      "alpha-SC-01",
    ]);
  });
});

describe("the author line", () => {
  it("is read back the way the store reads it", () => {
    expect(authorOf(filesOf()[PROPOSAL])).toBe("echo");
  });

  it("is nobody when the proposal names nobody", () => {
    expect(authorOf("# Title\n\n## Why\n\nBecause.\n")).toBeNull();
  });
});

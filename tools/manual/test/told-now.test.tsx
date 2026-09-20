import { fileURLToPath } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import type { ChangeEntry, Stage } from "../src/api/types";
import { SlackText } from "../src/blocks/slack-text";
import { ToldNow } from "../src/blocks/told-now";
import { findStoreRoot } from "../src/store/disk.mts";
import { schemaArtifacts } from "../src/store/read-schema.mts";
import { changeEntry } from "./manual-fixture";

/**
 * Told now: the message the hands of this stage are being sent, in the words
 * the workflow sends them in.
 *
 * The words come from `scripts/openspec/lib/wording.mjs`, which the push
 * workflow composes its own messages from, so a case here is a case about
 * what Slack says. What is asserted is the rendered line — `mrkdwn` read as
 * bold, code and a link rather than printed as its own markers.
 */

const ARTIFACTS =
  schemaArtifacts(
    findStoreRoot(fileURLToPath(new URL(".", import.meta.url))),
    "grade10-planning",
  ) ?? [];

function render(change: ChangeEntry, stage: Stage): string {
  return renderToStaticMarkup(
    <MemoryRouter initialEntries={[`/in-flight/${change.id}`]}>
      <ToldNow artifacts={ARTIFACTS} change={change} stage={stage} />
    </MemoryRouter>,
  );
}

const gift = (extra: Partial<ChangeEntry> = {}) =>
  changeEntry("gift-cards", [], {
    title: "Gift cards",
    hands: { pm: "robin", qa: "sam", dev: "erin" },
    ...extra,
  });

describe("the message each hand of the stage is being sent", () => {
  const html = render(gift(), "proposed");

  it("says it is the message, not a second status", () => {
    expect(html).toContain("Told now");
    expect(html).toContain("what the message says");
  });

  it("opens on the hand's turn and the stage the change is at", () => {
    expect(html).toContain("<strong>Your turn</strong>");
    expect(html).toContain("Gift cards");
    expect(html).toContain("<strong>Proposed</strong>");
    expect(html).not.toContain("*Your turn*");
  });

  it("carries the move and the command the hand pastes", () => {
    expect(html).toContain("Answer:");
    expect(html).toContain("/plan gift-cards");
  });

  it("names the hand the message reaches", () => {
    expect(html).toContain("@robin");
  });

  it("names the role's channel where the change names no hand for it", () => {
    const html = render(gift({ hands: {} }), "proposed");

    expect(html).toContain("product manager channel");
    expect(html).toContain("<strong>Your turn</strong>");
  });

  it("links the change's thread where the record names one", () => {
    const html = render(
      gift({ thread: "C0123ABC/1758170000.001200" }),
      "proposed",
    );

    expect(html).toContain(
      "https://slack.com/archives/C0123ABC/p1758170000001200",
    );
  });

  it("links the change page where the record names no thread", () => {
    expect(html).toContain('href="/in-flight/gift-cards"');
  });
});

describe("the stages that say something else", () => {
  it("sends QA to walk the run sheet on staging", () => {
    const html = render(gift(), "on-staging");

    expect(html).toContain("<strong>On staging</strong>");
    expect(html).toContain("Walk the run sheet");
    expect(html).toContain("@sam");
  });

  it("tells the hand of a behind artifact what changed before it", () => {
    const behind = gift({
      stage: "planned",
      written: ["proposal", "decisions", "user-journeys", "tasks"],
      reviewed: { tasks: "stale" },
      upstream: {
        tasks: { id: "fresh", items: ["decisions"], newer: ["decisions"] },
      },
    });
    const html = render(behind, "planned");

    expect(html).toContain("<strong>Behind</strong>");
    expect(html).toContain("tasks");
    expect(html).toContain("decisions");
  });

  it("says nothing at all for a stage that waits on no hand", () => {
    expect(render(gift(), "designed")).toBe("");
  });
});

describe("Slack mrkdwn, read", () => {
  const html = renderToStaticMarkup(
    <SlackText
      text={"*Bold* and `code` and <https://spec.test/x|a link>\nsecond line"}
    />,
  );

  it("reads bold, code and a titled link", () => {
    expect(html).toContain("<strong>Bold</strong>");
    expect(html).toContain("<code");
    expect(html).toContain("code");
    expect(html).toContain('href="https://spec.test/x"');
    expect(html).toContain(">a link<");
  });

  it("keeps a second line on its own line", () => {
    expect(html).toContain("second line");
    expect(html.match(/<br/g) ?? html.match(/<span/g)).not.toBeNull();
  });

  it("prints no marker it read", () => {
    expect(html).not.toContain("*Bold*");
    expect(html).not.toContain("`code`");
    expect(html).not.toContain("|a link>");
  });
});

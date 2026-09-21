import { fileURLToPath } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import type { ChangeEntry, Stage } from "../src/api/types";
import { InlineMarkdown } from "../src/blocks/inline-markdown";
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

function render(change: ChangeEntry, stage: Stage, sheetUrl?: string): string {
  return renderToStaticMarkup(
    <MemoryRouter initialEntries={[`/in-flight/${change.id}`]}>
      <ToldNow
        artifacts={ARTIFACTS}
        change={change}
        sheetUrl={sheetUrl}
        stage={stage}
      />
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
    expect(html).toContain("/workflow-plan gift-cards");
  });

  it("names the hand the message reaches", () => {
    expect(html).toContain("@robin");
  });

  it("names the role's channel where the change names no hand for it", () => {
    const html = render(gift({ hands: {} }), "proposed");

    expect(html).toContain("product manager channel");
    expect(html).toContain("<strong>Your turn</strong>");
  });

  it("links the change's thread where the record names one, in its own tab", () => {
    const html = render(
      gift({ thread: "C0123ABC/1758170000.001200" }),
      "proposed",
    );

    expect(html).toContain(
      "https://slack.com/archives/C0123ABC/p1758170000001200",
    );
    expect(html).toContain('rel="noreferrer noopener"');
    expect(html).toContain('target="_blank"');
  });

  it("links the change page where the record names no thread, through the router", () => {
    expect(html).toContain('href="/in-flight/gift-cards"');
    // The manual's own route: a full page load would throw the reader out of
    // the app they are already in.
    expect(html).not.toContain('target="_blank"');
  });
});

describe("the stage that names the design pair", () => {
  /** `shared-planning-agent-rounds-SC-81`'s own GIVEN: the proposal landed,
   * the decisions and the journeys in, and both designs' hands named - which
   * is the half of Proposed the product manager has already passed on. */
  const halfDesigned = gift({
    written: ["proposal", "decisions", "user-journeys"],
    hands: { pm: "robin", design: "kim", tech: "erin" },
  });
  const html = render(halfDesigned, "proposed");

  it("shows the designer the message their own turn sends", () => {
    expect(html).toContain("@kim");
    expect(html).toContain("<strong>Your turn</strong>");
    expect(html).toContain("/workflow-design gift-cards");
  });

  it("shows the tech PIC theirs beside it, and nothing to the hand that passed it on", () => {
    expect(html).toContain("@erin");
    expect(html).toContain("/workflow-tech gift-cards");
    expect(html).not.toContain("@robin");
  });
});

describe("the stages that say something else", () => {
  it("sends QA to walk the run sheet on staging", () => {
    const html = render(gift(), "on-staging");

    expect(html).toContain("<strong>On staging</strong>");
    expect(html).toContain("Walk the run sheet");
    expect(html).toContain("@sam");
  });

  it("names the build the deploy recorded", () => {
    const html = render(gift({ deployedBuild: "1.4.0-rc2" }), "on-staging");

    expect(html).toContain("build");
    expect(html).toContain("1.4.0-rc2");
  });

  it("links the run sheet the store was configured with", () => {
    const html = render(gift(), "on-staging", "https://sheets.test/run");

    expect(html).toContain('href="https://sheets.test/run"');
    expect(html).toContain(">the run sheet<");
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

  it("says so for a stage that waits on no hand", () => {
    const html = render(gift(), "designed");

    expect(html).toContain("Told now");
    expect(html).toContain("No message: this stage waits on no hand");
    expect(html).not.toContain("<blockquote");
  });
});

describe("Slack mrkdwn, read", () => {
  const html = renderToStaticMarkup(
    <MemoryRouter>
      <SlackText
        text={"*Bold* and `code` and <https://spec.test/x|a link>\nsecond line"}
      />
    </MemoryRouter>,
  );

  it("reads bold, code and a titled link", () => {
    expect(html).toContain("<strong>Bold</strong>");
    expect(html).toContain("<code");
    expect(html).toContain("code");
    expect(html).toContain('href="https://spec.test/x"');
    expect(html).toContain(">a link<");
  });

  it("dresses code and a link exactly as store prose does", () => {
    const prose = renderToStaticMarkup(
      <MemoryRouter>
        <InlineMarkdown text={"`code` and [a link](https://spec.test/x)"} />
      </MemoryRouter>,
    );
    const classOf = (markup: string, tag: string) =>
      new RegExp(`<${tag} class="([^"]*)"`).exec(markup)?.[1];

    expect(classOf(html, "code")).toBe(classOf(prose, "code"));
    expect(classOf(html, "a")).toBe(classOf(prose, "a"));
    expect(html).toContain('rel="noreferrer noopener"');
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

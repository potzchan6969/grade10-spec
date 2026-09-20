import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { formatDate, relativeTime } from "../src/api/time";
import type { ChangeEntry, ThreadEvent } from "../src/api/types";
import { ThreadSection } from "../src/blocks/thread-section";
import { changeEntry } from "./manual-fixture";

/**
 * The change's own thread, read from `main`: one row per event, oldest first,
 * each line the words the thread would carry. One case per event kind the
 * design record lists, plus the order and the empty reading.
 */

const AT = "2026-09-18T09:00:00+08:00";

function event(kind: ThreadEvent["kind"], extra: Partial<ThreadEvent> = {}) {
  return {
    sha: "0".repeat(40),
    date: AT,
    kind,
    subject: "chore(openspec): something happened",
    ...extra,
  } satisfies ThreadEvent;
}

const change: ChangeEntry = changeEntry("gift-cards", [], {
  title: "Gift cards",
  hands: { pm: "robin", design: "kim", dev: "erin" },
});

function render(history: ThreadEvent[], entry: ChangeEntry = change): string {
  return renderToStaticMarkup(
    <MemoryRouter initialEntries={["/in-flight/gift-cards"]}>
      <ThreadSection change={entry} history={history} />
    </MemoryRouter>,
  );
}

describe("one line per event kind", () => {
  it("says who opened the change", () => {
    const html = render([event("opened", { subject: "Open gift-cards" })]);

    expect(html).toContain("Opened by @robin");
  });

  it("falls back to the handle that promoted a change naming no product manager", () => {
    const promoted = changeEntry("gift-cards", [], {
      title: "Gift cards",
      promotedBy: "erin",
    });
    const html = render([event("opened")], promoted);

    expect(html).toContain("Opened by @erin");
  });

  it("names what landed and whose word landed it", () => {
    const html = render([
      event("landed", { target: "proposal", handle: "robin" }),
    ]);

    expect(html).toContain("Landed");
    expect(html).toContain("proposal");
    expect(html).toContain("@robin");
  });

  it("says a re-read changed nothing", () => {
    const html = render([event("read-again", { target: "specs" })]);

    expect(html).toContain("Read again");
    expect(html).toContain("specs");
    expect(html).toContain("nothing changed");
  });

  it("names the hand a commit wrote, by the role's own label", () => {
    const html = render([
      event("hand", { hands: [{ role: "design", handle: "kim" }] }),
    ]);

    expect(html).toContain("@kim is the designer");
  });

  it("names the tasks a commit ticked", () => {
    const html = render([event("tick", { ticked: ["3.1", "3.2"] })]);

    expect(html).toContain("Ticked 3.1, 3.2");
  });

  it("keeps any other commit as its own subject", () => {
    const html = render([
      event("commit", { subject: "docs(planning): say what a card cannot do" }),
    ]);

    expect(html).toContain("docs(planning): say what a card cannot do");
  });

  it("dates every row it can, relative and in full", () => {
    const html = render([event("landed", { target: "proposal" })]);

    expect(html).toContain(`title="${formatDate(AT)}"`);
    expect(html).toContain(relativeTime(AT));
  });
});

describe("what the files say beside the commits", () => {
  it("reads the round the landing's own commit recorded, under that landing", () => {
    const withRound: ChangeEntry = {
      ...change,
      rounds: [
        {
          round: 1,
          artifact: "proposal",
          perspectives: "simpler-thing; missing-pieces",
          stood: "the empty state is a link; the title is the outcome",
          asked: "Q4",
          tests: "-",
        },
      ],
    };
    const html = render(
      [event("landed", { target: "proposal", handle: "robin" })],
      withRound,
    );

    expect(html).toContain("Round 1");
    expect(html).toContain("read by");
    expect(html).toContain("simpler-thing; missing-pieces");
    expect(html).toContain("stood: the empty state is a link");
    expect(html).toContain("asked");
    expect(html).toContain("Q4");
  });

  it("lists a held question at the end, undated, and never a decided row", () => {
    const withQuestion: ChangeEntry = {
      ...change,
      questions: [
        {
          id: "Q7",
          artifact: "decisions",
          role: "pm",
          hand: "robin",
          text: "Which day does the shelf start on?",
          recommended: "the Monday",
        },
        // A page's own ❓ line: On the pages is where that is read.
        {
          artifact: "proposal",
          page: "docs/prds/products/demo-product/alpha.md",
          section: "points",
          role: "pm",
          hand: "robin",
          text: "Whether a gift card earns",
        },
      ],
    };
    const html = render([event("opened")], withQuestion);

    expect(html).toContain("Q7 held for the product manager");
    expect(html).toContain("Which day does the shelf start on?");
    expect(html).toContain("undated");
    expect(html).not.toContain("Whether a gift card earns");
    expect(html.indexOf("Q7")).toBeGreaterThan(html.indexOf("Opened by"));
  });
});

describe("the reading as a whole", () => {
  it("says it is the thread read from main", () => {
    const html = render([event("opened")]);

    expect(html).toContain("Thread");
    expect(html).toContain("What the change&#x27;s thread shows, read from");
    expect(html).toContain("main");
  });

  it("reads oldest first", () => {
    const html = render([
      event("opened", { date: "2026-09-10T09:00:00+08:00" }),
      event("landed", {
        date: "2026-09-18T09:00:00+08:00",
        target: "decisions",
        handle: "robin",
      }),
    ]);

    expect(html.indexOf("Opened by")).toBeLessThan(html.indexOf("Landed"));
  });

  it("shows the one row a change with one commit has", () => {
    const html = render([event("opened")]);

    expect(html.match(/<li/g)).toHaveLength(1);
  });

  it("says a reading with no commits has none", () => {
    const html = render([]);

    expect(html).toContain("No history");
    expect(html).toContain("this reading has no commits");
    expect(html).not.toContain("<li");
  });
});

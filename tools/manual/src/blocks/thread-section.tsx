import { EmptyState } from "@grade10/design-system/components/display/empty-state";
import { Text } from "@grade10/design-system/components/display/text";
import { askedIdsOf, roundArtifactOf } from "../api/rounds";
import { roleLabelOf } from "../api/stage-view";
import { formatDate, relativeTime } from "../api/time";
import type {
  ChangeEntry,
  OpenQuestion,
  RoundRow,
  ThreadEvent,
} from "../api/types";
import { InlineMarkdown } from "./inline-markdown";

/**
 * The change's own thread, read from `main`.
 *
 * The Slack thread carries these same events as replies. This is the
 * file-derived mirror: the commits of the change's directory, classified by
 * the store, with the round each landing recorded and the questions still
 * held beside them. Oldest first, because that is how a thread is read.
 *
 * Nothing here is stored and nothing here is a second status: where the
 * artifact rows say what state the change is in, this says what happened to
 * it, which is the one thing the rows cannot say.
 */
export function ThreadSection({
  change,
  history,
}: {
  change: ChangeEntry;
  /** The change's commits, oldest first, from its own document. */
  history: ThreadEvent[];
}) {
  const rows = threadRowsOf(change, history);

  return (
    <div className="flex flex-col gap-2">
      <Text as="p" size="xs" tone="secondary">
        What the change&apos;s thread shows, read from{" "}
        <code className="font-mono">main</code>.
      </Text>
      {rows.length === 0 ? (
        <EmptyState
          compact
          description="This reading has no commits."
          title="No history"
        />
      ) : (
        <ol className="flex flex-col gap-1.5">
          {rows.map((row) => (
            <li
              className="flex flex-col gap-0.5 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-2"
              key={row.key}
            >
              <Text
                as="span"
                className="sm:min-w-24"
                size="xs"
                title={row.date ? formatDate(row.date) : undefined}
                tone="secondary"
              >
                {row.date ? relativeTime(row.date) : "undated"}
              </Text>
              <span className="flex min-w-0 flex-col gap-0.5">
                <Text as="span" size="xs">
                  <InlineMarkdown text={row.line} />
                </Text>
                {row.round === undefined ? null : (
                  <Text as="span" size="xs" tone="secondary">
                    <InlineMarkdown text={row.round} />
                  </Text>
                )}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

/** One row of the thread: when, what it says, and the round the same commit
 * recorded where there is one. */
type ThreadRow = {
  key: string;
  /** Absent for a row no commit dates — a held question, which the record
   * carries without one. */
  date?: string;
  line: string;
  round?: string;
};

/**
 * The rows, in reading order: every commit of the change, then the questions
 * nobody has answered.
 *
 * A round is placed by the landing that wrote it — `rounds.md` is written in
 * the landing's own commit — so it reads as a second line under that landing
 * rather than as a row of its own. A round no landing on this reading
 * accounts for keeps its own row at the end, undated, because a round that
 * ran is a thing that happened whether or not its commit is in hand.
 */
function threadRowsOf(
  change: ChangeEntry,
  history: ThreadEvent[],
): ThreadRow[] {
  const rounds = new Map(
    (change.rounds ?? []).map((round) => [
      roundArtifactOf(round.artifact) ?? round.artifact,
      round,
    ]),
  );
  const rows: ThreadRow[] = [];

  for (const event of history) {
    const target =
      event.kind === "landed" && event.target
        ? roundArtifactOf(event.target)
        : null;
    const round = target === null ? undefined : rounds.get(target);
    if (target !== null && round) rounds.delete(target);
    rows.push({
      key: `${event.sha}:${event.kind}`,
      date: event.date,
      line: lineOf(change, event),
      ...(round ? { round: roundLine(round) } : {}),
    });
  }

  for (const round of rounds.values()) {
    rows.push({
      key: `round-${round.round}-${round.artifact}`,
      line: roundLine(round),
    });
  }

  // A decisions row nobody has answered: the page's own ❓ lines are read by
  // On the pages, where the section that carries them is named.
  for (const question of change.questions ?? []) {
    if (question.id === undefined) continue;
    rows.push({
      key: `question-${question.id}`,
      line: heldLine(question),
    });
  }
  return rows;
}

function lineOf(change: ChangeEntry, event: ThreadEvent): string {
  switch (event.kind) {
    case "opened": {
      const pm = change.hands?.pm ?? change.promotedBy ?? change.author;
      return pm ? `Opened by @${pm}` : "Opened";
    }
    case "landed": {
      const what = `Landed \`${event.target ?? "it"}\``;
      return event.handle ? `${what} — @${event.handle}` : what;
    }
    case "read-again":
      return `Read again: \`${event.target ?? "it"}\`, nothing changed`;
    case "hand":
      return (event.hands ?? [])
        .map((one) => `Hand: @${one.handle} is the ${roleLabelOf(one.role)}`)
        .join(" · ");
    case "tick":
      return `Ticked ${(event.ticked ?? []).join(", ")}`;
    default:
      return event.subject;
  }
}

/** A round as one line: what read it, what stood, and what it asked. The
 * artifact is named even under the landing that carries it, because a round
 * with no landing in hand keeps the same line. */
function roundLine(round: RoundRow): string {
  const parts = [
    `Round ${round.round}`,
    `\`${round.artifact}\``,
    `read by ${round.perspectives}`,
    `stood: ${firstPhrase(round.stood)}`,
  ];
  const asked = askedIdsOf(round.asked);
  if (asked.length > 0) {
    parts.push(`asked ${asked.map((id) => `\`${id}\``).join(", ")}`);
  }
  return parts.join(" · ");
}

/** The first thing that stood, of however many the cell lists: the row is one
 * line, and the whole cell is on the Rounds row above. */
function firstPhrase(stood: string): string {
  const first = stood.split(";")[0]?.trim() ?? "";
  return first === "" || first === "-" ? "nothing" : first;
}

/** A held question, addressed to the role the row names. */
function heldLine(question: OpenQuestion): string {
  return `${question.id} held for the ${roleLabelOf(question.role)}: ${question.text}`;
}

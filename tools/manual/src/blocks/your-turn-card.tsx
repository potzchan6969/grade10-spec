import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@grade10/design-system/components/display/card";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { ArrowSquareOut } from "@phosphor-icons/react";
import { Link } from "react-router";
import { ROLE_LABEL, roleTitle } from "../api/stage-view";
import { handOf, moveOf } from "../api/stages";
import type { ChangeEntry, Role, SchemaArtifact, Stage } from "../api/types";
import { useEditorSession } from "../editor/session";
import { Hand } from "./change-hand";
import { CopyableCommand } from "./copyable-command";

/**
 * Whose turn it is on this change, where the conversation about it is, and
 * what to run.
 *
 * The three things a hand opening the change from a message needs, in one
 * place. A stage whose hand is unnamed names the role's channel instead, so
 * the change is somebody's to pick up rather than nobody's; a change with no
 * thread yet links itself, because a message about it has to link somewhere
 * and this page is where the facts are.
 */
export function YourTurnCard({
  change,
  stage,
  artifacts,
}: {
  change: ChangeEntry;
  stage: Stage;
  /** The change's schema artifacts, for whose turn it is in Proposed — a
   * waived design needs no hand. */
  artifacts: SchemaArtifact[];
}) {
  const roles = handOf(change, stage, artifacts);
  // One command per hand whose turn it is, not per hand the stage table
  // names: Proposed's second half is the designer's and the tech PIC's.
  const moves = roles.flatMap((role) => {
    const held = moveOf(stage, role);
    return held
      ? [{ role, ...held, command: held.command.replace(/<id>/g, change.id) }]
      : [];
  });

  return (
    <Card className="my-5">
      <CardHeader>
        <CardTitle>Your turn</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2.5">
        {roles.length === 0 ? (
          <Text as="p" size="sm" tone="secondary">
            Nobody: this stage waits on no hand.
          </Text>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {roles.map((role) => (
              <li key={role}>
                <Turn change={change} role={role} />
              </li>
            ))}
          </ul>
        )}

        <Thread change={change} />

        {moves.map((one) => (
          <div
            className="flex flex-wrap items-center gap-x-2 gap-y-1"
            key={one.role}
          >
            <CopyableCommand command={one.command} />
            <Text as="span" size="xs" tone="secondary">
              {`${roleTitle(one.role)}: ${one.move}`}
            </Text>
          </div>
        ))}

        <Assign />
      </CardContent>
    </Card>
  );
}

/** One hand of the stage: the handle the change names, or the channel the
 * role is reached in where it names nobody. */
function Turn({ change, role }: { change: ChangeEntry; role: Role }) {
  const handle = change.hands?.[role];
  if (handle) return <Hand handle={handle} role={role} />;

  return (
    <Text as="span" size="sm">
      {`No ${ROLE_LABEL[role]} is named — this goes to the ${ROLE_LABEL[role]} channel`}
    </Text>
  );
}

/**
 * Where the change is talked about. `thread:` is `<channel>/<timestamp>`, and
 * a permalink is the channel with the timestamp's separator dropped — built
 * here against Slack's own host, because the manual has no workspace name to
 * build one with and the redirect lands a signed-in reader in their own.
 */
function Thread({ change }: { change: ChangeEntry }) {
  const thread = change.thread;
  if (thread === undefined) {
    return (
      <Text as="p" size="xs" tone="secondary">
        <Link
          className="underline underline-offset-2"
          to={`/in-flight/${change.id}`}
        >
          This page
        </Link>{" "}
        is the link to share: no thread is recorded for this change yet.
      </Text>
    );
  }

  const [channel, ts = ""] = thread.split("/");
  return (
    <Text as="p" size="xs">
      <a
        className="inline-flex items-center gap-1 underline underline-offset-2"
        href={`https://slack.com/archives/${channel}/p${ts.replace(".", "")}`}
        rel="noreferrer noopener"
        target="_blank"
      >
        {`The thread · ${channel}`}
        <ArrowSquareOut aria-hidden size={12} />
      </a>
    </Text>
  );
}

/**
 * Naming a hand is a write, and the hosted manual writes nothing: it is shown
 * as read-only rather than hidden, because a reader who cannot find Assign
 * reads its absence as a missing feature instead of a missing dev server.
 */
function Assign() {
  const { store } = useEditorSession();

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
      <Button disabled size="sm" variant="outline">
        Assign
      </Button>
      <Text as="span" size="xs" tone="secondary">
        {store === null
          ? "read-only on the hosted manual — naming a hand needs the locally-run manual"
          : "read-only for now — the local write lands with the record's own rules"}
      </Text>
    </div>
  );
}

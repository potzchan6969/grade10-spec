import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@grade10/design-system/components/display/card";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { ArrowSquareOut } from "@phosphor-icons/react";
import { useState } from "react";
import { Link } from "react-router";
import { movesOfHands, ROLE_LABEL, ROLES, roleTitle } from "../api/stage-view";
import { DRAFTED, handOf } from "../api/stages";
import type { ChangeEntry, Role, SchemaArtifact, Stage } from "../api/types";
import { useManualIndex } from "../api/use-manual-index";
import { SelectField } from "../editor/fields";
import { ReadOnlyNotice } from "../editor/read-only-notice";
import { useEditorSession } from "../editor/session";
import type { ContentStore } from "../editor/store";
import { describeCause } from "../editor/store";
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
  const moves = movesOfHands(stage, roles, change.id);
  // The three stages DRAFTED carries no entry for — On staging, Released and
  // Archived — are a deploy, a cut and a fold: nobody's agent drafts them, so
  // no per-hand move exists to offer. The first two still have work to do,
  // which is the archive command; the fold itself is done, so Archived offers
  // nothing.
  const fallback =
    stage !== "archived" && DRAFTED[stage] === undefined
      ? {
          command: `/archive-change ${change.id}`,
          note: "confirm it deployed, then fold it into the durable specs",
        }
      : undefined;

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

        <ThreadLink change={change} />

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

        {fallback ? (
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <CopyableCommand command={fallback.command} />
            <Text as="span" size="xs" tone="secondary">
              {fallback.note}
            </Text>
          </div>
        ) : null}

        <Assign change={change} />
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
 *
 * Exported: My turn's own cards carry the same link, and a change reads one
 * thread wherever it is shown rather than a second copy of this reasoning.
 */
export function ThreadLink({ change }: { change: ChangeEntry }) {
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
 * reads its absence as a missing feature instead of a missing dev server. The
 * locally run manual gets the working form instead — the same dev server a
 * proposal writes through, one role and one handle in one write.
 *
 * Nothing renders until the session has probed for a dev server: `store` is
 * also `null` while that probe is in flight, and showing the hosted sentence
 * then would flash it at a locally run manual that just has not answered
 * yet. `ReadOnlyNotice` is the one sentence for that state everywhere else in
 * the manual, composed here rather than a second copy of its words.
 */
function Assign({ change }: { change: ChangeEntry }) {
  const { status, store } = useEditorSession();
  if (status !== "ready") return null;

  if (store === null) {
    return (
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <Button disabled size="sm" variant="outline">
          Assign
        </Button>
        <ReadOnlyNotice />
      </div>
    );
  }

  return <AssignForm change={change} store={store} />;
}

type AssignState =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "done"; role: Role; handle: string }
  | { kind: "error"; message: string };

/**
 * A role picker and a handle picker over the team map's handles, filtered by
 * the chosen role — decided over the free-text field this form drew at
 * first: a handle Assign can write is one `docs/prds/team.yaml` already
 * carries for that role, so offering only those is a form that cannot be
 * filled out wrong.
 */
function AssignForm({
  change,
  store,
}: {
  change: ChangeEntry;
  store: ContentStore;
}) {
  const index = useManualIndex();
  const [role, setRole] = useState<Role>(ROLES[0]);
  const [handle, setHandle] = useState("");
  const [state, setState] = useState<AssignState>({ kind: "idle" });

  const handles = Object.entries(index.snapshot.team.handles)
    .filter(([, roles]) => roles.includes(role))
    .map(([one]) => one)
    .sort();
  const chosen = handles.includes(handle) ? handle : "";

  return (
    <form
      className="flex flex-wrap items-end gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        if (chosen === "") return;
        setState({ kind: "saving" });
        store.hand(change.id, role, chosen).then(
          () => {
            setState({ kind: "done", role, handle: chosen });
            setHandle("");
          },
          (cause) => setState({ kind: "error", message: describeCause(cause) }),
        );
      }}
    >
      <div className="w-36">
        <SelectField
          label="Role"
          onChange={(next) => {
            setRole(next as Role);
            setHandle("");
          }}
          options={ROLES}
          value={role}
        />
      </div>
      <div className="w-32">
        <SelectField
          allowEmpty
          hint={
            handles.length === 0
              ? `no handle in the team map takes ${ROLE_LABEL[role]}`
              : undefined
          }
          label="Handle"
          onChange={setHandle}
          options={handles}
          value={chosen}
        />
      </div>
      <Button
        disabled={state.kind === "saving" || chosen === ""}
        size="sm"
        type="submit"
        variant="outline"
      >
        Assign
      </Button>
      {state.kind === "done" ? (
        <Text as="span" size="xs" tone="secondary">
          {`@${state.handle} is now the ${ROLE_LABEL[state.role]}`}
        </Text>
      ) : null}
      {state.kind === "error" ? (
        <Text as="span" size="xs" tone="error">
          {state.message}
        </Text>
      ) : null}
    </form>
  );
}

import { Badge } from "@grade10/design-system/components/display/badge";
import { EmptyState } from "@grade10/design-system/components/display/empty-state";
import { Text } from "@grade10/design-system/components/display/text";
import { CheckCircle } from "@phosphor-icons/react";
import { Link } from "react-router";
import { useHandle } from "../api/handle";
import { type MyTurnChange, myTurnOf } from "../api/my-turn";
import {
  movesOfHands,
  ROLE_LABEL,
  roleTitle,
  STAGE_LABEL,
} from "../api/stage-view";
import type { ChangeEntry, Role } from "../api/types";
import { useManualIndex } from "../api/use-manual-index";
import { CopyableCommand } from "../blocks/copyable-command";
import { HandleAsk } from "../blocks/handle-ask";
import { InlineMarkdown } from "../blocks/inline-markdown";
import { ThreadLink } from "../blocks/your-turn-card";
import { PageHeading } from "./page-heading";
import { useDocumentTitle } from "./use-document-title";

/**
 * What is on one reader, across every change in flight: the open questions
 * addressed to them, then the changes on them now, then the ones that will
 * be theirs once their stage comes — the same three facts a message already
 * tells them, gathered on one page so an afternoon starts here rather than
 * on the board.
 */
export function MyTurnPage() {
  const index = useManualIndex();
  useDocumentTitle("My turn");
  const { handle, remember } = useHandle();
  const known =
    handle !== undefined && index.snapshot.team.handles[handle] !== undefined;

  return (
    <>
      <PageHeading
        summary="What is on you, across every change in flight — the open questions addressed to you, then what is yours now, then what is coming."
        title="My turn"
      >
        <HandleAsk current={known ? handle : undefined} remember={remember} />
      </PageHeading>

      {handle === undefined ? null : !known ? (
        <Text as="p" size="sm" tone="secondary">
          {`\`${handle}\` is not a handle this store knows. Check the spelling, or ask whoever keeps `}
          <code className="font-mono">docs/prds/team.yaml</code> to add you.
        </Text>
      ) : (
        <MyTurnBody handle={handle} />
      )}
    </>
  );
}

function MyTurnBody({ handle }: { handle: string }) {
  const index = useManualIndex();
  const { questions, now, later } = myTurnOf(
    index.snapshot.changes,
    index.snapshot.schemas,
    handle,
  );

  if (questions.length === 0 && now.length === 0 && later.length === 0) {
    return (
      <EmptyState
        description="No open question is addressed to you, and no change in flight names you for a hand."
        icon={<CheckCircle aria-hidden />}
        title="Nothing on you"
      />
    );
  }

  return (
    <>
      {questions.length > 0 ? (
        <section className="mb-8">
          <h2 className="mb-2.5 font-heading font-bold text-base">
            Open questions
          </h2>
          <ul className="flex flex-col gap-2">
            {questions.map(({ change, question }) => (
              <li
                className="flex flex-wrap items-baseline gap-x-2 gap-y-1"
                key={`${change.id}:${question.id ?? question.section}:${question.text}`}
              >
                {question.id ? (
                  <Badge size="sm" variant="outline">
                    {question.id}
                  </Badge>
                ) : null}
                <Link
                  className="font-medium text-sm hover:underline"
                  to={`/in-flight/${change.id}`}
                >
                  <InlineMarkdown text={change.title} />
                </Link>
                <Text as="span" size="sm">
                  {question.text}
                </Text>
                <ThreadLink change={change} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {now.length > 0 ? (
        <ChangeSection changes={now} title="On you now" />
      ) : null}

      {later.length > 0 ? (
        <ChangeSection changes={later} title="Coming to you" />
      ) : null}
    </>
  );
}

function ChangeSection({
  title,
  changes,
}: {
  title: string;
  changes: MyTurnChange[];
}) {
  return (
    <section className="mb-8">
      <h2 className="mb-2.5 font-heading font-bold text-base">{title}</h2>
      <ul className="flex flex-col gap-2.5">
        {changes.map(({ change, roles }) => (
          <li key={change.id}>
            <ChangeCard change={change} roles={roles} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function ChangeCard({ change, roles }: { change: ChangeEntry; roles: Role[] }) {
  const moves = movesOfHands(change.stage, roles, change.id);

  return (
    <article className="rounded-(--radius-2xl) border border-border bg-card p-3.5">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <Link
          className="font-medium text-sm hover:underline"
          to={`/in-flight/${change.id}`}
        >
          <InlineMarkdown text={change.title} />
        </Link>
        <Badge size="sm" variant="outline">
          {STAGE_LABEL[change.stage]}
        </Badge>
        <Text as="span" className="ml-auto" size="xs" tone="secondary">
          {roles.map((role) => ROLE_LABEL[role]).join(", ")}
        </Text>
      </div>
      <div className="mt-1.5">
        <ThreadLink change={change} />
      </div>
      {moves.map((one) => (
        <div
          className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1"
          key={one.role}
        >
          <CopyableCommand command={one.command} />
          <Text as="span" size="xs" tone="secondary">
            {`${roleTitle(one.role)}: ${one.move}`}
          </Text>
        </div>
      ))}
    </article>
  );
}

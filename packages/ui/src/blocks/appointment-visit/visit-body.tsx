import { Alert } from "@grade10/design-system/components/display/alert";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { Link } from "@grade10/design-system/components/forms/link";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { ReactNode } from "react";
import { FactCard, type FactRow } from "../page-blocks/fact-card";
import { NoteList, type NoteListItem } from "../page-blocks/note-list";
import type { VisitAct, VisitFact, VisitTone } from "./types";
import { VisitActRow } from "./visit-act-row";
import { VisitFacts } from "./visit-facts";
import { VisitPass, type VisitPassCopy } from "./visit-pass";
import {
  VisitPhaseHeader,
  type VisitPhaseHeaderCopy,
} from "./visit-phase-header";
import {
  VisitReconnecting,
  type VisitReconnectingProps,
} from "./visit-reconnecting";

/** A notice under the header: its words under a title, or its words alone. */
type VisitNoticeCopy = { title?: string; text: string; link?: string };

type VisitBodyCopy = VisitPhaseHeaderCopy & {
  /** What the collector just did, said until dismissed. */
  said?: string;
  dismiss: string;
  notice?: VisitNoticeCopy;
  /** The pass's words, drawn when the visit has a name. */
  pass?: VisitPassCopy;
  /** The line under the acts. */
  footNote?: string;
  yourVisit: string;
  before: string;
  told: string;
  /** Where the visit's mail goes, at the foot. */
  foot?: string;
};

type VisitBodyProps = {
  copy: VisitBodyCopy;
  tone: VisitTone;
  /** Who the visit is booked for; without a name no pass is drawn. */
  name?: string | null;
  /** Where the notice's link leads. */
  noticeHref?: string;
  acts: readonly VisitAct[];
  /** An open change, cancel or running-late panel, drawn above the acts. */
  panel?: ReactNode;
  facts: readonly VisitFact[];
  /** What to bring and know, drawn only when given. */
  before?: readonly NoteListItem[];
  /** What the collector told the desk, drawn only when given. */
  told?: readonly FactRow[];
  /** A live page that lost its signal. */
  reconnecting?: VisitReconnectingProps;
  onDismiss: () => void;
};

/**
 * One visit's page in whichever phase the consumer worded: where it stands,
 * what was just done, a notice, the pass, the acts or the panel one opened,
 * the visit's facts, what to bring and what the collector told the desk.
 */
function VisitBody({
  copy,
  tone,
  name,
  noticeHref,
  acts,
  panel,
  facts,
  before,
  told,
  reconnecting,
  onDismiss,
}: VisitBodyProps) {
  return (
    <VStack data-slot="visit-page" gap="lg" hAlign="stretch">
      {reconnecting ? <VisitReconnecting {...reconnecting} /> : null}
      <VisitPhaseHeader
        copy={{
          phase: copy.phase,
          note: copy.note,
          title: copy.title,
          lede: copy.lede,
        }}
        tone={tone}
      />
      {copy.said ? (
        <Alert
          actions={
            <Button onClick={onDismiss} size="sm" type="button" variant="ghost">
              {copy.dismiss}
            </Button>
          }
          role="status"
          status="success"
          title={copy.said}
        />
      ) : null}
      {copy.notice ? (
        <Alert
          description={noticeBody(copy.notice, noticeHref)}
          title={copy.notice.title ?? copy.notice.text}
        />
      ) : null}
      {copy.pass && name ? <VisitPass copy={copy.pass} name={name} /> : null}
      {panel}
      <VisitActRow acts={acts} />
      {copy.footNote ? (
        <Text as="p" size="sm" tone="secondary">
          {copy.footNote}
        </Text>
      ) : null}
      <VisitFacts copy={{ title: copy.yourVisit }} facts={facts} />
      {before ? (
        <FactCard copy={{ title: copy.before }} slot="visit-before">
          <NoteList notes={before} />
        </FactCard>
      ) : null}
      {told ? (
        <FactCard copy={{ title: copy.told }} rows={told} slot="visit-told" />
      ) : null}
      {copy.foot ? (
        <Text as="p" size="sm" tone="secondary">
          {copy.foot}
        </Text>
      ) : null}
    </VStack>
  );
}

/** The notice's words under its title; a notice with no title is its words alone. */
function noticeBody(notice: VisitNoticeCopy, href?: string) {
  const link =
    notice.link && href ? <Link href={href}>{notice.link}</Link> : null;
  if (!notice.title) return link ?? undefined;
  return (
    <VStack gap="xs">
      <span>{notice.text}</span>
      {link}
    </VStack>
  );
}

export type { VisitBodyCopy, VisitBodyProps, VisitNoticeCopy };
export { VisitBody };

import { Alert } from "@grade10/design-system/components/display/alert";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { Link } from "@grade10/design-system/components/forms/link";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { FactCard, type FactRow } from "../page-blocks/fact-card";
import { StageRail, type StageRailStage } from "../page-blocks/stage-rail";
import type { VisitTone } from "./types";
import { VisitPhaseHeader } from "./visit-phase-header";
import {
  VisitReconnecting,
  type VisitReconnectingProps,
} from "./visit-reconnecting";

type VisitTicketBodyCopy = {
  /** The badge's word: the phase, or when it was last known offline. */
  phase: string;
  /** The estimate beside the badge. */
  estimate?: string;
  title: string;
  /** The line under the title. */
  line?: string;
  /** The line under the ticket number: the place, the counter, how it ended. */
  head: string;
  /** The steps a live ticket walks. */
  steps: readonly StageRailStage[];
  /** A note under the steps, drawn only with its title. */
  noteHead?: string;
  note?: string;
  facts: string;
  leave: string;
  leaveQ: string;
  /** What leaving gives up. */
  leaveBody: string;
  keep: string;
  leaving: string;
  leaveFailed: string;
  leaveOffline: string;
  bookTime: string;
};

type VisitTicketBodyProps = {
  copy: VisitTicketBodyCopy;
  tone: VisitTone;
  /** The ticket's number. */
  ticket: string;
  /** The step reached; absent once the ticket ended. */
  step?: string;
  facts: readonly FactRow[];
  /** Still in line, so it can be left. */
  live: boolean;
  /** No signal: leaving waits until it is back. */
  offline: boolean;
  /** Asking whether to leave the line. */
  asking: boolean;
  /** Leaving is under way. */
  pending: boolean;
  /** The last leave did not go through. */
  failed: boolean;
  bookHref: string;
  reconnecting?: VisitReconnectingProps;
  onAsk: () => void;
  onKeep: () => void;
  onLeave: () => void;
};

/**
 * A walk-in's ticket on their own phone: the place in line and the
 * estimate, You're next, then the counter, or how the ticket ended; Leave the
 * line while it is live, Book a time once it ended.
 */
function VisitTicketBody({
  copy,
  tone,
  ticket,
  step,
  facts,
  live,
  offline,
  asking,
  pending,
  failed,
  bookHref,
  reconnecting,
  onAsk,
  onKeep,
  onLeave,
}: VisitTicketBodyProps) {
  return (
    <VStack data-slot="ticket-page" gap="lg" hAlign="stretch">
      {reconnecting ? <VisitReconnecting {...reconnecting} /> : null}
      <VisitPhaseHeader
        copy={{
          phase: copy.phase,
          note: copy.estimate,
          title: copy.title,
          lede: copy.line,
        }}
        tone={tone}
      />
      <VStack gap="xs">
        <Text as="span" face="mono" size="display" weight="bold">
          {ticket}
        </Text>
        <Text as="span" size="lg" weight="medium">
          {copy.head}
        </Text>
      </VStack>
      {step ? (
        <StageRail
          copy={{ stages: copy.steps }}
          current={step}
          slot="ticket-steps"
        />
      ) : null}
      {copy.noteHead ? (
        <Alert description={copy.note} title={copy.noteHead} />
      ) : null}
      <FactCard copy={{ title: copy.facts }} rows={facts} slot="ticket-facts" />
      {live && asking ? (
        <FactCard
          actions={
            <HStack gap="sm" wrap>
              <Button
                onClick={onKeep}
                size="md"
                type="button"
                variant="outline"
              >
                {copy.keep}
              </Button>
              <Button
                loading={pending}
                onClick={onLeave}
                size="md"
                type="button"
                variant="destructive"
              >
                {pending ? copy.leaving : copy.leave}
              </Button>
            </HStack>
          }
          copy={{ title: copy.leaveQ, description: copy.leaveBody }}
          slot="ticket-leave"
        >
          {failed ? (
            <Text as="p" role="alert" size="sm" tone="error">
              {copy.leaveFailed}
            </Text>
          ) : null}
        </FactCard>
      ) : null}
      {live && !asking ? (
        <VStack gap="xs" hAlign="start">
          <Button
            disabled={offline}
            onClick={onAsk}
            size="md"
            type="button"
            variant="outline"
          >
            {copy.leave}
          </Button>
          {offline ? (
            <Text as="span" size="sm" tone="secondary">
              {copy.leaveOffline}
            </Text>
          ) : null}
        </VStack>
      ) : null}
      {!live ? <Link href={bookHref}>{copy.bookTime}</Link> : null}
    </VStack>
  );
}

export type { VisitTicketBodyCopy, VisitTicketBodyProps };
export { VisitTicketBody };

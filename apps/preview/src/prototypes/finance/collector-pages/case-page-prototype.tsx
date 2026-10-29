import { Badge } from "@grade10/design-system/components/display/badge";
import { Button } from "@grade10/design-system/components/forms/button";
import { FactCard, NoteList, StageRail } from "@grade10/ui";
import {
  PageHeader,
  PrototypeNote,
  VaultPageShell,
} from "../../../pages/vault-shared";
import { navigateToStory } from "../../../pages/workbench-story-nav";
import {
  BOOK_A_VISIT_SHOP_STORY_ID,
  CASE_PAGE_COPY,
  COLLECTOR_PAGES_MANUAL_PATH,
} from "./collector-pages-content";

type CasePageState =
  | "request-sent"
  | "offer-waiting"
  | "offer-ran-out"
  | "loan-running"
  | "past-due";

type CasePagePrototypeProps = { state: CasePageState };

const FINANCED_STAGES = [
  { id: "request", label: "Request" },
  { id: "valued", label: "Valued" },
  { id: "offer", label: "Offer" },
  { id: "agreed", label: "Agreed" },
  { id: "signed", label: "Signed" },
  { id: "vault", label: "Vault" },
  { id: "loan", label: "Loan" },
  { id: "home", label: "Home" },
];

const { request, offer, ranOut, owed, reminders } = CASE_PAGE_COPY;

const STATE_STAGE: Record<
  CasePageState,
  { current: string; ended?: string; word: string }
> = {
  "request-sent": { current: "request", word: "Waiting on us" },
  "offer-waiting": { current: "offer", word: "Waiting on you" },
  "offer-ran-out": {
    current: "offer",
    ended: "Offer ran out",
    word: "Offer ran out",
  },
  "loan-running": { current: "loan", word: "Due 1 December" },
  "past-due": { current: "loan", word: "4 days past due" },
};

function CaseBody({ state }: CasePagePrototypeProps) {
  if (state === "request-sent") {
    return (
      <FactCard
        copy={{ title: request.title }}
        lead={request.lead}
        actions={
          <>
            <Button onClick={() => navigateToStory(BOOK_A_VISIT_SHOP_STORY_ID)}>
              {request.book}
            </Button>
            <Button variant="outline">{request.cancel}</Button>
          </>
        }
      />
    );
  }
  if (state === "offer-waiting") {
    return (
      <FactCard
        copy={{
          title: offer.title,
          description: offer.openUntil,
          rowsLabel: offer.rowsLabel,
        }}
        lead={offer.lead}
        rows={offer.rows}
        actions={
          <>
            <Button>{offer.accept}</Button>
            <Button variant="outline">{offer.decline}</Button>
          </>
        }
      >
        <span className="font-medium">{offer.total}</span>
      </FactCard>
    );
  }
  if (state === "offer-ran-out") {
    return <FactCard copy={{ title: ranOut.title }} lead={ranOut.lead} />;
  }
  return (
    <>
      <FactCard
        copy={{ title: owed.title, rowsLabel: owed.rowsLabel }}
        lead={state === "past-due" ? owed.pastDueLead : undefined}
        rows={state === "past-due" ? owed.overdueRows : owed.rows}
        actions={<Button>{owed.book}</Button>}
      />
      <NoteList copy={{ label: reminders.title }} notes={reminders.items} />
    </>
  );
}

/** The stage rail and the body the stage calls for. Flows draw it alone. */
function CaseBodyWithRail({ state }: CasePagePrototypeProps) {
  const stage = STATE_STAGE[state];
  return (
    <div className="flex w-full max-w-3xl flex-col gap-8">
      <StageRail
        copy={{ stages: FINANCED_STAGES, ended: stage.ended }}
        current={stage.current}
        slot="case-page-stage-rail"
      />
      <CaseBody state={state} />
    </div>
  );
}

/** One case, its stage and the body the stage calls for. A wireframe until the design lands. */
function CasePagePrototype({ state }: CasePagePrototypeProps) {
  const stage = STATE_STAGE[state];
  return (
    <VaultPageShell>
      <PrototypeNote
        manualPath={COLLECTOR_PAGES_MANUAL_PATH}
        settles="the stages on screen, whose the item is, and the answers to the offer and to each act’s confirmation."
      />
      <PageHeader
        title={CASE_PAGE_COPY.item}
        description={CASE_PAGE_COPY.meta}
        actions={<Badge variant="default">{stage.word}</Badge>}
      />
      <CaseBodyWithRail state={state} />
    </VaultPageShell>
  );
}

export type { CasePagePrototypeProps, CasePageState };
export { CaseBodyWithRail, CasePagePrototype };

import { Badge } from "@grade10/design-system/components/display/badge";
import { Button } from "@grade10/design-system/components/forms/button";
import { EmptyPanel, FactCard, FactCardSkeleton } from "@grade10/ui";
import {
  PageHeader,
  PrototypeNote,
  VaultPageShell,
} from "../../../pages/vault-shared";
import { navigateToStory } from "../../../pages/workbench-story-nav";
import {
  CASE_LIST_CASES,
  CASE_LIST_COPY,
  CASE_LIST_DRAFT,
  CASE_PAGE_LOAN_RUNNING_STORY_ID,
  CASE_PAGE_OFFER_WAITING_STORY_ID,
  COLLECTOR_PAGES_MANUAL_PATH,
  REQUEST_WIZARD_DESCRIBE_STORY_ID,
} from "./collector-pages-content";

type CaseListState = "cards" | "draft" | "empty" | "loading";

type CaseListPrototypeProps = { state: CaseListState };

/** The collector's case list. A wireframe: one state per story. */
function CaseListPrototype({ state }: CaseListPrototypeProps) {
  const startRequest = (
    <Button onClick={() => navigateToStory(REQUEST_WIZARD_DESCRIBE_STORY_ID)}>
      {CASE_LIST_COPY.startRequest}
    </Button>
  );

  return (
    <VaultPageShell>
      <PrototypeNote
        manualPath={COLLECTOR_PAGES_MANUAL_PATH}
        settles="how the cases read on screen and how a request starts."
      />
      <PageHeader
        title={CASE_LIST_COPY.title}
        description={CASE_LIST_COPY.description}
        actions={state === "empty" ? undefined : startRequest}
      />
      <div className="flex flex-col gap-4">
        {state === "loading" ? (
          <FactCardSkeleton
            copy={{ label: CASE_LIST_COPY.loading }}
            count={2}
          />
        ) : null}
        {state === "empty" ? (
          <EmptyPanel copy={CASE_LIST_COPY.empty} actions={startRequest} />
        ) : null}
        {state === "cards"
          ? CASE_LIST_CASES.map((item) => (
              <FactCard
                key={item.reference}
                copy={{ title: item.title, description: item.status }}
                lead={<Badge variant="default">{item.chip}</Badge>}
                rows={[
                  { label: "Reference", value: item.reference },
                  { label: "Opened", value: item.opened },
                  { label: "Lane", value: item.lane },
                ]}
                actions={
                  <Button
                    aria-label={`Open ${item.title}`}
                    onClick={() =>
                      navigateToStory(
                        item.status === "Offer waiting"
                          ? CASE_PAGE_OFFER_WAITING_STORY_ID
                          : CASE_PAGE_LOAN_RUNNING_STORY_ID,
                      )
                    }
                    variant="outline"
                  >
                    {CASE_LIST_COPY.open}
                  </Button>
                }
              />
            ))
          : null}
        {state === "draft" ? (
          <FactCard
            copy={{
              title: CASE_LIST_DRAFT.title,
              description: CASE_LIST_DRAFT.status,
            }}
            lead={CASE_LIST_DRAFT.nextStep}
            rows={[
              { label: "Photographs", value: CASE_LIST_DRAFT.photographs },
            ]}
            actions={
              <Button
                aria-label={`${CASE_LIST_COPY.resume} ${CASE_LIST_DRAFT.title}`}
                onClick={() =>
                  navigateToStory(REQUEST_WIZARD_DESCRIBE_STORY_ID)
                }
                variant="outline"
              >
                {CASE_LIST_COPY.resume}
              </Button>
            }
          />
        ) : null}
      </div>
    </VaultPageShell>
  );
}

export type { CaseListPrototypeProps, CaseListState };
export { CaseListPrototype };

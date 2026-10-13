import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { FactCard, StageRail } from "@grade10/ui";
import {
  SUBMISSION_COPY,
  SUBMISSION_STAGES,
  SUBMISSION_VIEWS,
  type SubmissionState,
  type SubmissionView,
} from "./submission-content";

/** The collector's page for one submission: where it is, its facts, its cards and the one action it offers. */
function SubmissionStatusPanel({
  state,
  caseTitle,
  onNavigate,
}: {
  state: SubmissionState;
  /** In a flow, the step's title: it names each card so the steps laid side by side stay distinct. */
  caseTitle?: string;
  onNavigate?: (storyId: string) => void;
}) {
  const view: SubmissionView = SUBMISSION_VIEWS[state];
  const named = (title: string) =>
    caseTitle ? `${title} · ${caseTitle}` : title;
  const action = view.action;
  return (
    <div className="flex flex-col gap-6">
      <StageRail
        copy={{ stages: SUBMISSION_STAGES, ended: view.ended }}
        current={view.stage}
      />
      <div className="flex flex-col gap-2 rounded-2xl border border-border p-5">
        <Text size="sm" tone="secondary">
          {view.move}
        </Text>
        <Text size="xl" weight="medium">
          {view.word}
        </Text>
        {view.note ? (
          <Text size="sm" tone="secondary">
            {view.note}
          </Text>
        ) : null}
      </div>
      <FactCard
        copy={{ title: named(SUBMISSION_COPY.facts) }}
        rows={view.facts.map((fact) => ({
          label: fact.label,
          value: fact.value,
        }))}
      />
      {view.cards ? (
        <FactCard
          copy={{ title: named(SUBMISSION_COPY.cards) }}
          rows={view.cards.map((card) => ({
            label: card.name,
            value: card.outcome,
          }))}
        />
      ) : null}
      {state === "withdrawal-open" ? (
        <FactCard
          copy={{ title: SUBMISSION_COPY.withdraw.title }}
          lead={SUBMISSION_COPY.withdraw.body}
        />
      ) : null}
      {action ? (
        <div>
          <Button
            onClick={() =>
              action.storyId ? onNavigate?.(action.storyId) : undefined
            }
            variant="outline"
          >
            {action.label}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export { SubmissionStatusPanel };

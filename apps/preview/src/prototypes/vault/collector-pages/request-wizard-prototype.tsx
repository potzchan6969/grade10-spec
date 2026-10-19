import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { Label } from "@grade10/design-system/components/forms/label";
import { RadioList } from "@grade10/design-system/components/forms/radio-list";
import { RadioListItem } from "@grade10/design-system/components/forms/radio-list-item";
import { TextInput } from "@grade10/design-system/components/forms/text-input";
import { Textarea } from "@grade10/design-system/components/forms/textarea";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { FactCard, NoteList, StageRail } from "@grade10/ui";
import { type ReactNode, useId } from "react";
import {
  PageHeader,
  PrototypeNote,
  VaultPageShell,
} from "../../../pages/vault-shared";
import { navigateToStory } from "../../../pages/workbench-story-nav";
import {
  BOOK_A_VISIT_SHOP_STORY_ID,
  COLLECTOR_PAGES_MANUAL_PATH,
  REQUEST_STEPS_COPY,
} from "./collector-pages-content";

type RequestWizardState = "describe" | "photograph" | "review" | "sent";

type RequestWizardPrototypeProps = { state: RequestWizardState };

const WIZARD_STAGES = [
  { id: "describe", label: "Describe" },
  { id: "photograph", label: "Photograph" },
  { id: "review", label: "Review" },
];

const { describe, photograph, review, sent } = REQUEST_STEPS_COPY;

/** A labelled field: the label names its control, and the hint sits under it. */
function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: (id: string) => ReactNode;
}) {
  const id = useId();
  return (
    <div className="flex w-full flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children(id)}
      {hint ? (
        <Text size="sm" tone="secondary">
          {hint}
        </Text>
      ) : null}
    </div>
  );
}

function DescribeStep() {
  return (
    <VStack gap="lg" hAlign="start">
      <Field label={describe.category}>
        {(id) => (
          <TextInput
            defaultValue={describe.categoryValue}
            id={id}
            name="category"
          />
        )}
      </Field>
      <Field hint={describe.titleHint} label={describe.title}>
        {(id) => (
          <TextInput defaultValue={describe.titleValue} id={id} name="title" />
        )}
      </Field>
      <Field hint={describe.descriptionHint} label={describe.description}>
        {(id) => (
          <Textarea
            defaultValue={describe.descriptionValue}
            id={id}
            name="description"
          />
        )}
      </Field>
      <Field hint={describe.whatsappHint} label={describe.whatsapp}>
        {(id) => <TextInput id={id} name="whatsapp" />}
      </Field>
      <RadioList
        aria-label={describe.lane}
        defaultValue="loan"
        label={describe.lane}
      >
        <RadioListItem value="loan">{describe.laneLoan}</RadioListItem>
        <RadioListItem value="storage">{describe.laneStorage}</RadioListItem>
      </RadioList>
      <Field label={describe.amount}>
        {(id) => (
          <TextInput
            defaultValue={describe.amountValue}
            id={id}
            inputMode="numeric"
            name="amount"
          />
        )}
      </Field>
    </VStack>
  );
}

function PhotographStep() {
  return (
    <VStack gap="lg" hAlign="start">
      <div className="flex w-full flex-col gap-3 rounded-2xl border border-dashed border-border p-6">
        <Text weight="medium">{photograph.drop}</Text>
        <Text size="sm" tone="secondary">
          {photograph.dropHint}
        </Text>
        <Text size="sm" tone="secondary">
          {photograph.removed}
        </Text>
        <Text size="sm">{photograph.count}</Text>
        <div>
          <Button variant="outline">{photograph.addPhotos}</Button>
        </div>
      </div>
      <NoteList
        copy={{ label: "Tips for the photographs" }}
        notes={photograph.tips.map((tip, index) => ({
          id: `tip-${index}`,
          content: tip,
        }))}
      />
    </VStack>
  );
}

function ReviewStep() {
  return (
    <VStack gap="lg" hAlign="start">
      <FactCard
        copy={{ title: review.title, rowsLabel: "The request’s figures" }}
        rows={review.rows}
      />
      <NoteList
        copy={{ label: review.nextTitle }}
        notes={review.next.map((content, index) => ({
          id: `next-${index}`,
          content,
        }))}
      />
      <label className="flex items-start gap-2 text-sm">
        <input name="statement" type="checkbox" />
        {review.statement}
      </label>
      <div className="flex flex-wrap gap-3">
        <Button>{review.send}</Button>
      </div>
    </VStack>
  );
}

function SentStep() {
  return (
    <FactCard
      copy={{ title: sent.title }}
      lead={
        <>
          <Text size="sm" tone="secondary">
            {sent.reference}
          </Text>
          <Text as="p" className="font-mono text-3xl tracking-widest">
            K7HQ4R
          </Text>
        </>
      }
      actions={
        <>
          <Button onClick={() => navigateToStory(BOOK_A_VISIT_SHOP_STORY_ID)}>
            {sent.book}
          </Button>
          <Button variant="outline">{sent.notNow}</Button>
        </>
      }
    >
      <Text size="sm" tone="secondary">
        {sent.lead}
      </Text>
      <Text size="sm" tone="secondary">
        {sent.several}
      </Text>
    </FactCard>
  );
}

/** One step of the request wizard, its rail and its actions. Flows draw it alone. */
function RequestWizardBody({ state }: RequestWizardPrototypeProps) {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-8">
      {state !== "sent" ? (
        <StageRail
          copy={{ stages: WIZARD_STAGES }}
          current={state}
          slot="request-wizard-stage-rail"
        />
      ) : null}
      {state === "describe" ? <DescribeStep /> : null}
      {state === "photograph" ? <PhotographStep /> : null}
      {state === "review" ? <ReviewStep /> : null}
      {state === "sent" ? <SentStep /> : null}
      {state === "describe" || state === "photograph" ? (
        <div className="flex flex-wrap gap-3">
          <Button>{describe.continue}</Button>
          <Button variant="outline">{describe.finishLater}</Button>
        </div>
      ) : null}
      {state === "review" ? (
        <div className="flex flex-wrap gap-3">
          <Button variant="outline">{describe.finishLater}</Button>
        </div>
      ) : null}
    </div>
  );
}

/** The request wizard, one step per state. A wireframe until the design lands. */
function RequestWizardPrototype({ state }: RequestWizardPrototypeProps) {
  return (
    <VaultPageShell>
      <PrototypeNote
        manualPath={COLLECTOR_PAGES_MANUAL_PATH}
        settles="the request’s steps on screen, the read-back before it sends and the statement’s tick."
      />
      <PageHeader title="Start a request" />
      <RequestWizardBody state={state} />
    </VaultPageShell>
  );
}

export type { RequestWizardPrototypeProps, RequestWizardState };
export { RequestWizardBody, RequestWizardPrototype };

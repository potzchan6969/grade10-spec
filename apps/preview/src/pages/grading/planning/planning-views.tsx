import { Alert } from "@grade10/design-system/components/display/alert";
import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { CheckboxListInput } from "@grade10/design-system/components/forms/checkbox-list-input";
import { TextInput } from "@grade10/design-system/components/forms/text-input";
import { FactCard, NoteList, StageRail } from "@grade10/ui";
import {
  PLAN_COPY,
  PLAN_FEE_SHEET_COPY,
  PLAN_GRADERS,
  PLAN_LEVELS,
  PLAN_STAGES,
  type PlanState,
} from "./planning-content";

const noop = () => undefined;
const { cards, service, book } = PLAN_COPY;

/** The service's open and closed levels for a state, with the reason a closed one is closed. */
function levelsFor(
  state: PlanState,
): Record<string, { open: boolean; reason?: string }> {
  if (state === "service-bulk")
    return Object.fromEntries(
      PLAN_LEVELS.map((level) => [
        level.id,
        level.id === "bulk"
          ? { open: true }
          : { open: false, reason: service.closedAbove20 },
      ]),
    );
  if (state === "service-closed")
    return {
      value: { open: false, reason: service.closedValue },
      regular: { open: false, reason: service.closedRegular },
      express: { open: true },
      "super-express": { open: true },
      bulk: { open: false, reason: service.closedBulk },
    };
  return {
    value: { open: true },
    regular: { open: true },
    express: { open: true },
    "super-express": { open: true },
    bulk: { open: false, reason: service.closedBulk },
  };
}

/** The first visit: what grading is, the four steps and the fee sheet, before any sign-in. */
function FeeSheetPanel({ onContinue = noop }: { onContinue?: () => void }) {
  const copy = PLAN_FEE_SHEET_COPY;
  return (
    <div className="flex flex-col gap-6">
      <Text>{copy.intro}</Text>
      <NoteList copy={{ label: copy.stepsLabel }} notes={copy.steps} />
      <FactCard
        actions={
          <div className="flex flex-wrap gap-2">
            <Button onClick={onContinue}>{copy.start}</Button>
            <Button variant="outline">{copy.bookWithout}</Button>
          </div>
        }
        copy={{ title: copy.title }}
        lead={copy.sheetLead}
        rows={PLAN_LEVELS.map((level) => ({
          label: level.name,
          value: `Up to ${level.ceiling} · ${level.fee}${level.cover ? ` ${level.cover}` : ""} · back ${level.back}`,
        }))}
      >
        <Text size="sm" tone="secondary">
          {copy.coverLine}
        </Text>
      </FactCard>
    </div>
  );
}

function CardsPanel({ onContinue = noop }: { onContinue?: () => void }) {
  return (
    <div className="flex flex-col gap-6">
      <Text weight="medium">{cards.contact}</Text>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput defaultValue="Alex Chan" label={cards.name} name="name" />
        <TextInput
          defaultValue="alex.chan@example.com"
          label={cards.email}
          name="email"
          type="email"
        />
        <TextInput
          defaultValue="+852 6123 4567"
          label={cards.phone}
          name="phone"
          type="tel"
        />
      </div>
      <div className="flex flex-col gap-4 rounded-2xl border border-border p-5">
        <Text weight="medium">{cards.cardTitle}</Text>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            defaultValue="1999 Charizard"
            label={cards.cardName}
            name="card-name"
          />
          <TextInput
            defaultValue="Base Set"
            label={cards.cardSet}
            name="card-set"
          />
          <TextInput
            defaultValue="3500"
            inputMode="numeric"
            label={cards.declared}
            name="declared"
          />
        </div>
        <Text size="sm" tone="secondary">
          {cards.reference}
        </Text>
        <Text size="sm">{cards.referenceRows}</Text>
        <CheckboxListInput size="sm">{cards.minimum}</CheckboxListInput>
      </div>
      <Text size="sm" tone="secondary">
        {cards.cardCount}
      </Text>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline">{cards.addCard}</Button>
        <Button onClick={onContinue}>{cards.continue}</Button>
      </div>
    </div>
  );
}

function ServicePanel({
  state,
  onContinue = noop,
}: {
  state: PlanState;
  onContinue?: () => void;
}) {
  const levels = levelsFor(state);
  const chosen =
    state === "service-closed"
      ? "express"
      : state === "service-bulk"
        ? "bulk"
        : "regular";
  const estimate =
    state === "service-closed"
      ? { rows: service.estimateExpress, back: service.estimateExpressBack }
      : state === "service-bulk"
        ? { rows: service.bulkEstimate, back: service.bulkBack }
        : { rows: service.estimateRows, back: service.estimateBack };
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Text weight="medium">{service.grader}</Text>
        <fieldset className="flex flex-wrap gap-2">
          <legend className="sr-only">{service.grader}</legend>
          {PLAN_GRADERS.map((grader) => (
            <Button
              aria-pressed={grader === "PSA"}
              key={grader}
              size="sm"
              variant={grader === "PSA" ? "default" : "outline"}
            >
              {grader}
            </Button>
          ))}
        </fieldset>
      </div>
      <div className="flex flex-col gap-3">
        <Text weight="medium">{service.level}</Text>
        {PLAN_LEVELS.map((level) => {
          const status = levels[level.id];
          const isChosen = status.open && level.id === chosen;
          return (
            <div className="flex flex-col gap-2" key={level.id}>
              <Button
                aria-pressed={isChosen}
                className="h-auto justify-between py-3 text-left"
                disabled={!status.open}
                variant={isChosen ? "default" : "outline"}
              >
                <span className="flex flex-col items-start gap-1">
                  <span>{level.name}</span>
                  <span className="text-xs font-normal opacity-80">
                    Up to {level.ceiling} declared · {level.cards} · {level.fee}
                    {level.cover ? ` ${level.cover}` : ""} · back {level.back}
                  </span>
                </span>
                {isChosen ? (
                  <Badge variant="brand">{service.chosen}</Badge>
                ) : null}
              </Button>
              {status.reason ? (
                <Text size="sm" tone="error">
                  {status.reason}
                </Text>
              ) : null}
            </div>
          );
        })}
      </div>
      <FactCard
        actions={<Button onClick={onContinue}>{service.continue}</Button>}
        copy={{
          title: `${service.estimate} · ${PLAN_LEVELS.find((level) => level.id === chosen)?.name ?? ""}`,
        }}
        lead={estimate.rows}
      >
        <Text size="sm" tone="secondary">
          {estimate.back}
        </Text>
        <Text size="sm" tone="secondary">
          {service.cover}
        </Text>
      </FactCard>
    </div>
  );
}

function BookPanel({
  state,
  onBook = noop,
}: {
  state: PlanState;
  onBook?: () => void;
}) {
  const bulk = state === "service-bulk";
  return (
    <div className="flex flex-col gap-6">
      {state === "book-upcharge" ? (
        <Alert
          description={book.upcharge.body}
          status="warning"
          title={book.upcharge.title}
        />
      ) : null}
      <div className="flex flex-col gap-2">
        <Text weight="medium">{book.schedule}</Text>
        {book.cards.map((card) => (
          <div
            className="flex flex-wrap justify-between gap-2 border-b border-border pb-2 text-sm"
            key={card.id}
          >
            <span>{card.name}</span>
            <span className="text-secondary-foreground">{card.declared}</span>
          </div>
        ))}
      </div>
      <FactCard
        copy={{ title: book.declared }}
        lead={book.declaredValue}
        rows={[{ label: book.fee, value: bulk ? book.feeBulk : book.feeValue }]}
      />
      <div className="flex flex-col gap-3">
        <Text weight="medium">{book.goodToKnow}</Text>
        <NoteList
          copy={{ label: book.goodToKnow }}
          notes={PLAN_COPY.goodToKnow}
        />
      </div>
      <CheckboxListInput size="sm">{book.consent}</CheckboxListInput>
      <div className="flex flex-wrap gap-2">
        <Button onClick={onBook}>{book.book}</Button>
        <Button variant="outline">{book.save}</Button>
      </div>
    </div>
  );
}

/** One step of Planning a submission: the rail, then the cards, the service or the book. */
function PlanStep({
  state,
  onContinue,
  onBook,
}: {
  state: PlanState;
  onContinue?: () => void;
  onBook?: () => void;
}) {
  if (state === "fee-sheet") return <FeeSheetPanel onContinue={onContinue} />;
  const stage =
    state === "cards"
      ? "cards"
      : state === "book" || state === "book-upcharge"
        ? "book"
        : "service";
  return (
    <div className="flex flex-col gap-6">
      <StageRail copy={{ stages: PLAN_STAGES }} current={stage} />
      {stage === "cards" ? (
        <CardsPanel onContinue={onContinue} />
      ) : stage === "service" ? (
        <ServicePanel onContinue={onContinue} state={state} />
      ) : (
        <BookPanel onBook={onBook} state={state} />
      )}
    </div>
  );
}

export { PlanStep };

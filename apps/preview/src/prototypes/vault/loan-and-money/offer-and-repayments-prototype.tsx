import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { FactCard, NoteList } from "@grade10/ui";
import {
  PageHeader,
  PrototypeNote,
  VaultPageShell,
} from "../../../pages/vault-shared";
import { LOAN_AND_MONEY_MANUAL_PATH, LOAN_COPY } from "./loan-content";

type OfferAndRepaymentsState =
  | "offer"
  | "accepted"
  | "owed"
  | "how-to-pay"
  | "repayment-made"
  | "settled";

type OfferAndRepaymentsPrototypeProps = { state: OfferAndRepaymentsState };

const { offer, accepted, owed, reminders, howToPay, repayment, settled } =
  LOAN_COPY;

/** The offer, its acceptance, the balance, the money and its settlement. */
function OfferAndRepaymentsBody({ state }: OfferAndRepaymentsPrototypeProps) {
  if (state === "offer") {
    return (
      <FactCard
        copy={{
          title: offer.title,
          description: offer.description,
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
  if (state === "accepted") {
    return (
      <FactCard
        copy={{ title: accepted.title }}
        lead={accepted.lead}
        rows={accepted.rows}
      />
    );
  }
  if (state === "owed") {
    return (
      <div className="flex w-full flex-col gap-6">
        <FactCard
          copy={{ title: owed.title, rowsLabel: owed.rowsLabel }}
          rows={owed.rows}
          actions={<Button>{owed.book}</Button>}
        />
        <NoteList copy={{ label: reminders.title }} notes={reminders.items} />
        <Text size="sm" tone="secondary">
          {reminders.free}
        </Text>
      </div>
    );
  }
  if (state === "how-to-pay") {
    return (
      <div className="flex w-full flex-col gap-6">
        <FactCard
          copy={{ title: howToPay.title, rowsLabel: howToPay.rowsLabel }}
          lead={howToPay.lead}
          rows={howToPay.rows}
        />
        <Text size="sm" tone="secondary">
          {howToPay.counter}
        </Text>
        <Text size="sm" tone="secondary">
          {howToPay.daily}
        </Text>
      </div>
    );
  }
  if (state === "repayment-made") {
    return (
      <FactCard
        copy={{ title: repayment.title, rowsLabel: repayment.rowsLabel }}
        lead={repayment.lead}
        rows={repayment.rows}
      >
        <Text size="sm" tone="secondary">
          {repayment.note}
        </Text>
      </FactCard>
    );
  }
  return (
    <FactCard
      copy={{ title: settled.title, rowsLabel: settled.rowsLabel }}
      lead={settled.lead}
      rows={settled.rows}
      actions={
        <>
          <Button>{settled.pickup}</Button>
          <Button variant="outline">{settled.askBack}</Button>
        </>
      }
    />
  );
}

/** The loan's money on the case page: the offer to its settlement. A wireframe until the design lands. */
function OfferAndRepaymentsPrototype({
  state,
}: OfferAndRepaymentsPrototypeProps) {
  return (
    <VaultPageShell>
      <PrototypeNote
        manualPath={LOAN_AND_MONEY_MANUAL_PATH}
        settles="how the offer’s figures and the balance are laid out, where How to pay sits on the page and how a repayment and a settled loan read."
      />
      <PageHeader title={LOAN_COPY.item} description={LOAN_COPY.meta} />
      <div className="flex w-full max-w-3xl flex-col gap-6">
        <OfferAndRepaymentsBody state={state} />
      </div>
    </VaultPageShell>
  );
}

export type { OfferAndRepaymentsPrototypeProps, OfferAndRepaymentsState };
export { OfferAndRepaymentsBody, OfferAndRepaymentsPrototype };

import { Alert } from "@grade10/design-system/components/display/alert";
import { EmptyState } from "@grade10/design-system/components/display/empty-state";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { CheckboxListInput } from "@grade10/design-system/components/forms/checkbox-list-input";
import { TextInput } from "@grade10/design-system/components/forms/text-input";
import { FactCard } from "@grade10/ui";
import {
  type AgreementState,
  DOCUMENTS_COPY,
  type ReceiptState,
} from "./documents-content";

const noop = () => undefined;
const { signing, declined, sealed, linkExpired, alreadySigned, placeholders } =
  DOCUMENTS_COPY;

/** The submission agreement's text: parties, cards, totals and the seven clauses. */
function AgreementDocument({ state }: { state: AgreementState }) {
  const cover = state === "cover-schedule";
  const registered = state === "placeholders";
  const totals = DOCUMENTS_COPY.totals;
  return (
    <article className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6">
      <Text size="lg" weight="medium">
        {DOCUMENTS_COPY.documentTitle}
      </Text>
      <Text size="sm">
        {registered ? (
          <Text as="span" size="sm" tone="warning" weight="medium">
            {placeholders.registered}
          </Text>
        ) : (
          DOCUMENTS_COPY.parties
        )}
        {" · "}
        {DOCUMENTS_COPY.submission}
      </Text>
      <Text size="sm" tone="secondary">
        {cover ? DOCUMENTS_COPY.coverGraderValue : DOCUMENTS_COPY.graderValue}
      </Text>
      <div className="flex flex-col gap-2">
        <Text weight="medium">{DOCUMENTS_COPY.cards}</Text>
        {(cover ? DOCUMENTS_COPY.coverRows : DOCUMENTS_COPY.cardRows).map(
          (row) => (
            <div
              className="flex flex-wrap justify-between gap-2 border-b border-border pb-2 text-sm"
              key={row.id}
            >
              <span>{row.name}</span>
              <span className="text-secondary-foreground">
                {row.declared}
                {"cover" in row ? ` · cover ${row.cover}` : null}
              </span>
            </div>
          ),
        )}
      </div>
      <div className="flex flex-col gap-1 text-sm">
        <span>
          {totals.declared}: {totals.declaredValue}
        </span>
        <span>
          {totals.fee}:{" "}
          {cover ? `${totals.feeCover}, ${totals.coverValue}` : totals.feeValue}
        </span>
        <span>
          {totals.back}: {cover ? totals.backCover : totals.backValue}
        </span>
      </div>
      <ol className="flex list-decimal flex-col gap-3 pl-5 text-sm">
        {DOCUMENTS_COPY.clauses.map((clause) => (
          <li key={clause}>{clause}</li>
        ))}
      </ol>
      <Text size="sm" tone="secondary">
        {DOCUMENTS_COPY.draftClauses}
      </Text>
      <Text size="sm" tone="secondary">
        {DOCUMENTS_COPY.complaintsLine}
      </Text>
    </article>
  );
}

/** The signing block: the name, the postal address, the signature and Sign or Decline. */
function AgreementSigning({
  state,
  onSign = noop,
  onOpenSubmission = noop,
}: {
  state: AgreementState;
  onSign?: () => void;
  onOpenSubmission?: () => void;
}) {
  if (state === "declined")
    return (
      <EmptyState
        title={declined.title}
        description={declined.description}
        data-slot="agreement-declined"
      />
    );
  if (state === "link-expired")
    return (
      <EmptyState
        title={linkExpired.title}
        description={linkExpired.description}
        data-slot="agreement-link-expired"
      />
    );
  if (state === "sealed")
    return (
      <div className="flex flex-col gap-4">
        <Alert
          description={sealed.body}
          status="success"
          title={sealed.title}
        />
        <FactCard
          actions={<Button variant="outline">{sealed.download}</Button>}
          copy={{ title: sealed.copy }}
          lead={sealed.fingerprint}
        >
          <Text size="sm" tone="secondary">
            {sealed.emailed}
          </Text>
        </FactCard>
      </div>
    );
  if (state === "already-signed")
    return (
      <Alert
        actions={
          <Button onClick={onOpenSubmission} variant="outline">
            {alreadySigned.open}
          </Button>
        }
        description={alreadySigned.body}
        title={alreadySigned.title}
      />
    );

  const nameWrong = state === "name-mismatch";
  const addressEmpty = state === "postal-address-empty";
  const pagesUnread = state === "pages-not-viewed";
  return (
    <div className="flex flex-col gap-5">
      {pagesUnread ? (
        <Alert
          description={signing.pagesReadBody}
          status="warning"
          title={signing.pagesRead}
        />
      ) : null}
      {nameWrong ? (
        <Alert
          description={signing.refusedNameBody}
          status="error"
          title={signing.refusedName}
        />
      ) : null}
      {addressEmpty ? (
        <Alert
          description={signing.refusedAddressBody}
          status="error"
          title={signing.refusedAddress}
        />
      ) : null}
      <TextInput
        defaultValue={
          nameWrong ? "Alex Cheng" : DOCUMENTS_COPY.receipt.collector
        }
        label={signing.name}
        message={nameWrong ? signing.nameMismatch : undefined}
        name="name"
        status={nameWrong ? "error" : "default"}
      />
      <TextInput
        defaultValue={addressEmpty ? "" : "Flat 12, Tower 1, Wan Chai"}
        label={signing.address}
        message={addressEmpty ? signing.addressEmpty : signing.addressHint}
        name="address"
        status={addressEmpty ? "error" : "default"}
      />
      <div className="flex min-h-24 items-center justify-center rounded-xl border border-dashed border-border p-4">
        <Text size="sm" tone="secondary">
          {signing.signature}
        </Text>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button disabled={pagesUnread} onClick={onSign}>
          {signing.sign}
        </Button>
        <Button variant="outline">{signing.decline}</Button>
      </div>
    </div>
  );
}

/** One step of the agreement's flow: the cover in total where it applies, then the signing block. */
function AgreementStep({
  state,
  onSign,
  onOpenSubmission,
}: {
  state: AgreementState;
  onSign?: () => void;
  onOpenSubmission?: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      {state === "cover-schedule" ? (
        <FactCard
          copy={{ title: DOCUMENTS_COPY.totals.coverValue }}
          lead={DOCUMENTS_COPY.totals.feeCover}
          rows={DOCUMENTS_COPY.coverRows.map((row) => ({
            label: row.name,
            value: `${row.declared} · cover ${row.cover}`,
          }))}
        />
      ) : null}
      <AgreementSigning
        onOpenSubmission={onOpenSubmission}
        onSign={onSign}
        state={state}
      />
    </div>
  );
}

/** The hand-back receipt's text: what was handed back, to whom, where and when. */
function ReceiptDocument({ state }: { state: ReceiptState }) {
  const receipt = DOCUMENTS_COPY.receipt;
  const collector =
    state === "named-person" ? receipt.collectorNamed : receipt.collector;
  return (
    <article className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6">
      <Text size="lg" weight="medium">
        {DOCUMENTS_COPY.receiptTitle}
      </Text>
      <Text size="sm" tone="secondary">
        {receipt.intro}
      </Text>
      <div className="flex flex-col gap-1 text-sm">
        <span>
          {receipt.handedTo}: {receipt.collector}
        </span>
        <span>
          {receipt.collectedBy}: {collector}
        </span>
        <span>
          {receipt.where}: {DOCUMENTS_COPY.shop}
        </span>
        <span>
          {receipt.when}: {receipt.whenValue}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <Text weight="medium">{receipt.cardsHeader}</Text>
        {receipt.cards.map((card) => (
          <div
            className="flex flex-wrap justify-between gap-2 border-b border-border pb-2 text-sm"
            key={card.id}
          >
            <span>{card.name}</span>
            <span className="text-secondary-foreground">
              {card.grade} · {card.cert}
            </span>
          </div>
        ))}
      </div>
      <ol className="flex list-decimal flex-col gap-3 pl-5 text-sm">
        {receipt.clauses.map((clause) => (
          <li key={clause}>{clause}</li>
        ))}
      </ol>
      <Text size="sm" tone="secondary">
        {receipt.footer}
      </Text>
    </article>
  );
}

/** The receipt's notice for the state, and the signing block for the collector or the named person. */
function ReceiptStep({
  state,
  onSign,
}: {
  state: ReceiptState;
  onSign?: () => void;
}) {
  const named = state === "named-person";
  const { receiptStates, receipt } = DOCUMENTS_COPY;
  return (
    <div className="flex flex-col gap-5">
      {state === "card-held" ? (
        <Alert
          description={receiptStates.cardHeld.body}
          status="warning"
          title={receiptStates.cardHeld.title}
        />
      ) : null}
      {state === "vaulted-slab" ? (
        <Alert
          description={receiptStates.vaulted.body}
          title={receiptStates.vaulted.title}
        />
      ) : null}
      {state === "withdrawn-card" ? (
        <Alert
          description={receiptStates.withdrawn.body}
          title={receiptStates.withdrawn.title}
        />
      ) : null}
      {state === "paid-out" ? (
        <Alert
          description={receiptStates.paidOut.body}
          status="success"
          title={receiptStates.paidOut.title}
        />
      ) : null}
      <TextInput
        defaultValue={named ? receipt.collectorNamed : receipt.collector}
        label={DOCUMENTS_COPY.signing.name}
        message={named ? receipt.namedHint : receipt.namedAs}
        name="collector"
      />
      <CheckboxListInput defaultChecked={state === "id-matched"} size="sm">
        {receipt.idMatched}
      </CheckboxListInput>
      {state === "id-matched" ? (
        <Text size="sm" tone="secondary">
          {receipt.nothingKept}
        </Text>
      ) : null}
      <div>
        <Button onClick={onSign}>{receipt.sign}</Button>
      </div>
    </div>
  );
}

export {
  AgreementDocument,
  AgreementSigning,
  AgreementStep,
  ReceiptDocument,
  ReceiptStep,
};

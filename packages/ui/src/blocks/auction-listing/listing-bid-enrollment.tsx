import { Card } from "@grade10/design-system/components/display/card";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { CheckboxListInput } from "@grade10/design-system/components/forms/checkbox-list-input";
import { Link } from "@grade10/design-system/components/forms/link";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@grade10/design-system/components/overlays/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@grade10/design-system/components/overlays/tooltip";
import { CreditCard, Info } from "@phosphor-icons/react";
import { type ReactNode, useEffect, useState } from "react";
import { OrderDetailsPaymentLogo } from "../store-order-detail/order-details-payment-logo";
import type { OrderDetailsPaymentBrand } from "../store-order-detail/types";

type OverlayPresentation = "modal" | "inline";

type PaymentMethodLabelCopy = {
  paymentMethod: string;
  paymentMethodTooltip: string;
};

function PaymentMethodLabel({ copy }: { copy: PaymentMethodLabelCopy }) {
  return (
    <HStack gap="xs" vAlign="center">
      <Text
        className="text-secondary-foreground"
        size="sm"
        tone="secondary"
        weight="medium"
      >
        {copy.paymentMethod}
      </Text>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            aria-label={copy.paymentMethodTooltip}
            className="inline-flex shrink-0 cursor-pointer text-secondary-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            onPointerDown={(event) => event.preventDefault()}
            render={<Info aria-hidden size={12} />}
          />
          <TooltipContent>{copy.paymentMethodTooltip}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </HStack>
  );
}

type PaymentMethodRowCopy = PaymentMethodLabelCopy & {
  changeCard: string;
};

type PaymentMethodRowProps = {
  copy: PaymentMethodRowCopy;
  brand: OrderDetailsPaymentBrand;
  maskedNumber: string;
  onChange?: () => void;
};

function PaymentMethodRow({
  copy,
  brand,
  maskedNumber,
  onChange,
}: PaymentMethodRowProps) {
  return (
    <VStack className="w-full" gap="sm">
      <PaymentMethodLabel copy={copy} />
      <Card className="gap-0 p-3" padding={false}>
        <HStack
          className="w-full"
          gap="sm"
          hAlign="space-between"
          vAlign="center"
        >
          <HStack gap="sm" vAlign="center">
            <OrderDetailsPaymentLogo brand={brand} />
            <span aria-hidden className="h-5 w-px shrink-0 bg-border" />
            <Text size="sm" weight="medium">
              {maskedNumber}
            </Text>
          </HStack>
          <div className="flex h-5 shrink-0 items-center justify-end">
            {onChange ? (
              <Link
                onClick={onChange}
                render={<button type="button" />}
                size="sm"
                variant="secondary"
              >
                {copy.changeCard}
              </Link>
            ) : null}
          </div>
        </HStack>
      </Card>
    </VStack>
  );
}

type PaymentMethodEmptyStateCopy = PaymentMethodLabelCopy & {
  linkCardEmptyState: string;
};

type PaymentMethodEmptyStateProps = {
  copy: PaymentMethodEmptyStateCopy;
  onLink?: () => void;
};

function PaymentMethodEmptyState({
  copy,
  onLink,
}: PaymentMethodEmptyStateProps) {
  return (
    <VStack className="w-full" gap="sm">
      <PaymentMethodLabel copy={copy} />
      <button
        aria-label={copy.linkCardEmptyState}
        className="w-full cursor-pointer rounded-2xl text-left transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        onClick={onLink}
        type="button"
      >
        <Card
          className="gap-0 p-3 transition-colors hover:bg-muted/30"
          padding={false}
        >
          <HStack className="w-full" gap="sm" vAlign="center">
            <span
              aria-hidden
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-dashed border-border bg-muted/40 text-secondary-foreground"
            >
              <CreditCard size={16} weight="bold" />
            </span>
            <Text size="sm" tone="secondary">
              {copy.linkCardEmptyState}
            </Text>
          </HStack>
        </Card>
      </button>
    </VStack>
  );
}

type EnrollmentSetupSheetCopy = {
  getReadyToBid: string;
  linkCardDescription: string;
  ageAttestation: string;
  continue: string;
  /** Primary action label while the provider link request is in flight. */
  linking: string;
};

function PaymentFieldSlot({
  content,
  disabled = false,
}: {
  content?: ReactNode;
  disabled?: boolean;
}) {
  return (
    <div
      aria-busy={content == null ? true : undefined}
      aria-disabled={disabled || undefined}
      data-slot="payment-field"
      data-state={content == null ? "empty" : "ready"}
      className={`grid w-full overflow-hidden transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${content == null ? "grid-rows-[0fr]" : "grid-rows-[1fr]"} ${disabled ? "pointer-events-none opacity-60" : ""}`}
      inert={disabled ? true : undefined}
    >
      <div className="min-h-0 w-full">
        {content ?? (
          <div
            aria-hidden
            className="h-12 w-full rounded-md border border-dashed border-border bg-muted/40"
          />
        )}
      </div>
    </div>
  );
}

type EnrollmentSetupSheetProps = {
  copy: EnrollmentSetupSheetCopy;
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  onContinue?: () => void;
  /** Consumer-owned provider-neutral payment field rendered in the setup body. */
  paymentField?: ReactNode;
  /** Whether the consumer-owned payment field is ready to submit. */
  cardReady?: boolean;
  /** Existing consumer-facing alias for the provider-neutral payment field. */
  stripePaymentMethodField?: ReactNode;
  /** Existing consumer-facing alias for `cardReady`. */
  paymentMethodReady?: boolean;
  presentation?: OverlayPresentation;
  /** When false, a card is already on file and only attestation is required. */
  requiresIframeLink?: boolean;
  /** Stripe iframe prefilled with an account card (change-card flow). */
  iframeLinkedPayment?: {
    brand: OrderDetailsPaymentBrand;
    maskedNumber: string;
  };
  /** Age attestation already given on a prior lot. */
  defaultAgeAttested?: boolean;
  /** Tiny destructive message under the card field after a refused Link Card. */
  errorMessage?: string;
  /** Provider link in flight — locks the sheet and shows the linking CTA. */
  linking?: boolean;
};

function SetupSheetBody({
  copy,
  ageAttested,
  errorMessage,
  linking,
  paymentField,
  stripePaymentMethodField,
  onAgeAttestedChange,
  scrollsPaymentField,
}: {
  copy: EnrollmentSetupSheetCopy;
  ageAttested: boolean;
  errorMessage?: string;
  linking: boolean;
  paymentField?: ReactNode;
  stripePaymentMethodField?: ReactNode;
  onAgeAttestedChange: (checked: boolean) => void;
  scrollsPaymentField?: boolean;
}) {
  const resolvedPaymentField = paymentField ?? stripePaymentMethodField;
  const paymentFieldSlot = (
    <PaymentFieldSlot content={resolvedPaymentField} disabled={linking} />
  );

  return (
    <VStack className="w-full" gap="md">
      <DialogDescription>{copy.linkCardDescription}</DialogDescription>
      {scrollsPaymentField ? (
        <DialogBody className="max-h-60 flex-none">
          {paymentFieldSlot}
        </DialogBody>
      ) : (
        paymentFieldSlot
      )}
      <VStack className="w-full" gap="sm">
        {errorMessage && !linking ? (
          <p
            className="text-left text-xs text-destructive"
            data-slot="input-message"
            role="alert"
          >
            {errorMessage}
          </p>
        ) : null}
      </VStack>
      <CheckboxListInput
        checked={ageAttested}
        disabled={linking}
        onCheckedChange={(checked) => onAgeAttestedChange(checked === true)}
        size="sm"
      >
        {copy.ageAttestation}
      </CheckboxListInput>
    </VStack>
  );
}

function EnrollmentSetupSheet({
  copy,
  open,
  onOpenChange,
  onContinue,
  presentation = "modal",
  requiresIframeLink = true,
  iframeLinkedPayment,
  defaultAgeAttested = false,
  errorMessage,
  linking = false,
  paymentField,
  cardReady,
  stripePaymentMethodField,
  paymentMethodReady,
}: EnrollmentSetupSheetProps) {
  const [ageAttested, setAgeAttested] = useState(defaultAgeAttested);
  const resolvedPaymentField = paymentField ?? stripePaymentMethodField;
  const resolvedCardReady = cardReady ?? paymentMethodReady;

  const isCardReady = requiresIframeLink
    ? resolvedPaymentField
      ? resolvedCardReady === true
      : iframeLinkedPayment != null
    : true;

  useEffect(() => {
    if (open) {
      setAgeAttested(defaultAgeAttested);
      return;
    }
    setAgeAttested(false);
  }, [defaultAgeAttested, open]);

  function handleContinue() {
    if (linking || !isCardReady || !ageAttested) return;
    onContinue?.();
  }

  const footer = (
    <Button
      disabled={!isCardReady || !ageAttested || linking}
      loading={linking}
      onClick={handleContinue}
      size="md"
      type="button"
    >
      {linking ? copy.linking : copy.continue}
    </Button>
  );

  if (presentation === "inline") {
    if (!open) return null;
    return (
      <InlineOverlayPreview label={copy.getReadyToBid}>
        <SetupSheetBody
          ageAttested={ageAttested}
          copy={copy}
          errorMessage={errorMessage}
          linking={linking}
          onAgeAttestedChange={setAgeAttested}
          paymentField={paymentField}
          stripePaymentMethodField={stripePaymentMethodField}
        />
        <div className="mt-4">{footer}</div>
      </InlineOverlayPreview>
    );
  }

  return (
    <Dialog
      onOpenChange={(next) => {
        if (linking && !next) return;
        onOpenChange?.(next);
      }}
      open={open}
    >
      <DialogContent>
        <DialogHeader showCloseButton={!linking}>
          <DialogTitle>{copy.getReadyToBid}</DialogTitle>
        </DialogHeader>
        <SetupSheetBody
          ageAttested={ageAttested}
          copy={copy}
          errorMessage={errorMessage}
          linking={linking}
          onAgeAttestedChange={setAgeAttested}
          paymentField={paymentField}
          scrollsPaymentField
          stripePaymentMethodField={stripePaymentMethodField}
        />
        <DialogFooter>{footer}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function InlineOverlayPreview({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="w-full rounded-md border border-dashed border-border bg-muted/20 p-4">
      <Text className="mb-3 block" size="xs" tone="muted">
        {label} (static preview)
      </Text>
      {children}
    </div>
  );
}

export type {
  EnrollmentSetupSheetCopy,
  EnrollmentSetupSheetProps,
  OverlayPresentation,
  PaymentMethodEmptyStateCopy,
  PaymentMethodEmptyStateProps,
  PaymentMethodRowCopy,
  PaymentMethodRowProps,
};
export {
  EnrollmentSetupSheet,
  InlineOverlayPreview,
  PaymentMethodEmptyState,
  PaymentMethodRow,
};

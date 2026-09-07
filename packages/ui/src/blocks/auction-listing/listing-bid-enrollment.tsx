import { Alert } from "@grade10/design-system/components/display/alert";
import { Card } from "@grade10/design-system/components/display/card";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { CheckboxListInput } from "@grade10/design-system/components/forms/checkbox-list-input";
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
import { CreditCard } from "@phosphor-icons/react";
import { type ReactNode, useEffect, useState } from "react";
import { OrderDetailsPaymentLogo } from "../store-order-detail/order-details-payment-logo";
import type { OrderDetailsPaymentBrand } from "../store-order-detail/types";

type OverlayPresentation = "modal" | "inline";

type PaymentMethodRowCopy = {
  paymentMethod: string;
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
      <Text
        className="text-secondary-foreground"
        size="sm"
        tone="secondary"
        weight="medium"
      >
        {copy.paymentMethod}
      </Text>
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
          {onChange ? (
            <Button onClick={onChange} size="sm" variant="ghost">
              {copy.changeCard}
            </Button>
          ) : null}
        </HStack>
      </Card>
    </VStack>
  );
}

type PaymentMethodEmptyStateCopy = {
  paymentMethod: string;
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
      <Text
        className="text-secondary-foreground"
        size="sm"
        tone="secondary"
        weight="medium"
      >
        {copy.paymentMethod}
      </Text>
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
  authorizing: string;
  authorizingCaption: string;
  authorizationRefused: string;
  iframePlaceholder: string;
  iframeLinkedCardPlaceholder: string;
};

function CardLinkIframePlaceholder({
  copy,
  onSimulateComplete,
  showsLinkedCard = false,
  disabled = false,
}: {
  copy: EnrollmentSetupSheetCopy;
  onSimulateComplete?: () => void;
  showsLinkedCard?: boolean;
  disabled?: boolean;
}) {
  const className =
    "flex h-32 w-full items-center justify-center rounded-md border border-dashed border-border bg-muted/40 text-sm text-secondary-foreground";

  const label = showsLinkedCard
    ? copy.iframeLinkedCardPlaceholder
    : copy.iframePlaceholder;

  if (onSimulateComplete && !disabled) {
    return (
      <button
        aria-label={label}
        className={`${className} cursor-pointer transition-colors hover:bg-muted/60`}
        onClick={onSimulateComplete}
        type="button"
      >
        {label}
      </button>
    );
  }

  return (
    <div
      aria-disabled={disabled || undefined}
      className={
        disabled ? `${className} pointer-events-none opacity-60` : className
      }
    >
      {label}
    </div>
  );
}

type EnrollmentSetupSheetProps = {
  copy: EnrollmentSetupSheetCopy;
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  onContinue?: () => void;
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
  /** Stripe authorization in flight — locks the sheet and shows pending copy. */
  authorizing?: boolean;
  /** Authorization refused — shows the inline error; controls stay interactive. */
  authorizationRefused?: boolean;
};

function SetupSheetBody({
  copy,
  ageAttested,
  authorizing,
  authorizationRefused,
  iframeLinkedPayment,
  onAgeAttestedChange,
  onSimulateCardLinkComplete,
}: {
  copy: EnrollmentSetupSheetCopy;
  ageAttested: boolean;
  authorizing: boolean;
  authorizationRefused: boolean;
  iframeLinkedPayment?: {
    brand: OrderDetailsPaymentBrand;
    maskedNumber: string;
  };
  onAgeAttestedChange: (checked: boolean) => void;
  onSimulateCardLinkComplete?: () => void;
}) {
  return (
    <VStack className="w-full" gap="md">
      <DialogDescription>{copy.linkCardDescription}</DialogDescription>
      <CardLinkIframePlaceholder
        copy={copy}
        disabled={authorizing}
        onSimulateComplete={onSimulateCardLinkComplete}
        showsLinkedCard={iframeLinkedPayment != null}
      />
      {authorizing ? (
        <Alert
          dismissible={false}
          layout="inline"
          status="default"
          title={copy.authorizingCaption}
        />
      ) : null}
      {authorizationRefused ? (
        <Alert
          dismissible={false}
          layout="inline"
          status="error"
          title={copy.authorizationRefused}
        />
      ) : null}
      <CheckboxListInput
        checked={ageAttested}
        disabled={authorizing}
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
  authorizing = false,
  authorizationRefused = false,
}: EnrollmentSetupSheetProps) {
  const [ageAttested, setAgeAttested] = useState(defaultAgeAttested);
  const [iframeLinked, setIframeLinked] = useState(iframeLinkedPayment != null);

  const cardReady = requiresIframeLink ? iframeLinked : true;

  useEffect(() => {
    if (open) {
      setAgeAttested(defaultAgeAttested);
      setIframeLinked(iframeLinkedPayment != null);
      return;
    }
    setAgeAttested(false);
    setIframeLinked(false);
  }, [defaultAgeAttested, iframeLinkedPayment, open]);

  function handleSimulateCardLinkComplete() {
    if (authorizing) return;
    setIframeLinked(true);
  }

  function handleContinue() {
    if (authorizing || !cardReady || !ageAttested) return;
    onContinue?.();
  }

  const body = (
    <SetupSheetBody
      ageAttested={ageAttested}
      authorizationRefused={authorizationRefused}
      authorizing={authorizing}
      copy={copy}
      iframeLinkedPayment={iframeLinkedPayment}
      onAgeAttestedChange={setAgeAttested}
      onSimulateCardLinkComplete={
        requiresIframeLink && iframeLinkedPayment == null
          ? handleSimulateCardLinkComplete
          : undefined
      }
    />
  );
  const footer = (
    <Button
      disabled={!cardReady || !ageAttested}
      loading={authorizing}
      onClick={handleContinue}
      size="md"
      type="button"
    >
      {authorizing ? copy.authorizing : copy.continue}
    </Button>
  );

  if (presentation === "inline") {
    if (!open) return null;
    return (
      <InlineOverlayPreview label={copy.getReadyToBid}>
        {body}
        <div className="mt-4">{footer}</div>
      </InlineOverlayPreview>
    );
  }

  return (
    <Dialog
      onOpenChange={(next) => {
        if (authorizing && !next) return;
        onOpenChange?.(next);
      }}
      open={open}
    >
      <DialogContent>
        <DialogHeader showCloseButton={!authorizing}>
          <DialogTitle>{copy.getReadyToBid}</DialogTitle>
        </DialogHeader>
        <DialogBody>{body}</DialogBody>
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

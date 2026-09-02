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
import { LISTING_BID_ENROLLMENT_DEMO_COPY } from "./listing-bid-enrollment-copy";

type OverlayPresentation = "modal" | "inline";

type PaymentMethodRowProps = {
  brand: OrderDetailsPaymentBrand;
  maskedNumber: string;
  onChange?: () => void;
};

function PaymentMethodRow({
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
        {LISTING_BID_ENROLLMENT_DEMO_COPY.paymentMethod}
      </Text>
      <Card className="gap-0 p-3" padding={false}>
        <HStack className="w-full" gap="sm" hAlign="space-between" vAlign="center">
          <HStack gap="sm" vAlign="center">
            <OrderDetailsPaymentLogo brand={brand} />
            <span aria-hidden className="h-5 w-px shrink-0 bg-border" />
            <Text size="sm" weight="medium">
              {maskedNumber}
            </Text>
          </HStack>
          {onChange ? (
            <Button onClick={onChange} size="sm" variant="ghost">
              {LISTING_BID_ENROLLMENT_DEMO_COPY.changeCard}
            </Button>
          ) : null}
        </HStack>
      </Card>
    </VStack>
  );
}

type PaymentMethodEmptyStateProps = {
  onLink?: () => void;
};

function PaymentMethodEmptyState({ onLink }: PaymentMethodEmptyStateProps) {
  return (
    <VStack className="w-full" gap="sm">
      <Text
        className="text-secondary-foreground"
        size="sm"
        tone="secondary"
        weight="medium"
      >
        {LISTING_BID_ENROLLMENT_DEMO_COPY.paymentMethod}
      </Text>
      <button
        aria-label={LISTING_BID_ENROLLMENT_DEMO_COPY.linkCardEmptyState}
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
              {LISTING_BID_ENROLLMENT_DEMO_COPY.linkCardEmptyState}
            </Text>
          </HStack>
        </Card>
      </button>
    </VStack>
  );
}

function CardLinkIframePlaceholder({
  onSimulateComplete,
  showsLinkedCard = false,
}: {
  onSimulateComplete?: () => void;
  showsLinkedCard?: boolean;
}) {
  const className =
    "flex h-32 w-full items-center justify-center rounded-md border border-dashed border-border bg-muted/40 text-sm text-secondary-foreground";

  const label = showsLinkedCard
    ? LISTING_BID_ENROLLMENT_DEMO_COPY.iframeLinkedCardPlaceholder
    : LISTING_BID_ENROLLMENT_DEMO_COPY.iframePlaceholder;

  if (onSimulateComplete) {
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
    <div aria-label={label} className={className} role="group">
      {label}
    </div>
  );
}

type EnrollmentSetupSheetProps = {
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
};

function SetupSheetBody({
  ageAttested,
  iframeLinkedPayment,
  onAgeAttestedChange,
  onSimulateCardLinkComplete,
}: {
  ageAttested: boolean;
  iframeLinkedPayment?: {
    brand: OrderDetailsPaymentBrand;
    maskedNumber: string;
  };
  onAgeAttestedChange: (checked: boolean) => void;
  onSimulateCardLinkComplete?: () => void;
}) {
  return (
    <VStack className="w-full" gap="md">
      <DialogDescription>
        {LISTING_BID_ENROLLMENT_DEMO_COPY.linkCardDescription}
      </DialogDescription>
      <CardLinkIframePlaceholder
        onSimulateComplete={onSimulateCardLinkComplete}
        showsLinkedCard={iframeLinkedPayment != null}
      />
      <CheckboxListInput
        checked={ageAttested}
        onCheckedChange={(checked) => onAgeAttestedChange(checked === true)}
        size="sm"
      >
        {LISTING_BID_ENROLLMENT_DEMO_COPY.ageAttestation}
      </CheckboxListInput>
    </VStack>
  );
}

function EnrollmentSetupSheet({
  open,
  onOpenChange,
  onContinue,
  presentation = "modal",
  requiresIframeLink = true,
  iframeLinkedPayment,
  defaultAgeAttested = false,
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
    setIframeLinked(true);
  }

  function handleContinue() {
    if (!cardReady || !ageAttested) return;
    onContinue?.();
  }

  const body = (
    <SetupSheetBody
      ageAttested={ageAttested}
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
      onClick={handleContinue}
      size="md"
      type="button"
    >
      {LISTING_BID_ENROLLMENT_DEMO_COPY.continue}
    </Button>
  );

  if (presentation === "inline") {
    if (!open) return null;
    return (
      <InlineOverlayPreview label={LISTING_BID_ENROLLMENT_DEMO_COPY.getReadyToBid}>
        {body}
        <div className="mt-4">{footer}</div>
      </InlineOverlayPreview>
    );
  }

  return (
    <Dialog onOpenChange={(next) => onOpenChange?.(next)} open={open}>
      <DialogContent showCloseButton>
        <DialogHeader>
          <DialogTitle>{LISTING_BID_ENROLLMENT_DEMO_COPY.getReadyToBid}</DialogTitle>
        </DialogHeader>
        <DialogBody>{body}</DialogBody>
        <DialogFooter>{footer}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type AutoBidConfirmationDialogProps = {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  onConfirm?: () => void;
  presentation?: OverlayPresentation;
  maximumLabel: string;
};

function AutoBidConfirmationBody({ maximumLabel }: { maximumLabel: string }) {
  return (
    <VStack className="w-full" gap="md">
      <div className="flex flex-col gap-4 text-sm leading-5 font-normal text-foreground">
        <p>{LISTING_BID_ENROLLMENT_DEMO_COPY.autoConfirmIntro}</p>
        <p>{LISTING_BID_ENROLLMENT_DEMO_COPY.autoConfirmActive}</p>
        <p>{LISTING_BID_ENROLLMENT_DEMO_COPY.autoConfirmRaiseOnly}</p>
      </div>
      <p className="w-full rounded-md border border-border bg-muted/30 p-3 text-sm font-medium text-foreground">
        {LISTING_BID_ENROLLMENT_DEMO_COPY.autoConfirmMaximum.replace(
          "{amount}",
          maximumLabel,
        )}
      </p>
    </VStack>
  );
}

function AutoBidConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  presentation = "modal",
  maximumLabel,
}: AutoBidConfirmationDialogProps) {
  const body = <AutoBidConfirmationBody maximumLabel={maximumLabel} />;
  const footer = (
    <HStack gap="sm" hAlign="end">
      <Button
        onClick={() => onOpenChange?.(false)}
        size="md"
        type="button"
        variant="outline"
      >
        {LISTING_BID_ENROLLMENT_DEMO_COPY.autoConfirmCancel}
      </Button>
      <Button
        onClick={() => {
          onConfirm?.();
          onOpenChange?.(false);
        }}
        size="md"
        type="button"
      >
        {LISTING_BID_ENROLLMENT_DEMO_COPY.autoConfirmAction}
      </Button>
    </HStack>
  );

  if (presentation === "inline") {
    if (!open) return null;
    return (
      <InlineOverlayPreview label={LISTING_BID_ENROLLMENT_DEMO_COPY.autoConfirmTitle}>
        {body}
        <div className="mt-4">{footer}</div>
      </InlineOverlayPreview>
    );
  }

  return (
    <Dialog onOpenChange={(next) => onOpenChange?.(next)} open={open}>
      <DialogContent showCloseButton>
        <DialogHeader>
          <DialogTitle>{LISTING_BID_ENROLLMENT_DEMO_COPY.autoConfirmTitle}</DialogTitle>
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

export type { OverlayPresentation };
export {
  AutoBidConfirmationDialog,
  EnrollmentSetupSheet,
  InlineOverlayPreview,
  PaymentMethodEmptyState,
  PaymentMethodRow,
};

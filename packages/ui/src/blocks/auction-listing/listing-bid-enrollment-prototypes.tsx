import { Alert } from "@grade10/design-system/components/display/alert";
import { Card } from "@grade10/design-system/components/display/card";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
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
import { type ReactNode, useState } from "react";
import { OrderDetailsPaymentLogo } from "../store-order-detail/order-details-payment-logo";
import type { OrderDetailsPaymentBrand } from "../store-order-detail/types";
import {
  ListingAgeVerificationFields,
  type ListingAgeVerificationFieldsCopy,
} from "./listing-age-verification-dialog";
import { LISTING_BID_ENROLLMENT_DEMO_COPY } from "./listing-bid-enrollment-copy";

type OverlayPresentation = "modal" | "inline";

type EnrollmentBannerProps = {
  message: string;
  actionLabel: string;
  onAction?: () => void;
};

function EnrollmentBanner({
  message,
  actionLabel,
  onAction,
}: EnrollmentBannerProps) {
  return (
    <Alert
      actions={
        <Button onClick={onAction} size="sm" variant="outline">
          {actionLabel}
        </Button>
      }
      dismissible={false}
      layout="inline"
      status="warning"
      title={message}
    />
  );
}

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

type SetupSheetStep = "age" | "payment";

type EnrollmentSetupSheetProps = {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  onContinue?: () => void;
  presentation?: OverlayPresentation;
  steps: readonly SetupSheetStep[];
  stepIndex: number;
  ageCopy: ListingAgeVerificationFieldsCopy;
  showIframe?: boolean;
};

function SetupSheetBody({
  steps,
  stepIndex,
  ageCopy,
  showIframe = false,
}: Pick<
  EnrollmentSetupSheetProps,
  "steps" | "stepIndex" | "ageCopy" | "showIframe"
>) {
  const step = steps[stepIndex];

  return (
    <VStack className="w-full" gap="md">
      {step === "age" ? <ListingAgeVerificationFields copy={ageCopy} /> : null}
      {step === "payment" ? (
        <VStack gap="md">
          <DialogDescription>
            {LISTING_BID_ENROLLMENT_DEMO_COPY.linkCardDescription}
          </DialogDescription>
          {showIframe ? (
            <div className="flex h-32 w-full items-center justify-center rounded-md border border-dashed border-border bg-muted/40 text-sm text-secondary-foreground">
              {LISTING_BID_ENROLLMENT_DEMO_COPY.iframePlaceholder}
            </div>
          ) : (
            <PaymentMethodRow brand="visa" maskedNumber="•••• 4242" />
          )}
        </VStack>
      ) : null}
    </VStack>
  );
}

function EnrollmentSetupSheet({
  open,
  onOpenChange,
  onContinue,
  presentation = "modal",
  steps,
  stepIndex,
  ageCopy,
  showIframe = false,
}: EnrollmentSetupSheetProps) {
  const body = (
    <SetupSheetBody
      ageCopy={ageCopy}
      showIframe={showIframe}
      stepIndex={stepIndex}
      steps={steps}
    />
  );
  const footer = (
    <Button onClick={onContinue} size="md" type="button">
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

export type { OverlayPresentation, SetupSheetStep };
export {
  AutoBidConfirmationDialog,
  EnrollmentBanner,
  EnrollmentSetupSheet,
  InlineOverlayPreview,
  PaymentMethodEmptyState,
  PaymentMethodRow,
};

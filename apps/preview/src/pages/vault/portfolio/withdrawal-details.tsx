import { Badge } from "@grade10/design-system/components/display/badge";
import { DetailRow } from "@grade10/design-system/components/display/detail-row";
import { Step } from "@grade10/design-system/components/display/step";
import type { StepIndicatorState } from "@grade10/design-system/components/display/step-indicator";
import { Stepper } from "@grade10/design-system/components/display/stepper";
import { Text } from "@grade10/design-system/components/display/text";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@grade10/design-system/components/overlays/drawer";
import { type CSSProperties, useEffect, useState } from "react";
import {
  formatHkd,
  formatUsd,
  PAYOUT_METHOD,
  PAYOUT_STATUS_VARIANT,
  type VaultPayoutRequest,
  type VaultPayoutStatus,
  WITHDRAWAL_PROCESSING_DAYS,
} from "../../vault-content";

const SM_UP_MQ = "(min-width: 640px)";

/** Reads the 640px line — a bottom sheet below it, a side drawer from it up. */
function useSmUp() {
  const [smUp, setSmUp] = useState(
    () => typeof window === "undefined" || window.matchMedia(SM_UP_MQ).matches,
  );
  useEffect(() => {
    const media = window.matchMedia(SM_UP_MQ);
    const onChange = () => setSmUp(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);
  return smUp;
}

const STATUS_LABEL: Record<VaultPayoutStatus, string> = {
  Pending: "Pending review",
  Processing: "Processing",
  Completed: "Completed",
  Declined: "Declined",
};

type TimelineStep = {
  label: string;
  description?: string;
  state: StepIndicatorState;
};

/** The request's beats — requested, Grade10's review, then done. */
function timelineSteps(request: VaultPayoutRequest): TimelineStep[] {
  const requested: TimelineStep = {
    label: "Withdrawal requested",
    description: request.requestedAt,
    state: "completed",
  };
  const rateNote =
    request.currency === "HKD" && request.convertedHkd != null
      ? `Converted at US$1 = HK$${(request.convertedHkd / request.amountUsd).toFixed(2)}`
      : null;
  const approvedDescription = [request.approvedAt, rateNote]
    .filter(Boolean)
    .join(" · ");

  switch (request.status) {
    case "Pending":
      return [
        requested,
        {
          label: "Grade10 review",
          description: "Waiting for review",
          state: "progress",
        },
        {
          label: "Completed",
          description: `${WITHDRAWAL_PROCESSING_DAYS} after approval`,
          state: "upcoming",
        },
      ];
    case "Processing":
      return [
        requested,
        {
          label: "Grade10 review",
          description: approvedDescription || undefined,
          state: "completed",
        },
        {
          label: "Completed",
          description: `Arrives in ${WITHDRAWAL_PROCESSING_DAYS}`,
          state: "progress",
        },
      ];
    case "Completed":
      return [
        requested,
        {
          label: "Grade10 review",
          description: approvedDescription || undefined,
          state: "completed",
        },
        { label: "Completed", description: request.sentAt, state: "completed" },
      ];
    case "Declined":
      return [
        requested,
        {
          label: "Grade10 review",
          description: "Declined, returned to rewards",
          state: "completed",
        },
      ];
  }
}

/** The line under the amount — an estimate until approval sets the rate. */
function amountSubtext(request: VaultPayoutRequest): string {
  if (request.currency === "HKD" && request.convertedHkd != null) {
    if (request.status === "Pending") {
      return `Est. ~${formatHkd(request.convertedHkd)}`;
    }
    if (request.status === "Completed") {
      return `${formatHkd(request.convertedHkd)} received`;
    }
    return `${formatHkd(request.convertedHkd)} on the way`;
  }
  if (request.status === "Declined") return "Returned to rewards";
  return `To ${PAYOUT_METHOD.bankName} ${PAYOUT_METHOD.maskedAccount}`;
}

/**
 * The drawer a withdrawal row's chevron opens — the request's amount and
 * status up top, its requested → review → completed timeline,
 * then the payout details with the HKD figure when it pays out in HKD. A
 * bottom sheet under `sm`, a right-side drawer from `sm` up.
 */
function WithdrawalDetails({
  request,
  open,
  onOpenChange,
}: {
  request: VaultPayoutRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const smUp = useSmUp();
  const steps = request ? timelineSteps(request) : [];

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      swipeDirection={smUp ? "right" : "down"}
    >
      <DrawerContent
        /* The sheet caps at 85% of the viewport; the body scrolls inside it. */
        style={
          smUp
            ? undefined
            : ({ "--drawer-content-max-height": "85dvh" } as CSSProperties)
        }
      >
        <DrawerHeader>
          <DrawerTitle>Withdrawal details</DrawerTitle>
          <DrawerDescription className="font-medium uppercase tracking-wide">
            {request ? `Withdrawal · ${request.id}` : "Withdrawal"}
          </DrawerDescription>
        </DrawerHeader>
        {request ? (
          <DrawerBody className="gap-6">
            <div className="flex flex-col gap-1">
              <div className="flex items-start justify-between gap-4">
                <p className="font-heading text-3xl font-medium tracking-tight tabular-nums">
                  {formatUsd(request.amountUsd)}
                </p>
                <Badge
                  className="mt-1.5"
                  variant={PAYOUT_STATUS_VARIANT[request.status]}
                >
                  {request.status === "Pending" ? (
                    <span
                      aria-hidden
                      className="size-1.5 rounded-full bg-warning"
                    />
                  ) : null}
                  {STATUS_LABEL[request.status]}
                </Badge>
              </div>
              <Text tone="secondary">{amountSubtext(request)}</Text>
            </div>

            <Stepper aria-label="Withdrawal progress" orientation="vertical">
              {steps.map((step, index) => (
                <Step
                  description={step.description}
                  key={step.label}
                  label={step.label}
                  orientation="vertical"
                  showLeadingConnector={index !== 0}
                  showTrailingConnector={index !== steps.length - 1}
                  state={step.state}
                />
              ))}
            </Stepper>

            <section aria-label="Details" className="flex flex-col gap-2">
              <Text
                className="uppercase tracking-wide"
                size="xs"
                tone="secondary"
                weight="medium"
              >
                Details
              </Text>
              <div>
                {request.currency === "HKD" &&
                request.convertedHkd != null &&
                request.status !== "Pending" ? (
                  <DetailRow label="Exchange rate applied">
                    <span className="tabular-nums">
                      US$1 = HK$
                      {(request.convertedHkd / request.amountUsd).toFixed(2)}
                    </span>
                  </DetailRow>
                ) : null}
                <DetailRow label="Withdraw to">
                  {PAYOUT_METHOD.bankName} {PAYOUT_METHOD.maskedAccount}
                </DetailRow>
                <DetailRow label="Requested">{request.requestedAt}</DetailRow>
                <DetailRow className="border-b-0" label="Reference">
                  {request.id}
                </DetailRow>
              </div>
            </section>
          </DrawerBody>
        ) : null}
      </DrawerContent>
    </Drawer>
  );
}

export { WithdrawalDetails };

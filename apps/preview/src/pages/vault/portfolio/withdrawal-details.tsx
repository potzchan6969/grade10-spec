import { Alert } from "@grade10/design-system/components/display/alert";
import { Card } from "@grade10/design-system/components/display/card";
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
  type VaultPayoutRequest,
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

  switch (request.status) {
    case "Pending":
      return [
        requested,
        {
          label: "Grade10 review",
          description: "Waiting for review",
          state: "progress",
        },
        { label: "Transfer sent", state: "upcoming" },
      ];
    case "Processing":
      return [
        requested,
        {
          label: "Grade10 review",
          description: request.approvedAt,
          state: "completed",
        },
        { label: "Transfer in progress", state: "progress" },
      ];
    case "Completed":
      return [
        requested,
        {
          label: "Grade10 review",
          description: request.approvedAt,
          state: "completed",
        },
        {
          label: "Transfer sent",
          description: request.sentAt,
          state: "completed",
        },
      ];
    case "Declined":
      return [
        requested,
        {
          label: "Declined",
          description: request.declinedAt,
          state: "error",
        },
      ];
  }
}

/** The line under the amount — the fixed HK$ figure once converted. */
function amountSubtext(request: VaultPayoutRequest): string {
  if (request.currency === "HKD" && request.convertedHkd != null) {
    if (request.status === "Completed") {
      return `${formatHkd(request.convertedHkd)} received`;
    }
    return formatHkd(request.convertedHkd);
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
      /* The sheet shows its drag affordance; the side drawer has the close button. */
      showSwipeHandle={!smUp}
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
          <DrawerTitle>Withdrawal Details</DrawerTitle>
          <DrawerDescription className="sr-only">
            Status, timeline and payout details for this withdrawal.
          </DrawerDescription>
        </DrawerHeader>
        {request ? (
          <DrawerBody className="gap-8 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <Card className="shrink-0">
              <div className="flex flex-col gap-1 px-(--card-spacing)">
                <div className="flex items-start justify-between gap-4">
                  <p className="font-heading text-3xl font-medium tracking-tight tabular-nums">
                    {formatUsd(request.amountUsd)}
                  </p>
                </div>
                <Text tone="secondary">{amountSubtext(request)}</Text>
              </div>
            </Card>

            <Stepper
              aria-label="Withdrawal progress"
              className="shrink-0"
              orientation="vertical"
            >
              {steps.map((step, index) => (
                <Step
                  /* The last step has no connector to fill — release the row's
                     min height so the seam to Details matches the one above. */
                  className={index === steps.length - 1 ? "min-h-0" : undefined}
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

            {request.status === "Declined" && request.declineReason ? (
              <Alert
                className="shrink-0"
                description={request.declineReason}
                dismissible={false}
                status="error"
                title="Withdrawal declined"
              />
            ) : null}

            <section
              aria-label="Details"
              className="flex shrink-0 flex-col gap-2"
            >
              <Text
                className="uppercase tracking-wide"
                size="xs"
                tone="secondary"
                weight="medium"
              >
                Details
              </Text>
              <div>
                {request.currency !== "USD" &&
                request.convertedHkd != null ? (
                  <DetailRow label="Exchange rate">
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

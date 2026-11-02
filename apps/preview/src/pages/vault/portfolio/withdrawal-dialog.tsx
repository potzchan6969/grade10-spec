import { Alert } from "@grade10/design-system/components/display/alert";
import { DetailRow } from "@grade10/design-system/components/display/detail-row";
import { Step } from "@grade10/design-system/components/display/step";
import { Stepper } from "@grade10/design-system/components/display/stepper";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { CheckboxListInput } from "@grade10/design-system/components/forms/checkbox-list-input";
import { Link } from "@grade10/design-system/components/forms/link";
import { RadioButton } from "@grade10/design-system/components/forms/radio-button";
import { RadioList } from "@grade10/design-system/components/forms/radio-list";
import { SegmentedControl } from "@grade10/design-system/components/forms/segmented-control";
import { SegmentedControlItem } from "@grade10/design-system/components/forms/segmented-control-item";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@grade10/design-system/components/forms/select";
import { TextInput } from "@grade10/design-system/components/forms/text-input";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogSubtext,
  DialogTitle,
} from "@grade10/design-system/components/overlays/dialog";
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@grade10/design-system/components/overlays/drawer";
import { cn } from "@grade10/design-system/lib/utils";
import {
  Bank,
  CaretRight,
  CheckCircle,
  DeviceMobile,
  Globe,
  Info,
  Plus,
} from "@phosphor-icons/react";
import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useId,
  useState,
} from "react";
import {
  formatHkd,
  formatUsd,
  WITHDRAWAL_PROCESSING_DAYS,
} from "../../vault-content";

type WithdrawalMethod = {
  id: string;
  kind: "bank" | "fps";
  /** Primary line — `HSBC ••• 8304`, `FPS · +852 9123 ••45`. */
  title: string;
  /** Secondary line — `Chan Tai Man · HK$`. */
  detail: string;
};

type WithdrawalStep =
  | "amount"
  | "destination"
  | "add-method"
  | "review"
  | "submitted";

type MethodKind = "bank" | "fps";

const HK_BANKS = [
  "HSBC",
  "Hang Seng Bank",
  "Bank of China (Hong Kong)",
  "Standard Chartered",
  "Citibank",
  "DBS Bank",
  "Bank of East Asia",
] as const;

const FPS_ID_TYPES = ["Mobile number", "Email address", "FPS ID"] as const;

const FPS_PLACEHOLDER: Record<(typeof FPS_ID_TYPES)[number], string> = {
  "Mobile number": "e.g. +852 9123 4567",
  "Email address": "e.g. chan@example.com",
  "FPS ID": "e.g. 123456789",
};

const MANUAL_VALUE = "manual_request";
const DRAFT_VALUE = "draft_method";

const SM_UP_MQ = "(min-width: 640px)";

/** Reads the 640px line — a bottom sheet below it, a dialog from it up. */
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

/** Steps drawn in the header rail — add-method rides on step 2. */
function stepIndex(step: WithdrawalStep): number {
  if (step === "amount") return 1;
  if (step === "destination" || step === "add-method") return 2;
  return 3;
}

function methodIcon(kind: WithdrawalMethod["kind"]) {
  return kind === "fps" ? (
    <DeviceMobile aria-hidden size={20} weight="regular" />
  ) : (
    <Bank aria-hidden size={20} weight="regular" />
  );
}

/**
 * One destination row — icon, title and detail beside a trailing radio.
 * `RadioButton` wraps the label so the whole row selects; `flex-row-reverse`
 * puts the control on the right.
 */
function DestinationOption({
  value,
  icon,
  title,
  detail,
  disabled,
}: {
  value: string;
  icon: ReactNode;
  title: ReactNode;
  detail: ReactNode;
  disabled?: boolean;
}) {
  return (
    <RadioButton
      className={cn(
        "w-full flex-row-reverse items-center gap-3 rounded-(--radius-2xl) border border-border bg-card p-4 text-left transition-colors",
        "data-checked:border-primary data-checked:bg-primary/5",
        disabled
          ? "cursor-not-allowed opacity-50 disabled:opacity-50"
          : "cursor-pointer hover:border-border-strong hover:bg-background-subtle data-checked:hover:border-primary data-checked:hover:bg-primary/10",
      )}
      disabled={disabled}
      value={value}
    >
      <span className="flex min-w-0 flex-1 items-center gap-3">
        <span
          aria-hidden
          className="flex size-10 shrink-0 items-center justify-center rounded-(--radius-full) bg-muted text-foreground"
        >
          {icon}
        </span>
        <span className="flex min-w-0 flex-1 flex-col items-start">
          <span className="text-sm leading-6 font-medium text-foreground">
            {title}
          </span>
          <span className="text-sm text-secondary-foreground">{detail}</span>
        </span>
      </span>
    </RadioButton>
  );
}

/** A non-radio action row in the destination list (add method, manual). */
function ActionRow({
  icon,
  title,
  detail,
  trailing,
  dashed,
  onClick,
}: {
  icon: ReactNode;
  title: ReactNode;
  detail?: ReactNode;
  trailing?: ReactNode;
  dashed?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={cn(
        "flex w-full cursor-pointer items-center gap-3 rounded-(--radius-2xl) border border-border bg-card p-4 text-left transition-colors",
        "hover:border-border-strong hover:bg-background-subtle",
        dashed && "border-dashed",
      )}
      type="button"
      onClick={onClick}
    >
      <span
        aria-hidden
        className="flex size-10 shrink-0 items-center justify-center rounded-(--radius-full) bg-muted text-foreground"
      >
        {icon}
      </span>
      <span className="flex min-w-0 flex-1 flex-col items-start">
        <span className="text-sm leading-6 font-medium text-foreground">
          {title}
        </span>
        {detail != null ? (
          <span className="text-sm text-secondary-foreground">{detail}</span>
        ) : null}
      </span>
      {trailing}
    </button>
  );
}

function StepRail({ step }: { step: WithdrawalStep }) {
  const current = stepIndex(step);
  return (
    <div className="flex w-full items-center gap-3">
      <div aria-hidden className="flex flex-1 items-center gap-1">
        {[1, 2, 3].map((index) => (
          <span
            className={cn(
              "h-1 flex-1 rounded-(--radius-full)",
              index <= current ? "bg-primary" : "bg-muted",
            )}
            key={index}
          />
        ))}
      </div>
      <span className="text-sm text-secondary-foreground">
        Step {current} of 3
      </span>
    </div>
  );
}

/**
 * Withdrawal — the stepped payout request: amount with `Max` and the
 * receive-in currency, the destination picker drawn like the winner-order
 * setup (saved methods, add a Hong Kong bank or FPS, manual request for
 * US$/overseas), a review that states the approval and the working days
 * before submit, then the submitted beat. Grade10 approves every request;
 * nothing leaves the wallet until then.
 */
function WithdrawalDialog({
  availableUsd,
  minWithdrawalUsd,
  hkdPerUsd,
  payoutMethods,
  collectorName = "Chan Tai Man",
  open,
  onOpenChange,
  onSubmit,
  onViewWithdrawal,
  requestId = "WD-24818",
}: {
  availableUsd: number;
  minWithdrawalUsd: number;
  /** Reference conversion for HKD withdrawals. */
  hkdPerUsd: number;
  /** Saved destinations; empty on a collector's first payout. */
  payoutMethods?: WithdrawalMethod[];
  /** Verified profile name — prefills the account holder field. */
  collectorName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (amountUsd: number, currency: "USD" | "HKD") => void;
  /** Opens the withdrawal tab/details after submit. */
  onViewWithdrawal?: () => void;
  /** Reference shown on the submitted beat. */
  requestId?: string;
}) {
  const [step, setStep] = useState<WithdrawalStep>("amount");
  const [amountInput, setAmountInput] = useState("");
  const [methods, setMethods] = useState<WithdrawalMethod[]>(() => [
    ...(payoutMethods ?? []),
  ]);
  const [selection, setSelection] = useState(
    () => payoutMethods?.[0]?.id ?? "",
  );
  const [manualRequest, setManualRequest] = useState(false);
  const [methodKind, setMethodKind] = useState<MethodKind>("bank");
  const [bankName, setBankName] = useState<string>(HK_BANKS[0]);
  const [fpsIdType, setFpsIdType] =
    useState<(typeof FPS_ID_TYPES)[number]>("Mobile number");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolder, setAccountHolder] = useState(collectorName);
  const [saveForFuture, setSaveForFuture] = useState(true);
  const bankSelectId = useId();
  const fpsSelectId = useId();

  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setStep("amount");
      setAmountInput("");
      setMethods([...(payoutMethods ?? [])]);
      setSelection(payoutMethods?.[0]?.id ?? "");
      setManualRequest(false);
      setAccountNumber("");
      setAccountHolder(collectorName);
      setSaveForFuture(true);
    }
  }

  const amount = Number(amountInput) || 0;
  const amountValid = amount >= minWithdrawalUsd && amount <= availableUsd;
  const convertedHkd = Math.round(amount * hkdPerUsd * 100) / 100;
  const balanceAfter = availableUsd - amount;
  const methodDetailsValid =
    accountHolder.trim() !== "" && accountNumber.trim() !== "";
  const hasMethods = methods.length > 0;

  const destination =
    methods.find((method) => method.id === selection) ??
    methods.find((method) => method.id === DRAFT_VALUE);

  const TITLE: Record<WithdrawalStep, string> = {
    amount: "Withdraw Rewards",
    destination: "Withdraw To",
    "add-method": "Add Withdrawal Method",
    review: "Review Withdrawal",
    submitted: `Withdrawal of ${formatUsd(amount)} Requested`,
  };

  const SUBTEXT: Record<WithdrawalStep, string> = {
    amount: `Available to withdraw: ${formatUsd(availableUsd)}`,
    destination: `Withdrawing ${formatUsd(amount)} · ≈ ${formatHkd(convertedHkd)}`,
    "add-method": "Hong Kong accounts only, in HK$.",
    review: "Grade10 reviews every request before sending it.",
    submitted: "We’ll email you once Grade10 approves the payout.",
  };

  function requestManually() {
    setManualRequest(true);
    setStep("review");
  }

  function saveMethod() {
    const title =
      methodKind === "bank"
        ? `${bankName} ••• ${accountNumber.slice(-4) || "••"}`
        : `FPS · ${accountNumber}`;
    const method: WithdrawalMethod = {
      id: saveForFuture ? `saved-${Date.now()}` : DRAFT_VALUE,
      kind: methodKind,
      title,
      detail: `${accountHolder.trim()} · HK$`,
    };
    setMethods((held) => [...held.filter((m) => m.id !== DRAFT_VALUE), method]);
    setSelection(method.id);
    setManualRequest(false);
    setStep("destination");
  }

  const next = () => {
    if (step === "amount") {
      setStep(hasMethods ? "destination" : "add-method");
    } else if (step === "destination") {
      if (selection === MANUAL_VALUE) {
        requestManually();
      } else {
        setStep("review");
      }
    } else if (step === "add-method") {
      saveMethod();
    } else if (step === "review") {
      onSubmit?.(amount, manualRequest ? "USD" : "HKD");
      setStep("submitted");
    }
  };

  const back = () => {
    if (step === "destination") setStep("amount");
    else if (step === "add-method")
      setStep(hasMethods ? "destination" : "amount");
    else if (step === "review")
      setStep(manualRequest || !hasMethods ? "amount" : "destination");
  };

  const primaryDisabled =
    (step === "amount" && !amountValid) ||
    (step === "destination" && !selection) ||
    (step === "add-method" && !methodDetailsValid);

  const primaryLabel =
    step === "add-method"
      ? "Save & Use"
      : step === "review"
        ? "Submit Request"
        : "Continue";

  /** Closing mid-flow or with an amount typed asks before discarding it. */
  function handleOpenChange(next: boolean) {
    if (
      !next &&
      step !== "submitted" &&
      (step !== "amount" || amountInput.trim() !== "")
    ) {
      const leave = window.confirm(
        "Leave withdrawal? Your progress will not be saved.",
      );
      if (!leave) return;
    }
    onOpenChange(next);
  }

  const stepBody = (
    <>
      {step === "amount" ? (
        <VStack gap="md" hAlign="start">
          <div className="flex w-full flex-col items-end gap-2">
            <TextInput
              aria-label="Withdrawal amount"
              className="w-full font-heading text-2xl font-medium tabular-nums"
              inputMode="decimal"
              prefix="US$"
              size="lg"
              value={amountInput}
              onChange={(event) =>
                setAmountInput(event.target.value.replace(/[^0-9.]/g, ""))
              }
            />
            <Button
              size="sm"
              type="button"
              variant="outline"
              onClick={() => setAmountInput(String(availableUsd))}
            >
              Max
            </Button>
          </div>
          <Text size="sm" tone="secondary">
            {formatUsd(Math.max(0, balanceAfter))} stays in your balance and
            keeps growing · Minimum {formatUsd(minWithdrawalUsd)} · One
            withdrawal every 7 days
          </Text>
          <RadioList
            aria-label="Receive in"
            className="gap-3"
            label="Receive in"
            onValueChange={() => undefined}
            value="HKD"
          >
            <div className="flex w-full flex-col gap-2">
              <DestinationOption
                detail={`≈ ${formatHkd(convertedHkd)} · US$1 = HK$${hkdPerUsd}`}
                icon={<span className="text-sm font-medium">HK$</span>}
                title="Hong Kong dollar"
                value="HKD"
              />
              <div className="flex w-full items-center gap-3 rounded-(--radius-2xl) border border-border bg-card p-4">
                <span
                  aria-hidden
                  className="flex size-10 shrink-0 items-center justify-center rounded-(--radius-full) bg-muted text-foreground"
                >
                  <span className="text-sm font-medium">US$</span>
                </span>
                <span className="flex min-w-0 flex-1 flex-col items-start opacity-50">
                  <span className="text-sm leading-6 font-medium text-secondary-foreground">
                    US dollar
                  </span>
                  <span className="text-sm text-secondary-foreground">
                    Not available yet
                  </span>
                </span>
                <Link
                  render={<button type="button" onClick={requestManually} />}
                  size="sm"
                >
                  Request manually
                </Link>
              </div>
            </div>
          </RadioList>
        </VStack>
      ) : null}

      {step === "destination" ? (
        <VStack gap="md" hAlign="stretch">
          <RadioList
            aria-label="Withdrawal destination"
            className="gap-3"
            onValueChange={setSelection}
            value={selection}
          >
            <div className="flex w-full flex-col gap-2">
              {methods.map((method) => (
                <DestinationOption
                  detail={method.detail}
                  icon={methodIcon(method.kind)}
                  key={method.id}
                  title={method.title}
                  value={method.id}
                />
              ))}
            </div>
          </RadioList>
          <ActionRow
            dashed
            icon={<Plus aria-hidden size={20} weight="regular" />}
            title="Add Hong Kong bank or FPS"
            onClick={() => setStep("add-method")}
          />
          <ActionRow
            detail="Submit a manual request"
            icon={<Globe aria-hidden size={20} weight="regular" />}
            title="US$ or overseas bank"
            trailing={
              <span aria-hidden className="text-secondary-foreground">
                <CaretRight size={16} weight="regular" />
              </span>
            }
            onClick={requestManually}
          />
        </VStack>
      ) : null}

      {step === "add-method" ? (
        <VStack gap="md" hAlign="stretch">
          <SegmentedControl
            aria-label="Withdrawal method type"
            className="w-full"
            onValueChange={(next) => {
              const value = next[0];
              if (value === "bank" || value === "fps") setMethodKind(value);
            }}
            value={[methodKind]}
          >
            <SegmentedControlItem className="flex-1" value="bank">
              Hong Kong Bank
            </SegmentedControlItem>
            <SegmentedControlItem className="flex-1" value="fps">
              FPS
            </SegmentedControlItem>
          </SegmentedControl>

          {methodKind === "bank" ? (
            <div className="flex w-full flex-col gap-2">
              <label
                className="text-sm font-medium text-secondary-foreground"
                htmlFor={bankSelectId}
              >
                Bank
              </label>
              <Select
                onValueChange={(value) => {
                  if (typeof value === "string") setBankName(value);
                }}
                value={bankName}
              >
                <SelectTrigger className="w-full" id={bankSelectId}>
                  <SelectValue placeholder="Select a bank" />
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false}>
                  {HK_BANKS.map((bank) => (
                    <SelectItem key={bank} label={bank} value={bank}>
                      {bank}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="flex w-full flex-col gap-2">
              <label
                className="text-sm font-medium text-secondary-foreground"
                htmlFor={fpsSelectId}
              >
                FPS ID Type
              </label>
              <Select
                onValueChange={(value) => {
                  if (
                    typeof value === "string" &&
                    (FPS_ID_TYPES as readonly string[]).includes(value)
                  ) {
                    setFpsIdType(value as (typeof FPS_ID_TYPES)[number]);
                  }
                }}
                value={fpsIdType}
              >
                <SelectTrigger className="w-full" id={fpsSelectId}>
                  <SelectValue placeholder="Select an ID type" />
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false}>
                  {FPS_ID_TYPES.map((type) => (
                    <SelectItem key={type} label={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <TextInput
            inputMode={methodKind === "bank" ? "numeric" : "text"}
            label={
              methodKind === "bank"
                ? "Account Number"
                : "Mobile Number, Email or FPS ID"
            }
            placeholder={
              methodKind === "bank"
                ? "e.g. 123-456789-001"
                : FPS_PLACEHOLDER[fpsIdType]
            }
            value={accountNumber}
            onChange={(event) => setAccountNumber(event.target.value)}
          />
          <div className="flex w-full flex-col gap-2">
            <TextInput
              label="Account Holder Name"
              value={accountHolder}
              onChange={(event) => setAccountHolder(event.target.value)}
            />
            <Text size="sm" tone="secondary">
              Taken from your verified Grade10 profile.
            </Text>
          </div>
          <CheckboxListInput
            checked={saveForFuture}
            onCheckedChange={(checked) => setSaveForFuture(checked === true)}
            size="sm"
          >
            Save for future withdrawals
          </CheckboxListInput>
          <Text size="sm" tone="secondary">
            Overseas account?{" "}
            <Link
              render={<button type="button" onClick={requestManually} />}
              size="sm"
            >
              Request manually
            </Link>
          </Text>
        </VStack>
      ) : null}

      {step === "review" ? (
        <VStack gap="md" hAlign="start">
          <div className="flex w-full flex-col items-start gap-1">
            <span className="font-heading text-3xl font-medium tracking-tight tabular-nums">
              {manualRequest
                ? formatUsd(amount)
                : `≈ ${formatHkd(convertedHkd)}`}
            </span>
            <div className="flex w-full items-baseline justify-between">
              <Text size="sm" tone="secondary">
                You’ll receive
              </Text>
              <Text size="sm" tone="secondary">
                from {formatUsd(amount)} of rewards
              </Text>
            </div>
          </div>
          {manualRequest ? (
            <div className="flex w-full items-center gap-4 rounded-(--radius-2xl) border border-border bg-background-subtle p-4">
              <span
                aria-hidden
                className="flex size-10 shrink-0 items-center justify-center rounded-(--radius-full) bg-muted text-foreground"
              >
                <Globe size={20} weight="regular" />
              </span>
              <VStack className="min-w-0" gap="xs" hAlign="start">
                <Text as="span" weight="medium">
                  US$ or overseas bank
                </Text>
                <Text as="span" className="text-secondary-foreground" size="sm">
                  Our team arranges this payout manually
                </Text>
              </VStack>
            </div>
          ) : (
            <div className="flex w-full items-center gap-4 rounded-(--radius-2xl) border border-border bg-card p-4">
              <span
                aria-hidden
                className="flex size-10 shrink-0 items-center justify-center rounded-(--radius-full) bg-muted text-foreground"
              >
                {destination ? (
                  methodIcon(destination.kind)
                ) : (
                  <Bank size={20} weight="regular" />
                )}
              </span>
              <VStack className="min-w-0 flex-1" gap="xs" hAlign="start">
                <Text as="span" weight="medium">
                  {destination?.title}
                </Text>
                <Text as="span" className="text-secondary-foreground" size="sm">
                  {destination?.detail}
                </Text>
              </VStack>
              <Link
                render={
                  <button
                    type="button"
                    onClick={() => setStep("destination")}
                  />
                }
                size="sm"
              >
                Change
              </Link>
            </div>
          )}
          <div className="flex w-full flex-col">
            <DetailRow label="Withdraw from rewards">
              <span className="font-medium">{formatUsd(amount)}</span>
            </DetailRow>
            {manualRequest ? (
              <DetailRow label="Handled by">
                <span className="font-medium">Our team manually</span>
              </DetailRow>
            ) : (
              <DetailRow label="Indicative rate">
                <span className="font-medium">US$1 = HK${hkdPerUsd}</span>
              </DetailRow>
            )}
            <DetailRow label="Balance after">
              <span className="font-medium">
                {formatUsd(Math.max(0, balanceAfter))}
              </span>
            </DetailRow>
            <DetailRow className="border-b-0" label="Arrives">
              <span className="font-medium">
                {WITHDRAWAL_PROCESSING_DAYS} after approval
              </span>
            </DetailRow>
          </div>
          <Alert
            description={
              manualRequest
                ? "Our team will contact you to arrange the transfer. You can cancel before it’s approved."
                : "The rate is set when Grade10 approves, so the final HK$ amount may differ slightly. Your history shows both US$ and HK$. You can cancel before it’s approved."
            }
            icon={<Info aria-hidden weight="regular" />}
            status="default"
            title={manualRequest ? "Manual request" : "Indicative rate"}
          />
        </VStack>
      ) : null}

      {step === "submitted" ? (
        <VStack gap="lg" hAlign="stretch">
          <VStack gap="sm" hAlign="center">
            <span className="text-success">
              <CheckCircle aria-hidden size={64} weight="fill" />
            </span>
            <Text
              as="span"
              className="font-heading text-xl font-semibold tracking-tight"
            >
              Withdrawal of {formatUsd(amount)} requested
            </Text>
            <Text className="text-center text-secondary-foreground" size="sm">
              {manualRequest
                ? "Our team will contact you to arrange the payout."
                : `≈ ${formatHkd(convertedHkd)} to ${destination?.title ?? "your account"}. We’ll email you once Grade10 approves it.`}
            </Text>
          </VStack>
          <div className="w-full rounded-(--radius-2xl) bg-muted p-4">
            <Stepper orientation="vertical">
              <Step
                description={`Today · ${requestId}`}
                label="Request submitted"
                orientation="vertical"
                showLeadingConnector={false}
                state="completed"
              />
              <Step
                description="Shows as Pending review"
                label="Grade10 review"
                orientation="vertical"
                state="progress"
              />
              <Step
                description={`${WITHDRAWAL_PROCESSING_DAYS} after approval`}
                label={
                  manualRequest
                    ? "Paid by our team"
                    : `Withdrawn to ${destination?.title ?? "your account"}`
                }
                orientation="vertical"
                showTrailingConnector={false}
                state="upcoming"
              />
            </Stepper>
          </div>
        </VStack>
      ) : null}
    </>
  );

  const smUp = useSmUp();
  const Close = smUp ? DialogClose : DrawerClose;

  const secondaryAction =
    step === "submitted" ? (
      <Button
        className="w-full sm:w-auto"
        size="md"
        type="button"
        variant="outline"
        onClick={() => {
          onViewWithdrawal?.();
          onOpenChange(false);
        }}
      >
        View Withdrawal
      </Button>
    ) : step === "amount" ? (
      <Close
        render={
          <Button
            className="w-full sm:w-auto"
            size="md"
            type="button"
            variant="outline"
          />
        }
      >
        Cancel
      </Close>
    ) : (
      <Button
        className="w-full sm:w-auto"
        size="md"
        type="button"
        variant="outline"
        onClick={back}
      >
        Back
      </Button>
    );

  const primaryAction =
    step === "submitted" ? (
      <Close
        render={<Button className="w-full sm:w-auto" size="md" type="button" />}
      >
        Done
      </Close>
    ) : (
      <Button
        className="w-full sm:w-auto"
        disabled={primaryDisabled}
        size="md"
        type="button"
        onClick={next}
      >
        {primaryLabel}
      </Button>
    );

  if (!smUp) {
    return (
      <Drawer
        onOpenChange={handleOpenChange}
        open={open}
        showSwipeHandle
        swipeDirection="down"
      >
        <DrawerContent
          style={{ "--drawer-content-max-height": "92dvh" } as CSSProperties}
        >
          <DrawerHeader>
            {step !== "submitted" ? <StepRail step={step} /> : null}
            <DrawerTitle
              className={step === "submitted" ? "sr-only" : undefined}
            >
              {TITLE[step]}
            </DrawerTitle>
            {step !== "submitted" ? (
              <p className="text-sm text-secondary-foreground">
                {SUBTEXT[step]}
              </p>
            ) : null}
            <DrawerDescription className="sr-only">
              {SUBTEXT[step]}
            </DrawerDescription>
          </DrawerHeader>
          <DrawerBody className="gap-6 pb-[max(1rem,env(safe-area-inset-bottom))]">
            {stepBody}
          </DrawerBody>
          <DrawerFooter>
            {primaryAction}
            {secondaryAction}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogContent className="max-w-lg">
        {step !== "submitted" ? <StepRail step={step} /> : null}
        <DialogHeader>
          <DialogTitle className={step === "submitted" ? "sr-only" : undefined}>
            {TITLE[step]}
          </DialogTitle>
          {step !== "submitted" ? (
            <DialogSubtext>{SUBTEXT[step]}</DialogSubtext>
          ) : null}
        </DialogHeader>
        <DialogBody className="gap-6" tabIndex={0}>
          <DialogDescription className="sr-only">
            {SUBTEXT[step]}
          </DialogDescription>
          {stepBody}
        </DialogBody>
        <DialogFooter>
          {secondaryAction}
          {primaryAction}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export type { WithdrawalMethod };
export { WithdrawalDialog };

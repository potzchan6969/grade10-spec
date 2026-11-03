import { DetailRow } from "@grade10/design-system/components/display/detail-row";
import { Step } from "@grade10/design-system/components/display/step";
import { Stepper } from "@grade10/design-system/components/display/stepper";
import { Text } from "@grade10/design-system/components/display/text";
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from "@grade10/design-system/components/forms/autocomplete";
import { Button } from "@grade10/design-system/components/forms/button";
import { CheckboxListInput } from "@grade10/design-system/components/forms/checkbox-list-input";
import { Link } from "@grade10/design-system/components/forms/link";
import { NumberInput } from "@grade10/design-system/components/forms/number-input";
import { RadioCard } from "@grade10/design-system/components/forms/radio-card";
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
  CheckCircle,
  Globe,
  Lightning,
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
  WINNER_ORDER_SUPPORT_EMAIL,
  type WinnerOrderContactMail,
} from "../../auction/post-bidding/winner-order-contact-mail";
import { WinnerOrderContactDialog } from "../../auction/post-bidding/winner-order-contact-dialog";
import {
  formatHkd,
  formatUsd,
  WITHDRAWAL_PROCESSING_DAYS,
} from "../../vault-content";

type WithdrawalMethod = {
  id: string;
  kind: "bank" | "fps";
  /** Primary line — `HSBC`, `FPS`. */
  title: string;
  /** Secondary line — the masked identifier: `123 •••• 8304`, `+852 •••• 4567`. */
  detail: string;
  /** The unmasked identifier, shown on the review step only. */
  fullDetail?: string;
};

type WithdrawalStep =
  "amount" | "destination" | "add-method" | "review" | "submitted";

type MethodKind = "bank" | "fps";

/** Hong Kong licensed retail banks and the eight virtual banks, `code – name`. */
const HK_BANKS = [
  "003 – Standard Chartered (Hong Kong)",
  "004 – HSBC",
  "009 – China Construction Bank (Asia)",
  "012 – Bank of China (Hong Kong)",
  "015 – Bank of East Asia",
  "016 – DBS Bank (Hong Kong)",
  "018 – China CITIC Bank International",
  "020 – CMB Wing Lung Bank",
  "024 – Hang Seng Bank",
  "025 – Shanghai Commercial Bank",
  "028 – Public Bank (Hong Kong)",
  "035 – OCBC Bank (Hong Kong)",
  "039 – Chiyu Banking Corporation",
  "040 – Dah Sing Bank",
  "041 – Chong Hing Bank",
  "072 – ICBC (Asia)",
  "128 – Fubon Bank (Hong Kong)",
  "229 – CTBC Bank",
  "250 – Citibank (Hong Kong)",
  "269 – Shanghai Commercial & Savings Bank",
  "382 – Bank of Communications (Hong Kong)",
  "387 – ZA Bank",
  "388 – livi bank",
  "389 – Mox Bank",
  "390 – WeLab Bank",
  "391 – Fusion Bank",
  "392 – PAObank",
  "393 – Ant Bank (Hong Kong)",
  "395 – Airstar Bank",
] as const;

/**
 * Banks whose accounts all share one published branch code — the virtuals.
 * Traditional banks print the branch as the account's first 3 digits, so
 * nothing can be prefilled for them.
 */
const BRANCH_CODES: Record<string, string> = {
  "387 – ZA Bank": "747",
  "392 – PAObank": "752",
};

/** `123456789001` → `123-456789-001` — branch (3), account (6), suffix (3). */
function formatBankAccount(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 12);
  const parts = [digits.slice(0, 3), digits.slice(3, 9), digits.slice(9)];
  return parts.filter(Boolean).join("-");
}

const FPS_ID_TYPES = ["Mobile number", "Email address", "FPS ID"] as const;

/** Country codes offered on the mobile rail — HK first, then mainland. */
const MOBILE_CODES = ["+852", "+86"] as const;

const MOBILE_RULES: Record<
  (typeof MOBILE_CODES)[number],
  {
    validate: (digits: string) => boolean;
    error: string;
    placeholder: string;
    /** Grouping applied as the user types — `9123 4567`, `138 1234 5678`. */
    format: (digits: string) => string;
  }
> = {
  "+852": {
    validate: (digits) => /^[4-9]\d{7}$/.test(digits),
    error: "Enter an 8-digit Hong Kong mobile number.",
    placeholder: "9123 4567",
    format: (digits) => digits.slice(0, 8).replace(/(\d{4})(?=\d)/g, "$1 "),
  },
  "+86": {
    validate: (digits) => /^1\d{10}$/.test(digits),
    error: "Enter an 11-digit Mainland China mobile number.",
    placeholder: "138 1234 5678",
    format: (digits) =>
      [digits.slice(0, 3), digits.slice(3, 7), digits.slice(7, 11)]
        .filter(Boolean)
        .join(" "),
  },
};

/** `Chan Tai Man` → `C*** T** M***` — the masking FPS name lookup returns. */
function maskName(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0] + "*".repeat(word.length - 1))
    .join(" ");
}

/** `chan@example.com` → `c•••@example.com`. */
function maskEmail(email: string) {
  const [local, domain] = email.trim().split("@");
  return domain ? `${local[0] ?? ""}•••@${domain}` : email;
}

/** Stands in for the FPS proxy name lookup in the workbench. */
const FPS_LOOKUP_NAME = "Chan Tai Man";

const FPS_VALIDATORS: Record<
  Exclude<(typeof FPS_ID_TYPES)[number], "Mobile number">,
  (value: string) => boolean
> = {
  "Email address": (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
  "FPS ID": (value) => /^\d{7,10}$/.test(value.trim()),
};

const FPS_ERRORS: Record<
  Exclude<(typeof FPS_ID_TYPES)[number], "Mobile number">,
  string
> = {
  "Email address": "Enter a valid email address.",
  "FPS ID": "Enter a 7–10 digit FPS ID.",
};

const FPS_FIELDS: Record<
  (typeof FPS_ID_TYPES)[number],
  {
    label: string;
    placeholder: string;
    type: "tel" | "email" | "number";
    inputMode: "tel" | "email" | "numeric";
  }
> = {
  "Mobile number": {
    label: "Mobile Number",
    placeholder: "9123 4567",
    type: "tel",
    inputMode: "tel",
  },
  "Email address": {
    label: "Email Address",
    placeholder: "name@example.com",
    type: "email",
    inputMode: "email",
  },
  "FPS ID": {
    label: "FPS ID (7–10 digits)",
    placeholder: "101234567",
    type: "number",
    inputMode: "numeric",
  },
};

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
    <Lightning aria-hidden size={20} weight="regular" />
  ) : (
    <Bank aria-hidden size={20} weight="regular" />
  );
}

/** A non-radio action row in the destination list (add method, manual). */
function ActionRow({
  icon,
  title,
  detail,
  trailing,
  dashed,
  disabled,
  onClick,
}: {
  icon: ReactNode;
  title: ReactNode;
  detail?: ReactNode;
  trailing?: ReactNode;
  dashed?: boolean;
  /** Dims the row and drops its own click — `trailing` stays interactive. */
  disabled?: boolean;
  onClick?: () => void;
}) {
  const Row = disabled ? "div" : "button";
  return (
    <Row
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border border-border bg-card p-3 text-left transition-colors",
        !disabled &&
          "cursor-pointer hover:border-border-strong hover:bg-background-subtle",
        dashed && "border-dashed",
      )}
      type={disabled ? undefined : "button"}
      onClick={disabled ? undefined : onClick}
    >
      <span
        aria-hidden
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-(--radius-full) bg-muted text-foreground",
          disabled && "opacity-50",
        )}
      >
        {icon}
      </span>
      <span
        className={cn(
          "flex min-w-0 flex-1 flex-col items-start",
          disabled && "opacity-50",
        )}
      >
        <span className="text-sm leading-6 font-medium text-foreground">
          {title}
        </span>
        {detail != null ? (
          <span className="text-sm text-secondary-foreground">{detail}</span>
        ) : null}
      </span>
      {trailing}
    </Row>
  );
}

/**
 * Withdrawal — the stepped payout request: amount with `Max` and the
 * receive-in currency, the destination picker drawn like the winner-order
 * setup (saved methods, add a Hong Kong bank or FPS, an email request for
 * US$/overseas), a review that states the approval and the working days
 * before submit, then the submitted beat. Grade10 approves every request;
 * nothing leaves the wallet until then.
 */
function WithdrawalDialog({
  availableUsd,
  minWithdrawalUsd,
  hkdPerUsd,
  payoutMethods,
  open,
  onOpenChange,
  onSubmit,
  onViewWithdrawal,
  requestId = "WD-24818",
  initialStep = "amount",
}: {
  availableUsd: number;
  minWithdrawalUsd: number;
  /** Reference conversion for HKD withdrawals. */
  hkdPerUsd: number;
  /** Saved destinations; empty on a collector's first payout. */
  payoutMethods?: WithdrawalMethod[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (amountUsd: number, currency: "USD" | "HKD") => void;
  /** Opens the withdrawal tab/details after submit. */
  onViewWithdrawal?: () => void;
  /** Reference shown on the submitted beat. */
  requestId?: string;
  /** Step the dialog opens on — workbench stories only; defaults to `amount`. */
  initialStep?: WithdrawalStep;
}) {
  const [step, setStep] = useState<WithdrawalStep>(initialStep);
  const [amountInput, setAmountInput] = useState(String(availableUsd));
  const [methods, setMethods] = useState<WithdrawalMethod[]>(() => [
    ...(payoutMethods ?? []),
  ]);
  const [selection, setSelection] = useState(
    () => payoutMethods?.[0]?.id ?? "",
  );
  const [contactOpen, setContactOpen] = useState(false);
  const [receiveIn, setReceiveIn] = useState<"HKD" | "USD">("HKD");
  const [methodKind, setMethodKind] = useState<MethodKind>("bank");
  const [bank, setBank] = useState("");
  const [fpsIdType, setFpsIdType] =
    useState<(typeof FPS_ID_TYPES)[number]>("Mobile number");
  const [mobileCode, setMobileCode] =
    useState<(typeof MOBILE_CODES)[number]>("+852");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [saveForFuture, setSaveForFuture] = useState(true);
  const fpsSelectId = useId();

  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setStep(initialStep);
      setAmountInput(String(availableUsd));
      setMethods([...(payoutMethods ?? [])]);
      setSelection(payoutMethods?.[0]?.id ?? "");
      setContactOpen(false);
      setReceiveIn("HKD");
      setAccountNumber("");
      setBank("");
      setMobileCode("+852");
      setAccountHolder("");
      setSaveForFuture(true);
    }
  }

  const amount = Number(amountInput) || 0;
  const amountValid = amount >= minWithdrawalUsd && amount <= availableUsd;
  const amountTooHigh = amount > availableUsd;
  const amountTooLow = amountInput.trim() !== "" && amount < minWithdrawalUsd;
  const convertedHkd = Math.round(amount * hkdPerUsd * 100) / 100;
  /** FPS proxy name preview — shown once the identifier passes its rule. */
  const fpsIdentifierValid =
    fpsIdType === "Mobile number"
      ? MOBILE_RULES[mobileCode].validate(accountNumber.replace(/\D/g, ""))
      : FPS_VALIDATORS[fpsIdType](accountNumber);
  const fpsPreviewName =
    methodKind === "fps" && fpsIdentifierValid
      ? maskName(FPS_LOOKUP_NAME)
      : null;
  const fpsError =
    methodKind === "fps" && accountNumber.trim() !== "" && !fpsIdentifierValid
      ? fpsIdType === "Mobile number"
        ? MOBILE_RULES[mobileCode].error
        : FPS_ERRORS[fpsIdType]
      : null;
  const methodDetailsValid =
    (methodKind === "bank"
      ? (HK_BANKS as readonly string[]).includes(bank)
      : fpsIdentifierValid) &&
    accountHolder.trim() !== "" &&
    accountNumber.trim() !== "";
  const hasMethods = methods.length > 0;

  const destination =
    methods.find((method) => method.id === selection) ??
    methods.find((method) => method.id === DRAFT_VALUE);

  const TITLE: Record<WithdrawalStep, string> = {
    amount: "Withdraw Earnings",
    destination: "Withdraw To",
    "add-method": "Add Withdrawal Method",
    review: "Review Withdrawal",
    submitted: `Withdrawal of ${formatUsd(amount)} Requested`,
  };

  /** Ready email for a US$/overseas payout — handled by the team, not a form. */
  const manualMail: WinnerOrderContactMail = {
    to: WINNER_ORDER_SUPPORT_EMAIL,
    subject: `Manual withdrawal request — ${formatUsd(amount)}`,
    body: [
      "Hello Grade10,",
      "",
      `I’d like to withdraw ${formatUsd(amount)} of rewards to a US$ or overseas bank account.`,
      "",
      `Amount: ${formatUsd(amount)}`,
      "",
      "Bank country / region:",
      "Bank name:",
      "Account number / IBAN:",
      "SWIFT / BIC:",
      "Account holder name:",
      "",
    ].join("\n"),
    mailtoHref: "",
    copyText: "",
  };

  function saveMethod() {
    const digits = accountNumber.replace(/\D/g, "");
    const last4 = digits.slice(-4) || "••";
    const identifier =
      methodKind === "bank"
        ? digits.length >= 7
          ? `${digits.slice(0, 3)} •••• ${last4}`
          : `••• ${last4}`
        : fpsIdType === "Mobile number"
          ? mobileCode === "+86"
            ? `+86 ${digits.slice(0, 3)} •••• ${digits.slice(7)}`
            : `+852 •••• ${digits.slice(4, 8)}`
          : fpsIdType === "Email address"
            ? maskEmail(accountNumber)
            : `${accountNumber.slice(0, -4)}••••`;
    const method: WithdrawalMethod = {
      id: saveForFuture ? `saved-${Date.now()}` : DRAFT_VALUE,
      kind: methodKind,
      title: methodKind === "bank" ? (bank.split(" – ")[1] ?? bank) : "FPS",
      detail: identifier,
      fullDetail:
        methodKind === "bank"
          ? accountNumber
          : fpsIdType === "Mobile number"
            ? `${mobileCode} ${accountNumber}`
            : accountNumber,
    };
    setMethods((held) => [...held.filter((m) => m.id !== DRAFT_VALUE), method]);
    setSelection(method.id);
    setStep("destination");
  }

  const next = () => {
    if (step === "amount") {
      setStep(hasMethods ? "destination" : "add-method");
    } else if (step === "destination") {
      setStep("review");
    } else if (step === "add-method") {
      saveMethod();
    } else if (step === "review") {
      onSubmit?.(amount, "HKD");
      setStep("submitted");
    }
  };

  const back = () => {
    if (step === "destination") setStep("amount");
    else if (step === "add-method")
      setStep(hasMethods ? "destination" : "amount");
    else if (step === "review") setStep(hasMethods ? "destination" : "amount");
  };

  const primaryDisabled =
    (step === "amount" && !amountValid) ||
    (step === "destination" && !selection) ||
    (step === "add-method" && !methodDetailsValid);

  const primaryLabel =
    step === "add-method"
      ? saveForFuture
        ? "Save & Use"
        : "Use"
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
          <NumberInput
            className="[&_[data-slot=input]]:font-heading [&_[data-slot=input]]:text-2xl [&_[data-slot=input]]:font-medium [&_[data-slot=input]]:tabular-nums [&_[data-slot=input]]:[appearance:textfield] [&_[data-slot=input]::-webkit-inner-spin-button]:appearance-none [&_[data-slot=input]::-webkit-outer-spin-button]:appearance-none"
            inputMode="decimal"
            label="Withdraw Amount"
            message={
              <span>
                {amountTooLow
                  ? `The min. withdrawal is ${formatUsd(minWithdrawalUsd)}. `
                  : `Available: ${formatUsd(availableUsd)}. `}
                {amount !== availableUsd ? (
                  <Link
                    render={
                      <button
                        type="button"
                        onClick={() => setAmountInput(String(availableUsd))}
                      />
                    }
                    size="xs"
                    variant="secondary"
                  >
                    Use max
                  </Link>
                ) : (
                  <span aria-hidden className="invisible">
                    Use max
                  </span>
                )}
              </span>
            }
            prefix="US$"
            size="lg"
            status={amountTooHigh || amountTooLow ? "error" : "default"}
            value={amountInput}
            onChange={(event) => setAmountInput(event.target.value)}
          />
          <RadioList
            aria-label="Receive in"
            className="gap-3"
            label="Receive in"
            onValueChange={(value) => {
              if (value === "HKD" || value === "USD") setReceiveIn(value);
            }}
            value={receiveIn}
          >
            <RadioCard
              description={`${formatHkd(convertedHkd)} (US$1 = HK$${hkdPerUsd})`}
              title="Hong Kong Dollar"
              value="HKD"
            />
            <RadioCard
              action={
                <Link
                  render={
                    <button
                      type="button"
                      onClick={() => setContactOpen(true)}
                    />
                  }
                  size="sm"
                >
                  Request
                </Link>
              }
              className="opacity-100"
              description={
                <span className="opacity-50">
                  Not available now. By request only
                </span>
              }
              disabled
              title={<span className="opacity-50">US Dollar</span>}
              value="USD"
            />
          </RadioList>
        </VStack>
      ) : null}

      {step === "destination" ? (
        <VStack gap="md" hAlign="stretch">
          <div className="flex w-full flex-col gap-2">
            <RadioList
              aria-label="Withdrawal destination"
              className="gap-3"
              onValueChange={setSelection}
              value={selection}
            >
              {methods.map((method) => (
                <RadioCard
                  description={method.detail}
                  icon={methodIcon(method.kind)}
                  key={method.id}
                  title={method.title}
                  value={method.id}
                />
              ))}
            </RadioList>
            <ActionRow
              dashed
              icon={<Plus aria-hidden size={20} weight="regular" />}
              title="Add Hong Kong bank or FPS"
              onClick={() => setStep("add-method")}
            />
            <ActionRow
              detail="Not available now. By request only"
              disabled
              icon={<Globe aria-hidden size={20} weight="regular" />}
              title="Overseas bank"
              trailing={
                <Link
                  render={
                    <button
                      type="button"
                      onClick={() => setContactOpen(true)}
                    />
                  }
                  size="sm"
                >
                  Request
                </Link>
              }
            />
          </div>
        </VStack>
      ) : null}

      {step === "add-method" ? (
        <VStack gap="md" hAlign="stretch">
          <SegmentedControl
            aria-label="Withdrawal method type"
            className="w-full"
            size="sm"
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
            <Autocomplete
              items={HK_BANKS}
              onValueChange={(value) => {
                const next = value ?? "";
                setBank(next);
                const branch = BRANCH_CODES[next];
                if (branch != null) setAccountNumber(`${branch}-`);
              }}
              openOnInputClick
              value={bank}
            >
              <AutocompleteInput
                label="Bank"
                placeholder="Search bank name or code"
              />
              <AutocompleteContent>
                <AutocompleteEmpty>No banks found.</AutocompleteEmpty>
                <AutocompleteList>
                  {(bank: string) => (
                    <AutocompleteItem key={bank} value={bank}>
                      {bank}
                    </AutocompleteItem>
                  )}
                </AutocompleteList>
              </AutocompleteContent>
            </Autocomplete>
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
                <SelectTrigger
                  className="w-full text-base md:text-sm"
                  id={fpsSelectId}
                >
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

          {methodKind === "fps" && fpsIdType === "Mobile number" ? (
            <div className="flex w-full flex-col gap-2">
              <span className="text-sm font-medium text-secondary-foreground">
                Mobile Number
              </span>
              <div className="flex w-full gap-2">
                <Select
                  onValueChange={(value) => {
                    if (
                      typeof value === "string" &&
                      (MOBILE_CODES as readonly string[]).includes(value)
                    ) {
                      setMobileCode(value as (typeof MOBILE_CODES)[number]);
                    }
                  }}
                  value={mobileCode}
                >
                  <SelectTrigger
                    aria-label="Country code"
                    className="w-24 text-base md:text-sm"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent alignItemWithTrigger={false}>
                    {MOBILE_CODES.map((code) => (
                      <SelectItem key={code} label={code} value={code}>
                        {code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <TextInput
                  autoComplete="off"
                  className="flex-1"
                  data-1p-ignore
                  data-lpignore="true"
                  inputMode="tel"
                  message={fpsError ?? undefined}
                  placeholder={MOBILE_RULES[mobileCode].placeholder}
                  status={fpsError ? "error" : "default"}
                  type="tel"
                  value={accountNumber}
                  onChange={(event) =>
                    setAccountNumber(
                      MOBILE_RULES[mobileCode].format(
                        event.target.value.replace(/\D/g, ""),
                      ),
                    )
                  }
                />
              </div>
              {fpsPreviewName ? (
                <Text size="sm" tone="secondary">
                  Name: {fpsPreviewName}
                </Text>
              ) : null}
            </div>
          ) : (
            <TextInput
              autoComplete="off"
              data-1p-ignore
              data-lpignore="true"
              inputMode={
                methodKind === "bank"
                  ? "numeric"
                  : FPS_FIELDS[fpsIdType].inputMode
              }
              label={
                methodKind === "bank"
                  ? "Account Number"
                  : FPS_FIELDS[fpsIdType].label
              }
              message={
                fpsError ??
                (fpsPreviewName ? `Name: ${fpsPreviewName}` : undefined)
              }
              pattern={methodKind === "bank" ? "[0-9-]*" : undefined}
              placeholder={
                methodKind === "bank"
                  ? "e.g. 123-456789-001"
                  : FPS_FIELDS[fpsIdType].placeholder
              }
              status={fpsError ? "error" : "default"}
              type={methodKind === "bank" ? "text" : FPS_FIELDS[fpsIdType].type}
              value={accountNumber}
              onChange={(event) =>
                setAccountNumber(
                  methodKind === "bank"
                    ? formatBankAccount(event.target.value)
                    : event.target.value,
                )
              }
            />
          )}
          <TextInput
            label="Account Holder Name"
            message="Match the full name registered with your bank account to avoid transfer rejection."
            value={accountHolder}
            onChange={(event) => setAccountHolder(event.target.value)}
          />
          <CheckboxListInput
            checked={saveForFuture}
            onCheckedChange={(checked) => setSaveForFuture(checked === true)}
            size="sm"
          >
            Save for future withdrawals
          </CheckboxListInput>
        </VStack>
      ) : null}

      {step === "review" ? (
        <VStack gap="md" hAlign="start">
          <div className="flex w-full flex-col items-start gap-1">
            <Text size="sm" tone="secondary" weight="medium">
              You’ll receive
            </Text>
            <span className="font-heading text-3xl font-medium tracking-tight tabular-nums">
              {formatHkd(convertedHkd)}
            </span>
          </div>
          <div className="flex w-full items-center gap-3 rounded-xl border border-border bg-card p-3">
            <span
              aria-hidden
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-foreground [&_svg]:size-5"
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
                {destination?.fullDetail ?? destination?.detail}
              </Text>
            </VStack>
            <Link
              render={
                <button type="button" onClick={() => setStep("destination")} />
              }
              size="sm"
            >
              Change
            </Link>
          </div>
          <div className="flex w-full flex-col">
            <DetailRow label="Withdraw from rewards">
              {formatUsd(amount)}
            </DetailRow>
            <DetailRow label="Fixed rate">US$1 = HK${hkdPerUsd}</DetailRow>
            <DetailRow label="Withdrawal fee">Free</DetailRow>
            <DetailRow className="border-b-0" label="Est. processing time">
              Most transfers are sent within {WITHDRAWAL_PROCESSING_DAYS}
            </DetailRow>
          </div>
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
              {formatHkd(convertedHkd)} to{" "}
              {destination?.title ?? "your account"}. We’ll email you once
              Grade10 approves it.
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
                label={`Withdrawn to ${destination?.title ?? "your account"}`}
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

  const contactDialog = (
    <WinnerOrderContactDialog
      mail={manualMail}
      open={contactOpen}
      onOpenChange={setContactOpen}
    />
  );

  if (!smUp) {
    return (
      <>
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
              <DrawerTitle
                className={step === "submitted" ? "sr-only" : undefined}
              >
                {TITLE[step]}
              </DrawerTitle>
              {step !== "submitted" ? (
                <p className="text-sm text-secondary-foreground">
                  Step {stepIndex(step)} of 3
                </p>
              ) : null}
              <DrawerDescription className="sr-only">
                {TITLE[step]}
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
        {contactDialog}
      </>
    );
  }

  return (
    <>
      <Dialog onOpenChange={handleOpenChange} open={open}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle
              className={step === "submitted" ? "sr-only" : undefined}
            >
              {TITLE[step]}
            </DialogTitle>
            {step !== "submitted" ? (
              <DialogSubtext>Step {stepIndex(step)} of 3</DialogSubtext>
            ) : null}
          </DialogHeader>
          <DialogBody className="gap-6" tabIndex={0}>
            <DialogDescription className="sr-only">
              {TITLE[step]}
            </DialogDescription>
            {stepBody}
          </DialogBody>
          <DialogFooter>
            {secondaryAction}
            {primaryAction}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {contactDialog}
    </>
  );
}

export type { WithdrawalMethod };
export { WithdrawalDialog };

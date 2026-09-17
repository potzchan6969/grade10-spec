import { EmptyState } from "@grade10/design-system/components/display/empty-state";
import { Button } from "@grade10/design-system/components/forms/button";
import { CheckboxListInput } from "@grade10/design-system/components/forms/checkbox-list-input";
import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import { RadioCard } from "@grade10/design-system/components/forms/radio-card";
import { RadioList } from "@grade10/design-system/components/forms/radio-list";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@grade10/design-system/components/overlays/tooltip";
import { cn } from "@grade10/design-system/lib/utils";
import { Info, MapPin, Trash } from "@phosphor-icons/react";
import { useEffect, useId, useRef, useState } from "react";

export type WinnerOrderSavedAddress = {
  id: string;
  /** Recipient name — RadioCard title. */
  label: string;
  /** Street + locality + country — no name; one street line. */
  lines: string;
};

/** Account shipping address book ceiling — shared across storefronts. */
export const WINNER_ORDER_SAVED_ADDRESS_CAP = 5;

const SAVE_FOR_FUTURE_REFUSED_TOOLTIP =
  "You already have 5 saved addresses. Remove one to save another.";

export const WINNER_ORDER_SAVED_ADDRESSES: readonly WinnerOrderSavedAddress[] =
  [
    {
      id: "wan-chai",
      label: "Alex Chan",
      lines: "12/F, Tower 1, Harbour Road\nWan Chai, Hong Kong\nHong Kong",
    },
    {
      id: "tst",
      label: "Alex Chan",
      lines:
        "Flat 8B, Harbour View, Canton Road\nTsim Sha Tsui, Hong Kong\nHong Kong",
    },
  ] as const;

/** Five named addresses — the book is full; save for future is refused. */
export const WINNER_ORDER_FULL_SAVED_ADDRESSES: readonly WinnerOrderSavedAddress[] =
  [
    {
      id: "wan-chai",
      label: "Alex Chan",
      lines: "12/F, Tower 1, Harbour Road\nWan Chai, Hong Kong\nHong Kong",
    },
    {
      id: "tst",
      label: "Alex Chan",
      lines:
        "Flat 8B, Harbour View, Canton Road\nTsim Sha Tsui, Hong Kong\nHong Kong",
    },
    {
      id: "central",
      label: "Alex Chan",
      lines:
        "Unit 3, Chater House, 8 Connaught Road\nCentral, Hong Kong\nHong Kong",
    },
    {
      id: "causeway",
      label: "Jordan Lee",
      lines: "15/F, 88 Percival Street\nCauseway Bay, Hong Kong\nHong Kong",
    },
    {
      id: "kowloon-tong",
      label: "Sam Wong",
      lines:
        "Block A, Festival Walk Residences\nKowloon Tong, Hong Kong\nHong Kong",
    },
  ] as const;

/** Storybook-only country list — owned options, not a geo package. A–Z via localeCompare. */
const COUNTRY_OPTIONS: readonly string[] = [
  "Australia",
  "Canada",
  "China",
  "Hong Kong",
  "Japan",
  "Macau",
  "Malaysia",
  "Singapore",
  "South Korea",
  "Taiwan",
  "United Kingdom",
  "United States",
].toSorted((a, b) => a.localeCompare(b));

/** Array form for Base UI `items` — do not use a Record (key order is not a contract). */
const COUNTRY_SELECT_ITEMS = COUNTRY_OPTIONS.map((country) => ({
  value: country,
  label: country,
}));

const DRAFT_VALUE = "use_this_address";
/** Occasional list feedback — same budget as cart row exit. */
const ADDRESS_LIST_MOTION_MS = 200;
const ADDRESS_LIST_EASE = "cubic-bezier(0.23, 1, 0.32, 1)";

type NewAddressDraft = {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  saveForFuture: boolean;
};

const EMPTY_DRAFT: NewAddressDraft = {
  firstName: "",
  lastName: "",
  street: "",
  city: "",
  state: "",
  postalCode: "",
  country: "Hong Kong",
  saveForFuture: true,
};

type WinnerOrderSetupPaymentMethod = "card" | "bank_transfer";

export type WinnerOrderSetupResult = {
  delivery: string;
  paymentMethod: WinnerOrderSetupPaymentMethod;
  billing: string;
  sameAsDelivery: boolean;
};

type WinnerOrderSetupDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  savedAddresses?: readonly WinnerOrderSavedAddress[];
  /** Currency for method offer — bank transfer only when HKD. */
  currency?: "HKD" | "USD" | "JPY";
  /** Called when the winner finishes all setup steps. */
  onConfirm: (result: WinnerOrderSetupResult) => void;
  /** Open the nested add-address form when the picker opens (Storybook). */
  initialNewAddressOpen?: boolean;
  /** Start on a later step (Storybook). */
  initialStep?: 1 | 2 | 3;
};

type SetupStep = 1 | 2 | 3;

/** Frozen address chosen for this order — survives later book removes. */
type AddressSnapshot = {
  sourceId: string;
  label: string;
  lines: string;
};

const FEE_RANGE_CARD =
  "Card fee applies. Exact amount on the invoice.";
const FEE_RANGE_BANK =
  "Fee set when Grade10 prepares your invoice. May be Free.";

function stepLabel(step: SetupStep): string {
  if (step === 1) return "Delivery";
  if (step === 2) return "Payment";
  return "Billing";
}

function snapshotFromAddress(address: WinnerOrderSavedAddress): AddressSnapshot {
  return {
    sourceId: address.id,
    label: address.label,
    lines: address.lines,
  };
}

function snapshotPayload(snapshot: AddressSnapshot): string {
  return [snapshot.label, snapshot.lines].filter(Boolean).join("\n");
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Street + locality + country — no recipient name. */
function formatAddressLines(draft: NewAddressDraft): string {
  const locality = [
    draft.city.trim(),
    draft.state.trim(),
    draft.postalCode.trim(),
  ]
    .filter(Boolean)
    .join(", ");
  return [draft.street.trim(), locality, draft.country.trim()]
    .filter(Boolean)
    .join("\n");
}

function addressLabelFromDraft(draft: NewAddressDraft): string {
  const name = [draft.firstName.trim(), draft.lastName.trim()]
    .filter(Boolean)
    .join(" ");
  if (name) return name;
  return "New address";
}

function confirmPayload(address: WinnerOrderSavedAddress): string {
  return [address.label, address.lines].filter(Boolean).join("\n");
}

function newAddressReady(draft: NewAddressDraft): boolean {
  return Boolean(
    draft.firstName.trim() &&
      draft.lastName.trim() &&
      draft.street.trim() &&
      draft.city.trim() &&
      draft.postalCode.trim() &&
      draft.country.trim(),
  );
}

/**
 * Preview-only: stepped order setup — delivery, payment method, billing.
 * One step visible at a time. Not a published `@grade10/ui` export.
 */
function WinnerOrderSetupDialog({
  open,
  onOpenChange,
  savedAddresses: savedAddressesProp = WINNER_ORDER_SAVED_ADDRESSES,
  currency = "HKD",
  onConfirm,
  initialNewAddressOpen = false,
  initialStep = 1,
}: WinnerOrderSetupDialogProps) {
  const formId = useId();
  const countryId = useId();
  const [step, setStep] = useState<SetupStep>(initialStep);
  const [addresses, setAddresses] = useState<WinnerOrderSavedAddress[]>(() => [
    ...savedAddressesProp,
  ]);
  const [selection, setSelection] = useState(
    savedAddressesProp[0]?.id ?? DRAFT_VALUE,
  );
  const [billingSelection, setBillingSelection] = useState(
    savedAddressesProp[0]?.id ?? DRAFT_VALUE,
  );
  const [draftOption, setDraftOption] =
    useState<WinnerOrderSavedAddress | null>(null);
  const [deliverySnapshot, setDeliverySnapshot] =
    useState<AddressSnapshot | null>(null);
  const [paymentMethod, setPaymentMethod] =
    useState<WinnerOrderSetupPaymentMethod | null>(null);
  const [sameAsDelivery, setSameAsDelivery] = useState(true);
  const [newAddressOpen, setNewAddressOpen] = useState(initialNewAddressOpen);
  const [draft, setDraft] = useState<NewAddressDraft>(EMPTY_DRAFT);
  const [attempted, setAttempted] = useState(false);
  const [exitingIds, setExitingIds] = useState(() => new Set<string>());
  const [enteringIds, setEnteringIds] = useState(() => new Set<string>());
  const exitTimersRef = useRef<Map<string, number>>(new Map());
  const enterTimersRef = useRef<Map<string, number>>(new Map());
  const offerBankTransfer = currency === "HKD";

  useEffect(() => {
    if (!open) return;
    for (const timerId of exitTimersRef.current.values()) {
      window.clearTimeout(timerId);
    }
    for (const timerId of enterTimersRef.current.values()) {
      window.clearTimeout(timerId);
    }
    exitTimersRef.current.clear();
    enterTimersRef.current.clear();
    setAddresses([...savedAddressesProp]);
    setSelection(savedAddressesProp[0]?.id ?? DRAFT_VALUE);
    setBillingSelection(savedAddressesProp[0]?.id ?? DRAFT_VALUE);
    setDraftOption(null);
    const seeded =
      initialStep > 1 && savedAddressesProp[0]
        ? snapshotFromAddress(savedAddressesProp[0])
        : null;
    setDeliverySnapshot(seeded);
    setPaymentMethod(null);
    setSameAsDelivery(true);
    setStep(initialStep);
    setNewAddressOpen(initialNewAddressOpen);
    setDraft(EMPTY_DRAFT);
    setAttempted(false);
    setExitingIds(new Set());
    setEnteringIds(new Set());
  }, [open, savedAddressesProp, initialNewAddressOpen, initialStep]);

  useEffect(() => {
    return () => {
      for (const timerId of exitTimersRef.current.values()) {
        window.clearTimeout(timerId);
      }
      for (const timerId of enterTimersRef.current.values()) {
        window.clearTimeout(timerId);
      }
      exitTimersRef.current.clear();
      enterTimersRef.current.clear();
    };
  }, []);

  const selectedSaved = addresses.find((item) => item.id === selection);
  const selectedDraft =
    selection === DRAFT_VALUE && draftOption ? draftOption : null;
  const deliveryReady = Boolean(selectedSaved || selectedDraft);
  const billingSaved = addresses.find((item) => item.id === billingSelection);
  const billingDraft =
    billingSelection === DRAFT_VALUE && draftOption ? draftOption : null;
  const billingReady =
    sameAsDelivery
      ? Boolean(deliverySnapshot)
      : Boolean(billingSaved || billingDraft);
  const showEmptyPicker = addresses.length === 0 && !draftOption;
  const addressBookFull = addresses.length >= WINNER_ORDER_SAVED_ADDRESS_CAP;
  const canSaveForFuture = !addressBookFull;

  function captureSelectionSnapshot(
    saved: WinnerOrderSavedAddress | undefined,
    draft: WinnerOrderSavedAddress | null,
  ): AddressSnapshot | null {
    const address = saved ?? draft;
    return address ? snapshotFromAddress(address) : null;
  }

  function restorePickerFromSnapshot(snapshot: AddressSnapshot | null) {
    if (!snapshot) return;
    if (addresses.some((item) => item.id === snapshot.sourceId)) {
      setSelection(snapshot.sourceId);
      return;
    }
    setDraftOption({
      id: DRAFT_VALUE,
      label: snapshot.label,
      lines: snapshot.lines,
    });
    setSelection(DRAFT_VALUE);
  }

  function alignBillingSelectionToDelivery(snapshot: AddressSnapshot | null) {
    if (!snapshot) return;
    if (addresses.some((item) => item.id === snapshot.sourceId)) {
      setBillingSelection(snapshot.sourceId);
      return;
    }
    setBillingSelection(addresses[0]?.id ?? DRAFT_VALUE);
  }

  function deliveryPayload(): string | null {
    if (deliverySnapshot) return snapshotPayload(deliverySnapshot);
    if (selectedSaved) return confirmPayload(selectedSaved);
    if (selectedDraft) return confirmPayload(selectedDraft);
    return null;
  }

  function finishSetup() {
    const delivery = deliveryPayload();
    if (!delivery || !paymentMethod) return;

    if (sameAsDelivery) {
      onConfirm({
        delivery,
        paymentMethod,
        billing: delivery,
        sameAsDelivery,
      });
      onOpenChange(false);
      return;
    }

    const billing = captureSelectionSnapshot(billingSaved, billingDraft);
    if (!billing) return;
    onConfirm({
      delivery,
      paymentMethod,
      billing: snapshotPayload(billing),
      sameAsDelivery,
    });
    onOpenChange(false);
  }

  function goNext() {
    if (step === 1) {
      const snapshot = captureSelectionSnapshot(selectedSaved, selectedDraft);
      if (!snapshot) return;
      setDeliverySnapshot(snapshot);
      setStep(2);
      return;
    }
    if (step === 2) {
      if (!paymentMethod) return;
      alignBillingSelectionToDelivery(deliverySnapshot);
      setStep(3);
      return;
    }
    finishSetup();
  }

  function goBack() {
    if (step === 2) {
      restorePickerFromSnapshot(deliverySnapshot);
      setStep(1);
      return;
    }
    if (step === 3) setStep(2);
  }

  function patchDraft<K extends keyof NewAddressDraft>(
    key: K,
    value: NewAddressDraft[K],
  ) {
    setDraft((held) => ({ ...held, [key]: value }));
  }

  function commitRemove(id: string) {
    // Book remove only. Delivery/billing order snapshots stay until the winner
    // re-picks; picker selection is repaired for the live lists only.
    setAddresses((held) => {
      const next = held.filter((item) => item.id !== id);
      setSelection((current) => {
        if (current !== id) return current;
        if (draftOption) return DRAFT_VALUE;
        return next[0]?.id ?? "";
      });
      setBillingSelection((current) => {
        if (current !== id) return current;
        if (draftOption) return DRAFT_VALUE;
        return next[0]?.id ?? "";
      });
      return next;
    });
    setExitingIds((held) => {
      if (!held.has(id)) return held;
      const next = new Set(held);
      next.delete(id);
      return next;
    });
  }

  function removeAddress(id: string) {
    if (exitingIds.has(id)) return;

    if (prefersReducedMotion()) {
      commitRemove(id);
      return;
    }

    setExitingIds((held) => new Set(held).add(id));
    const timerId = window.setTimeout(() => {
      exitTimersRef.current.delete(id);
      commitRemove(id);
    }, ADDRESS_LIST_MOTION_MS);
    exitTimersRef.current.set(id, timerId);
  }

  function markEntering(id: string) {
    if (prefersReducedMotion()) return;
    setEnteringIds((held) => new Set(held).add(id));
    const timerId = window.setTimeout(() => {
      enterTimersRef.current.delete(id);
      setEnteringIds((held) => {
        if (!held.has(id)) return held;
        const next = new Set(held);
        next.delete(id);
        return next;
      });
    }, ADDRESS_LIST_MOTION_MS);
    enterTimersRef.current.set(id, timerId);
  }

  function openNewAddress() {
    setDraft({
      ...EMPTY_DRAFT,
      saveForFuture: addresses.length < WINNER_ORDER_SAVED_ADDRESS_CAP,
    });
    setAttempted(false);
    setNewAddressOpen(true);
  }

  function saveNewAddress() {
    setAttempted(true);
    if (!newAddressReady(draft)) return;

    const lines = formatAddressLines(draft);
    const label = addressLabelFromDraft(draft);
    const saveToBook =
      draft.saveForFuture && addresses.length < WINNER_ORDER_SAVED_ADDRESS_CAP;

    if (saveToBook) {
      const id = `saved-${Date.now()}`;
      const saved: WinnerOrderSavedAddress = { id, label, lines };
      setAddresses((held) => [saved, ...held]);
      if (step === 3 && !sameAsDelivery) {
        setBillingSelection(id);
      } else {
        setSelection(id);
      }
      setDraftOption(null);
      markEntering(id);
    } else {
      setDraftOption({ id: DRAFT_VALUE, label, lines });
      if (step === 3 && !sameAsDelivery) {
        setBillingSelection(DRAFT_VALUE);
      } else {
        setSelection(DRAFT_VALUE);
      }
      markEntering(DRAFT_VALUE);
    }

    setNewAddressOpen(false);
    setDraft(EMPTY_DRAFT);
    setAttempted(false);
  }

  function handleOuterOpenChange(next: boolean) {
    if (!next && newAddressOpen) return;
    if (
      !next &&
      open &&
      (step > 1 || paymentMethod != null || deliveryReady)
    ) {
      const leave = window.confirm(
        "Leave order setup? Your progress on this order will not be saved.",
      );
      if (!leave) return;
    }
    onOpenChange(next);
  }

  const primaryDisabled =
    (step === 1 && !deliveryReady) ||
    (step === 2 && paymentMethod == null) ||
    (step === 3 && !billingReady);

  const primaryLabel =
    step === 3 ? "Complete Order Setup" : "Continue";

  function addressPicker(opts: {
    ariaLabel: string;
    value: string;
    onValueChange: (value: string) => void;
  }) {
    if (showEmptyPicker) {
      return (
        <EmptyState
          actions={
            <Button
              onClick={openNewAddress}
              size="md"
              type="button"
              variant="secondary"
            >
              Add New Address
            </Button>
          }
          compact
          description="Add an address to continue."
          icon={<MapPin aria-hidden weight="regular" />}
          title="No saved addresses"
        />
      );
    }

    return (
      <VStack className="w-full" gap="md" hAlign="stretch">
        <RadioList
          aria-label={opts.ariaLabel}
          className="gap-3"
          onValueChange={opts.onValueChange}
          value={opts.value}
        >
          <div
            className="flex w-full flex-col gap-2"
            data-slot="address-option-cards"
          >
            {draftOption ? (
              <div
                className={cn(
                  enteringIds.has(DRAFT_VALUE)
                    ? "animate-in fade-in-0 slide-in-from-top-1 duration-200 ease-out motion-reduce:animate-none"
                    : undefined,
                )}
                key={draftOption.id}
              >
                <RadioCard
                  description={draftOption.lines}
                  title={draftOption.label}
                  value={DRAFT_VALUE}
                />
              </div>
            ) : null}

            {addresses.map((address) => {
              const exiting = exitingIds.has(address.id);
              const entering = enteringIds.has(address.id);
              return (
                <div
                  aria-hidden={exiting || undefined}
                  className={cn(
                    "transition-[opacity,transform] duration-200 motion-reduce:transition-none",
                    exiting
                      ? "pointer-events-none -translate-y-1 opacity-0 motion-reduce:translate-y-0"
                      : entering
                        ? "animate-in fade-in-0 slide-in-from-top-1 duration-200 ease-out motion-reduce:animate-none"
                        : "translate-y-0 opacity-100",
                  )}
                  key={address.id}
                  style={{
                    transitionTimingFunction: ADDRESS_LIST_EASE,
                  }}
                >
                  <RadioCard
                    action={
                      <IconButton
                        aria-label={`Remove ${address.label}`}
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          removeAddress(address.id);
                        }}
                        size="sm"
                        type="button"
                        variant="ghost"
                      >
                        <Trash aria-hidden />
                      </IconButton>
                    }
                    description={address.lines}
                    title={address.label}
                    value={address.id}
                  />
                </div>
              );
            })}
          </div>
        </RadioList>

        <Button
          className="w-full sm:w-auto"
          onClick={openNewAddress}
          size="md"
          type="button"
          variant="outline"
        >
          Add New Address
        </Button>
      </VStack>
    );
  }

  return (
    <>
      <Dialog onOpenChange={handleOuterOpenChange} open={open}>
        <DialogContent className="max-w-lg" showCloseButton={false}>
          <DialogHeader showCloseButton={false}>
            <DialogTitle>Complete Order Setup</DialogTitle>
            <DialogSubtext>
              {`Step ${step} of 3: ${stepLabel(step)}`}
            </DialogSubtext>
          </DialogHeader>
          <DialogBody>
            {step === 1 ? (
              <VStack className="w-full" gap="md" hAlign="stretch">
                <DialogDescription>
                  We’ll ship this lot to this address and use it to prepare your
                  invoice. Nothing is due until Grade10 sends the invoice.
                </DialogDescription>
                {addressPicker({
                  ariaLabel: "Delivery address",
                  value: selection,
                  onValueChange: setSelection,
                })}
              </VStack>
            ) : null}

            {step === 2 ? (
              <VStack className="w-full" gap="md" hAlign="stretch">
                <DialogDescription>
                  Choose how you’ll pay. Each option shows a fee range; the
                  exact amount is on the invoice.
                </DialogDescription>
                <RadioList
                  aria-label="Payment method"
                  className="gap-3"
                  onValueChange={(value) => {
                    if (value === "card" || value === "bank_transfer") {
                      setPaymentMethod(value);
                    }
                  }}
                  value={paymentMethod ?? ""}
                >
                  <div className="flex w-full flex-col gap-2">
                    <RadioCard
                      description={FEE_RANGE_CARD}
                      title="Card"
                      value="card"
                    />
                    {offerBankTransfer ? (
                      <RadioCard
                        description={FEE_RANGE_BANK}
                        title="Bank transfer"
                        value="bank_transfer"
                      />
                    ) : null}
                  </div>
                </RadioList>
              </VStack>
            ) : null}

            {step === 3 ? (
              <VStack className="w-full" gap="md" hAlign="stretch">
                <DialogDescription>
                  Billing address shown on your invoice.
                </DialogDescription>
                <CheckboxListInput
                  checked={sameAsDelivery}
                  onCheckedChange={(checked) => {
                    setSameAsDelivery(checked === true);
                    if (checked === true) {
                      alignBillingSelectionToDelivery(deliverySnapshot);
                    }
                  }}
                  size="sm"
                >
                  Use same details for billing address
                </CheckboxListInput>
                <div className="flex w-full flex-col" data-slot="billing-address-swap">
                  <div
                    className="grid w-full transition-[grid-template-rows] duration-200 motion-reduce:transition-none"
                    data-slot="billing-same-as-delivery"
                    style={{
                      gridTemplateRows:
                        sameAsDelivery && deliverySnapshot ? "1fr" : "0fr",
                      transitionTimingFunction: ADDRESS_LIST_EASE,
                    }}
                  >
                    <div
                      aria-hidden={
                        !(sameAsDelivery && deliverySnapshot) || undefined
                      }
                      className="min-h-0 overflow-hidden"
                      inert={
                        !(sameAsDelivery && deliverySnapshot) ? true : undefined
                      }
                    >
                      <div
                        className={cn(
                          "transition-[opacity,transform] duration-200 motion-reduce:transition-none",
                          sameAsDelivery && deliverySnapshot
                            ? "translate-y-0 opacity-100"
                            : "pointer-events-none -translate-y-1 opacity-0",
                        )}
                        style={{ transitionTimingFunction: ADDRESS_LIST_EASE }}
                      >
                        <div
                          aria-label="Billing address, same details as delivery"
                          className="flex w-full items-start rounded-xl border border-border bg-card px-3 pt-3 pb-4 text-foreground"
                          data-slot="address-summary"
                        >
                          <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5 text-sm">
                            <span className="text-sm leading-6 font-medium text-foreground">
                              {deliverySnapshot?.label}
                            </span>
                            <span className="whitespace-pre-line text-sm text-secondary-foreground">
                              {deliverySnapshot?.lines}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="grid w-full transition-[grid-template-rows] duration-200 motion-reduce:transition-none"
                    data-slot="billing-address-picker"
                    style={{
                      gridTemplateRows: sameAsDelivery ? "0fr" : "1fr",
                      transitionTimingFunction: ADDRESS_LIST_EASE,
                    }}
                  >
                    <div
                      aria-hidden={sameAsDelivery || undefined}
                      className="min-h-0 overflow-hidden"
                      inert={sameAsDelivery ? true : undefined}
                    >
                      <div
                        className={cn(
                          "transition-[opacity,transform] duration-200 motion-reduce:transition-none",
                          sameAsDelivery
                            ? "pointer-events-none -translate-y-1 opacity-0"
                            : "translate-y-0 opacity-100",
                        )}
                        style={{ transitionTimingFunction: ADDRESS_LIST_EASE }}
                      >
                        {addressPicker({
                          ariaLabel: "Billing address",
                          value: billingSelection,
                          onValueChange: setBillingSelection,
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </VStack>
            ) : null}
          </DialogBody>
          <DialogFooter>
            {step > 1 ? (
              <Button
                className="w-full sm:w-auto"
                onClick={goBack}
                size="md"
                type="button"
                variant="outline"
              >
                Back
              </Button>
            ) : (
              <DialogClose
                render={
                  <Button
                    className="w-full sm:w-auto"
                    size="md"
                    variant="outline"
                  />
                }
              >
                Cancel
              </DialogClose>
            )}
            <Button
              className="w-full sm:w-auto"
              disabled={primaryDisabled}
              onClick={goNext}
              size="md"
              type="button"
            >
              {primaryLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog onOpenChange={setNewAddressOpen} open={newAddressOpen}>
        <DialogContent className="z-[60] max-w-lg" showCloseButton={false}>
          <DialogHeader showCloseButton={false}>
            <DialogTitle>
              {step === 3 && !sameAsDelivery
                ? "Add Billing Address"
                : "Add Delivery Address"}
            </DialogTitle>
          </DialogHeader>
          <DialogBody>
            <VStack className="w-full" gap="sm" hAlign="stretch" id={formId}>
              <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
                <TextInput
                  autoComplete="given-name"
                  label="First name"
                  message={
                    attempted && !draft.firstName.trim()
                      ? "Enter a first name."
                      : undefined
                  }
                  onChange={(event) =>
                    patchDraft("firstName", event.currentTarget.value)
                  }
                  status={
                    attempted && !draft.firstName.trim() ? "error" : "default"
                  }
                  value={draft.firstName}
                />
                <TextInput
                  autoComplete="family-name"
                  label="Last name"
                  message={
                    attempted && !draft.lastName.trim()
                      ? "Enter a last name."
                      : undefined
                  }
                  onChange={(event) =>
                    patchDraft("lastName", event.currentTarget.value)
                  }
                  status={
                    attempted && !draft.lastName.trim() ? "error" : "default"
                  }
                  value={draft.lastName}
                />
              </div>

              <TextInput
                autoComplete="street-address"
                label="Street address"
                message={
                  attempted && !draft.street.trim()
                    ? "Enter a street address."
                    : undefined
                }
                onChange={(event) =>
                  patchDraft("street", event.currentTarget.value)
                }
                status={attempted && !draft.street.trim() ? "error" : "default"}
                value={draft.street}
              />

              <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
                <TextInput
                  autoComplete="address-level2"
                  label="City"
                  message={
                    attempted && !draft.city.trim()
                      ? "Enter a city."
                      : undefined
                  }
                  onChange={(event) =>
                    patchDraft("city", event.currentTarget.value)
                  }
                  status={attempted && !draft.city.trim() ? "error" : "default"}
                  value={draft.city}
                />
                <TextInput
                  autoComplete="address-level1"
                  label="State"
                  onChange={(event) =>
                    patchDraft("state", event.currentTarget.value)
                  }
                  placeholder="Optional"
                  value={draft.state}
                />
              </div>

              <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
                <TextInput
                  autoComplete="postal-code"
                  label="Postal code"
                  message={
                    attempted && !draft.postalCode.trim()
                      ? "Enter a postal code."
                      : undefined
                  }
                  onChange={(event) =>
                    patchDraft("postalCode", event.currentTarget.value)
                  }
                  status={
                    attempted && !draft.postalCode.trim() ? "error" : "default"
                  }
                  value={draft.postalCode}
                />
                <div className="flex w-full flex-col gap-2">
                  <label
                    className="text-sm font-medium text-secondary-foreground"
                    htmlFor={countryId}
                  >
                    Country
                  </label>
                  <Select
                    items={COUNTRY_SELECT_ITEMS}
                    onValueChange={(value) => {
                      if (typeof value === "string") {
                        patchDraft("country", value);
                      }
                    }}
                    value={draft.country}
                  >
                    <SelectTrigger
                      aria-invalid={
                        attempted && !draft.country.trim() ? true : undefined
                      }
                      className="w-full"
                      id={countryId}
                    >
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent alignItemWithTrigger={false}>
                      {COUNTRY_OPTIONS.map((country) => (
                        <SelectItem
                          key={country}
                          label={country}
                          value={country}
                        >
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {attempted && !draft.country.trim() ? (
                    <span className="text-xs text-secondary-foreground">
                      Choose a country.
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="mt-4 flex w-full items-start gap-1">
                <CheckboxListInput
                  checked={canSaveForFuture && draft.saveForFuture}
                  className="min-w-0 flex-1"
                  disabled={!canSaveForFuture}
                  onCheckedChange={(checked) => {
                    if (!canSaveForFuture) return;
                    patchDraft("saveForFuture", checked === true);
                  }}
                  size="sm"
                >
                  Save this address for future orders
                </CheckboxListInput>
                {!canSaveForFuture ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger
                        aria-label={SAVE_FOR_FUTURE_REFUSED_TOOLTIP}
                        className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center text-secondary-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                        onClick={(event) => event.preventDefault()}
                        onPointerDown={(event) => event.preventDefault()}
                        render={<button type="button" />}
                      >
                        <Info aria-hidden size={12} />
                      </TooltipTrigger>
                      <TooltipContent>
                        {SAVE_FOR_FUTURE_REFUSED_TOOLTIP}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : null}
              </div>
            </VStack>
          </DialogBody>
          <DialogFooter>
            <Button
              className="w-full sm:w-auto"
              onClick={() => setNewAddressOpen(false)}
              size="md"
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              className="w-full sm:w-auto"
              onClick={saveNewAddress}
              size="md"
              type="button"
            >
              Use This Address
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export type { WinnerOrderSetupDialogProps, WinnerOrderSetupPaymentMethod };
export { WinnerOrderSetupDialog };

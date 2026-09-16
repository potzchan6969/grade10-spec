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
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@grade10/design-system/components/overlays/dialog";
import { cn } from "@grade10/design-system/lib/utils";
import { MapPin, Trash } from "@phosphor-icons/react";
import { useEffect, useId, useRef, useState } from "react";

export type WinnerOrderSavedAddress = {
  id: string;
  /** Recipient name — RadioCard title. */
  label: string;
  /** Street + locality + country — no name; one street line. */
  lines: string;
};

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

type WinnerOrderAddressDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  savedAddresses?: readonly WinnerOrderSavedAddress[];
  /** Called with name + address lines the winner affirmed. */
  onConfirm: (addressLines: string) => void;
  /** Open the nested add-address form when the picker opens (Storybook). */
  initialNewAddressOpen?: boolean;
};

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
 * Preview-only: pick a saved account address (or a draft just entered), or open
 * a nested form to add one, then confirm for the Winner Order. Not a published
 * `@grade10/ui` export.
 */
function WinnerOrderAddressDialog({
  open,
  onOpenChange,
  savedAddresses: savedAddressesProp = WINNER_ORDER_SAVED_ADDRESSES,
  onConfirm,
  initialNewAddressOpen = false,
}: WinnerOrderAddressDialogProps) {
  const formId = useId();
  const countryId = useId();
  const [addresses, setAddresses] = useState<WinnerOrderSavedAddress[]>(() => [
    ...savedAddressesProp,
  ]);
  const [selection, setSelection] = useState(
    savedAddressesProp[0]?.id ?? DRAFT_VALUE,
  );
  const [draftOption, setDraftOption] =
    useState<WinnerOrderSavedAddress | null>(null);
  const [newAddressOpen, setNewAddressOpen] = useState(initialNewAddressOpen);
  const [draft, setDraft] = useState<NewAddressDraft>(EMPTY_DRAFT);
  const [attempted, setAttempted] = useState(false);
  const [exitingIds, setExitingIds] = useState(() => new Set<string>());
  const [enteringIds, setEnteringIds] = useState(() => new Set<string>());
  const exitTimersRef = useRef<Map<string, number>>(new Map());
  const enterTimersRef = useRef<Map<string, number>>(new Map());

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
    setDraftOption(null);
    setNewAddressOpen(initialNewAddressOpen);
    setDraft(EMPTY_DRAFT);
    setAttempted(false);
    setExitingIds(new Set());
    setEnteringIds(new Set());
  }, [open, savedAddressesProp, initialNewAddressOpen]);

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
  const canConfirm = Boolean(selectedSaved || selectedDraft);
  const showEmptyPicker = addresses.length === 0 && !draftOption;

  function confirm() {
    if (selectedSaved) {
      onConfirm(confirmPayload(selectedSaved));
      onOpenChange(false);
      return;
    }
    if (selectedDraft) {
      onConfirm(confirmPayload(selectedDraft));
      onOpenChange(false);
    }
  }

  function patchDraft<K extends keyof NewAddressDraft>(
    key: K,
    value: NewAddressDraft[K],
  ) {
    setDraft((held) => ({ ...held, [key]: value }));
  }

  function commitRemove(id: string) {
    setAddresses((held) => {
      const next = held.filter((item) => item.id !== id);
      setSelection((current) => {
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
    setDraft(EMPTY_DRAFT);
    setAttempted(false);
    setNewAddressOpen(true);
  }

  function saveNewAddress() {
    setAttempted(true);
    if (!newAddressReady(draft)) return;

    const lines = formatAddressLines(draft);
    const label = addressLabelFromDraft(draft);

    if (draft.saveForFuture) {
      const id = `saved-${Date.now()}`;
      const saved: WinnerOrderSavedAddress = { id, label, lines };
      setAddresses((held) => [...held, saved]);
      setSelection(id);
      setDraftOption(null);
      markEntering(id);
    } else {
      setDraftOption({ id: DRAFT_VALUE, label, lines });
      setSelection(DRAFT_VALUE);
      markEntering(DRAFT_VALUE);
    }

    setNewAddressOpen(false);
    setDraft(EMPTY_DRAFT);
    setAttempted(false);
  }

  function handleOuterOpenChange(next: boolean) {
    if (!next && newAddressOpen) return;
    onOpenChange(next);
  }

  return (
    <>
      <Dialog onOpenChange={handleOuterOpenChange} open={open}>
        <DialogContent className="max-w-lg" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Confirm Delivery Address</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <DialogDescription>
              We ship this lot here and use the address to calculate the
              shipping fee on your invoice. Nothing is due until Grade10 sends
              the invoice.
            </DialogDescription>

            {showEmptyPicker ? (
              <EmptyState
                actions={
                  <Button
                    onClick={openNewAddress}
                    size="md"
                    type="button"
                    variant="secondary"
                  >
                    Add new address
                  </Button>
                }
                compact
                description="Add a delivery address to continue."
                icon={<MapPin aria-hidden weight="regular" />}
                title="No saved addresses"
              />
            ) : (
              <>
                <RadioList
                  aria-label="Delivery address"
                  className="gap-3"
                  onValueChange={setSelection}
                  value={selection}
                >
                  <div
                    className="flex w-full flex-col gap-2"
                    data-slot="address-option-cards"
                  >
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
                  </div>
                </RadioList>

                <Button
                  className="w-full sm:w-auto"
                  onClick={openNewAddress}
                  size="md"
                  type="button"
                  variant="outline"
                >
                  Add new address
                </Button>
              </>
            )}
          </DialogBody>
          <DialogFooter>
            <DialogClose render={<Button size="md" variant="outline" />}>
              Cancel
            </DialogClose>
            <Button disabled={!canConfirm} onClick={confirm} size="md">
              Confirm address
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog onOpenChange={setNewAddressOpen} open={newAddressOpen}>
        <DialogContent className="z-[60] max-w-lg" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Add Delivery Address</DialogTitle>
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
                {/* Label + message match InputShell; control is design-system Select. */}
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
                    {/*
                      Menu-style popup (not align-with-trigger): typeahead /
                      data-highlighted work like DropdownMenu in the nested dialog.
                    */}
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

              <CheckboxListInput
                checked={draft.saveForFuture}
                className="mt-4"
                onCheckedChange={(checked) =>
                  patchDraft("saveForFuture", checked === true)
                }
                size="sm"
              >
                Save this address for future orders
              </CheckboxListInput>
            </VStack>
          </DialogBody>
          <DialogFooter>
            <HStack className="w-full justify-end gap-2">
              <Button
                onClick={() => setNewAddressOpen(false)}
                size="md"
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
              <Button onClick={saveNewAddress} size="md" type="button">
                Use this address
              </Button>
            </HStack>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export type { WinnerOrderAddressDialogProps };
export { WinnerOrderAddressDialog };

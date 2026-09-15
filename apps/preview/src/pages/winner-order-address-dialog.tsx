import { Text } from "@grade10/design-system/components/display/text";
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
import { Trash } from "@phosphor-icons/react";
import { useEffect, useId, useState } from "react";

export type WinnerOrderSavedAddress = {
  id: string;
  label: string;
  lines: string;
};

export const WINNER_ORDER_SAVED_ADDRESSES: readonly WinnerOrderSavedAddress[] =
  [
    {
      id: "wan-chai",
      label: "Wan Chai home",
      lines:
        "Alex Chan\n12/F, Tower 1, Harbour Road\nWan Chai, Hong Kong\nHong Kong",
    },
    {
      id: "tst",
      label: "Tsim Sha Tsui",
      lines:
        "Alex Chan\nFlat 8B, Harbour View, Canton Road\nTsim Sha Tsui, Hong Kong\nHong Kong",
    },
  ] as const;

const COUNTRY_OPTIONS = [
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
] as const;

const COUNTRY_ITEMS: Record<string, string> = Object.fromEntries(
  COUNTRY_OPTIONS.map((country) => [country, country]),
);

const DRAFT_VALUE = "use_this_address";

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
  /** Called with the multi-line address the winner affirmed. */
  onConfirm: (addressLines: string) => void;
  /** Open the nested add-address form when the picker opens (Storybook). */
  initialNewAddressOpen?: boolean;
};

function formatNewAddress(draft: NewAddressDraft): string {
  const name = [draft.firstName.trim(), draft.lastName.trim()]
    .filter(Boolean)
    .join(" ");
  const locality = [
    draft.city.trim(),
    draft.state.trim(),
    draft.postalCode.trim(),
  ]
    .filter(Boolean)
    .join(", ");
  return [name, draft.street.trim(), locality, draft.country.trim()]
    .filter(Boolean)
    .join("\n");
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

function addressLabelFromDraft(draft: NewAddressDraft): string {
  const name = [draft.firstName.trim(), draft.lastName.trim()]
    .filter(Boolean)
    .join(" ");
  if (name) return name;
  return "New address";
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

  useEffect(() => {
    if (!open) return;
    setAddresses([...savedAddressesProp]);
    setSelection(savedAddressesProp[0]?.id ?? DRAFT_VALUE);
    setDraftOption(null);
    setNewAddressOpen(initialNewAddressOpen);
    setDraft(EMPTY_DRAFT);
    setAttempted(false);
  }, [open, savedAddressesProp, initialNewAddressOpen]);

  const selectedSaved = addresses.find((item) => item.id === selection);
  const selectedDraft =
    selection === DRAFT_VALUE && draftOption ? draftOption : null;
  const canConfirm = Boolean(selectedSaved || selectedDraft);

  function confirm() {
    if (selectedSaved) {
      onConfirm(selectedSaved.lines);
      onOpenChange(false);
      return;
    }
    if (selectedDraft) {
      onConfirm(selectedDraft.lines);
      onOpenChange(false);
    }
  }

  function patchDraft<K extends keyof NewAddressDraft>(
    key: K,
    value: NewAddressDraft[K],
  ) {
    setDraft((held) => ({ ...held, [key]: value }));
  }

  function removeAddress(id: string) {
    setAddresses((held) => {
      const next = held.filter((item) => item.id !== id);
      setSelection((current) => {
        if (current !== id) return current;
        if (draftOption) return DRAFT_VALUE;
        return next[0]?.id ?? "";
      });
      return next;
    });
  }

  function openNewAddress() {
    setDraft(EMPTY_DRAFT);
    setAttempted(false);
    setNewAddressOpen(true);
  }

  function saveNewAddress() {
    setAttempted(true);
    if (!newAddressReady(draft)) return;

    const lines = formatNewAddress(draft);
    const label = addressLabelFromDraft(draft);

    if (draft.saveForFuture) {
      const id = `saved-${Date.now()}`;
      const saved: WinnerOrderSavedAddress = { id, label, lines };
      setAddresses((held) => [...held, saved]);
      setSelection(id);
      setDraftOption(null);
    } else {
      setDraftOption({ id: DRAFT_VALUE, label: "Use this address", lines });
      setSelection(DRAFT_VALUE);
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
            <DialogTitle>Confirm delivery address</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <DialogDescription>
              We ship this lot here and use the address to calculate the
              shipping fee on your invoice. Nothing is due until Grade10 sends
              the invoice.
            </DialogDescription>

            {addresses.length > 0 || draftOption ? (
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
                  {addresses.map((address) => (
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
                      key={address.id}
                      title={address.label}
                      value={address.id}
                    />
                  ))}

                  {draftOption ? (
                    <RadioCard
                      description={draftOption.lines}
                      title={draftOption.label}
                      value={DRAFT_VALUE}
                    />
                  ) : null}
                </div>
              </RadioList>
            ) : (
              <Text size="sm" tone="secondary">
                No saved addresses yet. Add a delivery address to continue.
              </Text>
            )}

            <Button
              className="w-full sm:w-auto"
              onClick={openNewAddress}
              size="md"
              type="button"
              variant="outline"
            >
              Add new address
            </Button>
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
            <DialogTitle>Add delivery address</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <DialogDescription>
              Enter the shipping address for this lot. Grade10 uses it to quote
              the shipping fee on the invoice.
            </DialogDescription>

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
                    items={COUNTRY_ITEMS}
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
                    <SelectContent>
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

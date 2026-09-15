import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { RadioList } from "@grade10/design-system/components/forms/radio-list";
import { RadioListItem } from "@grade10/design-system/components/forms/radio-list-item";
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
  DialogTitle,
} from "@grade10/design-system/components/overlays/dialog";
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
      lines: "12/F, Tower 1\nHarbour Road\nWan Chai, Hong Kong",
    },
    {
      id: "tst",
      label: "Tsim Sha Tsui",
      lines: "Flat 8B, Harbour View\nCanton Road\nTsim Sha Tsui, Hong Kong",
    },
  ] as const;

const ADD_NEW_VALUE = "add_new";

type NewAddressDraft = {
  fullName: string;
  line1: string;
  line2: string;
  city: string;
  region: string;
  country: string;
};

const EMPTY_DRAFT: NewAddressDraft = {
  fullName: "",
  line1: "",
  line2: "",
  city: "",
  region: "",
  country: "Hong Kong",
};

type WinnerOrderAddressDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  savedAddresses?: readonly WinnerOrderSavedAddress[];
  /** Called with the multi-line address the winner affirmed. */
  onConfirm: (addressLines: string) => void;
};

function formatNewAddress(draft: NewAddressDraft): string {
  const lines = [
    draft.fullName.trim(),
    draft.line1.trim(),
    draft.line2.trim(),
    [draft.city.trim(), draft.region.trim()].filter(Boolean).join(", "),
    draft.country.trim(),
  ].filter(Boolean);
  return lines.join("\n");
}

function newAddressReady(draft: NewAddressDraft): boolean {
  return Boolean(
    draft.fullName.trim() &&
      draft.line1.trim() &&
      draft.city.trim() &&
      draft.country.trim(),
  );
}

/**
 * Preview-only: pick a saved account address or add one, then confirm for the
 * Winner Order. Not a published `@grade10/ui` export.
 */
function WinnerOrderAddressDialog({
  open,
  onOpenChange,
  savedAddresses = WINNER_ORDER_SAVED_ADDRESSES,
  onConfirm,
}: WinnerOrderAddressDialogProps) {
  const formId = useId();
  const defaultSaved = savedAddresses[0]?.id ?? ADD_NEW_VALUE;
  const [selection, setSelection] = useState(defaultSaved);
  const [draft, setDraft] = useState<NewAddressDraft>(EMPTY_DRAFT);
  const [attempted, setAttempted] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSelection(savedAddresses[0]?.id ?? ADD_NEW_VALUE);
    setDraft(EMPTY_DRAFT);
    setAttempted(false);
  }, [open, savedAddresses]);

  const addingNew = selection === ADD_NEW_VALUE;
  const selectedSaved = savedAddresses.find((item) => item.id === selection);
  const canConfirm = addingNew
    ? newAddressReady(draft)
    : Boolean(selectedSaved);

  function confirm() {
    if (addingNew) {
      setAttempted(true);
      if (!newAddressReady(draft)) return;
      onConfirm(formatNewAddress(draft));
    } else if (selectedSaved) {
      onConfirm(selectedSaved.lines);
    }
    onOpenChange(false);
  }

  function patchDraft<K extends keyof NewAddressDraft>(
    key: K,
    value: NewAddressDraft[K],
  ) {
    setDraft((held) => ({ ...held, [key]: value }));
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-lg" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Confirm Delivery Address</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <DialogDescription>
            Choose a saved address or add one. Grade10 prepares the invoice for
            this destination next — nothing is due yet.
          </DialogDescription>

          <RadioList
            aria-label="Delivery address"
            onValueChange={setSelection}
            value={selection}
          >
            {savedAddresses.map((address) => (
              <RadioListItem key={address.id} value={address.id}>
                <VStack className="min-w-0 flex-1" gap="xs" hAlign="start">
                  <Text size="sm" weight="medium">
                    {address.label}
                  </Text>
                  <Text
                    className="whitespace-pre-line text-secondary-foreground"
                    size="xs"
                  >
                    {address.lines}
                  </Text>
                </VStack>
              </RadioListItem>
            ))}
            <RadioListItem value={ADD_NEW_VALUE}>
              <Text size="sm" weight="medium">
                Add a new address
              </Text>
            </RadioListItem>
          </RadioList>

          {addingNew ? (
            <VStack className="w-full" gap="sm" hAlign="stretch" id={formId}>
              <TextInput
                autoComplete="name"
                label="Full name"
                message={
                  attempted && !draft.fullName.trim()
                    ? "Enter a full name."
                    : undefined
                }
                onChange={(event) =>
                  patchDraft("fullName", event.currentTarget.value)
                }
                status={
                  attempted && !draft.fullName.trim() ? "error" : "default"
                }
                value={draft.fullName}
              />
              <TextInput
                autoComplete="address-line1"
                label="Address line 1"
                message={
                  attempted && !draft.line1.trim()
                    ? "Enter an address."
                    : undefined
                }
                onChange={(event) =>
                  patchDraft("line1", event.currentTarget.value)
                }
                status={attempted && !draft.line1.trim() ? "error" : "default"}
                value={draft.line1}
              />
              <TextInput
                autoComplete="address-line2"
                label="Address line 2"
                message="Optional"
                onChange={(event) =>
                  patchDraft("line2", event.currentTarget.value)
                }
                value={draft.line2}
              />
              <TextInput
                autoComplete="address-level2"
                label="City"
                message={
                  attempted && !draft.city.trim() ? "Enter a city." : undefined
                }
                onChange={(event) =>
                  patchDraft("city", event.currentTarget.value)
                }
                status={attempted && !draft.city.trim() ? "error" : "default"}
                value={draft.city}
              />
              <TextInput
                autoComplete="address-level1"
                label="Region / district"
                message="Optional"
                onChange={(event) =>
                  patchDraft("region", event.currentTarget.value)
                }
                value={draft.region}
              />
              <TextInput
                autoComplete="country-name"
                label="Country"
                message={
                  attempted && !draft.country.trim()
                    ? "Enter a country."
                    : undefined
                }
                onChange={(event) =>
                  patchDraft("country", event.currentTarget.value)
                }
                status={
                  attempted && !draft.country.trim() ? "error" : "default"
                }
                value={draft.country}
              />
            </VStack>
          ) : null}
        </DialogBody>
        <DialogFooter>
          <DialogClose render={<Button size="md" variant="outline" />}>
            Cancel
          </DialogClose>
          <Button
            disabled={!canConfirm && !addingNew}
            onClick={confirm}
            size="md"
          >
            Confirm address
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export type { WinnerOrderAddressDialogProps };
export { WinnerOrderAddressDialog };

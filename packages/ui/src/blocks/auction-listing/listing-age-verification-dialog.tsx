import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { selectTriggerVariants } from "@grade10/design-system/components/forms/select";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@grade10/design-system/components/overlays/dropdown-menu";
import { cn } from "@grade10/design-system/lib/utils";
import { CaretDown } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import {
  isListingAgeVerificationAdult,
  isListingAgeVerificationComplete,
  LISTING_AGE_VERIFICATION_MONTHS,
  listingAgeVerificationYearOptions,
  type ListingAgeVerificationDob,
} from "./listing-age-verification-form";

type ListingAgeVerificationDialogCopy = {
  title: string;
  body: string;
  monthPlaceholder: string;
  dayPlaceholder: string;
  yearPlaceholder: string;
  birthMonthLabel: string;
  birthDayLabel: string;
  birthYearLabel: string;
  underAgeError: string;
  cancel: string;
  confirm: string;
};

type ListingAgeVerificationFieldsCopy = Pick<
  ListingAgeVerificationDialogCopy,
  | "body"
  | "monthPlaceholder"
  | "dayPlaceholder"
  | "yearPlaceholder"
  | "birthMonthLabel"
  | "birthDayLabel"
  | "birthYearLabel"
  | "underAgeError"
>;

type ListingAgeVerificationFieldsProps = {
  copy: ListingAgeVerificationFieldsCopy;
  value?: ListingAgeVerificationDob;
  onValueChange?: (value: ListingAgeVerificationDob) => void;
  error?: string;
};

type ListingAgeVerificationDialogProps = {
  copy: ListingAgeVerificationDialogCopy;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

type DobComboboxProps = {
  "aria-label": string;
  placeholder: string;
  value?: string;
  onValueChange: (value: string) => void;
  options: readonly string[];
  invalid?: boolean;
};

function DobCombobox({
  "aria-label": ariaLabel,
  placeholder,
  value,
  onValueChange,
  options,
  invalid = false,
}: DobComboboxProps) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        aria-invalid={invalid || undefined}
        aria-label={ariaLabel}
        className={cn(selectTriggerVariants(), "flex-1")}
      >
        <span
          className={cn(
            "min-w-0 flex-1 truncate text-left",
            !value && "text-muted-foreground",
          )}
        >
          {value ?? placeholder}
        </span>
        <CaretDown aria-hidden size={16} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-(--anchor-width) min-w-(--anchor-width)"
        collisionAvoidance={{ side: "none" }}
      >
        <DropdownMenuRadioGroup
          value={value ?? ""}
          onValueChange={(nextValue) => {
            if (nextValue) onValueChange(nextValue);
          }}
        >
          {options.map((option) => (
            <DropdownMenuRadioItem key={option} value={option}>
              {option}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ListingAgeVerificationFields({
  copy,
  value: valueProp,
  onValueChange,
  error,
}: ListingAgeVerificationFieldsProps) {
  const [internalValue, setInternalValue] = useState<ListingAgeVerificationDob>(
    {},
  );
  const value = valueProp ?? internalValue;
  const setValue = onValueChange ?? setInternalValue;

  const days = Array.from({ length: 31 }, (_, index) => String(index + 1));
  const years = listingAgeVerificationYearOptions();
  const showError = Boolean(error);

  return (
    <VStack gap="md">
      <DialogDescription>{copy.body}</DialogDescription>
      <HStack className="w-full" gap="sm">
        <DobCombobox
          aria-label={copy.birthMonthLabel}
          invalid={showError}
          onValueChange={(month) => setValue({ ...value, month })}
          options={LISTING_AGE_VERIFICATION_MONTHS}
          placeholder={copy.monthPlaceholder}
          value={value.month}
        />
        <DobCombobox
          aria-label={copy.birthDayLabel}
          invalid={showError}
          onValueChange={(day) => setValue({ ...value, day })}
          options={days}
          placeholder={copy.dayPlaceholder}
          value={value.day}
        />
        <DobCombobox
          aria-label={copy.birthYearLabel}
          invalid={showError}
          onValueChange={(year) => setValue({ ...value, year })}
          options={years}
          placeholder={copy.yearPlaceholder}
          value={value.year}
        />
      </HStack>
      {error ? (
        <Text role="alert" size="sm" tone="error">
          {error}
        </Text>
      ) : null}
    </VStack>
  );
}

function ListingAgeVerificationDialog({
  copy,
  open,
  onOpenChange,
  onConfirm,
}: ListingAgeVerificationDialogProps) {
  const [dob, setDob] = useState<ListingAgeVerificationDob>({});
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (!open) {
      setDob({});
      setError(undefined);
    }
  }, [open]);

  const complete = isListingAgeVerificationComplete(dob);

  function handleConfirm() {
    if (!complete) return;

    if (!isListingAgeVerificationAdult(dob)) {
      setError(copy.underAgeError);
      return;
    }

    onConfirm();
    onOpenChange(false);
  }

  function handleValueChange(nextValue: ListingAgeVerificationDob) {
    setDob(nextValue);
    if (error) setError(undefined);
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent showCloseButton>
        <DialogHeader showCloseButton={false}>
          <DialogTitle>{copy.title}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <ListingAgeVerificationFields
            copy={copy}
            error={error}
            onValueChange={handleValueChange}
            value={dob}
          />
        </DialogBody>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} size="md" variant="outline">
            {copy.cancel}
          </Button>
          <Button disabled={!complete} onClick={handleConfirm} size="md">
            {copy.confirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export type {
  ListingAgeVerificationDialogCopy,
  ListingAgeVerificationDialogProps,
  ListingAgeVerificationFieldsCopy,
  ListingAgeVerificationFieldsProps,
};
export { ListingAgeVerificationDialog, ListingAgeVerificationFields };

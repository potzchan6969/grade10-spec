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
import { useState } from "react";

type ListingAgeVerificationDialogCopy = {
  title: string;
  body: string;
  monthPlaceholder: string;
  dayPlaceholder: string;
  yearPlaceholder: string;
  birthMonthLabel: string;
  birthDayLabel: string;
  birthYearLabel: string;
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
>;

type ListingAgeVerificationFieldsProps = {
  copy: ListingAgeVerificationFieldsCopy;
};

type ListingAgeVerificationDialogProps = {
  copy: ListingAgeVerificationDialogCopy;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

type DobComboboxProps = {
  "aria-label": string;
  placeholder: string;
  value?: string;
  onValueChange: (value: string) => void;
  options: readonly string[];
};

function DobCombobox({
  "aria-label": ariaLabel,
  placeholder,
  value,
  onValueChange,
  options,
}: DobComboboxProps) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
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
}: ListingAgeVerificationFieldsProps) {
  const [month, setMonth] = useState<string | undefined>();
  const [day, setDay] = useState<string | undefined>();
  const [year, setYear] = useState<string | undefined>();

  const days = Array.from({ length: 31 }, (_, i) => String(i + 1));
  const years = Array.from({ length: 80 }, (_, i) =>
    String(new Date().getFullYear() - 18 - i),
  );

  return (
    <VStack gap="md">
      <DialogDescription>{copy.body}</DialogDescription>
      <HStack className="w-full" gap="sm">
        <DobCombobox
          aria-label={copy.birthMonthLabel}
          onValueChange={setMonth}
          options={MONTHS}
          placeholder={copy.monthPlaceholder}
          value={month}
        />
        <DobCombobox
          aria-label={copy.birthDayLabel}
          onValueChange={setDay}
          options={days}
          placeholder={copy.dayPlaceholder}
          value={day}
        />
        <DobCombobox
          aria-label={copy.birthYearLabel}
          onValueChange={setYear}
          options={years}
          placeholder={copy.yearPlaceholder}
          value={year}
        />
      </HStack>
    </VStack>
  );
}

function ListingAgeVerificationDialog({
  copy,
  open,
  onOpenChange,
  onConfirm,
}: ListingAgeVerificationDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent showCloseButton>
        <DialogHeader showCloseButton={false}>
          <DialogTitle>{copy.title}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <ListingAgeVerificationFields copy={copy} />
        </DialogBody>
        <DialogFooter>
          <Button
            onClick={() => onOpenChange(false)}
            size="md"
            variant="outline"
          >
            {copy.cancel}
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            size="md"
          >
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

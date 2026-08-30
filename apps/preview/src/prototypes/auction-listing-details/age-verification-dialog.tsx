import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@grade10/design-system/components/forms/select";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@grade10/design-system/components/overlays/dialog";

type AgeVerificationDialogProps = {
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

function AgeVerificationDialog({
  open,
  onOpenChange,
  onConfirm,
}: AgeVerificationDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent showCloseButton>
        <DialogHeader showCloseButton={false}>
          <DialogTitle>Verify your age</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <VStack gap="md">
            <Text as="p">
              You must be 18 or older to bid. Enter your date of birth to
              continue.
            </Text>
            <HStack className="w-full" gap="sm">
              <Select defaultValue="1">
                <SelectTrigger className="flex-1" size="default">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((month, index) => (
                    <SelectItem key={month} value={String(index + 1)}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select defaultValue="15">
                <SelectTrigger className="flex-1" size="default">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 31 }, (_, i) => (
                    <SelectItem key={i + 1} value={String(i + 1)}>
                      {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select defaultValue="1990">
                <SelectTrigger className="flex-1" size="default">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 80 }, (_, i) => {
                    const year = new Date().getFullYear() - 18 - i;
                    return (
                      <SelectItem key={year} value={String(year)}>
                        {year}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </HStack>
          </VStack>
        </DialogBody>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Cancel
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { AgeVerificationDialog };

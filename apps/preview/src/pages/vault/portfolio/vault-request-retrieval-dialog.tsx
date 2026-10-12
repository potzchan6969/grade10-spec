import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
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
import { MapPin, SealCheck, Vault } from "@phosphor-icons/react";
import { SHOP_ADDRESS, SHOP_NAME, type VaultAsset } from "../../vault-content";

type VaultRequestRetrievalDialogProps = {
  asset: VaultAsset;
  onOpenChange: (open: boolean) => void;
  onSubmit?: () => void;
  open: boolean;
};

const NEXT_STEPS = [
  {
    title: "We review your request",
    description: "Your item shows Retrieval Pending until it’s approved.",
  },
  {
    title: "We confirm your pickup window",
    description: "Once the item is released from storage.",
  },
  {
    title: "Collect it in store",
    description: "Bring ID that matches your account.",
  },
] as const;

function VaultRequestRetrievalDialog({
  asset,
  onOpenChange,
  onSubmit,
  open,
}: VaultRequestRetrievalDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Request Retrieval</DialogTitle>
          <DialogSubtext>
            We’ll release this item from storage for pickup in store.
          </DialogSubtext>
        </DialogHeader>
        <DialogBody className="gap-6" tabIndex={0}>
          {/* The visible hint lives in the header; this wires aria-describedby. */}
          <DialogDescription className="sr-only">
            We’ll release this item from storage for pickup in store.
          </DialogDescription>
          <div className="flex shrink-0 items-center gap-4 overflow-clip rounded-(--radius-2xl) border border-border bg-background-subtle p-3">
            <img
              alt=""
              className="size-16 shrink-0 rounded-(--radius-xl) bg-background object-contain"
              src={asset.imageSrc}
            />
            <VStack className="min-w-0" gap="xs" hAlign="start">
              <Text className="line-clamp-2" weight="medium">
                {asset.name}
              </Text>
              {/* Recap only fields the detail page shows: grade, then the
                  vault storage ID, each led by its icon on one row. */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-secondary-foreground">
                <span className="flex min-w-0 items-center gap-1">
                  {asset.condition === "Graded" && asset.cert ? (
                    <SealCheck aria-hidden size={16} weight="regular" />
                  ) : null}
                  <Text
                    as="span"
                    className="truncate text-secondary-foreground"
                    size="sm"
                  >
                    {asset.condition === "Graded" && asset.cert
                      ? asset.grade
                      : (asset.conditionDescription ?? asset.condition)}
                  </Text>
                </span>
                {asset.vaultId ? (
                  <span className="flex shrink-0 items-center gap-1">
                    <Vault aria-hidden size={16} weight="regular" />
                    <Text
                      as="span"
                      className="text-secondary-foreground tabular-nums"
                      size="sm"
                    >
                      {asset.vaultId}
                    </Text>
                  </span>
                ) : null}
              </div>
            </VStack>
          </div>

          <section
            aria-labelledby="retrieval-pickup-location"
            className="shrink-0"
          >
            <Text
              as="h3"
              className="mb-3"
              id="retrieval-pickup-location"
              size="sm"
              weight="medium"
            >
              Pickup location
            </Text>
            <div className="flex items-center gap-4">
              <span
                aria-hidden
                className="flex size-10 shrink-0 items-center justify-center rounded-(--radius-full) bg-muted text-foreground"
              >
                <MapPin size={20} weight="regular" />
              </span>
              <VStack className="min-w-0" gap="xs" hAlign="start">
                <Text as="span" weight="medium">
                  {SHOP_NAME}
                </Text>
                <Text
                  as="span"
                  className="text-pretty text-secondary-foreground"
                  size="sm"
                >
                  {SHOP_ADDRESS}
                </Text>
              </VStack>
            </div>
          </section>

          <section aria-labelledby="retrieval-next-steps" className="shrink-0">
            <Text
              as="h3"
              className="mb-3"
              id="retrieval-next-steps"
              size="sm"
              weight="medium"
            >
              What happens next
            </Text>
            <ol className="flex flex-col gap-4">
              {NEXT_STEPS.map((step, index) => (
                <li className="flex items-start gap-3" key={step.title}>
                  <span
                    aria-hidden
                    className="flex size-6 shrink-0 items-center justify-center rounded-(--radius-full) bg-muted text-xs font-medium"
                  >
                    {index + 1}
                  </span>
                  <VStack className="min-w-0" gap="none" hAlign="start">
                    <Text as="span" size="sm" weight="medium">
                      {step.title}
                    </Text>
                    <Text
                      as="span"
                      className="text-pretty text-secondary-foreground"
                      size="sm"
                    >
                      {step.description}
                    </Text>
                  </VStack>
                </li>
              ))}
            </ol>
          </section>
        </DialogBody>
        <DialogFooter>
          <DialogClose
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
          </DialogClose>
          <DialogClose
            render={
              <Button
                className="w-full sm:w-auto"
                size="md"
                type="button"
                onClick={onSubmit}
              />
            }
          >
            Submit Request
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export type { VaultRequestRetrievalDialogProps };
export { VaultRequestRetrievalDialog };

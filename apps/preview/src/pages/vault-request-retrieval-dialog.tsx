import { Badge } from "@grade10/design-system/components/display/badge";
import {
  Card,
  CardContent,
} from "@grade10/design-system/components/display/card";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogSubtext,
  DialogTitle,
} from "@grade10/design-system/components/overlays/dialog";
import { MapPin } from "@phosphor-icons/react";
import {
  assetSubtitle,
  SHOP_ADDRESS,
  SHOP_NAME,
  statusBadgeVariant,
  type VaultAsset,
} from "./vault-content";

type VaultRequestRetrievalDialogProps = {
  asset: VaultAsset;
  onOpenChange: (open: boolean) => void;
  onSubmit?: () => void;
  open: boolean;
};

function VaultRequestRetrievalDialog({
  asset,
  onOpenChange,
  onSubmit,
  open,
}: VaultRequestRetrievalDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Request Retrieval</DialogTitle>
          <DialogSubtext>
            Review the item and pickup details before sending your request.
          </DialogSubtext>
        </DialogHeader>
        <DialogBody className="gap-5">
          <Card className="gap-0 overflow-hidden py-0" padding={false}>
            <CardContent className="p-4">
              <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center">
                <img
                  alt=""
                  className="size-20 shrink-0 rounded-(--radius-xl) border border-border object-cover"
                  height={80}
                  src={asset.imageSrc}
                  width={80}
                />
                <VStack className="min-w-0 flex-1" gap="xs" hAlign="start">
                  <Text className="text-pretty" weight="medium">
                    {asset.name}
                  </Text>
                  <Text className="text-secondary-foreground" size="sm">
                    {assetSubtitle(asset)}
                  </Text>
                  {asset.vaultId ? (
                    <Text
                      className="font-mono text-secondary-foreground"
                      size="xs"
                    >
                      {asset.vaultId}
                    </Text>
                  ) : null}
                </VStack>
                <Badge variant={statusBadgeVariant(asset.status)}>
                  {asset.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <section
            aria-labelledby="retrieval-pickup-location"
            className="overflow-hidden rounded-(--radius-2xl) border border-border bg-background-subtle"
          >
            <div className="flex flex-col gap-4 p-4 sm:p-5">
              <Text
                as="h3"
                id="retrieval-pickup-location"
                size="sm"
                weight="medium"
              >
                Pickup location
              </Text>
              <HStack className="min-w-0" gap="md" vAlign="start">
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
              </HStack>
            </div>
            <div className="border-t border-border px-4 py-3 sm:px-5">
              <Text className="text-pretty text-secondary-foreground" size="sm">
                Bring ID that matches the account. We’ll confirm the pickup
                window after the item is released from storage.
              </Text>
            </div>
          </section>
        </DialogBody>
        <DialogFooter>
          <DialogClose
            render={
              <Button
                className="w-full sm:w-auto"
                type="button"
                variant="ghost"
              />
            }
          >
            Cancel
          </DialogClose>
          <DialogClose
            render={
              <Button
                className="w-full sm:w-auto"
                onClick={onSubmit}
                type="button"
              />
            }
          >
            Submit retrieval request
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export type { VaultRequestRetrievalDialogProps };
export { VaultRequestRetrievalDialog };

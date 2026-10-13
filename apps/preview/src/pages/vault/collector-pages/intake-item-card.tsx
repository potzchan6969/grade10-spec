import { Badge } from "@grade10/design-system/components/display/badge";
import {
  Card,
  CardFooter,
} from "@grade10/design-system/components/display/card";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@grade10/design-system/components/overlays/dialog";
import { FilePdf } from "@phosphor-icons/react";
import { registerBones } from "boneyard-js";
import { Skeleton } from "boneyard-js/react";
import { useState } from "react";
import { VAULT_PORTFOLIO_STORY_ID } from "../../vault-content";
import { navigateToStory } from "../../workbench-story-nav";
import {
  type IntakeItemRow,
  isVaulted,
  SERVICE_LABELS,
  VAULT_IN_PROGRESS_ITEMS,
} from "../intake-content";
import intakeItemCardBones from "./intake-item-card.bones.json";

registerBones({
  "intake-item-card": intakeItemCardBones,
});

/** Placeholder the skeleton overlay measures — a vault item carries both buttons. */
const SKELETON_ITEM: IntakeItemRow = VAULT_IN_PROGRESS_ITEMS[0];

function ScanThumbs({ item }: { item: IntakeItemRow }) {
  const [openScanId, setOpenScanId] = useState<string | null>(null);
  const primary = item.scanSrcs[0];
  const extra = item.scanSrcs.length - 1;
  const openScan = item.scanSrcs.find((scan) => scan.id === openScanId);

  if (!primary) return null;

  return (
    <>
      <button
        className="group relative h-[90px] w-16 shrink-0 cursor-pointer overflow-hidden rounded-(--radius-md) border border-border bg-muted outline-none transition-transform duration-150 ease-out focus-visible:ring-3 focus-visible:ring-ring/50 motion-safe:active:scale-[0.97]"
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          setOpenScanId(primary.id);
        }}
      >
        <img
          alt={`Scan of ${item.name}`}
          className="size-full object-contain p-0.5 transition-transform duration-200 motion-safe:[@media(hover:hover)]:group-hover:scale-[1.03]"
          height={96}
          src={primary.src}
          width={96}
        />
        {extra > 0 ? (
          <span className="absolute right-0.5 bottom-0.5 rounded-(--radius-full) bg-foreground/80 px-1 py-0 font-medium text-background text-xs tabular-nums">
            +{extra}
          </span>
        ) : null}
      </button>
      {openScan ? (
        <Dialog onOpenChange={(open) => !open && setOpenScanId(null)} open>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{item.name}</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <div className="flex flex-col gap-3">
                <div className="flex min-h-64 items-center justify-center rounded-(--radius-xl) border border-border bg-muted p-3">
                  <img
                    alt={`Enlarged scan of ${item.name}`}
                    className="max-h-[60vh] w-full object-contain"
                    src={openScan.src}
                  />
                </div>
                {item.scanSrcs.length > 1 ? (
                  <HStack className="flex-wrap" gap="sm" vAlign="center">
                    {item.scanSrcs.map((scan, index) => (
                      <button
                        key={scan.id}
                        className="size-14 cursor-pointer overflow-hidden rounded-(--radius-lg) border border-border bg-muted p-1 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 data-[active=true]:ring-2 data-[active=true]:ring-ring"
                        data-active={scan.id === openScanId}
                        type="button"
                        onClick={() => setOpenScanId(scan.id)}
                      >
                        <img
                          alt={`Scan ${index + 1}`}
                          className="size-full object-contain"
                          src={scan.src}
                        />
                      </button>
                    ))}
                  </HStack>
                ) : null}
                <Text className="text-secondary-foreground" size="xs">
                  Preview fixture — front and back may share one scan until dual
                  assets ship.
                </Text>
              </div>
            </DialogBody>
          </DialogContent>
        </Dialog>
      ) : null}
    </>
  );
}

/**
 * Typeset: a compact scan thumbnail beside an info column holding a
 * service–status badge, the item name, and its grade; the footer pairs the
 * action buttons with the item ID.
 */
function IntakeItemCardBody({ item }: { item: IntakeItemRow }) {
  const isVault = item.service === "vault";
  const vaulted = isVaulted(item);

  return (
    <Card className="gap-0 overflow-hidden pt-0 shadow-none">
      <div className="flex items-center gap-4 p-(--card-spacing)">
        <ScanThumbs item={item} />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <Badge className="w-fit" size="sm" variant="default">
            {SERVICE_LABELS[item.service]} – {item.status}
          </Badge>
          <Text
            as="h2"
            className="font-heading tracking-tight line-clamp-1"
            size="base"
            weight="medium"
          >
            {item.name}
          </Text>
          <Text className="line-clamp-1" size="sm">
            {item.gradeLabel}
          </Text>
        </div>
      </div>

      <CardFooter className="flex-col items-start gap-2 border-border py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <HStack className="flex-wrap" gap="sm" vAlign="center">
          <Button
            leading={<FilePdf aria-hidden size={16} weight="regular" />}
            size="sm"
            title="Preview fixture — signed at hand-in"
            type="button"
            variant="outline"
          >
            View Agreement
          </Button>
          {isVault ? (
            <Button
              disabled={!vaulted}
              size="sm"
              title={
                vaulted
                  ? "View in vault portfolio"
                  : "Portfolio available once the item is vaulted"
              }
              type="button"
              variant="outline"
              onClick={() => navigateToStory(VAULT_PORTFOLIO_STORY_ID)}
            >
              View in Vault
            </Button>
          ) : null}
        </HStack>
        <Text className="shrink-0 self-end text-secondary-foreground" size="xs">
          {item.itemId}
        </Text>
      </CardFooter>
    </Card>
  );
}

function IntakeItemCard({
  item,
  loading = false,
}: {
  item: IntakeItemRow;
  /** Boneyard skeleton overlay while the submissions fetch settles. */
  loading?: boolean;
}) {
  if (loading) {
    return (
      <Skeleton
        animate="pulse"
        className="w-full"
        color="#E6E6E6"
        darkColor="rgba(249, 250, 250, 0.05)"
        loading
        name="intake-item-card"
        snapshotConfig={{ excludeSelectors: ["[aria-hidden]"] }}
        transition={300}
      >
        <IntakeItemCardBody item={SKELETON_ITEM} />
      </Skeleton>
    );
  }

  return <IntakeItemCardBody item={item} />;
}

export { IntakeItemCard };

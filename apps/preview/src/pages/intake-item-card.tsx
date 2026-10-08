import { Badge } from "@grade10/design-system/components/display/badge";
import {
  Card,
  CardContent,
} from "@grade10/design-system/components/display/card";
import { Separator } from "@grade10/design-system/components/display/separator";
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
import { useState } from "react";
import {
  formatHkd,
  type IntakeItemRow,
  intakeItemCardStoryId,
  isVaulted,
  SERVICE_LABELS,
} from "./intake-content";
import { VAULT_PORTFOLIO_STORY_ID } from "./vault-content";
import { navigateToStory, storyHref } from "./workbench-story-nav";

function itemBadgeVariant(
  status: string,
): "default" | "success" | "warning" | "info" {
  if (status === "Vaulted" || status === "Completed") return "success";
  if (status === "Action Required") return "warning";
  return "info";
}

function formatHandInDate(ms: number): string {
  return new Intl.DateTimeFormat("en-HK", {
    dateStyle: "medium",
    timeZone: "Asia/Hong_Kong",
  }).format(new Date(ms));
}

function ScanThumbs({ item }: { item: IntakeItemRow }) {
  const [openScanId, setOpenScanId] = useState<string | null>(null);
  const primary = item.scanSrcs[0];
  const extra = item.scanSrcs.length - 1;
  const openScan = item.scanSrcs.find((scan) => scan.id === openScanId);

  if (!primary) return null;

  return (
    <>
      <button
        className="relative size-20 shrink-0 cursor-pointer overflow-hidden rounded-(--radius-xl) border border-border bg-muted outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:size-24"
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          setOpenScanId(primary.id);
        }}
      >
        <img
          alt={`Scan of ${item.name}`}
          className="size-full object-contain p-1.5"
          height={96}
          src={primary.src}
          width={96}
        />
        {extra > 0 ? (
          <span className="absolute right-1 bottom-1 rounded-(--radius-md) bg-foreground/80 px-1.5 py-0.5 text-[10px] font-medium text-background tabular-nums">
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
 * Typeset: status badge and name anchor top row as primary info; scan thumbnail
 * sits left with grade; declared value is a clear field; service and date group
 * as secondary metadata; note and ID stay quiet. Actions sit under a rule.
 */
function IntakeItemCard({
  item,
  onOpen,
}: {
  item: IntakeItemRow;
  /** Opens the standalone item-card story from the tracker list. */
  onOpen?: () => void;
}) {
  const isVault = item.service === "vault";
  const vaulted = isVaulted(item);

  return (
    <Card
      className="gap-0 overflow-hidden border-border py-0 shadow-none"
      padding={false}
    >
      <CardContent className="flex flex-col gap-0 p-0">
        <div className="flex flex-col gap-4 px-4 pt-4 pb-4 sm:px-5 sm:pt-5">
          <div className="flex items-start justify-between gap-3">
            {onOpen ? (
              <a
                className="min-w-0 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                href={storyHref(intakeItemCardStoryId(item))}
                onClick={(event) => {
                  event.preventDefault();
                  onOpen();
                }}
              >
                <Text
                  as="h2"
                  className="font-heading text-pretty tracking-tight"
                  size="lg"
                  weight="medium"
                >
                  {item.name}
                </Text>
              </a>
            ) : (
              <Text
                as="h2"
                className="font-heading text-pretty tracking-tight"
                size="lg"
                weight="medium"
              >
                {item.name}
              </Text>
            )}
            <Badge variant={itemBadgeVariant(item.status)}>{item.status}</Badge>
          </div>

          <HStack className="min-w-0" gap="md" vAlign="start">
            <ScanThumbs item={item} />
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <Text className="text-secondary-foreground" size="sm">
                {item.gradeLabel}
              </Text>

              <div className="flex flex-col gap-0.5">
                <Text className="text-secondary-foreground" size="xs">
                  Declared value
                </Text>
                <Text
                  className="font-heading tracking-tight tabular-nums"
                  size="base"
                  weight="medium"
                >
                  {formatHkd(item.declaredHkd)}
                </Text>
              </div>

              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <Text className="text-secondary-foreground" size="xs">
                  {SERVICE_LABELS[item.service]}
                </Text>
                <Text
                  className="text-secondary-foreground"
                  size="xs"
                  aria-hidden
                >
                  ·
                </Text>
                <Text className="text-secondary-foreground" size="xs">
                  Handed in {formatHandInDate(item.handedInAt)}
                </Text>
              </div>

              {item.note ? (
                <Text
                  className="text-pretty text-secondary-foreground"
                  size="xs"
                >
                  {item.note}
                </Text>
              ) : null}

              <Text className="text-secondary-foreground" face="mono" size="xs">
                {item.itemId}
              </Text>
            </div>
          </HStack>
        </div>
        <Separator />
        <div
          className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-3 sm:px-5"
          data-slot="intake-item-actions"
        >
          <Button
            leading={<FilePdf aria-hidden size={16} weight="regular" />}
            size="sm"
            title="Preview fixture — signed at hand-in"
            type="button"
            variant="ghost"
          >
            Custody agreement · PDF
          </Button>
          {isVault ? (
            <HStack className="flex-wrap" gap="sm" vAlign="center">
              <Button
                disabled={!vaulted}
                size="sm"
                title={
                  vaulted
                    ? "Preview fixture"
                    : "Receipt available once the item is vaulted"
                }
                type="button"
                variant="outline"
              >
                Vault receipt
              </Button>
              <Button
                disabled={!vaulted}
                size="sm"
                title={
                  vaulted
                    ? "View in vault portfolio"
                    : "Portfolio available once the item is vaulted"
                }
                type="button"
                variant={vaulted ? "default" : "outline"}
                onClick={() => navigateToStory(VAULT_PORTFOLIO_STORY_ID)}
              >
                View in vault portfolio
              </Button>
            </HStack>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

export { IntakeItemCard };

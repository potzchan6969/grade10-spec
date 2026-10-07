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
  isVaulted,
  SERVICE_LABELS,
} from "./intake-content";
import { VAULT_PORTFOLIO_STORY_ID } from "./vault-content";
import { navigateToStory } from "./workbench-story-nav";

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
  const [openSrc, setOpenSrc] = useState<string | null>(null);
  const primary = item.scanSrcs[0];
  const extra = item.scanSrcs.length - 1;

  if (!primary) return null;

  return (
    <>
      <button
        className="relative size-20 shrink-0 cursor-pointer overflow-hidden rounded-(--radius-xl) border border-border bg-muted outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:size-24"
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          setOpenSrc(primary);
        }}
      >
        <img
          alt={`Scan of ${item.name}`}
          className="size-full object-contain p-1.5"
          height={96}
          src={primary}
          width={96}
        />
        {extra > 0 ? (
          <span className="absolute right-1 bottom-1 rounded-(--radius-md) bg-foreground/80 px-1.5 py-0.5 text-[10px] font-medium text-background tabular-nums">
            +{extra}
          </span>
        ) : null}
      </button>
      {openSrc ? (
        <Dialog onOpenChange={(open) => !open && setOpenSrc(null)} open>
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
                    src={openSrc}
                  />
                </div>
                {item.scanSrcs.length > 1 ? (
                  <HStack className="flex-wrap" gap="sm" vAlign="center">
                    {item.scanSrcs.map((src, index) => (
                      <button
                        key={`${item.itemId}-dlg-${index}`}
                        className="size-14 cursor-pointer overflow-hidden rounded-(--radius-lg) border border-border bg-muted p-1 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 data-[active=true]:ring-2 data-[active=true]:ring-ring"
                        data-active={src === openSrc}
                        type="button"
                        onClick={() => setOpenSrc(src)}
                      >
                        <img
                          alt={`Scan ${index + 1}`}
                          className="size-full object-contain"
                          src={src}
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
 * Typeset: name leads; status is a badge; declared value is a labeled figure;
 * note and ids stay quiet. Actions sit under a rule.
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
        <div
          className={
            onOpen
              ? "flex cursor-pointer flex-col gap-4 px-4 pt-4 pb-4 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:px-5 sm:pt-5"
              : "flex flex-col gap-4 px-4 pt-4 pb-4 sm:px-5 sm:pt-5"
          }
          role={onOpen ? "link" : undefined}
          tabIndex={onOpen ? 0 : undefined}
          onClick={onOpen}
          onKeyDown={
            onOpen
              ? (event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onOpen();
                  }
                }
              : undefined
          }
        >
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
            <Badge variant={itemBadgeVariant(item.status)}>{item.status}</Badge>
            <Text className="text-secondary-foreground" size="xs">
              {SERVICE_LABELS[item.service]}
            </Text>
            <Text className="text-secondary-foreground" size="xs" aria-hidden>
              ·
            </Text>
            <Text className="text-secondary-foreground" size="xs">
              Handed in {formatHandInDate(item.handedInAt)}
            </Text>
          </div>

          <HStack className="min-w-0" gap="md" vAlign="start">
            <ScanThumbs item={item} />
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <div className="flex min-w-0 flex-col gap-1">
                <Text
                  as="h3"
                  className="font-heading text-pretty tracking-tight"
                  size="base"
                  weight="medium"
                >
                  {item.name}
                </Text>
                <Text className="text-secondary-foreground" size="sm">
                  {item.gradeLabel}
                </Text>
              </div>

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

              {item.note ? (
                <Text className="text-pretty text-secondary-foreground" size="xs">
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
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
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
                size="sm"
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

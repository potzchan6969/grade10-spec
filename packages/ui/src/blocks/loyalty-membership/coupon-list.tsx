"use client";

import { EmptyState } from "@grade10/design-system/components/display/empty-state";
import { List, ListItem } from "@grade10/design-system/components/display/list";
import { Button } from "@grade10/design-system/components/forms/button";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogTitle,
} from "@grade10/design-system/components/overlays/dialog";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerTitle,
} from "@grade10/design-system/components/overlays/drawer";
import { cn } from "@grade10/design-system/lib/utils";
import { Ticket } from "@phosphor-icons/react";
import { useEffect, useId, useState } from "react";
import type { AsyncState } from "../shared/async";
import { AsyncMessage } from "../shared/async-message";
import { PromoQrCard } from "../store-cart/promo-qr-card";
import { PromoTicket, PromoTicketSkeleton } from "../store-cart/promo-ticket";
import type { CouponItem } from "./types";

const SM_UP_MQ = "(min-width: 640px)";

/** Reads the 640px line — the sheet below it, the dialog from it up. */
function useSmUp() {
  const [smUp, setSmUp] = useState(
    () => typeof window === "undefined" || window.matchMedia(SM_UP_MQ).matches,
  );
  useEffect(() => {
    const media = window.matchMedia(SM_UP_MQ);
    const onChange = () => setSmUp(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);
  return smUp;
}

/** The words the list says, whichever coupons are in it. */
type CouponListCopy = {
  /** Accessible name of the list. */
  label: string;
  /** Names a spent coupon. */
  spent: string;
  /** Names a void coupon. */
  void: string;
};

type CouponListProps = {
  copy: CouponListCopy;
  state: AsyncState<readonly CouponItem[]>;
  className?: string;
};

/* An expired coupon reads its status off its own expiry — "Expired 1 May" —
 * so only spent and void take a status line. */
const STATUS_LABEL: Record<
  "spent" | "void",
  keyof Pick<CouponListCopy, "spent" | "void">
> = {
  spent: "spent",
  void: "void",
};

/** The coupon whose scan card is open, and the region id its ticket's Use
 * now control points at. Stays set through the surface's exit transition. */
type ScanTarget = { item: CouponItem; regionId: string };

function CouponTicket({
  copy,
  item,
  scanOpen,
  onScanToggle,
}: {
  copy: CouponListCopy;
  item: CouponItem;
  scanOpen: boolean;
  onScanToggle: (target: ScanTarget | null) => void;
}) {
  const regionId = useId();
  const open = item.status === "open";
  const qrCode = open ? item.qrCode : undefined;
  /* A spent or void coupon says its one line — "Used on …", "Void …" — in
   * the detail's place. An expired coupon keeps its expiry, which already
   * reads "Expired …". */
  const statusLabel =
    item.status === "spent" || item.status === "void"
      ? (item.statusLabel ?? copy[STATUS_LABEL[item.status]])
      : undefined;

  return (
    <ListItem
      className="p-0"
      data-slot="coupon-list-item"
      data-status={item.status}
      divider={false}
    >
      <PromoTicket
        action={open ? item.action : undefined}
        code={{
          applicable: open,
          id: item.id,
          title: item.description ?? item.amount,
          detailLabel:
            open || item.status === "expired" ? item.expiry : undefined,
          inapplicableReason: statusLabel,
          label: item.code ?? item.amount,
        }}
        muted={!open}
        onQrToggle={(next) => onScanToggle(next ? { item, regionId } : null)}
        qrCode={qrCode}
        qrOpen={scanOpen}
        qrRegionId={regionId}
      />
    </ListItem>
  );
}

/** The scan card's own surface: a bottom sheet under 640px, a dialog from
 * it up — the member holds it out where the till reads it. The coupon's own
 * ticket sits above the unfolded card, as the redeemed phase lays it out,
 * and carries no scan control of its own — the surface is already the
 * answer to Use now. The coupon names the surface for assistive tech alone;
 * a visible heading would only repeat the ticket. */
function CouponScanSurface({
  target,
  open,
  onOpenChange,
  smUp,
}: {
  target: ScanTarget;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  smUp: boolean;
}) {
  const { item } = target;
  const qrCode = item.qrCode;

  if (!qrCode) return null;
  const title = item.description ?? item.amount;

  const body = (
    /* The dialog's close control floats at its top corner — the ticket starts
     * low enough to clear it. */
    <VStack className={cn("w-full", smUp && "pt-10")} gap="md">
      {smUp ? (
        <DialogTitle className="sr-only">{title}</DialogTitle>
      ) : (
        <DrawerTitle className="sr-only">{title}</DrawerTitle>
      )}
      <PromoTicket
        className="w-full"
        code={{
          applicable: true,
          id: item.id,
          title,
          detailLabel: item.expiry,
          label: item.code ?? item.amount,
        }}
      />
      <PromoQrCard
        caption={qrCode.caption}
        className="w-full"
        id={target.regionId}
        open={open}
        qrCode={qrCode}
      />
    </VStack>
  );

  return smUp ? (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-(--container-md) gap-4" showCloseButton>
        <DialogBody className="gap-4">{body}</DialogBody>
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer
      onOpenChange={onOpenChange}
      open={open}
      showSwipeHandle
      swipeDirection="down"
    >
      <DrawerContent
        className="bg-popover backdrop-blur-none [--drawer-bleed-background:var(--popover)]"
        data-sheet="coupon-scan"
      >
        <DrawerBody className="gap-4">{body}</DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

/**
 * The coupons a member holds, one ticket apiece. An open coupon carries a
 * code only where the consumer passes one — a reward coupon spends from the
 * wallet by id and carries none, and its stub reads what the coupon takes
 * off instead. Where an open coupon carries `qrCode`, its Use now opens the scan
 * card on a sheet or dialog; a consumer `action` rides instead where one is
 * given. Spent, void and expired stay listed and say so — the consumer
 * decides how long history stays.
 */
function CouponList({ copy, state, className }: CouponListProps) {
  const smUp = useSmUp();
  const [scan, setScan] = useState<ScanTarget | null>(null);
  const [scanOpen, setScanOpen] = useState(false);

  return (
    <VStack className={className} data-slot="coupon-list" gap="sm">
      {state.status === "loading" ? (
        <VStack className="gap-2" data-slot="coupon-list-loading">
          <PromoTicketSkeleton />
          <PromoTicketSkeleton />
          <PromoTicketSkeleton />
        </VStack>
      ) : null}
      {state.status === "empty" ? (
        <EmptyState
          actions={
            state.action ? (
              <Button
                disabled={state.action.pending}
                onClick={state.action.onAction}
                type="button"
                variant="secondary"
              >
                {state.action.label}
              </Button>
            ) : undefined
          }
          data-slot="coupon-list-empty"
          description={state.description}
          icon={<Ticket aria-hidden />}
          title={state.message}
        />
      ) : null}
      {state.status === "error" ? (
        <AsyncMessage
          action={state.action}
          message={state.message}
          slot="coupon-list-error"
        />
      ) : null}
      {state.status === "ready" ? (
        <List aria-label={copy.label} className="gap-2">
          {state.data.map((item) => (
            <CouponTicket
              copy={copy}
              item={item}
              key={item.id}
              onScanToggle={(target) => {
                setScan(target ?? scan);
                setScanOpen(target != null);
              }}
              scanOpen={scanOpen && scan?.item.id === item.id}
            />
          ))}
        </List>
      ) : null}
      {scan ? (
        <CouponScanSurface
          onOpenChange={(next) => {
            if (!next) setScanOpen(false);
          }}
          open={scanOpen}
          smUp={smUp}
          target={scan}
        />
      ) : null}
    </VStack>
  );
}

export type { CouponListCopy, CouponListProps };
export { CouponList };

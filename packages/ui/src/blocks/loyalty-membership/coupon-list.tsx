"use client";

import { EmptyState } from "@grade10/design-system/components/display/empty-state";
import { List, ListItem } from "@grade10/design-system/components/display/list";
import { Button } from "@grade10/design-system/components/forms/button";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@grade10/design-system/components/overlays/dialog";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerTitle,
} from "@grade10/design-system/components/overlays/drawer";
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
  /** The scan surface's heading — "Use Coupon" — never the coupon's own
   * name, which the ticket inside already says. */
  scanTitle: string;
};

type CouponListProps = {
  copy: CouponListCopy;
  state: AsyncState<readonly CouponItem[]>;
  /** Fires when the scan surface opens and when it closes. The close is the
   * consumer's cue to refetch — a scanned coupon may have been spent at the
   * till meanwhile, and a fresh `state` moves it to history on its own. */
  onScanOpenChange?: (open: boolean, coupon: CouponItem) => void;
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
  /* A scoped coupon is online's alone — no Use now, no QR, whatever the
   * consumer passes. */
  const qrCode = open && !item.scopeLabel ? item.qrCode : undefined;
  /* A spent or void coupon says its one line — "Used on …", "Void …" — in
   * the detail's place; an open scoped coupon's second line names where it
   * is good. An expired coupon keeps its expiry, which already reads
   * "Expired …". */
  const statusLabel =
    item.status === "spent" || item.status === "void"
      ? (item.statusLabel ?? copy[STATUS_LABEL[item.status]])
      : item.scopeLabel;

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
 * answer to Use now. The dialog's header says the copy's scanTitle — the
 * ticket inside already names the coupon; the sheet names it for assistive
 * tech alone — the ticket is its heading already. */
function CouponScanSurface({
  copy,
  target,
  open,
  onOpenChange,
  smUp,
}: {
  copy: CouponListCopy;
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
    <VStack className="w-full" gap="md">
      {!smUp ? <DrawerTitle className="sr-only">{title}</DrawerTitle> : null}
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
      <DialogContent className="max-w-(--container-md) gap-4">
        {/* The header owns the close control — title and X share its row. */}
        <DialogHeader>
          <DialogTitle>{copy.scanTitle}</DialogTitle>
        </DialogHeader>
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
function CouponList({
  copy,
  state,
  onScanOpenChange,
  className,
}: CouponListProps) {
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
          icon={<Ticket aria-hidden size={24} weight="regular" />}
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
                const next = target ?? scan;
                setScan(next);
                setScanOpen(target != null);
                if (next) onScanOpenChange?.(target != null, next.item);
              }}
              scanOpen={scanOpen && scan?.item.id === item.id}
            />
          ))}
        </List>
      ) : null}
      {scan ? (
        <CouponScanSurface
          copy={copy}
          onOpenChange={(next) => {
            if (!next) {
              setScanOpen(false);
              onScanOpenChange?.(false, scan.item);
            }
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

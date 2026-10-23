"use client";

import { Badge } from "@grade10/design-system/components/display/badge";
import { DetailRow } from "@grade10/design-system/components/display/detail-row";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@grade10/design-system/components/overlays/dialog";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@grade10/design-system/components/overlays/drawer";
import { cn } from "@grade10/design-system/lib/utils";
import { CaretRight, CheckCircle, Clock } from "@phosphor-icons/react";
import { type ReactNode, useEffect, useState } from "react";
import { PromoTicket } from "../store-cart/promo-ticket";
import { RewardArt } from "./reward-art";
import type { RewardCheckoutReward, RewardRedemption } from "./types";

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

/** The words the surface says, whatever is being redeemed. */
type RewardCheckoutCopy = {
  /** "Use at" — where the coupon is spendable or the item is collected. */
  useAt: string;
  /** "Valid for" — how long the coupon lasts, or the collection window. */
  validFor: string;
  /** The balance row's label — "Point Balance". */
  pointBalance: string;
  /** The unit points are counted in — "pts". */
  points: string;
  /** How a point count reads — "1,250". */
  pointCount: (points: number) => string;
  /** The shortfall warning, given the deficit — "Need 2,750 more pts". */
  pointsNeeded: (missing: number) => string;
  /** The redeem button, given the cost — "Redeem for 120 pts". */
  redeemFor: (cost: number) => string;
  /** The redeemed heading for a discount coupon — "Added to your coupons". */
  redeemedCouponTitle: string;
  /** The redeemed heading for a good — "Ready to Collect". */
  redeemedItemTitle: string;
  /** Dismisses the redeemed surface. */
  done: string;
  /** Opens the member's coupons. */
  viewCoupons: string;
};

type RewardCheckoutProps = {
  copy: RewardCheckoutCopy;
  reward: RewardCheckoutReward;
  /** Redeemable points the confirm phase judges against. */
  balance: number;
  /** Set once the redemption settles: the surface draws the redeemed phase. */
  redemption?: RewardRedemption;
  /** The programme is settling the redemption. */
  pending?: boolean;
  /** The last redemption's refusal, member-worded. */
  failure?: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRedeem: () => void;
  /** Dismisses the redeemed phase; falls back to closing the surface. */
  onDone?: () => void;
  /** Where "View Coupons" goes. */
  viewCouponsHref?: string;
  className?: string;
};

/**
 * The checkout surface: a bottom sheet under 640px, a dialog from it up.
 * Confirm restates the reward — its hero, deadline, where the coupon is
 * spendable and how long it is good for — shows the balance before and
 * after, and refuses a short balance whole. Given a `redemption` it draws
 * the redeemed phase in the same surface: the coupon's ticket carries the
 * unique code the redemption minted, the good's names the collection and no
 * code. Apply belongs to the cart; the surface offers none.
 */
function RewardCheckout({
  copy,
  reward,
  balance,
  redemption,
  pending = false,
  failure,
  open,
  onOpenChange,
  onRedeem,
  onDone,
  viewCouponsHref,
  className,
}: RewardCheckoutProps) {
  const smUp = useSmUp();

  const body = (
    <RewardCheckoutBody
      balance={balance}
      copy={copy}
      failure={failure}
      onDone={onDone}
      onOpenChange={onOpenChange}
      onRedeem={onRedeem}
      pending={pending}
      redemption={redemption}
      renderDescription={(text) => (
        <SheetOrDialogDescription smUp={smUp} text={text} />
      )}
      renderTitle={(text) => <SheetOrDialogTitle smUp={smUp} text={text} />}
      reward={reward}
      viewCouponsHref={viewCouponsHref}
    />
  );

  return smUp ? (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className={cn("gap-4", className)}>
        <DialogBody className="gap-4">{body}</DialogBody>
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer onOpenChange={onOpenChange} open={open} swipeDirection="down">
      <DrawerContent className={className} data-sheet="reward-checkout">
        <DrawerBody className="gap-4">{body}</DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

/* The heading is the a11y title: the reward's name while confirming, the
 * redeemed line once it settles. */
function SheetOrDialogTitle({ smUp, text }: { smUp: boolean; text: string }) {
  return smUp ? (
    <DialogTitle className="text-xl leading-7 font-semibold">
      {text}
    </DialogTitle>
  ) : (
    <DrawerTitle className="text-xl leading-7 font-semibold">
      {text}
    </DrawerTitle>
  );
}

function SheetOrDialogDescription({
  smUp,
  text,
}: {
  smUp: boolean;
  text: string;
}) {
  return smUp ? (
    <DialogDescription className="text-sm leading-5 text-secondary-foreground">
      {text}
    </DialogDescription>
  ) : (
    <DrawerDescription className="text-sm leading-5">{text}</DrawerDescription>
  );
}

function RewardCheckoutBody({
  copy,
  reward,
  balance,
  redemption,
  pending,
  failure,
  onRedeem,
  onDone,
  onOpenChange,
  viewCouponsHref,
  renderTitle,
  renderDescription,
}: {
  copy: RewardCheckoutCopy;
  reward: RewardCheckoutReward;
  balance: number;
  redemption?: RewardRedemption;
  pending: boolean;
  failure?: string | null;
  onRedeem: () => void;
  onDone?: () => void;
  onOpenChange: (open: boolean) => void;
  viewCouponsHref?: string;
  renderTitle: (text: string) => ReactNode;
  renderDescription: (text: string) => ReactNode;
}) {
  if (redemption) {
    return (
      <VStack
        align="center"
        className="w-full animate-in fade-in slide-in-from-bottom-2 duration-300 motion-reduce:animate-none"
        data-slot="reward-checkout-redeemed"
        gap="md"
      >
        <span className="animate-in zoom-in-50 duration-500 text-accent-foreground motion-reduce:animate-none">
          <CheckCircle aria-hidden size={80} weight="fill" />
        </span>
        <VStack align="center" className="w-full text-center" gap="xs">
          {renderTitle(
            reward.kind === "coupon"
              ? copy.redeemedCouponTitle
              : copy.redeemedItemTitle,
          )}
          {renderDescription(redemption.summary)}
        </VStack>
        <PromoTicket
          className="w-full"
          code={{
            applicable: true,
            id: reward.id,
            title: reward.name,
            detailLabel: redemption.deadline,
            label: redemption.code ?? redemption.note ?? "",
          }}
        />
        <HStack className="w-full" gap="md">
          <Button
            className="flex-1"
            onClick={() => (onDone ? onDone() : onOpenChange(false))}
            size="md"
            type="button"
            variant="secondary"
          >
            {copy.done}
          </Button>
          {viewCouponsHref ? (
            <Button
              className="flex-1"
              render={<a href={viewCouponsHref}>{copy.viewCoupons}</a>}
              size="md"
            />
          ) : (
            <Button className="flex-1" size="md" type="button">
              {copy.viewCoupons}
            </Button>
          )}
        </HStack>
      </VStack>
    );
  }

  const affordable = reward.pointCost <= balance;
  const details = [
    reward.useAt ? { label: copy.useAt, value: reward.useAt } : null,
    reward.validFor ? { label: copy.validFor, value: reward.validFor } : null,
  ].filter((row): row is { label: string; value: string } => row != null);

  return (
    <VStack className="w-full" data-slot="reward-checkout" gap="md">
      <RewardArt hero reward={reward} />
      <VStack className="w-full" gap="sm">
        {reward.deadline ? (
          <Badge>
            <Clock aria-hidden />
            {reward.deadline}
          </Badge>
        ) : null}
        <VStack className="w-full" gap="xs">
          {renderTitle(reward.name)}
          {reward.description ? renderDescription(reward.description) : null}
        </VStack>
      </VStack>
      {details.length > 0 ? (
        <VStack className="w-full" gap="none">
          {details.map((row, index) => (
            <DetailRow
              className={cn(index === details.length - 1 && "border-b-0")}
              key={row.label}
              label={row.label}
            >
              {row.value}
            </DetailRow>
          ))}
        </VStack>
      ) : null}
      <HStack
        className={cn(
          "w-full items-center justify-between rounded-2xl px-4 py-3",
          affordable ? "bg-muted" : "bg-warning-muted",
        )}
        data-affordable={affordable}
        data-slot="reward-checkout-balance"
      >
        <Text size="sm" tone="secondary">
          {copy.pointBalance}
        </Text>
        {affordable ? (
          <HStack gap="sm" vAlign="center">
            <Text tone="secondary">{copy.pointCount(balance)}</Text>
            <span className="text-secondary-foreground">
              <CaretRight aria-hidden size={14} />
            </span>
            <Text weight="medium">
              {copy.pointCount(balance - reward.pointCost)} {copy.points}
            </Text>
          </HStack>
        ) : (
          <Text className="text-warning" weight="medium">
            {copy.pointsNeeded(reward.pointCost - balance)}
          </Text>
        )}
      </HStack>
      {failure ? (
        <Text as="p" role="alert" size="sm" tone="error">
          {failure}
        </Text>
      ) : null}
      <Button
        disabled={!affordable}
        loading={pending}
        onClick={() => {
          if (!pending) onRedeem();
        }}
        size="md"
        type="button"
      >
        {copy.redeemFor(reward.pointCost)}
      </Button>
    </VStack>
  );
}

export type { RewardCheckoutCopy, RewardCheckoutProps };
export { RewardCheckout };

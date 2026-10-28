import { Alert } from "@grade10/design-system/components/display/alert";
import { Badge } from "@grade10/design-system/components/display/badge";
import { EmptyState } from "@grade10/design-system/components/display/empty-state";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { CheckboxButton } from "@grade10/design-system/components/forms/checkbox-button";
import { Link } from "@grade10/design-system/components/forms/link";
import { RadioCard } from "@grade10/design-system/components/forms/radio-card";
import { RadioList } from "@grade10/design-system/components/forms/radio-list";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogSubtext,
  DialogTitle,
} from "@grade10/design-system/components/overlays/dialog";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@grade10/design-system/components/overlays/drawer";
import { PauseCircle, PlugsConnected } from "@phosphor-icons/react";
import { useState } from "react";
import {
  MEMBERSHIP_STORY_ID,
  navigateToStory,
  storyHref,
} from "../../workbench-story-nav";
import {
  LEFT_TODAY,
  MEMBER_BALANCE,
  OFF_SALE_PACK_ID,
  packPrice,
  REVIEW_THRESHOLD,
  TOP_UP_COPY,
  TOP_UP_PACKS,
  type TopUpPack,
} from "./top-ups-content";
import { TopUpsPrototypeNote, useSmUp } from "./top-ups-shared";

/** Result screens the member lands on once Stripe's checkout is done. */
const POINTS_ADDED_STORY_ID = "loyalty-top-ups-parts-topupresult--points-added";
const UNDER_REVIEW_STORY_ID = "loyalty-top-ups-parts-topupresult--under-review";

/** The history page the dialog's history link opens. */
const TOP_UP_HISTORY_STORY_ID = "loyalty-top-ups-parts-topuphistory--default";

/** Pack pre-selected in the states a member reaches after submitting. */
const PRESET_PACK_ID = "pack-10k";

type TopUpDialogState =
  | "default"
  | "opening"
  | "limit-almost-reached"
  | "limit-reached"
  | "off-sale"
  | "checkout-not-opened"
  | "paused"
  | "unavailable";

const copy = TOP_UP_COPY;

/** The terms text with "Top-Up Terms" rendered as a link. */
function TermsText({ labelId }: { labelId: string }) {
  const parts = copy.terms.split(copy.termsLink);
  return (
    <Text as="p" id={labelId} size="sm">
      {parts[0]}
      <Link href="#top-up-terms" size="sm">
        {copy.termsLink}
      </Link>
      {parts[1]}
    </Text>
  );
}

/** One pack tile: points big, the price, a struck list price and a save
 * badge when discounted, and why it cannot be picked when it cannot. */
function PackTile({ disabled, pack }: { disabled: boolean; pack: TopUpPack }) {
  return (
    <RadioCard
      disabled={disabled}
      title={
        <span className="flex items-baseline gap-1.5">
          <span className="text-2xl font-semibold tracking-tight">
            {copy.packPoints(pack.points)}
          </span>
          <span className="font-normal text-secondary-foreground">
            {copy.packPointsSuffix}
          </span>
        </span>
      }
      description={
        <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="font-medium text-foreground">
            {copy.packPrice(packPrice(pack))}
          </span>
          {pack.discountPercent > 0 ? (
            <>
              <s>{copy.packWasPrice(pack.points)}</s>
              <Badge size="sm" variant="success">
                {copy.packSave(pack.discountPercent)}
              </Badge>
            </>
          ) : null}
          {disabled ? (
            <span className="w-full">{copy.packOverLimit}</span>
          ) : null}
        </span>
      }
      value={pack.id}
    />
  );
}

/** Paused and unavailable replace the packs and the footer, not the header. */
function RefusedBody({ state }: { state: TopUpDialogState }) {
  if (state === "paused") {
    return (
      <EmptyState
        actions={
          <Button render={<a href="#contact" />} size="md" variant="outline">
            {copy.paused.action}
          </Button>
        }
        description={copy.paused.description}
        icon={<PauseCircle aria-hidden size={24} weight="regular" />}
        title={copy.paused.title}
      />
    );
  }
  return (
    <EmptyState
      actions={
        <Button
          render={<a href={storyHref(MEMBERSHIP_STORY_ID)} />}
          size="md"
          variant="outline"
        >
          {copy.unavailable.action}
        </Button>
      }
      description={copy.unavailable.description}
      icon={<PlugsConnected aria-hidden size={24} weight="regular" />}
      title={copy.unavailable.title}
    />
  );
}

/**
 * The pack picker: a dialog from 640px up, a bottom drawer below, opening over
 * wherever buying points enters (today a stand-in for Membership). The member
 * picks a pack, accepts the terms and continues to Stripe's checkout. A
 * wireframe until the design lands.
 */
function TopUpDialogPrototype({ state }: { state: TopUpDialogState }) {
  const preset = state === "opening" || state === "checkout-not-opened";
  const [open, setOpen] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(
    preset ? PRESET_PACK_ID : null,
  );
  const [terms, setTerms] = useState(preset);
  const [busy, setBusy] = useState(state === "opening");
  const [packError, setPackError] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const smUp = useSmUp();

  const packs =
    state === "off-sale"
      ? TOP_UP_PACKS.filter((pack) => pack.id !== OFF_SALE_PACK_ID)
      : TOP_UP_PACKS;
  const selectedPack = packs.find((pack) => pack.id === selectedId) ?? null;
  const limitReached = state === "limit-reached";
  const packDisabled = (pack: TopUpPack) =>
    limitReached ||
    (state === "limit-almost-reached" && pack.points > LEFT_TODAY);

  const termsLabelId = "top-up-terms-label";
  const termsErrorId = "top-up-terms-error";
  const packErrorId = "top-up-pack-error";

  const onContinue = () => {
    const missingPack = selectedPack === null;
    setPackError(missingPack);
    setTermsError(!terms);
    if (missingPack || !terms || busy) return;
    setBusy(true);
    window.setTimeout(() => {
      navigateToStory(
        selectedPack.points > REVIEW_THRESHOLD
          ? UNDER_REVIEW_STORY_ID
          : POINTS_ADDED_STORY_ID,
      );
    }, 800);
  };

  const body =
    state === "paused" || state === "unavailable" ? (
      <RefusedBody state={state} />
    ) : (
      <>
        {state === "off-sale" ? (
          <Alert
            description={copy.offSale.description}
            dismissible={false}
            status="error"
            title={copy.offSale.title}
          />
        ) : null}
        {limitReached ? (
          <Alert
            description={copy.limitReached.description}
            dismissible={false}
            status="default"
            title={copy.limitReached.title}
          />
        ) : null}

        <div className="flex flex-col gap-2">
          <RadioList
            aria-describedby={packError ? packErrorId : undefined}
            aria-invalid={packError || undefined}
            className="[&_[data-slot=radio-list-items]]:grid [&_[data-slot=radio-list-items]]:w-full [&_[data-slot=radio-list-items]]:grid-cols-1 sm:[&_[data-slot=radio-list-items]]:grid-cols-2"
            label={copy.packsLegend}
            onValueChange={(value) => {
              setSelectedId(String(value));
              setPackError(false);
            }}
            value={selectedId ?? ""}
          >
            {packs.map((pack) => (
              <PackTile
                disabled={packDisabled(pack)}
                key={pack.id}
                pack={pack}
              />
            ))}
          </RadioList>
          {packError ? (
            <p
              className="text-sm text-destructive"
              id={packErrorId}
              role="alert"
            >
              {copy.choosePackError}
            </p>
          ) : null}
          {state === "limit-almost-reached" ? (
            <Text as="p" size="sm" tone="secondary">
              {copy.limitLeft(LEFT_TODAY)}
            </Text>
          ) : null}
        </div>

        {selectedPack ? (
          <div className="flex flex-col gap-1">
            <Text as="p" size="sm">
              {copy.selectedLine(
                selectedPack.points,
                packPrice(selectedPack),
                MEMBER_BALANCE.total + selectedPack.points,
              )}
            </Text>
            {selectedPack.points > REVIEW_THRESHOLD ? (
              <Text as="p" size="sm" tone="secondary">
                {copy.reviewNote}
              </Text>
            ) : null}
          </div>
        ) : null}

        <div className="flex flex-col gap-2">
          <div className="flex items-start gap-2">
            <span className="flex size-6 shrink-0 items-center justify-center">
              {/* CheckboxListInput would wrap the label in a <label> — the
               * terms text embeds a Link, which cannot nest inside one, so
               * this pairs aria-labelledby by hand instead. */}
              <CheckboxButton
                aria-describedby={termsError ? termsErrorId : undefined}
                aria-invalid={termsError || undefined}
                aria-labelledby={termsLabelId}
                checked={terms}
                onCheckedChange={(checked) => {
                  setTerms(checked === true);
                  if (checked === true) setTermsError(false);
                }}
              />
            </span>
            <TermsText labelId={termsLabelId} />
          </div>
          {termsError ? (
            <p
              className="pl-8 text-sm text-destructive"
              id={termsErrorId}
              role="alert"
            >
              {copy.termsError}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          {state === "checkout-not-opened" ? (
            <Alert
              description={copy.notOpened.description}
              dismissible={false}
              status="error"
              title={copy.notOpened.title}
            />
          ) : null}
          <Button
            className="w-full"
            loading={busy}
            onClick={onContinue}
            size="lg"
          >
            {busy ? copy.opening : copy.continue}
          </Button>
          <Text as="p" size="sm" tone="secondary">
            {copy.paymentNote}
          </Text>
          <Text as="p" size="xs" tone="muted">
            {copy.smallPrint}
          </Text>
          <Link href={storyHref(TOP_UP_HISTORY_STORY_ID)} size="sm">
            {copy.historyLink}
          </Link>
        </div>
      </>
    );

  return (
    <div className="flex min-h-dvh w-full flex-col gap-4 bg-muted p-4 sm:p-8">
      <TopUpsPrototypeNote settles="the screen the picker opens over, how it is dismissed, what the pack tile keeps of the discount, and the terms words Legal confirms." />
      <Button
        className="w-fit"
        onClick={() => setOpen(true)}
        variant="secondary"
      >
        {copy.title}
      </Button>
      {smUp ? (
        <Dialog onOpenChange={setOpen} open={open}>
          <DialogContent className="max-w-(--container-md) gap-4">
            <DialogHeader>
              <DialogTitle>{copy.title}</DialogTitle>
              <DialogSubtext>
                {copy.description}
                <span className="mt-1 block font-medium text-foreground">
                  {copy.balance(MEMBER_BALANCE.total)}
                </span>
                <span className="mt-1 flex gap-6">
                  <span>
                    {copy.balanceEarned}{" "}
                    <span className="text-foreground">
                      {copy.packPoints(MEMBER_BALANCE.earned)}
                    </span>
                  </span>
                  <span>
                    {copy.balanceToppedUp}{" "}
                    <span className="text-foreground">
                      {copy.packPoints(MEMBER_BALANCE.toppedUp)}
                    </span>
                  </span>
                </span>
              </DialogSubtext>
            </DialogHeader>
            <DialogBody className="gap-5">{body}</DialogBody>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer onOpenChange={setOpen} open={open} swipeDirection="down">
          <DrawerContent className="bg-popover backdrop-blur-none [--drawer-bleed-background:var(--popover)]">
            <DrawerHeader>
              <DrawerTitle className="text-xl">{copy.title}</DrawerTitle>
              <DrawerDescription>
                {copy.description}
                <span className="mt-1 block font-medium text-foreground">
                  {copy.balance(MEMBER_BALANCE.total)}
                </span>
                <span className="mt-1 flex gap-6">
                  <span>
                    {copy.balanceEarned}{" "}
                    <span className="text-foreground">
                      {copy.packPoints(MEMBER_BALANCE.earned)}
                    </span>
                  </span>
                  <span>
                    {copy.balanceToppedUp}{" "}
                    <span className="text-foreground">
                      {copy.packPoints(MEMBER_BALANCE.toppedUp)}
                    </span>
                  </span>
                </span>
              </DrawerDescription>
            </DrawerHeader>
            <DrawerBody className="gap-5">{body}</DrawerBody>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}

export type { TopUpDialogState };
export { TopUpDialogPrototype };

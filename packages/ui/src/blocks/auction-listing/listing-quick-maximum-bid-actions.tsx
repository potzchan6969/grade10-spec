import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { StepperInput } from "@grade10/design-system/components/forms/stepper-input";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@grade10/design-system/components/overlays/tooltip";
import { Info } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import type { ShippedLocale } from "../../lib/format-datetime";
import { currencyExponent, formatMoney } from "../../lib/format-money";
import { isMaximumBelowFloor, resolveMaximumFloor } from "./listing-bid-money";
import type { ListingAuctionBidView } from "./types";

const PRESET_INCREMENTS = [
  { multiples: 1, captionKey: "nextEligible" as const },
  { multiples: 2, captionKey: "twoIncrements" as const },
  { multiples: 4, captionKey: "fourIncrements" as const },
];

type ListingQuickMaximumBidActionsCopy = {
  setPrivateMaximum: string;
  raisePrivateMaximum: string;
  chooseAnotherAmount: string;
  backToQuickAmounts: string;
  reviewMaximum: string;
  privateMaximumExplainer: string;
  privateMaximumTooltip: string;
  stepperMessage: string;
  bidImmediate: string;
  bidUpTo: string;
  nextEligibleBid: string;
  twoIncrementsAboveCurrent: string;
  fourIncrementsAboveCurrent: string;
  minimumRaise: string;
  oneIncrementAboveMinimum: string;
  threeIncrementsAboveMinimum: string;
};

type MarketComps = {
  title: string;
  range: string;
};

type ListingQuickMaximumBidActionsProps = {
  copy: ListingQuickMaximumBidActionsCopy;
  view: ListingAuctionBidView;
  locale: ShippedLocale;
  marketComps?: MarketComps;
  onCommitMaximum: (amountMinor: number) => void;
};

function toMajor(minor: number, currency: string): number {
  return minor / 10 ** currencyExponent(currency);
}

function toMinor(major: number, currency: string): number {
  return Math.round(major * 10 ** currencyExponent(currency));
}

function ListingQuickMaximumBidActions({
  copy,
  view,
  locale,
  marketComps,
  onCommitMaximum,
}: ListingQuickMaximumBidActionsProps) {
  const hasCommittedMaximum = view.viewerMaximumMinor != null;
  const maximumFloor = resolveMaximumFloor({
    minBidMinor: view.minBidMinor,
    incrementMinor: view.incrementMinor,
    viewerMaximumMinor: view.viewerMaximumMinor,
    standing: view.standing,
    currentBidMinor: view.currentBidMinor,
  });
  const floorMaximumMinor = maximumFloor.floorMinor;
  const floorMajor = toMajor(floorMaximumMinor, view.currency);
  const incrementMajor = toMajor(view.incrementMinor, view.currency);

  const [customOpen, setCustomOpen] = useState(false);
  const [maximumMajor, setMaximumMajor] = useState(floorMajor);

  useEffect(() => {
    setMaximumMajor(floorMajor);
  }, [floorMajor]);

  const presets = useMemo(() => {
    const captionFor = (
      key: (typeof PRESET_INCREMENTS)[number]["captionKey"],
    ) => {
      switch (key) {
        case "nextEligible":
          return copy.nextEligibleBid;
        case "twoIncrements":
          return copy.twoIncrementsAboveCurrent;
        case "fourIncrements":
          return copy.fourIncrementsAboveCurrent;
      }
    };

    const fromCurrent = PRESET_INCREMENTS.map(({ multiples, captionKey }) => {
      const amountMinor =
        multiples === 1 && !view.hasBids
          ? floorMaximumMinor
          : view.currentBidMinor + view.incrementMinor * multiples;
      return {
        key: `current-${multiples}`,
        caption: captionFor(captionKey),
        amountMinor,
        immediate: multiples === 1,
      };
    }).filter((preset) => preset.amountMinor >= floorMaximumMinor);

    if (fromCurrent.length > 0) return fromCurrent;

    return [
      {
        key: "floor",
        caption: copy.minimumRaise,
        amountMinor: floorMaximumMinor,
        immediate: true,
      },
      {
        key: "floor-1",
        caption: copy.oneIncrementAboveMinimum,
        amountMinor: floorMaximumMinor + view.incrementMinor,
        immediate: false,
      },
      {
        key: "floor-3",
        caption: copy.threeIncrementsAboveMinimum,
        amountMinor: floorMaximumMinor + view.incrementMinor * 3,
        immediate: false,
      },
    ];
  }, [
    copy.fourIncrementsAboveCurrent,
    copy.minimumRaise,
    copy.nextEligibleBid,
    copy.oneIncrementAboveMinimum,
    copy.threeIncrementsAboveMinimum,
    copy.twoIncrementsAboveCurrent,
    floorMaximumMinor,
    view.currentBidMinor,
    view.hasBids,
    view.incrementMinor,
  ]);

  const maximumMinor = toMinor(maximumMajor, view.currency);
  const maximumInvalid = isMaximumBelowFloor(maximumMinor, floorMaximumMinor);
  const stepperMessage = copy.stepperMessage
    .replace(
      "{increment}",
      formatMoney(view.incrementMinor, view.currency, { locale }),
    )
    .replace(
      "{amount}",
      formatMoney(floorMaximumMinor, view.currency, { locale }),
    );

  const heading = hasCommittedMaximum
    ? copy.raisePrivateMaximum.replace(
        "{amount}",
        formatMoney(view.viewerMaximumMinor ?? 0, view.currency, { locale }),
      )
    : copy.setPrivateMaximum;

  function handleReviewMaximum() {
    if (maximumInvalid) {
      setMaximumMajor(floorMajor);
      return;
    }
    onCommitMaximum(maximumMinor);
  }

  function openCustom() {
    setMaximumMajor(floorMajor);
    setCustomOpen(true);
  }

  return (
    <VStack className="w-full" gap="sm">
      <HStack gap="xs" vAlign="center">
        <Text
          className="text-secondary-foreground"
          size="sm"
          tone="secondary"
          weight="medium"
        >
          {heading}
        </Text>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              aria-label={copy.privateMaximumTooltip}
              className="inline-flex shrink-0 cursor-pointer text-secondary-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              onPointerDown={(event) => event.preventDefault()}
              render={<Info aria-hidden size={12} />}
            />
            <TooltipContent>{copy.privateMaximumTooltip}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </HStack>

      {customOpen ? (
        <VStack className="w-full" gap="sm">
          <StepperInput
            aria-label={heading}
            decrementLabel="Decrease maximum"
            incrementLabel="Increase maximum"
            message={stepperMessage}
            min={floorMajor}
            onValueChange={setMaximumMajor}
            size="md"
            status={maximumInvalid ? "error" : "default"}
            step={incrementMajor}
            value={maximumMajor}
          />
          {marketComps ? (
            <VStack className="w-full" gap="xs">
              <Text size="xs" tone="secondary" weight="medium">
                {marketComps.title}
              </Text>
              <Text size="sm" tone="secondary">
                {marketComps.range}
              </Text>
            </VStack>
          ) : null}
          <Button
            className="w-full"
            disabled={maximumInvalid}
            onClick={handleReviewMaximum}
            size="md"
          >
            {copy.reviewMaximum}
          </Button>
          <Button
            className="w-full"
            onClick={() => setCustomOpen(false)}
            size="md"
            variant="ghost"
          >
            {copy.backToQuickAmounts}
          </Button>
        </VStack>
      ) : (
        <VStack className="w-full" gap="sm">
          {presets.map((preset) => {
            const amountLabel = formatMoney(preset.amountMinor, view.currency, {
              locale,
            });
            const labelTemplate = preset.immediate
              ? copy.bidImmediate
              : copy.bidUpTo;
            return (
              <Button
                className="h-auto w-full flex-col items-start gap-0.5 px-4 py-3 text-left whitespace-normal"
                key={preset.key}
                onClick={() => onCommitMaximum(preset.amountMinor)}
                size="md"
                variant="outline"
              >
                <span className="text-sm font-medium">
                  {labelTemplate.replace("{amount}", amountLabel)}
                </span>
                <span className="text-xs font-normal text-secondary-foreground">
                  {preset.caption}
                </span>
              </Button>
            );
          })}
          <Button
            className="w-full"
            onClick={openCustom}
            size="md"
            variant="ghost"
          >
            {copy.chooseAnotherAmount}
          </Button>
        </VStack>
      )}

      <Text size="xs" tone="secondary">
        {copy.privateMaximumExplainer}
      </Text>
    </VStack>
  );
}

export type {
  ListingQuickMaximumBidActionsCopy,
  ListingQuickMaximumBidActionsProps,
  MarketComps,
};
export { ListingQuickMaximumBidActions };

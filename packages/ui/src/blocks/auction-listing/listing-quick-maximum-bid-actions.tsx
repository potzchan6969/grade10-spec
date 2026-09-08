import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { Link } from "@grade10/design-system/components/forms/link";
import { NumberInput } from "@grade10/design-system/components/forms/number-input";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@grade10/design-system/components/overlays/tooltip";
import { cn } from "@grade10/design-system/lib/utils";
import { Info } from "@phosphor-icons/react";
import { type FormEvent, type KeyboardEvent, useMemo, useState } from "react";
import type { ShippedLocale } from "../../lib/format-datetime";
import {
  formatMoney,
  formatMoneyNumeric,
  formatMoneyPrefix,
} from "../../lib/format-money";
import {
  isMaximumBelowFloor,
  parseExactMoneyDraftToMinor,
  resolveMaximumFloor,
  sanitizeMoneyDraft,
  validateCommittedMaximumMinor,
  wholeMajorDraftFromMinor,
} from "./listing-bid-money";
import type { ListingAuctionBidView } from "./types";

const PRESET_INCREMENTS = [
  { multiples: 1, captionKey: "nextEligible" as const },
  { multiples: 2, captionKey: "twoIncrements" as const },
  { multiples: 4, captionKey: "fourIncrements" as const },
];

type ListingQuickMaximumBidActionsCopy = {
  setPrivateMaximum: string;
  /** Mode title when a maximum is already committed — no amount; use `currentMaximum`. */
  raisePrivateMaximum: string;
  /** Shown under the raise title, e.g. "Max: {amount}". */
  currentMaximum: string;
  /** e.g. "Set maximum to {amount}" — first maximum above the floor. */
  reviewMaximum: string;
  /** e.g. "Raise maximum to {amount}" — when a maximum is already committed and above the floor. */
  raiseMaximumReview: string;
  /** e.g. "Bid now at {amount}" — when the commit amount is the minimum eligible bid. */
  bidNowReview: string;
  /** Privacy + ceiling; mechanism is a short reinforcing line. */
  privateMaximumTooltip: string;
  /**
   * Always-on mechanism line under the primary action — e.g. we bid as needed,
   * hold matches the maximum, raise only.
   */
  maximumMechanismSubtext: string;
  /** Placeholder when the custom field is empty, e.g. "Custom amount (min. {amount})". */
  customAmountPlaceholder: string;
  /** Shown under the custom field when the typed amount is below the floor, e.g. "Min.: {amount}". */
  stepperMessage: string;
  /** Shown when the draft cannot be parsed as a money amount. */
  invalidAmount: string;
  useMinimum: string;
  bidImmediate: string;
  bidUpTo: string;
  /** Caption for the floor / next-increment preset, e.g. "Min. bid". */
  nextEligibleBid: string;
  /** e.g. "{amount} vs current" — money delta above the current bid. */
  amountAboveCurrent: string;
  /** e.g. "{amount} vs max" — money delta above the viewer's private maximum. */
  amountAboveMaximum: string;
};

type ListingQuickMaximumBidActionsProps = {
  copy: ListingQuickMaximumBidActionsCopy;
  view: ListingAuctionBidView;
  locale: ShippedLocale;
  onCommitMaximum: (amountMinor: number) => void;
};

type MaximumPreset = {
  key: string;
  caption: string;
  amountMinor: number;
  immediate: boolean;
};

function defaultPresetKey(presets: MaximumPreset[]): string | null {
  if (presets.length === 0) return null;
  return presets[Math.floor(presets.length / 2)]?.key ?? null;
}

function ListingQuickMaximumBidActions({
  copy,
  view,
  locale,
  onCommitMaximum,
}: ListingQuickMaximumBidActionsProps) {
  const hasCommittedMaximum = view.viewerMaximumMinor != null;
  /** Already leading under a private maximum — raise only; floor chip is not a bid. */
  const isLeadingWithMaximum = view.standing === "leading-max";
  const maximumFloor = resolveMaximumFloor({
    minBidMinor: view.minBidMinor,
    incrementMinor: view.incrementMinor,
    viewerMaximumMinor: view.viewerMaximumMinor,
    standing: view.standing,
    currentBidMinor: view.currentBidMinor,
  });
  const floorMaximumMinor = maximumFloor.floorMinor;

  const [selectedPresetKey, setSelectedPresetKey] = useState<string | null>(
    null,
  );
  const [customDraft, setCustomDraft] = useState("");

  const presets = useMemo((): MaximumPreset[] => {
    const formatDelta = (deltaMinor: number) =>
      `$${formatMoneyNumeric(deltaMinor, view.currency, locale)}`;
    const raiseDeltaTemplate = isLeadingWithMaximum
      ? copy.amountAboveMaximum
      : copy.amountAboveCurrent;

    const fromCurrent = PRESET_INCREMENTS.flatMap(
      ({ multiples, captionKey }): MaximumPreset[] => {
        // Skip "Min. bid" while leading — the custom field already states the
        // raise floor, and a $1 nudge is not a useful quick pick.
        if (isLeadingWithMaximum && captionKey === "nextEligible") {
          return [];
        }
        const amountMinor =
          multiples === 1 && !view.hasBids
            ? floorMaximumMinor
            : view.currentBidMinor + view.incrementMinor * multiples;
        if (amountMinor < floorMaximumMinor) return [];
        const caption =
          captionKey === "nextEligible"
            ? copy.nextEligibleBid
            : raiseDeltaTemplate.replace(
                "{amount}",
                formatDelta(view.incrementMinor * multiples),
              );
        return [
          {
            key: `current-${multiples}`,
            caption,
            amountMinor,
            immediate: multiples === 1,
          },
        ];
      },
    );

    if (fromCurrent.length > 0) return fromCurrent;

    // Raise floor sits above current+step presets. While leading, skip the
    // floor chip and offer increments above it with "vs max" captions.
    const fallbackSteps = isLeadingWithMaximum ? [1, 2, 4] : [0, 2, 4];
    return fallbackSteps.map((steps) => {
      const amountMinor = floorMaximumMinor + view.incrementMinor * steps;
      const deltaMinor = view.incrementMinor * steps;
      const isFloor = steps === 0;
      const caption =
        isFloor && !isLeadingWithMaximum
          ? copy.nextEligibleBid
          : raiseDeltaTemplate.replace("{amount}", formatDelta(deltaMinor));
      return {
        key: `floor-${steps}`,
        caption,
        amountMinor,
        immediate: isFloor && !isLeadingWithMaximum,
      };
    });
  }, [
    copy.amountAboveCurrent,
    copy.amountAboveMaximum,
    copy.nextEligibleBid,
    floorMaximumMinor,
    isLeadingWithMaximum,
    locale,
    view.currency,
    view.currentBidMinor,
    view.hasBids,
    view.incrementMinor,
  ]);

  const customActive = customDraft.trim() !== "";
  const customMinor = customActive
    ? parseExactMoneyDraftToMinor(customDraft, view.currency)
    : null;
  const resolvedPresetKey = customActive
    ? null
    : selectedPresetKey != null &&
        presets.some((preset) => preset.key === selectedPresetKey)
      ? selectedPresetKey
      : defaultPresetKey(presets);
  const selectedPreset =
    presets.find((preset) => preset.key === resolvedPresetKey) ?? null;

  const commitMinor = customActive
    ? customMinor
    : (selectedPreset?.amountMinor ?? null);
  const commitValidation =
    commitMinor != null
      ? validateCommittedMaximumMinor({
          amountMinor: commitMinor,
          floorMinor: floorMaximumMinor,
        })
      : null;
  const maximumInvalid =
    commitMinor != null && isMaximumBelowFloor(commitMinor, floorMaximumMinor);
  const canPlaceBid = commitValidation?.ok === true;

  const heading = hasCommittedMaximum
    ? copy.raisePrivateMaximum
    : copy.setPrivateMaximum;
  const currentMaximumLabel =
    hasCommittedMaximum && view.viewerMaximumMinor != null
      ? copy.currentMaximum.replace(
          "{amount}",
          formatMoney(view.viewerMaximumMinor, view.currency, { locale }),
        )
      : null;

  // Floor amount while leading is a maximum raise, not an immediate bid.
  const isMinimumBid =
    commitMinor != null &&
    commitMinor === floorMaximumMinor &&
    !isLeadingWithMaximum;
  const actionTemplate = isMinimumBid
    ? copy.bidNowReview
    : hasCommittedMaximum
      ? copy.raiseMaximumReview
      : copy.reviewMaximum;
  const placeBidLabel =
    commitMinor != null
      ? actionTemplate.replace(
          "{amount}",
          formatMoney(commitMinor, view.currency, { locale }),
        )
      : actionTemplate
          .replace(" to {amount}", "")
          .replace(" at {amount}", "")
          .replace(" · {amount}", "")
          .replace("{amount}", "");

  const floorAmountLabel = formatMoney(floorMaximumMinor, view.currency, {
    locale,
  });
  const customPlaceholder = copy.customAmountPlaceholder.replace(
    "{amount}",
    formatMoneyNumeric(floorMaximumMinor, view.currency, locale),
  );
  const floorHelper = copy.stepperMessage.replace("{amount}", floorAmountLabel);

  function handleSelectPreset(preset: MaximumPreset) {
    setSelectedPresetKey(preset.key);
    setCustomDraft("");
  }

  function handleCustomChange(next: string) {
    const sanitized = sanitizeMoneyDraft(next, view.currency);
    setCustomDraft(sanitized);
    if (sanitized.trim() === "") {
      setSelectedPresetKey(defaultPresetKey(presets));
    } else {
      setSelectedPresetKey(null);
    }
  }

  function handleCustomKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "." || event.key === ",") {
      event.preventDefault();
    }
  }

  function handleCustomBeforeInput(event: FormEvent<HTMLInputElement>) {
    const data = (event.nativeEvent as InputEvent).data;
    if (data === "." || data === ",") {
      event.preventDefault();
    }
  }

  function handleUseMinimum() {
    setCustomDraft(wholeMajorDraftFromMinor(floorMaximumMinor, view.currency));
    setSelectedPresetKey(null);
  }

  function handleClearCustom() {
    setCustomDraft("");
    setSelectedPresetKey(defaultPresetKey(presets));
  }

  function handlePlaceBid() {
    if (commitValidation?.ok !== true) return;
    onCommitMaximum(commitValidation.amountMinor);
  }

  const customInvalid = customActive && (customMinor == null || maximumInvalid);
  const helperMessage = !customActive ? undefined : customMinor == null ? (
    copy.invalidAmount
  ) : maximumInvalid ? (
    <>
      {floorHelper}
      {" · "}
      <Link
        className="align-baseline"
        onClick={handleUseMinimum}
        render={<button type="button" />}
        size="xs"
        variant="secondary"
      >
        {copy.useMinimum}
      </Link>
    </>
  ) : undefined;

  return (
    <VStack className="w-full" gap="md">
      <VStack className="w-full" gap="xs">
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
        {currentMaximumLabel != null ? (
          <Text
            className="tabular-nums text-foreground"
            size="sm"
            weight="medium"
          >
            {currentMaximumLabel}
          </Text>
        ) : null}
        <Text className="text-secondary-foreground" size="xs">
          {copy.maximumMechanismSubtext}
        </Text>
      </VStack>

      <VStack className="w-full" gap="sm">
        <HStack className="w-full" gap="sm" role="group">
          {presets.map((preset) => {
            const amountLabel = formatMoney(preset.amountMinor, view.currency, {
              locale,
            });
            const selected = selectedPreset?.key === preset.key;
            const accessibleName = (
              preset.immediate ? copy.bidImmediate : copy.bidUpTo
            ).replace("{amount}", amountLabel);
            return (
              <Button
                aria-label={accessibleName}
                aria-pressed={selected}
                className={cn(
                  "h-auto min-w-0 flex-1 flex-col items-center gap-0.5 rounded-(--radius-xl) px-1.5 py-3 text-center whitespace-normal",
                  customActive && "opacity-50",
                  selected &&
                    "border-success-ring hover:border-success-ring focus-visible:border-success-ring focus-visible:ring-success-ring/50",
                )}
                key={preset.key}
                onClick={() => handleSelectPreset(preset)}
                size="md"
                variant="outline"
              >
                <span className="text-xs font-normal leading-tight text-secondary-foreground text-balance">
                  {preset.caption}
                </span>
                <span className="text-sm font-medium leading-tight tabular-nums">
                  {amountLabel}
                </span>
              </Button>
            );
          })}
        </HStack>

        <NumberInput
          aria-label={customPlaceholder}
          className={cn("w-full", !customActive && "opacity-50")}
          inputMode="numeric"
          message={helperMessage}
          onBeforeInput={handleCustomBeforeInput}
          onChange={(event) => handleCustomChange(event.target.value)}
          onClear={customActive ? handleClearCustom : undefined}
          onKeyDown={handleCustomKeyDown}
          placeholder={customPlaceholder}
          prefix={formatMoneyPrefix(view.currency, { locale })}
          status={customInvalid ? "error" : "default"}
          value={customDraft}
        />
      </VStack>

      <Button
        className="w-full"
        disabled={!canPlaceBid}
        onClick={handlePlaceBid}
        size="md"
      >
        {placeBidLabel}
      </Button>
    </VStack>
  );
}

export type {
  ListingQuickMaximumBidActionsCopy,
  ListingQuickMaximumBidActionsProps,
};
export { ListingQuickMaximumBidActions };

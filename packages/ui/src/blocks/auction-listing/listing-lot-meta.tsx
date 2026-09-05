import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import { Link } from "@grade10/design-system/components/forms/link";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import { CaretDown } from "@phosphor-icons/react";
import {
  type TransitionEvent,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { ListingLotMetaBadge } from "./types";

type ListingLotMetaCopy = {
  aboutThisLot: string;
  vaultShipping: string;
  result: string;
  showMore: string;
  showLess: string;
};

type ListingLotMetaFact = {
  label: string;
  value: string;
};

type ListingLotMarketComps = {
  title: string;
  range: string;
};

type ListingLotMetaProps = {
  copy: ListingLotMetaCopy;
  badges: readonly ListingLotMetaBadge[];
  description: string;
  vaultShippingBody: string;
  resultFact?: string;
  /** Cataloguing facts under About this lot (year, set, grade, cert, …). */
  facts?: readonly ListingLotMetaFact[];
  /** Comparable sales, shown as a section under About this lot. */
  marketComps?: ListingLotMarketComps;
};

const DESCRIPTION_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const DESCRIPTION_DURATION_MS = 250;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function ListingLotMeta({
  copy,
  badges,
  description,
  vaultShippingBody,
  resultFact,
  facts,
  marketComps,
}: ListingLotMetaProps) {
  const hasFacts = facts != null && facts.length > 0;
  const hasBadges = badges.length > 0;
  const descriptionId = useId();
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const collapsedHeightRef = useRef<number | null>(null);
  const collapsePendingRef = useRef(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [descriptionOverflows, setDescriptionOverflows] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animatedHeight, setAnimatedHeight] = useState<number | "auto">("auto");

  useLayoutEffect(() => {
    setDescriptionExpanded(false);
    setDescriptionOverflows(false);
    setIsAnimating(false);
    setAnimatedHeight("auto");
    collapsedHeightRef.current = null;
    collapsePendingRef.current = false;
  }, []);

  useLayoutEffect(() => {
    const element = descriptionRef.current;
    if (!element || descriptionExpanded || isAnimating) return;

    const updateOverflow = () => {
      collapsedHeightRef.current = element.clientHeight;
      setDescriptionOverflows(element.scrollHeight > element.clientHeight + 1);
    };

    updateOverflow();
    const resizeObserver = new ResizeObserver(updateOverflow);
    resizeObserver.observe(element);
    return () => resizeObserver.disconnect();
  }, [descriptionExpanded, isAnimating]);

  const toggleDescription = () => {
    const element = descriptionRef.current;
    if (!element || isAnimating) return;

    if (prefersReducedMotion()) {
      setDescriptionExpanded((value) => !value);
      return;
    }

    if (!descriptionExpanded) {
      const from = element.clientHeight;
      collapsedHeightRef.current = from;
      collapsePendingRef.current = false;
      setIsAnimating(true);
      setAnimatedHeight(from);
      setDescriptionExpanded(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimatedHeight(element.scrollHeight);
        });
      });
      return;
    }

    const from = element.getBoundingClientRect().height;
    const to = collapsedHeightRef.current ?? from;
    collapsePendingRef.current = true;
    setIsAnimating(true);
    setAnimatedHeight(from);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setAnimatedHeight(to);
      });
    });
  };

  const handleDescriptionTransitionEnd = (
    event: TransitionEvent<HTMLParagraphElement>,
  ) => {
    if (event.propertyName !== "height" || !isAnimating) return;
    setIsAnimating(false);
    setAnimatedHeight("auto");
    if (collapsePendingRef.current) {
      collapsePendingRef.current = false;
      setDescriptionExpanded(false);
    }
  };

  const clampDescription =
    !descriptionExpanded && animatedHeight === "auto" && !isAnimating;

  return (
    <VStack className="w-full" data-slot="listing-lot-meta" gap="lg">
      <VStack gap="md">
        <Text className="font-semibold">{copy.aboutThisLot}</Text>

        {hasFacts ? (
          <VStack className="w-full" gap="xs">
            {facts.map((fact) => (
              <HStack
                className="w-full"
                gap="sm"
                hAlign="space-between"
                key={fact.label}
                wrap
              >
                <Text
                  className="shrink-0 uppercase text-secondary-foreground"
                  size="sm"
                  weight="medium"
                >
                  {fact.label}
                </Text>
                <Text className="min-w-0 text-right" size="sm" weight="medium">
                  {fact.value}
                </Text>
              </HStack>
            ))}
          </VStack>
        ) : null}

        {hasBadges ? (
          <HStack className="flex-wrap" gap="sm">
            {badges.map((badge) => (
              <Badge key={badge.label} size="sm">
                {badge.label}
              </Badge>
            ))}
          </HStack>
        ) : null}

        <VStack gap="sm">
          <p
            className={cn(
              "text-sm leading-snug text-foreground motion-reduce:transition-none",
              isAnimating && "overflow-hidden",
              clampDescription && "line-clamp-3",
            )}
            id={descriptionId}
            onTransitionEnd={handleDescriptionTransitionEnd}
            ref={descriptionRef}
            style={{
              height: animatedHeight === "auto" ? undefined : animatedHeight,
              transitionProperty: isAnimating ? "height" : undefined,
              transitionDuration: isAnimating
                ? `${DESCRIPTION_DURATION_MS}ms`
                : undefined,
              transitionTimingFunction: isAnimating
                ? DESCRIPTION_EASE
                : undefined,
            }}
          >
            {description}
          </p>
          {descriptionOverflows ? (
            <Link
              aria-controls={descriptionId}
              aria-expanded={descriptionExpanded}
              onClick={toggleDescription}
              render={<button type="button" />}
              size="sm"
              trailing={
                <span
                  className={cn(
                    "inline-flex transition-transform motion-reduce:transition-none",
                    descriptionExpanded && "rotate-180",
                  )}
                  style={{
                    transitionDuration: `${DESCRIPTION_DURATION_MS}ms`,
                    transitionTimingFunction: DESCRIPTION_EASE,
                  }}
                >
                  <CaretDown aria-hidden size={14} />
                </span>
              }
            >
              {descriptionExpanded ? copy.showLess : copy.showMore}
            </Link>
          ) : null}
        </VStack>
      </VStack>

      {marketComps ? (
        <VStack className="border-t border-border pt-6" gap="sm">
          <Text className="font-semibold">{marketComps.title}</Text>
          <Text size="sm">{marketComps.range}</Text>
        </VStack>
      ) : null}

      <VStack className="border-t border-border pt-6" gap="sm">
        <Text className="font-semibold">{copy.vaultShipping}</Text>
        <Text size="sm">{vaultShippingBody}</Text>
      </VStack>

      {resultFact ? (
        <VStack className="border-t border-border pt-6" gap="sm">
          <Text className="font-semibold">{copy.result}</Text>
          <Text size="sm">{resultFact}</Text>
        </VStack>
      ) : null}
    </VStack>
  );
}

export type {
  ListingLotMarketComps,
  ListingLotMetaCopy,
  ListingLotMetaFact,
  ListingLotMetaProps,
};
export { ListingLotMeta };

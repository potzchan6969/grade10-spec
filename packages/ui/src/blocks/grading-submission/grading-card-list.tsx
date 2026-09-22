import {
  Card,
  CardContent,
} from "@grade10/design-system/components/display/card";
import { EmptyState } from "@grade10/design-system/components/display/empty-state";
import { Skeleton } from "@grade10/design-system/components/display/skeleton";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { CheckboxListInput } from "@grade10/design-system/components/forms/checkbox-list-input";
import { NumberInput } from "@grade10/design-system/components/forms/number-input";
import { TextInput } from "@grade10/design-system/components/forms/text-input";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { AsyncState } from "../shared/async";
import { AsyncMessage } from "../shared/async-message";
import { formatGradingMoney, type GradingLocaleProps } from "./grading-copy";
import type { GradingCardMatch, GradingListedCard } from "./types";

/** What the collector added: the reference's card, or the name as typed. */
type GradingCardAddition =
  | { kind: "matched"; match: GradingCardMatch }
  | { kind: "typed"; name: string };

/** The cap on one submission, and the level the count leaves open. */
type GradingCardListCap = {
  count: number;
  /** The cap in the consumer's words. */
  line: string;
  /** The level this many cards closes, where the consumer names one. */
  closesLevelLine?: string;
};

type GradingCardListCopy = {
  title: string;
  /** Labels the field a card is added through. */
  searchLabel: string;
  searchPlaceholder: string;
  /** Adds the name the collector typed, matched or not. */
  addTyped: string;
  paste: string;
  emptyTitle: string;
  emptyBody: string;
  matched: string;
  keptAsTyped: string;
  /** Read on every card while the reference cannot be asked. */
  catalogueUnavailable: string;
  noValue: string;
  declaredValueLabel: string;
  referenceSalesLabel: string;
  minimumGradeLabel: string;
  minimumGradeNote: string;
  edit: string;
  remove: string;
};

type GradingCardListProps = GradingLocaleProps & {
  copy: GradingCardListCopy;
  cards: readonly GradingListedCard[];
  cap: GradingCardListCap;
  /** Shown instead of an add once the list is at its cap. */
  capReachedLine?: string;
  query: string;
  search: AsyncState<readonly GradingCardMatch[]>;
  onSearch: (query: string) => void;
  onAdd: (addition: GradingCardAddition) => void;
  onEdit: (cardId: string) => void;
  onRemove: (cardId: string) => void;
  /** The value as the collector typed it; the consumer reads it into minor units. */
  onDeclare: (cardId: string, declared: string) => void;
  onMinimumGrade: (cardId: string, wanted: boolean) => void;
  onPaste: () => void;
  className?: string;
};

/**
 * The list a collector edits before hand-in, one card a row: matched in the
 * reference or kept as typed, its declared value, its reference sales and its
 * minimum grade.
 *
 * The cap, the card with no value and the card above a ceiling are each named
 * in the consumer's words. Every act reports through a callback of its own and
 * the list carries none of them out.
 */
function GradingCardList({
  copy,
  cards,
  cap,
  capReachedLine,
  query,
  search,
  onSearch,
  onAdd,
  onEdit,
  onRemove,
  onDeclare,
  onMinimumGrade,
  onPaste,
  locale = "en",
  className,
}: GradingCardListProps) {
  const atCap = cards.length >= cap.count;
  const unreachable = search.status === "error";

  return (
    <VStack className={className} data-slot="grading-card-list" gap="md">
      <HStack gap="sm" hAlign="space-between" vAlign="center">
        <Text as="h2" size="lg" weight="medium">
          {copy.title}
        </Text>
        {cards.length > 0 ? (
          <Button onClick={onPaste} size="sm" variant="secondary">
            {copy.paste}
          </Button>
        ) : null}
      </HStack>
      <VStack data-slot="grading-card-list-cap" gap="xs" hAlign="stretch">
        <Text size="sm" tone="secondary">
          {cap.line}
        </Text>
        {cap.closesLevelLine ? (
          <Text size="sm" tone="secondary">
            {cap.closesLevelLine}
          </Text>
        ) : null}
      </VStack>
      <VStack data-slot="grading-card-list-search" gap="sm" hAlign="stretch">
        <TextInput
          disabled={atCap}
          label={copy.searchLabel}
          onChange={(event) => onSearch(event.target.value)}
          placeholder={copy.searchPlaceholder}
          value={query}
        />
        {search.status === "loading" ? (
          <Skeleton className="h-10 w-full" />
        ) : null}
        {search.status === "ready" ? (
          <VStack gap="xs" hAlign="stretch">
            {search.data.map((match) => (
              <Button
                disabled={atCap}
                key={match.id}
                onClick={() => onAdd({ kind: "matched", match })}
                size="sm"
                variant="outline"
              >
                {`${match.name} · ${match.setLine}`}
              </Button>
            ))}
          </VStack>
        ) : null}
        {search.status === "empty" || search.status === "error" ? (
          <AsyncMessage
            action={search.action}
            message={search.message}
            slot={`grading-card-list-${search.status}`}
          />
        ) : null}
        {query.length > 0 && search.status !== "loading" ? (
          <Button
            disabled={atCap}
            onClick={() => onAdd({ kind: "typed", name: query })}
            size="sm"
            variant="secondary"
          >
            {copy.addTyped}
          </Button>
        ) : null}
        {atCap && capReachedLine ? (
          <Text data-slot="grading-card-list-at-cap" size="sm" tone="warning">
            {capReachedLine}
          </Text>
        ) : null}
      </VStack>
      {cards.length === 0 ? (
        <EmptyState
          actions={
            <Button onClick={onPaste} size="sm" variant="secondary">
              {copy.paste}
            </Button>
          }
          data-slot="grading-card-list-empty"
          description={copy.emptyBody}
          title={copy.emptyTitle}
        />
      ) : (
        <VStack gap="sm" hAlign="stretch">
          {cards.map((card) => (
            <ListedCard
              card={card}
              copy={copy}
              key={card.id}
              locale={locale}
              onDeclare={onDeclare}
              onEdit={onEdit}
              onMinimumGrade={onMinimumGrade}
              onRemove={onRemove}
              unreachable={unreachable}
            />
          ))}
        </VStack>
      )}
    </VStack>
  );
}

function ListedCard({
  card,
  copy,
  locale,
  onDeclare,
  onEdit,
  onMinimumGrade,
  onRemove,
  unreachable,
}: {
  card: GradingListedCard;
  copy: GradingCardListCopy;
  locale: GradingLocaleProps["locale"];
  onDeclare: GradingCardListProps["onDeclare"];
  onEdit: GradingCardListProps["onEdit"];
  onMinimumGrade: GradingCardListProps["onMinimumGrade"];
  onRemove: GradingCardListProps["onRemove"];
  unreachable: boolean;
}) {
  const origin = unreachable
    ? copy.catalogueUnavailable
    : card.matched
      ? copy.matched
      : copy.keptAsTyped;

  return (
    <Card data-slot="grading-card-list-card">
      <CardContent>
        <VStack gap="sm" hAlign="stretch">
          <HStack gap="sm" hAlign="space-between" vAlign="start">
            <VStack gap="none" hAlign="stretch">
              <Text weight="medium">{card.name}</Text>
              <Text size="sm" tone="secondary">
                {card.setLine}
              </Text>
              <Text
                data-slot="grading-card-list-origin"
                size="xs"
                tone="secondary"
              >
                {origin}
              </Text>
            </VStack>
            <HStack gap="xs" vAlign="center">
              <Button
                onClick={() => onEdit(card.id)}
                size="sm"
                variant="secondary"
              >
                {copy.edit}
              </Button>
              <Button
                onClick={() => onRemove(card.id)}
                size="sm"
                variant="ghost"
              >
                {copy.remove}
              </Button>
            </HStack>
          </HStack>
          {card.declaredValue ? (
            <Text size="sm">
              {`${copy.declaredValueLabel}: ${formatGradingMoney(card.declaredValue, locale)}`}
            </Text>
          ) : (
            <VStack gap="xs" hAlign="stretch">
              <NumberInput
                label={copy.declaredValueLabel}
                onChange={(event) => onDeclare(card.id, event.target.value)}
              />
              <Text
                data-slot="grading-card-list-no-value"
                size="sm"
                tone="warning"
              >
                {copy.noValue}
              </Text>
            </VStack>
          )}
          {card.aboveCeilingLine ? (
            <Text
              data-slot="grading-card-list-above-ceiling"
              size="sm"
              tone="warning"
            >
              {card.aboveCeilingLine}
            </Text>
          ) : null}
          {card.referenceSales && card.referenceSales.length > 0 ? (
            <VStack
              data-slot="grading-card-list-reference"
              gap="none"
              hAlign="stretch"
            >
              <Text size="xs" tone="secondary">
                {copy.referenceSalesLabel}
              </Text>
              {card.referenceSales.map((sale) => (
                <Text key={sale.id} size="sm" tone="secondary">
                  {`${sale.label}: ${formatGradingMoney(sale.price, locale)}`}
                </Text>
              ))}
            </VStack>
          ) : null}
          <VStack gap="none" hAlign="stretch">
            <CheckboxListInput
              checked={card.minimumGrade != null}
              onCheckedChange={(next) => onMinimumGrade(card.id, next)}
              size="sm"
            >
              {card.minimumGrade
                ? `${copy.minimumGradeLabel}: ${card.minimumGrade}`
                : copy.minimumGradeLabel}
            </CheckboxListInput>
            <Text size="xs" tone="secondary">
              {copy.minimumGradeNote}
            </Text>
          </VStack>
        </VStack>
      </CardContent>
    </Card>
  );
}

export type {
  GradingCardAddition,
  GradingCardListCap,
  GradingCardListCopy,
  GradingCardListProps,
};
export { GradingCardList };

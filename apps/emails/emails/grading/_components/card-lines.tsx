import { Section, Text } from "react-email";

export type CardLine = {
  /** The grade in the grader's words, or the ungraded code. */
  mark: string;
  name: string;
  /** `PSA 10 GEM MT · cert 98765433`, or the grader's note on a raw card. */
  detail: string;
  /** A badge line under the card — moved up a level, held, not returned. */
  note?: string;
};

export type CardLinesProps = {
  cards: CardLine[];
};

/** One line a card: the grade, the name, the cert or the ungraded code. */
export function CardLines({ cards }: CardLinesProps) {
  return (
    <Section className="my-6">
      {cards.map((card) => (
        <Section
          className="mb-3 border-0 border-l-2 border-solid border-stroke pl-4"
          key={`${card.mark}:${card.name}`}
        >
          <Text className="mb-0.5 mt-0 text-sm font-bold text-secondary-fg">
            {card.mark}
          </Text>
          <Text className="mb-0.5 mt-0 text-lg font-bold leading-tight text-fg">
            {card.name}
          </Text>
          <Text className="m-0 text-sm text-secondary-fg">{card.detail}</Text>
          {card.note ? (
            <Text className="mb-0 mt-0.5 text-sm text-fg-2">{card.note}</Text>
          ) : null}
        </Section>
      ))}
    </Section>
  );
}

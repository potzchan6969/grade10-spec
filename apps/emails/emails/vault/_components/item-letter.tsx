import type { ReactNode } from "react";
import { Section, Text } from "react-email";

import type { EmailFooterProps } from "@/emails/_components/email-footer";
import {
  LetterShell,
  type LetterShellProps,
} from "@/emails/_components/letter-shell";
import {
  LotBlock,
  type LotBlockProps,
} from "@/emails/auction/_components/lot-block";
import {
  ItemLine,
  type ItemLineProps,
} from "@/emails/vault/_components/item-line";

export type { Fact } from "@/emails/_components/letter-shell";
export { FactsGroup, Note } from "@/emails/_components/letter-shell";

export type ItemLetterProps = Omit<LetterShellProps, "trailer" | "greeting"> & {
  /** The item's line above the footer; omitted when the block already names it. */
  itemLine?: ItemLineProps;
  /** Scannable bullets under the lead, like `AuctionLetter`'s `points`. */
  points?: string[];
  /** Paragraphs between the bullets and the item block. */
  afterPoints?: string[];
  /** The item itself, in the auction letters' `LotBlock` shape. */
  block: LotBlockProps;
  footer: EmailFooterProps;
};

/**
 * The shell every collector letter about a vault item is written in: the
 * `LetterShell` every letter shares, with the item's line as its trailer.
 * Every letter greets the same way, by no name: an item carries its
 * collector's address and not what they are called.
 *
 * Inside the shell the letter reads like an auction letter: the lead, its
 * bullet points, any paragraphs after them, then the item block the auction
 * letters draw for a lot — before whatever else the letter carries.
 */
export function ItemLetter({
  itemLine,
  points = [],
  afterPoints = [],
  block,
  children,
  ...shell
}: ItemLetterProps): ReactNode {
  return (
    <LetterShell
      {...shell}
      greeting="Hello,"
      trailer={itemLine ? <ItemLine {...itemLine} /> : null}
    >
      {points.length > 0 ? (
        <Section className="mb-2 mt-1">
          {points.map((point) => (
            <Text
              className="mb-1 mt-0 text-lg leading-base text-fg-2"
              key={point}
            >
              • {point}
            </Text>
          ))}
        </Section>
      ) : null}
      {afterPoints.map((paragraph) => (
        <Text
          className="mb-3 mt-0 text-lg leading-base text-fg-2"
          key={paragraph}
        >
          {paragraph}
        </Text>
      ))}
      <LotBlock {...block} />
      {children}
    </LetterShell>
  );
}

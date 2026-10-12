import type { ReactNode } from "react";

import type { EmailFooterProps } from "@/emails/_components/email-footer";
import {
  LetterShell,
  type LetterShellProps,
} from "@/emails/_components/letter-shell";
import {
  ItemLine,
  type ItemLineProps,
} from "@/emails/vault/_components/item-line";

export type { Fact } from "@/emails/_components/letter-shell";
export { FactsGroup, Note } from "@/emails/_components/letter-shell";

export type ItemLetterProps = Omit<LetterShellProps, "trailer" | "greeting"> & {
  itemLine: ItemLineProps;
  footer: EmailFooterProps;
};

/**
 * The shell every collector letter about a vault item is written in: the
 * `LetterShell` every letter shares, with the item's line as its trailer.
 * Every letter greets the same way, by no name: an item carries its
 * collector's address and not what they are called.
 */
export function ItemLetter({
  itemLine,
  children,
  ...shell
}: ItemLetterProps): ReactNode {
  return (
    <LetterShell
      {...shell}
      greeting="Hello,"
      trailer={<ItemLine {...itemLine} />}
    >
      {children}
    </LetterShell>
  );
}

import type { ReactNode } from "react";

import type { EmailFooterProps } from "@/emails/_components/email-footer";
import {
  LetterShell,
  type LetterShellProps,
} from "@/emails/_components/letter-shell";
import {
  CaseLine,
  type CaseLineProps,
} from "@/emails/vault/_components/case-line";

export type { Fact } from "@/emails/_components/letter-shell";
export { FactsGroup, Note } from "@/emails/_components/letter-shell";

export type VaultLetterProps = Omit<LetterShellProps, "trailer"> & {
  caseLine: CaseLineProps;
  footer: EmailFooterProps;
};

/**
 * The shell every collector letter about a case is written in: the
 * `LetterShell` every letter shares, with the case's line as its trailer.
 */
export function VaultLetter({
  caseLine,
  children,
  ...shell
}: VaultLetterProps): ReactNode {
  return (
    <LetterShell {...shell} trailer={<CaseLine {...caseLine} />}>
      {children}
    </LetterShell>
  );
}

import type { ReactNode } from "react";

import {
  LetterShell,
  type LetterShellProps,
} from "@/emails/_components/letter-shell";
import {
  SubmissionLine,
  type SubmissionLineProps,
} from "@/emails/grading/_components/submission-line";

export type { Fact } from "@/emails/_components/letter-shell";
export { FactsGroup, Note } from "@/emails/_components/letter-shell";

/** Who is writing, where, and on whose clock. A value Legal has not set is
 * written in brackets and `EmailFooter` marks it. */
export type GradingFooterProps = {
  /** The custodian's registered name. Unset outside production prints bracketed. */
  custodianName?: string;
  shopName: string;
  shopAddress?: string;
  complaintsContact?: string;
};

function footerLines({
  custodianName,
  shopName,
  shopAddress,
  complaintsContact,
}: GradingFooterProps): string[] {
  return [
    `${custodianName ?? "[Custodian registered name]"}, trading as Grade10. ${shopName} · ${shopAddress ?? "[Shop address]"}`,
    `Complaints: ${complaintsContact ?? "[Complaints contact]"}.`,
    "Dates and times are Hong Kong time.",
  ];
}

export type GradingLetterProps = Omit<
  LetterShellProps,
  "trailer" | "footer"
> & {
  submission: SubmissionLineProps;
  footer: GradingFooterProps & {
    /** Why this collector is reading it. The submission's own line by default. */
    whyYouGotThis?: string;
  };
};

/**
 * The shell every collector letter about a submission is written in: the
 * `LetterShell` every letter shares, with the submission's line as its
 * trailer and the shop's four facts as the footer's lines.
 */
export function GradingLetter({
  submission,
  footer,
  children,
  ...shell
}: GradingLetterProps): ReactNode {
  return (
    <LetterShell
      {...shell}
      footer={{
        lines: footerLines(footer),
        whyYouGotThis:
          footer.whyYouGotThis ??
          `You are getting this because you have a grading submission with us: ${submission.submissionId}.`,
      }}
      trailer={<SubmissionLine {...submission} />}
    >
      {children}
    </LetterShell>
  );
}

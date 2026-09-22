import { hkDate, money } from "@/emails/vault/_components/format";
import { HowToPay } from "@/emails/vault/_components/how-to-pay";
import { ReminderSchedule } from "@/emails/vault/_components/reminder-schedule";
import {
  FactsGroup,
  VaultLetter,
} from "@/emails/vault/_components/vault-letter";
import {
  footerLines,
  previewCase,
  previewCaseLine,
  previewHowToPay,
} from "@/emails/vault/fixtures";

export type RepaymentOverdueProps = {
  outstandingMinor?: number;
  dueAt?: string;
  lateInterestMinor?: number;
  lateDayMinor?: number;
};

export default function RepaymentOverdueEmail({
  outstandingMinor = previewCase.overdueOutstandingMinor,
  dueAt = previewCase.dueAt,
  lateInterestMinor = previewCase.overdueLateInterestMinor,
  lateDayMinor = previewCase.overdueLateDayMinor,
}: RepaymentOverdueProps) {
  const { itemTitle } = previewCase;

  return (
    <VaultLetter
      caseLine={previewCaseLine}
      cta={{ href: previewCase.url, label: "See what you owe" }}
      footer={{
        lines: footerLines("lender"),
        whyYouGotThis: "Your loan is past its due date.",
      }}
      greeting={`Hi ${previewCase.collectorName},`}
      heading="This loan is overdue"
      lead={`Your loan on ${itemTitle} was repayable by ${hkDate(dueAt)} and has not been settled. Interest is running on it at the same daily rate for every day it stays unpaid — there is no late fee and no higher rate.`}
      preheader={`${money(outstandingMinor)} outstanding, due since ${hkDate(dueAt)}.`}
    >
      <FactsGroup
        facts={[
          { label: "Outstanding today", value: money(outstandingMinor) },
          { label: "Was due", value: hkDate(dueAt) },
          { label: "Of that, late interest", value: money(lateInterestMinor) },
          { label: "Each further day adds", value: money(lateDayMinor) },
        ]}
      />
      <HowToPay {...previewHowToPay} outstandingMinor={outstandingMinor} />
      <ReminderSchedule dates={previewCase.reminderScheduleOverdue} />
    </VaultLetter>
  );
}

RepaymentOverdueEmail.PreviewProps = {
  outstandingMinor: previewCase.overdueOutstandingMinor,
  dueAt: previewCase.dueAt,
  lateInterestMinor: previewCase.overdueLateInterestMinor,
  lateDayMinor: previewCase.overdueLateDayMinor,
} satisfies RepaymentOverdueProps;

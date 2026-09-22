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

export type PayoutRecordedProps = {
  amountMinor?: number;
  dueAt?: string;
  totalMinor?: number;
  lateDayMinor?: number;
};

export default function PayoutRecordedEmail({
  amountMinor = previewCase.payoutMinor,
  dueAt = previewCase.dueAt,
  totalMinor = previewCase.advanceTotalMinor,
  lateDayMinor = previewCase.advanceLateDayMinor,
}: PayoutRecordedProps) {
  const { itemTitle } = previewCase;

  return (
    <VaultLetter
      caseLine={previewCaseLine}
      cta={{ href: previewCase.url, label: "See what you owe" }}
      footer={{
        lines: footerLines("lender"),
        whyYouGotThis: "We have sent you money against your vault case.",
      }}
      greeting={`Hi ${previewCase.collectorName},`}
      heading="Your loan has been paid out"
      lead={`We have sent ${money(amountMinor)} against ${itemTitle}. Your loan runs from the day the money left us and is repayable by ${hkDate(dueAt)}.`}
      preheader={`${money(amountMinor)} sent. Repayable by ${hkDate(dueAt)}.`}
    >
      <FactsGroup
        facts={[
          { label: "We sent you", value: money(amountMinor) },
          { label: "Repayable by", value: hkDate(dueAt) },
          { label: "You repay in total", value: money(totalMinor) },
          { label: "Each day after that adds", value: money(lateDayMinor) },
        ]}
      />
      <ReminderSchedule dates={previewCase.reminderScheduleAdvance} />
      <HowToPay {...previewHowToPay} outstandingMinor={totalMinor} />
    </VaultLetter>
  );
}

PayoutRecordedEmail.PreviewProps = {
  amountMinor: previewCase.payoutMinor,
  dueAt: previewCase.dueAt,
  totalMinor: previewCase.advanceTotalMinor,
  lateDayMinor: previewCase.advanceLateDayMinor,
} satisfies PayoutRecordedProps;

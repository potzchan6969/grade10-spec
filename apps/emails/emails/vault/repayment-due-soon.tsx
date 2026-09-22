import { hkDate, money } from "@/emails/_components/format";
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

export type RepaymentDueSoonProps = {
  outstandingMinor?: number;
  dueAt?: string;
  lateDayMinor?: number;
};

export default function RepaymentDueSoonEmail({
  outstandingMinor = previewCase.dueSoonOutstandingMinor,
  dueAt = previewCase.dueAt,
  lateDayMinor = previewCase.dueSoonLateDayMinor,
}: RepaymentDueSoonProps) {
  const { itemTitle } = previewCase;

  return (
    <VaultLetter
      caseLine={previewCaseLine}
      cta={{ href: previewCase.url, label: "See what you owe" }}
      footer={{
        lines: footerLines("lender"),
        whyYouGotThis: "Your loan is coming due soon.",
      }}
      greeting={`Hi ${previewCase.collectorName},`}
      heading="A reminder about your loan"
      lead={`Your loan on ${itemTitle} is repayable by ${hkDate(dueAt)}. Come in or get in touch before then and the item goes home with you.`}
      preheader={`${money(outstandingMinor)} outstanding, due ${hkDate(dueAt)}.`}
    >
      <FactsGroup
        facts={[
          { label: "Outstanding today", value: money(outstandingMinor) },
          { label: "Due", value: hkDate(dueAt) },
          {
            label: "Each day from the day after adds",
            value: money(lateDayMinor),
          },
        ]}
      />
      <HowToPay {...previewHowToPay} outstandingMinor={outstandingMinor} />
      <ReminderSchedule dates={previewCase.reminderScheduleDueSoon} />
    </VaultLetter>
  );
}

RepaymentDueSoonEmail.PreviewProps = {
  outstandingMinor: previewCase.dueSoonOutstandingMinor,
  dueAt: previewCase.dueAt,
  lateDayMinor: previewCase.dueSoonLateDayMinor,
} satisfies RepaymentDueSoonProps;

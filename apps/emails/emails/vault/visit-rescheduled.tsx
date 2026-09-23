import { hkDateTime } from "@/emails/_components/format";
import {
  FactsGroup,
  VaultLetter,
} from "@/emails/vault/_components/vault-letter";
import {
  footerLines,
  previewCase,
  previewCaseLine,
} from "@/emails/vault/fixtures";

export type VisitRescheduledProps = {
  visitAt?: string;
};

export default function VisitRescheduledEmail({
  visitAt = previewCase.movedVisitAt,
}: VisitRescheduledProps) {
  const { itemTitle } = previewCase;

  return (
    <VaultLetter
      attachments={["an updated calendar file"]}
      caseLine={previewCaseLine}
      cta={{ href: previewCase.url, label: "See your case" }}
      footer={{
        lines: footerLines("custodian"),
        whyYouGotThis: "Your vault visit was moved.",
      }}
      greeting={`Hi ${previewCase.collectorName},`}
      heading="Your visit was rescheduled"
      lead={[
        `Your visit for ${itemTitle} is now ${hkDateTime(visitAt)}. Nothing else about your case has changed.`,
        "The attached file replaces the one on your phone from the earlier time.",
      ]}
      preheader={`Now ${hkDateTime(visitAt)}. Nothing else about your case has changed.`}
    >
      <FactsGroup facts={[{ label: "Your visit", value: hkDateTime(visitAt) }]} />
    </VaultLetter>
  );
}

VisitRescheduledEmail.PreviewProps = {
  visitAt: previewCase.movedVisitAt,
} satisfies VisitRescheduledProps;

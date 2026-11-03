import {
  dayStamp,
  FactsTable,
  LoyaltyLetter,
} from "@/emails/loyalty/_components/loyalty-letter";
import { previewMember } from "@/emails/loyalty/fixtures";

export const subject = `Your ${previewMember.tier} membership runs to ${dayStamp(previewMember.periodEndsAt, "en", { year: true })}`;

/** English preview of `gold-tier-ending`. */
export default function GoldTierEndingEnEmail() {
  const { periodEndsAt, periodGoal, periodProgress, shopUrl, tier } =
    previewMember;
  const day = dayStamp(periodEndsAt, "en", { year: true });
  const remaining = (periodGoal - periodProgress).toLocaleString();

  return (
    <LoyaltyLetter
      action={{ label: "Shop now", href: shopUrl }}
      campaign="gold_tier_ending"
      heading={`Keep your ${tier} membership`}
      lang="en"
      lead={`Your ${tier} period ends on ${day}. You’ve earned ${periodProgress.toLocaleString()} points inside it; earn ${remaining} more before it closes to keep ${tier} for another 12 months.`}
      preheader={`Earn ${remaining} more points by ${day} to keep ${tier}.`}
    >
      <FactsTable
        facts={[
          {
            label: "Earned this period",
            value: `${periodProgress.toLocaleString()} pts`,
            subtext: `${periodGoal.toLocaleString()} keeps ${tier}`,
          },
          { label: "Period ends", value: day },
        ]}
      />
    </LoyaltyLetter>
  );
}

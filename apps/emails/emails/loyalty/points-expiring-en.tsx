import { moneyRate } from "@/emails/_components/format";
import {
  dayStamp,
  FactsTable,
  LoyaltyLetter,
} from "@/emails/loyalty/_components/loyalty-letter";
import { previewMember } from "@/emails/loyalty/fixtures";

export const subject = `${previewMember.pointsExpiring.toLocaleString()} points expire on ${dayStamp(previewMember.expiryDay, "en")}`;

/**
 * English preview of `points-expiring` — the one reminder owed a member
 * whose balance expires within 30 days.
 */
export default function PointsExpiringEnEmail() {
  const { expiryDay, pointsExpiring, shopUrl } = previewMember;
  const day = dayStamp(expiryDay, "en");
  const fullDay = dayStamp(expiryDay, "en", { year: true });
  const points = pointsExpiring.toLocaleString();
  const worth = moneyRate(pointsExpiring * 100);

  return (
    <LoyaltyLetter
      action={{ label: "Shop now", href: shopUrl }}
      campaign="points_expiring"
      heading={`${points} points expire on ${day}`}
      lang="en"
      lead={`Spend them at checkout before the day ends. Or make a purchase of any amount, online, in store, or on Grade10 event tickets, and the expiry date moves out 12 months. Expired points can’t be recovered.`}
      preheader={`${points} points expire on ${day}, worth ${worth}.`}
    >
      <FactsTable
        facts={[
          {
            label: "Expiring points",
            value: `${points} pts`,
            subtext: `worth ${worth} at checkout`,
          },
          { label: "Expiry date", value: fullDay },
        ]}
      />
    </LoyaltyLetter>
  );
}

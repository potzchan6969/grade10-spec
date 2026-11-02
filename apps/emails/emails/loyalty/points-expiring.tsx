import { moneyRate } from "@/emails/_components/format";
import {
  dayStamp,
  FactsTable,
  LoyaltyLetter,
} from "@/emails/loyalty/_components/loyalty-letter";
import { previewMember } from "@/emails/loyalty/fixtures";

export const subject = `${previewMember.pointsExpiring.toLocaleString()} 積分將於 ${dayStamp(previewMember.expiryDay, "zh-HK")} 到期`;

/**
 * The one reminder the programme owes a member whose balance expires within
 * 30 days — the spec'd lead time, sent once per member per expiry day.
 */
export default function PointsExpiringEmail() {
  const { expiryDay, pointsExpiring, shopUrl } = previewMember;
  const day = dayStamp(expiryDay, "zh-HK");
  const fullDay = dayStamp(expiryDay, "zh-HK", { year: true });
  const points = pointsExpiring.toLocaleString();
  const worth = moneyRate(pointsExpiring * 100);

  return (
    <LoyaltyLetter
      action={{ label: "前往購物", href: shopUrl }}
      campaign="points_expiring"
      heading={`${points} 積分將於 ${day} 到期`}
      lead={`積分可於結帳時抵扣，請在到期前用完。另外，任何金額的消費，網店、門市或 Grade10 活動門票皆可，都會把到期日延長 12 個月。過期的積分不能恢復。`}
      preheader={`${points} 積分將於 ${day} 到期，價值 ${worth}。`}
    >
      <FactsTable
        facts={[
          {
            label: "到期積分",
            value: `${points} 分`,
            subtext: `可於結帳時抵扣 ${worth}`,
          },
          { label: "到期日", value: fullDay },
        ]}
      />
    </LoyaltyLetter>
  );
}

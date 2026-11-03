import {
  dayStamp,
  FactsTable,
  LoyaltyLetter,
} from "@/emails/loyalty/_components/loyalty-letter";
import { previewMember } from "@/emails/loyalty/fixtures";

export const subject = `你的 ${previewMember.tier} 會籍有效期至 ${dayStamp(previewMember.periodEndsAt, "zh-HK", { year: true })}`;

/**
 * Sent to a Gold member whose period ends within the lead time short of the
 * keep line: the closing day, the points earned and the points still needed.
 */
export default function GoldTierEndingEmail() {
  const { periodEndsAt, periodGoal, periodProgress, shopUrl, tier } =
    previewMember;
  const day = dayStamp(periodEndsAt, "zh-HK", { year: true });
  const remaining = (periodGoal - periodProgress).toLocaleString();

  return (
    <LoyaltyLetter
      action={{ label: "前往購物", href: shopUrl }}
      campaign="gold_tier_ending"
      heading={`保持你的 ${tier} 會籍`}
      lead={`你的 ${tier} 會籍將於 ${day} 結束。期內你已累積 ${periodProgress.toLocaleString()} 分，再賺取 ${remaining} 分即可延續 ${tier} 會籍 12 個月。`}
      preheader={`於 ${day} 前再賺取 ${remaining} 分即可保持${tier}。`}
    >
      <FactsTable
        facts={[
          {
            label: "本年度累積積分",
            value: `${periodProgress.toLocaleString()} 分`,
            subtext: `保持${tier}需要 ${periodGoal.toLocaleString()} 分`,
          },
          { label: "會員期結束", value: day },
        ]}
      />
    </LoyaltyLetter>
  );
}

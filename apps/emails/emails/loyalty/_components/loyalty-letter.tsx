import { Column, Row, Section, Text } from "react-email";

import {
  LetterShell,
  type LetterShellProps,
} from "@/emails/_components/letter-shell";
import {
  type LoyaltyEmailCampaign,
  withLoyaltyEmailCampaignTags,
} from "@/emails/loyalty/_components/campaign-tags";

export { Note } from "@/emails/_components/letter-shell";

export type LoyaltyLang = "zh-HK" | "en";

export type LoyaltyLetterProps = Pick<
  LetterShellProps,
  "preheader" | "heading" | "lead" | "children"
> & {
  action: { label: string; href: string };
  /** Letter kind for `utm_campaign` on the CTA's link. */
  campaign: LoyaltyEmailCampaign;
  /** `zh-HK` for the member-facing letter; `en` previews the same copy in English. */
  lang?: LoyaltyLang;
};

const copy = {
  "zh-HK": {
    clock: "日期與時間以香港時間（GMT+8）為準。",
  },
  en: {
    clock: "Dates and times are Hong Kong time (GMT+8).",
  },
} as const;

/**
 * The shell every membership letter is written in: `LetterShell` opening
 * straight on the heading and lead, the Hong Kong clock note in the footer.
 */
export function LoyaltyLetter({
  action,
  campaign,
  lang = "zh-HK",
  children,
  ...shell
}: LoyaltyLetterProps) {
  return (
    <LetterShell
      {...shell}
      cta={{
        label: action.label,
        href: withLoyaltyEmailCampaignTags(action.href, campaign, "cta"),
      }}
      footer={{ lines: [copy[lang].clock] }}
      lang={lang}
      trailer={null}
    >
      {children}
    </LetterShell>
  );
}

/**
 * A date as the member reads it, on the shop's clock: `14 Dec` in English,
 * `12月14日` in Chinese. `year` adds it where the day can fall past a year
 * boundary: `14 Jan 2027`, `2027年1月14日`.
 */
export function dayStamp(
  iso: string,
  lang: LoyaltyLang,
  { year = false }: { year?: boolean } = {},
): string {
  const formatted = new Intl.DateTimeFormat(
    lang === "en" ? "en-GB" : "zh-Hant-HK",
    {
      timeZone: "Asia/Hong_Kong",
      day: "numeric",
      month: "short",
      ...(year ? { year: "numeric" } : {}),
    },
  ).format(new Date(iso));
  // Chinese dates breathe: `12 月 14 日`, `2027 年 1 月 14 日`.
  return lang === "en"
    ? formatted
    : formatted
        .replace(/(\d)([^\d])/g, "$1 $2")
        .replace(/([^\d])(\d)/g, "$1 $2");
}

export type Fact = {
  label: string;
  value: string;
  subtext?: string;
};

/**
 * The letter's facts as a receipt: one row each, a narrow label column on
 * the left and the value beside it, the quieter line under the value, a
 * hairline rule between rows.
 */
export function FactsTable({ facts }: { facts: Fact[] }) {
  return (
    <Section className="my-6">
      {facts.map((fact, index) => (
        <Row key={`${fact.label}:${fact.value}`}>
          <Column
            className={`w-2/5 py-1.5 ${index < facts.length - 1 ? "border-stroke border-b" : ""}`}
            valign="top"
          >
            <Text className="m-0 text-sm text-secondary-fg">{fact.label}</Text>
          </Column>
          <Column
            className={`py-1.5 ${index < facts.length - 1 ? "border-stroke border-b" : ""}`}
            valign="top"
          >
            <Text className="m-0 text-base font-bold text-fg">
              {fact.value}
            </Text>
            {fact.subtext ? (
              <Text className="mb-0 mt-0.5 text-sm text-secondary-fg">
                {fact.subtext}
              </Text>
            ) : null}
          </Column>
        </Row>
      ))}
    </Section>
  );
}

import { Heading, Section, Text } from "react-email";
import { EmailFooter } from "@/emails/_components/email-footer";
import {
  GRADE10_HOME_URL,
  Grade10EmailShell,
} from "@/emails/_components/grade10-email-shell";
import { PrimaryCta } from "@/emails/_components/primary-cta";
import {
  type AuctionEmailCampaign,
  withAuctionEmailCampaignTags,
} from "@/emails/auction/_components/campaign-tags";
import { LotBlock } from "@/emails/auction/_components/lot-block";

export type AuctionLetterProps = {
  brandName?: string;
  /** Storefront home — brand mark target. Defaults to Grade10 home. */
  homeUrl?: string;
  /** Letter kind for `utm_campaign` on every outbound link. */
  campaign: AuctionEmailCampaign;
  preheader: string;
  heading: string;
  /** One paragraph, or several short paragraphs rendered in order. */
  body: string | string[];
  /** Scannable bullets under the lead (setup fields, consequences, etc.). */
  points?: string[];
  /** Paragraphs between the first and second bullet lists. */
  afterPoints?: string | string[];
  /** Second bullet list, after `afterPoints`. */
  morePoints?: string[];
  lotTitle: string;
  /**
   * Destination for the lot image and lot title.
   * Order letters pass the Winner Order URL; progress / activity / close
   * letters pass the public listing URL.
   */
  listingUrl: string;
  primaryImageUrl?: string | null;
  /** Quieter line under the lot title (e.g. Closes … / Ended …). */
  lotSubtext?: string;
  /** Leading / current bid — stronger hierarchy than secondary facts. */
  highlight?: {
    label: string;
    value: string;
    /** Quieter line under the value (e.g. ended date under winning bid). */
    subtext?: string;
  };
  /** Companion amount (outbid standing bid). Same size, to the right of highlight. */
  secondary?: {
    label: string;
    value: string;
  };
  /**
   * Extra label/value rows in the same weight as the highlight
   * (deadlines, payment method, etc.).
   */
  details?: Array<{
    label: string;
    value: string;
    /** Quieter line under the value (e.g. paid-at under payment method). */
    subtext?: string;
  }>;
  facts?: string[];
  whyYouGotThis: string;
  canUnsubscribe?: boolean;
  /** Signed-in mute surface for this lot's email alerts. */
  muteUrl?: string;
  /** @deprecated Prefer `muteUrl`. */
  unwatchUrl?: string;
  /**
   * Primary CTA destination. Defaults to `listingUrl` (lot or Winner Order).
   * Use a carrier track-and-trace URL when the letter's main job is tracking.
   */
  ctaHref?: string;
  ctaLabel?: string;
  /** Optional secondary CTA (e.g. Winner Order beside a tracking primary). */
  secondaryCtaHref?: string;
  secondaryCtaLabel?: string;
};

export function AuctionLetter({
  brandName = "Grade10",
  homeUrl = GRADE10_HOME_URL,
  campaign,
  preheader,
  heading,
  body,
  points = [],
  afterPoints,
  morePoints = [],
  lotTitle,
  listingUrl,
  primaryImageUrl,
  lotSubtext,
  highlight,
  secondary,
  details,
  facts = [],
  whyYouGotThis,
  canUnsubscribe = false,
  muteUrl,
  unwatchUrl,
  ctaHref,
  ctaLabel,
  secondaryCtaHref,
  secondaryCtaLabel,
}: AuctionLetterProps) {
  const alertsBase = muteUrl ?? unwatchUrl;
  const primaryHref = ctaHref ?? listingUrl;
  const bodyParagraphs = Array.isArray(body) ? body : [body];
  const afterPointParagraphs = afterPoints
    ? Array.isArray(afterPoints)
      ? afterPoints
      : [afterPoints]
    : [];
  const taggedHome = withAuctionEmailCampaignTags(homeUrl, campaign, "logo");
  const taggedCta = withAuctionEmailCampaignTags(primaryHref, campaign, "cta");
  const taggedSecondaryCta = secondaryCtaHref
    ? withAuctionEmailCampaignTags(secondaryCtaHref, campaign, "secondary_cta")
    : undefined;
  const taggedLotImage = withAuctionEmailCampaignTags(
    listingUrl,
    campaign,
    "lot_image",
  );
  const taggedLotTitle = withAuctionEmailCampaignTags(
    listingUrl,
    campaign,
    "lot_title",
  );
  const taggedMute = alertsBase
    ? withAuctionEmailCampaignTags(alertsBase, campaign, "manage_alerts")
    : undefined;

  const bulletList = (items: string[]) =>
    items.length > 0 ? (
      <Section className="mb-2 mt-1">
        {items.map((point) => (
          <Text
            className="mb-1 mt-0 text-lg leading-base text-fg-2"
            key={point}
          >
            • {point}
          </Text>
        ))}
      </Section>
    ) : null;

  return (
    <Grade10EmailShell homeUrl={taggedHome} preheader={preheader}>
      <Heading as="h1" className="mb-4 mt-0 text-heading font-bold text-fg">
        {heading}
      </Heading>
      {bodyParagraphs.map((paragraph) => (
        <Text
          className="mb-2 mt-0 text-lg leading-base text-fg-2"
          key={paragraph}
        >
          {paragraph}
        </Text>
      ))}
      {bulletList(points)}
      {afterPointParagraphs.map((paragraph) => (
        <Text
          className="mb-2 mt-0 text-lg leading-base text-fg-2"
          key={paragraph}
        >
          {paragraph}
        </Text>
      ))}
      {bulletList(morePoints)}
      <LotBlock
        details={details}
        facts={facts}
        highlight={highlight}
        imageListingUrl={taggedLotImage}
        listingUrl={taggedLotTitle}
        lotSubtext={lotSubtext}
        lotTitle={lotTitle}
        primaryImageUrl={primaryImageUrl}
        secondary={secondary}
      />
      <PrimaryCta
        href={taggedCta}
        label={ctaLabel}
        secondaryHref={taggedSecondaryCta}
        secondaryLabel={secondaryCtaLabel}
      />
      <EmailFooter
        brandName={brandName}
        canUnsubscribe={canUnsubscribe}
        muteUrl={taggedMute}
        whyYouGotThis={whyYouGotThis}
      />
    </Grade10EmailShell>
  );
}

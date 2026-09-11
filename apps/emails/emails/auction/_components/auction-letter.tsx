import { Heading, Text } from "react-email";
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
  body: string;
  lotTitle: string;
  listingUrl: string;
  primaryImageUrl?: string | null;
  /** Leading / current bid — stronger hierarchy than secondary facts. */
  highlight?: {
    label: string;
    value: string;
  };
  /** Companion amount (outbid standing bid). Same size, to the right of highlight. */
  secondary?: {
    label: string;
    value: string;
  };
  facts: string[];
  whyYouGotThis: string;
  canUnsubscribe?: boolean;
  /** Signed-in mute surface for this lot's email alerts. */
  muteUrl?: string;
  /** @deprecated Prefer `muteUrl`. */
  unwatchUrl?: string;
  ctaLabel?: string;
};

export function AuctionLetter({
  brandName = "Grade10",
  homeUrl = GRADE10_HOME_URL,
  campaign,
  preheader,
  heading,
  body,
  lotTitle,
  listingUrl,
  primaryImageUrl,
  highlight,
  secondary,
  facts,
  whyYouGotThis,
  canUnsubscribe = false,
  muteUrl,
  unwatchUrl,
  ctaLabel,
}: AuctionLetterProps) {
  const alertsBase = muteUrl ?? unwatchUrl;
  const taggedHome = withAuctionEmailCampaignTags(homeUrl, campaign, "logo");
  const taggedCta = withAuctionEmailCampaignTags(listingUrl, campaign, "cta");
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

  return (
    <Grade10EmailShell homeUrl={taggedHome} preheader={preheader}>
      <Heading as="h1" className="mb-4 mt-0 text-heading font-bold text-fg">
        {heading}
      </Heading>
      <Text className="mb-2 mt-0 text-lg leading-base text-fg-2">{body}</Text>
      <LotBlock
        facts={facts}
        highlight={highlight}
        imageListingUrl={taggedLotImage}
        listingUrl={taggedLotTitle}
        lotTitle={lotTitle}
        primaryImageUrl={primaryImageUrl}
        secondary={secondary}
      />
      <PrimaryCta href={taggedCta} label={ctaLabel} />
      <EmailFooter
        brandName={brandName}
        canUnsubscribe={canUnsubscribe}
        muteUrl={taggedMute}
        whyYouGotThis={whyYouGotThis}
      />
    </Grade10EmailShell>
  );
}

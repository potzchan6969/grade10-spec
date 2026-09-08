import { Heading, Text } from "react-email";
import { grade10EmailTheme } from "@/components/email/theme-grade10";
import { AuctionEmailShell } from "@/emails/_components/auction-email-shell";
import { EmailFooter } from "@/emails/_components/email-footer";
import { LotBlock } from "@/emails/_components/lot-block";
import { PrimaryCta } from "@/emails/_components/primary-cta";

export type AuctionLetterProps = {
  brandName?: string;
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
  /** Companion amount (outbid standing bid). Same style, to the right of highlight. */
  secondary?: {
    label: string;
    value: string;
  };
  facts: string[];
  whyYouGotThis: string;
  canUnsubscribe?: boolean;
  unwatchUrl?: string;
  ctaLabel?: string;
};

const theme = grade10EmailTheme;

export function AuctionLetter({
  brandName = "Grade10",
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
  unwatchUrl,
  ctaLabel,
}: AuctionLetterProps) {
  return (
    <AuctionEmailShell preheader={preheader}>
      <Heading
        as="h1"
        style={{
          color: theme.colorText,
          fontSize: theme.fontSizeHeading,
          fontWeight: theme.fontWeightBold,
          lineHeight: "1.3",
          margin: "0 0 16px",
        }}
      >
        {heading}
      </Heading>
      <Text
        style={{
          color: theme.colorTextMuted,
          fontSize: theme.fontSizeLg,
          lineHeight: theme.lineHeightBase,
          margin: "0 0 8px",
        }}
      >
        {body}
      </Text>
      <LotBlock
        facts={facts}
        highlight={highlight}
        listingUrl={listingUrl}
        lotTitle={lotTitle}
        primaryImageUrl={primaryImageUrl}
        secondary={secondary}
      />
      <PrimaryCta href={listingUrl} label={ctaLabel} />
      <EmailFooter
        brandName={brandName}
        canUnsubscribe={canUnsubscribe}
        unwatchUrl={unwatchUrl}
        whyYouGotThis={whyYouGotThis}
      />
    </AuctionEmailShell>
  );
}

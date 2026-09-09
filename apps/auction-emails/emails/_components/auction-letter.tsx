import { Heading, Text } from "react-email";

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
  return (
    <AuctionEmailShell preheader={preheader}>
      <Heading as="h1" className="mb-4 mt-0 text-heading font-bold text-fg">
        {heading}
      </Heading>
      <Text className="mb-2 mt-0 text-lg leading-base text-fg-2">{body}</Text>
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
        muteUrl={muteUrl ?? unwatchUrl}
        whyYouGotThis={whyYouGotThis}
      />
    </AuctionEmailShell>
  );
}

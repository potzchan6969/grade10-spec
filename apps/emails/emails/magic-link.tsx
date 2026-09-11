import { Heading, Text } from "react-email";

import { EmailFooter } from "@/emails/_components/email-footer";
import {
  GRADE10_HOME_URL,
  GRADE10_LOGO_STATIC,
  Grade10EmailShell,
} from "@/emails/_components/grade10-email-shell";
import { PrimaryCta } from "@/emails/_components/primary-cta";

export type MagicLinkEmailProps = {
  magicLinkUrl?: string;
  /** Human-readable expiry window, e.g. "5 minutes". */
  expiresIn?: string;
  brandName?: string;
  homeUrl?: string;
  logoUrl?: string;
};

export default function MagicLinkEmail({
  magicLinkUrl = "https://grade10.com/auth/magic?token=preview",
  expiresIn = "5 minutes",
  brandName = "Grade10",
  homeUrl = GRADE10_HOME_URL,
  logoUrl = GRADE10_LOGO_STATIC,
}: MagicLinkEmailProps) {
  return (
    <Grade10EmailShell
      homeUrl={homeUrl}
      logoUrl={logoUrl}
      preheader={`Your sign-in link is ready. It expires in ${expiresIn}.`}
    >
      <Heading as="h1" className="mb-4 mt-0 text-heading font-bold text-fg">
        Sign in to {brandName}
      </Heading>
      <Text className="mb-2 mt-0 text-lg leading-base text-fg-2">
        You asked for a sign-in link. Use it once.
      </Text>
      <Text className="mb-2 mt-0 text-lg leading-base text-fg-2">
        This link expires in {expiresIn}.
      </Text>
      <PrimaryCta href={magicLinkUrl} label="Sign in" />
      <EmailFooter
        brandName={brandName}
        whyYouGotThis={`You asked for a sign-in link on ${brandName}.`}
      />
    </Grade10EmailShell>
  );
}

MagicLinkEmail.PreviewProps = {
  magicLinkUrl: "https://grade10.com/auth/magic?token=preview",
  expiresIn: "5 minutes",
  brandName: "Grade10",
  homeUrl: GRADE10_HOME_URL,
  logoUrl: GRADE10_LOGO_STATIC,
} satisfies MagicLinkEmailProps;

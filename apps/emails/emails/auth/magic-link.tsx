import { formatEvent, formatViewerZoneName } from "@grade10/date";
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
  /** When the link went out, as the footer prints it: `26 Oct 2026, 17:58:04 HKT`. */
  sentAt?: string;
};

const PREVIEW_SENT_AT = new Date("2026-10-26T09:58:04Z");
const PREVIEW_ZONE = "Asia/Hong_Kong";

/** The footer's moment, to the second: two links can go out in one minute. */
const previewSentAt = `${formatEvent(PREVIEW_SENT_AT, { timeZone: PREVIEW_ZONE })} ${formatViewerZoneName(PREVIEW_ZONE, PREVIEW_SENT_AT)}`;

export default function MagicLinkEmail({
  magicLinkUrl = "https://grade10.com/auth/magic?token=preview",
  expiresIn = "5 minutes",
  brandName = "Grade10",
  homeUrl = GRADE10_HOME_URL,
  logoUrl = GRADE10_LOGO_STATIC,
  sentAt = previewSentAt,
}: MagicLinkEmailProps) {
  return (
    <Grade10EmailShell
      homeUrl={homeUrl}
      logoUrl={logoUrl}
      preheader={`Your sign-in link is ready. It expires in ${expiresIn}.`}
    >
      <Heading as="h1" className="mb-4 mt-0 text-heading font-bold text-fg">
        Sign In to {brandName}
      </Heading>
      <Text className="mb-2 mt-0 text-lg leading-base text-fg-2">
        You asked for a sign-in link. Use it once.
      </Text>
      <Text className="mb-4 mt-0 text-lg leading-base text-fg-2">
        This link expires in {expiresIn}.
      </Text>
      <PrimaryCta href={magicLinkUrl} label="Sign In" />
      <EmailFooter
        lines={[`Sent at ${sentAt}`]}
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
  sentAt: previewSentAt,
} satisfies MagicLinkEmailProps;

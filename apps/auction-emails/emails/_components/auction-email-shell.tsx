import type { ReactNode } from "react";
import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
} from "react-email";

import { grade10EmailTheme } from "@/components/email/theme-grade10";

export type AuctionEmailShellProps = {
  preheader: string;
  /** Absolute or /static URL for the brand mark. Defaults to the Grade10 mono logo. */
  logoUrl?: string;
  logoAlt?: string;
  children: ReactNode;
};

const theme = grade10EmailTheme;

/** Preview-server path; production should pass a CDN absolute URL. */
export const GRADE10_LOGO_STATIC = "/static/grade10-logo.png";

export function AuctionEmailShell({
  preheader,
  logoUrl = GRADE10_LOGO_STATIC,
  logoAlt = "Grade10",
  children,
}: AuctionEmailShellProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{preheader}</Preview>
      <Body
        style={{
          backgroundColor: theme.colorBackground,
          fontFamily: theme.fontFamily,
          margin: 0,
          padding: "32px 16px",
        }}
      >
        <Container
          style={{
            backgroundColor: theme.colorBackgroundMuted,
            border: `1px solid ${theme.colorBorder}`,
            borderRadius: theme.borderRadiusLg,
            margin: "0 auto",
            maxWidth: theme.containerWidth,
            padding: "0",
          }}
        >
          <Section
            style={{
              borderBottom: `1px solid ${theme.colorBorder}`,
              // Slightly more bottom padding: wordmark has no descenders, so
              // equal padding reads top-heavy in the header bar.
              padding: "18px 32px 22px",
            }}
          >
            <Img
              alt={logoAlt}
              height={26}
              src={logoUrl}
              style={{
                display: "block",
                fontSize: 0,
                height: "26px",
                lineHeight: 0,
                margin: 0,
                padding: 0,
                width: "140px",
              }}
              width={140}
            />
          </Section>
          <Section style={{ padding: "32px" }}>{children}</Section>
        </Container>
      </Body>
    </Html>
  );
}

import type { ReactNode } from "react";
import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
} from "react-email";

import { createEmailTailwindConfig } from "@/components/email/email-theme";
import { DefaultFonts } from "@/components/email/font-default";
import { grade10Theme } from "@/components/email/theme-grade10";

export type Grade10EmailShellProps = {
  preheader: string;
  /** Absolute or /static URL for the brand mark. Defaults to the Grade10 mono logo. */
  logoUrl?: string;
  logoAlt?: string;
  /** Storefront home. Activating the brand mark opens this URL. */
  homeUrl?: string;
  children: ReactNode;
};

/** Preview-server path; production should pass a CDN absolute URL. */
export const GRADE10_LOGO_STATIC = "/static/grade10-logo.png";

/** Preview default for Grade10 storefront home. */
export const GRADE10_HOME_URL = "https://grade10.com";

const theme = grade10Theme;

/**
 * Document chrome for Grade10 letters — emailcn Tailwind theme + Grade10 tokens.
 */
export function Grade10EmailShell({
  preheader,
  logoUrl = GRADE10_LOGO_STATIC,
  logoAlt = "Grade10",
  homeUrl = GRADE10_HOME_URL,
  children,
}: Grade10EmailShellProps) {
  return (
    <Html lang="en">
      <Head>
        <DefaultFonts />
      </Head>
      <Preview>{preheader}</Preview>
      <Tailwind config={createEmailTailwindConfig(theme)}>
        <Body className="m-0 bg-bg p-8 font-sans">
          <Container className="mx-auto max-w-email overflow-hidden rounded-lg border border-solid border-stroke bg-bg-2 p-0">
            <Section
              className="border-0 border-b border-solid border-stroke px-8"
              style={{ paddingBottom: "22px", paddingTop: "18px" }}
            >
              <Link href={homeUrl}>
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
              </Link>
            </Section>
            <Section className="p-8">{children}</Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

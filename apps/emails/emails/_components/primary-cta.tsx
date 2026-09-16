import { Button, Column, Row, Section } from "react-email";

import { grade10Theme } from "@/components/email/theme-grade10";

export type PrimaryCtaProps = {
  href: string;
  label?: string;
  /** Optional outline button beside the primary action. */
  secondaryHref?: string;
  secondaryLabel?: string;
};

const { primary, secondary } = grade10Theme.button;

const primaryButtonStyle = {
  backgroundColor: primary.backgroundColor,
  borderRadius: primary.borderRadius,
  color: primary.color,
  display: "inline-block",
  fontSize: primary.fontSize,
  fontWeight: primary.fontWeight,
  lineHeight: "20px",
  padding: `${primary.paddingY} ${primary.paddingX}`,
  textAlign: "center" as const,
  textDecoration: "none",
  whiteSpace: "nowrap" as const,
};

const secondaryButtonStyle = {
  backgroundColor: secondary.backgroundColor,
  border: secondary.border,
  borderRadius: secondary.borderRadius,
  color: secondary.color,
  display: "inline-block",
  fontSize: secondary.fontSize,
  fontWeight: secondary.fontWeight,
  lineHeight: "20px",
  padding: `${secondary.paddingY} ${secondary.paddingX}`,
  textAlign: "center" as const,
  textDecoration: "none",
  whiteSpace: "nowrap" as const,
};

export function PrimaryCta({
  href,
  label = "View lot",
  secondaryHref,
  secondaryLabel,
}: PrimaryCtaProps) {
  if (secondaryHref && secondaryLabel) {
    return (
      <Section className="mb-6 mt-2 text-left">
        <Row>
          <Column className="align-middle" style={{ width: "auto" }}>
            <Button
              className="inline-block rounded-full bg-brand px-6 py-3 text-sm font-medium text-brand-fg no-underline"
              href={href}
              style={primaryButtonStyle}
            >
              {label}
            </Button>
          </Column>
          <Column
            className="align-middle"
            style={{ paddingLeft: "12px", width: "auto" }}
          >
            <Button
              className="inline-block rounded-full px-6 py-3 text-sm font-medium text-fg no-underline"
              href={secondaryHref}
              style={secondaryButtonStyle}
            >
              {secondaryLabel}
            </Button>
          </Column>
          <Column style={{ width: "100%" }} />
        </Row>
      </Section>
    );
  }

  return (
    <Section className="mb-6 mt-2 text-left">
      <Button
        className="inline-block rounded-full bg-brand px-6 py-3 text-sm font-medium text-brand-fg no-underline"
        href={href}
        style={primaryButtonStyle}
      >
        {label}
      </Button>
    </Section>
  );
}

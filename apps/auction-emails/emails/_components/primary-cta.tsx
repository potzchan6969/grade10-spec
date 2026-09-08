import { Button, Section } from "react-email";

import { grade10EmailTheme } from "@/components/email/theme-grade10";

export type PrimaryCtaProps = {
  href: string;
  label?: string;
};

const theme = grade10EmailTheme;

export function PrimaryCta({ href, label = "View lot" }: PrimaryCtaProps) {
  const { primary } = theme.button;
  return (
    <Section style={{ margin: "8px 0 24px", textAlign: "left" }}>
      <Button
        href={href}
        style={{
          backgroundColor: primary.backgroundColor,
          borderRadius: primary.borderRadius,
          color: primary.color,
          display: "inline-block",
          fontSize: primary.fontSize,
          fontWeight: primary.fontWeight,
          lineHeight: "20px",
          padding: `${primary.paddingY} ${primary.paddingX}`,
          textAlign: "center",
          textDecoration: "none",
        }}
      >
        {label}
      </Button>
    </Section>
  );
}

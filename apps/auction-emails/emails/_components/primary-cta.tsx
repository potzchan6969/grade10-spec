import { Button, Section } from "react-email";

import { grade10Theme } from "@/components/email/theme-grade10";

export type PrimaryCtaProps = {
  href: string;
  label?: string;
};

const { primary } = grade10Theme.button;

export function PrimaryCta({ href, label = "View lot" }: PrimaryCtaProps) {
  return (
    <Section className="mb-6 mt-2 text-left">
      <Button
        className="inline-block rounded-full bg-brand px-6 py-3 text-sm font-medium text-brand-fg no-underline"
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

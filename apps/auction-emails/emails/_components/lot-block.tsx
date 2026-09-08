import { Column, Img, Link, Row, Section, Text } from "react-email";

import { grade10EmailTheme } from "@/components/email/theme-grade10";

export type LotBlockProps = {
  lotTitle: string;
  listingUrl: string;
  primaryImageUrl?: string | null;
  /** Leading / current bid — rendered above secondary facts. */
  highlight?: {
    label: string;
    value: string;
  };
  /** Companion amount (e.g. outbid “Your bid”), same style, to the right. */
  secondary?: {
    label: string;
    value: string;
  };
  facts: string[];
};

const theme = grade10EmailTheme;

/** Caps portrait height so the CTA stays near the fold. */
const IMAGE_MAX_HEIGHT = 240;

const labelStyle = {
  color: theme.colorTextSubtle,
  fontSize: theme.fontSizeSm,
  lineHeight: theme.lineHeightBase,
  margin: "0 0 2px",
} as const;

const valueStyle = {
  color: theme.colorText,
  fontSize: theme.fontSizeXl,
  fontWeight: theme.fontWeightBold,
  lineHeight: "1.3",
  margin: "0 0 12px",
} as const;

function AmountColumn({
  label,
  value,
  valueColor = theme.colorText,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <>
      <Text style={labelStyle}>{label}</Text>
      <Text style={{ ...valueStyle, color: valueColor }}>{value}</Text>
    </>
  );
}

export function LotBlock({
  lotTitle,
  listingUrl,
  primaryImageUrl,
  highlight,
  secondary,
  facts,
}: LotBlockProps) {
  return (
    <Section style={{ margin: "24px 0" }}>
      {primaryImageUrl ? (
        <Link href={listingUrl}>
          <Img
            alt={lotTitle}
            height={IMAGE_MAX_HEIGHT}
            src={primaryImageUrl}
            style={{
              display: "block",
              height: "auto",
              margin: "0 0 20px",
              maxHeight: `${IMAGE_MAX_HEIGHT}px`,
              maxWidth: "100%",
              objectFit: "contain",
              width: "auto",
            }}
            width={504}
          />
        </Link>
      ) : null}
      <Text
        style={{
          color: theme.colorText,
          fontSize: theme.fontSizeLg,
          fontWeight: theme.fontWeightBold,
          lineHeight: theme.lineHeightBase,
          margin: "0 0 12px",
        }}
      >
        <Link
          href={listingUrl}
          style={{ color: theme.colorText, textDecoration: "none" }}
        >
          {lotTitle}
        </Link>
      </Text>
      {highlight && secondary ? (
        <Row>
          <Column style={{ paddingRight: "16px", verticalAlign: "top", width: "50%" }}>
            <AmountColumn label={highlight.label} value={highlight.value} />
          </Column>
          <Column style={{ verticalAlign: "top", width: "50%" }}>
            <AmountColumn
              label={secondary.label}
              value={secondary.value}
              valueColor={theme.colorDanger}
            />
          </Column>
        </Row>
      ) : highlight ? (
        <AmountColumn label={highlight.label} value={highlight.value} />
      ) : null}
      {facts.map((fact) => (
        <Text
          key={fact}
          style={{
            color: theme.colorTextMuted,
            fontSize: theme.fontSizeBase,
            lineHeight: theme.lineHeightBase,
            margin: "0 0 4px",
          }}
        >
          {fact}
        </Text>
      ))}
    </Section>
  );
}

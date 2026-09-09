import { Column, Img, Link, Row, Section, Text } from "react-email";

export type LotBlockProps = {
  lotTitle: string;
  listingUrl: string;
  primaryImageUrl?: string | null;
  /** Leading / current bid — rendered above secondary facts. */
  highlight?: {
    label: string;
    value: string;
  };
  /** Companion amount (e.g. outbid “Your bid”), same size, to the right. */
  secondary?: {
    label: string;
    value: string;
  };
  facts: string[];
};

/** Caps portrait height so the CTA stays near the fold. */
const IMAGE_MAX_HEIGHT = 240;

function AmountColumn({
  label,
  value,
  valueClassName = "text-fg",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <>
      <Text className="mb-0.5 mt-0 text-sm text-fg-3">{label}</Text>
      <Text
        className={`mb-3 mt-0 text-xl font-bold leading-tight ${valueClassName}`}
      >
        {value}
      </Text>
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
    <Section className="my-6">
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
      <Text className="mb-3 mt-0 text-lg font-bold text-fg">
        <Link className="text-fg no-underline" href={listingUrl}>
          {lotTitle}
        </Link>
      </Text>
      {highlight && secondary ? (
        <Row>
          <Column className="w-1/2 align-top pr-4">
            <AmountColumn label={highlight.label} value={highlight.value} />
          </Column>
          <Column className="w-1/2 align-top">
            <AmountColumn
              label={secondary.label}
              value={secondary.value}
              valueClassName="text-danger"
            />
          </Column>
        </Row>
      ) : highlight ? (
        <AmountColumn label={highlight.label} value={highlight.value} />
      ) : null}
      {facts.map((fact) => (
        <Text key={fact} className="mb-1 mt-0 text-base text-fg-2">
          {fact}
        </Text>
      ))}
    </Section>
  );
}

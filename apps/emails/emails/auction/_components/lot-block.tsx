import { Column, Img, Link, Row, Section, Text } from "react-email";

export type LotBlockProps = {
  lotTitle: string;
  /** Listing URL for the title link (may already carry campaign tags). */
  listingUrl: string;
  /** Listing URL for the image link when shown. Defaults to `listingUrl`. */
  imageListingUrl?: string;
  primaryImageUrl?: string | null;
  /** Quieter line under the lot title (e.g. Closes … / Ended …). */
  lotSubtext?: string;
  /** Leading / current bid — rendered above secondary facts. */
  highlight?: {
    label: string;
    value: string;
    /** Quieter line under the value (e.g. ended date under winning bid). */
    subtext?: string;
  };
  /** Companion amount (e.g. outbid “Your bid”), same size, to the right. */
  secondary?: {
    label: string;
    value: string;
  };
  /**
   * Extra label/value rows in the same weight as the highlight
   * (deadlines, payment method, etc.).
   */
  details?: Array<{
    label: string;
    value: string;
    /** Quieter line under the value (e.g. paid-at under payment method). */
    subtext?: string;
  }>;
  facts?: string[];
};

/** Caps portrait height so the CTA stays near the fold. */
const IMAGE_MAX_HEIGHT = 240;

function AmountColumn({
  label,
  value,
  subtext,
  valueClassName = "text-fg",
}: {
  label: string;
  value: string;
  subtext?: string;
  valueClassName?: string;
}) {
  return (
    <>
      <Text className="mb-0.5 mt-0 text-sm text-secondary-fg">{label}</Text>
      <Text
        className={`mt-0 text-xl font-bold leading-tight ${valueClassName} ${subtext ? "mb-0.5" : "mb-3"}`}
        style={{ whiteSpace: "pre-line" }}
      >
        {value}
      </Text>
      {subtext ? (
        <Text
          className="mb-3 mt-0 text-sm text-secondary-fg"
          style={{ whiteSpace: "pre-line" }}
        >
          {subtext}
        </Text>
      ) : null}
    </>
  );
}

export function LotBlock({
  lotTitle,
  listingUrl,
  imageListingUrl,
  primaryImageUrl,
  lotSubtext,
  highlight,
  secondary,
  details,
  facts = [],
}: LotBlockProps) {
  const imageHref = imageListingUrl ?? listingUrl;
  return (
    <Section className="my-6">
      {primaryImageUrl ? (
        <Link href={imageHref}>
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
        className={`mt-0 text-lg font-bold text-fg ${lotSubtext ? "mb-0.5" : "mb-3"}`}
      >
        <Link className="text-fg no-underline" href={listingUrl}>
          {lotTitle}
        </Link>
      </Text>
      {lotSubtext ? (
        <Text className="mb-5 mt-0 text-sm text-secondary-fg">
          {lotSubtext}
        </Text>
      ) : null}
      {highlight && secondary ? (
        <Row>
          <Column className="w-1/2 align-top pr-4">
            <AmountColumn
              label={highlight.label}
              subtext={highlight.subtext}
              value={highlight.value}
            />
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
        <AmountColumn
          label={highlight.label}
          subtext={highlight.subtext}
          value={highlight.value}
        />
      ) : null}
      {details?.map((detail) => (
        <AmountColumn
          key={`${detail.label}:${detail.value}`}
          label={detail.label}
          subtext={detail.subtext}
          value={detail.value}
        />
      ))}
      {facts.map((fact) => (
        <Text key={fact} className="mb-1 mt-0 text-base text-fg-2">
          {fact}
        </Text>
      ))}
    </Section>
  );
}

import { Hr, Text } from "react-email";

export type GradingFooterProps = {
  /** The custodian's registered name. Unset outside production prints bracketed. */
  custodianName?: string;
  shopName: string;
  shopAddress?: string;
  complaintsContact?: string;
};

/** A value Legal has not set: named in brackets, and marked. */
function printed(value: string | undefined, name: string) {
  return value ?? `[${name}]`;
}

function isPlaceholder(value: string | undefined) {
  return value === undefined;
}

const placeholderStyle = { fontStyle: "italic" as const };

function Value({ value, name }: { value?: string; name: string }) {
  const text = printed(value, name);
  if (!isPlaceholder(value)) return text;

  return (
    <span className="text-danger" style={placeholderStyle}>
      {text}
    </span>
  );
}

/**
 * Who is writing, where, and on whose clock — under every grading letter.
 */
export function GradingFooter({
  custodianName,
  shopName,
  shopAddress,
  complaintsContact,
}: GradingFooterProps) {
  return (
    <>
      <Hr className="my-6 border-stroke" />
      <Text className="mb-2 mt-0 text-sm leading-base text-fg-2">
        <Value name="Custodian registered name" value={custodianName} />,
        trading as Grade10. {shopName} ·{" "}
        <Value name="Shop address" value={shopAddress} />
      </Text>
      <Text className="m-0 text-sm leading-base text-fg-3">
        Complaints:{" "}
        <Value name="Complaints contact" value={complaintsContact} />. Dates and
        times are Hong Kong time.
      </Text>
    </>
  );
}

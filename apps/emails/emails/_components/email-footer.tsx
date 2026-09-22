import { Hr, Link, Text } from "react-email";

export type EmailFooterProps = {
  whyYouGotThis: string;
  brandName?: string;
  canUnsubscribe?: boolean;
  /** Signed-in mute surface for this lot's email alerts. */
  muteUrl?: string;
  /** @deprecated Prefer `muteUrl`. */
  unwatchUrl?: string;
  /**
   * Extra lines under the standard footer, rendered one per line in order —
   * a registered name and licence line, a shop address, a complaints
   * contact, a time-zone line. A letter with none of these passes nothing.
   */
  lines?: string[];
};

export function EmailFooter({
  whyYouGotThis,
  brandName = "Grade10",
  canUnsubscribe = false,
  muteUrl,
  unwatchUrl,
  lines = [],
}: EmailFooterProps) {
  const alertsUrl = muteUrl ?? unwatchUrl;

  return (
    <>
      <Hr className="my-6 border-stroke" />
      <Text className="mb-2 mt-0 text-sm leading-base text-fg-2">
        {whyYouGotThis}
        {canUnsubscribe && alertsUrl ? (
          <>
            {" "}
            <Link className="text-fg-2" href={alertsUrl}>
              Manage alerts
            </Link>
          </>
        ) : null}
      </Text>
      <Text className="m-0 text-sm leading-base text-fg-3">
        © {new Date().getFullYear()} {brandName}.
      </Text>
      {lines.map((line, index) => (
        <Text
          className="m-0 mt-2 text-sm leading-base text-fg-3"
          key={`${index}:${line}`}
        >
          {line}
        </Text>
      ))}
    </>
  );
}

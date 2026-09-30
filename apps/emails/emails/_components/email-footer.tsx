import type { ReactNode } from "react";
import { Hr, Link, Text } from "react-email";

export type EmailFooterProps = {
  whyYouGotThis: string;
  brandName?: string;
  canUnsubscribe?: boolean;
  /** Signed-in mute surface for this auction's email alerts. */
  muteUrl?: string;
  /** @deprecated Prefer `muteUrl`. */
  unwatchUrl?: string;
  /**
   * Extra lines under the standard footer, rendered one per line in order —
   * a registered name and licence line, a shop address, a complaints
   * contact, a time-zone line. A letter with none of these passes nothing.
   *
   * A value Legal has not set is written into the line in brackets —
   * `[Shop address]` — and reads marked, so a staging letter still goes and
   * nobody mistakes the placeholder for the name.
   */
  lines?: string[];
  /**
   * The `© year` line. A collector letter carries none — its footer names
   * the party by its registered name instead — so the letter shell turns it
   * off; the notification mail keeps it, as the auction's worker prints it.
   */
  copyright?: boolean;
};

const PLACEHOLDER = /(\[[^\]]+\])/;

/** A value Legal has not set: named in brackets, and marked. */
function marked(line: string): ReactNode[] {
  return line.split(PLACEHOLDER).map((part) =>
    PLACEHOLDER.test(part) ? (
      <span className="text-danger" key={part} style={{ fontStyle: "italic" }}>
        {part}
      </span>
    ) : (
      part
    ),
  );
}

export function EmailFooter({
  whyYouGotThis,
  brandName = "Grade10",
  canUnsubscribe = false,
  muteUrl,
  unwatchUrl,
  lines = [],
  copyright = true,
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
      {copyright ? (
        <Text className="m-0 text-sm leading-base text-fg-3">
          © {new Date().getFullYear()} {brandName}.
        </Text>
      ) : null}
      {lines.map((line) => (
        <Text className="m-0 mt-2 text-sm leading-base text-fg-3" key={line}>
          {marked(line)}
        </Text>
      ))}
    </>
  );
}

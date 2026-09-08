import { Hr, Link, Text } from "react-email";

import { grade10EmailTheme } from "@/components/email/theme-grade10";

export type EmailFooterProps = {
  whyYouGotThis: string;
  brandName?: string;
  canUnsubscribe?: boolean;
  unwatchUrl?: string;
};

const theme = grade10EmailTheme;

export function EmailFooter({
  whyYouGotThis,
  brandName = "Grade10",
  canUnsubscribe = false,
  unwatchUrl,
}: EmailFooterProps) {
  return (
    <>
      <Hr
        style={{
          borderColor: theme.colorBorder,
          borderTop: `1px solid ${theme.colorBorder}`,
          margin: "8px 0 24px",
        }}
      />
      <Text
        style={{
          color: theme.colorTextMuted,
          fontSize: theme.fontSizeSm,
          lineHeight: theme.lineHeightBase,
          margin: "0 0 8px",
        }}
      >
        {whyYouGotThis}
        {canUnsubscribe && unwatchUrl ? (
          <>
            {" "}
            <Link href={unwatchUrl} style={{ color: theme.colorTextMuted }}>
              Stop watching this lot
            </Link>
          </>
        ) : null}
      </Text>
      <Text
        style={{
          color: theme.colorTextSubtle,
          fontSize: theme.fontSizeSm,
          lineHeight: theme.lineHeightBase,
          margin: 0,
        }}
      >
        © {new Date().getFullYear()} {brandName}.
      </Text>
    </>
  );
}

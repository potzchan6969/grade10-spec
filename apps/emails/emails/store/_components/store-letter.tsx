import { Text } from "react-email";

import {
  LetterShell,
  type LetterShellProps,
} from "@/emails/_components/letter-shell";
import { storeOrder } from "@/emails/store/fixtures";

export const viewOrder = { label: "查看訂單", href: storeOrder.orderUrl };

export type StoreLetterProps = Pick<
  LetterShellProps,
  "preheader" | "heading" | "lead" | "children"
> & {
  action: { label: string; href: string };
  /** The line directly above the footer: the order, or the closing thanks. */
  line?: string;
};

/**
 * The shell every Shopify order notification is written in: `LetterShell`
 * with the store's greeting, its footer line and the line above it.
 */
export function StoreLetter({
  action,
  line,
  children,
  ...shell
}: StoreLetterProps) {
  return (
    <LetterShell
      {...shell}
      cta={action}
      footer={{ lines: ["如有任何問題，直接回覆此電郵即可聯絡我們。"] }}
      greeting="你好："
      lang="zh-HK"
      trailer={
        line ? (
          <Text className="mb-0 mt-6 text-sm leading-base text-fg-2">
            {line}
          </Text>
        ) : null
      }
    >
      {children}
    </LetterShell>
  );
}

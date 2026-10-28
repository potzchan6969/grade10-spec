import { HStack } from "@grade10/design-system/components/layout/hstack";
import type { ReactNode } from "react";

/**
 * The one call to join under a campaign's ways to win, for a visitor who is
 * not signed in: every way needs an account, so it is asked once, not on
 * each card.
 */
function CampaignJoin({
  text,
  action,
}: {
  text: string;
  /** The join or sign-in button. */
  action: ReactNode;
}) {
  return (
    <HStack
      className="rounded-2xl border border-border bg-primary-muted px-6 py-5"
      data-slot="campaign-join"
      gap="md"
      hAlign="space-between"
      vAlign="center"
      wrap
    >
      <p className="font-bold">{text}</p>
      {action}
    </HStack>
  );
}

export { CampaignJoin };

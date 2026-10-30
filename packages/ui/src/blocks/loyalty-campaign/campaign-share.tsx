import { HStack } from "@grade10/design-system/components/layout/hstack";
import type { ReactNode } from "react";

/** A dark band at the foot of the page asking the reader to pass it on. */
function CampaignShare({
  text,
  action,
}: {
  text: string;
  /** The share button. */
  action: ReactNode;
}) {
  return (
    <HStack
      className="rounded-2xl bg-background-inverse px-6 py-5 text-primary-foreground"
      data-slot="campaign-share"
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

export { CampaignShare };

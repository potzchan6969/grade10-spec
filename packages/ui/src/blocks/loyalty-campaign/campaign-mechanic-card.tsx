import { Badge } from "@grade10/design-system/components/display/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@grade10/design-system/components/display/card";
import { Text } from "@grade10/design-system/components/display/text";
import { VStack } from "@grade10/design-system/components/layout/vstack";

import type { ReactNode } from "react";

type CampaignMechanicCardProps = {
  /** The way of taking part, in the member's language. */
  title: string;
  description?: string | null;
  /** What winning gives, drawn as the card's badge. */
  rewardLabel: string;
  /** How many gifts are left, worded by the consumer; omitted, none shows. */
  remaining?: string | null;
  /**
   * The consumer's name for where the member stands, carried on the card as
   * `data-step` so a page and its tests can tell the states apart.
   */
  step?: string;
  /** Where the member stands and their next step, under the gift. */
  children?: ReactNode;
};

/**
 * PROTOTYPE - not yet designed. One way of taking part in a campaign: its
 * name, what winning gives, how many are left, and the consumer's own
 * content for where the member stands. Drawn with the card primitive's own
 * look until the designer draws it; what the design must settle is listed on
 * the Campaigns page's prototype.
 */
function CampaignMechanicCard({
  title,
  description,
  rewardLabel,
  remaining,
  step,
  children,
}: CampaignMechanicCardProps) {
  return (
    <Card data-prototype="" data-slot="campaign-mechanic" data-step={step}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        <VStack gap="sm" hAlign="start">
          <VStack gap="xs" hAlign="start">
            <Badge variant="brand">{rewardLabel}</Badge>
            {remaining ? (
              <Text size="sm" tone="secondary">
                {remaining}
              </Text>
            ) : null}
          </VStack>
          {children}
        </VStack>
      </CardContent>
    </Card>
  );
}

export type { CampaignMechanicCardProps };
export { CampaignMechanicCard };

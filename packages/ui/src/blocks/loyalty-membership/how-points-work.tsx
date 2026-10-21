import {
  Card,
  CardContent,
} from "@grade10/design-system/components/display/card";
import { Text } from "@grade10/design-system/components/display/text";
import { Center } from "@grade10/design-system/components/layout/center";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import type { ReactNode } from "react";

type HowPointsWorkItem = {
  /** The mechanic's mark, drawn in an orange plate. */
  icon: ReactNode;
  /** The mechanic's name — "Earn". */
  title: string;
  /** What the mechanic does, in a sentence. */
  body: string;
};

type HowPointsWorkProps = {
  /** The mechanics to explain, in the order a member meets them. */
  items: readonly HowPointsWorkItem[];
  className?: string;
};

/**
 * The programme's mechanics as a card of rule rows: an orange icon plate, the
 * mechanic's name, and one line of what it does, hairline-separated. Rows
 * stack on a narrow viewport and pair into two columns on a wide one —
 * Figma's set (`7229:7427`) draws the stack; the pair is the section's own
 * layout.
 */
function HowPointsWork({ items, className }: HowPointsWorkProps) {
  return (
    <Card className={cn("w-full", className)} data-slot="how-points-work">
      <CardContent>
        <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-8">
          {items.map((item, index) => (
            <HStack
              className={cn(
                "gap-3",
                index > 0 && "border-t border-border pt-4",
                index === 1 && "sm:border-0 sm:pt-0",
              )}
              data-slot="how-points-work-row"
              gap="none"
              key={item.title}
              vAlign="start"
            >
              <Center className="size-9 shrink-0 rounded-xl bg-(--orange-50) text-(--orange-600)">
                {item.icon}
              </Center>
              <VStack className="min-w-0" gap="none">
                <Text className="font-medium text-foreground" size="sm">
                  {item.title}
                </Text>
                <Text className="text-secondary-foreground" size="xs">
                  {item.body}
                </Text>
              </VStack>
            </HStack>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export type { HowPointsWorkItem, HowPointsWorkProps };
export { HowPointsWork };

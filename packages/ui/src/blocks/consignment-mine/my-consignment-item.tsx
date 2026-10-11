import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { MyConsignmentItemView } from "./types";

type MyConsignmentItemCopy = {
  /** The badge an item whose term ends soon carries. */
  endingSoon: string;
};

type MyConsignmentItemProps = {
  copy: MyConsignmentItemCopy;
  item: MyConsignmentItemView;
  className?: string;
};

/**
 * One item of a consignment: its title and label, where it stands, the
 * channel it sells through, then its price, payout and dates a line each.
 */
function MyConsignmentItem({ copy, item, className }: MyConsignmentItemProps) {
  return (
    <VStack
      className={className}
      data-slot="consignment-mine-item"
      gap="xs"
      hAlign="stretch"
    >
      <HStack gap="sm" vAlign="center" wrap>
        <Text as="span" weight="medium">
          {item.title}
        </Text>
        {item.labelCode ? (
          <Text as="span" size="xs" tone="secondary">
            {item.labelCode}
          </Text>
        ) : null}
        <Badge size="sm">{item.state}</Badge>
        {item.endingSoon ? (
          <Badge size="sm" variant="warning">
            {copy.endingSoon}
          </Badge>
        ) : null}
      </HStack>
      {item.channel ? (
        <Text as="span" size="xs" tone="secondary">
          {item.channel}
        </Text>
      ) : null}
      {item.lines.map((line) => (
        <Text as="span" key={line} size="sm">
          {line}
        </Text>
      ))}
    </VStack>
  );
}

export type { MyConsignmentItemCopy, MyConsignmentItemProps };
export { MyConsignmentItem };

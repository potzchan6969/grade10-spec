import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { FactCard, type FactRow } from "../page-blocks/fact-card";
import type { MyConsignmentSummary } from "./types";

type MyConsignmentCardCopy = {
  /** The row label for how many items it holds. */
  items: string;
  /** The row label for what is owed. */
  owed: string;
  /** The row label for what was paid. */
  paid: string;
  /** The button that opens the consignment. */
  open: string;
};

type MyConsignmentCardProps = {
  copy: MyConsignmentCardCopy;
  consignment: MyConsignmentSummary;
  /** Opens the consignment, by its reference. */
  onOpen: (ref: string) => void;
  className?: string;
};

/**
 * One consignment on the consignor's list: where it stands, when it was
 * opened, how many items, what is owed and what was paid, and the way in.
 */
function MyConsignmentCard({
  copy,
  consignment,
  onOpen,
  className,
}: MyConsignmentCardProps) {
  const rows: FactRow[] = [{ label: copy.items, value: consignment.itemCount }];
  if (consignment.owed)
    rows.push({ label: copy.owed, value: consignment.owed });
  if (consignment.paid)
    rows.push({ label: copy.paid, value: consignment.paid });
  return (
    <FactCard
      actions={
        <Button
          onClick={() => onOpen(consignment.ref)}
          size="sm"
          type="button"
          variant="secondary"
        >
          {copy.open}
        </Button>
      }
      className={className}
      copy={{ title: consignment.heading, description: consignment.status }}
      lead={
        <Text as="p" size="sm" tone="secondary">
          {consignment.opened}
        </Text>
      }
      rows={rows}
      slot="consignment-mine-card"
    />
  );
}

export type { MyConsignmentCardCopy, MyConsignmentCardProps };
export { MyConsignmentCard };

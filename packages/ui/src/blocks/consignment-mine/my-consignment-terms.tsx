import { Text } from "@grade10/design-system/components/display/text";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { FactCard, type FactRow } from "../page-blocks/fact-card";
import type {
  MyConsignmentChannelValue,
  MyConsignmentTermsView,
} from "./types";

type MyConsignmentTermsCopy = {
  title: string;
  /** What reads while no terms are pinned yet. */
  notPinned: string;
  term: string;
  returnWindow: string;
  storeCommission: string;
  auctionCommission: string;
  minimum: string;
  fees: string;
  whenPaid: string;
  /** What a commission with no rate reads. */
  notSet: string;
};

type MyConsignmentTermsProps = {
  copy: MyConsignmentTermsCopy;
  /** Null until the agreement is prepared. */
  terms: MyConsignmentTermsView | null;
  className?: string;
};

function perChannel(values: readonly MyConsignmentChannelValue[]) {
  return (
    <VStack gap="xs">
      {values.map((entry) => (
        <Text as="span" key={entry.label} size="sm">
          {`${entry.label}: ${entry.value}`}
        </Text>
      ))}
    </VStack>
  );
}

/**
 * The terms pinned to a consignment: its term, return window, commissions,
 * minimums, fees and when the consignor is paid. Before the agreement is
 * prepared it says the terms are pinned then.
 */
function MyConsignmentTerms({
  copy,
  terms,
  className,
}: MyConsignmentTermsProps) {
  if (terms === null) {
    return (
      <FactCard
        className={className}
        copy={{ title: copy.title, description: copy.notPinned }}
        slot="consignment-mine-terms"
      />
    );
  }
  const rows: FactRow[] = [
    { label: copy.term, value: terms.term },
    { label: copy.returnWindow, value: terms.returnWindow },
    {
      label: copy.storeCommission,
      value:
        terms.storeCommission.length === 0 ? (
          copy.notSet
        ) : (
          <VStack gap="xs">
            {terms.storeCommission.map((band) => (
              <Text as="span" key={band} size="sm">
                {band}
              </Text>
            ))}
          </VStack>
        ),
    },
    {
      label: copy.auctionCommission,
      value: terms.auctionCommission ?? copy.notSet,
    },
    { label: copy.minimum, value: perChannel(terms.minimum) },
    { label: copy.fees, value: terms.fees },
    { label: copy.whenPaid, value: perChannel(terms.whenPaid) },
  ];
  return (
    <FactCard
      className={className}
      copy={{ title: copy.title, description: terms.pinned }}
      rows={rows}
      slot="consignment-mine-terms"
    />
  );
}

export type { MyConsignmentTermsCopy, MyConsignmentTermsProps };
export { MyConsignmentTerms };

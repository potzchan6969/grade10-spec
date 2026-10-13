import { Text } from "react-email";

export type ItemLineProps = {
  vaultId: string;
  itemTitle: string;
};

/** The item's own line, directly above the footer of every letter. */
export function ItemLine({ vaultId, itemTitle }: ItemLineProps) {
  return (
    <Text className="mb-0 mt-6 text-sm leading-base text-fg-2">
      Item <span className="font-bold text-fg">{vaultId}</span> · {itemTitle}
    </Text>
  );
}

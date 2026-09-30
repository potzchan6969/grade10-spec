import { Text } from "react-email";

export type CaseLineProps = {
  reference: string;
  itemTitle: string;
};

/** The case's own line, directly above the footer of every letter. */
export function CaseLine({ reference, itemTitle }: CaseLineProps) {
  return (
    <Text className="mb-0 mt-6 text-sm leading-base text-fg-2">
      Case <span className="font-bold text-fg">{reference}</span> · {itemTitle}
    </Text>
  );
}

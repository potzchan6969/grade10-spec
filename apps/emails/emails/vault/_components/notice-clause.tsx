import { hkDate, money } from "@/emails/_components/format";
import { FactsGroup, Note } from "@/emails/vault/_components/vault-letter";

export type NoticeClauseProps = {
  itemTitle: string;
  payBy: string;
  outstandingMinor: number;
  lateDayMinor: number;
};

/**
 * The written forfeiture notice's own furniture after the clause it opens on:
 * the figures, that taking the item is a person's decision and never
 * automatic, and that it is the last reminder this loan gets.
 */
export function NoticeClause({
  itemTitle,
  payBy,
  outstandingMinor,
  lateDayMinor,
}: NoticeClauseProps) {
  return (
    <>
      <FactsGroup
        facts={[
          { label: "Pay in full by", value: hkDate(payBy) },
          { label: "Outstanding today", value: money(outstandingMinor) },
          { label: "Each further day adds", value: money(lateDayMinor) },
          {
            label: "If it is not settled by then",
            value: `We may take ${itemTitle} to settle the debt`,
          },
        ]}
      />
      <Note>
        Taking {itemTitle} to settle this loan is a person's decision, never an
        automatic one.
      </Note>
      <Note>This is the last reminder you will get about this loan.</Note>
    </>
  );
}

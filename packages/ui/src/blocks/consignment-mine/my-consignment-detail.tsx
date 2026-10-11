import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { FactCard } from "../page-blocks/fact-card";
import { NoteList } from "../page-blocks/note-list";
import { StageRail, type StageRailStage } from "../page-blocks/stage-rail";
import {
  MyConsignmentItem,
  type MyConsignmentItemCopy,
} from "./my-consignment-item";
import {
  MyConsignmentTerms,
  type MyConsignmentTermsCopy,
} from "./my-consignment-terms";
import type { MyConsignmentDetailView } from "./types";

type MyConsignmentDetailCopy = {
  /** Every stage the consignor's rail walks, in order. */
  stages: readonly StageRailStage[];
  /** The word under the stage a consignment ended at, unsold. */
  ended: string;
  itemsTitle: string;
  item: MyConsignmentItemCopy;
  terms: MyConsignmentTermsCopy;
  sellerTitle: string;
  payoutsTitle: string;
  noPayouts: string;
  documentsTitle: string;
  documentsNote: string;
  noDocuments: string;
  messagesTitle: string;
  noMessages: string;
};

type MyConsignmentDetailProps = {
  copy: MyConsignmentDetailCopy;
  detail: MyConsignmentDetailView;
};

/**
 * One consignment as its consignor reads it: where it stands on the rail,
 * each item, the terms pinned to it, whether the store names them, the
 * payouts made, the documents it holds and the emails sent. Drawn as
 * siblings, so the consumer's stack spaces them.
 */
function MyConsignmentDetail({ copy, detail }: MyConsignmentDetailProps) {
  return (
    <>
      <VStack gap="sm" hAlign="stretch">
        <Text as="h2" size="xl" weight="medium">
          {detail.heading}
        </Text>
        <Text as="p" size="sm" tone="secondary">
          {detail.opened}
        </Text>
        <HStack gap="sm" vAlign="center" wrap>
          <Badge variant={detail.ended ? "warning" : "default"}>
            {detail.status}
          </Badge>
          {detail.owed ? (
            <Text as="span" size="sm">
              {detail.owed}
            </Text>
          ) : null}
          {detail.paid ? (
            <Text as="span" size="sm">
              {detail.paid}
            </Text>
          ) : null}
        </HStack>
        <StageRail
          copy={{
            stages: copy.stages,
            ended: detail.ended ? copy.ended : undefined,
          }}
          current={detail.stage}
          slot="consignment-mine-stages"
        />
      </VStack>

      <FactCard copy={{ title: copy.itemsTitle }} slot="consignment-mine-items">
        <VStack gap="md" hAlign="stretch">
          {detail.items.map((item) => (
            <MyConsignmentItem copy={copy.item} item={item} key={item.id} />
          ))}
        </VStack>
      </FactCard>

      <MyConsignmentTerms copy={copy.terms} terms={detail.terms} />

      <FactCard
        copy={{ title: copy.sellerTitle }}
        slot="consignment-mine-seller"
      >
        <Text as="p" size="sm">
          {detail.seller}
        </Text>
      </FactCard>

      <FactCard
        copy={{ title: copy.payoutsTitle }}
        slot="consignment-mine-payouts"
      >
        {detail.payouts.length === 0 ? (
          <Text as="p" size="sm" tone="secondary">
            {copy.noPayouts}
          </Text>
        ) : (
          <NoteList
            notes={detail.payouts.map((payout) => ({
              id: payout.id,
              content: (
                <VStack gap="xs">
                  <Text as="span" size="sm" weight="medium">
                    {payout.line}
                  </Text>
                  {payout.parts.map((part) => (
                    <Text as="span" key={part.id} size="xs" tone="secondary">
                      {part.text}
                    </Text>
                  ))}
                </VStack>
              ),
            }))}
            slot="consignment-mine-payout-list"
          />
        )}
      </FactCard>

      <FactCard
        copy={{ title: copy.documentsTitle, description: copy.documentsNote }}
        slot="consignment-mine-documents"
      >
        {detail.documents.length === 0 ? (
          <Text as="p" size="sm" tone="secondary">
            {copy.noDocuments}
          </Text>
        ) : (
          <NoteList
            notes={detail.documents.map((document) => ({
              id: document.id,
              content: (
                <VStack gap="xs">
                  <Text as="span" size="sm" weight="medium">
                    {document.title}
                  </Text>
                  <Text as="span" size="xs" tone="secondary">
                    {document.note}
                  </Text>
                </VStack>
              ),
            }))}
            slot="consignment-mine-document-list"
          />
        )}
      </FactCard>

      <FactCard
        copy={{ title: copy.messagesTitle }}
        slot="consignment-mine-messages"
      >
        {detail.messages.length === 0 ? (
          <Text as="p" size="sm" tone="secondary">
            {copy.noMessages}
          </Text>
        ) : (
          <NoteList
            notes={detail.messages.map((message) => ({
              id: message.id,
              content: (
                <Text as="span" size="sm">
                  {message.line}
                </Text>
              ),
            }))}
            slot="consignment-mine-message-list"
          />
        )}
      </FactCard>
    </>
  );
}

export type { MyConsignmentDetailCopy, MyConsignmentDetailProps };
export { MyConsignmentDetail };

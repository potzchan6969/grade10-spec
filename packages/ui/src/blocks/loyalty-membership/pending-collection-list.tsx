import { Badge } from "@grade10/design-system/components/display/badge";
import { List, ListItem } from "@grade10/design-system/components/display/list";
import { Skeleton } from "@grade10/design-system/components/display/skeleton";
import { Text } from "@grade10/design-system/components/display/text";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { AsyncState } from "../shared/async";
import { AsyncMessage } from "../shared/async-message";
import type { PendingCollectionItem } from "./types";

/** The words the list says, whatever is waiting in it. */
type PendingCollectionListCopy = {
  /** Accessible name of the list. */
  label: string;
  /** Where every collection happens. */
  location: string;
  /** Names a redemption whose window passed uncollected. */
  expired: string;
  /** The unit points are counted in — "pts". */
  points: string;
};

type PendingCollectionListProps = {
  copy: PendingCollectionListCopy;
  state: AsyncState<readonly PendingCollectionItem[]>;
  className?: string;
};

function PendingCollectionRow({
  copy,
  item,
}: {
  copy: PendingCollectionListCopy;
  item: PendingCollectionItem;
}) {
  return (
    <VStack
      className="w-full"
      data-expired={item.expired || undefined}
      data-slot="pending-collection-item"
      gap="xs"
    >
      <HStack align="baseline" gap="md" justify="space-between">
        <HStack align="baseline" gap="sm">
          <Text weight="medium">{item.name}</Text>
          {item.expired ? (
            <Badge size="sm" variant="error">
              {copy.expired}
            </Badge>
          ) : null}
        </HStack>
        <Text className="shrink-0" size="sm" tone="secondary">
          {item.pointsPaid} {copy.points}
        </Text>
      </HStack>
      <Text size="sm" tone="secondary">
        {item.redeemedDate}
      </Text>
      <Text
        data-slot="pending-collection-window"
        size="sm"
        tone={item.expired ? "muted" : "primary"}
      >
        {item.collectBy}
      </Text>
    </VStack>
  );
}

/**
 * Rewards paid for and waiting to be handed over. Waiting is the normal state
 * here, not a failure — nothing on this surface retries or alarms. Where to
 * collect is the programme's word, said once for the list; each redemption
 * carries only its own window.
 */
function PendingCollectionList({
  copy,
  state,
  className,
}: PendingCollectionListProps) {
  return (
    <VStack className={className} data-slot="pending-collection-list" gap="sm">
      <Text data-slot="pending-collection-location" size="sm" tone="secondary">
        {copy.location}
      </Text>
      {state.status === "loading" ? (
        <VStack className="gap-3" data-slot="pending-collection-loading">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </VStack>
      ) : null}
      {state.status === "empty" || state.status === "error" ? (
        <AsyncMessage
          action={state.action}
          message={state.message}
          slot={`pending-collection-${state.status}`}
        />
      ) : null}
      {state.status === "ready" ? (
        <List aria-label={copy.label}>
          {state.data.map((item, index) => (
            <ListItem
              className="px-0 py-3"
              divider={index < state.data.length - 1}
              key={item.id}
            >
              <PendingCollectionRow copy={copy} item={item} />
            </ListItem>
          ))}
        </List>
      ) : null}
    </VStack>
  );
}

export type { PendingCollectionListCopy, PendingCollectionListProps };
export { PendingCollectionList };

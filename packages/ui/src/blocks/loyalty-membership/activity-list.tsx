import { List, ListItem } from "@grade10/design-system/components/display/list";
import { Skeleton } from "@grade10/design-system/components/display/skeleton";
import { Text } from "@grade10/design-system/components/display/text";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { AsyncState } from "../shared/async";
import { AsyncMessage } from "../shared/async-message";
import type { ActivityEntry } from "./types";

/** The words the list says, whatever the member did. */
type ActivityListCopy = {
  /** Accessible name of the list. */
  label: string;
};

type ActivityListProps = {
  copy: ActivityListCopy;
  state: AsyncState<readonly ActivityEntry[]>;
  className?: string;
};

function ActivityRow({ entry }: { entry: ActivityEntry }) {
  return (
    <VStack className="w-full" data-slot="activity-list-item" gap="xs">
      <HStack align="baseline" gap="md" justify="space-between">
        <Text weight="medium">{entry.kind}</Text>
        <Text
          className="shrink-0"
          data-slot="activity-list-delta"
          tone={entry.delta > 0 ? "success" : "primary"}
          weight="medium"
        >
          {entry.delta > 0 ? `+${entry.delta}` : entry.delta}
        </Text>
      </HStack>
      <HStack align="baseline" gap="md" justify="space-between">
        <Text size="sm" tone="secondary">
          {entry.channel ? (
            <>
              <span data-slot="activity-list-channel">{entry.channel}</span> ·{" "}
            </>
          ) : null}
          {entry.date}
        </Text>
        {entry.context ? (
          <Text data-slot="activity-list-context" size="sm" tone="secondary">
            {entry.context}
          </Text>
        ) : null}
      </HStack>
    </VStack>
  );
}

/**
 * The member's own ledger, in the member's own terms. Each entry arrives
 * already named — what an operator wrote on it, its retry key, and how it was
 * priced internally never reach this surface, so no prop can carry them.
 */
function ActivityList({ copy, state, className }: ActivityListProps) {
  return (
    <VStack className={className} data-slot="activity-list" gap="sm">
      {state.status === "loading" ? (
        <VStack className="gap-3" data-slot="activity-list-loading">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </VStack>
      ) : null}
      {state.status === "empty" || state.status === "error" ? (
        <AsyncMessage
          action={state.action}
          message={state.message}
          slot={`activity-list-${state.status}`}
        />
      ) : null}
      {state.status === "ready" ? (
        <List aria-label={copy.label}>
          {state.data.map((entry, index) => (
            <ListItem
              className="px-0 py-3"
              divider={index < state.data.length - 1}
              key={entry.id}
            >
              <ActivityRow entry={entry} />
            </ListItem>
          ))}
        </List>
      ) : null}
    </VStack>
  );
}

export type { ActivityListCopy, ActivityListProps };
export { ActivityList };

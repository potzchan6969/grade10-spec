import { VStack } from "@grade10/design-system/components/layout/vstack";
import { EmptyPanel } from "../page-blocks/empty-panel";
import { FactCardSkeleton } from "../page-blocks/fact-card-skeleton";
import {
  MyConsignmentCard,
  type MyConsignmentCardCopy,
} from "./my-consignment-card";
import {
  MyConsignmentsFailed,
  type MyConsignmentsFailedCopy,
} from "./my-consignments-failed";
import {
  MyConsignmentsSignIn,
  type MyConsignmentsSignInCopy,
} from "./my-consignments-sign-in";
import type { MyConsignmentsState } from "./types";

type MyConsignmentListCopy = {
  /** What is loading; the busy status's name. */
  loading: string;
  failed: MyConsignmentsFailedCopy;
  emptyTitle: string;
  emptyBody: string;
  signIn: MyConsignmentsSignInCopy;
  card: MyConsignmentCardCopy;
};

type MyConsignmentListProps = {
  copy: MyConsignmentListCopy;
  /** The list's read; its rows in the order they read, newest first. */
  state: MyConsignmentsState;
  /** Opens one consignment, by its reference. */
  onOpen: (ref: string) => void;
  onRetry: () => void;
  /** What the sign-in invitation does; without it the invitation only says so. */
  onSignIn?: () => void;
  className?: string;
};

/**
 * Every consignment the consignor handed to Grade10, one card each, in the
 * order given. Signed out it invites a sign-in; while the read runs it holds
 * two placeholder cards; a failed read says so with its retry; and an empty
 * list says nothing is consigned yet.
 */
function MyConsignmentList({
  copy,
  state,
  onOpen,
  onRetry,
  onSignIn,
  className,
}: MyConsignmentListProps) {
  if (state.status === "signedOut") {
    return (
      <MyConsignmentsSignIn
        className={className}
        copy={copy.signIn}
        onSignIn={onSignIn}
      />
    );
  }
  return (
    <VStack
      className={className}
      data-slot="consignment-mine-list"
      gap="md"
      hAlign="stretch"
    >
      {state.status === "loading" ? (
        <FactCardSkeleton
          copy={{ label: copy.loading }}
          count={2}
          slot="consignment-mine-loading"
        />
      ) : null}
      {state.status === "error" ? (
        <MyConsignmentsFailed copy={copy.failed} onRetry={onRetry} />
      ) : null}
      {state.status === "ready" ? (
        state.data.length === 0 ? (
          <EmptyPanel
            copy={{ title: copy.emptyTitle, description: copy.emptyBody }}
            slot="consignment-mine-empty"
          />
        ) : (
          state.data.map((consignment) => (
            <MyConsignmentCard
              consignment={consignment}
              copy={copy.card}
              key={consignment.ref}
              onOpen={onOpen}
            />
          ))
        )
      ) : null}
    </VStack>
  );
}

export type { MyConsignmentListCopy, MyConsignmentListProps };
export { MyConsignmentList };

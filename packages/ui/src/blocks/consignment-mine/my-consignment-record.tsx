import { Button } from "@grade10/design-system/components/forms/button";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { EmptyPanel } from "../page-blocks/empty-panel";
import { FactCardSkeleton } from "../page-blocks/fact-card-skeleton";
import {
  MyConsignmentDetail,
  type MyConsignmentDetailCopy,
} from "./my-consignment-detail";
import {
  MyConsignmentsFailed,
  type MyConsignmentsFailedCopy,
} from "./my-consignments-failed";
import {
  MyConsignmentsSignIn,
  type MyConsignmentsSignInCopy,
} from "./my-consignments-sign-in";
import type { MyConsignmentState } from "./types";

type MyConsignmentRecordCopy = {
  /** The way back to the consignor's list. */
  back: string;
  /** What is loading; the busy status's name. */
  loading: string;
  failed: MyConsignmentsFailedCopy;
  notFoundTitle: string;
  notFoundBody: string;
  signIn: MyConsignmentsSignInCopy;
  detail: MyConsignmentDetailCopy;
};

type MyConsignmentRecordProps = {
  copy: MyConsignmentRecordCopy;
  state: MyConsignmentState;
  onRetry: () => void;
  /** Back to the consignor's list; without it no way back is drawn. */
  onBack?: () => void;
  /** What the sign-in invitation does; without it the invitation only says so. */
  onSignIn?: () => void;
  className?: string;
};

/**
 * One of the consignor's consignments, page-scale: the way back, then the
 * consignment as its read stands. Signed out it invites a sign-in and
 * nothing else; a reference that is not theirs reads as not found, never as
 * someone else's.
 */
function MyConsignmentRecord({
  copy,
  state,
  onRetry,
  onBack,
  onSignIn,
  className,
}: MyConsignmentRecordProps) {
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
      data-slot="consignment-mine-detail"
      gap="lg"
      hAlign="stretch"
    >
      {onBack ? (
        <HStack>
          <Button onClick={onBack} size="sm" type="button" variant="ghost">
            {copy.back}
          </Button>
        </HStack>
      ) : null}
      {state.status === "loading" ? (
        <FactCardSkeleton
          copy={{ label: copy.loading }}
          count={3}
          slot="consignment-mine-loading"
        />
      ) : null}
      {state.status === "error" ? (
        <MyConsignmentsFailed copy={copy.failed} onRetry={onRetry} />
      ) : null}
      {state.status === "notFound" ? (
        <EmptyPanel
          copy={{ title: copy.notFoundTitle, description: copy.notFoundBody }}
          slot="consignment-mine-not-found"
        />
      ) : null}
      {state.status === "ready" ? (
        <MyConsignmentDetail copy={copy.detail} detail={state.data} />
      ) : null}
    </VStack>
  );
}

export type { MyConsignmentRecordCopy, MyConsignmentRecordProps };
export { MyConsignmentRecord };

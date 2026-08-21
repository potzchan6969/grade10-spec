import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@grade10/design-system/components/display/card";
import { Skeleton } from "@grade10/design-system/components/display/skeleton";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import type { ReactNode } from "react";
import type { AsyncState } from "../shared/async";
import { AsyncMessage } from "../shared/async-message";

/** The words the card says, whoever's profile is in it. */
type ProfileCardCopy = {
  title: string;
  description?: string;
};

type ProfileCardProps = {
  copy: ProfileCardCopy;
  /** The card's one async boundary. `ready` carries the body the consumer
   * chose — a `ProfileDetails`, a `ProfileForm`, or both around a hint —
   * because view-versus-edit is product state this card must not hold. */
  state: AsyncState<ReactNode>;
  className?: string;
};

/** The profile surface: a card whose body is loading, failed, empty, or
 * whatever the consumer put behind `ready`. */
function ProfileCard({ copy, state, className }: ProfileCardProps) {
  return (
    <Card className={cn("max-w-md", className)} data-slot="profile-card">
      <CardHeader>
        <CardTitle>{copy.title}</CardTitle>
        {copy.description ? (
          <CardDescription>{copy.description}</CardDescription>
        ) : null}
      </CardHeader>
      <CardContent>
        <VStack gap="md">
          {state.status === "loading" ? (
            <VStack className="gap-3" data-slot="profile-loading">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </VStack>
          ) : null}
          {state.status === "empty" || state.status === "error" ? (
            <AsyncMessage
              action={state.action}
              message={state.message}
              slot={`profile-${state.status}`}
            />
          ) : null}
          {state.status === "ready" ? state.data : null}
        </VStack>
      </CardContent>
    </Card>
  );
}

export type { ProfileCardCopy, ProfileCardProps };
export { ProfileCard };

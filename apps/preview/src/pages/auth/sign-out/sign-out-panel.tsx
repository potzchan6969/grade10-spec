import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@grade10/design-system/components/display/card";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { AUTH_COPY } from "../auth-content";

type SignOutStatus = "signed-in" | "pending" | "refused" | "signed-out";

type SignOutPanelProps = {
  status: SignOutStatus;
  email?: string;
};

/** Draft words the catalogue does not hold yet. */
const SIGNING_OUT = "Signing out…";
const SIGNED_OUT = "You are signed out.";
const ACCOUNT = "Your account";

/**
 * The account panel's sign-out control and what it says while it runs. A
 * refused sign-out keeps the message and offers Try again; a signed-out panel
 * says so and offers to sign in.
 */
function SignOutPanel({ status, email }: SignOutPanelProps) {
  if (status === "signed-out") {
    return (
      <Card className="w-full max-w-md" data-slot="sign-out-panel">
        <CardHeader>
          <CardTitle>{ACCOUNT}</CardTitle>
        </CardHeader>
        <CardContent>
          <VStack gap="md">
            <Text>{SIGNED_OUT}</Text>
            <Button type="button">{AUTH_COPY.signIn}</Button>
          </VStack>
        </CardContent>
      </Card>
    );
  }

  const pending = status === "pending";
  const refused = status === "refused";

  return (
    <Card className="w-full max-w-md" data-slot="sign-out-panel">
      <CardHeader>
        <CardTitle>{ACCOUNT}</CardTitle>
      </CardHeader>
      <CardContent>
        <VStack gap="md">
          {email ? <Text tone="secondary">{email}</Text> : null}
          {refused ? (
            <Text role="alert" tone="error">
              {AUTH_COPY.signOutFailed}
            </Text>
          ) : null}
          <Button
            disabled={pending}
            loading={pending}
            type="button"
            variant={refused ? "outline" : "default"}
          >
            {pending
              ? SIGNING_OUT
              : refused
                ? AUTH_COPY.retry
                : AUTH_COPY.signOut}
          </Button>
        </VStack>
      </CardContent>
    </Card>
  );
}

export type { SignOutPanelProps, SignOutStatus };
export { SignOutPanel };

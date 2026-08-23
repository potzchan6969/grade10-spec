import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@grade10/design-system/components/display/card";
import { Divider } from "@grade10/design-system/components/display/divider";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import type { ReactNode } from "react";

type SignInCardAction = { label: ReactNode; onAction: () => void };

/** The words the card says, whatever step is inside it. */
type SignInCardCopy = {
  title: string;
  description?: string;
  /** Names the divider between the email flow and the providers. Required
   * whenever `providerSlot` is set — the card carries no English of its own. */
  providerDivider?: string;
};

type SignInCardProps = {
  copy: SignInCardCopy;
  /** The active step — a `SignInEmailForm`, a `SignInCodeForm`, or anything
   * else the consumer's flow needs. */
  children: ReactNode;
  /** Progress line under the step — "check your inbox". Not an error: field
   * errors travel on the step's own `error` prop. */
  message?: ReactNode;
  /** External identity buttons (Google, passkeys…), rendered under the
   * divider. The consumer owns the widget; this card only places it. */
  providerSlot?: ReactNode;
  /** A way out of the flow — "back to home". */
  exitAction?: SignInCardAction;
  className?: string;
};

/**
 * The sign-in surface's shell: heading, the active step, a status line, an
 * external-provider slot, and an exit.
 *
 * Which step renders is the consumer's decision — the flow (magic link, code,
 * OAuth, or any mix) is product state, so the card holds no step machine.
 */
function SignInCard({
  copy,
  children,
  message,
  providerSlot,
  exitAction,
  className,
}: SignInCardProps) {
  return (
    <Card className={cn("w-full max-w-sm", className)} data-slot="sign-in-card">
      <CardHeader>
        <CardTitle>{copy.title}</CardTitle>
        {copy.description ? (
          <CardDescription>{copy.description}</CardDescription>
        ) : null}
      </CardHeader>
      <CardContent>
        <VStack gap="md">
          {children}
          {message ? (
            <Text data-slot="sign-in-message" size="sm" tone="success">
              {message}
            </Text>
          ) : null}
          {providerSlot ? (
            <>
              <Divider label={copy.providerDivider} />
              {providerSlot}
            </>
          ) : null}
          {exitAction ? (
            <Button onClick={exitAction.onAction} type="button" variant="ghost">
              {exitAction.label}
            </Button>
          ) : null}
        </VStack>
      </CardContent>
    </Card>
  );
}

export type { SignInCardAction, SignInCardCopy, SignInCardProps };
export { SignInCard };

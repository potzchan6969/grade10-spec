import { Divider } from "@grade10/design-system/components/display/divider";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@grade10/design-system/components/overlays/dialog";
import { cn } from "@grade10/design-system/lib/utils";
import type { ReactNode } from "react";

type SignInCardAction = { label: ReactNode; onAction: () => void };

/** The words the card says, whatever step is inside it. */
type SignInCardCopy = {
  title: string;
  description?: string;
  /** Names the divider between the providers and the email flow. Required
   * whenever `providerSlot` is set — the card carries no English of its own. */
  providerDivider?: string;
  /** Terms and privacy line, drawn centred as the last node of the dialog
   * body. The consumer owns the wording and any links inside it; a link it
   * carries belongs at `size="xs"`, matching the line around it. */
  legal?: ReactNode;
};

type SignInCardProps = {
  copy: SignInCardCopy;
  /** Whether the dialog is showing. Sign-in is an overlay over whatever the
   * collector was already doing, so visibility is the consumer's state, not
   * this component's — there is deliberately no uncontrolled fallback. */
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The active step — a `SignInEmailForm`, or anything else the consumer's
   * flow needs. */
  children: ReactNode;
  /** Progress line under the step — "check your inbox". Not an error: field
   * errors travel on the step's own `error` prop. */
  message?: ReactNode;
  /** External identity buttons (Google, passkeys…), rendered above the
   * divider. The consumer owns the widget; this dialog only places it.
   *
   * A widget that a script fills in asynchronously should mark its container
   * `data-slot="sign-in-provider"`: the divider hides for as long as that
   * container is empty, so a script that never answers leaves no orphaned
   * "or" behind. */
  providerSlot?: ReactNode;
  /** A way out of the flow — "back to home". Distinct from dismissing the
   * dialog, which the header's close control, Escape and the scrim all do. */
  exitAction?: SignInCardAction;
  className?: string;
};

/**
 * The sign-in surface's shell: heading, an external-provider slot, the active
 * step, a status line, and an exit.
 *
 * A dialog rather than a page, because that is what Figma draws — the Auth
 * Sign-In page holds `Login Dialog` (4666:1488) over `Login Dialog Overlay`
 * (4666:1523) and no card-on-a-page layout at all. It matters beyond the
 * pixels: a collector asked to sign in mid-flow keeps the page they were on
 * mounted behind the scrim instead of losing it to a route change.
 *
 * `DialogContent` already carries every value the Figma frame specifies — 448
 * wide, radius 32, padding 24, gap 24 — and `--overlay` already resolves to
 * the `#0A0A0A4D` the scrim is drawn with, so nothing here restates them. The
 * one local override is the body gap: the generic Dialog draws its body at 16
 * and this surface at 24.
 *
 * Which step renders is the consumer's decision — the flow (magic link,
 * OAuth, or any mix) is product state, so the dialog holds no step machine.
 */
function SignInCard({
  copy,
  open,
  onOpenChange,
  children,
  message,
  providerSlot,
  exitAction,
  className,
}: SignInCardProps) {
  return (
    // Base UI calls its own onOpenChange with an event-details argument after
    // the boolean. Narrowing it here keeps the prop's declared
    // `(open: boolean) => void` true — passing the callback straight through
    // would hand a consumer's two-parameter function a second argument it
    // never asked for.
    <Dialog onOpenChange={(next) => onOpenChange(next)} open={open}>
      <DialogContent
        className={cn(className)}
        data-slot="sign-in-card"
        aria-label={copy.title}
      >
        <DialogHeader>
          <DialogTitle>{copy.title}</DialogTitle>
        </DialogHeader>
        {/* gap-6 is this surface's, not the primitive's: Figma draws the
            generic Dialog body at 16 and the Login Dialog body at 24. */}
        <DialogBody className="gap-6">
          {copy.description ? (
            <DialogDescription>{copy.description}</DialogDescription>
          ) : null}
          {providerSlot ? (
            /* The divider follows what actually drew. A widget that renders
               asynchronously — Google's own button arrives from a script that
               may never answer — marks its container `sign-in-provider`, and
               while that container is empty the pair hides rather than
               stranding an "or" over blank space. A widget that draws its own
               markup marks nothing and is always shown. */
            <VStack
              className="w-full has-[[data-slot=sign-in-provider]:empty]:hidden"
              gap="lg"
            >
              {providerSlot}
              <Divider label={copy.providerDivider} />
            </VStack>
          ) : null}
          {children}
          {message ? (
            /* `primary`, not `success`: under the grade10 theme the success
               tone resolves to `--success-foreground`, the white drawn ON a
               success fill, so the line renders white on a white dialog. The
               readable status tone the theme is missing is a token decision;
               until it exists, a line the collector has to read takes the
               body tone. */
            <Text data-slot="sign-in-message" size="sm">
              {message}
            </Text>
          ) : null}
          {exitAction ? (
            <Button onClick={exitAction.onAction} type="button" variant="ghost">
              {exitAction.label}
            </Button>
          ) : null}
          {copy.legal ? (
            /* Figma draws this line centred across the body at 12/16. Size
               and alignment are what separate it from the status line above;
               both take the body tone. */
            <Text
              className="w-full text-center"
              data-slot="sign-in-legal"
              size="xs"
            >
              {copy.legal}
            </Text>
          ) : null}
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}

export type { SignInCardAction, SignInCardCopy, SignInCardProps };
export { SignInCard };

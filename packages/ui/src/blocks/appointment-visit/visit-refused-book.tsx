import { Alert } from "@grade10/design-system/components/display/alert";
import { Button } from "@grade10/design-system/components/forms/button";
import { Link } from "@grade10/design-system/components/forms/link";

/** Why a Book press was refused: too many tries today, or a visit already
 * held — shown to its signed-in owner, or only said to a signed-out one. */
type VisitRefusal = "tries" | "held" | "heldOut";

type VisitRefusedBookCopy = {
  title: string;
  body?: string;
  /** The way on: call the shop, open the visit, or sign in. */
  action?: string;
};

type VisitRefusedBookProps = {
  copy: VisitRefusedBookCopy;
  refusal: VisitRefusal;
  /** Where the action leads, when it is a link. */
  actionHref?: string;
  /** What the action does, when it is a press. */
  onAction?: () => void;
};

/** What a refused Book press says. Email is not identity: signed out, a held
 * visit only says its link went to that inbox. */
function VisitRefusedBook({
  copy,
  refusal,
  actionHref,
  onAction,
}: VisitRefusedBookProps) {
  const action = !copy.action ? undefined : actionHref ? (
    <Link href={actionHref}>{copy.action}</Link>
  ) : onAction ? (
    <Button onClick={onAction} size="sm" type="button" variant="outline">
      {copy.action}
    </Button>
  ) : undefined;
  return (
    <Alert
      actions={action}
      description={copy.body}
      role="alert"
      status={refusal === "tries" ? "error" : "warning"}
      title={copy.title}
    />
  );
}

export type { VisitRefusal, VisitRefusedBookCopy, VisitRefusedBookProps };
export { VisitRefusedBook };

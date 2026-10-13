import { Alert } from "@grade10/design-system/components/display/alert";
import { Button } from "@grade10/design-system/components/forms/button";

type VisitReconnectingCopy = {
  title: string;
  /** What the page last knew and when. */
  body: string;
  retry: string;
  trying: string;
};

type VisitReconnectingProps = {
  copy: VisitReconnectingCopy;
  /** A retry is under way. */
  busy: boolean;
  onRetry: () => void;
};

/** A live page that lost its signal: what it last knew and when, and Try now. */
function VisitReconnecting({ copy, busy, onRetry }: VisitReconnectingProps) {
  return (
    <Alert
      actions={
        <Button
          disabled={busy}
          onClick={onRetry}
          size="sm"
          type="button"
          variant="outline"
        >
          {busy ? copy.trying : copy.retry}
        </Button>
      }
      data-slot="reconnecting"
      description={copy.body}
      role="status"
      status="warning"
      title={copy.title}
    />
  );
}

export type { VisitReconnectingCopy, VisitReconnectingProps };
export { VisitReconnecting };

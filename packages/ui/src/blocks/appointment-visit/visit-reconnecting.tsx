import { Alert } from "@grade10/design-system/components/display/alert";
import { Text } from "@grade10/design-system/components/display/text";
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
  /** A retry is under way; Try now shows busy and stays focusable. */
  busy: boolean;
  onRetry: () => void;
  /** Why the last retry failed, shown under Try now. */
  retryFailed?: string;
};

/** A live page that lost its signal: what it last knew and when, and Try now. */
function VisitReconnecting({
  copy,
  busy,
  onRetry,
  retryFailed,
}: VisitReconnectingProps) {
  return (
    <Alert
      actions={
        <>
          {retryFailed ? (
            <Text
              as="p"
              data-slot="reconnecting-failed"
              role="alert"
              size="sm"
              tone="error"
            >
              {retryFailed}
            </Text>
          ) : null}
          <Button
            loading={busy}
            onClick={() => {
              if (!busy) onRetry();
            }}
            size="sm"
            type="button"
            variant="outline"
          >
            {busy ? copy.trying : copy.retry}
          </Button>
        </>
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

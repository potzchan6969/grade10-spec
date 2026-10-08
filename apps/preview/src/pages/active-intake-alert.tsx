import { Alert } from "@grade10/design-system/components/display/alert";
import { Button } from "@grade10/design-system/components/forms/button";
import { Hourglass } from "@phosphor-icons/react";

/**
 * Portfolio banner when collectibles are still in intake. Track Progress opens
 * the intake tracker — vaulted holdings stay on the portfolio.
 */
function ActiveIntakeAlert({
  submissionCount,
  onTrackProgress,
}: {
  submissionCount: number;
  onTrackProgress: () => void;
}) {
  if (submissionCount <= 0) return null;

  const noun = submissionCount === 1 ? "submission" : "submissions";

  return (
    <Alert
      actions={
        <Button
          size="sm"
          type="button"
          variant="outline"
          onClick={onTrackProgress}
        >
          Track Progress
        </Button>
      }
      data-slot="active-intake-alert"
      dismissible={false}
      icon={<Hourglass aria-hidden size={16} weight="bold" />}
      layout="inline"
      status="default"
      title={`${submissionCount} ${noun} currently in intake`}
    />
  );
}

export { ActiveIntakeAlert };

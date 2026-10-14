import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { toast } from "@grade10/design-system/components/overlays/toast";
import { cn } from "@grade10/design-system/lib/utils";
import { Bell, BellSlash } from "@phosphor-icons/react";
import type {
  WatchButtonCopy,
  WatchButtonProps,
  WatchToastCopy,
} from "./types";
import { useSettledChange } from "./use-settled-change";

/**
 * Toasts once per settled change the collector made (`useSettledChange`).
 * Copy and toast actions are consumer-supplied; without copy, nothing is
 * announced. The application mounts one design-system `<Toast />` at its root.
 */
function useWatchToast(
  watched: boolean,
  pending: boolean,
  copy: WatchButtonCopy,
  active: boolean,
  onWatchedToastAction?: () => void,
  onUnwatchedToastAction?: () => void,
) {
  const markPressed = useSettledChange(watched, pending, (settled) => {
    if (!active) return;
    const message: WatchToastCopy | undefined = settled
      ? copy.watchedToast
      : copy.unwatchedToast;
    if (!message) return;

    const onAction = settled ? onWatchedToastAction : onUnwatchedToastAction;
    toast(message.title, {
      description: message.description,
      ...(message.actionLabel && onAction
        ? {
            action: {
              label: message.actionLabel,
              onClick: () => {
                markPressed();
                onAction();
              },
            },
          }
        : null),
    });
  });
  return markPressed;
}

/**
 * Watch / unwatch control for lot details and catalogue — design-system
 * Button + Bell. When `locked`, a bid stands: Watching stays on and the
 * control does not report press. While `pending` it stays focusable and
 * refuses a second press; `failed` shows the refusal beside it.
 */
function WatchButton({
  watched,
  pending = false,
  failed,
  copy,
  onPress,
  disabled = false,
  locked = false,
  onWatchedToastAction,
  onUnwatchedToastAction,
  className,
}: WatchButtonProps) {
  const settledLabel = watched ? copy.watching : copy.watch;
  const label = pending ? (copy.pending ?? settledLabel) : settledLabel;

  // Hooks run on every render; the empty-label bail-out comes after them.
  const markPressed = useWatchToast(
    watched,
    pending,
    copy,
    !locked,
    onWatchedToastAction,
    onUnwatchedToastAction,
  );

  if (!label) return null;

  const button = (
    <Button
      aria-label={
        locked
          ? copy.watching
          : watched
            ? copy.unwatchAriaLabel
            : copy.watchAriaLabel
      }
      aria-pressed={watched}
      className={cn("shrink-0", failed ? undefined : className)}
      disabled={disabled || locked}
      leading={
        watched || locked ? <BellSlash aria-hidden /> : <Bell aria-hidden />
      }
      loading={pending}
      onClick={
        locked
          ? undefined
          : () => {
              markPressed();
              onPress();
            }
      }
      size="md"
      variant="outline"
    >
      {locked ? copy.watching : label}
    </Button>
  );

  if (!failed) return button;

  return (
    <VStack
      className={cn("shrink-0", className)}
      data-slot="watch-button-refused"
      gap="xs"
      hAlign="flex-start"
    >
      {button}
      <Text role="alert" size="xs" tone="error">
        {failed}
      </Text>
    </VStack>
  );
}

export { WatchButton };

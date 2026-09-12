import { Button } from "@grade10/design-system/components/forms/button";
import { toast } from "@grade10/design-system/components/overlays/toast";
import { cn } from "@grade10/design-system/lib/utils";
import { Bell, BellSlash } from "@phosphor-icons/react";
import { useEffect, useRef } from "react";
import type {
  WatchButtonCopy,
  WatchButtonProps,
  WatchToastCopy,
} from "./types";

/**
 * Toasts once per confirmed change of the controlled `watched` value.
 * Copy and toast actions are consumer-supplied; without copy, nothing is
 * announced. The application mounts one design-system `<Toast />` at its root.
 */
function useWatchToast(
  watched: boolean,
  copy: WatchButtonCopy,
  active: boolean,
  onWatchedToastAction?: () => void,
  onUnwatchedToastAction?: () => void,
) {
  const previous = useRef(watched);

  useEffect(() => {
    if (previous.current === watched) return;
    previous.current = watched;
    if (!active) return;

    const message: WatchToastCopy | undefined = watched
      ? copy.watchedToast
      : copy.unwatchedToast;
    if (!message) return;

    const onAction = watched ? onWatchedToastAction : onUnwatchedToastAction;
    toast(message.title, {
      description: message.description,
      ...(message.actionLabel && onAction
        ? { action: { label: message.actionLabel, onClick: onAction } }
        : null),
    });
  }, [
    active,
    copy.unwatchedToast,
    copy.watchedToast,
    onUnwatchedToastAction,
    onWatchedToastAction,
    watched,
  ]);
}

/**
 * Watch / unwatch control for lot details and catalogue — design-system
 * Button + Bell. When `locked`, a bid stands: Watching stays on and the
 * control does not report press.
 */
function WatchButton({
  watched,
  pending = false,
  copy,
  onPress,
  disabled = false,
  locked = false,
  onWatchedToastAction,
  onUnwatchedToastAction,
  className,
}: WatchButtonProps) {
  const inactive = disabled || pending || locked;
  const label = pending ? copy.pending : watched ? copy.watching : copy.watch;

  // Hooks run on every render; the empty-label bail-out comes after them.
  useWatchToast(
    watched,
    copy,
    !locked,
    onWatchedToastAction,
    onUnwatchedToastAction,
  );

  if (!label) return null;

  return (
    <Button
      aria-busy={pending || undefined}
      aria-label={
        locked
          ? copy.watching
          : watched
            ? copy.unwatchAriaLabel
            : copy.watchAriaLabel
      }
      aria-pressed={watched}
      className={cn("shrink-0", className)}
      disabled={inactive}
      leading={
        watched || locked ? <BellSlash aria-hidden /> : <Bell aria-hidden />
      }
      onClick={locked ? undefined : onPress}
      size="md"
      variant="outline"
    >
      {locked ? copy.watching : label}
    </Button>
  );
}

export { WatchButton };

import { cn } from "@grade10/design-system/lib/utils";
import type { WatchButtonProps } from "./types";

function WatchButton({
  watched,
  pending = false,
  copy,
  onPress,
  disabled = false,
  className,
}: WatchButtonProps) {
  const label = pending ? copy.pending : watched ? copy.unwatch : copy.watch;
  if (!label) return null;

  return (
    <button
      aria-busy={pending || undefined}
      aria-pressed={watched}
      className={cn(
        "rounded-md border px-3 py-2 text-sm font-medium",
        className,
      )}
      disabled={disabled || pending}
      onClick={onPress}
      type="button"
    >
      {label}
    </button>
  );
}

export { WatchButton };

import { Button } from "@grade10/design-system/components/forms/button";
import { cn } from "@grade10/design-system/lib/utils";
import { Bell, BellSlash } from "@phosphor-icons/react";
import type { WatchButtonProps } from "./types";

/**
 * Watch / unwatch control — same design-system Button + Bell treatment as
 * `ListingLotHeader` on the auction lot details page.
 */
function WatchButton({
  watched,
  pending = false,
  copy,
  onPress,
  disabled = false,
  className,
}: WatchButtonProps) {
  const label = pending ? copy.pending : watched ? copy.watching : copy.watch;
  if (!label) return null;

  return (
    <Button
      aria-busy={pending || undefined}
      aria-label={watched ? copy.unwatchAriaLabel : copy.watchAriaLabel}
      aria-pressed={watched}
      className={cn("shrink-0", className)}
      disabled={disabled || pending}
      leading={watched ? <BellSlash aria-hidden /> : <Bell aria-hidden />}
      onClick={onPress}
      size="md"
      variant="outline"
    >
      {label}
    </Button>
  );
}

export { WatchButton };

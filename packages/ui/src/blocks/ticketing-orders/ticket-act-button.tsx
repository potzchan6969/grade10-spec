import {
  Button,
  buttonVariants,
} from "@grade10/design-system/components/forms/button";
import { cn } from "@grade10/design-system/lib/utils";
import type { TicketAct } from "./types";

type TicketActButtonProps = {
  act: TicketAct;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
};

/** One act across its column: a link when it leaves the page, a button when
 * it runs here. Internal. */
function TicketActButton({
  act,
  variant = "default",
  size = "lg",
  className,
}: TicketActButtonProps) {
  const classes = cn("w-full", className);
  return act.href ? (
    <a
      className={cn(buttonVariants({ size, variant }), classes)}
      href={act.href}
      onClick={act.onClick}
    >
      {act.label}
    </a>
  ) : (
    <Button
      className={classes}
      onClick={act.onClick}
      size={size}
      type="button"
      variant={variant}
    >
      {act.label}
    </Button>
  );
}

export { TicketActButton };

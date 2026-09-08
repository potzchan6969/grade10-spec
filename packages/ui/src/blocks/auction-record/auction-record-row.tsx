import { cn } from "@grade10/design-system/lib/utils";
import type { AuctionRecordRowProps } from "./types";

function AuctionRecordRow({
  title,
  state,
  stateLabel,
  detail,
  href,
  bidPlaced,
  copy,
  onOpen,
  className,
}: AuctionRecordRowProps) {
  const content = (
    <>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium">{title}</span>
        {detail ? <span className="block text-sm text-muted-foreground">{detail}</span> : null}
      </span>
      <span className="shrink-0 text-sm text-muted-foreground">
        {stateLabel ?? state}
        {bidPlaced ? " · bid" : ""}
      </span>
    </>
  );

  return href ? (
    <a
      aria-label={copy?.openListing ? `${copy.openListing}: ${title}` : title}
      className={cn("flex items-center gap-4 rounded-md border p-4", className)}
      href={href}
    >
      {content}
    </a>
  ) : (
    <button
      className={cn("flex w-full items-center gap-4 rounded-md border p-4 text-left", className)}
      onClick={onOpen}
      type="button"
    >
      {content}
    </button>
  );
}

export { AuctionRecordRow };

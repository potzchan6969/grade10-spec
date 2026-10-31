import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import { cn } from "@grade10/design-system/lib/utils";
import { List, MagnifyingGlass, Scan, WifiSlash } from "@phosphor-icons/react";
import type { ReactNode } from "react";

type DoorPhoneFrameCopy = {
  /** "Find by reference" — the header's search button. */
  findByReference: string;
  /** "Door menu: sign out" — the header's menu button. */
  menu: string;
};

type DoorPhoneFrameProps = {
  /**
   * The header's name: "Grade10 door" before the phone is in, then the
   * phone's own name, "Gate A phone 1".
   */
  title: string;
  /** "signedOut" draws the brand mark and no header buttons. */
  mode: "signedOut" | "signedIn";
  copy: DoorPhoneFrameCopy;
  /** Outside production: `{ name: "Staging", text: ": test tickets only" }`. */
  environment?: { name: string; text: string };
  /** The offline line under the header, while there is no connection. */
  offlineNotice?: string;
  onFindByReference?: () => void;
  onOpenMenu?: () => void;
  children: ReactNode;
  className?: string;
};

/**
 * The passcode door's phone shell: the environment strip, a header naming the
 * door or this phone, the offline line, and the screen below filling the rest
 * of the height.
 */
function DoorPhoneFrame({
  title,
  mode,
  copy,
  environment,
  offlineNotice,
  onFindByReference,
  onOpenMenu,
  children,
  className,
}: DoorPhoneFrameProps) {
  const signedIn = mode === "signedIn";
  return (
    <div
      className={cn(
        "flex min-h-dvh w-full flex-col bg-background text-foreground",
        className,
      )}
      data-slot="door-phone-frame"
    >
      <header className="shrink-0 border-b border-border bg-background-subtle">
        {environment ? (
          <div
            className="bg-warning-muted px-4 py-1.5 text-center text-xs leading-4 text-foreground"
            role="note"
          >
            <strong className="font-semibold">{environment.name}</strong>
            {environment.text}
          </div>
        ) : null}
        <div className="flex h-12 items-center gap-2 px-4">
          <span
            aria-hidden
            className={cn(
              "grid size-6 shrink-0 place-items-center rounded-full",
              signedIn ? "text-primary" : "bg-primary text-primary-foreground",
            )}
          >
            <Scan size={14} weight="bold" />
          </span>
          <span className="min-w-0 flex-1 truncate text-sm font-semibold">
            {title}
          </span>
          {signedIn && onFindByReference ? (
            <IconButton
              aria-label={copy.findByReference}
              onClick={onFindByReference}
              size="md"
              variant="ghost"
            >
              <MagnifyingGlass size={18} />
            </IconButton>
          ) : null}
          {signedIn && onOpenMenu ? (
            <IconButton
              aria-label={copy.menu}
              onClick={onOpenMenu}
              size="md"
              variant="ghost"
            >
              <List size={18} />
            </IconButton>
          ) : null}
        </div>
      </header>
      {offlineNotice ? (
        <div
          className="flex shrink-0 items-start gap-2 bg-destructive-muted px-4 py-2 text-xs leading-4 text-foreground"
          role="status"
        >
          <span
            aria-hidden
            className="mt-px inline-flex shrink-0 text-destructive"
          >
            <WifiSlash size={14} />
          </span>
          <span>{offlineNotice}</span>
        </div>
      ) : null}
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
}

export { DoorPhoneFrame, type DoorPhoneFrameCopy, type DoorPhoneFrameProps };

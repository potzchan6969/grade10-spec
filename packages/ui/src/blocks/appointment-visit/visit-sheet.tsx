import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@grade10/design-system/components/overlays/drawer";
import { cn } from "@grade10/design-system/lib/utils";
import { X } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { VISIT_INK_2 } from "./visit-tones";

type VisitSheetCopy = {
  title: string;
  /** The line under the title. */
  description: string;
  /** The close button's name. */
  close: string;
};

type VisitSheetProps = {
  copy: VisitSheetCopy;
  /** Open while mounted unless the consumer says otherwise. */
  open?: boolean;
  /** The `data-slot` the consumer finds the sheet by. */
  slot: string;
  /** What the sheet asks, scrolling under the header. */
  children: ReactNode;
  /** The sheet's buttons, pinned under the body. */
  footer: ReactNode;
  /** Stack the footer's buttons, or set them side by side. */
  footerLayout?: "stack" | "row";
  onClose: () => void;
};

/**
 * A modal sheet from the bottom edge over a scrim: a grab handle, the title
 * and its line beside a close button, the body, and the buttons pinned
 * under it. Escape, the scrim and the close button all close it.
 */
function VisitSheet({
  copy,
  open = true,
  slot,
  children,
  footer,
  footerLayout = "stack",
  onClose,
}: VisitSheetProps) {
  return (
    <Drawer
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
      open={open}
      swipeDirection="down"
    >
      <DrawerContent
        className="max-h-[90dvh] rounded-[12px_12px_0_0] border-0 bg-background shadow-xl backdrop-blur-none [--drawer-inset:0px] sm:mx-auto sm:max-w-lg"
        data-sheet={slot}
      >
        <div className="flex min-h-0 flex-1 flex-col" data-slot={slot}>
          <span
            aria-hidden
            className="mt-2 h-1 w-9 shrink-0 self-center rounded-full bg-border-strong"
          />
          <div className="flex shrink-0 items-start gap-2 pt-1 pr-2 pl-4">
            <div className="flex min-w-0 flex-1 flex-col gap-1 pt-2.5">
              <DrawerTitle className="m-0 overflow-visible text-xl leading-[26px] font-bold text-clip whitespace-normal">
                {copy.title}
              </DrawerTitle>
              <DrawerDescription
                className={cn("m-0 text-sm leading-5", VISIT_INK_2)}
              >
                {copy.description}
              </DrawerDescription>
            </div>
            <DrawerClose
              render={
                <IconButton
                  aria-label={copy.close}
                  className="size-11"
                  size="lg"
                  variant="ghost"
                />
              }
            >
              <X aria-hidden size={20} />
            </DrawerClose>
          </div>
          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 pt-3.5 pb-4">
            {children}
          </div>
          <div
            className={cn(
              "flex shrink-0 gap-2 border-t border-border px-4 pt-3 pb-6",
              footerLayout === "stack" ? "flex-col" : "flex-row *:flex-1",
            )}
          >
            {footer}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export type { VisitSheetCopy, VisitSheetProps };
export { VisitSheet };

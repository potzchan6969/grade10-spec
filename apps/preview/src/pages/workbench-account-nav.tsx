import {
  Nav,
  type NavProps,
} from "@grade10/design-system/components/layout/nav";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@grade10/design-system/components/overlays/dropdown-menu";
import { useState } from "react";

/** Storybook story id for the filled Order History page assembly. */
const ORDER_HISTORY_STORY_ID = "pages-order-history-page--filled";

/**
 * Temporary workbench helper: opens an Account dropdown from Nav's user icon
 * so page stories can jump to Order History. Not a product contract — preview
 * only until a real account menu lands.
 */
function navigateToStory(storyId: string) {
  const target = window.top ?? window;
  const url = new URL(target.location.href);
  url.searchParams.set("path", `/story/${storyId}`);
  url.searchParams.delete("id");
  target.location.assign(`${url.pathname}${url.search}${url.hash}`);
}

function WorkbenchAccountNav(props: NavProps) {
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  const accountLabel = props.copy.account ?? "Account";

  return (
    <>
      <Nav
        {...props}
        onAccountClick={() => {
          const btn = document.querySelector<HTMLElement>(
            `[data-slot="nav"] [aria-label="${CSS.escape(accountLabel)}"]`,
          );
          if (btn) {
            const rect = btn.getBoundingClientRect();
            setAnchor({
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: rect.height,
            });
          }
          setOpen(true);
        }}
      />
      <DropdownMenu open={open} onOpenChange={setOpen}>
        {anchor ? (
          <DropdownMenuTrigger
            render={
              <span
                aria-hidden
                className="pointer-events-none fixed"
                style={{
                  top: anchor.top,
                  left: anchor.left,
                  width: anchor.width,
                  height: anchor.height,
                }}
              />
            }
          />
        ) : (
          <DropdownMenuTrigger className="sr-only" />
        )}
        <DropdownMenuContent align="end" className="min-w-48 w-auto">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Account</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                setOpen(false);
                navigateToStory(ORDER_HISTORY_STORY_ID);
              }}
            >
              Order History
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export { navigateToStory, ORDER_HISTORY_STORY_ID, WorkbenchAccountNav };

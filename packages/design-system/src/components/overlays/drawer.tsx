"use client";

import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer";
import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import { cn } from "@grade10/design-system/lib/utils";
import { X } from "@phosphor-icons/react";
import {
  type ComponentProps,
  createContext,
  type ReactNode,
  useContext,
  useMemo,
} from "react";

type DrawerSwipeDirection = NonNullable<
  DrawerPrimitive.Root.Props["swipeDirection"]
>;

type DrawerContextProps = {
  hasSnapPoints: boolean;
  modal: DrawerPrimitive.Root.Props["modal"];
  showSwipeHandle: boolean;
  swipeDirection: DrawerSwipeDirection;
};

const DrawerContext = createContext<DrawerContextProps | null>(null);

function useDrawer() {
  const context = useContext(DrawerContext);

  if (!context) {
    throw new Error("useDrawer must be used within a Drawer.");
  }

  return context;
}

/**
 * A floating slide-over panel for secondary content that stays on the current
 * page.
 *
 * Surface treatment follows the Store Cart Drawer: inset from the viewport
 * edge, `rounded-4xl`, frosted `sidebar` fill, and a blurred overlay. Default
 * swipe direction is `right` (opens from the trailing edge); pass
 * `swipeDirection` for bottom / left / top sheets.
 *
 * Open traps focus and locks page scroll when `modal` is true (the default).
 * Escape and an outside press close it. Enter/exit and swipe motion respect
 * `prefers-reduced-motion` via Base UI. Nested drawers stack with a peek and
 * scale the parent back.
 *
 * No published Figma component set yet — theme values are taken from the
 * Cart Drawer frames (`4735:6493`, `4674:3831`). Raise a DS set before adding
 * Code Connect.
 */
function Drawer({
  modal = true,
  showSwipeHandle = false,
  snapPoints,
  swipeDirection = "right",
  ...props
}: DrawerPrimitive.Root.Props & {
  showSwipeHandle?: boolean;
}) {
  const hasSnapPoints = snapPoints != null && snapPoints.length > 0;
  const contextValue = useMemo(
    () => ({ hasSnapPoints, modal, showSwipeHandle, swipeDirection }),
    [hasSnapPoints, modal, showSwipeHandle, swipeDirection],
  );

  return (
    <DrawerContext.Provider value={contextValue}>
      <DrawerPrimitive.Root
        data-slot="drawer"
        modal={modal}
        snapPoints={snapPoints}
        swipeDirection={swipeDirection}
        {...props}
      />
    </DrawerContext.Provider>
  );
}

function DrawerTrigger({ ...props }: DrawerPrimitive.Trigger.Props) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

function DrawerPortal({ ...props }: DrawerPrimitive.Portal.Props) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />;
}

function DrawerClose({ ...props }: DrawerPrimitive.Close.Props) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;
}

function DrawerOverlay({
  className,
  ...props
}: DrawerPrimitive.Backdrop.Props) {
  return (
    <DrawerPrimitive.Backdrop
      data-slot="drawer-overlay"
      className={cn(
        // Cart Drawer backdrop (`4674:3832`): overlay fill + half blur-xl.
        "fixed inset-0 isolate z-50 min-h-dvh bg-overlay opacity-[max(var(--drawer-overlay-min-opacity,0),calc(1-var(--drawer-swipe-progress)))] backdrop-blur-[calc(var(--blur-xl)/2)] transition-opacity duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] select-none data-ending-style:pointer-events-none data-ending-style:opacity-0 data-ending-style:duration-[calc(var(--drawer-swipe-strength)*280ms)] data-snap-points:[--drawer-overlay-min-opacity:0.5] data-starting-style:opacity-0 data-swiping:duration-0 motion-reduce:transition-none supports-[-webkit-touch-callout:none]:absolute",
        className,
      )}
      {...props}
    />
  );
}

function DrawerSwipeHandle({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-swipe-handle"
      aria-hidden="true"
      className={cn(
        "relative z-10 flex shrink-0 cursor-grab transition-opacity duration-200 group-data-nested-drawer-open/drawer-popup:opacity-0 group-data-nested-drawer-swiping/drawer-popup:opacity-100 group-data-[swipe-axis=x]/drawer-popup:h-full group-data-[swipe-axis=x]/drawer-popup:w-3 group-data-[swipe-axis=x]/drawer-popup:items-center group-data-[swipe-axis=y]/drawer-popup:h-3 group-data-[swipe-axis=y]/drawer-popup:w-full group-data-[swipe-axis=y]/drawer-popup:justify-center group-data-[swipe-direction=down]/drawer-popup:items-end group-data-[swipe-direction=left]/drawer-popup:order-last group-data-[swipe-direction=left]/drawer-popup:justify-start group-data-[swipe-direction=right]/drawer-popup:justify-end group-data-[swipe-direction=up]/drawer-popup:order-last group-data-[swipe-direction=up]/drawer-popup:items-start after:block after:shrink-0 after:rounded-full after:bg-muted group-data-[swipe-axis=x]/drawer-popup:after:h-24 group-data-[swipe-axis=x]/drawer-popup:after:w-1 group-data-[swipe-axis=y]/drawer-popup:after:h-1 group-data-[swipe-axis=y]/drawer-popup:after:w-24 active:cursor-grabbing",
        className,
      )}
      {...props}
    />
  );
}

function DrawerContent({
  className,
  children,
  ...props
}: DrawerPrimitive.Popup.Props) {
  const { hasSnapPoints, modal, showSwipeHandle, swipeDirection } = useDrawer();
  const swipeAxis =
    swipeDirection === "down" || swipeDirection === "up" ? "y" : "x";

  return (
    <DrawerPortal>
      {modal === true ? (
        <DrawerOverlay data-snap-points={hasSnapPoints ? "" : undefined} />
      ) : null}
      <DrawerPrimitive.Viewport
        data-slot="drawer-viewport"
        data-modal={modal}
        className="pointer-events-none fixed inset-0 z-50 select-none data-[modal=true]:pointer-events-auto"
      >
        <DrawerPrimitive.Popup
          data-slot="drawer-popup"
          data-swipe-axis={swipeAxis}
          data-snap-points={hasSnapPoints ? "" : undefined}
          className={cn(
            // Cart Drawer surface (`4735:6493`): inset float, frosted sidebar,
            // full rounded-4xl, soft border.
            "group/drawer-popup pointer-events-auto fixed z-50 m-(--drawer-inset,0.5rem) flex h-(--drawer-content-height) max-h-(--drawer-content-max-height,none) min-h-0 w-(--drawer-content-width,auto) transform-[translate3d(var(--translate-x,0px),var(--translate-y,0px),0)_scale(var(--stack-scale))] flex-col overflow-hidden rounded-(--radius-4xl) border border-border/50 bg-sidebar/95 text-base text-foreground shadow-lg outline-none backdrop-blur-xl transition-[transform,height,opacity,filter] duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] will-change-transform select-none [interpolate-size:allow-keywords] motion-reduce:transition-none motion-reduce:will-change-auto",
            // Nested — parent tucks to ~0.96 scale (Cart nested promo).
            "data-nested-drawer-open:overflow-hidden",
            // Bleed fills the overscroll gap with the same frosted fill.
            "after:pointer-events-none after:absolute after:bg-(--drawer-bleed-background,var(--sidebar)) data-[swipe-axis=x]:after:inset-y-0 data-[swipe-axis=x]:after:w-(--bleed) data-[swipe-axis=y]:after:inset-x-0 data-[swipe-axis=y]:after:h-(--bleed) data-[swipe-direction=down]:after:top-full data-[swipe-direction=left]:after:right-full data-[swipe-direction=right]:after:left-full data-[swipe-direction=up]:after:bottom-full",
            // Sizing — x-axis matches Cart `w-(--container-md)`.
            "[--drawer-content-height:var(--drawer-height,auto)] data-[swipe-axis=x]:[--drawer-content-width:var(--container-md)] data-[swipe-axis=x]:max-w-[calc(100vw-1rem)] data-[swipe-axis=y]:[--drawer-content-max-height:calc(100dvh-1rem)] data-[swipe-axis=y]:data-snap-points:[--drawer-content-height:100dvh]",
            // Stack.
            "[--bleed:3rem] [--peek:1rem] [--stack-height:var(--drawer-frontmost-height,var(--drawer-height,0px))] [--stack-peek-offset:max(0px,calc((var(--nested-drawers)-var(--stack-progress))*var(--peek)))] [--stack-progress:clamp(0,var(--drawer-swipe-progress),1)] [--stack-scale-base:max(0,calc(1-(var(--nested-drawers)*var(--stack-step))))] [--stack-scale:clamp(0,calc(var(--stack-scale-base)+(var(--stack-step)*var(--stack-progress))),1)] [--stack-shrink:calc(1-var(--stack-scale))] [--stack-step:0.04]",
            // Transitions — close a beat shorter than open (Cart 400 / 280).
            "data-ending-style:transform-(--closed-transform) data-ending-style:opacity-[0.9999] data-ending-style:duration-[calc(var(--drawer-swipe-strength)*280ms)] data-nested-drawer-swiping:duration-0 data-ending-style:data-nested-drawer-swiping:duration-[calc(var(--drawer-swipe-strength)*280ms)] data-starting-style:transform-(--closed-transform) data-swiping:duration-0 data-ending-style:data-swiping:duration-[calc(var(--drawer-swipe-strength)*280ms)]",
            // Axis: y.
            "data-[swipe-axis=y]:inset-x-0 data-[swipe-axis=y]:data-nested-drawer-open:h-(--stack-height)",
            // Axis: x.
            "data-[swipe-axis=x]:inset-y-0 data-[swipe-axis=x]:flex-row",
            // Direction: down.
            "data-[swipe-direction=down]:bottom-0 data-[swipe-direction=down]:origin-bottom data-[swipe-direction=down]:[--closed-transform:translate3d(0,calc(100%+var(--drawer-inset,0.5rem)+2px),0)] data-[swipe-direction=down]:[--translate-y:calc(var(--drawer-snap-point-offset,0px)+var(--drawer-swipe-movement-y)-var(--stack-peek-offset)-(var(--stack-shrink)*var(--stack-height)))]",
            // Direction: up.
            "data-[swipe-direction=up]:top-0 data-[swipe-direction=up]:origin-top data-[swipe-direction=up]:[--closed-transform:translate3d(0,calc(-100%-var(--drawer-inset,0.5rem)-2px),0)] data-[swipe-direction=up]:[--translate-y:calc(var(--drawer-snap-point-offset,0px)+var(--drawer-swipe-movement-y)+var(--stack-peek-offset)+(var(--stack-shrink)*var(--stack-height)))]",
            // Direction: left.
            "data-[swipe-direction=left]:left-0 data-[swipe-direction=left]:origin-left data-[swipe-direction=left]:[--closed-transform:translate3d(calc(-100%-var(--drawer-inset,0.5rem)-2px),0,0)] data-[swipe-direction=left]:[--translate-x:calc(var(--drawer-swipe-movement-x)+var(--stack-peek-offset)+(var(--stack-shrink)*100%))]",
            // Direction: right.
            "data-[swipe-direction=right]:right-0 data-[swipe-direction=right]:origin-right data-[swipe-direction=right]:[--closed-transform:translate3d(calc(100%+var(--drawer-inset,0.5rem)+2px),0,0)] data-[swipe-direction=right]:[--translate-x:calc(var(--drawer-swipe-movement-x)-var(--stack-peek-offset)-(var(--stack-shrink)*100%))]",
            className,
          )}
          {...props}
        >
          {showSwipeHandle ? <DrawerSwipeHandle /> : null}
          <DrawerPrimitive.Content
            data-slot="drawer-content"
            className={cn(
              "relative flex min-h-0 flex-1 flex-col overflow-hidden overscroll-contain rounded-[inherit] transition-[opacity,transform] duration-320 ease-[cubic-bezier(0.32,0.72,0,1)] select-text group-data-nested-drawer-open/drawer-popup:origin-left group-data-nested-drawer-open/drawer-popup:scale-[0.96] group-data-nested-drawer-open/drawer-popup:opacity-80 group-data-nested-drawer-swiping/drawer-popup:opacity-100 group-data-swiping/drawer-popup:select-none motion-reduce:transition-none",
            )}
          >
            {children}
          </DrawerPrimitive.Content>
        </DrawerPrimitive.Popup>
      </DrawerPrimitive.Viewport>
    </DrawerPortal>
  );
}

function DrawerCloseIcon({ className }: { className?: string }) {
  return (
    <DrawerPrimitive.Close
      data-slot="drawer-close"
      render={<IconButton aria-label="Close drawer" className={className} />}
    >
      <X aria-hidden />
    </DrawerPrimitive.Close>
  );
}

/**
 * Title block. Place `DrawerTitle` and optional `DrawerDescription` as
 * children — they stack with an 8px gap. Close sits on the trailing edge of
 * the title row (`px-6 pt-4`).
 */
function DrawerHeader({
  className,
  showCloseButton = true,
  children,
  ...props
}: ComponentProps<"div"> & {
  showCloseButton?: boolean;
}) {
  return (
    <div
      data-slot="drawer-header"
      className={cn(
        "flex w-full shrink-0 items-start gap-2 px-6 pt-4",
        className,
      )}
      {...props}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-2">{children}</div>
      {showCloseButton ? <DrawerCloseIcon /> : null}
    </div>
  );
}

/**
 * Scroll region between the pinned header and footer. Owns overflow when
 * content exceeds the panel. Body copy defaults to primary `text-base` (16px).
 * Top padding is 24px so body sits that far below the header description.
 */
function DrawerBody({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-body"
      className={cn(
        "scroll-fade flex min-h-0 w-full flex-1 flex-col gap-4 overflow-x-clip overflow-y-auto px-6 pt-6 pb-4 text-base leading-6 font-normal text-foreground",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Pinned actions under the body. Stack buttons in a column — primary on
 * top, secondary beneath.
 */
function DrawerFooter({
  className,
  children,
  ...props
}: ComponentProps<"div"> & {
  children?: ReactNode;
}) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn(
        "mt-auto flex w-full shrink-0 flex-col gap-2 px-6 pb-6 pt-2",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function DrawerTitle({ className, ...props }: DrawerPrimitive.Title.Props) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn(
        "min-w-0 flex-1 truncate text-2xl leading-8 font-semibold text-foreground",
        className,
      )}
      {...props}
    />
  );
}

function DrawerDescription({
  className,
  ...props
}: DrawerPrimitive.Description.Props) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn(
        "text-sm leading-5 font-normal text-secondary-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerSwipeHandle,
  DrawerTitle,
  DrawerTrigger,
  useDrawer,
};

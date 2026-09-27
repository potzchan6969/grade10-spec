import { Alert } from "@grade10/design-system/components/display/alert";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@grade10/design-system/components/display/tabs";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogSubtext,
  DialogTitle,
} from "@grade10/design-system/components/overlays/dialog";
import {
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { WINNER_ORDER_BANK_DETAILS } from "./winner-order-payment-proof-dialog";

const REFERENCE_WARNING =
  "Enter this reference in your bank app’s Memo or Remarks field. Missing it delays verification." as const;

const OUR_NOTE =
  "In your bank app, choose OUR for transfer fees so we receive the full order total." as const;

/** Tailwind `sm` — hug + scroll below; full-width shared track from here up. */
const WIDE_TAB_QUERY = "(min-width: 640px)";

function useWideTabTrack() {
  const [wide, setWide] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia(WIDE_TAB_QUERY).matches;
  });

  useEffect(() => {
    const media = window.matchMedia(WIDE_TAB_QUERY);
    const onChange = () => setWide(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return wide;
}

const TAB_PANEL_CLASS =
  "absolute inset-0 mt-0 overflow-x-clip overflow-y-auto overscroll-contain" as const;

function activeRailPanel(frame: HTMLElement): HTMLElement | null {
  return frame.querySelector<HTMLElement>('[role="tabpanel"][tabindex="0"]');
}

/** Content height of the active rail, free of the frame's current size. */
function measureRailContent(panel: HTMLElement, width: number): number {
  const clone = panel.cloneNode(true) as HTMLElement;
  clone.style.cssText = `position:absolute;inset:auto;left:-10000px;top:0;right:auto;bottom:auto;visibility:hidden;height:auto;max-height:none;overflow:visible;width:${width}px;pointer-events:none;`;
  clone.removeAttribute("hidden");
  document.body.appendChild(clone);
  const height = clone.scrollHeight;
  clone.remove();
  return height;
}

function measureRailAvailable(frame: HTMLDivElement): number {
  const dialog = frame.closest<HTMLElement>('[data-slot="dialog-content"]');
  if (!dialog) return Number.POSITIVE_INFINITY;
  const max = Number.parseFloat(getComputedStyle(dialog).maxHeight);
  if (!Number.isFinite(max)) return Number.POSITIVE_INFINITY;

  // Height is transitioning, so a synchronous read would still see the old
  // box. Drop the transition, collapse the frame, and read the dialog chrome.
  const previous = {
    transition: frame.style.transition,
    height: frame.style.height,
  };
  const panels = [...frame.querySelectorAll<HTMLElement>('[role="tabpanel"]')];
  const previousDisplay = panels.map((panel) => panel.style.display);
  frame.style.transition = "none";
  frame.style.height = "0px";
  for (const panel of panels) panel.style.display = "none";
  const chrome = dialog.offsetHeight;
  frame.style.height = previous.height;
  // Commit the restored height before the class transition turns back on,
  // or the next change interpolates from this collapsed 0.
  void dialog.offsetHeight;
  frame.style.transition = previous.transition;
  panels.forEach((panel, index) => {
    panel.style.display = previousDisplay[index] ?? "";
  });
  return Math.max(0, max - chrome);
}

function applyRailHeight(frame: HTMLDivElement, animate: boolean) {
  const panel = activeRailPanel(frame);
  const width = frame.clientWidth;
  if (!panel || width <= 0) return;
  const content = measureRailContent(panel, width);
  const available = measureRailAvailable(frame);
  if (content <= 0) return;
  const target = Math.min(content, available);
  if (target <= 0) return;
  const next = `${target}px`;
  const current = frame.style.height;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!animate || reduce || current === "" || current === next) {
    frame.style.transition = "none";
    frame.style.height = next;
    void frame.offsetHeight;
    frame.style.transition = "";
    return;
  }

  frame.style.height = current;
  void frame.offsetHeight;
  frame.style.height = next;
}

function RailFrame({
  rail,
  animateContent,
  children,
}: {
  rail: string;
  animateContent: boolean;
  children: ReactNode;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const laidOut = useRef(false);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame || rail.length === 0) return;
    applyRailHeight(frame, laidOut.current);
    laidOut.current = true;
  }, [rail]);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const onResize = () => applyRailHeight(frame, false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div
      className="relative min-h-0 overflow-hidden transition-[height] duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
      ref={frameRef}
    >
      <div
        className={
          animateContent
            ? "h-full animate-in fade-in-0 duration-200 motion-reduce:animate-none"
            : "h-full"
        }
        key={rail}
      >
        {children}
      </div>
    </div>
  );
}

type WinnerOrderHowToPayDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amountDue?: string;
  /** Collector-facing invoice ID — shown as DialogSubtext. */
  invoiceId?: string;
  transferReference?: string;
};

/**
 * Preview-only: View Bank Details after Order summary secondary control.
 * Not a published `@grade10/ui` export. Sample values are Grade10 / HSBC Hong
 * Kong until Finance confirms live accounts.
 */
function WinnerOrderHowToPayDialog({
  open,
  onOpenChange,
  amountDue = WINNER_ORDER_BANK_DETAILS.totalAmountDue,
  invoiceId,
  transferReference = WINNER_ORDER_BANK_DETAILS.transferReference,
}: WinnerOrderHowToPayDialogProps) {
  const [rail, setRail] = useState("fps");
  const tabScrollRef = useRef<HTMLDivElement>(null);
  const animateSwap = useRef(false);
  const wideTrack = useWideTabTrack();

  useLayoutEffect(() => {
    animateSwap.current = true;
  }, []);

  // Keep the active tab in view when the rail changes on a narrow scrollport.
  useLayoutEffect(() => {
    if (wideTrack) return;
    const scroller = tabScrollRef.current;
    if (!scroller || rail.length === 0) return;
    const active = scroller.querySelector<HTMLElement>(
      '[data-slot="tabs-trigger"][data-active]',
    );
    if (!active) return;
    const scrollerBox = scroller.getBoundingClientRect();
    const activeBox = active.getBoundingClientRect();
    const pad = 12;
    const left = activeBox.left - scrollerBox.left + scroller.scrollLeft;
    const right = left + activeBox.width;
    if (left - pad < scroller.scrollLeft) {
      scroller.scrollLeft = Math.max(0, left - pad);
    } else if (right + pad > scroller.scrollLeft + scroller.clientWidth) {
      scroller.scrollLeft = right + pad - scroller.clientWidth;
    }
  }, [rail, wideTrack]);

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent
        className="flex max-h-[min(640px,calc(100dvh-2rem))] max-w-xl min-h-0 flex-col gap-4 overflow-hidden"
        showCloseButton={false}
      >
        <DialogHeader showCloseButton={false}>
          <DialogTitle>View Bank Details</DialogTitle>
          {invoiceId ? (
            <DialogSubtext>Invoice: {invoiceId}</DialogSubtext>
          ) : null}
        </DialogHeader>
        {/* scroll-fade on DialogBody clips the pill tab shadow; panels own scroll. */}
        <DialogBody className="flex min-h-0 flex-1 flex-col gap-4 overflow-visible [mask-image:none]">
          <div className="flex w-full shrink-0 flex-col gap-1">
            <span className="text-sm leading-5 text-secondary-foreground">
              Amount due
            </span>
            <span className="text-xl leading-6 font-semibold tracking-tight text-foreground tabular-nums">
              {amountDue}
            </span>
          </div>

          <Tabs
            className="flex min-h-0 w-full min-w-0 flex-1 flex-col gap-2 overflow-visible"
            onValueChange={(next) => {
              if (next != null) setRail(next);
            }}
            value={rail}
          >
            {/* Narrow: hug labels and scroll. Wide (sm+): full-width shared
                track. Inner/bleed padding keeps the pill shadow visible. */}
            <div
              className={
                wideTrack
                  ? "w-full min-w-0 shrink-0 overflow-visible pt-2 pb-5"
                  : "-mx-5 min-w-0 shrink-0 touch-pan-x overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              }
              ref={tabScrollRef}
            >
              <div
                className={wideTrack ? "w-full" : "flex w-max px-5 pt-2 pb-5"}
              >
                <TabsList
                  className={
                    wideTrack
                      ? "w-full overflow-visible"
                      : "w-max overflow-visible"
                  }
                  fullWidth={wideTrack}
                >
                  <TabsTrigger
                    className={wideTrack ? "min-w-0 px-4" : "shrink-0 px-4"}
                    value="fps"
                  >
                    FPS
                  </TabsTrigger>
                  <TabsTrigger
                    className={wideTrack ? "min-w-0 px-4" : "shrink-0 px-4"}
                    value="local"
                  >
                    HK Local
                  </TabsTrigger>
                  <TabsTrigger
                    className={wideTrack ? "min-w-0 px-4" : "shrink-0 px-4"}
                    value="swift"
                  >
                    International
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            <RailFrame animateContent={animateSwap.current} rail={rail}>
              <TabsContent className={TAB_PANEL_CLASS} value="fps">
                <RailPanel>
                  <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-stretch sm:gap-5">
                    <VStack
                      className="w-full shrink-0 items-center justify-center sm:w-auto"
                      gap="sm"
                    >
                      <FpsQrPlaceholder />
                      <Text
                        className="text-center text-secondary-foreground sm:max-w-36"
                        size="sm"
                      >
                        Open your banking app and scan this QR
                      </Text>
                    </VStack>
                    <VStack
                      className="min-w-0 flex-1 border-t border-border pt-4 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-5"
                      gap="sm"
                      hAlign="stretch"
                    >
                      <DetailRow
                        label="FPS ID"
                        value={WINNER_ORDER_BANK_DETAILS.fpsId}
                      />
                      <DetailRow
                        label="Account name"
                        value={WINNER_ORDER_BANK_DETAILS.beneficiaryName}
                      />
                      <PaymentReferenceBand value={transferReference} />
                    </VStack>
                  </div>
                </RailPanel>
              </TabsContent>

              <TabsContent className={TAB_PANEL_CLASS} value="local">
                <RailPanel>
                  <DetailList>
                    <DetailRow
                      label="Bank name"
                      value={WINNER_ORDER_BANK_DETAILS.bankName}
                    />
                    <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
                      <DetailRow
                        label="Bank code"
                        value={WINNER_ORDER_BANK_DETAILS.bankCode}
                      />
                      <DetailRow
                        label="Branch code"
                        value={WINNER_ORDER_BANK_DETAILS.branchCode}
                      />
                    </div>
                    <DetailRow
                      label="Account number"
                      value={WINNER_ORDER_BANK_DETAILS.accountNumber}
                    />
                    <PaymentReferenceBand value={transferReference} />
                  </DetailList>
                </RailPanel>
              </TabsContent>

              <TabsContent className={TAB_PANEL_CLASS} value="swift">
                <RailPanel>
                  <DetailList>
                    <DetailRow
                      label="Beneficiary name"
                      value={WINNER_ORDER_BANK_DETAILS.beneficiaryName}
                    />
                    <DetailRow
                      label="Beneficiary address"
                      value={WINNER_ORDER_BANK_DETAILS.beneficiaryAddress}
                    />
                    <DetailRow
                      label="Bank name"
                      value={WINNER_ORDER_BANK_DETAILS.bankName}
                    />
                    <DetailRow
                      label="Bank address"
                      value={WINNER_ORDER_BANK_DETAILS.bankAddress}
                    />
                    <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
                      <DetailRow
                        label="SWIFT / BIC"
                        value={WINNER_ORDER_BANK_DETAILS.swiftCode}
                      />
                      <DetailRow
                        label="Account number / IBAN"
                        value={WINNER_ORDER_BANK_DETAILS.accountNumber}
                      />
                    </div>
                    <PaymentReferenceBand value={transferReference} />
                    <Alert
                      dismissible={false}
                      layout="inline"
                      status="warning"
                      title={OUR_NOTE}
                    />
                  </DetailList>
                </RailPanel>
              </TabsContent>
            </RailFrame>
          </Tabs>
        </DialogBody>
        <DialogFooter>
          <DialogClose
            render={
              <Button
                className="w-full sm:w-auto"
                size="md"
                variant="outline"
              />
            }
          >
            Done
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RailPanel({ children }: { children: ReactNode }) {
  return (
    <VStack
      className="w-full rounded-xl border border-border bg-muted/40 p-4"
      gap="md"
      hAlign="stretch"
    >
      {children}
    </VStack>
  );
}

function DetailList({ children }: { children: ReactNode }) {
  return (
    <VStack className="w-full" gap="sm" hAlign="stretch">
      {children}
    </VStack>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex w-full min-w-0 flex-col gap-0.5">
      <span className="text-sm leading-5 text-secondary-foreground">
        {label}
      </span>
      <span className="text-sm leading-5 font-medium break-all text-foreground">
        {value}
      </span>
    </div>
  );
}

function PaymentReferenceBand({ value }: { value: string }) {
  return (
    <div className="flex w-full min-w-0 flex-col gap-0.5">
      <span className="text-sm leading-5 text-secondary-foreground">
        Payment reference
      </span>
      <span className="text-sm leading-5 font-medium break-all text-foreground">
        {value}
      </span>
      <Text className="text-secondary-foreground" size="sm">
        {REFERENCE_WARNING}
      </Text>
    </div>
  );
}

function FpsQrPlaceholder() {
  return (
    <div
      aria-label="FPS QR code for Grade10"
      className="flex aspect-square size-32 items-center justify-center rounded-xl border border-border bg-background"
      role="img"
    >
      <svg
        aria-hidden="true"
        className="size-24 text-foreground"
        viewBox="0 0 120 120"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect fill="currentColor" height="28" width="28" x="8" y="8" />
        <rect fill="currentColor" height="28" width="28" x="84" y="8" />
        <rect fill="currentColor" height="28" width="28" x="8" y="84" />
        <rect
          fill="none"
          height="16"
          stroke="currentColor"
          strokeWidth="4"
          width="16"
          x="14"
          y="14"
        />
        <rect
          fill="none"
          height="16"
          stroke="currentColor"
          strokeWidth="4"
          width="16"
          x="90"
          y="14"
        />
        <rect
          fill="none"
          height="16"
          stroke="currentColor"
          strokeWidth="4"
          width="16"
          x="14"
          y="90"
        />
        <rect fill="currentColor" height="8" width="8" x="20" y="20" />
        <rect fill="currentColor" height="8" width="8" x="96" y="20" />
        <rect fill="currentColor" height="8" width="8" x="20" y="96" />
        <rect fill="currentColor" height="10" width="10" x="52" y="52" />
        <rect fill="currentColor" height="8" width="8" x="44" y="28" />
        <rect fill="currentColor" height="8" width="8" x="68" y="28" />
        <rect fill="currentColor" height="8" width="8" x="44" y="84" />
        <rect fill="currentColor" height="8" width="8" x="84" y="52" />
        <rect fill="currentColor" height="8" width="8" x="28" y="52" />
        <rect fill="currentColor" height="8" width="8" x="68" y="68" />
      </svg>
    </div>
  );
}

export type { WinnerOrderHowToPayDialogProps };
export { OUR_NOTE, REFERENCE_WARNING, WinnerOrderHowToPayDialog };

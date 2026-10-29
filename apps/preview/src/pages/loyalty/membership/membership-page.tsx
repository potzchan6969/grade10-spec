import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@grade10/design-system/components/display/tabs";
import { Button } from "@grade10/design-system/components/forms/button";
import { Footer } from "@grade10/design-system/components/layout/footer";
import { NavigationLink } from "@grade10/design-system/components/layout/navigation-link";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@grade10/design-system/components/overlays/dialog";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerTitle,
} from "@grade10/design-system/components/overlays/drawer";
import { Toast, toast } from "@grade10/design-system/components/overlays/toast";
import {
  RewardCheckout,
  type RewardMenuItem,
  type RewardRedemption,
  SiteHeader,
} from "@grade10/ui";
import { QrCode } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { STORE_FOOTER, STORE_SITE_HEADER } from "../../store-content";
import { storyHref } from "../../workbench-story-nav";
import {
  BALANCE_DROPPED_REWARDS,
  DROPPED_BALANCE,
  FLAKY_REWARDS,
  ISSUED_COUPON,
  MEMBERSHIP_PAGE_COPY,
  type MembershipView,
  RETRY_COPY,
  REWARD_CHECKOUT_COPY,
  SHORT_BALANCE_COPY,
  SOLD_OUT_COPY,
  SOLD_OUT_REWARDS,
} from "../loyalty-content";
import { TopUpFlow } from "../top-up-flow";
import {
  CouponsPane,
  MEMBERSHIP_TABS,
  MemberPassOverlay,
  type MembershipTab,
  OverviewPane,
  PointHistoryPane,
  RewardsPane,
} from "./membership-sections";

/** "View Coupons" opens the member's coupons. */
const COUPONS_HREF = storyHref("loyalty-coupons-screens-coupons--default");

/** Reads the 640px line — the pass is a bottom drawer below it, a floating
 * card from it up. The same line RewardCheckout reads. */
const SM_UP_MQ = "(min-width: 640px)";
function useSmUp() {
  const [smUp, setSmUp] = useState(
    () => typeof window === "undefined" || window.matchMedia(SM_UP_MQ).matches,
  );
  useEffect(() => {
    const media = window.matchMedia(SM_UP_MQ);
    const onChange = () => setSmUp(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);
  return smUp;
}

/**
 * Membership as a store assembles it: `SiteHeader`, a sidebar naming the
 * sections the member can walk, the active section on the right, and
 * `Footer`. On a narrow viewport the rail collapses into a scrollable row
 * above the content. The page owns the balance, the coupons a redemption
 * issues, the wallets the member carries, the codes the card has minted and
 * the section the member is looking at; the panes only receive props.
 */
function MembershipPage({
  view,
  tab,
}: {
  view: MembershipView;
  tab: MembershipTab;
}) {
  const [active, setActive] = useState<MembershipTab>(() => {
    /* `?tab=` deep-links a section — the toast's "View in Points History"
     * lands on the points pane rather than the overview. */
    const q = new URLSearchParams(window.location.search).get("tab");
    return MEMBERSHIP_TABS.some((item) => item.id === q)
      ? (q as MembershipTab)
      : tab;
  });
  const [balance, setBalance] = useState(view.balance);
  const [coupons, setCoupons] = useState(view.coupons);
  const [issued, setIssued] = useState(0);
  const [codes, setCodes] = useState(0);
  const [held, setHeld] = useState<readonly string[]>(view.heldWallets);
  const [selected, setSelected] = useState<RewardMenuItem | null>(null);
  const [open, setOpen] = useState(false);
  const [redemption, setRedemption] = useState<RewardRedemption | null>(null);
  const [failure, setFailure] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [passOpen, setPassOpen] = useState(false);
  const [topUpOpen, setTopUpOpen] = useState(false);
  /* Attempts already refused on the wire — a flaky reward redeems on retry. */
  const flaked = useRef<ReadonlySet<string>>(new Set());
  const smUp = useSmUp();

  /* The surface stays mounted once opened — only `open` flips — so the
   * drawer and dialog can play their exit transitions. */
  const closeCheckout = () => setOpen(false);

  const select = (rewardId: string) => {
    if (view.rewards.status !== "ready") return;
    const reward = view.rewards.data.find((item) => item.id === rewardId);
    if (reward) {
      setSelected(reward);
      setRedemption(null);
      setFailure(null);
      setPending(false);
      setOpen(true);
    }
  };

  const redeem = () => {
    if (!selected || selected.pointCost > balance || pending) return;
    const reward = selected;
    const left = balance - reward.pointCost;
    const cost = reward.pointCost;
    const coupon = {
      ...ISSUED_COUPON,
      id: `coupon-issued-${issued + 1}`,
      amount: reward.name,
      description: reward.description,
    };
    setPending(true);
    setTimeout(() => {
      if (SOLD_OUT_REWARDS.has(reward.id)) {
        /* The surface closes itself on a refusal; the page raises it. */
        setPending(false);
        setFailure(SOLD_OUT_COPY.title);
        toast.error(SOLD_OUT_COPY.title, {
          description: SOLD_OUT_COPY.description,
        });
        return;
      }
      if (BALANCE_DROPPED_REWARDS.has(reward.id)) {
        /* The balance fell short elsewhere since the sheet opened; the page
         * refetches and the deficit row re-reads it. */
        setPending(false);
        setBalance(DROPPED_BALANCE);
        toast.error(SHORT_BALANCE_COPY.title, {
          description: SHORT_BALANCE_COPY.description(
            reward.pointCost - DROPPED_BALANCE,
          ),
        });
        return;
      }
      if (FLAKY_REWARDS.has(reward.id) && !flaked.current.has(reward.id)) {
        /* A retryable refusal: the surface stays open and the press stays
         * live; the page raises it as a toast. */
        flaked.current = new Set([...flaked.current, reward.id]);
        setPending(false);
        toast.error(RETRY_COPY.title, {
          description: RETRY_COPY.description,
        });
        return;
      }
      setBalance(left);
      setIssued((value) => value + 1);
      setCoupons((prev) => ({
        status: "ready",
        data: [...(prev.status === "ready" ? prev.data : []), coupon],
      }));
      setRedemption(
        reward.kind === "coupon"
          ? {
              balanceAfter: left,
              summary: `${cost} pts redeemed`,
              deadline: "Use by 28 Oct 2026",
              code: `G10-${cost}-${issued + 1}Q2M`,
              qrCode: {
                value: `g10:redeem:${reward.id}:${issued + 1}Q2M`,
                altText: "Show this code to store staff",
                toggleLabel: "Use now",
                caption: "Staff scan this at the counter",
              },
            }
          : {
              balanceAfter: left,
              summary: `${cost} pts redeemed`,
              deadline: "Collect by 5 Nov 2026",
              note: "Collect at any Grade10 store",
              qrCode: {
                value: `g10:collect:${reward.id}:${issued + 1}Q2M`,
                altText: "Show this code to store staff",
                toggleLabel: "Use now",
                caption: "Staff scan this at the counter",
              },
            },
      );
      setPending(false);
    }, 700);
  };

  const walletProps = {
    heldWallets: held,
    onAddWallet: (id: string) =>
      setHeld((prev) => (prev.includes(id) ? prev : [...prev, id])),
    onEndWallet: (id: string) =>
      setHeld((prev) => prev.filter((walletId) => walletId !== id)),
  };
  const refreshCode = () => setCodes((value) => value + 1);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <SiteHeader {...STORE_SITE_HEADER} />
      <main className="flex w-full flex-1 justify-center">
        <div className="flex w-full max-w-6xl flex-col gap-10 px-4 py-10 sm:px-8">
          <div className="flex flex-col gap-4 border-b border-border pb-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h1 className="text-3xl font-semibold text-foreground">
                {MEMBERSHIP_PAGE_COPY.title}
              </h1>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setPassOpen(true)}
                  size={smUp ? "lg" : "md"}
                >
                  <QrCode aria-hidden size={16} weight="regular" />
                  Member Pass
                </Button>
                <Button
                  onClick={() => setTopUpOpen(true)}
                  size={smUp ? "lg" : "md"}
                  variant="secondary"
                >
                  {MEMBERSHIP_PAGE_COPY.topUpAction}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8 md:flex-row md:gap-16">
            {/* Narrow: the rail's names as the line-tab row — pills stay
             * for the header's action buttons, so actions and navigation
             * never share a shape. */}
            <Tabs
              className="md:hidden"
              onValueChange={(value) => setActive(value as MembershipTab)}
              value={active}
            >
              <TabsList
                aria-label="Membership"
                className="w-full justify-start overflow-x-auto border-b border-border"
                variant="list"
              >
                {MEMBERSHIP_TABS.map((item) => (
                  <TabsTrigger key={item.id} value={item.id}>
                    {item.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            {/* Wide: the pill rail. */}
            <nav
              aria-label="Membership"
              className="hidden gap-1 md:sticky md:top-8 md:flex md:w-64 md:shrink-0 md:flex-col md:items-stretch md:self-start"
            >
              {MEMBERSHIP_TABS.map((item) => (
                <NavigationLink
                  active={active === item.id}
                  className="cursor-pointer md:w-40 md:justify-start"
                  key={item.id}
                  onClick={() => setActive(item.id)}
                  render={<button type="button" />}
                >
                  {item.label}
                </NavigationLink>
              ))}
            </nav>

            <div className="flex min-w-0 flex-1 flex-col gap-10">
              {active === "overview" ? (
                <OverviewPane balance={balance} view={view} />
              ) : null}
              {active === "rewards" ? (
                <RewardsPane balance={balance} onSelect={select} view={view} />
              ) : null}
              {active === "coupons" ? (
                <CouponsPane
                  coupons={coupons}
                  onBrowseRewards={() => setActive("rewards")}
                />
              ) : null}
              {active === "points" ? <PointHistoryPane view={view} /> : null}
            </div>
          </div>
        </div>
      </main>
      <Footer {...STORE_FOOTER} />
      <Toast position="bottom-right" />
      {/* The pack picker and its result modal open over the page — the
       * member never leaves Membership; a credited pack lands on the
       * balance straight away. */}
      <TopUpFlow
        balance={balance}
        onCredited={(points) => setBalance((value) => value + points)}
        onOpenChange={setTopUpOpen}
        open={topUpOpen}
      />
      {smUp ? (
        <Dialog onOpenChange={setPassOpen} open={passOpen}>
          {/* No dialog chrome: the pass itself is the surface, floating over
           * the backdrop. The title stays for assistive naming, and an
           * outside press dismisses — no close control. */}
          <DialogContent className="w-[calc(100%-2rem)] max-w-(--container-sm) gap-0 rounded-none border-0 bg-transparent p-0 shadow-none backdrop-blur-none">
            <DialogTitle className="sr-only">
              {MEMBERSHIP_PAGE_COPY.cardHeading}
            </DialogTitle>
            <MemberPassOverlay
              codeGeneration={codes}
              onRefreshCode={refreshCode}
              view={view}
              walletProps={walletProps}
            />
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer
          onOpenChange={setPassOpen}
          open={passOpen}
          swipeDirection="down"
        >
          <DrawerContent className="bg-popover backdrop-blur-none [--drawer-bleed-background:var(--popover)]">
            <DrawerTitle className="sr-only">
              {MEMBERSHIP_PAGE_COPY.cardHeading}
            </DrawerTitle>
            <DrawerBody className="flex flex-col items-center">
              <MemberPassOverlay
                codeGeneration={codes}
                onRefreshCode={refreshCode}
                view={view}
                walletProps={walletProps}
              />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      )}
      {selected ? (
        <RewardCheckout
          balance={balance}
          copy={REWARD_CHECKOUT_COPY}
          failure={failure}
          onDone={closeCheckout}
          onOpenChange={(next) => {
            if (!next) closeCheckout();
          }}
          onRedeem={redeem}
          open={open}
          pending={pending}
          redemption={redemption ?? undefined}
          reward={selected}
          viewCouponsHref={COUPONS_HREF}
        />
      ) : null}
    </div>
  );
}

export { MembershipPage };

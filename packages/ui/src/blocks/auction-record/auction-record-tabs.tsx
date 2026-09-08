import type { PropsWithChildren } from "react";
import { cn } from "@grade10/design-system/lib/utils";
import type { AuctionRecordTabsProps } from "./types";

function AuctionRecordTabs({
  activeTab,
  copy,
  onTabChange,
  children,
  className,
}: PropsWithChildren<AuctionRecordTabsProps>) {
  return (
    <section className={cn("w-full", className)} data-slot="auction-record">
      <div aria-label={copy.watching ?? ""} className="flex gap-2" role="tablist">
        {(["watching", "bidding"] as const).map((tab) => {
          const label = copy[tab];
          if (!label) return null;
          return (
            <button
              aria-selected={activeTab === tab}
              className={cn(
                "border-b-2 px-3 py-2 text-sm font-medium",
                activeTab === tab
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground",
              )}
              key={tab}
              onClick={() => onTabChange(tab)}
              role="tab"
              type="button"
            >
              {label}
            </button>
          );
        })}
      </div>
      <div className="pt-6" role="tabpanel">
        {children}
      </div>
    </section>
  );
}

export { AuctionRecordTabs };

import type { ReactNode } from "react";
import "./listing-auto-bid-reveal.css";

type ListingAutoBidRevealProps = {
  open: boolean;
  children: ReactNode;
};

function ListingAutoBidReveal({ open, children }: ListingAutoBidRevealProps) {
  return (
    <div className="auto-bid-reveal" data-open={open || undefined}>
      <div className="auto-bid-reveal-inner" inert={open ? undefined : true}>
        {children}
      </div>
    </div>
  );
}

export type { ListingAutoBidRevealProps };
export { ListingAutoBidReveal };

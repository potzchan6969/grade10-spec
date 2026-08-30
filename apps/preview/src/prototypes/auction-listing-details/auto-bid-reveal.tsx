import type { ReactNode } from "react";
import "./auto-bid-reveal.css";

type AutoBidRevealProps = {
  open: boolean;
  children: ReactNode;
};

function AutoBidReveal({ open, children }: AutoBidRevealProps) {
  return (
    <div className="auto-bid-reveal" data-open={open || undefined}>
      <div className="auto-bid-reveal-inner" inert={open ? undefined : true}>
        {children}
      </div>
    </div>
  );
}

export { AutoBidReveal };

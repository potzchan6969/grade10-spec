import { cn } from "@grade10/design-system/lib/utils";
import { registerBones } from "boneyard-js";
import { Skeleton } from "boneyard-js/react";
import bones from "./auction-catalogue-card-skeleton.bones.json";

registerBones({ "auction-catalogue-lot-card": bones });

/** Boneyard loading shell for an auction catalogue lot. */
export function AuctionCatalogueCardSkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <Skeleton
      animate="pulse"
      className={cn("w-full", className)}
      color="#E6E6E6"
      darkColor="rgba(249, 250, 250, 0.05)"
      loading
      name="auction-catalogue-lot-card"
      transition={300}
    >
      <article
        aria-hidden="true"
        className="flex w-full flex-col"
        data-slot="listing-catalogue-card-skeleton"
      >
        <div className="aspect-square w-full rounded-2xl" />
        <div className="mt-4 h-10 w-full rounded-md" />
        <div className="mt-2 h-4 w-[36%] rounded-md" />
        <div className="mt-1 h-6 w-[48%] rounded-md" />
        <div className="mt-2 h-4 w-[42%] rounded-md" />
      </article>
    </Skeleton>
  );
}

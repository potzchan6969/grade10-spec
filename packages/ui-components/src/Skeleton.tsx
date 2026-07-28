import type { HTMLAttributes } from "react";

export type SkeletonProps = HTMLAttributes<HTMLDivElement> & {
  shape?: "text" | "line" | "block";
};

export function Skeleton({
  shape = "block",
  className,
  ...props
}: SkeletonProps) {
  return (
    <div
      aria-busy="true"
      aria-label="Loading"
      className={["at-skeleton", className].filter(Boolean).join(" ")}
      data-shape={shape}
      role="status"
      {...props}
    />
  );
}

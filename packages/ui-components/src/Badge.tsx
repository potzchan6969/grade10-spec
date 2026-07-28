import type { HTMLAttributes, ReactNode } from "react";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  tone?: "neutral" | "success" | "error";
  leading?: ReactNode;
};

export function Badge({
  children,
  tone = "neutral",
  leading,
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={["at-badge", className].filter(Boolean).join(" ")}
      data-tone={tone}
      {...props}
    >
      {leading ? (
        <span aria-hidden="true" className="at-badge__leading">
          {leading}
        </span>
      ) : null}
      {children}
    </span>
  );
}

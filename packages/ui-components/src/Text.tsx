import type { HTMLAttributes, ReactNode } from "react";

export type TextProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  as?: "span" | "p" | "div" | "h2" | "h3";
  size?: "xs" | "sm" | "base" | "lg" | "xl";
  weight?: "regular" | "medium" | "bold";
  tone?: "primary" | "secondary" | "muted" | "success" | "error";
  truncate?: boolean;
};

export function Text({
  children,
  as: Tag = "span",
  size = "base",
  weight = "regular",
  tone = "primary",
  truncate = false,
  className,
  ...props
}: TextProps) {
  return (
    <Tag
      className={["at-text", className].filter(Boolean).join(" ")}
      data-size={size}
      data-tone={tone}
      data-truncate={truncate || undefined}
      data-weight={weight}
      {...props}
    >
      {children}
    </Tag>
  );
}

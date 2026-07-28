import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

type SurfaceSharedProps = {
  children: ReactNode;
  className?: string;
  variant?: "panel" | "card" | "ghost";
  radius?: "none" | "small" | "medium";
  selected?: boolean;
};

export type SurfaceProps = SurfaceSharedProps &
  HTMLAttributes<HTMLDivElement> & { as?: "div" };
export type SurfaceButtonProps = SurfaceSharedProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { as: "button" };

export function Surface({
  children,
  className,
  variant = "panel",
  radius = "medium",
  selected = false,
  as = "div",
  ...props
}: SurfaceProps | SurfaceButtonProps) {
  const shared = {
    className: ["at-surface", className].filter(Boolean).join(" "),
    "data-radius": radius,
    "data-selected": selected || undefined,
    "data-variant": variant,
  };

  if (as === "button") {
    return (
      <button
        type="button"
        {...shared}
        {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {children}
      </button>
    );
  }

  return (
    <div {...shared} {...(props as HTMLAttributes<HTMLDivElement>)}>
      {children}
    </div>
  );
}

"use client";

import { IconContext, type IconProps } from "@phosphor-icons/react";
import type { ReactNode } from "react";

/** Phosphor renders `regular` unless a weight is passed. Grade10's default is
 * `bold`; pass `weight` on an icon to override. */
const DEFAULT_ICON_PROPS = { weight: "bold" } satisfies IconProps;

function IconProvider({ children }: { children: ReactNode }) {
  return (
    <IconContext.Provider value={DEFAULT_ICON_PROPS}>
      {children}
    </IconContext.Provider>
  );
}

export { IconProvider };

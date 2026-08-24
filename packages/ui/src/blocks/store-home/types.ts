import type { ReactNode } from "react";

type StoreCollectionSummary = {
  id: string;
  label: string;
  icon: ReactNode;
  href?: string;
  onClick?: () => void;
  /** Occupies the large bento cell on the home page grid. */
  featured?: boolean;
};

export type { StoreCollectionSummary };

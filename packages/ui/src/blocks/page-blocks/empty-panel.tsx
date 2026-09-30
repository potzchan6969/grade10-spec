import { EmptyState } from "@grade10/design-system/components/display/empty-state";
import type { ReactNode } from "react";

type EmptyPanelCopy = {
  title: string;
  /** The line under the title. */
  description?: string;
};

type EmptyPanelProps = {
  copy: EmptyPanelCopy;
  /** What the reader can do from here. */
  actions?: ReactNode;
  /** The `data-slot` the consumer finds this panel by; the design system's
   * own `empty-state` when omitted. */
  slot?: string;
  className?: string;
};

/**
 * Nothing here yet: a title, the line under it and the way out, each drawn
 * only when given. It draws the design system's empty state as it stands,
 * so every page that has nothing to show reads the same.
 */
function EmptyPanel({ copy, actions, slot, className }: EmptyPanelProps) {
  return (
    <EmptyState
      actions={actions}
      className={className}
      data-slot={slot ?? "empty-state"}
      description={copy.description}
      title={copy.title}
    />
  );
}

export type { EmptyPanelCopy, EmptyPanelProps };
export { EmptyPanel };

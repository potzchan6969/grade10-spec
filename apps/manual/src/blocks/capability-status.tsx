import { Badge } from "@grade10/design-system/components/display/badge";
import { StatusIndicator } from "@grade10/design-system/components/display/status-indicator";
import type { CapabilityStatus } from "../api/derive";

type Mark = {
  word: string;
  title: string;
  /** Fill for the pip; the primitive's own muted fill stands for incubating. */
  pip?: string;
  badge: "warning" | "default";
};

/** `stable` says nothing anywhere — a page wearing it on every entry is noise,
 * so absence is the signal and only the other two are drawn. */
const MARK: Record<CapabilityStatus, Mark | null> = {
  changing: {
    word: "changing",
    title: "Changing — a change in flight touches this spec",
    pip: "bg-warning",
    badge: "warning",
  },
  incubating: {
    word: "incubating",
    title: "Incubating — no durable spec behind this page yet",
    badge: "default",
  },
  stable: null,
};

/** The nav's quietest possible marker: a pip, named for screen readers. */
export function CapabilityPip({ status }: { status?: CapabilityStatus }) {
  const mark = status ? MARK[status] : null;
  if (!mark) return null;

  return (
    <StatusIndicator
      aria-label={mark.title}
      className={mark.pip}
      role="img"
      title={mark.title}
    />
  );
}

/** The same fact said in a word, where a card has room for one. */
export function CapabilityWord({
  status,
  className,
}: {
  status: CapabilityStatus;
  className?: string;
}) {
  const mark = MARK[status];
  if (!mark) return null;

  return (
    <Badge
      className={className}
      size="sm"
      title={mark.title}
      variant={mark.badge}
    >
      {mark.word}
    </Badge>
  );
}

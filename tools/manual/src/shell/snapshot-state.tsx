import { Skeleton } from "@grade10/design-system/components/display/skeleton";
import { Text } from "@grade10/design-system/components/display/text";
import { WarningCircle } from "@phosphor-icons/react";

export function SnapshotLoading() {
  return (
    <div className="space-y-4">
      <Skeleton aria-label="Loading the manual" className="h-8 w-64" />
      <Skeleton className="h-4 w-full max-w-xl" />
      <Skeleton className="h-4 w-full max-w-md" />
    </div>
  );
}

export function SnapshotUnavailable({ message }: { message: string }) {
  return (
    <div
      className="rounded-xl border border-destructive-border bg-destructive-muted p-6"
      role="alert"
    >
      <div className="flex items-center gap-2 text-destructive">
        <WarningCircle aria-hidden size={16} />
        <Text as="span" weight="bold">
          Snapshot unavailable
        </Text>
      </div>
      <Text as="p" className="mt-2" size="sm" tone="secondary">
        Neither the store nor the bundled fixture answered. {message}
      </Text>
    </div>
  );
}

export function FixtureNotice({ reason }: { reason?: string }) {
  return (
    <div
      className="mb-8 rounded-lg border border-warning-border bg-background-subtle px-4 py-3"
      role="status"
    >
      <Text as="p" size="sm" tone="secondary">
        Showing the bundled fixture — the store snapshot is not being served.
        {reason ? ` (${reason})` : null}
      </Text>
    </div>
  );
}

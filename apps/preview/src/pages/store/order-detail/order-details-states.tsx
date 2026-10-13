import { Skeleton } from "@grade10/design-system/components/display/skeleton";
import { Button } from "@grade10/design-system/components/forms/button";
import type { ReactNode } from "react";

/** The first order read in flight: a skeleton card, announced as loading. */
function OrderDetailsLoadingCard({ label }: { label: string }) {
  return (
    <div aria-busy="true" className="flex w-full flex-col gap-4" role="status">
      <span className="sr-only">{label}</span>
      <Skeleton className="h-10 w-2/3 rounded-lg" />
      <Skeleton className="h-64 w-full rounded-2xl" />
    </div>
  );
}

/** The order read failed: what happened, and a way to read it again. */
function OrderDetailsReadFailed({
  message,
  onRetry,
  retryLabel,
}: {
  message: string;
  onRetry: () => void;
  retryLabel: string;
}) {
  return (
    <div className="flex flex-col items-start gap-4">
      <p className="text-sm text-secondary-foreground">{message}</p>
      <Button onClick={onRetry} type="button">
        {retryLabel}
      </Button>
    </div>
  );
}

/** Not found: the same treatment for an unknown order and one not the collector's. */
function OrderDetailsNotFound({
  backLabel,
  breadcrumbs,
  description,
  onBack,
  title,
}: {
  backLabel: string;
  breadcrumbs: ReactNode;
  description: string;
  onBack: () => void;
  title: string;
}) {
  return (
    <div className="flex w-full max-w-5xl flex-col gap-6 px-8 py-12">
      {breadcrumbs}
      <h1 className="text-3xl font-bold text-foreground">{title}</h1>
      <p className="text-sm text-secondary-foreground">{description}</p>
      <Button onClick={onBack} type="button" variant="outline">
        {backLabel}
      </Button>
    </div>
  );
}

export {
  OrderDetailsLoadingCard,
  OrderDetailsNotFound,
  OrderDetailsReadFailed,
};

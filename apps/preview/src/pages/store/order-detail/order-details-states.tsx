import { Skeleton } from "@grade10/design-system/components/display/skeleton";
import { Button } from "@grade10/design-system/components/forms/button";
import { VStack } from "@grade10/design-system/components/layout/vstack";
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
    <VStack
      className="mx-auto w-full max-w-lg px-4 py-20 text-center"
      gap="lg"
      hAlign="center"
    >
      {breadcrumbs}
      <VStack className="w-full" gap="sm" hAlign="center">
        <h1 className="text-4xl font-semibold leading-none text-foreground sm:text-5xl">
          {title}
        </h1>
        <p className="text-base leading-6 text-secondary-foreground">
          {description}
        </p>
      </VStack>
      <Button onClick={onBack} size="md" type="button">
        {backLabel}
      </Button>
    </VStack>
  );
}

export {
  OrderDetailsLoadingCard,
  OrderDetailsNotFound,
  OrderDetailsReadFailed,
};

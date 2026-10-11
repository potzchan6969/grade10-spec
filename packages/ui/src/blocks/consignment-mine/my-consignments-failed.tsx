import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { VStack } from "@grade10/design-system/components/layout/vstack";

type MyConsignmentsFailedCopy = {
  /** What did not load. */
  message: string;
  retry: string;
};

type MyConsignmentsFailedProps = {
  copy: MyConsignmentsFailedCopy;
  onRetry: () => void;
  className?: string;
};

/** A read that failed: said loudly, with the retry the consumer offers. */
function MyConsignmentsFailed({
  copy,
  onRetry,
  className,
}: MyConsignmentsFailedProps) {
  return (
    <VStack
      className={className}
      data-slot="consignment-mine-error"
      gap="sm"
      role="alert"
    >
      <Text as="p" size="sm" tone="error">
        {copy.message}
      </Text>
      <Button onClick={onRetry} size="sm" type="button" variant="secondary">
        {copy.retry}
      </Button>
    </VStack>
  );
}

export type { MyConsignmentsFailedCopy, MyConsignmentsFailedProps };
export { MyConsignmentsFailed };

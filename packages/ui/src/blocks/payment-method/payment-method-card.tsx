import { Card } from "@grade10/design-system/components/display/card";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { cn } from "@grade10/design-system/lib/utils";
import type { ComponentProps, ReactNode } from "react";

type PaymentMethodCardProps = Omit<ComponentProps<"div">, "children"> & {
  /** Leading mark — card brand logo or a bank icon. */
  leading: ReactNode;
  /** Masked number, or `Bank name, ···· ####` for a bank transfer. */
  label?: ReactNode;
  /** Optional trailing control — e.g. Change on bid enrollment. */
  action?: ReactNode;
};

/**
 * Payment method row chrome shared by Store Order Details, Winner Order, and
 * refund Transfer to. Leading mark, optional divider and label inside a padded
 * Card; optional trailing action.
 */
function PaymentMethodCard({
  leading,
  label,
  action,
  className,
  ...props
}: PaymentMethodCardProps) {
  const hasLabel = label != null && label !== "";

  return (
    <Card
      className={cn("gap-0 p-3", className)}
      data-slot="payment-method-card"
      padding={false}
      {...props}
    >
      <HStack
        className="w-full"
        gap="sm"
        hAlign={action != null ? "space-between" : "start"}
        vAlign="center"
      >
        <HStack className="min-w-0" gap="sm" vAlign="center">
          <span className="inline-flex h-5 shrink-0 items-center justify-center">
            {leading}
          </span>
          {hasLabel ? (
            <>
              <span aria-hidden className="h-5 w-px shrink-0 bg-border" />
              <span className="min-w-0 text-sm leading-5 font-medium text-foreground">
                {label}
              </span>
            </>
          ) : null}
        </HStack>
        {action != null ? (
          <div className="flex h-5 shrink-0 items-center justify-end">
            {action}
          </div>
        ) : null}
      </HStack>
    </Card>
  );
}

export type { PaymentMethodCardProps };
export { PaymentMethodCard };

import { Card } from "@grade10/design-system/components/display/card";
import { Text } from "@grade10/design-system/components/display/text";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import type { ComponentProps, ReactNode } from "react";

type PaymentMethodCardProps = Omit<ComponentProps<"div">, "children"> & {
  /** Leading mark — card brand logo or a bank icon. */
  leading: ReactNode;
  /** Primary line — masked number or destination mask. */
  label?: ReactNode;
  /**
   * Secondary line under the label — e.g. a free-text bank name on Transfer
   * to or a paid bank payment method.
   */
  description?: ReactNode;
  /** Optional trailing control — e.g. Change on bid enrollment. */
  action?: ReactNode;
};

/**
 * Payment method row chrome shared by Store Order Details, Winner Order, and
 * refund Transfer to. Leading mark, optional divider and label inside a padded
 * Card; optional description under the label; optional trailing action.
 */
function PaymentMethodCard({
  leading,
  label,
  description,
  action,
  className,
  ...props
}: PaymentMethodCardProps) {
  const hasLabel = label != null && label !== "";
  const hasDescription = description != null && description !== "";
  const hasText = hasLabel || hasDescription;

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
        vAlign={hasDescription ? "start" : "center"}
      >
        {/*
          gap-3 matches Card `p-3` so space left of the mark equals space
          between the mark and the divider (and between the divider and text).
        */}
        <HStack
          className="min-w-0 gap-3"
          gap="none"
          vAlign={hasDescription ? "start" : "center"}
        >
          <span
            className={cn(
              "inline-flex h-5 shrink-0 items-center justify-center",
              hasDescription && "mt-0.5",
            )}
          >
            {leading}
          </span>
          {hasText ? (
            <>
              <span
                aria-hidden
                className={cn(
                  "w-px shrink-0 bg-border",
                  hasDescription ? "self-stretch min-h-5" : "h-5",
                )}
              />
              <VStack className="min-w-0" gap="none" hAlign="stretch">
                {hasLabel ? (
                  <Text
                    as="span"
                    className="break-words text-foreground"
                    size="sm"
                    weight="medium"
                  >
                    {label}
                  </Text>
                ) : null}
                {hasDescription ? (
                  <Text
                    as="span"
                    className="break-words"
                    size="sm"
                    tone="secondary"
                  >
                    {description}
                  </Text>
                ) : null}
              </VStack>
            </>
          ) : null}
        </HStack>
        {action != null ? (
          <div
            className={cn(
              "flex shrink-0 items-center justify-end",
              hasDescription ? "h-5 mt-0.5" : "h-5",
            )}
          >
            {action}
          </div>
        ) : null}
      </HStack>
    </Card>
  );
}

export type { PaymentMethodCardProps };
export { PaymentMethodCard };

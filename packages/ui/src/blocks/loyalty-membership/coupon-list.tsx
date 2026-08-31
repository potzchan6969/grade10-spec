import { Badge } from "@grade10/design-system/components/display/badge";
import { List, ListItem } from "@grade10/design-system/components/display/list";
import { Skeleton } from "@grade10/design-system/components/display/skeleton";
import { Text } from "@grade10/design-system/components/display/text";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { AsyncState } from "../shared/async";
import { AsyncMessage } from "../shared/async-message";
import type { CouponItem } from "./types";

/** The words the list says, whichever coupons are in it. */
type CouponListCopy = {
  /** Accessible name of the list. */
  label: string;
  /** Stands in for every code on a surface that must withhold them. */
  maskedCode: string;
  /** Names a spent coupon. */
  spent: string;
  /** Names a void coupon. */
  void: string;
};

type CouponListProps = {
  copy: CouponListCopy;
  state: AsyncState<readonly CouponItem[]>;
  /** Withholds every code's text — for a surface that must not show it. */
  masked?: boolean;
  className?: string;
};

function CouponRow({
  copy,
  item,
  masked,
}: {
  copy: CouponListCopy;
  item: CouponItem;
  masked: boolean;
}) {
  return (
    <VStack
      className="w-full"
      data-slot="coupon-list-item"
      data-status={item.status}
      gap="xs"
    >
      <HStack align="baseline" gap="md" justify="space-between">
        <HStack align="baseline" gap="sm">
          <Text weight="medium">{item.amount}</Text>
          {item.status === "spent" ? (
            <Badge size="sm" variant="outline">
              {copy.spent}
            </Badge>
          ) : null}
          {item.status === "void" ? (
            <Badge size="sm" variant="error">
              {copy.void}
            </Badge>
          ) : null}
        </HStack>
        <Text
          className="shrink-0 font-mono"
          data-slot="coupon-list-code"
          size="sm"
        >
          {masked ? copy.maskedCode : item.code}
        </Text>
      </HStack>
      {item.description ? (
        <Text size="sm" tone="secondary">
          {item.description}
        </Text>
      ) : null}
      <HStack align="center" gap="md" justify="space-between">
        <Text size="sm" tone="secondary">
          {item.expiry}
        </Text>
        {item.action}
      </HStack>
    </VStack>
  );
}

/**
 * The coupons a member holds. Codes render as supplied; `masked` swaps every
 * one for the masked word, for a surface that may state a coupon exists but
 * must not hand its code over. Spent and void stay listed and say so — the
 * consumer decides how long history stays.
 */
function CouponList({
  copy,
  state,
  masked = false,
  className,
}: CouponListProps) {
  return (
    <VStack className={className} data-slot="coupon-list" gap="sm">
      {state.status === "loading" ? (
        <VStack className="gap-3" data-slot="coupon-list-loading">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </VStack>
      ) : null}
      {state.status === "empty" || state.status === "error" ? (
        <AsyncMessage
          action={state.action}
          message={state.message}
          slot={`coupon-list-${state.status}`}
        />
      ) : null}
      {state.status === "ready" ? (
        <List aria-label={copy.label}>
          {state.data.map((item, index) => (
            <ListItem
              className="px-0 py-3"
              divider={index < state.data.length - 1}
              key={item.id}
            >
              <CouponRow copy={copy} item={item} masked={masked} />
            </ListItem>
          ))}
        </List>
      ) : null}
    </VStack>
  );
}

export type { CouponListCopy, CouponListProps };
export { CouponList };

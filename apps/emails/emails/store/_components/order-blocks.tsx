import type { ReactNode } from "react";
import { Column, Img, Link, Row, Section, Text } from "react-email";

import { money } from "@/emails/_components/format";
import type { storeOrder } from "@/emails/store/fixtures";

type Order = typeof storeOrder;

type OrderLine = Order["lines"][number];

function Block({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <Section className="my-6">
      <Text className="mb-2 mt-0 text-sm font-bold text-fg">{heading}</Text>
      {children}
    </Section>
  );
}

/** The lines an order carries; `priced` adds each line total on the right. */
export function OrderLines({
  lines,
  priced = false,
}: {
  lines: OrderLine[];
  priced?: boolean;
}) {
  return (
    <Block heading="商品">
      {lines.map((line) => (
        <Row
          className="border-0 border-b border-solid border-stroke py-3"
          key={line.title}
        >
          <Column className="align-top" style={{ width: "72px" }}>
            <Img
              alt={line.title}
              className="rounded"
              height={56}
              src={line.imageUrl}
              width={56}
            />
          </Column>
          <Column className="px-3 align-top">
            <Text className="mb-0 mt-0 text-base font-bold leading-tight text-fg">
              {line.title}
            </Text>
            <Text className="mb-0 mt-1 text-sm text-secondary-fg">
              數量 × {line.quantity}
            </Text>
          </Column>
          {priced ? (
            <Column className="whitespace-nowrap text-right align-top">
              <Text className="mb-0 mt-0 text-base font-bold text-fg">
                {money(line.amountMinor)}
              </Text>
            </Column>
          ) : null}
        </Row>
      ))}
    </Block>
  );
}

function TotalRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  const className = strong
    ? "mb-0 mt-2 text-lg font-bold text-fg"
    : "mb-0 mt-1 text-sm text-secondary-fg";
  return (
    <Row>
      <Column>
        <Text className={className}>{label}</Text>
      </Column>
      <Column className="whitespace-nowrap text-right">
        <Text className={className}>{value}</Text>
      </Column>
    </Row>
  );
}

export function OrderTotals({
  order,
}: {
  order: Pick<
    Order,
    "subtotalMinor" | "discountMinor" | "shippingMinor" | "totalMinor"
  >;
}) {
  return (
    <Section className="my-6">
      <TotalRow label="小計" value={money(order.subtotalMinor)} />
      {order.discountMinor > 0 ? (
        <TotalRow label="折扣" value={`-${money(order.discountMinor)}`} />
      ) : null}
      <TotalRow label="運費" value={money(order.shippingMinor)} />
      <TotalRow label="總額" value={money(order.totalMinor)} strong />
    </Section>
  );
}

export function ShippingAddress({ order }: { order: Pick<Order, "address"> }) {
  return (
    <Block heading="運送地址">
      {order.address.map((line) => (
        <Text className="mb-0 mt-0 text-base leading-base text-fg" key={line}>
          {line}
        </Text>
      ))}
    </Block>
  );
}

export function Tracking({ order }: { order: Pick<Order, "tracking"> }) {
  const { company, number, url } = order.tracking;
  return (
    <Block heading="追蹤訂單">
      <Text className="mb-0 mt-0 text-base leading-base text-fg">
        物流公司：{company}
      </Text>
      <Text className="mb-0 mt-1 text-base leading-base text-fg">
        追蹤編號：
        <Link className="text-fg underline" href={url}>
          {number}
        </Link>
      </Text>
    </Block>
  );
}

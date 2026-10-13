import {
  OrderLines,
  ShippingAddress,
  Tracking,
} from "@/emails/store/_components/order-blocks";
import {
  StoreLetter,
  viewOrder,
} from "@/emails/store/_components/store-letter";
import { storeOrder } from "@/emails/store/fixtures";

export const subject = `訂單 ${storeOrder.name} 的貨件配送中`;

export default function ShippingConfirmationEmail() {
  return (
    <StoreLetter
      action={viewOrder}
      heading="你的訂單已出貨"
      lead={`訂單 ${storeOrder.name} 的貨件已寄出。`}
      line={`訂單 ${storeOrder.name}`}
      preheader="你的貨件已寄出。"
    >
      <Tracking order={storeOrder} />
      <OrderLines lines={storeOrder.lines} />
      <ShippingAddress order={storeOrder} />
    </StoreLetter>
  );
}

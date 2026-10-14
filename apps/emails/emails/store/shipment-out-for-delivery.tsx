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

export const subject = `訂單 ${storeOrder.name} 今日派送`;

export default function ShipmentOutForDeliveryEmail() {
  return (
    <StoreLetter
      action={viewOrder}
      heading="你的貨件今日派送"
      lead={`訂單 ${storeOrder.name} 的貨件正在派送途中，今日會送到以下地址。`}
      line={`訂單 ${storeOrder.name}`}
      preheader="你的貨件今日會送到。"
    >
      <ShippingAddress order={storeOrder} />
      <Tracking order={storeOrder} />
      <OrderLines lines={storeOrder.lines} />
    </StoreLetter>
  );
}

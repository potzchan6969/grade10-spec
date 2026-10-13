import { OrderLines, Tracking } from "@/emails/store/_components/order-blocks";
import {
  StoreLetter,
  viewOrder,
} from "@/emails/store/_components/store-letter";
import { storeOrder } from "@/emails/store/fixtures";

export const subject = `訂單 ${storeOrder.name} 的運送資訊更新`;

export default function ShippingUpdateEmail() {
  return (
    <StoreLetter
      action={viewOrder}
      heading="運送資訊已更新"
      lead={`訂單 ${storeOrder.name} 的貨件運送資訊有更新，以下是最新的追蹤資料。`}
      line={`訂單 ${storeOrder.name}`}
      preheader="你的貨件運送資訊有更新。"
    >
      <Tracking order={storeOrder} />
      <OrderLines lines={storeOrder.lines} />
    </StoreLetter>
  );
}

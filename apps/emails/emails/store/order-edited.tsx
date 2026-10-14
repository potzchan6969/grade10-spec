import {
  OrderLines,
  OrderTotals,
} from "@/emails/store/_components/order-blocks";
import {
  StoreLetter,
  viewOrder,
} from "@/emails/store/_components/store-letter";
import { storeOrder } from "@/emails/store/fixtures";

export const subject = `訂單 ${storeOrder.name} 已更新`;

export default function OrderEditedEmail() {
  return (
    <StoreLetter
      action={viewOrder}
      heading={`訂單 ${storeOrder.name} 已更新`}
      lead="你的訂單內容已更改，以下是更新後的訂單。"
      line={`訂單 ${storeOrder.name}`}
      preheader="你的訂單內容已更改。"
    >
      <OrderLines lines={storeOrder.lines} priced />
      <OrderTotals order={storeOrder} />
    </StoreLetter>
  );
}

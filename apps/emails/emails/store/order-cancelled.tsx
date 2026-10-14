import { OrderLines } from "@/emails/store/_components/order-blocks";
import {
  StoreLetter,
  viewOrder,
} from "@/emails/store/_components/store-letter";
import { storeOrder } from "@/emails/store/fixtures";

export const subject = `訂單 ${storeOrder.name} 已取消`;

export default function OrderCancelledEmail() {
  return (
    <StoreLetter
      action={viewOrder}
      heading={`訂單 ${storeOrder.name} 已取消`}
      lead={[
        `訂單 ${storeOrder.name} 已取消。`,
        "如已收取款項，我們會退款至你的原付款方式，並另行電郵通知你。",
      ]}
      line={`訂單 ${storeOrder.name}`}
      preheader="你的訂單已取消。"
    >
      <OrderLines lines={storeOrder.lines} priced />
    </StoreLetter>
  );
}

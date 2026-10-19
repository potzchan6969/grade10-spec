import {
  OrderLines,
  OrderTotals,
  ShippingAddress,
} from "@/emails/store/_components/order-blocks";
import {
  StoreLetter,
  viewOrder,
} from "@/emails/store/_components/store-letter";
import { storeOrder } from "@/emails/store/fixtures";

export const subject = `訂單 ${storeOrder.name} 已確認`;

export default function OrderConfirmationEmail() {
  return (
    <StoreLetter
      action={viewOrder}
      heading={`訂單 ${storeOrder.name} 已確認`}
      lead="多謝你的訂單。我們正在準備出貨，貨件寄出時會再電郵通知你。"
      line="多謝你在 Grade10 購物。"
      preheader="我們已收到你的訂單，正在準備出貨。"
    >
      <OrderLines lines={storeOrder.lines} priced />
      <OrderTotals order={storeOrder} />
      <ShippingAddress order={storeOrder} />
    </StoreLetter>
  );
}

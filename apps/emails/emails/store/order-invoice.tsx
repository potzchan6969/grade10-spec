import { Note } from "@/emails/_components/letter-shell";
import {
  OrderLines,
  OrderTotals,
} from "@/emails/store/_components/order-blocks";
import { StoreLetter } from "@/emails/store/_components/store-letter";
import { storeOrder } from "@/emails/store/fixtures";

export const subject = `發票 ${storeOrder.name}`;

export default function OrderInvoiceEmail() {
  return (
    <StoreLetter
      action={{ label: "前往付款", href: storeOrder.paymentUrl }}
      heading="完成訂單付款"
      lead="你的訂單已準備好，按下方按鈕即可付款。"
      line="多謝你在 Grade10 購物。"
      preheader="你的訂單已準備好，可以付款。"
    >
      <Note>{storeOrder.customMessage}</Note>
      <OrderLines lines={storeOrder.lines} priced />
      <OrderTotals order={storeOrder} />
    </StoreLetter>
  );
}

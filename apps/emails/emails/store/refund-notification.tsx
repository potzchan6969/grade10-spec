import { money } from "@/emails/_components/format";
import { FactsGroup } from "@/emails/_components/letter-shell";
import { OrderLines } from "@/emails/store/_components/order-blocks";
import {
  StoreLetter,
  viewOrder,
} from "@/emails/store/_components/store-letter";
import { storeOrder } from "@/emails/store/fixtures";

const refundedLines = storeOrder.lines
  .filter((line) => line.refundedQuantity > 0)
  .map((line) => ({ ...line, quantity: line.refundedQuantity }));

export const subject = `訂單 ${storeOrder.name} 已退款`;

export default function RefundNotificationEmail() {
  return (
    <StoreLetter
      action={viewOrder}
      heading="退款已處理"
      lead={[
        `我們已為訂單 ${storeOrder.name} 退款，款項會退回你的原付款方式。`,
        "視乎發卡銀行，款項或需數個工作天才會顯示。",
      ]}
      line={`訂單 ${storeOrder.name}`}
      preheader="我們已處理你的退款。"
    >
      <FactsGroup
        facts={[{ label: "退款", value: money(storeOrder.refundMinor) }]}
      />
      {refundedLines.length > 0 ? <OrderLines lines={refundedLines} /> : null}
    </StoreLetter>
  );
}

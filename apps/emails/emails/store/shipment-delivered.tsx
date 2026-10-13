import { OrderLines } from "@/emails/store/_components/order-blocks";
import {
  StoreLetter,
  viewOrder,
} from "@/emails/store/_components/store-letter";
import { storeOrder } from "@/emails/store/fixtures";

export const subject = `訂單 ${storeOrder.name} 的貨件已送達`;

export default function ShipmentDeliveredEmail() {
  return (
    <StoreLetter
      action={viewOrder}
      heading="你的貨件已送達"
      lead={[
        `訂單 ${storeOrder.name} 的貨件已送達。`,
        "如果你未收到貨件，請直接回覆此電郵告訴我們。",
      ]}
      line={`訂單 ${storeOrder.name}`}
      preheader="你的貨件已送達。"
    >
      <OrderLines lines={storeOrder.lines} />
    </StoreLetter>
  );
}

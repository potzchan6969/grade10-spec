import { Note } from "@/emails/_components/letter-shell";
import { OrderLines } from "@/emails/store/_components/order-blocks";
import { StoreLetter } from "@/emails/store/_components/store-letter";
import { storeOrder } from "@/emails/store/fixtures";

export const subject = "完成你的購買";

export default function AbandonedCheckoutNotificationEmail() {
  return (
    <StoreLetter
      action={{ label: "前往結帳", href: storeOrder.checkoutUrl }}
      heading="你的購物車仍然保留著"
      lead="你還未完成結帳，按下方按鈕即可返回並完成購買。"
      preheader="你的購物車仍然保留著。"
    >
      <Note>{storeOrder.customMessage}</Note>
      <OrderLines lines={storeOrder.lines} />
    </StoreLetter>
  );
}

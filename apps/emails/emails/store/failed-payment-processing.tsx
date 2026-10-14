import { StoreLetter } from "@/emails/store/_components/store-letter";
import { storeOrder } from "@/emails/store/fixtures";

export const subject = "付款未能完成";

export default function FailedPaymentProcessingEmail() {
  return (
    <StoreLetter
      action={{ label: "前往付款", href: storeOrder.checkoutUrl }}
      heading="付款未能完成"
      lead="我們未能處理你的付款。請檢查你的付款資料後再試一次。"
      preheader="付款未能完成，請檢查你的付款資料。"
    />
  );
}

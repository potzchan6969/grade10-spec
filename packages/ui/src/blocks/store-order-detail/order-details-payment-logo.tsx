import { cn } from "@grade10/design-system/lib/utils";
import {
  AmericanExpress,
  Mastercard,
  Visa,
} from "react-svg-credit-card-payment-icons/icons/logo";
import applePayLogo from "./order-details-apple-pay.logo.png";
import googlePayLogo from "./order-details-google-pay.logo.png";
import type { OrderDetailsPaymentBrand } from "./types";

const PAYMENT_BRAND_LABEL: Record<OrderDetailsPaymentBrand, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  amex: "American Express",
  "apple-pay": "Apple Pay",
  "google-pay": "Google Pay",
};

/** Matches payment row `text-sm` / `leading-5` (20px). */
const LOGO_HEIGHT = 20;

type OrderDetailsPaymentLogoProps = {
  brand: OrderDetailsPaymentBrand;
  className?: string;
};

/**
 * Payment provider mark sized to the payment row's `text-sm` / `leading-5`
 * line (20px tall). Figma payment card annotation (`5057:6854`): show the
 * provider logo alongside the masked card number.
 *
 * Card brands use `react-svg-credit-card-payment-icons` (`logo` format),
 * imported from that format's subpath: the package root keeps every brand in
 * every format, over 500 KB, for these three.
 * Wallet brands use bundled brand marks from SVGRepo assets.
 */
function OrderDetailsPaymentLogo({
  brand,
  className,
}: OrderDetailsPaymentLogoProps) {
  const label = PAYMENT_BRAND_LABEL[brand];
  const shared = cn("h-5 w-auto shrink-0", className);

  switch (brand) {
    case "visa":
      return (
        <Visa
          aria-label={label}
          className={shared}
          height={LOGO_HEIGHT}
          role="img"
        />
      );
    case "mastercard":
      return (
        <Mastercard
          aria-label={label}
          className={shared}
          height={LOGO_HEIGHT}
          role="img"
        />
      );
    case "amex":
      return (
        <AmericanExpress
          aria-label={label}
          className={shared}
          height={LOGO_HEIGHT}
          role="img"
        />
      );
    case "apple-pay":
      return (
        <img
          alt={label}
          className={shared}
          height={LOGO_HEIGHT}
          src={applePayLogo}
        />
      );
    case "google-pay":
      return (
        <img
          alt={label}
          className={shared}
          height={LOGO_HEIGHT}
          src={googlePayLogo}
        />
      );
  }
}

export type { OrderDetailsPaymentLogoProps };
export { OrderDetailsPaymentLogo, PAYMENT_BRAND_LABEL };

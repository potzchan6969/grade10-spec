import { cn } from "@grade10/design-system/lib/utils";
import { QRCodeSVG } from "qrcode.react";

type AuthenticatorQrProps = {
  /** The `otpauth://` URI, encoded verbatim. */
  value: string;
  /** Read to anyone who cannot see the code. Required — no built-in English. */
  altText: string;
  className?: string;
};

/**
 * The enrollment QR code.
 *
 * The one place in this package where a theme token would be wrong. A QR code
 * is a scanning target, not chrome: phone cameras expect dark modules on a
 * light field, so a palette that inverts under dark mode produces a code that
 * simply does not scan. The colours and the plate behind them are therefore
 * fixed, and stay fixed however dark the surface around them gets.
 *
 * `level="M"` because an `otpauth://` URI is short (~150 characters) and the
 * damage tolerance stronger levels buy is worthless on a screen — while the
 * extra modules they add make each module smaller at a fixed size, which is
 * the one thing a camera actually cares about. 192px keeps modules well above
 * the size a phone can resolve at arm's length, and `marginSize={4}` draws the
 * quiet zone the spec requires in the same white as the plate.
 */
function AuthenticatorQr({ value, altText, className }: AuthenticatorQrProps) {
  return (
    <div
      className={cn("w-fit rounded-(--radius-md) bg-white p-3", className)}
      data-slot="authenticator-qr"
    >
      <QRCodeSVG
        bgColor="#ffffff"
        fgColor="#000000"
        level="M"
        marginSize={4}
        size={192}
        title={altText}
        value={value}
      />
    </div>
  );
}

export type { AuthenticatorQrProps };
export { AuthenticatorQr };

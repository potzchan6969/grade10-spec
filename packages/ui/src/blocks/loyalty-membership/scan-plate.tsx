import { Text } from "@grade10/design-system/components/display/text";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import { QRCodeSVG } from "qrcode.react";

type ScanPlateProps = {
  /** Read to anyone who cannot see the scannable code. */
  alt: string;
  /** Names the readable code beneath the square. */
  caption: string;
  /** The readable code itself. */
  code: string;
  /** Drawn spent, and hidden from a scanner's reader. */
  dimmed?: boolean;
  /** The `data-slot` prefix, so each surface keeps its own hooks. */
  slot: string;
  /** What the square encodes, verbatim. Nothing here mints one. */
  value: string;
};

/**
 * A square held up to a scanner, with the same thing written out beneath it.
 *
 * Shared by the member card and the coupon presentation because they are the
 * same object from the counter's side: something to scan, and something to
 * read out when the scanner will not.
 *
 * The plate keeps fixed colours for the same reason the authenticator QR does:
 * phone scanners expect dark modules on a light field, and a palette that
 * inverts under dark mode produces a code that does not scan.
 */
function ScanPlate({
  alt,
  caption,
  code,
  dimmed,
  slot,
  value,
}: ScanPlateProps) {
  return (
    <VStack gap="md">
      <div
        aria-hidden={dimmed || undefined}
        className={cn(
          "w-fit rounded-(--radius-md) bg-white p-3",
          dimmed && "opacity-30",
        )}
        data-slot={`${slot}-qr`}
      >
        <QRCodeSVG
          bgColor="#ffffff"
          fgColor="#000000"
          level="M"
          marginSize={4}
          size={192}
          title={alt}
          value={value}
        />
      </div>
      <VStack gap="xs">
        <Text size="sm" tone="secondary">
          {caption}
        </Text>
        <Text
          className="font-mono tracking-widest"
          data-slot={`${slot}-code`}
          size="lg"
          weight="medium"
        >
          {code}
        </Text>
      </VStack>
    </VStack>
  );
}

export type { ScanPlateProps };
export { ScanPlate };

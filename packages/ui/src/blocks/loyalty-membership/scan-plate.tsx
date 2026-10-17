import { Text } from "@grade10/design-system/components/display/text";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import { QRCodeSVG } from "qrcode.react";

type ScanPlateVariant = "plate" | "flat";

type ScanPlateProps = {
  /** Read to anyone who cannot see the scannable code. */
  alt: string;
  /** Names the readable code beneath the square. */
  caption: string;
  /** The readable code itself. */
  code: string;
  /** Drawn spent, and hidden from a scanner's reader. */
  dimmed?: boolean;
  /** The square's edge in px before the surface caps it — the pass draws 224. */
  size?: number;
  /** The `data-slot` prefix, so each surface keeps its own hooks. */
  slot: string;
  /** What the square encodes, verbatim. Nothing here mints one. */
  value: string;
  /**
   * `plate` (default): the square on its own white plate, the caption and
   * code at the left. `flat`: the square straight on a field the surface
   * already keeps light — centered, the caption a small label and the code
   * large, the member pass's own presentation.
   */
  variant?: ScanPlateVariant;
};

/**
 * A square held up to a scanner, with the same thing written out beneath it.
 *
 * Shared by the member pass and the coupon presentation because they are the
 * same object from the counter's side: something to scan, and something to
 * read out when the scanner will not.
 *
 * The plate keeps fixed colours for the same reason the authenticator QR does:
 * phone scanners expect dark modules on a light field, and a palette that
 * inverts under dark mode produces a code that does not scan. The `flat`
 * rung draws no plate of its own — it is for a surface, like the member
 * pass's body, that is already a fixed light field.
 */
function ScanPlate({
  alt,
  caption,
  code,
  dimmed,
  size = 192,
  slot,
  value,
  variant = "plate",
}: ScanPlateProps) {
  if (variant === "flat") {
    return (
      <VStack
        aria-hidden={dimmed || undefined}
        className={cn(
          "transition-opacity duration-200",
          dimmed && "opacity-30",
        )}
        gap="sm"
        hAlign="center"
      >
        <div className="w-full max-w-56" data-slot={`${slot}-qr`}>
          <QRCodeSVG
            bgColor="#ffffff"
            className="block h-auto w-full"
            fgColor="#000000"
            level="M"
            marginSize={2}
            size={size}
            title={alt}
            value={value}
          />
        </div>
        <VStack gap="none" hAlign="center">
          <Text
            className="text-secondary-foreground uppercase"
            size="xs"
            weight="medium"
          >
            {caption}
          </Text>
          <span
            className="font-sans text-2xl leading-8 font-medium text-foreground"
            data-slot={`${slot}-code`}
          >
            {code}
          </span>
        </VStack>
      </VStack>
    );
  }

  return (
    <VStack
      aria-hidden={dimmed || undefined}
      className={cn("transition-opacity duration-200", dimmed && "opacity-30")}
      gap="md"
    >
      <div
        className="w-fit rounded-(--radius-md) bg-white p-3"
        data-slot={`${slot}-qr`}
      >
        <QRCodeSVG
          bgColor="#ffffff"
          fgColor="#000000"
          level="M"
          marginSize={4}
          size={size}
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

export type { ScanPlateProps, ScanPlateVariant };
export { ScanPlate };

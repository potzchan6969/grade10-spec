import { Separator } from "@grade10/design-system/components/display/separator";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { Link } from "@grade10/design-system/components/forms/link";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { ReactNode } from "react";
import type { AsyncAction } from "../shared/async";
import { AuthenticatorQr } from "./authenticator-qr";
import { parseTotpUri } from "./totp-uri";
import { TwoFactorVerifyForm } from "./two-factor-verify-form";

type TwoFactorEnrollmentProps = {
  /** The `otpauth://` URI the server minted for this enrollment. */
  totpURI: string;
  /** Shown once and never again, so the consumer must have kept them. */
  backupCodes: readonly string[];
  scanTitle: ReactNode;
  scanDescription?: ReactNode;
  /** Alt text for the QR code. Required — no built-in English. */
  qrAltText: string;
  /** Text of the `otpauth://` link — "Open in your password manager". */
  openInAppLabel: ReactNode;
  issuerLabel: ReactNode;
  accountLabel: ReactNode;
  setupKeyLabel: ReactNode;
  setupKeyHint?: ReactNode;
  /** Omit and no copy button renders; the key stays selectable either way. */
  copySetupKey?: AsyncAction;
  backupCodesTitle: ReactNode;
  backupCodesDescription: ReactNode;
  copyBackupCodes?: AsyncAction;
  downloadBackupCodes?: AsyncAction;
  verifyLabel: ReactNode;
  verifyHint?: ReactNode;
  verifySubmitLabel: ReactNode;
  error?: ReactNode;
  pending?: boolean;
  onVerify: (code: string) => void;
  className?: string;
};

function DetailRow({ label, value }: { label: ReactNode; value: string }) {
  return (
    <VStack gap="none">
      <Text size="sm" tone="secondary">
        {label}
      </Text>
      <Text className="break-all" size="sm">
        {value}
      </Text>
    </VStack>
  );
}

/**
 * Everything an operator needs to move a new second factor into whatever they
 * keep codes in, and then prove they did.
 *
 * Three ways in, because which one works depends on where the authenticator
 * lives: a QR for a phone across the desk, an `otpauth://` link for a password
 * manager on this same screen (which can never scan a code it is covering),
 * and the setup key typed by hand for everything else. All three carry the
 * same enrollment.
 *
 * Issuer and account are read back out of the URI rather than passed in
 * beside it: the URI is what the authenticator will actually save, so anything
 * else on screen could tell the operator one thing while the app stores
 * another.
 *
 * Presentation only — copying, downloading and verifying are reported to the
 * consumer, which owns the clipboard, the file name and the network.
 */
function TwoFactorEnrollment({
  totpURI,
  backupCodes,
  scanTitle,
  scanDescription,
  qrAltText,
  openInAppLabel,
  issuerLabel,
  accountLabel,
  setupKeyLabel,
  setupKeyHint,
  copySetupKey,
  backupCodesTitle,
  backupCodesDescription,
  copyBackupCodes,
  downloadBackupCodes,
  verifyLabel,
  verifyHint,
  verifySubmitLabel,
  error,
  pending = false,
  onVerify,
  className,
}: TwoFactorEnrollmentProps) {
  const { issuer, account, secret } = parseTotpUri(totpURI);

  return (
    <VStack className={className} data-slot="two-factor-enrollment" gap="lg">
      <VStack gap="sm">
        <Text weight="medium">{scanTitle}</Text>
        {scanDescription ? (
          <Text size="sm" tone="secondary">
            {scanDescription}
          </Text>
        ) : null}
        <AuthenticatorQr altText={qrAltText} value={totpURI} />
        <Link href={totpURI} size="sm">
          {openInAppLabel}
        </Link>
      </VStack>

      <VStack gap="sm">
        {issuer ? <DetailRow label={issuerLabel} value={issuer} /> : null}
        {account ? <DetailRow label={accountLabel} value={account} /> : null}
        {secret ? (
          <VStack gap="xs">
            <Text size="sm" tone="secondary">
              {setupKeyLabel}
            </Text>
            <HStack align="center" gap="sm" wrap>
              <Text className="break-all font-mono" size="sm">
                {secret}
              </Text>
              {copySetupKey ? (
                <Button
                  onClick={copySetupKey.onAction}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  {copySetupKey.label}
                </Button>
              ) : null}
            </HStack>
            {setupKeyHint ? (
              <Text size="sm" tone="secondary">
                {setupKeyHint}
              </Text>
            ) : null}
          </VStack>
        ) : null}
      </VStack>

      <Separator />

      <VStack gap="sm">
        <Text weight="medium">{backupCodesTitle}</Text>
        <Text size="sm" tone="secondary">
          {backupCodesDescription}
        </Text>
        <VStack
          className="rounded-(--radius-md) border border-border p-3"
          gap="none"
        >
          {backupCodes.map((code) => (
            <Text className="font-mono" key={code} size="sm">
              {code}
            </Text>
          ))}
        </VStack>
        {copyBackupCodes || downloadBackupCodes ? (
          <HStack gap="sm" wrap>
            {copyBackupCodes ? (
              <Button
                onClick={copyBackupCodes.onAction}
                size="sm"
                type="button"
                variant="outline"
              >
                {copyBackupCodes.label}
              </Button>
            ) : null}
            {downloadBackupCodes ? (
              <Button
                onClick={downloadBackupCodes.onAction}
                size="sm"
                type="button"
                variant="outline"
              >
                {downloadBackupCodes.label}
              </Button>
            ) : null}
          </HStack>
        ) : null}
      </VStack>

      <Separator />

      <TwoFactorVerifyForm
        error={error}
        hint={verifyHint}
        label={verifyLabel}
        onSubmit={onVerify}
        pending={pending}
        submitLabel={verifySubmitLabel}
      />
    </VStack>
  );
}

export type { TwoFactorEnrollmentProps };
export { TwoFactorEnrollment };

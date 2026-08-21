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

/** Every word the enrollment says. What the server minted for it — the URI,
 * the codes — is not a word and stays its own prop. */
type TwoFactorEnrollmentCopy = {
  scanTitle: string;
  scanDescription?: string;
  /** Alt text for the QR code. */
  qrAlt: string;
  /** Text of the `otpauth://` link — "Open in your password manager". */
  openInApp: string;
  issuer: string;
  account: string;
  setupKey: string;
  setupKeyHint?: string;
  backupCodesTitle: string;
  backupCodesDescription: string;
  verify: string;
  verifyHint?: string;
  verifySubmit: string;
};

type TwoFactorEnrollmentProps = {
  copy: TwoFactorEnrollmentCopy;
  /** The `otpauth://` URI the server minted for this enrollment. */
  totpURI: string;
  /** Shown once and never again, so the consumer must have kept them. */
  backupCodes: readonly string[];
  /** Omit and no copy button renders; the key stays selectable either way. */
  copySetupKey?: AsyncAction;
  copyBackupCodes?: AsyncAction;
  downloadBackupCodes?: AsyncAction;
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
  copy,
  totpURI,
  backupCodes,
  copySetupKey,
  copyBackupCodes,
  downloadBackupCodes,
  error,
  pending = false,
  onVerify,
  className,
}: TwoFactorEnrollmentProps) {
  const { issuer, account, secret } = parseTotpUri(totpURI);

  return (
    <VStack className={className} data-slot="two-factor-enrollment" gap="lg">
      <VStack gap="sm">
        <Text weight="medium">{copy.scanTitle}</Text>
        {copy.scanDescription ? (
          <Text size="sm" tone="secondary">
            {copy.scanDescription}
          </Text>
        ) : null}
        <AuthenticatorQr altText={copy.qrAlt} value={totpURI} />
        <Link href={totpURI} size="sm">
          {copy.openInApp}
        </Link>
      </VStack>

      <VStack gap="sm">
        {issuer ? <DetailRow label={copy.issuer} value={issuer} /> : null}
        {account ? <DetailRow label={copy.account} value={account} /> : null}
        {secret ? (
          <VStack gap="xs">
            <Text size="sm" tone="secondary">
              {copy.setupKey}
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
            {copy.setupKeyHint ? (
              <Text size="sm" tone="secondary">
                {copy.setupKeyHint}
              </Text>
            ) : null}
          </VStack>
        ) : null}
      </VStack>

      <Separator />

      <VStack gap="sm">
        <Text weight="medium">{copy.backupCodesTitle}</Text>
        <Text size="sm" tone="secondary">
          {copy.backupCodesDescription}
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
        copy={{
          label: copy.verify,
          hint: copy.verifyHint,
          submit: copy.verifySubmit,
        }}
        error={error}
        onSubmit={onVerify}
        pending={pending}
      />
    </VStack>
  );
}

export type { TwoFactorEnrollmentCopy, TwoFactorEnrollmentProps };
export { TwoFactorEnrollment };

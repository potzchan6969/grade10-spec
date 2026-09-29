import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import { Textarea } from "@grade10/design-system/components/forms/textarea";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@grade10/design-system/components/overlays/dialog";
import { toast } from "@grade10/design-system/components/overlays/toast";
import { Check, Copy } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import type { WinnerOrderContactMail } from "./winner-order-contact-mail";

const COPY_FEEDBACK_MS = 1600;

type CopiedField = "to" | "subject" | "email" | null;

/**
 * Prefer a synchronous `execCommand('copy')` so the click's user-gesture
 * token is still valid (Storybook iframes deny `clipboard.writeText` and an
 * `await` before the fallback burns the gesture). Clipboard API is the
 * async backup when the legacy path is unavailable.
 */
function copyWithExecCommand(value: string): boolean {
  try {
    const input = document.createElement("textarea");
    input.value = value;
    input.setAttribute("readonly", "");
    input.style.position = "fixed";
    input.style.top = "0";
    input.style.left = "0";
    input.style.opacity = "0";
    document.body.appendChild(input);
    input.focus();
    input.select();
    input.setSelectionRange(0, value.length);
    const ok = document.execCommand("copy");
    input.remove();
    return ok;
  } catch {
    return false;
  }
}

type WinnerOrderContactDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mail: WinnerOrderContactMail;
};

/**
 * Copy-first Contact Us — ready email for a locked Winner Order.
 * To and Subject copy in place; Message is an editable Textarea.
 * Copy Message in the footer is the only way to copy the full email.
 */
function WinnerOrderContactDialog({
  open,
  onOpenChange,
  mail,
}: WinnerOrderContactDialogProps) {
  const [body, setBody] = useState(mail.body);
  const [copiedField, setCopiedField] = useState<CopiedField>(null);

  useEffect(() => {
    if (!copiedField) return;
    const timer = window.setTimeout(
      () => setCopiedField(null),
      COPY_FEEDBACK_MS,
    );
    return () => window.clearTimeout(timer);
  }, [copiedField]);

  useEffect(() => {
    if (!open) {
      setCopiedField(null);
      return;
    }
    setBody(mail.body);
  }, [open, mail.body]);

  const mailtoHref = `mailto:${mail.to}?subject=${encodeURIComponent(mail.subject)}&body=${encodeURIComponent(body)}`;
  const fullEmail = `To: ${mail.to}\nSubject: ${mail.subject}\n\n${body}`;

  function copyValue(
    field: Exclude<CopiedField, null>,
    value: string,
    successToast: string,
    manualToast: string,
  ) {
    function succeed() {
      setCopiedField(field);
      toast.success(successToast);
    }

    // Sync path first — keeps the click gesture (Storybook iframes reject
    // `clipboard.writeText`, and awaiting it before falling back burns the token).
    if (copyWithExecCommand(value)) {
      succeed();
      return;
    }

    if (!navigator.clipboard?.writeText) {
      toast.info(manualToast, { description: value });
      return;
    }

    void navigator.clipboard.writeText(value).then(succeed, () => {
      toast.info(manualToast, { description: value });
    });
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Email Grade10</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <VStack className="w-full" gap="md" hAlign="stretch">
            <CopyableDetailRow
              copied={copiedField === "to"}
              copiedAriaLabel="Address copied"
              copyAriaLabel="Copy address"
              label="To"
              onCopy={() =>
                copyValue(
                  "to",
                  mail.to,
                  "Address copied",
                  "Copy the address manually",
                )
              }
              value={mail.to}
            />
            <CopyableDetailRow
              copied={copiedField === "subject"}
              copiedAriaLabel="Subject copied"
              copyAriaLabel="Copy subject"
              label="Subject"
              onCopy={() =>
                copyValue(
                  "subject",
                  mail.subject,
                  "Subject copied",
                  "Copy the subject manually",
                )
              }
              value={mail.subject}
            />
            <Textarea
              label="Message"
              onChange={(event) => setBody(event.currentTarget.value)}
              rows={8}
              value={body}
            />
          </VStack>
        </DialogBody>
        <DialogFooter>
          <Button
            className="w-full sm:w-auto"
            render={<a href={mailtoHref} />}
            size="md"
            variant="outline"
          >
            Open Mail App
          </Button>
          <Button
            className="w-full sm:w-auto"
            onClick={() =>
              copyValue(
                "email",
                fullEmail,
                "Message copied",
                "Copy the message manually",
              )
            }
            size="md"
            type="button"
          >
            Copy Message
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CopyableDetailRow({
  label,
  value,
  copied,
  copyAriaLabel,
  copiedAriaLabel,
  onCopy,
}: {
  label: string;
  value: string;
  copied: boolean;
  copyAriaLabel: string;
  copiedAriaLabel: string;
  onCopy: () => void;
}) {
  return (
    <div className="flex w-full min-w-0 flex-col gap-0.5">
      <Text className="text-secondary-foreground" size="sm">
        {label}
      </Text>
      <div className="flex min-w-0 items-center gap-1">
        <span className="min-w-0 flex-1 text-sm leading-5 font-medium break-all text-foreground">
          {value}
        </span>
        <IconButton
          aria-label={copied ? copiedAriaLabel : copyAriaLabel}
          className="shrink-0"
          onClick={onCopy}
          size="sm"
          type="button"
          variant="ghost"
        >
          <span className="relative inline-flex size-3 items-center justify-center">
            <span
              className={
                copied
                  ? "absolute size-3 scale-75 opacity-0 transition-[opacity,transform] duration-150 ease-out motion-reduce:transition-none"
                  : "absolute size-3 scale-100 opacity-100 transition-[opacity,transform] duration-150 ease-out motion-reduce:transition-none"
              }
            >
              <Copy aria-hidden size={12} weight="bold" />
            </span>
            <span
              className={
                copied
                  ? "absolute size-3 scale-100 opacity-100 transition-[opacity,transform] duration-150 ease-out motion-reduce:transition-none"
                  : "absolute size-3 scale-75 opacity-0 transition-[opacity,transform] duration-150 ease-out motion-reduce:transition-none"
              }
            >
              <Check aria-hidden size={12} weight="bold" />
            </span>
          </span>
        </IconButton>
      </div>
    </div>
  );
}

export type { WinnerOrderContactDialogProps };
export { WinnerOrderContactDialog };

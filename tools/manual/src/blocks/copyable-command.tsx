import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import { Check, Copy } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

/** A command with its copy control: `claude`, then paste. */
export function CopyableCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(timer);
  }, [copied]);

  return (
    <span className="inline-flex items-center gap-1">
      <code className="rounded-(--radius-lg) border border-border bg-background-subtle px-1.5 py-0.5 font-mono text-xs">
        {command}
      </code>
      <IconButton
        aria-label={copied ? "Copied" : `Copy ${command}`}
        onClick={() => {
          navigator.clipboard
            .writeText(command)
            .then(() => setCopied(true))
            // A refused clipboard is not a broken card; the text is selectable.
            .catch(() => {});
        }}
        size="xs"
        title={copied ? "Copied" : "Copy for an agent session"}
        variant="ghost"
      >
        {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
      </IconButton>
    </span>
  );
}

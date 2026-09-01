import { Text } from "@grade10/design-system/components/display/text";
import { Warning, WarningOctagon } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import type { ItemError } from "../api/types";

/**
 * The manual mirrors other people's files. A malformed one is contained in the
 * snapshot and shown here — the site stays up and points at the break.
 */
export function BrokenCard({
  what,
  error,
}: {
  what: string;
  error: ItemError;
}) {
  return (
    <div
      className="my-6 overflow-hidden rounded-(--radius-2xl) border border-destructive-border bg-destructive-muted"
      role="alert"
    >
      <div className="flex items-center gap-2 border-destructive-border border-b bg-destructive px-4 py-2 text-destructive-foreground">
        <WarningOctagon aria-hidden size={16} weight="fill" />
        <Text as="span" size="sm" weight="bold">
          {what} could not be read
        </Text>
      </div>
      <div className="space-y-2 px-4 py-3">
        <Text as="p" className="text-destructive-muted-foreground" size="sm">
          {error.message}
        </Text>
        <code className="block font-mono text-destructive-muted-foreground text-xs">
          {error.file}
          {error.line === undefined ? "" : `:${error.line}`}
        </code>
      </div>
    </div>
  );
}

/** A reference that points at nothing. Never blank — the page says so out loud. */
export function MissingCard({
  title,
  tone = "warning",
  children,
}: {
  title: string;
  tone?: "warning" | "error";
  children?: ReactNode;
}) {
  const error = tone === "error";
  return (
    <div
      className={
        error
          ? "my-6 rounded-(--radius-2xl) border border-destructive-border bg-destructive-muted px-4 py-3"
          : "my-6 rounded-(--radius-2xl) border border-warning-border bg-background-subtle px-4 py-3"
      }
      role="alert"
    >
      <div
        className={`flex items-center gap-2 ${error ? "text-destructive" : "text-warning"}`}
      >
        <Warning aria-hidden size={16} weight="fill" />
        <Text as="span" size="sm" weight="bold">
          {title}
        </Text>
      </div>
      {children ? (
        <Text as="p" className="mt-1" size="sm" tone="secondary">
          {children}
        </Text>
      ) : null}
    </div>
  );
}

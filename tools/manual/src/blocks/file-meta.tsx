import { Text } from "@grade10/design-system/components/display/text";
import { ArrowSquareOut } from "@phosphor-icons/react";
import { GITHUB_BLOB } from "../api/paths";
import { relativeTime } from "../api/time";
import type { CommitInfo } from "../api/types";

/** Where a file lives in the store, and when it last changed. `label` names it
 * shorter than the href does; `path` still says where the href goes. */
export function FileMeta({
  path,
  commit,
  label,
}: {
  path: string;
  commit?: CommitInfo;
  label?: string;
}) {
  return (
    <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1">
      <a
        className="inline-flex items-center gap-1 font-mono text-secondary-foreground text-xs hover:text-foreground"
        href={`${GITHUB_BLOB}/${path}`}
        rel="noreferrer noopener"
        target="_blank"
        title={label ? path : undefined}
      >
        {label ?? path}
        <ArrowSquareOut aria-hidden size={12} />
      </a>
      {commit ? (
        <Text as="span" size="xs" tone="secondary">
          <span className="font-mono">{commit.sha.slice(0, 8)}</span> ·{" "}
          {relativeTime(commit.date)}
        </Text>
      ) : null}
    </div>
  );
}

export function withoutLeadingTitle(text: string): string {
  const lines = text.split("\n");
  const first = lines.findIndex((line) => line.trim() !== "");
  if (first === -1 || !/^#\s+\S/.test(lines[first])) return text;
  return lines.slice(first + 1).join("\n");
}

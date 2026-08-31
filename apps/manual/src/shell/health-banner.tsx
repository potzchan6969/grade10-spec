import { StatusIndicator } from "@grade10/design-system/components/display/status-indicator";
import { Text } from "@grade10/design-system/components/display/text";
import { ArrowSquareOut } from "@phosphor-icons/react";
import { useSnapshot } from "../api/snapshot-provider";
import { relativeTime, shortSha } from "../api/time";
import { REPO } from "../editor/config";
import { useEditorSession } from "../editor/session";
import { type Health, useManualHealth } from "./health";

/**
 * Whether this site still speaks for the store. Editing straight to main is
 * only honest if a frozen site is visible in the tool that froze it, so the
 * pip is always there and the strip appears the moment it has something to
 * say.
 */

function useHealth(): Health | null {
  const snapshot = useSnapshot();
  const { token } = useEditorSession();
  return useManualHealth(
    snapshot.status === "ready" ? snapshot.snapshot : null,
    token,
  );
}

const FILL = {
  unknown: "bg-muted-foreground/40",
  quiet: "bg-success",
  warn: "bg-warning",
  bad: "bg-destructive",
} as const;

export function HealthPip() {
  const health = useHealth();
  if (!health) return null;

  const said = summary(health);
  return (
    <span className="flex items-center" title={said}>
      <StatusIndicator
        aria-label={said}
        className={FILL[health.level]}
        role="img"
      />
    </span>
  );
}

export function HealthStrip() {
  const health = useHealth();
  if (!health || health.level === "quiet" || health.level === "unknown")
    return null;

  const bad = health.level === "bad";
  const shell = bad
    ? "border-destructive-border bg-destructive/8"
    : "border-warning-border bg-warning/10";

  return (
    <div className={`border-b px-4 py-2 lg:px-6 ${shell}`} role="status">
      <div className="mx-auto flex w-full max-w-[100rem] flex-wrap items-center gap-x-2 gap-y-1">
        <Text as="span" size="xs" weight="bold">
          {bad ? "The last deploy failed" : `${REPO.defaultBranch} has moved`}
        </Text>
        <Text as="span" size="xs" tone="secondary">
          {bad
            ? `This site is frozen at ${shortSha(health.storeHead)}, built ${relativeTime(health.generatedAt)}.`
            : `${ahead(health)} the deployed snapshot ${shortSha(health.storeHead)}${running(health)}.`}
        </Text>
        {health.deploy ? (
          <a
            className="inline-flex items-center gap-1 text-xs underline hover:text-foreground"
            href={health.deploy.url}
            rel="noreferrer noopener"
            target="_blank"
          >
            view the run
            <ArrowSquareOut aria-hidden size={12} />
          </a>
        ) : null}
      </div>
    </div>
  );
}

function ahead(health: Health): string {
  const count = health.live?.ahead;
  if (count === null || count === undefined) return "It is ahead of";
  return `${count} ${count === 1 ? "commit" : "commits"} ahead of`;
}

function running(health: Health): string {
  return health.deploy && health.deploy.status !== "completed"
    ? "; a deploy is running"
    : "";
}

/** Everything the pip stands for, in the one line a title can hold. */
function summary(health: Health): string {
  const parts = [`Deployed ${relativeTime(health.generatedAt)}`];
  if (health.level === "unknown")
    parts.push("main's state unchecked — add a token in settings to see it");
  if (health.live) {
    parts.push(
      health.live.head === health.storeHead
        ? `${REPO.defaultBranch} is level with it`
        : `${REPO.defaultBranch} ${ahead(health).toLowerCase()} it`,
    );
  }
  if (health.deploy) {
    parts.push(
      health.deploy.conclusion
        ? `last deploy ${health.deploy.conclusion}`
        : "a deploy is running",
    );
  }
  return parts.join(" · ");
}

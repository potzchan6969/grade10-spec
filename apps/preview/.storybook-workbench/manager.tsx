import React, { useState } from "react";
import { AddonPanel } from "storybook/internal/components";
import {
  addons,
  types,
  useArgs,
  useArgTypes,
  useChannel,
  useParameter,
  useStorybookApi,
  useStorybookState,
} from "storybook/manager-api";
import { GIVEN_JOURNEYS, type GivenJourneys } from "./given-event";

// The manager bundle compiles JSX to React.createElement, so React is in scope.
void React;

/* The Given panel beside Controls on a Scenario (a story tagged `scenario`):
 * each setting in words, the requirement that decides it
 * (`parameters.rules`), a link to this Scenario with these settings to paste
 * beside a staging report, and the journeys it walks. The canvas stays the
 * designer's screen. `pnpm storybook:check` holds the rules to the specs. */

type ArgType = {
  name?: string;
  description?: string;
  control?: { labels?: Record<string, string> } | string | false;
  table?: { disable?: boolean };
  if?: { arg: string; eq?: unknown; neq?: unknown; truthy?: boolean };
};

/** Storybook's `if` on an argType: a setting another setting hides. */
function shown(type: ArgType, args: Record<string, unknown>) {
  const when = type.if;
  if (!when) return true;
  const value = args[when.arg];
  if ("eq" in when) return value === when.eq;
  if ("neq" in when) return value !== when.neq;
  return when.truthy === false ? !value : Boolean(value);
}

function CopyLink({ href }: { href: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <span style={{ display: "inline-flex", gap: 8, alignItems: "baseline" }}>
      <a href={href}>Link to this scenario</a>
      <button
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(href);
            setCopied(true);
          } catch {
            setCopied(false);
          }
        }}
        style={{ font: "inherit", cursor: "pointer" }}
        type="button"
      >
        {copied ? "Copied" : "Copy link"}
      </button>
    </span>
  );
}

const listStyle = { margin: "4px 0 12px", paddingLeft: 18 } as const;

function Given() {
  const api = useStorybookApi();
  const { storyId } = useStorybookState();
  const [args] = useArgs();
  const argTypes = useArgTypes() as Record<string, ArgType>;
  const rules = useParameter<Record<string, string>>("rules", {});
  const [sent, setSent] = useState<GivenJourneys | null>(null);
  useChannel({
    [GIVEN_JOURNEYS]: (payload: GivenJourneys) => setSent(payload),
  });

  if (!api.getCurrentStoryData()?.tags?.includes("scenario"))
    return (
      <p style={{ padding: 16 }}>
        Given lists a Scenario's settings. This story is not one.
      </p>
    );

  const settings = Object.entries(argTypes)
    .filter(
      ([key, type]) => key in args && !type.table?.disable && shown(type, args),
    )
    .map(([key, type]) => {
      const raw = String(args[key]);
      const labels =
        typeof type.control === "object" && type.control
          ? type.control.labels
          : undefined;
      return {
        key,
        name: type.name ?? key,
        value: labels?.[raw] ?? raw,
        description: type.description,
        rule: rules[key],
      };
    });
  const encoded = settings
    .map((setting) => `${setting.key}:${String(args[setting.key])}`)
    .join(";");
  const href = `${window.location.origin}${window.location.pathname}?path=/story/${storyId}${encoded ? `&args=${encoded}` : ""}`;
  const journeys = sent?.storyId === storyId ? sent.journeys : [];

  return (
    <div style={{ font: "13px/1.5 system-ui, sans-serif", padding: 16 }}>
      <strong>Given</strong>
      <ul style={listStyle}>
        {settings.map((setting) => (
          <li key={setting.key}>
            <b>{setting.name}</b>: {setting.value}
            {setting.description ? <> - {setting.description}</> : null}
            {setting.rule ? (
              <>
                <br />
                <small>Decided by {setting.rule}</small>
              </>
            ) : null}
          </li>
        ))}
      </ul>
      <p style={{ margin: "0 0 12px" }}>
        Staging set up the same way shows what this scenario shows.{" "}
        <CopyLink href={href} />
      </p>
      {journeys.length ? (
        <>
          <strong>Walks</strong>
          <ul style={{ ...listStyle, marginBottom: 0 }}>
            {journeys.map((journey) => (
              <li key={journey.id}>
                <code>{journey.short}</code> — {journey.title}
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}

addons.register("grade10/given", () => {
  addons.add("grade10/given/panel", {
    type: types.PANEL,
    title: "Given",
    match: ({ viewMode }) => viewMode === "story",
    render: ({ active }) => (
      <AddonPanel active={Boolean(active)}>
        <Given />
      </AddonPanel>
    ),
  });
});

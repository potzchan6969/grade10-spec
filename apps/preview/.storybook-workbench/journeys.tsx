import type { Decorator } from "@storybook/react-vite";

/* A flow names the journeys it walks in `parameters.journeys`; this note
 * under the canvas says which, in the journeys' own words, so a designer
 * walking the flow reads what it must prove. `pnpm storybook:check` holds the
 * ids to the `user-journeys.md` files read here. */
const files = import.meta.glob<string>(
  [
    "../../../openspec/specs/**/user-journeys.md",
    "../../../openspec/changes/*/specs/**/user-journeys.md",
  ],
  { query: "?raw", import: "default", eager: true },
);

const titles = new Map<string, string>();
for (const text of Object.values(files))
  for (const [, id, title] of text.matchAll(
    /^###\s+([a-z0-9-]+-US-\d+):\s*(.+)$/gm,
  ))
    if (!titles.has(id)) titles.set(id, title.trim());

const shortId = (id: string) =>
  id.replace(/^(grade10-site|shared)-/, "").replace(/-(US-\d+)$/, " $1");

export const withJourneys: Decorator = (Story, context) => {
  const journeys = context.parameters.journeys as string[] | undefined;
  if (!journeys?.length || context.viewMode === "docs") return <Story />;
  return (
    <>
      <Story />
      <aside
        aria-label="Journeys this flow walks"
        style={{
          borderTop: "1px solid rgb(0 0 0 / 0.1)",
          font: "13px/1.5 system-ui, sans-serif",
          margin: "24px 0 0",
          padding: "12px 16px",
        }}
      >
        <strong>Walks</strong>
        <ul style={{ margin: "4px 0 0", paddingLeft: 18 }}>
          {journeys.map((id) => (
            <li key={id}>
              <code>{shortId(id)}</code> — {titles.get(id) ?? "unknown journey"}
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
};

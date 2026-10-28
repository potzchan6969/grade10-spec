/**
 * The `demo-planning` schema the record fixtures are written against.
 *
 * One list, in the order the store's own planning schema declares its
 * artifacts, because six suites each hand-wrote their own and the one that
 * needed an artifact the others did not grew a second literal beside it. A
 * case names the ids it is about and nothing else: `requires:` and
 * `upstream:` are written down to those ids, an artifact left out handing on
 * its own lists to whoever named it, because the schema reader refuses a list
 * naming an id the schema issues nowhere.
 */

export type DemoArtifact = {
  id: string;
  /** Absent where the real schema names none: nobody owns `specs` alone. */
  teammate?: string;
  required: boolean;
  generates: string;
  requires: string[];
  upstream: string[];
};

export const DEMO_ARTIFACTS: DemoArtifact[] = [
  {
    id: "proposal",
    teammate: "product-manager",
    required: true,
    generates: "proposal.md",
    requires: [],
    upstream: [],
  },
  {
    id: "decisions",
    teammate: "product-manager",
    required: true,
    generates: "decisions.md",
    requires: ["proposal"],
    upstream: ["proposal"],
  },
  {
    id: "user-journeys",
    teammate: "product-manager",
    required: true,
    generates: "specs/**/user-journeys.md",
    requires: ["decisions"],
    upstream: ["proposal", "decisions"],
  },
  {
    id: "ui-design",
    teammate: "designer",
    required: false,
    generates: "ui-design.md",
    requires: ["user-journeys"],
    upstream: ["proposal", "decisions", "user-journeys"],
  },
  {
    id: "tech-design",
    teammate: "engineer",
    required: false,
    generates: "tech-design.md",
    requires: ["user-journeys"],
    upstream: ["proposal", "decisions", "user-journeys"],
  },
  {
    id: "specs",
    required: true,
    generates: "specs/**/spec.md",
    requires: ["user-journeys"],
    upstream: ["proposal", "decisions", "user-journeys", "ui-design"],
  },
  {
    id: "test-cases",
    required: true,
    generates: "specs/**/feature-tcs.md",
    requires: ["user-journeys"],
    upstream: ["proposal", "decisions", "user-journeys"],
  },
  {
    id: "tasks",
    teammate: "engineer",
    required: true,
    generates: "tasks.md",
    requires: ["specs"],
    upstream: ["proposal", "decisions", "specs"],
  },
];

/**
 * The schema YAML for one case: the artifacts it names, in the list's own
 * order, each with what it requires and what it is drawn from written down to
 * the ids named.
 */
export function demoSchema(ids: string[]): string {
  const kept = new Set(ids);
  const named = DEMO_ARTIFACTS.filter((one) => kept.has(one.id));
  const lines = ["name: demo-planning", "version: 1", "artifacts:"];
  for (const artifact of named) {
    lines.push(`  - id: ${artifact.id}`);
    if (artifact.teammate) lines.push(`    teammate: ${artifact.teammate}`);
    lines.push(`    required: ${artifact.required}`);
    lines.push(`    generates: ${artifact.generates}`);
    for (const key of ["requires", "upstream"] as const) {
      lines.push(`    ${key}: [${keptOf(artifact, kept, key).join(", ")}]`);
    }
  }
  return `${lines.join("\n")}\n`;
}

/** One of an artifact's two lists, written down to the ids the case kept. An
 * id it left out stands for that artifact's own list, so an artifact drawn
 * from a design the case dropped is still drawn from what the design was. */
function keptOf(
  artifact: DemoArtifact,
  kept: Set<string>,
  key: "requires" | "upstream",
): string[] {
  const found: string[] = [];
  const walk = (list: string[]) => {
    for (const id of list) {
      if (kept.has(id)) {
        if (!found.includes(id)) found.push(id);
        continue;
      }
      const dropped = DEMO_ARTIFACTS.find((one) => one.id === id);
      if (dropped) walk(dropped[key]);
    }
  };
  walk(artifact[key]);
  return found;
}

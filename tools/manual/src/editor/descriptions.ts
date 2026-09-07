/** One line per block, for the palette and the card headers. The palette
 * lists whatever the grammar defines; a type missing here still appears. */

type BlockInfo = { label: string; hint: string };

const INFO: Record<string, BlockInfo> = {
  prose: {
    label: "Prose",
    hint: "Markdown — the narrative between everything else.",
  },
  spec: {
    label: "Spec",
    hint: "A spec's requirements, or one requirement, scenario or story.",
  },
  cases: {
    label: "Test cases",
    hint: "The capability's test suite and what it covers.",
  },
  changes: {
    label: "Changes",
    hint: "In-flight changes whose deltas touch a spec.",
  },
  figma: { label: "Figma", hint: "A titled frame that embeds on click." },
  story: { label: "Story", hint: "A Storybook story from the workbench." },
  image: { label: "Image", hint: "A picture from the manual's assets/." },
  children: {
    label: "Children",
    hint: "Cards for the pages under this directory.",
  },
  callout: {
    label: "Callout",
    hint: "A note, a decision or a warning, set apart.",
  },
  detail: {
    label: "Detail",
    hint: "Depth for one audience — collapsed, never hidden.",
  },
  flow: {
    label: "Flow",
    hint: "Steps in order: ## opens a step, # groups them into a phase.",
  },
};

export function blockLabel(type: string): string {
  return INFO[type]?.label ?? type;
}

export function blockHint(type: string): string {
  return INFO[type]?.hint ?? "No description yet.";
}

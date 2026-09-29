import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  ENDED_WORD,
  FINANCED_STAGES,
  STORAGE_STAGES,
  WIZARD_STEPS,
} from "./fixtures";
import { VaultStageRail } from "./vault-stage-rail";

const meta = {
  title: "Vault Case/VaultStageRail",
  component: VaultStageRail,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { copy: { stages: FINANCED_STAGES }, current: "signed" },
} satisfies Meta<typeof VaultStageRail>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Each stage's label and state, in order. */
function read(canvasElement: HTMLElement) {
  const steps = within(canvasElement).getAllByRole("listitem");
  return {
    steps,
    labels: steps.map((step) => step.querySelector("p")?.textContent),
    states: steps.map((step) => step.getAttribute("data-state")),
    current: within(canvasElement).getAllByRole("listitem", {
      current: "step",
    }),
  };
}

/** The financed lane at Signed: four done, Signed the one current step,
 * three to come (shared-ui-vault-case-SC-12). */
export const FinancedMid: Story = {
  play: async ({ canvasElement }) => {
    const { steps, labels, states, current } = read(canvasElement);
    expect(labels).toEqual(FINANCED_STAGES.map((stage) => stage.label));
    expect(states).toEqual([
      "completed",
      "completed",
      "completed",
      "completed",
      "progress",
      "upcoming",
      "upcoming",
      "upcoming",
    ]);
    expect(current).toEqual([steps[4]]);
  },
};

/** The storage lane's six stages, at Vault (shared-ui-vault-case-SC-13). */
export const StorageLane: Story = {
  args: { copy: { stages: STORAGE_STAGES }, current: "vault" },
  play: async ({ canvasElement }) => {
    const { steps, labels, states, current } = read(canvasElement);
    expect(labels).toEqual([
      "Request",
      "Valued",
      "Agreed",
      "Signed",
      "Vault",
      "Home",
    ]);
    expect(states).toEqual([
      "completed",
      "completed",
      "completed",
      "completed",
      "progress",
      "upcoming",
    ]);
    expect(current).toEqual([steps[4]]);
  },
};

/** The wizard's first step (shared-ui-vault-case-SC-14). */
export const WizardFirst: Story = {
  args: { copy: { stages: WIZARD_STEPS }, current: "describe" },
  play: async ({ canvasElement }) => {
    const { labels, states } = read(canvasElement);
    expect(labels).toEqual(["Describe", "Photograph", "Review"]);
    expect(states).toEqual(["progress", "upcoming", "upcoming"]);
  },
};

/** An ended case stays at its stage with the ending's word under it, and no
 * later stage reads as reached (shared-ui-vault-case-SC-15). */
export const Ended: Story = {
  args: {
    copy: { stages: FINANCED_STAGES, ended: ENDED_WORD },
    current: "offer",
  },
  play: async ({ canvasElement }) => {
    const { steps, states, current } = read(canvasElement);
    expect(current).toEqual([steps[2]]);
    expect(within(steps[2]).getByText(ENDED_WORD)).toBeInTheDocument();
    expect(states.slice(3).every((state) => state === "upcoming")).toBe(true);
    expect(
      within(canvasElement).getAllByText(ENDED_WORD, { exact: true }),
    ).toHaveLength(1);
  },
};

/** Eight stages in 320 pixels: the rail scrolls sideways, the page does not
 * (shared-ui-vault-case-SC-17). */
export const Narrow: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const list = within(canvasElement).getByRole("list");
    const rail = list.parentElement as HTMLElement;
    expect(getComputedStyle(rail).overflowX).toBe("auto");
    expect(rail.clientWidth).toBeLessThanOrEqual(320);
    expect(rail.scrollWidth).toBeGreaterThan(rail.clientWidth);
    rail.scrollLeft = rail.scrollWidth;
    expect(rail.scrollLeft).toBeGreaterThan(0);
    const home = within(canvasElement).getByText("Home");
    const { right } = home.getBoundingClientRect();
    expect(right).toBeLessThanOrEqual(rail.getBoundingClientRect().right + 1);
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
      window.innerWidth,
    );
  },
};

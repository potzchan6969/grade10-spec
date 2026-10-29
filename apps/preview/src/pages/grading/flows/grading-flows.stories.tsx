import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  type FlowArgs,
  flowParameter,
  flowScreen,
  flowStory,
  walkFlow,
} from "../../flow-screens";

/**
 * The collector's critical grading journeys, each a tree of the screens that
 * already draw its steps: the Canvas lays them out, and the Screen control
 * focuses one.
 */
const meta = {
  title: "Grading/Flows",
  parameters: { layout: "fullscreen" },
} satisfies Meta<FlowArgs>;

export default meta;
type Story = StoryObj<FlowArgs>;

const SIGN_AT_THE_COUNTER = [
  flowScreen(
    "1",
    "Sign the submission agreement",
    "agreement",
    "grading-documents-prototypes-submission-agreement--signable",
  ),
  flowScreen(
    "2",
    "Sealed copy",
    "sealed",
    "grading-documents-prototypes-submission-agreement--sealed",
  ),
  flowScreen(
    "3",
    "Sign the hand-back receipt",
    "receipt",
    "grading-documents-prototypes-hand-back-receipt--signable",
  ),
];

/** A collector signs the agreement on the shop iPad, keeps the sealed copy, and signs for the slabs. */
export const SignAtTheCounter: Story = {
  ...flowStory(SIGN_AT_THE_COUNTER),
  parameters: {
    verification: { caseId: "vc_cc48f6e5-97b8-4078-aab2-4efa14e3c20d" },
    journeys: [
      "grade10-site-grading-counter-documents-US-01",
      "grade10-site-grading-counter-documents-US-03",
      "grade10-site-grading-counter-documents-US-05",
    ],
    flow: flowParameter(SIGN_AT_THE_COUNTER),
  },
  play: ({ canvasElement }) => walkFlow(canvasElement, SIGN_AT_THE_COUNTER),
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  type FlowArgs,
  flowParameter,
  flowScreen,
  flowStory,
  walkFlow,
} from "../../flow-screens";

/**
 * The company's own pages a visitor reads without an account, as one tree of
 * the screens that already draw them: the Canvas lays them out, and the
 * Screen control focuses one.
 */
const meta = {
  title: "Site/Flows",
  parameters: { layout: "fullscreen" },
} satisfies Meta<FlowArgs>;

export default meta;
type Story = StoryObj<FlowArgs>;

const READ_THE_COMPANY_SITE = [
  flowScreen(
    "1",
    "Who is behind Grade10",
    "about",
    "site-about-screens-about--default",
  ),
  flowScreen("2", "The shows", "shows", "site-shows-screens-shows--default"),
  flowScreen(
    "3",
    "The press record",
    "press",
    "site-press-screens-press--default",
  ),
  flowScreen(
    "4",
    "Read a press release",
    "press-release",
    "site-press-screens-press-release--default",
  ),
  flowScreen(
    "5",
    "The media coverage",
    "media-coverage",
    "site-media-coverage-screens-media-coverage--default",
  ),
  flowScreen(
    "6",
    "The terms of service",
    "terms",
    "site-carried-surfaces-screens-legal--terms-of-service",
  ),
];

/** A visitor reads who Grade10 is, its shows, its press and its terms. */
export const ReadTheCompanySite: Story = {
  ...flowStory(READ_THE_COMPANY_SITE),
  parameters: {
    verification: { caseId: "vc_8068edfd-2792-40df-9d3d-123ba0954701" },
    journeys: [
      "grade10-site-site-about-US-01",
      "grade10-site-site-about-US-02",
      "grade10-site-site-shows-US-01",
      "grade10-site-site-shows-US-02",
      "grade10-site-site-press-US-01",
      "grade10-site-site-press-US-02",
      "grade10-site-site-press-US-04",
      "grade10-site-site-media-coverage-US-01",
      "grade10-site-site-navigation-US-01",
      "grade10-site-site-navigation-US-02",
      "grade10-site-site-navigation-US-08",
      "grade10-site-site-page-shell-US-01",
      "grade10-site-site-page-shell-US-04",
      "grade10-site-site-page-shell-US-05",
    ],
    flow: flowParameter(READ_THE_COMPANY_SITE),
  },
  play: ({ canvasElement }) => walkFlow(canvasElement, READ_THE_COMPANY_SITE),
};

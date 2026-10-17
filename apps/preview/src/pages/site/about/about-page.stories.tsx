import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import { ABOUT_PAGE } from "./about-content";
import { AboutPage } from "./about-page";

/**
 * The `/about` surface: production chrome around the Figma About frame —
 * the brand heading and intro, the two-column statements, and the parent
 * company panel with its milestone timeline. Copy matches the Grade10-DS-2026
 * frames verbatim.
 */
const meta = {
  title: "Site/About/Screens/About",
  component: AboutPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof AboutPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // The heading is the last of the mount-revealed blocks to finish
    // entering; once it is visible the rest of the above-fold content is too.
    const heading = canvas.getByRole("heading", {
      level: 1,
      name: ABOUT_PAGE.heading,
    });
    await waitFor(() => expect(heading).toBeVisible(), { timeout: 1500 });

    expect(canvas.getByRole("banner")).toBeVisible();
    for (const name of [
      ABOUT_PAGE.whatWeDo.heading,
      ABOUT_PAGE.whereWeAreGoing.heading,
    ]) {
      const sectionHeading = canvas.getByRole("heading", {
        level: 2,
        name,
      });
      await waitFor(() => expect(sectionHeading).toBeVisible(), {
        timeout: 1500,
      });
    }
    // The parent-company panel enters last in the staggered reveal.
    const panelHeading = canvas.getByRole("heading", {
      level: 2,
      name: ABOUT_PAGE.parentCompany.label,
    });
    await waitFor(() => expect(panelHeading).toBeVisible(), {
      timeout: 1500,
    });
    expect(canvas.getByRole("contentinfo")).toBeVisible();

    const memeStrategy = canvas.getAllByRole("link", {
      name: "MemeStrategy",
    })[0];
    expect(memeStrategy).toHaveAttribute(
      "href",
      "https://memestrategy.com.hk/",
    );
    expect(memeStrategy).toHaveAttribute("target", "_blank");
    expect(memeStrategy).toHaveAttribute("rel", "noopener noreferrer");

    const nineGag = canvas.getAllByRole("link", { name: "9GAG" })[0];
    expect(nineGag).toHaveAttribute("href", "https://9gag.com/");
    expect(nineGag).toHaveAttribute("target", "_blank");
    expect(nineGag).toHaveAttribute("rel", "noopener noreferrer");

    const vault = canvas.getByRole("link", { name: "vaulting services" });
    expect(vault).toHaveAttribute("href", "/vault");
    expect(vault).not.toHaveAttribute("target");

    const grade10Ai = canvas.getByRole("link", { name: "Grade10 AI" });
    expect(grade10Ai).toHaveAttribute("href", "https://app.grade10.com/");
    expect(grade10Ai).toHaveAttribute("target", "_blank");
    expect(grade10Ai).toHaveAttribute("rel", "noopener noreferrer");

    const finance = canvas.getByRole("link", { name: "Grade10 Finance" });
    expect(finance).toHaveAttribute("href", "/finance");
    expect(finance).not.toHaveAttribute("target");

    for (const date of ABOUT_PAGE.milestones.map(
      (milestone) => milestone.date,
    )) {
      expect(canvas.getByText(date)).toBeVisible();
    }
    expect(canvas.getByText("Coming soon")).toBeVisible();
  },
};

export const Narrow: Story = {
  globals: { viewport: { value: "mobile2" } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const heading = canvas.getByRole("heading", {
      level: 1,
      name: ABOUT_PAGE.heading,
    });
    await waitFor(() => expect(heading).toBeVisible(), { timeout: 1500 });
    expect(canvas.getByRole("contentinfo")).toBeVisible();
  },
};

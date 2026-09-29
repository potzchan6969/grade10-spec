import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { PRIVACY_DOCUMENT, TERMS_DOCUMENT } from "./legal-content";
import { LegalPage } from "./legal-page";

/**
 * Terms of Service and Privacy Policy as the site assembles them: chrome,
 * the catalog’s last-updated line and sections, and footer. Words come from
 * `@grade10/i18n` English — the same catalogs the application pages read.
 */
const meta = {
  title: "Pages/Legal",
  component: LegalPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof LegalPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TermsOfService: Story = {
  args: { surface: "terms" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", {
        level: 2,
        name: TERMS_DOCUMENT.title,
      }),
    ).toBeVisible();
    expect(
      canvas.getByText(
        `${TERMS_DOCUMENT.lastUpdatedLabel} ${TERMS_DOCUMENT.lastUpdatedDate}`,
      ),
    ).toBeVisible();
    expect(
      canvas.getByRole("heading", {
        level: 3,
        name: TERMS_DOCUMENT.sections[0].heading,
      }),
    ).toBeVisible();
    expect(
      canvas.getByRole("link", { name: "Terms of Service" }),
    ).toHaveAttribute("href", "?path=/story/pages-legal--terms-of-service");
  },
};

export const PrivacyPolicy: Story = {
  args: { surface: "privacy" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", {
        level: 2,
        name: PRIVACY_DOCUMENT.title,
      }),
    ).toBeVisible();
    expect(
      canvas.getByText(
        `${PRIVACY_DOCUMENT.lastUpdatedLabel} ${PRIVACY_DOCUMENT.lastUpdatedDate}`,
      ),
    ).toBeVisible();
    expect(
      canvas.getByRole("heading", {
        level: 3,
        name: PRIVACY_DOCUMENT.sections[0].heading,
      }),
    ).toBeVisible();
    expect(
      canvas.getByRole("link", { name: "Privacy Policy" }),
    ).toHaveAttribute("href", "?path=/story/pages-legal--privacy-policy");
  },
};

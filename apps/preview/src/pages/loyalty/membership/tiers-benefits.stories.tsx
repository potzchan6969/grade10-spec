import {
  BreadcrumbItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@grade10/design-system/components/display/breadcrumbs";
import { Footer } from "@grade10/design-system/components/layout/footer";
import { SiteHeader, TierInfoCard, TierLadder } from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { STORE_FOOTER, STORE_SITE_HEADER } from "../../store-content";
import { storyHref } from "../../workbench-story-nav";
import {
  MEMBERSHIP_VIEW,
  TIER_BENEFITS,
  TIER_BENEFITS_PAGE_COPY,
  TIER_LADDER_COPY,
} from "../loyalty-content";

const MEMBERSHIP_STORY_ID = "loyalty-membership-screens-membership--default";

/**
 * Tiers & Benefits as its own page — what a small viewport navigates to from
 * the tier card. The same list becomes a Membership section on wide
 * viewports; "How points work" joins it once that part is designed. The page
 * reads the member's held tier and marks it on the ladder and its card; the
 * blocks only receive them as props.
 */
function TiersBenefitsPage({ heldTier }: { heldTier: string }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <SiteHeader {...STORE_SITE_HEADER} />
      <main className="flex w-full flex-1 justify-center">
        <div className="flex w-full max-w-4xl flex-col gap-10 px-4 py-10 sm:px-8">
          <Breadcrumbs>
            <BreadcrumbItem href="#account">
              {TIER_BENEFITS_PAGE_COPY.breadcrumbAccount}
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem href={storyHref(MEMBERSHIP_STORY_ID)}>
              {TIER_BENEFITS_PAGE_COPY.breadcrumbMembership}
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem current>
              {TIER_BENEFITS_PAGE_COPY.title}
            </BreadcrumbItem>
          </Breadcrumbs>
          <h1 className="text-3xl font-bold text-foreground">
            {TIER_BENEFITS_PAGE_COPY.title}
          </h1>
          <section
            aria-label={TIER_BENEFITS_PAGE_COPY.title}
            className="flex flex-col gap-10"
          >
            <TierLadder
              copy={TIER_LADDER_COPY}
              currentTier={heldTier}
              qualifyingPoints={MEMBERSHIP_VIEW.qualifyingPoints}
              qualifyingTarget={MEMBERSHIP_VIEW.qualifyingThreshold}
              rungs={TIER_BENEFITS}
            />
            <div className="flex flex-col gap-4 sm:flex-row">
              {TIER_BENEFITS.map((row) => (
                <TierInfoCard
                  benefits={[...row.benefits]}
                  caption={row.caption}
                  currentTier={row.tier === heldTier}
                  key={row.id}
                  tier={row.tier}
                />
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer {...STORE_FOOTER} />
    </div>
  );
}

const meta = {
  title: "Loyalty/Membership/Screens/Tiers & Benefits",
  component: TiersBenefitsPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: { heldTier: MEMBERSHIP_VIEW.tier },
} satisfies Meta<typeof TiersBenefitsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** All three rungs; the member's Gold card and rung wear the highlight. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 1, name: "Tiers & Benefits" }),
    ).toBeInTheDocument();
    const cards = canvasElement.querySelectorAll(
      '[data-slot="tier-info-card"]',
    );
    expect(cards).toHaveLength(3);
    for (const [index, tier] of ["Silver", "Gold", "Black"].entries()) {
      expect(within(cards[index]).getByText(tier)).toBeInTheDocument();
    }
    expect(cards[1]).toHaveClass("border-primary-border");
    expect(cards[0]).toHaveClass("border-border");
    expect(cards[2]).toHaveClass("border-border");
    expect(
      canvas.getByText("1.7 pt for every HK$10 spent"),
    ).toBeInTheDocument();
    expect(canvas.getByText("320")).toBeInTheDocument();
  },
};

/** A Silver member: the entry rung is the one highlighted. */
export const SilverHeld: Story = {
  args: { heldTier: "Silver" },
  play: async ({ canvasElement }) => {
    const cards = canvasElement.querySelectorAll(
      '[data-slot="tier-info-card"]',
    );
    expect(cards[0]).toHaveClass("border-primary-border");
    expect(cards[1]).toHaveClass("border-border");
  },
};

/** The standalone page at a phone width: the rungs stack. */
export const Narrow: Story = {
  globals: { viewport: { value: "mobile1" } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 1, name: "Tiers & Benefits" }),
    ).toBeInTheDocument();
    expect(
      canvasElement.querySelectorAll('[data-slot="tier-info-card"]'),
    ).toHaveLength(3);
  },
};

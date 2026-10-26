import {
  BreadcrumbItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@grade10/design-system/components/display/breadcrumbs";
import { Footer } from "@grade10/design-system/components/layout/footer";
import {
  ActivityList,
  type ActivityEntry,
  type ActivityTotals,
  type AsyncState,
  SiteHeader,
} from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { STORE_FOOTER, STORE_SITE_HEADER } from "../../store-content";
import {
  ACTIVITY,
  ACTIVITY_LIST_COPY,
  ACTIVITY_SUMMARY,
} from "../loyalty-content";

const PAGE_COPY = {
  breadcrumbAccount: "Account",
  breadcrumbMembership: "Membership",
  title: "Point History",
};

type PointHistoryView = {
  activity: AsyncState<readonly ActivityEntry[]>;
  summary: ActivityTotals;
};

/**
 * Point History as a store assembles it: `SiteHeader`, the page's own
 * heading and breadcrumbs, `ActivityList`, and `Footer`. The page owns the
 * ledger and its totals; the block only receives them as props.
 */
function PointHistoryPage({ view }: { view: PointHistoryView }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <SiteHeader {...STORE_SITE_HEADER} />
      <main className="flex w-full flex-1 justify-center">
        <div className="flex w-full max-w-4xl flex-col gap-6 px-4 py-10 sm:px-8">
          <Breadcrumbs>
            <BreadcrumbItem href="#account">
              {PAGE_COPY.breadcrumbAccount}
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem href="#membership">
              {PAGE_COPY.breadcrumbMembership}
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem current>{PAGE_COPY.title}</BreadcrumbItem>
          </Breadcrumbs>
          <h1 className="text-3xl font-bold text-foreground">
            {PAGE_COPY.title}
          </h1>
          <ActivityList
            copy={ACTIVITY_LIST_COPY}
            state={view.activity}
            summary={view.summary}
          />
        </div>
      </main>
      <Footer {...STORE_FOOTER} />
    </div>
  );
}

const meta = {
  title: "Loyalty/Points/Screens/Point History",
  component: PointHistoryPage,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    journeys: ["grade10-site-loyalty-programme-US-04"],
  },
  args: {
    view: { activity: { status: "ready", data: ACTIVITY }, summary: ACTIVITY_SUMMARY },
  },
} satisfies Meta<typeof PointHistoryPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The whole ledger: totals, tabs, what is on the way, then the months. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 1, name: "Point History" }),
    ).toBeInTheDocument();
    expect(canvas.getByText("+440")).toBeInTheDocument();
    expect(canvas.getByText("October 2026")).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("tab", { name: "Used" }));
    expect(canvas.queryByText("Points adjusted")).not.toBeInTheDocument();
    expect(canvas.getByText("Redeemed HK$50 off")).toBeInTheDocument();
  },
};

/** Nothing earned yet: the totals read zero and the list says so. */
export const NoActivity: Story = {
  args: {
    view: {
      activity: {
        status: "empty",
        message: "No activity yet. Purchases appear here once they are recorded.",
      },
      summary: { earned: 0, used: 0, pending: 0 },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText(
        "No activity yet. Purchases appear here once they are recorded.",
      ),
    ).toBeInTheDocument();
  },
};

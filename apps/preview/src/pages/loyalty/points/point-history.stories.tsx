import {
  BreadcrumbItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@grade10/design-system/components/display/breadcrumbs";
import { Footer } from "@grade10/design-system/components/layout/footer";
import {
  PointHistory,
  type LedgerEntry,
  type PointsTotals,
  type AsyncState,
  SiteHeader,
} from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { STORE_FOOTER, STORE_SITE_HEADER } from "../../store-content";
import {
  LEDGER_ENTRIES,
  POINT_HISTORY_COPY,
  POINTS_TOTALS,
} from "../loyalty-content";

const PAGE_COPY = {
  breadcrumbAccount: "Account",
  breadcrumbMembership: "Membership",
  title: "Point History",
};

type PointHistoryView = {
  ledger: AsyncState<readonly LedgerEntry[]>;
  summary: PointsTotals;
};

/**
 * Point History as a store assembles it: `SiteHeader`, the page's own
 * heading and breadcrumbs, `PointHistory`, and `Footer`. The page owns the
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
          <PointHistory
            copy={POINT_HISTORY_COPY}
            state={view.ledger}
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
  parameters: { layout: "fullscreen" },
  args: {
    view: { ledger: { status: "ready", data: LEDGER_ENTRIES }, summary: POINTS_TOTALS },
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
    expect(canvas.getByText("440 pts")).toBeInTheDocument();
    expect(canvas.getByText("October 2026")).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("tab", { name: "Used" }));
    expect(canvas.queryByText("Points adjusted")).not.toBeInTheDocument();
    expect(canvas.getByText("Redeemed HK$50 off")).toBeInTheDocument();
  },
};

/** Nothing earned yet: the totals read zero and the list says so. */
export const Empty: Story = {
  args: {
    view: {
      ledger: {
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

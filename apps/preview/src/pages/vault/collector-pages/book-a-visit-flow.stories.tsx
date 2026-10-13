import type { Meta, StoryObj } from "@storybook/react-vite";
import { FlowContainer } from "../../../../../../packages/ui/src/blocks/shared/flow-container";
import {
  BookVisitBody,
  type BookVisitState,
} from "../../../prototypes/vault/collector-pages/book-visit-prototype";
import { walkFlowCases } from "../../vault-shared";

const BOOK_CASES: readonly (readonly [string, BookVisitState])[] = [
  ["Choose a shop", "shop"],
  ["Pick a time", "times"],
  ["Visit booked", "booked"],
];

function BookAVisitFlow() {
  return (
    <FlowContainer
      cases={BOOK_CASES}
      description={
        <p>
          The collector picks the shop, then a time on the shop’s clock, and
          gets a booked visit with the calendar file and what to bring.
        </p>
      }
    >
      {(state, title) => <BookVisitBody key={title} state={state} />}
    </FlowContainer>
  );
}

const meta = {
  title: "Vault/Collector Pages/Flows/Book A Visit",
  parameters: {
    layout: "fullscreen",
    journeys: [
      "grade10-site-vault-visit-booking-US-01",
      "grade10-site-vault-visit-booking-US-04",
    ],
  },
  render: () => <BookAVisitFlow />,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await walkFlowCases(canvasElement, [
      "Choose a shop",
      "Pick a time",
      "Visit booked",
    ]);
  },
};

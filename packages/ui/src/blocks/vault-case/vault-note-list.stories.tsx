import { Link } from "@grade10/design-system/components/forms/link";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  BEFORE_FINANCED,
  BEFORE_STORAGE,
  IN_PERSON_LINE,
  VERIFY_HREF,
  VERIFY_LABEL,
} from "./fixtures";
import { VaultNoteList } from "./vault-note-list";

const meta = {
  title: "Vault Case/VaultNoteList",
  component: VaultNoteList,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { notes: BEFORE_STORAGE },
} satisfies Meta<typeof VaultNoteList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Each line's bottom hairline, in order: true where a divider is drawn. */
function dividers(canvasElement: HTMLElement): boolean[] {
  return within(canvasElement)
    .getAllByRole("listitem")
    .map((item) => getComputedStyle(item).borderBottomWidth !== "0px");
}

/** Before you come on the storage lane: its last line carries no divider
 * (shared-ui-vault-case-SC-09). */
export const BeforeYouComeStorage: Story = {
  play: async ({ canvasElement }) => {
    const items = within(canvasElement).getAllByRole("listitem");
    expect(items.map((item) => item.textContent)).toEqual(
      BEFORE_STORAGE.map((note) => note.content),
    );
    expect(dividers(canvasElement)).toEqual([true, true, false]);
  },
};

/** Before you come on the financed lane: the third line keeps its divider
 * above the fourth (shared-ui-vault-case-SC-09). */
export const BeforeYouComeFinanced: Story = {
  args: { notes: BEFORE_FINANCED },
  play: async ({ canvasElement }) => {
    const items = within(canvasElement).getAllByRole("listitem");
    expect(items.map((item) => item.textContent)).toEqual(
      BEFORE_FINANCED.map((note) => note.content),
    );
    expect(dividers(canvasElement)).toEqual([true, true, true, false]);
  },
};

/** One line, no divider (shared-ui-vault-case-SC-09). */
export const One: Story = {
  args: { notes: BEFORE_STORAGE.slice(0, 1) },
  play: async ({ canvasElement }) => {
    expect(dividers(canvasElement)).toEqual([false]);
  },
};

/** A line holding a link keeps it (shared-ui-vault-case-SC-10). */
export const WithLinkItem: Story = {
  args: {
    notes: [
      {
        id: "verify",
        content: (
          <>
            <Link href={VERIFY_HREF}>{VERIFY_LABEL}</Link> {IN_PERSON_LINE}
          </>
        ),
      },
      ...BEFORE_STORAGE.slice(1),
    ],
  },
  play: async ({ canvasElement }) => {
    const [first] = within(canvasElement).getAllByRole("listitem");
    const link = within(first).getByRole("link", { name: VERIFY_LABEL });
    expect(link).toHaveAttribute("href", VERIFY_HREF);
    expect(first).toHaveTextContent(`${VERIFY_LABEL} ${IN_PERSON_LINE}`);
  },
};

/** No lines draws nothing (shared-ui-vault-case-SC-11). */
export const Empty: Story = {
  args: { notes: [] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByRole("list")).toBeNull();
    expect(canvas.queryByRole("listitem")).toBeNull();
  },
};

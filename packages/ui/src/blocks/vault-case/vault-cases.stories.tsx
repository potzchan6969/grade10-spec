import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { BOARD_CASES, CASE_CARDS, CASES_COPY } from "./fixtures";
import { VaultCases, type VaultCasesCard } from "./vault-cases";

const meta = {
  title: "Vault Case/VaultCases",
  component: VaultCases,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: CASES_COPY,
    cases: BOARD_CASES,
    onOpen: fn(),
    onStartRequest: fn(),
  },
} satisfies Meta<typeof VaultCases>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Whether `a` comes before `b` in the document. */
const before = (a: Node, b: Node) =>
  Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);

const expectInOrder = (nodes: readonly Node[]) => {
  for (let at = 1; at < nodes.length; at++) {
    expect(before(nodes[at - 1], nodes[at])).toBe(true);
  }
};

const cardOf = (canvasElement: HTMLElement, card: VaultCasesCard) => {
  const found = within(canvasElement)
    .getByRole("button", { name: card.title })
    .closest<HTMLElement>("[data-slot='card']");
  if (!found) throw new Error(`no card for ${card.title}`);
  return found;
};

/** Clicks whatever a pointer at the middle of `target` lands on, as a
 * collector's tap does. */
const tapOn = async (target: HTMLElement) => {
  const { left, top, width, height } = target.getBoundingClientRect();
  const hit = document.elementFromPoint(left + width / 2, top + height / 2);
  if (!(hit instanceof HTMLElement)) throw new Error("nothing under the tap");
  await userEvent.click(hit);
};

const part = (card: HTMLElement, slot: string) =>
  card.querySelector(`[data-slot='${slot}']`);

const one = (card: VaultCasesCard): Partial<Story["args"]> => ({
  cases: [card],
});

/** The home reads in order, counts its cases and reports the start
 * (shared-ui-vault-case-SC-24); a card opens from its facts line with its
 * own id (shared-ui-vault-case-SC-25). */
export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const start = canvas.getByRole("button", { name: CASES_COPY.start });
    const heading = canvas.getByRole("heading", {
      name: `${CASES_COPY.yourCases} ${BOARD_CASES.length}`,
    });
    expectInOrder([
      start,
      heading,
      ...BOARD_CASES.map((card) => cardOf(canvasElement, card)),
      canvas.getByRole("note"),
    ]);
    expect(canvas.getByRole("note")).toHaveTextContent(CASES_COPY.severalItems);

    await userEvent.click(start);
    expect(args.onStartRequest).toHaveBeenCalledTimes(1);

    const second = BOARD_CASES[1];
    const secondCard = within(cardOf(canvasElement, second));
    for (const text of [
      second.reference,
      second.status.label,
      second.owner.label,
    ]) {
      await tapOn(secondCard.getByText(text));
    }
    expect(args.onOpen).toHaveBeenCalledTimes(3);
    for (const call of [1, 2, 3]) {
      expect(args.onOpen).toHaveBeenNthCalledWith(call, second.id);
    }
  },
};

export const OfferWaiting: Story = { args: one(CASE_CARDS.offerWaiting) };

const EVERY_PART: VaultCasesCard = {
  ...CASE_CARDS.offerWaiting,
  id: "case-every-part",
  note: CASE_CARDS.ended.note,
};

/** Every part a card is given reads in order, the facts as one sentence, the
 * control named by the item and described by the reference
 * (shared-ui-vault-case-SC-26). */
export const EveryPart: Story = {
  args: one(EVERY_PART),
  play: async ({ canvasElement }) => {
    const card = cardOf(canvasElement, EVERY_PART);
    const shown = within(card);
    const control = shown.getByRole("button", { name: EVERY_PART.title });
    expect(control).toHaveAccessibleDescription(EVERY_PART.reference);
    const reference = shown.getByText(EVERY_PART.reference);
    expect(reference.parentElement).toHaveTextContent(
      [...EVERY_PART.facts, EVERY_PART.reference].join(" · "),
    );
    for (const slot of [
      "vault-case-next",
      "vault-case-visit",
      "vault-case-note",
    ]) {
      expect(part(card, slot)).not.toBeNull();
    }
    expectInOrder([
      control,
      shown.getByText(EVERY_PART.status.label),
      shown.getByText(EVERY_PART.owner.label),
      ...EVERY_PART.facts.map((fact) => shown.getByText(fact)),
      reference,
      shown.getByText(EVERY_PART.next?.label ?? ""),
      shown.getByText(EVERY_PART.visit ?? ""),
      shown.getByText(EVERY_PART.note ?? ""),
    ]);
  },
};

/** A card opens from the keyboard too, once per press, each time
 * (shared-ui-vault-case-SC-28). */
export const OpenedFromTheKeyboard: Story = {
  args: one(CASE_CARDS.offerWaiting),
  play: async ({ args, canvasElement }) => {
    const control = within(canvasElement).getByRole("button", {
      name: CASE_CARDS.offerWaiting.title,
    });
    await userEvent.tab();
    await userEvent.tab();
    expect(control).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(args.onOpen).toHaveBeenCalledTimes(1);
    await userEvent.keyboard("{Enter}");
    expect(args.onOpen).toHaveBeenCalledTimes(2);
    expect(args.onOpen).toHaveBeenNthCalledWith(2, CASE_CARDS.offerWaiting.id);
  },
};

export const VisitBooked: Story = { args: one(CASE_CARDS.visitBooked) };

export const TermsAgreedWithAVisit: Story = {
  args: one(CASE_CARDS.termsAgreed),
};

/** No next step, calendar line or note where none is given
 * (shared-ui-vault-case-SC-27). */
export const InTheVault: Story = {
  args: one(CASE_CARDS.inTheVault),
  play: async ({ canvasElement }) => {
    const card = cardOf(canvasElement, CASE_CARDS.inTheVault);
    expect(
      within(card).getByText(CASE_CARDS.inTheVault.reference),
    ).toBeVisible();
    for (const slot of [
      "vault-case-next",
      "vault-case-visit",
      "vault-case-note",
    ]) {
      expect(part(card, slot)).toBeNull();
    }
  },
};

export const LoanRunning: Story = { args: one(CASE_CARDS.loanRunning) };

export const PastDue: Story = { args: one(CASE_CARDS.pastDue) };

export const Repaid: Story = { args: one(CASE_CARDS.repaid) };

export const BackWithYou: Story = { args: one(CASE_CARDS.backWithYou) };

export const Draft: Story = { args: one(CASE_CARDS.draft) };

export const WalkInDraft: Story = { args: one(CASE_CARDS.walkInDraft) };

/** The reason staff gave reads last, with no next step
 * (shared-ui-vault-case-SC-26). */
export const Ended: Story = {
  args: one(CASE_CARDS.ended),
  play: async ({ canvasElement }) => {
    const card = cardOf(canvasElement, CASE_CARDS.ended);
    const note = within(card).getByText(CASE_CARDS.ended.note);
    expect(
      before(within(card).getByText(CASE_CARDS.ended.reference), note),
    ).toBe(true);
    expect(part(card, "vault-case-next")).toBeNull();
  },
};

/** Two untitled cards stay apart by their references. */
export const UntitledItem: Story = {
  args: {
    cases: [
      CASE_CARDS.untitled,
      { ...CASE_CARDS.untitled, id: "case-untitled-2", reference: "N8YT2C" },
    ],
  },
  play: async ({ canvasElement }) => {
    const controls = within(canvasElement).getAllByRole("button", {
      name: CASE_CARDS.untitled.title,
    });
    expect(controls[0]).toHaveAccessibleDescription(
      CASE_CARDS.untitled.reference,
    );
    expect(controls[1]).toHaveAccessibleDescription("N8YT2C");
  },
};

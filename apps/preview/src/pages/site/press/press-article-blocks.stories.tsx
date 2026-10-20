import {
  type ArticleBlock,
  PressArticleBlock,
  pressArticleBlockKey,
} from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

const DEMO_BLOCKS: readonly ArticleBlock[] = [
  {
    type: "paragraph",
    segments: [
      { text: "A paragraph with " },
      { text: "bold text", bold: true },
      { text: ", an " },
      {
        text: "inline link",
        link: { href: "/press-releases" },
      },
      {
        text: ", and an ",
      },
      {
        text: "external link",
        link: { href: "https://memestrategy.com.hk/", external: true },
      },
      {
        text: " running inside it, wrapping across the line the way an editor's copy does.",
      },
    ],
  },
  { type: "heading", level: 2, text: "Heading 2" },
  { type: "heading", level: 3, text: "Heading 3" },
  { type: "heading", level: 4, text: "Heading 4" },
  { type: "heading", level: 5, text: "Heading 5" },
  { type: "heading", level: 6, text: "Heading 6" },
  {
    type: "list",
    items: [
      [
        { text: "Bullet List Title. ", bold: true },
        { text: "A bullet item's body runs after its bold lead-in." },
      ],
      [{ text: "A bullet item with no lead-in." }],
    ],
  },
  {
    type: "list",
    ordered: true,
    items: [
      [
        { text: "Numbered List Title. ", bold: true },
        { text: "A numbered item's body runs after its bold lead-in." },
      ],
      [{ text: "A second numbered item." }],
    ],
  },
  {
    type: "quote",
    segments: [
      {
        text: "A pull quote carries the speaker's words at body size beside the template's primary-colored rule.",
      },
    ],
    cite: { name: "Hanru Tang", role: "Founder of POKECOLOR and CARDJOY" },
  },
  {
    type: "figure",
    figure: {
      src: "https://cdn.sanity.io/images/np3rrxhs/production/1a08984fb2cdaaf4afd5530186fc3848330bcada-611x407.jpg?w=1600&fit=max&auto=format",
      alt: "Rare cards on display at the JOYCon exhibition zone.",
    },
  },
  {
    type: "figure",
    figure: {
      src: "https://cdn.sanity.io/images/np3rrxhs/production/f9befa8c2fdac033f0bb82d85097b0cd3fc6ebfd-621x413.jpg?w=1600&fit=max&auto=format",
      alt: "The 1998 Pokémon Illustrator card at the JOYCon exhibition.",
      caption:
        "An image may carry a caption; the same figure without one renders nothing below the image.",
    },
  },
  {
    type: "gallery",
    figures: [
      {
        span: "full",
        src: "https://cdn.sanity.io/images/np3rrxhs/production/a27f1f043225cd01f870a64c56d46dcd8335bcd3-611x458.jpg?w=1600&fit=max&auto=format",
        alt: "The packed CARDJOY x Grade10 Guangzhou show floor.",
        caption: "A full-width figure takes the whole row.",
      },
      {
        span: "half",
        src: "https://cdn.sanity.io/images/np3rrxhs/production/1a08984fb2cdaaf4afd5530186fc3848330bcada-611x407.jpg?w=800&fit=max&auto=format",
        alt: "Rare cards on display at the JOYCon exhibition zone.",
        caption: "A half-width figure shares the row.",
      },
      {
        span: "half",
        src: "https://cdn.sanity.io/images/np3rrxhs/production/f9befa8c2fdac033f0bb82d85097b0cd3fc6ebfd-621x413.jpg?w=800&fit=max&auto=format",
        alt: "The 1998 Pokémon Illustrator card at the JOYCon exhibition.",
        caption: "Its pair takes the other half.",
      },
    ],
  },
];

/**
 * Every element the `/press-releases/{slug}` template gives an editor —
 * paragraph runs, the five body heading levels, both list styles, the
 * pull quote, and figures with or without captions — at the article
 * column's width.
 */
function ArticleBlocks() {
  return (
    <div className="mx-auto flex w-full max-w-[780px] flex-col gap-4 bg-background p-8 text-foreground">
      {DEMO_BLOCKS.map((block) => (
        <PressArticleBlock block={block} key={pressArticleBlockKey(block)} />
      ))}
    </div>
  );
}

const meta = {
  title: "Site/Press/Parts/ArticleBlocks",
  component: ArticleBlocks,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ArticleBlocks>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const level of [2, 3, 4, 5, 6] as const) {
      expect(
        canvas.getByRole("heading", {
          level,
          name: `Heading ${level}`,
        }),
      ).toBeVisible();
    }
    expect(canvas.getByRole("blockquote")).toBeVisible();
    expect(canvas.getAllByRole("list")).toHaveLength(2);
    expect(
      canvas.getByRole("link", { name: "inline link" }),
    ).toBeInTheDocument();
  },
};

export const Narrow: Story = {
  globals: { viewport: { value: "mobile2" } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 2, name: "Heading 2" }),
    ).toBeVisible();
  },
};

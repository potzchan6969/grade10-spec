import { describe, expect, it } from "vitest";
import {
  GrammarError,
  type PageAst,
  parsePage,
  serializePage,
} from "../src/content/grammar";

const fm = "---\ntitle: Page\n---\n";

const canonical: { name: string; text: string }[] = [
  { name: "frontmatter only", text: fm },
  {
    name: "full frontmatter",
    text: "---\ntitle: Loyalty\nsummary: Points a shopper earns and spends.\nspec: grade10-store/loyalty\naudience: operator\norder: 2\n---\n",
  },
  { name: "one prose block", text: `${fm}\nOne paragraph.\n` },
  {
    name: "prose keeps interior blank lines",
    text: `${fm}\nFirst.\n\n## Heading\n\nSecond.\n`,
  },
  {
    name: "leaf directives",
    text: `${fm}\n::spec{id="grade10-store/loyalty"}\n\n::spec{id="grade10-store/loyalty" scenario="loyalty-SC-04"}\n\n::cases{id="grade10-store/loyalty"}\n\n::changes{spec="grade10-store/loyalty"}\n\n::figma{url="https://www.figma.com/design/x?node-id=1-2" title="Checkout"}\n\n::story{id="blocks-store-cart--default"}\n\n::story{id="blocks-store-cart--default" title="Cart" height="640"}\n\n::image{src="assets/till.png" alt="The till screen" caption="Till"}\n\n::children\n`,
  },
  {
    name: "containers with markdown and leaves",
    text: `${fm}\n:::callout{kind="decision"}\nWe hold funds, we never charge early.\n:::\n\n:::detail{title="Ledger shape" for="engineer"}\nAppend-only rows.\n\n::image{src="assets/ledger.png" alt="Ledger diagram"}\n:::\n\n:::flow{title="Checkout" diagram="assets/checkout.svg"}\n# In the browser\n\n## Shopper pays\n\nThe hold is placed.\n\n# After the money\n\n## Order settles\n\nPoints accrue.\n:::\n`,
  },
  {
    name: "empty container",
    text: `${fm}\n:::callout{kind="note"}\n:::\n`,
  },
  {
    name: "signed warning callout",
    text: `${fm}\n:::callout{kind="warning" author="@echo" date="2026-08-30"}\nWhat ships and what the spec says have parted company here.\n:::\n`,
  },
  {
    name: "fence hides directives",
    text: `${fm}\nThe grammar looks like:\n\n\`\`\`css\n::before { content: ""; }\n:::callout{kind="note"}\n\`\`\`\n`,
  },
  {
    name: "fence inside container",
    text: `${fm}\n:::detail{title="Styling"}\n\`\`\`\n:::\n\`\`\`\n:::\n`,
  },
];

describe("canonical texts are fixed points", () => {
  for (const { name, text } of canonical) {
    it(name, () => {
      expect(serializePage(parsePage(text))).toBe(text);
    });
  }
});

describe("parse(serialize(ast)) equals ast", () => {
  for (const { name, text } of canonical) {
    it(name, () => {
      const ast = parsePage(text);
      expect(parsePage(serializePage(ast))).toEqual(ast);
    });
  }
});

const normalizations: { name: string; input: string; output: string }[] = [
  {
    name: "blank lines collapse to one between blocks",
    input: `${fm}\n\n\nProse.\n\n\n\n::children\n\n\n`,
    output: `${fm}\nProse.\n\n::children\n`,
  },
  {
    name: "whitespace-only prose between directives is dropped",
    input: `${fm}\n::children\n   \n\t\n::children\n`,
    output: `${fm}\n::children\n\n::children\n`,
  },
  {
    name: "default order is omitted",
    input: `${fm}`,
    output: fm,
  },
  {
    name: "empty attribute braces are omitted",
    input: `${fm}\n::children{}\n`,
    output: `${fm}\n::children\n`,
  },
  {
    name: "attribute order is canonical",
    input: `${fm}\n::figma{title="Checkout" url="https://x"}\n`,
    output: `${fm}\n::figma{url="https://x" title="Checkout"}\n`,
  },
  {
    name: "trailing spaces on interior prose lines survive",
    input: `${fm}\nA hard break  \nstays.\n`,
    output: `${fm}\nA hard break  \nstays.\n`,
  },
  {
    name: "missing trailing newline is added",
    input: `${fm}\nProse.`,
    output: `${fm}\nProse.\n`,
  },
];

describe("near-canonical input normalizes", () => {
  for (const { name, input, output } of normalizations) {
    it(name, () => {
      expect(serializePage(parsePage(input))).toBe(output);
    });
  }
});

const errors: { name: string; input: string; message: RegExp }[] = [
  { name: "no frontmatter", input: "Prose.\n", message: /must start with/ },
  {
    name: "CRLF line endings",
    input: "---\r\ntitle: X\r\n---\r\n",
    message: /CRLF/,
  },
  {
    name: "unclosed frontmatter",
    input: "---\ntitle: X\n",
    message: /unclosed frontmatter/,
  },
  {
    name: "missing title",
    input: "---\nsummary: X\n---\n",
    message: /`title`/,
  },
  {
    name: "unknown frontmatter key is never silently dropped",
    input: "---\ntitle: X\nowner: me\n---\n",
    message: /unknown frontmatter key/,
  },
  {
    name: "non-integer order",
    input: "---\ntitle: X\norder: 1.5\n---\n",
    message: /integer/,
  },
  {
    name: "audience outside the one word it can be",
    input: "---\ntitle: X\naudience: designer\n---\n",
    message: /`audience` must be `operator`/,
  },
  {
    name: "unknown directive",
    input: `${fm}\n::mystery\n`,
    message: /unknown directive/,
  },
  {
    name: "leaf written as container",
    input: `${fm}\n:::spec{id="a/b"}\n:::\n`,
    message: /must be written as/,
  },
  {
    name: "container written as leaf",
    input: `${fm}\n::callout{kind="note"}\n`,
    message: /must be written as/,
  },
  {
    name: "quote inside attribute value",
    input: `${fm}\n::figma{url="https://x" title="The "buy box""}\n`,
    message: /cannot appear inside a value/,
  },
  {
    name: "missing required attribute",
    input: `${fm}\n::spec\n`,
    message: /needs `id`/,
  },
  {
    name: "unknown attribute",
    input: `${fm}\n::children{id="x"}\n`,
    message: /no attribute/,
  },
  {
    name: "duplicate attribute",
    input: `${fm}\n::spec{id="a/b" id="a/b"}\n`,
    message: /duplicate/,
  },
  {
    name: "two spec selectors",
    input: `${fm}\n::spec{id="a/b" requirement="R" scenario="b-SC-01"}\n`,
    message: /only one of/,
  },
  {
    name: "empty image alt",
    input: `${fm}\n::image{src="assets/x.png" alt="  "}\n`,
    message: /alt must not be empty/,
  },
  {
    name: "bad callout kind",
    input: `${fm}\n:::callout{kind="info"}\n:::\n`,
    message: /one of note, decision, warning/,
  },
  {
    name: "bad detail audience",
    input: `${fm}\n:::detail{title="X" for="cfo"}\n:::\n`,
    message: /one of pm, designer, qa, engineer, operator/,
  },
  {
    name: "callout author without the @",
    input: `${fm}\n:::callout{kind="warning" author="echo"}\n:::\n`,
    message: /GitHub handle with the @/,
  },
  {
    name: "callout date that is not a date",
    input: `${fm}\n:::callout{kind="warning" author="@echo" date="yesterday"}\n:::\n`,
    message: /`date` is `YYYY-MM-DD`/,
  },
  {
    name: "non-integer story height",
    input: `${fm}\n::story{id="s--x" height="tall"}\n`,
    message: /positive integer/,
  },
  {
    name: "nested container",
    input: `${fm}\n:::callout{kind="note"}\n:::flow{title="X"}\n:::\n:::\n`,
    message: /do not nest/,
  },
  {
    name: "unclosed container",
    input: `${fm}\n:::callout{kind="note"}\nBody.\n`,
    message: /unclosed container/,
  },
  {
    name: "stray container close",
    input: `${fm}\nProse.\n:::\n`,
    message: /stray/,
  },
  {
    name: "four-colon line",
    input: `${fm}\n::::callout\n`,
    message: /not a valid directive/,
  },
];

describe("malformed input fails loudly", () => {
  for (const { name, input, message } of errors) {
    it(name, () => {
      expect(() => parsePage(input)).toThrowError(message);
      expect(() => parsePage(input)).toThrowError(GrammarError);
    });
  }
});

describe("error carries the line number", () => {
  it("points at the offending directive", () => {
    const input = `${fm}\nProse.\n\n::mystery\n`;
    try {
      parsePage(input);
      expect.unreachable();
    } catch (e) {
      expect((e as GrammarError).line).toBe(7);
    }
  });
});

describe("serialize rejects unrepresentable values", () => {
  it("quote in an attribute value", () => {
    const ast: PageAst = {
      frontmatter: { title: "X" },
      blocks: [{ type: "figma", url: "https://x", title: 'The "buy box"' }],
    };
    expect(() => serializePage(ast)).toThrowError(/cannot contain/);
  });
});

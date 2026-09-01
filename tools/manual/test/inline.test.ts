import { describe, expect, it } from "vitest";
import { parseInline, plainInline } from "../src/content/inline";

const text = (value: string) => ({ kind: "text", text: value }) as const;
const code = (value: string) => ({ kind: "code", text: value }) as const;

describe("inline markdown", () => {
  it("keeps plain prose in one run", () => {
    expect(parseInline("nothing to mark up here")).toEqual([
      text("nothing to mark up here"),
    ]);
  });

  it("reads the markers proposals actually use", () => {
    expect(
      parseInline("A **campaign** is not a `sale`, only *close*."),
    ).toEqual([
      text("A "),
      { kind: "strong", children: [text("campaign")] },
      text(" is not a "),
      code("sale"),
      text(", only "),
      { kind: "em", children: [text("close")] },
      text("."),
    ]);
  });

  it("reads __bold__ and _italic_ at word edges", () => {
    expect(parseInline("__loud__ and _soft_")).toEqual([
      { kind: "strong", children: [text("loud")] },
      text(" and "),
      { kind: "em", children: [text("soft")] },
    ]);
  });

  it("reads code nested inside bold", () => {
    expect(parseInline("**console UI leaves `@grade10/ui`**")).toEqual([
      {
        kind: "strong",
        children: [text("console UI leaves "), code("@grade10/ui")],
      },
    ]);
  });

  it("collapses a fenced block instead of leaking its backticks", () => {
    expect(parseInline("it reports:\n\n```sh\npnpm check\n```")).toEqual([
      text("it reports:\n\n"),
      code("pnpm check"),
    ]);
  });

  it("leaves stray markers alone", () => {
    for (const raw of ["2 * 3 * 4", "read_the_manual", "a ** b"]) {
      expect(parseInline(raw)).toEqual([text(raw)]);
    }
  });

  it("honours a backslash escape", () => {
    expect(parseInline("literal \\*stars\\* stay")).toEqual([
      text("literal *stars* stay"),
    ]);
  });

  it("links out on http, and keeps the label on anything else", () => {
    expect(parseInline("see [4098:1868](https://figma.example/f)")).toEqual([
      text("see "),
      {
        kind: "link",
        href: "https://figma.example/f",
        children: [text("4098:1868")],
      },
    ]);
    expect(parseInline("[`add-thing`](../add-thing/proposal.md)")).toEqual([
      code("add-thing"),
    ]);
  });

  it("refuses a script url, keeping only what it said", () => {
    expect(parseInline("[click](javascript:alert)")).toEqual([text("click")]);
  });

  it("reads a marked-up label inside a link", () => {
    expect(parseInline("[**loud** link](https://e.example)")).toEqual([
      {
        kind: "link",
        href: "https://e.example",
        children: [{ kind: "strong", children: [text("loud")] }, text(" link")],
      },
    ]);
  });

  it("flattens to the words for a search doc", () => {
    expect(plainInline("**Bold** `code` and [a link](https://e.example)")).toBe(
      "Bold code and a link",
    );
  });
});

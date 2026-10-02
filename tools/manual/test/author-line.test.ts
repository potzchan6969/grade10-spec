import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import YAML from "yaml";
import { AUTHOR_LINE, authorLine } from "../src/api/author-line.ts";

/** The schema tells an author how to write the line, and the store reads it
 * back: a rule that drifts from the reader gets a proposal refused for
 * following it. */

const read = (path: string) =>
  readFileSync(
    fileURLToPath(new URL(`../../../${path}`, import.meta.url)),
    "utf8",
  );

const fill = (line: string) =>
  line
    .replace(/<handle>|(?<=@)handle\b/, "tester")
    .replace(/<YYYY-MM-DD>|YYYY-MM-DD/, "2026-10-02");

describe("the proposal's author line", () => {
  it("reads back what the editor writes", () => {
    const [, handle, date] =
      AUTHOR_LINE.exec(authorLine("tester", "2026-10-02")) ?? [];
    expect([handle, date]).toEqual(["tester", "2026-10-02"]);
  });

  it("reads the line the proposal template opens with", () => {
    const template = read(
      "openspec/schemas/grade10-planning/templates/proposal.md",
    );
    expect(fill(template.split("\n")[0])).toBe(
      authorLine("tester", "2026-10-02"),
    );
  });

  it("reads the line the proposal rule tells an author to write", () => {
    const rules: string[] = YAML.parse(read("openspec/config.yaml")).rules
      .proposal;
    const rule = rules.find((one) => one.includes("**Author"));
    const written = /`(\*\*Author[^`]*)`/.exec(rule ?? "")?.[1] ?? "";
    expect(fill(written)).toBe(authorLine("tester", "2026-10-02"));
  });
});

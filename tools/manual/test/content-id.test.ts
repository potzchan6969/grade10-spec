import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { contentIdOf } from "../src/store/content-id.mts";

/**
 * The id a `reviewed:` line holds: what was before an artifact when its hand
 * last read it again. One hasher, read here and written by the round, so the
 * two can never disagree about what has changed.
 *
 * Whitespace is collapsed and trimmed and nothing else is touched: a link
 * target and a scenario id are text, so two upstreams that differ only in one
 * of those have to hash differently. The texts are joined by a NUL, which no
 * markdown carries, so no two sets of texts can run together into one.
 */

/** Hand-computed: the sha256 of `a b\0c`, first eight hexadecimal characters.
 * Pinned, not derived — a test that recomputes the answer the same way the
 * code does asserts nothing about either. */
const AB_C = "84eff4df";

describe("the content id of what is before an artifact", () => {
  it("is the first eight hex characters of the sha256", () => {
    expect(contentIdOf(["a  b\n", "c"])).toBe(AB_C);
    expect(contentIdOf(["a  b\n", "c"])).toHaveLength(8);
    expect(AB_C).toBe(
      createHash("sha256").update("a b\0c").digest("hex").slice(0, 8),
    );
  });

  it("collapses every run of whitespace and trims each text", () => {
    expect(contentIdOf([" a\t\tb \n", "\nc\n"])).toBe(AB_C);
    expect(contentIdOf(["a\nb", "c"])).toBe(AB_C);
  });

  it("touches nothing else: a link target is text", () => {
    expect(contentIdOf(["[the page](/a)"])).not.toBe(
      contentIdOf(["[the page](/b)"]),
    );
    expect(contentIdOf(["`demo-SC-01`"])).not.toBe(
      contentIdOf(["`demo-SC-02`"]),
    );
  });

  it("keeps two texts apart from one text of both", () => {
    expect(contentIdOf(["a", "b"])).not.toBe(contentIdOf(["ab"]));
    expect(contentIdOf(["a", "b"])).not.toBe(contentIdOf(["a b"]));
  });

  it("is the order the texts were read in", () => {
    expect(contentIdOf(["a", "b"])).not.toBe(contentIdOf(["b", "a"]));
  });

  it("answers for nothing before it at all", () => {
    expect(contentIdOf([])).toBe(
      createHash("sha256").update("").digest("hex").slice(0, 8),
    );
  });
});

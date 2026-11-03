import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { checkValue, parseMessage } from "../src/copy-checks.mjs";

const kinds = (input) => checkValue(input).map((issue) => issue.kind);

describe("parseMessage", () => {
  it("names simple, plural and nested arguments but not plural case text", () => {
    const { args, error } = parseMessage(
      "{count, plural, one {# lot by {seller}} other {Lots}} for {amount}",
    );
    assert.equal(error, null);
    assert.deepEqual([...args].sort(), ["amount", "count", "seller"]);
  });

  it("names rich-text tags", () => {
    assert.deepEqual(
      [...parseMessage("Read the <terms>terms</terms>").tags],
      ["terms"],
    );
  });

  it("treats a quoted brace as text", () => {
    assert.equal(parseMessage("Use '{' literally").error, null);
  });

  it("says where braces stop balancing", () => {
    assert.match(parseMessage("Closes {when").error, /Unclosed/);
    assert.match(parseMessage("Closes when}").error, /Unmatched/);
  });
});

describe("checkValue", () => {
  it("passes a faithful translation", () => {
    assert.deepEqual(
      checkValue({
        locale: "zh-Hant",
        value: "{when} 截止",
        reference: "Closes {when}",
      }),
      [],
    );
  });

  it("flags a missing value as an error", () => {
    assert.deepEqual(
      kinds({ locale: "ko", value: undefined, reference: "Open" }),
      ["missing"],
    );
  });

  it("flags dropped and added placeholders", () => {
    assert.deepEqual(
      kinds({ locale: "ko", value: "{amount} 최고", reference: "Top {bid}" }),
      ["placeholder", "placeholder"],
    );
  });

  it("flags copy left in English", () => {
    assert.deepEqual(
      kinds({ locale: "zh-Hans", value: "Bid Now", reference: "Bid Now" }),
      ["untranslated"],
    );
  });

  it("flags the other Chinese script", () => {
    assert.deepEqual(
      kinds({
        locale: "zh-Hant",
        value: "这个拍卖",
        reference: "This auction",
      }),
      ["variant"],
    );
    assert.deepEqual(
      kinds({
        locale: "zh-Hans",
        value: "這個拍賣",
        reference: "This auction",
      }),
      ["variant"],
    );
  });

  it("flags a translation with none of its script", () => {
    assert.deepEqual(
      kinds({ locale: "ko", value: "Bid here", reference: "Bid now" }),
      ["script"],
    );
  });

  it("holds English to the house style", () => {
    assert.deepEqual(kinds({ locale: "en", value: "We'll authorise it..." }), [
      "quotes",
      "ellipsis",
      "spelling",
    ]);
    assert.deepEqual(kinds({ locale: "en", value: "We’ll authorize it…" }), []);
  });
});

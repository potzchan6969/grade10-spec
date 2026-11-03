import { describe, expect, test } from "vitest";
import { crossSite } from "../worker/index.ts";

const URL_ = new URL("https://spec.grade10-stg.com/api/desk/runs");
const asking = (headers: Record<string, string>) =>
  crossSite(new Request(URL_, { method: "POST", headers }), URL_);

describe("the desk answers the manual's own pages only", () => {
  test("the manual's own page and a script with no Origin pass", () => {
    expect(
      asking({
        origin: "https://spec.grade10-stg.com",
        "sec-fetch-site": "same-origin",
      }),
    ).toBe(false);
    expect(asking({})).toBe(false);
  });

  test("another site's form or socket is refused", () => {
    expect(asking({ origin: "https://evil.example" })).toBe(true);
    expect(asking({ "sec-fetch-site": "cross-site" })).toBe(true);
    expect(asking({ "sec-fetch-site": "same-site" })).toBe(true);
  });
});

import { describe, expect, it } from "vitest";
import {
  DEFAULT_ORDER_LINK,
  type OrderLinkSettings,
  viewOf,
} from "./order-link-scenario";

const at = (settings: Partial<OrderLinkSettings>) =>
  viewOf({ ...DEFAULT_ORDER_LINK, ...settings });

describe("viewOf", () => {
  it.each([
    [{}, "guest"],
    [{ order: "member" }, "member"],
    [{ closed: "yes" }, undefined],
    [{ viewer: "someoneElse" }, undefined],
    [{ viewer: "signedInHere" }, "added"],
    [{ viewer: "signedInHere", joined: "notAdded" }, "notAdded"],
    [{ viewer: "signedInHere", joined: "sending" }, "sending"],
    [{ viewer: "signedInHere", joined: "sent" }, "sent"],
    [{ viewer: "signedInHere", joined: "sendFailed" }, "sendFailed"],
    [{ viewer: "signedInHere", joined: "failed" }, undefined],
  ] as const)("%o asks %s", (settings, ask) => {
    expect(at(settings).ask).toBe(ask);
  });

  it("names the receipt's email only signed out", () => {
    expect(at({}).signedIn).toBe(false);
    expect(at({ viewer: "someoneElse" }).signedIn).toBe(true);
    expect(at({ viewer: "signedInHere" }).signedIn).toBe(true);
  });

  it("shows not-found for a wrong link, whoever reads it", () => {
    expect(at({ link: "wrong", viewer: "signedInHere" })).toEqual({
      notFound: true,
      signedIn: false,
    });
  });

  it("asks nothing signed out once a closed ask hides it", () => {
    expect(at({ order: "member", closed: "yes" }).ask).toBeUndefined();
  });
});

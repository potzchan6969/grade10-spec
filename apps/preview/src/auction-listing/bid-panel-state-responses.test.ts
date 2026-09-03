import { describe, expect, test } from "vitest";
import {
  BID_PANEL_STATE_RESPONSES,
  PAYMENT_AUTHORIZATION_STATE_RESPONSES,
} from "@grade10/test/bid-panel-states";

describe("Bid Panel normalized API response shapes", () => {
  test("enumerates unique query and mutation scenario IDs", () => {
    const scenarioIds = Object.values(BID_PANEL_STATE_RESPONSES).map(
      ({ scenarioId }) => scenarioId,
    );

    expect(scenarioIds).toHaveLength(new Set(scenarioIds).size);
    expect(scenarioIds.every((scenarioId) => scenarioId.startsWith("bid-panel/"))).toBe(
      true,
    );
  });

  test.each(Object.values(BID_PANEL_STATE_RESPONSES))(
    "$scenarioId contains a renderable state",
    (response) => {
      expect(response.operation).not.toBe("");
      expect(response.expectedText).not.toBe("");
      expect(["manual", "auto"]).toContain(response.state.bidMode);
    },
  );

  test("derives payment-setup dialog visibility from the response state", () => {
    const { state } = BID_PANEL_STATE_RESPONSES.setupRequired;

    expect(state.paymentSetup).toBeDefined();
    expect("open" in (state.paymentSetup ?? {})).toBe(false);
  });

  test.each(Object.values(PAYMENT_AUTHORIZATION_STATE_RESPONSES))(
    "$scenarioId is an enumerated payment-authorization mutation state",
    (response) => {
      expect(["pending", "refused"]).toContain(response.state);
    },
  );
});

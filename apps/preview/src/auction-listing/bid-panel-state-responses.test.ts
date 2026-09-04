import {
  BID_PANEL_STATE_RESPONSES,
  BID_PANEL_STATE_TEST_RESPONSES,
  PAYMENT_AUTHORIZATION_STATE_RESPONSES,
} from "@grade10/test/bid-panel-states";
import { describe, expect, test } from "vitest";

function byScenarioId(scenarioId: string) {
  return Object.values(BID_PANEL_STATE_RESPONSES).find(
    (response) => response.scenarioId === scenarioId,
  );
}

describe("Bid Panel normalized API response shapes", () => {
  test("enumerates unique query and mutation scenario IDs", () => {
    const scenarioIds = Object.values(BID_PANEL_STATE_RESPONSES).map(
      ({ scenarioId }) => scenarioId,
    );

    expect(scenarioIds).toHaveLength(new Set(scenarioIds).size);
    expect(
      scenarioIds.every((scenarioId) => scenarioId.startsWith("bid-panel/")),
    ).toBe(true);
  });

  test.each(Object.values(BID_PANEL_STATE_RESPONSES))(
    "$scenarioId contains a renderable state",
    (response) => {
      expect(response.operation).not.toBe("");
      expect(response.expectedText).not.toBe("");
      expect(["manual", "auto"]).toContain(response.state.bidMode);
    },
  );

  test("State Tests cover each distinct render once", () => {
    const storyIds = BID_PANEL_STATE_TEST_RESPONSES.map(
      ({ scenarioId }) => scenarioId,
    );
    expect(storyIds).toHaveLength(new Set(storyIds).size);

    const aliasTargets = new Set(
      Object.values(BID_PANEL_STATE_RESPONSES).flatMap((response) =>
        "rendersAs" in response && response.rendersAs != null
          ? [response.rendersAs]
          : [],
      ),
    );
    const catalogueWithoutAliases = Object.values(
      BID_PANEL_STATE_RESPONSES,
    ).filter(
      (response) => !("rendersAs" in response && response.rendersAs != null),
    );
    expect(catalogueWithoutAliases).toHaveLength(storyIds.length);
    for (const target of aliasTargets) {
      expect(storyIds).toContain(target);
    }
  });

  test.each(
    Object.values(BID_PANEL_STATE_RESPONSES).filter(
      (
        response,
      ): response is (typeof BID_PANEL_STATE_RESPONSES)[keyof typeof BID_PANEL_STATE_RESPONSES] & {
        rendersAs: string;
      } => "rendersAs" in response && response.rendersAs != null,
    ),
  )(
    "$scenarioId aliases the same panel state as $rendersAs",
    (response) => {
      const target = byScenarioId(response.rendersAs);
      expect(target).toBeDefined();
      expect(
        target && "rendersAs" in target ? target.rendersAs : undefined,
      ).toBeUndefined();
      expect(response.state).toEqual(target?.state);
      expect(response.expectedText).toBe(target?.expectedText);
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

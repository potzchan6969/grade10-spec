import { describe, expect, it } from "vitest";
import { FactCardSkeleton } from "./fact-card-skeleton";
import { LOADING_LABEL, STORAGE_STAGES } from "./fixtures";
import { StageRail } from "./stage-rail";

// A refusal throws before anything is drawn, so calling the component is the
// whole render.
describe("what the page blocks refuse", () => {
  // shared-ui-page-blocks-SC-07
  it("refuses a loading count below one, naming it", () => {
    expect(() =>
      FactCardSkeleton({ copy: { label: LOADING_LABEL }, count: 0 }),
    ).toThrow(/\b0\b/);
  });

  // shared-ui-page-blocks-SC-15
  it("refuses a stage the rail does not hold, naming it", () => {
    expect(() =>
      StageRail({ copy: { stages: STORAGE_STAGES }, current: "loan" }),
    ).toThrow(/"loan"/);
  });
});

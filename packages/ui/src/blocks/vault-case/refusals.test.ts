import { describe, expect, it } from "vitest";
import { LOADING_LABEL, STORAGE_STAGES } from "./fixtures";
import { VaultFactCardSkeleton } from "./vault-fact-card-skeleton";
import { VaultStageRail } from "./vault-stage-rail";

// A refusal throws before anything is drawn, so calling the component is the
// whole render.
describe("what the vault blocks refuse", () => {
  // shared-ui-vault-case-SC-08
  it("refuses a loading count below one, naming it", () => {
    expect(() =>
      VaultFactCardSkeleton({ copy: { label: LOADING_LABEL }, count: 0 }),
    ).toThrow(/\b0\b/);
  });

  // shared-ui-vault-case-SC-16
  it("refuses a stage the rail does not hold, naming it", () => {
    expect(() =>
      VaultStageRail({ copy: { stages: STORAGE_STAGES }, current: "loan" }),
    ).toThrow(/"loan"/);
  });
});

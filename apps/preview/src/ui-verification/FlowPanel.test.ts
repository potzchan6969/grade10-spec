import { describe, expect, it } from "vitest";
import { diffLabel, diffTone } from "./FlowPanel";

describe("flow scores", () => {
  it("reads blue under 0.5%, orange up to 20% and red over it", () => {
    expect(diffTone(0.004)).toBe("ok");
    expect(diffTone(0.005)).toBe("warn");
    expect(diffTone(0.2)).toBe("warn");
    expect(diffTone(0.246)).toBe("high");
  });

  it("labels a diff to one decimal", () => {
    expect(diffLabel(0)).toBe("Diff 0%");
    expect(diffLabel(0.004)).toBe("Diff 0.4%");
    expect(diffLabel(0.083)).toBe("Diff 8.3%");
    expect(diffLabel(0.246)).toBe("Diff 24.6%");
  });
});

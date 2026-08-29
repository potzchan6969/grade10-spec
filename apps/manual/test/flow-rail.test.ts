import { describe, expect, it } from "vitest";
import { railScrollLeft } from "../src/blocks/flow-steps";

const view = (scrollLeft: number, clientWidth = 400) => ({
  scrollLeft,
  clientWidth,
});
const chip = (offsetLeft: number, offsetWidth = 120) => ({
  offsetLeft,
  offsetWidth,
});

describe("where the step rail scrolls for its chip", () => {
  it("stays put when the chip is already in view", () => {
    expect(railScrollLeft(view(0), chip(100), 24)).toBe(0);
  });

  it("brings back a chip that sits to the left of the view", () => {
    expect(railScrollLeft(view(300), chip(200), 24)).toBe(176);
  });

  it("never scrolls past the start of the rail", () => {
    expect(railScrollLeft(view(20), chip(10), 24)).toBe(0);
  });

  it("brings forward a chip that runs off the right, margin included", () => {
    // chip ends at 640; the view ends at 400, so it must move 264.
    expect(railScrollLeft(view(0), chip(520), 24)).toBe(264);
  });

  it("leaves a chip that ends exactly at the edge alone", () => {
    expect(railScrollLeft(view(0), chip(256), 24)).toBe(0);
  });
});

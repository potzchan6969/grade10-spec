import { describe, expect, it } from "vitest";
import {
  flowAnchors,
  flowSteps,
  splitFlow,
  stepTokens,
} from "../src/blocks/flow-steps";
import type { FlowBlock } from "../src/content/grammar";

const flow = (markdown: string, title = "Intake to release"): FlowBlock => ({
  type: "flow",
  title,
  body: markdown === "" ? [] : [{ type: "prose", markdown }],
});

const titles = (markdown: string) =>
  flowSteps(splitFlow(flow(markdown))).map((step) => step.title);

describe("splitting a flow into phases and steps", () => {
  it("reads a flow without phase headings as one unnamed run", () => {
    const phases = splitFlow(flow("## Open a draft\nDetails.\n## Submit\nGo."));

    expect(phases).toHaveLength(1);
    expect(phases[0].title).toBeNull();
    expect(phases[0].lede).toEqual([]);
    expect(titles("## Open a draft\nDetails.\n## Submit\nGo.")).toEqual([
      "Open a draft",
      "Submit",
    ]);
  });

  it("groups steps under the phase that opened them", () => {
    const phases = splitFlow(
      flow("# Intake\n## Open a draft\n## Submit\n# Release\n## Release it"),
    );

    expect(phases.map((phase) => phase.title)).toEqual(["Intake", "Release"]);
    expect(phases.map((phase) => phase.steps.length)).toEqual([2, 1]);
  });

  it("numbers steps straight through the phases", () => {
    const steps = flowSteps(
      splitFlow(
        flow("# Intake\n## Open a draft\n## Submit\n# Release\n## Release it"),
      ),
    );

    expect(steps.map((step) => step.number)).toEqual([1, 2, 3]);
    expect(steps.map((step) => step.id)).toEqual([
      "intake-to-release-step-1",
      "intake-to-release-step-2",
      "intake-to-release-step-3",
    ]);
  });

  it("keeps text before a phase's first step as its lede", () => {
    const [phase] = splitFlow(
      flow("# Intake\nThe item arrives.\n## Open a draft\nDetails."),
    );

    expect(phase.lede).toEqual([
      { type: "prose", markdown: "The item arrives." },
    ]);
    expect(phase.steps[0].items).toEqual([
      { type: "prose", markdown: "Details." },
    ]);
  });

  it("keeps text written before any heading in a step named for the flow", () => {
    const [phase] = splitFlow(flow("Read this first.\n## Open a draft"));

    expect(phase.title).toBeNull();
    expect(phase.steps[0].title).toBe("Intake to release");
    expect(phase.steps[0].items).toEqual([
      { type: "prose", markdown: "Read this first." },
    ]);
  });

  it("drops a phase heading nobody wrote anything under", () => {
    const phases = splitFlow(flow("# Intake\n## Open a draft\n# Someday"));

    expect(phases.map((phase) => phase.title)).toEqual(["Intake"]);
  });

  it("gives an empty flow one step named for the flow", () => {
    const phases = splitFlow(flow(""));

    expect(phases).toHaveLength(1);
    expect(phases[0].title).toBeNull();
    expect(phases[0].steps).toEqual([
      {
        id: "intake-to-release-step-1",
        number: 1,
        title: "Intake to release",
        items: [],
      },
    ]);
  });

  it("leaves headings inside a fence alone", () => {
    expect(
      titles("## Open a draft\n```md\n# Phase\n## Step\n```\n## Submit"),
    ).toEqual(["Open a draft", "Submit"]);
  });

  it("lands a leaf block in the step that is open", () => {
    const image = {
      type: "image",
      src: "assets/till.png",
      alt: "The till",
    } as const;
    const phases = splitFlow({
      type: "flow",
      title: "Intake to release",
      body: [
        { type: "prose", markdown: "# Intake\n## Open a draft" },
        image,
        { type: "prose", markdown: "## Submit" },
      ],
    });

    expect(phases[0].steps[0].items).toEqual([image]);
    expect(phases[0].steps[1].items).toEqual([]);
  });
});

describe("the tokens a diagram can claim a step with", () => {
  it("answers to the number, the id and the slug of the title", () => {
    const [step] = flowSteps(splitFlow(flow("## Open a draft")));

    expect([...stepTokens(step)].sort()).toEqual(
      ["1", "intake-to-release-step-1", "open-a-draft"].sort(),
    );
  });
});

describe("a flow that walks one case of several", () => {
  it("names its rows after the case, so two cases never share an id", () => {
    const normal = { ...flow("## Order paid"), case: "Normal" };
    const failing = { ...flow("## Order paid"), case: "Nothing itemised" };

    expect(flowAnchors(normal)).toEqual([
      "intake-to-release-normal-phase-1",
      "intake-to-release-normal-step-1",
    ]);
    expect(flowAnchors(failing)).toEqual([
      "intake-to-release-nothing-itemised-phase-1",
      "intake-to-release-nothing-itemised-step-1",
    ]);
  });

  it("leaves a flow with no case on the ids it already had", () => {
    expect(flowAnchors(flow("## Order paid"))).toEqual([
      "intake-to-release-phase-1",
      "intake-to-release-step-1",
    ]);
  });
});

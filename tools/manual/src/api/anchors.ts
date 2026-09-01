import { slugify } from "./paths";
import type { Journey, Requirement, Scenario, TestCase } from "./types";

/** Deep links use the store's permanent id where one exists, a stable slug otherwise. */

export function requirementAnchor(requirement: Requirement): string {
  return `req-${slugify(requirement.name)}`;
}

export function scenarioAnchor(
  requirement: Requirement,
  scenario: Scenario,
): string {
  return (
    scenario.id ?? `${requirementAnchor(requirement)}-${slugify(scenario.name)}`
  );
}

export function journeyAnchor(journey: Journey): string {
  return journey.id;
}

export function caseAnchor(testCase: TestCase): string {
  return testCase.id;
}

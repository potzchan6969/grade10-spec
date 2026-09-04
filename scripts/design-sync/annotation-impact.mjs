import {
  ReconciliationSelectionError,
  selectFindings,
} from "./annotation-report.mjs";
import { normalizeScope } from "./annotation-scope.mjs";
import { validateAssociation } from "./annotation-store.mjs";

export const IMPACT_SCHEMA_VERSION = 1;
export const IMPACT_OUTCOMES = Object.freeze([
  "implemented",
  "no-impact",
  "covered",
  "gap",
  "blocked",
]);

const REPOSITORY_BY_SCOPE = Object.freeze({
  product: "grade10",
  spec: "grade10-spec",
});
const PLANNING_LANES = new Set(["grade10-planning"]);
const IMPLEMENTATION_REPOSITORIES = new Set(["grade10", "grade10-spec"]);

export class ImpactValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ImpactValidationError";
  }
}

function fail(message) {
  throw new ImpactValidationError(message);
}

function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function nonEmptyString(value, label) {
  if (typeof value !== "string" || !value.trim())
    fail(`${label} must be a non-empty string`);
  return value.trim();
}

function listOfStrings(value, label, { required = true } = {}) {
  if (value === undefined && !required) return [];
  if (!Array.isArray(value)) fail(`${label} must be an array`);
  if (required && !value.length) fail(`${label} must not be empty`);
  return value.map((item, index) => nonEmptyString(item, `${label}[${index}]`));
}

function uniqueStrings(value, label) {
  const values = listOfStrings(value, label);
  if (new Set(values).size !== values.length)
    fail(`${label} must contain unique values`);
  return values;
}

function safeRelativePath(value, label) {
  const path = nonEmptyString(value, label);
  if (
    path.startsWith("/") ||
    path.includes("\\") ||
    path
      .split("/")
      .some((segment) => !segment || segment === "." || segment === "..")
  )
    fail(`${label} must be a relative path without traversal`);
  return path;
}

function reportScope(report) {
  return report?.scope ?? report?.scanner?.scope ?? null;
}

function reportDigest(report) {
  return (
    report?.observationDigest ?? report?.scanner?.observationDigest ?? null
  );
}

function normalizeImplementationEvidence(
  evidence,
  expectedRepository,
  { required = false } = {},
) {
  if (evidence === undefined || evidence === null) {
    if (required) fail("implementation evidence is required");
    return null;
  }
  if (!isRecord(evidence)) fail("implementation evidence must be an object");
  const repository = nonEmptyString(
    evidence.repository,
    "implementation evidence repository",
  );
  if (repository !== expectedRepository)
    fail(
      `implementation evidence must use the owning repository ${expectedRepository}`,
    );
  if (!Array.isArray(evidence.locations) || !evidence.locations.length)
    fail("implementation evidence locations must not be empty");
  const locations = evidence.locations.map((location, index) => {
    if (!isRecord(location))
      fail(`implementation evidence location ${index} must be an object`);
    const normalized = {
      path: safeRelativePath(
        location.path,
        `implementation evidence location ${index} path`,
      ),
      evidence: nonEmptyString(
        location.evidence,
        `implementation evidence location ${index} evidence`,
      ),
    };
    if (location.line !== undefined) {
      if (!Number.isInteger(location.line) || location.line < 1)
        fail(`implementation evidence location ${index} line must be positive`);
      normalized.line = location.line;
    }
    if (location.symbol !== undefined)
      normalized.symbol = nonEmptyString(
        location.symbol,
        `implementation evidence location ${index} symbol`,
      );
    return normalized;
  });
  return { repository, locations };
}

function normalizeTestEvidence(evidence, { required = false } = {}) {
  if (evidence === undefined || evidence === null) {
    if (required) fail("focused test evidence is required");
    return null;
  }
  if (!isRecord(evidence)) fail("focused test evidence must be an object");
  if (!Number.isInteger(evidence.exitCode))
    fail("focused test evidence exitCode must be an integer");
  return {
    command: nonEmptyString(evidence.command, "focused test evidence command"),
    scenario: nonEmptyString(
      evidence.scenario,
      "focused test evidence scenario",
    ),
    exitCode: evidence.exitCode,
    result: nonEmptyString(evidence.result, "focused test evidence result"),
  };
}

function normalizeRuntimeEvidence(evidence, { required = false } = {}) {
  if (evidence === undefined || evidence === null) {
    if (required) fail("runtime evidence is required");
    return null;
  }
  if (!isRecord(evidence)) fail("runtime evidence must be an object");
  return {
    environment: nonEmptyString(
      evidence.environment,
      "runtime evidence environment",
    ),
    check: nonEmptyString(evidence.check, "runtime evidence check"),
    observed: nonEmptyString(evidence.observed, "runtime evidence observed"),
  };
}

function normalizeAssociation(
  association,
  storeRoot,
  { required = false } = {},
) {
  if (association === undefined || association === null) {
    if (required) fail("an exact association is required");
    return null;
  }
  try {
    return validateAssociation(association, { storeRoot });
  } catch (error) {
    fail(
      `impact association is invalid: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

function normalizeBlockers(value) {
  if (!Array.isArray(value) || !value.length)
    fail("blocked outcome requires non-empty blockers");
  return value.map((blocker, index) => {
    if (typeof blocker === "string")
      return nonEmptyString(blocker, `blockers[${index}]`);
    if (isRecord(blocker)) {
      return {
        ...blocker,
        reason: nonEmptyString(blocker.reason, `blockers[${index}] reason`),
      };
    }
    fail(`blockers[${index}] must be text or an object with a reason`);
  });
}

function forbidField(finding, field, outcome) {
  if (finding[field] !== undefined)
    fail(`${field} is not valid for ${outcome} outcome`);
}

function normalizeFinding(
  finding,
  selectedFinding,
  { expectedRepository, storeRoot },
) {
  if (!isRecord(finding)) fail("impact finding must be an object");
  const findingId = nonEmptyString(finding.findingId, "findingId");
  if (findingId !== selectedFinding.id)
    fail(`impact finding ${findingId} does not match selected finding`);
  const expectedBehavior = nonEmptyString(
    finding.expectedBehavior,
    `expected behavior for ${findingId}`,
  );
  const outcome = nonEmptyString(finding.outcome, `outcome for ${findingId}`);
  if (!IMPACT_OUTCOMES.includes(outcome))
    fail(
      `outcome for ${findingId} must be one of ${IMPACT_OUTCOMES.join(", ")}`,
    );
  for (const field of [
    "implementationEvidence",
    "testEvidence",
    "runtimeEvidence",
  ])
    if (!Object.hasOwn(finding, field))
      fail(
        `${field.replace(/([A-Z])/g, " $1").toLowerCase()} is required for ${findingId}`,
      );

  const implementationEvidence = normalizeImplementationEvidence(
    finding.implementationEvidence,
    expectedRepository,
    { required: outcome === "implemented" },
  );
  const testEvidence = normalizeTestEvidence(finding.testEvidence, {
    required: outcome === "implemented",
  });
  const runtimeEvidence = normalizeRuntimeEvidence(finding.runtimeEvidence, {
    required: outcome === "implemented",
  });
  const association = normalizeAssociation(finding.association, storeRoot, {
    required: outcome === "implemented" || outcome === "covered",
  });

  if (outcome === "implemented") {
    if (testEvidence.exitCode !== 0)
      fail(`implemented finding ${findingId} needs a successful focused test`);
    forbidField(finding, "noImpactReason", outcome);
    forbidField(finding, "missingBehavior", outcome);
    forbidField(finding, "blockers", outcome);
  } else if (outcome === "no-impact") {
    nonEmptyString(finding.noImpactReason, `no-impact reason for ${findingId}`);
    forbidField(finding, "association", outcome);
    forbidField(finding, "missingBehavior", outcome);
    forbidField(finding, "blockers", outcome);
  } else if (outcome === "covered") {
    if (!association.change || association.capability)
      fail(`covered finding ${findingId} needs an active change association`);
    forbidField(finding, "noImpactReason", outcome);
    forbidField(finding, "missingBehavior", outcome);
    forbidField(finding, "blockers", outcome);
  } else if (outcome === "gap") {
    nonEmptyString(
      finding.missingBehavior,
      `missing behavior for ${findingId}`,
    );
    forbidField(finding, "association", outcome);
    forbidField(finding, "noImpactReason", outcome);
    forbidField(finding, "blockers", outcome);
  } else {
    normalizeBlockers(finding.blockers);
    forbidField(finding, "association", outcome);
    forbidField(finding, "noImpactReason", outcome);
    forbidField(finding, "missingBehavior", outcome);
  }

  const normalized = {
    findingId,
    expectedBehavior,
    outcome,
    implementationEvidence,
    testEvidence,
    runtimeEvidence,
  };
  if (association) normalized.association = association;
  if (outcome === "no-impact")
    normalized.noImpactReason = finding.noImpactReason.trim();
  if (outcome === "gap")
    normalized.missingBehavior = finding.missingBehavior.trim();
  if (outcome === "blocked")
    normalized.blockers = normalizeBlockers(finding.blockers);
  return normalized;
}

function groupField(group, primary, fallback) {
  return group[primary] ?? (fallback ? group[fallback] : undefined);
}

function normalizePlanningGroup(group, index, gapIds) {
  if (!isRecord(group)) fail(`planning group ${index} must be an object`);
  const findingIds = uniqueStrings(
    group.findingIds,
    `planning group ${index} findingIds`,
  );
  for (const findingId of findingIds) {
    if (!gapIds.has(findingId))
      fail(`planning group ${index} contains non-gap finding ${findingId}`);
  }
  const capabilityPath = safeRelativePath(
    groupField(group, "capabilityPath", "capability"),
    `planning group ${index} capabilityPath`,
  );
  const proposedChangeName = nonEmptyString(
    groupField(group, "proposedChangeName", "changeName"),
    `planning group ${index} proposedChangeName`,
  );
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(proposedChangeName))
    fail(
      `planning group ${index} proposedChangeName must be kebab-case: ${proposedChangeName}`,
    );
  const planningLane = nonEmptyString(
    groupField(group, "planningLane", "lane"),
    `planning group ${index} planningLane`,
  );
  if (!PLANNING_LANES.has(planningLane))
    fail(`planning group ${index} has an invalid planning lane`);
  const affectedRepositories = uniqueStrings(
    groupField(group, "affectedRepositories", "repositories"),
    `planning group ${index} affectedRepositories`,
  );
  if (
    affectedRepositories.some(
      (repository) => !IMPLEMENTATION_REPOSITORIES.has(repository),
    )
  )
    fail(`planning group ${index} has an unknown affected repository`);
  const nonGoals = listOfStrings(
    group.nonGoals,
    `planning group ${index} nonGoals`,
  );
  return {
    findingIds,
    capabilityPath,
    proposedChangeName,
    planningLane,
    affectedRepositories,
    nonGoals,
  };
}

function validatePlanningGroups(groups, findings) {
  if (!Array.isArray(groups)) fail("planningGroups must be an array");
  const gapIds = new Set(
    findings
      .filter((finding) => finding.outcome === "gap")
      .map((finding) => finding.findingId),
  );
  const normalized = groups.map((group, index) =>
    normalizePlanningGroup(group, index, gapIds),
  );
  const groupedIds = normalized.flatMap((group) => group.findingIds);
  if (new Set(groupedIds).size !== groupedIds.length)
    fail("each gap finding must appear in only one planning group");
  if (
    groupedIds.length !== gapIds.size ||
    groupedIds.some((id) => !gapIds.has(id))
  )
    fail("every gap finding must appear in exactly one planning group");
  const changeNames = normalized.map((group) => group.proposedChangeName);
  if (new Set(changeNames).size !== changeNames.length)
    fail("planning groups must propose unique change names");
  return normalized;
}

export function validateImpactReview({
  scope,
  report,
  ids,
  selectedIds,
  review,
  storeRoot = process.cwd(),
} = {}) {
  let normalizedScope;
  try {
    normalizedScope = normalizeScope(scope);
  } catch (error) {
    fail(error instanceof Error ? error.message : String(error));
  }
  if (!isRecord(report)) fail("annotation report must be an object");
  if (reportScope(report) !== normalizedScope)
    fail("annotation report scope does not match the impact scope");
  const observationDigest = reportDigest(report);
  if (typeof observationDigest !== "string" || !observationDigest.trim())
    fail("annotation report is missing its observation digest");
  const selected = selectedIds ?? ids;
  if (!Array.isArray(selected) || !selected.length)
    fail("impact review needs selected finding IDs");
  if (selected.some((id) => typeof id !== "string" || !id.trim()))
    fail("selected finding IDs must be non-empty strings");
  if (new Set(selected).size !== selected.length)
    fail("selected finding IDs must be unique");
  let selectedFindings;
  try {
    selectedFindings = selectFindings(report, selected);
  } catch (error) {
    if (error instanceof ReconciliationSelectionError) fail(error.message);
    throw error;
  }
  if (!isRecord(review)) fail("impact review must be an object");
  if (review.schemaVersion !== IMPACT_SCHEMA_VERSION)
    fail(`impact review schemaVersion must be ${IMPACT_SCHEMA_VERSION}`);
  if (review.scope !== normalizedScope)
    fail("impact review scope does not match the selected report");
  if (review.observationDigest !== observationDigest)
    fail("impact review observation digest is stale");
  if (!Array.isArray(review.findings))
    fail("impact review findings must be an array");
  if (review.findings.length !== selected.length)
    fail("impact review must contain exactly one finding per selected ID");
  const reviewIds = review.findings.map((finding) => finding?.findingId);
  if (new Set(reviewIds).size !== reviewIds.length)
    fail("impact review finding IDs must be unique");
  if (reviewIds.some((findingId) => !selected.includes(findingId)))
    fail("impact review contains a finding that was not selected");

  const selectedById = new Map(
    selectedFindings.map((finding) => [finding.id, finding]),
  );
  const findings = selected.map((findingId) => {
    const finding = review.findings.find(
      (candidate) => candidate?.findingId === findingId,
    );
    return normalizeFinding(finding, selectedById.get(findingId), {
      expectedRepository: REPOSITORY_BY_SCOPE[normalizedScope],
      storeRoot,
    });
  });
  const planningGroups = validatePlanningGroups(
    review.planningGroups,
    findings,
  );
  const acceptanceEligibleIds = findings
    .filter((finding) =>
      ["implemented", "no-impact", "covered"].includes(finding.outcome),
    )
    .map((finding) => finding.findingId);
  const blockedIds = findings
    .filter((finding) => finding.outcome === "blocked")
    .map((finding) => finding.findingId);
  const blockers = findings
    .filter((finding) => finding.outcome === "blocked")
    .flatMap((finding) =>
      finding.blockers.map((blocker) => ({
        findingId: finding.findingId,
        blocker,
      })),
    );
  const result = {
    schemaVersion: IMPACT_SCHEMA_VERSION,
    scope: normalizedScope,
    observationDigest,
    selectedIds: [...selected],
    findings,
    acceptanceEligibleIds,
    planningGroups,
    blockedIds,
    blockers,
    status: blockedIds.length
      ? "blocked"
      : planningGroups.length
        ? "planning"
        : "complete",
  };
  return { ...result, exitCode: impactExitCodeFor(result) };
}

export function impactExitCodeFor(result) {
  if (result?.status === "blocked" || result?.blockedIds?.length) return 2;
  if (result?.status === "planning" || result?.planningGroups?.length) return 1;
  return 0;
}

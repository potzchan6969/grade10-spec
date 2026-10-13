import {
  acceptanceGate,
  formatFindings,
  prepareAcceptance,
  runPnpm,
} from "./acceptance.mjs";

/** One change through the gate `spec:accept` holds it to. A change that
 *  cannot even be folded reports that as its one failure. */
export function preflightChange(root, changeId, command = runPnpm) {
  try {
    const prepared = prepareAcceptance(root, changeId);
    const { failures, warnings } = acceptanceGate(prepared, command);
    return { changeId, prepared, failures, warnings };
  } catch (error) {
    return {
      changeId,
      prepared: null,
      failures: [{ rule: "fold", detail: error.message }],
      warnings: [],
    };
  }
}

export function formatPreflight(results) {
  const lines = [];
  if (results.length > 1) {
    lines.push(
      "| Change | Result | Failures | Warnings |",
      "| --- | --- | --- | --- |",
    );
    for (const one of results)
      lines.push(
        `| ${one.changeId} | ${one.failures.length === 0 ? "ready" : "refused"} | ${one.failures.length} | ${one.warnings.length} |`,
      );
    lines.push("");
  }
  for (const one of results) {
    const { prepared } = one;
    lines.push(
      one.failures.length === 0
        ? `${one.changeId} is ready to fold and accept.`
        : `${one.changeId} would be refused by spec:accept:`,
    );
    if (one.failures.length > 0) lines.push(formatFindings(one.failures));
    if (one.warnings.length > 0) {
      lines.push("Warnings:", formatFindings(one.warnings));
    }
    if (prepared) {
      lines.push(
        `Fingerprint: ${prepared.fingerprint}`,
        `Baseline: ${prepared.baselineFingerprint}`,
        `Durable files to write: ${prepared.outputs.size}`,
        ...[...prepared.outputs.keys()].map((path) => `  ${path}`),
      );
    }
    lines.push("");
  }
  return lines.join("\n").trimEnd();
}

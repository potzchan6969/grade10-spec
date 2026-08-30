/** The one way a requirement is matched by name — selectors, row badges,
 * and checks all come through here so the check and the app can never
 * disagree. Case and interior whitespace are forgiven, which is also what
 * `openspec archive` forgives when it folds a delta. */
export function normalizeRequirementName(name: string): string {
  return name.trim().replace(/\s+/g, " ").toLowerCase();
}

export function findRequirement<T extends { name: string }>(
  requirements: readonly T[],
  selector: string,
): T | undefined {
  const wanted = normalizeRequirementName(selector);
  return requirements.find(
    (requirement) => normalizeRequirementName(requirement.name) === wanted,
  );
}

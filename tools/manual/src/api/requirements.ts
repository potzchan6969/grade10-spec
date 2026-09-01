/** The one way a requirement is matched by name — selectors, row badges,
 * and checks all come through here so the check and the app can never
 * disagree. Case and interior whitespace are forgiven on purpose, so a
 * selector still finds the row a reader would point at. `openspec archive`
 * forgives neither: its `normalizeRequirementName` is `name.trim()`, and its
 * case-folding exists only to spot a typo. So the delta rules compare
 * headings exactly and come here only to name the row that was meant. */
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

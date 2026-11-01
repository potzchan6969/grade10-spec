/** Fills `{name}` holes in a catalog sentence: `Remove {line}` with
 * `{ line: "Fast Pass × 6 days" }`. A hole with no value stays as written,
 * so a missing value shows rather than vanishing. */
function fillCopy(
  template: string,
  values: Readonly<Record<string, string | number>>,
): string {
  return template.replace(/\{(\w+)\}/g, (hole, name: string) =>
    name in values ? String(values[name]) : hole,
  );
}

export { fillCopy };

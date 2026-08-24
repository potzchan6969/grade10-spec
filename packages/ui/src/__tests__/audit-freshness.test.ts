/*
 * audit.json freshness: every class an audit entry lists must still appear in
 * the component file its label names.
 *
 * The `classes` column is a snapshot of the component's own class strings,
 * taken at conversion time so `figma:audit` can diff the values against Figma
 * long after the converter is gone. Nothing else ties that snapshot to the
 * source: edit a block's classes without touching its audit entry and the
 * nightly keeps auditing a string the code no longer renders — which can both
 * false-pass (the removed class still matches Figma) and false-fail (the
 * class is gone entirely). This test needs no Figma token, so the divergence
 * fails locally and in CI at the moment of the edit, while whoever made it
 * still knows the mapping.
 *
 * The check is presence in the component's own file, on utility-token
 * boundaries (`gap-2` must not pass by sitting inside `gap-24`). A class
 * assembled dynamically or imported from another module will fail here; the
 * fix is to keep audited classes literal in the component file, which is also
 * what keeps them greppable.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "vitest";

const BLOCKS = join(__dirname, "..", "blocks");

type AuditRow = { label?: string; node?: string; classes?: string };

function auditFiles(): Array<{ block: string; rows: AuditRow[] }> {
  const out = [];
  for (const entry of readdirSync(BLOCKS, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    let raw: string;
    try {
      raw = readFileSync(join(BLOCKS, entry.name, "audit.json"), "utf8");
    } catch {
      continue; // No audit.json — figma:audit reports the block as uncovered.
    }
    out.push({ block: entry.name, rows: JSON.parse(raw) as AuditRow[] });
  }
  return out;
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
const present = (source: string, cls: string) =>
  new RegExp(`(?<![-\\w])${escapeRe(cls)}(?![-\\w])`).test(source);

test("every audit.json entry names a component file and lists only classes it still contains", () => {
  const violations: string[] = [];
  for (const { block, rows } of auditFiles()) {
    for (const row of rows) {
      const component = /^([\w-]+)\//.exec(row.label ?? "")?.[1];
      if (!component) {
        violations.push(
          `${block}/audit.json: label "${row.label}" does not follow component/element`,
        );
        continue;
      }
      let source: string;
      try {
        source = readFileSync(join(BLOCKS, block, `${component}.tsx`), "utf8");
      } catch {
        violations.push(
          `${block}/audit.json: "${row.label}" names ${component}.tsx, which does not exist`,
        );
        continue;
      }
      for (const cls of (row.classes ?? "").split(/\s+/).filter(Boolean))
        if (!present(source, cls))
          violations.push(
            `${block}/audit.json: "${row.label}" lists ${cls}, no longer in ${component}.tsx — update the entry with the class change that removed it`,
          );
    }
  }
  expect(violations).toEqual([]);
});

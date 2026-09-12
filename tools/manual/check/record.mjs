/*
 * RULES: the change's own record — the page it marked, the design it wrote,
 * the deploy it shipped on. Each gap has a key in the change's
 * `.openspec.yaml` that stands in for the thing itself, so an exemption is a
 * line in the record rather than a silence.
 */
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { BUILDING, marksOfPage } from "../src/api/open-marks.ts";
import { productPages } from "./context.mjs";

/** The day the deploy record became a rule: every archive before it shipped
 * without one. */
export const DEPLOY_RECORD_SINCE = "2026-09-12";

const STORE_GROUP = "grade10-spec";

const fileOf = (change, name) => `${change.dir}/${name}`;

/**
 * A change carrying deltas says on a capability's PRD what it is building,
 * and links that section from its proposal. The link is the binding: a rule
 * keyed on the page's `spec:` would let a change pass on a 🚧 line another
 * change put there. Linking a section for context is allowed — one marked
 * linked section is enough.
 */
export function checkUnmarked(ctx, changes, pages) {
  const products = productPages(ctx.roots);
  const marked = new Set(
    pages
      .filter((page) => page.path.startsWith(products))
      .flatMap((page) =>
        marksOfPage(page, BUILDING)
          .filter((mark) => mark.section !== undefined)
          .map((mark) => `${page.path}#${mark.section}`),
      ),
  );

  for (const change of changes) {
    if (change.status !== "in-flight" || change.deltas.length === 0) continue;
    if (change.pageWaived) continue;
    const linked = (change.sections ?? []).filter((one) =>
      one.page.startsWith(products),
    );
    if (linked.some((one) => marked.has(`${one.page}#${one.slug}`))) continue;
    const missing =
      linked.length === 0
        ? "links no section of a PRD"
        : "no 🚧 line sits under a section it links";
    ctx.add(
      "unmarked",
      fileOf(change, "proposal.md"),
      `${missing} — mark what this change delivers, or say why in \`page_waived\``,
    );
  }
}

/** The product directories under `openspec/specs/` — the names a group tag
 * most often carries by mistake, since a group is usually about one of them. */
function productNames(roots) {
  const dir = join(roots.store, "openspec", "specs");
  if (!existsSync(dir)) return new Set();
  return new Set(
    readdirSync(dir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name),
  );
}

/** A change with work outside this store writes its design. An untagged group
 * counts: the tag is what says the work lands here, and a group that claims
 * nothing claims no exemption either. A tag naming a product is a mis-tag,
 * and the message says so rather than asking for a design. */
export function checkDesign(ctx, changes) {
  const products = productNames(ctx.roots);
  for (const change of changes) {
    if (change.status !== "in-flight" || change.designWaived) continue;
    const group = change.taskGroups.find((one) => one.repo !== STORE_GROUP);
    if (!group) continue;
    const design = fileOf(change, "tech-design.md");
    if (existsSync(join(ctx.roots.store, design))) continue;
    if (products.has(group.repo)) {
      ctx.add(
        "design",
        fileOf(change, "tasks.md"),
        `group ${group.num} names \`${group.repo}\`, a product under \`openspec/specs/\`, not a repository — tag the group \`(${STORE_GROUP})\` for work landing here, or the application's clone name, and keep the product in the title`,
      );
      continue;
    }
    const where = group.repo === "" ? "no repository" : `\`${group.repo}\``;
    ctx.add(
      "design",
      fileOf(change, "tasks.md"),
      `group ${group.num} names ${where}, so the work lands outside this store and has no \`tech-design.md\` — write it, or say why in \`design_waived\``,
    );
  }
}

/** An archive says which deploy carried it. The store cannot see the
 * application repository's runs, so it checks the record `pnpm plan shipped`
 * leaves — unless nothing in the change deploys, which the repository tags
 * already say. */
export function checkArchived(ctx, archived) {
  for (const change of archived) {
    if (!change.shippedOn || change.shippedOn < DEPLOY_RECORD_SINCE) continue;
    if (change.deployedAt || change.deployWaived) continue;
    if (
      change.taskGroups.length > 0 &&
      change.taskGroups.every((one) => one.repo === STORE_GROUP)
    ) {
      continue;
    }
    const file = fileOf(change, ".openspec.yaml");
    const missing = existsSync(join(ctx.roots.store, file))
      ? "records no deploy"
      : "carries no `.openspec.yaml`, so it records no deploy";
    ctx.add(
      "archived",
      file,
      `${missing} — \`pnpm plan shipped ${change.id}\` writes \`deployed_at\`, or say who archived it without one in \`deploy_waived\``,
    );
  }
}

/*
 * RULES: the change's own record — the page it marked, the design it wrote,
 * the deploy it shipped on. Each gap has a key in the change's
 * `.openspec.yaml` that stands in for the thing itself, so an exemption is a
 * line in the record rather than a silence.
 */
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { BUILDING, marksOfPage } from "../src/api/open-marks.ts";
import { waiverLineOf } from "../src/api/waivers.ts";
import { schemaArtifacts } from "../src/store/read-schema.mts";
import { productPages } from "./context.mjs";

/** The day the deploy record became a rule: every archive before it shipped
 * without one. */
export const DEPLOY_RECORD_SINCE = "2026-09-12";

/** The day after `decisions.md` became required. The four changes opened on
 * the day itself were opened before the flag moved, and a register of changes
 * that could not have complied is a check people learn to read past. */
export const DECISIONS_SINCE = "2026-09-17";

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
    if (change.status !== "in-flight") continue;
    // RULE `hatch`: `skip_specs` says this change alters no product behaviour.
    // A 🚧 line says a reader will see something new. An author claiming both
    // is contradicting themselves, and `skip_specs` is the switch that turns
    // every other check in this workflow off, so the contradiction is the one
    // guard it has.
    if (change.skipSpecs !== undefined) {
      const claims = (change.sections ?? []).filter(
        (one) =>
          one.page.startsWith(products) &&
          marked.has(`${one.page}#${one.slug}`),
      );
      if (claims.length > 0) {
        ctx.add(
          "hatch",
          fileOf(change, ".openspec.yaml"),
          `claims \`skip_specs\` and marks 🚧 under ${claims[0].page}#${claims[0].slug} — a 🚧 line is an outcome a reader can see, so the change alters behaviour after all`,
        );
      }
      if (change.skipSpecs === "") {
        ctx.add(
          "hatch",
          fileOf(change, ".openspec.yaml"),
          "`skip_specs` gives no reason — add `skip_specs_why` with the line that says why no behaviour moves",
        );
      }
    }
    // A change waiting on its requirements has no delta yet, and is still
    // about an outcome somebody confirmed — so it marks its pages like any
    // other. Without this it could sit for months, counted on Pending and
    // invisible on every PRD.
    if (change.deltas.length === 0 && !waitsOnSpecs(change)) continue;
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

/**
 * RULE `decided`: a change says what its interview settled. `decisions.md`
 * holds the goals, the edges and the questions the rounds closed, and every
 * artifact after it is written from that scope - so a change without one hands
 * the journeys and the outline a scope nobody wrote down.
 *
 * Asked of changes opened since the requirement shipped. An older change owes
 * nothing: it was specified when the file did not exist, and asking seventy of
 * them at once would be a register rather than a gate.
 *
 * `decisions_waived: <why>` stands in two ways: where there was genuinely
 * nothing to settle, and on a change opened before the file existed, whose
 * scope its proposal already carries. An empty `## Decisions` table is
 * neither - it is a claim on the record that nothing had to be chosen, which
 * is a claim worth being able to make and the wrong one to make on behalf of
 * an interview somebody else held.
 */
export function checkDecided(ctx, changes) {
  for (const change of changes) {
    if (change.status !== "in-flight" || change.decisionsWaived) continue;
    if (!change.created || change.created < DECISIONS_SINCE) continue;
    const file = fileOf(change, "decisions.md");
    if (existsSync(join(ctx.roots.store, file))) continue;
    ctx.add(
      "decided",
      file,
      "missing: state this change's goals, its non-goals and what the interview settled - or say why there was nothing to settle in `decisions_waived`",
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

/**
 * A wait names an artifact of the change's own schema, and stops being a wait
 * once that artifact exists or the record waives it. None of these is a
 * judgement about whether the wait is over — only its author ends that — but
 * about whether the line says anything: an artifact the schema does not
 * declare reaches no worklist at all, one already written is a record that
 * contradicts the tree, and one the same record waives is the change saying
 * both that nobody owes it and that it is waiting for it. Each is one line to
 * delete, in a file the author has just edited.
 */
const waitsOnSpecs = (change) =>
  (change.awaiting ?? []).some((one) => one.artifact === "specs");

export function checkAwaiting(ctx, changes) {
  const declared = new Map();
  for (const change of changes) {
    if (change.status !== "in-flight" || !change.awaiting) continue;
    if (!declared.has(change.schema)) {
      declared.set(
        change.schema,
        schemaArtifacts(ctx.roots.store, change.schema),
      );
    }
    const artifacts = declared.get(change.schema);
    // A schema this store does not define lives inside the CLI; nothing here
    // can say which artifacts it declares, so nothing is claimed about it.
    if (artifacts === undefined) continue;
    const known = new Set(artifacts.map((one) => one.id));
    const written = new Set(change.written);
    const waived = waiverLineOf(artifacts, change);
    for (const { artifact } of change.awaiting) {
      const file = fileOf(change, ".openspec.yaml");
      if (!known.has(artifact)) {
        ctx.add(
          "awaiting",
          file,
          `waits on \`${artifact}\`, which the \`${change.schema}\` schema does not declare — name one of ${[...known].map((one) => `\`${one}\``).join(", ")}`,
        );
      } else if (written.has(artifact)) {
        ctx.add(
          "awaiting",
          file,
          `waits on \`${artifact}\`, which this change has written — the wait is over, so delete the line`,
        );
      } else if (waived.has(artifact)) {
        ctx.add(
          "awaiting",
          file,
          `waives \`${artifact}\` with \`${waived.get(artifact)}\` and waits on it — one line says nobody owes it, the other that somebody does; drop whichever is untrue`,
        );
      }
    }
  }
}

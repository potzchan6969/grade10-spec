import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import YAML from "yaml";
import {
  outline,
  sectionSpan,
} from "../../../tools/manual/src/store/markdown.mts";
import {
  deltaKindOf,
  deltaRequirementSections,
  deltaSections,
  renamedPairs,
} from "../../../tools/manual/src/store/read-changes.mts";

const HASH = (value) => createHash("sha256").update(value).digest("hex");
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const CONTRACT_NAMES = new Set([
  "proposal.md",
  "decisions.md",
  "ui-design.md",
  "tech-design.md",
  "user-journeys.md",
  "feature-tcs.md",
  "domain-tcs.md",
  "product-tcs.md",
  "platform-tcs.md",
  "spec.md",
  "tasks.md",
]);
const COMPANIONS = new Set([
  "user-journeys.md",
  "feature-tcs.md",
  "domain-tcs.md",
  "product-tcs.md",
  "platform-tcs.md",
]);

/** The suites and journeys that publish with one capability's delta: the
 * companions beside it, then the domain suite one level up and the product
 * suite two levels up, where the change carries them beside its specs. Each
 * names the directory under `specs/` its durable copy lands in. */
function companionsOf(deltaDir, capability) {
  const found = [...COMPANIONS].map((name) => ({
    name,
    source: join(deltaDir, name),
    dir: capability,
  }));
  const domain = dirname(capability);
  const product = dirname(domain);
  if (domain !== ".")
    found.push({
      name: "domain-tcs.md",
      source: join(dirname(deltaDir), "domain-tcs.md"),
      dir: domain,
    });
  if (product !== ".")
    found.push({
      name: "product-tcs.md",
      source: join(dirname(dirname(deltaDir)), "product-tcs.md"),
      dir: product,
    });
  return found.filter((one) => existsSync(one.source));
}

function walkFiles(root, dir, found = []) {
  if (!existsSync(dir)) return found;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const file = join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(root, file, found);
    else if (CONTRACT_NAMES.has(entry.name))
      found.push(relative(root, file).replaceAll("\\", "/"));
  }
  return found;
}

function sectionContent(text, anchor) {
  const roots = outline(text);
  const slug = (value) =>
    value
      .toLowerCase()
      .replace(/[^\p{L}\p{N} -]/gu, "")
      .trim()
      .replace(/[\s-]+/g, "-");
  const all = [];
  const visit = (sections) =>
    sections.forEach((section) => {
      if (slug(section.heading) === anchor) all.push(section);
      visit(section.children);
    });
  visit(roots);
  if (all.length === 0) return null;
  const section = all[0];
  const span = sectionSpan(
    text,
    section.heading,
    section.level === 1 ? roots : undefined,
  );
  // `sectionSpan` searches top-level headings; use the outline's complete raw
  // block for nested sections so unrelated PRD decisions stay out of scope.
  return `${"#".repeat(section.level)} ${section.heading}\n${section.raw ? `\n${section.raw}` : ""}`;
}

function changeContractPaths(root, changeId) {
  return walkFiles(root, join(root, "openspec", "changes", changeId))
    .filter(
      (path) => !path.endsWith("/tasks.md") && !path.endsWith("/rounds.md"),
    )
    .sort();
}

function canonicalPlanningContent(path, text) {
  if (path.endsWith("/tasks.md"))
    return text
      .replace(/^([ \t]*-[ \t]*)\[[ xX]\]/gm, "$1[ ]")
      .replace(/[ \t]+\(owner:\s*[^)]+\)/gi, "")
      .replace(/[ \t]+\*\*Owner:\*\*\s*[^\n]+/gi, "");
  if (!/(?:feature|domain|product|platform)-tcs\.md$/.test(path)) return text;
  return text
    .split("\n")
    .filter(
      (line) =>
        !/^\*\*Status:\*\*/.test(line) &&
        !/^\*\*Drafts styled:\*\*/.test(line) &&
        !/^\s*\* \*\*Status:\*\*/.test(line) &&
        !/^\s*\* \*\*Automation status:\*\*/.test(line),
    )
    .join("\n")
    .replace(/\n{3,}/g, "\n\n");
}

function prdReferences(root, sourcePaths) {
  const refs = new Map();
  for (const path of sourcePaths) {
    const text = readFileSync(join(root, path), "utf8");
    for (const match of text.matchAll(/docs\/prds\/[\w./-]+\.md#([\w-]+)/g)) {
      const file = match[0].split("#")[0];
      const anchor = match[1];
      if (!existsSync(join(root, file))) continue;
      refs.set(`${file}${anchor ? `#${anchor}` : ""}`, { file, anchor });
    }
  }
  return [...refs.values()];
}

function durableFor(root, capability, filename) {
  return join(root, "openspec", "specs", capability, filename);
}

function requirementBlocks(text) {
  const top = outline(text).find((section) => section.level === 1);
  const requirements = top?.children.find(
    (section) => section.heading === "Requirements",
  );
  return new Map(
    (requirements?.children ?? [])
      .filter((section) => /^Requirement:\s*/i.test(section.heading))
      .map((section) => [
        section.heading.replace(/^Requirement:\s*/i, "").trim(),
        section,
      ]),
  );
}

function renderRequirement(
  section,
  name = section.heading.replace(/^Requirement:\s*/i, ""),
) {
  const body = section.raw;
  return `### Requirement: ${name}${body ? `\n\n${body}` : ""}`;
}

function rootSections(text) {
  const heading = outline(text).find((section) => section.level === 1);
  return { heading: heading?.heading ?? "", sections: heading?.children ?? [] };
}

function documentSections(text) {
  const roots = outline(text);
  const title = roots.find((section) => section.level === 1);
  return title ? title.children : roots;
}

function renderSection(section) {
  return `${"#".repeat(section.level)} ${section.heading}${section.raw ? `\n\n${section.raw}` : ""}`;
}

function sectionByName(sections, name) {
  return sections.find((section) => section.heading === name);
}

function usId(heading) {
  return /([a-z0-9][a-z0-9-]*-US-\d+[a-z]?)/i.exec(heading)?.[1] ?? null;
}

function mergeJourneys(currentText, deltaText, changeId, capability) {
  if (/\*\*Walked by:\*\*/.test(deltaText)) return currentText ?? deltaText;
  const current = currentText ?? deltaText;
  const currentDoc = rootSections(current);
  const deltaDoc = { heading: "", sections: documentSections(deltaText) };
  const currentJourneySection = sectionByName(
    currentDoc.sections,
    "User journeys",
  );
  const live = new Map(
    (currentJourneySection?.children ?? [])
      .filter((section) => usId(section.heading))
      .map((section) => [usId(section.heading), section]),
  );
  const retired = new Set(readRetiredIds(currentDoc.sections));
  const deltaHeld = [
    "User journeys",
    "Context user journeys",
    "ADDED User journeys",
    "MODIFIED User journeys",
  ]
    .map((name) => sectionByName(deltaDoc.sections, name))
    .filter(Boolean);
  const deltaIds = new Set();
  for (const section of deltaHeld) {
    for (const journey of section.children) {
      const id = usId(journey.heading);
      if (!id) continue;
      if (deltaIds.has(id))
        throw new Error(
          `${capability}: journey ${id} appears more than once in its delta`,
        );
      deltaIds.add(id);
      live.set(id, journey);
      retired.delete(id);
    }
  }
  const removed = sectionByName(deltaDoc.sections, "REMOVED User journeys");
  for (const journey of removed?.children ?? []) {
    const id = usId(journey.heading);
    if (!id || !live.has(id))
      throw new Error(
        `${capability}: removed journey ${id ?? journey.heading} is not in the accepted baseline`,
      );
    live.delete(id);
    retired.add(id);
  }
  const rendered = [];
  rendered.push(`# ${currentDoc.heading || deltaDoc.heading || capability}`);
  rendered.push("## User journeys");
  for (const journey of live.values()) rendered.push(renderSection(journey));
  if (retired.size > 0) {
    rendered.push("## Retired");
    const oldRetired = sectionByName(currentDoc.sections, "Retired");
    const priorLines =
      oldRetired?.raw.split("\n").filter((line) => line.trim() !== "") ?? [];
    const known = new Set(
      priorLines
        .map((line) => /([a-z0-9][a-z0-9-]*-US-\d+[a-z]?)/i.exec(line)?.[1])
        .filter(Boolean),
    );
    for (const id of retired)
      if (!known.has(id))
        priorLines.push(`- \`${id}\` - Retired by ${changeId}.`);
    rendered.push(priorLines.join("\n"));
  }
  return `${rendered.join("\n\n")}\n`;
}

function readRetiredIds(sections) {
  const retired = sectionByName(sections, "Retired");
  return [...(retired?.raw.match(/[a-z0-9][a-z0-9-]*-US-\d+[a-z]?/gi) ?? [])];
}

function mergeFeatureSet(currentSpec, deltaText, capability, priorText) {
  const deltaFeature = sectionByName(
    rootSections(deltaText).sections,
    "Feature set",
  );
  if (!deltaFeature) return currentSpec;
  const currentFeature = sectionByName(
    rootSections(currentSpec).sections,
    "Feature set",
  );
  if (!currentFeature) {
    return `${currentSpec.replace(/\n*$/, "\n\n")}## Feature set${deltaFeature.raw ? `\n\n${deltaFeature.raw}` : ""}\n`;
  }
  if (priorText) {
    const priorFeature = sectionByName(
      rootSections(priorText).sections,
      "Feature set",
    );
    if (currentFeature?.raw !== priorFeature?.raw)
      throw new Error(
        `${capability}: accepted Feature set changed since this amendment began; rebase the delta before acceptance`,
      );
  }
  const splitGroups = (raw) => {
    const groups = new Map();
    let current = null;
    for (const line of raw.split("\n")) {
      if (/^-\s+/.test(line)) {
        current = line.trim();
        if (!groups.has(current)) groups.set(current, []);
      } else if (current && line.trim() !== "") groups.get(current).push(line);
    }
    return groups;
  };
  const baseGroups = splitGroups(currentFeature?.raw ?? "");
  const deltaGroups = splitGroups(deltaFeature.raw);
  if (deltaGroups.size === 0) {
    if (deltaFeature.raw.trim() === currentFeature.raw.trim())
      return currentSpec;
    throw new Error(
      `${capability}: cannot safely merge this Feature set; use its bullet-group form or rebase a complete compatible result`,
    );
  }
  for (const [group, children] of deltaGroups) {
    if (!baseGroups.has(group)) baseGroups.set(group, []);
    const known = new Set(baseGroups.get(group).map((line) => line.trim()));
    for (const line of children)
      if (!known.has(line.trim())) baseGroups.get(group).push(line);
  }
  const body = [...baseGroups]
    .map(([group, children]) => [group, ...children].join("\n"))
    .join("\n");
  const rendered = `## Feature set\n\n${body}`;
  const span = sectionSpan(currentSpec, "Feature set");
  if (!span) return `${currentSpec.replace(/\n*$/, "\n\n")}${rendered}\n`;
  const lines = currentSpec.split("\n");
  lines.splice(
    span.from - 1,
    span.until - (span.from - 1),
    ...rendered.split("\n"),
  );
  return `${lines.join("\n").replace(/\n*$/, "\n")} `.trimEnd();
}

function mergePurpose(currentSpec, deltaPurpose, capability, priorText) {
  if (!deltaPurpose) return currentSpec;
  const currentPurpose = sectionByName(
    rootSections(currentSpec).sections,
    "Purpose",
  );
  if (priorText) {
    const priorPurpose = sectionByName(
      rootSections(priorText).sections,
      "Purpose",
    );
    if (currentPurpose?.raw !== priorPurpose?.raw) {
      throw new Error(
        `${capability}: accepted Purpose changed since this amendment began; rebase the delta before acceptance`,
      );
    }
  }
  const rendered = `## Purpose${deltaPurpose.raw ? `\n\n${deltaPurpose.raw}` : ""}`;
  const span = sectionSpan(currentSpec, "Purpose");
  if (!span) return `${currentSpec.replace(/\n*$/, "\n\n")}${rendered}\n`;
  const lines = currentSpec.split("\n");
  lines.splice(
    span.from - 1,
    span.until - (span.from - 1),
    ...rendered.split("\n"),
  );
  return `${lines
    .join("\n")
    .replace(/([^\n])\n(##\s)/g, "$1\n\n$2")
    .replace(/\n*$/, "\n")}`;
}

function validatedRenamedPairs(section, capability) {
  const froms = [
    ...section.raw.matchAll(
      /^\s*-?\s*FROM:\s*`?###\s*Requirement:\s*(.+?)`?\s*$/gim,
    ),
  ].map((match) => match[1]);
  const tos = [
    ...section.raw.matchAll(
      /^\s*-?\s*TO:\s*`?###\s*Requirement:\s*(.+?)`?\s*$/gim,
    ),
  ].map((match) => match[1]);
  const pairs = renamedPairs(section.raw);
  if (
    froms.length === 0 ||
    tos.length === 0 ||
    pairs.length !== froms.length ||
    pairs.length !== tos.length
  ) {
    throw new Error(
      `${capability}: every RENAMED Requirements entry needs one complete FROM/TO pair`,
    );
  }
  if (
    new Set(froms).size !== froms.length ||
    new Set(tos).size !== tos.length ||
    pairs.some(({ from, to }) => from === to)
  ) {
    throw new Error(
      `${capability}: RENAMED Requirements entries must have unique, distinct FROM and TO names`,
    );
  }
  const replacements = new Set(
    deltaRequirementSections(section).map((one) => one.name),
  );
  for (const { to } of pairs) {
    if (!replacements.has(to))
      throw new Error(
        `${capability}: rename target ${to} needs its complete Requirement block`,
      );
  }
  return pairs;
}

function mergeSuite(currentText, deltaText, capability) {
  if (currentText === null || currentText === undefined) return deltaText;
  if (currentText === deltaText) return currentText;
  const current = currentText ?? deltaText;
  const currentDoc = rootSections(current);
  const deltaDoc = { heading: "", sections: documentSections(deltaText) };
  const journeyHeading = /^.+-US-?\d+\b/i;
  const currentGroups = new Map(
    currentDoc.sections
      .filter(
        (section) =>
          section.level === 2 && journeyHeading.test(section.heading),
      )
      .map((section) => [section.heading, section]),
  );
  const isCase = (section) => /-TC\d+-\d+\b/i.test(section.heading);
  for (const incoming of deltaDoc.sections.filter(
    (section) => section.level === 2 && journeyHeading.test(section.heading),
  )) {
    const existing = currentGroups.get(incoming.heading);
    const cases = new Map(
      (existing?.children ?? [])
        .filter(isCase)
        .map((one) => [one.heading, one]),
    );
    for (const testCase of incoming.children.filter(isCase))
      cases.set(testCase.heading, testCase);
    const rendered = [`## ${incoming.heading}`, incoming.body.trim()].filter(
      Boolean,
    );
    for (const testCase of cases.values())
      rendered.push(renderSection(testCase));
    currentGroups.set(incoming.heading, { render: rendered.join("\n\n") });
  }
  if (currentGroups.size === 0) {
    // Unknown suite shapes are unsafe to replace. A conflict must be resolved
    // by preparing a complete suite before acceptance.
    throw new Error(
      `${capability}: cannot safely merge this test-case suite; include the complete resulting suite in the change`,
    );
  }
  const headerEnd = Math.min(
    ...currentDoc.sections.map((section) => section.line),
    current.split("\n").length + 1,
  );
  const header = current
    .split("\n")
    .slice(0, headerEnd - 1)
    .join("\n")
    .trimEnd();
  const groups = [...currentGroups.values()].map(
    (section) => section.render ?? renderSection(section),
  );
  const endings = [];
  for (const name of ["Settled", "Reconciliation", "Out of suite"]) {
    const old = sectionByName(currentDoc.sections, name);
    const next = sectionByName(deltaDoc.sections, name);
    if (!old && !next) continue;
    const lines = [
      ...new Set(
        [
          ...(old?.raw.split("\n") ?? []),
          ...(next?.raw.split("\n") ?? []),
        ].filter((line) => line.trim() !== ""),
      ),
    ];
    endings.push(`## ${name}\n\n${lines.join("\n")}`);
  }
  return `${header}${groups.length ? `\n\n${groups.join("\n\n")}` : ""}${endings.length ? `\n\n${endings.join("\n\n")}` : ""}\n`;
}

function foldOne(durablePath, deltaText, capability, priorText = null) {
  const durableExists = existsSync(durablePath);
  let durable = durableExists ? readFileSync(durablePath, "utf8") : "";
  const delta = outline(deltaText).find((section) => section.level === 1);
  if (!delta) throw new Error(`${capability}: delta has no title`);
  if (!durableExists) durable = `# ${delta.heading}\n`;
  const durableTop = outline(durable).find((section) => section.level === 1);
  const deltaPurpose = delta.children.find(
    (section) => section.heading === "Purpose",
  );
  const existingPurpose = durableTop?.children.find(
    (section) => section.heading === "Purpose",
  );
  if (!existingPurpose && !deltaPurpose)
    throw new Error(
      `${capability}: new durable spec needs a Purpose section before acceptance`,
    );
  durable = mergePurpose(durable, deltaPurpose, capability, priorText);
  const deltaFeatureSet = delta.children.find(
    (section) => section.heading === "Feature set",
  );
  if (deltaFeatureSet)
    durable = mergeFeatureSet(durable, deltaText, capability, priorText);
  const requirements = new Map(requirementBlocks(durable));
  const priorRequirements =
    priorText === null ? new Map() : requirementBlocks(priorText);
  const sameRequirement = (left, right) => left?.raw === right?.raw;
  const sections = deltaSections(deltaText);
  for (const section of sections) {
    const kind = deltaKindOf(section.heading);
    if (!kind) continue;
    if (kind === "renamed") {
      for (const { from, to } of validatedRenamedPairs(section, capability)) {
        const replacement = deltaRequirementSections(section).find(
          (one) => one.name === to,
        )?.block;
        if (!requirements.has(from) || !replacement)
          throw new Error(`${capability}: cannot fold rename ${from} to ${to}`);
        if (
          priorText !== null &&
          !sameRequirement(requirements.get(from), priorRequirements.get(from))
        )
          throw new Error(
            `${capability}: accepted requirement ${from} changed since this amendment began; resolve the conflict before acceptance`,
          );
        requirements.delete(from);
        requirements.set(to, replacement);
      }
      continue;
    }
    for (const { name, block } of deltaRequirementSections(section)) {
      if (kind === "added" && requirements.has(name)) {
        if (
          priorText === null ||
          !priorRequirements.has(name) ||
          !sameRequirement(requirements.get(name), priorRequirements.get(name))
        )
          throw new Error(
            `${capability}: added requirement already exists or changed since the accepted baseline: ${name}`,
          );
        // A changed already-accepted requirement is an amendment to the pinned
        // contract. Replacing its prior text is safe only while that requirement
        // itself has not advanced independently.
      }
      if (
        (kind === "modified" || kind === "removed") &&
        !requirements.has(name)
      )
        throw new Error(
          `${capability}: ${kind} requirement does not exist: ${name}`,
        );
      if (
        priorText !== null &&
        (kind === "modified" || kind === "removed") &&
        !sameRequirement(requirements.get(name), priorRequirements.get(name))
      )
        throw new Error(
          `${capability}: accepted requirement ${name} changed since this amendment began; resolve the conflict before acceptance`,
        );
      if (kind === "removed") requirements.delete(name);
      else requirements.set(name, block);
    }
  }
  const body = [...requirements]
    .map(([name, block]) => renderRequirement(block, name))
    .join("\n\n");
  const span = sectionSpan(durable, "Requirements");
  if (span) {
    const lines = durable.split("\n");
    lines.splice(
      span.from,
      span.until - span.from,
      ...(body ? ["", body] : []),
    );
    durable = lines.join("\n").replace(/\n*$/, "\n");
  } else {
    durable = `${durable.replace(/\n*$/, "\n\n")}## Requirements\n\n${body}\n`;
  }
  return durable;
}

function previousDurableSnapshots(root, changeId) {
  const current = join(
    root,
    "openspec",
    "changes",
    changeId,
    "acceptance.json",
  );
  if (!existsSync(current)) return new Map();
  try {
    const accepted = JSON.parse(readFileSync(current, "utf8"));
    const file = join(
      root,
      "openspec",
      "changes",
      changeId,
      "acceptance",
      `${accepted.fingerprint}.snapshots.json`,
    );
    if (!existsSync(file)) return new Map();
    const snapshots = JSON.parse(readFileSync(file, "utf8"));
    return new Map(
      (snapshots.files ?? [])
        .filter((entry) => entry.role === "durable-result")
        .map((entry) => [
          entry.path,
          Buffer.from(entry.contentBase64, "base64").toString("utf8"),
        ]),
    );
  } catch {
    return new Map();
  }
}

function contractOutputs(root, changeId) {
  const dir = join(root, "openspec", "changes", changeId);
  const deltas = walkFiles(root, join(dir, "specs"))
    .filter((path) => path.endsWith("/spec.md"))
    .sort();
  const outputs = new Map();
  const prior = previousDurableSnapshots(root, changeId);
  for (const path of deltas) {
    const relativeCapability = path
      .slice(`openspec/changes/${changeId}/specs/`.length)
      .replace(/\/spec\.md$/, "");
    const target = durableFor(root, relativeCapability, "spec.md");
    const targetRel = relative(root, target).replaceAll("\\", "/");
    const folded = foldOne(
      target,
      readFileSync(join(root, path), "utf8"),
      relativeCapability,
      prior.get(targetRel) ?? null,
    );
    outputs.set(targetRel, folded);
    const sourceDir = dirname(join(root, path));
    for (const { name, source, dir } of companionsOf(
      sourceDir,
      relativeCapability,
    )) {
      const targetPath = durableFor(root, dir, name);
      const targetKey = relative(root, targetPath).replaceAll("\\", "/");
      if (outputs.has(targetKey)) continue;
      const currentText = existsSync(targetPath)
        ? readFileSync(targetPath, "utf8")
        : null;
      const sourceText = readFileSync(source, "utf8");
      const merged =
        name === "user-journeys.md"
          ? mergeJourneys(currentText, sourceText, changeId, relativeCapability)
          : mergeSuite(currentText, sourceText, dir);
      outputs.set(targetKey, merged);
    }
  }
  return outputs;
}

function targetPathOf(changeId, deltaSpecPath, filename = "spec.md") {
  const capability = deltaSpecPath
    .slice(`openspec/changes/${changeId}/specs/`.length)
    .replace(/\/spec\.md$/, "");
  return `openspec/specs/${capability}/${filename}`;
}

/**
 * The accepted change declares the small part of the durable contract its
 * implementation owns. A claim records this list beside the store commit it
 * starts from, so an unrelated capability advance cannot make an archive
 * ambiguous. `anchors: []` deliberately means the file as a whole: journeys,
 * suites, and UI design have no requirement-level identity to compare.
 */
export function contractTargets(root, changeId) {
  const changeDir = join(root, "openspec", "changes", changeId);
  const targets = [];
  const deltas = walkFiles(root, join(changeDir, "specs"))
    .filter((path) => path.endsWith("/spec.md"))
    .sort();
  for (const deltaPath of deltas) {
    const deltaText = readFileSync(join(root, deltaPath), "utf8");
    const delta = outline(deltaText).find((section) => section.level === 1);
    const anchors = new Set();
    if (delta?.children.some((section) => section.heading === "Purpose"))
      anchors.add("Purpose");
    if (delta?.children.some((section) => section.heading === "Feature set"))
      anchors.add("Feature set");
    for (const section of deltaSections(deltaText)) {
      const kind = deltaKindOf(section.heading);
      if (!kind) continue;
      if (kind === "renamed") {
        for (const { from, to } of validatedRenamedPairs(section, deltaPath)) {
          anchors.add(`Requirement: ${from}`);
          anchors.add(`Requirement: ${to}`);
        }
        continue;
      }
      for (const { name } of deltaRequirementSections(section))
        anchors.add(`Requirement: ${name}`);
    }
    targets.push({
      path: targetPathOf(changeId, deltaPath),
      anchors: [...anchors].sort(),
    });
    const capability = deltaPath
      .slice(`openspec/changes/${changeId}/specs/`.length)
      .replace(/\/spec\.md$/, "");
    for (const { name, dir } of companionsOf(
      dirname(join(root, deltaPath)),
      capability,
    )) {
      const path = `openspec/specs/${dir}/${name}`;
      if (targets.some((one) => one.path === path)) continue;
      targets.push({ path, anchors: [] });
    }
  }
  if (existsSync(join(changeDir, "ui-design.md"))) {
    targets.push({
      path: `openspec/changes/${changeId}/ui-design.md`,
      anchors: [],
    });
  }
  return targets.sort((left, right) => left.path.localeCompare(right.path));
}

function validTargets(targets, changeId = null) {
  if (!Array.isArray(targets)) return false;
  const paths = new Set();
  for (const target of targets) {
    if (
      !target ||
      typeof target.path !== "string" ||
      target.path === "" ||
      !Array.isArray(target.anchors)
    )
      return false;
    const allowed =
      target.path.startsWith("openspec/specs/") ||
      target.path === `openspec/changes/${changeId}/ui-design.md`;
    if (
      paths.has(target.path) ||
      !allowed ||
      target.anchors.some(
        (anchor) => typeof anchor !== "string" || anchor.trim() === "",
      ) ||
      new Set(target.anchors).size !== target.anchors.length
    )
      return false;
    paths.add(target.path);
  }
  return true;
}

function sectionNamed(text, name) {
  const found = [];
  const visit = (sections) =>
    sections.forEach((section) => {
      if (section.heading === name) found.push(section);
      visit(section.children);
    });
  visit(outline(text));
  if (found.length !== 1) return null;
  return renderSection(found[0]);
}

/** The selected target content at one store revision. `null` also represents
 * a removed selected heading, which makes a removal observable at archive. */
export function targetContent(text, target) {
  if (text === null) return null;
  if (target.anchors.length === 0) return String(text);
  return JSON.stringify(
    target.anchors.map((anchor) => ({
      anchor,
      content: sectionNamed(String(text), anchor),
    })),
  );
}

export function contractTargetDiffs(targets, baselineText, currentText) {
  const differences = [];
  for (const target of targets) {
    const before = baselineText(target.path);
    const after = currentText(target.path);
    if (target.anchors.length === 0) {
      if (targetContent(before, target) !== targetContent(after, target))
        differences.push({ path: target.path, anchors: [] });
      continue;
    }
    for (const anchor of target.anchors) {
      const scoped = { ...target, anchors: [anchor] };
      if (targetContent(before, scoped) !== targetContent(after, scoped))
        differences.push({ path: target.path, anchors: [anchor] });
    }
  }
  return differences;
}

export function acceptanceReadiness(root, changeId) {
  const dir = join(root, "openspec", "changes", changeId);
  const errors = [];
  const required = [
    "proposal.md",
    "decisions.md",
    "tasks.md",
    ".openspec.yaml",
  ];
  for (const file of required)
    if (!existsSync(join(dir, file)))
      errors.push(
        `required artifact is missing: openspec/changes/${changeId}/${file}`,
      );
  const record = existsSync(join(dir, ".openspec.yaml"))
    ? readFileSync(join(dir, ".openspec.yaml"), "utf8")
    : "";
  let manifest = {};
  try {
    manifest = YAML.parse(record) ?? {};
    if (
      manifest.awaiting &&
      Object.values(manifest.awaiting).some(
        (value) =>
          value !== null &&
          value !== "" &&
          (!Array.isArray(value) || value.length > 0),
      )
    )
      errors.push("the change still has an awaiting artifact");
  } catch {
    errors.push(".openspec.yaml cannot be parsed");
  }
  if (
    !existsSync(join(dir, "tech-design.md")) &&
    !/^design_waived:\s*\S/m.test(record)
  )
    errors.push(
      "tech-design.md or an explicit design waiver is required before acceptance",
    );
  const specDir = join(dir, "specs");
  const deltas = walkFiles(root, specDir).filter((path) =>
    path.endsWith("/spec.md"),
  );
  if (deltas.length === 0 && manifest.skip_specs !== true)
    errors.push("there are no delta specs to accept");
  for (const path of deltas) {
    const capabilityDir = dirname(join(root, path));
    for (const file of ["user-journeys.md", "feature-tcs.md"]) {
      if (!existsSync(join(capabilityDir, file)))
        errors.push(
          `${path.replace(/\/spec\.md$/, `/${file}`)} is required before acceptance`,
        );
    }
    const suitePath = join(capabilityDir, "feature-tcs.md");
    if (existsSync(suitePath)) {
      const suite = readFileSync(suitePath, "utf8");
      const reconciliation = sectionSpan(suite, "Reconciliation");
      const body = reconciliation
        ? suite
            .split("\n")
            .slice(reconciliation.from, reconciliation.until)
            .join("\n")
            .replace(/<!--[\s\S]*?-->/g, "")
            .trim()
        : "";
      if (
        !reconciliation ||
        body === "" ||
        /^\s*\|\s*(?:Raised|Disposition|Question)\s*\|/im.test(body) ||
        /^\s*\|\s*<!--/m.test(
          suite
            .split("\n")
            .slice(reconciliation.from, reconciliation.until)
            .join("\n"),
        )
      )
        errors.push(
          `${relative(root, suitePath)} needs a completed ## Reconciliation with dispositions before acceptance`,
        );
    }
  }
  const sourcePaths = changeContractPaths(root, changeId);
  const prds = prdReferences(root, sourcePaths);
  const scoped = sourcePaths.map((path) => [
    path,
    canonicalPlanningContent(path, readFileSync(join(root, path), "utf8")),
  ]);
  for (const { file, anchor } of prds) {
    const page = readFileSync(join(root, file), "utf8");
    const section = sectionContent(page, anchor);
    if (section === null)
      errors.push(`${file} has no section matching #${anchor}`);
    else scoped.push([`${file}#${anchor}`, section]);
  }
  const unresolved = (content) => {
    const visible = content
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/```[\s\S]*?```|~~~[\s\S]*?~~~/g, "")
      .replace(/`[^`]*`/g, "");
    return /(?:\bTBC\b|❓)/iu.test(visible);
  };
  for (const [path, content] of scoped)
    if (unresolved(content))
      errors.push(`${path} still carries an unresolved TBC or ❓ decision`);
  const decisionsPath = join(dir, "decisions.md");
  if (existsSync(decisionsPath)) {
    const decisions = readFileSync(decisionsPath, "utf8");
    const raised = sectionSpan(decisions, "Raised");
    if (raised) {
      const body = decisions
        .split("\n")
        .slice(raised.from, raised.until)
        .join("\n");
      const rows = body
        .split("\n")
        .filter(
          (line) =>
            /^\s*\|/.test(line) && !/^\s*\|\s*(?:Capability|---)/.test(line),
        );
      if (
        rows.some(
          (line) =>
            /<!--|(?:\bTBC\b|❓)/iu.test(line) ||
            line
              .split("|")
              .slice(1, -1)
              .some((cell) => cell.trim() === ""),
        )
      )
        errors.push("decisions.md ## Raised still has an unanswered row");
    }
  }
  return errors;
}

function baselineOf(root, outputs) {
  return [...outputs.keys()].sort().map((path) => ({
    path,
    sha256: existsSync(join(root, path))
      ? HASH(readFileSync(join(root, path)))
      : null,
  }));
}

export function baselineFingerprint(baseline) {
  return HASH(json([...baseline].sort((a, b) => a.path.localeCompare(b.path))));
}

function fingerprintArtifacts(root, changeId, outputs) {
  const sourcePaths = changeContractPaths(root, changeId);
  const snapshots = [];
  const artifacts = sourcePaths.map((path) => ({
    path,
    sha256: HASH(
      canonicalPlanningContent(path, readFileSync(join(root, path), "utf8")),
    ),
    role: "change-input",
  }));
  for (const path of sourcePaths)
    snapshots.push({
      path,
      role: "change-input",
      content: readFileSync(join(root, path), "utf8"),
    });
  for (const [path, content] of outputs) {
    artifacts.push({
      path,
      sha256: HASH(canonicalPlanningContent(path, content)),
      role: "durable-result",
    });
    snapshots.push({ path, role: "durable-result", content });
  }
  for (const { file, anchor } of prdReferences(root, sourcePaths)) {
    const text = readFileSync(join(root, file), "utf8");
    const selected = anchor ? sectionContent(text, anchor) : text;
    if (selected === null)
      throw new Error(`${file} has no section matching #${anchor}`);
    const path = anchor ? `${file}#${anchor}` : file;
    artifacts.push({ path, sha256: HASH(selected), role: "prd-source" });
    snapshots.push({ path, role: "prd-source", content: selected });
  }
  return {
    artifacts: artifacts.sort(
      (a, b) => a.path.localeCompare(b.path) || a.role.localeCompare(b.role),
    ),
    snapshots: snapshots.sort(
      (a, b) => a.path.localeCompare(b.path) || a.role.localeCompare(b.role),
    ),
  };
}

export function prepareAcceptance(root, changeId) {
  const readiness = acceptanceReadiness(root, changeId);
  if (readiness.length > 0)
    throw new Error(
      `Acceptance is blocked:\n${readiness.map((line) => `- ${line}`).join("\n")}`,
    );
  const outputs = contractOutputs(root, changeId);
  const { artifacts, snapshots } = fingerprintArtifacts(
    root,
    changeId,
    outputs,
  );
  const targets = contractTargets(root, changeId);
  const identity = {
    version: 2,
    change: changeId,
    artifacts,
    contractTargets: targets,
  };
  return {
    root,
    changeId,
    outputs,
    baseline: baselineOf(root, outputs),
    baselineFingerprint: baselineFingerprint(baselineOf(root, outputs)),
    artifacts,
    snapshots,
    contractTargets: targets,
    fingerprint: HASH(json(identity)),
  };
}

function acceptedChangeDir(root, changeId) {
  const active = join(root, "openspec", "changes", changeId);
  if (existsSync(join(active, "acceptance.json"))) return active;
  const archive = join(root, "openspec", "changes", "archive");
  if (!existsSync(archive)) return active;
  const match = readdirSync(archive, { withFileTypes: true })
    .filter(
      (entry) => entry.isDirectory() && entry.name.endsWith(`-${changeId}`),
    )
    .map((entry) => join(archive, entry.name))
    .find((path) => existsSync(join(path, "acceptance.json")));
  return match ?? active;
}

export function verifyAcceptance(
  root,
  changeId,
  { requireImplementation = false, readFile = null } = {},
) {
  const dir = acceptedChangeDir(root, changeId);
  const read = (path) => {
    if (readFile) return readFile(relative(root, path).replaceAll("\\", "/"));
    return existsSync(path) ? readFileSync(path) : null;
  };
  const currentPath = join(dir, "acceptance.json");
  const currentBytes = read(currentPath);
  if (currentBytes === null)
    return {
      ok: false,
      errors: [`${changeId} has no acceptance.json`],
      acceptance: null,
      fingerprint: null,
    };
  let acceptance;
  try {
    acceptance = JSON.parse(String(currentBytes));
  } catch {
    return {
      ok: false,
      errors: ["acceptance.json is not valid JSON"],
      acceptance: null,
      fingerprint: null,
    };
  }
  const errors = [];
  if (
    ![1, 2].includes(acceptance.version) ||
    acceptance.change !== changeId ||
    typeof acceptance.fingerprint !== "string"
  )
    errors.push("acceptance.json has an unsupported or mismatched identity");
  if (!/^[a-f0-9]{64}$/.test(acceptance.baseline ?? ""))
    errors.push("acceptance.json has an invalid review baseline");
  if (
    !Array.isArray(acceptance.artifacts) ||
    acceptance.artifacts.some(
      (artifact) =>
        typeof artifact.path !== "string" ||
        !/^[a-f0-9]{64}$/.test(artifact.sha256 ?? "") ||
        !["change-input", "durable-result", "prd-source"].includes(
          artifact.role,
        ),
    )
  )
    errors.push("acceptance artifact manifest is malformed");
  if (
    acceptance.version === 2 &&
    !validTargets(acceptance.contractTargets, changeId)
  )
    errors.push("acceptance.json has an invalid contract target list");
  const identity =
    acceptance.version === 2
      ? {
          version: 2,
          change: changeId,
          artifacts: acceptance.artifacts,
          contractTargets: acceptance.contractTargets,
        }
      : { version: 1, change: changeId, artifacts: acceptance.artifacts };
  const calculated = HASH(json(identity));
  if (calculated !== acceptance.fingerprint)
    errors.push("acceptance fingerprint does not match its artifact manifest");
  const historyPath = join(dir, "acceptance", `${acceptance.fingerprint}.json`);
  const historyBytes = read(historyPath);
  if (historyBytes === null)
    errors.push("immutable acceptance history record is missing");
  else if (String(historyBytes) !== String(currentBytes))
    errors.push("acceptance.json differs from its immutable history record");
  const snapshotPath = join(
    dir,
    "acceptance",
    `${acceptance.fingerprint}.snapshots.json`,
  );
  const snapshotBytes = read(snapshotPath);
  if (snapshotBytes === null)
    errors.push("immutable acceptance artifact snapshots are missing");
  else {
    try {
      const saved = JSON.parse(String(snapshotBytes));
      const byKey = new Map(
        (saved.files ?? []).map((entry) => [
          `${entry.path}\0${entry.role}`,
          entry,
        ]),
      );
      for (const artifact of acceptance.artifacts ?? []) {
        const snapshot = byKey.get(`${artifact.path}\0${artifact.role}`);
        if (
          !snapshot ||
          snapshot.sha256 !== artifact.sha256 ||
          HASH(
            canonicalPlanningContent(
              artifact.path,
              Buffer.from(snapshot.contentBase64, "base64").toString("utf8"),
            ),
          ) !== artifact.sha256
        )
          errors.push(
            `immutable snapshot is missing or invalid: ${artifact.path}`,
          );
      }
    } catch {
      errors.push("immutable acceptance artifact snapshots are not valid JSON");
    }
  }
  for (const artifact of acceptance.artifacts ?? []) {
    const absolute = resolve(root, artifact.path);
    if (absolute !== resolve(root) && !absolute.startsWith(`${resolve(root)}/`))
      errors.push(`accepted artifact path escapes the store: ${artifact.path}`);
  }
  // v2 snapshots are provenance, not a lock on active planning artifacts.
  // Archive compares the claimed durable-contract targets instead. Retain the
  // v1 check so changes already in flight keep their original verification.
  if (acceptance.version === 1)
    for (const artifact of acceptance.artifacts ?? []) {
      if (artifact.role !== "change-input") continue;
      let bytes = read(join(root, artifact.path));
      if (
        bytes === null &&
        dir.includes(`${join("openspec", "changes", "archive")}`)
      ) {
        const archivedPrefix = relative(root, dir).replaceAll("\\", "/");
        const suffix = artifact.path.replace(
          `openspec/changes/${changeId}/`,
          "",
        );
        bytes = read(join(root, archivedPrefix, suffix));
      }
      if (
        bytes === null ||
        HASH(canonicalPlanningContent(artifact.path, String(bytes))) !==
          artifact.sha256
      )
        errors.push(`accepted input changed: ${artifact.path}`);
    }
  let implementation = null;
  let implementationAcceptance = acceptance;
  if (requireImplementation) {
    const implementationPath = join(dir, "implementation.json");
    const implementationBytes = read(implementationPath);
    if (implementationBytes === null)
      errors.push("implementation.json is required before archive");
    else {
      try {
        implementation = JSON.parse(String(implementationBytes));
        const implementationFingerprint =
          implementation.version === 2
            ? implementation.acceptance?.fingerprint
            : implementation.fingerprint;
        if (
          ![1, 2].includes(implementation.version) ||
          typeof implementationFingerprint !== "string"
        )
          errors.push(
            "implementation.json does not attest an accepted fingerprint",
          );
        if (implementationFingerprint !== acceptance.fingerprint) {
          const historicalBytes = read(
            join(dir, "acceptance", `${implementationFingerprint}.json`),
          );
          try {
            implementationAcceptance = JSON.parse(String(historicalBytes));
            const historicalIdentity =
              implementationAcceptance.version === 2
                ? {
                    version: 2,
                    change: implementationAcceptance.change,
                    artifacts: implementationAcceptance.artifacts,
                    contractTargets: implementationAcceptance.contractTargets,
                  }
                : {
                    version: 1,
                    change: implementationAcceptance.change,
                    artifacts: implementationAcceptance.artifacts,
                  };
            const validHistorical =
              [1, 2].includes(implementationAcceptance.version) &&
              implementationAcceptance.change === changeId &&
              implementationAcceptance.fingerprint ===
                implementationFingerprint &&
              (implementationAcceptance.version === 1 ||
                validTargets(
                  implementationAcceptance.contractTargets,
                  changeId,
                )) &&
              HASH(json(historicalIdentity)) === implementationFingerprint;
            if (!validHistorical) {
              errors.push(
                "implementation.json names an invalid historical acceptance record",
              );
            }
          } catch {
            errors.push(
              "implementation.json does not attest an available current or historical acceptance",
            );
          }
        }
        if (implementation.version === 2) {
          const baseline = implementation.contractBaseline;
          const validBaseline =
            baseline &&
            typeof baseline.repository === "string" &&
            baseline.repository.trim() !== "" &&
            /^[0-9a-f]{40}$/i.test(baseline.commit ?? "") &&
            typeof baseline.capturedAt === "string" &&
            !Number.isNaN(Date.parse(baseline.capturedAt)) &&
            validTargets(baseline.targets, changeId) &&
            implementationAcceptance.version === 2 &&
            JSON.stringify(baseline.targets) ===
              JSON.stringify(implementationAcceptance.contractTargets);
          if (!validBaseline)
            errors.push(
              "implementation.json has no valid claimed contract baseline for the accepted target scope",
            );
        }
        if (
          !Array.isArray(implementation.repositories) ||
          implementation.repositories.length === 0
        )
          errors.push(
            "implementation.json must name at least one verified repository",
          );
        for (const repository of implementation.repositories ?? []) {
          const noRuntime =
            Array.isArray(repository.components) &&
            repository.components.length === 0;
          const validNoRuntime =
            !noRuntime ||
            (repository.scope === "no-runtime" &&
              typeof repository.reason === "string" &&
              repository.reason.trim() !== "");
          if (
            !repository.repository ||
            !/^(?:[0-9a-f]{40}|[0-9a-f]{64})$/i.test(repository.commit ?? "") ||
            !Array.isArray(repository.components) ||
            repository.components.some(
              (component) =>
                typeof component !== "string" || component.trim() === "",
            ) ||
            !validNoRuntime
          )
            errors.push(
              "each implementation repository needs a full commit and verified components; components: [] requires scope: no-runtime and a non-empty reason",
            );
        }
        for (const key of ["withdraws", "replaces"]) {
          if (
            implementation[key] !== undefined &&
            (!Array.isArray(implementation[key]) ||
              implementation[key].some(
                (id) => typeof id !== "string" || id.trim() === "",
              ))
          )
            errors.push(
              `implementation.json ${key} must be an array of change IDs`,
            );
        }
      } catch {
        errors.push("implementation.json is not valid JSON");
      }
    }
  }
  return {
    ok: errors.length === 0,
    errors,
    acceptance,
    implementation,
    implementationAcceptance,
    fingerprint: acceptance.fingerprint,
  };
}

export function writeAcceptance(
  root,
  prepared,
  { reviewedBy, supersedes = null },
) {
  if (!reviewedBy?.trim())
    throw new Error("--reviewed-by needs the reviewer’s name");
  const dir = join(root, "openspec", "changes", prepared.changeId);
  const current = join(dir, "acceptance.json");
  if (existsSync(current)) {
    const prior = JSON.parse(readFileSync(current, "utf8"));
    if (
      prior.fingerprint !== prepared.fingerprint &&
      supersedes !== prior.fingerprint
    ) {
      throw new Error(
        `acceptance changed; pass --supersedes ${prior.fingerprint} to preserve the prior contract explicitly`,
      );
    }
    if (prior.fingerprint === prepared.fingerprint)
      throw new Error("this exact contract is already accepted");
  } else if (supersedes)
    throw new Error("--supersedes was supplied but no prior acceptance exists");
  const now = new Date().toISOString();
  const acceptance = {
    version: 2,
    change: prepared.changeId,
    baseline: prepared.baselineFingerprint,
    fingerprint: prepared.fingerprint,
    reviewedBy: reviewedBy.trim(),
    acceptedAt: now,
    ...(supersedes ? { supersedes } : {}),
    artifacts: prepared.artifacts,
    contractTargets: prepared.contractTargets,
  };
  const history = join(dir, "acceptance", `${prepared.fingerprint}.json`);
  const snapshotsFile = join(
    dir,
    "acceptance",
    `${prepared.fingerprint}.snapshots.json`,
  );
  mkdirSync(dirname(history), { recursive: true });
  if (existsSync(history) || existsSync(snapshotsFile))
    throw new Error(
      `acceptance history already exists for ${prepared.fingerprint}`,
    );
  const snapshots = {
    fingerprint: prepared.fingerprint,
    files: prepared.snapshots.map((entry) => ({
      path: entry.path,
      role: entry.role,
      sha256: prepared.artifacts.find(
        (artifact) =>
          artifact.path === entry.path && artifact.role === entry.role,
      ).sha256,
      contentBase64: Buffer.from(entry.content, "utf8").toString("base64"),
    })),
  };
  writeFileSync(snapshotsFile, json(snapshots), { flag: "wx" });
  writeFileSync(history, json(acceptance), { flag: "wx" });
  writeFileSync(current, json(acceptance));
  return acceptance;
}

export function acceptChange(
  root,
  changeId,
  { reviewedBy, expectedBaseline, supersedes = null, runCommand = null } = {},
) {
  const prepared = prepareAcceptance(root, changeId);
  if (!expectedBaseline)
    throw new Error(
      "--baseline from accept:preflight is required to prevent folding against a changed durable contract",
    );
  if (prepared.baselineFingerprint !== expectedBaseline)
    throw new Error(
      `durable baseline changed since preflight (now ${prepared.baselineFingerprint}); run accept:preflight again and review the result`,
    );
  const backups = new Map();
  const changeDir = join(root, "openspec", "changes", changeId);
  const record = join(changeDir, "acceptance.json");
  const history = join(changeDir, "acceptance", `${prepared.fingerprint}.json`);
  const snapshots = join(
    changeDir,
    "acceptance",
    `${prepared.fingerprint}.snapshots.json`,
  );
  const preserve = (path) => {
    if (!backups.has(path))
      backups.set(path, existsSync(path) ? readFileSync(path) : null);
  };
  const command = (args) =>
    runCommand
      ? runCommand(args, root)
      : spawnSync("pnpm", args, { cwd: root, encoding: "utf8" });
  const validate = (args, label) => {
    const result = command(args);
    if (result.status !== 0)
      throw new Error(
        `${label} refused acceptance:\n${result.stdout ?? ""}${result.stderr ?? ""}`,
      );
  };
  try {
    validate(
      ["run", "validate:changes", changeId],
      "validate:changes before fold",
    );
    for (const [path, content] of prepared.outputs) {
      const target = join(root, path);
      preserve(target);
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, content);
    }
    preserve(record);
    preserve(history);
    preserve(snapshots);
    const accepted = writeAcceptance(root, prepared, {
      reviewedBy,
      supersedes,
    });
    validate(["check:manual"], "check:manual after fold");
    validate(
      ["run", "validate:changes", changeId],
      "validate:changes after acceptance",
    );
    return accepted;
  } catch (error) {
    for (const [path, content] of [...backups].reverse()) {
      if (content === null) rmSync(path, { force: true });
      else writeFileSync(path, content);
    }
    throw error;
  }
}

export { contractOutputs, json as prettyJson };

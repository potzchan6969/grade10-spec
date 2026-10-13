import { join } from "node:path";
import {
  overlapClaims,
  readDeltaFiles,
} from "../../../tools/manual/check/deltas.mjs";
import { readTextIfExists } from "../../../tools/manual/src/store/disk.mts";
import { NO_GIT } from "../../../tools/manual/src/store/git.mts";
import {
  readChanges,
  readIssuedIds,
} from "../../../tools/manual/src/store/read-changes.mts";

const FIRST_SCENARIO = /-SC-\d+[a-z]?\b/;

/** Groups of in-flight changes that edit one durable requirement or are
 *  linked by `depends_on`, with the requirements they share and an order that
 *  puts each change after what it depends on. A `depends_on` cycle has no
 *  such order, so it is reported beside the arbitrary one. Changes touching nothing in
 *  common stay out. */
export function changeClusters(root) {
  const changes = readChanges(root, NO_GIT, null);
  const shared = sharedRequirements(root, changes);
  return grouped(
    changes,
    shared.map((one) => one.claims.map((claim) => claim.change)),
  )
    .filter((members) => members.length > 1)
    .map((members) => ({
      ...ordered(members),
      shared: shared.filter((one) => touches(one, members)),
    }))
    .sort(byFirst);
}

/** The stacks a batch of changes is taken to acceptance in: the changes
 *  `only` names (every in-flight change when empty), joined where they share
 *  a requirement, a capability or a page section, or are linked by
 *  `depends_on`. A change that shares nothing is a stack of one. Each stack
 *  lists every capability its changes have a delta for, with the highest id
 *  of each kind any delta in the store has issued for it, so a new id is
 *  issued above all of them. */
export function changeStacks(root, only = []) {
  const every = readChanges(root, NO_GIT, null);
  const changes = only.length
    ? every.filter((one) => only.includes(one.id))
    : every;
  const shared = sharedRequirements(root, changes);
  const capabilities = heldBy(changes, (one) =>
    one.deltas.map((delta) => delta.spec),
  );
  const sections = heldBy(changes, (one) =>
    (one.sections ?? []).map((ref) => `${ref.page}#${ref.slug}`),
  );
  const issued = readIssuedIds(root);
  const links = [
    ...shared.map((one) => one.claims.map((claim) => claim.change)),
    ...capabilities.map((one) => one.changes),
    ...sections.map((one) => one.changes),
  ];
  return grouped(changes, links)
    .map((members) => ({
      ...ordered(members),
      shared: shared.filter((one) => touches(one, members)),
      capabilities: capabilities
        .filter((one) => touches(one, members))
        .map((one) => ({
          ...one,
          issued: issued.get(tokenOf(root, one.key)) ?? {},
        })),
      sections: sections.filter(
        (one) => one.changes.length > 1 && touches(one, members),
      ),
    }))
    .sort(byFirst);
}

function sharedRequirements(root, changes) {
  const shared = [];
  for (const [key, held] of overlapClaims(readDeltaFiles(root, changes))) {
    if (new Set(held.map((one) => one.change)).size < 2) continue;
    const [capability, requirement] = key.split("\n");
    shared.push({
      capability,
      requirement,
      claims: held.map((one) => ({ change: one.change, kind: one.kind })),
    });
  }
  return shared;
}

/** Every key `keysOf` names, with the changes naming it, in key order. */
function heldBy(changes, keysOf) {
  const by = new Map();
  for (const one of changes)
    for (const key of new Set(keysOf(one)))
      by.set(key, [...(by.get(key) ?? []), one.id]);
  return [...by]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, ids]) => ({ key, changes: ids }));
}

const touches = (one, members) => {
  const ids = new Set(members.map((member) => member.id));
  return (one.changes ?? one.claims.map((claim) => claim.change)).some((id) =>
    ids.has(id),
  );
};

const byFirst = (a, b) => a.changes[0].localeCompare(b.changes[0]);

/** The token a capability's ids are spelled with: its durable spec's own
 *  scenario ids, since a renamed capability keeps issuing its first prefix,
 *  and else its path with slashes as hyphens. */
function tokenOf(root, capability) {
  const text = readTextIfExists(
    join(root, "openspec", "specs", capability, "spec.md"),
  );
  const id = text?.match(
    new RegExp(`[a-z0-9][a-z0-9-]*${FIRST_SCENARIO.source}`),
  )?.[0];
  return id ? id.replace(FIRST_SCENARIO, "") : capability.replaceAll("/", "-");
}

/** Every change joined to every change it is linked with, through `links`
 *  and `depends_on`. */
function grouped(changes, links) {
  const parent = new Map(changes.map((one) => [one.id, one.id]));
  const find = (id) => {
    while (parent.get(id) !== id) id = parent.get(id);
    return id;
  };
  const join = (a, b) => {
    if (parent.has(a) && parent.has(b)) parent.set(find(a), find(b));
  };
  for (const ids of links) for (const id of ids) join(ids[0], id);
  for (const one of changes)
    for (const id of one.dependsOn ?? []) join(one.id, id);

  const groups = new Map();
  for (const one of changes) {
    const members = groups.get(find(one.id)) ?? [];
    members.push(one);
    groups.set(find(one.id), members);
  }
  return [...groups.values()];
}

/** The members in an order that puts each after what it depends on. */
function ordered(members) {
  const ids = new Set(members.map((one) => one.id));
  const done = new Set();
  const path = [];
  const order = [];
  const cycles = [];
  const visit = (one) => {
    const at = path.indexOf(one.id);
    if (at >= 0) {
      cycles.push([...path.slice(at), one.id]);
      return;
    }
    if (done.has(one.id)) return;
    path.push(one.id);
    for (const id of one.dependsOn ?? [])
      if (ids.has(id)) visit(members.find((m) => m.id === id));
    path.pop();
    done.add(one.id);
    order.push(one.id);
  };
  for (const one of [...members].sort((a, b) => a.id.localeCompare(b.id)))
    visit(one);
  return {
    changes: order,
    cycles,
    dependsOn: members
      .filter((one) => (one.dependsOn ?? []).some((id) => ids.has(id)))
      .map((one) => ({
        change: one.id,
        on: one.dependsOn.filter((id) => ids.has(id)),
      })),
  };
}

const orderLines = (group) => [
  ...group.cycles.map(
    (cycle) =>
      `  cycle: ${cycle.join(" -> ")}; this order is arbitrary until depends_on is fixed`,
  ),
  ...group.dependsOn.map(
    (one) => `  depends_on: ${one.change} after ${one.on.join(", ")}`,
  ),
  ...group.shared.map(
    (one) =>
      `  shared: ${one.capability} / ${one.requirement} (${one.claims.map((c) => `${c.change} ${c.kind.toUpperCase()}`).join(", ")})`,
  ),
];

export function formatClusters(clusters) {
  if (clusters.length === 0)
    return "No in-flight changes share a requirement or depend on one another.";
  return clusters
    .map((cluster, at) =>
      [
        `Cluster ${at + 1}: ${cluster.changes.join(" -> ")}`,
        ...orderLines(cluster),
      ].join("\n"),
    )
    .join("\n\n");
}

const ceiling = (issued) =>
  ["sc", "us", "tc"]
    .filter((kind) => issued[kind] !== undefined)
    .map((kind) => `${kind.toUpperCase()}-${issued[kind]}`)
    .join(", ") || "nothing";

export function formatStacks(stacks) {
  if (stacks.length === 0) return "No in-flight change to stack.";
  return stacks
    .map((stack, at) =>
      [
        `Stack ${at + 1}: ${stack.changes.join(" -> ")}`,
        ...orderLines(stack),
        ...stack.capabilities.map(
          (one) =>
            `  capability: ${one.key} (${one.changes.join(", ")}); issued through ${ceiling(one.issued)}`,
        ),
        ...stack.sections.map(
          (one) => `  section: ${one.key} (${one.changes.join(", ")})`,
        ),
      ].join("\n"),
    )
    .join("\n\n");
}

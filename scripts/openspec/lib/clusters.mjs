import {
  overlapClaims,
  readDeltaFiles,
} from "../../../tools/manual/check/deltas.mjs";
import { NO_GIT } from "../../../tools/manual/src/store/git.mts";
import { readChanges } from "../../../tools/manual/src/store/read-changes.mts";

/** Groups of in-flight changes that edit one durable requirement or are
 *  linked by `depends_on`, with the requirements they share and an order that
 *  puts each change after what it depends on. A `depends_on` cycle has no
 *  such order, so it is reported beside the arbitrary one. Changes touching nothing in
 *  common stay out. */
export function changeClusters(root) {
  const changes = readChanges(root, NO_GIT, null);
  const parent = new Map(changes.map((one) => [one.id, one.id]));
  const find = (id) => {
    while (parent.get(id) !== id) id = parent.get(id);
    return id;
  };
  const join = (a, b) => {
    if (parent.has(a) && parent.has(b)) parent.set(find(a), find(b));
  };
  const shared = [];
  for (const [key, held] of overlapClaims(readDeltaFiles(root, changes))) {
    const ids = [...new Set(held.map((one) => one.change))];
    if (ids.length < 2) continue;
    const [capability, requirement] = key.split("\n");
    shared.push({
      capability,
      requirement,
      claims: held.map((one) => ({ change: one.change, kind: one.kind })),
    });
    for (const id of ids) join(ids[0], id);
  }
  for (const one of changes)
    for (const id of one.dependsOn ?? []) join(one.id, id);

  const groups = new Map();
  for (const one of changes) {
    const members = groups.get(find(one.id)) ?? [];
    members.push(one);
    groups.set(find(one.id), members);
  }
  return [...groups.values()]
    .filter((members) => members.length > 1)
    .map((members) => {
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
        shared: shared.filter((one) =>
          one.claims.some((claim) => ids.has(claim.change)),
        ),
      };
    })
    .sort((a, b) => a.changes[0].localeCompare(b.changes[0]));
}

export function formatClusters(clusters) {
  if (clusters.length === 0)
    return "No in-flight changes share a requirement or depend on one another.";
  return clusters
    .map((cluster, at) =>
      [
        `Cluster ${at + 1}: ${cluster.changes.join(" -> ")}`,
        ...cluster.cycles.map(
          (cycle) =>
            `  cycle: ${cycle.join(" -> ")}; this order is arbitrary until depends_on is fixed`,
        ),
        ...cluster.dependsOn.map(
          (one) => `  depends_on: ${one.change} after ${one.on.join(", ")}`,
        ),
        ...cluster.shared.map(
          (one) =>
            `  shared: ${one.capability} / ${one.requirement} (${one.claims.map((c) => `${c.change} ${c.kind.toUpperCase()}`).join(", ")})`,
        ),
      ].join("\n"),
    )
    .join("\n\n");
}

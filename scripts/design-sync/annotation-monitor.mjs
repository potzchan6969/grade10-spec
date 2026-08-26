#!/usr/bin/env node

import { createHash } from "node:crypto";
import { appendFile, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parseArgs } from "node:util";

import { fileKeyFrom } from "./values.mjs";

export const ANNOTATION_SCHEMA_VERSION = 1;

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const defaultBaselinePath = resolve(
  repoRoot,
  "scripts/design-sync/annotation-baseline.json",
);
const sourceTrees = [
  resolve(repoRoot, "packages/design-system/src"),
  resolve(repoRoot, "packages/ui/src/blocks"),
];

try {
  process.loadEnvFile(resolve(repoRoot, ".env"));
} catch {
  // CI supplies FIGMA_TOKEN directly; a local .env is only a convenience.
}

export function normalizeNodeId(id) {
  return String(id ?? "")
    .trim()
    .replace("-", ":");
}

export function normalizeText(text) {
  return String(text ?? "").replace(/\r\n?/g, "\n");
}

function sourceKey(source) {
  return [
    source.fileKey,
    source.nodeId,
    source.kind ?? "source",
    source.path ?? "",
    source.label ?? "",
    source.component ?? "",
    source.covers ?? "",
  ].join("|");
}

function nodeKey(fileKey, nodeId) {
  return `${fileKey}:${normalizeNodeId(nodeId)}`;
}

function stableFindingId(fileKey, nodeId, kind) {
  return createHash("sha256")
    .update(`${fileKey}:${normalizeNodeId(nodeId)}:${kind}`)
    .digest("hex")
    .slice(0, 16);
}

function textFromNode(node) {
  if (node.annotations === undefined) return null;
  if (!Array.isArray(node.annotations))
    throw new Error("node annotations must be an array");
  if (node.annotations.length === 0) return null;
  if (node.annotations.length > 1)
    throw new Error("multiple annotations are not supported by the monitor");
  const annotation = node.annotations[0];
  if (!annotation || typeof annotation !== "object")
    throw new Error("annotation must be an object");
  const text =
    typeof annotation.labelMarkdown === "string"
      ? annotation.labelMarkdown
      : annotation.label;
  if (typeof text !== "string")
    throw new Error("annotation has no label or labelMarkdown text");
  return text;
}

function indexDocument(document) {
  if (!document || typeof document !== "object")
    throw new Error("Figma response has no document object");

  const nodes = new Map();
  const visit = (node, parentId = null) => {
    if (!node || typeof node !== "object" || typeof node.id !== "string")
      throw new Error("Figma document contains a node without an id");
    const id = normalizeNodeId(node.id);
    if (!id) throw new Error("Figma document contains an empty node id");
    if (nodes.has(id)) throw new Error(`duplicate node id ${id}`);
    if (node.children !== undefined && !Array.isArray(node.children))
      throw new Error(`node ${id} children must be an array`);
    nodes.set(id, { node, parentId });
    for (const child of node.children ?? []) visit(child, id);
  };

  visit(document);
  return nodes;
}

function descendants(nodes, rootId) {
  const found = [];
  for (const [id, record] of nodes) {
    let current = id;
    while (current !== null) {
      if (current === rootId) {
        found.push([id, record]);
        break;
      }
      current = nodes.get(current)?.parentId ?? null;
    }
  }
  return found;
}

function sourceAssociation(source) {
  const registeredName = source.component ?? source.covers;
  if (!registeredName) return null;
  return {
    kind: "registered-component",
    name: registeredName,
    fileKey: source.fileKey,
    nodeId: source.nodeId,
    path: source.path ?? null,
  };
}

function uniqueSources(sources) {
  const seen = new Set();
  return sources.filter((source) => {
    const key = sourceKey(source);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function normalizeSource(source) {
  const fileKey = String(source.fileKey ?? "").trim();
  const nodeId = normalizeNodeId(source.nodeId ?? source.node);
  if (!fileKey || !nodeId) return null;
  return { ...source, fileKey, nodeId };
}

function normaliseBaselineEntries(baseline, blockers) {
  if (!baseline || typeof baseline !== "object") {
    blockers.push({
      kind: "malformed-baseline",
      reason: "baseline is not an object",
    });
    return [];
  }
  if (baseline.schemaVersion !== ANNOTATION_SCHEMA_VERSION) {
    blockers.push({
      kind: "malformed-baseline",
      reason: `expected schemaVersion ${ANNOTATION_SCHEMA_VERSION}`,
    });
  }
  if (!baseline.entries || typeof baseline.entries !== "object") {
    blockers.push({
      kind: "malformed-baseline",
      reason: "entries must be an object",
    });
    return [];
  }

  const entries = [];
  for (const [entryKey, raw] of Object.entries(baseline.entries)) {
    if (!raw || typeof raw !== "object") {
      blockers.push({
        kind: "malformed-baseline",
        entryKey,
        reason: "entry is not an object",
      });
      continue;
    }
    const fileKey = String(raw.fileKey ?? entryKey.split(":")[0] ?? "").trim();
    const nodeId = normalizeNodeId(
      raw.nodeId ?? entryKey.slice(fileKey.length + 1),
    );
    if (!fileKey || !nodeId || typeof raw.text !== "string") {
      blockers.push({
        kind: "malformed-baseline",
        entryKey,
        reason: "entry needs fileKey, nodeId, and text",
      });
      continue;
    }
    if (entryKey !== nodeKey(fileKey, nodeId)) {
      blockers.push({
        kind: "malformed-baseline",
        entryKey,
        reason: `entry key must be ${nodeKey(fileKey, nodeId)}`,
      });
      continue;
    }
    entries.push({
      ...raw,
      fileKey,
      nodeId,
      key: nodeKey(fileKey, nodeId),
      text: normalizeText(raw.text),
    });
  }
  return entries;
}

function nodeLink(fileUrl, fileKey, nodeId) {
  const normalizedId = normalizeNodeId(nodeId).replace(":", "-");
  try {
    const url = new URL(
      fileUrl ?? `https://www.figma.com/design/${fileKey}/Grade10-DS-2026`,
    );
    url.searchParams.set("node-id", normalizedId);
    return url.toString();
  } catch {
    return `https://www.figma.com/design/${fileKey}/Grade10-DS-2026?node-id=${normalizedId}`;
  }
}

function makeFinding({
  fileKey,
  fileUrl,
  node,
  nodeId,
  kind,
  previousText,
  currentText,
  sources,
  baselineEntry,
}) {
  const registeredSources = sources.map((source) => ({
    kind: source.kind ?? "registered-source",
    path: source.path ?? null,
    label: source.label ?? null,
    component: source.component ?? null,
    covers: source.covers ?? null,
    fileKey: source.fileKey,
    nodeId: source.nodeId,
  }));
  const evidence = [
    ...(baselineEntry
      ? [
          {
            kind: "reviewed-baseline",
            fileKey,
            nodeId,
            sourceRoot: baselineEntry.sourceRoot ?? null,
            associations: baselineEntry.associations ?? null,
            noImpactReason: baselineEntry.noImpactReason ?? null,
          },
        ]
      : []),
    ...sources.map(sourceAssociation).filter(Boolean),
  ];
  const hasAssociation =
    Boolean(baselineEntry?.associations) ||
    sources.some((source) => source.component || source.covers);

  return {
    id: stableFindingId(fileKey, nodeId, kind),
    fileKey,
    nodeId,
    nodeLink: nodeLink(fileUrl, fileKey, nodeId),
    nodeName: node?.name ?? "(unnamed node)",
    kind,
    previousText: previousText ?? null,
    currentText: currentText ?? null,
    registeredSources,
    associations: baselineEntry?.associations ?? null,
    associationEvidence: evidence,
    classification: hasAssociation ? "associated" : "untracked",
  };
}

function blockerForFile(fileKey, blocker) {
  return { fileKey, ...blocker };
}

export function scanAnnotations({
  baseline,
  sources = [],
  documents = {},
  fileUrls = {},
} = {}) {
  const blockers = [];
  const findings = [];
  const scannedSources = [];
  const normalizedBaselineSources = (baseline?.roots ?? [])
    .map(normalizeSource)
    .filter(Boolean);
  const normalizedSources = uniqueSources(
    [...sources, ...normalizedBaselineSources]
      .map(normalizeSource)
      .filter(Boolean),
  );
  const entries = normaliseBaselineEntries(baseline, blockers);
  const entriesByKey = new Map(entries.map((entry) => [entry.key, entry]));
  const fileKeys = new Set([
    ...normalizedSources.map((source) => source.fileKey),
    ...entries.map((entry) => entry.fileKey),
  ]);
  if (fileKeys.size === 0) {
    blockers.push({
      kind: "no-registered-surfaces",
      reason: "no Code Connect, audit, or explicit baseline roots were found",
    });
  }

  for (const fileKey of fileKeys) {
    const fileSources = normalizedSources.filter(
      (source) => source.fileKey === fileKey,
    );
    const loaded = documents[fileKey];
    const document = loaded?.document ?? loaded;
    if (!document || loaded?.error) {
      blockers.push(
        blockerForFile(fileKey, {
          kind: loaded?.kind ?? "figma-unreadable",
          reason: loaded?.error ?? "Figma document was not provided",
        }),
      );
      for (const source of fileSources)
        scannedSources.push({ ...source, status: "blocked" });
      continue;
    }

    let nodes;
    try {
      nodes = indexDocument(document);
    } catch (error) {
      blockers.push(
        blockerForFile(fileKey, {
          kind: "malformed-response",
          reason: error instanceof Error ? error.message : String(error),
        }),
      );
      for (const source of fileSources)
        scannedSources.push({ ...source, status: "blocked" });
      continue;
    }

    const sourcesByNode = new Map();
    for (const source of fileSources) {
      const root = nodes.get(source.nodeId);
      if (!root) {
        blockers.push(
          blockerForFile(fileKey, {
            kind: "root-unresolvable",
            nodeId: source.nodeId,
            reason: "registered source root cannot be resolved",
          }),
        );
        scannedSources.push({ ...source, status: "blocked" });
        continue;
      }
      scannedSources.push({
        ...source,
        status: "scanned",
        nodeName: root.node.name ?? "(unnamed node)",
      });
      for (const [id] of descendants(nodes, source.nodeId)) {
        const current = sourcesByNode.get(id) ?? [];
        current.push(source);
        sourcesByNode.set(id, current);
      }
    }

    for (const entry of entries.filter(
      (candidate) => candidate.fileKey === fileKey,
    )) {
      const record = nodes.get(entry.nodeId);
      if (!record) {
        blockers.push(
          blockerForFile(fileKey, {
            kind: "orphaned-baseline-node",
            nodeId: entry.nodeId,
            reason: "baseline node cannot be resolved",
          }),
        );
        continue;
      }
      let currentText;
      try {
        currentText = textFromNode(record.node);
      } catch (error) {
        blockers.push(
          blockerForFile(fileKey, {
            kind: "malformed-response",
            nodeId: entry.nodeId,
            reason: error instanceof Error ? error.message : String(error),
          }),
        );
        continue;
      }
      const nodeSources = sourcesByNode.get(entry.nodeId) ?? [];
      if (currentText === null) {
        findings.push(
          makeFinding({
            fileKey,
            fileUrl: fileUrls[fileKey] ?? nodeSources[0]?.fileUrl,
            node: record.node,
            nodeId: entry.nodeId,
            kind: "removed",
            previousText: entry.text,
            currentText: null,
            sources: nodeSources,
            baselineEntry: entry,
          }),
        );
      } else if (normalizeText(currentText) !== entry.text) {
        findings.push(
          makeFinding({
            fileKey,
            fileUrl: fileUrls[fileKey] ?? nodeSources[0]?.fileUrl,
            node: record.node,
            nodeId: entry.nodeId,
            kind: "changed",
            previousText: entry.text,
            currentText,
            sources: nodeSources,
            baselineEntry: entry,
          }),
        );
      }
    }

    for (const [nodeId, nodeSources] of sourcesByNode) {
      const record = nodes.get(nodeId);
      let currentText;
      try {
        currentText = textFromNode(record.node);
      } catch (error) {
        blockers.push(
          blockerForFile(fileKey, {
            kind: "malformed-response",
            nodeId,
            reason: error instanceof Error ? error.message : String(error),
          }),
        );
        continue;
      }
      if (currentText === null) continue;
      const entry = entriesByKey.get(nodeKey(fileKey, nodeId));
      if (!entry) {
        findings.push(
          makeFinding({
            fileKey,
            fileUrl: fileUrls[fileKey] ?? nodeSources[0]?.fileUrl,
            node: record.node,
            nodeId,
            kind: "added",
            previousText: null,
            currentText,
            sources: nodeSources,
            baselineEntry: null,
          }),
        );
      }
    }
  }

  const status = blockers.length
    ? "blocked"
    : findings.length
      ? "drift"
      : "clean";
  return {
    schemaVersion: ANNOTATION_SCHEMA_VERSION,
    status,
    scannedSources,
    blockers,
    findings,
  };
}

export function inventoryAnnotations({
  sources = [],
  documents = {},
  fileUrls = {},
  fileKeys: requestedFileKeys = [],
  wholeFile = false,
} = {}) {
  const blockers = [];
  const scannedSources = [];
  const annotations = new Map();
  const normalizedSources = uniqueSources(
    sources.map(normalizeSource).filter(Boolean),
  );
  const fileKeys = new Set([
    ...normalizedSources.map((source) => source.fileKey),
    ...requestedFileKeys,
  ]);

  for (const fileKey of fileKeys) {
    const fileSources = normalizedSources.filter(
      (source) => source.fileKey === fileKey,
    );
    const loaded = documents[fileKey];
    const document = loaded?.document ?? loaded;
    if (!document || loaded?.error) {
      blockers.push(
        blockerForFile(fileKey, {
          kind: loaded?.kind ?? "figma-unreadable",
          reason: loaded?.error ?? "Figma document was not provided",
        }),
      );
      for (const source of fileSources)
        scannedSources.push({ ...source, status: "blocked" });
      continue;
    }
    let nodes;
    try {
      nodes = indexDocument(document);
    } catch (error) {
      blockers.push(
        blockerForFile(fileKey, {
          kind: "malformed-response",
          reason: error instanceof Error ? error.message : String(error),
        }),
      );
      continue;
    }

    const sourcesByNode = new Map();
    for (const source of fileSources) {
      const root = nodes.get(source.nodeId);
      if (!root) {
        blockers.push(
          blockerForFile(fileKey, {
            kind: "root-unresolvable",
            nodeId: source.nodeId,
            reason: "registered source root cannot be resolved",
          }),
        );
        scannedSources.push({ ...source, status: "blocked" });
        continue;
      }
      scannedSources.push({
        ...source,
        status: "scanned",
        nodeName: root.node.name ?? "(unnamed node)",
      });
      for (const [nodeId] of descendants(nodes, source.nodeId)) {
        const current = sourcesByNode.get(nodeId) ?? [];
        current.push(source);
        sourcesByNode.set(nodeId, current);
      }
    }

    const candidates = wholeFile ? nodes : sourcesByNode;
    for (const [nodeId] of candidates) {
      const node = nodes.get(nodeId).node;
      let text;
      try {
        text = textFromNode(node);
      } catch (error) {
        blockers.push(
          blockerForFile(fileKey, {
            kind: "malformed-response",
            nodeId,
            reason: error instanceof Error ? error.message : String(error),
          }),
        );
        continue;
      }
      if (text === null) continue;
      const nodeSources = sourcesByNode.get(nodeId) ?? [];
      const key = nodeKey(fileKey, nodeId);
      const current = annotations.get(key) ?? {
        fileKey,
        nodeId,
        nodeName: node.name ?? "(unnamed node)",
        text,
        nodeLink: nodeLink(
          fileUrls[fileKey] ?? nodeSources[0]?.fileUrl,
          fileKey,
          nodeId,
        ),
        registeredSources: [],
      };
      current.registeredSources.push(
        ...nodeSources.map((source) => ({
          kind: source.kind ?? "registered-source",
          path: source.path ?? null,
          label: source.label ?? null,
          component: source.component ?? null,
          covers: source.covers ?? null,
          fileKey: source.fileKey,
          nodeId: source.nodeId,
        })),
      );
      annotations.set(key, current);
    }
  }

  for (const annotation of annotations.values()) {
    annotation.registeredSources = uniqueSources(annotation.registeredSources);
  }
  return {
    schemaVersion: ANNOTATION_SCHEMA_VERSION,
    status: blockers.length ? "blocked" : "inventory",
    scannedSources,
    blockers,
    annotations: [...annotations.values()].sort((a, b) =>
      `${a.fileKey}:${a.nodeId}`.localeCompare(`${b.fileKey}:${b.nodeId}`),
    ),
  };
}

export function exitCodeFor(result) {
  if (result.status === "blocked") return 2;
  if (result.status === "drift") return 1;
  return 0;
}

export function renderHuman(result) {
  if (result.status === "inventory") {
    const lines = [
      `✓ Inventory found ${result.annotations.length} annotation(s).`,
    ];
    for (const annotation of result.annotations)
      lines.push(`  ${annotation.nodeLink} ${JSON.stringify(annotation.text)}`);
    return lines.join("\n");
  }
  if (result.status === "clean") return "✓ No tracked annotations changed.";
  const lines = [
    result.status === "blocked"
      ? `✗ Annotation scan blocked (${result.blockers.length} blocker(s)).`
      : `✗ Annotation drift found (${result.findings.length} finding(s)).`,
  ];
  for (const blocker of result.blockers)
    lines.push(
      `  BLOCKED ${blocker.fileKey ?? ""} ${blocker.nodeId ?? ""} ${blocker.reason}`.trim(),
    );
  for (const finding of result.findings ?? []) {
    lines.push(`  ${finding.kind.toUpperCase()} ${finding.nodeLink}`);
    if (finding.previousText !== null)
      lines.push(`    previous: ${JSON.stringify(finding.previousText)}`);
    if (finding.currentText !== null)
      lines.push(`    current:  ${JSON.stringify(finding.currentText)}`);
  }
  return lines.join("\n");
}

async function readJson(path, label) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    throw new Error(
      `${label}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

async function walk(dir) {
  const { readdir } = await import("node:fs/promises");
  const result = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (error) {
    if (error?.code === "ENOENT") return result;
    throw error;
  }
  for (const entry of entries) {
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) result.push(...(await walk(path)));
    else result.push(path);
  }
  return result;
}

export async function discoverSources() {
  const files = (await Promise.all(sourceTrees.map(walk))).flat();
  const sources = [];
  const fileUrls = {};
  for (const path of files) {
    if (path.endsWith(".figma.ts")) {
      const text = await readFile(path, "utf8");
      const url = /^\/\/\s*url=(\S+)/m.exec(text)?.[1];
      const fileKey = url ? fileKeyFrom(url) : null;
      const nodeId = url
        ? normalizeNodeId(/node-id=([^&]+)/.exec(url)?.[1])
        : "";
      if (fileKey && nodeId) {
        const source = {
          fileKey,
          nodeId,
          fileUrl: url,
          kind: "code-connect",
          path: path.slice(repoRoot.length + 1),
          component: /^\/\/\s*component=(.+)$/m.exec(text)?.[1]?.trim() ?? null,
        };
        sources.push(source);
        fileUrls[fileKey] = url.replace(/[?&]node-id=[^&]+/, "");
      }
    }
    if (path.endsWith("audit.json")) {
      let entries;
      try {
        entries = JSON.parse(await readFile(path, "utf8"));
      } catch {
        continue;
      }
      if (!Array.isArray(entries)) continue;
      for (const entry of entries) {
        const fileKey = fileKeyFrom(entry.node ?? "");
        const nodeId = normalizeNodeId(
          /node-id=([^&]+)/.exec(entry.node ?? "")?.[1],
        );
        if (!fileKey || !nodeId) continue;
        sources.push({
          fileKey,
          nodeId,
          fileUrl: entry.node,
          kind: "audit",
          path: path.slice(repoRoot.length + 1),
          label: entry.label ?? null,
          covers: entry.covers ?? null,
        });
        fileUrls[fileKey] = entry.node.replace(/[?&]node-id=[^&]+/, "");
      }
    }
  }
  return { sources: uniqueSources(sources), fileUrls };
}

async function loadDocuments(fileKeys, dumpPath, token) {
  const documents = {};
  if (dumpPath) {
    const dump = await readJson(resolve(repoRoot, dumpPath), "Figma dump");
    if (dump.files && typeof dump.files === "object") return dump.files;
    const dumpKey = dump.fileKey ?? dump.key ?? fileKeys[0];
    if (dumpKey) documents[dumpKey] = dump;
    else for (const fileKey of fileKeys) documents[fileKey] = dump;
    return documents;
  }
  if (!token) {
    for (const fileKey of fileKeys)
      documents[fileKey] = {
        kind: "missing-credential",
        error: "FIGMA_TOKEN is not set",
      };
    return documents;
  }
  for (const fileKey of fileKeys) {
    try {
      const response = await fetch(
        `https://api.figma.com/v1/files/${fileKey}`,
        {
          headers: { "X-Figma-Token": token },
        },
      );
      if (!response.ok) {
        documents[fileKey] = {
          kind: "figma-request-failed",
          error: `Figma REST ${response.status} ${response.statusText}`,
        };
        continue;
      }
      documents[fileKey] = await response.json();
    } catch (error) {
      documents[fileKey] = {
        kind: "figma-request-failed",
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
  return documents;
}

export async function runCli({
  argv = process.argv.slice(2),
  env = process.env,
} = {}) {
  const { values } = parseArgs({
    args: argv.filter((arg) => arg !== "--"),
    options: {
      json: { type: "boolean", default: false },
      inventory: { type: "boolean", default: false },
      baseline: { type: "string", default: defaultBaselinePath },
      dump: { type: "string" },
    },
    strict: true,
  });
  const discovered = await discoverSources();
  const baselinePath = resolve(repoRoot, values.baseline);
  let baseline;
  try {
    baseline = await readJson(baselinePath, "annotation baseline");
  } catch (error) {
    baseline = {
      schemaVersion: ANNOTATION_SCHEMA_VERSION,
      roots: discovered.sources,
      entries: {},
    };
    if (!values.inventory) {
      const result = {
        schemaVersion: ANNOTATION_SCHEMA_VERSION,
        status: "blocked",
        scannedSources: [],
        blockers: [{ kind: "missing-baseline", reason: error.message }],
        findings: [],
      };
      if (values.json) console.log(JSON.stringify(result, null, 2));
      else console.log(renderHuman(result));
      return exitCodeFor(result);
    }
  }
  const fileKeys = [
    ...new Set([
      ...discovered.sources.map((source) => source.fileKey),
      ...(baseline.roots ?? []).map((source) => source.fileKey),
      ...Object.values(baseline.entries ?? {}).map((entry) => entry.fileKey),
    ]),
  ];
  const documents = await loadDocuments(
    fileKeys,
    values.dump ?? env.FIGMA_DUMP,
    env.FIGMA_TOKEN,
  );
  const result = scanAnnotations({
    baseline,
    sources: discovered.sources,
    documents,
    fileUrls: discovered.fileUrls,
  });
  const output = values.inventory
    ? inventoryAnnotations({
        sources: discovered.sources,
        documents,
        fileUrls: discovered.fileUrls,
        fileKeys,
        wholeFile: true,
      })
    : result;
  if (values.json) console.log(JSON.stringify(output, null, 2));
  else console.log(renderHuman(output));
  if (env.GITHUB_STEP_SUMMARY) {
    await appendFile(env.GITHUB_STEP_SUMMARY, `${renderHuman(output)}\n`);
  }
  return exitCodeFor(output);
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  runCli()
    .then((code) => {
      process.exitCode = code;
    })
    .catch((error) => {
      console.error(
        `✗ ${error instanceof Error ? error.message : String(error)}`,
      );
      process.exitCode = 2;
    });
}

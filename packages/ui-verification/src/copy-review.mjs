// Copy review records: a reviewer's "looks right", a proposed edit, an
// approver's decision on it, and the change set that shipped approved edits.
// Each is a create-only record bound to the layer, locale, namespace and key
// of one catalog value and to the hash of the value it judged, so a value that
// changes is reviewed again and nothing is ever rewritten.

import { ArchiveError } from "./archive.mjs";
import { valueHash } from "./copy-catalog.mjs";
import { blocksApproval, checkValue } from "./copy-checks.mjs";

const PREFIX = "copy-review/v1/";
const KINDS = ["review", "proposal", "decision", "changeset"];
const NAME = /^[A-Za-z][A-Za-z0-9-]{0,63}$/;
const KEY = /^[A-Za-z0-9_][\w.-]{0,255}$/;
const HASH = /^[0-9a-f]{64}$/;
const ID = /^[0-9a-f-]{36}$/;
const MAX_VALUE = 4000;
const MAX_COMMENT = 2000;

const fail = (status, code, message) => {
  throw new ArchiveError(status, code, message);
};

function object(value, path) {
  if (typeof value !== "object" || value === null || Array.isArray(value))
    throw new TypeError(`${path} must be an object`);
  return value;
}

function matching(value, pattern, path) {
  if (typeof value !== "string" || !pattern.test(value))
    throw new TypeError(`${path} is not valid`);
  return value;
}

function text(value, path, max) {
  if (typeof value !== "string") throw new TypeError(`${path} must be text`);
  if (value.length > max)
    throw new TypeError(`${path} cannot exceed ${max} characters`);
  return value;
}

function cell(input) {
  return {
    layer: matching(input.layer, NAME, "layer"),
    locale: matching(input.locale, NAME, "locale"),
    namespace: matching(input.namespace, NAME, "namespace"),
    key: matching(input.key, KEY, "key"),
  };
}

const cellId = (record) =>
  `${record.layer}/${record.locale}/${record.namespace}/${record.key}`;

function person(value) {
  const who = object(value, "person");
  return {
    subject: text(who.subject, "person.subject", 255),
    ...(typeof who.email === "string" ? { email: who.email } : {}),
  };
}

/** Each proposal's newest decision, which is the one that holds. */
export function latestDecisions(decisions) {
  const latest = new Map();
  for (const decision of decisions) {
    const held = latest.get(decision.proposalId);
    if (!held || held.createdAt <= decision.createdAt)
      latest.set(decision.proposalId, decision);
  }
  return latest;
}

export function createCopyReview({
  store,
  shipper = null,
  now = () => new Date().toISOString(),
  newId = () => globalThis.crypto.randomUUID(),
}) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  async function create(kind, fields) {
    const record = { kind, id: newId(), createdAt: now(), ...fields };
    const stamp = record.createdAt.replace(/[^0-9]/g, "");
    const key = `${PREFIX}${kind}s/${stamp}-${record.id}.json`;
    const created = await store.create(
      key,
      encoder.encode(JSON.stringify(record)),
      "application/json",
    );
    if (!created)
      fail(409, "WRITE_RACE", `${kind} ${record.id} already exists`);
    return record;
  }

  async function readAll(kind) {
    const records = [];
    let cursor;
    do {
      const page = await store.list(`${PREFIX}${kind}s/`, cursor, 100);
      const values = await Promise.all(page.keys.map((key) => store.get(key)));
      for (const bytes of values)
        if (bytes) records.push(JSON.parse(decoder.decode(bytes)));
      cursor = page.cursor;
    } while (cursor);
    return records.sort((left, right) =>
      left.createdAt.localeCompare(right.createdAt),
    );
  }

  async function records() {
    const [reviews, proposals, decisions, changesets] = await Promise.all(
      KINDS.map(readAll),
    );
    return { reviews, proposals, decisions, changesets };
  }

  async function proposalState(proposalId) {
    const { proposals, decisions, changesets } = await records();
    const proposal = proposals.find((entry) => entry.id === proposalId);
    if (!proposal) fail(404, "PROPOSAL_NOT_FOUND", "proposal was not found");
    return {
      proposal,
      decision: latestDecisions(decisions).get(proposalId) ?? null,
      shipped: changesets.some((set) => set.proposalIds.includes(proposalId)),
    };
  }

  return {
    async list() {
      const all = await records();
      if (!shipper?.status) return all;
      const changesets = await Promise.all(
        all.changesets.map(async (set) => {
          try {
            return { ...set, status: await shipper.status(set) };
          } catch (error) {
            return { ...set, status: { error: error.message } };
          }
        }),
      );
      return { ...all, changesets };
    },

    async review(input, reviewer) {
      object(input, "review");
      return create("review", {
        ...cell(input),
        valueHash: matching(input.valueHash, HASH, "valueHash"),
        reviewer: person(reviewer),
      });
    },

    async propose(input, proposer) {
      object(input, "proposal");
      const target = cell(input);
      const value = text(input.value, "value", MAX_VALUE);
      const baseValue =
        input.baseValue === null
          ? null
          : text(input.baseValue, "baseValue", MAX_VALUE);
      const baseHash = matching(input.baseHash, HASH, "baseHash");
      if ((await valueHash(baseValue)) !== baseHash)
        throw new TypeError("baseHash does not match baseValue");
      if (value === baseValue)
        throw new TypeError("the proposed value is the current value");
      const reference =
        typeof input.reference === "string" ? input.reference : undefined;
      return create("proposal", {
        ...target,
        baseValue,
        baseHash,
        value,
        issues: checkValue({ locale: target.locale, value, reference }),
        proposer: person(proposer),
      });
    },

    async decide(input, approver) {
      object(input, "decision");
      const proposalId = matching(input.proposalId, ID, "proposalId");
      const verdict = input.verdict;
      if (verdict !== "approved" && verdict !== "changes-requested")
        throw new TypeError(
          'verdict must be "approved" or "changes-requested"',
        );
      const comment =
        input.comment === undefined
          ? ""
          : text(input.comment, "comment", MAX_COMMENT).trim();
      const { proposal, shipped } = await proposalState(proposalId);
      if (shipped) fail(409, "ALREADY_SHIPPED", "this edit has shipped");
      if (verdict === "approved" && blocksApproval(proposal.issues))
        fail(
          422,
          "CHECK_FAILED",
          "an edit that fails a check cannot be approved",
        );
      if (verdict === "changes-requested" && !comment)
        throw new TypeError("requesting changes needs a comment");
      return create("decision", {
        proposalId,
        verdict,
        comment,
        approver: person(approver),
      });
    },

    async ship(input, author) {
      if (!shipper)
        fail(501, "SHIPPING_UNAVAILABLE", "this workbench cannot ship copy");
      object(input, "change set");
      const ids = input.proposalIds;
      if (!Array.isArray(ids) || ids.length === 0 || ids.length > 200)
        throw new TypeError("proposalIds must list 1 to 200 proposals");
      const { proposals, decisions, changesets } = await records();
      const latest = latestDecisions(decisions);
      const edits = [];
      for (const id of new Set(ids)) {
        matching(id, ID, "proposalId");
        const proposal = proposals.find((entry) => entry.id === id);
        if (!proposal) fail(404, "PROPOSAL_NOT_FOUND", `${id} was not found`);
        if (latest.get(id)?.verdict !== "approved")
          fail(409, "NOT_APPROVED", `${cellId(proposal)} is not approved`);
        if (changesets.some((set) => set.proposalIds.includes(id)))
          fail(409, "ALREADY_SHIPPED", `${cellId(proposal)} has shipped`);
        edits.push({ ...proposal, proposalId: id });
      }
      const shipped = await shipper.ship(edits, person(author));
      if (shipped.applied.length === 0)
        fail(
          409,
          "NOTHING_TO_SHIP",
          shipped.skipped
            .map((edit) => `${cellId(edit)}: ${edit.reason}`)
            .join("; "),
        );
      return create("changeset", {
        proposalIds: shipped.applied.map((edit) => edit.proposalId),
        skipped: shipped.skipped.map((edit) => ({
          proposalId: edit.proposalId,
          reason: edit.reason,
        })),
        shipment: shipped.shipment,
        author: person(author),
      });
    },
  };
}

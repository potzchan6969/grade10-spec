import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createArchiveHandler } from "../src/archive-api.mjs";
import { applyEdits, valueHash } from "../src/copy-catalog.mjs";
import { createCopyReview, latestDecisions } from "../src/copy-review.mjs";

function memoryStore() {
  const objects = new Map();
  return {
    async get(key) {
      return objects.get(key) ?? null;
    },
    async create(key, bytes) {
      if (objects.has(key)) return false;
      objects.set(key, bytes);
      return true;
    },
    async list(prefix) {
      return {
        keys: [...objects.keys()].filter((key) => key.startsWith(prefix)),
      };
    },
  };
}

function clock() {
  let tick = 0;
  return () => new Date(Date.UTC(2026, 10, 3, 0, 0, tick++)).toISOString();
}

const ann = { subject: "ann", email: "ann@example.com" };
const bo = { subject: "bo" };
const cell = {
  layer: "shared",
  locale: "en",
  namespace: "appointment",
  key: "errors.cancelFailed",
};
const current = "The visit could not be cancelled. Try again.";

async function proposal(review, overrides = {}) {
  return review.propose(
    {
      ...cell,
      baseValue: current,
      baseHash: await valueHash(current),
      value: "We could not cancel this visit. Try again.",
      ...overrides,
    },
    ann,
  );
}

describe("copy review records", () => {
  it("binds a review to the value it judged", async () => {
    const review = createCopyReview({ store: memoryStore(), now: clock() });
    const hash = await valueHash(current);
    const record = await review.review({ ...cell, valueHash: hash }, ann);
    assert.equal(record.valueHash, hash);
    assert.deepEqual((await review.list()).reviews, [record]);
  });

  it("refuses a proposal whose base hash is not its base value", async () => {
    const review = createCopyReview({ store: memoryStore(), now: clock() });
    await assert.rejects(
      proposal(review, { baseHash: await valueHash("something else") }),
      /baseHash does not match/,
    );
  });

  it("checks a proposed edit against its English", async () => {
    const review = createCopyReview({ store: memoryStore(), now: clock() });
    const edit = await review.propose(
      {
        ...cell,
        locale: "zh-Hant",
        baseValue: "{remaining}後開拍",
        baseHash: await valueHash("{remaining}後開拍"),
        value: "即將開拍",
        reference: "Opens in {remaining}",
      },
      ann,
    );
    assert.deepEqual(
      edit.issues.map((issue) => issue.kind),
      ["placeholder"],
    );
  });

  it("will not approve an edit that fails a check", async () => {
    const review = createCopyReview({ store: memoryStore(), now: clock() });
    const edit = await proposal(review, { value: "Closes {when" });
    await assert.rejects(
      review.decide({ proposalId: edit.id, verdict: "approved" }, bo),
      { code: "CHECK_FAILED" },
    );
  });

  it("needs a comment to request changes, and the newest decision holds", async () => {
    const review = createCopyReview({ store: memoryStore(), now: clock() });
    const edit = await proposal(review);
    await assert.rejects(
      review.decide({ proposalId: edit.id, verdict: "changes-requested" }, bo),
      /needs a comment/,
    );
    await review.decide(
      { proposalId: edit.id, verdict: "changes-requested", comment: "Shorter" },
      bo,
    );
    await review.decide({ proposalId: edit.id, verdict: "approved" }, bo);
    const { decisions } = await review.list();
    assert.equal(latestDecisions(decisions).get(edit.id).verdict, "approved");
  });

  it("ships approved edits once and records what moved", async () => {
    const shipments = [];
    const review = createCopyReview({
      store: memoryStore(),
      now: clock(),
      shipper: {
        async ship(edits) {
          shipments.push(edits);
          return {
            applied: edits.slice(0, 1),
            skipped: edits
              .slice(1)
              .map((edit) => ({ ...edit, reason: "moved" })),
            shipment: { kind: "files", paths: ["x.json"] },
          };
        },
        async status() {
          return { pullRequest: { state: "open" } };
        },
      },
    });
    const first = await proposal(review);
    const second = await proposal(review, { key: "errors.other" });
    await assert.rejects(review.ship({ proposalIds: [first.id] }, bo), {
      code: "NOT_APPROVED",
    });
    for (const edit of [first, second])
      await review.decide({ proposalId: edit.id, verdict: "approved" }, bo);
    const set = await review.ship({ proposalIds: [first.id, second.id] }, bo);
    assert.deepEqual(set.proposalIds, [first.id]);
    assert.deepEqual(set.skipped, [{ proposalId: second.id, reason: "moved" }]);
    await assert.rejects(review.ship({ proposalIds: [first.id] }, bo), {
      code: "ALREADY_SHIPPED",
    });
    await assert.rejects(
      review.decide({ proposalId: first.id, verdict: "approved" }, bo),
      { code: "ALREADY_SHIPPED" },
    );
    const listed = await review.list();
    assert.deepEqual(listed.changesets[0].status, {
      pullRequest: { state: "open" },
    });
  });

  it("cannot ship without a shipper", async () => {
    const review = createCopyReview({ store: memoryStore(), now: clock() });
    await assert.rejects(review.ship({ proposalIds: [] }, bo), {
      code: "SHIPPING_UNAVAILABLE",
    });
  });
});

describe("applyEdits", () => {
  const english = { errors: { cancelFailed: current, other: "Other" } };
  const files = {
    "packages/i18n/messages/shared/en/appointment.json":
      JSON.stringify(english),
    "packages/i18n/messages/shared/zh-Hant/appointment.json": JSON.stringify({
      errors: { other: "其他" },
    }),
  };
  const read = async (path) => files[path] ?? null;

  it("writes an edit whose value has not moved", async () => {
    const result = await applyEdits(
      [{ ...cell, baseHash: await valueHash(current), value: "New" }],
      read,
    );
    assert.equal(result.applied.length, 1);
    assert.equal(JSON.parse(result.files[0].text).errors.cancelFailed, "New");
    assert.match(result.files[0].text, /\n$/);
  });

  it("skips an edit whose value moved since it was proposed", async () => {
    const result = await applyEdits(
      [{ ...cell, baseHash: await valueHash("Older"), value: "New" }],
      read,
    );
    assert.equal(result.files.length, 0);
    assert.equal(result.skipped[0].reason, "the catalog value moved since");
  });

  it("fills a missing translation in the English key order", async () => {
    const result = await applyEdits(
      [
        {
          ...cell,
          locale: "zh-Hant",
          baseHash: await valueHash(null),
          value: "無法取消",
        },
      ],
      read,
    );
    assert.deepEqual(Object.keys(JSON.parse(result.files[0].text).errors), [
      "cancelFailed",
      "other",
    ]);
  });
});

describe("copy routes", () => {
  const handler = createArchiveHandler(
    {},
    {
      authorize: async (_request, scope) =>
        scope === "approve"
          ? { kind: "human", reviewer: { subject: "local-development" } }
          : { kind: "publisher" },
      sameOrigin: true,
      copyReview: createCopyReview({ store: memoryStore(), now: clock() }),
    },
  );
  const post = (path, body) =>
    handler(
      new Request(`http://localhost:6006${path}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: "http://localhost:6006",
        },
        body: JSON.stringify(body),
      }),
    );

  it("records a review as the signed-in person and lists it", async () => {
    const response = await post("/api/copy/reviews", {
      ...cell,
      valueHash: await valueHash(current),
    });
    assert.equal(response.status, 201);
    assert.equal((await response.json()).reviewer.subject, "local-development");
    const listed = await handler(
      new Request("http://localhost:6006/api/copy/records"),
    );
    assert.equal((await listed.json()).reviews.length, 1);
  });

  it("answers a bad request with 400", async () => {
    const response = await post("/api/copy/decisions", { verdict: "maybe" });
    assert.equal(response.status, 400);
  });
});

describe("GitHub shipper", () => {
  it("opens one pull request and reads the site pin", async () => {
    const { createGitHubCopyShipper } = await import(
      "../worker/copy-github.mjs"
    );
    const english = JSON.stringify({ errors: { cancelFailed: current } });
    const calls = [];
    const fetcher = async (url, init = {}) => {
      const path = new URL(url).pathname + new URL(url).search;
      calls.push(`${init.method} ${path}`);
      const json = (value) => new Response(JSON.stringify(value));
      if (path === "/repos/9gag/grade10-spec/git/ref/heads/main")
        return json({ object: { sha: "base" } });
      if (path.startsWith("/repos/9gag/grade10-spec/contents/"))
        return json({ content: Buffer.from(english).toString("base64") });
      if (path === "/repos/9gag/grade10-spec/git/commits/base")
        return json({ tree: { sha: "tree" } });
      if (path === "/repos/9gag/grade10-spec/git/trees")
        return json({ sha: "t2" });
      if (path === "/repos/9gag/grade10-spec/git/commits")
        return json({ sha: "c2" });
      if (path === "/repos/9gag/grade10-spec/git/refs") return json({});
      if (path === "/repos/9gag/grade10-spec/pulls")
        return json({ number: 9, html_url: "https://github.com/pr/9" });
      if (path === "/repos/9gag/grade10-spec/pulls/9")
        return json({ merged: true, state: "closed", merge_commit_sha: "m" });
      if (
        path === "/repos/9gag/grade10/contents/external/grade10-spec?ref=main"
      )
        return json({ sha: "pin" });
      if (path === "/repos/9gag/grade10-spec/compare/m...pin")
        return json({ status: "behind" });
      return new Response("unexpected", { status: 500 });
    };
    const shipper = createGitHubCopyShipper({ token: "t", fetcher });
    const result = await shipper.ship(
      [
        {
          ...cell,
          proposalId: "p",
          baseValue: current,
          baseHash: await valueHash(current),
          value: "New",
          proposer: ann,
        },
      ],
      bo,
    );
    assert.equal(result.shipment.number, 9);
    assert.equal(result.applied.length, 1);
    assert.ok(calls.includes("POST /repos/9gag/grade10-spec/pulls"));
    assert.deepEqual(await shipper.status({ shipment: result.shipment }), {
      pullRequest: { state: "merged", mergeCommit: "m" },
      site: { pin: "pin", includesMerge: false },
    });
  });
});

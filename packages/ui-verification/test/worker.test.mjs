import assert from "node:assert/strict";
import { createHash, createSign, generateKeyPairSync } from "node:crypto";
import test from "node:test";
import { deflateSync } from "node:zlib";
import { createR2Archive } from "../src/archive.mjs";
import { PROFILES } from "../src/model.mjs";
import { createWorker } from "../worker/index.mjs";

const CASE_ID = "case-worker-smoke";
const TARGET_ID = "grade10-site";
const CAPTURE_POINT_ID = "homepage";
const PUBLISHER_TOKEN = "test-publisher-token-with-sufficient-entropy";

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const name = Buffer.from(type, "ascii");
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([name, data])));
  return Buffer.concat([length, name, data, crc]);
}

function decodablePng(width, height, rgba = [45, 95, 145, 255]) {
  const stride = width * 4 + 1;
  const data = Buffer.alloc(stride * height);
  const pixel = Buffer.from(rgba);
  for (let y = 0; y < height; y += 1) {
    data.fill(pixel, y * stride + 1, (y + 1) * stride);
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = 6;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", header),
    chunk("IDAT", deflateSync(data)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

function makeFixture(runId) {
  const appCommit = "a".repeat(40);
  const referenceCommit = "b".repeat(40);
  const objects = [];
  const captures = Object.entries(PROFILES).map(([profileId, dimensions]) => {
    const siteBytes = decodablePng(dimensions.width, dimensions.height);
    const siteKey = `ui-verification/${runId}/${profileId}-site.png`;
    objects.push({ key: siteKey, bytes: siteBytes });
    const capture = {
      caseId: CASE_ID,
      targetId: TARGET_ID,
      capturePointId: CAPTURE_POINT_ID,
      profileId,
      status: "captured",
      inputFingerprint: "c".repeat(64),
      provenance: {
        verified: true,
        appCommit,
        referenceCommit,
        capturedAt: "2026-10-09T10:00:00.000Z",
      },
      site: { key: siteKey, sha256: sha256(siteBytes), ...dimensions },
    };
    if (profileId === "desktop") {
      const referenceBytes = decodablePng(
        dimensions.width,
        dimensions.height,
        [5, 15, 25, 255],
      );
      const referenceKey = `ui-verification/${runId}/desktop-reference.png`;
      objects.push({ key: referenceKey, bytes: referenceBytes });
      capture.reference = {
        key: referenceKey,
        sha256: sha256(referenceBytes),
        ...dimensions,
      };
    }
    return capture;
  });

  return {
    manifest: {
      schemaVersion: 1,
      runId,
      createdAt: "2026-10-09T10:01:00.000Z",
      checkpoint: {
        app: { ref: "refs/tags/app-1", commit: appCommit },
        reference: { ref: "refs/tags/reference-1", commit: referenceCommit },
      },
      catalogue: [
        {
          schemaVersion: 1,
          caseId: CASE_ID,
          targetId: TARGET_ID,
          capturePointId: CAPTURE_POINT_ID,
          storyId: "homepage-story",
          label: "Homepage",
          scoreProfile: "desktop",
          recipe: { path: "/" },
          reference: { storyId: "homepage-reference", selector: "main" },
          status: "active",
        },
      ],
      captures,
    },
    objects,
  };
}

function fakeR2Bucket() {
  const values = new Map();
  const hash = (bytes) => sha256(bytes);
  return {
    values,
    async put(key, body, options = {}) {
      const bytes = Buffer.from(body);
      const existing = values.get(key);
      if (existing && options.onlyIf?.etagDoesNotMatch === "*") return null;
      const object = {
        key,
        bytes,
        etag: hash(bytes),
        httpMetadata: options.httpMetadata,
      };
      values.set(key, object);
      return { key, etag: object.etag };
    },
    async get(key) {
      const object = values.get(key);
      if (!object) return null;
      return {
        key,
        size: object.bytes.length,
        etag: object.etag,
        httpMetadata: object.httpMetadata,
        arrayBuffer: async () =>
          object.bytes.buffer.slice(
            object.bytes.byteOffset,
            object.bytes.byteOffset + object.bytes.byteLength,
          ),
      };
    },
    async list({ prefix, limit = 1000, cursor }) {
      const keys = [...values.keys()]
        .filter((key) => key.startsWith(prefix) && (!cursor || key > cursor))
        .sort();
      const objects = keys
        .slice(0, limit)
        .map((key) => ({ key, etag: values.get(key).etag }));
      const truncated = keys.length > limit;
      return {
        objects,
        truncated,
        cursor: truncated ? objects.at(-1)?.key : undefined,
      };
    },
  };
}

function accessJwt(privateKey, audience, email = "reviewer@example.test") {
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(
    JSON.stringify({ alg: "RS256", typ: "JWT", kid: "access-test" }),
  ).toString("base64url");
  const payload = Buffer.from(
    JSON.stringify({
      iss: "https://team.cloudflareaccess.com",
      aud: audience,
      sub: "access-subject-42",
      ...(email ? { email } : {}),
      exp: now + 300,
      nbf: now - 1,
    }),
  ).toString("base64url");
  const signingInput = `${header}.${payload}`;
  const signer = createSign("RSA-SHA256");
  signer.update(signingInput);
  signer.end();
  return `${signingInput}.${signer.sign(privateKey).toString("base64url")}`;
}

test("Worker rejects untrusted readers and reviewer headers, while publisher Bearer token is scoped", async (_t) => {
  const worker = createWorker();
  const bucket = fakeR2Bucket();
  const env = {
    ARCHIVE: bucket,
    PUBLISHER_TOKEN,
    ACCESS_ISSUER: "https://team.cloudflareaccess.com",
    ACCESS_AUD: "archive-app-audience",
    ALLOWED_ORIGINS: "https://storybook.example.test",
  };

  const rejected = await worker.fetch(
    new Request("https://archive.example.test/api/runs", {
      headers: { "x-reviewer": "spoofed@example.test" },
    }),
    env,
  );
  assert.equal(rejected.status, 401);

  const originRejected = await worker.fetch(
    new Request("https://archive.example.test/api/runs", {
      headers: {
        Origin: "https://attacker.example.test",
        Authorization: `Bearer ${PUBLISHER_TOKEN}`,
      },
    }),
    env,
  );
  assert.equal(originRejected.status, 403);

  const publisherRead = await worker.fetch(
    new Request("https://archive.example.test/api/runs", {
      headers: {
        Authorization: `Bearer ${PUBLISHER_TOKEN}`,
        Origin: "https://storybook.example.test",
      },
    }),
    env,
  );
  assert.equal(publisherRead.status, 200);
  assert.equal(
    publisherRead.headers.get("access-control-allow-origin"),
    "https://storybook.example.test",
  );

  const archiveInfo = await worker.fetch(
    new Request("https://archive.example.test/api/archive-info", {
      headers: { Authorization: `Bearer ${PUBLISHER_TOKEN}` },
    }),
    env,
  );
  assert.equal(archiveInfo.status, 200);
  assert.deepEqual(await archiveInfo.json(), {
    storage: { kind: "r2", location: "Storybook archive" },
  });
});

test("Worker publishes immutable PNG objects and seals a run only after verifying every reference", async (_t) => {
  const worker = createWorker();
  const bucket = fakeR2Bucket();
  const env = {
    ARCHIVE: bucket,
    PUBLISHER_TOKEN,
    ACCESS_ISSUER: "https://team.cloudflareaccess.com",
    ACCESS_AUD: "archive-app-audience",
    ALLOWED_ORIGINS: "https://storybook.example.test",
  };
  const { manifest, objects } = makeFixture("run-worker-publish");

  for (const object of objects) {
    const response = await worker.fetch(
      new Request(
        `https://archive.example.test/api/objects?key=${encodeURIComponent(object.key)}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${PUBLISHER_TOKEN}`,
            "Content-Type": "image/png",
          },
          body: object.bytes,
        },
      ),
      env,
    );
    assert.equal(response.status, 201);
  }

  const sealed = await worker.fetch(
    new Request("https://archive.example.test/api/runs", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PUBLISHER_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(manifest),
    }),
    env,
  );
  assert.equal(sealed.status, 201);

  const listed = await worker.fetch(
    new Request(`https://archive.example.test/api/runs?caseId=${CASE_ID}`, {
      headers: { Authorization: `Bearer ${PUBLISHER_TOKEN}` },
    }),
    env,
  );
  assert.equal(listed.status, 200);
  assert.equal((await listed.json()).runs[0].runId, manifest.runId);

  const bytes = await worker.fetch(
    new Request(
      `https://archive.example.test/api/objects?key=${encodeURIComponent(objects[0].key)}`,
      { headers: { Authorization: `Bearer ${PUBLISHER_TOKEN}` } },
    ),
    env,
  );
  assert.equal(bytes.headers.get("content-type"), "image/png");
  assert.equal(
    sha256(Buffer.from(await bytes.arrayBuffer())),
    manifest.captures[0].site.sha256,
  );

  const conflict = await worker.fetch(
    new Request(
      `https://archive.example.test/api/objects?key=${encodeURIComponent(objects[0].key)}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${PUBLISHER_TOKEN}`,
          "Content-Type": "image/png",
        },
        body: decodablePng(
          PROFILES.desktop.width,
          PROFILES.desktop.height,
          [0, 0, 0, 255],
        ),
      },
    ),
    env,
  );
  assert.equal(conflict.status, 409);
});

test("Worker attributes human review only to a verified Access JWT and pins capture hashes", async (_t) => {
  const bucket = fakeR2Bucket();
  const { publicKey, privateKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,
  });
  const jwksUrl = "https://team.cloudflareaccess.com/certs";
  const worker = createWorker({
    fetcher: async () =>
      new Response(
        JSON.stringify({
          keys: [
            {
              ...publicKey.export({ format: "jwk" }),
              kid: "access-test",
              alg: "RS256",
              use: "sig",
            },
          ],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
  });
  const env = {
    ARCHIVE: bucket,
    PUBLISHER_TOKEN,
    ACCESS_ISSUER: "https://team.cloudflareaccess.com",
    ACCESS_AUD: "archive-app-audience",
    ACCESS_JWKS_URL: jwksUrl,
    ALLOWED_ORIGINS: "https://storybook.example.test",
  };
  const { manifest, objects } = makeFixture("run-worker-review");
  await createR2Archive(bucket).publish(manifest, objects);

  const body = {
    runId: manifest.runId,
    caseId: CASE_ID,
    targetId: TARGET_ID,
    capturePointId: CAPTURE_POINT_ID,
    profileId: "desktop",
    decision: "changes-requested",
    comment: "Please revisit the spacing.",
  };
  const spoofed = await worker.fetch(
    new Request("https://archive.example.test/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-reviewer": "reviewer@example.test",
        Origin: "https://storybook.example.test",
      },
      body: JSON.stringify(body),
    }),
    env,
  );
  assert.equal(spoofed.status, 401);

  const serviceTokenReview = await worker.fetch(
    new Request("https://archive.example.test/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cf-Access-Jwt-Assertion": accessJwt(
          privateKey,
          "archive-app-audience",
          null,
        ),
        Origin: "https://storybook.example.test",
      },
      body: JSON.stringify(body),
    }),
    env,
  );
  assert.equal(serviceTokenReview.status, 401);

  const saved = await worker.fetch(
    new Request("https://archive.example.test/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cf-Access-Jwt-Assertion": accessJwt(
          privateKey,
          "archive-app-audience",
        ),
        Origin: "https://storybook.example.test",
      },
      body: JSON.stringify(body),
    }),
    env,
  );
  assert.equal(saved.status, 201);
  const review = await saved.json();
  assert.equal(review.reviewer.subject, "access-subject-42");
  assert.equal(review.reviewer.email, "reviewer@example.test");
  assert.equal(review.capture.siteHash, manifest.captures[0].site.sha256);
  assert.equal(
    review.capture.referenceHash,
    manifest.captures[0].reference.sha256,
  );
});

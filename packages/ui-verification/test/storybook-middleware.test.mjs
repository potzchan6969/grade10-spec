import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import test from "node:test";
import {
  createLocalArchiveHandler,
  installUiVerificationArchive,
  resolveArchiveRoot,
} from "../dev/storybook-middleware.mjs";

test("both Storybook configs expose the native default middleware", async () => {
  const preview = await import(
    "../../../apps/preview/.storybook/middleware.mjs"
  );
  const workbench = await import(
    "../../../apps/preview/.storybook-workbench/middleware.mjs"
  );

  assert.equal(typeof preview.default, "function");
  assert.equal(workbench.default, preview.default);
});

test("archive root prefers an enclosing app and accepts only absolute overrides", async () => {
  const tempRoot = await mkdtemp(join(tmpdir(), "ui-verification-root-"));
  try {
    const appRoot = join(tempRoot, "app");
    const specRoot = join(appRoot, "external", "grade10-spec");
    const standaloneRoot = join(tempRoot, "standalone-spec");
    await mkdir(specRoot, { recursive: true });
    await mkdir(standaloneRoot, { recursive: true });

    assert.equal(
      resolveArchiveRoot({ specRoot, env: {} }),
      resolve(appRoot, ".cache", "ui-verification"),
    );
    assert.equal(
      resolveArchiveRoot({ specRoot: standaloneRoot, env: {} }),
      resolve(standaloneRoot, ".cache", "ui-verification"),
    );
    assert.equal(
      resolveArchiveRoot({
        specRoot,
        env: { UI_VERIFICATION_ARCHIVE: join(tempRoot, "demo-archive") },
      }),
      resolve(tempRoot, "demo-archive"),
    );
    assert.throws(
      () =>
        resolveArchiveRoot({
          specRoot,
          env: { UI_VERIFICATION_ARCHIVE: ".cache/demo-archive" },
        }),
      /absolute path/,
    );
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

test("local archive handler reports storage and identifies the local reviewer", async () => {
  const storageRoot = resolve("/tmp/ui-verification-local");
  const handler = createLocalArchiveHandler(
    {
      async createReview(_input, reviewer) {
        return { reviewer };
      },
    },
    storageRoot,
  );
  const origin = "http://localhost:6006";

  const info = await handler(
    new Request(`${origin}/api/archive-info`, {
      headers: { Origin: origin },
    }),
  );
  assert.equal(info.status, 200);
  assert.deepEqual(await info.json(), {
    storage: { kind: "filesystem", location: storageRoot },
  });
  assert.equal(info.headers.has("access-control-allow-origin"), false);

  const review = await handler(
    new Request(`${origin}/api/reviews`, {
      method: "POST",
      headers: { Origin: origin, "Content-Type": "application/json" },
      body: "{}",
    }),
  );
  assert.equal(review.status, 201);
  assert.deepEqual(await review.json(), {
    reviewer: { subject: "local-development" },
  });

  const rejected = await handler(
    new Request(`${origin}/api/archive-info`, {
      headers: { Origin: "http://attacker.example.test" },
    }),
  );
  assert.equal(rejected.status, 403);
  assert.equal(rejected.headers.has("access-control-allow-origin"), false);
});

test("Storybook mounts the archive API on loopback and rejects a non-loopback host", async () => {
  const tempRoot = await mkdtemp(join(tmpdir(), "ui-verification-server-"));
  const specRoot = join(tempRoot, "spec");
  const archiveRoot = join(tempRoot, "archive");
  await mkdir(specRoot, { recursive: true });

  let mountedPath;
  let route;
  installUiVerificationArchive(
    {
      use(middleware) {
        mountedPath = middleware;
        route = middleware;
      },
    },
    {
      specRoot,
      env: { UI_VERIFICATION_ARCHIVE: archiveRoot },
    },
  );
  assert.equal(mountedPath, route);
  assert.equal(typeof route, "function");

  const makeRequest = (host, origin) => ({
    method: "GET",
    url: "/api/archive-info",
    headers: { host, ...(origin ? { origin } : {}) },
    socket: { remoteAddress: "127.0.0.1" },
  });
  const makeResponse = () => ({
    headers: new Map(),
    setHeader(name, value) {
      this.headers.set(name.toLowerCase(), value);
    },
    end(body) {
      this.body = body ? Buffer.from(body) : Buffer.alloc(0);
    },
  });
  try {
    const valid = makeResponse();
    await route(
      makeRequest("127.0.0.1:6006", "http://127.0.0.1:6006"),
      valid,
      () => assert.fail("the archive API must handle this request"),
    );
    assert.equal(valid.statusCode, 200);
    assert.deepEqual(JSON.parse(valid.body.toString()), {
      storage: { kind: "filesystem", location: archiveRoot },
    });

    const wrongOrigin = makeResponse();
    await route(
      makeRequest("127.0.0.1:6006", "http://attacker.example.test"),
      wrongOrigin,
      () => assert.fail("the archive API must reject this request"),
    );
    assert.equal(wrongOrigin.statusCode, 403);
    assert.equal(wrongOrigin.headers.has("access-control-allow-origin"), false);

    const wrongHost = makeResponse();
    await route(
      makeRequest("attacker.example.test", "http://attacker.example.test"),
      wrongHost,
      () => assert.fail("the archive API must reject this request"),
    );
    assert.equal(wrongHost.statusCode, 403);

    const wrongRemote = makeResponse();
    await route(
      {
        ...makeRequest("127.0.0.1:6006", "http://127.0.0.1:6006"),
        socket: { remoteAddress: "192.0.2.10" },
      },
      wrongRemote,
      () => assert.fail("the archive API must reject this request"),
    );
    assert.equal(wrongRemote.statusCode, 403);

    let continued = false;
    await route({ method: "GET", url: "/index.json" }, makeResponse(), () => {
      continued = true;
    });
    assert.equal(continued, true);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { once } from "node:events";
import { mkdtemp, readFile, realpath, rm, stat } from "node:fs/promises";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { extname, join, relative, resolve, sep } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { createArchive } from "@grade10/ui-verification/archive";
import { createArchiveHandler } from "@grade10/ui-verification/archive-api";
import { assessReport } from "@grade10/ui-verification/scoring";

const directory = resolve(fileURLToPath(new URL(".", import.meta.url)));
const repositoryRoot = resolve(directory, "../../../..");
const requirePreview = createRequire(
  resolve(repositoryRoot, "apps/preview/package.json"),
);
const { chromium } = requirePreview("playwright");
const STORY_ID = "pages-not-found--default";
const CASE_ID = "vc_c00fc18c-bacf-4e88-931c-85d550dc4c2b";
const PROFILE_SIZES = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 390, height: 844 },
};
const DECLARATIONS = [
  {
    schemaVersion: 1,
    caseId: CASE_ID,
    targetId: "not-found-page",
    capturePointId: "default-page",
    storyId: STORY_ID,
    label: "Pages/Not Found/Default page",
    scoreProfile: "desktop",
    recipe: "Render the not found page.",
    reference: { storyId: STORY_ID, selector: "main" },
  },
  {
    schemaVersion: 1,
    caseId: CASE_ID,
    targetId: "not-found-content",
    capturePointId: "empty-content",
    storyId: STORY_ID,
    label: "Pages/Not Found/Empty content",
    scoreProfile: "desktop",
    recipe: "Render the not found content.",
    reference: { storyId: STORY_ID, selector: "main" },
  },
];
const STORYBOOK_STATIC = resolve(
  repositoryRoot,
  process.env.UI_VERIFICATION_STORYBOOK_STATIC ??
    "apps/preview/storybook-static",
);

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

function escapeHtml(value) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character],
  );
}

async function screenshot(browser, viewport, text, background) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  try {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setContent(
      `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>
        * { box-sizing: border-box; }
        html, body { width: 100%; height: 100%; margin: 0; }
        body { display: grid; place-items: center; padding: 8vw; background: ${background}; color: #172033; font: 32px / 1.2 Arial, sans-serif; }
        main { width: 100%; min-height: 100%; display: grid; align-content: center; gap: 16px; }
        h1, p { margin: 0; }
      </style></head><body><main><h1>${escapeHtml(text)}</h1><p>Immutable browser evidence.</p></main></body></html>`,
      { waitUntil: "load" },
    );
    await page.evaluate(() => document.fonts.ready);
    return await page.screenshot({ type: "png" });
  } finally {
    await page.close();
  }
}

async function publishRun(archive, browser, { runId, createdAt, storyId }) {
  const appCommit = "a".repeat(40);
  const referenceCommit = "b".repeat(40);
  const catalogue = DECLARATIONS.map((declaration) => ({
    ...declaration,
    storyId,
    status: "active",
  }));
  const captures = [];
  const objects = [];

  for (const [index, declaration] of catalogue.entries()) {
    for (const [profileId, viewport] of Object.entries(PROFILE_SIZES)) {
      const siteBytes = await screenshot(
        browser,
        viewport,
        `${runId} ${declaration.targetId} site`,
        index === 0 ? "#edf4ff" : "#f6f0ff",
      );
      const site = {
        key: `ui-verification/${runId}/${declaration.caseId}/${declaration.targetId}/${declaration.capturePointId}/${profileId}/site.png`,
        sha256: sha256(siteBytes),
        ...viewport,
      };
      objects.push({ key: site.key, bytes: siteBytes });
      const capture = {
        caseId: declaration.caseId,
        targetId: declaration.targetId,
        capturePointId: declaration.capturePointId,
        profileId,
        inputFingerprint: sha256(
          Buffer.from(`${runId}:${declaration.targetId}:${profileId}`),
        ),
        status: "captured",
        provenance: {
          verified: false,
          appCommit,
          referenceCommit,
          capturedAt: createdAt,
        },
        site,
      };
      if (profileId === declaration.scoreProfile) {
        const referenceBytes = await screenshot(
          browser,
          viewport,
          `${runId} ${declaration.targetId} reference`,
          "#f8f5ec",
        );
        const reference = {
          key: `ui-verification/${runId}/${declaration.caseId}/${declaration.targetId}/${declaration.capturePointId}/${profileId}/reference.png`,
          sha256: sha256(referenceBytes),
          ...viewport,
        };
        capture.reference = reference;
        objects.push({ key: reference.key, bytes: referenceBytes });
      }
      captures.push(capture);
    }
  }

  const manifest = {
    schemaVersion: 1,
    runId,
    createdAt,
    checkpoint: {
      app: { ref: "fixture-app-checkpoint", commit: appCommit },
      reference: {
        ref: "fixture-reference-checkpoint",
        commit: referenceCommit,
      },
    },
    catalogue,
    captures,
  };
  await archive.publish(manifest, objects);
  return manifest;
}

async function publishUnmatchedRun(archive, index) {
  const runId = `unrelated-run-${String(index).padStart(3, "0")}`;
  const createdAt = new Date(Date.UTC(2026, 9, 2, 0, index)).toISOString();
  const appCommit = "d".repeat(40);
  const referenceCommit = "e".repeat(40);
  const declaration = {
    schemaVersion: 1,
    caseId: `vc_unrelated_${String(index).padStart(3, "0")}`,
    targetId: "unrelated-target",
    capturePointId: "unrelated-point",
    storyId: "another-story--default",
    label: `Unrelated story ${index}`,
    scoreProfile: "desktop",
    recipe: "This case belongs to another story.",
    reference: { storyId: "another-story--reference" },
    status: "active",
  };
  const captures = Object.keys(PROFILE_SIZES).map((profileId) => ({
    caseId: declaration.caseId,
    targetId: declaration.targetId,
    capturePointId: declaration.capturePointId,
    profileId,
    inputFingerprint: sha256(Buffer.from(`${runId}:${profileId}`)),
    status: "failed",
    provenance: {
      verified: false,
      appCommit,
      referenceCommit,
      capturedAt: createdAt,
    },
    failure: { message: "Fixture capture is intentionally unavailable." },
  }));
  await archive.publish(
    {
      schemaVersion: 1,
      runId,
      createdAt,
      checkpoint: {
        app: { ref: "fixture-app-checkpoint", commit: appCommit },
        reference: {
          ref: "fixture-reference-checkpoint",
          commit: referenceCommit,
        },
      },
      catalogue: [declaration],
      captures,
    },
    [],
  );
}

async function publishReferenceStoryRun(archive, browser) {
  const runId = "reference-story-history-0001";
  const createdAt = "2026-10-01T10:01:00.000Z";
  const appCommit = "f".repeat(40);
  const referenceCommit = "1".repeat(40);
  const declaration = {
    schemaVersion: 1,
    caseId: "vc_breadcrumbs_history",
    targetId: "breadcrumb-navigation",
    capturePointId: "default-navigation",
    storyId: "components-breadcrumbs--previous-name",
    label: "Components/Breadcrumbs/Previous name",
    scoreProfile: "desktop",
    recipe: "Render the shared breadcrumbs component.",
    reference: {
      storyId: "components-breadcrumbs--default",
      selector: "nav",
    },
    status: "active",
  };
  const captures = [];
  const objects = [];
  for (const [profileId, viewport] of Object.entries(PROFILE_SIZES)) {
    const siteBytes = await screenshot(
      browser,
      viewport,
      "Archived breadcrumb navigation",
      "#edf4ff",
    );
    const site = {
      key: `ui-verification/${runId}/${declaration.caseId}/${declaration.targetId}/${declaration.capturePointId}/${profileId}/site.png`,
      sha256: sha256(siteBytes),
      ...viewport,
    };
    const capture = {
      caseId: declaration.caseId,
      targetId: declaration.targetId,
      capturePointId: declaration.capturePointId,
      profileId,
      inputFingerprint: sha256(Buffer.from(`${runId}:${profileId}`)),
      status: "captured",
      provenance: {
        verified: false,
        appCommit,
        referenceCommit,
        capturedAt: createdAt,
      },
      site,
    };
    objects.push({ key: site.key, bytes: siteBytes });
    if (profileId === declaration.scoreProfile) {
      const referenceBytes = await screenshot(
        browser,
        viewport,
        "Reference breadcrumb navigation",
        "#f8f5ec",
      );
      const reference = {
        key: `ui-verification/${runId}/${declaration.caseId}/${declaration.targetId}/${declaration.capturePointId}/${profileId}/reference.png`,
        sha256: sha256(referenceBytes),
        ...viewport,
      };
      capture.reference = reference;
      objects.push({ key: reference.key, bytes: referenceBytes });
    }
    captures.push(capture);
  }
  await archive.publish(
    {
      schemaVersion: 1,
      runId,
      createdAt,
      checkpoint: {
        app: { ref: "fixture-app-checkpoint", commit: appCommit },
        reference: {
          ref: "fixture-reference-checkpoint",
          commit: referenceCommit,
        },
      },
      catalogue: [declaration],
      captures,
    },
    objects,
  );
}

async function publishAssessment(archive, manifest, declaration) {
  const capture = manifest.captures.find(
    (entry) =>
      entry.caseId === declaration.caseId &&
      entry.targetId === declaration.targetId &&
      entry.capturePointId === declaration.capturePointId &&
      entry.profileId === declaration.scoreProfile,
  );
  assert(capture && capture.status === "captured" && capture.reference);
  const scorer = {
    id: "fixture-scorer",
    version: "fixture-v1",
    model: "fixture-model",
  };
  const rubricVersion = "fixture-rubric-v1";
  const contractHash = "c".repeat(64);
  const expected = {
    caseId: capture.caseId,
    targetId: capture.targetId,
    capturePointId: capture.capturePointId,
    profileId: capture.profileId,
    scorerId: scorer.id,
    scorerVersion: scorer.version,
    scorerModel: scorer.model,
    rubricVersion,
    contractHash,
    siteSha256: capture.site.sha256,
    referenceSha256: capture.reference.sha256,
    captureStatus: capture.status,
    provenanceVerified: capture.provenance.verified,
    failureCount: 0,
  };
  const assessment = assessReport({
    expected,
    report: {
      schemaVersion: 1,
      ...expected,
      scorer,
      imageHashes: {
        site: capture.site.sha256,
        reference: capture.reference.sha256,
      },
      similarity: 99,
      dimensions: Object.fromEntries(
        ["layout", "typography", "color", "imagery", "content"].map((name) => [
          name,
          { score: 99, findings: [] },
        ]),
      ),
      criticalMismatches: [],
    },
  });
  await archive.createAssessment({ runId: manifest.runId, ...assessment });
}

function mimeType(pathname) {
  switch (extname(pathname).toLowerCase()) {
    case ".html":
      return "text/html; charset=utf-8";
    case ".js":
    case ".mjs":
      return "text/javascript; charset=utf-8";
    case ".css":
      return "text/css; charset=utf-8";
    case ".json":
      return "application/json; charset=utf-8";
    case ".svg":
      return "image/svg+xml";
    case ".png":
      return "image/png";
    case ".woff2":
      return "font/woff2";
    default:
      return "application/octet-stream";
  }
}

async function startWorkbenchServer(root, archive) {
  const realRoot = await realpath(root);
  const indexPath = join(realRoot, "index.html");
  await stat(indexPath);
  const apiRequests = [];
  let archiveHandler;
  const server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url ?? "/", "http://127.0.0.1");
      if (url.pathname.startsWith("/api/")) {
        apiRequests.push(
          `${request.method ?? "GET"} ${url.pathname}${url.search}`,
        );
        const chunks = [];
        for await (const chunk of request) chunks.push(Buffer.from(chunk));
        const body = Buffer.concat(chunks);
        const headers = new Headers();
        for (const [name, value] of Object.entries(request.headers)) {
          if (Array.isArray(value)) {
            for (const item of value) headers.append(name, item);
          } else if (value !== undefined) {
            headers.set(name, value);
          }
        }
        const webRequest = new Request(url.href, {
          method: request.method,
          headers,
          ...(body.length > 0 ? { body, duplex: "half" } : {}),
        });
        const result = await archiveHandler(webRequest);
        response.writeHead(result.status, Object.fromEntries(result.headers));
        response.end(Buffer.from(await result.arrayBuffer()));
        return;
      }

      const relativePath = decodeURIComponent(url.pathname).replace(/^\/+/, "");
      let filePath = resolve(realRoot, relativePath || "index.html");
      const candidateRelative = relative(realRoot, filePath);
      if (
        candidateRelative === ".." ||
        candidateRelative.startsWith(`..${sep}`) ||
        resolve(realRoot, candidateRelative) !== filePath
      ) {
        response.writeHead(403).end("Forbidden");
        return;
      }
      let fileInfo;
      try {
        fileInfo = await stat(filePath);
      } catch {
        if (extname(filePath)) {
          response.writeHead(404).end("Not found");
          return;
        }
        filePath = indexPath;
        fileInfo = await stat(filePath);
      }
      if (fileInfo.isDirectory()) filePath = join(filePath, "index.html");
      const bytes = await readFile(filePath);
      response.writeHead(200, {
        "Content-Type": mimeType(filePath),
        "Cache-Control": "no-cache",
      });
      response.end(bytes);
    } catch (error) {
      response
        .writeHead(500)
        .end(error instanceof Error ? error.message : "Workbench server error");
    }
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  assert(address && typeof address === "object");
  const origin = `http://127.0.0.1:${address.port}`;
  archiveHandler = createArchiveHandler(archive, {
    authorize: async (_request, scope) =>
      scope === "review"
        ? { kind: "human", reviewer: { subject: "Panel browser fixture" } }
        : { kind: "human" },
    allowedOrigins: [origin],
  });
  return {
    origin,
    apiRequests,
    close: () =>
      new Promise((resolveClose, rejectClose) => {
        server.close((error) => (error ? rejectClose(error) : resolveClose()));
      }),
  };
}

test("the central workbench connects on cold load and reviews story history by case and target", {
  timeout: 180_000,
}, async (t) => {
  const archiveRoot = await mkdtemp(join(tmpdir(), "ui-verification-preview-"));
  let server;
  let browser;
  t.after(async () => {
    await browser?.close();
    await server?.close();
    await rm(archiveRoot, { recursive: true, force: true });
  });

  const archive = await createArchive(archiveRoot);
  browser = await chromium.launch({ headless: true });
  const oldRun = await publishRun(archive, browser, {
    runId: "preview-history-0001",
    createdAt: "2026-10-08T10:01:00.000Z",
    storyId: "pages-not-found--renamed",
  });
  await publishRun(archive, browser, {
    runId: "preview-history-0002",
    createdAt: "2026-10-09T10:01:00.000Z",
    storyId: STORY_ID,
  });
  await publishAssessment(archive, oldRun, DECLARATIONS[0]);
  server = await startWorkbenchServer(STORYBOOK_STATIC, archive);

  const page = await browser.newPage();
  const requestOrigins = new Set();
  page.on("request", (request) =>
    requestOrigins.add(new URL(request.url()).origin),
  );
  await page.addInitScript(() => {
    window.localStorage.setItem(
      "grade10.ui-verification.archive-url",
      "http://localhost:4466",
    );
  });
  await page.goto(`${server.origin}/?path=/story/${STORY_ID}`, {
    waitUntil: "domcontentloaded",
  });
  await page.getByRole("tab", { name: "Verification" }).click();
  await page
    .getByRole("combobox", { name: "Verification target" })
    .waitFor({ state: "visible" });

  const endpoint = page.getByLabel("Archive endpoint");
  assert.equal(await endpoint.inputValue(), server.origin);
  assert.ok(
    server.apiRequests.some((entry) => entry.startsWith("GET /api/runs?")),
    "the panel should request archive runs without pressing Connect",
  );
  assert.equal(
    requestOrigins.has("http://localhost:4466"),
    false,
    "a saved development URL must not replace the workbench origin",
  );

  const targetSelect = page.getByRole("combobox", {
    name: "Verification target",
  });
  await targetSelect.selectOption(
    `${DECLARATIONS[0].caseId}::${DECLARATIONS[0].targetId}::${DECLARATIONS[0].capturePointId}`,
  );
  assert.equal(await targetSelect.locator("option").count(), 2);

  const runSelect = page.getByRole("combobox", { name: "Archived run" });
  await runSelect.waitFor({ state: "visible" });
  await runSelect.selectOption("preview-history-0001");
  await page.getByText("Model decision: shadow", { exact: true }).waitFor();
  await page.getByRole("tab", { name: "Desktop 1440x900" }).click();
  const siteImage = page.getByRole("img", { name: "Site full viewport" });
  await siteImage.waitFor();
  assert.deepEqual(
    await siteImage.evaluate((image) => [
      image.naturalWidth,
      image.naturalHeight,
    ]),
    [1440, 900],
  );
  await page.getByRole("tab", { name: "Tablet 768x1024" }).click();
  await page
    .getByText("No model assessment recorded", { exact: true })
    .waitFor();
  await page.getByRole("tab", { name: "Mobile 390x844" }).click();
  await page
    .getByText("No model assessment recorded", { exact: true })
    .waitFor();

  await page.getByRole("tab", { name: "Desktop 1440x900" }).click();
  await page.getByLabel("Review decision").selectOption("approved");
  await page
    .getByLabel("Review comment")
    .fill("The archived page target is approved.");
  await page.getByRole("button", { name: "Submit review" }).click();
  await page
    .getByText("The archived page target is approved.", { exact: true })
    .waitFor();
  assert.ok(
    server.apiRequests.some((entry) => entry.startsWith("POST /api/reviews")),
    "review submission should reach the archive API",
  );

  await page.reload({ waitUntil: "domcontentloaded" });
  await page.getByRole("tab", { name: "Verification" }).click();
  await page
    .getByRole("combobox", { name: "Verification target" })
    .waitFor({ state: "visible" });
  await page
    .getByRole("combobox", { name: "Verification target" })
    .selectOption(
      `${DECLARATIONS[0].caseId}::${DECLARATIONS[0].targetId}::${DECLARATIONS[0].capturePointId}`,
    );
  await page
    .getByRole("combobox", { name: "Archived run" })
    .selectOption("preview-history-0001");
  await page
    .getByText("The archived page target is approved.", { exact: true })
    .waitFor();
  await page.close();
});

test("a shared story without a verification parameter finds its reference case after paging past unrelated runs", {
  timeout: 180_000,
}, async (t) => {
  const archiveRoot = await mkdtemp(
    join(tmpdir(), "ui-verification-discovery-"),
  );
  let server;
  let browser;
  t.after(async () => {
    await browser?.close();
    await server?.close();
    await rm(archiveRoot, { recursive: true, force: true });
  });

  const archive = await createArchive(archiveRoot);
  browser = await chromium.launch({ headless: true });
  await publishReferenceStoryRun(archive, browser);
  for (let index = 0; index < 101; index += 1) {
    await publishUnmatchedRun(archive, index);
  }
  server = await startWorkbenchServer(STORYBOOK_STATIC, archive);

  const page = await browser.newPage();
  await page.goto(
    `${server.origin}/?path=/story/components-breadcrumbs--default`,
    { waitUntil: "domcontentloaded" },
  );
  await page.getByRole("tab", { name: "Verification" }).click();
  const targetSelect = page.getByRole("combobox", {
    name: "Verification target",
  });
  await targetSelect.waitFor({ state: "visible", timeout: 60_000 });

  assert.equal(await targetSelect.locator("option").count(), 1);
  assert.match(await targetSelect.inputValue(), /^vc_breadcrumbs_history::/);
  assert.ok(
    server.apiRequests.filter((entry) => entry.startsWith("GET /api/runs?"))
      .length > 1,
    "story discovery should follow every run-history cursor",
  );
  await page
    .getByRole("combobox", { name: "Archived run" })
    .selectOption("reference-story-history-0001");
  await page
    .getByText("components-breadcrumbs--previous-name", { exact: true })
    .waitFor();
  await page.close();
});

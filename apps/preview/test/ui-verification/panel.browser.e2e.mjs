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
const STORY_ID = "site-navigation-screens-not-found--default";
const CASE_ID = "vc_c00fc18c-bacf-4e88-931c-85d550dc4c2b";
const PROFILE_SIZES = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 390, height: 844 },
};
const GRADE10_LOCALES = ["en", "zh-Hant", "zh-Hans"];
const LOCALE_LABELS = {
  en: "English",
  "zh-Hant": "Traditional Chinese",
  "zh-Hans": "Simplified Chinese",
  ko: "Korean",
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

function localeEvidenceText(locale, runId, targetId, kind) {
  const title = {
    en: { site: "Not found", reference: "Page not found" },
    "zh-Hant": { site: "找不到頁面", reference: "頁面不存在" },
    "zh-Hans": { site: "找不到页面", reference: "页面不存在" },
    ko: { site: "페이지를 찾을 수 없음", reference: "페이지 없음" },
  }[locale]?.[kind];
  return `${title ?? locale} · ${runId} · ${targetId}`;
}

async function waitForCondition(check, description) {
  const deadline = Date.now() + 5_000;
  while (Date.now() < deadline) {
    if (await check()) return;
    await new Promise((resolveWait) => setTimeout(resolveWait, 25));
  }
  assert.fail(`Timed out waiting for ${description}.`);
}

async function waitForImageDimensions(page, alt, viewport) {
  const image = page.getByRole("img", { name: alt });
  await image.waitFor({ state: "visible" });
  await page.waitForFunction(
    ({ expectedAlt, width, height }) => {
      const element = Array.from(document.images).find(
        (candidate) => candidate.alt === expectedAlt,
      );
      return (
        element?.complete === true &&
        element.naturalWidth === width &&
        element.naturalHeight === height
      );
    },
    { expectedAlt: alt, ...viewport },
  );
  return image;
}

async function screenshot(browser, viewport, text, background, locale = "en") {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  try {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setContent(
      `<!doctype html><html lang="${escapeHtml(locale)}"><head><meta charset="utf-8"><style>
        * { box-sizing: border-box; }
        html, body { width: 100%; height: 100%; margin: 0; }
        body { display: grid; place-items: center; padding: 8vw; background: ${background}; color: #172033; font: 32px / 1.2 Arial, sans-serif; }
        main { width: 100%; min-height: 100%; display: grid; align-content: center; gap: 16px; }
        h1, p { margin: 0; }
      </style></head><body><main><h1>${escapeHtml(text)}</h1><p>Immutable browser evidence.</p></main></body></html>`,
      { waitUntil: "load" },
    );
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => {
      const main = document.querySelector("main");
      const heading = main?.querySelector("h1");
      const paragraph = main?.querySelector("p");
      const bounds = main?.getBoundingClientRect();
      return (
        document.readyState === "complete" &&
        document.fonts.status === "loaded" &&
        Boolean(heading?.textContent?.trim()) &&
        Boolean(paragraph?.textContent?.trim()) &&
        Boolean(bounds && bounds.width > 0 && bounds.height > 0)
      );
    });
    await page.evaluate(
      () =>
        new Promise((resolvePaint) => {
          requestAnimationFrame(() => requestAnimationFrame(resolvePaint));
        }),
    );
    return await page.screenshot({ type: "png" });
  } finally {
    await page.close();
  }
}

async function assertSelectedRunVisible(page, runId) {
  const runSelect = page.getByRole("combobox", { name: "Archived run" });
  await runSelect.waitFor({ state: "visible" });
  assert.equal(await runSelect.inputValue(), runId);
  const runHeading = page.getByRole("heading", { name: runId, exact: true });
  try {
    await runHeading.waitFor({ timeout: 5000 });
  } catch (error) {
    const screenshotPath = join(
      tmpdir(),
      `ui-verification-${runId}-failure.png`,
    );
    const diagnostic = {
      selectedRun: await runSelect.inputValue().catch(() => "unavailable"),
      panelText: await page
        .locator(".verification-panel")
        .innerText()
        .then((text) => text.slice(-2500))
        .catch(() => "unavailable"),
      screenshotPath,
    };
    await page
      .screenshot({ path: screenshotPath, fullPage: true })
      .catch(() => {});
    console.error(
      "Selected archived run diagnostics:\n" +
        JSON.stringify(diagnostic, null, 2),
    );
    throw error;
  }
}

async function publishRun(
  archive,
  browser,
  {
    runId,
    createdAt,
    storyId,
    referenceStoryId = STORY_ID,
    appCommit = "a".repeat(40),
    referenceCommit = "b".repeat(40),
    appRef = "fixture-app-checkpoint",
    referenceRef = "fixture-reference-checkpoint",
    includeReferenceRegion = true,
    locales,
    referenceEveryProfile = true,
  },
) {
  const catalogue = DECLARATIONS.map((declaration) => ({
    ...declaration,
    storyId,
    reference: { ...declaration.reference, storyId: referenceStoryId },
    status: "active",
  }));
  const captures = [];
  const objects = [];

  for (const [index, declaration] of catalogue.entries()) {
    const requestedLocales = locales ?? ["en"];
    for (const locale of requestedLocales) {
      for (const [profileId, viewport] of Object.entries(PROFILE_SIZES)) {
        const localeKey = locales ? `${locale}/` : "";
        const siteBytes = await screenshot(
          browser,
          viewport,
          locales
            ? localeEvidenceText(locale, runId, declaration.targetId, "site")
            : `${runId} ${declaration.targetId} site`,
          index === 0 ? "#edf4ff" : "#f6f0ff",
          locale,
        );
        const site = {
          key: `ui-verification/${runId}/${declaration.caseId}/${declaration.targetId}/${declaration.capturePointId}/${localeKey}${profileId}/site.png`,
          sha256: sha256(siteBytes),
          ...viewport,
        };
        objects.push({ key: site.key, bytes: siteBytes });
        const capture = {
          caseId: declaration.caseId,
          targetId: declaration.targetId,
          capturePointId: declaration.capturePointId,
          profileId,
          ...(locales ? { locale } : {}),
          inputFingerprint: sha256(
            Buffer.from(
              `${runId}:${declaration.targetId}:${locale}:${profileId}`,
            ),
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
        if (profileId === declaration.scoreProfile || referenceEveryProfile) {
          const referenceBytes = await screenshot(
            browser,
            viewport,
            locales
              ? localeEvidenceText(
                  locale,
                  runId,
                  declaration.targetId,
                  "reference",
                )
              : `${runId} ${declaration.targetId} reference`,
            "#f8f5ec",
            locale,
          );
          const reference = {
            key: `ui-verification/${runId}/${declaration.caseId}/${declaration.targetId}/${declaration.capturePointId}/${localeKey}${profileId}/reference.png`,
            sha256: sha256(referenceBytes),
            ...viewport,
          };
          capture.reference = reference;
          if (includeReferenceRegion) {
            capture.siteRegion = {
              x: 12,
              y: 16,
              width: Math.floor(viewport.width / 2),
              height: Math.floor(viewport.height / 2),
            };
            capture.referenceRegion = {
              x: 120,
              y: 80,
              width: viewport.width - 240,
              height: viewport.height - 160,
            };
          }
          objects.push({ key: reference.key, bytes: referenceBytes });
        }
        captures.push(capture);
      }
    }
  }

  const manifest = {
    schemaVersion: 1,
    runId,
    createdAt,
    checkpoint: {
      app: { ref: appRef, commit: appCommit },
      reference: {
        ref: referenceRef,
        commit: referenceCommit,
      },
    },
    catalogue,
    captures,
    ...(locales ? { locales } : {}),
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
    storyId: "design-system-display-breadcrumbs--previous-name",
    label: "Design System/Display/Breadcrumbs/Previous name",
    scoreProfile: "desktop",
    recipe: "Render the shared breadcrumbs component.",
    reference: {
      storyId: "design-system-display-breadcrumbs--default",
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

async function publishAssessment(
  archive,
  manifest,
  declaration,
  locale = "en",
) {
  const capture = manifest.captures.find(
    (entry) =>
      entry.caseId === declaration.caseId &&
      entry.targetId === declaration.targetId &&
      entry.capturePointId === declaration.capturePointId &&
      entry.profileId === declaration.scoreProfile &&
      (entry.locale ?? "en").toLowerCase() === locale.toLowerCase(),
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
    locale,
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
      locale,
      scorer,
      imageHashes: {
        site: capture.site.sha256,
        reference: capture.reference.sha256,
      },
      similarity: locale === "zh-Hant" ? 98 : 99,
      dimensions: Object.fromEntries(
        ["layout", "typography", "color", "imagery", "content"].map((name) => [
          name,
          { score: 99, findings: [] },
        ]),
      ),
      criticalMismatches: [],
    },
  });
  return archive.createAssessment({ runId: manifest.runId, ...assessment });
}

async function publishReview(archive, manifest, declaration, locale, comment) {
  return archive.createReview(
    {
      runId: manifest.runId,
      caseId: declaration.caseId,
      targetId: declaration.targetId,
      capturePointId: declaration.capturePointId,
      profileId: declaration.scoreProfile,
      locale,
      decision: "approved",
      comment,
    },
    { subject: `${locale}-fixture-reviewer` },
  );
}

async function publishCalibration(archive, runId, assessment, review, locale) {
  const calibrationKey = {
    scorerId: assessment.scorer.id,
    scorerVersion: assessment.scorer.version,
    scorerModel: assessment.scorer.model,
    profileId: assessment.profileId,
    contractHash: assessment.contractHash,
    rubricVersion: assessment.rubricVersion,
    labelPolicyVersion: "locale-review-v1",
    locale,
  };
  const observation = {
    sourceAssessmentId: assessment.assessmentId,
    sourceRunId: runId,
    reviewId: review.reviewId,
    reviewerId: `${locale}-fixture-reviewer`,
    locale,
    siteSha256: assessment.imageHashes.site,
    referenceSha256: assessment.imageHashes.reference,
    split: "held-out",
    independent: true,
    humanApproved: true,
    similarity: assessment.similarity,
    criticalVeto: assessment.criticalVeto,
    unknownCategory: assessment.unknownCategory,
    provenanceVerified: assessment.provenanceVerified,
    captureStatus: "captured",
  };
  return archive.createCalibration({
    runId,
    assessmentId: assessment.assessmentId,
    locale,
    calibration: {
      schemaVersion: 1,
      key: calibrationKey,
      observations: [observation],
    },
    policy: { labelPolicyVersion: "locale-review-v1" },
  });
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
  const reviewRequests = [];
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
        if (
          request.method === "POST" &&
          url.pathname === "/api/reviews" &&
          body.length > 0
        ) {
          reviewRequests.push(JSON.parse(body.toString("utf8")));
        }
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
    reviewRequests,
    close: () =>
      new Promise((resolveClose, rejectClose) => {
        server.close((error) => (error ? rejectClose(error) : resolveClose()));
      }),
  };
}

test("the central workbench uses its local archive and reviews versioned story history", {
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
    appRef: "app-release-old",
    referenceRef: "reference-release-old",
  });
  await publishRun(archive, browser, {
    runId: "preview-history-0002",
    createdAt: "2026-10-09T10:01:00.000Z",
    storyId: STORY_ID,
    appRef: "app-release-new",
    referenceRef: "reference-release-new",
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

  const verificationPanel = page.locator(".verification-panel");
  assert.equal(
    await verificationPanel
      .getByLabel("Archive endpoint", { exact: true })
      .count(),
    0,
  );
  assert.equal(
    await verificationPanel
      .getByRole("button", { name: "Connect", exact: true })
      .count(),
    0,
  );
  assert.ok(
    server.apiRequests.some((entry) => entry === "GET /api/archive-info"),
    "the panel should discover its archive destination on the workbench origin",
  );
  assert.ok(
    server.apiRequests.some((entry) => entry.startsWith("GET /api/runs?")),
    "the panel should request archive runs on cold load",
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
  assert.equal(await targetSelect.locator('option[value=""]').count(), 1);
  assert.equal(await targetSelect.locator('option:not([value=""])').count(), 2);

  const versionSelect = page.getByRole("combobox", {
    name: "Selected version",
  });
  await versionSelect.waitFor();
  assert.equal(
    await versionSelect.locator("option").count(),
    1,
    "different tag labels for the same commit pair should remain one version",
  );

  const runSelect = page.getByRole("combobox", { name: "Archived run" });
  await runSelect.waitFor({ state: "visible" });
  assert.deepEqual(
    await runSelect
      .locator("option")
      .evaluateAll((options) => options.map((option) => option.value)),
    ["preview-history-0002", "preview-history-0001"],
    "repeat runs for the selected commit pair should be newest first",
  );
  await runSelect.selectOption("preview-history-0001");
  await page.getByText("Model decision: shadow", { exact: true }).waitFor();
  await page
    .getByText(`Review saves to local archive: ${archiveRoot}`, { exact: true })
    .waitFor();
  await page.getByRole("tab", { name: "Desktop 1440x900" }).click();
  const desktopViewport = PROFILE_SIZES.desktop;
  const siteImage = await waitForImageDimensions(
    page,
    "Site full viewport",
    desktopViewport,
  );
  assert.deepEqual(
    await siteImage.evaluate((image) => [
      image.naturalWidth,
      image.naturalHeight,
    ]),
    [1440, 900],
  );
  assert.equal(
    await siteImage
      .locator(
        "xpath=ancestor::div[contains(@class, 'verification-image-frame')]",
      )
      .getAttribute("style"),
    "aspect-ratio: 1440 / 900;",
    "a recorded site region must not crop the full viewport image",
  );
  const referenceImage = await waitForImageDimensions(
    page,
    "Reference capture region",
    desktopViewport,
  );
  assert.equal(
    await referenceImage
      .locator(
        "xpath=ancestor::div[contains(@class, 'verification-image-frame')]",
      )
      .getAttribute("style"),
    "aspect-ratio: 1200 / 740;",
    "the reference image should display the recorded crop region",
  );
  assert.equal(
    await page
      .getByRole("link", { name: /Download original Reference PNG/ })
      .getAttribute("download"),
    "reference.png",
    "the full original reference PNG should remain downloadable",
  );
  await page.getByRole("tab", { name: "Tablet 768x1024" }).click();
  await page
    .getByText(
      "The selected target is scored at the desktop profile. No assessment is expected for tablet.",
      { exact: true },
    )
    .waitFor();
  await waitForImageDimensions(
    page,
    "Site full viewport",
    PROFILE_SIZES.tablet,
  );
  assert.deepEqual(
    await page
      .getByRole("img", { name: "Site full viewport" })
      .evaluate((image) => [image.naturalWidth, image.naturalHeight]),
    [768, 1024],
  );
  await page.getByRole("tab", { name: "Mobile 390x844" }).click();
  await page
    .getByText(
      "The selected target is scored at the desktop profile. No assessment is expected for mobile.",
      { exact: true },
    )
    .waitFor();
  await waitForImageDimensions(
    page,
    "Site full viewport",
    PROFILE_SIZES.mobile,
  );
  assert.deepEqual(
    await page
      .getByRole("img", { name: "Site full viewport" })
      .evaluate((image) => [image.naturalWidth, image.naturalHeight]),
    [390, 844],
  );

  await page.getByRole("tab", { name: "Desktop 1440x900" }).click();
  await waitForImageDimensions(
    page,
    "Site full viewport",
    PROFILE_SIZES.desktop,
  );
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

test("locale and viewport selection show the exact localized evidence and histories", {
  timeout: 180_000,
}, async (t) => {
  const archiveRoot = await mkdtemp(join(tmpdir(), "ui-verification-locales-"));
  let server;
  let browser;
  t.after(async () => {
    await browser?.close();
    await server?.close();
    await rm(archiveRoot, { recursive: true, force: true });
  });

  const archive = await createArchive(archiveRoot);
  browser = await chromium.launch({ headless: true });
  const manifest = await publishRun(archive, browser, {
    runId: "locale-matrix-history-0001",
    createdAt: "2026-10-10T10:01:00.000Z",
    storyId: STORY_ID,
    locales: GRADE10_LOCALES,
    referenceEveryProfile: true,
  });
  assert.equal(manifest.captures.length, 18);
  for (const declaration of DECLARATIONS) {
    for (const locale of GRADE10_LOCALES) {
      for (const profileId of Object.keys(PROFILE_SIZES)) {
        const capture = manifest.captures.find(
          (entry) =>
            entry.caseId === declaration.caseId &&
            entry.targetId === declaration.targetId &&
            entry.capturePointId === declaration.capturePointId &&
            entry.locale === locale &&
            entry.profileId === profileId,
        );
        assert(
          capture?.reference,
          `${locale}/${profileId} needs paired images`,
        );
      }
    }
  }

  const declaration = DECLARATIONS[0];
  const englishAssessment = await publishAssessment(
    archive,
    manifest,
    declaration,
    "en",
  );
  const traditionalAssessment = await publishAssessment(
    archive,
    manifest,
    declaration,
    "zh-Hant",
  );
  const englishReview = await publishReview(
    archive,
    manifest,
    declaration,
    "en",
    "English-only review history.",
  );
  const traditionalReview = await publishReview(
    archive,
    manifest,
    declaration,
    "zh-Hant",
    "繁體中文審查紀錄。",
  );
  await publishCalibration(
    archive,
    manifest.runId,
    englishAssessment,
    englishReview,
    "en",
  );
  await publishCalibration(
    archive,
    manifest.runId,
    traditionalAssessment,
    traditionalReview,
    "zh-Hant",
  );
  assert.equal(
    (await archive.listReviews({ runId: manifest.runId, locale: "en" }))
      .reviews[0]?.comment,
    "English-only review history.",
  );
  assert.equal(
    (await archive.listReviews({ runId: manifest.runId, locale: "zh-Hant" }))
      .reviews[0]?.comment,
    "繁體中文審查紀錄。",
  );
  server = await startWorkbenchServer(STORYBOOK_STATIC, archive);

  const page = await browser.newPage();
  await page.goto(`${server.origin}/?path=/story/${STORY_ID}`, {
    waitUntil: "domcontentloaded",
  });
  await page.getByRole("tab", { name: "Verification" }).click();
  const targetSelect = page.getByRole("combobox", {
    name: "Verification target",
  });
  await targetSelect.waitFor({ state: "visible" });
  await targetSelect.selectOption(
    `${declaration.caseId}::${declaration.targetId}::${declaration.capturePointId}`,
  );
  await page
    .getByRole("combobox", { name: "Archived run" })
    .selectOption(manifest.runId);
  await page.getByRole("region", { name: "Run provenance" }).waitFor();

  const localeTabs = page.getByRole("tablist", { name: "Capture locale" });
  const localeTabCount = await localeTabs.getByRole("tab").count();
  if (localeTabCount !== 3) {
    t.diagnostic(
      `Expected locale tabs for ${manifest.locales?.join(", ")}; visible panel text: ${(await page.locator("body").innerText()).slice(0, 3000)}`,
    );
  }
  assert.equal(localeTabCount, 3);
  assert.equal(
    await page
      .getByRole("tab", { name: "English (en)" })
      .getAttribute("aria-selected"),
    "true",
  );
  await waitForCondition(
    () =>
      server.apiRequests.some((entry) => {
        if (!entry.startsWith("GET /api/reviews?")) return false;
        const url = new URL(entry.slice("GET ".length), "http://localhost");
        return (
          url.searchParams.get("runId") === manifest.runId &&
          url.searchParams.get("locale") === "en"
        );
      }),
    "the English review-history query",
  );
  try {
    await page
      .getByText("English-only review history.", { exact: true })
      .waitFor({ timeout: 15_000 });
  } catch (error) {
    const [englishReviews, traditionalReviews] = await Promise.all([
      archive.listReviews({ runId: manifest.runId, locale: "en" }),
      archive.listReviews({ runId: manifest.runId, locale: "zh-Hant" }),
    ]);
    console.error(
      "Localized review history diagnostics:\n" +
        JSON.stringify(
          {
            panelText: await page
              .locator(".verification-panel")
              .innerText()
              .then((text) => text.slice(-3000))
              .catch(() => "unavailable"),
            reviewRequests: server.apiRequests.filter((entry) =>
              entry.startsWith("GET /api/reviews?"),
            ),
            englishReviewComments: englishReviews.reviews.map(
              (review) => review.comment,
            ),
            traditionalReviewComments: traditionalReviews.reviews.map(
              (review) => review.comment,
            ),
          },
          null,
          2,
        ),
    );
    throw error;
  }
  assert.equal(
    await page.getByText("繁體中文審查紀錄。", { exact: true }).count(),
    0,
  );
  await page.getByText(/Image similarity: 99/).waitFor();

  const objectKeys = () =>
    server.apiRequests
      .filter((entry) => entry.startsWith("GET /api/objects?"))
      .map((entry) =>
        new URL(
          entry.slice("GET ".length),
          "http://localhost",
        ).searchParams.get("key"),
      );
  for (const locale of GRADE10_LOCALES) {
    const localeName = `${LOCALE_LABELS[locale]} (${locale})`;
    const localeTab = page.getByRole("tab", { name: localeName });
    await localeTab.click();
    await waitForCondition(
      async () => (await localeTab.getAttribute("aria-selected")) === "true",
      `${localeName} locale selection`,
    );
    assert.equal(await localeTab.getAttribute("aria-selected"), "true");
    await waitForCondition(
      async () =>
        (await page.getByText(`Selected locale: ${localeName}`).count()) === 1,
      `${localeName} locale metadata`,
    );
    for (const [profileId, viewport] of Object.entries(PROFILE_SIZES)) {
      await page
        .getByRole("tab", {
          name: {
            desktop: "Desktop 1440x900",
            tablet: "Tablet 768x1024",
            mobile: "Mobile 390x844",
          }[profileId],
        })
        .click();
      const siteImage = page.getByRole("img", {
        name: "Site full viewport",
      });
      const referenceImage = page.getByRole("img", {
        name: "Reference capture region",
      });
      const expectedCapture = manifest.captures.find(
        (capture) =>
          capture.caseId === declaration.caseId &&
          capture.targetId === declaration.targetId &&
          capture.capturePointId === declaration.capturePointId &&
          capture.locale === locale &&
          capture.profileId === profileId,
      );
      assert(expectedCapture?.reference);
      await page
        .getByRole("link", {
          name: `Download original Site PNG · SHA-256 ${expectedCapture.site.sha256}`,
        })
        .waitFor();
      await page
        .getByRole("link", {
          name: `Download original Reference PNG · SHA-256 ${expectedCapture.reference.sha256}`,
        })
        .waitFor();
      await waitForImageDimensions(page, "Site full viewport", viewport);
      await waitForImageDimensions(page, "Reference capture region", viewport);
      assert.deepEqual(
        await siteImage.evaluate((image) => [
          image.naturalWidth,
          image.naturalHeight,
        ]),
        [viewport.width, viewport.height],
      );
      assert.deepEqual(
        await referenceImage.evaluate((image) => [
          image.naturalWidth,
          image.naturalHeight,
        ]),
        [viewport.width, viewport.height],
      );
      const expectedPrefix = `ui-verification/${manifest.runId}/${declaration.caseId}/${declaration.targetId}/${declaration.capturePointId}/${locale}/${profileId}/`;
      await waitForCondition(() => {
        const fetchedKeys = objectKeys();
        return (
          fetchedKeys.includes(`${expectedPrefix}site.png`) &&
          fetchedKeys.includes(`${expectedPrefix}reference.png`)
        );
      }, `${locale}/${profileId} localized image requests`);
      const fetchedKeys = objectKeys();
      assert(fetchedKeys.includes(`${expectedPrefix}site.png`));
      assert(fetchedKeys.includes(`${expectedPrefix}reference.png`));
    }
  }

  const traditionalTab = page.getByRole("tab", {
    name: "Traditional Chinese (zh-Hant)",
  });
  await traditionalTab.click();
  await page.getByRole("tab", { name: "Desktop 1440x900" }).click();
  await page.getByText("Image similarity: 98").waitFor();
  assert.equal(
    await page.getByText("Image similarity: 98").count(),
    1,
    "the assessment must come from the selected locale",
  );
  await page.getByText("繁體中文審查紀錄。", { exact: true }).waitFor();
  assert.equal(
    await page
      .getByText("English-only review history.", { exact: true })
      .count(),
    0,
    "English review history must not appear for a Chinese capture",
  );
  await page.getByLabel("Review comment").fill("繁體中文審查已更新。 ");
  await page.getByRole("button", { name: "Submit review" }).click();
  await page.getByText("繁體中文審查已更新。", { exact: true }).waitFor();
  assert(
    server.reviewRequests.some(
      (review) =>
        review.runId === manifest.runId &&
        review.locale === "zh-Hant" &&
        review.comment === "繁體中文審查已更新。",
    ),
    "the review request must retain the selected locale",
  );
  assert(
    server.apiRequests.some(
      (entry) =>
        entry.startsWith("GET /api/reviews?") &&
        entry.includes("locale=zh-Hant"),
    ),
  );
  assert(
    server.apiRequests.some(
      (entry) =>
        entry.startsWith("GET /api/assessments?") &&
        entry.includes("locale=zh-Hant"),
    ),
  );
  assert(
    server.apiRequests.some(
      (entry) =>
        entry.startsWith("GET /api/calibrations?") &&
        entry.includes("locale=zh-Hant"),
    ),
  );
  assert(
    server.apiRequests.some(
      (entry) =>
        entry.startsWith("GET /api/runs?") && !entry.includes("locale="),
    ),
    "run discovery must include manifests with non-English-only matrices",
  );

  await page.getByRole("tab", { name: "English (en)" }).click();
  await page
    .getByText("English-only review history.", { exact: true })
    .waitFor();
  assert.equal(
    await page.getByText("繁體中文審查紀錄。", { exact: true }).count(),
    0,
  );
  await page.close();
});

test("new locale subsets stay exact while legacy English runs show missing evidence", {
  timeout: 180_000,
}, async (t) => {
  const archiveRoot = await mkdtemp(
    join(tmpdir(), "ui-verification-legacy-locales-"),
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
  const legacy = await publishRun(archive, browser, {
    runId: "legacy-english-history-0001",
    createdAt: "2026-10-08T10:01:00.000Z",
    storyId: STORY_ID,
    appCommit: "e".repeat(40),
    referenceCommit: "f".repeat(40),
    referenceEveryProfile: false,
  });
  const requestedEnglish = await publishRun(archive, browser, {
    runId: "requested-english-only-0001",
    createdAt: "2026-10-09T10:01:00.000Z",
    storyId: STORY_ID,
    locales: ["en"],
  });
  assert.equal("locales" in legacy, false);
  assert.equal(
    legacy.captures.filter((capture) => !capture.reference).length,
    4,
    "legacy manifests may omit references for unscored viewport captures",
  );
  assert.deepEqual(requestedEnglish.locales, ["en"]);
  server = await startWorkbenchServer(STORYBOOK_STATIC, archive);

  const page = await browser.newPage();
  await page.goto(`${server.origin}/?path=/story/${STORY_ID}`, {
    waitUntil: "domcontentloaded",
  });
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
    .selectOption(requestedEnglish.runId);
  await page.getByRole("region", { name: "Run provenance" }).waitFor();
  await page
    .getByRole("tab", { name: "English (en)" })
    .waitFor({ state: "visible" });
  assert.equal(
    await page
      .getByRole("tablist", { name: "Capture locale" })
      .getByRole("tab")
      .count(),
    1,
    "a declared English-only locale matrix must not show Chinese options",
  );
  assert.equal(
    await page
      .getByRole("tab", { name: "English (en)" })
      .getAttribute("aria-selected"),
    "true",
  );
  await page.getByRole("img", { name: "Site full viewport" }).waitFor();

  await page
    .getByRole("combobox", { name: "Selected version" })
    .selectOption(JSON.stringify(["e".repeat(40), "f".repeat(40)]));
  await page
    .getByRole("combobox", { name: "Archived run" })
    .selectOption(legacy.runId);
  const traditionalTab = page.getByRole("tab", {
    name: "Traditional Chinese (zh-Hant)",
  });
  await traditionalTab.waitFor({ state: "visible" });
  assert.equal(
    await page
      .getByRole("tablist", { name: "Capture locale" })
      .getByRole("tab")
      .count(),
    3,
    "legacy English-only manifests must offer the Grade10 locale choices",
  );
  await traditionalTab.click();
  await page
    .getByText(
      "No archived evidence for Traditional Chinese (zh-Hant) in this run. The panel does not substitute another locale.",
      { exact: true },
    )
    .waitFor();
  assert.equal(
    await page.getByRole("img", { name: "Site full viewport" }).count(),
    0,
    "the panel must not reuse the English image for a missing locale",
  );
  await page.getByRole("tab", { name: "English (en)" }).click();
  await page.getByRole("img", { name: "Site full viewport" }).waitFor();
  assert(
    server.apiRequests.some(
      (entry) =>
        entry.startsWith("GET /api/runs?") && !entry.includes("locale="),
    ),
  );
  await page.close();
});

test("run discovery includes a manifest whose only locale is Traditional Chinese", {
  timeout: 180_000,
}, async (t) => {
  const archiveRoot = await mkdtemp(
    join(tmpdir(), "ui-verification-chinese-only-"),
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
  const manifest = await publishRun(archive, browser, {
    runId: "traditional-chinese-only-0001",
    createdAt: "2026-10-10T10:01:00.000Z",
    storyId: STORY_ID,
    locales: ["zh-Hant"],
    referenceEveryProfile: true,
  });
  server = await startWorkbenchServer(STORYBOOK_STATIC, archive);

  const page = await browser.newPage();
  await page.goto(`${server.origin}/?path=/story/${STORY_ID}`, {
    waitUntil: "domcontentloaded",
  });
  await page.getByRole("tab", { name: "Verification" }).click();
  await page
    .getByRole("combobox", { name: "Verification target" })
    .waitFor({ state: "visible" });
  await page
    .getByRole("combobox", { name: "Verification target" })
    .selectOption(
      `${DECLARATIONS[0].caseId}::${DECLARATIONS[0].targetId}::${DECLARATIONS[0].capturePointId}`,
    );
  const runSelect = page.getByRole("combobox", { name: "Archived run" });
  await runSelect.waitFor({ state: "visible" });
  await page.getByRole("region", { name: "Run provenance" }).waitFor();
  assert.equal(await runSelect.inputValue(), manifest.runId);
  assert.equal(
    await runSelect.locator(`option[value="${manifest.runId}"]`).count(),
    1,
  );
  assert.equal(
    await page
      .getByRole("tablist", { name: "Capture locale" })
      .getByRole("tab")
      .count(),
    1,
  );
  const traditionalTab = page.getByRole("tab", {
    name: "Traditional Chinese (zh-Hant)",
  });
  await waitForCondition(
    async () => (await traditionalTab.getAttribute("aria-selected")) === "true",
    "the only requested Chinese locale selection",
  );
  assert.equal(await traditionalTab.getAttribute("aria-selected"), "true");
  assert.equal(
    await page
      .getByText("Selected locale: Traditional Chinese (zh-Hant)")
      .count(),
    1,
  );
  await page.getByRole("img", { name: "Site full viewport" }).waitFor();
  assert(
    server.apiRequests.some(
      (entry) =>
        entry.startsWith("GET /api/runs?") && !entry.includes("locale="),
    ),
  );
  await page.close();
});

test("a story switch does not carry the prior case mapping while preparation is pending", {
  timeout: 180_000,
}, async (t) => {
  const archiveRoot = await mkdtemp(join(tmpdir(), "ui-verification-race-"));
  let server;
  let browser;
  let releaseBreadcrumbs;
  let breadcrumbsReleased = false;
  t.after(async () => {
    releaseBreadcrumbs?.();
    await browser?.close();
    await server?.close();
    await rm(archiveRoot, { recursive: true, force: true });
  });

  const archive = await createArchive(archiveRoot);
  browser = await chromium.launch({ headless: true });
  await publishRun(archive, browser, {
    runId: "preparation-race-not-found-0001",
    createdAt: "2026-10-08T10:01:00.000Z",
    storyId: STORY_ID,
  });
  await publishReferenceStoryRun(archive, browser);
  server = await startWorkbenchServer(STORYBOOK_STATIC, archive);

  const page = await browser.newPage();
  await page.goto(`${server.origin}/?path=/story/${STORY_ID}`, {
    waitUntil: "domcontentloaded",
  });
  await page.getByRole("tab", { name: "Verification" }).click();
  await page.getByText(`Mapped case: ${CASE_ID}`, { exact: true }).waitFor();

  let markBreadcrumbsRequested;
  const breadcrumbsRequested = new Promise((resolveRequested) => {
    markBreadcrumbsRequested = resolveRequested;
  });
  const allowBreadcrumbs = new Promise((resolveAllowed) => {
    releaseBreadcrumbs = resolveAllowed;
  });
  await page.route("**/assets/breadcrumbs.stories-*.js", async (route) => {
    markBreadcrumbsRequested();
    await allowBreadcrumbs;
    await route.continue();
  });

  const componentSearch = page.getByPlaceholder("Find components");
  await componentSearch.fill("Breadcrumbs Default");
  await page
    .locator('.search-result-item[data-id="design-system-display-breadcrumbs--default"]')
    .click();
  await breadcrumbsRequested;
  const currentStoryHeading = page.getByRole("heading", {
    name: "Current Storybook story",
  });
  const currentStoryId = currentStoryHeading.locator(
    "xpath=following-sibling::p[1]",
  );
  await page.waitForFunction(() => {
    const heading = [...document.querySelectorAll("h3")].find(
      (candidate) =>
        candidate.textContent?.trim() === "Current Storybook story",
    );
    return (
      heading?.nextElementSibling?.textContent?.trim() ===
      "design-system-display-breadcrumbs--default"
    );
  });
  assert.equal(
    await currentStoryId.textContent(),
    "design-system-display-breadcrumbs--default",
  );
  assert.equal(
    breadcrumbsReleased,
    false,
    "the Breadcrumbs module is still blocked",
  );

  assert.equal(
    await page.getByText(`Mapped case: ${CASE_ID}`, { exact: true }).count(),
    0,
    "the previous story's case must not remain attached while the new story prepares",
  );

  breadcrumbsReleased = true;
  releaseBreadcrumbs();
  await page
    .getByText(
      "Archived entries match this story ID or its reference story ID.",
      { exact: true },
    )
    .waitFor();
  assert.match(
    await page
      .getByRole("combobox", { name: "Verification target" })
      .inputValue(),
    /^vc_breadcrumbs_history::/,
  );
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
    `${server.origin}/?path=/story/design-system-display-breadcrumbs--default`,
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
    .getByText("design-system-display-breadcrumbs--previous-name", { exact: true })
    .waitFor();
  await page
    .getByText(
      "No reference region was recorded; showing the full reference image.",
      { exact: true },
    )
    .waitFor();
  await page.close();
});

test("an explicit historical story stays selected while Storybook navigation changes", {
  timeout: 180_000,
}, async (t) => {
  const archiveRoot = await mkdtemp(
    join(tmpdir(), "ui-verification-history-selection-"),
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
  server = await startWorkbenchServer(STORYBOOK_STATIC, archive);

  const page = await browser.newPage();
  await page.goto(`${server.origin}/?path=/story/${STORY_ID}`, {
    waitUntil: "domcontentloaded",
  });
  await page.getByRole("tab", { name: "Verification" }).click();
  await page.getByRole("button", { name: "All recordings" }).click();

  const versionSelect = page.getByRole("combobox", {
    name: "Selected version",
  });
  await versionSelect.selectOption(
    JSON.stringify(["f".repeat(40), "1".repeat(40)]),
  );
  const storyChoice = page.getByRole("button", {
    name: /Design System\/Display\/Breadcrumbs\/Previous name/,
  });
  assert.equal(
    await page.locator(".verification-story-choice").count(),
    1,
    "the story list should contain only entries from the selected version",
  );
  await storyChoice.click();
  assert.equal(await storyChoice.getAttribute("aria-pressed"), "true");
  await page
    .getByText(
      "Recorded story unavailable; the reference story is available in this Storybook.",
      { exact: true },
    )
    .waitFor();
  await page.waitForFunction(() => {
    const heading = [...document.querySelectorAll("h3")].find(
      (candidate) =>
        candidate.textContent?.trim() === "Current Storybook story",
    );
    return (
      heading?.nextElementSibling?.textContent?.trim() ===
      "design-system-display-breadcrumbs--default"
    );
  });
  await assertSelectedRunVisible(page, "reference-story-history-0001");

  const componentSearch = page.getByPlaceholder("Find components");
  await componentSearch.fill("Not Found Default page");
  await page
    .locator('.search-result-item[data-id="site-navigation-screens-not-found--default"]')
    .click();
  await page.waitForFunction(() => {
    const heading = [...document.querySelectorAll("h3")].find(
      (candidate) =>
        candidate.textContent?.trim() === "Current Storybook story",
    );
    return (
      heading?.nextElementSibling?.textContent?.trim() ===
      "site-navigation-screens-not-found--default"
    );
  });
  assert.equal(
    await storyChoice.getAttribute("aria-pressed"),
    "true",
    "live verification parameters must not replace an explicit historical selection",
  );
  await assertSelectedRunVisible(page, "reference-story-history-0001");
  await page.close();
});

test("renamed recorded story IDs resolve through a unique current case-only mapping", {
  timeout: 180_000,
}, async (t) => {
  const archiveRoot = await mkdtemp(
    join(tmpdir(), "ui-verification-renamed-story-selection-"),
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
  await publishRun(archive, browser, {
    runId: "renamed-story-identity-0001",
    createdAt: "2026-10-08T10:01:00.000Z",
    storyId: "removed-app-story--default",
    referenceStoryId: "removed-reference-story--default",
  });
  server = await startWorkbenchServer(STORYBOOK_STATIC, archive);

  const page = await browser.newPage();
  await page.goto(`${server.origin}/?path=/story/${STORY_ID}`, {
    waitUntil: "domcontentloaded",
  });
  await page.getByRole("tab", { name: "Verification" }).click();
  await page.getByRole("button", { name: "All recordings" }).click();
  await page
    .getByText(`Current live case: ${CASE_ID}`, { exact: true })
    .waitFor();
  await page
    .getByRole("combobox", { name: "Selected version" })
    .selectOption(JSON.stringify(["a".repeat(40), "b".repeat(40)]));

  assert.equal(
    await page.locator(".verification-story-choice").count(),
    2,
    "both archived targets should be visible for the selected version",
  );
  const componentSearch = page.getByPlaceholder("Find components");
  await componentSearch.fill("Breadcrumbs Default");
  await page
    .locator('.search-result-item[data-id="design-system-display-breadcrumbs--default"]')
    .click();
  await page.waitForFunction(() => {
    const heading = [...document.querySelectorAll("h3")].find(
      (candidate) =>
        candidate.textContent?.trim() === "Current Storybook story",
    );
    return (
      heading?.nextElementSibling?.textContent?.trim() ===
      "design-system-display-breadcrumbs--default"
    );
  });

  const archivedStory = page.getByRole("button", {
    name: /Pages\/Not Found\/Default page/,
  });
  await archivedStory.click();
  const uniqueCaseMappingNotice = page.getByText(
    "Recorded story IDs are unavailable; opened the unique Storybook story mapped to this case.",
    { exact: true },
  );
  try {
    await uniqueCaseMappingNotice.waitFor({ timeout: 5000 });
  } catch (error) {
    const screenshotPath = join(
      tmpdir(),
      "ui-verification-renamed-story-failure.png",
    );
    const diagnostic = {
      currentStory: await page
        .getByRole("heading", { name: "Current Storybook story" })
        .locator("xpath=following-sibling::p[1]")
        .innerText()
        .catch(() => "unavailable"),
      selectedArchivedStory: await page
        .locator('.verification-story-choice[aria-pressed="true"]')
        .innerText()
        .catch(() => "unavailable"),
      notices: await page
        .locator(".verification-notice")
        .allTextContents()
        .catch(() => []),
      panelText: await page
        .locator(".verification-panel")
        .innerText()
        .then((text) => text.slice(-2500))
        .catch(() => "unavailable"),
      screenshotPath,
    };
    await page
      .screenshot({ path: screenshotPath, fullPage: true })
      .catch(() => {});
    console.error(
      "Renamed Storybook ID fallback diagnostics:\n" +
        JSON.stringify(diagnostic, null, 2),
    );
    throw error;
  }
  await page.waitForFunction(() => {
    const heading = [...document.querySelectorAll("h3")].find(
      (candidate) =>
        candidate.textContent?.trim() === "Current Storybook story",
    );
    return (
      heading?.nextElementSibling?.textContent?.trim() ===
      "site-navigation-screens-not-found--default"
    );
  });
  assert.equal(await archivedStory.getAttribute("aria-pressed"), "true");
  await page
    .getByText("renamed-story-identity-0001", { exact: true })
    .waitFor();

  await componentSearch.fill("Breadcrumbs Default");
  await page
    .locator('.search-result-item[data-id="design-system-display-breadcrumbs--default"]')
    .click();
  await page.waitForFunction(() => {
    const heading = [...document.querySelectorAll("h3")].find(
      (candidate) =>
        candidate.textContent?.trim() === "Current Storybook story",
    );
    return (
      heading?.nextElementSibling?.textContent?.trim() ===
      "design-system-display-breadcrumbs--default"
    );
  });
  assert.equal(
    await archivedStory.getAttribute("aria-pressed"),
    "true",
    "the live story parameters must not replace the selected historical identity",
  );
  await page
    .getByText("renamed-story-identity-0001", { exact: true })
    .waitFor();
  await page.close();
});

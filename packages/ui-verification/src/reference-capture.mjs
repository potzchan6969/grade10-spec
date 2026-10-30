import { PROFILES } from "./model.mjs";

// The one Storybook reference capturer: the workbench's Approve tab and the
// application's site runs both call it, so a reference is drawn one way.

const DEFAULT_TIMEOUT_MS = 30_000;
const IMAGE_TIMEOUT_MS = 15_000;
const REQUIRED_RESOURCE_TYPES = new Set([
  "document",
  "font",
  "image",
  "script",
  "stylesheet",
]);
const REQUIRED_SUBRESOURCE_TYPES = new Set([
  "font",
  "image",
  "script",
  "stylesheet",
]);

export const CAPTURE_BROWSER = Object.freeze({
  locale: "en-US",
  timezoneId: "Asia/Hong_Kong",
  colorScheme: "light",
});

function coded(message, code) {
  return Object.assign(new Error(message), { code });
}

/** The fixed browser context every capture, site or reference, draws in. */
export function newCaptureContext(
  browser,
  viewport,
  options = CAPTURE_BROWSER,
) {
  return browser.newContext({
    viewport,
    deviceScaleFactor: 1,
    locale: options.locale,
    timezoneId: options.timezoneId,
    colorScheme: options.colorScheme,
    reducedMotion: "reduce",
    serviceWorkers: "block",
  });
}

export function watchPageFailures(page, { failedResources, pageErrors }) {
  page.on("requestfailed", (request) => {
    // The page cancelled a request it no longer needs, such as a swapped
    // image; a drawn image that never loads still fails the settle wait.
    if (
      request.failure()?.errorText === "net::ERR_ABORTED" &&
      request.resourceType() !== "document"
    )
      return;
    if (REQUIRED_RESOURCE_TYPES.has(request.resourceType())) {
      const url = new URL(request.url());
      failedResources.push(
        `${request.resourceType()} ${url.origin}${url.pathname}`,
      );
    }
  });
  page.on("response", (response) => {
    const request = response.request();
    const resourceType = request.resourceType();
    if (
      response.status() >= 400 &&
      REQUIRED_SUBRESOURCE_TYPES.has(resourceType)
    ) {
      const url = new URL(request.url());
      failedResources.push(
        `HTTP ${response.status()} ${resourceType} ${url.origin}${url.pathname}`,
      );
    }
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));
}

export async function waitForSettledPage(page) {
  await page.evaluate(async (imageTimeoutMs) => {
    // The screenshot is the viewport, so only an image drawn inside it must
    // load: one under display: none, or a lazy one below the fold that the
    // browser never fetches, is not in the picture.
    const inViewport = (image) => {
      if (!image.checkVisibility()) return false;
      const box = image.getBoundingClientRect();
      return (
        box.bottom > 0 &&
        box.right > 0 &&
        box.top < window.innerHeight &&
        box.left < window.innerWidth
      );
    };
    const named = (image) => image.currentSrc || image.src || "an image";
    if (document.fonts?.ready) await document.fonts.ready;
    const brokenFonts = [...(document.fonts ?? [])].filter(
      (font) => font.status === "error",
    );
    if (brokenFonts.length > 0)
      throw new Error(`${brokenFonts.length} font resource(s) failed`);
    await Promise.all(
      [...document.images].filter(inViewport).map(async (image) => {
        if (!image.complete) {
          await new Promise((resolve, reject) => {
            const timer = setTimeout(
              () =>
                reject(
                  new Error(
                    `image ${named(image)} did not load within ${imageTimeoutMs}ms`,
                  ),
                ),
              imageTimeoutMs,
            );
            image.addEventListener(
              "load",
              () => {
                clearTimeout(timer);
                resolve();
              },
              { once: true },
            );
            image.addEventListener(
              "error",
              () => {
                clearTimeout(timer);
                reject(new Error(`image resource ${named(image)} failed`));
              },
              { once: true },
            );
          });
        }
        if (image.naturalWidth === 0)
          throw new Error("image resource failed to load");
        if (image.decode) await image.decode();
      }),
    );
    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve)),
    );
  }, IMAGE_TIMEOUT_MS);
}

export async function requireSingleVisibleLocator(locator, label) {
  if (
    !locator ||
    typeof locator.count !== "function" ||
    typeof locator.isVisible !== "function"
  ) {
    throw coded(
      `capture recipe did not return a Playwright locator for ${label}`,
      "RECIPE_REGION_MISSING",
    );
  }
  const count = await locator.count();
  if (count !== 1) {
    throw coded(
      `expected one ${label}; found ${count}`,
      count === 0 ? "REGION_MISSING" : "REGION_AMBIGUOUS",
    );
  }
  if (!(await locator.isVisible()))
    throw coded(`${label} is not visible`, "REGION_NOT_VISIBLE");
  const box = await locator.boundingBox();
  if (!box)
    throw coded(`${label} has no visible bounding box`, "REGION_MISSING");
  return { x: box.x, y: box.y, width: box.width, height: box.height };
}

export function regionFits(region, viewport) {
  const values = [region.x, region.y, region.width, region.height];
  return (
    values.every(Number.isFinite) &&
    region.width > 0 &&
    region.height > 0 &&
    region.x >= 0 &&
    region.y >= 0 &&
    region.x + region.width <= viewport.width &&
    region.y + region.height <= viewport.height
  );
}

async function installStoryCompletionListener(page, storyId) {
  await page.addInitScript((expectedStoryId) => {
    const state = { attached: false, result: null, failure: null };
    Object.defineProperty(window, "__uiVerificationStory", { value: state });
    const attach = () => {
      const preview = window.__STORYBOOK_PREVIEW__;
      const channel = preview?.channel ?? window.__STORYBOOK_ADDONS_CHANNEL__;
      if (!channel || typeof channel.on !== "function") return false;
      state.attached = true;
      channel.on("storyFinished", (event) => {
        if (event?.storyId === expectedStoryId) state.result = event;
      });
      channel.on("storyMissing", (event) => {
        if (event?.storyId === expectedStoryId)
          state.failure = "Storybook could not find the declared story";
      });
      channel.on("storyErrored", (event) => {
        if (event?.storyId === expectedStoryId)
          state.failure = "Storybook reported a story render error";
      });
      return true;
    };
    if (!attach()) {
      const interval = setInterval(() => {
        if (attach()) clearInterval(interval);
      }, 10);
    }
  }, storyId);
}

async function waitForStoryCompletion(page, storyId, timeoutMs) {
  await page.waitForFunction(
    (expectedStoryId) => {
      const state = window.__uiVerificationStory;
      return Boolean(
        state?.failure ||
          (state?.result && state.result.storyId === expectedStoryId),
      );
    },
    storyId,
    { timeout: timeoutMs },
  );
  const state = await page.evaluate(() => window.__uiVerificationStory);
  if (state.failure) throw coded(state.failure, "STORY_FAILED");
  if (state.result?.status !== "success") {
    throw coded(
      `Storybook finished ${storyId} with status ${state.result?.status ?? "unknown"}`,
      "STORY_FAILED",
    );
  }
}

/**
 * Renders one story at one profile and returns the full viewport PNG with the
 * selector's box as Playwright measured it; the caller decides what a box that
 * leaves the screen means at its profile.
 */
export async function captureStoryReference(
  browser,
  {
    baseURL,
    storyId,
    selector,
    profileId,
    locale,
    browserOptions = CAPTURE_BROWSER,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    originHeaders,
  },
) {
  const viewport = PROFILES[profileId];
  if (!viewport) throw new TypeError(`unknown profile ${profileId}`);
  const context = await newCaptureContext(browser, viewport, browserOptions);
  if (originHeaders) await sendToOrigin(context, baseURL, originHeaders);
  const page = await context.newPage();
  const failedResources = [];
  const pageErrors = [];
  watchPageFailures(page, { failedResources, pageErrors });
  try {
    await installStoryCompletionListener(page, storyId);
    const storyUrl = new URL("iframe.html", baseURL);
    storyUrl.searchParams.set("id", storyId);
    storyUrl.searchParams.set("viewMode", "story");
    if (locale) storyUrl.searchParams.set("globals", `locale:${locale}`);
    const response = await page.goto(storyUrl.href, {
      waitUntil: "load",
      timeout: timeoutMs,
    });
    if (!response)
      throw coded(
        "Storybook iframe did not return a document response",
        "REFERENCE_NAVIGATION_FAILED",
      );
    if (!response.ok())
      throw coded(
        `Storybook iframe returned HTTP ${response.status()}`,
        "REFERENCE_RESOURCE_FAILED",
      );
    await page
      .locator("#storybook-root")
      .waitFor({ state: "visible", timeout: timeoutMs });
    await waitForStoryCompletion(page, storyId, timeoutMs);
    await waitForSettledPage(page);
    if (pageErrors.length > 0)
      throw coded(
        `Storybook page error: ${pageErrors[0]}`,
        "REFERENCE_PAGE_ERROR",
      );
    if (failedResources.length > 0)
      throw coded(
        `required Storybook resource failed: ${failedResources[0]}`,
        "REFERENCE_RESOURCE_FAILED",
      );
    const box = await requireSingleVisibleLocator(
      page.locator(selector ?? "#storybook-root"),
      "reference comparison region",
    );
    const bytes = await page.screenshot({
      type: "png",
      fullPage: false,
      animations: "disabled",
    });
    return { bytes: new Uint8Array(bytes), box, viewport };
  } finally {
    await context.close();
  }
}

/**
 * The region a stored reference crops to. At the score profile the box must
 * fit the screen; elsewhere a box that does not fit is context, so the whole
 * viewport is compared, as a site run does.
 */
export function storedRegion(box, viewport, { wholeViewport, scored }) {
  const whole = { x: 0, y: 0, width: viewport.width, height: viewport.height };
  if (wholeViewport) return whole;
  const rounded = {
    x: Math.round(box.x),
    y: Math.round(box.y),
    width: Math.round(box.width),
    height: Math.round(box.height),
  };
  if (regionFits(rounded, viewport)) return rounded;
  if (scored)
    throw coded(
      `reference comparison region falls outside the ${viewport.width}x${viewport.height} viewport`,
      "REGION_OUTSIDE_VIEWPORT",
    );
  return whole;
}

// Access credentials go to the Storybook origin only, never to a font or
// image host the story loads.
async function sendToOrigin(context, baseURL, headers) {
  const origin = new URL(baseURL).origin;
  await context.route("**/*", (route) => {
    const request = route.request();
    if (new URL(request.url()).origin !== origin) return route.continue();
    return route.continue({ headers: { ...request.headers(), ...headers } });
  });
}

/** The deploy's build receipt, read through the same browser as the shots. */
export async function readBuildReceipt(browser, baseURL, originHeaders) {
  const context = await browser.newContext();
  try {
    if (originHeaders) await sendToOrigin(context, baseURL, originHeaders);
    const page = await context.newPage();
    const response = await page.goto(
      new URL("ui-verification-build.json", baseURL).href,
    );
    if (!response?.ok())
      throw coded(
        `the deployed Storybook has no build receipt (HTTP ${response?.status() ?? "none"})`,
        "BUILD_RECEIPT_MISSING",
      );
    const receipt = JSON.parse(await response.text());
    if (
      receipt?.schemaVersion !== 1 ||
      receipt.target !== "reference" ||
      !/^[0-9a-f]{40}$/.test(receipt.commit ?? "")
    )
      throw coded("the build receipt is invalid", "BUILD_RECEIPT_INVALID");
    return receipt;
  } finally {
    await context.close();
  }
}

/**
 * One browser for a batch of shots. The host supplies how to launch it and
 * how to name the commit it captures: git in a local checkout, the build
 * receipt on a deployed workbench.
 */
export async function openCaptureSession({
  launch,
  provenance,
  originHeaders,
}) {
  const browser = await launch();
  return {
    browser: `chromium ${typeof browser.version === "function" ? browser.version() : "unknown"}`,
    provenance: (baseURL) => provenance({ browser, baseURL, originHeaders }),
    async shoot(shot, baseURL) {
      const captured = await captureStoryReference(browser, {
        baseURL,
        storyId: shot.storyId,
        selector: shot.selector,
        profileId: shot.profileId,
        locale: shot.locale,
        originHeaders,
      });
      return {
        bytes: captured.bytes,
        region: storedRegion(captured.box, captured.viewport, {
          wholeViewport: shot.wholeViewport,
          scored: shot.profileId === shot.scoreProfile,
        }),
      };
    },
    close: () => browser.close(),
  };
}

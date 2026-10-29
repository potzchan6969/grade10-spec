import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { PROFILES } from "./model.mjs";

const git = promisify(execFile);
const CAPTURE_TIMEOUT_MS = 30_000;
const DEFAULT_BROWSER = {
  locale: "en-US",
  timezoneId: "Asia/Hong_Kong",
  colorScheme: "light",
};

async function checkoutState(repoRoot) {
  const read = async (args) =>
    (await git("git", args, { cwd: repoRoot })).stdout.trim();
  const [commit, branch, status] = await Promise.all([
    read(["rev-parse", "HEAD"]),
    read(["rev-parse", "--abbrev-ref", "HEAD"]),
    read(["status", "--porcelain"]),
  ]);
  return {
    commit,
    ref: branch === "HEAD" ? "detached" : branch,
    verified: status === "",
  };
}

function storyUrl(origin, storyId, locale) {
  const url = new URL("iframe.html", `${origin}/`);
  url.searchParams.set("id", storyId);
  url.searchParams.set("viewMode", "story");
  url.searchParams.set("globals", `locale:${locale}`);
  return url.href;
}

async function waitForStory(page, storyId) {
  await page.waitForFunction(
    (expected) => {
      const state = window.__uiVerificationStory;
      return Boolean(
        state?.failure || (state?.result && state.result.storyId === expected),
      );
    },
    storyId,
    { timeout: CAPTURE_TIMEOUT_MS },
  );
  const state = await page.evaluate(() => window.__uiVerificationStory);
  if (state.failure) throw new Error(state.failure);
  if (state.result?.status !== "success")
    throw new Error(
      `Storybook finished ${storyId} with status ${state.result?.status ?? "unknown"}`,
    );
}

// The same settle the application's site capture waits for: fonts, the
// images drawn in the viewport, then two frames.
async function waitForSettledPage(page) {
  await page.evaluate(async () => {
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
    if (document.fonts?.ready) await document.fonts.ready;
    if ([...(document.fonts ?? [])].some((font) => font.status === "error"))
      throw new Error("a font resource failed");
    await Promise.all(
      [...document.images].filter(inViewport).map(async (image) => {
        if (!image.complete)
          await new Promise((resolve, reject) => {
            image.addEventListener("load", resolve, { once: true });
            image.addEventListener(
              "error",
              () => reject(new Error(`image ${image.currentSrc} failed`)),
              { once: true },
            );
          });
        if (image.naturalWidth === 0)
          throw new Error("image resource failed to load");
        if (image.decode) await image.decode();
      }),
    );
    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve)),
    );
  });
}

function regionOnScreen(box, viewport, profileId) {
  const x = Math.max(0, Math.floor(box.x));
  const y = Math.max(0, Math.floor(box.y));
  const width = Math.min(viewport.width, Math.ceil(box.x + box.width)) - x;
  const height = Math.min(viewport.height, Math.ceil(box.y + box.height)) - y;
  if (width <= 0 || height <= 0)
    throw new Error(`the reference region is not on screen at ${profileId}`);
  return { x, y, width, height };
}

/**
 * Captures a story's reference the way the application's site capture does:
 * a fresh Chromium context per shot, so nothing carries between captures.
 */
export function createReferenceCapturer({
  chromium,
  repoRoot,
  browser: browserOptions = DEFAULT_BROWSER,
}) {
  return async function captureReference({
    origin,
    storyId,
    selector,
    viewport: wholeViewport,
    profileId,
    locale,
  }) {
    const viewport = PROFILES[profileId];
    if (!viewport) throw new TypeError(`unknown profile ${profileId}`);
    if (typeof locale !== "string" || locale === "")
      throw new TypeError("locale is required");
    const checkout = await checkoutState(repoRoot);
    const browser = await chromium.launch({ headless: true });
    try {
      const context = await browser.newContext({
        viewport,
        deviceScaleFactor: 1,
        locale: browserOptions.locale,
        timezoneId: browserOptions.timezoneId,
        colorScheme: browserOptions.colorScheme,
        reducedMotion: "reduce",
        serviceWorkers: "block",
      });
      const page = await context.newPage();
      const pageErrors = [];
      page.on("pageerror", (error) => pageErrors.push(error.message));
      await page.addInitScript((expected) => {
        const state = { result: null, failure: null };
        Object.defineProperty(window, "__uiVerificationStory", {
          value: state,
        });
        const attach = () => {
          const channel =
            window.__STORYBOOK_PREVIEW__?.channel ??
            window.__STORYBOOK_ADDONS_CHANNEL__;
          if (!channel || typeof channel.on !== "function") return false;
          channel.on("storyFinished", (event) => {
            if (event?.storyId === expected) state.result = event;
          });
          channel.on("storyMissing", (event) => {
            if (event?.storyId === expected)
              state.failure = "Storybook could not find the story";
          });
          channel.on("storyErrored", (event) => {
            if (event?.storyId === expected)
              state.failure = "Storybook reported a story render error";
          });
          return true;
        };
        if (!attach()) {
          const timer = setInterval(() => {
            if (attach()) clearInterval(timer);
          }, 10);
        }
      }, storyId);
      const response = await page.goto(storyUrl(origin, storyId, locale), {
        waitUntil: "load",
        timeout: CAPTURE_TIMEOUT_MS,
      });
      if (!response?.ok())
        throw new Error(
          `the Storybook iframe returned HTTP ${response?.status() ?? "nothing"}`,
        );
      await page
        .locator("#storybook-root")
        .waitFor({ state: "visible", timeout: CAPTURE_TIMEOUT_MS });
      await waitForStory(page, storyId);
      await waitForSettledPage(page);
      if (pageErrors.length > 0)
        throw new Error(`Storybook page error: ${pageErrors[0]}`);
      const matches = page.locator(selector ?? "#storybook-root");
      const visible = [];
      for (const element of await matches.all())
        if (await element.isVisible()) visible.push(element);
      if (visible.length !== 1)
        throw new Error(
          `the reference selector ${selector ?? "#storybook-root"} matched ${visible.length} visible elements`,
        );
      const box = await visible[0].boundingBox();
      if (!box) throw new Error("the reference element has no box");
      const region = wholeViewport
        ? { x: 0, y: 0, width: viewport.width, height: viewport.height }
        : regionOnScreen(box, viewport, profileId);
      const bytes = await page.screenshot({
        type: "png",
        fullPage: false,
        animations: "disabled",
      });
      return {
        bytes: new Uint8Array(bytes),
        region,
        ...checkout,
        browser: `chromium ${browser.version()}`,
      };
    } finally {
      await browser.close();
    }
  };
}

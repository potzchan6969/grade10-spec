import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import { dirname, extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { renderSignature } from "./render-diff.mjs";

const rootDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const VIEWPORT = { height: 900, width: 1280 };
const PAGES = 4;
const MIME = {
  ".css": "text/css",
  ".html": "text/html",
  ".js": "text/javascript",
  ".json": "application/json",
  ".mjs": "text/javascript",
  ".svg": "image/svg+xml",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};
const FREEZE =
  "*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}";

function serve(directory) {
  const server = createServer(async (request, response) => {
    const path = normalize(new URL(request.url, "http://x").pathname);
    try {
      const body = await readFile(join(directory, path));
      response.writeHead(200, {
        "content-type": MIME[extname(path)] ?? "application/octet-stream",
      });
      response.end(body);
    } catch {
      response.writeHead(404).end();
    }
  });
  return new Promise((done) =>
    server.listen(0, "127.0.0.1", () => done(server)),
  );
}

// Runs in the page: one record per element that takes up space.
function collect() {
  const skipped = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "LINK", "META"]);
  const out = [];
  for (const el of document.body.querySelectorAll("*")) {
    if (skipped.has(el.tagName)) continue;
    const rect = el.getBoundingClientRect();
    if (!rect.width && !rect.height) continue;
    const own = [...el.childNodes]
      .filter((node) => node.nodeType === Node.TEXT_NODE)
      .map((node) => node.textContent.trim())
      .filter(Boolean)
      .join(" ");
    const attributes = ["alt", "aria-label", "src", "href", "value"]
      .map((name) => el.getAttribute(name) ?? "")
      .join("|");
    out.push({
      box: [rect.x, rect.y, rect.width, rect.height].map(Math.round),
      tag: el.tagName,
      text: `${own}|${attributes}`,
    });
  }
  return out;
}

async function settle(page, id, origin) {
  await page.goto(
    `${origin}/iframe.html?id=${encodeURIComponent(id)}&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  await page.addStyleTag({ content: FREEZE });
  await page.waitForFunction(
    () =>
      document.body.classList.contains("sb-show-main") &&
      !document.body.classList.contains("sb-show-errordisplay"),
    null,
    { timeout: 20_000 },
  );
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(150);
}

// Returns { [storyId]: { layout, text } }. A story that fails to render is
// recorded as `error`, so a break shows as a change and never as silence.
export async function snapshotStories({ ids, staticDirectory }) {
  const require = createRequire(
    join(rootDirectory, "apps/preview/package.json"),
  );
  const { chromium } = require("playwright");
  const server = await serve(staticDirectory);
  const origin = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch();
  const result = {};
  const queue = [...ids];
  try {
    await Promise.all(
      Array.from({ length: PAGES }, async () => {
        const context = await browser.newContext({
          locale: "en-US",
          reducedMotion: "reduce",
          timezoneId: "UTC",
          viewport: VIEWPORT,
        });
        const page = await context.newPage();
        for (let id = queue.shift(); id; id = queue.shift()) {
          try {
            await settle(page, id, origin);
            result[id] = renderSignature(await page.evaluate(collect));
          } catch (error) {
            console.error(`snapshot ${id}: ${error.message}`);
            result[id] = { layout: "error", text: "error" };
          }
        }
        await context.close();
      }),
    );
  } finally {
    await browser.close();
    server.close();
  }
  return result;
}

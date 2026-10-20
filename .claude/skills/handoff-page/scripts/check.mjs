// Render a handoff page as its reader will, and fail on what a reader would see as broken.
// node check.mjs <page.html> [out-dir] - exits 1 on a FAIL; screenshots land in out-dir.
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { documentOf } from "./document.mjs";

const [file, outArg] = process.argv.slice(2);
if (!file) throw new Error("usage: node check.mjs <page.html> [out-dir]");
const page = resolve(file);
const dir = dirname(page);
const out = resolve(outArg ?? join(dir, "check"));
mkdirSync(out, { recursive: true });
const load = (base) => {
  for (const id of ["playwright", "@playwright/test"]) {
    try {
      return createRequire(join(base, "x.js"))(id);
    } catch {}
  }
};
const { chromium } =
  load(process.cwd()) ?? load(execSync("npm root -g").toString().trim()) ?? {};
if (!chromium)
  throw new Error(
    "no playwright: run from a folder that has it, or install it globally",
  );

const html = readFileSync(page, "utf8");
const doc = documentOf(html);
const ORIGIN = "https://handoff.check/";
const served = new Set();
const issues = new Map();
const bg = {};
const flipped = {};
const note = (level, message, at) => {
  const key = `${level}  ${message}`;
  issues.set(key, [...(issues.get(key) ?? []), at].filter(Boolean));
};

if (/<!doctype|<html[\s>]|<body[\s>]/i.test(html))
  note(
    "warn",
    "the file carries its own doctype, <html> or <body>; the Artifact tool adds the skeleton",
  );
const title = html
  .slice(0, 8192)
  .match(/<title>([^<]*)<\/title>/i)?.[1]
  .trim();
if (!title) note("FAIL", "no <title> in the first 8KB");
else if (/[:|]| - | — /.test(title) || title.split(/\s+/).length > 6)
  note(
    "warn",
    `title "${title}" reads as a caption; name the page in two to four words`,
  );

const serve = (ctx) =>
  ctx.route("**/*", (route) => {
    const url = route.request().url();
    if (!url.startsWith(ORIGIN)) return route.continue();
    if (url === ORIGIN)
      return route.fulfill({ body: doc, contentType: "text/html" });
    const path = join(dir, decodeURIComponent(new URL(url).pathname));
    // A digest's day list sits beside its published folder, never beside a draft; the bar stays hidden without it.
    if (url === `${ORIGIN}days.json`) return route.fulfill({ status: 404 });
    if (!existsSync(path)) {
      note("FAIL", `missing file ${url.slice(ORIGIN.length)}`);
      return route.fulfill({ status: 404 });
    }
    served.add(path);
    return route.fulfill({ path });
  });

const browser = await chromium.launch(
  process.env.CHROMIUM_PATH
    ? { executablePath: process.env.CHROMIUM_PATH }
    : {},
);
let renders = 0;
for (const scheme of ["light", "dark"]) {
  for (const width of [390, 1024, 1280]) {
    const ctx = await browser.newContext({
      viewport: { width, height: 900 },
      colorScheme: scheme,
      reducedMotion: "reduce",
    });
    await serve(ctx);
    const tab = await ctx.newPage();
    tab.on("pageerror", (e) => note("FAIL", `script error: ${e.message}`));
    tab.on(
      "console",
      (m) =>
        m.type() === "error" &&
        !m.text().startsWith("Failed to load resource") &&
        note("FAIL", `console: ${m.text().trim().slice(0, 200)}`),
    );
    tab.on(
      "requestfailed",
      (r) =>
        r.url().startsWith(ORIGIN) ||
        note("warn", `not loaded here, check it on the host: ${r.url()}`),
    );
    await tab.goto(ORIGIN, { waitUntil: "load" });
    await tab.waitForTimeout(400);
    const views = await tab.evaluate(() =>
      (window.handoffViews ?? [["page"]]).map((v) => v[0]),
    );
    for (const [i, view] of views.entries()) {
      const shot = join(
        out,
        `${view.replace(/\W+/g, "-").toLowerCase()}-${width}-${scheme}`,
      );
      await tab.evaluate((i) => window.handoffViews?.[i]?.[1]?.(), i);
      await tab.waitForTimeout(150);
      if (i === 0 && scheme === "light")
        await tab.screenshot({ path: `${shot}-top.png` });
      const found = await tab.evaluate(async () => {
        for (const d of document.querySelectorAll("details")) d.open = true;
        for (const img of document.images) img.loading = "eager";
        await Promise.race([
          Promise.all(
            [...document.images].map((img) => img.decode().catch(() => {})),
          ),
          new Promise((r) => setTimeout(r, 5000)),
        ]);
        const vw = document.documentElement.clientWidth;
        const all = [...document.querySelectorAll("body *")];
        const name = (el) =>
          el.tagName.toLowerCase() +
          (el.id ? `#${el.id}` : "") +
          [...el.classList]
            .slice(0, 2)
            .map((c) => `.${c}`)
            .join("");
        const contained = (el) => {
          for (
            let p = el.parentElement;
            p && p !== document.body;
            p = p.parentElement
          ) {
            if (/auto|scroll|hidden|clip/.test(getComputedStyle(p).overflowX))
              return true;
          }
          return false;
        };
        const cut = all.filter((el) => {
          const r = el.getBoundingClientRect();
          return (
            r.width > 0 && r.right > vw + 1 && r.left < vw && !contained(el)
          );
        });
        const clipped = all.filter((el) => {
          const s = getComputedStyle(el);
          if (
            !/hidden|clip/.test(s.overflow) ||
            s.textOverflow === "ellipsis" ||
            s.webkitLineClamp !== "none"
          )
            return false;
          if (
            el.clientWidth < 2 ||
            el.clientHeight < 2 ||
            !el.textContent.trim()
          )
            return false;
          return (
            el.scrollHeight > el.clientHeight + 2 ||
            el.scrollWidth > el.clientWidth + 2
          );
        });
        return {
          sideways: document.documentElement.scrollWidth > vw + 1,
          cut: cut.slice(0, 3).map(name),
          clipped: clipped.slice(0, 3).map(name),
          broken: [...document.images]
            .filter(
              (img) => img.naturalWidth === 0 && img.getClientRects().length,
            )
            .map((img) => img.getAttribute("src")),
          bg: getComputedStyle(document.body).backgroundColor,
        };
      });
      const at = `${view} ${width} ${scheme}`;
      renders++;
      if (found.sideways || found.cut.length)
        note(
          "FAIL",
          `wider than the screen: ${found.cut.join(", ") || "the page"}`,
          at,
        );
      if (found.clipped.length)
        note("warn", `text cut off inside ${found.clipped.join(", ")}`, at);
      for (const src of found.broken)
        note("FAIL", `image did not load: ${src}`, at);
      if (/rgba\(0, 0, 0, 0\)|transparent/.test(found.bg))
        note("FAIL", "body paints no background of its own", at);
      bg[scheme] ??= found.bg;
      // A full-page shot draws a sticky bar where the viewport left it, so flatten them first.
      await tab.evaluate(() => {
        for (const el of document.querySelectorAll("body *")) {
          if (getComputedStyle(el).position === "sticky")
            el.style.position = "static";
        }
      });
      await tab.screenshot({ path: `${shot}.png`, fullPage: true });
      if (i === 0 && scheme === "light" && width !== 1024) {
        const ids = await tab.evaluate(() =>
          [...document.querySelectorAll("section[id]")]
            .filter((s) => !s.parentElement.closest("section"))
            .map((s) => s.id),
        );
        for (const id of ids)
          await tab
            .locator(`[id="${id}"]`)
            .screenshot({ path: `${shot}-${id}.png` });
      }
    }
    if (width === 1280) {
      flipped[scheme] = await tab.evaluate(
        (t) => {
          document.documentElement.dataset.theme = t;
          return getComputedStyle(document.body).backgroundColor;
        },
        scheme === "light" ? "dark" : "light",
      );
    }
    await ctx.close();
  }
}

// Answering every card must put each pick in the line Copy answers hands the reader.
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 900 },
});
await serve(ctx);
const tab = await ctx.newPage();
tab.on("pageerror", (e) =>
  note("FAIL", `script error while answering: ${e.message}`),
);
await tab.goto(ORIGIN, { waitUntil: "load" });
const record = await tab.evaluate(() => {
  const cards = [...document.querySelectorAll("[data-ask]")];
  if (!cards.length) return null;
  const expected = [];
  for (const card of cards) {
    const radio = card.querySelector('input[type="radio"]');
    const box = card.querySelector('input[type="checkbox"]');
    if (radio) {
      radio.click();
      expected.push(`${card.dataset.ask.slice(1)}${radio.value}`);
    } else if (box) box.click();
  }
  return {
    expected,
    line: document.getElementById("answer-line")?.textContent ?? "",
  };
});
if (record) {
  for (const pick of record.expected)
    if (!new RegExp(`\\b${pick}\\b`).test(record.line))
      note(
        "FAIL",
        `picking ${pick} did not reach the answer line "${record.line}"`,
      );
  console.log(
    `answers: ${record.expected.length} card(s) answered; line "${record.line}"`,
  );
} else {
  console.log("answers: no question or blocker cards to answer");
}
// Each reader in the filter must still see a change: the filter narrows, it never empties.
const filter = await tab.evaluate(() => {
  const radios = [...document.querySelectorAll('input[name="audience"]')];
  const seen = radios.map((r) => {
    r.click();
    const cards = [...document.querySelectorAll(".card.change")];
    return [
      r.value || "Everyone",
      cards.filter((c) => !c.closest("[hidden]")).length,
    ];
  });
  radios[0]?.click();
  return seen;
});
for (const [who, shown] of filter)
  if (!shown) note("FAIL", `the ${who} filter hides every change`);
if (filter.length)
  console.log(
    `filter: ${filter.map(([who, shown]) => `${who} ${shown}`).join(", ")}`,
  );
await ctx.close();
await browser.close();

if (flipped.light !== bg.dark)
  note(
    "FAIL",
    `[data-theme="dark"] on a light system paints ${flipped.light}, not the dark background ${bg.dark}`,
  );
if (flipped.dark !== bg.light)
  note(
    "FAIL",
    `[data-theme="light"] on a dark system paints ${flipped.dark}, not the light background ${bg.light}`,
  );
if (bg.light === bg.dark)
  note(
    "warn",
    "light and dark backgrounds match; right only for a deliberate single-theme page",
  );
const mb = [page, ...served].reduce((n, p) => n + statSync(p).size, 0) / 1e6;
if (mb > 16)
  note("FAIL", `page and files weigh ${mb.toFixed(1)}MB; the limit is 16MB`);
else if (mb > 5)
  note(
    "warn",
    `page and files weigh ${mb.toFixed(1)}MB; JPEG at quality 78 keeps screenshots light`,
  );
for (const [line, ats] of [...issues].sort())
  console.log(
    line +
      (ats.length
        ? `  [${ats.length === renders ? "every render" : ats.join("; ")}]`
        : ""),
  );
const failed = [...issues.keys()].some((k) => k.startsWith("FAIL"));
console.log(
  `${failed ? "FAILED" : "passed"}: ${renders} renders, screenshots in ${out}`,
);
process.exit(failed ? 1 : 0);

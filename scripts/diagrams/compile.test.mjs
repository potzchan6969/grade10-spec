import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { deliver } from "./archify.mjs";
import { compile } from "./compile.mjs";

const EXAMPLES = join(
  dirname(createRequire(import.meta.url).resolve("archify/package.json")),
  "examples",
);
const html = deliver(
  "workflow",
  join(EXAMPLES, "agent-tool-call.workflow.json"),
);
const svg = compile(html, "tool-call");

test("one namespaced root, scoped to its name, with nothing the viewer owned", () => {
  assert.match(
    svg,
    /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="[^"]+"/,
  );
  assert.equal(svg.match(/<svg\b/g).length, 1);
  assert.match(svg, /data-diagram="tool-call"/);
  for (const gone of [
    "<script",
    "tabindex=",
    'role="button"',
    "aria-pressed",
    "<!--",
  ]) {
    assert.ok(!svg.includes(gone), `${gone} survived`);
  }
});

test("styles ride inside, scoped, with theme pairs behind the manual's tokens", () => {
  assert.match(
    svg,
    /<style>\nsvg\[data-diagram="tool-call"\]\{--arrow:var\(--muted-foreground, light-dark\(/,
  );
  assert.match(svg, /svg\[data-diagram="tool-call"\] \.c-frontend\{/);
  const selectors = [...svg.matchAll(/^([^{@\n][^{\n]*)\{/gm)].map((m) => m[1]);
  assert.ok(selectors.length > 10);
  for (const selector of selectors) {
    assert.match(selector, /^svg\[data-diagram="tool-call"\]/, selector);
    assert.doesNotMatch(
      selector,
      /:hover|:focus|\[data-(?!diagram|preset)/,
      selector,
    );
  }
});

test("ids are the diagram's own, and every reference follows", () => {
  const ids = [...svg.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  assert.ok(ids.length > 0);
  for (const id of ids) assert.match(id, /^tool-call-/);
  for (const [, ref] of svg.matchAll(/url\(#([^)]+)\)/g))
    assert.ok(ids.includes(ref), ref);
  for (const [, list] of svg.matchAll(
    /aria-(?:labelledby|describedby)="([^"]+)"/g,
  )) {
    for (const ref of list.split(" ")) assert.ok(ids.includes(ref), ref);
  }
});

test("the title names the drawing and the desc describes it", () => {
  const [, label] = /<svg[^>]*aria-labelledby="([^"]+)"/.exec(svg);
  const [, described] = /<svg[^>]*aria-describedby="([^"]+)"/.exec(svg);
  assert.match(svg, new RegExp(`<title id="${label}">`));
  assert.match(svg, new RegExp(`<desc id="${described}">`));
});

test("nodes claim their step by id, edges the step they point at", () => {
  assert.match(svg, /<g data-step="user"[^>]*data-node-id="user"/);
  assert.match(svg, /<path data-step="chat"[^>]*data-edge-to="chat"/);
});

test("the viewBox closes in on the drawing, not archify's canvas", () => {
  const [, canvas] = /<svg[^>]*viewBox="([^"]+)"/.exec(html);
  const [, drawn] = /<svg[^>]*viewBox="([^"]+)"/.exec(svg);
  const height = (box) => Number(box.split(" ")[3]);
  assert.ok(height(drawn) < height(canvas), `${drawn} inside ${canvas}`);
  assert.ok(
    drawn.split(" ").every((n) => Number(n) >= 0),
    drawn,
  );
});

test("a lane band stops at the drawing inside it", () => {
  const width = (source) =>
    [
      ...source.matchAll(
        /<rect\b[^>]*data-composition-frame-kind="lane"[^>]*>/g,
      ),
    ]
      .map(([tag]) => Number(/\swidth="([\d.]+)"/.exec(tag)?.[1]))
      .filter((one) => Number.isFinite(one));
  const before = width(html);
  const after = width(svg);

  assert.ok(before.length > 0, "the example draws no lanes");
  assert.equal(after.length, before.length);
  for (const [at, band] of after.entries()) {
    assert.ok(band <= before[at], `lane ${at}: ${band} > ${before[at]}`);
  }
});

test("the same source compiles to the same bytes", () => {
  assert.equal(compile(html, "tool-call"), svg);
});

test("a name that is not a slug is refused", () => {
  assert.throws(() => compile(html, "Tool Call"), /slug/);
});

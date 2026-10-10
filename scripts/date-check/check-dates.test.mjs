import assert from "node:assert/strict";
import { test } from "node:test";
import { findings, isChecked } from "./check-dates.mjs";

const at = (path, text) => findings([{ path, text }]);

test("a hand-built formatter in a package is refused", () => {
  assert.deepEqual(
    at(
      "packages/ui/src/blocks/x.ts",
      'const f = new Intl.DateTimeFormat("en", {});',
    ),
    [
      "packages/ui/src/blocks/x.ts:1 formats a date itself - call the shape it needs from @grade10/date",
    ],
  );
});

test("a date rendered on the reader's machine is refused, wherever it sits", () => {
  assert.equal(
    at("apps/preview/src/a.tsx", "d.toLocaleDateString('en')").length,
    1,
  );
  assert.equal(
    at("packages/ui/src/a.stories.tsx", "d.toLocaleTimeString()").length,
    1,
  );
});

test("the date library is reached through the package, in every import form", () => {
  for (const line of [
    'import { format } from "date-fns";',
    'import { enUS } from "date-fns/locale";',
    'import { tz } from "@date-fns/tz";',
    'import "date-fns";',
    'const m = await import("date-fns");',
    'const m = require("date-fns");',
  ]) {
    assert.equal(at("packages/ui/src/a.ts", line).length, 1, line);
  }
});

test("a number or an amount is not a date", () => {
  assert.deepEqual(
    at(
      "packages/ui/src/a.ts",
      'n.toLocaleString("en-HK", { style: "currency" })',
    ),
    [],
  );
});

test("the package itself is the one place the library is read", () => {
  assert.deepEqual(
    at("packages/date/src/render.ts", 'import { format } from "date-fns";'),
    [],
  );
  assert.equal(isChecked("packages/date/src/shapes.ts"), false);
});

test("the manual's own scripts and non-source files are out of scope", () => {
  assert.equal(isChecked("tools/manual/src/api/time.ts"), false);
  assert.equal(isChecked("scripts/storybook/storybook.mjs"), false);
  assert.equal(isChecked("packages/ui/README.md"), false);
  assert.equal(isChecked("packages/ui/src/a.tsx"), true);
});

test("a finding names its line", () => {
  assert.match(
    at("apps/emails/a.ts", "ok\nok\nnew Intl.DateTimeFormat()")[0],
    /^apps\/emails\/a\.ts:3 /,
  );
});

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { DESK_BASE } from "../../manual/src/api/desk.ts";

const ROOT = new URL("../../../", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, ROOT), "utf8");
const jsonc = (path: string) =>
  JSON.parse(
    read(path)
      .split("\n")
      .filter((line) => !/^\s*\/\//.test(line))
      .join("\n"),
  );

test("the desk has no address of its own, and one SQLite Durable Object", () => {
  const desk = jsonc("tools/run-desk/wrangler.jsonc");
  assert.equal(desk.routes, undefined);
  assert.equal(desk.route, undefined);
  assert.equal(desk.workers_dev, false);
  assert.equal(desk.preview_urls, false);
  assert.deepEqual(desk.durable_objects.bindings, [
    { name: "RUN_DESK", class_name: "RunDesk" },
  ]);
  assert.deepEqual(
    desk.migrations.flatMap(
      (one: { new_sqlite_classes?: string[] }) => one.new_sqlite_classes ?? [],
    ),
    ["RunDesk"],
  );
});

test("the manual's Worker runs first on the desk's paths and binds the desk by name", () => {
  const desk = jsonc("tools/run-desk/wrangler.jsonc");
  const manual = jsonc("tools/manual/wrangler.jsonc");
  assert.equal(manual.account_id, desk.account_id);
  assert.deepEqual(manual.services, [{ binding: "DESK", service: desk.name }]);
  assert.deepEqual(manual.assets.run_worker_first, [`${DESK_BASE}/*`]);
  assert.equal(manual.assets.binding, "ASSETS");
  assert.equal(manual.workers_dev, false);
});

test("local dev and the deploy run the same wrangler", () => {
  const pinned = /WRANGLER_VERSION:\s*([^\s#]+)/.exec(
    read(".github/workflows/manual.yml"),
  )?.[1];
  const script = JSON.parse(read("package.json")).scripts["desk:dev"] as string;
  assert.ok(pinned, "manual.yml pins no WRANGLER_VERSION");
  assert.match(
    script,
    new RegExp(`wrangler@${pinned.replaceAll(".", "\\.")} `),
  );
  assert.match(
    read(".github/workflows/manual.yml"),
    /deploy -c tools\/run-desk\/wrangler\.jsonc/,
  );
});

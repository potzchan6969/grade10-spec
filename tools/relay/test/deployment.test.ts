import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { REQUIRED_SECRETS } from "../src/env.ts";

/** The deployment, read from the files that describe it: the README's deploy
 * walk, `wrangler.jsonc` and `Env`.
 *
 * The secrets are named by hand in the walk and in the config's comment, and
 * neither is read by anything at runtime: a secret added to the code and left
 * out of one of them is a deployment Operations sets up short, and the router
 * then refuses every request until somebody finds the name. `wrangler.jsonc`
 * is read as text because it holds comments, which JSON does not. */

/** The package's own root on the disk. A test reads these files; `src` never
 * does. */
const ROOT = decodeURIComponent(new URL("../", import.meta.url).pathname);

const here = (name: string): string => readFileSync(`${ROOT}${name}`, "utf8");

const README = here("README.md");
const WRANGLER = here("wrangler.jsonc");
const ENV = here("src/env.ts");

/** A file's own names, in the shape a secret and a binding are both written:
 * capitals, digits and underscores. */
const named = (text: string): Set<string> =>
  new Set([...text.matchAll(/[A-Z][A-Z0-9_]{3,}/g)].map((found) => found[0]));

/** The step of the README's deploy walk that puts the secrets in. */
function secretsStep(): string {
  const deploying = README.slice(README.indexOf("## Deploying"));
  const step = /^2\.\s[\s\S]*?(?=^3\.\s)/m.exec(deploying);
  if (!step) throw new Error("the README's Deploying walk has no step 2");
  return step[0];
}

/** The comment in `wrangler.jsonc` that lists what `wrangler secret put`
 * sets. */
function secretsComment(): string {
  const comment = /\/\/ Secrets, each set with[\s\S]*?(?=\n\})/.exec(WRANGLER);
  if (!comment) throw new Error("wrangler.jsonc names no secrets");
  return comment[0];
}

describe("the secrets", () => {
  it("are named in the deploy walk exactly as the code requires them", () => {
    expect(named(secretsStep())).toEqual(new Set(REQUIRED_SECRETS));
  });

  it("are named in `wrangler.jsonc` exactly as the code requires them", () => {
    expect(named(secretsComment())).toEqual(new Set(REQUIRED_SECRETS));
  });
});

describe("the Durable Objects", () => {
  /** Every namespace the deployment hands the code. */
  const namespaces = [
    ...ENV.matchAll(/^\s*([A-Z][A-Z0-9_]*): DurableObjectNamespace;/gm),
  ].map((found) => found[1]);

  /** Every binding the config declares, as the name the code reads it under
   * and the class behind it. */
  const bindings = [
    ...WRANGLER.matchAll(
      /\{\s*"name":\s*"([A-Z0-9_]+)",\s*"class_name":\s*"(\w+)"\s*\}/g,
    ),
  ].map((found) => ({ name: found[1], className: found[2] }));

  /** Every class a migration creates. */
  const migrated = [
    ...WRANGLER.matchAll(/"new_sqlite_classes":\s*\[([^\]]*)\]/g),
  ].flatMap((found) =>
    [...found[1].matchAll(/"(\w+)"/g)].map((name) => name[1]),
  );

  it("has a binding for every namespace `Env` names", () => {
    expect(namespaces).toEqual(["ROOM", "LIVE"]);
    expect(bindings.map((binding) => binding.name)).toEqual(namespaces);
  });

  it("creates every bound class in one migration", () => {
    for (const binding of bindings) {
      expect(migrated.filter((name) => name === binding.className)).toEqual([
        binding.className,
      ]);
    }
  });
});

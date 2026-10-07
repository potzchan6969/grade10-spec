#!/usr/bin/env node
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { cliArgs } from "./lib/args.mjs";
import {
  changeClusters,
  changeStacks,
  formatClusters,
  formatStacks,
} from "./lib/clusters.mjs";
import { formatPreflight, preflightChange } from "./lib/preflight.mjs";

const HERE = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const args = cliArgs();
const take = (flag) => {
  const at = args.indexOf(flag);
  if (at < 0) return null;
  const [, value] = args.splice(at, 2);
  return value ?? "";
};
const root = take("--root") ?? HERE;
const flag = (name) => {
  const at = args.indexOf(name);
  if (at >= 0) args.splice(at, 1);
  return at >= 0;
};
const clusters = flag("--clusters");
const stacks = flag("--stacks");
const listed = take("--changes");
const changeIds = [
  ...new Set([...(listed ?? "").split(","), ...args].filter(Boolean)),
];
if (clusters) console.log(formatClusters(changeClusters(root)));
if (stacks) console.log(formatStacks(changeStacks(root, changeIds)));
if ((clusters || stacks) && changeIds.length === 0) process.exit(0);
if (changeIds.length === 0 || listed === "") {
  console.error(
    "usage: pnpm run accept:preflight <change-id>... [--changes a,b,c] [--clusters] [--stacks] [--root <store>]",
  );
  process.exit(2);
}
const results = changeIds.map((id) => preflightChange(root, id));
console.log(formatPreflight(results));
process.exitCode = results.some((one) => one.failures.length > 0) ? 1 : 0;

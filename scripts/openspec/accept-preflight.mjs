#!/usr/bin/env node
import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildPacket,
  formatPreflight,
  preflightChange,
} from "./lib/preflight.mjs";

const HERE = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const args = process.argv.slice(2);
const take = (flag) => {
  const at = args.indexOf(flag);
  if (at < 0) return null;
  const [, value] = args.splice(at, 2);
  return value ?? "";
};
const root = take("--root") ?? HERE;
const packet = take("--packet");
const listed = take("--changes");
const changeIds = [
  ...new Set([...(listed ?? "").split(","), ...args].filter(Boolean)),
];
if (changeIds.length === 0 || packet === "" || listed === "") {
  console.error(
    "usage: pnpm run accept:preflight <change-id>... [--changes a,b,c] [--packet <out.md>] [--root <store>]",
  );
  process.exit(2);
}
const results = changeIds.map((id) => preflightChange(root, id));
console.log(formatPreflight(results));
if (packet) {
  writeFileSync(resolve(packet), buildPacket(root, results));
  console.log(`Review packet: ${resolve(packet)}`);
}
process.exitCode = results.some((one) => one.failures.length > 0) ? 1 : 0;

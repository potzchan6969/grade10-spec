#!/usr/bin/env node
import { fileURLToPath } from "node:url";
import { parseArgs } from "./lib/args.mjs";

export {
  checkPrintedRuns as checkRecords,
  verifyPrintedRun as verifyRecord,
} from "./lib/printed-run-message.mjs";

import { checkPrintedRuns } from "./lib/printed-run-message.mjs";

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  try {
    const { flags } = parseArgs(process.argv.slice(2), {
      keys: ["root"],
      usage: "Usage: node verify-run-record.mjs --root <candidate checkout>",
    });
    if (!flags.root) throw new Error("--root is required");
    const count = await checkPrintedRuns(flags.root, {
      token: process.env.GOOGLE_ACCESS_TOKEN,
      spreadsheetId: process.env.TCS_SHEET_ID,
    });
    console.log(
      `Verified ${count} finalized print commits against the live registry`,
    );
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

import { ArchiveError, createR2Archive } from "../src/archive.mjs";
import { createCaptureCoordinator } from "../src/capture-coordinator.mjs";
import {
  openCaptureSession,
  readBuildReceipt,
} from "../src/reference-capture.mjs";

// The deployed workbench's capture coordinator lives in one Durable Object:
// its storage holds the schedule, the live runs and the approvals, and its
// alarm drives a full run batch by batch. Workers reach it through a proxy
// with the coordinator's own method names.

const METHODS = [
  "requestFull",
  "noticeDeploy",
  "captureFocused",
  "createApproval",
  "listApprovals",
  "status",
];
const INSTANCE = "reference-captures";

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

// The headless browser loads the workbench through Cloudflare Access with a
// service token, sent to the Storybook origin only.
function accessHeaders(env) {
  const id = env.CAPTURE_ACCESS_CLIENT_ID;
  const secret = env.CAPTURE_ACCESS_CLIENT_SECRET;
  if (!id && !secret) return undefined;
  if (!id || !secret)
    throw new Error(
      "CAPTURE_ACCESS_CLIENT_ID and CAPTURE_ACCESS_CLIENT_SECRET must be set together",
    );
  return { "CF-Access-Client-Id": id, "CF-Access-Client-Secret": secret };
}

/**
 * Builds the Durable Object class. The host supplies `launch(env)`, which
 * opens a Browser Rendering browser, so this package needs no Cloudflare
 * dependency of its own.
 */
export function defineReferenceCaptures({ launch }) {
  return class ReferenceCaptures {
    constructor(state, env) {
      this.coordinator = createCaptureCoordinator({
        storage: state.storage,
        archive: createR2Archive(env.ARCHIVE),
        setAlarm: (time) => state.storage.setAlarm(time),
        openSession: () =>
          openCaptureSession({
            launch: () => launch(env),
            originHeaders: accessHeaders(env),
            provenance: async ({ browser, baseURL, originHeaders }) => {
              const receipt = await readBuildReceipt(
                browser,
                baseURL,
                originHeaders,
              );
              return { commit: receipt.commit, ref: "deploy", verified: true };
            },
          }),
      });
    }

    async fetch(request) {
      const { method, args } = await request.json();
      if (!METHODS.includes(method))
        return json({ error: "unknown method", code: "NOT_FOUND" }, 404);
      try {
        return json({ result: await this.coordinator[method](...args) }, 200);
      } catch (error) {
        if (error instanceof ArchiveError)
          return json({ error: error.message, code: error.code }, error.status);
        if (error instanceof TypeError)
          return json({ error: error.message, code: "INVALID_REQUEST" }, 400);
        console.error("[ui-verification-captures] request failed", error);
        return json(
          { error: "capture coordinator failed", code: "INTERNAL_ERROR" },
          500,
        );
      }
    }

    async alarm() {
      await this.coordinator.alarm();
    }
  };
}

/** The coordinator as a Worker sees it: each call goes to the one instance. */
export function coordinatorProxy(namespace) {
  const stub = () => namespace.get(namespace.idFromName(INSTANCE));
  return Object.fromEntries(
    METHODS.map((method) => [
      method,
      async (...args) => {
        const response = await stub().fetch("https://reference-captures/rpc", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ method, args }),
        });
        const body = await response.json();
        if (response.ok) return body.result;
        if (response.status === 400) throw new TypeError(body.error);
        throw new ArchiveError(response.status, body.code, body.error);
      },
    ]),
  );
}

// The Worker's own clock: a Cron Trigger reads the build receipt from the
// Worker's static assets, so a deploy is noticed without anyone telling it.
// The coordinator ignores a commit it has already seen.
export async function watchDeploys(env) {
  const origin = env.STORYBOOK_ORIGIN;
  if (!origin) throw new Error("STORYBOOK_ORIGIN is not set");
  if (!env.REFERENCE_CAPTURES)
    throw new Error("the REFERENCE_CAPTURES binding is missing");
  const response = await env.ASSETS.fetch(
    new Request(new URL("ui-verification-build.json", origin)),
  );
  if (!response.ok)
    throw new Error(
      `the deployed build has no receipt (HTTP ${response.status})`,
    );
  const receipt = await response.json();
  return coordinatorProxy(env.REFERENCE_CAPTURES).noticeDeploy({
    commit: receipt.commit,
    baseURL: origin,
  });
}

import { createWorker } from "@grade10/ui-verification/worker";

const archiveWorker = createWorker();

function unavailableResponse() {
  return new Response(
    JSON.stringify({
      error: "archive storage is unavailable",
      code: "ARCHIVE_UNAVAILABLE",
    }),
    {
      status: 503,
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "application/json; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api" || url.pathname.startsWith("/api/")) {
      if (!env?.ARCHIVE) return unavailableResponse();

      const archiveEnv =
        env.ALLOWED_ORIGINS === undefined
          ? { ...env, ALLOWED_ORIGINS: url.origin }
          : env;
      return archiveWorker.fetch(request, archiveEnv);
    }

    return env.ASSETS.fetch(request);
  },
};

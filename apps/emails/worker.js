// The static export has no server to content-negotiate on Next's `RSC`
// header, so its client router's soft-navigation fetch gets back a full HTML
// document instead of a Flight payload, fails to parse it, and falls back to
// a hard page reload. This intercepts that fetch and serves the matching
// prerendered `.rsc` file (see scripts/build-preview.mjs) instead.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const isRscFetch =
      url.searchParams.has("_rsc") || request.headers.get("RSC") === "1";

    if (isRscFetch) {
      const routePath =
        url.pathname === "/" ? "/index" : url.pathname.replace(/\/$/, "");
      const rscResponse = await env.ASSETS.fetch(
        new Request(new URL(`${routePath}.rsc`, url), request),
      );
      if (rscResponse.ok) {
        const headers = new Headers(rscResponse.headers);
        headers.set("content-type", "text/x-component; charset=utf-8");
        // Next's client router cache treats a prefetch without this as
        // immediately stale and refetches it on every navigation, looping.
        headers.set("x-nextjs-stale-time", "300");
        return new Response(rscResponse.body, {
          status: rscResponse.status,
          headers,
        });
      }
    }

    return env.ASSETS.fetch(request);
  },
};

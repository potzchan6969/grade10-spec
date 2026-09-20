/**
 * What the deployed relay holds. The vars are in `wrangler.jsonc`; the secrets
 * are `wrangler secret put` names and appear in no file here.
 */
export interface Env {
  /** One Durable Object per change, and one per Slack thread until a run
   * names the change that thread is about. */
  ROOM: DurableObjectNamespace;

  /** The Slack channel the planning threads live in. A post with no thread
   * falls back to it. */
  PLANNING_CHANNEL: string;
  /** The store, as `owner/name`. */
  REPO: string;
  /** The relay's own origin, which the payload hands the run to post back to. */
  RELAY_URL: string;
  /** The app's own Slack member id, `U…`. The envelope carries it in
   * `authorizations`, and this is what the relay reads when it does not: an
   * app it cannot name is an app nobody addressed. */
  SLACK_APP_USER: string;

  SLACK_SIGNING_SECRET: string;
  SLACK_BOT_TOKEN: string;
  ROUTINE_FIRE_URL: string;
  ROUTINE_TOKEN: string;
  GITHUB_TOKEN: string;
  TOKEN_SECRET: string;
  WAKE_TOKEN: string;
}

/**
 * The secrets nothing works without, refused blank at the router's entry: a
 * relay deployed with one of them unset would otherwise verify every Slack
 * request against the empty string, sign every wake token with it, or move
 * `main` with no credential at all.
 *
 * `SLACK_BOT_TOKEN` and `ROUTINE_FIRE_URL` are not here: a relay that cannot
 * post or cannot fire says so in the thread, or in the answer to the wake,
 * and neither one makes a check pass that should have refused.
 */
export const REQUIRED_SECRETS = [
  "SLACK_SIGNING_SECRET",
  "ROUTINE_TOKEN",
  "GITHUB_TOKEN",
  "TOKEN_SECRET",
  "WAKE_TOKEN",
] as const;

/** The first secret the deployment is missing, or null. */
export function missingSecret(env: Env): string | null {
  for (const name of REQUIRED_SECRETS) {
    if (String(env[name] ?? "").trim() === "") return name;
  }
  return null;
}

/**
 * What the deployed relay holds. The vars are in `wrangler.jsonc`; the secrets
 * are `wrangler secret put` names and appear in no file here.
 */
export interface Env {
  /** One Durable Object per Slack thread, and one per change as the pointer a
   * landing wake is addressed to. */
  ROOM: DurableObjectNamespace;

  /** The Slack channel the planning threads live in. A post with no thread
   * falls back to it. */
  PLANNING_CHANNEL: string;
  /** The store, as `owner/name`. */
  REPO: string;
  /** The relay's own origin, which the payload hands the run to post back to. */
  RELAY_URL: string;

  SLACK_SIGNING_SECRET: string;
  SLACK_BOT_TOKEN: string;
  ROUTINE_FIRE_URL: string;
  ROUTINE_TOKEN: string;
  GITHUB_TOKEN: string;
  TOKEN_SECRET: string;
  WAKE_TOKEN: string;
}

/**
 * The zone the platform states an instant in when nobody names another.
 *
 * An instant is UTC everywhere - on the wire, in the database, in every
 * comparison. A *day* is not: a contract's date, a due date, a "today" queue
 * and a document's expiry are calendar judgements a shop makes on its own
 * clock. So every day boundary and every formatter here takes a zone,
 * defaulting to this one, and the code that means a brand's calendar day
 * passes the brand's zone explicitly.
 *
 * Never read off the machine: a surface is rendered twice - once where it is
 * served, once by the browser taking that document over - and the two do not
 * agree about what "no zone" means.
 */
export const PLATFORM_ZONE = "UTC";

/**
 * The language the platform words a date in when the caller asked for no
 * other. Stated, never read off a machine, for the same reason as the zone.
 */
export const PLATFORM_LOCALE = "en";

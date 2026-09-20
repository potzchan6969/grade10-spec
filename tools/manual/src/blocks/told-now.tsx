import { Text } from "@grade10/design-system/components/display/text";
import { ROLE_LABEL } from "../api/stage-view";
import { toldNowOf } from "../api/told-now";
import type { ChangeEntry, SchemaArtifact, Stage } from "../api/types";
import { SlackText } from "./slack-text";

/**
 * The message the hands of this change are being sent, as they will read it.
 *
 * Inside the Your turn card, under the thread link, because it is the same
 * fact said in the other direction: the card says whose turn it is, and this
 * is what that person's inbox holds. A reader who has to guess what Slack
 * said cannot tell a message that never arrived from one that said something
 * else, and the composer is shared so the two can never differ.
 *
 * One line where nobody is being told anything: Designed, Released and
 * Archived are a design pair's, a cut's and the fold's, and a reader who was
 * shown nothing could not tell a stage that sends no message from a block
 * that failed to render.
 */
export function ToldNow({
  change,
  stage,
  artifacts,
}: {
  change: ChangeEntry;
  stage: Stage;
  /** The change's schema artifacts: whose turn it is in Proposed, and whose
   * hand a behind artifact's message goes to. */
  artifacts: SchemaArtifact[];
}) {
  const told = toldNowOf(change, stage, artifacts);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-wrap items-baseline gap-x-2">
        <Text as="span" size="xs" weight="medium">
          Told now
        </Text>
        <Text as="span" size="xs" tone="secondary">
          what the message says
        </Text>
      </div>
      {told.length === 0 ? (
        <Text as="p" size="xs" tone="secondary">
          No message: this stage waits on no hand.
        </Text>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {told.map((one) => (
            <li
              className="flex flex-col gap-0.5"
              key={`${one.kind}:${one.role}`}
            >
              <Text as="span" className="font-mono" size="xs" tone="secondary">
                {one.hand
                  ? `@${one.hand}`
                  : `the ${ROLE_LABEL[one.role]} channel`}
              </Text>
              <blockquote className="border-border border-l-2 pl-2.5">
                <Text as="p" size="xs">
                  <SlackText text={one.text} />
                </Text>
              </blockquote>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

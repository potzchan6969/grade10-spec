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
 * Nothing at all where nobody is being told anything: a stage that waits on
 * no hand sends no message, and a quoted block with nothing in it would read
 * as a message that said nothing.
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
  if (told.length === 0) return null;

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
      <ul className="flex flex-col gap-1.5">
        {told.map((one) => (
          <li className="flex flex-col gap-0.5" key={`${one.kind}:${one.role}`}>
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
    </div>
  );
}

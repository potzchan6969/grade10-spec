import type { Decorator } from "@storybook/react-vite";
import { addons } from "storybook/preview-api";
import { GIVEN_JOURNEYS, type GivenJourneys } from "./given-event";
import { shortId, titles } from "./journeys";

/* A Scenario's journeys, in their own words, sent to the Given panel
 * (`manager.tsx`). The journey files are read here, where Vite can glob them;
 * the panel reads the settings itself. Nothing is drawn on the canvas. */
export const withGiven: Decorator = (Story, context) => {
  if (context.tags.includes("scenario")) {
    const ids = (context.parameters.journeys as string[] | undefined) ?? [];
    const payload: GivenJourneys = {
      storyId: context.id,
      journeys: ids.map((id) => ({
        id,
        short: shortId(id),
        title: titles.get(id) ?? "unknown journey",
      })),
    };
    addons.getChannel().emit(GIVEN_JOURNEYS, payload);
  }
  return <Story />;
};

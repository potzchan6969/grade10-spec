/** The preview tells the Given panel which journeys a Scenario walks. */
export const GIVEN_JOURNEYS = "grade10/given-journeys";

export type GivenJourneys = {
  storyId: string;
  journeys: { id: string; short: string; title: string }[];
};

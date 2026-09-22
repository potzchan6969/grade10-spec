import { Text } from "react-email";

export type SubmissionLineProps = {
  submissionId: string;
  /** What the submission holds: the cards, the grader and the level. */
  cardCount: number;
  grader: string;
  level: string;
};

/** The submission's own line, directly above the footer of every letter. */
export function SubmissionLine({
  submissionId,
  cardCount,
  grader,
  level,
}: SubmissionLineProps) {
  return (
    <Text className="mb-0 mt-6 text-sm leading-base text-fg-2">
      Submission <span className="font-bold text-fg">{submissionId}</span> ·{" "}
      {cardCount} cards to {grader} {level}
    </Text>
  );
}

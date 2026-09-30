import { Text } from "react-email";

export type SubmissionLineProps = {
  submissionId: string;
  /** What the submission holds: the cards, and the grader and level once picked. */
  cardCount: number;
  grader: string | null;
  level: string | null;
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
      {cardCount} cards{grader && level ? ` to ${grader} ${level}` : ""}
    </Text>
  );
}

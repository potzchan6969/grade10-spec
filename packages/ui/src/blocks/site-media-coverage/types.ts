/** One media card: the story's publication, title and external link. */
type MediaItem = {
  readonly publication: string;
  readonly title: string;
  readonly href: string;
};

type MediaCoverageContent = {
  readonly eyebrow: string;
  readonly heading: string;
  readonly intro: string;
  readonly items: readonly MediaItem[];
};

type MediaCoverageCopy = {
  /** The call to action every card ends on. */
  readonly readArticle: string;
};

export type { MediaCoverageContent, MediaCoverageCopy, MediaItem };

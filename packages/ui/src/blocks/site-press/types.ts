/** One row of the press list: the published date, title and article slug. */
type PressItem = {
  readonly date: string;
  readonly title: string;
  readonly href: string;
};

/** The releases published in one calendar year, newest first. */
type PressYearGroup = {
  readonly year: string;
  readonly items: readonly PressItem[];
};

type PressReleaseListContent = {
  readonly eyebrow: string;
  readonly heading: string;
  readonly intro: string;
  /** The filter's every-year option and its resting label. */
  readonly allTime: string;
  readonly groups: readonly PressYearGroup[];
};

type PressReleaseListCopy = {
  /** The year filter's accessible name. */
  readonly filterByYear: string;
};

/** A link target inside running text. */
type ArticleLink = {
  readonly href: string;
  /** Opens in a new tab with `rel="noopener noreferrer"`. */
  readonly external?: boolean;
};

/** A run of body text; `bold` for emphasis, `link` for an inline anchor. */
type ArticleSegment = {
  readonly text: string;
  readonly bold?: boolean;
  readonly link?: ArticleLink;
};

/** A body paragraph. */
type ArticleParagraphBlock = {
  readonly type: "paragraph";
  readonly segments: readonly ArticleSegment[];
};

/** A section heading inside the body; levels run h2 through h6. */
type ArticleHeadingBlock = {
  readonly type: "heading";
  readonly level: 2 | 3 | 4 | 5 | 6;
  readonly text: string;
};

/** A bullet or numbered list; each item is a run of segments. */
type ArticleListBlock = {
  readonly type: "list";
  readonly ordered?: boolean;
  readonly items: readonly (readonly ArticleSegment[])[];
};

/** A pull quote with its attribution line. */
type ArticleQuoteBlock = {
  readonly type: "quote";
  readonly segments: readonly ArticleSegment[];
  readonly cite: { readonly name: string; readonly role?: string };
};

/** One image: the optional caption renders as `figcaption`. */
type ArticleFigure = {
  readonly src: string;
  readonly alt: string;
  readonly caption?: string;
  readonly srcSet?: string;
  readonly sizes?: string;
};

/** A standalone image in the body flow. */
type ArticleFigureBlock = {
  readonly type: "figure";
  readonly figure: ArticleFigure;
};

/**
 * A photo grid: `span: "full"` takes the whole row, `half` shares it — the
 * frame's Photo Highlights pattern of one full figure over two halves.
 */
type ArticleGalleryBlock = {
  readonly type: "gallery";
  readonly figures: readonly (ArticleFigure & {
    readonly span?: "full" | "half";
  })[];
};

type ArticleBlock =
  | ArticleParagraphBlock
  | ArticleHeadingBlock
  | ArticleListBlock
  | ArticleQuoteBlock
  | ArticleFigureBlock
  | ArticleGalleryBlock;

/** A fixed card every article carries beside its body. */
type ArticleSidebarCard = {
  readonly title: string;
  readonly body: string;
};

/** The Media Enquiries card's contact lines. */
type ArticleContact = {
  readonly name: string;
  readonly link?: { readonly href: string; readonly label: string };
};

type PressArticleContent = {
  readonly breadcrumb: {
    readonly back: { readonly label: string; readonly href: string };
    readonly current: string;
  };
  readonly title: string;
  readonly date: string;
  readonly location?: string;
  readonly featureImage?: {
    readonly src: string;
    readonly alt: string;
    readonly srcSet?: string;
    readonly sizes?: string;
  };
  readonly body: readonly ArticleBlock[];
  readonly sidebar: {
    readonly cards: readonly ArticleSidebarCard[];
    readonly enquiries?: {
      readonly title: string;
      readonly contacts: readonly ArticleContact[];
    };
  };
};

export type {
  ArticleBlock,
  ArticleContact,
  ArticleFigure,
  ArticleFigureBlock,
  ArticleGalleryBlock,
  ArticleHeadingBlock,
  ArticleLink,
  ArticleListBlock,
  ArticleParagraphBlock,
  ArticleQuoteBlock,
  ArticleSegment,
  ArticleSidebarCard,
  PressArticleContent,
  PressItem,
  PressReleaseListContent,
  PressReleaseListCopy,
  PressYearGroup,
};

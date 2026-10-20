/** A numbered upcoming entry in the hero card. */
type UpcomingShow = {
  readonly month: string;
  readonly year: string;
  readonly title: string;
  readonly city: string;
};

/** A headline statistic in the Event Scale section. */
type ShowStat = {
  readonly label: string;
  readonly value: string;
  readonly detail: string;
};

/** One event edition card: carousel photos plus press-release destination. */
type ShowEdition = {
  readonly date: string;
  readonly title: string;
  readonly description: string;
  readonly photos: readonly string[];
  readonly pressRelease: string;
};

/** A regional chapter inside Event Formats. */
type ShowChapter = {
  /** Anchor id the tab list scrolls to. */
  readonly id: string;
  /** Short name shown on the pill tab. */
  readonly tab: string;
  /** Eyebrow label drawn beside the MapPin. */
  readonly label: string;
  readonly title: string;
  readonly dek: string;
  /** YouTube presentation; absent when the chapter has a still image. */
  readonly video?: {
    readonly poster: string;
    readonly posterAlt: string;
    readonly badge: string;
    readonly youtubeId: string;
  };
  /** Still image with caption; absent when the chapter has a video. */
  readonly image?: {
    readonly src: string;
    readonly alt: string;
    readonly caption: string;
  };
  /** Chapter-level press-release link (ghost button). */
  readonly pressRelease?: string;
  readonly editions: readonly ShowEdition[];
};

/** One row of the Event Records timeline. */
type ShowRecord = {
  readonly year: string;
  readonly title: string;
  readonly description: string;
  readonly image: { readonly src: string; readonly alt: string };
};

/** Words the body renders around its content; the functions name an item. */
type ShowsPageBodyCopy = {
  readonly pressRelease: string;
  readonly playVideo: (badge: string) => string;
  readonly videoTitle: (badge: string) => string;
  readonly photoAlt: (title: string, position: number, count: number) => string;
  readonly previousPhoto: (title: string) => string;
  readonly nextPhoto: (title: string) => string;
  /** The carousel's progress navigation. */
  readonly photos: (title: string) => string;
  /** One progress dot. */
  readonly photo: (title: string, position: number) => string;
};

type ShowsPageContent = {
  readonly hero: {
    readonly eyebrow: string;
    readonly heading: string;
    readonly intro: string;
    readonly explore: string;
    readonly press: string;
    readonly pressHref: string;
    readonly upcomingLabel: string;
    /** Rendered as given; the card leaves the hero when it is empty. */
    readonly upcomingShows: readonly UpcomingShow[];
  };
  readonly eventScale: {
    readonly eyebrow: string;
    readonly heading: string;
    readonly dek: string;
    readonly photo: {
      readonly src: string;
      readonly srcSet?: string;
      readonly alt: string;
    };
    readonly stats: readonly ShowStat[];
  };
  readonly formats: {
    readonly eyebrow: string;
    readonly heading: string;
    readonly chapters: readonly ShowChapter[];
  };
  readonly records: {
    readonly eyebrow: string;
    readonly heading: string;
    readonly items: readonly ShowRecord[];
  };
};

export type {
  ShowChapter,
  ShowEdition,
  ShowRecord,
  ShowStat,
  ShowsPageBodyCopy,
  ShowsPageContent,
  UpcomingShow,
};

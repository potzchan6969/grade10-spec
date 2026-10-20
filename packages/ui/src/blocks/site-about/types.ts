/** A link target inside a running paragraph. */
type AboutLink = {
  readonly href: string;
  /** Opens in a new tab with `rel="noopener noreferrer"`. */
  readonly external?: boolean;
};

/** A run of paragraph text; `link` turns the run into an inline anchor. */
type AboutSegment = {
  readonly text: string;
  readonly link?: AboutLink;
};

/** One row of the parent-company timeline. */
type AboutMilestone = {
  readonly date: string;
  /** Status line under the date — “Coming soon” on the upcoming entry. */
  readonly status?: string;
  readonly body: readonly AboutSegment[];
};

/** A headed paragraph in the two-column statements row. */
type AboutStatement = {
  readonly heading: string;
  readonly body: readonly AboutSegment[];
};

/** One market index in the tabbed showcase. */
type AboutIndex = {
  readonly name: string;
  /** The live index page; always opens in a new tab. */
  readonly href: string;
  /** A line on what the index tracks, shown under its screenshot. */
  readonly description: string;
  /** Screenshot of the live index page. */
  readonly shot: string;
  readonly shotAlt: string;
  /** Renders the Beta badge on indexes still in beta. */
  readonly beta?: boolean;
};

type AboutPageContent = {
  readonly heading: string;
  readonly intro: readonly AboutSegment[];
  readonly whatWeDo: AboutStatement;
  readonly whereWeAreGoing: AboutStatement;
  readonly marketIndexes: {
    readonly label: string;
    readonly heading: string;
    readonly body: string;
    readonly indexes: readonly AboutIndex[];
  };
  readonly parentCompany: {
    readonly label: string;
    readonly logoAlt: string;
    readonly logoSrc: string;
    readonly body: readonly AboutSegment[];
  };
  readonly milestones: readonly AboutMilestone[];
};

export type {
  AboutIndex,
  AboutLink,
  AboutMilestone,
  AboutPageContent,
  AboutSegment,
  AboutStatement,
};

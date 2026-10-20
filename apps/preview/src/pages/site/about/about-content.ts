/**
 * Copy and destinations for `/about`. Layout and structure come from the
 * Grade10-DS-2026 Figma frames (`7172:2923` desktop, `7172:7233` small
 * viewport); the body copy has since been tightened after a copywriting
 * review and no longer matches the Figma text verbatim.
 */

const MEMESTRATEGY_LOGO = new URL(
  "./memestrategy-logo.fixture.png",
  import.meta.url,
).href;

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

const HOME_LINK: AboutLink = { href: "/" };

const MEMESTRATEGY_LINK: AboutLink = {
  href: "https://memestrategy.com.hk/",
  external: true,
};
const NINEGAG_LINK: AboutLink = {
  href: "https://9gag.com/",
  external: true,
};
const GRADE10_AI_LINK: AboutLink = {
  href: "https://app.grade10.com/",
  external: true,
};

type AboutIndex = {
  readonly name: string;
  readonly href: string;
  /** A line on what the index tracks, shown under its screenshot. */
  readonly description: string;
  /** Screenshot of the live index page. */
  readonly shot: string;
  readonly shotAlt: string;
  /** Renders the Beta badge on indexes still in beta. */
  readonly beta?: boolean;
};

const HAT_PRICE_INDEX_SHOT = new URL(
  "./hat-price-index.fixture.jpg",
  import.meta.url,
).href;
const PTCG100_SHOT = new URL("./ptcg100.fixture.jpg", import.meta.url).href;
const PTCG500_SHOT = new URL("./ptcg500.fixture.jpg", import.meta.url).href;
const OPCG100_SHOT = new URL("./opcg100.fixture.jpg", import.meta.url).href;

const ABOUT_PAGE = {
  heading: "About Us",
  intro: [
    { text: "Grade10 is a trading card venture backed by " },
    { text: "MemeStrategy", link: MEMESTRATEGY_LINK },
    { text: " (HKEX: 2440) and founded by the team behind " },
    { text: "9GAG", link: NINEGAG_LINK },
    {
      text: ", a global platform with over 200 million users. We are building Asia’s largest card-collector community.",
    },
  ],
  whatWeDo: {
    heading: "What we do",
    body: [
      {
        text: "Since 2023, we’ve hosted Hong Kong’s largest card shows, offered vaulting services, and put real-time pricing and research in collectors’ hands through ",
      },
      { text: "Grade10 AI", link: GRADE10_AI_LINK },
      {
        text: ". We’ve also tokenized trading cards on-chain, so a card’s provenance and liquidity are verifiable.",
      },
    ],
  },
  whereWeAreGoing: {
    heading: "Where we’re going",
    body: [
      {
        text: "We are expanding into the Chinese Mainland through strategic partnerships and establishing a presence in Korea and beyond.",
      },
    ],
  },
  marketIndexes: {
    label: "Market Indexes",
    heading: "Real-Time Pulse of the Card Market",
    body: "The first indexes to track price movement across the market’s most liquid cards — from the Grey Felt Hat Pikachu to broad Pokémon and One Piece benchmarks.",
    indexes: [
      {
        name: "Hat Price Index",
        description:
          "Single-asset cultural index tracking the PSA 10 Grey Felt Hat Pikachu.",
        shot: HAT_PRICE_INDEX_SHOT,
        shotAlt: "Hat Price Index — live index page",
        href: "https://grade10.com/hat-price-index/",
      },
      {
        name: "PTCG100",
        beta: true,
        description:
          "Focused Pokémon benchmark — the 100 most representative PSA 10 cards.",
        shot: PTCG100_SHOT,
        shotAlt: "PTCG100 — live index page",
        href: "https://index.grade10.com/ptcg100",
      },
      {
        name: "PTCG500",
        beta: true,
        description:
          "Broad Pokémon benchmark — the 500 most representative PSA 10 cards.",
        shot: PTCG500_SHOT,
        shotAlt: "PTCG500 — live index page",
        href: "https://index.grade10.com/ptcg500",
      },
      {
        name: "OPCG100",
        beta: true,
        description:
          "Focused One Piece benchmark — the 100 most representative PSA 10 cards.",
        shot: OPCG100_SHOT,
        shotAlt: "OPCG100 — live index page",
        href: "https://index.grade10.com/opcg100",
      },
    ] satisfies readonly AboutIndex[],
  },
  parentCompany: {
    label: "Parent company",
    logoAlt: "MemeStrategy",
    logoSrc: MEMESTRATEGY_LOGO,
    body: [
      { text: "MemeStrategy, Inc.", link: MEMESTRATEGY_LINK },
      {
        text: " (HKEX: 2440) is a cultural collectibles and intellectual property (IP) company in Asia. Founded by the team behind ",
      },
      { text: "9GAG", link: NINEGAG_LINK },
      {
        text: ", a meme platform with over 200 million users, it brings over 18 years of internet-culture and social-media experience to collectibles and fandom.",
      },
    ],
  },
  milestones: [
    {
      date: "Q4 2026",
      status: "Coming soon",
      body: [
        {
          text: "Launch of Grade10 Finance, Asia’s first trading card financing service by a listed company",
        },
      ],
    },
    {
      date: "Mar 2026",
      body: [
        {
          text: "Issued the world’s first tokenized Pokémon trading card fund",
        },
      ],
    },
    {
      date: "Sep 2025",
      body: [
        {
          text: "Entered the Asian trading card market through the strategic acquisition of ",
        },
        { text: "Grade10", link: HOME_LINK },
      ],
    },
    {
      date: "Mar 2025",
      body: [{ text: "Completed a comprehensive brand revamp" }],
    },
  ] satisfies readonly AboutMilestone[],
};

export type { AboutIndex, AboutLink, AboutMilestone, AboutSegment };
export { ABOUT_PAGE };

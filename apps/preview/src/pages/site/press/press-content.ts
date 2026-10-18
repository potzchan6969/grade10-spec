/**
 * Copy and destinations for `/press-releases`. Layout and structure come
 * from the Grade10-DS-2026 Figma frame (`7201:9699`); the list carries the
 * live grade10.com press releases verbatim — the frame's items are
 * placeholder references. Dates follow the frame's `15 SEP, 2026` style.
 */

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

const PRESS_PAGE = {
  eyebrow: "Press",
  heading: "Press Releases",
  intro:
    "The official record of Grade10: the card festivals, the vault, the partnerships, and the growth of Asia’s trading-card market.",
  allTime: "All Time",
  groups: [
    {
      year: "2026",
      items: [
        {
          date: "15 SEP, 2026",
          title:
            "MemeStrategy (HKEX: 2440) and POKECOLOR Bring CARDJOY x Grade10 Card Show to the Canton Fair Complex in Guangzhou, China",
          href: "/press-releases/cardjoy-grade10-guangzhou-show-2026",
        },
        {
          date: "7 SEP, 2026",
          title:
            "Grade10 and Gana Art Announce Plans to Establish Joint Venture to Advance South Korea’s Trading Card Culture, Showcasing Vision through THEMGOOD Debut at Seoul Art Week",
          href: "/press-releases/grade10-gana-art-joint-venture",
        },
        {
          date: "10 AUG, 2026",
          title:
            "Grade10 Launches World’s First TCG Market Benchmark Indices, Establishing Institutional Pricing Standards for Alternative Assets and Ushering Trading Cards into the Data-Driven Era",
          href: "/press-releases/grade10-tcg-market-benchmark-indices",
        },
        {
          date: "16 JUL, 2026",
          title:
            "Grade10 Takes Its Trading Card Business to the Next Level with Official Entry into the South Korean Market, Partners with Leading Auction House Seoul Auction for Pokémon Card Exhibition and Private Sales Event",
          href: "/press-releases/grade10-south-korea-seoul-auction",
        },
        {
          date: "22 JUN, 2026",
          title:
            "MemeStrategy (HKEX: 2440)’s Premier Asian Trading Card Event Grade10 FEST Summer 2026 Concludes Successfully, Attracting Over 25,000 Attendees and Convening 120+ Local and International Exhibitors Over Three Days",
          href: "/press-releases/grade10-fest-summer-2026-concludes-successfully",
        },
        {
          date: "19 JUN, 2026",
          title:
            "Hong Kong’s Largest Card Show - Grade10 FEST Summer 2026 Grand Opening Today, Celebrating Pokémon’s 30th Anniversary with Hong Kong’s Largest Nostalgic Showcase! Tens of Millions of HKD Worth of Vintage Pokémon Cards on Display",
          href: "/press-releases/grade10-fest-summer-2026-grand-opening",
        },
        {
          date: "18 JUN, 2026",
          title:
            "MemeStrategy (HKEX: 2440) to launch Trading Card Financing Service “Grade10 Finance,” Asia’s First Trading Card Financing Service by a Listed Company, Unlocking Liquidity for Trading Cards and Building an Asia Collectibles Financial Ecosystem",
          href: "/press-releases/grade10-finance-launch",
        },
        {
          date: "8 JUN, 2026",
          title:
            "MemeStrategy (HKEX: 2440) and POKECOLOR Join Forces for Landmark Shanghai Card Show: “CARDJOY x Grade10” Returns with Expanded 5,000 sq m Venue and 200+ Exhibitors",
          href: "/press-releases/cardjoy-grade10-shanghai-expansion",
        },
        {
          date: "21 MAY, 2026",
          title:
            "Hong Kong’s Largest Card Show – Grade10 FEST Summer 2026 Marks Pokémon’s 30th Anniversary with Rare Vintage Exhibits and a Star-Studded Weekend",
          href: "/press-releases/grade10-fest-summer-2026-pokemon-anniversary",
        },
        {
          date: "11 MAY, 2026",
          title:
            "Pokémon’s 30th Anniversary: MemeStrategy (HKEX:2440) World’s First Tokenized Pokémon Card Fund Oversubscribed at its Initial Issuance, Backed by Institutional and Professional Investors, Pioneering a New Era of Cultural Asset Investment",
          href: "/press-releases/tokenized-pokemon-card-fund-oversubscribed",
        },
        {
          date: "30 APR, 2026",
          title:
            "MemeStrategy (HKEX: 2440) Makes Inaugural Foray into Collectible Card Issuance, TVB-Authorized Drama “Themis” Collectible Cards Spark Unprecedented Buying Frenzy, Spin-off Series Pre-orders to Launch in Early May, Sustaining Market Momentum",
          href: "/press-releases/tvb-themis-collectible-cards",
        },
        {
          date: "29 APR, 2026",
          title:
            "MemeStrategy (HKEX: 2440) Expands Pokémon Collectibles Card Business to the Chinese Mainland and Overseas Markets Through Strategic Partnership with China’s Industry Leader POKECOLOR",
          href: "/press-releases/pokecolor-strategic-partnership",
        },
        {
          date: "24 MAR, 2026",
          title:
            "MemeStrategy (HKEX: 2440) Partners with China’s Leading Trading Card Platform POKECOLOR to Successfully Host the Nation’s First-Ever “CARDJOY x Grade10 Card Show”, Attracting Over 10,000 Fans and Showcasing the Immense Potential of China’s Trading Card Market",
          href: "/press-releases/cardjoy-grade10-hangzhou-show",
        },
        {
          date: "2 MAR, 2026",
          title:
            "Pokémon’s 30th Anniversary: MemeStrategy (HKEX:2440) Launches World’s First Tokenized Collectible Card Fund, Pioneering an Institutional-Level Approach for Cultural Assets",
          href: "/press-releases/worlds-first-tokenized-pokemon-card-fund",
        },
        {
          date: "4 FEB, 2026",
          title:
            "MemeStrategy (HKEX: 2440) & Grade10 Join YouTube Legend Logan Paul’s Globally Anticipated Pokémon Trading Card Event",
          href: "/press-releases/logan-paul-pokemon-trading-card-event",
        },
        {
          date: "28 JAN, 2026",
          title:
            "MemeStrategy (HKEX: 2440) Launches “Grade10 Vault”, Asia’s First Professional Trading Card Vault by a Listed Company",
          href: "/press-releases/grade10-vault-launch",
        },
      ],
    },
    {
      year: "2025",
      items: [
        {
          date: "24 NOV, 2025",
          title:
            "World’s Largest Van Gogh Pikachu Card Wall Debuts at Hong Kong Grade10 Festival",
          href: "/press-releases/psa-10-pikachu-wall-grade10-card-fest",
        },
        {
          date: "22 NOV, 2025",
          title:
            "Hong Kong’s Largest-Ever Card Event, the Grade10 Festival, Opens Today, Featuring 120+ Global Exhibitors and Expecting 23,000 Fans",
          href: "/press-releases/grade10-festival-opened-today",
        },
        {
          date: "12 NOV, 2025",
          title:
            "Mega Event Economy: Hong Kong’s Largest Trading Card Event “Grade10 Festival” Launches This Month, MemeStrategy (HKEX: 2440) Leads the Charge, Teams Up with Global Exhibitors to Help Local Brands Go International",
          href: "/press-releases/grade10-festival-launches-this-month",
        },
      ],
    },
  ] satisfies readonly PressYearGroup[],
};

export type { PressItem, PressYearGroup };
export { PRESS_PAGE };

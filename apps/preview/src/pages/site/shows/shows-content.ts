/**
 * Copy, media and destinations for `/shows`. Layout and structure come from
 * the Grade10-DS-2026 Figma Shows frame (`7180:7423`, desktop only — the
 * small-viewport collapse is derived from the About page's convention).
 * Media hotlinks the live `grade10.com` asset paths rather than fixtures.
 * The body copy has since been tightened after a copywriting review and no
 * longer matches the Figma text verbatim.
 */
import type {
  ShowChapter,
  ShowRecord,
  ShowStat,
  ShowsPageBodyCopy,
  ShowsPageContent,
  UpcomingShow,
} from "@grade10/ui";

const SITE_ORIGIN = "https://grade10.com";

const events = (path: string) => `${SITE_ORIGIN}/events/${path}`;
const photos = (edition: string, photo: string) =>
  `${SITE_ORIGIN}/event-photos/${edition}/${photo}`;

const fest2026Photos = [
  "photo-01.webp",
  "photo-02.webp",
  "photo-03.webp",
  "photo-05.webp",
  "photo-06.webp",
  "photo-07.webp",
  "photo-08.webp",
  "photo-09.webp",
  "photo-10.webp",
  "photo-11.webp",
  "photo-12.webp",
  "photo-14.webp",
  "photo-15.webp",
  "photo-16.webp",
  "photo-17.webp",
].map((p) => photos("grade10-fest-summer-2026", p));

const festival2025Photos = [
  "photo-01.webp",
  "photo-02.webp",
  "photo-03.webp",
  "photo-04.webp",
  "photo-05.webp",
  "photo-06.webp",
].map((p) => photos("grade10-festival-2025", p));

const shanghaiPhotos = [
  "photo-01.webp",
  "photo-02.webp",
  "photo-03.webp",
  "photo-04.webp",
  "photo-05.webp",
  "photo-06.webp",
  "photo-07.webp",
  "photo-08.webp",
].map((p) => photos("cardjoy-shanghai-2026", p));

const hangzhouPhotos = [
  "photo-01.webp",
  "photo-02.webp",
  "photo-03.webp",
  "photo-04.webp",
  "photo-05.webp",
  "photo-06.webp",
].map((p) => photos("cardjoy-hangzhou-2026", p));

const SHOWS_PAGE = {
  hero: {
    eyebrow: "Grade10 Shows",
    heading: "Asia’s card shows, at full scale.",
    intro:
      "Collectors, exhibitors, partners and rare cards — the ecosystem in one room, across Hong Kong, Seoul and the Chinese Mainland.",
    explore: "Explore Shows",
    press: "Press Releases",
    pressHref: "/press-releases",
    upcomingLabel: "Upcoming Shows",
    upcomingShows: [
      {
        month: "August",
        year: "2026",
        title: "Mojo Fest 2026",
        city: "Shanghai",
      },
      {
        month: "September",
        year: "2026",
        title: "CARDJOY × Grade10",
        city: "Guangzhou",
      },
      {
        month: "October",
        year: "2026",
        title: "Card Festa Asia Halloween Edition",
        city: "Hong Kong",
      },
      {
        month: "November",
        year: "2026",
        title: "Seoul Auction × ZZZ Premium Private Sale",
        city: "Seoul",
      },
    ] satisfies readonly UpcomingShow[],
  },
  eventScale: {
    eyebrow: "Event Scale",
    heading: "Real Trends. In the Room.",
    dek: "Grade10’s strongest proof is physical: crowds, exhibitors, repeat activations, and partner participation across Hong Kong, South Korea, Mainland China and beyond.",
    photo: {
      src: photos("grade10-fest-summer-2026", "photo-13.webp"),
      srcSet: `${photos("grade10-fest-summer-2026", "photo-13-thumb.webp")} 720w, ${photos("grade10-fest-summer-2026", "photo-13.webp")} 1800w`,
      alt: "Thousands of collectors packing the Grade10 FEST Summer 2026 ballroom floor.",
    },
    stats: [
      {
        label: "Visitors",
        value: "25,000+",
        detail: "Visitors at Grade10 FEST Summer 2026",
      },
      {
        label: "Exhibitors",
        value: "120+",
        detail: "Exhibitors from around the world",
      },
      {
        label: "Industry Impact",
        value: "Millions",
        detail: "In revenue generated for the industry",
      },
    ] satisfies readonly ShowStat[],
  },
  formats: {
    eyebrow: "Event Formats",
    heading: "Three Platforms. One Community.",
    chapters: [
      {
        id: "hong-kong",
        tab: "Hong Kong",
        label: "Hong Kong",
        title: "Grade10 FEST HK",
        dek: "Asia’s largest card show — five editions and counting.",
        video: {
          poster: photos("grade10-fest-summer-2026", "photo-01.webp"),
          posterAlt: "Grade10 FEST Summer 2026 show floor",
          badge: "Grade10 FEST Summer 2026",
          youtubeId: "Nf4UZyct5uM",
        },
        editions: [
          {
            date: "JUN 2026",
            title: "Grade10 FEST Summer 2026",
            description:
              "A three-day Pokémon 30th Anniversary show at Hopewell Hotel with 25,000+ attendees and 120+ exhibitors.",
            photos: fest2026Photos,
            pressRelease:
              "/press-releases/grade10-fest-summer-2026-concludes-successfully",
          },
          {
            date: "NOV 2025",
            title: "Grade10 Festival 2025",
            description:
              "A record-setting Grade10 Festival anchored by the Van Gogh Pikachu showcase and Hong Kong’s collector community.",
            photos: festival2025Photos,
            pressRelease:
              "/press-releases/psa-10-pikachu-wall-grade10-card-fest",
          },
        ],
      },
      {
        id: "overseas",
        tab: "Overseas",
        label: "Overseas Partnership",
        title: "Seoul Auction × ZZZ",
        dek: "Partnered with Korea’s premium auction house to position cards as fine art in Asia.",
        image: {
          src: events("seoul-auction.webp"),
          alt: "Seoul Auction × Grade10 trading card exhibition floor with the premium Pokémon card wall.",
          caption:
            "The first-ever fine art presentation of trading cards in Asia.",
        },
        pressRelease: "/press-releases/grade10-south-korea-seoul-auction",
        editions: [],
      },
      {
        id: "chinese-mainland",
        tab: "Chinese Mainland",
        label: "Chinese Mainland",
        title: "CARDJOY × Grade10",
        dek: "The largest TCG card show in Mainland China, held across Hangzhou and Shanghai.",
        video: {
          poster: photos("cardjoy-shanghai-2026", "photo-02.webp"),
          posterAlt: "CARDJOY × Grade10 Shanghai show floor",
          badge: "CARDJOY × Grade10 Shanghai",
          youtubeId: "fy7AfZ8ZhQo",
        },
        editions: [
          {
            date: "JUN 2026",
            title: "CARDJOY × Grade10 Shanghai",
            description:
              "An expanded 5,000 sqm Shanghai show with 200+ exhibitors and cross-market collector momentum.",
            photos: shanghaiPhotos,
            pressRelease: "/press-releases/cardjoy-grade10-shanghai-expansion",
          },
          {
            date: "MAR 2026",
            title: "CARDJOY × Grade10 Hangzhou",
            description:
              "The first national CARDJOY x Grade10 show drew 10,000+ visitors and 100+ exhibitors in Hangzhou.",
            photos: hangzhouPhotos,
            pressRelease: "/press-releases/cardjoy-grade10-hangzhou-show",
          },
        ],
      },
    ] satisfies readonly ShowChapter[],
  },
  records: {
    eyebrow: "Event Records",
    heading: "Every Show. A Milestone.",
    items: [
      {
        year: "2026",
        title: "Seoul Auction Private Sale & Exhibition",
        description:
          "Seoul Auction × ZZZ × Grade10 — a trading card exhibition and private sales event hosted by Seoul Auction, ZZZ, and Grade10. The first-ever fine art presentation of trading cards in Asia.",
        image: {
          src: events("seoul-auction.webp"),
          alt: "Trading cards presented as fine art at the Seoul Auction × Grade10 exhibition.",
        },
      },
      {
        year: "2026",
        title: "Grade10 FEST Summer 2026",
        description:
          "A three-day Pokémon 30th Anniversary show at Hopewell Hotel, Wan Chai, drawing 25,000+ attendees and 120+ exhibitors.",
        image: {
          src: events("ev17.webp"),
          alt: "Collectors packing the Hopewell Hotel show floor at Grade10 FEST Summer 2026.",
        },
      },
      {
        year: "2026",
        title: "CARDJOY × Grade10 Shanghai",
        description:
          "Shanghai’s expanded 5,000 sqm edition, run with POKECOLOR and 200+ exhibitors.",
        image: {
          src: events("ev72.webp"),
          alt: "The show floor at CARDJOY × Grade10 Shanghai.",
        },
      },
      {
        year: "2026",
        title: "CARDJOY × Grade10 Hangzhou",
        description:
          "The partnership’s first national edition — 10,000+ visitors and 100+ exhibitors in Hangzhou.",
        image: {
          src: events("ev51.webp"),
          alt: "The show floor at CARDJOY × Grade10 Hangzhou.",
        },
      },
      {
        year: "2025",
        title: "Grade10 Festival 2025",
        description:
          "The platform’s breakout Hong Kong show, led by the Van Gogh Pikachu showcase and 23,000+ visitors.",
        image: {
          src: events("ev60.webp"),
          alt: "The Grade10 Festival 2025 show floor.",
        },
      },
    ] satisfies readonly ShowRecord[],
  },
} satisfies ShowsPageContent;

const SHOWS_COPY: ShowsPageBodyCopy = {
  pressRelease: "Press Release",
  playVideo: (badge) => `Play ${badge} video`,
  videoTitle: (badge) => `${badge} video`,
  photoAlt: (title, position, count) => `${title} — ${position} of ${count}`,
  previousPhoto: (title) => `Previous ${title} photo`,
  nextPhoto: (title) => `Next ${title} photo`,
  photos: (title) => `${title} photos`,
  photo: (title, position) => `${title} photo ${position}`,
};

export { SHOWS_COPY, SHOWS_PAGE };

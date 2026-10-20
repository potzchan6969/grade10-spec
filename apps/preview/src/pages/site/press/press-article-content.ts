/**
 * Copy, media and destinations for the `/press-releases/{slug}` article
 * template. Layout and structure come from the Grade10-DS-2026 Figma frame
 * `7204:10315` (desktop only — the small-viewport collapse derives from the
 * About page's convention). The sample carries the live CARDJOY x Grade10
 * Guangzhou release verbatim — the frame was drafted over it — with media
 * hotlinked from the site's `cdn.sanity.io` assets rather than fixtures.
 * The block model is what an editor composes in the admin portal: the
 * template draws each element's style.
 */
import type {
  ArticleBlock,
  ArticleContact,
  ArticleSidebarCard,
  PressArticleContent,
} from "@grade10/ui";

const SANITY = "https://cdn.sanity.io/images/np3rrxhs/production";

const sanity = (id: string, width: number) =>
  `${SANITY}/${id}?w=${width}&fit=max&auto=format`;

const PRESS_ARTICLE = {
  breadcrumb: {
    back: { label: "Press", href: "/press-releases" },
    current: "Press Release",
  },
  title:
    "MemeStrategy (HKEX: 2440) and POKECOLOR Bring CARDJOY x Grade10 Card Show to the Canton Fair Complex in Guangzhou, China",
  date: "Sep 15, 2026",
  location: "Hong Kong, China",
  featureImage: {
    src: sanity("0a550a54bb4344004b4f661bd994b7c185cbbb0c-611x343.jpg", 1600),
    alt: "The CARDJOY x Grade10 card show at the Canton Fair Complex in Guangzhou.",
  },
  body: [
    {
      type: "paragraph",
      segments: [
        {
          text: "HONG KONG, CHINA, 15 September 2026 ——Grade10, Asia’s premier trading-card venture and a division of MemeStrategy Inc. (HKEX: 2440), and POKECOLOR, a leading trading card enterprise in China, jointly staged the CARDJOY x Grade10 card show in Guangzhou, China. Following successful stops in Hangzhou and Shanghai earlier this year, the show made its Guangzhou debut at the Canton Fair Complex over the weekend of 12-13 September.",
        },
      ],
    },
    {
      type: "paragraph",
      segments: [
        {
          text: "Spanning 100,000 square feet, the Guangzhou event brought together more than 300 exhibitors from around the world. Combining collectible card displays, trading, competitive play, creative exchange and professional services under one roof, welcoming more than 20,000 collectors, players, dealers and creators from the Chinese Mainland, Hong Kong and overseas.",
        },
      ],
    },
    {
      type: "paragraph",
      segments: [
        {
          text: "Guided by the theme “Joy in Collecting, Connecting through Cards”, CARDJOY x Grade10 Guangzhou provided a platform for the card community to share the pleasure of collecting and exchanging knowledge. Event’s highlights included an expanded JOYCon card exhibition, live interactions with accredited card artists, a large-scale Trading Card Game (TCG) tournament zone created in partnership with Kayou, and on-site grading and authentication services provided by leading domestic and international companies.",
        },
      ],
    },
    {
      type: "heading",
      level: 2,
      text: "Collecting, Art, Competition and Authentication Come Together in a Multi-Dimensional Card Experience",
    },
    {
      type: "paragraph",
      segments: [
        {
          text: "The JOYCon exhibition, the largest in the event’s history, showcased nearly 100 rare cards. Beyond rarity and provenance, the exhibits demonstrated the breadth of contemporary card craftsmanship and aesthetics, giving visitors the opportunity to view some of the most exceptional collectibles at close range. Featured highlights included:",
        },
      ],
    },
    {
      type: "list",
      items: [
        [
          {
            text: "1998 Pokémon Illustrator (Japanese CoroCoro Comics Illustration Contest) — CGC Gem Mint 10. ",
            bold: true,
          },
          {
            text: "Originating from a CoroCoro Comics-related illustration contest, the Pokémon Illustrator card is an important record of Pokémon’s early competitive and illustration culture. The CGC Gem Mint 10 example on display combined historical significance with exceptional condition. The card type has repeatedly achieved notable results at major auctions, underscoring its iconic standing among Pokémon collectors worldwide.",
          },
        ],
        [
          {
            text: "2014–15 Panini Flawless Greats Dual Memorabilia Autographs Emerald — Kobe Bryant. ",
            bold: true,
          },
          {
            text: "Limited to just five copies worldwide, this Emerald edition pairs Kobe Bryant’s autograph with two multicolored game-worn jersey patches and is graded BGS MINT 9 with an autograph grade of 10. The combination of game-used memorabilia, low serial numbering and an on-card signature exemplifies the craftsmanship and narrative appeal of premium sports cards.",
          },
        ],
        [
          {
            text: "2016 Panini Flawless Dual Patch Au–Emerald Auto — Kobe Bryant (5/5). ",
            bold: true,
          },
          {
            text: "Serial-numbered 5/5, this Emerald dual-patch autograph edition is likewise limited to five copies worldwide. It features two multicolored patches and is labelled with PSA/DNA certification, a GEM MT 10 card grade and an AUTO 10 signature grade. Its rarity, signature and embedded memorabilia offered attendees a close look at how elite sports cards combine sporting history, craftsmanship and condition standards.",
          },
        ],
      ],
    },
    {
      type: "paragraph",
      segments: [
        {
          text: "In addition to the exhibition, CARDJOY x Grade10 Guangzhou invited two internationally accredited card artists to engage with attendees. KEYUN, the first artist in the Chinese Mainland to receive accreditation by PSA, CGC and BGS, and Karnaa, a CGC-accredited artist, took part in live signing sessions, artwork displays and fan meet-and-greets. Their participation highlighted the creative potential of trading cards as a medium for illustration, character design and visual storytelling. KEYUN also created a dedicated promotional film for the Guangzhou event, combining an Ukiyo-e-inspired visual approach with Pokémon and iconic local landmarks, including Canton Tower and the Sacred Heart Cathedral.",
        },
      ],
    },
    {
      type: "paragraph",
      segments: [
        {
          text: "On the competitive side, the event partnered with Kayou to establish a large-scale TCG tournament zone, hosting a series of official tournaments across the two days that enabled players to compete and connect in person. Leading grading organizations from the Chinese Mainland and overseas also provided dedicated on-site services, addressing collectors’ needs in authentication, grading and collection management. Complemented by a free trading area for players, the event offered an integrated experience spanning exhibition, competition, exchange and trading.",
        },
      ],
    },
    {
      type: "quote",
      segments: [
        {
          text: "From Hangzhou to Shanghai and now Guangzhou, we have witnessed not only growing exhibitors and attendance numbers, but also strong demand from the card community for high-quality, in-person experiences and connection. CARDJOY aims to bring collecting, trading, competition, creativity and professional services together on one open platform, where every participant can engage in their own way. Our partnership with Grade10 further expands access to a broader network of industry resources in China and around the world, enabling us to continue advancing card culture and the wider industry ecosystem in a more professional and diversified direction.",
        },
      ],
      cite: { name: "Hanru Tang", role: "Founder of POKECOLOR and CARDJOY" },
    },
    {
      type: "quote",
      segments: [
        {
          text: "The success of CARDJOY x Grade10 Guangzhou underscores the rapid growth of the collectible card market in the Chinese Mainland and reflects the increasing important role of cards as a bridge connecting IP culture, artistic creation and offline communities. Grade10 will continue to deepen its collaboration with POKECOLOR, leveraging its network across Hong Kong, the Chinese Mainland, and overseas markets to create more professional and globally connected platforms for collectors, creators, dealers and players. Together, we will further establish CARDJOY x Grade10 as a flagship card event with growing international influence.",
        },
      ],
      cite: {
        name: "Ray Chan",
        role: "Chief Executive Officer of MemeStrategy and Grade10",
      },
    },
    {
      type: "heading",
      level: 2,
      text: "China’s Collectible Card Market Continues to Expand, Supporting Demand for Events and Professional Services",
    },
    {
      type: "paragraph",
      segments: [
        {
          text: "The continued expansion of China’s collectible card market is driving demand for physical card shows and related professional services. According to a China Insights Consultancy report, China’s trading card industry grew from RMB2.8 billion in gross merchandise value (GMV) in 2019 to RMB26.3 billion in 2024, representing a compound annual growth rate of 56.6%. The market is projected to reach RMB44.6 billion by 2029.",
        },
      ],
    },
    {
      type: "paragraph",
      segments: [
        {
          text: "Cards sit at the interaction of collecting, gaming, art and social engagement. As IP-driven content, creative expression, offline tournaments, authentication and grading, and secondary-market services become increasingly sophisticated, market participants are placing greater value on trusted in-person environments and professional services.",
        },
      ],
    },
    {
      type: "paragraph",
      segments: [
        {
          text: "Since the beginning of the year, the CARDJOY x Grade10 tour has expanded from Hangzhou to Shanghai and now Guangzhou, with both its scale and programme continuing to evolve. This progression reflects the vitality of China’s collectible card market and player community. Card shows are no longer simply venues for buying and selling cards. They are increasingly serving as hubs where enthusiasts gather, collections are displayed, creators gain exposure, competitive play takes place, professional services are accessed, and cross-regional exchange is fostered.",
        },
      ],
    },
    {
      type: "paragraph",
      segments: [
        {
          text: "Looking ahead, CARDJOY and Grade10 will continue to connect card communities across China and international markets through high-quality events, building increasingly open, professional and globally minded platforms for collectors, players, dealers and creators.",
        },
      ],
    },
    {
      type: "heading",
      level: 2,
      text: "CARDJOY x Grade10 Guangzhou Card Show: Photo Highlights",
    },
    {
      type: "gallery",
      figures: [
        {
          span: "full",
          src: sanity(
            "a27f1f043225cd01f870a64c56d46dcd8335bcd3-611x458.jpg",
            1600,
          ),
          alt: "The packed CARDJOY x Grade10 Guangzhou show floor.",
          caption:
            "The CARDJOY x Grade10 Guangzhou Card Show expanded to a 100,000-square-feet venue, bringing together more than 300 exhibitors from around the world, attracting over 20,000 attendees.",
        },
        {
          span: "half",
          src: sanity(
            "1a08984fb2cdaaf4afd5530186fc3848330bcada-611x407.jpg",
            800,
          ),
          alt: "Rare cards on display at the JOYCon exhibition zone.",
          caption:
            "The JOYCon exhibition zone was the largest in CARDJOY x Grade10 history, showcasing nearly 100 rare cards and allowing attendees to view exceptional Pokémon and sports cards up close.",
        },
        {
          span: "half",
          src: sanity(
            "f9befa8c2fdac033f0bb82d85097b0cd3fc6ebfd-621x413.jpg",
            800,
          ),
          alt: "The 1998 Pokémon Illustrator card at the JOYCon exhibition.",
          caption:
            "Highlights of the JOYCon exhibition zone included the 1998 Pokémon Illustrator (CGC Gem Mint 10), a legendary Pokémon card originating from Japan’s CoroCoro Comics illustration contest, combining top-grade condition with historical significance.",
        },
      ],
    },
  ] satisfies readonly ArticleBlock[],
  sidebar: {
    cards: [
      {
        title: "About Grade10",
        body: "Grade10 is Asia’s premier trading card venture, backed by MemeStrategy (HKEX: 2440) and founded by the visionary team behind 9GAG, a global platform with over 200 million users. Since 2023, Grade10 has hosted Hong Kong’s largest card shows, provided professional vaulting services, and empowered collectors with its proprietary Grade10 AI tool for real-time pricing and research.",
      },
      {
        title: "About MemeStrategy",
        body: "MemeStrategy, Inc. (HKEX: 2440) is a pioneer in the cultural collectibles and intellectual property (IP) sector in Asia. Founded by the team behind 9GAG, the Company possesses over 18 years of experience in shaping internet culture and social media.",
      },
    ] satisfies readonly ArticleSidebarCard[],
    enquiries: {
      title: "Media Enquiries",
      contacts: [
        {
          name: "Eva Lee",
          link: {
            href: "mailto:media@memestrategy.com",
            label: "media@memestrategy.com",
          },
        },
      ] satisfies readonly ArticleContact[],
    },
  },
} satisfies PressArticleContent;

export { PRESS_ARTICLE };

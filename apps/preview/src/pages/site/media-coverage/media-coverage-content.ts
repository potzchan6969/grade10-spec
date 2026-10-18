/**
 * Copy and destinations for `/media-coverage`. Layout and structure come
 * from the Grade10-DS-2026 Figma frame (`7204:11244`); the grid carries
 * the live grade10.com media coverage verbatim — the frame's cards are
 * placeholder references. An entry is what an editor composes in the
 * admin portal: the publication, the title and the link — no date.
 */

/** One media card: the story's publication, title and external link. */
type MediaItem = {
  readonly publication: string;
  readonly title: string;
  readonly href: string;
};

const MEDIA_COVERAGE_PAGE = {
  eyebrow: "In the News",
  heading: "Media Coverage",
  intro:
    "External reporting and feature coverage across Grade10 events, collectible markets, vaulting, finance, and the wider trading card ecosystem.",
  items: [
    {
      publication: "Associated Press",
      title: "Collectors of rare Pokemon Cards gather for ‘Grade10 Fest’ fair",
      href: "https://www.yahoo.com/news/videos/collectors-rare-pok-mon-cards-074614805.html",
    },
    {
      publication: "Bloomberg",
      title: "Pokemon's multibillion-dollar card boom sparks a crime wave",
      href: "https://www.bloomberg.com/news/articles/2026-04-24/pokemon-card-boom-sparks-a-crime-wave-as-values-soar",
    },
    {
      publication: "Financial Times",
      title:
        "Pokemon's 30th Anniversary: MemeStrategy launches world's first tokenized collectible card fund",
      href: "https://markets.ft.com/data/announce/detail?dockey=600-202603020330DGAP____ASPR_____corporate_2283694_en-1",
    },
    {
      publication: "Tatler",
      title:
        "From collectible to investable: the rise of Pokemon trading cards as Asia's newest asset class",
      href: "https://www.tatlerasia.com/power-purpose/wealth/pokemon-trading-cards-asia",
    },
    {
      publication: "The Standard",
      title: "Trading Card Games: the next asset class emerging in Hong Kong",
      href: "https://www.thestandard.com.hk/the-standard-stands/article/323772/Trading-Card-Games-the-next-asset-class-emerging-in-Hong-Kong",
    },
    {
      publication: "The Canadian Press News",
      title: "Collectors of rare Pokemon Cards gather for ‘Grade10 Fest’ fair",
      href: "https://www.thecanadianpressnews.ca/collectors-of-rare-pok-mon-cards-gather-for-grade-10-fest-fair/video_b007a260-3043-52a0-87ab-ab8862a68f78.html",
    },
    {
      publication: "Hong Kong Economic Times",
      title: "微朝聖專欄｜「爆卡」親子活動應成為旅發局推廣重點",
      href: "https://topick.hket.com/article/4152648/",
    },
    {
      publication: "am730",
      title: "Grade10 FEST如何用潮流文化IP激活香港經濟",
      href: "https://www.am730.com.hk/column/%E7%94%9F%E6%B4%BB/2007116/grade10-fest%E5%A6%82%E4%BD%95%E7%94%A8%E6%BD%AE%E6%B5%81%E6%96%87%E5%8C%96ip%E6%BF%80%E6%B4%BB%E9%A6%99%E6%B8%AF%E7%B6%93%E6%BF%9F",
    },
    {
      publication: "Hong Kong Economic Times",
      title:
        "迷策略預告第四季推收藏卡融資服務Grade10 Finance 首階段涵蓋寶可夢卡、海賊王卡等",
      href: "https://inews.hket.com/article/4148663/%25E3%2580%25902440%25E3%2580%2591%25E8%25BF%25B7%25E7%25AD%2596%25E7%2595%25A5%25E9%25A0%2590%25E5%2591%258A%25E7%25AC%25AC%25E5%259B%259B%25E5%25AD%25A3%25E6%258E%25A8%25E6%2594%25B6%25E8%2597%258F%25E5%258D%25A1%25E8%259E%258D%25E8%25B3%2587%25E6%259C%258D%25E5%258B%2599Grade10%2520Finance%25E3%2580%2580%25E9%25A6%2596%25E9%259A%258E%25E6%25AE%25B5%25E6%25B6%25B5%25E8%2593%258B%25E5%25AF%25B6%25E5%258F%25AF%25E5%25A4%25A2%25E5%258D%25A1%25E3%2580%2581%25E6%25B5%25B7%25E8%25B3%258A%25E7%258E%258B%25E5%258D%25A1%25E7%25AD%2589",
    },
    {
      publication: "Hong Kong Economic Journal",
      title: "迷策略亞洲首創 末季推藏卡融資",
      href: "https://www1.hkej.com/dailynews/finnews/article/4435396/迷策略亞洲首創++末季推藏卡融資",
    },
    {
      publication: "The Standard",
      title:
        "MemeStrategy's tokenized Pokemon card fund oversubscribed at initial issuance",
      href: "https://www.thestandard.com.hk/finance/article/331686/",
    },
    {
      publication: "Marketing Interactive",
      title: "Memestrategy and TVB launch Themis collectible cards",
      href: "https://www.marketing-interactive.com/memestrategy-and-tvb-launch-themis-collectible-cards",
    },
    {
      publication: "The Standard",
      title:
        "MemeStrategy establishes strategic partnership with China's industry leader PokeColor",
      href: "https://www.thestandard.com.hk/finance/article/330687/MemeStrategy-establishes-strategic-partnership-with-Chinas-industry-leader-PokeColor",
    },
    {
      publication: "MingPao",
      title:
        "迷策略伙內地卡樂舉辦中國首屆遊戲卡展「CARDJOY x Grade10」 吸過萬卡迷入場",
      href: "https://finance.mingpao.com/fin/instantf/20260324/1774329912801/%E8%BF%B7%E7%AD%96%E7%95%A5%E4%BC%99%E5%85%A7%E5%9C%B0%E5%8D%A1%E6%A8%82%E8%88%89%E8%BE%A6%E4%B8%AD%E5%9C%8B%E9%A6%96%E5%B1%86%E9%81%8A%E6%88%B2%E5%8D%A1%E5%B1%95%E3%80%8Ccardjoy-x-grade10%E3%80%8D-%E5%90%B8%E9%81%8E%E8%90%AC%E5%8D%A1%E8%BF%B7%E5%85%A5%E5%A0%B4",
    },
    {
      publication: "SingTao Daily",
      title:
        "馬年奇葩︱史上最貴寶可夢卡逾1.28億天價成交 刷新健力士世界紀錄 香港「迷策略」團隊見證",
      href: "https://www.stheadline.com/society/3545362/%E9%A6%AC%E5%B9%B4%E5%A5%87%E8%91%A9%E5%8F%B2%E4%B8%8A%E6%9C%80%E8%B2%B4%E5%AF%B6%E5%8F%AF%E5%A4%A2%E5%8D%A1%E9%80%BE128%E5%84%84%E5%A4%A9%E5%83%B9%E6%88%90%E4%BA%A4-%E5%88%B7%E6%96%B0%E5%81%A5%E5%8A%9B%E5%A3%AB%E4%B8%96%E7%95%8C%E7%B4%80%E9%8C%84-%E9%A6%99%E6%B8%AF%E8%BF%B7%E7%AD%96%E7%95%A5%E5%9C%98%E9%9A%8A%E8%A6%8B%E8%AD%89",
    },
  ] satisfies readonly MediaItem[],
};

export type { MediaItem };
export { MEDIA_COVERAGE_PAGE };

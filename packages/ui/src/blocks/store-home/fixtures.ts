import type { StoreCollectionSummary } from "./types";

const COLLECTIONS: StoreCollectionSummary[] = [
  {
    id: "pokemon",
    label: "Pokémon",
    icon: "🐭",
    href: "#pokemon",
    featured: true,
  },
  { id: "dragon-ball", label: "Dragon Ball", icon: "🐉", href: "#dragon-ball" },
  { id: "one-piece", label: "One Piece", icon: "🏴‍☠️", href: "#one-piece" },
  { id: "nba", label: "NBA", icon: "🏀", href: "#nba" },
  { id: "disney", label: "Disney", icon: "🏰", href: "#disney" },
  { id: "mlb", label: "MLB", icon: "⚾", href: "#mlb" },
  { id: "formula-1", label: "Formula 1", icon: "🏎️", href: "#formula-1" },
];

export { COLLECTIONS };

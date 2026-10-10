import type { ValuationSource } from "./vault-content";

function valuationLabel(source: ValuationSource): string {
  switch (source) {
    case "Declared":
      return "Declared value";
    case "Intake estimate":
      return "Intake estimate";
    case "Market":
      return "Market estimate";
  }
}

export { valuationLabel };

import { useParams } from "react-router";
import { pagePath } from "../api/paths";
import { useManualIndex } from "../api/use-manual-index";
import { PageView } from "./page-view";

export function GuidePage() {
  const { slug = "" } = useParams();
  const index = useManualIndex();
  return (
    <PageView
      eyebrow="Guide"
      index={index}
      path={pagePath(index.manualDir, "guides", `${slug}.md`)}
    />
  );
}

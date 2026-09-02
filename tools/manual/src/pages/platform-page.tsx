import { useParams } from "react-router";
import { pagePath } from "../api/paths";
import { useManualIndex } from "../api/use-manual-index";
import { PageView } from "./page-view";

export function PlatformPage() {
  const { topic = "" } = useParams();
  const index = useManualIndex();
  return (
    <PageView
      eyebrow="Platform"
      index={index}
      path={pagePath(index.manualDir, "platform", `${topic}.md`)}
    />
  );
}

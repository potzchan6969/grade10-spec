import { useParams } from "react-router";
import { MANUAL_ROOT } from "../api/paths";
import { useManualIndex } from "../api/use-manual-index";
import { PageView } from "./page-view";

export function GuidePage() {
  const { slug = "" } = useParams();
  return (
    <PageView
      eyebrow="Guide"
      index={useManualIndex()}
      path={`${MANUAL_ROOT}/guides/${slug}.md`}
    />
  );
}

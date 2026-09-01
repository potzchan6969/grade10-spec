import { useParams } from "react-router";
import { MANUAL_ROOT } from "../api/paths";
import { useManualIndex } from "../api/use-manual-index";
import { PageView } from "./page-view";

export function PlatformPage() {
  const { topic = "" } = useParams();
  return (
    <PageView
      eyebrow="Platform"
      index={useManualIndex()}
      path={`${MANUAL_ROOT}/platform/${topic}.md`}
    />
  );
}

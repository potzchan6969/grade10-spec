import type { Block, BodyItem } from "../content/grammar";
import { CalloutBlockView } from "./callout-block";
import { CasesBlockView } from "./cases-block";
import { ChangesBlockView } from "./changes-block";
import { ChildrenBlockView } from "./children-block";
import { DetailBlockView } from "./detail-block";
import { FigmaBlockView, StoryBlockView } from "./embed-block";
import { ExampleBlockView } from "./example-block";
import { FlowBlockView } from "./flow-block";
import { ImageBlockView } from "./image-block";
import { NextBlockView } from "./next-block";
import { ProseBlockView } from "./prose-block";
import { SpecBlockView } from "./spec-block";

/** One block, one component. The grammar's union is the whole registry. */
export function BlockView({ block }: { block: Block | BodyItem }) {
  switch (block.type) {
    case "prose":
      return <ProseBlockView block={block} />;
    case "spec":
      return <SpecBlockView block={block} />;
    case "cases":
      return <CasesBlockView block={block} />;
    case "changes":
      return <ChangesBlockView block={block} />;
    case "next":
      return <NextBlockView block={block} />;
    case "figma":
      return <FigmaBlockView block={block} />;
    case "story":
      return <StoryBlockView block={block} />;
    case "image":
      return <ImageBlockView block={block} />;
    case "children":
      return <ChildrenBlockView />;
    case "callout":
      return <CalloutBlockView block={block} />;
    case "detail":
      return <DetailBlockView block={block} />;
    case "flow":
      return <FlowBlockView block={block} />;
    case "example":
      return <ExampleBlockView block={block} />;
  }
}

import { Badge } from "@grade10/design-system/components/display/badge";
import { EmptyState } from "@grade10/design-system/components/display/empty-state";
import { Text } from "@grade10/design-system/components/display/text";
import { SegmentedControl } from "@grade10/design-system/components/forms/segmented-control";
import { SegmentedControlItem } from "@grade10/design-system/components/forms/segmented-control-item";
import {
  ArrowSquareOut,
  Blueprint,
  CaretRight,
  CheckSquare,
  FileText,
  Gavel,
  type Icon,
  Layout,
  Lightbulb,
  ListChecks,
  Path,
  TestTube,
} from "@phosphor-icons/react";
import { type ReactNode, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { requirementAnchor, scenarioAnchor } from "../api/anchors";
import {
  artifactLabel,
  artifactMeaning,
  missingArtifacts,
  presentArtifacts,
  resolveTab,
  tabForHash,
} from "../api/change-artifacts";
import { blockBody, durableBlock } from "../api/delta-text";
import { type ManualIndex, taskTotals } from "../api/derive";
import { dirOf, GITHUB_BLOB, slugify } from "../api/paths";
import { findRequirement } from "../api/requirements";
import { relativeTime } from "../api/time";
import type {
  ChangeArtifact,
  ChangeDeltaDocument,
  ChangeDocument,
  ChangeEntry,
  CommitInfo,
  DeltaSection,
  Requirement,
  SpecEntry,
} from "../api/types";
import { AnchorLink, useHashTarget } from "./anchor";
import { BlockScopeProvider } from "./block-scope";
import { BrokenCard } from "./broken-card";
import { SuiteView } from "./cases-block";
import { TaskGroupView } from "./change-detail";
import { Cites } from "./change-facts";
import { DeltaKinds, DeltaSpec, deltaTone, TaskProgress } from "./change-views";
import { CopyableCommand } from "./copyable-command";
import { BlockDiff } from "./delta-view";
import { MarkdownView } from "./markdown";
import { ScenarioView } from "./scenario-view";
import { JourneyCard } from "./spec-block";

/**
 * A change read as the files it is made of. The schema a change was created
 * under says which artifacts it has and in what order they are written; each
 * one that exists is a tab, and the rest are listed under the rail. The tabs
 * are the change's own files — two changes in one store can sit on different
 * schemas, so no tab is guaranteed to be there.
 */

const ICONS: Record<string, Icon> = {
  proposal: Lightbulb,
  decisions: Gavel,
  specs: ListChecks,
  "user-journeys": Path,
  "test-cases": TestTube,
  "ui-design": Layout,
  "tech-design": Blueprint,
  tasks: CheckSquare,
};

function ArtifactIcon({ name }: { name: string }) {
  const Glyph = ICONS[name] ?? FileText;
  return <Glyph aria-hidden size={16} />;
}

/** What a rail row can say about its file before it is opened: how many deltas
 * the requirements carry, how far the plan has come. */
function artifactCount(
  artifact: ChangeArtifact,
  change: ChangeEntry,
  document: ChangeDocument,
): string | null {
  if (artifact.kind === "specs")
    return document.deltas.length > 0 ? String(document.deltas.length) : null;
  if (artifact.kind === "journeys") {
    const stories = document.deltas.reduce(
      (sum, delta) => sum + (delta.journeys?.length ?? 0),
      0,
    );
    return stories > 0 ? String(stories) : null;
  }
  if (artifact.kind === "cases") {
    const cases = document.deltas.reduce(
      (sum, delta) => sum + (delta.suite?.cases.length ?? 0),
      0,
    );
    return cases > 0 ? String(cases) : null;
  }
  if (artifact.kind === "tasks") {
    const { done, total } = taskTotals(change);
    return total > 0 ? `${done}/${total}` : null;
  }
  return null;
}

function fileName(artifact: ChangeArtifact): string {
  if (artifact.path) return artifact.path.split("/").pop() as string;
  // The per-capability artifacts have no one path — they are a file apiece
  // beside every delta — so they are named by the file, not the directory.
  if (artifact.kind === "journeys") return "user-journeys.md";
  if (artifact.kind === "cases") return "feature-tcs.md";
  return `${artifact.name}/`;
}

/** A rail row, sized by the list so it fits a wrapping row as well as a
 * column. Plain markup, not the shared `Tabs` primitive: Figma's Tab List
 * only draws horizontal, so this rail owns its own button and active state
 * instead of bending a component whose contract is horizontal-only. */
const RAIL_ROW =
  "flex h-auto max-w-full flex-none cursor-pointer items-center justify-start gap-2 rounded-(--radius-lg) border border-transparent px-2.5 py-1.5 text-left text-foreground text-sm transition-colors duration-150 ease-out hover:bg-background-subtle focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 data-active:bg-muted data-active:font-medium dark:data-active:bg-muted [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4";

/**
 * One tab per file the change has, in writing order — a rail beside the panel,
 * because seven labels with their counts do not fit a row. What the schema
 * asks for and nobody has written is listed under the rail instead: a tab onto
 * a file that is not there is a dead end. The open tab lives in the URL, so a
 * link carries the file it was written about; a hash naming a permanent id
 * opens the requirements, whatever tab the link was copied from.
 */
export function ChangeTabs({
  change,
  document,
  index,
}: {
  change: ChangeEntry;
  document: ChangeDocument;
  index: ManualIndex;
}) {
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();
  const present = presentArtifacts(document);
  const wanted =
    tabForHash(document, hash) ?? new URLSearchParams(search).get("tab");
  const active = resolveTab(document, wanted);

  if (present.length === 0 || active === null) {
    return (
      <div className="my-5 space-y-3">
        <EmptyState
          compact
          description={`No markdown in ${document.dir}. A change starts as an empty directory and its schema says what goes in it.`}
          icon={<FileText aria-hidden />}
          title="Nothing written yet"
        />
        <ArtifactNotes document={document} />
      </div>
    );
  }

  // `resolveTab` only ever returns a name `present` carries, or null — and
  // null is handled above.
  const activeArtifact = present.find((artifact) => artifact.name === active);
  if (!activeArtifact) return null;

  const selectTab = (value: string) => {
    // The hash names a row in the tab being left; carrying it along would
    // pull the reader straight back.
    navigate(
      { pathname, search: `?tab=${value}`, hash: "" },
      { replace: true },
    );
  };

  return (
    <div className="mt-6 mb-5 grid grid-cols-1 gap-2 border-border-subtle border-t pt-6 lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-8">
      <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
        <div
          aria-label="Artifacts of this change"
          className="flex w-full min-w-0 flex-row flex-wrap items-stretch justify-start gap-1 lg:flex-col"
          role="tablist"
        >
          {present.map((artifact) => (
            <button
              aria-controls={`${artifact.name}-panel`}
              aria-selected={artifact.name === active}
              className={RAIL_ROW}
              data-active={artifact.name === active ? "" : undefined}
              id={`${artifact.name}-tab`}
              key={artifact.name}
              onClick={() => selectTab(artifact.name)}
              role="tab"
              title={artifactMeaning(artifact.name)}
              type="button"
            >
              <ArtifactIcon name={artifact.name} />
              <span
                className="min-w-0 flex-1 truncate text-left"
                title={artifactLabel(artifact.name)}
              >
                {artifactLabel(artifact.name)}
              </span>
              <TabCount text={artifactCount(artifact, change, document)} />
            </button>
          ))}
        </div>
        <ArtifactNotes document={document} />
      </div>
      <div
        aria-labelledby={`${activeArtifact.name}-tab`}
        className="min-w-0"
        id={`${activeArtifact.name}-panel`}
        role="tabpanel"
      >
        <PanelHeading artifact={activeArtifact} document={document} />
        <ArtifactPanel
          artifact={activeArtifact}
          change={change}
          document={document}
          index={index}
        />
      </div>
    </div>
  );
}

function TabCount({ text }: { text: string | null }) {
  if (text === null) return null;
  return (
    <span className="shrink-0 rounded-full bg-muted px-1.5 py-px font-mono text-[11px] text-secondary-foreground tabular-nums">
      {text}
    </span>
  );
}

/** What the rail cannot say on its own: which files the schema still asks for,
 * and — when the schema is one the store does not define — why it cannot say. */
function ArtifactNotes({ document }: { document: ChangeDocument }) {
  const missing = missingArtifacts(document);

  return (
    <>
      {missing.length > 0 ? (
        <div className="mt-5">
          <Text as="p" className="mb-1.5" size="xs" tone="secondary">
            Still to write
          </Text>
          <ul className="space-y-1">
            {missing.map((artifact) => (
              <li key={artifact.name}>
                <Text as="span" size="xs" tone="secondary">
                  {`${artifactLabel(artifact.name)} · ${fileName(artifact)}`}
                </Text>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {document.schemaKnown ? null : (
        <Text as="p" className="mt-5" size="xs" tone="secondary">
          {document.schema === ""
            ? "The change names no schema in its `.openspec.yaml`"
            : `Schema \`${document.schema}\` is not one this store defines`}
          , so nothing here can say what is still to write. The files it has are
          listed in the usual order.
        </Text>
      )}
    </>
  );
}

/** What the panel is, what it is for, and which file it reads. */
function PanelHeading({
  artifact,
  document,
}: {
  artifact: ChangeArtifact;
  document: ChangeDocument;
}) {
  const meaning = artifactMeaning(artifact.name);

  return (
    <header className="mb-4 flex flex-wrap items-start justify-between gap-x-4 gap-y-1 border-border-subtle border-b pb-3">
      <div className="min-w-0">
        <h2 className="font-heading font-semibold text-lg">
          {artifactLabel(artifact.name)}
        </h2>
        {meaning ? (
          <Text as="p" className="mt-1" size="sm" tone="secondary">
            {meaning}
          </Text>
        ) : null}
      </div>
      {artifact.path ? (
        <div className="[&>div]:mb-0">
          <FileMeta
            commit={artifact.lastCommit}
            label={relativeTo(document.dir, artifact.path)}
            path={artifact.path}
          />
        </div>
      ) : null}
    </header>
  );
}

function ArtifactPanel({
  artifact,
  change,
  document,
  index,
}: {
  artifact: ChangeArtifact;
  change: ChangeEntry;
  document: ChangeDocument;
  index: ManualIndex;
}) {
  if (artifact.kind === "specs") {
    return <RequirementsPanel document={document} index={index} />;
  }
  if (artifact.kind === "journeys") {
    return <JourneysPanel document={document} index={index} />;
  }
  if (artifact.kind === "cases") {
    return <CasesPanel change={change} document={document} index={index} />;
  }
  if (artifact.kind === "tasks") {
    return <TasksPanel change={change} />;
  }
  return (
    <DocPanel
      artifact={artifact}
      change={change}
      document={document}
      index={index}
    />
  );
}

/** The change directory is already in the page's header; a file under it is
 * read by the part that is not. */
function relativeTo(dir: string, path: string): string {
  return path.startsWith(`${dir}/`) ? path.slice(dir.length + 1) : path;
}

/** Where a file lives in the store, and when it last changed. `label` names it
 * shorter than the href does; `path` still says where the href goes. */
export function FileMeta({
  path,
  commit,
  label,
}: {
  path: string;
  commit?: CommitInfo;
  label?: string;
}) {
  return (
    <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1">
      <a
        className="inline-flex items-center gap-1 font-mono text-secondary-foreground text-xs hover:text-foreground"
        href={`${GITHUB_BLOB}/${path}`}
        rel="noreferrer noopener"
        target="_blank"
        title={label ? path : undefined}
      >
        {label ?? path}
        <ArrowSquareOut aria-hidden size={12} />
      </a>
      {commit ? (
        <Text as="span" size="xs" tone="secondary">
          <span className="font-mono">{commit.sha.slice(0, 8)}</span> ·{" "}
          {relativeTime(commit.date)}
        </Text>
      ) : null}
    </div>
  );
}

/** A prose artifact as written. The file's own `# ` title goes: the panel
 * already wears the artifact's label, and a design that opens `# Design` under
 * a heading called Tech Design says nothing twice. The proposal ends with what
 * it was written about, which is a fact about the proposal and nothing else. */
function DocPanel({
  artifact,
  change,
  document,
  index,
}: {
  artifact: ChangeArtifact;
  change: ChangeEntry;
  document: ChangeDocument;
  index: ManualIndex;
}) {
  const cites = artifact.name === "proposal" ? (change.cites ?? []) : [];

  return (
    <section>
      <MarkdownView
        anchorPrefix={artifact.name}
        anchors
        baseDir={document.dir}
        index={index}
        text={withoutLeadingTitle(artifact.text ?? "")}
      />
      {cites.length > 0 ? <Cites cites={cites} index={index} /> : null}
    </section>
  );
}

export function withoutLeadingTitle(text: string): string {
  const lines = text.split("\n");
  const first = lines.findIndex((line) => line.trim() !== "");
  if (first === -1 || !/^#\s+\S/.test(lines[first])) return text;
  return lines.slice(first + 1).join("\n");
}

/** The plan, group by group: who claimed it, which box is open. */
function TasksPanel({ change }: { change: ChangeEntry }) {
  const { done, total } = taskTotals(change);

  return (
    <section>
      {change.taskGroups.length === 0 ? (
        <Text as="p" size="sm" tone="secondary">
          {
            "The task list names no group yet — a group is a `## <n>. <title>` heading with checkboxes under it."
          }
        </Text>
      ) : (
        <div className="space-y-4">
          {change.taskGroups.map((group) => (
            <div
              className="rounded-(--radius-xl) border border-border-subtle bg-background-subtle p-3"
              key={`${group.repo}/${group.title}`}
            >
              <TaskGroupView group={group} />
            </div>
          ))}
          {change.taskGroups.length > 1 ? (
            <TaskProgress done={done} label="All tasks" total={total} />
          ) : null}
        </div>
      )}
    </section>
  );
}

/** Three ways to read a delta: as the contract it proposes, as the file it
 * is, or as the test plan QA wrote against it. */
type Reading = "contract" | "full";

const READINGS: { value: Reading; label: string; title: string }[] = [
  {
    value: "contract",
    label: "Contract",
    title:
      "Purpose, feature set and requirements, as the durable spec will read them",
  },
  { value: "full", label: "Full", title: "The delta file as written" },
];

function RequirementsPanel({
  document,
  index,
}: {
  document: ChangeDocument;
  index: ManualIndex;
}) {
  const [reading, setReading] = useState<Reading>("contract");

  if (document.deltas.length === 0) {
    return (
      <Text as="p" size="sm" tone="secondary">
        This change has no spec deltas.
      </Text>
    );
  }

  return (
    <BlockScopeProvider value={{ index, pagePath: document.dir }}>
      <div className="mb-4 flex justify-end">
        <SegmentedControl
          aria-label="How to read the deltas"
          onValueChange={(values) => {
            const next = values[0];
            if (READINGS.some((one) => one.value === next))
              setReading(next as Reading);
          }}
          size="sm"
          value={[reading]}
        >
          {READINGS.map((one) => (
            <SegmentedControlItem
              key={one.value}
              title={one.title}
              value={one.value}
            >
              {one.label}
            </SegmentedControlItem>
          ))}
        </SegmentedControl>
      </div>
      <div className="space-y-6">
        {document.deltas.map((delta) => (
          <DeltaCard
            delta={delta}
            dir={document.dir}
            index={index}
            key={delta.spec}
            reading={reading}
          />
        ))}
      </div>
    </BlockScopeProvider>
  );
}

/**
 * The stories each capability's `user-journeys.md` issues, capability by
 * capability. Its own tab because it is its own file: the requirements say
 * what the system does, and this says who walks it.
 */
function JourneysPanel({
  document,
  index,
}: {
  document: ChangeDocument;
  index: ManualIndex;
}) {
  const written = document.deltas.filter(
    (delta) => (delta.journeys?.length ?? 0) > 0 || delta.journeysError,
  );
  if (written.length === 0) {
    return (
      <Text as="p" size="sm" tone="secondary">
        No capability in this change carries user journeys.
      </Text>
    );
  }
  return (
    <BlockScopeProvider value={{ index, pagePath: document.dir }}>
      <div className="space-y-6">
        {written.map((delta) => (
          <CapabilitySection delta={delta} key={delta.spec}>
            {delta.journeysError ? (
              <BrokenCard
                error={delta.journeysError}
                what={`Journeys for ${delta.spec}`}
              />
            ) : (
              <div className="space-y-3">
                {(delta.journeys ?? []).map((journey) => (
                  <JourneyCard
                    journey={journey}
                    key={journey.id}
                    spec={deltaAsSpec(delta)}
                  />
                ))}
              </div>
            )}
          </CapabilitySection>
        ))}
      </div>
    </BlockScopeProvider>
  );
}

/** QA's suites, capability by capability, each traced to the scenarios the
 * delta beside it issues. */
function CasesPanel({
  change,
  document,
  index,
}: {
  change: ChangeEntry;
  document: ChangeDocument;
  index: ManualIndex;
}) {
  if (document.deltas.length === 0) {
    return (
      <Text as="p" size="sm" tone="secondary">
        This change has no spec deltas, so there is nothing to derive cases
        from.
      </Text>
    );
  }
  return (
    <BlockScopeProvider value={{ index, pagePath: document.dir }}>
      <div className="space-y-6">
        {document.deltas.map((delta) => (
          <CapabilitySection delta={delta} key={delta.spec}>
            <DeltaTestPlan change={change} delta={delta} />
          </CapabilitySection>
        ))}
      </div>
    </BlockScopeProvider>
  );
}

/** One capability's card on a per-capability tab: which spec it is about,
 * where the file lives, and whatever that tab reads out of it. */
function CapabilitySection({
  delta,
  children,
}: {
  delta: ChangeDeltaDocument;
  children: ReactNode;
}) {
  const slug = slugify(delta.spec);
  return (
    <section
      aria-labelledby={`${slug}-title`}
      className="overflow-hidden rounded-(--radius-2xl) border border-border bg-card"
    >
      <header className="border-border-subtle border-b bg-background-subtle px-4 py-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h2
            className="font-heading font-semibold text-base"
            id={`${slug}-title`}
          >
            {delta.title ?? delta.spec}
          </h2>
          <DeltaSpec spec={delta.spec} />
        </div>
      </header>
      <div className="px-4 py-4">{children}</div>
    </section>
  );
}

/** A delta's requirements, with the scenarios they carry. */
function deltaRequirements(delta: ChangeDeltaDocument): Requirement[] {
  return delta.sections.flatMap((section) => section.requirements);
}

/** The delta read as the spec it will become — what the journey cards and
 * the suite resolve their scenario ids against. A delta's suite traces the
 * delta's scenarios, so the durable rows stay out of it. */
function deltaAsSpec(delta: ChangeDeltaDocument): SpecEntry {
  return {
    id: delta.spec,
    title: delta.title ?? delta.spec,
    purpose: delta.purpose ?? "",
    requirements: deltaRequirements(delta),
    ...(delta.journeys ? { journeys: delta.journeys } : {}),
    ...(delta.suite
      ? {
          testCases: delta.suite.cases,
          testCasesStatus: delta.suite.status,
          ...(delta.suite.outOfSuite
            ? { outOfSuite: delta.suite.outOfSuite }
            : {}),
        }
      : {}),
  };
}

function DeltaCard({
  delta,
  dir,
  index,
  reading,
}: {
  delta: ChangeDeltaDocument;
  dir: string;
  index: ManualIndex;
  reading: Reading;
}) {
  const slug = slugify(delta.spec);
  const requirements = deltaRequirements(delta);
  const scenarios = requirements.reduce(
    (sum, requirement) => sum + requirement.scenarios.length,
    0,
  );
  const kinds = [...new Set(delta.sections.map((one) => one.kind))];

  return (
    <section
      aria-labelledby={`${slug}-title`}
      className="overflow-hidden rounded-(--radius-2xl) border border-border bg-card"
    >
      <header className="border-border-subtle border-b bg-background-subtle px-4 py-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h2
            className="font-heading font-semibold text-base"
            id={`${slug}-title`}
          >
            {delta.title ?? delta.spec}
          </h2>
          <DeltaSpec spec={delta.spec} />
          <DeltaKinds kinds={kinds} />
          <Text as="span" size="xs" tone="secondary">
            {requirements.length}{" "}
            {requirements.length === 1 ? "requirement" : "requirements"} ·{" "}
            {scenarios} {scenarios === 1 ? "scenario" : "scenarios"}
          </Text>
        </div>
        <div className="mt-1.5 [&>div]:mb-0">
          <FileMeta
            commit={delta.lastCommit}
            label={relativeTo(dir, delta.path)}
            path={delta.path}
          />
        </div>
      </header>

      <div className="px-4 py-4">
        {delta.error ? (
          <div className="mb-4">
            <BrokenCard error={delta.error} what={`Delta ${delta.spec}`} />
          </div>
        ) : null}
        {reading === "contract" && !delta.error ? (
          <DeltaContract delta={delta} index={index} slug={slug} />
        ) : null}
        {reading === "full" || (reading === "contract" && delta.error) ? (
          <MarkdownView
            anchorPrefix={slug}
            anchors
            baseDir={dirOf(delta.path)}
            index={index}
            text={delta.text}
          />
        ) : null}
      </div>
    </section>
  );
}

const SECTION_TITLE: Record<DeltaSection["kind"], string> = {
  added: "ADDED Requirements",
  modified: "MODIFIED Requirements",
  removed: "REMOVED Requirements",
  renamed: "RENAMED Requirements",
};

/**
 * The delta as the durable spec will read it: purpose, feature set, the
 * journeys it issues with the scenarios that accept them, then each delta
 * section's rows. Every row, scenario and story carries its permanent id, so
 * a link into the change lands on the line it is about.
 */
function DeltaContract({
  delta,
  index,
  slug,
}: {
  delta: ChangeDeltaDocument;
  index: ManualIndex;
  slug: string;
}) {
  const durable = index.specById.get(delta.spec);
  const baseDir = dirOf(delta.path);

  return (
    <div className="space-y-5">
      {delta.purpose ? (
        <ContractSection id={`${slug}-purpose`} title="Purpose">
          <MarkdownView
            baseDir={baseDir}
            className="manual-prose manual-prose-tight"
            index={index}
            text={delta.purpose}
          />
        </ContractSection>
      ) : null}
      {delta.featureSet ? (
        <ContractSection id={`${slug}-feature-set`} title="Feature set">
          <MarkdownView
            baseDir={baseDir}
            className="manual-prose manual-prose-tight"
            index={index}
            text={delta.featureSet}
          />
        </ContractSection>
      ) : null}
      {delta.sections.map((section) => (
        <ContractSection
          id={`${slug}-${section.kind}-requirements`}
          key={section.kind}
          title={SECTION_TITLE[section.kind]}
        >
          {section.kind === "renamed" ? (
            <RenameList renames={section.renames ?? []} />
          ) : (
            <ul className="divide-y divide-border-subtle rounded-(--radius-xl) border border-border-subtle bg-background-subtle">
              {section.requirements.map((requirement) => (
                <li key={requirement.name}>
                  <ContractRow
                    baseDir={baseDir}
                    durable={findRequirement(
                      durable?.requirements ?? [],
                      requirement.name,
                    )}
                    index={index}
                    kind={section.kind}
                    requirement={requirement}
                  />
                </li>
              ))}
              {section.requirements.length === 0 ? (
                <li className="px-3 py-2">
                  <Text as="span" size="xs" tone="secondary">
                    This section names no requirement.
                  </Text>
                </li>
              ) : null}
            </ul>
          )}
        </ContractSection>
      ))}
    </div>
  );
}

function ContractSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h3
        className="group/anchor mb-2 flex scroll-mt-24 items-center gap-1 font-heading font-medium text-sm"
        id={id}
      >
        <span>{title}</span>
        <AnchorLink id={id} label={`Copy link to ${title}`} />
      </h3>
      {children}
    </section>
  );
}

function RenameList({ renames }: { renames: { from: string; to: string }[] }) {
  if (renames.length === 0) {
    return (
      <Text as="p" size="xs" tone="secondary">
        This section pairs no FROM and TO headings.
      </Text>
    );
  }
  return (
    <ul className="space-y-1.5">
      {renames.map((rename) => (
        <li
          className="flex flex-wrap items-baseline gap-2 text-sm"
          key={`${rename.from}→${rename.to}`}
        >
          <Badge size="sm" variant={deltaTone("renamed")}>
            renamed
          </Badge>
          <span className="text-secondary-foreground line-through">
            {rename.from}
          </span>
          <span aria-hidden>→</span>
          <span className="font-medium">{rename.to}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * One requirement of the delta, as the row it will be. Opens to its prose
 * and scenarios; a MODIFIED row can also show the diff against the durable
 * block, which is the only way a retyped block that drops a scenario becomes
 * reviewable; a REMOVED row shows what goes.
 */
function ContractRow({
  requirement,
  kind,
  durable,
  index,
  baseDir,
}: {
  requirement: Requirement;
  kind: DeltaSection["kind"];
  durable?: Requirement;
  index: ManualIndex;
  baseDir: string;
}) {
  const id = requirementAnchor(requirement);
  const scenarioIds = requirement.scenarios.map((scenario) =>
    scenarioAnchor(requirement, scenario),
  );
  const targeted = useHashTarget(id, ...scenarioIds);
  const [open, setOpen] = useState(false);
  const [diff, setDiff] = useState(false);

  useEffect(() => {
    if (targeted) setOpen(true);
  }, [targeted]);

  return (
    <div className="group/anchor scroll-mt-24" id={id}>
      <div className="flex items-center gap-1 pr-2">
        <button
          aria-expanded={open}
          className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 px-3 py-2 text-left outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
          onClick={() => setOpen((on) => !on)}
          type="button"
        >
          <span
            className={`inline-flex shrink-0 text-secondary-foreground transition-transform ${open ? "rotate-90" : ""}`}
          >
            <CaretRight aria-hidden size={12} weight="bold" />
          </span>
          <Badge size="sm" variant={deltaTone(kind)}>
            {kind}
          </Badge>
          <Text as="span" className="min-w-0 flex-1" size="sm" weight="medium">
            {requirement.name}
          </Text>
          {requirement.scenarios.length > 0 ? (
            <Badge size="sm" variant="default">
              {requirement.scenarios.length}
            </Badge>
          ) : null}
        </button>
        <AnchorLink id={id} label="Copy link to this requirement" />
      </div>

      {open ? (
        <div className="space-y-3 border-border-subtle border-t px-4 py-3">
          {kind === "removed" ? (
            <Text as="p" size="sm" tone="secondary">
              This change deletes the requirement.
            </Text>
          ) : null}
          {kind === "modified" && durable ? (
            <button
              aria-pressed={diff}
              className="cursor-pointer text-secondary-foreground text-xs underline decoration-border-strong underline-offset-2 hover:text-foreground"
              onClick={() => setDiff((on) => !on)}
              type="button"
            >
              {diff
                ? "Read as it will stand"
                : "Diff against the durable requirement"}
            </button>
          ) : null}
          {diff && durable ? (
            <BlockDiff
              after={blockBody(durableBlock(requirement))}
              before={blockBody(durableBlock(durable))}
            />
          ) : (
            <>
              {requirement.text.trim() !== "" ? (
                <MarkdownView
                  baseDir={baseDir}
                  className={`manual-prose manual-prose-tight ${kind === "removed" ? "opacity-70" : ""}`}
                  index={index}
                  text={requirement.text}
                />
              ) : null}
              {requirement.scenarios.map((scenario) => (
                <ScenarioView
                  key={scenarioAnchor(requirement, scenario)}
                  requirement={requirement}
                  scenario={scenario}
                />
              ))}
              {kind === "removed" && durable ? (
                <MarkdownView
                  baseDir={baseDir}
                  className="manual-prose manual-prose-tight opacity-70"
                  index={index}
                  text={blockBody(durableBlock(durable))}
                />
              ) : null}
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}

/** The suite beside the delta, or the command that writes one. */
function DeltaTestPlan({
  change,
  delta,
}: {
  change: ChangeEntry;
  delta: ChangeDeltaDocument;
}) {
  if (delta.suiteError) {
    return (
      <BrokenCard
        error={delta.suiteError}
        what={`Test cases for ${delta.spec}`}
      />
    );
  }
  if (!delta.suite) {
    return (
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <Text as="span" size="sm" tone="secondary">
          No test plan yet for {delta.spec}.
        </Text>
        <CopyableCommand command={`/spec-to-tcs ${change.id}`} />
        <Text as="span" size="xs" tone="secondary">
          derives the cases from the journeys above
        </Text>
      </div>
    );
  }
  return (
    <div className="[&>section]:my-0">
      <SuiteView spec={deltaAsSpec(delta)} />
    </div>
  );
}

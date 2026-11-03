import { readinessOf } from "../api/readiness";
import { verdictsOf } from "../api/use-release";
import {
  PhaseChip,
  phaseNamed,
  StepChip,
  UnplannedChip,
} from "../blocks/phase-chip";
import type { PageRelease } from "../shell/section-readiness";

/**
 * What a page wears beside its title: its phase and release priority, its
 * readiness where the unit is its capability, and the Unplanned count. A
 * page in no phase wears nothing but the count, and only once it names one.
 */
export function PageChips({ release }: { release: PageRelease }) {
  const { marks, reading } = release;
  const phase = marks.page
    ? phaseNamed(reading.phases, marks.page.phase)
    : undefined;
  const unit = marks.pageUnit;
  const readiness = unit
    ? readinessOf(
        unit,
        reading.casesOf(unit),
        phase,
        verdictsOf(release.verdicts),
      )
    : undefined;
  if (!marks.page && marks.unplanned === 0) return null;
  return (
    <>
      {marks.page ? <PhaseChip assignment={marks.page} phase={phase} /> : null}
      {readiness ? <StepChip step={readiness.step} /> : null}
      {marks.unplanned > 0 ? <UnplannedChip count={marks.unplanned} /> : null}
    </>
  );
}

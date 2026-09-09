**Author:** @<handle> - <YYYY-MM-DD>
<!-- Whoever wrote this proposal. Ask for the handle rather than guessing it; it does
     not change when someone else later edits the file. -->

## Why

<!-- Explain the motivation for this change. What problem does this solve? Why now?
     Open with the collector problem and the evidence for it, not the solution, and
     name a metric that would move if this change works. -->

## What Changes

<!-- Describe what will change. Be specific about new capabilities, modifications, or removals. -->

## Non-Goals

<!-- What this change deliberately does not do, so engineering knows the edges. -->

## Capabilities

### New Capabilities
<!-- Capabilities being introduced. Use kebab-case for path segments you introduce
     (e.g., user-auth or identity/user-auth) that follow the project's existing
     spec organization. Each creates specs/<capability-path>/spec.md. -->
- `<capability-path>`: <brief description of what this capability covers>

### Modified Capabilities
<!-- Existing capabilities whose REQUIREMENTS are changing (not just implementation).
     Only list here if spec-level behavior changes. Each needs a delta spec file.
     Use the exact existing path under openspec/specs/. Leave empty if no requirement
     changes. A change with no capabilities at all (pure refactor, tooling, docs)
     must set `skip_specs: true` in its .openspec.yaml - openspec validate rejects
     a zero-delta change without that marker. Do not invent a requirement just to
     satisfy validation. -->
- `<existing-capability-path>`: <what requirement is changing>

## Impact

<!-- Affected code, APIs, dependencies, systems -->

## Follow-on changes

<!-- Optional. What this change makes possible next, one bullet each - no dates,
     no owners, no commitments. The manual's ::next block collects these onto the
     capability pages this change is about, each bullet under the change that
     wrote it, so write them as the reader of a capability page would read them.
     Leave the section out when there is nothing to name. -->

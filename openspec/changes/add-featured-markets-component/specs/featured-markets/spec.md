## ADDED Requirements

### Requirement: Controlled Featured Markets surface

The package SHALL export a Featured Markets component system that renders desktop and mobile curated-market layouts from typed consumer data and controlled selection callbacks.

#### Scenario: Consumer changes selection

- **WHEN** a user selects a duration, asset, event, source, or mobile tab
- **THEN** the component invokes the corresponding consumer callback and does not mutate application state itself.

### Requirement: Prop-driven chart runtime

The package SHALL render a single-series ECharts line chart from resolved chart props and SHALL not fetch, subscribe, route, track, or access application stores.

#### Scenario: Chart state changes

- **WHEN** the consumer replaces chart points or a typed chart visual state
- **THEN** the chart updates or renders the requested loading, empty, or error state and disposes its local ECharts instance when unmounted.

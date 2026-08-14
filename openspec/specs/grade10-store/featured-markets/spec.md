# Featured Markets

## Purpose

Prediction-market applications need a curated featured-markets surface that presents duration and trending markets consistently on desktop and mobile, while the consuming application retains ownership of market data, selection, navigation, and analytics.

Product context: [Featured Markets reusable component PRD](../../../../docs/prds/predictions/featured-markets-component.md).

## Requirements

### Requirement: Consumer-owned market and selection state

The surface SHALL render only from values the consuming application supplies, and SHALL report every user interaction through a callback instead of acting on it.

#### Scenario: A selection request is reported, not applied

- **WHEN** a user selects a duration, an asset, or a trending event
- **THEN** the surface reports the requested selection to the consuming application
- **AND** the rendered selection changes only after the application supplies the new selection back

#### Scenario: No product state is acquired internally

- **WHEN** the surface is rendered
- **THEN** it does not fetch markets, subscribe to prices, derive countdowns, navigate, persist to browser storage, or record analytics

#### Scenario: Selection and async inputs are unambiguous

- **WHEN** an engineer integrates the surface
- **THEN** each selection input and each asynchronous data input has exactly one valid shape per state, so that a loading, empty, error, or resolved input cannot be confused for another

### Requirement: Matching desktop and mobile presentation

The surface SHALL present the same supplied market model in a desktop navigation-and-chart layout at 768 px and above, and in a tabbed card layout below 768 px.

#### Scenario: Layout changes without losing navigation state

- **WHEN** the viewport crosses 768 px in either direction
- **THEN** the layout switches between the desktop and mobile presentations
- **AND** the selected duration, asset, trending event, and mobile tab remain as supplied

#### Scenario: Mobile tabs separate crypto and trending markets

- **WHEN** the mobile layout is shown
- **THEN** the user can switch between a crypto tab and a trending tab
- **AND** the active tab is exposed programmatically, not by styling alone

### Requirement: Visible asynchronous states

The surface SHALL present a distinct, labelled treatment for the loading, empty, and error states of each supplied data input, without concealing the rest of the panel.

#### Scenario: Loading preserves layout

- **WHEN** a data input is in its loading state
- **THEN** labelled placeholders occupy the position the resolved content will take
- **AND** no previously resolved value is presented as current

#### Scenario: Empty explains itself

- **WHEN** a data input resolves with no markets
- **THEN** a no-markets message is shown, using consumer-supplied copy when provided and a default otherwise
- **AND** any navigation the application still supplies remains operable

#### Scenario: Error offers the consumer's recovery

- **WHEN** a data input is in its error state
- **THEN** an error message is shown
- **AND** a retry control is shown when the application supplies a retry callback, and reports the retry request to the application

### Requirement: Prop-driven market chart

The surface SHALL render a single-series line chart from resolved data points supplied by the consuming application, with an optional reference marker.

#### Scenario: The chart never sources its own data

- **WHEN** the chart is rendered
- **THEN** it draws only the supplied points and never fetches or subscribes to market data

#### Scenario: The chart releases its resources

- **WHEN** the chart is removed from the page or its container is resized
- **THEN** it releases the rendering resources it created, leaving no detached instance or listener behind

#### Scenario: An unavailable chart does not mask the market

- **WHEN** the chart input is in its empty or error state
- **THEN** the chart area shows that status
- **AND** the surrounding market summary remains readable

### Requirement: Keyboard and assistive-technology operation

Every interactive element of the surface SHALL be operable by keyboard with a visible focus indicator, and its state SHALL be conveyed by more than color.

#### Scenario: Controls are reachable in reading order

- **WHEN** a keyboard user traverses the surface
- **THEN** navigation items, segmented controls, market actions, and retry controls receive focus in the order they are read
- **AND** the focused element is visibly indicated

#### Scenario: Unavailable actions are announced as unavailable

- **WHEN** an action is unavailable
- **THEN** it is exposed as disabled to assistive technology rather than being styled as inactive only

#### Scenario: The chart has a text equivalent

- **WHEN** the chart is rendered
- **THEN** it exposes the accessible description the consuming application supplied
- **AND** no information in the chart is conveyed by color alone

### Requirement: Consumer-supplied content

All human-readable content the surface presents SHALL come from the consuming application.

#### Scenario: The surface holds no product copy

- **WHEN** market labels, number and currency formatting, countdown or status text, action labels, chart descriptions, or error content are rendered
- **THEN** each was supplied by the consuming application, so that it can be localized without changing the surface

### Requirement: Named cross-repository exports

The consuming application SHALL implement this capability as the following exports, so that a contract change here has an identifiable counterpart there.

| Export | Responsibility |
| --- | --- |
| `FeaturedMarkets` | The full surface: controlled selection, controlled mobile tab, supplied duration and event data inputs, and interaction callbacks. |
| `FeaturedMarketLineChart` | The market line chart: supplied chart data input and accessible description. |
| `FeaturedMarketChartCard` | The chart in its card presentation, composing `FeaturedMarketLineChart` with the market summary. |

#### Scenario: A contract change names its consumers

- **WHEN** a requirement above changes in a way that alters one of these exports
- **THEN** the change proposal names the export and every application that implements it

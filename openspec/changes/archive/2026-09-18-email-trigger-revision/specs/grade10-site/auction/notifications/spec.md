## Feature set

- Progress messages
  - Opens in 24 hours: sent 24 hours before the scheduled start
  - Bidding has opened: sent when bidding starts
  - Closes in 24 hours: keyed to the scheduled close, not the moved close
  - Extended bidding started: sent when the listing enters the extension window
  - No one-hour reminder: the one-hour closing reminder is retired; the last warnings before close are the 24-hour letter and extended bidding when it starts

## MODIFIED Requirements

### Requirement: Grade10 sends four messages about a lot's progress

Grade10 SHALL send each progress message once per listing per collector
to everyone enrolled for it. The closing warning SHALL use the listing's
**scheduled** close, not its current effective close.

| Message | When | Recipients |
| --- | --- | --- |
| Bidding opens in 24 hours | 24 hours before the listing's scheduled start | Watchers |
| Bidding has opened | When the listing's bidding starts | Watchers |
| Bidding closes in 24 hours | 24 hours before the listing's scheduled close | Watchers and bidders |
| Extended bidding has started | When the listing enters its extension window | Watchers and bidders |

Each message SHALL carry the listing's identity and the time it concerns.
Money and times SHALL follow `money-amounts` and `dates-and-times`.

Grade10 SHALL NOT send a one-hour closing reminder about a listing, whether
the collector watches it, bid on it, or both. The last warnings before close
SHALL be Bidding closes in 24 hours and, when the listing enters its
extension window, Extended bidding has started.

#### Scenario: grade10-site-auction-notifications-SC-05 - A watcher is told bidding opens tomorrow
**Serves:** grade10-site-auction-notifications-US-01 - Collector hears a watched lot is opening

- **GIVEN** a collector watching a lot whose scheduled start is 24 hours away
- **WHEN** Grade10 reaches that point
- **THEN** it sends them the bidding-opens-in-24-hours message

#### Scenario: grade10-site-auction-notifications-SC-06 - A watcher added inside the window still hears
**Serves:** grade10-site-auction-notifications-US-01 - Collector hears a watched lot is opening

- **GIVEN** a published listing whose scheduled start is 6 hours away
- **WHEN** a collector watches that listing
- **THEN** they are emailed that bidding opens in 24 hours
- **AND** the message names the actual start instant, not a stale 24-hour remainder

#### Scenario: grade10-site-auction-notifications-SC-07 - A watcher is told bidding has opened
**Serves:** grade10-site-auction-notifications-US-01 - Collector hears a watched lot is opening

- **GIVEN** a collector watching a lot
- **WHEN** its bidding starts
- **THEN** Grade10 sends them the bidding-has-opened message

#### Scenario: grade10-site-auction-notifications-SC-08 - The closing warning uses the scheduled close
**Serves:** grade10-site-auction-notifications-US-02 - Collector returns before a lot closes

- **GIVEN** a lot whose scheduled close is 24 hours away and whose effective close has already been moved later by an extension
- **WHEN** Grade10 reaches 24 hours before the scheduled close
- **THEN** it sends the closing-in-24-hours message
- **AND** it does not recalculate that point from the moved close

#### Scenario: grade10-site-auction-notifications-SC-09 - Extended bidding announces itself to watchers and bidders
**Serves:** grade10-site-auction-notifications-US-02 - Collector returns before a lot closes

- **GIVEN** a lot with one collector watching it and a different collector who has bid on it
- **WHEN** the lot enters extended bidding
- **THEN** Grade10 sends both of them the extended-bidding-has-started message

#### Scenario: grade10-site-auction-notifications-SC-10 - A progress message is sent once per lot
**Serves:** grade10-site-auction-notifications-US-01 - Collector hears a watched lot is opening

- **GIVEN** a collector who has received the bidding-has-opened message for a lot
- **WHEN** Grade10 evaluates that lot's mail again
- **THEN** it does not send them that message a second time

#### Scenario: grade10-site-auction-notifications-SC-44 - No one-hour closing reminder at scheduled close minus one hour
**Serves:** grade10-site-auction-notifications-US-02 - Collector returns before a lot closes

- **GIVEN** a collector watching a lot whose scheduled close is one hour away, with email alerts on
- **WHEN** Grade10 reaches one hour before that scheduled close
- **THEN** it does not send them a one-hour closing reminder

#### Scenario: grade10-site-auction-notifications-SC-45 - Bidding closes in 24 hours still sends after the one-hour reminder is retired
**Serves:** grade10-site-auction-notifications-US-02 - Collector returns before a lot closes

- **GIVEN** a collector watching a lot whose scheduled close is 24 hours away, with email alerts on
- **WHEN** Grade10 reaches 24 hours before that scheduled close
- **THEN** it sends them the closing-in-24-hours message

#### Scenario: grade10-site-auction-notifications-SC-46 - Extended bidding still sends after the one-hour reminder is retired
**Serves:** grade10-site-auction-notifications-US-02 - Collector returns before a lot closes

- **GIVEN** a collector watching a lot with email alerts on
- **WHEN** the lot enters extended bidding
- **THEN** Grade10 sends them the extended-bidding-has-started message

#### Scenario: grade10-site-auction-notifications-SC-47 - A bidder is told bidding closes in 24 hours
**Serves:** grade10-site-auction-notifications-US-02 - Collector returns before a lot closes

- **GIVEN** a collector who has bid on a lot with email alerts on and does not watch it
- **AND** the lot's scheduled close is 24 hours away
- **WHEN** Grade10 reaches 24 hours before that scheduled close
- **THEN** it sends them the closing-in-24-hours message

#### Scenario: grade10-site-auction-notifications-SC-48 - No one-hour closing reminder before a moved close
**Serves:** grade10-site-auction-notifications-US-02 - Collector returns before a lot closes

- **GIVEN** a collector watching a lot in extended bidding with email alerts on
- **AND** the moved close is one hour away
- **WHEN** Grade10 reaches one hour before that moved close
- **THEN** it does not send them a one-hour closing reminder

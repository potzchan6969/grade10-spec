## User journeys

### grade10-admin-auction-campaign-US-01: Operator finds the catalogue cover called a campaign

**As an** auction operator,
**I want** the catalogue cover called Campaign everywhere in the admin,
**so that** I never mistake a cover for store checkout or sold stock.

**Accepted by:**

- `grade10-admin-auction-campaign-SC-01` — Auction admin section is labeled Campaigns
- `grade10-admin-auction-campaign-SC-02` — Campaign editor chrome says Campaign

### grade10-admin-auction-campaign-US-02: Operator opens a campaign as a draft

**As an** auction operator,
**I want** to start a campaign with a title and optional copy that no collector can see yet,
**so that** I can prepare an event before anything is public.

**Accepted by:**

- `grade10-admin-auction-campaign-SC-04` — Operator opens a draft campaign
- `grade10-admin-auction-campaign-SC-05` — Open without a title is refused
- `grade10-admin-auction-campaign-SC-06` — Unauthorized open is refused
- `grade10-admin-auction-campaign-SC-20` — Operator opens the editor for a new campaign
- `grade10-admin-auction-campaign-SC-21` — Operator opens the editor for a draft campaign

### grade10-admin-auction-campaign-US-03: Operator takes a campaign from draft to published

**As an** auction operator,
**I want** to create a draft and then publish it as a public cover without publishing the listings under it,
**so that** the event is announced while each lot publishes on its own.

**Accepted by:**

- `grade10-admin-auction-campaign-SC-07` — Operator creates a draft campaign
- `grade10-admin-auction-campaign-SC-08` — Create of a created campaign is refused
- `grade10-admin-auction-campaign-SC-12` — Operator publishes a created campaign
- `grade10-admin-auction-campaign-SC-13` — Publish of a draft campaign is refused
- `grade10-admin-auction-campaign-SC-14` — Publish of a published campaign is refused
- `grade10-admin-auction-campaign-SC-22` — Operator opens the editor for a created campaign

### grade10-admin-auction-campaign-US-04: Operator edits a campaign's cover

**As an** auction operator,
**I want** to change a campaign's title and copy while it is open,
**so that** the public cover stays right without recreating the event.

**Accepted by:**

- `grade10-admin-auction-campaign-SC-09` — Operator updates copy on a published campaign
- `grade10-admin-auction-campaign-SC-10` — Clearing the title is refused

### grade10-admin-auction-campaign-US-05: Operator calls a campaign off

**As an** auction operator,
**I want** to cancel a campaign in any open state and have its listings cancelled with it,
**so that** a called-off event leaves nothing live and nothing more to do.

**Accepted by:**

- `grade10-admin-auction-campaign-SC-11` — Canceled campaign rejects a title edit
- `grade10-admin-auction-campaign-SC-15` — Operator cancels a published campaign
- `grade10-admin-auction-campaign-SC-16` — Operator cancels a draft campaign
- `grade10-admin-auction-campaign-SC-17` — Operator cancels a created campaign
- `grade10-admin-auction-campaign-SC-18` — Already canceled campaign cannot be canceled again
- `grade10-admin-auction-campaign-SC-19` — Unauthorized cancel is refused
- `grade10-admin-auction-campaign-SC-23` — Canceled campaign opens read-only

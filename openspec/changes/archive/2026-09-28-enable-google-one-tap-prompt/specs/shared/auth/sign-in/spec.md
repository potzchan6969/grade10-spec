## Feature set

- Google
  - Auto-prompt: Google's own corner prompt offers sign-in to a signed-out
    visitor without opening the dialog first, wherever the brand already
    offers Google sign-in
  - One ask at a time: the prompt does not show while the sign-in dialog is
    open, and opening the dialog dismisses it

## ADDED Requirements

### Requirement: Google's auto-prompt offers sign-in and yields to the sign-in dialog

Google's own auto-prompt offers sign-in to a signed-out person without them
opening the sign-in dialog first, on any brand that already has Google
sign-in.

- **Brand-offered** - WHEN the brand has Google sign-in, the system SHALL
  show Google's own auto-prompt to a signed-out person before they open the
  sign-in dialog. WHEN the brand does not have Google sign-in, the system
  SHALL NOT show the prompt.
- **Signed-out only** - the system SHALL NOT show the prompt to a person who
  has a session.
- **One ask at a time** - the prompt SHALL NOT show while the sign-in dialog
  is open, and the system SHALL dismiss an already-showing prompt the moment
  the sign-in dialog opens.
- **Suppressed after a decline** - WHEN opening the sign-in dialog has
  dismissed a showing prompt and the person closes that dialog without
  signing in, the system SHALL NOT show the prompt again for the rest of
  that visit.
- **Every page** - the system SHALL show the prompt on any page a
  signed-out person visits.
- **No side effect on decline** - a person who does not act on the prompt
  SHALL remain signed out, with no session created and no dialog opened.
- **Same terms as the Google control** - completing the prompt SHALL sign a
  person in on the same terms the Google control's requirement sets: a
  verified Google email creates a session for that account, and an
  unverified email creates neither an account nor a session.
- **Keeps the page usable** - WHEN the prompt does not load, the system
  SHALL leave the page and the sign-in dialog fully usable.

#### Scenario: shared-auth-sign-in-SC-80 - The prompt appears for a signed-out visitor without opening the dialog
**Serves:** shared-auth-sign-in-US-11 - Collector is offered Google sign-in without opening the dialog

- **GIVEN** a brand that has Google sign-in
- **WHEN** a signed-out collector visits a page without opening the sign-in
  dialog
- **THEN** Google's own auto-prompt appears offering sign-in

#### Scenario: shared-auth-sign-in-SC-81 - A brand without Google sign-in never shows the prompt
**Serves:** shared-auth-sign-in-US-11 - Collector is offered Google sign-in without opening the dialog

- **GIVEN** a brand that does not have Google sign-in
- **WHEN** a signed-out collector visits a page
- **THEN** no Google auto-prompt appears

#### Scenario: shared-auth-sign-in-SC-82 - The prompt does not show while the sign-in dialog is open
**Serves:** shared-auth-sign-in-US-11 - Collector is offered Google sign-in without opening the dialog

- **GIVEN** a brand that has Google sign-in
- **WHEN** a signed-out collector opens the sign-in dialog
- **THEN** the Google auto-prompt does not appear while the dialog is open

#### Scenario: shared-auth-sign-in-SC-83 - Opening the dialog dismisses an already-showing prompt
**Serves:** shared-auth-sign-in-US-11 - Collector is offered Google sign-in without opening the dialog

- **GIVEN** a brand that has Google sign-in, with the auto-prompt already
  showing to a signed-out collector
- **WHEN** that collector opens the sign-in dialog
- **THEN** the auto-prompt is dismissed
- **AND** only the sign-in dialog remains visible

#### Scenario: shared-auth-sign-in-SC-84 - Completing the prompt with a verified email signs in
**Serves:** shared-auth-sign-in-US-11 - Collector is offered Google sign-in without opening the dialog

- **GIVEN** a brand that has Google sign-in, with the auto-prompt showing
- **WHEN** the collector completes the prompt with a Google account whose
  email is verified
- **THEN** they are signed in as the account for that address, on the same
  terms the Google control's requirement sets

#### Scenario: shared-auth-sign-in-SC-85 - Completing the prompt with an unverified email does not sign in
**Serves:** shared-auth-sign-in-US-11 - Collector is offered Google sign-in without opening the dialog

- **GIVEN** a brand that has Google sign-in, with the auto-prompt showing
- **WHEN** the collector completes the prompt with a Google account whose
  email Google has not verified
- **THEN** no account is created from that request
- **AND** they are not signed in

#### Scenario: shared-auth-sign-in-SC-86 - A signed-in visitor never sees the prompt
**Serves:** shared-auth-sign-in-US-11 - Collector is offered Google sign-in without opening the dialog

- **GIVEN** a brand that has Google sign-in, and a person who already has a
  session
- **WHEN** that person visits a page
- **THEN** no Google auto-prompt appears

#### Scenario: shared-auth-sign-in-SC-87 - The prompt is offered on any page, including checkout
**Serves:** shared-auth-sign-in-US-11 - Collector is offered Google sign-in without opening the dialog

- **GIVEN** a brand that has Google sign-in
- **WHEN** a signed-out collector visits any page of that brand, including
  checkout
- **THEN** the auto-prompt appears the same way it does on any other page

#### Scenario: shared-auth-sign-in-SC-88 - Ignoring the prompt leaves the page unaffected
**Serves:** shared-auth-sign-in-US-11 - Collector is offered Google sign-in without opening the dialog

- **GIVEN** a brand that has Google sign-in, with the auto-prompt showing to
  a signed-out collector
- **WHEN** that collector continues using the page without completing the
  prompt or opening the sign-in dialog
- **THEN** they remain signed out
- **AND** the page behaves exactly as it would with no prompt showing

#### Scenario: shared-auth-sign-in-SC-89 - A prompt that fails to load leaves the page usable
**Serves:** shared-auth-sign-in-US-11 - Collector is offered Google sign-in without opening the dialog

- **GIVEN** a brand that has Google sign-in, in an environment that prevents
  Google's prompt from loading
- **WHEN** a signed-out collector visits a page
- **THEN** the page loads normally with no auto-prompt shown
- **AND** the sign-in dialog remains reachable and works as it always does

#### Scenario: shared-auth-sign-in-SC-90 - Declining the dialog suppresses the prompt for the rest of the visit
**Serves:** shared-auth-sign-in-US-11 - Collector is offered Google sign-in without opening the dialog

- **GIVEN** a brand that has Google sign-in, where opening the sign-in
  dialog has already dismissed a showing prompt
- **WHEN** the collector closes that dialog without signing in and visits
  another page in the same visit
- **THEN** the auto-prompt does not appear again for the rest of that visit

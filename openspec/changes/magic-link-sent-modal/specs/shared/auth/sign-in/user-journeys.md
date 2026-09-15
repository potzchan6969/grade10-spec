## User journeys

### shared-auth-sign-in-US-07: Collector confirms the send and can resend

**As a** collector,
**I want** the dialog to say Check Your Email, put the address I used on its
own line, and let me resend after a short wait,
**so that** I know where to look and can ask again without a Back control into
the entry step.

**Accepted by:**

- `shared-auth-sign-in-SC-42` — A successful send shows Check Your Email and the address on its own line
- `shared-auth-sign-in-SC-43` — Resend is offered after a successful send
- `shared-auth-sign-in-SC-44` — The link-sent surface has no Back control
- `shared-auth-sign-in-SC-45` — The email-step CTA says Sign In with Email
- `shared-auth-sign-in-SC-46` — Resend is disabled with a countdown after a send
- `shared-auth-sign-in-SC-47` — Resend re-enables when the countdown reaches zero
- `shared-auth-sign-in-SC-48` — A successful resend restarts the countdown
- `shared-auth-sign-in-SC-49` — A link older than sixty seconds does not sign in

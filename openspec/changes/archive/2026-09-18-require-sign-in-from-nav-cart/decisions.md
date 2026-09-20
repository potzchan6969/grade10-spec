## Goals

- Keep Cart available wherever the Store cart drawer is answered
- Ask a signed-out collector to sign in before opening the member cart
- Resume only the Cart request that caused the sign-in

## Non-Goals

- Deciding on which surfaces the Cart control appears
- Defining the Cart Drawer contents or cart scope
- Changing checkout access or checkout creation
- Hiding Cart from signed-out collectors

## Decisions

The canonical page-shell and Store cart records settle this reconciliation on
2026-09-18.

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Does session state decide whether Cart is supplied? | No. Cart availability follows the Store capability; session state decides what activation does | Hiding Cart for signed-out collectors, which would contradict the global Cart decision |
| Q2 | What does a successful sign-in resume? | The Cart drawer request on the same surface, and nothing else | An effect that opens Cart for any session arriving from another action or tab |
| Q3 | What does a resolving session mean for Cart? | It counts as signed out and asks for sign-in | Opening the drawer before the session resolves and then needing a second access gate |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |

# grade10-admin/vault/operator-queue Specification

## Feature set

- One case
  - A loan's clock: past its due date the header counts the days past due,
    and once a forfeiture notice stands it names the date to pay by instead,
    on the shop's clock
  - Asked before the collector is emailed: cancelling the visit and sending
    the forfeiture notice each ask first, naming the slot, or the address and
    the date to pay by

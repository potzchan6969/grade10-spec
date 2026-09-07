## User journeys

### grade10-site-commerce-product-status-US-01: Collector sees whether a card can be bought

**As a** collector,
**I want** every surface to tell me the same thing about whether a variant can
be bought,
**so that** a card I saw as available on the listing is available on its page
and in my cart, and nothing on the way to buying it turns out to be for show.

**Accepted by:**

- `grade10-site-commerce-product-status-SC-01` — The shop offers the variant
- `grade10-site-commerce-product-status-SC-02` — The shop no longer offers the variant
- `grade10-site-commerce-product-status-SC-03` — The shop sells past zero
- `grade10-site-commerce-product-status-SC-04` — The shop exposes no count
- `grade10-site-commerce-product-status-SC-10` — A scarce variant is offered as any other
- `grade10-site-commerce-product-status-SC-11` — No count reaches the collector while browsing
- `grade10-site-commerce-product-status-SC-12` — One grade left, another sold out
- `grade10-site-commerce-product-status-SC-13` — Nothing left on the card
- `grade10-site-commerce-product-status-SC-14` — Three surfaces, one answer
- `grade10-site-commerce-product-status-SC-15` — An out-of-stock variant keeps its price
- `grade10-site-commerce-product-status-SC-16` — An unpublished product is not listed

### grade10-site-commerce-product-status-US-02: Collector asks for more than the shop can fill

**As a** collector,
**I want** the store to tell me when it can fill only part of what I asked
for, and how much,
**so that** a request the shop cannot meet is a stated answer I can act on
rather than a refusal at checkout.

**Accepted by:**

- `grade10-site-commerce-product-status-SC-05` — The request can be filled
- `grade10-site-commerce-product-status-SC-06` — The request can be filled exactly
- `grade10-site-commerce-product-status-SC-07` — More is asked for than the count
- `grade10-site-commerce-product-status-SC-08` — Nothing remains to fill the request
- `grade10-site-commerce-product-status-SC-09` — An unbounded variant fills any request

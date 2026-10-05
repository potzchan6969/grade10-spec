## Goals

- The listing search field offers matching products and matching world or
  type filters while the collector types.
- Enter commits free text as a dismissible chip; picking a product opens it;
  picking a filter applies that facet. The field clears after commit or pick.
- No match and waiting are visible; Enter still commits either way.

## Non-Goals

- Header or site-wide search.
- Auction or cross-surface hits in the suggestion panel.
- Typeahead that rewrites the address on every keystroke.
- A global search modal with entity tabs or chain filters.
- Changing facet, collection, or sort rules already on the listing.
- A fixed character threshold in the product.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Where does search live? | The field lives with the listing filters, not in the site header - decided by the round | A nav search that would read as site-wide find |
| Q2 | Which viewport shows listing search? | Suggestions, commit and the search chip are the wide sidebar field. Below the wide breakpoint there is no listing search - decided by the round | Search on the listing outside a Filter drawer on a narrow viewport |
| Q3 | What happens on type vs Enter vs a pick? | Suggestions are products and matching world or type filters. Enter commits free text as a chip. Picking a product opens it; picking a filter applies that facet. The field clears after commit or pick - decided by the round | Rewriting the address on every keystroke |
| Q4 | Do product hits follow the facets already on? | Product hits are catalogue-wide even when facets are already on, matching free-text search - decided by the round | Suggesting only inside the current narrowing |
| Q5 | How many hits per group? | Products and Filters each show at most five matches - decided by the round | An uncapped list |
| Q6 | Who decides when to ask? | The application chooses when to supply suggestion groups. The shared field only shows what it is given - decided by the round | A character threshold in the shared field |
| Q7 | How is a filter hit labelled? | The facet value as the row label and World or Type as trailing chrome - decided by the round | A single "World · value" string |
| Q8 | Can they commit when nothing matched? | No match shows that nothing matched. Enter still commits the typed words - decided by the round | Blocking commit until a hit exists |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |

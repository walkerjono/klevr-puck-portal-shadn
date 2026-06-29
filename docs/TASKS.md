TODO:

- [x] klevr-list make search configurable i.e. true/false
- [x] klevr-list make column chooser configurable i.e. true/false
- [x] klevr-list make facet filters configurable i.e. true/false and layout horizontal or vertical. Keep search and column chooser seperate
- [x] klevr-list can the facet filters be in a seperate container? so that when they go vertical, the facets display vertically beside the grid itself, with a layout 1/3 facet and 2/3 grid
- [x] klevr-list Include column level config for display, search and filter for each column
- [ ] add config to facets to auto-expand
- [x] add preview page button next to publish - open in new tab

- [x] add more sample data to projects mock, 50 rows total. plus 2 new columns, start and end (date only)

- [x] klevr-list facets add search/filter to dropdown
- [ ] klevr-list facets add selected chips
- [x] klevr-list no pagination controls are visible
- [x] klevr-list column filter based on datatype (date range, numeric range, categorical)
    - shouldn't need datatype in database.json, it should read type from metdata

- [-] donation component:
    - Use Hero as a starting point
    - Add a full background image
    - Replace existing images with donation control with 3 sub-pages
        - 1. Donate frequency (once|recurring), amount
        - 2. Details: name, email, phone address, on behalf of company, keep anonymous etc
        - 3. Payment: credit card details, cover platform costs
    - donation control should be aware of page theme i.e. colours
    - text should be configurable
    - refer to screenshot for example
    - status: initial implementation complete; validate and polish UX/styling
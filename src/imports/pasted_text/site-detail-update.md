1. Sites Page
Keep everything exactly as-is. Only add:

Eye icon (👁) in Actions column → clicking navigates to Site Detail page
Site name text in each row → also clickable → navigates to Site Detail page


2. New Page — Site Detail Page
Create a new page when clicking a site row. Same light grey background, white cards, same font and spacing.
Top header:

Back arrow + "Sites" breadcrumb link
Site name as H1
Site Type badge (Airport / Campus / Municipality / Private)
Status badge (Active / Suspended / Trial)
Edit button top right

Stats row — 5 cards (same style as Sites page):

Total Facilities
Total Zones
Total Capacity
Devices Online (e.g. 8/10)
Active Violations Today (red accent if > 0)

Two-column section:
Left (~65%):

Facilities card — same table style, columns: Facility ID | Name | Type | Zones | Capacity | Occupancy | Status | Actions
Assigned Operators card — avatar initials, Name, Role badge, Last Active

Right (~35%):

Compliance Rate — donut chart
Revenue Today — $ number + sparkline
Active Payment Sessions — number metric

Bottom full-width:

"Zones in this Site" table — Zone Name | Facility | Site | Capacity | Occupancy | Status


3. Facilities Page — Add KPI Cards + Modal Update
Add a KPI stats row below the existing "Total Facilities: 5" card and above the All Facilities table.
Add 5 KPI cards in the same white card style as the Sites page stats:

Total Facilities — total count (replaces the existing single stat card, keep same position)
Total Zones — sum of all zones across all facilities
Total Capacity — sum of all capacity numbers across all facilities
Average Occupancy — average % across all facilities (show as percentage, amber color accent)
Active Violations — total active violations across all facilities (red accent if > 0)

Keep the "All Facilities" table exactly as-is below the KPI row.
Update "+ Add Facility" modal only:
Keep exact modal style. Add one new field at the very top before all existing fields:

Site * — dropdown, first field

Placeholder: "Select a site first"
Options: all existing sites
Helper text in grey below: "Site is required — Facility must belong to a Site"
Blue info icon next to label



Keep all existing fields unchanged below it:

Facility Name
Facility Type (update options: On-street Corridor / Off-street Surface Lot / Multi-level Parking Structure / Airport Curb Segment)
Capacity
Floor / Level
Status

Add light blue info banner at top of modal:

ℹ️ "Select a Site first. Hierarchy: Site → Facility → Zone"

Footer unchanged: Cancel + Add Facility (blue, disabled until Site + Facility Name + Type filled)

4. Zones Page — Add KPI Cards + Add Zone Modal
Add a KPI stats row above the existing search bar and table.
Add 5 KPI cards in the same white card style:

Total Zones — total count
Total Capacity — sum of all zone capacities
Average Occupancy — average % across all zones (amber accent)
Active Violations — total violations across all zones (red accent if > 0)
Policy Coverage — number of zones with a policy assigned vs total (e.g. "18/22", blue accent)

Keep existing search bar, Filter button, table, and "+ Add Zone" button exactly as-is below the KPI row.
Add "Add Zone" modal (clicking "+ Add Zone" opens this):
Modal style: exactly match Add Facility modal style — same white card, same input styling, same button styles.
Modal title: "Add Zone"
Light blue info banner at top:

ℹ️ "Both Site and Facility must be selected. Hierarchy: Site → Facility → Zone"

Fields in this exact order:

Site * — dropdown, always first

Placeholder: "Select a site first"
Options: all existing sites
Helper text: "Select a Site to unlock the Facility dropdown"
Blue info icon next to label


Facility * — dropdown, second

Greyed out / disabled until Site is selected
Placeholder when locked: "Select a site first"
Placeholder when unlocked: "Select a facility"
Filters to show only Facilities under selected Site
Helper text: "Facility options load after Site is selected"


Zone Name * — text input

Placeholder: "Enter zone name"


Zone Type * — dropdown

Options: Curb Segment / Surface Lot Zone / Structure Level & Aisle


Policy Template — dropdown

Options: 30-min Parking / 1-Hour Parking / 2-Hour Parking / Permit Only / Loading Zone / Pay-to-Park / Handicap Stall / No Stopping


Capacity — number input

Placeholder: "0"


Geometry — two tabs:

Tab 1 "Draw on Map": small embedded map, instruction: "Click to place points. Min 3 points. Close polygon to finish."
Tab 2 "Import File": file upload box, accepts GeoJSON / CSV / Shapefile


Status — dropdown, default Active

Footer: Cancel (outlined) + Add Zone (blue primary, disabled until Site + Facility + Zone Name are filled)

5. Navigation & Cross-Page Linking

Sites list → eye icon or site name → Site Detail page
Site Detail → Facility ID link → Facilities page filtered to that site
Site Detail → Zone row → Zones page filtered to that site
Facilities page → Site column value → Site Detail page for that site
Zones page → Site column value → Site Detail page for that site
Zones page → Facility column value → Facilities page filtered to that facility


Do not change any existing colors, typography, spacing, card styles, table styles, occupancy progress bars, status badge styles, or button styles anywhere. Only add the KPI rows to Facilities and Zones pages, add the Site field to Add Facility modal, create the Add Zone modal, create the Site Detail page, and add the cross-page navigation links described above.
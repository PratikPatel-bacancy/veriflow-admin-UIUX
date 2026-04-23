Page Header
Same white card style, full width:

Facility Name — H1 bold (e.g. "North Wing - Level 1")
Facility Type badge next to name — pill badge, blue outline (e.g. "Multi-level Parking Structure")
Parent Site — smaller grey text below name (e.g. "Site: Downtown Garage") — clickable blue link → navigates to Site Detail page
Status badge — top right area, same green/grey badge style (Active / Inactive)
Edit Facility button — outlined button, top right corner
Facility ID — small grey label below name (e.g. "FAC-001")


KPI Cards Row
6 cards in same white card style as Sites page and Facilities page. Same font size, same spacing, same shadow:
CardValue StyleAccent ColorTotal ZonesLarge bold numberDefault blackTotal StallsLarge bold numberDefault blackTotal CapacityLarge bold numberDefault blackCurrent OccupancyLarge bold % (e.g. 88%)Amber if >75%, Red if >90%Active ViolationsLarge bold numberRed if > 0, grey if 0Devices OnlineFraction (e.g. 3/4)Green if all online, amber if partial

Section 1 — Zones List (Primary Table)
White card, full width. Title: "Zones" with a "+ Add Zone" blue button on the top right of the card.
Table columns (same style as Zones page table):

Zone Name — bold, clickable blue link → navigates to Zone Detail page
Zone Type — grey text (Curb Segment / Surface Lot Zone / Structure Level & Aisle)
Capacity — number
Occupancy — progress bar + % (same blue progress bar style as Zones page)
Policy Applied — grey text (e.g. "2-Hour Parking", "Permit Only") — show "—" if none
Active Violations — number, red badge if > 0, grey "0" if none
Status — same green toggle as Zones page
Actions — edit icon + delete icon (same style as Facilities page)

Sample data rows:

Zone A - P1 Ground | Surface Lot Zone | 50 | 95% bar | 2-Hour Parking | 2 violations | Active
Zone B - P2 Upper | Structure Level & Aisle | 45 | 88% bar | Permit Only | 0 | Active
Zone C - Street Level | Curb Segment | 60 | 76% bar | Pay-to-Park | 1 violation | Active


Section 2 — Two Column Layout
Below the Zones table, split into two columns (~60% left, ~40% right):
Left Column:
Devices Card — white card, title "Assigned Devices" with device count badge next to title
Table inside the card:

Device ID — blue text (e.g. DEV-001)
Model — grey text (e.g. "Lynet M504")
RTK Status — badge: green "FIX" / amber "FLOAT" / red "SINGLE"
Connectivity — green dot "Online" / red dot "Offline"
Last Seen — grey timestamp (e.g. "2 mins ago")
Health — green "Healthy" / amber "Degraded" badge

Sample rows:

DEV-001 | Lynet M504 | FIX | Online | 2 mins ago | Healthy
DEV-002 | Lynet M504 | FLOAT | Online | 5 mins ago | Degraded
DEV-003 | Einar | SINGLE | Offline | 1 hour ago | Healthy

Right Column:
Stalls Summary Card — white card, title "Stalls Overview"
Show 3 large metric rows inside the card:

Total Stalls — large number (e.g. 155)
Occupied — number with red/amber dot (e.g. 128)
Available — number with green dot (e.g. 27)

Below the metrics, show a horizontal stacked bar:

Green segment = Available %
Amber segment = Occupied %
Red segment = Over capacity %
Percentage labels on each segment


Section 3 — Two Column Layout (second row)
Left Column:
Active Violations Card — white card, title "Active Violations" with red badge showing count
Table inside:

Plate — bold (e.g. "ABC 1234")
Zone — grey text
Violation Type — grey text (e.g. "Overstay", "No Payment", "Permit Violation")
Time — grey timestamp (e.g. "14 mins ago")
Status badge — red "Open" / green "Resolved"

Sample rows:

ABC 1234 | Zone A - P1 Ground | Overstay | 14 mins ago | Open
XYZ 5678 | Zone C - Street Level | No Payment | 32 mins ago | Open
DEF 9012 | Zone B - P2 Upper | Permit Violation | 1 hour ago | Resolved

Right Column:
Policy Templates Card — white card, title "Applied Policies"
List style (not table), each policy as a row:

Policy name bold (e.g. "2-Hour Parking")
Rule type grey text below (e.g. "Time-limit")
Applied to zone in grey (e.g. "Zone A, Zone B")
Active/Inactive badge on the right
Small blue edit icon far right

Sample entries:

2-Hour Parking / Time-limit / Zone A · Zone B / Active
Permit Only / Permit / Zone B / Active
Pay-to-Park / Payment / Zone C / Active


Section 4 — Event Calendars Card
Full width white card at the bottom. Title: "Upcoming Event Overrides" with a small "+" add button top right.
Table columns:

Event Name — bold
Affected Zones — grey text
Override Rule — grey text
Start Date — grey
End Date — grey
Status badge — blue "Upcoming" / green "Active" / grey "Expired"
Actions — edit + delete icons

Sample rows:

Holiday Parking | Zone A, Zone C | No Time Limit | Apr 20, 2025 | Apr 21, 2025 | Upcoming
Street Cleaning | Zone C | No Parking 8–10am | Apr 18, 2025 | Apr 18, 2025 | Active


Navigation from this page

Breadcrumb "Sites" → Sites list page
Breadcrumb "[Site Name]" → Site Detail page
Breadcrumb "Facilities" → Facilities list page
Zone Name in Zones table → Zone Detail page (future)
"+ Add Zone" button in Zones card → opens Add Zone modal (same modal as Zones page, with Site and Facility pre-filled and locked since we are already inside a facility)
Site name link in header → Site Detail page
Facility ID blue links in Zones table rows are not needed here (already on facility page)
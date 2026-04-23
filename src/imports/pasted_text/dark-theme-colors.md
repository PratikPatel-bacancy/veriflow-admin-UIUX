Dark Theme Color Palette:
ElementColorPage background#001529Sidebar background#002140Card / panel background#00243DCard border#004170Table row background#00243DTable row hover#004170Table header background#002A4AInput field background#002A4AInput field border#004170Input field border focus#0530ADModal background#00243DModal overlay backdroprgba(0, 0, 0, 0.7)Divider / separator lines#004170Scrollbar track#002140Scrollbar thumb#004170
Text Colors in Dark Theme:
Text TypeColorPrimary text (headings, values)#FFFFFFSecondary text (labels, captions)#8BA8C0Placeholder text#4A6B85Disabled text#3A5570Link text#4D9FFFBreadcrumb active#FFFFFFBreadcrumb inactive#8BA8C0
Button Colors in Dark Theme:
Button TypeBackgroundTextPrimary (blue)#0530AD#FFFFFFPrimary hover#0642D4#FFFFFFOutlinedtransparent border #004170#8BA8C0Outlined hover#004170#FFFFFFDanger / Delete#EF4444#FFFFFFDisabled#002A4A#3A5570
Status Badge Colors in Dark Theme:
BadgeBackgroundTextActive#052E16#4ADE80Trial#3A2004#FCD34DSuspended#2D0A0A#F87171In Service#0C1A3D#60A5FADraft#1A1A2E#94A3B8
Graph / Chart Colors in Dark Theme:
ElementColorRevenue line#0530ADRevenue gradient fill top#0530AD at 30% opacityRevenue gradient fill bottomtransparentOccupancy bar (normal)#0530ADOccupancy bar (warning >75%)#F59E0BOccupancy bar (critical >90%)#EF4444Donut chart — Online#0530ADDonut chart — Degraded#F59E0BDonut chart — Offline#EF4444Grid lines on graph#004170 at 40% opacityAxis labels#8BA8C0Tooltip background#002A4ATooltip border#004170Tooltip text#FFFFFF
Sidebar in Dark Theme:
ElementColorSidebar background#002140Sidebar item text#8BA8C0Sidebar item hover background#004170Sidebar item active background#0530ADSidebar item active text#FFFFFFSidebar sub-item text#6B8FA8Sidebar sub-item active text#4D9FFFSidebar section label (MENU)#4A6B85Sidebar border right#004170Logo / brand text#FFFFFF
Stepper in Dark Theme:
ElementColorActive step circle#0530ADCompleted step circle#004170Upcoming step circle border#004170Connector line completed#0530ADConnector line upcoming#004170 dashedStep label active#FFFFFFStep label completed#4D9FFFStep label upcoming#4A6B85

Light Theme Colors (keep existing, no change)
All existing light theme colors remain exactly as they are. No changes to light theme at all.

Theme Toggle Switch — Header
Add a theme toggle icon button in the top header bar, positioned on the right side of the header, left of the user avatar/profile icon.
Toggle button design:

Show as a rounded pill toggle switch with icon inside
Light mode active state:

Background: #F1F5F9 (light grey pill)
Sun icon ☀️ on the left side — filled yellow #F59E0B
Moon icon 🌙 on the right side — grey outline #94A3B8
Small white circle indicator slides to the left (sun side)
Tooltip on hover: "Switch to Dark Mode"


Dark mode active state:

Background: #004170 (dark blue pill)
Sun icon ☀️ on the left — grey outline #4A6B85
Moon icon 🌙 on the right — filled white #FFFFFF
Small white circle indicator slides to the right (moon side)
Tooltip on hover: "Switch to Light Mode"



Toggle animation:

Smooth slide transition of the indicator pill left ↔ right
Background color smoothly transitions between light and dark states
Icon colors smoothly transition
All page colors transition smoothly (0.3s ease transition on all color properties)

Toggle size:

Pill width: 64px
Pill height: 32px
Inner circle indicator: 24px diameter
Icons: 14px size inside the pill on each side


Dark Theme Application Rules
Apply dark theme colors to every single element across all pages when dark mode is active:

✅ All page backgrounds
✅ All white cards → dark card color
✅ All tables — header, rows, hover states, borders
✅ All form inputs, dropdowns, textareas
✅ All modals and drawers
✅ All buttons (primary, outlined, danger, disabled)
✅ All status badges
✅ All sidebar navigation items
✅ All breadcrumbs
✅ All charts and graphs (revenue curve, donut chart, occupancy bars)
✅ All tooltips
✅ All stepper components
✅ All progress bars
✅ All dividers and borders
✅ All KPI stat cards
✅ All text (headings, body, labels, captions, placeholders)
✅ All icons (adjust opacity/color so they remain visible on dark backgrounds)
✅ Scrollbars
✅ Header bar
✅ Violation detail drawer
✅ Toast notifications — dark background #002A4A, border #004170


Theme Persistence

Selected theme persists across all pages — if user switches to dark on Home page, all other pages are also dark
Default theme on first load: Light theme
Theme state is remembered — if user was on dark theme and navigates to another page, it stays dark


Dark Theme — Specific Component Overrides
KPI Cards in dark theme:

Background: #00243D
Border: 1px solid #004170
Title text: #8BA8C0
Value text: #FFFFFF
Accent colors (red for violations, green for active) remain the same — they are bright enough on dark background

Revenue Graph card in dark theme:

Card background: #00243D
Card border: #004170
Graph background (inside chart area): #001E35
Axis text: #8BA8C0
Gridlines: #004170 at 40% opacity dotted
Curve line: #0530AD — slightly brighter on dark: use #1B5FD4
Area fill gradient: #0530AD 30% opacity at top → transparent at bottom

Tables in dark theme:

Header row: #002A4A background, #8BA8C0 text
Body rows: #00243D background, #FFFFFF primary text, #8BA8C0 secondary text
Alternating rows: #002140 for every other row (subtle stripe)
Row hover: #004170 background
Border between rows: #004170 at 50% opacity

Occupancy progress bars in dark theme:

Track (empty part): #002A4A
Fill: #0530AD normal / #F59E0B warning / #EF4444 critical
Percentage text: #8BA8C0

Modals and Drawers in dark theme:

Overlay: rgba(0, 0, 0, 0.75)
Modal card: #00243D
Modal header border bottom: #004170
Modal footer border top: #004170
Close × icon: #8BA8C0 — hover: #FFFFFF

Info banners in dark theme:

Blue info banner: background #0C1A3D, border left #0530AD, text #8BA8C0, icon #4D9FFF
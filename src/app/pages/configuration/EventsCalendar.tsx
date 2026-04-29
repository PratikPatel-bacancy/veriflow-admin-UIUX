import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Plus, MoreHorizontal, CalendarClock, Search, Pencil, Trash2,
} from "lucide-react";

// ── Static data ───────────────────────────────────────────────────────────

const ZONES = [
  "Zone A — Permit Holders Only",
  "Zone B — General Public Parking",
  "Zone C — Faculty & Staff Reserved",
  "Zone D — Short-Term Visitor (2-Hour)",
  "Zone E — EV Charging Stations",
  "Zone F — Accessible Parking (ADA)",
  "Zone G — Event Day Overflow",
  "Zone H — Motorcycle & Bicycle",
];

const TIMEZONES = ["America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles"];

const OVERRIDE_TEMPLATES = ["No Stopping", "Pay-to-Park", "Permit-Only", "Ops Window", "2-Hour Parking", "EV-Only"];

const OVERRIDE_MODES = [
  { id: "add",     label: "Add policies",          desc: "Layer new rules on top of existing base policies." },
  { id: "suspend", label: "Suspend base policies",  desc: "Pause all current policies in targeted zones for the event window." },
  { id: "replace", label: "Replace with",           desc: "Remove base policies and apply a specific override policy set." },
];

const STATUS_STYLES: Record<string, string> = {
  Active:    "bg-[#d1fae5] dark:bg-[#065f46] text-[#065f46] dark:text-[#34d399]",
  Scheduled: "bg-[#dbeafe] dark:bg-[#1e3a8a] text-[#1e40af] dark:text-[#93c5fd]",
  Draft:     "bg-[#f3f4f6] dark:bg-[#1f2937] text-[#6b7280] dark:text-[#9ca3af]",
  Past:      "bg-[#fef3c7] dark:bg-[#78350f] text-[#92400e] dark:text-[#fcd34d]",
};

interface SpecialEvent {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  timeRange: string;
  zones: string[];
  overrideMode: string;
  priority: number;
  status: "Active" | "Scheduled" | "Draft" | "Past";
  notify: boolean;
}

const MOCK_EVENTS: SpecialEvent[] = [
  {
    id: 1, name: "Parade Day 2026",
    startDate: "2026-05-04", endDate: "2026-05-04", timeRange: "08:00–20:00",
    zones: ["Zone A — Permit Holders Only", "Zone B — General Public Parking", "Zone G — Event Day Overflow"],
    overrideMode: "suspend", priority: 95, status: "Scheduled", notify: true,
  },
  {
    id: 2, name: "Snow Emergency #12",
    startDate: "2026-04-24", endDate: "2026-04-25", timeRange: "In effect",
    zones: ZONES,
    overrideMode: "replace", priority: 98, status: "Active", notify: true,
  },
  {
    id: 3, name: "Game Day — Knicks",
    startDate: "2026-05-10", endDate: "2026-05-10", timeRange: "17:00–23:00",
    zones: ["Zone B — General Public Parking", "Zone G — Event Day Overflow"],
    overrideMode: "add", priority: 90, status: "Scheduled", notify: false,
  },
  {
    id: 4, name: "Summer Concert Series",
    startDate: "2026-06-15", endDate: "2026-06-15", timeRange: "16:00–23:00",
    zones: ["Zone G — Event Day Overflow"],
    overrideMode: "replace", priority: 95, status: "Draft", notify: true,
  },
  {
    id: 5, name: "New Year's Eve Closure",
    startDate: "2025-12-31", endDate: "2026-01-01", timeRange: "20:00–02:00",
    zones: ["Zone A — Permit Holders Only", "Zone B — General Public Parking"],
    overrideMode: "suspend", priority: 95, status: "Past", notify: true,
  },
];

type FilterType = "All" | "Upcoming" | "Active" | "Past" | "Draft";

// ── Component ─────────────────────────────────────────────────────────────

export default function EventsCalendar() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterType>("All");
  const [search, setSearch] = useState("");
  const [openRowMenu, setOpenRowMenu] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenRowMenu(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredEvents = MOCK_EVENTS.filter((ev) => {
    if (filter !== "All") {
      if (filter === "Upcoming" && ev.status !== "Scheduled") return false;
      else if (filter !== "Upcoming" && ev.status !== filter) return false;
    }
    if (search && !ev.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const overrideModeLabel: Record<string, string> = { add: "Add policies", suspend: "Suspend base", replace: "Replace with" };

  return (
    <div className="flex-1 overflow-auto bg-[#eff6ff] dark:bg-[#0a1628] pb-8">
      <div className="px-8 pt-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-[22px] font-semibold text-[#111827] dark:text-[#e8eef5]">Special Events</h1>
            <p className="text-[14px] text-[#6b7280] dark:text-[#94a3b8] mt-1">
              Temporary policy overrides for game days, emergencies, and scheduled events
            </p>
          </div>
          <button
            onClick={() => navigate("/configuration/events/new")}
            className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium bg-[#3b82f6] dark:bg-[#2563eb] text-white rounded-lg hover:bg-[#2563eb] dark:hover:bg-[#1d4ed8] transition-colors"
          >
            <Plus className="size-4" /> New Event
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-4 shadow-sm flex flex-wrap gap-3 items-center mb-5">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#9ca3af]" />
            <input
              type="text"
              placeholder="Search events…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-[14px] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.2)] rounded-lg bg-transparent text-[#111827] dark:text-[#e8eef5] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterType)}
            className="px-4 py-2 text-[14px] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg bg-white dark:bg-[#0f1f35] text-[#111827] dark:text-[#e8eef5] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
          >
            {(["All", "Upcoming", "Active", "Draft", "Past"] as FilterType[]).map((f) => (
              <option key={f} value={f}>{f === "All" ? "All Statuses" : f}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f9fafb] dark:bg-[#0a1628] border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
                {["Event Name", "Date Range", "Zones", "Override Mode", "Status", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8] uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((ev) => (
                <tr key={ev.id} className="border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.08)] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.4)] transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <CalendarClock className="size-4 text-[#3b82f6] dark:text-[#60a5fa] flex-shrink-0" />
                      <span className="text-[14px] font-medium text-[#111827] dark:text-[#e8eef5]">{ev.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[13px] text-[#6b7280] dark:text-[#94a3b8] whitespace-nowrap">
                    {ev.timeRange === "In effect"
                      ? <span className="flex items-center gap-1.5 text-[#16a34a] dark:text-[#34d399] font-medium"><span className="size-1.5 rounded-full bg-[#16a34a] dark:bg-[#34d399]" />In effect now</span>
                      : <>{ev.startDate === ev.endDate ? ev.startDate : `${ev.startDate} – ${ev.endDate}`}<br /><span className="text-[12px]">{ev.timeRange}</span></>
                    }
                  </td>
                  <td className="px-4 py-4">
                    {ev.zones.length === ZONES.length
                      ? <span className="text-[13px] text-[#6b7280] dark:text-[#94a3b8]">All zones</span>
                      : <span className="text-[13px] text-[#6b7280] dark:text-[#94a3b8]">{ev.zones.length} zone{ev.zones.length !== 1 ? "s" : ""}</span>
                    }
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-1 text-[12px] font-medium rounded-full ${
                      ev.overrideMode === "suspend" ? "bg-[#fef3c7] dark:bg-[#78350f] text-[#92400e] dark:text-[#fcd34d]"
                      : ev.overrideMode === "replace" ? "bg-[#fee2e2] dark:bg-[#7f1d1d] text-[#dc2626] dark:text-[#fca5a5]"
                      : "bg-[#dbeafe] dark:bg-[#1e3a8a] text-[#1e40af] dark:text-[#93c5fd]"
                    }`}>
                      {overrideModeLabel[ev.overrideMode]}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[12px] font-semibold ${STATUS_STYLES[ev.status]}`}>
                      {ev.status}
                    </span>
                  </td>
                  <td className="px-4 py-4" ref={openRowMenu === ev.id ? menuRef : undefined}>
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-[#eff6ff] dark:hover:bg-[rgba(59,130,246,0.1)] transition-colors" title="Edit">
                        <Pencil className="size-3.5 text-[#3b82f6] dark:text-[#60a5fa]" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-[#fee2e2] dark:hover:bg-[#7f1d1d] transition-colors" title="Archive">
                        <Trash2 className="size-3.5 text-[#ef4444] dark:text-[#f87171]" />
                      </button>
                      <div className="relative">
                        <button
                          onClick={(e) => { e.stopPropagation(); setOpenRowMenu(openRowMenu === ev.id ? null : ev.id); }}
                          className="p-1.5 rounded-lg text-[#6b7280] dark:text-[#94a3b8] hover:bg-[#f3f4f6] dark:hover:bg-[rgba(30,58,95,0.5)] transition-colors"
                        >
                          <MoreHorizontal className="size-4" />
                        </button>
                        {openRowMenu === ev.id && (
                          <div className="absolute right-0 top-8 w-44 bg-white dark:bg-[#1a2d47] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-xl shadow-lg z-50 py-1 text-[13px]">
                            {["Duplicate", "View Trace"].map((item) => (
                              <button key={item} onClick={() => setOpenRowMenu(null)} className="w-full text-left px-4 py-2 text-[#111827] dark:text-[#e8eef5] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)] transition-colors">
                                {item}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredEvents.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[14px] text-[#6b7280] dark:text-[#94a3b8]">
                    No events match this filter
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

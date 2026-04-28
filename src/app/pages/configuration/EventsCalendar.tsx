import { useState, useRef, useEffect } from "react";
import {
  Plus, MoreHorizontal, CalendarClock, X, ChevronDown,
  AlertTriangle, CheckCircle2, Clock, Bell,
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

// ── Form state ────────────────────────────────────────────────────────────

interface FormState {
  name: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  timezone: string;
  targetZones: Set<string>;
  overrideMode: string;
  priorityBoost: string;
  overridePolicies: Set<string>;
  notifyPermitHolders: boolean;
}

const defaultForm = (): FormState => ({
  name: "", description: "",
  startDate: "", startTime: "08:00", endDate: "", endTime: "20:00",
  timezone: "America/Los_Angeles",
  targetZones: new Set(),
  overrideMode: "suspend",
  priorityBoost: "95",
  overridePolicies: new Set(),
  notifyPermitHolders: true,
});

// ── Component ─────────────────────────────────────────────────────────────

export default function EventsCalendar() {
  const [filter, setFilter] = useState<FilterType>("All");
  const [showForm, setShowForm] = useState(false);
  const [openRowMenu, setOpenRowMenu] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(defaultForm());
  const [submitted, setSubmitted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenRowMenu(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredEvents = MOCK_EVENTS.filter((ev) => {
    if (filter === "All") return true;
    if (filter === "Upcoming") return ev.status === "Scheduled";
    return ev.status === filter;
  });

  const toggleZone = (z: string) => {
    const s = new Set(form.targetZones);
    s.has(z) ? s.delete(z) : s.add(z);
    setForm({ ...form, targetZones: s });
  };

  const togglePolicy = (p: string) => {
    const s = new Set(form.overridePolicies);
    s.has(p) ? s.delete(p) : s.add(p);
    setForm({ ...form, overridePolicies: s });
  };

  const selectAllZones = () =>
    setForm({ ...form, targetZones: new Set(form.targetZones.size === ZONES.length ? [] : ZONES) });

  const handleSave = () => {
    setSubmitted(true);
    if (!form.name || !form.startDate || !form.endDate || form.targetZones.size === 0) return;
    setShowForm(false);
    setForm(defaultForm());
    setSubmitted(false);
  };

  const labelCls = "block text-[13px] font-medium text-[#374151] dark:text-[#cbd5e1] mb-1";
  const inputCls = "w-full bg-[#f9fafb] dark:bg-[#0a1628] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.2)] rounded-lg px-3 py-2 text-[13px] text-[#111827] dark:text-[#e8eef5] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]";
  const errCls = "mt-1 text-[11px] text-[#dc2626]";

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
            onClick={() => { setShowForm(true); setForm(defaultForm()); setSubmitted(false); }}
            className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium bg-[#3b82f6] dark:bg-[#2563eb] text-white rounded-lg hover:bg-[#2563eb] dark:hover:bg-[#1d4ed8] transition-colors"
          >
            <Plus className="size-4" /> New Event
          </button>
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-2 mb-5">
          {(["All", "Upcoming", "Active", "Draft", "Past"] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-colors ${
                filter === f
                  ? "bg-[#3b82f6] dark:bg-[#2563eb] text-white"
                  : "bg-white dark:bg-[#0f1f35] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] text-[#6b7280] dark:text-[#94a3b8] hover:bg-[#f3f4f6] dark:hover:bg-[rgba(30,58,95,0.5)]"
              }`}
            >
              {f}
              {f === "Active" && <span className="ml-1.5 size-1.5 rounded-full bg-[#16a34a] inline-block" />}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f9fafb] dark:bg-[#0a1628] border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
                {["Event Name", "Date Range", "Zones", "Override Mode", "Priority", "Status", ""].map((h) => (
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
                  <td className="px-4 py-4 text-[14px] font-semibold text-[#111827] dark:text-[#e8eef5]">{ev.priority}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[12px] font-semibold ${STATUS_STYLES[ev.status]}`}>
                      {ev.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 relative" ref={openRowMenu === ev.id ? menuRef : undefined}>
                    <button
                      onClick={(e) => { e.stopPropagation(); setOpenRowMenu(openRowMenu === ev.id ? null : ev.id); }}
                      className="p-1.5 rounded-lg text-[#6b7280] dark:text-[#94a3b8] hover:bg-[#f3f4f6] dark:hover:bg-[rgba(30,58,95,0.5)] transition-colors"
                    >
                      <MoreHorizontal className="size-4" />
                    </button>
                    {openRowMenu === ev.id && (
                      <div className="absolute right-4 top-10 w-44 bg-white dark:bg-[#1a2d47] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-xl shadow-lg z-50 py-1 text-[13px]">
                        {["Edit", "Duplicate", "View Trace", "Archive"].map((item) => (
                          <button key={item} onClick={() => setOpenRowMenu(null)} className="w-full text-left px-4 py-2 text-[#111827] dark:text-[#e8eef5] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)] transition-colors">
                            {item}
                          </button>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filteredEvents.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-[14px] text-[#6b7280] dark:text-[#94a3b8]">
                    No events match this filter
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── New Event slide-over ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div className="flex-1 bg-black/40 dark:bg-black/60" onClick={() => setShowForm(false)} />

          {/* Panel */}
          <div className="w-[480px] bg-white dark:bg-[#0f1f35] h-full flex flex-col shadow-2xl border-l border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
            {/* Panel header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
              <h2 className="text-[16px] font-semibold text-[#111827] dark:text-[#e8eef5]">New Special Event</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg text-[#6b7280] dark:text-[#94a3b8] hover:bg-[#f3f4f6] dark:hover:bg-[rgba(30,58,95,0.5)] transition-colors">
                <X className="size-5" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">

              {/* Name */}
              <div>
                <label className={labelCls}>Event Name <span className="text-[#dc2626]">*</span></label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Parade Day 2026" className={inputCls} />
                {submitted && !form.name && <p className={errCls}>Event name is required</p>}
              </div>

              {/* Description */}
              <div>
                <label className={labelCls}>Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Optional details about this event…" className={`${inputCls} resize-none`} />
              </div>

              {/* Date/time range */}
              <div>
                <label className={labelCls}>Start <span className="text-[#dc2626]">*</span></label>
                <div className="flex gap-2">
                  <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className={`${inputCls} flex-1`} />
                  <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} className={`${inputCls} w-28`} />
                </div>
                {submitted && !form.startDate && <p className={errCls}>Start date is required</p>}
              </div>
              <div>
                <label className={labelCls}>End <span className="text-[#dc2626]">*</span></label>
                <div className="flex gap-2">
                  <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className={`${inputCls} flex-1`} />
                  <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} className={`${inputCls} w-28`} />
                </div>
                {submitted && !form.endDate && <p className={errCls}>End date is required</p>}
              </div>
              <div>
                <label className={labelCls}>Timezone</label>
                <select value={form.timezone} onChange={(e) => setForm({ ...form, timezone: e.target.value })} className={inputCls}>
                  {TIMEZONES.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
                </select>
              </div>

              {/* Target zones */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className={`${labelCls} mb-0`}>Target Zones <span className="text-[#dc2626]">*</span></label>
                  <button onClick={selectAllZones} className="text-[12px] text-[#3b82f6] dark:text-[#60a5fa] hover:underline">
                    {form.targetZones.size === ZONES.length ? "Deselect all" : "Select all"}
                  </button>
                </div>
                <div className="border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.2)] rounded-lg overflow-hidden">
                  {ZONES.map((z, i) => (
                    <label key={z} className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.4)] transition-colors ${i > 0 ? "border-t border-[#e5e7eb] dark:border-[rgba(59,130,246,0.08)]" : ""}`}>
                      <input type="checkbox" checked={form.targetZones.has(z)} onChange={() => toggleZone(z)} className="size-4 accent-[#3b82f6]" />
                      <span className="text-[13px] text-[#111827] dark:text-[#e8eef5]">{z}</span>
                    </label>
                  ))}
                </div>
                {submitted && form.targetZones.size === 0 && <p className={errCls}>Select at least one zone</p>}
              </div>

              {/* Override mode */}
              <div>
                <label className={labelCls}>Override Mode</label>
                <div className="flex flex-col gap-2">
                  {OVERRIDE_MODES.map((m) => (
                    <label key={m.id} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      form.overrideMode === m.id
                        ? "border-[#3b82f6] bg-[#eff6ff] dark:bg-[rgba(59,130,246,0.08)] dark:border-[#3b82f6]"
                        : "border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.3)]"
                    }`}>
                      <input type="radio" name="overrideMode" value={m.id} checked={form.overrideMode === m.id} onChange={() => setForm({ ...form, overrideMode: m.id })} className="mt-0.5 size-4 accent-[#3b82f6]" />
                      <div>
                        <p className="text-[13px] font-medium text-[#111827] dark:text-[#e8eef5]">{m.label}</p>
                        <p className="text-[12px] text-[#6b7280] dark:text-[#94a3b8] mt-0.5">{m.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Priority boost */}
              <div>
                <label className={labelCls}>Priority Boost</label>
                <input type="number" min={1} max={100} value={form.priorityBoost} onChange={(e) => setForm({ ...form, priorityBoost: e.target.value })} className={`${inputCls} w-28`} />
                <p className="mt-1 text-[12px] text-[#6b7280] dark:text-[#94a3b8]">Default 95 — ensures events outrank normal policies</p>
              </div>

              {/* Override policies */}
              <div>
                <label className={labelCls}>Override Policies</label>
                <div className="flex flex-wrap gap-2">
                  {OVERRIDE_TEMPLATES.map((t) => (
                    <button
                      key={t}
                      onClick={() => togglePolicy(t)}
                      className={`px-3 py-1.5 text-[12px] font-medium rounded-full border transition-colors ${
                        form.overridePolicies.has(t)
                          ? "bg-[#3b82f6] dark:bg-[#2563eb] text-white border-[#3b82f6]"
                          : "border-[#e5e7eb] dark:border-[rgba(59,130,246,0.2)] text-[#6b7280] dark:text-[#94a3b8] hover:border-[#3b82f6] hover:text-[#3b82f6]"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notification toggle */}
              <div>
                <label className={labelCls}>Notifications</label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    onClick={() => setForm({ ...form, notifyPermitHolders: !form.notifyPermitHolders })}
                    className={`relative w-10 h-5.5 rounded-full transition-colors ${form.notifyPermitHolders ? "bg-[#3b82f6]" : "bg-[#d1d5db] dark:bg-[#374151]"}`}
                    style={{ height: "22px" }}
                  >
                    <span className={`absolute top-0.5 size-4.5 rounded-full bg-white shadow transition-transform ${form.notifyPermitHolders ? "translate-x-5" : "translate-x-0.5"}`} style={{ width: "18px", height: "18px" }} />
                  </div>
                  <span className="text-[13px] text-[#111827] dark:text-[#e8eef5]">Auto-email affected permit holders</span>
                </label>
              </div>

            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] flex items-center justify-between gap-3">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-[13px] font-medium border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.2)] rounded-lg text-[#111827] dark:text-[#e8eef5] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)] transition-colors">
                Cancel
              </button>
              <div className="flex items-center gap-2">
                <button onClick={() => setShowForm(false)} className="px-4 py-2 text-[13px] font-medium border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.2)] rounded-lg text-[#111827] dark:text-[#e8eef5] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)] transition-colors">
                  Save Draft
                </button>
                <button onClick={handleSave} className="px-4 py-2 text-[13px] font-medium bg-[#3b82f6] dark:bg-[#2563eb] text-white rounded-lg hover:bg-[#2563eb] dark:hover:bg-[#1d4ed8] transition-colors">
                  Save Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

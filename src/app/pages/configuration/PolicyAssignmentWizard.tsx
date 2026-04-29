import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import {
  Check, Search, Map, Upload, Plus, Trash2,
  AlertTriangle, CheckCircle2, AlertCircle, Info,
} from "lucide-react";

// ── Data ──────────────────────────────────────────────────────────────────

type TargetItem = { id: string; name: string; site: string; detail?: string };

const TARGET_DATA: Record<string, TargetItem[]> = {
  Zone: [
    { id: "zone-a", name: "Zone A — Permit Holders Only",         site: "UCLA Campus Parking",    detail: "80 stalls" },
    { id: "zone-b", name: "Zone B — General Public Parking",      site: "UCLA Campus Parking",    detail: "75 stalls" },
    { id: "zone-c", name: "Zone C — Faculty & Staff Reserved",    site: "UCLA Campus Parking",    detail: "60 stalls" },
    { id: "zone-d", name: "Zone D — Short-Term Visitor (2-Hour)", site: "Stanford University",    detail: "50 stalls" },
    { id: "zone-e", name: "Zone E — EV Charging Stations",        site: "UT Austin Campus",       detail: "20 stalls" },
    { id: "zone-f", name: "Zone F — Accessible Parking (ADA)",    site: "University of Michigan", detail: "55 stalls" },
    { id: "zone-g", name: "Zone G — Event Day Overflow",          site: "UCLA Campus Parking",    detail: "100 stalls" },
    { id: "zone-h", name: "Zone H — Motorcycle & Bicycle",        site: "UCLA Campus Parking",    detail: "40 stalls" },
  ],
  Level: [
    { id: "lev-np1", name: "North Parking Structure — Level 1", site: "UCLA Campus Parking", detail: "80 stalls" },
    { id: "lev-np2", name: "North Parking Structure — Level 2", site: "UCLA Campus Parking", detail: "80 stalls" },
    { id: "lev-np3", name: "North Parking Structure — Level 3", site: "UCLA Campus Parking", detail: "80 stalls" },
    { id: "lev-ml1", name: "Meyer Library Garage — Level 1",    site: "Stanford University",  detail: "70 stalls" },
    { id: "lev-ml2", name: "Meyer Library Garage — Level 2",    site: "Stanford University",  detail: "70 stalls" },
    { id: "lev-bz1", name: "Brazos Garage — Level 1",           site: "UT Austin Campus",     detail: "80 stalls" },
  ],
  Stall: [
    { id: "s-401", name: "S-401", site: "UCLA Campus Parking", detail: "North Structure · Level 4 · Aisle A" },
    { id: "s-402", name: "S-402", site: "UCLA Campus Parking", detail: "North Structure · Level 4 · Aisle A" },
    { id: "s-403", name: "S-403", site: "UCLA Campus Parking", detail: "North Structure · Level 4 · Aisle A" },
    { id: "s-409", name: "S-409", site: "UCLA Campus Parking", detail: "North Structure · Level 4 · Aisle B" },
    { id: "s-410", name: "S-410", site: "UCLA Campus Parking", detail: "North Structure · Level 4 · Aisle B" },
  ],
};

const SITES = ["All Sites", "UCLA Campus Parking", "Stanford University", "University of Michigan", "UT Austin Campus"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TIMEZONES = ["America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles", "America/Phoenix"];
const PERMITTED_TYPES = ["RESIDENT", "EMPLOYEE", "COMMERCIAL", "FLEET", "MONTHLY"];
const EXEMPTION_TYPES = [
  { key: "handicap",   label: "HANDICAP (plate or placard)" },
  { key: "government", label: "GOVERNMENT plates" },
  { key: "emergency",  label: "EMERGENCY VEHICLES" },
];
const ESCALATION_OPTIONS = ["Use Default", "None", "Standard (+$25 / +$50 / +$100)", "Aggressive (+$50 / +$100 / +$200)"];

type TargetType = "Zone" | "Level" | "Stall";
type TimeWindow = { id: string; days: Set<string>; start: string; end: string };
const uid = () => Math.random().toString(36).slice(2, 8);
const defaultWindow = (): TimeWindow => ({ id: uid(), days: new Set(["Mon", "Tue", "Wed", "Thu", "Fri"]), start: "08:00", end: "18:00" });

// ── Style constants (matches NewTariff / NewPermit) ────────────────────────

const labelCls = "block text-sm font-medium text-[#111827] dark:text-[#e8eef5] mb-2";
const inputCls = "w-full bg-white dark:bg-[#1a2d47] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg px-4 py-2 text-sm text-[#111827] dark:text-[#e8eef5] placeholder:text-[#6b7280] dark:placeholder:text-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent";

// ─────────────────────────────────────────────────────────────────────────

export default function PolicyAssignmentWizard() {
  const navigate = useNavigate();
  const location = useLocation();
  const templateName: string = (location.state as { templateName?: string })?.templateName ?? "2-Hour Free Parking";

  const [submitted, setSubmitted] = useState(false);

  // Target selection
  const [targetType, setTargetType] = useState<TargetType>("Zone");
  const [selectedTargets, setSelectedTargets] = useState<Set<string>>(new Set());
  const [siteFilter, setSiteFilter] = useState("All Sites");
  const [targetSearch, setTargetSearch] = useState("");
  const [listTab, setListTab] = useState<"list" | "map" | "bulk">("list");
  const [bulkText, setBulkText] = useState("");

  // Rule parameters
  const [maxDwell, setMaxDwell] = useState("120");
  const [arrivalGrace, setArrivalGrace] = useState("300");
  const [departureGrace, setDepartureGrace] = useState("600");
  const [priority, setPriority] = useState("50");
  const [fineAmount, setFineAmount] = useState("50.00");
  const [escalation, setEscalation] = useState("Use Default");
  const [paidOverlay, setPaidOverlay] = useState(false);
  const [overlayHourlyRate, setOverlayHourlyRate] = useState("3.00");
  const [overlayDailyCap, setOverlayDailyCap] = useState("24.00");

  // Validity
  const [effectiveFrom, setEffectiveFrom] = useState("2026-05-01");
  const [effectiveFromTime, setEffectiveFromTime] = useState("00:00");
  const [effectiveTo, setEffectiveTo] = useState("");
  const [effectiveToTime, setEffectiveToTime] = useState("");
  const [neverExpires, setNeverExpires] = useState(true);
  const [timezone, setTimezone] = useState("America/New_York");
  const [timeWindows, setTimeWindows] = useState<TimeWindow[]>([defaultWindow()]);
  const [holidayCalendar, setHolidayCalendar] = useState("US Federal");

  // Permits & Exemptions
  const [permittedTypes, setPermittedTypes] = useState<Set<string>>(new Set());
  const [exemptions, setExemptions] = useState<Set<string>>(new Set(["handicap", "government"]));

  // Approval
  const [requireApproval, setRequireApproval] = useState(true);

  // ── Target helpers ────────────────────────────────────────────────────────

  const visibleTargets = (TARGET_DATA[targetType] ?? []).filter((t) => {
    const matchesSite = siteFilter === "All Sites" || t.site === siteFilter;
    const matchesSearch = t.name.toLowerCase().includes(targetSearch.toLowerCase());
    return matchesSite && matchesSearch;
  });

  const toggleTarget = (id: string) => {
    const n = new Set(selectedTargets);
    n.has(id) ? n.delete(id) : n.add(id);
    setSelectedTargets(n);
  };

  const toggleAllVisible = () => {
    const allSelected = visibleTargets.every((t) => selectedTargets.has(t.id));
    const n = new Set(selectedTargets);
    visibleTargets.forEach((t) => allSelected ? n.delete(t.id) : n.add(t.id));
    setSelectedTargets(n);
  };

  // ── Time window helpers ───────────────────────────────────────────────────

  const addWindow = () => setTimeWindows((p) => [...p, defaultWindow()]);
  const removeWindow = (id: string) => setTimeWindows((p) => p.filter((w) => w.id !== id));
  const updateWindow = (id: string, field: "start" | "end", val: string) =>
    setTimeWindows((p) => p.map((w) => w.id === id ? { ...w, [field]: val } : w));
  const toggleDay = (winId: string, day: string) =>
    setTimeWindows((p) => p.map((w) => {
      if (w.id !== winId) return w;
      const d = new Set(w.days);
      d.has(day) ? d.delete(day) : d.add(day);
      return { ...w, days: d };
    }));

  // ── Permit / Exemption helpers ────────────────────────────────────────────

  const togglePermit = (pt: string) => {
    const n = new Set(permittedTypes);
    n.has(pt) ? n.delete(pt) : n.add(pt);
    setPermittedTypes(n);
  };

  const toggleExemption = (key: string) => {
    const n = new Set(exemptions);
    n.has(key) ? n.delete(key) : n.add(key);
    setExemptions(n);
  };

  const handleSave = () => {
    setSubmitted(true);
    if (selectedTargets.size === 0 || !effectiveFrom) return;
    navigate("/configuration/policies/assignments");
  };

  return (
    <>
      <div className="flex-1 overflow-auto bg-[#eff6ff] dark:bg-[#0a1628] pb-24">

        {/* Breadcrumb */}
        <div className="px-8 pt-6">
          <div className="flex items-center gap-2 text-[14px] text-[#6b7280] dark:text-[#94a3b8]">
            <Link to="/" className="hover:text-[#3b82f6]">Home</Link>
            <span>›</span>
            <Link to="/configuration/policies/assignments" className="hover:text-[#3b82f6]">Policy Assignments</Link>
            <span>›</span>
            <span className="text-[#111827] dark:text-[#e8eef5]">New Assignment</span>
          </div>
        </div>

        <div className="px-8 pt-4 pb-6">
          <h1 className="font-semibold text-[24px] leading-[32px] text-[#111827] dark:text-[#e8eef5]">New Assignment</h1>
          <p className="text-[14px] text-[#6b7280] dark:text-[#94a3b8] mt-1">Bind a policy template to spatial targets with a custom validity window</p>
        </div>

        <div className="px-8">
          <div className="grid grid-cols-5 gap-6">

            {/* ── Main Form ── */}
            <div className="col-span-3 space-y-6">

              {/* Template */}
              <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6">
                <h2 className="font-semibold text-[#111827] dark:text-[#e8eef5] text-lg mb-4">Template</h2>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-[#eff6ff] dark:bg-[rgba(59,130,246,0.08)] border border-[#bfdbfe] dark:border-[rgba(59,130,246,0.2)]">
                  <Check className="size-4 text-[#3b82f6] flex-shrink-0" />
                  <span className="text-sm font-medium text-[#1e40af] dark:text-[#93c5fd]">{templateName}</span>
                  <button className="ml-auto text-xs text-[#3b82f6] hover:underline">Change</button>
                </div>
              </div>

              {/* Target Selection */}
              <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6">
                <h2 className="font-semibold text-[#111827] dark:text-[#e8eef5] text-lg mb-5">Target <span className="text-[#ef4444]">*</span></h2>

                {/* Target type */}
                <div className="mb-5">
                  <label className={labelCls}>Target Type</label>
                  <div className="flex gap-4">
                    {(["Zone"] as TargetType[]).map((t) => (
                      <label key={t} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={targetType === t}
                          onChange={() => { setTargetType(t); setSelectedTargets(new Set()); setTargetSearch(""); }}
                          className="size-4 accent-[#3b82f6]"
                        />
                        <span className="text-sm text-[#111827] dark:text-[#e8eef5]">{t}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Sub-tabs */}
                <div className="border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg overflow-hidden">
                  <div className="flex border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] px-4 pt-2 bg-[#f9fafb] dark:bg-[#0a1628]">
                    {([["list", "List"], ["map", "Map"], ["bulk", "Bulk Import"]] as const).map(([id, label]) => (
                      <button
                        key={id}
                        onClick={() => setListTab(id)}
                        className={`px-4 py-2 text-[13px] font-medium transition-colors ${
                          listTab === id
                            ? "text-[#3b82f6] dark:text-[#60a5fa] border-b-2 border-[#3b82f6] dark:border-[#60a5fa]"
                            : "text-[#6b7280] dark:text-[#94a3b8] hover:text-[#111827] dark:hover:text-[#e8eef5]"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {listTab === "list" && (
                    <div className="p-4 space-y-3">
                      <div className="flex gap-3">
                        <select value={siteFilter} onChange={(e) => setSiteFilter(e.target.value)} className={`${inputCls} flex-1`}>
                          {SITES.map((s) => <option key={s}>{s}</option>)}
                        </select>
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#9ca3af]" />
                          <input
                            type="text"
                            placeholder={`Search ${targetType.toLowerCase()}s…`}
                            value={targetSearch}
                            onChange={(e) => setTargetSearch(e.target.value)}
                            className={`${inputCls} pl-9`}
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between px-1">
                        <label className="flex items-center gap-2 cursor-pointer text-sm text-[#6b7280] dark:text-[#94a3b8]">
                          <input
                            type="checkbox"
                            checked={visibleTargets.length > 0 && visibleTargets.every((t) => selectedTargets.has(t.id))}
                            onChange={toggleAllVisible}
                            className="size-4 accent-[#3b82f6]"
                          />
                          Select all visible
                        </label>
                        <span className="text-xs text-[#6b7280] dark:text-[#94a3b8]">{visibleTargets.length} shown</span>
                      </div>
                      <div className="max-h-60 overflow-y-auto border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg divide-y divide-[#e5e7eb] dark:divide-[rgba(59,130,246,0.1)]">
                        {visibleTargets.length === 0 ? (
                          <p className="px-4 py-6 text-center text-sm text-[#9ca3af]">No {targetType.toLowerCase()}s match your filters</p>
                        ) : visibleTargets.map((t) => (
                          <label key={t.id} className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors ${selectedTargets.has(t.id) ? "bg-[#eff6ff] dark:bg-[rgba(59,130,246,0.06)]" : "hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.4)]"}`}>
                            <input type="checkbox" checked={selectedTargets.has(t.id)} onChange={() => toggleTarget(t.id)} className="size-4 mt-0.5 accent-[#3b82f6]" />
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-[#111827] dark:text-[#e8eef5] truncate">{t.name}</p>
                              <p className="text-xs text-[#6b7280] dark:text-[#94a3b8]">{t.site}{t.detail ? ` · ${t.detail}` : ""}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {listTab === "map" && (
                    <div className="h-56 flex flex-col items-center justify-center gap-3 text-center p-6">
                      <div className="bg-[#dbeafe] dark:bg-[#1e3a8a] rounded-xl p-4">
                        <Map className="size-8 text-[#3b82f6] dark:text-[#60a5fa]" />
                      </div>
                      <p className="text-sm font-medium text-[#111827] dark:text-[#e8eef5]">Interactive Map Selection</p>
                      <p className="text-xs text-[#6b7280] dark:text-[#94a3b8] max-w-xs">Click-and-drag lasso select or Shift-click to multi-select zone polygons.</p>
                      <span className="text-xs px-3 py-1 rounded-full bg-[#f3f4f6] dark:bg-[#1a2d47] text-[#6b7280] dark:text-[#94a3b8]">Map integration coming soon</span>
                    </div>
                  )}

                  {listTab === "bulk" && (
                    <div className="p-4 space-y-3">
                      <p className="text-sm text-[#6b7280] dark:text-[#94a3b8]">
                        Paste a list of {targetType.toLowerCase()} IDs (one per line) or upload a CSV with a <code className="text-[#3b82f6] bg-[#eff6ff] dark:bg-[rgba(59,130,246,0.1)] px-1 rounded">{targetType.toLowerCase()}_id</code> column.
                      </p>
                      <textarea rows={5} placeholder={`zone-a\nzone-b\nzone-c`} value={bulkText} onChange={(e) => setBulkText(e.target.value)} className={`${inputCls} resize-none font-mono text-sm`} />
                      <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg text-[#111827] dark:text-[#e8eef5] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)] transition-colors">
                        <Upload className="size-4" /> Upload CSV file
                      </button>
                    </div>
                  )}
                </div>
                {submitted && selectedTargets.size === 0 && <p className="mt-2 text-xs text-[#ef4444]">Select at least one target</p>}
              </div>

              {/* Rule Parameters */}
              <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6">
                <h2 className="font-semibold text-[#111827] dark:text-[#e8eef5] text-lg mb-5">Rule Parameters</h2>
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Max Dwell (min) <span className="text-[#ef4444]">*</span></label>
                      <input type="number" min={0} value={maxDwell} onChange={(e) => setMaxDwell(e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Priority (0–100) <span className="text-[#ef4444]">*</span></label>
                      <input type="number" min={0} max={100} value={priority} onChange={(e) => setPriority(e.target.value)} className={inputCls} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Arrival Grace (sec)</label>
                      <input type="number" min={0} value={arrivalGrace} onChange={(e) => setArrivalGrace(e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Departure Grace (sec)</label>
                      <input type="number" min={0} value={departureGrace} onChange={(e) => setDepartureGrace(e.target.value)} className={inputCls} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Fine Amount ($)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280] text-sm">$</span>
                        <input type="number" min={0} step={0.01} value={fineAmount} onChange={(e) => setFineAmount(e.target.value)} className={`${inputCls} pl-7`} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Escalation Tiers</label>
                      <select value={escalation} onChange={(e) => setEscalation(e.target.value)} className={inputCls}>
                        {ESCALATION_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Paid Overlay toggle */}
                  <div className="rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] overflow-hidden">
                    <label className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.3)] transition-colors">
                      <div>
                        <span className="text-sm font-medium text-[#111827] dark:text-[#e8eef5]">Add Paid Overlay</span>
                        <span className="ml-2 text-xs text-[#6b7280] dark:text-[#94a3b8]">creates a Dual Rule Set</span>
                      </div>
                      <input type="checkbox" checked={paidOverlay} onChange={(e) => setPaidOverlay(e.target.checked)} className="size-4 accent-[#3b82f6]" />
                    </label>
                    {paidOverlay && (
                      <div className="px-4 pb-4 pt-2 border-t border-[#e5e7eb] dark:border-[rgba(59,130,246,0.1)] bg-[#f9fafb] dark:bg-[#0a1628] grid grid-cols-2 gap-4">
                        <div>
                          <label className={labelCls}>Hourly Rate ($)</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280] text-sm">$</span>
                            <input type="number" min={0} step={0.01} value={overlayHourlyRate} onChange={(e) => setOverlayHourlyRate(e.target.value)} className={`${inputCls} pl-7`} />
                          </div>
                        </div>
                        <div>
                          <label className={labelCls}>Daily Cap ($)</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280] text-sm">$</span>
                            <input type="number" min={0} step={0.01} value={overlayDailyCap} onChange={(e) => setOverlayDailyCap(e.target.value)} className={`${inputCls} pl-7`} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Validity */}
              <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6">
                <h2 className="font-semibold text-[#111827] dark:text-[#e8eef5] text-lg mb-5">Validity</h2>
                <div className="space-y-5">
                  {/* Effective dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Effective From <span className="text-[#ef4444]">*</span></label>
                      <div className="flex gap-2">
                        <input type="date" value={effectiveFrom} onChange={(e) => setEffectiveFrom(e.target.value)} className={`${inputCls} flex-1`} />
                        <input type="time" value={effectiveFromTime} onChange={(e) => setEffectiveFromTime(e.target.value)} className="w-28 bg-white dark:bg-[#1a2d47] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg px-3 py-2 text-sm text-[#111827] dark:text-[#e8eef5] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]" />
                      </div>
                      {submitted && !effectiveFrom && <p className="mt-1 text-xs text-[#ef4444]">Effective from date is required</p>}
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-[#111827] dark:text-[#e8eef5]">Effective To</label>
                        <label className="flex items-center gap-1.5 text-xs text-[#6b7280] dark:text-[#94a3b8] cursor-pointer">
                          <input type="checkbox" checked={neverExpires} onChange={(e) => setNeverExpires(e.target.checked)} className="size-3.5 accent-[#3b82f6]" />
                          Never expires
                        </label>
                      </div>
                      <div className="flex gap-2">
                        <input type="date" value={effectiveTo} onChange={(e) => setEffectiveTo(e.target.value)} disabled={neverExpires} className={`${inputCls} flex-1 disabled:opacity-40`} />
                        <input type="time" value={effectiveToTime} onChange={(e) => setEffectiveToTime(e.target.value)} disabled={neverExpires} className="w-28 bg-white dark:bg-[#1a2d47] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg px-3 py-2 text-sm text-[#111827] dark:text-[#e8eef5] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] disabled:opacity-40" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Timezone</label>
                    <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className={`${inputCls} max-w-xs`}>
                      {TIMEZONES.map((tz) => <option key={tz}>{tz}</option>)}
                    </select>
                  </div>

                  {/* Time windows */}
                  <div>
                    <label className={labelCls}>Recurring Time Windows</label>
                    <div className="space-y-3">
                      {timeWindows.map((w, idx) => (
                        <div key={w.id} className="border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-[#374151] dark:text-[#94a3b8]">Window {idx + 1}</span>
                            {timeWindows.length > 1 && (
                              <button onClick={() => removeWindow(w.id)} className="text-xs text-[#dc2626] hover:text-[#b91c1c] flex items-center gap-1 transition-colors">
                                <Trash2 className="size-3.5" /> Remove
                              </button>
                            )}
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            {DAYS.map((day) => (
                              <button
                                key={day}
                                onClick={() => toggleDay(w.id, day)}
                                className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
                                  w.days.has(day)
                                    ? "bg-[#3b82f6] text-white border-[#3b82f6]"
                                    : "border-[#e5e7eb] dark:border-[rgba(59,130,246,0.2)] text-[#6b7280] dark:text-[#94a3b8] hover:border-[#3b82f6]"
                                }`}
                              >
                                {day}
                              </button>
                            ))}
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-[#6b7280] dark:text-[#94a3b8] mb-1">Start</label>
                              <input type="time" value={w.start} onChange={(e) => updateWindow(w.id, "start", e.target.value)} className={inputCls} />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-[#6b7280] dark:text-[#94a3b8] mb-1">End</label>
                              <input type="time" value={w.end} onChange={(e) => updateWindow(w.id, "end", e.target.value)} className={inputCls} />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button onClick={addWindow} className="flex items-center gap-2 text-sm font-medium text-[#3b82f6] dark:text-[#60a5fa] hover:text-[#2563eb] transition-colors">
                        <Plus className="size-4" /> Add another window
                      </button>
                    </div>
                  </div>

                  {/* Calendar exclusions */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Holiday Calendar</label>
                      <select value={holidayCalendar} onChange={(e) => setHolidayCalendar(e.target.value)} className={inputCls}>
                        {["US Federal", "US State", "None"].map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Link Special Events</label>
                      <button className="flex items-center gap-2 w-full px-4 py-2 border border-dashed border-[#d1d5db] dark:border-[rgba(59,130,246,0.3)] rounded-lg text-sm text-[#3b82f6] dark:text-[#60a5fa] hover:bg-[#eff6ff] dark:hover:bg-[rgba(59,130,246,0.05)] transition-colors">
                        <Plus className="size-4" /> Select events
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Permits & Exemptions */}
              <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6">
                <h2 className="font-semibold text-[#111827] dark:text-[#e8eef5] text-lg mb-5">Permits & Exemptions</h2>
                <div className="space-y-5">
                  <div>
                    <label className={labelCls}>Permitted Types</label>
                    <p className="text-xs text-[#6b7280] dark:text-[#94a3b8] mb-3">Optional — only these permit types may park. Leave empty to allow all.</p>
                    <div className="flex flex-wrap gap-3">
                      {PERMITTED_TYPES.map((pt) => (
                        <label key={pt} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={permittedTypes.has(pt)} onChange={() => togglePermit(pt)} className="size-4 accent-[#3b82f6]" />
                          <span className="text-sm font-mono text-[#111827] dark:text-[#e8eef5]">{pt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] pt-5">
                    <label className={labelCls}>Exemptions</label>
                    <p className="text-xs text-[#6b7280] dark:text-[#94a3b8] mb-3">These vehicles are NOT subject to enforcement.</p>
                    <div className="space-y-2">
                      {EXEMPTION_TYPES.map(({ key, label }) => (
                        <label key={key} className="flex items-center gap-3 px-4 py-3 rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] cursor-pointer hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.4)] transition-colors">
                          <input type="checkbox" checked={exemptions.has(key)} onChange={() => toggleExemption(key)} className="size-4 accent-[#3b82f6]" />
                          <span className="text-sm text-[#111827] dark:text-[#e8eef5]">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Conflicts & Approval */}
              <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6">
                <h2 className="font-semibold text-[#111827] dark:text-[#e8eef5] text-lg mb-5">Approval</h2>

                {/* Conflict preview */}
                <div className="mb-5 rounded-lg bg-[#fffbeb] dark:bg-[rgba(120,53,15,0.2)] border border-[#fbbf24]/40 dark:border-[#f59e0b]/30 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="size-4 text-[#d97706] dark:text-[#fbbf24]" />
                    <span className="text-sm font-semibold text-[#92400e] dark:text-[#fbbf24]">Conflict Check — 2 found</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { title: `Target already has "Permit-Only Level 4" (pri 85)`, detail: "Dual Rule Set will evaluate both; priority 85 wins on overlap." },
                      { title: `Overlaps with Special Event "Event Day Overflow" (pri 90)`, detail: "Event override (pri 90) will supersede this policy during the event window." },
                    ].map(({ title, detail }, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <AlertCircle className="size-3.5 text-[#d97706] dark:text-[#fbbf24] flex-shrink-0 mt-0.5" />
                        <div className="text-xs">
                          <p className="text-[#92400e] dark:text-[#fde68a] font-medium">• {title}</p>
                          <p className="text-[#78350f] dark:text-[#fcd34d] mt-0.5">↳ {detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={requireApproval} onChange={(e) => setRequireApproval(e.target.checked)} className="size-4 mt-0.5 accent-[#3b82f6]" />
                  <div>
                    <p className="text-sm font-medium text-[#111827] dark:text-[#e8eef5]">Require second-admin approval before activation</p>
                    <p className="text-xs text-[#6b7280] dark:text-[#94a3b8] mt-0.5">Policy will enter "Pending Approval" state until a second admin confirms.</p>
                  </div>
                </label>
              </div>
            </div>

            {/* ── Summary Sidebar ── */}
            <div className="col-span-2">
              <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6 sticky top-6">
                <h2 className="font-semibold text-[#111827] dark:text-[#e8eef5] text-lg mb-5">Summary</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Template</span>
                    <div className="flex items-center gap-2">
                      <Check className="size-4 text-[#10b981]" />
                      <span className="text-sm font-medium text-[#111827] dark:text-[#e8eef5]">{templateName}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Target Type</span>
                    <span className="text-sm font-medium text-[#111827] dark:text-[#e8eef5]">{targetType}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Targets</span>
                    <div className="flex items-center gap-2">
                      {selectedTargets.size > 0 && <Check className="size-4 text-[#10b981]" />}
                      <span className={`text-sm ${selectedTargets.size > 0 ? "text-[#111827] dark:text-[#e8eef5] font-medium" : "text-[#9ca3af]"}`}>
                        {selectedTargets.size === 0 ? "None selected" : `${selectedTargets.size} ${targetType.toLowerCase()}${selectedTargets.size !== 1 ? "s" : ""}`}
                      </span>
                    </div>
                  </div>
                  <div className="border-t border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Effective From</span>
                      <div className="flex items-center gap-2">
                        {effectiveFrom && <Check className="size-4 text-[#10b981]" />}
                        <span className={`text-sm ${effectiveFrom ? "text-[#111827] dark:text-[#e8eef5] font-medium" : "text-[#9ca3af]"}`}>
                          {effectiveFrom || "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Effective To</span>
                    <span className="text-sm font-medium text-[#111827] dark:text-[#e8eef5]">{neverExpires ? "Indefinite" : (effectiveTo || "—")}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Priority</span>
                    <span className="text-sm font-medium text-[#111827] dark:text-[#e8eef5]">{priority || "—"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Time Windows</span>
                    <div className="flex items-center gap-2">
                      <Check className="size-4 text-[#10b981]" />
                      <span className="text-sm font-medium text-[#111827] dark:text-[#e8eef5]">{timeWindows.length} window{timeWindows.length !== 1 ? "s" : ""}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Max Dwell</span>
                    <span className="text-sm font-medium text-[#111827] dark:text-[#e8eef5]">{maxDwell ? `${maxDwell} min` : "—"}</span>
                  </div>
                  {exemptions.size > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Exemptions</span>
                      <span className="text-sm font-medium text-[#111827] dark:text-[#e8eef5]">{exemptions.size} applied</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex items-start gap-2 p-3 rounded-lg bg-[#eff6ff] dark:bg-[rgba(59,130,246,0.08)] border border-[#bfdbfe] dark:border-[rgba(59,130,246,0.2)]">
                  <Info className="size-4 text-[#3b82f6] flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-[#1e40af] dark:text-[#93c5fd]">The higher-priority policy wins when multiple assignments overlap on the same target and time window.</p>
                </div>

                {requireApproval && (
                  <div className="mt-3 flex items-center gap-2 p-3 rounded-lg bg-[#fef3c7] dark:bg-[rgba(120,53,15,0.2)] border border-[#fbbf24]/40">
                    <AlertTriangle className="size-4 text-[#d97706] flex-shrink-0" />
                    <p className="text-xs text-[#92400e] dark:text-[#fde68a]">Pending approval required before activation</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#0f1f35] border-t border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] px-8 py-4 z-10">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate("/configuration/policies/assignments")} className="border border-[#e5e7eb] text-[#111827] dark:text-[#e8eef5] font-medium rounded-lg px-6 py-2 hover:bg-[#eff6ff] dark:hover:bg-[rgba(30,58,95,0.3)] transition-colors">
            Cancel
          </button>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/configuration/policies/assignments")} className="border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.2)] text-[#111827] dark:text-[#e8eef5] font-medium rounded-lg px-5 py-2 hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)] transition-colors text-sm">
              Save Draft
            </button>
            <button onClick={handleSave} className="bg-[#3b82f6] text-white font-medium rounded-lg px-6 py-2 hover:bg-[#2563eb] transition-colors flex items-center gap-2">
              <CheckCircle2 className="size-4" />
              Publish & Activate
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

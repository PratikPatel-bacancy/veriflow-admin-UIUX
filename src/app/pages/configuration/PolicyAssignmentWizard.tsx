import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  ChevronRight,
  Check,
  Search,
  Map,
  Upload,
  Info,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

// ── Real data ─────────────────────────────────────────────────────────────

type TargetItem = { id: string; name: string; site: string; detail?: string };

const TARGET_DATA: Record<string, TargetItem[]> = {
  Zone: [
    { id: "zone-a", name: "Zone A — Permit Holders Only",        site: "UCLA Campus Parking",      detail: "80 stalls" },
    { id: "zone-b", name: "Zone B — General Public Parking",     site: "UCLA Campus Parking",      detail: "75 stalls" },
    { id: "zone-c", name: "Zone C — Faculty & Staff Reserved",   site: "UCLA Campus Parking",      detail: "60 stalls" },
    { id: "zone-d", name: "Zone D — Short-Term Visitor (2-Hour)",site: "Stanford University",      detail: "50 stalls" },
    { id: "zone-e", name: "Zone E — EV Charging Stations",       site: "UT Austin Campus",         detail: "20 stalls" },
    { id: "zone-f", name: "Zone F — Accessible Parking (ADA)",   site: "University of Michigan",   detail: "55 stalls" },
    { id: "zone-g", name: "Zone G — Event Day Overflow",         site: "UCLA Campus Parking",      detail: "100 stalls" },
    { id: "zone-h", name: "Zone H — Motorcycle & Bicycle",       site: "UCLA Campus Parking",      detail: "40 stalls" },
  ],
  Level: [
    { id: "lev-np1", name: "North Parking Structure — Level 1", site: "UCLA Campus Parking",  detail: "80 stalls" },
    { id: "lev-np2", name: "North Parking Structure — Level 2", site: "UCLA Campus Parking",  detail: "80 stalls" },
    { id: "lev-np3", name: "North Parking Structure — Level 3", site: "UCLA Campus Parking",  detail: "80 stalls" },
    { id: "lev-np4", name: "North Parking Structure — Level 4", site: "UCLA Campus Parking",  detail: "80 stalls" },
    { id: "lev-ml1", name: "Meyer Library Garage — Level 1",    site: "Stanford University",  detail: "70 stalls" },
    { id: "lev-ml2", name: "Meyer Library Garage — Level 2",    site: "Stanford University",  detail: "70 stalls" },
    { id: "lev-ml3", name: "Meyer Library Garage — Level 3",    site: "Stanford University",  detail: "70 stalls" },
    { id: "lev-bz1", name: "Brazos Garage — Level 1",           site: "UT Austin Campus",     detail: "80 stalls" },
    { id: "lev-bz2", name: "Brazos Garage — Level 2",           site: "UT Austin Campus",     detail: "80 stalls" },
  ],
  Stall: [
    { id: "s-401", name: "S-401", site: "UCLA Campus Parking", detail: "North Structure · Level 4 · Aisle A" },
    { id: "s-402", name: "S-402", site: "UCLA Campus Parking", detail: "North Structure · Level 4 · Aisle A" },
    { id: "s-403", name: "S-403", site: "UCLA Campus Parking", detail: "North Structure · Level 4 · Aisle A" },
    { id: "s-404", name: "S-404", site: "UCLA Campus Parking", detail: "North Structure · Level 4 · Aisle A" },
    { id: "s-409", name: "S-409", site: "UCLA Campus Parking", detail: "North Structure · Level 4 · Aisle B" },
    { id: "s-410", name: "S-410", site: "UCLA Campus Parking", detail: "North Structure · Level 4 · Aisle B" },
    { id: "s-411", name: "S-411", site: "UCLA Campus Parking", detail: "North Structure · Level 4 · Aisle B" },
    { id: "s-412", name: "S-412", site: "UCLA Campus Parking", detail: "North Structure · Level 4 · Aisle B" },
    { id: "s-413", name: "S-413", site: "UCLA Campus Parking", detail: "North Structure · Level 4 · Aisle B" },
    { id: "s-414", name: "S-414", site: "UCLA Campus Parking", detail: "North Structure · Level 4 · Aisle B" },
    { id: "s-415", name: "S-415", site: "UCLA Campus Parking", detail: "North Structure · Level 4 · Aisle B" },
    { id: "s-416", name: "S-416", site: "UCLA Campus Parking", detail: "North Structure · Level 4 · Aisle B" },
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

type TargetType = "Zone" | "Stall" | "Level";
type TimeWindow = { id: string; days: Set<string>; start: string; end: string };

const uid = () => Math.random().toString(36).slice(2, 8);

const defaultWindow = (): TimeWindow => ({
  id: uid(),
  days: new Set(["Mon", "Tue", "Wed", "Thu", "Fri"]),
  start: "08:00",
  end: "18:00",
});

// ── Step Indicator ────────────────────────────────────────────────────────

const STEPS = [
  { n: 1, label: "Select Targets" },
  { n: 2, label: "Configure Parameters" },
  { n: 3, label: "Validity & Permits" },
  { n: 4, label: "Review & Publish" },
];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 px-8 py-5 bg-white dark:bg-[#0f1f35] border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
      {STEPS.map((s, idx) => (
        <div key={s.n} className="flex items-center flex-1 last:flex-none">
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className={`size-8 rounded-full flex items-center justify-center text-[13px] font-bold transition-colors ${
              s.n < current
                ? "bg-[#3b82f6] text-white"
                : s.n === current
                ? "bg-[#3b82f6] text-white ring-4 ring-[#dbeafe] dark:ring-[rgba(59,130,246,0.2)]"
                : "bg-[#f3f4f6] dark:bg-[#1a2d47] text-[#9ca3af] dark:text-[#4b5563]"
            }`}>
              {s.n < current ? <Check className="size-4" /> : s.n}
            </div>
            <span className={`text-[13px] font-medium whitespace-nowrap ${
              s.n === current
                ? "text-[#111827] dark:text-[#e8eef5]"
                : s.n < current
                ? "text-[#3b82f6] dark:text-[#60a5fa]"
                : "text-[#9ca3af] dark:text-[#4b5563]"
            }`}>
              {s.label}
            </span>
          </div>
          {idx < STEPS.length - 1 && (
            <div className={`flex-1 h-px mx-3 ${s.n < current ? "bg-[#3b82f6]" : "bg-[#e5e7eb] dark:bg-[rgba(59,130,246,0.15)]"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Shared input styles ───────────────────────────────────────────────────

const inputCls = "w-full bg-[#f9fafb] dark:bg-[#0a1628] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg px-3 py-2 text-[14px] text-[#111827] dark:text-[#e8eef5] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent";
const labelCls = "block font-['Inter'] text-[13px] font-medium text-[#374151] dark:text-[#94a3b8] mb-1.5";

// ─────────────────────────────────────────────────────────────────────────

export default function PolicyAssignmentWizard() {
  const navigate = useNavigate();
  const location = useLocation();
  const templateName: string = (location.state as { templateName?: string })?.templateName ?? "2-Hour Free Parking";

  const [step, setStep] = useState(1);

  // Step 1
  const [targetType, setTargetType] = useState<TargetType>("Stall");
  const [selectedTargets, setSelectedTargets] = useState<Set<string>>(new Set());
  const [siteFilter, setSiteFilter] = useState("All Sites");
  const [targetSearch, setTargetSearch] = useState("");
  const [listTab, setListTab] = useState<"list" | "map" | "bulk">("list");
  const [bulkText, setBulkText] = useState("");

  // Step 2
  const [maxDwell, setMaxDwell] = useState("120");
  const [arrivalGrace, setArrivalGrace] = useState("300");
  const [departureGrace, setDepartureGrace] = useState("600");
  const [priority, setPriority] = useState("50");
  const [fineAmount, setFineAmount] = useState("50.00");
  const [escalation, setEscalation] = useState("Use Default");
  const [paidOverlay, setPaidOverlay] = useState(false);
  const [overlayHourlyRate, setOverlayHourlyRate] = useState("3.00");
  const [overlayDailyCap, setOverlayDailyCap] = useState("24.00");

  // Step 3
  const [effectiveFrom, setEffectiveFrom] = useState("2026-05-01");
  const [effectiveFromTime, setEffectiveFromTime] = useState("00:00");
  const [effectiveTo, setEffectiveTo] = useState("");
  const [effectiveToTime, setEffectiveToTime] = useState("");
  const [neverExpires, setNeverExpires] = useState(true);
  const [timezone, setTimezone] = useState("America/New_York");
  const [timeWindows, setTimeWindows] = useState<TimeWindow[]>([defaultWindow()]);
  const [holidayCalendar, setHolidayCalendar] = useState("US Federal");
  const [permittedTypes, setPermittedTypes] = useState<Set<string>>(new Set());
  const [exemptions, setExemptions] = useState<Set<string>>(new Set(["handicap", "government"]));

  // Step 4
  const [requireApproval, setRequireApproval] = useState(true);

  // ── Step 1 helpers ──────────────────────────────────────────────────────

  const visibleTargets = TARGET_DATA[targetType].filter((t) => {
    const matchesSite = siteFilter === "All Sites" || t.site === siteFilter;
    const matchesSearch = t.name.toLowerCase().includes(targetSearch.toLowerCase());
    return matchesSite && matchesSearch;
  });

  const toggleTarget = (id: string) => {
    const n = new Set(selectedTargets);
    n.has(id) ? n.delete(id) : n.add(id);
    setSelectedTargets(n);
  };

  const toggleAll = () => {
    if (visibleTargets.every((t) => selectedTargets.has(t.id))) {
      const n = new Set(selectedTargets);
      visibleTargets.forEach((t) => n.delete(t.id));
      setSelectedTargets(n);
    } else {
      const n = new Set(selectedTargets);
      visibleTargets.forEach((t) => n.add(t.id));
      setSelectedTargets(n);
    }
  };

  // ── Step 3 helpers ──────────────────────────────────────────────────────

  const addWindow = () => setTimeWindows((p) => [...p, defaultWindow()]);
  const removeWindow = (id: string) => setTimeWindows((p) => p.filter((w) => w.id !== id));
  const updateWindow = (id: string, field: "start" | "end", val: string) =>
    setTimeWindows((p) => p.map((w) => w.id === id ? { ...w, [field]: val } : w));
  const toggleDay = (winId: string, day: string) =>
    setTimeWindows((p) =>
      p.map((w) => {
        if (w.id !== winId) return w;
        const d = new Set(w.days);
        d.has(day) ? d.delete(day) : d.add(day);
        return { ...w, days: d };
      })
    );

  // ── Plain-English preview ───────────────────────────────────────────────

  const buildPreview = () => {
    const targetNames = TARGET_DATA[targetType]
      .filter((t) => selectedTargets.has(t.id))
      .map((t) => t.name)
      .slice(0, 3)
      .join(", ");
    const more = selectedTargets.size > 3 ? ` and ${selectedTargets.size - 3} more` : "";
    const w = timeWindows[0];
    const dayStr = w
      ? Array.from(w.days).join("–")
      : "all times";
    const graceMin = Math.round(parseInt(arrivalGrace) / 60);
    const exemList = Array.from(exemptions).map((e) => e.toUpperCase()).join(", ");

    return `Between ${dayStr} ${w?.start ?? "00:00"}–${w?.end ?? "23:59"}, vehicles parked at ${targetNames || "[no targets selected]"}${more} for longer than ${maxDwell} minutes (with ${graceMin} min arrival grace) will receive a $${fineAmount} violation${exemList ? ` — unless they have ${exemList}` : ""}.`;
  };

  // ── Validation ──────────────────────────────────────────────────────────

  const step1Valid = selectedTargets.size > 0;
  const step2Valid = maxDwell.trim() !== "" && priority.trim() !== "";
  const step3Valid = effectiveFrom.trim() !== "";

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#eff6ff] dark:bg-[#0a1628]">
      {/* Stepper */}
      <StepIndicator current={step} />

      {/* Scrollable content */}
      <div className="flex-1 overflow-auto pb-24">
        <div className="max-w-3xl mx-auto px-6 pt-8">

          {/* ══ STEP 1 ══════════════════════════════════════════════════════ */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-['Inter'] font-semibold text-[20px] text-[#111827] dark:text-[#e8eef5]">
                  Step 1 of 4 — Where does this policy apply?
                </h2>
                <p className="text-[14px] text-[#6b7280] dark:text-[#94a3b8] mt-1">
                  Choose what type of spatial asset to target and select the specific items.
                </p>
              </div>

              {/* Target type radios */}
              <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-5 shadow-sm">
                <p className={labelCls}>Target Type</p>
                <div className="flex items-center gap-6">
                  {(["Zone", "Stall", "Level"] as TargetType[]).map((t) => (
                    <label key={t} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={targetType === t}
                        onChange={() => { setTargetType(t); setSelectedTargets(new Set()); setTargetSearch(""); }}
                        className="size-4 accent-[#3b82f6]"
                      />
                      <span className="text-[14px] text-[#111827] dark:text-[#e8eef5]">{t}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sub-tabs */}
              <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] shadow-sm overflow-hidden">
                <div className="flex border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] px-4 pt-3">
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

                {/* List tab */}
                {listTab === "list" && (
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <select value={siteFilter} onChange={(e) => setSiteFilter(e.target.value)} className={`${inputCls} flex-1`}>
                        {SITES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#6b7280] dark:text-[#94a3b8]" />
                        <input
                          type="text"
                          placeholder={`Search ${targetType.toLowerCase()}s…`}
                          value={targetSearch}
                          onChange={(e) => setTargetSearch(e.target.value)}
                          className={`${inputCls} pl-9`}
                        />
                      </div>
                    </div>

                    {/* Select all row */}
                    <div className="flex items-center justify-between px-1">
                      <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#6b7280] dark:text-[#94a3b8]">
                        <input
                          type="checkbox"
                          checked={visibleTargets.length > 0 && visibleTargets.every((t) => selectedTargets.has(t.id))}
                          onChange={toggleAll}
                          className="size-4 accent-[#3b82f6]"
                        />
                        Select all visible
                      </label>
                      <span className="text-[12px] text-[#6b7280] dark:text-[#94a3b8]">{visibleTargets.length} shown</span>
                    </div>

                    {/* Target list */}
                    <div className="max-h-64 overflow-y-auto space-y-1 border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg divide-y divide-[#e5e7eb] dark:divide-[rgba(59,130,246,0.1)]">
                      {visibleTargets.length === 0 ? (
                        <p className="px-4 py-6 text-center text-[13px] text-[#9ca3af] dark:text-[#4b5563]">No {targetType.toLowerCase()}s match your filters</p>
                      ) : (
                        visibleTargets.map((t) => (
                          <label key={t.id} className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors ${selectedTargets.has(t.id) ? "bg-[#eff6ff] dark:bg-[rgba(59,130,246,0.06)]" : "hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.4)]"}`}>
                            <input
                              type="checkbox"
                              checked={selectedTargets.has(t.id)}
                              onChange={() => toggleTarget(t.id)}
                              className="size-4 mt-0.5 accent-[#3b82f6]"
                            />
                            <div className="min-w-0">
                              <p className="text-[14px] font-medium text-[#111827] dark:text-[#e8eef5] truncate">{t.name}</p>
                              <p className="text-[12px] text-[#6b7280] dark:text-[#94a3b8]">{t.site}{t.detail ? ` · ${t.detail}` : ""}</p>
                            </div>
                          </label>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Map tab */}
                {listTab === "map" && (
                  <div className="h-64 flex flex-col items-center justify-center gap-3 text-center p-6">
                    <div className="bg-[#dbeafe] dark:bg-[#1e3a8a] rounded-xl p-4">
                      <Map className="size-10 text-[#3b82f6] dark:text-[#60a5fa]" />
                    </div>
                    <p className="text-[14px] font-medium text-[#111827] dark:text-[#e8eef5]">Interactive Map Selection</p>
                    <p className="text-[12px] text-[#6b7280] dark:text-[#94a3b8] max-w-xs">Click-and-drag lasso select or Shift-click to multi-select zone polygons on the map.</p>
                    <span className="text-[11px] px-3 py-1 rounded-full bg-[#f3f4f6] dark:bg-[#1a2d47] text-[#6b7280] dark:text-[#94a3b8]">Map integration coming soon</span>
                  </div>
                )}

                {/* Bulk Import tab */}
                {listTab === "bulk" && (
                  <div className="p-4 space-y-3">
                    <p className="text-[13px] text-[#6b7280] dark:text-[#94a3b8]">
                      Paste a list of {targetType.toLowerCase()} IDs (one per line) or upload a CSV with a <code className="text-[#3b82f6] bg-[#eff6ff] dark:bg-[rgba(59,130,246,0.1)] px-1 rounded">{targetType.toLowerCase()}_id</code> column.
                    </p>
                    <textarea
                      rows={6}
                      placeholder={`zone-a\nzone-b\nzone-c`}
                      value={bulkText}
                      onChange={(e) => setBulkText(e.target.value)}
                      className={`${inputCls} resize-none font-mono text-[13px]`}
                    />
                    <button className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg text-[#111827] dark:text-[#e8eef5] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)] transition-colors">
                      <Upload className="size-4" />
                      Upload CSV file
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══ STEP 2 ══════════════════════════════════════════════════════ */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-['Inter'] font-semibold text-[20px] text-[#111827] dark:text-[#e8eef5]">
                  Step 2 of 4 — Configure Rule Parameters
                </h2>
                <p className="text-[14px] text-[#6b7280] dark:text-[#94a3b8] mt-1">
                  Override template defaults for this specific assignment.
                </p>
              </div>

              <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-5 shadow-sm space-y-5">
                {/* Template pill */}
                <div className="flex items-center gap-2 pb-4 border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
                  <span className="text-[13px] text-[#6b7280] dark:text-[#94a3b8]">Template:</span>
                  <span className="px-3 py-1 rounded-full bg-[#dbeafe] dark:bg-[#1e3a8a] text-[#1e40af] dark:text-[#60a5fa] text-[13px] font-medium">{templateName}</span>
                </div>

                {/* Parameters */}
                {[
                  { label: "Max dwell (minutes)", value: maxDwell, set: setMaxDwell, required: true },
                  { label: "Arrival grace (seconds)", value: arrivalGrace, set: setArrivalGrace },
                  { label: "Departure grace (seconds)", value: departureGrace, set: setDepartureGrace },
                ].map(({ label, value, set, required }) => (
                  <div key={label} className="grid grid-cols-2 gap-4 items-center">
                    <label className={labelCls}>
                      {label}{required && <span className="text-[#dc2626] ml-0.5">*</span>}
                    </label>
                    <input type="number" min={0} value={value} onChange={(e) => set(e.target.value)} className={inputCls} />
                  </div>
                ))}

                <div className="h-px bg-[#e5e7eb] dark:bg-[rgba(59,130,246,0.15)]" />

                {/* Priority */}
                <div className="grid grid-cols-2 gap-4 items-center">
                  <div className="flex items-center gap-1.5">
                    <label className={`${labelCls} mb-0`}>Priority <span className="text-[#dc2626]">*</span></label>
                    <div className="group relative">
                      <Info className="size-3.5 text-[#9ca3af] cursor-help" />
                      <div className="invisible group-hover:visible absolute left-5 top-0 w-56 bg-[#111827] dark:bg-[#1a2d47] text-white text-xs rounded-lg px-3 py-2 shadow-lg z-10">
                        Higher priority wins when multiple policies overlap on the same target. Range: 0–100.
                      </div>
                    </div>
                  </div>
                  <input type="number" min={0} max={100} value={priority} onChange={(e) => setPriority(e.target.value)} className={inputCls} />
                </div>

                {/* Fine */}
                <div className="grid grid-cols-2 gap-4 items-center">
                  <label className={`${labelCls} mb-0`}>Fine amount ($)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280] dark:text-[#94a3b8] text-[14px]">$</span>
                    <input type="number" min={0} step={0.01} value={fineAmount} onChange={(e) => setFineAmount(e.target.value)} className={`${inputCls} pl-7`} />
                  </div>
                </div>

                {/* Escalation */}
                <div className="grid grid-cols-2 gap-4 items-center">
                  <label className={`${labelCls} mb-0`}>Escalation tiers</label>
                  <select value={escalation} onChange={(e) => setEscalation(e.target.value)} className={inputCls}>
                    {ESCALATION_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>

                <div className="h-px bg-[#e5e7eb] dark:bg-[rgba(59,130,246,0.15)]" />

                {/* Paid Overlay */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={paidOverlay}
                      onChange={(e) => setPaidOverlay(e.target.checked)}
                      className="size-4 accent-[#3b82f6]"
                    />
                    <div>
                      <span className="text-[14px] font-medium text-[#111827] dark:text-[#e8eef5]">Add a Paid Overlay</span>
                      <span className="ml-2 text-[12px] text-[#6b7280] dark:text-[#94a3b8]">— creates a Dual Rule Set</span>
                    </div>
                  </label>

                  {paidOverlay && (
                    <div className="mt-4 pl-7 space-y-3 border-l-2 border-[#dbeafe] dark:border-[rgba(59,130,246,0.2)]">
                      <p className="text-[12px] text-[#6b7280] dark:text-[#94a3b8]">A second Pay-to-Park template will be evaluated alongside this policy.</p>
                      <div className="grid grid-cols-2 gap-4 items-center">
                        <label className={`${labelCls} mb-0`}>Hourly rate ($)</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280] dark:text-[#94a3b8] text-[14px]">$</span>
                          <input type="number" min={0} step={0.01} value={overlayHourlyRate} onChange={(e) => setOverlayHourlyRate(e.target.value)} className={`${inputCls} pl-7`} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 items-center">
                        <label className={`${labelCls} mb-0`}>Daily cap ($)</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280] dark:text-[#94a3b8] text-[14px]">$</span>
                          <input type="number" min={0} step={0.01} value={overlayDailyCap} onChange={(e) => setOverlayDailyCap(e.target.value)} className={`${inputCls} pl-7`} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ══ STEP 3 ══════════════════════════════════════════════════════ */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-['Inter'] font-semibold text-[20px] text-[#111827] dark:text-[#e8eef5]">
                  Step 3 of 4 — When is this policy active?
                </h2>
                <p className="text-[14px] text-[#6b7280] dark:text-[#94a3b8] mt-1">
                  Set the effective date range, recurring time windows, and permit/exemption overrides.
                </p>
              </div>

              {/* Effective dates */}
              <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-5 shadow-sm space-y-4">
                <p className="font-['Inter'] font-semibold text-[14px] text-[#111827] dark:text-[#e8eef5]">Effective Period</p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Effective from <span className="text-[#dc2626]">*</span></label>
                    <div className="flex gap-2">
                      <input type="date" value={effectiveFrom} onChange={(e) => setEffectiveFrom(e.target.value)} className={`${inputCls} flex-1`} />
                      <input type="time" value={effectiveFromTime} onChange={(e) => setEffectiveFromTime(e.target.value)} className={`${inputCls} w-28`} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className={`${labelCls} mb-0`}>Effective to</label>
                      <label className="flex items-center gap-1.5 text-[12px] text-[#6b7280] dark:text-[#94a3b8] cursor-pointer">
                        <input type="checkbox" checked={neverExpires} onChange={(e) => setNeverExpires(e.target.checked)} className="size-3.5 accent-[#3b82f6]" />
                        Never expires
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <input type="date" value={effectiveTo} onChange={(e) => setEffectiveTo(e.target.value)} disabled={neverExpires} className={`${inputCls} flex-1 disabled:opacity-40`} />
                      <input type="time" value={effectiveToTime} onChange={(e) => setEffectiveToTime(e.target.value)} disabled={neverExpires} className={`${inputCls} w-28 disabled:opacity-40`} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Timezone</label>
                  <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className={`${inputCls} max-w-xs`}>
                    {TIMEZONES.map((tz) => <option key={tz}>{tz}</option>)}
                  </select>
                </div>
              </div>

              {/* Recurring Time Windows */}
              <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-5 shadow-sm space-y-4">
                <p className="font-['Inter'] font-semibold text-[14px] text-[#111827] dark:text-[#e8eef5]">Recurring Time Windows</p>

                {timeWindows.map((w, idx) => (
                  <div key={w.id} className="border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-semibold text-[#374151] dark:text-[#94a3b8]">Window {idx + 1}</span>
                      {timeWindows.length > 1 && (
                        <button onClick={() => removeWindow(w.id)} className="text-[12px] text-[#dc2626] hover:text-[#b91c1c] flex items-center gap-1 transition-colors">
                          <Trash2 className="size-3.5" />
                          Delete
                        </button>
                      )}
                    </div>
                    <div>
                      <label className={labelCls}>Days</label>
                      <div className="flex gap-2 flex-wrap">
                        {DAYS.map((day) => (
                          <button
                            key={day}
                            onClick={() => toggleDay(w.id, day)}
                            className={`px-2.5 py-1 rounded-lg text-[12px] font-medium transition-colors ${
                              w.days.has(day)
                                ? "bg-[#3b82f6] text-white"
                                : "bg-[#f3f4f6] dark:bg-[#1a2d47] text-[#374151] dark:text-[#94a3b8] hover:bg-[#e5e7eb] dark:hover:bg-[rgba(30,58,95,0.7)]"
                            }`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <label className={labelCls}>Start</label>
                        <input type="time" value={w.start} onChange={(e) => updateWindow(w.id, "start", e.target.value)} className={inputCls} />
                      </div>
                      <div className="flex-1">
                        <label className={labelCls}>End</label>
                        <input type="time" value={w.end} onChange={(e) => updateWindow(w.id, "end", e.target.value)} className={inputCls} />
                      </div>
                    </div>
                  </div>
                ))}

                <button onClick={addWindow} className="flex items-center gap-2 text-[13px] font-medium text-[#3b82f6] dark:text-[#60a5fa] hover:text-[#2563eb] transition-colors">
                  <Plus className="size-4" />
                  Add another window
                </button>
              </div>

              {/* Calendar Exclusions */}
              <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-5 shadow-sm space-y-3">
                <p className="font-['Inter'] font-semibold text-[14px] text-[#111827] dark:text-[#e8eef5]">Calendar Exclusions</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Link Holiday Calendar</label>
                    <select value={holidayCalendar} onChange={(e) => setHolidayCalendar(e.target.value)} className={inputCls}>
                      {["US Federal", "US State", "None"].map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Link Special Events</label>
                    <button className="flex items-center gap-2 w-full px-3 py-2 border border-dashed border-[#d1d5db] dark:border-[rgba(59,130,246,0.3)] rounded-lg text-[13px] text-[#3b82f6] dark:text-[#60a5fa] hover:bg-[#eff6ff] dark:hover:bg-[rgba(59,130,246,0.05)] transition-colors">
                      <Plus className="size-4" />
                      Select events
                    </button>
                  </div>
                </div>
              </div>

              {/* Permitted Types + Exemptions */}
              <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-5 shadow-sm space-y-5">
                <div>
                  <p className="font-['Inter'] font-semibold text-[14px] text-[#111827] dark:text-[#e8eef5] mb-1">Permitted Types</p>
                  <p className="text-[12px] text-[#6b7280] dark:text-[#94a3b8] mb-3">Optional — only these permit types may park. Leave empty to allow all.</p>
                  <div className="flex flex-wrap gap-3">
                    {PERMITTED_TYPES.map((pt) => (
                      <label key={pt} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={permittedTypes.has(pt)} onChange={() => {
                          const n = new Set(permittedTypes);
                          n.has(pt) ? n.delete(pt) : n.add(pt);
                          setPermittedTypes(n);
                        }} className="size-4 accent-[#3b82f6]" />
                        <span className="text-[13px] font-mono text-[#111827] dark:text-[#e8eef5]">{pt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-[#e5e7eb] dark:bg-[rgba(59,130,246,0.15)]" />

                <div>
                  <p className="font-['Inter'] font-semibold text-[14px] text-[#111827] dark:text-[#e8eef5] mb-1">Exemptions</p>
                  <p className="text-[12px] text-[#6b7280] dark:text-[#94a3b8] mb-3">These vehicles are NOT subject to this policy's enforcement.</p>
                  <div className="space-y-2">
                    {EXEMPTION_TYPES.map(({ key, label }) => (
                      <label key={key} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={exemptions.has(key)} onChange={() => {
                          const n = new Set(exemptions);
                          n.has(key) ? n.delete(key) : n.add(key);
                          setExemptions(n);
                        }} className="size-4 accent-[#3b82f6]" />
                        <span className="text-[13px] text-[#111827] dark:text-[#e8eef5]">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══ STEP 4 ══════════════════════════════════════════════════════ */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-['Inter'] font-semibold text-[20px] text-[#111827] dark:text-[#e8eef5]">
                  Step 4 of 4 — Review and Publish
                </h2>
                <p className="text-[14px] text-[#6b7280] dark:text-[#94a3b8] mt-1">
                  Confirm the configuration before activating this policy assignment.
                </p>
              </div>

              {/* Summary */}
              <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-5 shadow-sm">
                <p className="font-['Inter'] font-semibold text-[14px] text-[#111827] dark:text-[#e8eef5] mb-4">Summary</p>
                <div className="space-y-2.5">
                  {[
                    { label: "Template",   value: templateName },
                    { label: "Targets",    value: `${selectedTargets.size} ${targetType.toLowerCase()}${selectedTargets.size !== 1 ? "s" : ""} (${TARGET_DATA[targetType].filter((t) => selectedTargets.has(t.id)).map((t) => t.name).slice(0, 2).join(", ")}${selectedTargets.size > 2 ? ` +${selectedTargets.size - 2} more` : ""})` },
                    { label: "Active",     value: `${effectiveFrom} ${effectiveFromTime} → ${neverExpires ? "indefinite" : `${effectiveTo} ${effectiveToTime}`}` },
                    { label: "Windows",    value: timeWindows.map((w) => `${Array.from(w.days).join("–")} ${w.start}–${w.end}`).join("; ") || "None" },
                    { label: "Max Dwell",  value: `${maxDwell} min (grace ${Math.round(parseInt(arrivalGrace)/60)} min arrival / ${Math.round(parseInt(departureGrace)/60)} min departure)` },
                    { label: "Priority",   value: priority },
                    { label: "Fine",       value: `$${fineAmount}  ·  Escalation: ${escalation}` },
                    { label: "Timezone",   value: timezone },
                    { label: "Exemptions", value: Array.from(exemptions).map((e) => e.toUpperCase()).join(", ") || "None" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-start gap-3 text-[13px]">
                      <span className="w-24 flex-shrink-0 text-[#6b7280] dark:text-[#94a3b8]">{label}</span>
                      <span className="text-[#111827] dark:text-[#e8eef5]">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conflict Check */}
              <div className="bg-[#fffbeb] dark:bg-[#78350f]/30 rounded-xl border border-[#fbbf24] dark:border-[#f59e0b]/40 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="size-5 text-[#d97706] dark:text-[#fbbf24]" />
                  <p className="font-['Inter'] font-semibold text-[14px] text-[#92400e] dark:text-[#fbbf24]">Conflict Check — 2 found</p>
                </div>
                <div className="space-y-3">
                  {[
                    { title: `${targetType} already has "Permit-Only Level 4" (pri 85)`, detail: "Dual Rule Set will evaluate both; priority 85 wins on overlap." },
                    { title: `Schedule overlaps with Special Event "Event Day Overflow" (pri 90)`, detail: "Event override (pri 90) will supersede this policy during the event window." },
                  ].map(({ title, detail }, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <AlertCircle className="size-4 text-[#d97706] dark:text-[#fbbf24] flex-shrink-0 mt-0.5" />
                      <div className="text-[13px]">
                        <p className="text-[#92400e] dark:text-[#fde68a] font-medium">• {title}</p>
                        <p className="text-[#78350f] dark:text-[#fcd34d] mt-0.5">↳ {detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Approval */}
              <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-5 shadow-sm">
                <p className="font-['Inter'] font-semibold text-[14px] text-[#111827] dark:text-[#e8eef5] mb-3">Approval</p>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={requireApproval} onChange={(e) => setRequireApproval(e.target.checked)} className="size-4 mt-0.5 accent-[#3b82f6]" />
                  <div>
                    <p className="text-[14px] text-[#111827] dark:text-[#e8eef5]">Require second-admin approval before activation</p>
                    <p className="text-[12px] text-[#6b7280] dark:text-[#94a3b8] mt-0.5">Policy will enter "Pending Approval" state until a second admin confirms.</p>
                  </div>
                </label>
              </div>

              {/* Plain-English Preview */}
              <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="size-4 text-[#16a34a] dark:text-[#34d399]" />
                  <p className="font-['Inter'] font-semibold text-[14px] text-[#111827] dark:text-[#e8eef5]">Plain-English Preview</p>
                </div>
                <div className="bg-[#f9fafb] dark:bg-[#0a1628] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg px-4 py-3">
                  <p className="text-[13px] text-[#374151] dark:text-[#cbd5e1] leading-relaxed italic">
                    {buildPreview()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Sticky Footer ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#0f1f35] border-t border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] px-8 py-4 flex items-center justify-between z-40 shadow-lg">
        <div className="text-[13px] text-[#6b7280] dark:text-[#94a3b8]">
          {step === 1 && (selectedTargets.size > 0
            ? <span className="text-[#16a34a] dark:text-[#34d399] font-medium flex items-center gap-1.5"><CheckCircle2 className="size-4" />{selectedTargets.size} {targetType.toLowerCase()}{selectedTargets.size !== 1 ? "s" : ""} selected</span>
            : "Select at least one target to continue")}
          {step === 2 && "Configure the rule parameters for this assignment"}
          {step === 3 && "Set validity window, permits, and exemptions"}
          {step === 4 && "Review all settings before publishing"}
        </div>
        <div className="flex items-center gap-3">
          {step === 4 && (
            <button onClick={() => navigate("/configuration/policies")} className="px-4 py-2 text-[14px] font-medium border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg text-[#111827] dark:text-[#e8eef5] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)] transition-colors">
              Save Draft
            </button>
          )}
          <button
            onClick={() => step === 1 ? navigate(-1) : setStep((s) => s - 1)}
            className="px-4 py-2 text-[14px] font-medium text-[#6b7280] dark:text-[#94a3b8] hover:text-[#111827] dark:hover:text-[#e8eef5] transition-colors"
          >
            {step === 1 ? "Cancel" : "← Back"}
          </button>
          {step < 4 ? (
            <button
              disabled={(step === 1 && !step1Valid) || (step === 2 && !step2Valid) || (step === 3 && !step3Valid)}
              onClick={() => setStep((s) => s + 1)}
              className="flex items-center gap-2 px-5 py-2 text-[14px] font-medium bg-[#3b82f6] dark:bg-[#2563eb] text-white rounded-lg hover:bg-[#2563eb] dark:hover:bg-[#1d4ed8] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {step === 1 ? "Next: Rules" : step === 2 ? "Next: Validity" : "Next: Review"}
              <ChevronRight className="size-4" />
            </button>
          ) : (
            <button
              onClick={() => navigate("/configuration/policies")}
              className="flex items-center gap-2 px-5 py-2 text-[14px] font-medium bg-[#3b82f6] dark:bg-[#2563eb] text-white rounded-lg hover:bg-[#2563eb] dark:hover:bg-[#1d4ed8] transition-colors shadow-sm"
            >
              <CheckCircle2 className="size-4" />
              Publish & Activate
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState, useRef, useEffect } from "react";
import { Plus, MoreHorizontal, DollarSign, X, Info } from "lucide-react";

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

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type RateType = "HOURLY" | "FLAT" | "FRACTIONAL" | "DAILY_CAP";

const RATE_TYPE_META: Record<RateType, { label: string; desc: string; color: string }> = {
  HOURLY:    { label: "Hourly",     desc: "Charge per full or partial hour",             color: "bg-[#dbeafe] dark:bg-[#1e3a8a] text-[#1e40af] dark:text-[#93c5fd]" },
  FLAT:      { label: "Flat",       desc: "Single fixed charge regardless of duration",  color: "bg-[#ede9fe] dark:bg-[#4c1d95] text-[#7c3aed] dark:text-[#c4b5fd]" },
  FRACTIONAL:{ label: "Fractional", desc: "Charge per configurable time interval",       color: "bg-[#ffedd5] dark:bg-[#7c2d12] text-[#ea580c] dark:text-[#fdba74]" },
  DAILY_CAP: { label: "Daily Cap",  desc: "Hourly rate capped at a daily maximum",       color: "bg-[#d1fae5] dark:bg-[#065f46] text-[#065f46] dark:text-[#34d399]" },
};

const STATUS_STYLES: Record<string, string> = {
  Active:  "bg-[#d1fae5] dark:bg-[#065f46] text-[#065f46] dark:text-[#34d399]",
  Draft:   "bg-[#f3f4f6] dark:bg-[#1f2937] text-[#6b7280] dark:text-[#9ca3af]",
  Archived:"bg-[#fef3c7] dark:bg-[#78350f] text-[#92400e] dark:text-[#fcd34d]",
};

const FRACTION_INTERVALS = ["5 min", "10 min", "15 min", "20 min", "30 min"];

interface Tariff {
  id: number;
  name: string;
  appliesTo: string[];
  rateType: RateType;
  rateDisplay: string;
  freePeriod: string;
  dailyCap: string;
  status: "Active" | "Draft" | "Archived";
}

const MOCK_TARIFFS: Tariff[] = [
  {
    id: 1, name: "Downtown Peak Rate",
    appliesTo: ["Zone B — General Public Parking", "Zone D — Short-Term Visitor (2-Hour)"],
    rateType: "FRACTIONAL", rateDisplay: "$3.00/hr (per 15 min)", freePeriod: "—", dailyCap: "$24.00", status: "Active",
  },
  {
    id: 2, name: "Standard Hourly",
    appliesTo: ["Zone A — Permit Holders Only", "Zone C — Faculty & Staff Reserved"],
    rateType: "HOURLY", rateDisplay: "$2.50/hr", freePeriod: "30 min", dailyCap: "$20.00", status: "Active",
  },
  {
    id: 3, name: "Event Day Flat",
    appliesTo: ["Zone G — Event Day Overflow"],
    rateType: "FLAT", rateDisplay: "$15.00 flat", freePeriod: "—", dailyCap: "—", status: "Active",
  },
  {
    id: 4, name: "Weekend Value Rate",
    appliesTo: ["Zone B — General Public Parking", "Zone D — Short-Term Visitor (2-Hour)"],
    rateType: "HOURLY", rateDisplay: "$1.50/hr", freePeriod: "—", dailyCap: "$12.00", status: "Active",
  },
  {
    id: 5, name: "EV Charging Tariff",
    appliesTo: ["Zone E — EV Charging Stations"],
    rateType: "FRACTIONAL", rateDisplay: "$0.25/15 min", freePeriod: "30 min", dailyCap: "$18.00", status: "Active",
  },
  {
    id: 6, name: "Overnight Flat",
    appliesTo: ["Zone H — Motorcycle & Bicycle"],
    rateType: "FLAT", rateDisplay: "$5.00 flat", freePeriod: "—", dailyCap: "—", status: "Draft",
  },
  {
    id: 7, name: "All-Day Cap",
    appliesTo: ["Zone F — Accessible Parking (ADA)"],
    rateType: "DAILY_CAP", rateDisplay: "$2.00/hr → cap", freePeriod: "60 min", dailyCap: "$15.00", status: "Draft",
  },
];

// ── Form state ────────────────────────────────────────────────────────────

interface FormState {
  name: string;
  rateType: RateType;
  // HOURLY / FRACTIONAL / DAILY_CAP
  rateAmount: string;
  fractionInterval: string;
  freePeriodMinutes: string;
  minDurationMinutes: string;
  maxDurationMinutes: string;
  dailyCapAmount: string;
  // FLAT
  flatAmount: string;
  // Holiday override
  holidayRate: string;
  holidayEnabled: boolean;
  // Validity
  validDays: Set<string>;
  validStart: string;
  validEnd: string;
  effectiveFrom: string;
  effectiveTo: string;
  // Applies to
  appliesTo: Set<string>;
}

const defaultForm = (): FormState => ({
  name: "",
  rateType: "HOURLY",
  rateAmount: "",
  fractionInterval: "15 min",
  freePeriodMinutes: "",
  minDurationMinutes: "",
  maxDurationMinutes: "",
  dailyCapAmount: "",
  flatAmount: "",
  holidayRate: "",
  holidayEnabled: false,
  validDays: new Set(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]),
  validStart: "00:00",
  validEnd: "23:59",
  effectiveFrom: "",
  effectiveTo: "",
  appliesTo: new Set(),
});

// ── Component ─────────────────────────────────────────────────────────────

export default function Tariffs() {
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

  const toggleDay = (d: string) => {
    const s = new Set(form.validDays); s.has(d) ? s.delete(d) : s.add(d);
    setForm({ ...form, validDays: s });
  };

  const toggleZone = (z: string) => {
    const s = new Set(form.appliesTo); s.has(z) ? s.delete(z) : s.add(z);
    setForm({ ...form, appliesTo: s });
  };

  const handleSave = () => {
    setSubmitted(true);
    const rateOk = form.rateType === "FLAT" ? !!form.flatAmount : !!form.rateAmount;
    if (!form.name || !rateOk || form.appliesTo.size === 0) return;
    setShowForm(false);
    setForm(defaultForm());
    setSubmitted(false);
  };

  const labelCls = "block text-[13px] font-medium text-[#374151] dark:text-[#cbd5e1] mb-1";
  const inputCls = "w-full bg-[#f9fafb] dark:bg-[#0a1628] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.2)] rounded-lg px-3 py-2 text-[13px] text-[#111827] dark:text-[#e8eef5] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]";
  const errCls = "mt-1 text-[11px] text-[#dc2626]";

  const rateOk = form.rateType === "FLAT" ? !!form.flatAmount : !!form.rateAmount;
  const isHoliday = form.holidayEnabled;

  return (
    <div className="flex-1 overflow-auto bg-[#eff6ff] dark:bg-[#0a1628] pb-8">
      <div className="px-8 pt-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-[22px] font-semibold text-[#111827] dark:text-[#e8eef5]">Tariffs</h1>
            <p className="text-[14px] text-[#6b7280] dark:text-[#94a3b8] mt-1">
              Pricing structures linked to Pay-to-Park policy assignments via <code className="px-1 py-0.5 text-[12px] bg-[#f3f4f6] dark:bg-[#1f2937] rounded">tariff_id</code>
            </p>
          </div>
          <button
            onClick={() => { setShowForm(true); setForm(defaultForm()); setSubmitted(false); }}
            className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium bg-[#3b82f6] dark:bg-[#2563eb] text-white rounded-lg hover:bg-[#2563eb] dark:hover:bg-[#1d4ed8] transition-colors"
          >
            <Plus className="size-4" /> New Tariff
          </button>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f9fafb] dark:bg-[#0a1628] border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
                {["Tariff Name", "Applies To", "Rate Type", "Rate", "Free Period", "Daily Cap", "Status", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8] uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_TARIFFS.map((t) => (
                <tr key={t.id} className="border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.08)] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.4)] transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="size-4 text-[#3b82f6] dark:text-[#60a5fa] flex-shrink-0" />
                      <span className="text-[14px] font-medium text-[#111827] dark:text-[#e8eef5]">{t.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[13px] text-[#6b7280] dark:text-[#94a3b8]">
                    {t.appliesTo.length === ZONES.length
                      ? "All zones"
                      : t.appliesTo.length === 1
                        ? <span className="truncate max-w-[160px] block">{t.appliesTo[0].split("—")[0].trim()}</span>
                        : `${t.appliesTo.length} zones`
                    }
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full ${RATE_TYPE_META[t.rateType].color}`}>
                      {RATE_TYPE_META[t.rateType].label}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-[13px] font-medium text-[#111827] dark:text-[#e8eef5]">{t.rateDisplay}</td>
                  <td className="px-4 py-4 text-[13px] text-[#6b7280] dark:text-[#94a3b8]">{t.freePeriod}</td>
                  <td className="px-4 py-4 text-[13px] text-[#6b7280] dark:text-[#94a3b8]">{t.dailyCap}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[12px] font-semibold ${STATUS_STYLES[t.status]}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 relative" ref={openRowMenu === t.id ? menuRef : undefined}>
                    <button
                      onClick={(e) => { e.stopPropagation(); setOpenRowMenu(openRowMenu === t.id ? null : t.id); }}
                      className="p-1.5 rounded-lg text-[#6b7280] dark:text-[#94a3b8] hover:bg-[#f3f4f6] dark:hover:bg-[rgba(30,58,95,0.5)] transition-colors"
                    >
                      <MoreHorizontal className="size-4" />
                    </button>
                    {openRowMenu === t.id && (
                      <div className="absolute right-4 top-10 w-44 bg-white dark:bg-[#1a2d47] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-xl shadow-lg z-50 py-1 text-[13px]">
                        {["Edit", "Duplicate", "View Assignments", "Archive"].map((item) => (
                          <button key={item} onClick={() => setOpenRowMenu(null)} className="w-full text-left px-4 py-2 text-[#111827] dark:text-[#e8eef5] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)] transition-colors">
                            {item}
                          </button>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── New Tariff slide-over ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40 dark:bg-black/60" onClick={() => setShowForm(false)} />

          <div className="w-[480px] bg-white dark:bg-[#0f1f35] h-full flex flex-col shadow-2xl border-l border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
            {/* Panel header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
              <h2 className="text-[16px] font-semibold text-[#111827] dark:text-[#e8eef5]">New Tariff</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg text-[#6b7280] dark:text-[#94a3b8] hover:bg-[#f3f4f6] dark:hover:bg-[rgba(30,58,95,0.5)] transition-colors">
                <X className="size-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">

              {/* Name */}
              <div>
                <label className={labelCls}>Tariff Name <span className="text-[#dc2626]">*</span></label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Downtown Peak Rate" className={inputCls} />
                {submitted && !form.name && <p className={errCls}>Name is required</p>}
              </div>

              {/* Rate type */}
              <div>
                <label className={labelCls}>Rate Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(RATE_TYPE_META) as RateType[]).map((rt) => (
                    <button
                      key={rt}
                      onClick={() => setForm({ ...form, rateType: rt })}
                      className={`p-3 rounded-lg border text-left transition-colors ${
                        form.rateType === rt
                          ? "border-[#3b82f6] bg-[#eff6ff] dark:bg-[rgba(59,130,246,0.08)] dark:border-[#3b82f6]"
                          : "border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.3)]"
                      }`}
                    >
                      <p className="text-[13px] font-semibold text-[#111827] dark:text-[#e8eef5]">{RATE_TYPE_META[rt].label}</p>
                      <p className="text-[11px] text-[#6b7280] dark:text-[#94a3b8] mt-0.5">{RATE_TYPE_META[rt].desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Rate fields — dynamic per type */}
              {form.rateType === "FLAT" ? (
                <div>
                  <label className={labelCls}>Flat Rate ($) <span className="text-[#dc2626]">*</span></label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280] dark:text-[#94a3b8] text-[13px]">$</span>
                    <input type="number" min={0} step={0.01} value={form.flatAmount} onChange={(e) => setForm({ ...form, flatAmount: e.target.value })} placeholder="0.00" className={`${inputCls} pl-6`} />
                  </div>
                  {submitted && !form.flatAmount && <p className={errCls}>Flat rate is required</p>}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div>
                    <label className={labelCls}>
                      {form.rateType === "FRACTIONAL" ? "Rate per Interval ($)" : "Rate per Hour ($)"}
                      <span className="text-[#dc2626]"> *</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280] dark:text-[#94a3b8] text-[13px]">$</span>
                      <input type="number" min={0} step={0.01} value={form.rateAmount} onChange={(e) => setForm({ ...form, rateAmount: e.target.value })} placeholder="0.00" className={`${inputCls} pl-6`} />
                    </div>
                    {submitted && !form.rateAmount && <p className={errCls}>Rate is required</p>}
                  </div>

                  {form.rateType === "FRACTIONAL" && (
                    <div>
                      <label className={labelCls}>Interval</label>
                      <select value={form.fractionInterval} onChange={(e) => setForm({ ...form, fractionInterval: e.target.value })} className={inputCls}>
                        {FRACTION_INTERVALS.map((i) => <option key={i} value={i}>{i}</option>)}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className={labelCls}>Free Period (minutes) <span className="text-[12px] font-normal text-[#6b7280] dark:text-[#94a3b8]">optional</span></label>
                    <input type="number" min={0} value={form.freePeriodMinutes} onChange={(e) => setForm({ ...form, freePeriodMinutes: e.target.value })} placeholder="0" className={inputCls} />
                    <p className="mt-1 text-[12px] text-[#6b7280] dark:text-[#94a3b8]">Grace minutes before billing starts</p>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className={labelCls}>Min Duration (min)</label>
                      <input type="number" min={0} value={form.minDurationMinutes} onChange={(e) => setForm({ ...form, minDurationMinutes: e.target.value })} placeholder="—" className={inputCls} />
                    </div>
                    <div className="flex-1">
                      <label className={labelCls}>Max Duration (min)</label>
                      <input type="number" min={0} value={form.maxDurationMinutes} onChange={(e) => setForm({ ...form, maxDurationMinutes: e.target.value })} placeholder="—" className={inputCls} />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Daily Cap ($) <span className="text-[12px] font-normal text-[#6b7280] dark:text-[#94a3b8]">optional</span></label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280] dark:text-[#94a3b8] text-[13px]">$</span>
                      <input type="number" min={0} step={0.01} value={form.dailyCapAmount} onChange={(e) => setForm({ ...form, dailyCapAmount: e.target.value })} placeholder="No cap" className={`${inputCls} pl-6`} />
                    </div>
                  </div>
                </div>
              )}

              {/* Day-of-week / time validity */}
              <div>
                <label className={labelCls}>Valid Days</label>
                <div className="flex gap-1.5 flex-wrap">
                  {DAYS.map((d) => (
                    <button
                      key={d}
                      onClick={() => toggleDay(d)}
                      className={`px-3 py-1.5 text-[12px] font-medium rounded-lg border transition-colors ${
                        form.validDays.has(d)
                          ? "bg-[#3b82f6] dark:bg-[#2563eb] text-white border-[#3b82f6]"
                          : "border-[#e5e7eb] dark:border-[rgba(59,130,246,0.2)] text-[#6b7280] dark:text-[#94a3b8] hover:border-[#3b82f6]"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className={labelCls}>Active From</label>
                  <input type="time" value={form.validStart} onChange={(e) => setForm({ ...form, validStart: e.target.value })} className={inputCls} />
                </div>
                <div className="flex-1">
                  <label className={labelCls}>Active Until</label>
                  <input type="time" value={form.validEnd} onChange={(e) => setForm({ ...form, validEnd: e.target.value })} className={inputCls} />
                </div>
              </div>

              {/* Holiday override */}
              <div className="rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] overflow-hidden">
                <button
                  onClick={() => setForm({ ...form, holidayEnabled: !form.holidayEnabled })}
                  className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.3)] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-medium text-[#111827] dark:text-[#e8eef5]">Holiday Override Rate</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#f3f4f6] dark:bg-[#1f2937] text-[#6b7280] dark:text-[#94a3b8]">optional</span>
                  </div>
                  <div className={`relative w-10 rounded-full transition-colors flex-shrink-0`} style={{ height: "22px", backgroundColor: isHoliday ? "#3b82f6" : "#d1d5db" }}>
                    <span className={`absolute top-0.5 rounded-full bg-white shadow transition-transform`} style={{ width: "18px", height: "18px", transform: isHoliday ? "translateX(20px)" : "translateX(2px)" }} />
                  </div>
                </button>
                {isHoliday && (
                  <div className="px-4 pb-4 pt-1 border-t border-[#e5e7eb] dark:border-[rgba(59,130,246,0.1)] bg-[#f9fafb] dark:bg-[#0a1628]">
                    <label className={`${labelCls} mt-2`}>Holiday Rate ($)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280] dark:text-[#94a3b8] text-[13px]">$</span>
                      <input type="number" min={0} step={0.01} value={form.holidayRate} onChange={(e) => setForm({ ...form, holidayRate: e.target.value })} placeholder="0.00" className={`${inputCls} pl-6`} />
                    </div>
                    <p className="mt-1 text-[12px] text-[#6b7280] dark:text-[#94a3b8]">Overrides the base rate on public holidays</p>
                  </div>
                )}
              </div>

              {/* Effective date range */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className={labelCls}>Effective From</label>
                  <input type="date" value={form.effectiveFrom} onChange={(e) => setForm({ ...form, effectiveFrom: e.target.value })} className={inputCls} />
                </div>
                <div className="flex-1">
                  <label className={labelCls}>Effective To</label>
                  <input type="date" value={form.effectiveTo} onChange={(e) => setForm({ ...form, effectiveTo: e.target.value })} className={inputCls} />
                </div>
              </div>

              {/* Applies to zones */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className={`${labelCls} mb-0`}>Applies To <span className="text-[#dc2626]">*</span></label>
                  <button
                    onClick={() => setForm({ ...form, appliesTo: new Set(form.appliesTo.size === ZONES.length ? [] : ZONES) })}
                    className="text-[12px] text-[#3b82f6] dark:text-[#60a5fa] hover:underline"
                  >
                    {form.appliesTo.size === ZONES.length ? "Deselect all" : "All zones"}
                  </button>
                </div>
                <div className="border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.2)] rounded-lg overflow-hidden">
                  {ZONES.map((z, i) => (
                    <label key={z} className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.4)] transition-colors ${i > 0 ? "border-t border-[#e5e7eb] dark:border-[rgba(59,130,246,0.08)]" : ""}`}>
                      <input type="checkbox" checked={form.appliesTo.has(z)} onChange={() => toggleZone(z)} className="size-4 accent-[#3b82f6]" />
                      <span className="text-[13px] text-[#111827] dark:text-[#e8eef5]">{z}</span>
                    </label>
                  ))}
                </div>
                {submitted && form.appliesTo.size === 0 && <p className={errCls}>Select at least one zone</p>}
              </div>

              {/* Link info */}
              <div className="flex items-start gap-2 p-3 rounded-lg bg-[#eff6ff] dark:bg-[rgba(59,130,246,0.08)] border border-[#bfdbfe] dark:border-[rgba(59,130,246,0.2)]">
                <Info className="size-4 text-[#3b82f6] dark:text-[#60a5fa] flex-shrink-0 mt-0.5" />
                <p className="text-[12px] text-[#1e40af] dark:text-[#93c5fd]">
                  This tariff will be available for selection when creating a <strong>Pay-to-Park</strong> policy assignment via <code className="bg-[#dbeafe] dark:bg-[#1e3a8a] px-1 rounded">tariff_id</code>.
                </p>
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
                  Create Tariff
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

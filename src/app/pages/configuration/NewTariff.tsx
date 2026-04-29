import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { DollarSign, Check, Info } from "lucide-react";

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
const FRACTION_INTERVALS = ["5 min", "10 min", "15 min", "20 min", "30 min"];
type RateType = "HOURLY" | "FLAT" | "FRACTIONAL" | "DAILY_CAP";

const RATE_TYPE_OPTS: { id: RateType; label: string; desc: string }[] = [
  { id: "HOURLY",     label: "Hourly",     desc: "Charge per full or partial hour" },
  { id: "FLAT",       label: "Flat",       desc: "Single fixed charge regardless of duration" },
  { id: "FRACTIONAL", label: "Fractional", desc: "Charge per configurable time interval" },
  { id: "DAILY_CAP",  label: "Daily Cap",  desc: "Hourly rate capped at a daily maximum" },
];

const labelCls = "block text-sm font-medium text-[#111827] dark:text-[#e8eef5] mb-2";
const inputCls = "w-full bg-white dark:bg-[#1a2d47] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg px-4 py-2 text-sm text-[#111827] dark:text-[#e8eef5] placeholder:text-[#6b7280] dark:placeholder:text-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent";
const errCls = "mt-1 text-xs text-[#ef4444]";

export default function NewTariff() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [rateType, setRateType] = useState<RateType>("HOURLY");
  const [rateAmount, setRateAmount] = useState("");
  const [flatAmount, setFlatAmount] = useState("");
  const [fractionInterval, setFractionInterval] = useState("15 min");
  const [freePeriod, setFreePeriod] = useState("");
  const [dailyCap, setDailyCap] = useState("");
  const [validDays, setValidDays] = useState(new Set(DAYS));
  const [validStart, setValidStart] = useState("00:00");
  const [validEnd, setValidEnd] = useState("23:59");
  const [effectiveFrom, setEffectiveFrom] = useState("");
  const [effectiveTo, setEffectiveTo] = useState("");
  const [appliesTo, setAppliesTo] = useState(new Set<string>());
  const [holidayEnabled, setHolidayEnabled] = useState(false);
  const [holidayRate, setHolidayRate] = useState("");

  const toggleDay = (d: string) => {
    const s = new Set(validDays);
    s.has(d) ? s.delete(d) : s.add(d);
    setValidDays(s);
  };

  const toggleZone = (z: string) => {
    const s = new Set(appliesTo);
    s.has(z) ? s.delete(z) : s.add(z);
    setAppliesTo(s);
  };

  const rateOk = rateType === "FLAT" ? !!flatAmount : !!rateAmount;

  const handleSave = () => {
    setSubmitted(true);
    if (!name || !rateOk || appliesTo.size === 0) return;
    navigate("/configuration/tariffs");
  };

  return (
    <>
      <div className="flex-1 overflow-auto bg-[#eff6ff] dark:bg-[#0a1628] pb-24">
        {/* Breadcrumb */}
        <div className="px-8 pt-6">
          <div className="flex items-center gap-2 text-[14px] text-[#6b7280] dark:text-[#94a3b8]">
            <Link to="/" className="hover:text-[#3b82f6]">Home</Link>
            <span>›</span>
            <Link to="/configuration/tariffs" className="hover:text-[#3b82f6]">Tariffs</Link>
            <span>›</span>
            <span className="text-[#111827] dark:text-[#e8eef5]">New Tariff</span>
          </div>
        </div>

        <div className="px-8 pt-4 pb-6">
          <h1 className="font-semibold text-[24px] leading-[32px] text-[#111827] dark:text-[#e8eef5]">New Tariff</h1>
          <p className="text-[14px] text-[#6b7280] dark:text-[#94a3b8] mt-1">Define a pricing structure for Pay-to-Park policy assignments</p>
        </div>

        <div className="px-8">
          <div className="grid grid-cols-5 gap-6">
            {/* ── Main Form ── */}
            <div className="col-span-3 space-y-6">

              {/* Basic Info */}
              <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6">
                <h2 className="font-semibold text-[#111827] dark:text-[#e8eef5] text-lg mb-6">Tariff Details</h2>
                <div className="space-y-5">
                  <div>
                    <label className={labelCls}>Tariff Name <span className="text-[#ef4444]">*</span></label>
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Downtown Peak Rate" className={inputCls} />
                    {submitted && !name && <p className={errCls}>Name is required</p>}
                  </div>
                </div>
              </div>

              {/* Rate Type */}
              <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6">
                <h2 className="font-semibold text-[#111827] dark:text-[#e8eef5] text-lg mb-6">Rate Configuration</h2>
                <div className="space-y-5">
                  <div>
                    <label className={labelCls}>Rate Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      {RATE_TYPE_OPTS.map((rt) => (
                        <button
                          key={rt.id}
                          onClick={() => setRateType(rt.id)}
                          className={`p-3 rounded-lg border text-left transition-colors ${
                            rateType === rt.id
                              ? "border-[#3b82f6] bg-[#eff6ff] dark:bg-[rgba(59,130,246,0.08)] dark:border-[#3b82f6]"
                              : "border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.3)]"
                          }`}
                        >
                          <p className="text-sm font-semibold text-[#111827] dark:text-[#e8eef5]">{rt.label}</p>
                          <p className="text-xs text-[#6b7280] dark:text-[#94a3b8] mt-0.5">{rt.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {rateType === "FLAT" ? (
                    <div>
                      <label className={labelCls}>Flat Rate ($) <span className="text-[#ef4444]">*</span></label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280] text-sm">$</span>
                        <input type="number" min={0} step={0.01} value={flatAmount} onChange={(e) => setFlatAmount(e.target.value)} placeholder="0.00" className={`${inputCls} pl-7`} />
                      </div>
                      {submitted && !flatAmount && <p className={errCls}>Flat rate is required</p>}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className={labelCls}>{rateType === "FRACTIONAL" ? "Rate per Interval ($)" : "Rate per Hour ($)"} <span className="text-[#ef4444]">*</span></label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280] text-sm">$</span>
                          <input type="number" min={0} step={0.01} value={rateAmount} onChange={(e) => setRateAmount(e.target.value)} placeholder="0.00" className={`${inputCls} pl-7`} />
                        </div>
                        {submitted && !rateAmount && <p className={errCls}>Rate is required</p>}
                      </div>
                      {rateType === "FRACTIONAL" && (
                        <div>
                          <label className={labelCls}>Interval</label>
                          <select value={fractionInterval} onChange={(e) => setFractionInterval(e.target.value)} className={inputCls}>
                            {FRACTION_INTERVALS.map((i) => <option key={i}>{i}</option>)}
                          </select>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={labelCls}>Free Period (min) <span className="text-xs font-normal text-[#6b7280]">optional</span></label>
                          <input type="number" min={0} value={freePeriod} onChange={(e) => setFreePeriod(e.target.value)} placeholder="0" className={inputCls} />
                        </div>
                        <div>
                          <label className={labelCls}>Daily Cap ($) <span className="text-xs font-normal text-[#6b7280]">optional</span></label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280] text-sm">$</span>
                            <input type="number" min={0} step={0.01} value={dailyCap} onChange={(e) => setDailyCap(e.target.value)} placeholder="No cap" className={`${inputCls} pl-7`} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Validity */}
              <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6">
                <h2 className="font-semibold text-[#111827] dark:text-[#e8eef5] text-lg mb-6">Validity</h2>
                <div className="space-y-5">
                  <div>
                    <label className={labelCls}>Valid Days</label>
                    <div className="flex gap-2 flex-wrap">
                      {DAYS.map((d) => (
                        <button key={d} onClick={() => toggleDay(d)} className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${validDays.has(d) ? "bg-[#3b82f6] text-white border-[#3b82f6]" : "border-[#e5e7eb] dark:border-[rgba(59,130,246,0.2)] text-[#6b7280] dark:text-[#94a3b8] hover:border-[#3b82f6]"}`}>
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Active From</label>
                      <input type="time" value={validStart} onChange={(e) => setValidStart(e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Active Until</label>
                      <input type="time" value={validEnd} onChange={(e) => setValidEnd(e.target.value)} className={inputCls} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Effective From</label>
                      <input type="date" value={effectiveFrom} onChange={(e) => setEffectiveFrom(e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Effective To</label>
                      <input type="date" value={effectiveTo} onChange={(e) => setEffectiveTo(e.target.value)} className={inputCls} />
                    </div>
                  </div>

                  {/* Holiday override */}
                  <div className="rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] overflow-hidden">
                    <button onClick={() => setHolidayEnabled(!holidayEnabled)} className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.3)] transition-colors">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[#111827] dark:text-[#e8eef5]">Holiday Override Rate</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#f3f4f6] dark:bg-[#1f2937] text-[#6b7280]">optional</span>
                      </div>
                      <div className="relative w-10 rounded-full flex-shrink-0" style={{ height: "22px", backgroundColor: holidayEnabled ? "#3b82f6" : "#d1d5db" }}>
                        <span className="absolute top-0.5 rounded-full bg-white shadow transition-transform" style={{ width: "18px", height: "18px", transform: holidayEnabled ? "translateX(20px)" : "translateX(2px)" }} />
                      </div>
                    </button>
                    {holidayEnabled && (
                      <div className="px-4 pb-4 pt-2 border-t border-[#e5e7eb] dark:border-[rgba(59,130,246,0.1)] bg-[#f9fafb] dark:bg-[#0a1628]">
                        <label className={`${labelCls} mt-1`}>Holiday Rate ($)</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280] text-sm">$</span>
                          <input type="number" min={0} step={0.01} value={holidayRate} onChange={(e) => setHolidayRate(e.target.value)} placeholder="0.00" className={`${inputCls} pl-7`} />
                        </div>
                        <p className="mt-1 text-xs text-[#6b7280]">Overrides the base rate on public holidays</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Applies To */}
              <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-[#111827] dark:text-[#e8eef5] text-lg">Applies To <span className="text-[#ef4444]">*</span></h2>
                  <button onClick={() => setAppliesTo(new Set(appliesTo.size === ZONES.length ? [] : ZONES))} className="text-sm text-[#3b82f6] hover:underline">
                    {appliesTo.size === ZONES.length ? "Deselect all" : "All zones"}
                  </button>
                </div>
                <div className="border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.2)] rounded-lg overflow-hidden">
                  {ZONES.map((z, i) => (
                    <label key={z} className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.4)] transition-colors ${i > 0 ? "border-t border-[#e5e7eb] dark:border-[rgba(59,130,246,0.08)]" : ""}`}>
                      <input type="checkbox" checked={appliesTo.has(z)} onChange={() => toggleZone(z)} className="size-4 accent-[#3b82f6]" />
                      <span className="text-sm text-[#111827] dark:text-[#e8eef5]">{z}</span>
                    </label>
                  ))}
                </div>
                {submitted && appliesTo.size === 0 && <p className={errCls}>Select at least one zone</p>}
              </div>
            </div>

            {/* ── Summary Sidebar ── */}
            <div className="col-span-2">
              <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6 sticky top-6">
                <h2 className="font-semibold text-[#111827] dark:text-[#e8eef5] text-lg mb-5">Summary</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Tariff Name</span>
                    <div className="flex items-center gap-2">
                      {name && <Check className="size-4 text-[#10b981]" />}
                      <span className={`text-sm ${name ? "text-[#111827] dark:text-[#e8eef5] font-medium" : "text-[#9ca3af]"}`}>{name || "—"}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Rate Type</span>
                    <span className="text-sm font-medium text-[#111827] dark:text-[#e8eef5]">{RATE_TYPE_OPTS.find(r => r.id === rateType)?.label}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Rate</span>
                    <div className="flex items-center gap-2">
                      {rateOk && <Check className="size-4 text-[#10b981]" />}
                      <span className={`text-sm ${rateOk ? "text-[#111827] dark:text-[#e8eef5] font-medium" : "text-[#9ca3af]"}`}>
                        {rateType === "FLAT" ? (flatAmount ? `$${flatAmount} flat` : "—") : (rateAmount ? `$${rateAmount}/hr` : "—")}
                      </span>
                    </div>
                  </div>
                  {dailyCap && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Daily Cap</span>
                      <span className="text-sm font-medium text-[#111827] dark:text-[#e8eef5]">${dailyCap}</span>
                    </div>
                  )}
                  <div className="border-t border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Zones Selected</span>
                      <div className="flex items-center gap-2">
                        {appliesTo.size > 0 && <Check className="size-4 text-[#10b981]" />}
                        <span className={`text-sm ${appliesTo.size > 0 ? "text-[#111827] dark:text-[#e8eef5] font-medium" : "text-[#9ca3af]"}`}>
                          {appliesTo.size === 0 ? "None" : appliesTo.size === ZONES.length ? "All zones" : `${appliesTo.size} zone${appliesTo.size !== 1 ? "s" : ""}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-start gap-2 p-3 rounded-lg bg-[#eff6ff] dark:bg-[rgba(59,130,246,0.08)] border border-[#bfdbfe] dark:border-[rgba(59,130,246,0.2)]">
                  <Info className="size-4 text-[#3b82f6] flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-[#1e40af] dark:text-[#93c5fd]">This tariff will be available as <code className="bg-[#dbeafe] dark:bg-[#1e3a8a] px-1 rounded">tariff_id</code> in Pay-to-Park assignments.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#0f1f35] border-t border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] px-8 py-4 z-10">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate("/configuration/tariffs")} className="border border-[#e5e7eb] text-[#111827] dark:text-[#e8eef5] font-medium rounded-lg px-6 py-2 hover:bg-[#eff6ff] dark:hover:bg-[rgba(30,58,95,0.3)] transition-colors">
            Cancel
          </button>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/configuration/tariffs")} className="border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.2)] text-[#111827] dark:text-[#e8eef5] font-medium rounded-lg px-5 py-2 hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)] transition-colors text-sm">
              Save Draft
            </button>
            <button onClick={handleSave} className="bg-[#3b82f6] text-white font-medium rounded-lg px-6 py-2 hover:bg-[#2563eb] transition-colors flex items-center gap-2">
              <DollarSign className="size-4" />
              Create Tariff
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

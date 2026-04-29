import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { CreditCard, Check, Info } from "lucide-react";

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

const CATEGORIES = [
  "RESIDENT", "EMPLOYEE", "HANDICAP", "COMMERCIAL",
  "FLEET", "MONTHLY", "CAMPUS", "VIP", "EV", "TENANT",
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const EXEMPTION_POLICIES = [
  "Permit Holders Policy",
  "2-Hour Free Parking",
  "Faculty Reserved",
  "Night Clearance — Zone G",
];

const labelCls = "block text-sm font-medium text-[#111827] dark:text-[#e8eef5] mb-2";
const inputCls = "w-full bg-white dark:bg-[#1a2d47] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg px-4 py-2 text-sm text-[#111827] dark:text-[#e8eef5] placeholder:text-[#6b7280] dark:placeholder:text-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent";
const errCls = "mt-1 text-xs text-[#ef4444]";

export default function NewPermit() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [typeCode, setTypeCode] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("RESIDENT");
  const [zones, setZones] = useState(new Set<string>());
  const [validDays, setValidDays] = useState(new Set(["Mon", "Tue", "Wed", "Thu", "Fri"]));
  const [validStart, setValidStart] = useState("08:00");
  const [validEnd, setValidEnd] = useState("18:00");
  const [effectiveFrom, setEffectiveFrom] = useState("");
  const [effectiveTo, setEffectiveTo] = useState("");
  const [maxStay, setMaxStay] = useState("");
  const [price, setPrice] = useState("");
  const [exemptions, setExemptions] = useState(new Set<string>());

  const toggleZone = (z: string) => {
    const s = new Set(zones);
    s.has(z) ? s.delete(z) : s.add(z);
    setZones(s);
  };

  const toggleDay = (d: string) => {
    const s = new Set(validDays);
    s.has(d) ? s.delete(d) : s.add(d);
    setValidDays(s);
  };

  const toggleExemption = (p: string) => {
    const s = new Set(exemptions);
    s.has(p) ? s.delete(p) : s.add(p);
    setExemptions(s);
  };

  const handleSave = () => {
    setSubmitted(true);
    if (!typeCode || !name || zones.size === 0) return;
    navigate("/configuration/permits");
  };

  return (
    <>
      <div className="flex-1 overflow-auto bg-[#eff6ff] dark:bg-[#0a1628] pb-24">
        {/* Breadcrumb */}
        <div className="px-8 pt-6">
          <div className="flex items-center gap-2 text-[14px] text-[#6b7280] dark:text-[#94a3b8]">
            <Link to="/" className="hover:text-[#3b82f6]">Home</Link>
            <span>›</span>
            <Link to="/configuration/permits" className="hover:text-[#3b82f6]">Permits</Link>
            <span>›</span>
            <span className="text-[#111827] dark:text-[#e8eef5]">New Permit Type</span>
          </div>
        </div>

        <div className="px-8 pt-4 pb-6">
          <h1 className="font-semibold text-[24px] leading-[32px] text-[#111827] dark:text-[#e8eef5]">New Permit Type</h1>
          <p className="text-[14px] text-[#6b7280] dark:text-[#94a3b8] mt-1">Define a permit type referenced in policy assignments as <code className="px-1 py-0.5 text-[12px] bg-[#f3f4f6] dark:bg-[#1f2937] rounded">allowed_permit_types[]</code></p>
        </div>

        <div className="px-8">
          <div className="grid grid-cols-5 gap-6">
            {/* ── Main Form ── */}
            <div className="col-span-3 space-y-6">

              {/* Identity */}
              <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6">
                <h2 className="font-semibold text-[#111827] dark:text-[#e8eef5] text-lg mb-6">Permit Details</h2>
                <div className="space-y-5">
                  <div>
                    <label className={labelCls}>Type Code <span className="text-[#ef4444]">*</span></label>
                    <input
                      value={typeCode}
                      onChange={(e) => setTypeCode(e.target.value.toUpperCase())}
                      placeholder="e.g. RES-ZONE-A"
                      className={`${inputCls} font-mono`}
                    />
                    <p className="mt-1 text-xs text-[#6b7280] dark:text-[#94a3b8]">Unique identifier used in policy rules</p>
                    {submitted && !typeCode && <p className={errCls}>Type code is required</p>}
                  </div>
                  <div>
                    <label className={labelCls}>Display Name <span className="text-[#ef4444]">*</span></label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Zone A Resident Permit"
                      className={inputCls}
                    />
                    {submitted && !name && <p className={errCls}>Display name is required</p>}
                  </div>
                  <div>
                    <label className={labelCls}>Category</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Zone Restrictions */}
              <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-[#111827] dark:text-[#e8eef5] text-lg">Zone Restrictions <span className="text-[#ef4444]">*</span></h2>
                  <button
                    onClick={() => setZones(new Set(zones.size === ZONES.length ? [] : ZONES))}
                    className="text-sm text-[#3b82f6] hover:underline"
                  >
                    {zones.size === ZONES.length ? "Deselect all" : "All zones"}
                  </button>
                </div>
                <div className="border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.2)] rounded-lg overflow-hidden">
                  {ZONES.map((z, i) => (
                    <label key={z} className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.4)] transition-colors ${i > 0 ? "border-t border-[#e5e7eb] dark:border-[rgba(59,130,246,0.08)]" : ""}`}>
                      <input type="checkbox" checked={zones.has(z)} onChange={() => toggleZone(z)} className="size-4 accent-[#3b82f6]" />
                      <span className="text-sm text-[#111827] dark:text-[#e8eef5]">{z}</span>
                    </label>
                  ))}
                </div>
                {submitted && zones.size === 0 && <p className={errCls}>Select at least one zone</p>}
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
                      <label className={labelCls}>Valid From</label>
                      <input type="time" value={validStart} onChange={(e) => setValidStart(e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Valid Until</label>
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
                </div>
              </div>

              {/* Advanced Options */}
              <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6">
                <h2 className="font-semibold text-[#111827] dark:text-[#e8eef5] text-lg mb-6">Advanced Options</h2>
                <div className="space-y-5">
                  <div>
                    <label className={labelCls}>Max Stay Override <span className="text-xs font-normal text-[#6b7280]">optional, minutes</span></label>
                    <input
                      type="number"
                      min={0}
                      value={maxStay}
                      onChange={(e) => setMaxStay(e.target.value)}
                      placeholder="Leave blank to use policy default"
                      className={inputCls}
                    />
                    <p className="mt-1 text-xs text-[#6b7280] dark:text-[#94a3b8]">Enforced by <code className="bg-[#f3f4f6] dark:bg-[#1f2937] px-1 rounded">PermitMaxStayRule</code></p>
                  </div>
                  <div>
                    <label className={labelCls}>Price / Tariff Link <span className="text-xs font-normal text-[#6b7280]">optional</span></label>
                    <input
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="e.g. $25.00 / month or link a Tariff"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Exemption Linkages</label>
                    <p className="text-xs text-[#6b7280] dark:text-[#94a3b8] mb-3">Policies where holders of this permit type are automatically exempt</p>
                    <div className="flex flex-col gap-2">
                      {EXEMPTION_POLICIES.map((p) => (
                        <label key={p} className="flex items-center gap-3 px-4 py-3 rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] cursor-pointer hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.4)] transition-colors">
                          <input type="checkbox" checked={exemptions.has(p)} onChange={() => toggleExemption(p)} className="size-4 accent-[#3b82f6]" />
                          <span className="text-sm text-[#111827] dark:text-[#e8eef5]">{p}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Summary Sidebar ── */}
            <div className="col-span-2">
              <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6 sticky top-6">
                <h2 className="font-semibold text-[#111827] dark:text-[#e8eef5] text-lg mb-5">Summary</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Type Code</span>
                    <div className="flex items-center gap-2">
                      {typeCode && <Check className="size-4 text-[#10b981]" />}
                      <span className={`text-sm font-mono ${typeCode ? "text-[#111827] dark:text-[#e8eef5] font-medium" : "text-[#9ca3af]"}`}>{typeCode || "—"}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Display Name</span>
                    <div className="flex items-center gap-2">
                      {name && <Check className="size-4 text-[#10b981]" />}
                      <span className={`text-sm ${name ? "text-[#111827] dark:text-[#e8eef5] font-medium" : "text-[#9ca3af]"}`}>{name || "—"}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Category</span>
                    <span className="text-sm font-medium text-[#111827] dark:text-[#e8eef5]">{category}</span>
                  </div>
                  <div className="border-t border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Zones</span>
                      <div className="flex items-center gap-2">
                        {zones.size > 0 && <Check className="size-4 text-[#10b981]" />}
                        <span className={`text-sm ${zones.size > 0 ? "text-[#111827] dark:text-[#e8eef5] font-medium" : "text-[#9ca3af]"}`}>
                          {zones.size === 0 ? "None" : zones.size === ZONES.length ? "All zones" : `${zones.size} zone${zones.size !== 1 ? "s" : ""}`}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Valid Days</span>
                    <span className="text-sm font-medium text-[#111827] dark:text-[#e8eef5]">
                      {validDays.size === 7 ? "All days" : validDays.size === 0 ? "None" : `${validDays.size} days`}
                    </span>
                  </div>
                  {exemptions.size > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Exemptions</span>
                      <span className="text-sm font-medium text-[#111827] dark:text-[#e8eef5]">{exemptions.size} linked</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex items-start gap-2 p-3 rounded-lg bg-[#eff6ff] dark:bg-[rgba(59,130,246,0.08)] border border-[#bfdbfe] dark:border-[rgba(59,130,246,0.2)]">
                  <Info className="size-4 text-[#3b82f6] flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-[#1e40af] dark:text-[#93c5fd]">This permit type will be referenced as <code className="bg-[#dbeafe] dark:bg-[#1e3a8a] px-1 rounded">allowed_permit_types[]</code> in policy assignments.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#0f1f35] border-t border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] px-8 py-4 z-10">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate("/configuration/permits")} className="border border-[#e5e7eb] text-[#111827] dark:text-[#e8eef5] font-medium rounded-lg px-6 py-2 hover:bg-[#eff6ff] dark:hover:bg-[rgba(30,58,95,0.3)] transition-colors">
            Cancel
          </button>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/configuration/permits")} className="border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.2)] text-[#111827] dark:text-[#e8eef5] font-medium rounded-lg px-5 py-2 hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)] transition-colors text-sm">
              Save Draft
            </button>
            <button onClick={handleSave} className="bg-[#3b82f6] text-white font-medium rounded-lg px-6 py-2 hover:bg-[#2563eb] transition-colors flex items-center gap-2">
              <CreditCard className="size-4" />
              Create Permit Type
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

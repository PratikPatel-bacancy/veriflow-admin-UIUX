import { useState, useRef, useEffect } from "react";
import { Plus, MoreHorizontal, CreditCard, X, Shield } from "lucide-react";

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

const CATEGORY_STYLES: Record<string, string> = {
  RESIDENT:   "bg-[#dbeafe] dark:bg-[#1e3a8a] text-[#1e40af] dark:text-[#93c5fd]",
  EMPLOYEE:   "bg-[#ede9fe] dark:bg-[#4c1d95] text-[#7c3aed] dark:text-[#c4b5fd]",
  HANDICAP:   "bg-[#d1fae5] dark:bg-[#065f46] text-[#065f46] dark:text-[#34d399]",
  COMMERCIAL: "bg-[#e0f2fe] dark:bg-[#0c4a6e] text-[#0369a1] dark:text-[#38bdf8]",
  FLEET:      "bg-[#fef3c7] dark:bg-[#78350f] text-[#92400e] dark:text-[#fcd34d]",
  MONTHLY:    "bg-[#f3f4f6] dark:bg-[#1f2937] text-[#6b7280] dark:text-[#9ca3af]",
  CAMPUS:     "bg-[#dbeafe] dark:bg-[#1e3a8a] text-[#1e40af] dark:text-[#93c5fd]",
  VIP:        "bg-[#fce7f3] dark:bg-[#831843] text-[#be185d] dark:text-[#f9a8d4]",
  EV:         "bg-[#d1fae5] dark:bg-[#065f46] text-[#065f46] dark:text-[#34d399]",
  TENANT:     "bg-[#ffedd5] dark:bg-[#7c2d12] text-[#ea580c] dark:text-[#fdba74]",
};

interface PermitType {
  id: number;
  typeCode: string;
  name: string;
  category: string;
  zonesCovered: string[];
  activeCount: number | "System";
  expires: string;
}

const MOCK_PERMITS: PermitType[] = [
  { id: 1, typeCode: "RES-ZONE-A",  name: "Zone A Resident Permit", category: "RESIDENT",   zonesCovered: ["Zone A — Permit Holders Only", "Zone C — Faculty & Staff Reserved", "Zone F — Accessible Parking (ADA)"], activeCount: 412,    expires: "2027-01" },
  { id: 2, typeCode: "EMP-CAMPUS",  name: "Campus Employee Permit",  category: "EMPLOYEE",   zonesCovered: ZONES,                                                                                                          activeCount: 1204,   expires: "Monthly" },
  { id: 3, typeCode: "HANDICAP",    name: "ADA / Accessible",        category: "HANDICAP",   zonesCovered: ZONES,                                                                                                          activeCount: "System", expires: "Never"  },
  { id: 4, typeCode: "COM-FLEET-1", name: "Commercial Fleet Pass",   category: "COMMERCIAL", zonesCovered: ["Zone B — General Public Parking", "Zone D — Short-Term Visitor (2-Hour)"],                                   activeCount: 87,     expires: "2026-12" },
  { id: 5, typeCode: "EV-CHARGE",   name: "EV Charging Priority",    category: "EV",         zonesCovered: ["Zone E — EV Charging Stations"],                                                                               activeCount: 34,     expires: "Monthly" },
  { id: 6, typeCode: "VIP-NORTH",   name: "VIP Reserved — North",    category: "VIP",        zonesCovered: ["Zone C — Faculty & Staff Reserved"],                                                                           activeCount: 56,     expires: "Annual"  },
];

// ── Form state ────────────────────────────────────────────────────────────

interface FormState {
  typeCode: string;
  name: string;
  category: string;
  zones: Set<string>;
  validDays: Set<string>;
  validStart: string;
  validEnd: string;
  effectiveFrom: string;
  effectiveTo: string;
  maxStay: string;
  price: string;
  exemptions: Set<string>;
}

const defaultForm = (): FormState => ({
  typeCode: "", name: "", category: "RESIDENT",
  zones: new Set(),
  validDays: new Set(["Mon", "Tue", "Wed", "Thu", "Fri"]),
  validStart: "08:00", validEnd: "18:00",
  effectiveFrom: "", effectiveTo: "",
  maxStay: "", price: "",
  exemptions: new Set(),
});

// ── Component ─────────────────────────────────────────────────────────────

export default function Permits() {
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

  const toggleZone = (z: string) => {
    const s = new Set(form.zones); s.has(z) ? s.delete(z) : s.add(z);
    setForm({ ...form, zones: s });
  };

  const toggleDay = (d: string) => {
    const s = new Set(form.validDays); s.has(d) ? s.delete(d) : s.add(d);
    setForm({ ...form, validDays: s });
  };

  const toggleExemption = (p: string) => {
    const s = new Set(form.exemptions); s.has(p) ? s.delete(p) : s.add(p);
    setForm({ ...form, exemptions: s });
  };

  const handleSave = () => {
    setSubmitted(true);
    if (!form.typeCode || !form.name || form.zones.size === 0) return;
    setShowForm(false);
    setForm(defaultForm());
    setSubmitted(false);
  };

  const labelCls = "block text-[13px] font-medium text-[#374151] dark:text-[#cbd5e1] mb-1";
  const inputCls = "w-full bg-[#f9fafb] dark:bg-[#0a1628] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.2)] rounded-lg px-3 py-2 text-[13px] text-[#111827] dark:text-[#e8eef5] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]";
  const errCls = "mt-1 text-[11px] text-[#dc2626]";

  return (
    <div className="flex-1 overflow-auto bg-[#eff6ff] dark:bg-[#0a1628] pb-8">
      <div className="px-8 pt-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-[22px] font-semibold text-[#111827] dark:text-[#e8eef5]">Permits</h1>
            <p className="text-[14px] text-[#6b7280] dark:text-[#94a3b8] mt-1">
              Define permit types referenced as <code className="px-1 py-0.5 text-[12px] bg-[#f3f4f6] dark:bg-[#1f2937] rounded">allowed_permit_types[]</code> in policy assignments
            </p>
          </div>
          <button
            onClick={() => { setShowForm(true); setForm(defaultForm()); setSubmitted(false); }}
            className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium bg-[#3b82f6] dark:bg-[#2563eb] text-white rounded-lg hover:bg-[#2563eb] dark:hover:bg-[#1d4ed8] transition-colors"
          >
            <Plus className="size-4" /> New Permit Type
          </button>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f9fafb] dark:bg-[#0a1628] border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
                {["Type", "Name", "Category", "Zones Covered", "Active", "Expires", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8] uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_PERMITS.map((permit) => (
                <tr key={permit.id} className="border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.08)] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.4)] transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <CreditCard className="size-4 text-[#3b82f6] dark:text-[#60a5fa] flex-shrink-0" />
                      <span className="font-mono text-[13px] font-semibold text-[#111827] dark:text-[#e8eef5]">{permit.typeCode}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[14px] text-[#111827] dark:text-[#e8eef5]">{permit.name}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full ${CATEGORY_STYLES[permit.category] ?? CATEGORY_STYLES.MONTHLY}`}>
                      {permit.category}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-[13px] text-[#6b7280] dark:text-[#94a3b8]">
                    {permit.zonesCovered.length === ZONES.length
                      ? "All zones"
                      : `${permit.zonesCovered.length} zone${permit.zonesCovered.length !== 1 ? "s" : ""}`}
                  </td>
                  <td className="px-4 py-4">
                    {permit.activeCount === "System"
                      ? <span className="flex items-center gap-1.5 text-[13px] text-[#6b7280] dark:text-[#94a3b8]"><Shield className="size-3.5" /> System</span>
                      : <span className="text-[14px] font-semibold text-[#111827] dark:text-[#e8eef5]">{permit.activeCount.toLocaleString()}</span>
                    }
                  </td>
                  <td className="px-4 py-4 text-[13px] text-[#6b7280] dark:text-[#94a3b8]">{permit.expires}</td>
                  <td className="px-4 py-4 relative" ref={openRowMenu === permit.id ? menuRef : undefined}>
                    <button
                      onClick={(e) => { e.stopPropagation(); setOpenRowMenu(openRowMenu === permit.id ? null : permit.id); }}
                      className="p-1.5 rounded-lg text-[#6b7280] dark:text-[#94a3b8] hover:bg-[#f3f4f6] dark:hover:bg-[rgba(30,58,95,0.5)] transition-colors"
                    >
                      <MoreHorizontal className="size-4" />
                    </button>
                    {openRowMenu === permit.id && (
                      <div className="absolute right-4 top-10 w-44 bg-white dark:bg-[#1a2d47] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-xl shadow-lg z-50 py-1 text-[13px]">
                        {["Edit", "Duplicate", "View Holders", "Deactivate"].map((item) => (
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

      {/* ── New Permit Type slide-over ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div className="flex-1 bg-black/40 dark:bg-black/60" onClick={() => setShowForm(false)} />

          {/* Panel */}
          <div className="w-[480px] bg-white dark:bg-[#0f1f35] h-full flex flex-col shadow-2xl border-l border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
            {/* Panel header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
              <h2 className="text-[16px] font-semibold text-[#111827] dark:text-[#e8eef5]">New Permit Type</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg text-[#6b7280] dark:text-[#94a3b8] hover:bg-[#f3f4f6] dark:hover:bg-[rgba(30,58,95,0.5)] transition-colors">
                <X className="size-5" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">

              {/* Type code */}
              <div>
                <label className={labelCls}>Type Code <span className="text-[#dc2626]">*</span></label>
                <input
                  value={form.typeCode}
                  onChange={(e) => setForm({ ...form, typeCode: e.target.value.toUpperCase() })}
                  placeholder="e.g. RES-ZONE-A"
                  className={`${inputCls} font-mono`}
                />
                <p className="mt-1 text-[12px] text-[#6b7280] dark:text-[#94a3b8]">Unique identifier used in policy rules</p>
                {submitted && !form.typeCode && <p className={errCls}>Type code is required</p>}
              </div>

              {/* Name */}
              <div>
                <label className={labelCls}>Display Name <span className="text-[#dc2626]">*</span></label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Zone A Resident Permit" className={inputCls} />
                {submitted && !form.name && <p className={errCls}>Name is required</p>}
              </div>

              {/* Category */}
              <div>
                <label className={labelCls}>Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Zone restrictions */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className={`${labelCls} mb-0`}>Zone Restrictions <span className="text-[#dc2626]">*</span></label>
                  <button
                    onClick={() => setForm({ ...form, zones: new Set(form.zones.size === ZONES.length ? [] : ZONES) })}
                    className="text-[12px] text-[#3b82f6] dark:text-[#60a5fa] hover:underline"
                  >
                    {form.zones.size === ZONES.length ? "Deselect all" : "All zones"}
                  </button>
                </div>
                <div className="border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.2)] rounded-lg overflow-hidden">
                  {ZONES.map((z, i) => (
                    <label key={z} className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.4)] transition-colors ${i > 0 ? "border-t border-[#e5e7eb] dark:border-[rgba(59,130,246,0.08)]" : ""}`}>
                      <input type="checkbox" checked={form.zones.has(z)} onChange={() => toggleZone(z)} className="size-4 accent-[#3b82f6]" />
                      <span className="text-[13px] text-[#111827] dark:text-[#e8eef5]">{z}</span>
                    </label>
                  ))}
                </div>
                {submitted && form.zones.size === 0 && <p className={errCls}>Select at least one zone</p>}
              </div>

              {/* Validity time windows */}
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
                  <label className={labelCls}>Valid From</label>
                  <input type="time" value={form.validStart} onChange={(e) => setForm({ ...form, validStart: e.target.value })} className={inputCls} />
                </div>
                <div className="flex-1">
                  <label className={labelCls}>Valid Until</label>
                  <input type="time" value={form.validEnd} onChange={(e) => setForm({ ...form, validEnd: e.target.value })} className={inputCls} />
                </div>
              </div>
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

              {/* Max stay override */}
              <div>
                <label className={labelCls}>Max Stay Override <span className="text-[12px] font-normal text-[#6b7280] dark:text-[#94a3b8]">(optional, minutes)</span></label>
                <input type="number" min={0} value={form.maxStay} onChange={(e) => setForm({ ...form, maxStay: e.target.value })} placeholder="Leave blank to use policy default" className={inputCls} />
                <p className="mt-1 text-[12px] text-[#6b7280] dark:text-[#94a3b8]">Enforced by <code className="bg-[#f3f4f6] dark:bg-[#1f2937] px-1 rounded">PermitMaxStayRule</code></p>
              </div>

              {/* Price */}
              <div>
                <label className={labelCls}>Price / Tariff Link <span className="text-[12px] font-normal text-[#6b7280] dark:text-[#94a3b8]">(optional)</span></label>
                <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="e.g. $25.00 / month or link a Tariff" className={inputCls} />
              </div>

              {/* Exemption linkages */}
              <div>
                <label className={labelCls}>Exemption Linkages</label>
                <p className="text-[12px] text-[#6b7280] dark:text-[#94a3b8] mb-2">Policies where holders of this permit type are automatically exempt</p>
                <div className="flex flex-col gap-1.5">
                  {EXEMPTION_POLICIES.map((p) => (
                    <label key={p} className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] cursor-pointer hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.4)] transition-colors">
                      <input type="checkbox" checked={form.exemptions.has(p)} onChange={() => toggleExemption(p)} className="size-4 accent-[#3b82f6]" />
                      <span className="text-[13px] text-[#111827] dark:text-[#e8eef5]">{p}</span>
                    </label>
                  ))}
                </div>
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
                  Create Permit Type
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

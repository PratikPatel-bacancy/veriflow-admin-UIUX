import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { Plus, MoreHorizontal, CreditCard, Shield, Search, Pencil, Trash2 } from "lucide-react";

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

// ── Component ─────────────────────────────────────────────────────────────

export default function Permits() {
  const navigate = useNavigate();
  const [openRowMenu, setOpenRowMenu] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const menuRef = useRef<HTMLDivElement>(null);

  const filteredPermits = MOCK_PERMITS.filter((p) => {
    if (categoryFilter !== "All" && p.category !== categoryFilter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.typeCode.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenRowMenu(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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
            onClick={() => navigate("/configuration/permits/new")}
            className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium bg-[#3b82f6] dark:bg-[#2563eb] text-white rounded-lg hover:bg-[#2563eb] dark:hover:bg-[#1d4ed8] transition-colors"
          >
            <Plus className="size-4" /> New Permit Type
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-4 shadow-sm flex flex-wrap gap-3 items-center mb-5">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#9ca3af]" />
            <input
              type="text"
              placeholder="Search permits…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-[14px] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.2)] rounded-lg bg-transparent text-[#111827] dark:text-[#e8eef5] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 text-[14px] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg bg-white dark:bg-[#0f1f35] text-[#111827] dark:text-[#e8eef5] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
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
              {filteredPermits.map((permit) => (
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
                  <td className="px-4 py-4" ref={openRowMenu === permit.id ? menuRef : undefined}>
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-[#eff6ff] dark:hover:bg-[rgba(59,130,246,0.1)] transition-colors" title="Edit">
                        <Pencil className="size-3.5 text-[#3b82f6] dark:text-[#60a5fa]" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-[#fee2e2] dark:hover:bg-[#7f1d1d] transition-colors" title="Deactivate">
                        <Trash2 className="size-3.5 text-[#ef4444] dark:text-[#f87171]" />
                      </button>
                      <div className="relative">
                        <button
                          onClick={(e) => { e.stopPropagation(); setOpenRowMenu(openRowMenu === permit.id ? null : permit.id); }}
                          className="p-1.5 rounded-lg text-[#6b7280] dark:text-[#94a3b8] hover:bg-[#f3f4f6] dark:hover:bg-[rgba(30,58,95,0.5)] transition-colors"
                        >
                          <MoreHorizontal className="size-4" />
                        </button>
                        {openRowMenu === permit.id && (
                          <div className="absolute right-0 top-8 w-44 bg-white dark:bg-[#1a2d47] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-xl shadow-lg z-50 py-1 text-[13px]">
                            {["Duplicate", "View Holders"].map((item) => (
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
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

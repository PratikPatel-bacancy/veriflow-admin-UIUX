import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { Plus, MoreHorizontal, DollarSign, Search, Pencil, Trash2 } from "lucide-react";

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

type RateType = "HOURLY" | "FLAT" | "FRACTIONAL" | "DAILY_CAP";

const RATE_TYPE_META: Record<RateType, { label: string; color: string }> = {
  HOURLY:     { label: "Hourly",     color: "bg-[#dbeafe] dark:bg-[#1e3a8a] text-[#1e40af] dark:text-[#93c5fd]" },
  FLAT:       { label: "Flat",       color: "bg-[#ede9fe] dark:bg-[#4c1d95] text-[#7c3aed] dark:text-[#c4b5fd]" },
  FRACTIONAL: { label: "Fractional", color: "bg-[#ffedd5] dark:bg-[#7c2d12] text-[#ea580c] dark:text-[#fdba74]" },
  DAILY_CAP:  { label: "Daily Cap",  color: "bg-[#d1fae5] dark:bg-[#065f46] text-[#065f46] dark:text-[#34d399]" },
};

const STATUS_STYLES: Record<string, string> = {
  Active:   "bg-[#d1fae5] dark:bg-[#065f46] text-[#065f46] dark:text-[#34d399]",
  Draft:    "bg-[#f3f4f6] dark:bg-[#1f2937] text-[#6b7280] dark:text-[#9ca3af]",
  Archived: "bg-[#fef3c7] dark:bg-[#78350f] text-[#92400e] dark:text-[#fcd34d]",
};

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

// ── Component ─────────────────────────────────────────────────────────────

export default function Tariffs() {
  const navigate = useNavigate();
  const [openRowMenu, setOpenRowMenu] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const menuRef = useRef<HTMLDivElement>(null);

  const filteredTariffs = MOCK_TARIFFS.filter((t) => {
    if (statusFilter !== "All" && t.status !== statusFilter) return false;
    if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false;
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
            <h1 className="text-[22px] font-semibold text-[#111827] dark:text-[#e8eef5]">Tariffs</h1>
            <p className="text-[14px] text-[#6b7280] dark:text-[#94a3b8] mt-1">
              Pricing structures linked to Pay-to-Park policy assignments via <code className="px-1 py-0.5 text-[12px] bg-[#f3f4f6] dark:bg-[#1f2937] rounded">tariff_id</code>
            </p>
          </div>
          <button
            onClick={() => navigate("/configuration/tariffs/new")}
            className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium bg-[#3b82f6] dark:bg-[#2563eb] text-white rounded-lg hover:bg-[#2563eb] dark:hover:bg-[#1d4ed8] transition-colors"
          >
            <Plus className="size-4" /> New Tariff
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-4 shadow-sm flex flex-wrap gap-3 items-center mb-5">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#9ca3af]" />
            <input
              type="text"
              placeholder="Search tariffs…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-[14px] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.2)] rounded-lg bg-transparent text-[#111827] dark:text-[#e8eef5] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 text-[14px] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg bg-white dark:bg-[#0f1f35] text-[#111827] dark:text-[#e8eef5] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
            <option value="Archived">Archived</option>
          </select>
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
              {filteredTariffs.map((t) => (
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
                  <td className="px-4 py-4" ref={openRowMenu === t.id ? menuRef : undefined}>
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-[#eff6ff] dark:hover:bg-[rgba(59,130,246,0.1)] transition-colors" title="Edit">
                        <Pencil className="size-3.5 text-[#3b82f6] dark:text-[#60a5fa]" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-[#fee2e2] dark:hover:bg-[#7f1d1d] transition-colors" title="Archive">
                        <Trash2 className="size-3.5 text-[#ef4444] dark:text-[#f87171]" />
                      </button>
                      <div className="relative">
                        <button
                          onClick={(e) => { e.stopPropagation(); setOpenRowMenu(openRowMenu === t.id ? null : t.id); }}
                          className="p-1.5 rounded-lg text-[#6b7280] dark:text-[#94a3b8] hover:bg-[#f3f4f6] dark:hover:bg-[rgba(30,58,95,0.5)] transition-colors"
                        >
                          <MoreHorizontal className="size-4" />
                        </button>
                        {openRowMenu === t.id && (
                          <div className="absolute right-0 top-8 w-44 bg-white dark:bg-[#1a2d47] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-xl shadow-lg z-50 py-1 text-[13px]">
                            {["Duplicate", "View Assignments"].map((item) => (
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

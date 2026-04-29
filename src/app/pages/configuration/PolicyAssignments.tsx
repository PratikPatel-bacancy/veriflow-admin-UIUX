import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Plus,
  Clock,
  Key,
  ShieldCheck,
  Truck,
  Ban,
  Zap,
  CreditCard,
  Timer,
  MoreHorizontal,
  CheckSquare,
  Square,
  AlertTriangle,
  Download,
  ChevronDown,
  AlertCircle,
  Search,
  Pencil,
  Trash2,
} from "lucide-react";

// ── Template meta (icon + color) ─────────────────────────────────────────────

const TEMPLATE_META: Record<string, { icon: React.ElementType; iconColor: string; iconBg: string }> = {
  "Permit-Only":   { icon: Key,         iconColor: "text-[#7c3aed]", iconBg: "bg-[#ede9fe] dark:bg-[#4c1d95]" },
  "2-Hour Parking":{ icon: Clock,       iconColor: "text-[#3b82f6]", iconBg: "bg-[#dbeafe] dark:bg-[#1e3a8a]" },
  "EV-Only":       { icon: Zap,         iconColor: "text-[#ca8a04]", iconBg: "bg-[#fef9c3] dark:bg-[#713f12]" },
  "Handicap":      { icon: ShieldCheck, iconColor: "text-[#16a34a]", iconBg: "bg-[#d1fae5] dark:bg-[#065f46]" },
  "Ops Window":    { icon: Timer,       iconColor: "text-[#3b82f6]", iconBg: "bg-[#dbeafe] dark:bg-[#1e3a8a]" },
  "Time-Limit":    { icon: Clock,       iconColor: "text-[#3b82f6]", iconBg: "bg-[#dbeafe] dark:bg-[#1e3a8a]" },
  "No Stopping":   { icon: Ban,         iconColor: "text-[#dc2626]", iconBg: "bg-[#fee2e2] dark:bg-[#7f1d1d]" },
  "Pay-to-Park":   { icon: CreditCard,  iconColor: "text-[#0891b2]", iconBg: "bg-[#cffafe] dark:bg-[#164e63]" },
  "90-min Parking":{ icon: Clock,       iconColor: "text-[#3b82f6]", iconBg: "bg-[#dbeafe] dark:bg-[#1e3a8a]" },
  "Loading-Only":  { icon: Truck,       iconColor: "text-[#ea580c]", iconBg: "bg-[#ffedd5] dark:bg-[#7c2d12]" },
};

// ── Mock assignments data ─────────────────────────────────────────────────────

const ASSIGNMENTS = [
  {
    id: 1,
    name: "Permit Holders Policy",
    template: "Permit-Only",
    targetType: "Zone",
    target: "Zone A — Permit Holders Only",
    site: "Pacific Plaza Garage",
    window: "24/7",
    effectiveFrom: "2026-01-01",
    effectiveTo: null,
    priority: 80,
    status: "Active",
    conflict: false,
  },
  {
    id: 2,
    name: "2h General Parking",
    template: "2-Hour Parking",
    targetType: "Zone",
    target: "Zone B — General Public Parking",
    site: "CF Pacific Centre",
    window: "Mon–Fri 8:00–18:00",
    effectiveFrom: "2026-01-15",
    effectiveTo: null,
    priority: 50,
    status: "Active",
    conflict: true,
    conflictDetail: "Conflicts with Weekend Rate — Zone B (pri 65); pri 65 wins on Sat–Sun overlap.",
  },
  {
    id: 3,
    name: "Faculty Reserved Rule",
    template: "Permit-Only",
    targetType: "Zone",
    target: "Zone C — Faculty & Staff Reserved",
    site: "Heritage Harbor Parking",
    window: "Mon–Fri 7:00–19:00",
    effectiveFrom: "2026-02-01",
    effectiveTo: null,
    priority: 85,
    status: "Active",
    conflict: false,
  },
  {
    id: 4,
    name: "Short-Term Visitor Limit",
    template: "2-Hour Parking",
    targetType: "Zone",
    target: "Zone D — Short-Term Visitor (2-Hour)",
    site: "875 Garnet Pacific Beach Parking",
    window: "Mon–Sat 9:00–20:00",
    effectiveFrom: "2026-02-10",
    effectiveTo: null,
    priority: 55,
    status: "Active",
    conflict: false,
  },
  {
    id: 5,
    name: "EV Charging Enforcement",
    template: "EV-Only",
    targetType: "Zone",
    target: "Zone E — EV Charging Stations",
    site: "Pan Pacific Park Parking",
    window: "24/7",
    effectiveFrom: "2026-01-01",
    effectiveTo: null,
    priority: 75,
    status: "Active",
    conflict: false,
  },
  {
    id: 6,
    name: "ADA Stall Compliance",
    template: "Handicap",
    targetType: "Zone",
    target: "Zone F — Accessible Parking (ADA)",
    site: "Pacific Plaza Garage",
    window: "24/7",
    effectiveFrom: "2026-01-01",
    effectiveTo: null,
    priority: 100,
    status: "Active",
    conflict: false,
  },
  {
    id: 7,
    name: "Event Day Overflow",
    template: "Ops Window",
    targetType: "Zone",
    target: "Zone G — Event Day Overflow",
    site: "CF Pacific Centre",
    window: "Event",
    effectiveFrom: "2026-05-01",
    effectiveTo: "2026-05-31",
    priority: 90,
    status: "Scheduled",
    conflict: true,
    conflictDetail: "Overlaps with Night Clearance — Zone G (pri 95); Night Clearance supersedes after 22:00.",
  },
  {
    id: 8,
    name: "Motorcycle Bay Rule",
    template: "Time-Limit",
    targetType: "Zone",
    target: "Zone H — Motorcycle & Bicycle",
    site: "Heritage Harbor Parking",
    window: "Mon–Sun 6:00–22:00",
    effectiveFrom: "2026-03-01",
    effectiveTo: null,
    priority: 60,
    status: "Active",
    conflict: false,
  },
  {
    id: 9,
    name: "Night Clearance — Zone G",
    template: "No Stopping",
    targetType: "Zone",
    target: "Zone G — Event Day Overflow",
    site: "CF Pacific Centre",
    window: "22:00–06:00",
    effectiveFrom: "2026-01-01",
    effectiveTo: null,
    priority: 95,
    status: "Active",
    conflict: true,
    conflictDetail: "Conflicts with Event Day Overflow (pri 90); this policy supersedes after 22:00.",
  },
  {
    id: 10,
    name: "Weekend Rate — Zone B",
    template: "Pay-to-Park",
    targetType: "Zone",
    target: "Zone B — General Public Parking",
    site: "CF Pacific Centre",
    window: "Sat–Sun 8:00–20:00",
    effectiveFrom: "2026-04-01",
    effectiveTo: null,
    priority: 65,
    status: "Draft",
    conflict: false,
  },
  {
    id: 11,
    name: "Short-Term Time Limit",
    template: "90-min Parking",
    targetType: "Zone",
    target: "Zone D — Short-Term Visitor (2-Hour)",
    site: "875 Garnet Pacific Beach Parking",
    window: "Mon–Fri 8:00–18:00",
    effectiveFrom: "2026-04-15",
    effectiveTo: null,
    priority: 55,
    status: "Draft",
    conflict: false,
  },
  {
    id: 12,
    name: "Holiday Suspension",
    template: "Ops Window",
    targetType: "Level",
    target: "Level 4 — North Structure",
    site: "Pan Pacific Park Parking",
    window: "Federal Holidays",
    effectiveFrom: "2026-01-01",
    effectiveTo: "2026-12-31",
    priority: 95,
    status: "Archived",
    conflict: false,
  },
];

const STATUS_FILTERS = ["All", "Active", "Scheduled", "Draft", "Archived"];

const TEMPLATES_LIST = [...new Set(ASSIGNMENTS.map((a) => a.template))];
const SITES_LIST = [...new Set(ASSIGNMENTS.map((a) => a.site))];
const TARGET_TYPES = ["All", "Zone", "Stall", "Level"];

const STATUS_STYLES: Record<string, string> = {
  Active:    "bg-[#d1fae5] dark:bg-[#065f46] text-[#065f46] dark:text-[#6ee7b7]",
  Scheduled: "bg-[#dbeafe] dark:bg-[#1e3a8a] text-[#1e40af] dark:text-[#60a5fa]",
  Draft:     "bg-[#f3f4f6] dark:bg-[#1a2d47] text-[#374151] dark:text-[#94a3b8]",
  Archived:  "bg-[#fef3c7] dark:bg-[#78350f] text-[#92400e] dark:text-[#fbbf24]",
};


// ── Component ─────────────────────────────────────────────────────────────────

export default function PolicyAssignments() {
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState("All");
  const [templateFilter, setTemplateFilter] = useState("all");
  const [targetTypeFilter, setTargetTypeFilter] = useState("All");
  const [siteFilter, setSiteFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [openRowMenu, setOpenRowMenu] = useState<number | null>(null);
  const [showBulkMenu, setShowBulkMenu] = useState(false);
  const [expandedConflict, setExpandedConflict] = useState<number | null>(null);

  const bulkMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (bulkMenuRef.current && !bulkMenuRef.current.contains(e.target as Node))
        setShowBulkMenu(false);
      setOpenRowMenu(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = ASSIGNMENTS.filter((a) => {
    if (statusFilter !== "All" && a.status !== statusFilter) return false;
    if (templateFilter !== "all" && a.template !== templateFilter) return false;
    if (targetTypeFilter !== "All" && a.targetType !== targetTypeFilter) return false;
    if (siteFilter !== "all" && a.site !== siteFilter) return false;
    if (search && !a.name.toLowerCase().includes(search.toLowerCase()) && !a.target.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const allSelected = filtered.length > 0 && filtered.every((a) => selectedRows.has(a.id));

  const toggleSelectAll = () => {
    if (allSelected) setSelectedRows(new Set());
    else setSelectedRows(new Set(filtered.map((a) => a.id)));
  };

  const toggleRow = (id: number) => {
    const next = new Set(selectedRows);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedRows(next);
  };


  return (
    <div className="flex-1 overflow-auto bg-[#eff6ff] dark:bg-[#0a1628] pb-8">

      {/* ── Page Header ── */}
      <div className="px-8 pt-8 pb-2 flex items-start justify-between">
        <div>
          <h1 className="font-['Inter'] font-semibold text-[28px] leading-[36px] text-[#111827] dark:text-[#e8eef5]">
            Policy Assignments
          </h1>
          <p className="font-['Inter'] text-[14px] text-[#6b7280] dark:text-[#94a3b8] mt-1">
            All active template-to-target bindings across sites and zones
          </p>
        </div>
        <button
          onClick={() => navigate("/configuration/policies/assignments/new")}
          className="flex items-center gap-2 bg-[#3b82f6] dark:bg-[#2563eb] text-white font-medium px-4 h-10 rounded-lg text-[14px] hover:bg-[#2563eb] dark:hover:bg-[#1d4ed8] transition-colors shadow-sm"
        >
          <Plus className="size-4" />
          New Assignment
        </button>
      </div>

      {/* ── Filter Bar ── */}
      <div className="px-8 pt-5">
        <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-4 shadow-sm flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#9ca3af]" />
            <input
              type="text"
              placeholder="Search assignments or targets…"
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
            {STATUS_FILTERS.map((f) => (
              <option key={f} value={f}>{f === "All" ? "All Statuses" : f}</option>
            ))}
          </select>
          <select
            value={templateFilter}
            onChange={(e) => setTemplateFilter(e.target.value)}
            className="px-4 py-2 text-[14px] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg bg-white dark:bg-[#0f1f35] text-[#111827] dark:text-[#e8eef5] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
          >
            <option value="all">All Templates</option>
            {TEMPLATES_LIST.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select
            value={targetTypeFilter}
            onChange={(e) => setTargetTypeFilter(e.target.value)}
            className="px-4 py-2 text-[14px] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg bg-white dark:bg-[#0f1f35] text-[#111827] dark:text-[#e8eef5] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
          >
            {TARGET_TYPES.map((t) => (
              <option key={t} value={t}>{t === "All" ? "All Target Types" : t}</option>
            ))}
          </select>
          <select
            value={siteFilter}
            onChange={(e) => setSiteFilter(e.target.value)}
            className="px-4 py-2 text-[14px] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg bg-white dark:bg-[#0f1f35] text-[#111827] dark:text-[#e8eef5] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
          >
            <option value="all">All Sites</option>
            {SITES_LIST.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* ── Assignments Table ── */}
      <div className="px-8 pt-5">
        <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f9fafb] dark:bg-[#0a1628] border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
                  <th className="px-5 py-3 w-10">
                    <button onClick={toggleSelectAll} className="flex items-center">
                      {allSelected
                        ? <CheckSquare className="size-4 text-[#3b82f6]" />
                        : <Square className="size-4 text-[#6b7280] dark:text-[#94a3b8]" />}
                    </button>
                  </th>
                  {["Assignment Name", "Template", "Target", "Time Window", "Effective Dates", "Status", ""].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8] uppercase tracking-wider whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => {
                  const meta = TEMPLATE_META[a.template] ?? TEMPLATE_META["Time-Limit"];
                  const Icon = meta.icon;
                  const isSelected = selectedRows.has(a.id);
                  const menuOpen = openRowMenu === a.id;
                  const conflictOpen = expandedConflict === a.id;

                  return (
                    <>
                      <tr
                        key={a.id}
                        onClick={() => navigate(`/configuration/policies/${a.id}`)}
                        className={`border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-[#eff6ff] dark:bg-[rgba(59,130,246,0.06)]"
                            : "hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)]"
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="px-5 py-4">
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleRow(a.id); }}
                            className="flex items-center"
                          >
                            {isSelected
                              ? <CheckSquare className="size-4 text-[#3b82f6]" />
                              : <Square className="size-4 text-[#6b7280] dark:text-[#94a3b8]" />}
                          </button>
                        </td>

                        {/* Assignment Name + conflict badge */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-['Inter'] font-medium text-[14px] text-[#111827] dark:text-[#e8eef5] whitespace-nowrap">
                              {a.name}
                            </span>
                            {a.conflict && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedConflict(conflictOpen ? null : a.id);
                                }}
                                title="View conflict details"
                                className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#fef3c7] dark:bg-[#78350f]/40 border border-[#fbbf24]/50 hover:bg-[#fde68a] dark:hover:bg-[#78350f]/70 transition-colors"
                              >
                                <AlertTriangle className="size-3 text-[#d97706] dark:text-[#fbbf24]" />
                                <span className="text-[10px] font-semibold text-[#92400e] dark:text-[#fbbf24]">Conflict</span>
                              </button>
                            )}
                          </div>
                        </td>

                        {/* Template */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className={`${meta.iconBg} rounded-lg p-1.5 flex-shrink-0`}>
                              <Icon className={`size-3.5 ${meta.iconColor}`} />
                            </div>
                            <span className="text-[13px] font-medium text-[#374151] dark:text-[#94a3b8] whitespace-nowrap">
                              {a.template}
                            </span>
                          </div>
                        </td>

                        {/* Target */}
                        <td className="px-4 py-4">
                          <div>
                            <p className="text-[13px] font-medium text-[#111827] dark:text-[#e8eef5] whitespace-nowrap">
                              {a.target}
                            </p>
                            <p className="text-[11px] text-[#6b7280] dark:text-[#94a3b8] mt-0.5">
                              {a.targetType} · {a.site}
                            </p>
                          </div>
                        </td>

                        {/* Time Window */}
                        <td className="px-4 py-4 text-[13px] text-[#6b7280] dark:text-[#94a3b8] whitespace-nowrap">
                          {a.window}
                        </td>

                        {/* Effective Dates */}
                        <td className="px-4 py-4">
                          <div className="text-[12px]">
                            <p className="text-[#111827] dark:text-[#e8eef5] font-medium">{a.effectiveFrom}</p>
                            <p className="text-[#6b7280] dark:text-[#94a3b8] mt-0.5">
                              → {a.effectiveTo ?? "indefinite"}
                            </p>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[a.status] ?? STATUS_STYLES.Draft}`}>
                            {a.status}
                          </span>
                        </td>

                        {/* Row actions */}
                        <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-1">
                            <button className="p-1.5 rounded-lg hover:bg-[#eff6ff] dark:hover:bg-[rgba(59,130,246,0.1)] transition-colors" title="Edit">
                              <Pencil className="size-3.5 text-[#3b82f6] dark:text-[#60a5fa]" />
                            </button>
                            <button className="p-1.5 rounded-lg hover:bg-[#fee2e2] dark:hover:bg-[#7f1d1d] transition-colors" title="Archive">
                              <Trash2 className="size-3.5 text-[#ef4444] dark:text-[#f87171]" />
                            </button>
                            <div className="relative">
                              <button
                                onClick={(e) => { e.stopPropagation(); setOpenRowMenu(menuOpen ? null : a.id); }}
                                className="p-1.5 rounded-lg hover:bg-[#f3f4f6] dark:hover:bg-[rgba(30,58,95,0.7)] transition-colors"
                              >
                                <MoreHorizontal className="size-4 text-[#6b7280] dark:text-[#94a3b8]" />
                              </button>
                              {menuOpen && (
                                <div className="absolute right-0 top-8 w-44 bg-white dark:bg-[#0f1f35] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg shadow-xl z-50 py-1">
                                  {["Duplicate", "View Detail"].map((opt) => (
                                    <button
                                      key={opt}
                                      onClick={(e) => { e.stopPropagation(); setOpenRowMenu(null); }}
                                      className="w-full text-left px-4 py-2 text-sm text-[#111827] dark:text-[#e8eef5] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)] transition-colors"
                                    >
                                      {opt}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>

                      {/* Conflict detail row */}
                      {a.conflict && conflictOpen && (
                        <tr
                          key={`conflict-${a.id}`}
                          className="bg-[#fffbeb] dark:bg-[#78350f]/20 border-b border-[#fbbf24]/30"
                        >
                          <td colSpan={8} className="px-8 py-3">
                            <div className="flex items-start gap-2.5">
                              <AlertCircle className="size-4 text-[#d97706] dark:text-[#fbbf24] flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-[12px] font-semibold text-[#92400e] dark:text-[#fbbf24] mb-0.5">
                                  Conflict Detail
                                </p>
                                <p className="text-[12px] text-[#78350f] dark:text-[#fcd34d]">
                                  {a.conflictDetail}
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-16 text-center">
                      <Search className="size-10 text-[#d1d5db] dark:text-[#374151] mx-auto mb-3" />
                      <p className="text-[14px] font-medium text-[#6b7280] dark:text-[#94a3b8]">No assignments match your filters</p>
                      <p className="text-[12px] text-[#9ca3af] dark:text-[#6b7280] mt-1">Try adjusting the status, template, or site filters</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ── Table Footer ── */}
          <div className="px-5 py-3 flex items-center justify-between border-t border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
            <div className="flex items-center gap-3" ref={bulkMenuRef}>
              <div className="relative">
                <button
                  onClick={() => setShowBulkMenu((v) => !v)}
                  disabled={selectedRows.size === 0}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg text-[#111827] dark:text-[#e8eef5] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Bulk Actions
                  <ChevronDown className="size-3.5" />
                </button>
                {showBulkMenu && selectedRows.size > 0 && (
                  <div className="absolute left-0 bottom-full mb-1 w-52 bg-white dark:bg-[#0f1f35] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg shadow-lg z-50 py-1">
                    {["Archive Selected", "Duplicate Selected", "Change Validity", "Export Selected"].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setShowBulkMenu(false)}
                        className="w-full text-left px-4 py-2 text-sm text-[#111827] dark:text-[#e8eef5] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)] transition-colors"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {selectedRows.size > 0 && (
                <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">
                  {selectedRows.size} selected
                </span>
              )}
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[13px] text-[#6b7280] dark:text-[#94a3b8]">
                {filtered.length} of {ASSIGNMENTS.length} assignments
              </span>
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg text-[#111827] dark:text-[#e8eef5] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)] transition-colors">
                <Download className="size-4" />
                Export CSV
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

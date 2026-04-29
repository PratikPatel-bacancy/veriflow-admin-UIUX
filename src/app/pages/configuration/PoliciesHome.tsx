import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Plus,
  ChevronDown,
  MoreHorizontal,
  Clock,
  Key,
  ShieldCheck,
  Truck,
  Ban,
  Building2,
  Zap,
  CreditCard,
  Timer,
  Search,
  X,
  ArrowRight,
  Download,
  CheckSquare,
  Square,
  Pencil,
  Trash2,
} from "lucide-react";

// ── Real data mirrored from SitesList, ZoneList ──────────────────────────

const SITES = [
  "Pacific Plaza Garage",
  "CF Pacific Centre",
  "Heritage Harbor Parking",
  "875 Garnet Pacific Beach Parking",
  "Pan Pacific Park Parking",
];

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

// ── Mock policies using real site/zone names ─────────────────────────────

const mockPolicies = [
  {
    id: 1,
    name: "Permit Holders Policy",
    template: "Permit-Only",
    targetType: "Zone",
    target: "Zone A — Permit Holders Only",
    window: "24/7",
    priority: 80,
    status: "Active",
  },
  {
    id: 2,
    name: "2h General Parking",
    template: "2-Hour Parking",
    targetType: "Zone",
    target: "Zone B — General Public Parking",
    window: "Mon–Fri 8:00–18:00",
    priority: 50,
    status: "Active",
  },
  {
    id: 3,
    name: "Faculty Reserved Rule",
    template: "Permit-Only",
    targetType: "Zone",
    target: "Zone C — Faculty & Staff Reserved",
    window: "Mon–Fri 7:00–19:00",
    priority: 85,
    status: "Active",
  },
  {
    id: 4,
    name: "Short-Term Visitor Limit",
    template: "2-Hour Parking",
    targetType: "Zone",
    target: "Zone D — Short-Term Visitor (2-Hour)",
    window: "Mon–Sat 9:00–20:00",
    priority: 55,
    status: "Active",
  },
  {
    id: 5,
    name: "EV Charging Enforcement",
    template: "EV-Only",
    targetType: "Zone",
    target: "Zone E — EV Charging Stations",
    window: "24/7",
    priority: 75,
    status: "Active",
  },
  {
    id: 6,
    name: "ADA Stall Compliance",
    template: "Handicap",
    targetType: "Zone",
    target: "Zone F — Accessible Parking (ADA)",
    window: "24/7",
    priority: 100,
    status: "Active",
  },
  {
    id: 7,
    name: "Event Day Overflow",
    template: "Ops Window",
    targetType: "Zone",
    target: "Zone G — Event Day Overflow",
    window: "Event",
    priority: 90,
    status: "Scheduled",
  },
  {
    id: 8,
    name: "Motorcycle Bay Rule",
    template: "Time-Limit",
    targetType: "Zone",
    target: "Zone H — Motorcycle & Bicycle",
    window: "Mon–Sun 6:00–22:00",
    priority: 60,
    status: "Active",
  },
  {
    id: 9,
    name: "Night Clearance — Zone G",
    template: "No Stopping",
    targetType: "Zone",
    target: "Zone G — Event Day Overflow",
    window: "22:00–06:00",
    priority: 95,
    status: "Active",
  },
  {
    id: 10,
    name: "Weekend Rate — Zone B",
    template: "Pay-to-Park",
    targetType: "Zone",
    target: "Zone B — General Public Parking",
    window: "Sat–Sun 8:00–20:00",
    priority: 65,
    status: "Draft",
  },
  {
    id: 11,
    name: "Short-Term Time Limit",
    template: "90-min Parking",
    targetType: "Zone",
    target: "Zone D — Short-Term Visitor (2-Hour)",
    window: "Mon–Fri 8:00–18:00",
    priority: 55,
    status: "Draft",
  },
  {
    id: 12,
    name: "Holiday Suspension",
    template: "Ops Window",
    targetType: "Level",
    target: "Level 4 — North Structure",
    window: "Federal Holidays",
    priority: 95,
    status: "Archived",
  },
];

// ── Rule types used for filter dropdown ──────────────────────────────────

const RULE_TYPES = ["Time-Limit", "Permit", "No-Stopping", "Loading", "EV-Only", "Handicap"];

// ── 12 System Templates ──────────────────────────────────────────────────

const TEMPLATES = [
  {
    id: 1,
    name: "30-min Parking",
    category: "Time-Limit",
    description: "Enforces a 30-minute maximum dwell time in high-turnover areas.",
    compatibleWith: ["Zone", "Stall", "Level"],
    badge: "System",
    icon: Clock,
    iconColor: "text-[#3b82f6]",
    iconBg: "bg-[#dbeafe] dark:bg-[#1e3a8a]",
  },
  {
    id: 2,
    name: "1-Hour Parking",
    category: "Time-Limit",
    description: "Limits vehicle dwell to 1 hour; suitable for retail and service areas.",
    compatibleWith: ["Zone", "Stall"],
    badge: "System",
    icon: Clock,
    iconColor: "text-[#3b82f6]",
    iconBg: "bg-[#dbeafe] dark:bg-[#1e3a8a]",
  },
  {
    id: 3,
    name: "2-Hour Parking",
    category: "Time-Limit",
    description: "Standard 2-hour free parking limit for general public zones.",
    compatibleWith: ["Zone", "Stall", "Level"],
    badge: "System",
    icon: Clock,
    iconColor: "text-[#3b82f6]",
    iconBg: "bg-[#dbeafe] dark:bg-[#1e3a8a]",
  },
  {
    id: 4,
    name: "90-min Parking",
    category: "Time-Limit",
    description: "90-minute dwell limit for mixed-use zones during business hours.",
    compatibleWith: ["Zone", "Stall"],
    badge: "System",
    icon: Clock,
    iconColor: "text-[#3b82f6]",
    iconBg: "bg-[#dbeafe] dark:bg-[#1e3a8a]",
  },
  {
    id: 5,
    name: "Permit-Only",
    category: "Permit",
    description: "Restricts parking to vehicles displaying a valid zone permit.",
    compatibleWith: ["Zone", "Level"],
    badge: "System",
    icon: Key,
    iconColor: "text-[#7c3aed]",
    iconBg: "bg-[#ede9fe] dark:bg-[#4c1d95]",
  },
  {
    id: 6,
    name: "Handicap Stall",
    category: "Accessible",
    description: "Reserves the stall exclusively for ADA placards and disabled plates.",
    compatibleWith: ["Stall"],
    badge: "System",
    icon: ShieldCheck,
    iconColor: "text-[#16a34a]",
    iconBg: "bg-[#d1fae5] dark:bg-[#065f46]",
  },
  {
    id: 7,
    name: "Loading-Only",
    category: "Loading",
    description: "Designates space for active commercial loading and unloading only.",
    compatibleWith: ["Zone", "Stall"],
    badge: "System",
    icon: Truck,
    iconColor: "text-[#ea580c]",
    iconBg: "bg-[#ffedd5] dark:bg-[#7c2d12]",
  },
  {
    id: 8,
    name: "No Stopping",
    category: "Restriction",
    description: "Prohibits all stopping or parking at any time in the target area.",
    compatibleWith: ["Zone"],
    badge: "System",
    icon: Ban,
    iconColor: "text-[#dc2626]",
    iconBg: "bg-[#fee2e2] dark:bg-[#7f1d1d]",
  },
  {
    id: 9,
    name: "Commercial-Only",
    category: "Commercial",
    description: "Limits access to registered commercial vehicles with valid permits.",
    compatibleWith: ["Zone"],
    badge: "System",
    icon: Building2,
    iconColor: "text-[#0369a1]",
    iconBg: "bg-[#e0f2fe] dark:bg-[#0c4a6e]",
  },
  {
    id: 10,
    name: "EV-Only",
    category: "EV",
    description: "Reserves charging stalls for electric vehicles; enforces after charge completion.",
    compatibleWith: ["Zone", "Stall"],
    badge: "System",
    icon: Zap,
    iconColor: "text-[#ca8a04]",
    iconBg: "bg-[#fef9c3] dark:bg-[#713f12]",
  },
  {
    id: 11,
    name: "Pay-to-Park",
    category: "Payment",
    description: "Requires active meter payment; links to a tariff for hourly rate enforcement.",
    compatibleWith: ["Zone", "Stall", "Level"],
    badge: "System",
    icon: CreditCard,
    iconColor: "text-[#0891b2]",
    iconBg: "bg-[#cffafe] dark:bg-[#164e63]",
  },
  {
    id: 12,
    name: "Free + Time-Limit",
    category: "Time-Limit",
    description: "Free parking allowed up to a defined dwell period; violations issued after expiry.",
    compatibleWith: ["Zone", "Stall", "Level"],
    badge: "System",
    icon: Timer,
    iconColor: "text-[#3b82f6]",
    iconBg: "bg-[#dbeafe] dark:bg-[#1e3a8a]",
  },
];

const TEMPLATE_CATEGORIES = ["All", ...Array.from(new Set(TEMPLATES.map((t) => t.category)))];

// ─────────────────────────────────────────────────────────────────────────

const STATUS_FILTERS = ["All", "Active", "Scheduled", "Draft", "Archived"];



const STATUS_STYLES: Record<string, string> = {
  Active:    "bg-[#d1fae5] dark:bg-[#065f46] text-[#065f46] dark:text-[#6ee7b7]",
  Scheduled: "bg-[#dbeafe] dark:bg-[#1e3a8a] text-[#1e40af] dark:text-[#60a5fa]",
  Draft:     "bg-[#f3f4f6] dark:bg-[#1a2d47] text-[#374151] dark:text-[#94a3b8]",
  Archived:  "bg-[#fef3c7] dark:bg-[#78350f] text-[#92400e] dark:text-[#fbbf24]",
};

export default function PoliciesHome() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("All");
  const [openRowMenu, setOpenRowMenu] = useState<number | null>(null);
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
  const [templateSearch, setTemplateSearch] = useState("");
  const [templateCategory, setTemplateCategory] = useState("All");
  const [siteFilter, setSiteFilter] = useState("all");
  const [zoneFilter, setZoneFilter] = useState("all");
  const [ruleTypeFilter, setRuleTypeFilter] = useState("all");
  const [search, setSearch] = useState("");

  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const templateDropdownRef = useRef<HTMLDivElement>(null);

  const filteredPolicies = mockPolicies.filter((p) => {
    if (search) {
      const q = search.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.template.toLowerCase().includes(q) && !p.target.toLowerCase().includes(q)) return false;
    }
    if (statusFilter !== "All" && p.status !== statusFilter) return false;
    if (zoneFilter !== "all" && !p.target.includes(zoneFilter)) return false;
    if (ruleTypeFilter !== "all" && p.template !== ruleTypeFilter) return false;
    return true;
  });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (templateDropdownRef.current && !templateDropdownRef.current.contains(e.target as Node))
        setShowTemplateDropdown(false);
      setOpenRowMenu(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="flex-1 overflow-auto bg-[#eff6ff] dark:bg-[#0a1628] pb-8">

      {/* ── Page Header ── */}
      <div className="px-8 pt-8 pb-2 flex items-start justify-between">
        <div>
          <h1 className="font-['Inter'] font-semibold text-[28px] leading-[36px] text-[#111827] dark:text-[#e8eef5]">
            Policies
          </h1>
          <p className="font-['Inter'] text-[14px] text-[#6b7280] dark:text-[#94a3b8] mt-1">
            Manage parking rules applied to zones, stalls, and levels
          </p>
        </div>

        {/* Split button: "New from Template" + chevron dropdown */}
        <div className="relative" ref={templateDropdownRef}>
          <div className="inline-flex items-stretch rounded-lg overflow-hidden shadow-sm h-10">
            <button
              onClick={() => { setShowTemplateDropdown(false); setShowTemplateGallery(true); }}
              className="flex items-center gap-2 bg-[#3b82f6] dark:bg-[#2563eb] text-white font-medium px-4 text-[14px] hover:bg-[#2563eb] dark:hover:bg-[#1d4ed8] transition-colors whitespace-nowrap"
            >
              <Plus className="size-4 flex-shrink-0" />
              New from Template
            </button>
            <div className="w-px bg-[rgba(255,255,255,0.3)] self-stretch" />
            <button
              onClick={() => setShowTemplateDropdown((v) => !v)}
              className="flex items-center justify-center bg-[#3b82f6] dark:bg-[#2563eb] text-white w-9 hover:bg-[#2563eb] dark:hover:bg-[#1d4ed8] transition-colors flex-shrink-0"
              aria-label="More options"
            >
              <ChevronDown className={`size-4 transition-transform duration-150 ${showTemplateDropdown ? "rotate-180" : ""}`} />
            </button>
          </div>

          {showTemplateDropdown && (
            <div className="absolute right-0 top-full mt-1.5 w-56 bg-white dark:bg-[#0f1f35] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg shadow-xl z-50 py-1 overflow-hidden">
              {[
                { label: "Browse Templates", desc: "Pick from 12 system templates", action: () => { setShowTemplateDropdown(false); setShowTemplateGallery(true); } },
                { label: "Create Custom Template", desc: "Build a new rule from scratch", action: () => { setShowTemplateDropdown(false); navigate("/configuration/policies/templates/new"); } },
                { label: "Import from CSV", desc: "Bulk import policy definitions", action: () => setShowTemplateDropdown(false) },
              ].map(({ label, desc, action }) => (
                <button
                  key={label}
                  onClick={action}
                  className="w-full text-left px-4 py-2.5 hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)] transition-colors"
                >
                  <p className="text-[13px] font-medium text-[#111827] dark:text-[#e8eef5]">{label}</p>
                  <p className="text-[11px] text-[#6b7280] dark:text-[#94a3b8] mt-0.5">{desc}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="px-8 pt-5">
        <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-4 shadow-sm flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#9ca3af]" />
            <input
              type="text"
              placeholder="Search by policy name, template, or target…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-[14px] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.2)] rounded-lg bg-transparent text-[#111827] dark:text-[#e8eef5] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-[200px] px-4 py-2 text-[14px] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg bg-white dark:bg-[#0f1f35] text-[#111827] dark:text-[#e8eef5] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
          >
            {STATUS_FILTERS.map((f) => (
              <option key={f} value={f}>{f === "All" ? "All Statuses" : f}</option>
            ))}
          </select>
          <select
            value={siteFilter}
            onChange={(e) => setSiteFilter(e.target.value)}
            className="w-[200px] px-4 py-2 text-[14px] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg bg-white dark:bg-[#0f1f35] text-[#111827] dark:text-[#e8eef5] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
          >
            <option value="all">All Sites</option>
            {SITES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            className="w-[200px] px-4 py-2 text-[14px] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg bg-white dark:bg-[#0f1f35] text-[#111827] dark:text-[#e8eef5] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
          >
            <option value="all">All Zones</option>
            {ZONES.map((z) => <option key={z} value={z}>{z}</option>)}
          </select>
          <select
            value={ruleTypeFilter}
            onChange={(e) => setRuleTypeFilter(e.target.value)}
            className="w-[200px] px-4 py-2 text-[14px] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg bg-white dark:bg-[#0f1f35] text-[#111827] dark:text-[#e8eef5] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
          >
            <option value="all">All Rule Types</option>
            {RULE_TYPES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      {/* ── Policy Table ── */}
      <div className="px-8 pt-6">
        <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f9fafb] dark:bg-[#0a1628] border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
                  <th className="px-4 py-3 w-10">
                    <button
                      onClick={() => {
                        if (selectedRows.size === filteredPolicies.length) {
                          setSelectedRows(new Set());
                        } else {
                          setSelectedRows(new Set(filteredPolicies.map((p) => p.id)));
                        }
                      }}
                      className="text-[#9ca3af] dark:text-[#6b7280] hover:text-[#3b82f6] transition-colors"
                    >
                      {selectedRows.size === filteredPolicies.length && filteredPolicies.length > 0
                        ? <CheckSquare className="size-4" />
                        : <Square className="size-4" />
                      }
                    </button>
                  </th>
                  {["Policy Name", "Template", "Target", "Window", "Status", ""].map((col) => (
                    <th key={col} className="text-left text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8] px-4 py-3 whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredPolicies.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center text-[14px] text-[#6b7280] dark:text-[#94a3b8]">
                      No policies match the current filters.
                    </td>
                  </tr>
                ) : (
                  filteredPolicies.map((policy) => (
                    <tr
                      key={policy.id}
                      onClick={() => navigate(`/configuration/policies/${policy.id}`)}
                      className="border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)] cursor-pointer"
                    >
                      {/* Checkbox */}
                      <td className="px-4 py-4 w-10" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            const next = new Set(selectedRows);
                            next.has(policy.id) ? next.delete(policy.id) : next.add(policy.id);
                            setSelectedRows(next);
                          }}
                          className="text-[#9ca3af] dark:text-[#6b7280] hover:text-[#3b82f6] transition-colors"
                        >
                          {selectedRows.has(policy.id)
                            ? <CheckSquare className="size-4 text-[#3b82f6]" />
                            : <Square className="size-4" />
                          }
                        </button>
                      </td>

                      {/* Policy Name */}
                      <td className="px-4 py-4">
                        <p className="text-[14px] font-medium text-[#111827] dark:text-[#e8eef5] whitespace-nowrap">{policy.name}</p>
                      </td>

                      {/* Template */}
                      <td className="px-4 py-4 text-[14px] text-[#6b7280] dark:text-[#94a3b8] whitespace-nowrap">
                        {policy.template}
                      </td>

                      {/* Target */}
                      <td className="px-4 py-4 text-[14px] text-[#6b7280] dark:text-[#94a3b8] max-w-[260px] truncate">
                        <span className="text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">
                          {policy.targetType} / </span>{policy.target}
                      </td>

                      {/* Window */}
                      <td className="px-4 py-4 text-[14px] text-[#6b7280] dark:text-[#94a3b8] whitespace-nowrap">
                        {policy.window}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium ${STATUS_STYLES[policy.status] ?? STATUS_STYLES.Draft}`}>
                          {policy.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1">
                          <button className="p-1.5 rounded-lg hover:bg-[#eff6ff] dark:hover:bg-[rgba(59,130,246,0.1)] transition-colors" title="Edit">
                            <Pencil className="size-3.5 text-[#3b82f6] dark:text-[#60a5fa]" />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-[#fee2e2] dark:hover:bg-[#7f1d1d] transition-colors" title="Delete">
                            <Trash2 className="size-3.5 text-[#ef4444] dark:text-[#f87171]" />
                          </button>
                          <div className="relative">
                            <button
                              onClick={() => setOpenRowMenu(openRowMenu === policy.id ? null : policy.id)}
                              className="p-1.5 rounded-lg hover:bg-[#f3f4f6] dark:hover:bg-[rgba(30,58,95,0.7)] transition-colors"
                            >
                              <MoreHorizontal className="size-4 text-[#6b7280] dark:text-[#94a3b8]" />
                            </button>
                            {openRowMenu === policy.id && (
                              <div className="absolute right-0 top-8 w-52 bg-white dark:bg-[#0f1f35] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg shadow-lg z-50 py-1">
                                {["Duplicate", "Schedule", "View Version History", "View Policy Trace"].map((opt) => (
                                  <button
                                    key={opt}
                                    onClick={() => setOpenRowMenu(null)}
                                    className="w-full text-left px-4 py-2 text-[13px] text-[#111827] dark:text-[#e8eef5] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)] transition-colors"
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
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table footer: bulk actions + export */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] bg-[#f9fafb] dark:bg-[#0a1628]">
            <div className="relative">
              <button
                disabled={selectedRows.size === 0}
                onClick={() => {}}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg text-[#374151] dark:text-[#94a3b8] bg-white dark:bg-[#0f1f35] hover:bg-[#f3f4f6] dark:hover:bg-[rgba(30,58,95,0.5)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Bulk Actions
                <ChevronDown className="size-3.5" />
              </button>
            </div>
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg text-[#374151] dark:text-[#94a3b8] bg-white dark:bg-[#0f1f35] hover:bg-[#f3f4f6] dark:hover:bg-[rgba(30,58,95,0.5)] transition-colors">
              <Download className="size-3.5" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* ── Template Gallery Modal ── */}
      {showTemplateGallery && (() => {
        const visibleTemplates = TEMPLATES.filter((t) => {
          const matchesSearch = t.name.toLowerCase().includes(templateSearch.toLowerCase()) ||
            t.description.toLowerCase().includes(templateSearch.toLowerCase());
          const matchesCategory = templateCategory === "All" || t.category === templateCategory;
          return matchesSearch && matchesCategory;
        });

        const closeGallery = () => {
          setShowTemplateGallery(false);
          setSelectedTemplateId(null);
          setTemplateSearch("");
          setTemplateCategory("All");
        };

        return (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={closeGallery}
          >
            <div
              className="bg-white dark:bg-[#0f1f35] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
                <div>
                  <h2 className="font-['Inter'] font-semibold text-[18px] text-[#111827] dark:text-[#e8eef5]">
                    Choose a Template
                  </h2>
                  <p className="font-['Inter'] text-[13px] text-[#6b7280] dark:text-[#94a3b8] mt-0.5">
                    Select a pre-defined template to start configuring your policy
                  </p>
                </div>
                <button
                  onClick={closeGallery}
                  className="p-2 rounded-lg hover:bg-[#f3f4f6] dark:hover:bg-[rgba(30,58,95,0.5)] transition-colors"
                >
                  <X className="size-5 text-[#6b7280] dark:text-[#94a3b8]" />
                </button>
              </div>

              {/* Search + Category Filter */}
              <div className="px-6 py-4 flex items-center gap-3 border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#6b7280] dark:text-[#94a3b8]" />
                  <input
                    type="text"
                    placeholder="Search templates…"
                    value={templateSearch}
                    onChange={(e) => setTemplateSearch(e.target.value)}
                    className="w-full bg-[#f9fafb] dark:bg-[#0a1628] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg pl-9 pr-4 py-2 text-[14px] text-[#111827] dark:text-[#e8eef5] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
                  />
                </div>
                <select
                  value={templateCategory}
                  onChange={(e) => setTemplateCategory(e.target.value)}
                  className="bg-[#f9fafb] dark:bg-[#0a1628] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg px-3 py-2 text-[14px] text-[#111827] dark:text-[#e8eef5] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
                >
                  {TEMPLATE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c === "All" ? "Category: All" : c}</option>
                  ))}
                </select>
              </div>

              {/* Template Cards Grid */}
              <div className="flex-1 overflow-y-auto px-6 py-5">
                {visibleTemplates.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Search className="size-10 text-[#d1d5db] dark:text-[#374151] mb-3" />
                    <p className="text-[14px] font-medium text-[#6b7280] dark:text-[#94a3b8]">No templates match your search</p>
                    <p className="text-[12px] text-[#9ca3af] dark:text-[#6b7280] mt-1">Try a different keyword or category</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-4">
                    {visibleTemplates.map((tmpl) => {
                      const Icon = tmpl.icon;
                      const isSelected = selectedTemplateId === tmpl.id;
                      return (
                        <button
                          key={tmpl.id}
                          onClick={() => setSelectedTemplateId(isSelected ? null : tmpl.id)}
                          className={`text-left p-4 rounded-xl border-2 transition-all ${
                            isSelected
                              ? "border-[#3b82f6] dark:border-[#60a5fa] bg-[#eff6ff] dark:bg-[rgba(59,130,246,0.08)] shadow-md"
                              : "border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] bg-white dark:bg-[#0a1628] hover:border-[#93c5fd] dark:hover:border-[rgba(59,130,246,0.4)] hover:shadow-sm"
                          }`}
                        >
                          {/* Icon + Badge row */}
                          <div className="flex items-start justify-between mb-3">
                            <div className={`${tmpl.iconBg} rounded-lg p-2`}>
                              <Icon className={`size-5 ${tmpl.iconColor}`} />
                            </div>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#f3f4f6] dark:bg-[#1a2d47] text-[#6b7280] dark:text-[#94a3b8] uppercase tracking-wide">
                              {tmpl.badge}
                            </span>
                          </div>

                          {/* Name + Category */}
                          <p className="font-['Inter'] font-semibold text-[13px] text-[#111827] dark:text-[#e8eef5] leading-snug mb-1">
                            {tmpl.name}
                          </p>
                          <p className="text-[11px] font-medium text-[#3b82f6] dark:text-[#60a5fa] mb-2">
                            {tmpl.category}
                          </p>

                          {/* Description */}
                          <p className="text-[11px] text-[#6b7280] dark:text-[#94a3b8] leading-relaxed mb-3 line-clamp-2">
                            {tmpl.description}
                          </p>

                          {/* Compatible with */}
                          <div className="flex flex-wrap gap-1">
                            {tmpl.compatibleWith.map((a) => (
                              <span
                                key={a}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-[#f3f4f6] dark:bg-[#1a2d47] text-[#374151] dark:text-[#94a3b8] font-medium"
                              >
                                {a}
                              </span>
                            ))}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
                <button
                  onClick={() => { closeGallery(); navigate("/configuration/policies/templates/new"); }}
                  className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-[#3b82f6] dark:text-[#60a5fa] hover:bg-[#eff6ff] dark:hover:bg-[rgba(59,130,246,0.08)] rounded-lg transition-colors"
                >
                  <Plus className="size-4" />
                  Create Custom Template
                </button>
                <div className="flex items-center gap-3">
                  <button
                    onClick={closeGallery}
                    className="px-4 py-2 text-[13px] font-medium border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg text-[#111827] dark:text-[#e8eef5] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={selectedTemplateId === null}
                    onClick={() => {
                      const tpl = TEMPLATES.find((t) => t.id === selectedTemplateId);
                      closeGallery();
                      navigate("/configuration/policies/assignments/new", {
                        state: { templateName: tpl?.name ?? "" },
                      });
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium bg-[#3b82f6] dark:bg-[#2563eb] text-white rounded-lg hover:bg-[#2563eb] dark:hover:bg-[#1d4ed8] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                    <ArrowRight className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

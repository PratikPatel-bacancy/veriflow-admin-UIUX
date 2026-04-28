import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Plus,
  ChevronDown,
  FileText,
  GitBranch,
  AlertTriangle,
  Layers,
  MoreHorizontal,
  Download,
  Map,
  Grid3X3,
  List,
  CheckSquare,
  Square,
  Info,
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

// ── Matrix: real zones × rule types ──────────────────────────────────────

const RULE_TYPES = ["Time-Limit", "Permit", "No-Stopping", "Loading", "EV-Only", "Handicap"];

const MATRIX_ZONES = [
  "Zone A — Permit Holders Only",
  "Zone B — General Public Parking",
  "Zone C — Faculty & Staff Reserved",
  "Zone D — Short-Term Visitor (2-Hour)",
  "Zone E — EV Charging Stations",
  "Zone F — Accessible Parking (ADA)",
  "Zone G — Event Day Overflow",
  "Zone H — Motorcycle & Bicycle",
];

const matrixData: Record<string, Record<string, boolean>> = {
  "Zone A — Permit Holders Only":       { "Time-Limit": false, "Permit": true,  "No-Stopping": false, "Loading": false, "EV-Only": false, "Handicap": true  },
  "Zone B — General Public Parking":    { "Time-Limit": true,  "Permit": false, "No-Stopping": false, "Loading": false, "EV-Only": false, "Handicap": true  },
  "Zone C — Faculty & Staff Reserved":  { "Time-Limit": false, "Permit": true,  "No-Stopping": false, "Loading": false, "EV-Only": false, "Handicap": true  },
  "Zone D — Short-Term Visitor (2-Hour)":{ "Time-Limit": true,  "Permit": false, "No-Stopping": false, "Loading": false, "EV-Only": false, "Handicap": true  },
  "Zone E — EV Charging Stations":      { "Time-Limit": false, "Permit": false, "No-Stopping": false, "Loading": false, "EV-Only": true,  "Handicap": false },
  "Zone F — Accessible Parking (ADA)":  { "Time-Limit": false, "Permit": false, "No-Stopping": false, "Loading": false, "EV-Only": false, "Handicap": true  },
  "Zone G — Event Day Overflow":        { "Time-Limit": true,  "Permit": false, "No-Stopping": true,  "Loading": false, "EV-Only": false, "Handicap": true  },
  "Zone H — Motorcycle & Bicycle":      { "Time-Limit": true,  "Permit": false, "No-Stopping": false, "Loading": false, "EV-Only": false, "Handicap": false },
};

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

const ROW_MENU_OPTIONS = ["Edit", "Duplicate", "Schedule", "View Version History", "View Policy Trace", "Archive"];

const STATUS_STYLES: Record<string, string> = {
  Active:    "bg-[#d1fae5] dark:bg-[#065f46] text-[#065f46] dark:text-[#6ee7b7]",
  Scheduled: "bg-[#dbeafe] dark:bg-[#1e3a8a] text-[#1e40af] dark:text-[#60a5fa]",
  Draft:     "bg-[#f3f4f6] dark:bg-[#1a2d47] text-[#374151] dark:text-[#94a3b8]",
  Archived:  "bg-[#fef3c7] dark:bg-[#78350f] text-[#92400e] dark:text-[#fbbf24]",
};

export default function PoliciesHome() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("All");
  const [activeTab, setActiveTab] = useState<"list" | "map" | "matrix">("list");
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [openRowMenu, setOpenRowMenu] = useState<number | null>(null);
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
  const [showBulkMenu, setShowBulkMenu] = useState(false);
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
  const [templateSearch, setTemplateSearch] = useState("");
  const [templateCategory, setTemplateCategory] = useState("All");
  const [siteFilter, setSiteFilter] = useState("all");
  const [zoneFilter, setZoneFilter] = useState("all");
  const [ruleTypeFilter, setRuleTypeFilter] = useState("all");

  const templateDropdownRef = useRef<HTMLDivElement>(null);
  const bulkMenuRef = useRef<HTMLDivElement>(null);

  const filteredPolicies = mockPolicies.filter((p) => {
    if (statusFilter !== "All" && p.status !== statusFilter) return false;
    if (zoneFilter !== "all" && !p.target.includes(zoneFilter)) return false;
    if (ruleTypeFilter !== "all" && p.template !== ruleTypeFilter) return false;
    return true;
  });

  const allSelected =
    filteredPolicies.length > 0 &&
    filteredPolicies.every((p) => selectedRows.has(p.id));

  const toggleSelectAll = () => {
    if (allSelected) setSelectedRows(new Set());
    else setSelectedRows(new Set(filteredPolicies.map((p) => p.id)));
  };

  const toggleRow = (id: number) => {
    const next = new Set(selectedRows);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedRows(next);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (templateDropdownRef.current && !templateDropdownRef.current.contains(e.target as Node))
        setShowTemplateDropdown(false);
      if (bulkMenuRef.current && !bulkMenuRef.current.contains(e.target as Node))
        setShowBulkMenu(false);
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

      {/* ── Quick Filters ── */}
      <div className="px-8 pt-5">
        <div className="flex items-center justify-between bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-4 shadow-sm space-y-3">
          {/* Status chips */}
          <div className="flex items-center gap-2 flex-wrap mb-0">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-colors ${
                  statusFilter === f
                    ? "bg-[#3b82f6] text-white"
                    : "bg-[#f3f4f6] dark:bg-[#1a2d47] text-[#374151] dark:text-[#94a3b8] hover:bg-[#e5e7eb] dark:hover:bg-[rgba(30,58,95,0.7)]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Dropdown filters */}
          <div className="flex items-center gap-3 flex-wrap">
            <select
              value={siteFilter}
              onChange={(e) => setSiteFilter(e.target.value)}
              className="bg-[#f9fafb] dark:bg-[#0a1628] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg px-3 py-1.5 text-sm text-[#111827] dark:text-[#e8eef5] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
            >
              <option value="all">Site: All</option>
              {SITES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>

            <select
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
              className="bg-[#f9fafb] dark:bg-[#0a1628] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg px-3 py-1.5 text-sm text-[#111827] dark:text-[#e8eef5] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
            >
              <option value="all">Zone: All</option>
              {ZONES.map((z) => <option key={z} value={z}>{z}</option>)}
            </select>

            <select
              value={ruleTypeFilter}
              onChange={(e) => setRuleTypeFilter(e.target.value)}
              className="bg-[#f9fafb] dark:bg-[#0a1628] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg px-3 py-1.5 text-sm text-[#111827] dark:text-[#e8eef5] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
            >
              <option value="all">Rule Type: All</option>
              {RULE_TYPES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* ── KPI Row ── */}
      <div className="px-8 pt-5">
        <div className="grid grid-cols-4 gap-5">
          {[
            {
              value: String(mockPolicies.filter((p) => p.status === "Active").length),
              label: "Active Policies",
              icon: <FileText className="size-5 text-[#3b82f6] dark:text-[#60a5fa]" />,
              iconBg: "bg-[#dbeafe] dark:bg-[#1e3a8a]",
              tooltip: "Total policies currently active and enforced across all sites and zones",
            },
            {
              value: String(mockPolicies.filter((p) => p.status === "Scheduled").length),
              label: "Scheduled",
              icon: <GitBranch className="size-5 text-[#ea580c] dark:text-[#fb923c]" />,
              iconBg: "bg-[#ffedd5] dark:bg-[#7c2d12]",
              tooltip: "Policies configured but not yet in effect — will activate at their scheduled start date",
            },
            {
              value: "3",
              label: "Conflicts",
              icon: <AlertTriangle className="size-5 text-[#dc2626] dark:text-[#f87171]" />,
              iconBg: "bg-[#fee2e2] dark:bg-[#7f1d1d]",
              tooltip: "Overlapping policy assignments on the same target with competing priority levels",
            },
            {
              value: "12",
              label: "Templates",
              icon: <Layers className="size-5 text-[#7c3aed] dark:text-[#a78bfa]" />,
              iconBg: "bg-[#ede9fe] dark:bg-[#4c1d95]",
              tooltip: "Available policy templates including system defaults and custom-built templates",
            },
          ].map(({ value, label, icon, iconBg, tooltip }) => (
            <div
              key={label}
              className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-5 shadow-sm relative"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`${iconBg} rounded-lg p-2.5`}>{icon}</div>
                <div className="group">
                  <Info className="size-4 text-[#6b7280] dark:text-[#94a3b8] cursor-help" />
                  <div className="invisible group-hover:visible absolute right-4 top-14 w-64 bg-[#111827] dark:bg-[#1a2d47] text-white dark:text-[#e8eef5] text-xs rounded-lg px-3 py-2 shadow-lg z-50 border border-transparent dark:border-[rgba(59,130,246,0.15)]">
                    {tooltip}
                  </div>
                </div>
              </div>
              <p className="font-['Inter'] font-semibold text-[28px] leading-[32px] text-[#111827] dark:text-[#e8eef5]">
                {value}
              </p>
              <p className="font-['Inter'] text-[13px] text-[#6b7280] dark:text-[#94a3b8] mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tabbed Table ── */}
      <div className="px-8 pt-6">
        <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] shadow-sm overflow-hidden">

          {/* Tab Bar */}
          <div className="flex items-center gap-1 px-6 pt-4 border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
            {(
              [
                { id: "list",   label: "List View",   icon: <List className="size-4" /> },
                { id: "map",    label: "Map View",    icon: <Map className="size-4" /> },
                { id: "matrix", label: "Matrix View", icon: <Grid3X3 className="size-4" /> },
              ] as const
            ).map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-2 text-[14px] font-medium transition-colors ${
                  activeTab === id
                    ? "text-[#3b82f6] dark:text-[#60a5fa] border-b-2 border-[#3b82f6] dark:border-[#60a5fa]"
                    : "text-[#6b7280] dark:text-[#94a3b8] hover:text-[#111827] dark:hover:text-[#e8eef5]"
                }`}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>

          {/* ── List View ── */}
          {activeTab === "list" && (
            <div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#f9fafb] dark:bg-[#0a1628] border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
                      <th className="px-6 py-3 w-10">
                        <button onClick={toggleSelectAll} className="flex items-center">
                          {allSelected
                            ? <CheckSquare className="size-4 text-[#3b82f6]" />
                            : <Square className="size-4 text-[#6b7280] dark:text-[#94a3b8]" />}
                        </button>
                      </th>
                      {["Policy Name", "Template", "Target", "Window", "Priority", "Status", ""].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8] uppercase tracking-wider whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPolicies.map((policy) => (
                      <tr
                        key={policy.id}
                        onClick={() => navigate(`/configuration/policies/${policy.id}`)}
                        className="border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)] transition-colors cursor-pointer"
                      >
                        <td className="px-6 py-4">
                          <button onClick={(e) => { e.stopPropagation(); toggleRow(policy.id); }} className="flex items-center">
                            {selectedRows.has(policy.id)
                              ? <CheckSquare className="size-4 text-[#3b82f6]" />
                              : <Square className="size-4 text-[#6b7280] dark:text-[#94a3b8]" />}
                          </button>
                        </td>
                        <td className="px-4 py-4">
                          <span className="font-['Inter'] font-medium text-[14px] text-[#111827] dark:text-[#e8eef5]">
                            {policy.name}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-[14px] text-[#6b7280] dark:text-[#94a3b8]">
                          {policy.template}
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-[13px]">
                            <span className="text-[#6b7280] dark:text-[#94a3b8]">{policy.targetType} / </span>
                            <span className="text-[#111827] dark:text-[#e8eef5] font-medium">{policy.target}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-[13px] text-[#6b7280] dark:text-[#94a3b8] whitespace-nowrap">
                          {policy.window}
                        </td>
                        <td className="px-4 py-4">
                          <span className="font-['Inter'] font-medium text-[14px] text-[#111827] dark:text-[#e8eef5]">
                            {policy.priority}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[policy.status] ?? STATUS_STYLES.Draft}`}>
                            {policy.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 relative">
                          <button
                            onClick={(e) => { e.stopPropagation(); setOpenRowMenu(openRowMenu === policy.id ? null : policy.id); }}
                            className="p-1.5 rounded-lg hover:bg-[#f3f4f6] dark:hover:bg-[rgba(30,58,95,0.7)] transition-colors"
                          >
                            <MoreHorizontal className="size-4 text-[#6b7280] dark:text-[#94a3b8]" />
                          </button>
                          {openRowMenu === policy.id && (
                            <div className="absolute right-6 top-10 w-52 bg-white dark:bg-[#0f1f35] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg shadow-lg z-50 py-1">
                              {ROW_MENU_OPTIONS.map((opt) => (
                                <button
                                  key={opt}
                                  onClick={(e) => { e.stopPropagation(); setOpenRowMenu(null); }}
                                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                                    opt === "Archive"
                                      ? "text-[#dc2626] dark:text-[#f87171] hover:bg-[#fee2e2] dark:hover:bg-[#7f1d1d]"
                                      : "text-[#111827] dark:text-[#e8eef5] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)]"
                                  }`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}

                    {filteredPolicies.length === 0 && (
                      <tr>
                        <td colSpan={8} className="px-6 py-12 text-center text-[14px] text-[#6b7280] dark:text-[#94a3b8]">
                          No policies match the selected filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="px-6 py-3 flex items-center justify-between border-t border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
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
                        {["Archive Selected", "Duplicate Selected", "Change Validity", "Assign to Group", "Export Selected"].map((opt) => (
                          <button key={opt} className="w-full text-left px-4 py-2 text-sm text-[#111827] dark:text-[#e8eef5] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)] transition-colors">
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {selectedRows.size > 0 && (
                    <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">{selectedRows.size} selected</span>
                  )}
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg text-[#111827] dark:text-[#e8eef5] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)] transition-colors">
                  <Download className="size-4" />
                  Export CSV
                </button>
              </div>
            </div>
          )}

          {/* ── Map View ── */}
          {activeTab === "map" && (
            <div className="h-[480px] flex flex-col items-center justify-center gap-4 text-center p-8">
              <div className="bg-[#dbeafe] dark:bg-[#1e3a8a] rounded-2xl p-5">
                <Map className="size-12 text-[#3b82f6] dark:text-[#60a5fa]" />
              </div>
              <div>
                <p className="font-['Inter'] font-semibold text-[16px] text-[#111827] dark:text-[#e8eef5] mb-1">Zone Policy Map</p>
                <p className="font-['Inter'] text-[13px] text-[#6b7280] dark:text-[#94a3b8] max-w-sm">
                  Zones are color-coded by their primary policy type. Click a zone polygon to view all policies stacked there.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#f3f4f6] dark:bg-[#1a2d47] text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">
                Map integration coming soon
              </span>
            </div>
          )}

          {/* ── Matrix View ── */}
          {activeTab === "matrix" && (
            <div className="p-6 overflow-x-auto">
              <div className="mb-4 flex items-center gap-5">
                <p className="text-[13px] font-medium text-[#6b7280] dark:text-[#94a3b8]">Coverage: Zone × Rule Type</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="size-3 rounded-sm bg-[#d1fae5] dark:bg-[#065f46] border border-[#6ee7b7]" />
                    <span className="text-[12px] text-[#6b7280] dark:text-[#94a3b8]">Covered</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="size-3 rounded-sm bg-[#fee2e2] dark:bg-[#7f1d1d] border border-[#fca5a5]" />
                    <span className="text-[12px] text-[#6b7280] dark:text-[#94a3b8]">Gap — no policy</span>
                  </div>
                </div>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left py-2 pr-6 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8] min-w-[220px]">
                      Zone
                    </th>
                    {RULE_TYPES.map((rt) => (
                      <th key={rt} className="px-3 py-2 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8] whitespace-nowrap text-center">
                        {rt}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MATRIX_ZONES.map((zone) => (
                    <tr key={zone} className="border-t border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
                      <td className="py-2.5 pr-6 text-[13px] font-medium text-[#111827] dark:text-[#e8eef5]">
                        {zone}
                      </td>
                      {RULE_TYPES.map((rt) => {
                        const covered = matrixData[zone]?.[rt] ?? false;
                        return (
                          <td key={rt} className="px-3 py-2.5 text-center">
                            <div className={`inline-flex items-center justify-center size-7 rounded-md text-[11px] font-bold ${
                              covered
                                ? "bg-[#d1fae5] dark:bg-[#065f46] text-[#065f46] dark:text-[#6ee7b7]"
                                : "bg-[#fee2e2] dark:bg-[#7f1d1d] text-[#dc2626] dark:text-[#fca5a5]"
                            }`}>
                              {covered ? "✓" : "✗"}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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

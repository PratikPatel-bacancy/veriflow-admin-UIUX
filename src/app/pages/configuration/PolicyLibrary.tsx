import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Plus,
  Search,
  Clock,
  Key,
  ShieldCheck,
  Truck,
  Ban,
  Building2,
  Zap,
  CreditCard,
  Timer,
  Layers,
  ArrowRight,
  Info,
} from "lucide-react";

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

const CATEGORIES = ["All", ...Array.from(new Set(TEMPLATES.map((t) => t.category)))];

const CATEGORY_COLORS: Record<string, string> = {
  "Time-Limit":  "bg-[#dbeafe] dark:bg-[#1e3a8a] text-[#1e40af] dark:text-[#60a5fa]",
  "Permit":      "bg-[#ede9fe] dark:bg-[#4c1d95] text-[#6d28d9] dark:text-[#a78bfa]",
  "Accessible":  "bg-[#d1fae5] dark:bg-[#065f46] text-[#065f46] dark:text-[#6ee7b7]",
  "Loading":     "bg-[#ffedd5] dark:bg-[#7c2d12] text-[#c2410c] dark:text-[#fb923c]",
  "Restriction": "bg-[#fee2e2] dark:bg-[#7f1d1d] text-[#b91c1c] dark:text-[#f87171]",
  "Commercial":  "bg-[#e0f2fe] dark:bg-[#0c4a6e] text-[#0369a1] dark:text-[#38bdf8]",
  "EV":          "bg-[#fef9c3] dark:bg-[#713f12] text-[#a16207] dark:text-[#facc15]",
  "Payment":     "bg-[#cffafe] dark:bg-[#164e63] text-[#0e7490] dark:text-[#22d3ee]",
};

export default function PolicyLibrary() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = TEMPLATES.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || t.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categoryCounts = CATEGORIES.reduce<Record<string, number>>((acc, cat) => {
    acc[cat] = cat === "All"
      ? TEMPLATES.length
      : TEMPLATES.filter((t) => t.category === cat).length;
    return acc;
  }, {});

  return (
    <div className="flex-1 overflow-auto bg-[#eff6ff] dark:bg-[#0a1628] pb-8">

      {/* ── Page Header ── */}
      <div className="px-8 pt-8 pb-2 flex items-start justify-between">
        <div>
          <h1 className="font-['Inter'] font-semibold text-[28px] leading-[36px] text-[#111827] dark:text-[#e8eef5]">
            Policy Templates
          </h1>
          <p className="font-['Inter'] text-[14px] text-[#6b7280] dark:text-[#94a3b8] mt-1">
            {TEMPLATES.length} system templates available — pick one to start a new policy assignment
          </p>
        </div>
        <button
          onClick={() => navigate("/configuration/policies/templates/new")}
          className="flex items-center gap-2 bg-[#3b82f6] dark:bg-[#2563eb] text-white font-medium px-4 h-10 rounded-lg text-[14px] hover:bg-[#2563eb] dark:hover:bg-[#1d4ed8] transition-colors shadow-sm"
        >
          <Plus className="size-4" />
          Create Custom Template
        </button>
      </div>

      {/* ── KPI Row ── */}
      <div className="px-8 pt-6">
        <div className="grid grid-cols-4 gap-5">
          {[
            {
              label: "Total Templates",
              value: TEMPLATES.length,
              iconBg: "bg-[#ede9fe] dark:bg-[#4c1d95]",
              icon: <Layers className="size-5 text-[#7c3aed] dark:text-[#a78bfa]" />,
              tooltip: "Total number of policy templates available — includes all 12 built-in system templates and any custom templates created by your team.",
            },
            {
              label: "Time-Limit",
              value: TEMPLATES.filter(t => t.category === "Time-Limit").length,
              iconBg: "bg-[#dbeafe] dark:bg-[#1e3a8a]",
              icon: <Clock className="size-5 text-[#3b82f6] dark:text-[#60a5fa]" />,
              tooltip: "Templates that enforce a maximum dwell time (e.g. 30-min, 1-hour, 2-hour). Best used in high-turnover zones, retail areas, or short-term visitor stalls.",
            },
            {
              label: "Permit & Access",
              value: TEMPLATES.filter(t => ["Permit","Accessible"].includes(t.category)).length,
              iconBg: "bg-[#d1fae5] dark:bg-[#065f46]",
              icon: <Key className="size-5 text-[#16a34a] dark:text-[#6ee7b7]" />,
              tooltip: "Templates that restrict parking to specific permit types or accessibility requirements — includes Permit-Only and Handicap Stall templates.",
            },
            {
              label: "Restriction & EV",
              value: TEMPLATES.filter(t => ["Restriction","EV","Commercial","Loading","Payment"].includes(t.category)).length,
              iconBg: "bg-[#fee2e2] dark:bg-[#7f1d1d]",
              icon: <Ban className="size-5 text-[#dc2626] dark:text-[#f87171]" />,
              tooltip: "Templates covering special-use restrictions: No Stopping, EV-Only charging enforcement, Commercial-Only, Loading zones, and Pay-to-Park metered areas.",
            },
          ].map(({ label, value, iconBg, icon, tooltip }) => (
            <div
              key={label}
              className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-5 shadow-sm relative"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`${iconBg} rounded-lg p-2.5`}>{icon}</div>
                <div className="group relative">
                  <Info className="size-4 text-[#6b7280] dark:text-[#94a3b8] cursor-help" />
                  <div className="invisible group-hover:visible absolute right-0 top-6 w-64 bg-[#111827] dark:bg-[#1a2d47] text-white dark:text-[#e8eef5] text-xs rounded-lg px-3 py-2 shadow-lg z-50 border border-transparent dark:border-[rgba(59,130,246,0.15)] leading-relaxed">
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

      {/* ── Search + Category Filter ── */}
      <div className="px-8 pt-6">
        <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-4 shadow-sm flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#6b7280] dark:text-[#94a3b8]" />
            <input
              type="text"
              placeholder="Search templates…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#f9fafb] dark:bg-[#0a1628] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg pl-9 pr-4 py-2 text-[14px] text-[#111827] dark:text-[#e8eef5] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-[#3b82f6] text-white"
                    : "bg-[#f3f4f6] dark:bg-[#1a2d47] text-[#374151] dark:text-[#94a3b8] hover:bg-[#e5e7eb] dark:hover:bg-[rgba(30,58,95,0.7)]"
                }`}
              >
                {cat}
                <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-semibold ${
                  activeCategory === cat
                    ? "bg-white/20 text-white"
                    : "bg-[#e5e7eb] dark:bg-[rgba(59,130,246,0.15)] text-[#6b7280] dark:text-[#94a3b8]"
                }`}>
                  {categoryCounts[cat]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Template Grid ── */}
      <div className="px-8 pt-6">
        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] flex flex-col items-center justify-center py-20 text-center shadow-sm">
            <Search className="size-10 text-[#d1d5db] dark:text-[#374151] mb-3" />
            <p className="text-[14px] font-medium text-[#6b7280] dark:text-[#94a3b8]">No templates match your search</p>
            <p className="text-[12px] text-[#9ca3af] dark:text-[#6b7280] mt-1">Try a different keyword or category</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-5">
            {filtered.map((tmpl) => {
              const Icon = tmpl.icon;
              return (
                <div
                  key={tmpl.id}
                  className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-5 shadow-sm hover:shadow-md hover:border-[#93c5fd] dark:hover:border-[rgba(59,130,246,0.4)] transition-all flex flex-col"
                >
                  {/* Icon + Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`${tmpl.iconBg} rounded-xl p-3`}>
                      <Icon className={`size-6 ${tmpl.iconColor}`} />
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#f3f4f6] dark:bg-[#1a2d47] text-[#6b7280] dark:text-[#94a3b8] uppercase tracking-wide">
                      {tmpl.badge}
                    </span>
                  </div>

                  {/* Name */}
                  <p className="font-['Inter'] font-semibold text-[15px] text-[#111827] dark:text-[#e8eef5] leading-snug mb-1">
                    {tmpl.name}
                  </p>

                  {/* Category badge */}
                  <span className={`inline-flex w-fit text-[11px] font-semibold px-2 py-0.5 rounded-full mb-3 ${CATEGORY_COLORS[tmpl.category] ?? "bg-[#f3f4f6] text-[#6b7280]"}`}>
                    {tmpl.category}
                  </span>

                  {/* Description */}
                  <p className="text-[13px] text-[#6b7280] dark:text-[#94a3b8] leading-relaxed flex-1 mb-4">
                    {tmpl.description}
                  </p>

                  {/* Compatible with */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {tmpl.compatibleWith.map((a) => (
                      <span
                        key={a}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-[#f3f4f6] dark:bg-[#1a2d47] text-[#374151] dark:text-[#94a3b8] font-medium"
                      >
                        {a}
                      </span>
                    ))}
                  </div>

                  {/* Use Template button */}
                  <button
                    onClick={() =>
                      navigate("/configuration/policies/assignments/new", {
                        state: { templateName: tmpl.name },
                      })
                    }
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-[13px] font-medium bg-[#eff6ff] dark:bg-[rgba(59,130,246,0.08)] text-[#3b82f6] dark:text-[#60a5fa] hover:bg-[#dbeafe] dark:hover:bg-[rgba(59,130,246,0.15)] border border-[#bfdbfe] dark:border-[rgba(59,130,246,0.2)] transition-colors"
                  >
                    Use Template
                    <ArrowRight className="size-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

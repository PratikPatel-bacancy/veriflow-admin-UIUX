import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import {
  ChevronRight,
  Edit2,
  Copy,
  Archive,
  MoreHorizontal,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Clock,
  X,
} from "lucide-react";

// ── Mock data ─────────────────────────────────────────────────────────────

const MOCK_POLICIES = [
  { id: 1,  name: "Permit Holders Policy",       template: "Permit-Only",        targetType: "Zone",  target: "Zone A — Permit Holders Only",          window: "24/7",                    priority: 80, status: "Active"   },
  { id: 2,  name: "2-Hour Free Parking",          template: "2-Hour Parking",     targetType: "Zone",  target: "Zone B — General Public Parking",       window: "Mon–Fri 08:00–18:00",     priority: 50, status: "Active"   },
  { id: 3,  name: "Faculty Reserved",             template: "Permit-Only",        targetType: "Zone",  target: "Zone C — Faculty & Staff Reserved",     window: "Mon–Fri 07:00–19:00",     priority: 75, status: "Active"   },
  { id: 4,  name: "Short-Term Visitor Limit",     template: "90-min Parking",     targetType: "Zone",  target: "Zone D — Short-Term Visitor (2-Hour)",  window: "Mon–Sun 09:00–21:00",     priority: 60, status: "Active"   },
  { id: 5,  name: "EV Charging Priority",         template: "EV-Only",            targetType: "Zone",  target: "Zone E — EV Charging Stations",         window: "24/7",                    priority: 85, status: "Active"   },
  { id: 6,  name: "ADA Accessible",               template: "Handicap Stall",     targetType: "Zone",  target: "Zone F — Accessible Parking (ADA)",     window: "24/7",                    priority: 100,status: "Active"   },
  { id: 7,  name: "Event Day Overflow Policy",    template: "Pay-to-Park",        targetType: "Zone",  target: "Zone G — Event Day Overflow",           window: "Event-triggered",         priority: 90, status: "Scheduled"},
  { id: 8,  name: "Motorcycle Bay Rules",         template: "30-min Parking",     targetType: "Zone",  target: "Zone H — Motorcycle & Bicycle",         window: "Mon–Sun 6:00–22:00",      priority: 60, status: "Active"   },
  { id: 9,  name: "Night Clearance — Zone G",     template: "No Stopping",        targetType: "Zone",  target: "Zone G — Event Day Overflow",           window: "22:00–06:00",             priority: 95, status: "Active"   },
  { id: 10, name: "Weekend Rate — Zone B",        template: "Pay-to-Park",        targetType: "Zone",  target: "Zone B — General Public Parking",       window: "Sat–Sun 8:00–20:00",      priority: 65, status: "Draft"    },
  { id: 11, name: "Short-Term Time Limit",        template: "90-min Parking",     targetType: "Zone",  target: "Zone D — Short-Term Visitor (2-Hour)",  window: "Mon–Fri 8:00–18:00",      priority: 55, status: "Draft"    },
  { id: 12, name: "Holiday Suspension",           template: "Ops Window",         targetType: "Level", target: "Level 4 — North Structure",             window: "Federal Holidays",        priority: 95, status: "Archived" },
];

interface PolicyTarget { id: string; label: string; detail: string }
interface EvalSample { time: string; vehicle: string; outcome: "COMPLIANT" | "VIOLATION" | "EXEMPT"; duration: string }
interface HistoryEntry { version: number; date: string; author: string; changes: string[] }

interface PolicyDetail {
  category: string;
  ruleType: string;
  effectiveFrom: string;
  effectiveTo: string;
  timezone: string;
  calendars: string[];
  exemptions: string[];
  fine: string;
  escalation: string;
  parameters: { label: string; value: string }[];
  targets: PolicyTarget[];
  evaluations: { total: number; violations: number; compliant: number; other: number; samples: EvalSample[] };
  history: HistoryEntry[];
}

const DETAILS: Record<number, PolicyDetail> = {
  2: {
    category: "Time-limit",
    ruleType: "time-limit",
    effectiveFrom: "2026-05-01",
    effectiveTo: "—",
    timezone: "America/New_York",
    calendars: ["US Federal Holidays (excluded)"],
    exemptions: ["HANDICAP (plate or placard)", "GOVERNMENT plates"],
    fine: "$50.00",
    escalation: "+$25 / +$50 / +$100",
    parameters: [
      { label: "Max dwell (minutes)", value: "120" },
      { label: "Arrival grace (seconds)", value: "300" },
      { label: "Departure grace (seconds)", value: "600" },
      { label: "Paid override", value: "None" },
    ],
    targets: [
      { id: "s-412", label: "Stall S-412", detail: "North Structure · Level 4 · Aisle B" },
      { id: "s-413", label: "Stall S-413", detail: "North Structure · Level 4 · Aisle B" },
    ],
    evaluations: {
      total: 412, violations: 37, compliant: 94, other: 281,
      samples: [
        { time: "14:32", vehicle: "7ABC123", outcome: "COMPLIANT", duration: "48 min" },
        { time: "13:55", vehicle: "9XYZ456", outcome: "VIOLATION", duration: "143 min" },
        { time: "13:10", vehicle: "2DEF789", outcome: "EXEMPT",    duration: "210 min" },
        { time: "12:47", vehicle: "5GHI012", outcome: "COMPLIANT", duration: "72 min" },
        { time: "12:03", vehicle: "1JKL345", outcome: "VIOLATION", duration: "188 min" },
      ],
    },
    history: [
      { version: 3, date: "2026-04-15", author: "alice@veriflow.io", changes: ["Added Stall S-413", "Fine raised $40 → $50"] },
      { version: 2, date: "2026-03-02", author: "bob@veriflow.io",   changes: ["Arrival grace increased 180s → 300s"] },
      { version: 1, date: "2026-01-10", author: "bob@veriflow.io",   changes: ["Policy created"] },
    ],
  },
};

const buildDefaultDetail = (p: typeof MOCK_POLICIES[number]): PolicyDetail => ({
  category: p.template.includes("Parking") ? "Time-limit" : p.template.includes("Permit") ? "Permit" : p.template.includes("EV") ? "EV" : "Restriction",
  ruleType: p.template.toLowerCase().replace(/\s+/g, "-"),
  effectiveFrom: "2026-05-01",
  effectiveTo: "—",
  timezone: "America/Los_Angeles",
  calendars: ["US Federal Holidays (excluded)"],
  exemptions: ["HANDICAP (plate or placard)", "GOVERNMENT plates"],
  fine: "$50.00",
  escalation: "+$25 / +$50 / +$100",
  parameters: [
    { label: "Max dwell (minutes)", value: "120" },
    { label: "Arrival grace (seconds)", value: "300" },
    { label: "Departure grace (seconds)", value: "600" },
  ],
  targets: [
    { id: "t-1", label: p.target, detail: `${p.targetType} — Primary target` },
  ],
  evaluations: {
    total: 228, violations: 21, compliant: 142, other: 65,
    samples: [
      { time: "15:10", vehicle: "4MNO678", outcome: "COMPLIANT", duration: "55 min" },
      { time: "14:22", vehicle: "8PQR901", outcome: "VIOLATION", duration: "167 min" },
      { time: "13:48", vehicle: "3STU234", outcome: "EXEMPT",    duration: "195 min" },
    ],
  },
  history: [
    { version: 2, date: "2026-04-10", author: "alice@veriflow.io", changes: ["Priority updated"] },
    { version: 1, date: "2026-02-14", author: "bob@veriflow.io",   changes: ["Policy created"] },
  ],
});

// ── Helpers ───────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
  Active:    "bg-[#d1fae5] dark:bg-[#065f46] text-[#065f46] dark:text-[#34d399]",
  Draft:     "bg-[#f3f4f6] dark:bg-[#1f2937] text-[#6b7280] dark:text-[#9ca3af]",
  Archived:  "bg-[#fef3c7] dark:bg-[#78350f] text-[#92400e] dark:text-[#fcd34d]",
  Scheduled: "bg-[#dbeafe] dark:bg-[#1e3a8a] text-[#1e40af] dark:text-[#93c5fd]",
};

const OUTCOME_STYLES: Record<string, string> = {
  COMPLIANT: "bg-[#d1fae5] dark:bg-[#065f46] text-[#065f46] dark:text-[#34d399]",
  VIOLATION: "bg-[#fee2e2] dark:bg-[#7f1d1d] text-[#dc2626] dark:text-[#fca5a5]",
  EXEMPT:    "bg-[#dbeafe] dark:bg-[#1e3a8a] text-[#1e40af] dark:text-[#93c5fd]",
};

type TabId = "overview" | "parameters" | "targets" | "evaluations" | "history";
const TABS: { id: TabId; label: string }[] = [
  { id: "overview",    label: "Overview" },
  { id: "parameters",  label: "Parameters" },
  { id: "targets",     label: "Targets" },
  { id: "evaluations", label: "Evaluations" },
  { id: "history",     label: "History" },
];

// ── Component ─────────────────────────────────────────────────────────────

export default function PolicyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [evalPeriod, setEvalPeriod] = useState<"24h" | "7d" | "30d">("24h");
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [targets, setTargets] = useState<PolicyTarget[] | null>(null);

  const policy = MOCK_POLICIES.find((p) => p.id === Number(id));

  if (!policy) {
    return (
      <div className="flex-1 p-8 flex flex-col items-center justify-center gap-4">
        <AlertTriangle className="size-10 text-[#f59e0b]" />
        <p className="text-[#111827] dark:text-[#e8eef5] text-lg font-medium">Policy not found</p>
        <button onClick={() => navigate("/configuration/policies")} className="text-[#3b82f6] text-sm hover:underline">
          ← Back to Policies
        </button>
      </div>
    );
  }

  const detail = DETAILS[policy.id] ?? buildDefaultDetail(policy);
  const displayTargets = targets ?? detail.targets;
  const latestVersion = detail.history[0]?.version ?? 1;

  // eval bar widths
  const evalTotal = detail.evaluations.total || 1;
  const barV = Math.round((detail.evaluations.violations / evalTotal) * 100);
  const barC = Math.round((detail.evaluations.compliant / evalTotal) * 100);
  const barO = Math.round((detail.evaluations.other / evalTotal) * 100);

  const removeTarget = (tid: string) => setTargets((displayTargets).filter((t) => t.id !== tid));

  const rowCls = "flex items-start gap-4 py-3 border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.08)] last:border-0";
  const labelCls = "w-44 flex-shrink-0 text-[13px] text-[#6b7280] dark:text-[#94a3b8] font-medium";
  const valueCls = "flex-1 text-[14px] text-[#111827] dark:text-[#e8eef5]";

  return (
    <div className="flex-1 overflow-auto bg-[#eff6ff] dark:bg-[#0a1628] pb-8">
      <div className="px-8 pt-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[13px] text-[#6b7280] dark:text-[#94a3b8] mb-6">
          <Link to="/configuration/policies" className="hover:text-[#3b82f6] transition-colors">Policies</Link>
          <ChevronRight className="size-3.5" />
          <span className="text-[#111827] dark:text-[#e8eef5] font-medium truncate max-w-xs">{policy.name}</span>
        </div>

        {/* Header */}
        <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-[22px] font-semibold text-[#111827] dark:text-[#e8eef5]">{policy.name}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-[12px] font-semibold uppercase tracking-wide ${STATUS_STYLES[policy.status] ?? STATUS_STYLES.Draft}`}>
                {policy.status}
              </span>
              <span className="text-[12px] text-[#6b7280] dark:text-[#94a3b8] font-medium">(v{latestVersion})</span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium bg-[#3b82f6] dark:bg-[#2563eb] text-white rounded-lg hover:bg-[#2563eb] dark:hover:bg-[#1d4ed8] transition-colors">
                <Edit2 className="size-3.5" /> Edit
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.2)] rounded-lg text-[#111827] dark:text-[#e8eef5] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)] transition-colors">
                <Copy className="size-3.5" /> Duplicate
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.2)] rounded-lg text-[#111827] dark:text-[#e8eef5] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)] transition-colors">
                <Archive className="size-3.5" /> Archive
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowMoreMenu((v) => !v)}
                  className="p-1.5 border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.2)] rounded-lg text-[#6b7280] dark:text-[#94a3b8] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)] transition-colors"
                >
                  <MoreHorizontal className="size-4" />
                </button>
                {showMoreMenu && (
                  <div className="absolute right-0 top-9 w-52 bg-white dark:bg-[#1a2d47] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-xl shadow-lg z-50 py-1 text-[13px]">
                    {["Schedule", "View Version History", "View Policy Trace", "Export JSON"].map((item) => (
                      <button key={item} onClick={() => setShowMoreMenu(false)} className="w-full text-left px-4 py-2 text-[#111827] dark:text-[#e8eef5] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)] transition-colors">
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] shadow-sm overflow-hidden">
          {/* Tab bar */}
          <div className="flex border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] px-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3.5 text-[13px] font-medium transition-colors border-b-2 -mb-px ${
                  activeTab === tab.id
                    ? "border-[#3b82f6] text-[#3b82f6] dark:text-[#60a5fa]"
                    : "border-transparent text-[#6b7280] dark:text-[#94a3b8] hover:text-[#111827] dark:hover:text-[#e8eef5]"
                }`}
              >
                {tab.label}
                {tab.id === "targets" && (
                  <span className="ml-1.5 px-1.5 py-0.5 text-[11px] rounded-full bg-[#f3f4f6] dark:bg-[#1f2937] text-[#6b7280] dark:text-[#94a3b8]">
                    {displayTargets.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="p-6">

            {/* ── Overview ── */}
            {activeTab === "overview" && (
              <div className="divide-y divide-[#e5e7eb] dark:divide-[rgba(59,130,246,0.08)]">
                <div className={rowCls}>
                  <span className={labelCls}>Template</span>
                  <span className={valueCls}>{policy.template} <span className="ml-1.5 text-[11px] px-2 py-0.5 rounded-full bg-[#dbeafe] dark:bg-[#1e3a8a] text-[#1e40af] dark:text-[#93c5fd] font-medium">System</span></span>
                </div>
                <div className={rowCls}>
                  <span className={labelCls}>Category</span>
                  <span className={valueCls}>{detail.category}</span>
                </div>
                <div className={rowCls}>
                  <span className={labelCls}>Rule Type</span>
                  <span className={`${valueCls} font-mono text-[13px]`}>{detail.ruleType}</span>
                </div>
                <div className={rowCls}>
                  <span className={labelCls}>Priority</span>
                  <span className={valueCls}>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="text-[15px] font-semibold text-[#111827] dark:text-[#e8eef5]">{policy.priority}</span>
                      <span className="text-[12px] text-[#6b7280] dark:text-[#94a3b8]">/ 100</span>
                    </span>
                  </span>
                </div>
                <div className={rowCls}>
                  <span className={labelCls}>Effective</span>
                  <span className={valueCls}>{detail.effectiveFrom} → {detail.effectiveTo === "—" ? <span className="italic text-[#6b7280] dark:text-[#94a3b8]">indefinite</span> : detail.effectiveTo}</span>
                </div>
                <div className={rowCls}>
                  <span className={labelCls}>Windows</span>
                  <span className={valueCls}>{policy.window} <span className="ml-1.5 text-[12px] text-[#6b7280] dark:text-[#94a3b8]">({detail.timezone})</span></span>
                </div>
                <div className={rowCls}>
                  <span className={labelCls}>Calendars</span>
                  <div className={valueCls}>
                    {detail.calendars.map((c) => (
                      <span key={c} className="inline-block mr-2 mb-1 px-2 py-0.5 text-[12px] rounded-full bg-[#f3f4f6] dark:bg-[#1f2937] text-[#6b7280] dark:text-[#94a3b8]">{c}</span>
                    ))}
                  </div>
                </div>
                <div className={rowCls}>
                  <span className={labelCls}>Exemptions</span>
                  <div className={valueCls}>
                    {detail.exemptions.map((e) => (
                      <span key={e} className="inline-block mr-2 mb-1 px-2 py-0.5 text-[12px] rounded-full bg-[#d1fae5] dark:bg-[#065f46] text-[#065f46] dark:text-[#34d399]">{e}</span>
                    ))}
                  </div>
                </div>
                <div className={rowCls}>
                  <span className={labelCls}>Fine</span>
                  <span className={valueCls}>{detail.fine} <span className="text-[12px] text-[#6b7280] dark:text-[#94a3b8]">(escalation: {detail.escalation})</span></span>
                </div>
              </div>
            )}

            {/* ── Parameters ── */}
            {activeTab === "parameters" && (
              <div>
                <div className="divide-y divide-[#e5e7eb] dark:divide-[rgba(59,130,246,0.08)]">
                  {detail.parameters.map((p) => (
                    <div key={p.label} className={rowCls}>
                      <span className={labelCls}>{p.label}</span>
                      <span className={`${valueCls} font-mono text-[13px]`}>{p.value}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-[12px] text-[#6b7280] dark:text-[#94a3b8]">
                  Parameters are locked at publish time. To change parameters, duplicate this policy and publish a new version.
                </p>
              </div>
            )}

            {/* ── Targets ── */}
            {activeTab === "targets" && (
              <div>
                <div className="flex flex-col gap-2 mb-4">
                  {displayTargets.map((t) => (
                    <div key={t.id} className="flex items-center justify-between px-4 py-3 rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] bg-[#f9fafb] dark:bg-[#0a1628]">
                      <div>
                        <p className="text-[14px] font-medium text-[#111827] dark:text-[#e8eef5]">{t.label}</p>
                        <p className="text-[12px] text-[#6b7280] dark:text-[#94a3b8] mt-0.5">{t.detail}</p>
                      </div>
                      <button
                        onClick={() => removeTarget(t.id)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 text-[12px] font-medium text-[#dc2626] dark:text-[#fca5a5] hover:bg-[#fee2e2] dark:hover:bg-[rgba(220,38,38,0.1)] rounded-lg transition-colors"
                      >
                        <Trash2 className="size-3.5" /> Remove
                      </button>
                    </div>
                  ))}
                </div>
                <button className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-[#3b82f6] dark:text-[#60a5fa] border border-[#3b82f6] dark:border-[rgba(59,130,246,0.4)] rounded-lg hover:bg-[#eff6ff] dark:hover:bg-[rgba(59,130,246,0.08)] transition-colors">
                  <Plus className="size-4" /> Add Target
                </button>
              </div>
            )}

            {/* ── Evaluations ── */}
            {activeTab === "evaluations" && (
              <div>
                {/* Period selector */}
                <div className="flex items-center gap-2 mb-5">
                  {(["24h", "7d", "30d"] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setEvalPeriod(p)}
                      className={`px-3 py-1.5 text-[13px] font-medium rounded-lg transition-colors ${
                        evalPeriod === p
                          ? "bg-[#3b82f6] dark:bg-[#2563eb] text-white"
                          : "border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] text-[#6b7280] dark:text-[#94a3b8] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)]"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                {/* Stats tiles */}
                <div className="grid grid-cols-4 gap-3 mb-5">
                  {[
                    { label: "Total Evals",  value: detail.evaluations.total,      color: "text-[#111827] dark:text-[#e8eef5]" },
                    { label: "Violations",   value: detail.evaluations.violations,  color: "text-[#dc2626] dark:text-[#fca5a5]" },
                    { label: "Compliant",    value: detail.evaluations.compliant,   color: "text-[#16a34a] dark:text-[#34d399]" },
                    { label: "Exempt/Other", value: detail.evaluations.other,       color: "text-[#6b7280] dark:text-[#94a3b8]" },
                  ].map((s) => (
                    <div key={s.label} className="bg-[#f9fafb] dark:bg-[#0a1628] rounded-lg p-3 border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.1)]">
                      <p className="text-[12px] text-[#6b7280] dark:text-[#94a3b8] mb-1">{s.label}</p>
                      <p className={`text-[22px] font-bold ${s.color}`}>{s.value}</p>
                    </div>
                  ))}
                </div>

                {/* Outcome bar */}
                <div className="flex h-3 rounded-full overflow-hidden mb-2">
                  <div className="bg-[#dc2626]" style={{ width: `${barV}%` }} />
                  <div className="bg-[#16a34a]" style={{ width: `${barC}%` }} />
                  <div className="bg-[#d1d5db] dark:bg-[#374151]" style={{ width: `${barO}%` }} />
                </div>
                <div className="flex items-center gap-4 text-[12px] text-[#6b7280] dark:text-[#94a3b8] mb-6">
                  <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-[#dc2626] inline-block" />{barV}% violations</span>
                  <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-[#16a34a] inline-block" />{barC}% compliant</span>
                  <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-[#d1d5db] dark:bg-[#374151] inline-block" />{barO}% other</span>
                </div>

                {/* Sample table */}
                <div className="rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] overflow-hidden mb-4">
                  <table className="w-full text-[13px]">
                    <thead>
                      <tr className="bg-[#f9fafb] dark:bg-[#0a1628] border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
                        <th className="px-4 py-3 text-left font-medium text-[#6b7280] dark:text-[#94a3b8]">Time</th>
                        <th className="px-4 py-3 text-left font-medium text-[#6b7280] dark:text-[#94a3b8]">Vehicle</th>
                        <th className="px-4 py-3 text-left font-medium text-[#6b7280] dark:text-[#94a3b8]">Duration</th>
                        <th className="px-4 py-3 text-left font-medium text-[#6b7280] dark:text-[#94a3b8]">Outcome</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detail.evaluations.samples.map((s) => (
                        <tr key={s.time + s.vehicle} className="border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.08)] last:border-0 hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.3)] transition-colors">
                          <td className="px-4 py-3 font-mono text-[#6b7280] dark:text-[#94a3b8]">{s.time}</td>
                          <td className="px-4 py-3 font-mono text-[#111827] dark:text-[#e8eef5]">{s.vehicle}</td>
                          <td className="px-4 py-3 text-[#6b7280] dark:text-[#94a3b8]">{s.duration}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-full ${OUTCOME_STYLES[s.outcome]}`}>
                              {s.outcome}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button className="flex items-center gap-1.5 text-[13px] font-medium text-[#3b82f6] dark:text-[#60a5fa] hover:underline">
                  <ExternalLink className="size-3.5" /> View Policy Trace samples →
                </button>
              </div>
            )}

            {/* ── History ── */}
            {activeTab === "history" && (
              <div className="flex flex-col gap-4">
                {detail.history.map((h, i) => (
                  <div key={h.version} className="flex gap-4">
                    {/* version spine */}
                    <div className="flex flex-col items-center">
                      <div className={`size-8 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0 ${
                        i === 0
                          ? "bg-[#3b82f6] dark:bg-[#2563eb] text-white"
                          : "bg-[#f3f4f6] dark:bg-[#1f2937] text-[#6b7280] dark:text-[#94a3b8]"
                      }`}>
                        v{h.version}
                      </div>
                      {i < detail.history.length - 1 && (
                        <div className="w-px flex-1 bg-[#e5e7eb] dark:bg-[rgba(59,130,246,0.1)] mt-2" />
                      )}
                    </div>
                    {/* version body */}
                    <div className="flex-1 pb-6">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[13px] font-medium text-[#111827] dark:text-[#e8eef5]">{h.date}</span>
                        <span className="text-[12px] text-[#6b7280] dark:text-[#94a3b8]">by {h.author}</span>
                        {i === 0 && (
                          <span className="px-2 py-0.5 text-[11px] rounded-full bg-[#dbeafe] dark:bg-[#1e3a8a] text-[#1e40af] dark:text-[#93c5fd] font-medium">Current</span>
                        )}
                      </div>
                      <ul className="flex flex-col gap-1">
                        {h.changes.map((c) => (
                          <li key={c} className="flex items-start gap-2 text-[13px] text-[#6b7280] dark:text-[#94a3b8]">
                            <span className="mt-1.5 size-1.5 rounded-full bg-[#6b7280] dark:bg-[#94a3b8] flex-shrink-0" />
                            {c}
                          </li>
                        ))}
                      </ul>
                      {i < detail.history.length - 1 && (
                        <button className="mt-2 text-[12px] text-[#3b82f6] dark:text-[#60a5fa] hover:underline">
                          Compare v{h.version} → v{detail.history[i - 1]?.version ?? h.version + 1}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

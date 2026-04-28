import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

// ── Dynamic parameter schemas per rule type ───────────────────────────────

type ParamDef = {
  key: string;
  label: string;
  type: "number" | "text" | "currency" | "boolean";
  defaultValue: string;
  required?: boolean;
  hint?: string;
};

const RULE_TYPE_PARAMS: Record<string, ParamDef[]> = {
  "time-limit": [
    { key: "max_dwell_minutes", label: "Max dwell (minutes)", type: "number", defaultValue: "120", required: true, hint: "Maximum time a vehicle may stay before a violation is raised." },
    { key: "arrival_grace_seconds", label: "Arrival grace (seconds)", type: "number", defaultValue: "300", hint: "Buffer after session starts before enforcement begins." },
    { key: "departure_grace_seconds", label: "Departure grace (seconds)", type: "number", defaultValue: "600", hint: "Buffer after dwell expires before issuing a citation." },
  ],
  "permit": [
    { key: "permit_type_code", label: "Permit type code", type: "text", defaultValue: "", required: true, hint: "e.g. RES-ZONE-A, EMP-CAMPUS" },
    { key: "overstay_grace_minutes", label: "Overstay grace (minutes)", type: "number", defaultValue: "0" },
  ],
  "pay-to-park": [
    { key: "hourly_rate", label: "Hourly rate ($)", type: "currency", defaultValue: "3.00", required: true },
    { key: "daily_cap", label: "Daily cap ($)", type: "currency", defaultValue: "24.00" },
    { key: "free_period_minutes", label: "Free period (minutes)", type: "number", defaultValue: "0", hint: "Minutes of free parking before billing starts." },
    { key: "min_billable_minutes", label: "Min billable duration (minutes)", type: "number", defaultValue: "15" },
  ],
  "ev-only": [
    { key: "max_charge_minutes", label: "Max charge time (minutes)", type: "number", defaultValue: "60", required: true },
    { key: "post_charge_grace_minutes", label: "Post-charge grace (minutes)", type: "number", defaultValue: "15", hint: "Time allowed to move vehicle after charging completes." },
  ],
  "no-stopping": [
    { key: "max_stop_seconds", label: "Max stop time (seconds)", type: "number", defaultValue: "0", hint: "Set to 0 for absolute no-stopping enforcement." },
  ],
  "loading-only": [
    { key: "max_loading_minutes", label: "Max loading time (minutes)", type: "number", defaultValue: "30", required: true },
    { key: "loading_grace_seconds", label: "Loading grace (seconds)", type: "number", defaultValue: "120" },
  ],
  "handicap": [
    { key: "max_dwell_hours", label: "Max dwell (hours, 0 = unlimited)", type: "number", defaultValue: "0" },
  ],
  "commercial": [
    { key: "permit_type_code", label: "Commercial permit code", type: "text", defaultValue: "COMMERCIAL", required: true },
    { key: "max_dwell_hours", label: "Max dwell (hours)", type: "number", defaultValue: "4" },
  ],
  "fire-hydrant-clearance": [
    { key: "clearance_meters", label: "Clearance distance (meters)", type: "number", defaultValue: "3", required: true },
  ],
};

const CATEGORIES = ["Time-Limit", "Permit", "Payment", "EV", "Restriction", "Loading", "Accessible", "Commercial"];

const RULE_TYPES = [
  { value: "time-limit", label: "Time-Limit" },
  { value: "permit", label: "Permit" },
  { value: "pay-to-park", label: "Pay-to-Park" },
  { value: "ev-only", label: "EV-Only" },
  { value: "no-stopping", label: "No Stopping" },
  { value: "loading-only", label: "Loading-Only" },
  { value: "handicap", label: "Handicap / ADA" },
  { value: "commercial", label: "Commercial-Only" },
  { value: "fire-hydrant-clearance", label: "Fire Hydrant Clearance" },
];

const COMPATIBLE_ASSETS = ["Zone", "Stall", "Level"];

const EXEMPTION_OPTIONS = [
  { key: "handicap", label: "Handicap (plate or placard)" },
  { key: "government", label: "Government plates" },
  { key: "commercial", label: "Commercial vehicles" },
  { key: "fleet", label: "Fleet vehicles" },
  { key: "emergency", label: "Emergency vehicles" },
];

const RULE_FIELDS = ["dwell", "plate", "permit_type", "vehicle_category", "time_of_day", "day_of_week"];
const RULE_OPERATORS = [">", "<", "=", "≠", "≥", "≤", "contains", "not contains"];

// ── Types ─────────────────────────────────────────────────────────────────

type RuleCondition = {
  id: string;
  field: string;
  operator: string;
  value: string;
  negate: boolean;
  subGroup: RuleCondition[];
};

type CustomParam = { id: string; key: string; label: string; value: string };

// ── Helpers ───────────────────────────────────────────────────────────────

const uid = () => Math.random().toString(36).slice(2, 8);

const newCondition = (): RuleCondition => ({
  id: uid(), field: "dwell", operator: ">", value: "120", negate: false, subGroup: [],
});

// ── Section wrapper ───────────────────────────────────────────────────────

function Section({
  number, title, open, onToggle, children,
}: {
  number: string; title: string; open: boolean; onToggle: () => void; children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] shadow-sm overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-6 py-4 hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.4)] transition-colors text-left"
      >
        <span className="flex-shrink-0 size-7 rounded-full bg-[#3b82f6] dark:bg-[#2563eb] flex items-center justify-center text-white text-[12px] font-bold">
          {number}
        </span>
        <span className="font-['Inter'] font-semibold text-[15px] text-[#111827] dark:text-[#e8eef5] flex-1">
          {title}
        </span>
        {open
          ? <ChevronDown className="size-4 text-[#6b7280] dark:text-[#94a3b8]" />
          : <ChevronRight className="size-4 text-[#6b7280] dark:text-[#94a3b8]" />}
      </button>
      {open && (
        <div className="px-6 pb-6 pt-1 border-t border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
          {children}
        </div>
      )}
    </div>
  );
}

// ── Input helpers ─────────────────────────────────────────────────────────

const inputCls = "w-full bg-[#f9fafb] dark:bg-[#0a1628] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg px-3 py-2 text-[14px] text-[#111827] dark:text-[#e8eef5] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent";
const labelCls = "block font-['Inter'] text-[13px] font-medium text-[#374151] dark:text-[#94a3b8] mb-1.5";

// ─────────────────────────────────────────────────────────────────────────

export default function CustomTemplateBuilder() {
  const navigate = useNavigate();

  // Section open/close
  const [open, setOpen] = useState<Record<string, boolean>>({
    basics: true, params: true, compound: false, exemptions: true, defaults: true,
  });
  const toggle = (s: string) => setOpen((p) => ({ ...p, [s]: !p[s] }));

  // ① Basics
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Time-Limit");
  const [ruleType, setRuleType] = useState("time-limit");
  const [compatible, setCompatible] = useState<Set<string>>(new Set(["Zone", "Stall"]));

  // ② Parameters — seeded from rule type schema, override-able
  const baseParams = RULE_TYPE_PARAMS[ruleType] ?? [];
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [customParams, setCustomParams] = useState<CustomParam[]>([]);

  const getParamValue = (key: string, def: string) => paramValues[key] ?? def;
  const setParamValue = (key: string, val: string) =>
    setParamValues((p) => ({ ...p, [key]: val }));

  const addCustomParam = () =>
    setCustomParams((p) => [...p, { id: uid(), key: "", label: "", value: "" }]);
  const removeCustomParam = (id: string) =>
    setCustomParams((p) => p.filter((x) => x.id !== id));
  const updateCustomParam = (id: string, field: keyof CustomParam, val: string) =>
    setCustomParams((p) => p.map((x) => x.id === id ? { ...x, [field]: val } : x));

  // Rule type change — reset param overrides
  const handleRuleTypeChange = (rt: string) => {
    setRuleType(rt);
    setParamValues({});
    setCustomParams([]);
  };

  // ③ Compound rules
  const [compoundOperator, setCompoundOperator] = useState<"AND" | "OR" | "NOT">("AND");
  const [conditions, setConditions] = useState<RuleCondition[]>([newCondition()]);

  const addCondition = () => {
    if (conditions.length >= 5) return;
    setConditions((p) => [...p, newCondition()]);
  };
  const removeCondition = (id: string) =>
    setConditions((p) => p.filter((c) => c.id !== id));
  const updateCondition = (id: string, field: keyof RuleCondition, val: string | boolean) =>
    setConditions((p) => p.map((c) => c.id === id ? { ...c, [field]: val } : c));
  const addSubCondition = (parentId: string) =>
    setConditions((p) =>
      p.map((c) =>
        c.id === parentId && c.subGroup.length < 3
          ? { ...c, subGroup: [...c.subGroup, newCondition()] }
          : c
      )
    );
  const removeSubCondition = (parentId: string, subId: string) =>
    setConditions((p) =>
      p.map((c) =>
        c.id === parentId ? { ...c, subGroup: c.subGroup.filter((s) => s.id !== subId) } : c
      )
    );
  const updateSubCondition = (parentId: string, subId: string, field: keyof RuleCondition, val: string | boolean) =>
    setConditions((p) =>
      p.map((c) =>
        c.id === parentId
          ? { ...c, subGroup: c.subGroup.map((s) => s.id === subId ? { ...s, [field]: val } : s) }
          : c
      )
    );

  // ④ Exemptions
  const [exemptions, setExemptions] = useState<Set<string>>(new Set(["handicap", "government"]));
  const toggleExemption = (key: string) =>
    setExemptions((p) => { const n = new Set(p); n.has(key) ? n.delete(key) : n.add(key); return n; });

  // ⑤ Defaults
  const [priority, setPriority] = useState("50");
  const [fineAmount, setFineAmount] = useState("50.00");

  // Validation
  const errors: string[] = [];
  if (!name.trim()) errors.push("Template name is required.");
  if (!category) errors.push("Category is required.");
  if (compatible.size === 0) errors.push("Select at least one compatible asset type.");
  baseParams.filter((p) => p.required).forEach((p) => {
    if (!getParamValue(p.key, p.defaultValue).trim()) errors.push(`"${p.label}" is required.`);
  });

  const [attempted, setAttempted] = useState(false);
  const showErrors = attempted && errors.length > 0;

  const handlePublish = () => {
    setAttempted(true);
    if (errors.length === 0) {
      navigate("/configuration/policies/templates");
    }
  };

  const handleSaveDraft = () => {
    navigate("/configuration/policies/templates");
  };

  return (
    <div className="flex-1 overflow-auto bg-[#eff6ff] dark:bg-[#0a1628] pb-24">
      {/* Header */}
      <div className="px-8 pt-8 pb-6">
        <div className="flex items-center gap-2 text-[13px] text-[#6b7280] dark:text-[#94a3b8] mb-3">
          <button onClick={() => navigate("/configuration/policies")} className="hover:text-[#3b82f6] transition-colors">Policies</button>
          <ChevronRight className="size-3.5" />
          <button onClick={() => navigate("/configuration/policies/templates")} className="hover:text-[#3b82f6] transition-colors">Templates</button>
          <ChevronRight className="size-3.5" />
          <span className="text-[#111827] dark:text-[#e8eef5]">New Custom Template</span>
        </div>
        <h1 className="font-['Inter'] font-semibold text-[26px] text-[#111827] dark:text-[#e8eef5]">
          New Custom Template
        </h1>
        <p className="font-['Inter'] text-[14px] text-[#6b7280] dark:text-[#94a3b8] mt-1">
          Define a reusable rule template for policy assignments. Published templates are immutable — further edits create a new version.
        </p>
      </div>

      <div className="px-8 space-y-4">
        {/* Validation banner */}
        {showErrors && (
          <div className="flex items-start gap-3 bg-[#fee2e2] dark:bg-[#7f1d1d] border border-[#fca5a5] dark:border-[#f87171] rounded-xl px-4 py-3">
            <AlertTriangle className="size-5 text-[#dc2626] dark:text-[#f87171] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-[14px] text-[#dc2626] dark:text-[#f87171] mb-1">Please fix the following before publishing:</p>
              <ul className="list-disc list-inside text-[13px] text-[#991b1b] dark:text-[#fca5a5] space-y-0.5">
                {errors.map((e) => <li key={e}>{e}</li>)}
              </ul>
            </div>
          </div>
        )}

        {/* ① Basics */}
        <Section number="1" title="Basics" open={open.basics} onToggle={() => toggle("basics")}>
          <div className="pt-4 space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>
                  Name <span className="text-[#dc2626]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Curb + Permit Hybrid 3h"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`${inputCls} ${attempted && !name.trim() ? "border-[#dc2626] ring-1 ring-[#dc2626]" : ""}`}
                />
              </div>
              <div>
                <label className={labelCls}>Description</label>
                <input
                  type="text"
                  placeholder="Short description of this template"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>
                  Category <span className="text-[#dc2626]">*</span>
                </label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>
                  Rule Type <span className="text-[#dc2626]">*</span>
                </label>
                <select value={ruleType} onChange={(e) => handleRuleTypeChange(e.target.value)} className={inputCls}>
                  {RULE_TYPES.map((rt) => <option key={rt.value} value={rt.value}>{rt.label}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className={labelCls}>
                Compatible with <span className="text-[#dc2626]">*</span>
              </label>
              <div className="flex items-center gap-5 flex-wrap">
                {COMPATIBLE_ASSETS.map((asset) => (
                  <label key={asset} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={compatible.has(asset)}
                      onChange={() => {
                        const n = new Set(compatible);
                        n.has(asset) ? n.delete(asset) : n.add(asset);
                        setCompatible(n);
                      }}
                      className="size-4 rounded border-[#d1d5db] text-[#3b82f6] focus:ring-[#3b82f6] accent-[#3b82f6]"
                    />
                    <span className="text-[14px] text-[#111827] dark:text-[#e8eef5]">{asset}</span>
                  </label>
                ))}
              </div>
              {attempted && compatible.size === 0 && (
                <p className="text-[12px] text-[#dc2626] mt-1">Select at least one asset type.</p>
              )}
            </div>
          </div>
        </Section>

        {/* ② Parameters */}
        <Section number="2" title="Parameters" open={open.params} onToggle={() => toggle("params")}>
          <div className="pt-4 space-y-4">
            <p className="text-[12px] text-[#6b7280] dark:text-[#94a3b8] mb-2">
              Fields auto-adjust based on the selected Rule Type. Override defaults as needed.
            </p>

            {baseParams.map((param) => (
              <div key={param.key} className="grid grid-cols-3 gap-4 items-start">
                <div className="col-span-1">
                  <label className={labelCls}>
                    {param.label}
                    {param.required && <span className="text-[#dc2626] ml-0.5">*</span>}
                  </label>
                  {param.hint && (
                    <p className="text-[11px] text-[#9ca3af] dark:text-[#6b7280] mt-0.5 leading-relaxed">{param.hint}</p>
                  )}
                </div>
                <div className="col-span-2">
                  <div className="relative">
                    {param.type === "currency" && (
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[14px] text-[#6b7280] dark:text-[#94a3b8]">$</span>
                    )}
                    <input
                      type={param.type === "text" ? "text" : "number"}
                      value={getParamValue(param.key, param.defaultValue)}
                      onChange={(e) => setParamValue(param.key, e.target.value)}
                      className={`${inputCls} ${param.type === "currency" ? "pl-7" : ""}`}
                      min={0}
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Custom parameters */}
            {customParams.map((cp) => (
              <div key={cp.id} className="grid grid-cols-3 gap-4 items-center bg-[#f9fafb] dark:bg-[#0a1628] rounded-lg p-3 border border-dashed border-[#d1d5db] dark:border-[rgba(59,130,246,0.2)]">
                <input
                  type="text"
                  placeholder="Parameter key"
                  value={cp.key}
                  onChange={(e) => updateCustomParam(cp.id, "key", e.target.value)}
                  className={inputCls}
                />
                <input
                  type="text"
                  placeholder="Label"
                  value={cp.label}
                  onChange={(e) => updateCustomParam(cp.id, "label", e.target.value)}
                  className={inputCls}
                />
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Value"
                    value={cp.value}
                    onChange={(e) => updateCustomParam(cp.id, "value", e.target.value)}
                    className={`${inputCls} flex-1`}
                  />
                  <button
                    onClick={() => removeCustomParam(cp.id)}
                    className="p-1.5 rounded-lg hover:bg-[#fee2e2] dark:hover:bg-[#7f1d1d] text-[#dc2626] transition-colors flex-shrink-0"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={addCustomParam}
              className="flex items-center gap-2 text-[13px] font-medium text-[#3b82f6] dark:text-[#60a5fa] hover:text-[#2563eb] transition-colors"
            >
              <Plus className="size-4" />
              Add parameter
            </button>
          </div>
        </Section>

        {/* ③ Compound Rule Builder */}
        <Section number="3" title="Compound Rule Builder (optional)" open={open.compound} onToggle={() => toggle("compound")}>
          <div className="pt-4 space-y-4">
            <div className="flex items-center gap-4 mb-2">
              <span className="text-[13px] font-medium text-[#374151] dark:text-[#94a3b8]">Top-level operator:</span>
              <div className="flex items-center gap-1 p-1 bg-[#f3f4f6] dark:bg-[#0a1628] rounded-lg">
                {(["AND", "OR", "NOT"] as const).map((op) => (
                  <button
                    key={op}
                    onClick={() => setCompoundOperator(op)}
                    className={`px-3 py-1 rounded-md text-[13px] font-semibold transition-colors ${
                      compoundOperator === op
                        ? "bg-[#3b82f6] text-white shadow-sm"
                        : "text-[#6b7280] dark:text-[#94a3b8] hover:text-[#111827] dark:hover:text-[#e8eef5]"
                    }`}
                  >
                    {op}
                  </button>
                ))}
              </div>
              {conditions.length >= 5 && (
                <span className="text-[12px] text-[#ea580c] dark:text-[#fb923c]">Max 5 top-level conditions reached</span>
              )}
            </div>

            <div className="space-y-2">
              {conditions.map((cond, idx) => (
                <div key={cond.id}>
                  {idx > 0 && (
                    <div className="flex items-center gap-2 my-1 pl-4">
                      <div className="h-px flex-1 bg-[#e5e7eb] dark:bg-[rgba(59,130,246,0.15)]" />
                      <span className="text-[11px] font-bold text-[#3b82f6] dark:text-[#60a5fa] px-2">{compoundOperator}</span>
                      <div className="h-px flex-1 bg-[#e5e7eb] dark:bg-[rgba(59,130,246,0.15)]" />
                    </div>
                  )}

                  {/* Condition row */}
                  <div className="bg-[#f9fafb] dark:bg-[#0a1628] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1.5 cursor-pointer text-[12px] text-[#6b7280] dark:text-[#94a3b8] flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={cond.negate}
                          onChange={(e) => updateCondition(cond.id, "negate", e.target.checked)}
                          className="size-3.5 accent-[#dc2626]"
                        />
                        NOT
                      </label>
                      <select
                        value={cond.field}
                        onChange={(e) => updateCondition(cond.id, "field", e.target.value)}
                        className={`${inputCls} flex-1`}
                      >
                        {RULE_FIELDS.map((f) => <option key={f} value={f}>{f}</option>)}
                      </select>
                      <select
                        value={cond.operator}
                        onChange={(e) => updateCondition(cond.id, "operator", e.target.value)}
                        className={`${inputCls} w-28 flex-shrink-0`}
                      >
                        {RULE_OPERATORS.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                      <input
                        type="text"
                        placeholder="value"
                        value={cond.value}
                        onChange={(e) => updateCondition(cond.id, "value", e.target.value)}
                        className={`${inputCls} flex-1`}
                      />
                      <button
                        onClick={() => removeCondition(cond.id)}
                        disabled={conditions.length === 1}
                        className="p-1.5 rounded-lg hover:bg-[#fee2e2] dark:hover:bg-[#7f1d1d] text-[#dc2626] transition-colors disabled:opacity-30 flex-shrink-0"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>

                    {/* Sub-group */}
                    {cond.subGroup.length > 0 && (
                      <div className="pl-6 space-y-2 pt-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-4 h-px bg-[#d1d5db] dark:bg-[rgba(59,130,246,0.2)]" />
                          <span className="text-[11px] font-bold text-[#ea580c] dark:text-[#fb923c]">OR sub-group</span>
                        </div>
                        {cond.subGroup.map((sub) => (
                          <div key={sub.id} className="flex items-center gap-2">
                            <select
                              value={sub.field}
                              onChange={(e) => updateSubCondition(cond.id, sub.id, "field", e.target.value)}
                              className={`${inputCls} flex-1`}
                            >
                              {RULE_FIELDS.map((f) => <option key={f} value={f}>{f}</option>)}
                            </select>
                            <select
                              value={sub.operator}
                              onChange={(e) => updateSubCondition(cond.id, sub.id, "operator", e.target.value)}
                              className={`${inputCls} w-24 flex-shrink-0`}
                            >
                              {RULE_OPERATORS.map((o) => <option key={o} value={o}>{o}</option>)}
                            </select>
                            <input
                              type="text"
                              placeholder="value"
                              value={sub.value}
                              onChange={(e) => updateSubCondition(cond.id, sub.id, "value", e.target.value)}
                              className={`${inputCls} flex-1`}
                            />
                            <button
                              onClick={() => removeSubCondition(cond.id, sub.id)}
                              className="p-1.5 rounded-lg hover:bg-[#fee2e2] dark:hover:bg-[#7f1d1d] text-[#dc2626] transition-colors flex-shrink-0"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {cond.subGroup.length < 3 && (
                      <button
                        onClick={() => addSubCondition(cond.id)}
                        className="text-[12px] font-medium text-[#ea580c] dark:text-[#fb923c] hover:text-[#c2410c] flex items-center gap-1 pl-1"
                      >
                        <Plus className="size-3.5" />
                        Add OR sub-condition
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addCondition}
              disabled={conditions.length >= 5}
              className="flex items-center gap-2 text-[13px] font-medium text-[#3b82f6] dark:text-[#60a5fa] hover:text-[#2563eb] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="size-4" />
              Add sub-rule
            </button>
          </div>
        </Section>

        {/* ④ Allowed Exemptions */}
        <Section number="4" title="Allowed Exemptions" open={open.exemptions} onToggle={() => toggle("exemptions")}>
          <div className="pt-4">
            <p className="text-[13px] text-[#6b7280] dark:text-[#94a3b8] mb-4">
              Vehicles matching these categories will not be subject to this policy's enforcement.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {EXEMPTION_OPTIONS.map((ex) => (
                <label key={ex.key} className="flex items-center gap-3 p-3 rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.4)] cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={exemptions.has(ex.key)}
                    onChange={() => toggleExemption(ex.key)}
                    className="size-4 rounded accent-[#3b82f6]"
                  />
                  <span className="text-[14px] text-[#111827] dark:text-[#e8eef5]">{ex.label}</span>
                </label>
              ))}
            </div>
          </div>
        </Section>

        {/* ⑤ Default Values */}
        <Section number="5" title="Default Values" open={open.defaults} onToggle={() => toggle("defaults")}>
          <div className="pt-4">
            <p className="text-[13px] text-[#6b7280] dark:text-[#94a3b8] mb-4">
              These values pre-fill the Policy Assignment Wizard when this template is selected.
            </p>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Priority default <span className="text-[#6b7280] dark:text-[#94a3b8] font-normal">(0–100)</span></label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className={inputCls}
                />
                <p className="text-[11px] text-[#9ca3af] dark:text-[#6b7280] mt-1">Higher priority wins when policies overlap on the same target.</p>
              </div>
              <div>
                <label className={labelCls}>Fine amount default</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[14px] text-[#6b7280] dark:text-[#94a3b8]">$</span>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={fineAmount}
                    onChange={(e) => setFineAmount(e.target.value)}
                    className={`${inputCls} pl-7`}
                  />
                </div>
                <p className="text-[11px] text-[#9ca3af] dark:text-[#6b7280] mt-1">Base fine; escalation tiers can be configured in the assignment wizard.</p>
              </div>
            </div>
          </div>
        </Section>
      </div>

      {/* Sticky footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#0f1f35] border-t border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] px-8 py-4 flex items-center justify-between z-40 shadow-lg">
        <div className="flex items-center gap-2 text-[13px] text-[#6b7280] dark:text-[#94a3b8]">
          {!attempted || errors.length === 0 ? (
            <>
              <CheckCircle2 className="size-4 text-[#16a34a] dark:text-[#34d399]" />
              All required fields complete
            </>
          ) : (
            <>
              <AlertTriangle className="size-4 text-[#ea580c] dark:text-[#fb923c]" />
              {errors.length} issue{errors.length > 1 ? "s" : ""} to fix before publishing
            </>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveDraft}
            className="px-4 py-2 text-[14px] font-medium border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg text-[#111827] dark:text-[#e8eef5] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)] transition-colors"
          >
            Save as Draft
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-[14px] font-medium text-[#6b7280] dark:text-[#94a3b8] hover:text-[#111827] dark:hover:text-[#e8eef5] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handlePublish}
            className="flex items-center gap-2 px-5 py-2 text-[14px] font-medium bg-[#3b82f6] dark:bg-[#2563eb] text-white rounded-lg hover:bg-[#2563eb] dark:hover:bg-[#1d4ed8] transition-colors shadow-sm"
          >
            Publish Template
          </button>
        </div>
      </div>
    </div>
  );
}

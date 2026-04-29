import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { CalendarClock, Check, Info, Bell } from "lucide-react";

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

const TIMEZONES = ["America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles"];

const OVERRIDE_TEMPLATES = ["No Stopping", "Pay-to-Park", "Permit-Only", "Ops Window", "2-Hour Parking", "EV-Only"];

const OVERRIDE_MODES = [
  { id: "add",     label: "Add policies",         desc: "Layer new rules on top of existing base policies." },
  { id: "suspend", label: "Suspend base policies", desc: "Pause all current policies in targeted zones for the event window." },
  { id: "replace", label: "Replace with",          desc: "Remove base policies and apply a specific override policy set." },
];

const labelCls = "block text-sm font-medium text-[#111827] dark:text-[#e8eef5] mb-2";
const inputCls = "w-full bg-white dark:bg-[#1a2d47] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg px-4 py-2 text-sm text-[#111827] dark:text-[#e8eef5] placeholder:text-[#6b7280] dark:placeholder:text-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent";
const errCls = "mt-1 text-xs text-[#ef4444]";

export default function NewSpecialEvent() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("08:00");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("20:00");
  const [timezone, setTimezone] = useState("America/Los_Angeles");
  const [targetZones, setTargetZones] = useState(new Set<string>());
  const [overrideMode, setOverrideMode] = useState("suspend");
  const [priorityBoost, setPriorityBoost] = useState("95");
  const [overridePolicies, setOverridePolicies] = useState(new Set<string>());
  const [notifyPermitHolders, setNotifyPermitHolders] = useState(true);

  const toggleZone = (z: string) => {
    const s = new Set(targetZones);
    s.has(z) ? s.delete(z) : s.add(z);
    setTargetZones(s);
  };

  const togglePolicy = (p: string) => {
    const s = new Set(overridePolicies);
    s.has(p) ? s.delete(p) : s.add(p);
    setOverridePolicies(s);
  };

  const handleSave = () => {
    setSubmitted(true);
    if (!name || !startDate || !endDate || targetZones.size === 0) return;
    navigate("/configuration/events");
  };

  const overrideModeLabels: Record<string, string> = {
    add: "Add policies",
    suspend: "Suspend base",
    replace: "Replace with",
  };

  return (
    <>
      <div className="flex-1 overflow-auto bg-[#eff6ff] dark:bg-[#0a1628] pb-24">
        {/* Breadcrumb */}
        <div className="px-8 pt-6">
          <div className="flex items-center gap-2 text-[14px] text-[#6b7280] dark:text-[#94a3b8]">
            <Link to="/" className="hover:text-[#3b82f6]">Home</Link>
            <span>›</span>
            <Link to="/configuration/events" className="hover:text-[#3b82f6]">Special Events</Link>
            <span>›</span>
            <span className="text-[#111827] dark:text-[#e8eef5]">New Event</span>
          </div>
        </div>

        <div className="px-8 pt-4 pb-6">
          <h1 className="font-semibold text-[24px] leading-[32px] text-[#111827] dark:text-[#e8eef5]">New Special Event</h1>
          <p className="text-[14px] text-[#6b7280] dark:text-[#94a3b8] mt-1">Configure a temporary policy override for game days, emergencies, and scheduled events</p>
        </div>

        <div className="px-8">
          <div className="grid grid-cols-5 gap-6">
            {/* ── Main Form ── */}
            <div className="col-span-3 space-y-6">

              {/* Event Details */}
              <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6">
                <h2 className="font-semibold text-[#111827] dark:text-[#e8eef5] text-lg mb-6">Event Details</h2>
                <div className="space-y-5">
                  <div>
                    <label className={labelCls}>Event Name <span className="text-[#ef4444]">*</span></label>
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Parade Day 2026" className={inputCls} />
                    {submitted && !name && <p className={errCls}>Event name is required</p>}
                  </div>
                  <div>
                    <label className={labelCls}>Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      placeholder="Optional details about this event…"
                      className={`${inputCls} resize-none`}
                    />
                  </div>
                </div>
              </div>

              {/* Date & Time */}
              <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6">
                <h2 className="font-semibold text-[#111827] dark:text-[#e8eef5] text-lg mb-6">Date & Time</h2>
                <div className="space-y-5">
                  <div>
                    <label className={labelCls}>Start <span className="text-[#ef4444]">*</span></label>
                    <div className="flex gap-3">
                      <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={`${inputCls} flex-1`} />
                      <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-32 bg-white dark:bg-[#1a2d47] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg px-4 py-2 text-sm text-[#111827] dark:text-[#e8eef5] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]" />
                    </div>
                    {submitted && !startDate && <p className={errCls}>Start date is required</p>}
                  </div>
                  <div>
                    <label className={labelCls}>End <span className="text-[#ef4444]">*</span></label>
                    <div className="flex gap-3">
                      <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={`${inputCls} flex-1`} />
                      <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-32 bg-white dark:bg-[#1a2d47] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg px-4 py-2 text-sm text-[#111827] dark:text-[#e8eef5] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]" />
                    </div>
                    {submitted && !endDate && <p className={errCls}>End date is required</p>}
                  </div>
                  <div>
                    <label className={labelCls}>Timezone</label>
                    <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className={inputCls}>
                      {TIMEZONES.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Target Zones */}
              <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-[#111827] dark:text-[#e8eef5] text-lg">Target Zones <span className="text-[#ef4444]">*</span></h2>
                  <button
                    onClick={() => setTargetZones(new Set(targetZones.size === ZONES.length ? [] : ZONES))}
                    className="text-sm text-[#3b82f6] hover:underline"
                  >
                    {targetZones.size === ZONES.length ? "Deselect all" : "Select all"}
                  </button>
                </div>
                <div className="border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.2)] rounded-lg overflow-hidden">
                  {ZONES.map((z, i) => (
                    <label key={z} className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.4)] transition-colors ${i > 0 ? "border-t border-[#e5e7eb] dark:border-[rgba(59,130,246,0.08)]" : ""}`}>
                      <input type="checkbox" checked={targetZones.has(z)} onChange={() => toggleZone(z)} className="size-4 accent-[#3b82f6]" />
                      <span className="text-sm text-[#111827] dark:text-[#e8eef5]">{z}</span>
                    </label>
                  ))}
                </div>
                {submitted && targetZones.size === 0 && <p className={errCls}>Select at least one zone</p>}
              </div>

              {/* Override Configuration */}
              <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6">
                <h2 className="font-semibold text-[#111827] dark:text-[#e8eef5] text-lg mb-6">Override Configuration</h2>
                <div className="space-y-6">
                  <div>
                    <label className={labelCls}>Override Mode</label>
                    <div className="flex flex-col gap-3">
                      {OVERRIDE_MODES.map((m) => (
                        <label key={m.id} className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                          overrideMode === m.id
                            ? "border-[#3b82f6] bg-[#eff6ff] dark:bg-[rgba(59,130,246,0.08)] dark:border-[#3b82f6]"
                            : "border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.3)]"
                        }`}>
                          <input type="radio" name="overrideMode" value={m.id} checked={overrideMode === m.id} onChange={() => setOverrideMode(m.id)} className="mt-0.5 size-4 accent-[#3b82f6]" />
                          <div>
                            <p className="text-sm font-medium text-[#111827] dark:text-[#e8eef5]">{m.label}</p>
                            <p className="text-xs text-[#6b7280] dark:text-[#94a3b8] mt-0.5">{m.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Priority Boost</label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={priorityBoost}
                      onChange={(e) => setPriorityBoost(e.target.value)}
                      className="w-32 bg-white dark:bg-[#1a2d47] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg px-4 py-2 text-sm text-[#111827] dark:text-[#e8eef5] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
                    />
                    <p className="mt-1 text-xs text-[#6b7280] dark:text-[#94a3b8]">Default 95 — ensures events outrank normal policies</p>
                  </div>
                  <div>
                    <label className={labelCls}>Override Policies</label>
                    <div className="flex flex-wrap gap-2">
                      {OVERRIDE_TEMPLATES.map((t) => (
                        <button
                          key={t}
                          onClick={() => togglePolicy(t)}
                          className={`px-3 py-1.5 text-sm font-medium rounded-full border transition-colors ${
                            overridePolicies.has(t)
                              ? "bg-[#3b82f6] text-white border-[#3b82f6]"
                              : "border-[#e5e7eb] dark:border-[rgba(59,130,246,0.2)] text-[#6b7280] dark:text-[#94a3b8] hover:border-[#3b82f6] hover:text-[#3b82f6]"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Notifications</label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div
                        onClick={() => setNotifyPermitHolders(!notifyPermitHolders)}
                        className="relative w-10 rounded-full flex-shrink-0 transition-colors"
                        style={{ height: "22px", backgroundColor: notifyPermitHolders ? "#3b82f6" : "#d1d5db" }}
                      >
                        <span
                          className="absolute top-0.5 rounded-full bg-white shadow transition-transform"
                          style={{ width: "18px", height: "18px", transform: notifyPermitHolders ? "translateX(20px)" : "translateX(2px)" }}
                        />
                      </div>
                      <span className="text-sm text-[#111827] dark:text-[#e8eef5]">Auto-email affected permit holders</span>
                    </label>
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
                    <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Event Name</span>
                    <div className="flex items-center gap-2">
                      {name && <Check className="size-4 text-[#10b981]" />}
                      <span className={`text-sm ${name ? "text-[#111827] dark:text-[#e8eef5] font-medium" : "text-[#9ca3af]"}`}>{name || "—"}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Start</span>
                    <div className="flex items-center gap-2">
                      {startDate && <Check className="size-4 text-[#10b981]" />}
                      <span className={`text-sm ${startDate ? "text-[#111827] dark:text-[#e8eef5] font-medium" : "text-[#9ca3af]"}`}>
                        {startDate ? `${startDate} ${startTime}` : "—"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">End</span>
                    <div className="flex items-center gap-2">
                      {endDate && <Check className="size-4 text-[#10b981]" />}
                      <span className={`text-sm ${endDate ? "text-[#111827] dark:text-[#e8eef5] font-medium" : "text-[#9ca3af]"}`}>
                        {endDate ? `${endDate} ${endTime}` : "—"}
                      </span>
                    </div>
                  </div>
                  <div className="border-t border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Zones</span>
                      <div className="flex items-center gap-2">
                        {targetZones.size > 0 && <Check className="size-4 text-[#10b981]" />}
                        <span className={`text-sm ${targetZones.size > 0 ? "text-[#111827] dark:text-[#e8eef5] font-medium" : "text-[#9ca3af]"}`}>
                          {targetZones.size === 0 ? "None" : targetZones.size === ZONES.length ? "All zones" : `${targetZones.size} zone${targetZones.size !== 1 ? "s" : ""}`}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Override Mode</span>
                    <span className="text-sm font-medium text-[#111827] dark:text-[#e8eef5]">{overrideModeLabels[overrideMode]}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Priority</span>
                    <span className="text-sm font-medium text-[#111827] dark:text-[#e8eef5]">{priorityBoost}</span>
                  </div>
                  {notifyPermitHolders && (
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-[#f0fdf4] dark:bg-[rgba(16,185,129,0.08)] border border-[#bbf7d0] dark:border-[rgba(16,185,129,0.2)]">
                      <Bell className="size-3.5 text-[#16a34a] dark:text-[#34d399] flex-shrink-0" />
                      <span className="text-xs text-[#15803d] dark:text-[#4ade80]">Notifications enabled</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex items-start gap-2 p-3 rounded-lg bg-[#eff6ff] dark:bg-[rgba(59,130,246,0.08)] border border-[#bfdbfe] dark:border-[rgba(59,130,246,0.2)]">
                  <Info className="size-4 text-[#3b82f6] flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-[#1e40af] dark:text-[#93c5fd]">Special events are evaluated at the highest priority and will override active base policies in the selected zones.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#0f1f35] border-t border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] px-8 py-4 z-10">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate("/configuration/events")} className="border border-[#e5e7eb] text-[#111827] dark:text-[#e8eef5] font-medium rounded-lg px-6 py-2 hover:bg-[#eff6ff] dark:hover:bg-[rgba(30,58,95,0.3)] transition-colors">
            Cancel
          </button>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/configuration/events")} className="border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.2)] text-[#111827] dark:text-[#e8eef5] font-medium rounded-lg px-5 py-2 hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)] transition-colors text-sm">
              Save Draft
            </button>
            <button onClick={handleSave} className="bg-[#3b82f6] text-white font-medium rounded-lg px-6 py-2 hover:bg-[#2563eb] transition-colors flex items-center gap-2">
              <CalendarClock className="size-4" />
              Save Event
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

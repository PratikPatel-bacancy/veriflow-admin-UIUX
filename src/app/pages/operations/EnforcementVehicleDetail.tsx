import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import {
  ChevronRight,
  Car,
  Wifi,
  WifiOff,
  AlertCircle,
  Camera,
  Cpu,
  Activity,
  RefreshCw,
  Wrench,
  PowerOff,
  MapPin,
  Signal,
  Satellite,
  Clock,
  CheckCircle2,
  XCircle,
  Info,
  X,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../components/ui/tooltip";

// ── Mock data ──────────────────────────────────────────────────────────────

const MOCK_VEHICLES = [
  {
    id: 1, name: "Unit-047", fleetId: "ASSET-2047", licensePlate: "7ABC123",
    make: "Ford", model: "Explorer", year: "2023", color: "White",
    site: "Pacific Plaza Garage", status: "Active", controllerStatus: "Online",
    lastSeen: "Just now", rtkFixRatio: 98, cameras: 4,
  },
  {
    id: 2, name: "Unit-012", fleetId: "ASSET-2012", licensePlate: "4XYZ789",
    make: "Dodge", model: "Charger", year: "2022", color: "Black",
    site: "CF Pacific Centre", status: "Active", controllerStatus: "Online",
    lastSeen: "5 min ago", rtkFixRatio: 94, cameras: 3,
  },
  {
    id: 3, name: "Unit-033", fleetId: "ASSET-2033", licensePlate: "2MNO456",
    make: "Chevrolet", model: "Tahoe", year: "2021", color: "Silver",
    site: "Heritage Harbor Parking", status: "Maintenance", controllerStatus: "Offline",
    lastSeen: "2 hrs ago", rtkFixRatio: 71, cameras: 2,
  },
];

const MOCK_CAMERAS = [
  { position: "Front", name: "Lynet M504-01", serial: "CAM-SN-0091", mac: "AA:BB:CC:01:02:03", firmware: "v3.1.4", status: "Active",   poePort: "PoE1", captureDirection: "Towards", anprProfile: "US — California", mmrEnabled: true,  confidence: "0.85" },
  { position: "Rear",  name: "Lynet M504-02", serial: "CAM-SN-0092", mac: "AA:BB:CC:01:02:04", firmware: "v3.1.4", status: "Active",   poePort: "PoE2", captureDirection: "Away",    anprProfile: "US — California", mmrEnabled: true,  confidence: "0.82" },
  { position: "Left",  name: "Lynet M504-03", serial: "CAM-SN-0093", mac: "AA:BB:CC:01:02:05", firmware: "v3.0.9", status: "Active",   poePort: "PoE3", captureDirection: "Towards", anprProfile: "US — California", mmrEnabled: false, confidence: "0.79" },
  { position: "Right", name: "Lynet M504-04", serial: "CAM-SN-0094", mac: "AA:BB:CC:01:02:06", firmware: "v3.1.4", status: "Disabled", poePort: "PoE4", captureDirection: "Towards", anprProfile: "US — California", mmrEnabled: false, confidence: "0.00" },
];

const MOCK_HEALTH = [
  { timestamp: "14:32", event: "Online",      detail: "Controller checked in" },
  { timestamp: "14:00", event: "Online",      detail: "Heartbeat received" },
  { timestamp: "12:15", event: "Online",      detail: "Heartbeat received" },
  { timestamp: "10:30", event: "Offline",     detail: "Connection lost — LTE handoff" },
  { timestamp: "10:31", event: "Online",      detail: "Reconnected after 45 s" },
  { timestamp: "08:00", event: "Online",      detail: "Shift start — controller boot" },
];

// ── Helpers ────────────────────────────────────────────────────────────────

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    Active:          "bg-[#d1fae5] text-[#065f46] dark:bg-[#064e3b] dark:text-[#6ee7b7]",
    Maintenance:     "bg-[#fef3c7] text-[#92400e] dark:bg-[#451a03] dark:text-[#fcd34d]",
    Draft:           "bg-[#f3f4f6] text-[#4b5563] dark:bg-[#1f2937] dark:text-[#9ca3af]",
    Decommissioned:  "bg-[#fee2e2] text-[#991b1b] dark:bg-[#450a0a] dark:text-[#fca5a5]",
    Online:          "bg-[#d1fae5] text-[#065f46] dark:bg-[#064e3b] dark:text-[#6ee7b7]",
    Offline:         "bg-[#fee2e2] text-[#991b1b] dark:bg-[#450a0a] dark:text-[#fca5a5]",
    Disabled:        "bg-[#f3f4f6] text-[#4b5563] dark:bg-[#1f2937] dark:text-[#9ca3af]",
    FIX:             "bg-[#d1fae5] text-[#065f46]",
    FLOAT:           "bg-[#fef3c7] text-[#92400e]",
    SINGLE:          "bg-[#fee2e2] text-[#991b1b]",
  };
  return `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${map[status] ?? map.Draft}`;
};

function KpiCard({ label, value, sub, icon, info }: { label: string; value: string; sub?: string; icon: React.ReactNode; info?: string }) {
  return (
    <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-5 shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[13px] text-[#6b7280] dark:text-[#94a3b8]">{label}</span>
          {info && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="size-3.5 text-[#9ca3af] dark:text-[#6b7280] cursor-pointer hover:text-[#3b82f6] dark:hover:text-[#60a5fa] transition-colors" />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[220px] text-center">
                {info}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        {icon}
      </div>
      <p className="text-[26px] font-semibold text-[#111827] dark:text-[#e8eef5] leading-tight">{value}</p>
      {sub && <p className="text-xs text-[#9ca3af] mt-0.5">{sub}</p>}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4 py-3 border-b border-[#f3f4f6] dark:border-[rgba(59,130,246,0.08)] last:border-0">
      <span className="w-44 flex-shrink-0 text-[13px] text-[#6b7280] dark:text-[#94a3b8] font-medium">{label}</span>
      <span className="flex-1 text-[14px] text-[#111827] dark:text-[#e8eef5]">{value}</span>
    </div>
  );
}

// ── Tabs ───────────────────────────────────────────────────────────────────

type TabId = "overview" | "cameras" | "controller" | "health";

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "overview",    label: "Overview",   icon: <Car className="size-4" /> },
  { id: "cameras",     label: "Cameras",    icon: <Camera className="size-4" /> },
  { id: "controller",  label: "Controller", icon: <Cpu className="size-4" /> },
  { id: "health",      label: "Health",     icon: <Activity className="size-4" /> },
];

// ── Tab: Overview ──────────────────────────────────────────────────────────

function TabOverview({ vehicle }: { vehicle: typeof MOCK_VEHICLES[0] }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-4 gap-4">
        <KpiCard label="Last Seen"     value={vehicle.lastSeen}           icon={<Clock className="size-5 text-[#3b82f6]" />}    info="Timestamp of the last heartbeat or event received from this vehicle's controller." />
        <KpiCard label="RTK FIX Ratio" value={`${vehicle.rtkFixRatio}%`}  icon={<Satellite className="size-5 text-[#10b981]" />} sub="last 1 hr" info="Percentage of LPR events published with RTK FIX status in the last hour. Higher is better — FIX = centimetre-level accuracy." />
        <KpiCard label="Cameras"       value={`${vehicle.cameras} / 4`}   icon={<Camera className="size-5 text-[#6366f1]" />}    info="Number of cameras currently installed and active out of the maximum 4 mount positions (Front, Rear, Left, Right)." />
        <KpiCard label="Events Today"  value="1,284"                      icon={<Activity className="size-5 text-[#f59e0b]" />}  sub="from all cameras" info="Total LPR plate-read events captured and published by all cameras on this vehicle since midnight." />
      </div>

      {/* Vehicle identity */}
      <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] shadow-sm p-6">
        <p className="text-sm font-semibold text-[#111827] dark:text-[#e8eef5] mb-4">Vehicle Identity</p>
        <div className="grid grid-cols-2 gap-x-8">
          <div>
            <DetailRow label="Fleet / Asset ID"   value={vehicle.fleetId} />
            <DetailRow label="License Plate"       value={vehicle.licensePlate} />
            <DetailRow label="Make / Model / Year" value={`${vehicle.make} ${vehicle.model} ${vehicle.year}`} />
            <DetailRow label="Color"               value={vehicle.color} />
          </div>
          <div>
            <DetailRow label="Home Site"    value={vehicle.site} />
            <DetailRow label="Status"       value={<span className={statusBadge(vehicle.status)}>{vehicle.status}</span>} />
            <DetailRow label="Controller"   value={<span className={statusBadge(vehicle.controllerStatus)}>{vehicle.controllerStatus}</span>} />
            <DetailRow label="Patrol Zones" value="Zone A — Permit Holders Only, Zone B — General Public Parking" />
          </div>
        </div>
      </div>

      {/* Last known location */}
      <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-[#111827] dark:text-[#e8eef5]">Last Known Location</p>
          <span className="text-xs text-[#9ca3af]">Updated {vehicle.lastSeen}</span>
        </div>
        <div className="rounded-lg bg-[#eff6ff] dark:bg-[#0a1628] border border-[#dbeafe] dark:border-[rgba(59,130,246,0.2)] h-40 flex items-center justify-center gap-3 text-[#6b7280] dark:text-[#94a3b8]">
          <MapPin className="size-5 text-[#3b82f6]" />
          <div>
            <p className="text-sm font-medium text-[#374151] dark:text-[#cbd5e1]">34.0522° N, 118.2437° W</p>
            <p className="text-xs text-[#9ca3af]">Pacific Plaza Garage — Zone A entry lane</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Tab: Cameras ───────────────────────────────────────────────────────────

function TabCameras({ onEdit }: { onEdit: (position: string) => void }) {
  const positions = ["Front", "Rear", "Left", "Right"];
  return (
    <div className="grid grid-cols-2 gap-5">
      {positions.map((pos) => {
        const cam = MOCK_CAMERAS.find((c) => c.position === pos);
        if (!cam) {
          return (
            <div key={pos} className="bg-white dark:bg-[#0f1f35] rounded-xl border-2 border-dashed border-[#d1d5db] dark:border-[rgba(59,130,246,0.15)] p-6 flex items-center justify-center">
              <p className="text-sm text-[#9ca3af]">{pos} — No camera installed</p>
            </div>
          );
        }
        return (
          <div key={pos} className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-[#eff6ff] dark:bg-[rgba(59,130,246,0.1)] flex items-center justify-center">
                  <Camera className="size-4 text-[#3b82f6]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#111827] dark:text-[#e8eef5]">{cam.name}</p>
                  <p className="text-xs text-[#9ca3af]">{pos} mount</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={statusBadge(cam.status)}>{cam.status}</span>
                <button
                  onClick={() => onEdit(pos)}
                  title="Edit camera"
                  className="p-1.5 rounded-lg text-[#6b7280] hover:text-[#3b82f6] hover:bg-[#eff6ff] dark:hover:bg-[rgba(59,130,246,0.1)] transition-colors"
                >
                  <Pencil className="size-3.5" />
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <DetailRow label="Serial"       value={cam.serial} />
              <DetailRow label="MAC"          value={cam.mac} />
              <DetailRow label="Firmware"     value={
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${cam.firmware === "v3.1.4" ? "bg-[#d1fae5] text-[#065f46]" : "bg-[#fef3c7] text-[#92400e]"}`}>
                  {cam.firmware} {cam.firmware !== "v3.1.4" && "· Update available"}
                </span>
              } />
              <DetailRow label="PoE Port"     value={cam.poePort} />
              <DetailRow label="Direction"    value={cam.captureDirection} />
              <DetailRow label="ANPR Profile" value={cam.anprProfile} />
              <DetailRow label="MMR"          value={cam.mmrEnabled ? "Enabled" : "Disabled"} />
              <DetailRow label="Confidence"   value={cam.confidence} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Edit Camera Panel ──────────────────────────────────────────────────────

const ANPR_PROFILES = ["US — Generic", "US — California", "US — Texas", "EU — Generic", "AU — Generic"];
const IR_MODES      = ["Auto", "On", "Off"];
const CAPTURE_DIRS  = ["Towards", "Away", "Both"];

function EditCameraPanel({ position, onClose }: { position: string; onClose: () => void }) {
  const cam = MOCK_CAMERAS.find((c) => c.position === position);

  const [form, setForm] = useState({
    poePort:          cam?.poePort          ?? "",
    captureDirection: cam?.captureDirection ?? "Towards",
    anprProfile:      cam?.anprProfile      ?? "US — Generic",
    irMode:           cam?.irMode           ?? "Auto",
    confidenceFloor:  cam?.confidence       ?? "0.70",
    charSizeFloor:    cam?.charSizeFloor    ?? "",
    mmrEnabled:       cam?.mmrEnabled       ?? true,
    status:           cam?.status           ?? "Active",
    notes:            "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [done, setDone]           = useState(false);

  const patch = (p: Partial<typeof form>) => setForm((f) => ({ ...f, ...p }));
  const valid = form.poePort.trim() !== "";

  const handleSubmit = () => {
    setSubmitted(true);
    if (!valid) return;
    setDone(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40 dark:bg-black/60" onClick={onClose} />
      <div className="w-[480px] bg-white dark:bg-[#0f1f35] h-full flex flex-col shadow-2xl border-l border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
          <div className="flex items-center gap-2">
            <Pencil className="size-4 text-[#3b82f6]" />
            <h2 className="text-[16px] font-semibold text-[#111827] dark:text-[#e8eef5]">
              Edit Camera — {position} Mount
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#6b7280] hover:bg-[#f3f4f6] dark:hover:bg-[rgba(30,58,95,0.5)] transition-colors">
            <X className="size-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
          {done ? (
            <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
              <CheckCircle2 className="size-12 text-[#10b981]" />
              <p className="text-base font-semibold text-[#111827] dark:text-[#e8eef5]">Camera updated successfully</p>
              <p className="text-sm text-[#6b7280] dark:text-[#94a3b8]">
                Configuration changes for <span className="font-medium">{cam?.name}</span> have been saved and will apply on next sync.
              </p>
              <button onClick={onClose} className="mt-2 px-4 py-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-sm font-medium rounded-lg transition-colors">
                Close
              </button>
            </div>
          ) : (
            <>
              {/* Current camera info (read-only) */}
              <div className="bg-[#f8fafc] dark:bg-[#0a1628] rounded-lg p-4 border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
                <p className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-3">Camera</p>
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-lg bg-[#eff6ff] dark:bg-[rgba(59,130,246,0.1)] flex items-center justify-center">
                    <Camera className="size-4 text-[#3b82f6]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#111827] dark:text-[#e8eef5]">{cam?.name}</p>
                    <p className="text-xs text-[#9ca3af]">{cam?.serial} · {cam?.mac}</p>
                  </div>
                </div>
              </div>

              {/* PoE Port */}
              <div>
                <label className={slLabelCls}>PoE Port <span className="text-[#ef4444]">*</span></label>
                <input
                  className={slInputCls}
                  placeholder="e.g. PoE1"
                  value={form.poePort}
                  onChange={(e) => patch({ poePort: e.target.value })}
                />
                {submitted && !form.poePort.trim() && <p className="text-xs text-[#ef4444] mt-1">Required</p>}
              </div>

              {/* Capture Direction */}
              <div>
                <label className={slLabelCls}>Capture Direction</label>
                <select className={slSelectCls} value={form.captureDirection} onChange={(e) => patch({ captureDirection: e.target.value })}>
                  {CAPTURE_DIRS.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>

              {/* ANPR Profile */}
              <div>
                <label className={slLabelCls}>ANPR Profile</label>
                <select className={slSelectCls} value={form.anprProfile} onChange={(e) => patch({ anprProfile: e.target.value })}>
                  {ANPR_PROFILES.map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>

              {/* IR Illumination */}
              <div>
                <label className={slLabelCls}>IR Illumination Mode</label>
                <select className={slSelectCls} value={form.irMode} onChange={(e) => patch({ irMode: e.target.value })}>
                  {IR_MODES.map((m) => <option key={m}>{m}</option>)}
                </select>
              </div>

              {/* Confidence + Char size */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={slLabelCls}>Confidence Floor</label>
                  <input
                    className={slInputCls}
                    type="number" min="0" max="1" step="0.05"
                    placeholder="0.70"
                    value={form.confidenceFloor}
                    onChange={(e) => patch({ confidenceFloor: e.target.value })}
                  />
                </div>
                <div>
                  <label className={slLabelCls}>Char Size Floor (px)</label>
                  <input
                    className={slInputCls}
                    type="number"
                    placeholder="e.g. 20"
                    value={form.charSizeFloor}
                    onChange={(e) => patch({ charSizeFloor: e.target.value })}
                  />
                </div>
              </div>

              {/* MMR + Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={slLabelCls}>Status</label>
                  <select className={slSelectCls} value={form.status} onChange={(e) => patch({ status: e.target.value })}>
                    <option value="Active">Active</option>
                    <option value="Disabled">Disabled</option>
                  </select>
                </div>
                <div className="flex flex-col justify-end pb-0.5">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <div
                      onClick={() => patch({ mmrEnabled: !form.mmrEnabled })}
                      className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer flex-shrink-0 ${form.mmrEnabled ? "bg-[#3b82f6]" : "bg-[#d1d5db] dark:bg-[#374151]"}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 size-4 bg-white rounded-full shadow transition-transform ${form.mmrEnabled ? "translate-x-5" : "translate-x-0"}`} />
                    </div>
                    <span className="text-sm text-[#374151] dark:text-[#cbd5e1]">MMR Enabled</span>
                  </label>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className={slLabelCls}>Change Notes <span className="text-xs font-normal text-[#9ca3af]">(optional)</span></label>
                <textarea
                  className={`${slInputCls} resize-none`}
                  rows={2}
                  placeholder="e.g. Adjusted confidence floor after field calibration"
                  value={form.notes}
                  onChange={(e) => patch({ notes: e.target.value })}
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!done && (
          <div className="px-6 py-4 border-t border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] flex gap-3">
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-sm font-medium rounded-lg transition-colors"
            >
              Save Changes
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.2)] text-[#374151] dark:text-[#cbd5e1] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.4)] text-sm font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Tab: Controller ────────────────────────────────────────────────────────

function TabController() {
  return (
    <div className="flex flex-col gap-5">
      {/* Hardware */}
      <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] shadow-sm p-6">
        <p className="text-sm font-semibold text-[#111827] dark:text-[#e8eef5] mb-4">Hardware</p>
        <div className="grid grid-cols-2 gap-x-8">
          <div>
            <DetailRow label="Model"           value="OnLogic K410" />
            <DetailRow label="Serial Number"   value="K410-SN-00291" />
            <DetailRow label="MAC Address"     value="AA:BB:CC:10:20:30" />
            <DetailRow label="Hostname"        value="vf-unit-047" />
          </div>
          <div>
            <DetailRow label="Firmware"        value={<span className="text-xs font-medium px-2 py-0.5 rounded bg-[#d1fae5] text-[#065f46]">v4.2.1 · Current</span>} />
            <DetailRow label="Uptime"          value="6 h 14 min" />
            <DetailRow label="mTLS Cert"       value={<span className="text-xs font-medium px-2 py-0.5 rounded bg-[#d1fae5] text-[#065f46]">Valid · expires 2027-04-28</span>} />
            <DetailRow label="NTP Source"      value="Cloud" />
          </div>
        </div>
      </div>

      {/* GNSS / RTK */}
      <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] shadow-sm p-6">
        <p className="text-sm font-semibold text-[#111827] dark:text-[#e8eef5] mb-4">GNSS / RTK Live Status</p>
        <div className="grid grid-cols-4 gap-4 mb-4">
          {[
            { label: "Fix Type",      value: "FIX",     icon: <Satellite className="size-4 text-[#10b981]" />, cls: "text-[#10b981]", info: "Current GNSS fix type. FIX = RTK integer fix (centimetre accuracy); FLOAT = RTK float (decimetre); SINGLE = standalone GPS only (metre-level)." },
            { label: "Accuracy",      value: "±0.02 m", icon: <MapPin className="size-4 text-[#3b82f6]" />,    cls: "",               info: "Estimated horizontal position accuracy based on the current fix type and satellite geometry (DOP)." },
            { label: "Satellites",    value: "14",      icon: <Signal className="size-4 text-[#6366f1]" />,    cls: "",               info: "Number of GNSS satellites currently tracked by the controller's receiver. More satellites generally means better accuracy." },
            { label: "RTK Corr. Age", value: "0.8 s",   icon: <Clock className="size-4 text-[#f59e0b]" />,     cls: "",               info: "Age of the last RTK correction message received from the NTRIP caster. Values above 5 s may degrade fix quality." },
          ].map((s) => (
            <div key={s.label} className="bg-[#f8fafc] dark:bg-[#0a1628] rounded-lg p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-xs text-[#9ca3af]">{s.label}</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="size-3 text-[#9ca3af] cursor-pointer hover:text-[#3b82f6] transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[220px] text-center">
                      {s.info}
                    </TooltipContent>
                  </Tooltip>
                </div>
                {s.icon}
              </div>
              <p className={`text-xl font-semibold text-[#111827] dark:text-[#e8eef5] ${s.cls}`}>{s.value}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-x-8">
          <DetailRow label="NTRIP Caster"     value="ntrip.veriflow.io:2101" />
          <DetailRow label="NTRIP Mountpoint" value="VF_RTCM3_GPS" />
          <DetailRow label="GNSS Offset X/Y/Z" value="0.120 / 0.050 / 1.350 m" />
          <DetailRow label="IMU Calibration"  value={<span className="text-xs font-medium px-2 py-0.5 rounded bg-[#d1fae5] text-[#065f46]">Calibrated</span>} />
        </div>
      </div>

    </div>
  );
}

// ── Tab: Health ────────────────────────────────────────────────────────────

function TabHealth() {
  const rtkBands = [
    { label: "FIX",    pct: 78, cls: "bg-[#10b981]" },
    { label: "FLOAT",  pct: 14, cls: "bg-[#f59e0b]" },
    { label: "SINGLE", pct: 8,  cls: "bg-[#ef4444]" },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* RTK FIX ratio */}
      <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] shadow-sm p-6">
        <p className="text-sm font-semibold text-[#111827] dark:text-[#e8eef5] mb-4">RTK FIX Ratio — Last 1 hr</p>
        <div className="flex gap-2 h-6 rounded-full overflow-hidden mb-3">
          {rtkBands.map((b) => (
            <div key={b.label} className={`${b.cls} h-full`} style={{ width: `${b.pct}%` }} />
          ))}
        </div>
        <div className="flex gap-6">
          {rtkBands.map((b) => (
            <div key={b.label} className="flex items-center gap-2">
              <span className={`size-3 rounded-sm ${b.cls}`} />
              <span className="text-xs text-[#6b7280] dark:text-[#94a3b8]">{b.label} — {b.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Event latency */}
      <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] shadow-sm p-6">
        <p className="text-sm font-semibold text-[#111827] dark:text-[#e8eef5] mb-4">Event Upload Latency</p>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Median", value: "320 ms", info: "50th percentile upload latency — half of all events reach the cloud faster than this." },
            { label: "P95",    value: "890 ms", info: "95th percentile latency — 95% of events upload within this time. Spikes here may indicate intermittent LTE congestion." },
            { label: "P99",    value: "1.4 s",  info: "99th percentile latency — worst-case upload time excluding the top 1% of outliers. Values above 5 s may indicate a connectivity issue." },
          ].map((s) => (
            <div key={s.label} className="bg-[#f8fafc] dark:bg-[#0a1628] rounded-lg p-4">
              <div className="flex items-center gap-1 mb-1">
                <p className="text-xs text-[#9ca3af]">{s.label}</p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="size-3 text-[#9ca3af] cursor-pointer hover:text-[#3b82f6] transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[220px] text-center">
                    {s.info}
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-xl font-semibold text-[#111827] dark:text-[#e8eef5]">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Connectivity history */}
      <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] shadow-sm p-6">
        <p className="text-sm font-semibold text-[#111827] dark:text-[#e8eef5] mb-4">Connectivity History — Today</p>
        <div className="flex flex-col gap-3">
          {MOCK_HEALTH.map((h, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className={`mt-0.5 size-2 rounded-full flex-shrink-0 ${h.event === "Online" ? "bg-[#10b981]" : "bg-[#ef4444]"}`} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium ${h.event === "Online" ? "text-[#10b981]" : "text-[#ef4444]"}`}>{h.event}</span>
                  <span className="text-xs text-[#9ca3af]">{h.detail}</span>
                </div>
              </div>
              <span className="text-xs text-[#9ca3af] flex-shrink-0">{h.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Shared slide-over styles ───────────────────────────────────────────────

const slInputCls = "w-full px-3 py-2 text-sm border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.2)] rounded-lg bg-white dark:bg-[#0a1628] text-[#111827] dark:text-[#e8eef5] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] transition";
const slSelectCls = "w-full px-3 py-2 text-sm border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.2)] rounded-lg bg-white dark:bg-[#0a1628] text-[#111827] dark:text-[#e8eef5] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] transition";
const slLabelCls = "block text-sm font-medium text-[#374151] dark:text-[#cbd5e1] mb-1.5";

// ── Replace Controller Panel ───────────────────────────────────────────────

function ReplaceControllerPanel({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    model: "", serial: "", mac: "", hostname: "", reason: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [done, setDone] = useState(false);

  const valid = form.model && form.serial && form.mac && form.hostname && form.reason;

  const handleSubmit = () => {
    setSubmitted(true);
    if (!valid) return;
    setDone(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40 dark:bg-black/60" onClick={onClose} />
      <div className="w-[480px] bg-white dark:bg-[#0f1f35] h-full flex flex-col shadow-2xl border-l border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
          <div className="flex items-center gap-2">
            <RefreshCw className="size-4 text-[#3b82f6]" />
            <h2 className="text-[16px] font-semibold text-[#111827] dark:text-[#e8eef5]">Replace Controller</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#6b7280] hover:bg-[#f3f4f6] dark:hover:bg-[rgba(30,58,95,0.5)] transition-colors">
            <X className="size-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
          {done ? (
            <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
              <CheckCircle2 className="size-12 text-[#10b981]" />
              <p className="text-base font-semibold text-[#111827] dark:text-[#e8eef5]">Controller replaced successfully</p>
              <p className="text-sm text-[#6b7280] dark:text-[#94a3b8]">The new controller has been registered. An enrollment token will be issued on first boot.</p>
              <button onClick={onClose} className="mt-2 px-4 py-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-sm font-medium rounded-lg transition-colors">
                Close
              </button>
            </div>
          ) : (
            <>
              {/* Current controller (read-only) */}
              <div className="bg-[#f8fafc] dark:bg-[#0a1628] rounded-lg p-4 border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
                <p className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-3">Current Controller</p>
                <div className="flex flex-col gap-1.5 text-sm">
                  <div className="flex gap-2"><span className="text-[#9ca3af] w-28">Model</span><span className="text-[#111827] dark:text-[#e8eef5] font-medium">OnLogic K410</span></div>
                  <div className="flex gap-2"><span className="text-[#9ca3af] w-28">Serial</span><span className="text-[#111827] dark:text-[#e8eef5] font-medium">K410-SN-00291</span></div>
                  <div className="flex gap-2"><span className="text-[#9ca3af] w-28">Hostname</span><span className="text-[#111827] dark:text-[#e8eef5] font-medium">vf-unit-047</span></div>
                  <div className="flex gap-2"><span className="text-[#9ca3af] w-28">Firmware</span><span className="text-[#111827] dark:text-[#e8eef5] font-medium">v4.2.1</span></div>
                </div>
              </div>

              {/* New controller fields */}
              <div>
                <label className={slLabelCls}>New Controller Model <span className="text-[#ef4444]">*</span></label>
                <input className={slInputCls} placeholder="e.g. OnLogic K410" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} />
                {submitted && !form.model && <p className="text-xs text-[#ef4444] mt-1">Required</p>}
              </div>

              <div>
                <label className={slLabelCls}>Serial Number <span className="text-[#ef4444]">*</span></label>
                <input className={slInputCls} placeholder="e.g. K410-SN-00400" value={form.serial} onChange={(e) => setForm({ ...form, serial: e.target.value })} />
                <p className="text-xs text-[#9ca3af] mt-1">Must be unique and unassigned in inventory</p>
                {submitted && !form.serial && <p className="text-xs text-[#ef4444] mt-1">Required</p>}
              </div>

              <div>
                <label className={slLabelCls}>MAC Address (LAN) <span className="text-[#ef4444]">*</span></label>
                <input className={slInputCls} placeholder="e.g. AA:BB:CC:DD:EE:FF" value={form.mac} onChange={(e) => setForm({ ...form, mac: e.target.value })} />
                {submitted && !form.mac && <p className="text-xs text-[#ef4444] mt-1">Required</p>}
              </div>

              <div>
                <label className={slLabelCls}>Hostname / Device ID <span className="text-[#ef4444]">*</span></label>
                <input className={slInputCls} placeholder="e.g. vf-unit-047-r2" value={form.hostname} onChange={(e) => setForm({ ...form, hostname: e.target.value })} />
                <p className="text-xs text-[#9ca3af] mt-1">Used as CN in the new mTLS certificate</p>
                {submitted && !form.hostname && <p className="text-xs text-[#ef4444] mt-1">Required</p>}
              </div>

              <div>
                <label className={slLabelCls}>Reason for Replacement <span className="text-[#ef4444]">*</span></label>
                <textarea
                  className={`${slInputCls} resize-none`} rows={3}
                  placeholder="e.g. Hardware failure — unit unresponsive after firmware update"
                  value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })}
                />
                {submitted && !form.reason && <p className="text-xs text-[#ef4444] mt-1">Required</p>}
              </div>

              <div className="bg-[#fef3c7] dark:bg-[rgba(245,158,11,0.08)] border border-[#fde68a] dark:border-[rgba(245,158,11,0.2)] rounded-lg p-4 text-sm text-[#92400e] dark:text-[#fcd34d]">
                The old controller's serial will be marked <strong>Decommissioned</strong> and returned to inventory. A new enrollment token will be issued automatically.
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!done && (
          <div className="px-6 py-4 border-t border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] flex gap-3">
            <button onClick={handleSubmit} className="flex-1 px-4 py-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-sm font-medium rounded-lg transition-colors">
              Confirm Replacement
            </button>
            <button onClick={onClose} className="px-4 py-2 border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.2)] text-[#374151] dark:text-[#cbd5e1] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.4)] text-sm font-medium rounded-lg transition-colors">
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Move to Maintenance Panel ──────────────────────────────────────────────

function MaintenancePanel({ vehicleName, onClose }: { vehicleName: string; onClose: () => void }) {
  const [reason, setReason] = useState("");
  const [estimatedReturn, setEstimatedReturn] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    if (!reason) return;
    setDone(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40 dark:bg-black/60" onClick={onClose} />
      <div className="w-[480px] bg-white dark:bg-[#0f1f35] h-full flex flex-col shadow-2xl border-l border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
          <div className="flex items-center gap-2">
            <Wrench className="size-4 text-[#f59e0b]" />
            <h2 className="text-[16px] font-semibold text-[#111827] dark:text-[#e8eef5]">Move to Maintenance</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#6b7280] hover:bg-[#f3f4f6] dark:hover:bg-[rgba(30,58,95,0.5)] transition-colors">
            <X className="size-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
          {done ? (
            <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
              <CheckCircle2 className="size-12 text-[#f59e0b]" />
              <p className="text-base font-semibold text-[#111827] dark:text-[#e8eef5]">{vehicleName} moved to Maintenance</p>
              <p className="text-sm text-[#6b7280] dark:text-[#94a3b8]">LPR events from this vehicle will be suppressed at ingestion until the vehicle is returned to Active.</p>
              <button onClick={onClose} className="mt-2 px-4 py-2 bg-[#f59e0b] hover:bg-[#d97706] text-white text-sm font-medium rounded-lg transition-colors">
                Close
              </button>
            </div>
          ) : (
            <>
              {/* Vehicle info */}
              <div className="bg-[#f8fafc] dark:bg-[#0a1628] rounded-lg p-4 border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
                <p className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-3">Vehicle</p>
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-lg bg-[#eff6ff] dark:bg-[rgba(59,130,246,0.1)] flex items-center justify-center">
                    <Car className="size-4 text-[#3b82f6]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#111827] dark:text-[#e8eef5]">{vehicleName}</p>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#d1fae5] text-[#065f46]">Currently Active</span>
                  </div>
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className={slLabelCls}>Reason for Maintenance <span className="text-[#ef4444]">*</span></label>
                <textarea
                  className={`${slInputCls} resize-none`} rows={3}
                  placeholder="e.g. Controller firmware update scheduled, camera lens replacement"
                  value={reason} onChange={(e) => setReason(e.target.value)}
                />
                {submitted && !reason && <p className="text-xs text-[#ef4444] mt-1">Reason is required</p>}
              </div>

              {/* Estimated return */}
              <div>
                <label className={slLabelCls}>Estimated Return to Service <span className="text-xs font-normal text-[#9ca3af]">(optional)</span></label>
                <input
                  className={slInputCls} type="date"
                  value={estimatedReturn} onChange={(e) => setEstimatedReturn(e.target.value)}
                />
              </div>

              {/* Warning */}
              <div className="bg-[#fef3c7] dark:bg-[rgba(245,158,11,0.08)] border border-[#fde68a] dark:border-[rgba(245,158,11,0.2)] rounded-lg p-4 flex flex-col gap-1.5">
                <p className="text-sm font-semibold text-[#92400e] dark:text-[#fcd34d]">What happens in Maintenance mode</p>
                <ul className="text-sm text-[#92400e] dark:text-[#fcd34d] list-disc list-inside flex flex-col gap-1">
                  <li>LPR events are suppressed at ingestion</li>
                  <li>Vehicle remains visible in the fleet dashboard</li>
                  <li>Controller and cameras stay enrolled</li>
                  <li>Status can be reverted to Active at any time</li>
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!done && (
          <div className="px-6 py-4 border-t border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] flex gap-3">
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-[#f59e0b] hover:bg-[#d97706] text-white text-sm font-medium rounded-lg transition-colors"
            >
              Confirm — Move to Maintenance
            </button>
            <button onClick={onClose} className="px-4 py-2 border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.2)] text-[#374151] dark:text-[#cbd5e1] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.4)] text-sm font-medium rounded-lg transition-colors">
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Decommission Panel ─────────────────────────────────────────────────────

function DecommissionPanel({ vehicleName, onClose }: { vehicleName: string; onClose: () => void }) {
  const [confirmText, setConfirmText] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [done, setDone] = useState(false);

  const confirmed = confirmText === vehicleName;

  const handleSubmit = () => {
    setSubmitted(true);
    if (!reason || !confirmed) return;
    setDone(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40 dark:bg-black/60" onClick={onClose} />
      <div className="w-[480px] bg-white dark:bg-[#0f1f35] h-full flex flex-col shadow-2xl border-l border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
          <div className="flex items-center gap-2">
            <PowerOff className="size-4 text-[#ef4444]" />
            <h2 className="text-[16px] font-semibold text-[#111827] dark:text-[#e8eef5]">Decommission Vehicle</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#6b7280] hover:bg-[#f3f4f6] dark:hover:bg-[rgba(30,58,95,0.5)] transition-colors">
            <X className="size-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
          {done ? (
            <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
              <CheckCircle2 className="size-12 text-[#10b981]" />
              <p className="text-base font-semibold text-[#111827] dark:text-[#e8eef5]">{vehicleName} decommissioned</p>
              <p className="text-sm text-[#6b7280] dark:text-[#94a3b8]">
                The vehicle is now a read-only historical record. All serials have been returned to inventory.
              </p>
              <button onClick={onClose} className="mt-2 px-4 py-2 bg-[#ef4444] hover:bg-[#dc2626] text-white text-sm font-medium rounded-lg transition-colors">
                Close
              </button>
            </div>
          ) : (
            <>
              {/* Danger banner */}
              <div className="bg-[#fee2e2] dark:bg-[rgba(239,68,68,0.08)] border border-[#fca5a5] dark:border-[rgba(239,68,68,0.3)] rounded-lg p-4 flex flex-col gap-1.5">
                <p className="text-sm font-semibold text-[#991b1b] dark:text-[#fca5a5]">This action is irreversible</p>
                <ul className="text-sm text-[#991b1b] dark:text-[#fca5a5] list-disc list-inside flex flex-col gap-1">
                  <li>Vehicle becomes a read-only historical record</li>
                  <li>Controller and camera serials returned to inventory</li>
                  <li>All active event ingestion permanently stopped</li>
                  <li>mTLS certificate revoked immediately</li>
                </ul>
              </div>

              {/* Vehicle info */}
              <div className="bg-[#f8fafc] dark:bg-[#0a1628] rounded-lg p-4 border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
                <p className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-3">Vehicle to decommission</p>
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-lg bg-[#fee2e2] dark:bg-[rgba(239,68,68,0.1)] flex items-center justify-center">
                    <Car className="size-4 text-[#ef4444]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#111827] dark:text-[#e8eef5]">{vehicleName}</p>
                    <p className="text-xs text-[#9ca3af]">Controller · 4 Cameras · Pacific Plaza Garage</p>
                  </div>
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className={slLabelCls}>Reason for Decommission <span className="text-[#ef4444]">*</span></label>
                <textarea
                  className={`${slInputCls} resize-none`} rows={3}
                  placeholder="e.g. Vehicle totalled in accident — hardware non-recoverable"
                  value={reason} onChange={(e) => setReason(e.target.value)}
                />
                {submitted && !reason && <p className="text-xs text-[#ef4444] mt-1">Reason is required</p>}
              </div>

              {/* Confirm by typing vehicle name */}
              <div>
                <label className={slLabelCls}>
                  Type <span className="font-mono font-bold text-[#111827] dark:text-[#e8eef5]">{vehicleName}</span> to confirm
                </label>
                <input
                  className={`${slInputCls} ${submitted && !confirmed ? "border-[#ef4444] focus:ring-[#ef4444]" : ""}`}
                  placeholder={vehicleName}
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                />
                {submitted && !confirmed && (
                  <p className="text-xs text-[#ef4444] mt-1">Vehicle name does not match</p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!done && (
          <div className="px-6 py-4 border-t border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={!confirmed || !reason}
              className="flex-1 px-4 py-2 bg-[#ef4444] hover:bg-[#dc2626] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
            >
              Permanently Decommission
            </button>
            <button onClick={onClose} className="px-4 py-2 border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.2)] text-[#374151] dark:text-[#cbd5e1] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.4)] text-sm font-medium rounded-lg transition-colors">
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────

export default function EnforcementVehicleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [showReplaceController, setShowReplaceController] = useState(false);
  const [showMaintenance, setShowMaintenance] = useState(false);
  const [showDecommission, setShowDecommission] = useState(false);
  const [editCameraPosition, setEditCameraPosition] = useState<string | null>(null);

  const vehicle = MOCK_VEHICLES.find((v) => v.id === Number(id)) ?? MOCK_VEHICLES[0];

  return (
    <>
    <div className="flex-1 overflow-auto bg-[#eff6ff] dark:bg-[#0a1628] pb-8">
      <div className="px-8 pt-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[13px] text-[#6b7280] dark:text-[#94a3b8] mb-6">
          <Link to="/operations/enforcement-vehicles" className="hover:text-[#3b82f6] transition-colors">
            Enforcement Vehicles
          </Link>
          <ChevronRight className="size-3.5" />
          <span className="text-[#111827] dark:text-[#e8eef5] font-medium">{vehicle.name}</span>
        </div>

        {/* Header */}
        <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-[#eff6ff] dark:bg-[rgba(59,130,246,0.1)] flex items-center justify-center">
                <Car className="size-6 text-[#3b82f6]" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-[22px] font-semibold text-[#111827] dark:text-[#e8eef5]">{vehicle.name}</h1>
                  <span className={statusBadge(vehicle.status)}>{vehicle.status}</span>
                  <span className={statusBadge(vehicle.controllerStatus)}>
                    {vehicle.controllerStatus === "Online"
                      ? <><Wifi className="size-3 inline mr-1" />{vehicle.controllerStatus}</>
                      : <><WifiOff className="size-3 inline mr-1" />{vehicle.controllerStatus}</>
                    }
                  </span>
                </div>
                <p className="text-[13px] text-[#6b7280] dark:text-[#94a3b8]">
                  {vehicle.site} · {vehicle.make} {vehicle.model} {vehicle.year} · {vehicle.licensePlate}
                </p>
              </div>
            </div>

            {/* Inline actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => setShowReplaceController(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.2)] rounded-lg text-[#111827] dark:text-[#e8eef5] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)] transition-colors">
                <RefreshCw className="size-3.5" /> Replace Controller
              </button>
              <button onClick={() => setShowMaintenance(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium border border-[#fef3c7] dark:border-[rgba(245,158,11,0.3)] rounded-lg text-[#92400e] dark:text-[#fcd34d] bg-[#fffbeb] dark:bg-[rgba(245,158,11,0.05)] hover:bg-[#fef3c7] transition-colors">
                <Wrench className="size-3.5" /> Move to Maintenance
              </button>
              <button onClick={() => setShowDecommission(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium border border-[#fee2e2] dark:border-[rgba(239,68,68,0.3)] rounded-lg text-[#991b1b] dark:text-[#fca5a5] bg-[#fff5f5] dark:bg-[rgba(239,68,68,0.05)] hover:bg-[#fee2e2] transition-colors">
                <PowerOff className="size-3.5" /> Decommission
              </button>
            </div>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 mb-6 bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-1 w-fit">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-[#3b82f6] text-white shadow-sm"
                  : "text-[#6b7280] dark:text-[#94a3b8] hover:bg-[#f3f4f6] dark:hover:bg-[rgba(30,58,95,0.5)]"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "overview"   && <TabOverview vehicle={vehicle} />}
        {activeTab === "cameras"    && <TabCameras onEdit={(pos) => setEditCameraPosition(pos)} />}
        {activeTab === "controller" && <TabController />}
        {activeTab === "health"     && <TabHealth />}

      </div>
    </div>

    {/* ── Edit Camera slide-over ── */}
    {editCameraPosition && (
      <EditCameraPanel
        position={editCameraPosition}
        onClose={() => setEditCameraPosition(null)}
      />
    )}

    {/* ── Replace Controller slide-over ── */}
    {showReplaceController && (
      <ReplaceControllerPanel onClose={() => setShowReplaceController(false)} />
    )}

    {/* ── Move to Maintenance slide-over ── */}
    {showMaintenance && (
      <MaintenancePanel vehicleName={vehicle.name} onClose={() => setShowMaintenance(false)} />
    )}

    {/* ── Decommission slide-over ── */}
    {showDecommission && (
      <DecommissionPanel vehicleName={vehicle.name} onClose={() => setShowDecommission(false)} />
    )}
    </>
  );
}

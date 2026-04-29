import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Check,
  Plus,
  Car,
  ChevronRight,
  ChevronLeft,
  Key,
  CheckCircle2,
  Loader2,
  X,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────

type MountPosition = "Front" | "Rear" | "Left" | "Right";

interface CameraConfig {
  model: string;
  serial: string;
  mac: string;
  poePort: string;
  captureDirection: string;
  fovCoverage: string;
  anprProfile: string;
  mmrEnabled: boolean;
  irMode: string;
  mountingOffset: string;
  charSizeFloor: string;
  confidenceFloor: string;
  status: string;
}

interface WizardState {
  vehicleName: string;
  fleetId: string;
  licensePlate: string;
  make: string;
  model: string;
  year: string;
  color: string;
  homeSite: string;
  assignedFacility: string[];
  operatorTeam: string;
  vehicleStatus: string;
  notes: string;
  controllerModel: string;
  controllerSerial: string;
  controllerMac: string;
  hostname: string;
  firmwareVersion: string;
  wanCarrier: string;
  simIccid: string;
  ntripUrl: string;
  ntripMountpoint: string;
  ntripUser: string;
  ntripPassword: string;
  gnssOffsetX: string;
  gnssOffsetY: string;
  gnssOffsetZ: string;
  ntpSource: string;
  enrollmentTokenGenerated: boolean;
  cameras: Partial<Record<MountPosition, CameraConfig>>;
  patrolZones: string[];
  geoConfidenceFloor: string;
  eventUploadMode: string;
  localBufferRetention: string;
  notificationTargets: string[];
  operatingHoursStart: string;
  operatingHoursEnd: string;
}

const MOUNT_POSITIONS: MountPosition[] = ["Front", "Rear", "Left", "Right"];

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

const TEAMS = ["Alpha Shift", "Beta Shift", "Night Patrol", "Special Operations"];
const COLORS = ["White", "Black", "Silver", "Blue", "Red", "Green", "Yellow"];
const NTP_SOURCES = ["Controller NTP", "NTRIP", "Cloud"];
const ANPR_PROFILES = ["US — Generic", "US — California", "US — Texas", "EU — Generic", "AU — Generic"];
const IR_MODES = ["Auto", "On", "Off"];
const CAPTURE_DIRECTIONS = ["Towards", "Away", "Both"];
const UPLOAD_MODES = ["Real-time", "Batched-on-WiFi", "Hybrid"];
const GEO_CONFIDENCE = ["FIX", "FLOAT", "SINGLE"];
const VEHICLE_STATUSES = ["Active", "In Service", "Maintenance", "Decommissioned"];
const WEBHOOKS = ["Webhook — Dispatch API", "Webhook — Alert System", "Webhook — Analytics Pipeline"];

const defaultCamera = (): CameraConfig => ({
  model: "Lynet M504",
  serial: "",
  mac: "",
  poePort: "",
  captureDirection: "Towards",
  fovCoverage: "",
  anprProfile: "US — Generic",
  mmrEnabled: true,
  irMode: "Auto",
  mountingOffset: "",
  charSizeFloor: "",
  confidenceFloor: "0.7",
  status: "Active",
});

const initialState: WizardState = {
  vehicleName: "", fleetId: "", licensePlate: "", make: "", model: "", year: "",
  color: "", homeSite: "", assignedFacility: [], operatorTeam: "", vehicleStatus: "Active", notes: "",
  controllerModel: "OnLogic K300", controllerSerial: "", controllerMac: "", hostname: "",
  firmwareVersion: "v4.2.1 (auto)", wanCarrier: "", simIccid: "", ntripUrl: "",
  ntripMountpoint: "", ntripUser: "", ntripPassword: "", gnssOffsetX: "", gnssOffsetY: "",
  gnssOffsetZ: "", ntpSource: "Cloud", enrollmentTokenGenerated: false,
  cameras: {},
  patrolZones: [], geoConfidenceFloor: "FIX", eventUploadMode: "Real-time",
  localBufferRetention: "35000", notificationTargets: [], operatingHoursStart: "", operatingHoursEnd: "",
};

// ── Shared field styles ────────────────────────────────────────────────────

const inputCls =
  "w-full px-4 py-2 text-sm border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg bg-white dark:bg-[#1a2d47] text-[#111827] dark:text-[#e8eef5] placeholder:text-[#6b7280] dark:placeholder:text-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition";

const selectCls =
  "w-full px-4 py-2 text-sm border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg bg-white dark:bg-[#1a2d47] text-[#111827] dark:text-[#e8eef5] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition";

function Field({
  label, required, children,
}: {
  label: string; required?: boolean; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#111827] dark:text-[#e8eef5] mb-2">
        {label}{required && <span className="text-[#ef4444] ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

// ── Step 1 — Vehicle Identity ──────────────────────────────────────────────

function StepVehicleIdentity({ state, set }: { state: WizardState; set: (p: Partial<WizardState>) => void }) {
  const toggleFacility = (f: string) =>
    set({ assignedFacility: state.assignedFacility.includes(f) ? state.assignedFacility.filter((x) => x !== f) : [...state.assignedFacility, f] });

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Vehicle Name / Call Sign" required>
          <input className={inputCls} placeholder="e.g. Unit-047" value={state.vehicleName} onChange={(e) => set({ vehicleName: e.target.value })} />
        </Field>
        <Field label="Fleet / Asset ID" required>
          <input className={inputCls} placeholder="e.g. ASSET-2047" value={state.fleetId} onChange={(e) => set({ fleetId: e.target.value })} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="License Plate (own)" required>
          <input className={inputCls} placeholder="e.g. 7ABC123" value={state.licensePlate} onChange={(e) => set({ licensePlate: e.target.value })} />
        </Field>
        <Field label="Vehicle Color">
          <select className={selectCls} value={state.color} onChange={(e) => set({ color: e.target.value })}>
            <option value="">Select color</option>
            {COLORS.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Make">
          <input className={inputCls} placeholder="e.g. Ford" value={state.make} onChange={(e) => set({ make: e.target.value })} />
        </Field>
        <Field label="Model / Year">
          <div className="flex gap-2">
            <input className={inputCls} placeholder="e.g. Explorer" value={state.model} onChange={(e) => set({ model: e.target.value })} />
            <input className={inputCls} placeholder="2024" value={state.year} onChange={(e) => set({ year: e.target.value })} />
          </div>
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="VIN">
          <input className={inputCls} placeholder="17-character VIN" />
        </Field>
        <Field label="Home Site" required>
          <select className={selectCls} value={state.homeSite} onChange={(e) => set({ homeSite: e.target.value })}>
            <option value="">Select site</option>
            {SITES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Assigned Facility / Beat">
        <div className="flex flex-wrap gap-2 p-3 border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg min-h-[42px] bg-white dark:bg-[#1a2d47]">
          {ZONES.map((z) => (
            <button
              key={z} type="button"
              onClick={() => toggleFacility(z)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                state.assignedFacility.includes(z)
                  ? "bg-[#3b82f6] text-white"
                  : "bg-[#f3f4f6] dark:bg-[#0f1f35] text-[#6b7280] dark:text-[#94a3b8] hover:bg-[#dbeafe] dark:hover:bg-[rgba(59,130,246,0.2)]"
              }`}
            >
              {z}
            </button>
          ))}
        </div>
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Operator Team / Shift">
          <select className={selectCls} value={state.operatorTeam} onChange={(e) => set({ operatorTeam: e.target.value })}>
            <option value="">Select team</option>
            {TEAMS.map((t) => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Status" required>
          <select className={selectCls} value={state.vehicleStatus} onChange={(e) => set({ vehicleStatus: e.target.value })}>
            {VEHICLE_STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Notes">
        <textarea
          className={`${inputCls} resize-none`} rows={3}
          placeholder="Optional notes…"
          value={state.notes} onChange={(e) => set({ notes: e.target.value })}
        />
      </Field>
    </div>
  );
}

// ── Step 2 — Controller / Gateway ─────────────────────────────────────────

function StepController({ state, set }: { state: WizardState; set: (p: Partial<WizardState>) => void }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Controller Model" required>
          <input className={inputCls} placeholder="e.g. OnLogic K300" value={state.controllerModel} onChange={(e) => set({ controllerModel: e.target.value })} />
        </Field>
        <Field label="Serial Number" required>
          <input className={inputCls} placeholder="e.g. K300-SN-00291" value={state.controllerSerial} onChange={(e) => set({ controllerSerial: e.target.value })} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="MAC Address (LAN)" required>
          <input className={inputCls} placeholder="e.g. AA:BB:CC:DD:EE:FF" value={state.controllerMac} onChange={(e) => set({ controllerMac: e.target.value })} />
        </Field>
        <Field label="Hostname / Device ID" required>
          <input className={inputCls} placeholder="e.g. vf-unit-047" value={state.hostname} onChange={(e) => set({ hostname: e.target.value })} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Firmware Version">
          <input className={`${inputCls} opacity-60 cursor-not-allowed`} value={state.firmwareVersion} readOnly />
        </Field>
        <Field label="NTP Source" required>
          <select className={selectCls} value={state.ntpSource} onChange={(e) => set({ ntpSource: e.target.value })}>
            {NTP_SOURCES.map((n) => <option key={n}>{n}</option>)}
          </select>
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="WAN Carrier / APN" required>
          <input className={inputCls} placeholder="e.g. Verizon / vzwinternet" value={state.wanCarrier} onChange={(e) => set({ wanCarrier: e.target.value })} />
        </Field>
        <Field label="SIM ICCID / IMEI" required>
          <input className={inputCls} placeholder="e.g. 89014103211118510720" value={state.simIccid} onChange={(e) => set({ simIccid: e.target.value })} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="NTRIP Caster URL" required>
          <input className={inputCls} placeholder="e.g. ntrip.veriflow.io:2101" value={state.ntripUrl} onChange={(e) => set({ ntripUrl: e.target.value })} />
        </Field>
        <Field label="NTRIP Mountpoint" required>
          <input className={inputCls} placeholder="e.g. VF_RTCM3_GPS" value={state.ntripMountpoint} onChange={(e) => set({ ntripMountpoint: e.target.value })} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="NTRIP Username" required>
          <input className={inputCls} placeholder="Username" value={state.ntripUser} onChange={(e) => set({ ntripUser: e.target.value })} />
        </Field>
        <Field label="NTRIP Password" required>
          <input className={inputCls} type="password" placeholder="Password" value={state.ntripPassword} onChange={(e) => set({ ntripPassword: e.target.value })} />
        </Field>
      </div>
      <Field label="GNSS Antenna Offset (x, y, z) metres">
        <div className="flex gap-3">
          {(["X", "Y", "Z"] as const).map((axis) => (
            <div key={axis} className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#6b7280]">{axis}</span>
              <input
                className={`${inputCls} pl-7`}
                placeholder="0.000"
                value={axis === "X" ? state.gnssOffsetX : axis === "Y" ? state.gnssOffsetY : state.gnssOffsetZ}
                onChange={(e) =>
                  set(axis === "X" ? { gnssOffsetX: e.target.value } : axis === "Y" ? { gnssOffsetY: e.target.value } : { gnssOffsetZ: e.target.value })
                }
              />
            </div>
          ))}
        </div>
      </Field>
      <Field label="mTLS Certificate" required>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => set({ enrollmentTokenGenerated: true })}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              state.enrollmentTokenGenerated
                ? "bg-[#d1fae5] text-[#065f46] dark:bg-[#064e3b] dark:text-[#6ee7b7] cursor-default"
                : "bg-[#3b82f6] hover:bg-[#2563eb] text-white"
            }`}
          >
            {state.enrollmentTokenGenerated ? (
              <><CheckCircle2 className="size-4" /> Token Generated</>
            ) : (
              <><Key className="size-4" /> Generate Enrollment Token</>
            )}
          </button>
          {state.enrollmentTokenGenerated && (
            <span className="text-xs text-[#6b7280] dark:text-[#94a3b8]">Token valid for 24 hours · Single-use</span>
          )}
        </div>
      </Field>
    </div>
  );
}

// ── Step 3 — Cameras ───────────────────────────────────────────────────────

function CameraCard({
  position, camera, onAdd, onRemove, onChange,
}: {
  position: MountPosition;
  camera?: CameraConfig;
  onAdd: () => void;
  onRemove: () => void;
  onChange: (patch: Partial<CameraConfig>) => void;
}) {
  if (!camera) {
    return (
      <button
        type="button"
        onClick={onAdd}
        className="flex flex-col items-center justify-center gap-3 h-44 rounded-lg border-2 border-dashed border-[#d1d5db] dark:border-[rgba(59,130,246,0.2)] hover:border-[#3b82f6] dark:hover:border-[#3b82f6] hover:bg-[#eff6ff] dark:hover:bg-[rgba(59,130,246,0.05)] transition-colors group"
      >
        <div className="size-10 rounded-full bg-[#f3f4f6] dark:bg-[#1e3a5f] flex items-center justify-center group-hover:bg-[#dbeafe] dark:group-hover:bg-[rgba(59,130,246,0.2)] transition-colors">
          <Plus className="size-5 text-[#9ca3af] group-hover:text-[#3b82f6]" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-[#374151] dark:text-[#cbd5e1]">{position}</p>
          <p className="text-xs text-[#9ca3af]">Add Camera</p>
        </div>
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-[#3b82f6] dark:border-[rgba(59,130,246,0.4)] bg-[#eff6ff] dark:bg-[rgba(59,130,246,0.05)] p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Car className="size-4 text-[#3b82f6]" />
          <span className="text-sm font-semibold text-[#1d4ed8] dark:text-[#93c5fd]">{position}</span>
        </div>
        <button type="button" onClick={onRemove} className="text-[#9ca3af] hover:text-[#ef4444] transition-colors">
          <X className="size-4" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Serial No." required>
          <input className={inputCls} placeholder="CAM-SN-XXXX" value={camera.serial} onChange={(e) => onChange({ serial: e.target.value })} />
        </Field>
        <Field label="MAC Address" required>
          <input className={inputCls} placeholder="AA:BB:CC:DD:EE:FF" value={camera.mac} onChange={(e) => onChange({ mac: e.target.value })} />
        </Field>
        <Field label="PoE Port" required>
          <input className={inputCls} placeholder="e.g. PoE1" value={camera.poePort} onChange={(e) => onChange({ poePort: e.target.value })} />
        </Field>
        <Field label="Capture Direction" required>
          <select className={selectCls} value={camera.captureDirection} onChange={(e) => onChange({ captureDirection: e.target.value })}>
            {CAPTURE_DIRECTIONS.map((d) => <option key={d}>{d}</option>)}
          </select>
        </Field>
        <Field label="ANPR Profile">
          <select className={selectCls} value={camera.anprProfile} onChange={(e) => onChange({ anprProfile: e.target.value })}>
            {ANPR_PROFILES.map((p) => <option key={p}>{p}</option>)}
          </select>
        </Field>
        <Field label="IR Illumination">
          <select className={selectCls} value={camera.irMode} onChange={(e) => onChange({ irMode: e.target.value })}>
            {IR_MODES.map((m) => <option key={m}>{m}</option>)}
          </select>
        </Field>
        <Field label="Confidence Floor">
          <input className={inputCls} type="number" min="0" max="1" step="0.05" placeholder="0.70" value={camera.confidenceFloor} onChange={(e) => onChange({ confidenceFloor: e.target.value })} />
        </Field>
        <Field label="Char Size Floor (px)">
          <input className={inputCls} type="number" placeholder="e.g. 20" value={camera.charSizeFloor} onChange={(e) => onChange({ charSizeFloor: e.target.value })} />
        </Field>
      </div>
      <div className="flex items-center justify-between pt-1">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={camera.mmrEnabled} onChange={(e) => onChange({ mmrEnabled: e.target.checked })} className="accent-[#3b82f6]" />
          <span className="text-xs text-[#374151] dark:text-[#cbd5e1]">MMR (Make/Model/Color)</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={camera.status === "Active"}
            onChange={(e) => onChange({ status: e.target.checked ? "Active" : "Disabled" })}
            className="accent-[#3b82f6]"
          />
          <span className="text-xs text-[#374151] dark:text-[#cbd5e1]">Active</span>
        </label>
      </div>
    </div>
  );
}

function StepCameras({ state, set }: { state: WizardState; set: (p: Partial<WizardState>) => void }) {
  const updateCamera = (pos: MountPosition, patch: Partial<CameraConfig>) =>
    set({ cameras: { ...state.cameras, [pos]: { ...state.cameras[pos]!, ...patch } } });
  const addCamera = (pos: MountPosition) =>
    set({ cameras: { ...state.cameras, [pos]: defaultCamera() } });
  const removeCamera = (pos: MountPosition) => {
    const next = { ...state.cameras };
    delete next[pos];
    set({ cameras: next });
  };
  const count = Object.keys(state.cameras).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#6b7280] dark:text-[#94a3b8]">
          {count} of 4 camera positions filled. At least 1 required to activate.
        </p>
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${count >= 1 ? "bg-[#d1fae5] text-[#065f46]" : "bg-[#fef3c7] text-[#92400e]"}`}>
          {count >= 1 ? "Minimum met" : "Add at least 1 camera"}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {MOUNT_POSITIONS.map((pos) => (
          <CameraCard
            key={pos}
            position={pos}
            camera={state.cameras[pos]}
            onAdd={() => addCamera(pos)}
            onRemove={() => removeCamera(pos)}
            onChange={(patch) => updateCamera(pos, patch)}
          />
        ))}
      </div>
    </div>
  );
}

// ── Step 4 — Operational Configuration ────────────────────────────────────

function StepOperational({ state, set }: { state: WizardState; set: (p: Partial<WizardState>) => void }) {
  const toggleZone = (z: string) =>
    set({ patrolZones: state.patrolZones.includes(z) ? state.patrolZones.filter((x) => x !== z) : [...state.patrolZones, z] });
  const toggleWebhook = (w: string) =>
    set({ notificationTargets: state.notificationTargets.includes(w) ? state.notificationTargets.filter((x) => x !== w) : [...state.notificationTargets, w] });

  return (
    <div className="space-y-5">
      <Field label="Patrol Zones / Facilities">
        <div className="flex flex-wrap gap-2 p-3 border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg min-h-[42px] bg-white dark:bg-[#1a2d47]">
          {ZONES.map((z) => (
            <button key={z} type="button" onClick={() => toggleZone(z)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                state.patrolZones.includes(z)
                  ? "bg-[#3b82f6] text-white"
                  : "bg-[#f3f4f6] dark:bg-[#0f1f35] text-[#6b7280] dark:text-[#94a3b8] hover:bg-[#dbeafe] dark:hover:bg-[rgba(59,130,246,0.2)]"
              }`}
            >
              {z}
            </button>
          ))}
        </div>
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Geo-Confidence Floor" required>
          <div className="flex gap-4 pt-1">
            {GEO_CONFIDENCE.map((g) => (
              <label key={g} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="geoConf" value={g} checked={state.geoConfidenceFloor === g} onChange={() => set({ geoConfidenceFloor: g })} className="accent-[#3b82f6]" />
                <span className="text-sm text-[#374151] dark:text-[#cbd5e1]">{g}</span>
              </label>
            ))}
          </div>
        </Field>
        <Field label="Event Upload Mode" required>
          <div className="flex gap-4 flex-wrap pt-1">
            {UPLOAD_MODES.map((m) => (
              <label key={m} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="uploadMode" value={m} checked={state.eventUploadMode === m} onChange={() => set({ eventUploadMode: m })} className="accent-[#3b82f6]" />
                <span className="text-sm text-[#374151] dark:text-[#cbd5e1]">{m}</span>
              </label>
            ))}
          </div>
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Local Buffer Retention" required>
          <input className={inputCls} type="number" value={state.localBufferRetention} onChange={(e) => set({ localBufferRetention: e.target.value })} />
        </Field>
        <Field label="Operating Hours">
          <div className="flex items-center gap-2">
            <input className={inputCls} type="time" value={state.operatingHoursStart} onChange={(e) => set({ operatingHoursStart: e.target.value })} />
            <span className="text-sm text-[#6b7280] flex-shrink-0">to</span>
            <input className={inputCls} type="time" value={state.operatingHoursEnd} onChange={(e) => set({ operatingHoursEnd: e.target.value })} />
          </div>
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Idempotency Strategy">
          <input className={`${inputCls} opacity-60 cursor-not-allowed`} value="event_id UUIDv4 (system policy)" readOnly />
        </Field>
        <Field label="Retry Policy">
          <input className={`${inputCls} opacity-60 cursor-not-allowed`} value="Exponential backoff with jitter" readOnly />
        </Field>
      </div>
      <Field label="Notification Targets">
        <div className="flex flex-wrap gap-2 p-3 border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg min-h-[42px] bg-white dark:bg-[#1a2d47]">
          {WEBHOOKS.map((w) => (
            <button key={w} type="button" onClick={() => toggleWebhook(w)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                state.notificationTargets.includes(w)
                  ? "bg-[#3b82f6] text-white"
                  : "bg-[#f3f4f6] dark:bg-[#0f1f35] text-[#6b7280] dark:text-[#94a3b8] hover:bg-[#dbeafe]"
              }`}
            >
              {w}
            </button>
          ))}
        </div>
      </Field>
    </div>
  );
}

// ── Step 5 — Pre-flight check ──────────────────────────────────────────────

type CheckStatus = "idle" | "running" | "passed" | "failed";

const PREFLIGHT_CHECKS = [
  { key: "cloud", label: "Cloud reachability (api.veriflow.io)" },
  { key: "mtls", label: "mTLS certificate validity" },
  { key: "gnss", label: "GNSS lock acquired" },
  { key: "rtk", label: "RTK correction age within threshold" },
  { key: "cameras", label: "All cameras reachable (PoE ports)" },
  { key: "ntp", label: "NTP drift within tolerance" },
  { key: "agent", label: "Edge Agent version current" },
];

function StepPreflight({
  checkStatus,
  checkResults,
  onRunPreflight,
}: {
  checkStatus: CheckStatus;
  checkResults: Record<string, boolean>;
  onRunPreflight: () => void;
}) {
  const allPassed = Object.keys(checkResults).length > 0 && Object.values(checkResults).every(Boolean);

  return (
    <div className="space-y-4">
      <div className="border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-semibold text-[#111827] dark:text-[#e8eef5]">Pre-Flight Health Check</p>
            <p className="text-sm text-[#6b7280] dark:text-[#94a3b8] mt-0.5">
              Validates connectivity and hardware before activating the vehicle.
            </p>
          </div>
          <button
            type="button"
            onClick={onRunPreflight}
            disabled={checkStatus === "running"}
            className="flex items-center gap-2 px-4 py-2 bg-[#3b82f6] hover:bg-[#2563eb] disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {checkStatus === "running" && <Loader2 className="size-4 animate-spin" />}
            Run Pre-Flight Check
          </button>
        </div>
        <div className="flex flex-col gap-2.5">
          {PREFLIGHT_CHECKS.map((c) => {
            const result = checkResults[c.key];
            return (
              <div key={c.key} className="flex items-center gap-3 text-sm">
                <span className="size-5 flex items-center justify-center flex-shrink-0">
                  {checkStatus === "idle" && <span className="size-4 rounded-full border-2 border-[#d1d5db] dark:border-[#374151]" />}
                  {checkStatus === "running" && result === undefined && <Loader2 className="size-4 text-[#9ca3af] animate-spin" />}
                  {result === true && <CheckCircle2 className="size-4 text-[#10b981]" />}
                  {result === false && <X className="size-4 text-[#ef4444]" />}
                  {checkStatus === "passed" && result === undefined && <CheckCircle2 className="size-4 text-[#10b981]" />}
                </span>
                <span className={result === false ? "text-[#ef4444]" : "text-[#374151] dark:text-[#cbd5e1]"}>{c.label}</span>
              </div>
            );
          })}
        </div>
        {checkStatus === "passed" && !allPassed && (
          <p className="mt-3 text-xs text-[#ef4444]">Some checks failed. Resolve hardware issues before activating.</p>
        )}
      </div>
    </div>
  );
}

// ── Sidebar summary per step ───────────────────────────────────────────────

function SidebarSummary({
  step, state, checkStatus, checkResults,
}: {
  step: number;
  state: WizardState;
  checkStatus: CheckStatus;
  checkResults: Record<string, boolean>;
}) {
  const cameraCount = Object.keys(state.cameras).length;
  const allPassed = Object.keys(checkResults).length > 0 && Object.values(checkResults).every(Boolean);

  if (step === 5) {
    return (
      <>
        <h2 className="font-semibold text-[#111827] dark:text-[#e8eef5] text-lg mb-6">Ready to Activate</h2>
        <div className="flex flex-col items-center mb-6">
          <div className="size-16 rounded-full bg-[#d1fae5] flex items-center justify-center mb-4">
            <Check className="size-8 text-[#10b981]" />
          </div>
          <p className="text-sm text-center text-[#6b7280] dark:text-[#94a3b8]">
            Run the pre-flight check then click Activate Vehicle.
          </p>
        </div>
        <div className="space-y-3">
          {[
            { label: "Vehicle identity complete", ok: !!state.vehicleName },
            { label: "Controller configured", ok: !!state.controllerSerial },
            { label: `${cameraCount} camera${cameraCount !== 1 ? "s" : ""} configured`, ok: cameraCount >= 1 },
            { label: "Operational config set", ok: true },
            { label: "Pre-flight check passed", ok: checkStatus === "passed" && allPassed },
          ].map(({ label, ok }) => (
            <div key={label} className="flex items-center gap-2 text-sm">
              {ok ? (
                <Check className="size-4 text-[#10b981] flex-shrink-0" />
              ) : (
                <span className="size-4 rounded-full border-2 border-[#d1d5db] dark:border-[#374151] flex-shrink-0" />
              )}
              <span className="text-[#111827] dark:text-[#e8eef5]">{label}</span>
            </div>
          ))}
        </div>
      </>
    );
  }

  const summaryRows: Array<{ label: string; value: string }> = [];
  if (step === 1) {
    summaryRows.push(
      { label: "Vehicle Name", value: state.vehicleName },
      { label: "Fleet ID", value: state.fleetId },
      { label: "License Plate", value: state.licensePlate },
      { label: "Home Site", value: state.homeSite },
      { label: "Status", value: state.vehicleStatus },
    );
  } else if (step === 2) {
    summaryRows.push(
      { label: "Controller Model", value: state.controllerModel },
      { label: "Serial Number", value: state.controllerSerial },
      { label: "Hostname", value: state.hostname },
      { label: "WAN Carrier", value: state.wanCarrier },
      { label: "mTLS Token", value: state.enrollmentTokenGenerated ? "Generated ✓" : "" },
    );
  } else if (step === 3) {
    return (
      <>
        <h2 className="font-semibold text-[#111827] dark:text-[#e8eef5] text-lg mb-6">Summary</h2>
        <div className="space-y-3 mb-4">
          {MOUNT_POSITIONS.map((pos) => (
            <div key={pos} className="flex items-center justify-between">
              <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">{pos} Mount</span>
              <div className="flex items-center gap-2">
                {state.cameras[pos] ? (
                  <><Check className="size-4 text-[#10b981]" /><span className="text-sm text-[#111827] dark:text-[#e8eef5] font-medium">Added</span></>
                ) : (
                  <span className="text-sm text-[#9ca3af]">Empty</span>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Total Cameras</span>
            <span className="text-sm text-[#111827] dark:text-[#e8eef5] font-medium">{cameraCount} of 4</span>
          </div>
        </div>
      </>
    );
  } else if (step === 4) {
    summaryRows.push(
      { label: "Upload Mode", value: state.eventUploadMode },
      { label: "Geo Floor", value: state.geoConfidenceFloor },
      { label: "Buffer", value: state.localBufferRetention ? `${state.localBufferRetention} events` : "" },
      { label: "Patrol Zones", value: state.patrolZones.length ? `${state.patrolZones.length} selected` : "" },
    );
  }

  const totalRequired = step === 1 ? 4 : step === 2 ? 5 : 0;
  const filledRequired = step === 1
    ? [state.vehicleName, state.fleetId, state.licensePlate, state.homeSite].filter(Boolean).length
    : step === 2
    ? [state.controllerSerial, state.controllerMac, state.hostname, state.wanCarrier, state.ntripUrl].filter(Boolean).length
    : 0;
  const pct = totalRequired > 0 ? Math.round((filledRequired / totalRequired) * 100) : null;

  return (
    <>
      <h2 className="font-semibold text-[#111827] dark:text-[#e8eef5] text-lg mb-6">Summary</h2>
      <div className="space-y-4 mb-6">
        {summaryRows.map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between">
            <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">{label}</span>
            <div className="flex items-center gap-2">
              {value && <Check className="size-4 text-[#10b981]" />}
              <span className={`text-sm truncate max-w-[130px] ${value ? "text-[#111827] dark:text-[#e8eef5] font-medium" : "text-[#9ca3af]"}`}>
                {value || "—"}
              </span>
            </div>
          </div>
        ))}
      </div>
      {pct !== null && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#111827] dark:text-[#e8eef5]">Form Completion</span>
            <span className="text-sm text-[#3b82f6] font-medium">{pct}%</span>
          </div>
          <div className="w-full bg-[#e5e7eb] dark:bg-[#1a2d47] rounded-full h-2">
            <div
              className="bg-[#3b82f6] h-2 rounded-full transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}
    </>
  );
}

// ── Wizard shell ───────────────────────────────────────────────────────────

const STEPS = [
  { number: 1, label: "Vehicle Identity" },
  { number: 2, label: "Controller" },
  { number: 3, label: "Cameras" },
  { number: 4, label: "Operational Config" },
  { number: 5, label: "Review & Activate" },
];

export default function AddEnforcementVehicle() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [state, setState] = useState<WizardState>(initialState);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [checkStatus, setCheckStatus] = useState<CheckStatus>("idle");
  const [checkResults, setCheckResults] = useState<Record<string, boolean>>({});

  const set = (patch: Partial<WizardState>) => setState((s) => ({ ...s, ...patch }));

  const canProceed = () => {
    if (step === 1) return !!(state.vehicleName && state.fleetId && state.licensePlate && state.homeSite);
    if (step === 2) return !!(state.controllerSerial && state.controllerMac && state.hostname && state.wanCarrier && state.simIccid && state.ntripUrl && state.ntripMountpoint);
    if (step === 3) return Object.keys(state.cameras).length >= 1;
    return true;
  };

  const allPassed = Object.keys(checkResults).length > 0 && Object.values(checkResults).every(Boolean);

  const handleNext = () => {
    if (canProceed()) {
      setCompletedSteps((prev) => [...prev.filter((s) => s !== step), step]);
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleStepClick = (n: number) => {
    if (completedSteps.includes(n) || n < step) setStep(n);
  };

  const runPreflight = () => {
    setCheckStatus("running");
    setCheckResults({});
    PREFLIGHT_CHECKS.forEach((c, i) => {
      setTimeout(() => {
        setCheckResults((prev) => ({ ...prev, [c.key]: Math.random() > 0.15 }));
        if (i === PREFLIGHT_CHECKS.length - 1) {
          setTimeout(() => setCheckStatus("passed"), 300);
        }
      }, (i + 1) * 500);
    });
  };

  const stepLabel = (s: number) => {
    if (s === 1) return "Next: Controller";
    if (s === 2) return "Next: Cameras";
    if (s === 3) return "Next: Operational Config";
    if (s === 4) return "Next: Review & Activate";
    return "Next";
  };

  return (
    <>
      <div className="flex-1 overflow-auto bg-[#eff6ff] dark:bg-[#0a1628] pb-24">
        {/* Breadcrumb */}
        <div className="px-8 pt-6">
          <div className="flex items-center gap-2 text-[14px] text-[#6b7280] dark:text-[#94a3b8]">
            <Link to="/" className="hover:text-[#3b82f6]">Home</Link>
            <span>›</span>
            <Link to="/operations/enforcement-vehicles" className="hover:text-[#3b82f6]">Enforcement Vehicles</Link>
            <span>›</span>
            <span className="text-[#111827] dark:text-[#e8eef5]">Add Vehicle</span>
          </div>
        </div>

        {/* Page Title */}
        <div className="px-8 pt-4 pb-4">
          <h1 className="font-semibold text-[24px] leading-[32px] text-[#111827] dark:text-[#e8eef5]">
            Add Enforcement Vehicle
          </h1>
        </div>

        {/* Stepper card */}
        <div className="px-8 mb-6">
          <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6">
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              {STEPS.map((s, i) => (
                <div key={s.number} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => handleStepClick(s.number)}
                      disabled={!completedSteps.includes(s.number) && step !== s.number}
                      className={`size-10 rounded-full flex items-center justify-center font-semibold text-sm mb-2 transition-colors ${
                        step === s.number
                          ? "bg-[#2563eb] text-white"
                          : completedSteps.includes(s.number)
                          ? "bg-[#2563eb] text-white cursor-pointer hover:bg-[#1d4ed8]"
                          : "border-2 border-[#d1d5db] dark:border-[rgba(59,130,246,0.2)] text-[#9ca3af] cursor-not-allowed"
                      }`}
                    >
                      {completedSteps.includes(s.number) && step !== s.number ? <Check className="size-5" /> : s.number}
                    </button>
                    <span className={`text-xs font-medium text-center whitespace-nowrap ${
                      step === s.number || completedSteps.includes(s.number)
                        ? "text-[#111827] dark:text-[#e8eef5]"
                        : "text-[#9ca3af]"
                    }`}>
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="flex-1 h-0.5 -mt-5 mx-3">
                      <div className={`h-full ${
                        completedSteps.includes(s.number)
                          ? "bg-[#2563eb]"
                          : "border-t-2 border-dashed border-[#d1d5db] dark:border-[rgba(59,130,246,0.2)]"
                      }`} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-8">
          <div className="grid grid-cols-5 gap-6">
            {/* Left — form */}
            <div className="col-span-3">
              <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6">
                <h2 className="font-semibold text-[#111827] dark:text-[#e8eef5] text-lg mb-6">
                  {STEPS[step - 1].label}
                </h2>
                {step === 1 && <StepVehicleIdentity state={state} set={set} />}
                {step === 2 && <StepController state={state} set={set} />}
                {step === 3 && <StepCameras state={state} set={set} />}
                {step === 4 && <StepOperational state={state} set={set} />}
                {step === 5 && (
                  <StepPreflight
                    checkStatus={checkStatus}
                    checkResults={checkResults}
                    onRunPreflight={runPreflight}
                  />
                )}
              </div>
            </div>

            {/* Right — summary sidebar */}
            <div className="col-span-2">
              <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6 sticky top-6">
                <SidebarSummary
                  step={step}
                  state={state}
                  checkStatus={checkStatus}
                  checkResults={checkResults}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#0f1f35] border-t border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] px-8 py-4 z-10">
        <div className="flex items-center justify-between">
          <button
            onClick={step === 1 ? () => setShowCancelDialog(true) : handleBack}
            className="border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.2)] text-[#111827] dark:text-[#e8eef5] font-medium rounded-lg px-6 py-2 hover:bg-[#eff6ff] dark:hover:bg-[rgba(30,58,95,0.3)] transition-colors flex items-center gap-2"
          >
            {step === 1 ? "Cancel" : (
              <><ChevronLeft className="size-4" />Back</>
            )}
          </button>

          <div className="flex items-center gap-3">
            {step === 5 ? (
              <>
                <button
                  onClick={() => navigate("/operations/enforcement-vehicles")}
                  className="border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.2)] text-[#6b7280] dark:text-[#94a3b8] font-medium rounded-lg px-6 py-2 hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.3)] transition-colors text-sm"
                >
                  Save as Draft
                </button>
                <button
                  onClick={() => navigate("/operations/enforcement-vehicles")}
                  disabled={checkStatus !== "passed" || !allPassed}
                  className="bg-[#10b981] hover:bg-[#059669] disabled:bg-[#e5e7eb] disabled:text-[#9ca3af] disabled:cursor-not-allowed text-white font-medium rounded-lg px-6 py-2 transition-colors flex items-center gap-2 text-sm"
                >
                  <Check className="size-4" />
                  Activate Vehicle
                </button>
              </>
            ) : (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="bg-[#3b82f6] text-white font-medium rounded-lg px-6 py-2 hover:bg-[#2563eb] transition-colors disabled:bg-[#e5e7eb] disabled:text-[#9ca3af] disabled:cursor-not-allowed flex items-center gap-2"
              >
                {stepLabel(step)}
                <ChevronRight className="size-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cancel confirmation dialog */}
      {showCancelDialog && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setShowCancelDialog(false)}
          />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-[#0f1f35] border border-transparent dark:border-[rgba(59,130,246,0.15)] rounded-lg w-full max-w-md z-50 p-6">
            <h3 className="font-semibold text-[#111827] dark:text-[#e8eef5] text-lg mb-2">
              Cancel Vehicle Setup?
            </h3>
            <p className="text-sm text-[#6b7280] dark:text-[#94a3b8] mb-6">
              Are you sure you want to cancel? All unsaved changes will be lost.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowCancelDialog(false)}
                className="border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.2)] text-[#111827] dark:text-[#e8eef5] font-medium rounded-lg px-4 py-2 hover:bg-[#eff6ff] dark:hover:bg-[rgba(30,58,95,0.3)] transition-colors"
              >
                Keep Editing
              </button>
              <button
                onClick={() => navigate("/operations/enforcement-vehicles")}
                className="bg-[#ef4444] text-white font-medium rounded-lg px-4 py-2 hover:bg-[#dc2626] transition-colors"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

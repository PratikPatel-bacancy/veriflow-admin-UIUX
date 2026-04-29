import { useParams, useNavigate, Link } from "react-router";
import {
  Camera,
  Cpu,
  Wifi,
  WifiOff,
  AlertCircle,
  XCircle,
  Pencil,
  Car,
  Clock,
  Zap,
  Thermometer,
} from "lucide-react";
import { MOCK_DEVICES, CURRENT_FW, type Device, type DeviceStatus } from "../../data/mockDevices";

// ── Status config ──────────────────────────────────────────────────────────

const statusConfig: Record<
  DeviceStatus,
  { label: string; className: string; icon: React.ReactNode }
> = {
  Online:      { label: "Online",      className: "bg-[#d1fae5] text-[#065f46] dark:bg-[#064e3b] dark:text-[#6ee7b7]",  icon: <Wifi        className="size-3" /> },
  Offline:     { label: "Offline",     className: "bg-[#fee2e2] text-[#991b1b] dark:bg-[#450a0a] dark:text-[#fca5a5]",  icon: <WifiOff     className="size-3" /> },
  Unreachable: { label: "Unreachable", className: "bg-[#fef3c7] text-[#92400e] dark:bg-[#451a03] dark:text-[#fcd34d]",  icon: <AlertCircle className="size-3" /> },
  Disabled:    { label: "Disabled",    className: "bg-[#f3f4f6] text-[#4b5563] dark:bg-[#1f2937] dark:text-[#9ca3af]",  icon: <XCircle     className="size-3" /> },
};

// ── Camera config derived from mount position ──────────────────────────────

function getCameraConfig(device: Device) {
  const pos = device.mountPosition ?? "Front";
  const profiles:   Record<string, string> = { Front: "High Speed Highway", Rear: "High Speed Highway", Left: "Urban Patrol", Right: "Urban Patrol" };
  const directions: Record<string, string> = { Front: "Approaching",        Rear: "Receding",           Left: "Left Side",    Right: "Right Side"   };
  const poePorts:   Record<string, number> = { Front: 1,                    Rear: 2,                    Left: 3,              Right: 4              };
  return {
    anprProfile:      profiles[pos]   ?? "Standard",
    captureDirection: directions[pos] ?? "Approaching",
    irMode:           "Auto",
    confidenceFloor:  pos === "Left" || pos === "Right" ? 80 : 85,
    charSizeFloor:    12,
    poePort:          poePorts[pos]   ?? 1,
    mmrEnabled:       pos === "Front" || pos === "Rear",
  };
}

// ── Mock LPR events ────────────────────────────────────────────────────────

const MOCK_EVENTS = [
  { id: 1, ts: "2026-04-29 14:23:11", plate: "7ABC 123", conf: 97, state: "CA", match: "Permit"    },
  { id: 2, ts: "2026-04-29 14:19:44", plate: "8XYZ 456", conf: 94, state: "CA", match: "No Match"  },
  { id: 3, ts: "2026-04-29 14:15:02", plate: "6DEF 789", conf: 91, state: "BC", match: "Violation" },
  { id: 4, ts: "2026-04-29 14:10:30", plate: "4GHI 012", conf: 98, state: "CA", match: "No Match"  },
  { id: 5, ts: "2026-04-29 14:07:55", plate: "2JKL 345", conf: 87, state: "CA", match: "No Match"  },
  { id: 6, ts: "2026-04-29 13:58:22", plate: "9MNO 678", conf: 96, state: "WA", match: "Violation" },
  { id: 7, ts: "2026-04-29 13:52:11", plate: "3PQR 901", conf: 93, state: "CA", match: "Permit"    },
  { id: 8, ts: "2026-04-29 13:47:39", plate: "5STU 234", conf: 89, state: "CA", match: "No Match"  },
];

// ── Shared info row ────────────────────────────────────────────────────────

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between items-start gap-4">
      <dt className="text-[13px] text-[#6b7280] dark:text-[#94a3b8] shrink-0">{label}</dt>
      <dd className="text-[13px] font-medium text-[#111827] dark:text-[#e8eef5] text-right">{children}</dd>
    </div>
  );
}

// ── Camera detail ──────────────────────────────────────────────────────────

function CameraDetail({ device }: { device: Device }) {
  const navigate = useNavigate();
  const sc        = statusConfig[device.status];
  const isCurrent = device.firmware === CURRENT_FW[device.type];
  const cfg       = getCameraConfig(device);

  return (
    <div className="flex-1 overflow-auto bg-[#eff6ff] dark:bg-[#0a1628] pb-6">
      {/* Header */}
      <div className="px-8 pt-8 pb-6">
        <nav className="flex items-center gap-2 text-[13px] text-[#6b7280] dark:text-[#94a3b8] mb-4">
          <button
            onClick={() => navigate("/operations/devices")}
            className="hover:text-[#3b82f6] transition-colors"
          >
            Devices
          </button>
          <span>/</span>
          <Link
            to={`/operations/enforcement-vehicles/${device.vehicleId}`}
            className="hover:text-[#3b82f6] transition-colors"
          >
            {device.vehicleName}
          </Link>
          <span>/</span>
          <span className="text-[#111827] dark:text-[#e8eef5]">{device.name}</span>
        </nav>

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-xl bg-[#eff6ff] dark:bg-[rgba(59,130,246,0.1)] flex items-center justify-center border border-[#bfdbfe] dark:border-[rgba(59,130,246,0.2)] flex-shrink-0">
              <Camera className="size-6 text-[#3b82f6]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-[24px] font-semibold text-[#111827] dark:text-[#e8eef5] leading-tight">
                  {device.name}
                </h1>
                {device.mountPosition && (
                  <span className="text-[12px] font-medium px-2.5 py-0.5 rounded-full bg-[#eff6ff] text-[#3b82f6] dark:bg-[rgba(59,130,246,0.1)] dark:text-[#93c5fd]">
                    {device.mountPosition} Cam
                  </span>
                )}
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-medium ${sc.className}`}>
                  {sc.icon} {sc.label}
                </span>
                <span className={`text-[12px] font-medium px-2 py-0.5 rounded ${
                  isCurrent
                    ? "bg-[#d1fae5] text-[#065f46] dark:bg-[#064e3b] dark:text-[#6ee7b7]"
                    : "bg-[#fef3c7] text-[#92400e] dark:bg-[#451a03] dark:text-[#fcd34d]"
                }`}>
                  {device.firmware}{!isCurrent && " · Update Available"}
                </span>
              </div>
              <p className="text-[14px] text-[#6b7280] dark:text-[#94a3b8] mt-1">
                {device.vehicleName} · {device.site}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate(`/operations/enforcement-vehicles/${device.vehicleId}`)}
            className="flex items-center gap-2 px-4 py-2 text-[14px] font-medium text-[#374151] dark:text-[#e8eef5] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.2)] rounded-lg hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)] transition-colors flex-shrink-0"
          >
            <Pencil className="size-4" />
            Edit Config
          </button>
        </div>
      </div>

      {/* 3-column info cards */}
      <div className="px-8 mb-5">
        <div className="grid grid-cols-3 gap-4">
          {/* Identity */}
          <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-5 shadow-sm">
            <h3 className="text-[11px] font-semibold text-[#6b7280] dark:text-[#94a3b8] uppercase tracking-wider mb-4">
              Identity
            </h3>
            <dl className="space-y-3">
              <InfoRow label="Model">Lynet M504</InfoRow>
              <InfoRow label="Serial Number">
                <span className="font-mono">{device.serial}</span>
              </InfoRow>
              <InfoRow label="MAC Address">
                <span className="font-mono text-[12px]">{device.mac}</span>
              </InfoRow>
              <InfoRow label="Last Seen">{device.lastSeen}</InfoRow>
            </dl>
          </div>

          {/* Installation */}
          <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-5 shadow-sm">
            <h3 className="text-[11px] font-semibold text-[#6b7280] dark:text-[#94a3b8] uppercase tracking-wider mb-4">
              Installation
            </h3>
            <dl className="space-y-3">
              <InfoRow label="Vehicle">
                <Link
                  to={`/operations/enforcement-vehicles/${device.vehicleId}`}
                  className="text-[#3b82f6] hover:underline"
                >
                  {device.vehicleName}
                </Link>
              </InfoRow>
              <InfoRow label="Site">{device.site}</InfoRow>
              <InfoRow label="Mount Position">{device.mountPosition ?? "—"}</InfoRow>
              <InfoRow label="PoE Port">Port {cfg.poePort}</InfoRow>
            </dl>
          </div>

          {/* Configuration */}
          <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-5 shadow-sm">
            <h3 className="text-[11px] font-semibold text-[#6b7280] dark:text-[#94a3b8] uppercase tracking-wider mb-4">
              Configuration
            </h3>
            <dl className="space-y-3">
              <InfoRow label="ANPR Profile">{cfg.anprProfile}</InfoRow>
              <InfoRow label="Capture Direction">{cfg.captureDirection}</InfoRow>
              <InfoRow label="IR Mode">{cfg.irMode}</InfoRow>
              <InfoRow label="Confidence Floor">{cfg.confidenceFloor}%</InfoRow>
              <InfoRow label="Char Size Floor">{cfg.charSizeFloor}px</InfoRow>
              <InfoRow label="MMR">{cfg.mmrEnabled ? "Enabled" : "Disabled"}</InfoRow>
            </dl>
          </div>
        </div>
      </div>

      {/* Diagnostics strip */}
      <div className="px-8 mb-5">
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: "Last Heartbeat",
              value: device.lastSeen,
              icon: <Clock className="size-4 text-[#3b82f6]" />,
              iconBg: "bg-[#eff6ff] dark:bg-[rgba(59,130,246,0.1)]",
            },
            {
              label: "Uptime",
              value: device.status === "Online" ? "14d 6h 32m" : "—",
              icon: <Zap className="size-4 text-[#10b981]" />,
              iconBg: "bg-[#f0fdf4] dark:bg-[rgba(16,185,129,0.1)]",
            },
            {
              label: "Temperature",
              value: device.status === "Online" ? "42°C" : "—",
              icon: <Thermometer className="size-4 text-[#f59e0b]" />,
              iconBg: "bg-[#fffbeb] dark:bg-[rgba(245,158,11,0.1)]",
            },
          ].map((card) => (
            <div
              key={card.label}
              className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-4 shadow-sm flex items-center gap-3"
            >
              <div className={`size-9 rounded-lg flex items-center justify-center flex-shrink-0 ${card.iconBg}`}>
                {card.icon}
              </div>
              <div>
                <p className="text-[12px] text-[#6b7280] dark:text-[#94a3b8]">{card.label}</p>
                <p className="text-[15px] font-semibold text-[#111827] dark:text-[#e8eef5]">{card.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent LPR Events */}
      <div className="px-8">
        <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
            <h3 className="text-[15px] font-semibold text-[#111827] dark:text-[#e8eef5]">Recent LPR Events</h3>
            <p className="text-[13px] text-[#6b7280] dark:text-[#94a3b8] mt-0.5">
              Last 8 plate reads captured by this camera
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f9fafb] dark:bg-[#0a1628] border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
                  {["Timestamp", "Plate", "Confidence", "State / Region", "Match"].map((col) => (
                    <th
                      key={col}
                      className="text-left text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8] px-6 py-3 whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_EVENTS.map((ev) => (
                  <tr
                    key={ev.id}
                    className="border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] last:border-0 hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)]"
                  >
                    <td className="px-6 py-3 text-[13px] text-[#6b7280] dark:text-[#94a3b8] font-mono whitespace-nowrap">
                      {ev.ts}
                    </td>
                    <td className="px-6 py-3 text-[14px] font-semibold text-[#111827] dark:text-[#e8eef5] font-mono tracking-widest">
                      {ev.plate}
                    </td>
                    <td className="px-6 py-3">
                      <span className={`text-[12px] font-medium px-2 py-0.5 rounded ${
                        ev.conf >= 90
                          ? "bg-[#d1fae5] text-[#065f46] dark:bg-[#064e3b] dark:text-[#6ee7b7]"
                          : "bg-[#fef3c7] text-[#92400e] dark:bg-[#451a03] dark:text-[#fcd34d]"
                      }`}>
                        {ev.conf}%
                      </span>
                    </td>
                    <td className="px-6 py-3 text-[13px] text-[#6b7280] dark:text-[#94a3b8]">
                      {ev.state}
                    </td>
                    <td className="px-6 py-3">
                      <span className={`text-[12px] font-medium px-2.5 py-0.5 rounded-full ${
                        ev.match === "Permit"    ? "bg-[#d1fae5] text-[#065f46] dark:bg-[#064e3b] dark:text-[#6ee7b7]" :
                        ev.match === "Violation" ? "bg-[#fee2e2] text-[#991b1b] dark:bg-[#450a0a] dark:text-[#fca5a5]" :
                                                   "bg-[#f3f4f6] text-[#4b5563] dark:bg-[#1f2937] dark:text-[#9ca3af]"
                      }`}>
                        {ev.match}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Controller detail ──────────────────────────────────────────────────────

function ControllerDetail({ device }: { device: Device }) {
  const navigate  = useNavigate();
  const sc        = statusConfig[device.status];
  const isCurrent = device.firmware === CURRENT_FW[device.type];

  return (
    <div className="flex-1 overflow-auto bg-[#eff6ff] dark:bg-[#0a1628] pb-6">
      {/* Header */}
      <div className="px-8 pt-8 pb-6">
        <nav className="flex items-center gap-2 text-[13px] text-[#6b7280] dark:text-[#94a3b8] mb-4">
          <button
            onClick={() => navigate("/operations/devices")}
            className="hover:text-[#3b82f6] transition-colors"
          >
            Devices
          </button>
          <span>/</span>
          <Link
            to={`/operations/enforcement-vehicles/${device.vehicleId}`}
            className="hover:text-[#3b82f6] transition-colors"
          >
            {device.vehicleName}
          </Link>
          <span>/</span>
          <span className="text-[#111827] dark:text-[#e8eef5]">{device.name}</span>
        </nav>

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-xl bg-[#f3f4f6] dark:bg-[rgba(99,102,241,0.1)] flex items-center justify-center border border-[#e5e7eb] dark:border-[rgba(99,102,241,0.2)] flex-shrink-0">
              <Cpu className="size-6 text-[#6366f1]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-[24px] font-semibold text-[#111827] dark:text-[#e8eef5] leading-tight">
                  {device.name}
                </h1>
                <span className="text-[12px] font-medium px-2.5 py-0.5 rounded-full bg-[#f3f4f6] text-[#374151] dark:bg-[#1f2937] dark:text-[#9ca3af]">
                  Controller
                </span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-medium ${sc.className}`}>
                  {sc.icon} {sc.label}
                </span>
                <span className={`text-[12px] font-medium px-2 py-0.5 rounded ${
                  isCurrent
                    ? "bg-[#d1fae5] text-[#065f46] dark:bg-[#064e3b] dark:text-[#6ee7b7]"
                    : "bg-[#fef3c7] text-[#92400e] dark:bg-[#451a03] dark:text-[#fcd34d]"
                }`}>
                  {device.firmware}{!isCurrent && " · Update Available"}
                </span>
              </div>
              <p className="text-[14px] text-[#6b7280] dark:text-[#94a3b8] mt-1">
                {device.vehicleName} · {device.site}
              </p>
            </div>
          </div>
          <Link
            to={`/operations/enforcement-vehicles/${device.vehicleId}`}
            className="flex items-center gap-2 px-4 py-2 text-[14px] font-medium text-[#374151] dark:text-[#e8eef5] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.2)] rounded-lg hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)] transition-colors flex-shrink-0"
          >
            <Car className="size-4" />
            View Vehicle
          </Link>
        </div>
      </div>

      {/* Info cards */}
      <div className="px-8">
        <div className="grid grid-cols-2 gap-4">
          {/* Identity */}
          <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-5 shadow-sm">
            <h3 className="text-[11px] font-semibold text-[#6b7280] dark:text-[#94a3b8] uppercase tracking-wider mb-4">
              Identity
            </h3>
            <dl className="space-y-3">
              <InfoRow label="Model">{device.name}</InfoRow>
              <InfoRow label="Serial Number">
                <span className="font-mono">{device.serial}</span>
              </InfoRow>
              <InfoRow label="MAC Address">
                <span className="font-mono text-[12px]">{device.mac}</span>
              </InfoRow>
              <InfoRow label="Firmware">{device.firmware}</InfoRow>
              <InfoRow label="Last Seen">{device.lastSeen}</InfoRow>
            </dl>
          </div>

          {/* Installation */}
          <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-5 shadow-sm">
            <h3 className="text-[11px] font-semibold text-[#6b7280] dark:text-[#94a3b8] uppercase tracking-wider mb-4">
              Installation
            </h3>
            <dl className="space-y-3">
              <InfoRow label="Vehicle">
                <Link
                  to={`/operations/enforcement-vehicles/${device.vehicleId}`}
                  className="text-[#3b82f6] hover:underline"
                >
                  {device.vehicleName}
                </Link>
              </InfoRow>
              <InfoRow label="Site">{device.site}</InfoRow>
              <InfoRow label="Installed Position">Cabin Mount</InfoRow>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Root export ────────────────────────────────────────────────────────────

export default function DeviceDetail() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const device = MOCK_DEVICES.find((d) => d.id === Number(id));

  if (!device) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#eff6ff] dark:bg-[#0a1628]">
        <div className="text-center">
          <p className="text-[18px] font-medium text-[#111827] dark:text-[#e8eef5]">Device not found</p>
          <button
            onClick={() => navigate("/operations/devices")}
            className="mt-3 text-[14px] text-[#3b82f6] hover:underline"
          >
            ← Back to Devices
          </button>
        </div>
      </div>
    );
  }

  if (device.type === "Controller") {
    return <ControllerDetail device={device} />;
  }

  return <CameraDetail device={device} />;
}

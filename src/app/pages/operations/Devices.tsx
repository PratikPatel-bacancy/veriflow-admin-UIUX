import { useState } from "react";
import { useNavigate, Link } from "react-router";
import {
  Camera,
  Cpu,
  Wifi,
  WifiOff,
  AlertCircle,
  Search,
  Eye,
  Tablet,
  XCircle,
  Info,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import {
  MOCK_DEVICES,
  CURRENT_FW,
  type DeviceType,
  type DeviceStatus,
} from "../../data/mockDevices";

// ── Status config ──────────────────────────────────────────────────────────

const statusConfig: Record<DeviceStatus, { className: string; icon: React.ReactNode }> = {
  Online:      { className: "bg-[#d1fae5] text-[#065f46] dark:bg-[#064e3b] dark:text-[#6ee7b7]",  icon: <Wifi        className="size-3" /> },
  Offline:     { className: "bg-[#fee2e2] text-[#991b1b] dark:bg-[#450a0a] dark:text-[#fca5a5]",  icon: <WifiOff     className="size-3" /> },
  Unreachable: { className: "bg-[#fef3c7] text-[#92400e] dark:bg-[#451a03] dark:text-[#fcd34d]",  icon: <AlertCircle className="size-3" /> },
  Disabled:    { className: "bg-[#f3f4f6] text-[#4b5563] dark:bg-[#1f2937] dark:text-[#9ca3af]",  icon: <XCircle     className="size-3" /> },
};

const VEHICLE_OPTIONS = ["All Vehicles", "Unit-047", "Unit-012", "Unit-033", "Unit-021", "Unit-009", "Unit-055", "Unit-003"];
const TYPE_OPTIONS:   ("All Types" | DeviceType)[]   = ["All Types", "LPR Camera", "Controller"];
const STATUS_OPTIONS: ("All" | DeviceStatus)[]       = ["All", "Online", "Offline", "Unreachable", "Disabled"];

// ── Page ───────────────────────────────────────────────────────────────────

export default function Devices() {
  const navigate = useNavigate();
  const [search,        setSearch]        = useState("");
  const [typeFilter,    setTypeFilter]    = useState<"All Types" | DeviceType>("All Types");
  const [vehicleFilter, setVehicleFilter] = useState("All Vehicles");
  const [statusFilter,  setStatusFilter]  = useState<"All" | DeviceStatus>("All");

  const filtered = MOCK_DEVICES.filter((d) => {
    if (search        && !d.name.toLowerCase().includes(search.toLowerCase()) && !d.serial.toLowerCase().includes(search.toLowerCase())) return false;
    if (typeFilter    !== "All Types"    && d.type        !== typeFilter)    return false;
    if (vehicleFilter !== "All Vehicles" && d.vehicleName !== vehicleFilter) return false;
    if (statusFilter  !== "All"          && d.status      !== statusFilter)  return false;
    return true;
  });

  const totalDevices = MOCK_DEVICES.length;
  const totalCameras = MOCK_DEVICES.filter((d) => d.type === "LPR Camera").length;
  const totalCtrl    = MOCK_DEVICES.filter((d) => d.type === "Controller").length;
  const offlineCount = MOCK_DEVICES.filter((d) => d.status === "Offline" || d.status === "Unreachable").length;

  function rowHref(d: typeof MOCK_DEVICES[0]) {
    return d.type === "LPR Camera"
      ? `/operations/devices/${d.id}`
      : `/operations/enforcement-vehicles/${d.vehicleId}`;
  }

  return (
    <div className="flex-1 overflow-auto bg-[#eff6ff] dark:bg-[#0a1628] pb-6">
      {/* Header */}
      <div className="px-8 pt-8 pb-6">
        <h1 className="font-semibold text-[24px] leading-[32px] text-[#111827] dark:text-[#e8eef5]">Devices</h1>
        <p className="text-[14px] text-[#6b7280] dark:text-[#94a3b8] mt-1">
          All LPR cameras and controllers installed across enforcement vehicles.
        </p>
      </div>

      {/* KPI cards */}
      <div className="px-8 mb-6">
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Total Devices",         value: totalDevices, icon: <Tablet   className="size-5 text-[#3b82f6]" />, info: "Total number of hardware devices (cameras and controllers) enrolled across all enforcement vehicles." },
            { label: "LPR Cameras",           value: totalCameras, icon: <Camera   className="size-5 text-[#6366f1]" />, info: "Total LPR camera units installed across all enforcement vehicles in the fleet." },
            { label: "Controllers",           value: totalCtrl,    icon: <Cpu      className="size-5 text-[#10b981]" />, info: "Gateway controllers managing LTE connectivity, GPS/RTK, and event publishing for each vehicle." },
            { label: "Offline / Unreachable", value: offlineCount, icon: <WifiOff  className="size-5 text-[#ef4444]" />, info: "Devices whose controller has not checked in recently (Offline) or cannot be reached at all (Unreachable)." },
          ].map((card) => (
            <div key={card.label} className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-5 shadow-sm">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[13px] text-[#6b7280] dark:text-[#94a3b8]">{card.label}</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="size-3.5 text-[#9ca3af] dark:text-[#6b7280] cursor-pointer hover:text-[#3b82f6] dark:hover:text-[#60a5fa] transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[220px] text-center">{card.info}</TooltipContent>
                </Tooltip>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[28px] font-semibold leading-[32px] text-[#111827] dark:text-[#e8eef5]">{card.value}</p>
                {card.icon}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="px-8 mb-4">
        <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-4 flex flex-wrap gap-3 items-center shadow-sm">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#9ca3af]" />
            <input
              type="text"
              placeholder="Search by name or serial…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-[14px] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.2)] rounded-lg bg-transparent text-[#111827] dark:text-[#e8eef5] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as "All Types" | DeviceType)}
            className="px-4 py-2 text-[14px] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg bg-white dark:bg-[#0f1f35] text-[#111827] dark:text-[#e8eef5] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
          >
            {TYPE_OPTIONS.map((o) => <option key={o}>{o}</option>)}
          </select>
          <select
            value={vehicleFilter}
            onChange={(e) => setVehicleFilter(e.target.value)}
            className="px-4 py-2 text-[14px] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg bg-white dark:bg-[#0f1f35] text-[#111827] dark:text-[#e8eef5] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
          >
            {VEHICLE_OPTIONS.map((o) => <option key={o}>{o}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "All" | DeviceStatus)}
            className="px-4 py-2 text-[14px] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg bg-white dark:bg-[#0f1f35] text-[#111827] dark:text-[#e8eef5] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
          >
            {STATUS_OPTIONS.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="px-8">
        <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f9fafb] dark:bg-[#0a1628] border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
                  {["Device", "Type", "Installed In", "Site", "Firmware", "Status", "Last Seen", "Actions"].map((col) => (
                    <th key={col} className="text-left text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8] px-6 py-3 whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-[14px] text-[#6b7280] dark:text-[#94a3b8]">
                      No devices match the current filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((d) => {
                    const sc        = statusConfig[d.status];
                    const isCurrent = d.firmware === CURRENT_FW[d.type];
                    const href      = rowHref(d);
                    return (
                      <tr
                        key={d.id}
                        onClick={() => navigate(href)}
                        className="border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)] cursor-pointer"
                      >
                        {/* Device */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="size-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#eff6ff] dark:bg-[rgba(59,130,246,0.1)]">
                              {d.type === "LPR Camera"
                                ? <Camera className="size-4 text-[#3b82f6]" />
                                : <Cpu    className="size-4 text-[#6366f1]" />
                              }
                            </div>
                            <div>
                              <p className="text-[14px] font-medium text-[#111827] dark:text-[#e8eef5] whitespace-nowrap">{d.name}</p>
                              <p className="text-[12px] text-[#9ca3af] font-mono">{d.serial}</p>
                            </div>
                          </div>
                        </td>

                        {/* Type */}
                        <td className="px-6 py-4">
                          {d.type === "LPR Camera" ? (
                            <span className="inline-flex items-center gap-1 text-[12px] font-medium px-2.5 py-0.5 rounded-full bg-[#eff6ff] text-[#3b82f6] dark:bg-[rgba(59,130,246,0.1)] dark:text-[#93c5fd] whitespace-nowrap">
                              <Camera className="size-3" />
                              {d.mountPosition ? `${d.mountPosition} Cam` : "LPR Camera"}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[12px] font-medium px-2.5 py-0.5 rounded-full bg-[#f3f4f6] text-[#374151] dark:bg-[#1f2937] dark:text-[#9ca3af]">
                              <Cpu className="size-3" />
                              Controller
                            </span>
                          )}
                        </td>

                        {/* Installed In */}
                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                          <Link
                            to={`/operations/enforcement-vehicles/${d.vehicleId}`}
                            className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#3b82f6] hover:text-[#2563eb] hover:underline transition-colors whitespace-nowrap"
                          >
                            {d.vehicleName}
                          </Link>
                        </td>

                        {/* Site */}
                        <td className="px-6 py-4 text-[14px] text-[#6b7280] dark:text-[#94a3b8] whitespace-nowrap max-w-[180px] truncate">
                          {d.site}
                        </td>

                        {/* Firmware */}
                        <td className="px-6 py-4">
                          <span className={`text-[12px] font-medium px-2 py-0.5 rounded ${
                            isCurrent
                              ? "bg-[#d1fae5] text-[#065f46] dark:bg-[#064e3b] dark:text-[#6ee7b7]"
                              : "bg-[#fef3c7] text-[#92400e] dark:bg-[#451a03] dark:text-[#fcd34d]"
                          }`}>
                            {d.firmware}{!isCurrent && " · Update"}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-medium ${sc.className}`}>
                            {sc.icon}
                            {d.status}
                          </span>
                        </td>

                        {/* Last Seen */}
                        <td className="px-6 py-4 text-[14px] text-[#6b7280] dark:text-[#94a3b8] whitespace-nowrap">
                          {d.lastSeen}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                          <Link
                            to={href}
                            title={d.type === "LPR Camera" ? "View camera" : "View vehicle"}
                            className="p-1.5 rounded hover:bg-[#e5e7eb] dark:hover:bg-[#4b5563] transition-colors inline-flex"
                          >
                            <Eye className="size-4 text-[#6b7280] dark:text-[#94a3b8]" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

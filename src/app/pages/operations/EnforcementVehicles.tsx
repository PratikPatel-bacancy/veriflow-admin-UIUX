import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Car,
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  Wifi,
  WifiOff,
  AlertCircle,
  Info,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../components/ui/tooltip";

type ControllerStatus = "Online" | "Offline" | "Unreachable";
type VehicleStatus = "Active" | "Maintenance" | "Draft" | "Decommissioned";

interface EnforcementVehicle {
  id: number;
  name: string;
  site: string;
  cameras: number;
  controllerStatus: ControllerStatus;
  lastSeen: string;
  status: VehicleStatus;
}

const mockVehicles: EnforcementVehicle[] = [
  {
    id: 1,
    name: "Unit-047",
    site: "Pacific Plaza Garage",
    cameras: 4,
    controllerStatus: "Online",
    lastSeen: "Just now",
    status: "Active",
  },
  {
    id: 2,
    name: "Unit-012",
    site: "CF Pacific Centre",
    cameras: 3,
    controllerStatus: "Online",
    lastSeen: "5 min ago",
    status: "Active",
  },
  {
    id: 3,
    name: "Unit-033",
    site: "Heritage Harbor Parking",
    cameras: 2,
    controllerStatus: "Offline",
    lastSeen: "2 hrs ago",
    status: "Maintenance",
  },
  {
    id: 4,
    name: "Unit-021",
    site: "Pacific Plaza Garage",
    cameras: 4,
    controllerStatus: "Unreachable",
    lastSeen: "1 day ago",
    status: "Maintenance",
  },
  {
    id: 5,
    name: "Unit-009",
    site: "875 Garnet Pacific Beach Parking",
    cameras: 1,
    controllerStatus: "Online",
    lastSeen: "12 min ago",
    status: "Active",
  },
  {
    id: 6,
    name: "Unit-055",
    site: "Pan Pacific Park Parking",
    cameras: 0,
    controllerStatus: "Offline",
    lastSeen: "Never",
    status: "Draft",
  },
  {
    id: 7,
    name: "Unit-003",
    site: "CF Pacific Centre",
    cameras: 3,
    controllerStatus: "Offline",
    lastSeen: "30 days ago",
    status: "Decommissioned",
  },
];

const controllerStatusConfig: Record<
  ControllerStatus,
  { label: string; icon: React.ReactNode; className: string }
> = {
  Online: {
    label: "Online",
    icon: <Wifi className="size-3" />,
    className: "bg-[#d1fae5] text-[#065f46] dark:bg-[#064e3b] dark:text-[#6ee7b7]",
  },
  Offline: {
    label: "Offline",
    icon: <WifiOff className="size-3" />,
    className: "bg-[#fee2e2] text-[#991b1b] dark:bg-[#450a0a] dark:text-[#fca5a5]",
  },
  Unreachable: {
    label: "Unreachable",
    icon: <AlertCircle className="size-3" />,
    className: "bg-[#fef3c7] text-[#92400e] dark:bg-[#451a03] dark:text-[#fcd34d]",
  },
};

const vehicleStatusConfig: Record<VehicleStatus, { className: string }> = {
  Active: {
    className: "bg-[#d1fae5] text-[#065f46] dark:bg-[#064e3b] dark:text-[#6ee7b7]",
  },
  Maintenance: {
    className: "bg-[#fef3c7] text-[#92400e] dark:bg-[#451a03] dark:text-[#fcd34d]",
  },
  Draft: {
    className: "bg-[#f3f4f6] text-[#4b5563] dark:bg-[#1f2937] dark:text-[#9ca3af]",
  },
  Decommissioned: {
    className: "bg-[#fee2e2] text-[#991b1b] dark:bg-[#450a0a] dark:text-[#fca5a5]",
  },
};

const sites = ["All Sites", "Pacific Plaza Garage", "CF Pacific Centre", "Heritage Harbor Parking", "875 Garnet Pacific Beach Parking", "Pan Pacific Park Parking"];
const statuses: ("All" | VehicleStatus)[] = ["All", "Active", "Maintenance", "Draft", "Decommissioned"];
const connectivityOptions: ("All" | ControllerStatus)[] = ["All", "Online", "Offline", "Unreachable"];
export default function EnforcementVehicles() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [siteFilter, setSiteFilter] = useState("All Sites");
  const [statusFilter, setStatusFilter] = useState<"All" | VehicleStatus>("All");
  const [connectivityFilter, setConnectivityFilter] = useState<"All" | ControllerStatus>("All");

  const filtered = mockVehicles.filter((v) => {
    if (search && !v.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (siteFilter !== "All Sites" && v.site !== siteFilter) return false;
    if (statusFilter !== "All" && v.status !== statusFilter) return false;
    if (connectivityFilter !== "All" && v.controllerStatus !== connectivityFilter) return false;
    return true;
  });

  const total = mockVehicles.length;
  const active = mockVehicles.filter((v) => v.status === "Active").length;
  const maintenance = mockVehicles.filter((v) => v.status === "Maintenance").length;
  const offline = mockVehicles.filter((v) => v.controllerStatus === "Offline" || v.controllerStatus === "Unreachable").length;

  return (
    <div className="flex-1 overflow-auto bg-[#eff6ff] dark:bg-[#0a1628] pb-6">
      {/* Header */}
      <div className="px-8 pt-8 pb-6 flex items-center justify-end">
        <button
          onClick={() => navigate("/operations/enforcement-vehicles/new")}
          className="flex items-center gap-2 px-4 py-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-[14px] font-medium rounded-lg transition-colors"
        >
          <Plus className="size-4" />
          Add Vehicle
        </button>
      </div>

      {/* Stat cards */}
      <div className="px-8 mb-6">
        <div className="grid grid-cols-4 gap-4">
          {[
            {
              label: "Total Vehicles", value: total,
              icon: <Car className="size-5 text-[#3b82f6]" />,
              info: "Total number of enforcement vehicles registered in the fleet, across all sites and statuses.",
            },
            {
              label: "Active", value: active,
              icon: <Wifi className="size-5 text-[#10b981]" />,
              info: "Vehicles currently enrolled, config-pushed, and eligible to capture and publish LPR events.",
            },
            {
              label: "In Maintenance", value: maintenance,
              icon: <AlertCircle className="size-5 text-[#f59e0b]" />,
              info: "Vehicles in maintenance mode. Events are suppressed at ingestion but the vehicle remains visible in the fleet.",
            },
            {
              label: "Offline / Unreachable", value: offline,
              icon: <WifiOff className="size-5 text-[#ef4444]" />,
              info: "Vehicles whose controller has not checked in recently (Offline) or cannot be reached at all (Unreachable).",
            },
          ].map((card) => (
            <div
              key={card.label}
              className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-5 shadow-sm"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[13px] text-[#6b7280] dark:text-[#94a3b8]">{card.label}</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="size-3.5 text-[#9ca3af] dark:text-[#6b7280] cursor-pointer hover:text-[#3b82f6] dark:hover:text-[#60a5fa] transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[220px] text-center">
                    {card.info}
                  </TooltipContent>
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
              placeholder="Search by name / call sign…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-[14px] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.2)] rounded-lg bg-transparent text-[#111827] dark:text-[#e8eef5] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
            />
          </div>
          {[
            { label: "Site", value: siteFilter, options: sites, onChange: setSiteFilter },
            { label: "Status", value: statusFilter, options: statuses, onChange: (v: string) => setStatusFilter(v as "All" | VehicleStatus) },
            { label: "Connectivity", value: connectivityFilter, options: connectivityOptions, onChange: (v: string) => setConnectivityFilter(v as "All" | ControllerStatus) },
          ].map((f) => (
            <select
              key={f.label}
              value={f.value}
              onChange={(e) => f.onChange(e.target.value)}
              className="px-4 py-2 text-[14px] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg bg-white dark:bg-[#0f1f35] text-[#111827] dark:text-[#e8eef5] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
            >
              {f.options.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="px-8">
        <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f9fafb] dark:bg-[#0a1628] border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
                  {["Name / Call Sign", "Site", "Cameras", "Controller Status", "Last Seen", "Status", "Actions"].map(
                    (col) => (
                      <th
                        key={col}
                        className="text-left text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8] px-6 py-3 whitespace-nowrap"
                      >
                        {col}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-[14px] text-[#6b7280] dark:text-[#94a3b8]">
                      No enforcement vehicles match the current filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((v) => {
                    const cs = controllerStatusConfig[v.controllerStatus];
                    const vs = vehicleStatusConfig[v.status];
                    return (
                      <tr
                        key={v.id}
                        onClick={() => navigate(`/operations/enforcement-vehicles/${v.id}`)}
                        className="border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)] cursor-pointer"
                      >
                        <td className="px-6 py-4 font-medium text-[14px] text-[#111827] dark:text-[#e8eef5] whitespace-nowrap">
                          {v.name}
                        </td>
                        <td className="px-6 py-4 text-[14px] text-[#6b7280] dark:text-[#94a3b8] whitespace-nowrap">
                          {v.site}
                        </td>
                        <td className="px-6 py-4 text-[14px] text-[#6b7280] dark:text-[#94a3b8]">
                          {v.cameras} / 4
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-medium ${cs.className}`}>
                            {cs.icon}
                            {cs.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[14px] text-[#6b7280] dark:text-[#94a3b8] whitespace-nowrap">
                          {v.lastSeen}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium ${vs.className}`}>
                            {v.status}
                          </span>
                        </td>
                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-2">
                            <button
                              title="View"
                              onClick={() => navigate(`/operations/enforcement-vehicles/${v.id}`)}
                              className="p-1.5 rounded hover:bg-[#e5e7eb] dark:hover:bg-[#4b5563] transition-colors"
                            >
                              <Eye className="size-4 text-[#6b7280] dark:text-[#94a3b8]" />
                            </button>
                            <button
                              title="Edit"
                              className="p-1.5 rounded hover:bg-[#e5e7eb] dark:hover:bg-[#4b5563] transition-colors"
                            >
                              <Pencil className="size-4 text-[#6b7280] dark:text-[#94a3b8]" />
                            </button>
                            <button
                              title="Decommission"
                              disabled={v.status === "Decommissioned"}
                              className="p-1.5 rounded hover:bg-[#fee2e2] dark:hover:bg-[#7f1d1d] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <Trash2 className="size-4 text-[#ef4444] dark:text-[#f87171]" />
                            </button>
                          </div>
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

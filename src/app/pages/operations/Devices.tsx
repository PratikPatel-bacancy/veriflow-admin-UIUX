import PageHeader from "../../components/common/PageHeader";
import { Tablet, WifiOff, CheckCircle } from "lucide-react";

const mockDevices = [
  {
    id: 1,
    name: "Camera #45",
    type: "Camera",
    location: "Main Street Garage - Zone A",
    status: "Online",
    lastSeen: "Just now",
  },
  {
    id: 2,
    name: "Sensor #12",
    type: "Occupancy Sensor",
    location: "City Center Lot - Zone B",
    status: "Online",
    lastSeen: "2 minutes ago",
  },
  {
    id: 3,
    name: "Gate #3",
    type: "Entry Gate",
    location: "Airport Parking - North",
    status: "Offline",
    lastSeen: "15 minutes ago",
  },
];

export default function Devices() {
  return (
    <div className="p-6">
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Total Devices</span>
            <Tablet className="size-5 text-[#3b82f6]" />
          </div>
          <p className="text-3xl font-semibold text-[#111827] dark:text-[#e8eef5]">156</p>
        </div>
        <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Online</span>
            <CheckCircle className="size-5 text-[#10b981]" />
          </div>
          <p className="text-3xl font-semibold text-[#111827] dark:text-[#e8eef5]">149</p>
        </div>
        <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Offline</span>
            <WifiOff className="size-5 text-[#ef4444]" />
          </div>
          <p className="text-3xl font-semibold text-[#111827] dark:text-[#e8eef5]">7</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#eff6ff] dark:bg-[#0a1628] border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
            <tr>
              <th className="text-left text-xs font-medium text-[#6b7280] dark:text-[#94a3b8] uppercase tracking-wider px-6 py-3">
                Device Name
              </th>
              <th className="text-left text-xs font-medium text-[#6b7280] dark:text-[#94a3b8] uppercase tracking-wider px-6 py-3">
                Type
              </th>
              <th className="text-left text-xs font-medium text-[#6b7280] dark:text-[#94a3b8] uppercase tracking-wider px-6 py-3">
                Location
              </th>
              <th className="text-left text-xs font-medium text-[#6b7280] dark:text-[#94a3b8] uppercase tracking-wider px-6 py-3">
                Status
              </th>
              <th className="text-left text-xs font-medium text-[#6b7280] dark:text-[#94a3b8] uppercase tracking-wider px-6 py-3">
                Last Seen
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e7eb] dark:divide-[rgba(59,130,246,0.15)]">
            {mockDevices.map((device) => (
              <tr key={device.id} className="hover:bg-[#eff6ff] dark:hover:bg-[rgba(30,58,95,0.3)]">
                <td className="px-6 py-4 font-medium text-[#111827] dark:text-[#e8eef5]">
                  {device.name}
                </td>
                <td className="px-6 py-4 text-sm text-[#6b7280] dark:text-[#94a3b8]">
                  {device.type}
                </td>
                <td className="px-6 py-4 text-sm text-[#6b7280] dark:text-[#94a3b8]">
                  {device.location}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      device.status === "Online"
                        ? "bg-[#d1fae5] text-[#065f46]"
                        : "bg-[#fee2e2] text-[#991b1b]"
                    }`}
                  >
                    {device.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-[#6b7280] dark:text-[#94a3b8]">
                  {device.lastSeen}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

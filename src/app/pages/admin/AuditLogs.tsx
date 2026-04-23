import PageHeader from "../../components/common/PageHeader";
import { Search, Filter } from "lucide-react";
import { useState } from "react";

const mockLogs = [
  {
    id: 1,
    action: "User Login",
    user: "Sarang A",
    timestamp: "2024-04-08 10:30:15",
    ipAddress: "192.168.1.100",
    status: "Success",
  },
  {
    id: 2,
    action: "Created Tenant",
    user: "John Manager",
    timestamp: "2024-04-08 09:45:22",
    ipAddress: "192.168.1.101",
    status: "Success",
  },
  {
    id: 3,
    action: "Updated Zone",
    user: "Jane Operator",
    timestamp: "2024-04-08 09:15:30",
    ipAddress: "192.168.1.102",
    status: "Success",
  },
  {
    id: 4,
    action: "Failed Login",
    user: "Unknown",
    timestamp: "2024-04-08 08:30:12",
    ipAddress: "192.168.1.200",
    status: "Failed",
  },
];

export default function AuditLogs() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="p-6">
      <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#6b7280] dark:text-[#94a3b8]" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#eff6ff] border border-[#e5e7eb] rounded-lg pl-10 pr-4 py-2 text-sm text-[#111827] dark:text-[#e8eef5] placeholder:text-[#6b7280] dark:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
            />
          </div>
          <button className="border border-[#e5e7eb] rounded-lg px-4 py-2 flex items-center gap-2 text-sm text-[#111827] dark:text-[#e8eef5] hover:bg-[#eff6ff] dark:hover:bg-[rgba(30,58,95,0.3)] transition-colors">
            <Filter className="size-4" />
            Filter
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#eff6ff] dark:bg-[#0a1628] border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
            <tr>
              <th className="text-left text-xs font-medium text-[#6b7280] dark:text-[#94a3b8] uppercase tracking-wider px-6 py-3">
                Action
              </th>
              <th className="text-left text-xs font-medium text-[#6b7280] dark:text-[#94a3b8] uppercase tracking-wider px-6 py-3">
                User
              </th>
              <th className="text-left text-xs font-medium text-[#6b7280] dark:text-[#94a3b8] uppercase tracking-wider px-6 py-3">
                Timestamp
              </th>
              <th className="text-left text-xs font-medium text-[#6b7280] dark:text-[#94a3b8] uppercase tracking-wider px-6 py-3">
                IP Address
              </th>
              <th className="text-left text-xs font-medium text-[#6b7280] dark:text-[#94a3b8] uppercase tracking-wider px-6 py-3">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e7eb] dark:divide-[rgba(59,130,246,0.15)]">
            {mockLogs.map((log) => (
              <tr key={log.id} className="hover:bg-[#eff6ff] dark:hover:bg-[rgba(30,58,95,0.3)]">
                <td className="px-6 py-4 font-medium text-[#111827] dark:text-[#e8eef5]">
                  {log.action}
                </td>
                <td className="px-6 py-4 text-sm text-[#6b7280] dark:text-[#94a3b8]">{log.user}</td>
                <td className="px-6 py-4 text-sm text-[#6b7280] dark:text-[#94a3b8]">
                  {log.timestamp}
                </td>
                <td className="px-6 py-4 text-sm text-[#6b7280] dark:text-[#94a3b8]">
                  {log.ipAddress}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      log.status === "Success"
                        ? "bg-[#d1fae5] text-[#065f46]"
                        : "bg-[#fee2e2] text-[#991b1b]"
                    }`}
                  >
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

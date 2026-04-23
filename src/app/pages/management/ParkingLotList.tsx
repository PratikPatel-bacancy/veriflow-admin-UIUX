import { Link } from "react-router";
import { Edit, Trash2 } from "lucide-react";

const mockParkingLots = [
  {
    id: "FAC-001",
    name: "Plaza Garage Level 1",
    site: "Pacific Plaza Garage",
    zones: 4,
    capacity: 28,
    occupied: 25,
    status: "Active",
  },
  {
    id: "FAC-002",
    name: "Plaza Garage Level 2",
    site: "Pacific Plaza Garage",
    zones: 3,
    capacity: 25,
    occupied: 20,
    status: "Active",
  },
  {
    id: "FAC-003",
    name: "Pacific Centre North Wing",
    site: "CF Pacific Centre",
    zones: 5,
    capacity: 30,
    occupied: 27,
    status: "Active",
  },
  {
    id: "FAC-004",
    name: "Pacific Centre South Wing",
    site: "CF Pacific Centre",
    zones: 4,
    capacity: 29,
    occupied: 23,
    status: "Active",
  },
  {
    id: "FAC-005",
    name: "Harbor Main Lot",
    site: "Heritage Harbor Parking",
    zones: 3,
    capacity: 22,
    occupied: 18,
    status: "Active",
  },
];

export default function ParkingLotList() {
  return (
    <div className="flex-1 overflow-auto bg-[#eff6ff] dark:bg-[#0a1628] pb-6">
      {/* KPI Cards */}
      <div className="px-6 pt-6 mb-6">
        <div className="grid grid-cols-2 gap-5">
          <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-5 shadow-sm">
            <p className="font-['Inter'] font-normal text-[13px] text-[#6b7280] dark:text-[#94a3b8] mb-1">
              Total Parking Lots
            </p>
            <p className="font-['Inter'] font-semibold text-[28px] leading-[32px] text-[#111827] dark:text-[#e8eef5]">
              {mockParkingLots.length}
            </p>
          </div>
          <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-5 shadow-sm">
            <p className="font-['Inter'] font-normal text-[13px] text-[#dc2626] dark:text-[#f87171] mb-1">
              Today's Active Violations
            </p>
            <p className="font-['Inter'] font-semibold text-[28px] leading-[32px] text-[#dc2626] dark:text-[#f87171]">
              12
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="px-6">
        <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] pb-[14px] pt-6 px-6">
          {/* Table Header */}
          <div className="mb-6">
            <h2 className="font-['Inter'] font-semibold text-[18px] leading-[28px] tracking-[-0.4395px] text-[#111827] dark:text-[#e8eef5]">
              All Parking Lots
            </h2>
          </div>

          {/* Table */}
          <div className="overflow-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e5e7eb]">
                  <th className="text-left py-3 px-4">
                    <p className="font-['Inter'] font-medium text-[14px] leading-[20px] text-[#6b7280] dark:text-[#94a3b8]">
                      Lot ID
                    </p>
                  </th>
                  <th className="text-left py-3 px-4">
                    <p className="font-['Inter'] font-medium text-[14px] leading-[20px] text-[#6b7280] dark:text-[#94a3b8]">
                      Name
                    </p>
                  </th>
                  <th className="text-left py-3 px-4">
                    <p className="font-['Inter'] font-medium text-[14px] leading-[20px] text-[#6b7280] dark:text-[#94a3b8]">
                      Site
                    </p>
                  </th>
                  <th className="text-left py-3 px-4">
                    <p className="font-['Inter'] font-medium text-[14px] leading-[20px] text-[#6b7280] dark:text-[#94a3b8]">
                      Zones
                    </p>
                  </th>
                  <th className="text-left py-3 px-4">
                    <p className="font-['Inter'] font-medium text-[14px] leading-[20px] text-[#6b7280] dark:text-[#94a3b8]">
                      Capacity
                    </p>
                  </th>
                  <th className="text-left py-3 px-4">
                    <p className="font-['Inter'] font-medium text-[14px] leading-[20px] text-[#6b7280] dark:text-[#94a3b8]">
                      Occupancy
                    </p>
                  </th>
                  <th className="text-left py-3 px-4">
                    <p className="font-['Inter'] font-medium text-[14px] leading-[20px] text-[#6b7280] dark:text-[#94a3b8]">
                      Status
                    </p>
                  </th>
                  <th className="text-right py-3 px-4">
                    <p className="font-['Inter'] font-medium text-[14px] leading-[20px] text-[#6b7280] dark:text-[#94a3b8]">
                      Actions
                    </p>
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockParkingLots.map((lot) => {
                  const occupancyPercent = Math.round((lot.occupied / lot.capacity) * 100);
                  return (
                    <tr key={lot.id} className="border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] last:border-0 hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)] transition-colors">
                      <td className="py-[10px] px-4">
                        <p className="font-['Inter'] font-medium text-[14px] leading-[20px] text-[#3b82f6]">
                          {lot.id}
                        </p>
                      </td>
                      <td className="py-[10px] px-4">
                        <p className="font-['Inter'] font-normal text-[14px] leading-[20px] text-[#111827] dark:text-[#e8eef5]">
                          {lot.name}
                        </p>
                      </td>
                      <td className="py-[10px] px-4">
                        <p className="font-['Inter'] font-normal text-[14px] leading-[20px] text-[#6b7280] dark:text-[#94a3b8]">
                          {lot.site}
                        </p>
                      </td>
                      <td className="py-[10px] px-4">
                        <p className="font-['Inter'] font-normal text-[14px] leading-[20px] text-[#111827] dark:text-[#e8eef5]">
                          {lot.zones}
                        </p>
                      </td>
                      <td className="py-[10px] px-4">
                        <p className="font-['Inter'] font-normal text-[14px] leading-[20px] text-[#111827] dark:text-[#e8eef5]">
                          {lot.capacity}
                        </p>
                      </td>
                      <td className="py-[10px] px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-[#e5e7eb] dark:bg-[#1a2d47] rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${
                                occupancyPercent >= 90 ? 'bg-[#dc2626]' :
                                occupancyPercent >= 75 ? 'bg-[#ea580c]' :
                                'bg-[#16a34a]'
                              }`}
                              style={{ width: `${occupancyPercent}%` }}
                            />
                          </div>
                          <p className="font-['Inter'] font-normal text-[12px] leading-[16px] text-[#6b7280] dark:text-[#94a3b8]">
                            {occupancyPercent}%
                          </p>
                        </div>
                      </td>
                      <td className="py-[10px] px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-[12px] font-medium ${
                          lot.status === "Active"
                            ? "bg-[#d1fae5] dark:bg-[#065f46] text-[#065f46] dark:text-[#34d399]"
                            : "bg-[#fee2e2] dark:bg-[#7f1d1d] text-[#991b1b] dark:text-[#f87171]"
                        }`}>
                          {lot.status}
                        </span>
                      </td>
                      <td className="py-[10px] px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="p-1.5 rounded hover:bg-[#e5e7eb] dark:hover:bg-[#4b5563] transition-colors"
                            title="Edit"
                          >
                            <Edit className="size-4 text-[#6b7280] dark:text-[#94a3b8]" />
                          </button>
                          <button
                            className="p-1.5 rounded hover:bg-[#fee2e2] dark:hover:bg-[#7f1d1d] transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="size-4 text-[#dc2626] dark:text-[#f87171]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

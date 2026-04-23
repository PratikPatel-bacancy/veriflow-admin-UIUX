import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Plus, Search, Filter } from "lucide-react";

const mockZones = [
  {
    id: 1,
    name: "Zone A — Permit Holders Only",
    parkingLots: 4,
    site: "UCLA Campus Parking",
    capacity: 80,
    occupancy: 95,
    status: "Active",
    hasPolicy: true,
  },
  {
    id: 2,
    name: "Zone B — General Public Parking",
    parkingLots: 6,
    site: "UCLA Campus Parking",
    capacity: 75,
    occupancy: 88,
    status: "Active",
    hasPolicy: true,
  },
  {
    id: 3,
    name: "Zone C — Faculty & Staff Reserved",
    parkingLots: 3,
    site: "UCLA Campus Parking",
    capacity: 60,
    occupancy: 76,
    status: "Active",
    hasPolicy: true,
  },
  {
    id: 4,
    name: "Zone D — Short-Term Visitor (2-Hour)",
    parkingLots: 2,
    site: "Stanford University",
    capacity: 50,
    occupancy: 65,
    status: "Active",
    hasPolicy: true,
  },
  {
    id: 5,
    name: "Zone E — EV Charging Stations",
    parkingLots: 5,
    site: "UT Austin Campus",
    capacity: 20,
    occupancy: 45,
    status: "Active",
    hasPolicy: false,
  },
  {
    id: 6,
    name: "Zone F — Accessible Parking (ADA)",
    parkingLots: 8,
    site: "University of Michigan",
    capacity: 55,
    occupancy: 72,
    status: "Active",
    hasPolicy: true,
  },
  {
    id: 7,
    name: "Zone G — Event Day Overflow",
    parkingLots: 12,
    site: "UCLA Campus Parking",
    capacity: 100,
    occupancy: 42,
    status: "Active",
    hasPolicy: true,
  },
  {
    id: 8,
    name: "Zone H — Motorcycle & Bicycle",
    parkingLots: 7,
    site: "UCLA Campus Parking",
    capacity: 40,
    occupancy: 68,
    status: "Active",
    hasPolicy: true,
  },
];

export default function ZoneList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter zones based on search query
  const filteredZones = mockZones.filter(zone => {
    const matchesSearch = zone.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         zone.site.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const totalZones = mockZones.length;
  const totalVehicleCapacity = mockZones.reduce((sum, zone) => sum + zone.capacity, 0);
  const activeViolations = 8;
  const policyCoverage = mockZones.filter(z => z.hasPolicy).length;

  return (
    <>
      <div className="flex-1 overflow-auto bg-[#eff6ff] dark:bg-[#0a1628] pb-6">
        {/* Page Header */}
        <div className="px-8 pt-8 pb-6">
          <div className="flex items-center justify-end">
            <button
              onClick={() => navigate("/management/zones/add/1")}
              className="bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-lg px-4 py-2 flex items-center gap-2 text-[14px] font-medium transition-colors"
            >
              <Plus className="size-4" strokeWidth={2} />
              Add Zone
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="px-8 mb-6">
          <div className="grid grid-cols-4 gap-5">
            <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-5 shadow-sm">
              <p className="font-['Inter'] font-normal text-[13px] text-[#6b7280] dark:text-[#94a3b8] mb-1">
                Total Zones
              </p>
              <p className="font-['Inter'] font-semibold text-[28px] leading-[32px] text-[#111827] dark:text-[#e8eef5]">
                {totalZones}
              </p>
            </div>
            <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-5 shadow-sm">
              <p className="font-['Inter'] font-normal text-[13px] text-[#6b7280] dark:text-[#94a3b8] mb-1">
                Total Vehicle Capacity
              </p>
              <p className="font-['Inter'] font-semibold text-[28px] leading-[32px] text-[#111827] dark:text-[#e8eef5]">
                {totalVehicleCapacity}
              </p>
            </div>
            <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-5 shadow-sm">
              <p className="font-['Inter'] font-normal text-[13px] text-[#dc2626] dark:text-[#f87171] mb-1">
                Active Violations
              </p>
              <p className="font-['Inter'] font-semibold text-[28px] leading-[32px] text-[#dc2626] dark:text-[#f87171]">
                {activeViolations}
              </p>
            </div>
            <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-5 shadow-sm">
              <p className="font-['Inter'] font-normal text-[13px] text-[#3b82f6] dark:text-[#60a5fa] mb-1">
                Policy Coverage
              </p>
              <p className="font-['Inter'] font-semibold text-[28px] leading-[32px] text-[#3b82f6] dark:text-[#60a5fa]">
                {policyCoverage}/{totalZones}
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-8 mb-6">
          <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#6b7280] dark:text-[#94a3b8]" />
                <input
                  type="text"
                  placeholder="Search zones..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#f9fafb] dark:bg-[#0a1628] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg pl-10 pr-4 py-2 text-sm text-[#111827] dark:text-[#e8eef5] placeholder:text-[#6b7280] dark:text-[#94a3b8] dark:placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
                />
              </div>
              <button className="border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg px-4 py-2 flex items-center gap-2 text-sm text-[#111827] dark:text-[#e8eef5] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)] transition-colors">
                <Filter className="size-4" />
                Filter
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="px-8">
          <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f9fafb] dark:bg-[#0a1628] border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
                  <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">
                    Zone Name
                  </th>
                  <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">
                    Parking Lot
                  </th>
                  <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">
                    Site
                  </th>
                  <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">
                    Capacity
                  </th>
                  <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">
                    Occupancy
                  </th>
                  <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredZones.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-[#6b7280] dark:text-[#94a3b8]">
                      No zones found matching your search
                    </td>
                  </tr>
                ) : (
                  filteredZones.map((zone) => (
                    <tr key={zone.id} className="border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)]">
                      <td className="px-6 py-4">
                        <Link
                          to={`/management/zones/${zone.id}`}
                          className="font-['Inter'] font-medium text-[14px] text-[#111827] dark:text-[#e8eef5] hover:text-[#3b82f6]"
                        >
                          {zone.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-[14px] text-[#6b7280] dark:text-[#94a3b8]">
                        {zone.parkingLots}
                      </td>
                      <td className="px-6 py-4 text-[14px] text-[#6b7280] dark:text-[#94a3b8]">
                        {zone.site}
                      </td>
                      <td className="px-6 py-4 text-[14px] text-[#6b7280] dark:text-[#94a3b8]">
                        {zone.capacity}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-[#e5e7eb] dark:bg-[#1a2d47] rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${
                                zone.occupancy >= 90 ? 'bg-[#dc2626]' :
                                zone.occupancy >= 75 ? 'bg-[#ea580c]' :
                                'bg-[#16a34a]'
                              }`}
                              style={{ width: `${zone.occupancy}%` }}
                            />
                          </div>
                          <span className="text-[12px] text-[#6b7280] dark:text-[#94a3b8]">
                            {zone.occupancy}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#d1fae5] dark:bg-[#065f46] text-[#065f46] dark:text-[#34d399]">
                          {zone.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
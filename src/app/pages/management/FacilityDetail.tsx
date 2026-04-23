import { useState } from "react";
import { Link, useParams } from "react-router";
import { Edit, Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import AddZoneModal from "../../components/modals/AddZoneModal";

const allFacilities = [
  { id: 1, name: "North Parking Structure", site: "UCLA Campus Parking" },
  { id: 2, name: "Bruin Lot — Surface East", site: "UCLA Campus Parking" },
  { id: 3, name: "Meyer Library Garage", site: "Stanford University" },
  { id: 4, name: "Lot 2 — West Campus", site: "University of Michigan" },
  { id: 5, name: "Brazos Garage — Level B1", site: "UT Austin Campus" },
];

const mockZones = [
  {
    id: 1,
    name: "Lot 2 — Permit A (North)",
    type: "Structure Level & Aisle",
    capacity: 80,
    occupancy: 95,
    policy: "Permit Only",
    violations: 2,
    status: "Active"
  },
  {
    id: 2,
    name: "Structure 6 — Level P2",
    type: "Structure Level & Aisle",
    capacity: 75,
    occupancy: 88,
    policy: "2-Hour Parking",
    violations: 0,
    status: "Active"
  },
  {
    id: 3,
    name: "Bruin Walk Curb — East Side",
    type: "Curb Segment",
    capacity: 60,
    occupancy: 76,
    policy: "Pay-to-Park",
    violations: 1,
    status: "Active"
  },
];

const mockDevices = [
  {
    id: "DEV-001",
    model: "Lynet M504",
    rtkStatus: "FIX",
    connectivity: "Online",
    lastSeen: "2 mins ago",
    health: "Healthy"
  },
  {
    id: "DEV-002",
    model: "Lynet M504",
    rtkStatus: "FLOAT",
    connectivity: "Online",
    lastSeen: "5 mins ago",
    health: "Degraded"
  },
  {
    id: "DEV-003",
    model: "Einar",
    rtkStatus: "SINGLE",
    connectivity: "Offline",
    lastSeen: "1 hour ago",
    health: "Healthy"
  },
];

const mockViolations = [
  {
    plate: "CA · 7XRT423",
    zone: "Lot 2 — Permit A (North)",
    type: "Overstay",
    time: "14 mins ago",
    status: "Open"
  },
  {
    plate: "CA · 3BNM771",
    zone: "Bruin Walk Curb — East Side",
    type: "Expired Session",
    time: "32 mins ago",
    status: "Open"
  },
  {
    plate: "CA · 8WXZ002",
    zone: "Structure 6 — Level P2",
    type: "Permit Violation",
    time: "1 hour ago",
    status: "Resolved"
  },
];

const mockPolicies = [
  {
    id: 1,
    name: "2-Hour Parking",
    type: "Time-limit",
    zones: "Zone A · Zone B",
    status: "Active"
  },
  {
    id: 2,
    name: "Permit Only",
    type: "Permit",
    zones: "Zone B",
    status: "Active"
  },
  {
    id: 3,
    name: "Pay-to-Park",
    type: "Payment",
    zones: "Zone C",
    status: "Active"
  },
];

const mockEvents = [
  {
    id: 1,
    name: "Holiday Parking",
    zones: "Zone A, Zone C",
    rule: "No Time Limit",
    startDate: "Apr 20, 2025",
    endDate: "Apr 21, 2025",
    status: "Upcoming"
  },
  {
    id: 2,
    name: "Street Cleaning",
    zones: "Zone C",
    rule: "No Parking 8–10am",
    startDate: "Apr 18, 2025",
    endDate: "Apr 18, 2025",
    status: "Active"
  },
];

export default function FacilityDetail() {
  const { id } = useParams();
  const [showAddZoneModal, setShowAddZoneModal] = useState(false);

  const currentFacilityId = parseInt(id || "1");
  const currentIndex = allFacilities.findIndex(f => f.id === currentFacilityId);
  const currentFacility = allFacilities[currentIndex] || allFacilities[0];

  const handleAddZone = (data: any) => {
    console.log("Add Zone:", data);
  };

  const totalZones = mockZones.length;
  const totalStalls = 155;
  const totalCapacity = mockZones.reduce((sum, zone) => sum + zone.capacity, 0);
  const currentOccupancy = 88;
  const activeViolations = mockViolations.filter(v => v.status === "Open").length;
  const devicesOnline = mockDevices.filter(d => d.connectivity === "Online").length;
  const totalDevices = mockDevices.length;

  const occupiedStalls = 128;
  const availableStalls = 27;

  return (
    <>
      <div className="flex-1 overflow-auto bg-[#eff6ff] pb-6">
        {/* Breadcrumb */}
        <div className="px-8 pt-6">
          <div className="flex items-center gap-2 text-[14px] text-[#6b7280] dark:text-[#94a3b8]">
            <Link to="/management/sites" className="hover:text-[#3b82f6]">Sites</Link>
            <span>›</span>
            <Link to="/management/sites/1" className="hover:text-[#3b82f6]">{currentFacility.site}</Link>
            <span>›</span>
            <Link to="/management/facilities" className="hover:text-[#3b82f6]">Facilities</Link>
            <span>›</span>
            <span className="text-[#111827] dark:text-[#e8eef5]">{currentFacility.name}</span>
          </div>
        </div>

        {/* Page Header */}
        <div className="px-8 pt-4 pb-6">
          <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Link
                    to={`/management/facilities/${allFacilities[currentIndex - 1]?.id}`}
                    className={`border border-[#e5e7eb] bg-white rounded-lg p-2 transition-colors ${
                      currentIndex === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[#eff6ff] dark:hover:bg-[rgba(30,58,95,0.3)]'
                    }`}
                    onClick={(e) => currentIndex === 0 && e.preventDefault()}
                  >
                    <ChevronLeft className="size-4 text-[#6b7280] dark:text-[#94a3b8]" />
                  </Link>
                  <h1 className="font-['Inter'] font-semibold text-[24px] leading-[32px] text-[#111827] dark:text-[#e8eef5]">
                    {currentFacility.name}
                  </h1>
                  <Link
                    to={`/management/facilities/${allFacilities[currentIndex + 1]?.id}`}
                    className={`border border-[#e5e7eb] bg-white rounded-lg p-2 transition-colors ${
                      currentIndex === allFacilities.length - 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[#eff6ff] dark:hover:bg-[rgba(30,58,95,0.3)]'
                    }`}
                    onClick={(e) => currentIndex === allFacilities.length - 1 && e.preventDefault()}
                  >
                    <ChevronRight className="size-4 text-[#6b7280] dark:text-[#94a3b8]" />
                  </Link>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-medium border border-[#3b82f6] text-[#3b82f6] bg-white">
                    Multi-level Parking Structure
                  </span>
                </div>
                <p className="text-[14px] text-[#6b7280] dark:text-[#94a3b8] mb-1 ml-20">
                  Site: <Link to="/management/sites/1" className="text-[#3b82f6] hover:underline">{currentFacility.site}</Link>
                </p>
                <p className="text-[12px] text-[#6b7280] dark:text-[#94a3b8] ml-20">FAC-00{currentFacilityId}</p>
                <p className="text-[12px] text-[#6b7280] dark:text-[#94a3b8] mt-2 ml-20">
                  {currentIndex + 1} of {allFacilities.length} Facilities
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#d1fae5] text-[#065f46]">
                  Active
                </span>
                <button className="border border-[#e5e7eb] bg-white hover:bg-[#eff6ff] dark:hover:bg-[rgba(30,58,95,0.3)] text-[#111827] dark:text-[#e8eef5] rounded-lg px-4 py-2 flex items-center gap-2 text-[14px] font-medium transition-colors">
                  <Edit className="size-4" />
                  Edit Facility
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="px-8 mb-6">
          <div className="grid grid-cols-6 gap-5">
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-5 shadow-sm">
              <p className="font-['Inter'] font-normal text-[13px] text-[#6b7280] dark:text-[#94a3b8] mb-1">
                Total Zones
              </p>
              <p className="font-['Inter'] font-semibold text-[28px] leading-[32px] text-[#111827] dark:text-[#e8eef5]">
                {totalZones}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-5 shadow-sm">
              <p className="font-['Inter'] font-normal text-[13px] text-[#6b7280] dark:text-[#94a3b8] mb-1">
                Total Stalls
              </p>
              <p className="font-['Inter'] font-semibold text-[28px] leading-[32px] text-[#111827] dark:text-[#e8eef5]">
                {totalStalls}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-5 shadow-sm">
              <p className="font-['Inter'] font-normal text-[13px] text-[#6b7280] dark:text-[#94a3b8] mb-1">
                Total Capacity
              </p>
              <p className="font-['Inter'] font-semibold text-[28px] leading-[32px] text-[#111827] dark:text-[#e8eef5]">
                {totalCapacity}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-5 shadow-sm">
              <p className={`font-['Inter'] font-normal text-[13px] mb-1 ${
                currentOccupancy > 90 ? 'text-[#ef4444]' : currentOccupancy > 75 ? 'text-[#f59e0b]' : 'text-[#6b7280] dark:text-[#94a3b8]'
              }`}>
                Current Occupancy
              </p>
              <p className={`font-['Inter'] font-semibold text-[28px] leading-[32px] ${
                currentOccupancy > 90 ? 'text-[#ef4444]' : currentOccupancy > 75 ? 'text-[#f59e0b]' : 'text-[#111827] dark:text-[#e8eef5]'
              }`}>
                {currentOccupancy}%
              </p>
            </div>
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-5 shadow-sm">
              <p className={`font-['Inter'] font-normal text-[13px] mb-1 ${
                activeViolations > 0 ? 'text-[#ef4444]' : 'text-[#6b7280] dark:text-[#94a3b8]'
              }`}>
                Active Violations
              </p>
              <p className={`font-['Inter'] font-semibold text-[28px] leading-[32px] ${
                activeViolations > 0 ? 'text-[#ef4444]' : 'text-[#6b7280] dark:text-[#94a3b8]'
              }`}>
                {activeViolations}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-5 shadow-sm">
              <p className={`font-['Inter'] font-normal text-[13px] mb-1 ${
                devicesOnline === totalDevices ? 'text-[#10b981]' : 'text-[#f59e0b]'
              }`}>
                Devices Online
              </p>
              <p className={`font-['Inter'] font-semibold text-[28px] leading-[32px] ${
                devicesOnline === totalDevices ? 'text-[#10b981]' : 'text-[#f59e0b]'
              }`}>
                {devicesOnline}/{totalDevices}
              </p>
            </div>
          </div>
        </div>

        {/* Zones List */}
        <div className="px-8 mb-6">
          <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#e5e7eb] flex items-center justify-between">
              <h2 className="font-['Inter'] font-semibold text-[18px] text-[#111827] dark:text-[#e8eef5]">Zones</h2>
              <button
                onClick={() => setShowAddZoneModal(true)}
                className="bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-lg px-4 py-2 flex items-center gap-2 text-[14px] font-medium transition-colors"
              >
                <Plus className="size-4" strokeWidth={2} />
                Add Zone
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#eff6ff] dark:bg-[#0a1628] border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
                    <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">Zone Name</th>
                    <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">Zone Type</th>
                    <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">Capacity</th>
                    <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">Occupancy</th>
                    <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">Policy Applied</th>
                    <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">Active Violations</th>
                    <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">Status</th>
                    <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockZones.map((zone) => (
                    <tr key={zone.id} className="border-b border-[#e5e7eb] hover:bg-[#eff6ff] dark:hover:bg-[rgba(30,58,95,0.3)]">
                      <td className="px-6 py-4">
                        <Link
                          to={`/management/zones/${zone.id}`}
                          className="font-['Inter'] font-medium text-[14px] text-[#3b82f6] hover:underline"
                        >
                          {zone.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-[14px] text-[#6b7280] dark:text-[#94a3b8]">{zone.type}</td>
                      <td className="px-6 py-4 text-[14px] text-[#6b7280] dark:text-[#94a3b8]">{zone.capacity}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-[#e5e7eb] rounded-full h-1.5">
                            <div
                              className="h-1.5 rounded-full bg-[#3b82f6]"
                              style={{ width: `${zone.occupancy}%` }}
                            />
                          </div>
                          <span className="text-[12px] text-[#6b7280] dark:text-[#94a3b8]">
                            {zone.occupancy}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[14px] text-[#6b7280] dark:text-[#94a3b8]">
                        {zone.policy || "—"}
                      </td>
                      <td className="px-6 py-4">
                        {zone.violations > 0 ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#fee2e2] text-[#991b1b]">
                            {zone.violations}
                          </span>
                        ) : (
                          <span className="text-[14px] text-[#6b7280] dark:text-[#94a3b8]">0</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#d1fae5] text-[#065f46]">
                          {zone.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            className="p-1.5 rounded hover:bg-[#e5e7eb] transition-colors"
                            title="Edit"
                          >
                            <Edit className="size-4 text-[#6b7280] dark:text-[#94a3b8]" />
                          </button>
                          <button
                            className="p-1.5 rounded hover:bg-[#fee2e2] transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="size-4 text-[#ef4444]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Two Column Layout - Devices & Stalls */}
        <div className="px-8 mb-6">
          <div className="grid grid-cols-[60%_40%] gap-5">
            {/* Devices Card */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-[#e5e7eb] flex items-center gap-3">
                <h2 className="font-['Inter'] font-semibold text-[18px] text-[#111827] dark:text-[#e8eef5]">Assigned Devices</h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#e5e7eb] text-[#6b7280] dark:text-[#94a3b8]">
                  {totalDevices}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#eff6ff] dark:bg-[#0a1628] border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
                      <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">Device ID</th>
                      <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">Model</th>
                      <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">RTK Status</th>
                      <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">Connectivity</th>
                      <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">Last Seen</th>
                      <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">Health</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockDevices.map((device) => (
                      <tr key={device.id} className="border-b border-[#e5e7eb] hover:bg-[#eff6ff] dark:hover:bg-[rgba(30,58,95,0.3)]">
                        <td className="px-6 py-4 text-[14px] text-[#3b82f6]">{device.id}</td>
                        <td className="px-6 py-4 text-[14px] text-[#6b7280] dark:text-[#94a3b8]">{device.model}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium ${
                            device.rtkStatus === "FIX" ? "bg-[#d1fae5] text-[#065f46]" :
                            device.rtkStatus === "FLOAT" ? "bg-[#fef3c7] text-[#92400e]" :
                            "bg-[#fee2e2] text-[#991b1b]"
                          }`}>
                            {device.rtkStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className={`size-2 rounded-full ${
                              device.connectivity === "Online" ? "bg-[#10b981]" : "bg-[#ef4444]"
                            }`} />
                            <span className="text-[14px] text-[#6b7280] dark:text-[#94a3b8]">{device.connectivity}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[14px] text-[#6b7280] dark:text-[#94a3b8]">{device.lastSeen}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium ${
                            device.health === "Healthy" ? "bg-[#d1fae5] text-[#065f46]" :
                            "bg-[#fef3c7] text-[#92400e]"
                          }`}>
                            {device.health}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Stalls Summary Card */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-6">
              <h2 className="font-['Inter'] font-semibold text-[18px] text-[#111827] dark:text-[#e8eef5] mb-6">Stalls Overview</h2>
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-[#6b7280] dark:text-[#94a3b8]">Total Stalls</span>
                  <span className="font-['Inter'] font-semibold text-[24px] text-[#111827] dark:text-[#e8eef5]">{totalStalls}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-[#f59e0b]" />
                    <span className="text-[14px] text-[#6b7280] dark:text-[#94a3b8]">Occupied</span>
                  </div>
                  <span className="font-['Inter'] font-semibold text-[24px] text-[#111827] dark:text-[#e8eef5]">{occupiedStalls}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-[#10b981]" />
                    <span className="text-[14px] text-[#6b7280] dark:text-[#94a3b8]">Available</span>
                  </div>
                  <span className="font-['Inter'] font-semibold text-[24px] text-[#111827] dark:text-[#e8eef5]">{availableStalls}</span>
                </div>
              </div>
              {/* Stacked Bar */}
              <div className="space-y-2">
                <div className="h-8 rounded-lg overflow-hidden flex">
                  <div
                    className="bg-[#10b981] flex items-center justify-center text-white text-[11px] font-medium"
                    style={{ width: `${(availableStalls / totalStalls) * 100}%` }}
                  >
                    {Math.round((availableStalls / totalStalls) * 100)}%
                  </div>
                  <div
                    className="bg-[#f59e0b] flex items-center justify-center text-white text-[11px] font-medium"
                    style={{ width: `${(occupiedStalls / totalStalls) * 100}%` }}
                  >
                    {Math.round((occupiedStalls / totalStalls) * 100)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout - Violations & Policies */}
        <div className="px-8 mb-6">
          <div className="grid grid-cols-[60%_40%] gap-5">
            {/* Active Violations Card */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-[#e5e7eb] flex items-center gap-3">
                <h2 className="font-['Inter'] font-semibold text-[18px] text-[#111827] dark:text-[#e8eef5]">Active Violations</h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#fee2e2] text-[#991b1b]">
                  {activeViolations}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#eff6ff] dark:bg-[#0a1628] border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
                      <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">Plate</th>
                      <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">Zone</th>
                      <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">Violation Type</th>
                      <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">Time</th>
                      <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockViolations.map((violation, index) => (
                      <tr key={index} className="border-b border-[#e5e7eb] hover:bg-[#eff6ff] dark:hover:bg-[rgba(30,58,95,0.3)]">
                        <td className="px-6 py-4 font-['Inter'] font-medium text-[14px] text-[#111827] dark:text-[#e8eef5]">
                          {violation.plate}
                        </td>
                        <td className="px-6 py-4 text-[14px] text-[#6b7280] dark:text-[#94a3b8]">{violation.zone}</td>
                        <td className="px-6 py-4 text-[14px] text-[#6b7280] dark:text-[#94a3b8]">{violation.type}</td>
                        <td className="px-6 py-4 text-[14px] text-[#6b7280] dark:text-[#94a3b8]">{violation.time}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium ${
                            violation.status === "Open" ? "bg-[#fee2e2] text-[#991b1b]" :
                            "bg-[#d1fae5] text-[#065f46]"
                          }`}>
                            {violation.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Policy Templates Card */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-6">
              <h2 className="font-['Inter'] font-semibold text-[18px] text-[#111827] dark:text-[#e8eef5] mb-4">Applied Policies</h2>
              <div className="space-y-3">
                {mockPolicies.map((policy) => (
                  <div key={policy.id} className="border-b border-[#e5e7eb] pb-3 last:border-b-0 last:pb-0">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1">
                        <p className="font-['Inter'] font-medium text-[14px] text-[#111827] dark:text-[#e8eef5] mb-0.5">
                          {policy.name}
                        </p>
                        <p className="text-[12px] text-[#6b7280] dark:text-[#94a3b8] mb-1">{policy.type}</p>
                        <p className="text-[12px] text-[#6b7280] dark:text-[#94a3b8]">{policy.zones}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#d1fae5] text-[#065f46]">
                          {policy.status}
                        </span>
                        <button className="p-1 rounded hover:bg-[#e5e7eb] transition-colors">
                          <Edit className="size-3.5 text-[#3b82f6]" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Event Calendars Card */}
        <div className="px-8">
          <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#e5e7eb] flex items-center justify-between">
              <h2 className="font-['Inter'] font-semibold text-[18px] text-[#111827] dark:text-[#e8eef5]">Upcoming Event Overrides</h2>
              <button className="bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-lg px-4 py-2 flex items-center gap-2 text-[14px] font-medium transition-colors">
                <Plus className="size-4" strokeWidth={2} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#eff6ff] dark:bg-[#0a1628] border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
                    <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">Event Name</th>
                    <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">Affected Zones</th>
                    <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">Override Rule</th>
                    <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">Start Date</th>
                    <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">End Date</th>
                    <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">Status</th>
                    <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockEvents.map((event) => (
                    <tr key={event.id} className="border-b border-[#e5e7eb] hover:bg-[#eff6ff] dark:hover:bg-[rgba(30,58,95,0.3)]">
                      <td className="px-6 py-4 font-['Inter'] font-medium text-[14px] text-[#111827] dark:text-[#e8eef5]">
                        {event.name}
                      </td>
                      <td className="px-6 py-4 text-[14px] text-[#6b7280] dark:text-[#94a3b8]">{event.zones}</td>
                      <td className="px-6 py-4 text-[14px] text-[#6b7280] dark:text-[#94a3b8]">{event.rule}</td>
                      <td className="px-6 py-4 text-[14px] text-[#6b7280] dark:text-[#94a3b8]">{event.startDate}</td>
                      <td className="px-6 py-4 text-[14px] text-[#6b7280] dark:text-[#94a3b8]">{event.endDate}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium ${
                          event.status === "Upcoming" ? "bg-[#dbeafe] text-[#1e40af]" :
                          event.status === "Active" ? "bg-[#d1fae5] text-[#065f46]" :
                          "bg-[#e5e7eb] text-[#6b7280] dark:text-[#94a3b8]"
                        }`}>
                          {event.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            className="p-1.5 rounded hover:bg-[#e5e7eb] transition-colors"
                            title="Edit"
                          >
                            <Edit className="size-4 text-[#6b7280] dark:text-[#94a3b8]" />
                          </button>
                          <button
                            className="p-1.5 rounded hover:bg-[#fee2e2] transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="size-4 text-[#ef4444]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add Zone Modal */}
      <AddZoneModal
        isOpen={showAddZoneModal}
        onClose={() => setShowAddZoneModal(false)}
        onSubmit={handleAddZone}
      />
    </>
  );
}

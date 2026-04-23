import { useState } from "react";
import { Link } from "react-router";
import { Plus, Edit, Trash2 } from "lucide-react";
import AddFacilityModal from "../../components/modals/AddFacilityModal";

const mockFacilities = [
  {
    id: "FAC-001",
    name: "North Parking Structure",
    site: "UCLA Campus Parking",
    zones: 6,
    capacity: 30,
    occupied: 26,
    status: "Active",
  },
  {
    id: "FAC-002",
    name: "Bruin Lot — Surface East",
    site: "UCLA Campus Parking",
    zones: 4,
    capacity: 25,
    occupied: 23,
    status: "Active",
  },
  {
    id: "FAC-003",
    name: "Meyer Library Garage",
    site: "Stanford University",
    zones: 3,
    capacity: 22,
    occupied: 17,
    status: "Active",
  },
  {
    id: "FAC-004",
    name: "Lot 2 — West Campus",
    site: "University of Michigan",
    zones: 4,
    capacity: 23,
    occupied: 19,
    status: "Active",
  },
  {
    id: "FAC-005",
    name: "Brazos Garage — Level B1",
    site: "UT Austin Campus",
    zones: 6,
    capacity: 28,
    occupied: 23,
    status: "Active",
  },
];

export default function FacilityList() {
  const [showAddFacilityModal, setShowAddFacilityModal] = useState(false);

  const handleAddFacility = (data: any) => {
    console.log("Add Facility:", data);
  };

  return (
    <>
      <div className="flex-1 overflow-auto bg-[#eff6ff] pb-6">
        {/* Page Header */}
        <div className="px-6 pt-6 pb-6">
          <div className="flex items-start gap-1">
            <div className="flex-1">
              <h1 className="font-['Inter'] font-semibold text-[32px] leading-[36px] text-[#111827] dark:text-[#e8eef5]">
                Facilities
              </h1>
            </div>
            <button
              onClick={() => setShowAddFacilityModal(true)}
              className="bg-[#3b82f6] border border-[#3b82f6] rounded-[4px] px-4 py-[5px] flex items-center gap-2 text-white text-[14px] hover:bg-[#2563eb] transition-colors shadow-[0px_2px_0px_0px_rgba(0,0,0,0.04)]"
            >
              <Plus className="size-[14px]" strokeWidth={2} />
              Add Facility
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="px-6 mb-6">
          <div className="grid grid-cols-5 gap-5">
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-5 shadow-sm">
              <p className="font-['Inter'] font-normal text-[13px] text-[#6b7280] dark:text-[#94a3b8] mb-1">
                Total Facilities
              </p>
              <p className="font-['Inter'] font-semibold text-[28px] leading-[32px] text-[#111827] dark:text-[#e8eef5]">
                {mockFacilities.length}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-5 shadow-sm">
              <p className="font-['Inter'] font-normal text-[13px] text-[#6b7280] dark:text-[#94a3b8] mb-1">
                Total Zones
              </p>
              <p className="font-['Inter'] font-semibold text-[28px] leading-[32px] text-[#111827] dark:text-[#e8eef5]">
                {mockFacilities.reduce((sum, f) => sum + f.zones, 0)}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-5 shadow-sm">
              <p className="font-['Inter'] font-normal text-[13px] text-[#6b7280] dark:text-[#94a3b8] mb-1">
                Total Capacity
              </p>
              <p className="font-['Inter'] font-semibold text-[28px] leading-[32px] text-[#111827] dark:text-[#e8eef5]">
                {mockFacilities.reduce((sum, f) => sum + f.capacity, 0)}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-5 shadow-sm">
              <p className="font-['Inter'] font-normal text-[13px] text-[#f59e0b] mb-1">
                Average Occupancy
              </p>
              <p className="font-['Inter'] font-semibold text-[28px] leading-[32px] text-[#f59e0b]">
                {Math.round(mockFacilities.reduce((sum, f) => sum + ((f.occupied / f.capacity) * 100), 0) / mockFacilities.length)}%
              </p>
            </div>
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-5 shadow-sm">
              <p className="font-['Inter'] font-normal text-[13px] text-[#ef4444] mb-1">
                Active Violations
              </p>
              <p className="font-['Inter'] font-semibold text-[28px] leading-[32px] text-[#ef4444]">
                12
              </p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="px-6">
          <div className="bg-white rounded-lg border border-[#d9d9d9] pb-[14px] pt-6 px-6">
            {/* Table Header */}
            <div className="mb-6">
              <h2 className="font-['Inter'] font-semibold text-[18px] leading-[28px] tracking-[-0.4395px] text-[#111827] dark:text-[#e8eef5]">
                All Facilities
              </h2>
            </div>

            {/* Table */}
            <div className="overflow-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#e5e7eb]">
                    <th className="text-left py-3 px-4">
                      <p className="font-['Inter'] font-medium text-[14px] leading-[20px] text-[#6b7280] dark:text-[#94a3b8]">
                        Facility ID
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
                  {mockFacilities.map((facility) => {
                    const occupancyPercent = Math.round((facility.occupied / facility.capacity) * 100);
                    return (
                      <tr key={facility.id} className="border-b border-[#e5e7eb] last:border-0 hover:bg-[#eff6ff] dark:hover:bg-[rgba(30,58,95,0.3)] transition-colors">
                        <td className="py-[10px] px-4">
                          <Link 
                            to={`/management/facilities/${facility.id}`}
                            className="font-['Inter'] font-medium text-[14px] leading-[20px] text-[#3b82f6] hover:underline"
                          >
                            {facility.id}
                          </Link>
                        </td>
                        <td className="py-[10px] px-4">
                          <p className="font-['Inter'] font-normal text-[14px] leading-[20px] text-[#111827] dark:text-[#e8eef5]">
                            {facility.name}
                          </p>
                        </td>
                        <td className="py-[10px] px-4">
                          <p className="font-['Inter'] font-normal text-[14px] leading-[20px] text-[#6b7280] dark:text-[#94a3b8]">
                            {facility.site}
                          </p>
                        </td>
                        <td className="py-[10px] px-4">
                          <p className="font-['Inter'] font-normal text-[14px] leading-[20px] text-[#111827] dark:text-[#e8eef5]">
                            {facility.zones}
                          </p>
                        </td>
                        <td className="py-[10px] px-4">
                          <p className="font-['Inter'] font-normal text-[14px] leading-[20px] text-[#111827] dark:text-[#e8eef5]">
                            {facility.capacity}
                          </p>
                        </td>
                        <td className="py-[10px] px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-[#e5e7eb] rounded-full h-1.5">
                              <div 
                                className={`h-1.5 rounded-full ${
                                  occupancyPercent >= 90 ? 'bg-[#ef4444]' :
                                  occupancyPercent >= 75 ? 'bg-[#f59e0b]' :
                                  'bg-[#10b981]'
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
                            facility.status === "Active"
                              ? "bg-[#d1fae5] text-[#065f46]"
                              : "bg-[#fee2e2] text-[#991b1b]"
                          }`}>
                            {facility.status}
                          </span>
                        </td>
                        <td className="py-[10px] px-4">
                          <div className="flex items-center justify-end gap-2">
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddFacilityModal
        isOpen={showAddFacilityModal}
        onClose={() => setShowAddFacilityModal(false)}
        onSubmit={handleAddFacility}
      />
    </>
  );
}

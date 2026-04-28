import { useState } from "react";
import { useParams, Link } from "react-router";
import { Edit, ArrowLeft, Info } from "lucide-react";
import EditSiteModal from "../../components/modals/EditSiteModal";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/app/components/ui/tooltip";

const mockZones = [
  {
    id: 1,
    name: "Zone A — Permit Holders Only",
    parkingLots: 4,
    site: "Pacific Plaza Garage",
    capacity: 80,
    occupancy: 95,
    status: "Active",
  },
  {
    id: 2,
    name: "Zone B — General Public Parking",
    parkingLots: 6,
    site: "Pacific Plaza Garage",
    capacity: 75,
    occupancy: 88,
    status: "Active",
  },
  {
    id: 3,
    name: "Zone C — Reserved Parking",
    parkingLots: 3,
    site: "Pacific Plaza Garage",
    capacity: 60,
    occupancy: 76,
    status: "Active",
  },
  {
    id: 4,
    name: "Zone D — Short-Term Visitor",
    parkingLots: 2,
    site: "CF Pacific Centre",
    capacity: 50,
    occupancy: 65,
    status: "Active",
  },
  {
    id: 5,
    name: "Zone E — EV Charging Stations",
    parkingLots: 5,
    site: "CF Pacific Centre",
    capacity: 20,
    occupancy: 45,
    status: "Active",
  },
  {
    id: 6,
    name: "Zone F — Accessible Parking (ADA)",
    parkingLots: 8,
    site: "Heritage Harbor Parking",
    capacity: 55,
    occupancy: 72,
    status: "Active",
  },
  {
    id: 7,
    name: "Zone G — Event Day Overflow",
    parkingLots: 12,
    site: "875 Garnet Pacific Beach Parking",
    capacity: 100,
    occupancy: 42,
    status: "Active",
  },
  {
    id: 8,
    name: "Zone H — Standard Parking",
    parkingLots: 7,
    site: "Pan Pacific Park Parking",
    capacity: 40,
    occupancy: 68,
    status: "Active",
  },
];

const allSites = [
  { id: 1, name: "Pacific Plaza Garage" },
  { id: 2, name: "CF Pacific Centre" },
  { id: 3, name: "Heritage Harbor Parking" },
  { id: 4, name: "875 Garnet Pacific Beach Parking" },
  { id: 5, name: "Pan Pacific Park Parking" },
];

export default function SiteDetail() {
  const { id } = useParams();
  const [showEditModal, setShowEditModal] = useState(false);

  const currentSiteId = parseInt(id || "1");
  const currentIndex = allSites.findIndex(s => s.id === currentSiteId);
  const currentSite = allSites[currentIndex];

  // Filter zones to only show zones for the current site
  const filteredZones = mockZones.filter(zone => zone.site === currentSite?.name);

  const handleEditSite = (data: any) => {
    console.log("Edit Site:", data);
    setShowEditModal(false);
  };

  const siteData = {
    siteName: currentSite?.name || "Pacific Plaza Garage",
    siteType: "Commercial Parking",
    timezone: "PST",
    address: "1234 Pacific Blvd, Los Angeles, CA 90015",
    geoLat: "34.0522",
    geoLon: "-118.2437",
    note: "Downtown commercial parking facility"
  };

  return (
    <>
    <div className="flex-1 overflow-auto bg-[#eff6ff] dark:bg-[#0a1628] pb-6">
      {/* Breadcrumb */}
      <div className="px-8 pt-6 pb-2">
        <Link to="/management/sites" className="flex items-center gap-2 text-[14px] text-[#6b7280] dark:text-[#94a3b8] hover:text-[#111827] dark:text-[#e8eef5] dark:hover:text-[#f3f4f6] transition-colors">
          <ArrowLeft className="size-4" />
          Sites
        </Link>
      </div>

      {/* Page Header */}
      <div className="px-8 pt-4 pb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <h1 className="font-['Inter'] font-semibold text-[24px] leading-[32px] text-[#111827] dark:text-[#e8eef5]">
              {currentSite?.name}
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#dbeafe] dark:bg-[#1e3a8a] text-[#1e40af] dark:text-[#60a5fa]">
              Commercial Parking
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#d1fae5] dark:bg-[#065f46] text-[#065f46] dark:text-[#34d399]">
              Active
            </span>
          </div>
          <button
            onClick={() => setShowEditModal(true)}
            className="border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] bg-white dark:bg-[#0f1f35] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)] text-[#111827] dark:text-[#e8eef5] rounded-lg px-4 py-2 flex items-center gap-2 text-[14px] font-medium transition-colors"
          >
            <Edit className="size-4" />
            Edit
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="px-8 mb-6">
        <div className="grid grid-cols-3 gap-5">
          <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-5 shadow-sm">
            <div className="flex items-center gap-1.5 mb-1">
              <p className="font-['Inter'] font-normal text-[13px] text-[#6b7280] dark:text-[#94a3b8]">
                Total Zones
              </p>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="size-3.5 text-[#9ca3af] dark:text-[#6b7280] cursor-pointer hover:text-[#3b82f6] dark:hover:text-[#60a5fa] transition-colors" />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[220px] text-center">
                  The total number of parking zones configured within this site.
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="font-['Inter'] font-semibold text-[28px] leading-[32px] text-[#111827] dark:text-[#e8eef5]">
              {filteredZones.length}
            </p>
          </div>
          <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-5 shadow-sm">
            <div className="flex items-center gap-1.5 mb-1">
              <p className="font-['Inter'] font-normal text-[13px] text-[#6b7280] dark:text-[#94a3b8]">
                Total Parking Lots
              </p>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="size-3.5 text-[#9ca3af] dark:text-[#6b7280] cursor-pointer hover:text-[#3b82f6] dark:hover:text-[#60a5fa] transition-colors" />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[220px] text-center">
                  The total number of individual parking lots across all zones in this site.
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="font-['Inter'] font-semibold text-[28px] leading-[32px] text-[#111827] dark:text-[#e8eef5]">
              {filteredZones.reduce((sum, zone) => sum + zone.parkingLots, 0)}
            </p>
          </div>
          <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-5 shadow-sm">
            <div className="flex items-center gap-1.5 mb-1">
              <p className="font-['Inter'] font-normal text-[13px] text-[#6b7280] dark:text-[#94a3b8]">
                Total Parking Capacity
              </p>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="size-3.5 text-[#9ca3af] dark:text-[#6b7280] cursor-pointer hover:text-[#3b82f6] dark:hover:text-[#60a5fa] transition-colors" />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[220px] text-center">
                  The maximum number of vehicles this site can accommodate across all its zones.
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="font-['Inter'] font-semibold text-[28px] leading-[32px] text-[#111827] dark:text-[#e8eef5]">
              {filteredZones.reduce((sum, zone) => sum + zone.capacity, 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Zones Table */}
      <div className="px-8 mb-6">
        <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
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
                {filteredZones.map((zone) => (
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    {/* Edit Site Modal */}
    <EditSiteModal
      isOpen={showEditModal}
      onClose={() => setShowEditModal(false)}
      onSubmit={handleEditSite}
      siteData={siteData}
    />
    </>
  );
}

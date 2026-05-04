import { useParams, Link } from "react-router";
import { ArrowLeft, Info, MapPin, Eye, LayoutGrid } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/app/components/ui/tooltip";

const mockZones = [
  {
    id: 1,
    name: "Zone A — Permit Holders Only",
    zoneType: "permit",
    parkingLots: 4,
    site: "Pacific Plaza Garage",
    capacity: 80,
    occupancy: 95,
    status: "Active",
  },
  {
    id: 2,
    name: "Zone B — General Public Parking",
    zoneType: "metered",
    parkingLots: 6,
    site: "Pacific Plaza Garage",
    capacity: 75,
    occupancy: 88,
    status: "Active",
  },
  {
    id: 3,
    name: "Zone C — Reserved Parking",
    zoneType: "reserved",
    parkingLots: 3,
    site: "Pacific Plaza Garage",
    capacity: 60,
    occupancy: 76,
    status: "Inactive",
  },
  {
    id: 4,
    name: "Zone D — Short-Term Visitor",
    zoneType: "metered",
    parkingLots: 2,
    site: "CF Pacific Centre",
    capacity: 50,
    occupancy: 65,
    status: "Active",
  },
  {
    id: 5,
    name: "Zone E — EV Charging Stations",
    zoneType: "ev",
    parkingLots: 5,
    site: "CF Pacific Centre",
    capacity: 20,
    occupancy: 45,
    status: "Active",
  },
  {
    id: 6,
    name: "Zone F — Accessible Parking (ADA)",
    zoneType: "ada",
    parkingLots: 8,
    site: "Heritage Harbor Parking",
    capacity: 55,
    occupancy: 72,
    status: "Active",
  },
  {
    id: 7,
    name: "Zone G — Event Day Overflow",
    zoneType: "overflow",
    parkingLots: 12,
    site: "875 Garnet Pacific Beach Parking",
    capacity: 100,
    occupancy: 42,
    status: "Inactive",
  },
  {
    id: 8,
    name: "Zone H — Standard Parking",
    zoneType: "metered",
    parkingLots: 7,
    site: "Pan Pacific Park Parking",
    capacity: 40,
    occupancy: 68,
    status: "Active",
  },
];

const allSites = [
  { id: 1, name: "Pacific Plaza Garage", created: "Jan 15, 2025" },
  { id: 2, name: "CF Pacific Centre", created: "Feb 3, 2025" },
  { id: 3, name: "Heritage Harbor Parking", created: "Mar 10, 2025" },
  { id: 4, name: "875 Garnet Pacific Beach Parking", created: "Dec 1, 2024" },
  { id: 5, name: "Pan Pacific Park Parking", created: "Jan 28, 2025" },
];

export default function SiteDetail() {
  const { id } = useParams();

  const currentSiteId = parseInt(id || "1");
  const currentIndex = allSites.findIndex(s => s.id === currentSiteId);
  const currentSite = allSites[currentIndex];

  const filteredZones = mockZones.filter(zone => zone.site === currentSite?.name);

  const siteData = {
    timezone: "PST",
    address: "1234 Pacific Blvd, Los Angeles, CA 90015",
    note: "Downtown commercial parking facility"
  };

  return (
    <div className="flex-1 overflow-auto bg-[#eff6ff] dark:bg-[#0a1628] pb-6">
      {/* Breadcrumb */}
      <div className="px-8 pt-6 pb-2">
        <nav className="flex items-center gap-2 text-[14px]">
          <Link to="/" className="text-[#6b7280] dark:text-[#94a3b8] hover:text-[#111827] dark:hover:text-[#e8eef5] transition-colors">
            Dashboard
          </Link>
          <span className="text-[#9ca3af] dark:text-[#4b5563]">/</span>
          <Link to="/management/sites" className="text-[#6b7280] dark:text-[#94a3b8] hover:text-[#111827] dark:hover:text-[#e8eef5] transition-colors">
            Sites
          </Link>
          <span className="text-[#9ca3af] dark:text-[#4b5563]">/</span>
          <span className="font-semibold text-[#111827] dark:text-[#e8eef5]">Site Detail</span>
        </nav>
      </div>

      {/* Page Header */}
      <div className="px-8 pt-4 pb-6">
        <div className="flex items-center gap-3">
          <Link
            to="/management/sites"
            className="text-[#6b7280] dark:text-[#94a3b8] hover:text-[#111827] dark:hover:text-[#e8eef5] transition-colors"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <h1 className="font-['Inter'] font-semibold text-[24px] leading-[32px] text-[#111827] dark:text-[#e8eef5]">
            {currentSite?.name}
          </h1>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#d1fae5] dark:bg-[#065f46] text-[#065f46] dark:text-[#34d399]">
            Active
          </span>
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
                Created
              </p>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="size-3.5 text-[#9ca3af] dark:text-[#6b7280] cursor-pointer hover:text-[#3b82f6] dark:hover:text-[#60a5fa] transition-colors" />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[220px] text-center">
                  The date this site was created in the system.
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="font-['Inter'] font-semibold text-[28px] leading-[32px] text-[#111827] dark:text-[#e8eef5]">
              {currentSite?.created ?? "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Site Information Card */}
      <div className="px-8 mb-6">
        <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-5 shadow-sm">
          <p className="font-semibold text-[14px] text-[#111827] dark:text-[#e8eef5] mb-3">Site Information</p>
          <div className="flex items-center gap-6 text-[14px] text-[#6b7280] dark:text-[#94a3b8]">
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4 text-[#9ca3af] dark:text-[#6b7280] flex-shrink-0" />
              {siteData.address}
            </span>
            <span className="text-[#d1d5db] dark:text-[#374151]">|</span>
            <span>{siteData.timezone}</span>
            <span className="text-[#d1d5db] dark:text-[#374151]">|</span>
            <span className="italic">{siteData.note}</span>
          </div>
        </div>
      </div>

      {/* Zones Table */}
      <div className="px-8 mb-6">
        <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] shadow-sm overflow-hidden">
          {/* Table header row */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
            <p className="font-semibold text-[15px] text-[#111827] dark:text-[#e8eef5]">Zones</p>
            <Link
              to={`/management/zones/add/${currentSiteId}`}
              className="bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-lg px-3 py-1.5 flex items-center gap-2 text-[13px] font-medium transition-colors"
            >
              <LayoutGrid className="size-3.5" />
              Add Zone
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f9fafb] dark:bg-[#0a1628] border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
                  <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">
                    Zone Name
                  </th>
                  <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">
                    Zone Type
                  </th>
                  <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">
                    Parking Lot
                  </th>
                  <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">
                    Capacity
                  </th>
                  <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredZones.map((zone) => (
                  <tr key={zone.id} className="border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)]">
                    <td className="px-6 py-4">
                      <span className="font-['Inter'] font-medium text-[14px] text-[#111827] dark:text-[#e8eef5]">
                        {zone.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[14px] text-[#6b7280] dark:text-[#94a3b8] capitalize">
                      {zone.zoneType}
                    </td>
                    <td className="px-6 py-4 text-[14px] text-[#6b7280] dark:text-[#94a3b8]">
                      {zone.parkingLots}
                    </td>
                    <td className="px-6 py-4 text-[14px] text-[#6b7280] dark:text-[#94a3b8]">
                      {zone.capacity}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium ${
                        zone.status === "Active"
                          ? "bg-[#d1fae5] dark:bg-[#065f46] text-[#065f46] dark:text-[#34d399]"
                          : "bg-[#f3f4f6] dark:bg-[#1e293b] text-[#6b7280] dark:text-[#94a3b8]"
                      }`}>
                        {zone.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            to={`/management/zones/${zone.id}`}
                            className="p-1.5 rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] hover:bg-[#f3f4f6] dark:hover:bg-[rgba(30,58,95,0.5)] transition-colors inline-block"
                          >
                            <Eye className="size-4 text-[#6b7280] dark:text-[#94a3b8]" />
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="top">View Detail</TooltipContent>
                      </Tooltip>
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

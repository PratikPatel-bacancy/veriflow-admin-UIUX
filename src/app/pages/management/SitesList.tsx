import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Plus, Eye, Trash2, Info } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/app/components/ui/tooltip";

const mockSites = [
  {
    id: 1,
    name: "Pacific Plaza Garage",
    initials: "PG",
    facilities: 3,
    zones: 12,
    created: "Jan 15, 2025",
    status: "Active",
    plan: "Enterprise"
  },
  {
    id: 2,
    name: "CF Pacific Centre",
    initials: "CF",
    facilities: 5,
    zones: 18,
    created: "Feb 3, 2025",
    status: "Active",
    plan: "Enterprise"
  },
  {
    id: 3,
    name: "Heritage Harbor Parking",
    initials: "HH",
    facilities: 4,
    zones: 15,
    created: "Mar 10, 2025",
    status: "Active",
    plan: "Professional"
  },
  {
    id: 4,
    name: "875 Garnet Pacific Beach Parking",
    initials: "87",
    facilities: 2,
    zones: 8,
    created: "Dec 1, 2024",
    status: "Active",
    plan: "Enterprise"
  },
  {
    id: 5,
    name: "Pan Pacific Park Parking",
    initials: "PP",
    facilities: 3,
    zones: 10,
    created: "Jan 28, 2025",
    status: "Active",
    plan: "Professional"
  },
];

export default function SitesList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("All Plans");
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  // Filter sites based on search and filters
  const filteredSites = mockSites.filter(site => {
    const matchesSearch = site.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan = selectedPlan === "All Plans" || site.plan === selectedPlan;
    const matchesStatus = selectedStatus === "All Status" || site.status === selectedStatus;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  const totalZones = mockSites.reduce((sum, site) => sum + site.zones, 0);
  const inactiveSites = mockSites.filter(s => s.status === "Suspended" || s.status === "Inactive").length;

  return (
    <>
      <div className="flex-1 overflow-auto bg-[#eff6ff] dark:bg-[#0a1628] pb-6">
        {/* Page Header */}
        <div className="px-8 pt-8 pb-6">
          <div className="flex items-center justify-end">
            <button
              onClick={() => navigate("/management/sites/create")}
              className="bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-lg px-4 py-2 flex items-center gap-2 text-[14px] font-medium transition-colors"
            >
              <Plus className="size-4" strokeWidth={2} />
              Create Site
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="px-8 mb-6">
          <div className="grid grid-cols-3 gap-5">
            <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-5 shadow-sm">
              <div className="flex items-center gap-1.5 mb-1">
                <p className="font-['Inter'] font-normal text-[13px] text-[#6b7280] dark:text-[#94a3b8]">
                  Total Sites
                </p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="size-3.5 text-[#9ca3af] dark:text-[#6b7280] cursor-pointer hover:text-[#3b82f6] dark:hover:text-[#60a5fa] transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[220px] text-center">
                    The total number of registered parking sites in your organization.
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="font-['Inter'] font-semibold text-[28px] leading-[32px] text-[#111827] dark:text-[#e8eef5]">
                {mockSites.length}
              </p>
            </div>
            <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-5 shadow-sm">
              <div className="flex items-center gap-1.5 mb-1">
                <p className="font-['Inter'] font-normal text-[13px] text-[#6b7280] dark:text-[#94a3b8]">
                  Total Zone
                </p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="size-3.5 text-[#9ca3af] dark:text-[#6b7280] cursor-pointer hover:text-[#3b82f6] dark:hover:text-[#60a5fa] transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[220px] text-center">
                    The cumulative count of all parking zones across every site.
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="font-['Inter'] font-semibold text-[28px] leading-[32px] text-[#111827] dark:text-[#e8eef5]">
                {totalZones}
              </p>
            </div>
            <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-5 shadow-sm">
              <div className="flex items-center gap-1.5 mb-1">
                <p className="font-['Inter'] font-normal text-[13px] text-[#6b7280] dark:text-[#94a3b8]">
                  Total Inactive Sites
                </p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="size-3.5 text-[#9ca3af] dark:text-[#6b7280] cursor-pointer hover:text-[#3b82f6] dark:hover:text-[#60a5fa] transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[220px] text-center">
                    Sites that are currently suspended or inactive and not accepting vehicles.
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="font-['Inter'] font-semibold text-[28px] leading-[32px] text-[#111827] dark:text-[#e8eef5]">
                {inactiveSites}
              </p>
            </div>
          </div>
        </div>

        {/* Filter + Search Bar */}
        <div className="px-8 mb-6">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search Sites"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg text-[14px] bg-white dark:bg-[#0f1f35] text-[#111827] dark:text-[#e8eef5] placeholder:text-[#6b7280] dark:text-[#94a3b8] dark:placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
            />
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg text-[14px] bg-white dark:bg-[#0f1f35] text-[#111827] dark:text-[#e8eef5] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Trial</option>
              <option>Suspended</option>
            </select>
          </div>
        </div>

        {/* Site Table */}
        <div className="px-8">
          <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#f9fafb] dark:bg-[#0a1628] border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
                    <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">Sites</th>
                    <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">Zone</th>
                    <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">Parking Lot</th>
                    <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">Created</th>
                    <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">Site Status</th>
                    <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSites.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-[#6b7280] dark:text-[#94a3b8]">
                        No sites found matching your filters
                      </td>
                    </tr>
                  ) : (
                    filteredSites.map((site) => (
                    <tr key={site.id} className="border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)]">
                      <td className="px-6 py-4">
                        <Link to={`/management/sites/${site.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                          <div className="size-10 rounded-full bg-[#3b82f6] flex items-center justify-center text-white font-medium text-[14px]">
                            {site.initials}
                          </div>
                          <span className="font-['Inter'] font-medium text-[14px] text-[#111827] dark:text-[#e8eef5]">
                            {site.name}
                          </span>
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-[14px] text-[#6b7280] dark:text-[#94a3b8]">{site.zones}</td>
                      <td className="px-6 py-4 text-[14px] text-[#6b7280] dark:text-[#94a3b8]">{site.facilities}</td>
                      <td className="px-6 py-4 text-[14px] text-[#6b7280] dark:text-[#94a3b8]">{site.created}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium ${
                          site.status === "Active"
                            ? "bg-[#d1fae5] dark:bg-[#065f46] text-[#065f46] dark:text-[#34d399]"
                            : site.status === "Trial"
                            ? "bg-[#fef3c7] dark:bg-[#78350f] text-[#92400e] dark:text-[#fbbf24]"
                            : "bg-[#fee2e2] dark:bg-[#7f1d1d] text-[#991b1b] dark:text-[#f87171]"
                        }`}>
                          {site.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/management/sites/${site.id}`}
                            className="p-1.5 rounded hover:bg-[#e5e7eb] dark:hover:bg-[#4b5563] transition-colors"
                            title="View"
                          >
                            <Eye className="size-4 text-[#6b7280] dark:text-[#94a3b8]" />
                          </Link>
                          <button
                            className="p-1.5 rounded hover:bg-[#fee2e2] dark:hover:bg-[#7f1d1d] transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="size-4 text-[#ef4444] dark:text-[#f87171]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
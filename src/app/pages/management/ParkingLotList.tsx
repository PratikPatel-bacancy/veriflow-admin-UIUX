import { useState } from "react";
import { Edit, Trash2, Info, X, Search, Filter } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/app/components/ui/tooltip";

interface ParkingLot {
  id: string;
  name: string;
  site: string;
  zone: string;
  status: "Active" | "Inactive";
}

const initialLots: ParkingLot[] = [
  { id: "FAC-001", name: "Plaza Garage Level 1",      site: "Pacific Plaza Garage",    zone: "Zone A — Permit Holders Only",        status: "Active" },
  { id: "FAC-002", name: "Plaza Garage Level 2",      site: "Pacific Plaza Garage",    zone: "Zone B — General Public Parking",      status: "Active" },
  { id: "FAC-003", name: "Pacific Centre North Wing", site: "CF Pacific Centre",        zone: "Zone C — Faculty & Staff Reserved",    status: "Active" },
  { id: "FAC-004", name: "Pacific Centre South Wing", site: "CF Pacific Centre",        zone: "Zone D — Short-Term Visitor (2-Hour)", status: "Inactive" },
  { id: "FAC-005", name: "Harbor Main Lot",           site: "Heritage Harbor Parking", zone: "Zone E — EV Charging Stations",        status: "Active" },
];

const labelCls = "block text-sm font-medium text-[#111827] dark:text-[#e8eef5] mb-1.5";
const inputCls = "w-full bg-white dark:bg-[#1a2d47] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg px-3 py-2 text-sm text-[#111827] dark:text-[#e8eef5] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent";

export default function ParkingLotList() {
  const [lots, setLots] = useState<ParkingLot[]>(initialLots);
  const [editingLot, setEditingLot] = useState<ParkingLot | null>(null);
  const [form, setForm] = useState<ParkingLot | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const filteredLots = lots.filter((lot) => {
    const matchesSearch =
      lot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lot.site.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || lot.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openEdit = (lot: ParkingLot) => {
    setEditingLot(lot);
    setForm({ ...lot });
  };

  const closeEdit = () => {
    setEditingLot(null);
    setForm(null);
  };

  const handleSave = () => {
    if (!form) return;
    setLots((prev) => prev.map((l) => (l.id === form.id ? form : l)));
    closeEdit();
  };

  return (
    <div className="flex-1 overflow-auto bg-[#eff6ff] dark:bg-[#0a1628] pb-6">
      {/* KPI Cards */}
      <div className="px-8 pt-8 mb-6">
        <div className="grid grid-cols-2 gap-5">
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
                  The total number of parking lots managed across all sites in the system.
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="font-['Inter'] font-semibold text-[28px] leading-[32px] text-[#111827] dark:text-[#e8eef5]">
              {lots.length}
            </p>
          </div>
          <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-5 shadow-sm">
            <div className="flex items-center gap-1.5 mb-1">
              <p className="font-['Inter'] font-normal text-[13px] text-[#dc2626] dark:text-[#f87171]">
                Today's Active Violations
              </p>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="size-3.5 text-[#dc2626] dark:text-[#f87171] cursor-pointer hover:opacity-70 transition-opacity" />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[220px] text-center">
                  The number of parking violations detected or issued across all lots today.
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="font-['Inter'] font-semibold text-[28px] leading-[32px] text-[#dc2626] dark:text-[#f87171]">
              12
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="px-8 mb-6">
        <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#6b7280] dark:text-[#94a3b8]" />
              <input
                type="text"
                placeholder="Search parking lots..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#f9fafb] dark:bg-[#0a1628] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg pl-10 pr-4 py-2 text-sm text-[#111827] dark:text-[#e8eef5] placeholder:text-[#6b7280] dark:placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
              />
            </div>
            <div className="relative">
              <button
                onClick={() => setShowFilterMenu((v) => !v)}
                className={`border rounded-lg px-4 py-2 flex items-center gap-2 text-sm transition-colors ${
                  statusFilter !== "All"
                    ? "border-[#3b82f6] text-[#3b82f6] bg-[#eff6ff] dark:bg-[rgba(59,130,246,0.1)] dark:border-[#3b82f6] dark:text-[#60a5fa]"
                    : "border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] text-[#111827] dark:text-[#e8eef5] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)]"
                }`}
              >
                <Filter className="size-4" />
                {statusFilter === "All" ? "Filter" : statusFilter}
              </button>
              {showFilterMenu && (
                <div className="absolute right-0 top-10 w-40 bg-white dark:bg-[#1a2d47] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-xl shadow-lg z-20 py-1 text-[13px]">
                  {["All", "Active", "Inactive"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => { setStatusFilter(opt); setShowFilterMenu(false); }}
                      className={`w-full text-left px-4 py-2 transition-colors ${
                        statusFilter === opt
                          ? "text-[#3b82f6] dark:text-[#60a5fa] bg-[#eff6ff] dark:bg-[rgba(59,130,246,0.1)]"
                          : "text-[#111827] dark:text-[#e8eef5] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)]"
                      }`}
                    >
                      {opt === "All" ? "All Statuses" : opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="px-8">
        <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f9fafb] dark:bg-[#0a1628] border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
                {["Lot ID", "Name", "Site", "Zone", "Status", ""].map((h, i) => (
                  <th key={i} className={`px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8] uppercase tracking-wide ${i === 5 ? "text-right" : "text-left"}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredLots.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#6b7280] dark:text-[#94a3b8]">
                    No parking lots found matching your search
                  </td>
                </tr>
              ) : (
                filteredLots.map((lot) => (
                  <tr key={lot.id} className="border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] last:border-0 hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)] transition-colors">
                    <td className="px-6 py-4 text-[14px] font-medium text-[#3b82f6]">{lot.id}</td>
                    <td className="px-6 py-4 text-[14px] font-medium text-[#111827] dark:text-[#e8eef5]">{lot.name}</td>
                    <td className="px-6 py-4 text-[14px] text-[#6b7280] dark:text-[#94a3b8]">{lot.site}</td>
                    <td className="px-6 py-4 text-[14px] text-[#6b7280] dark:text-[#94a3b8]">{lot.zone}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium ${
                        lot.status === "Active"
                          ? "bg-[#d1fae5] dark:bg-[#065f46] text-[#065f46] dark:text-[#34d399]"
                          : "bg-[#fee2e2] dark:bg-[#7f1d1d] text-[#991b1b] dark:text-[#f87171]"
                      }`}>
                        {lot.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(lot)}
                          className="p-1.5 rounded-lg hover:bg-[#eff6ff] dark:hover:bg-[rgba(59,130,246,0.1)] transition-colors"
                          title="Edit"
                        >
                          <Edit className="size-3.5 text-[#3b82f6] dark:text-[#60a5fa]" />
                        </button>
                        <button
                          className="p-1.5 rounded-lg hover:bg-[#fee2e2] dark:hover:bg-[#7f1d1d] transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="size-3.5 text-[#dc2626] dark:text-[#f87171]" />
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

      {/* Edit Modal */}
      {editingLot && form && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={closeEdit} />
          <div className="relative bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-[16px] font-semibold text-[#111827] dark:text-[#e8eef5]">Edit Parking Lot</h2>
                <p className="text-[12px] text-[#6b7280] dark:text-[#94a3b8] mt-0.5">{form.id}</p>
              </div>
              <button onClick={closeEdit} className="p-1.5 rounded-lg hover:bg-[#f3f4f6] dark:hover:bg-[rgba(30,58,95,0.5)] transition-colors">
                <X className="size-4 text-[#6b7280] dark:text-[#94a3b8]" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className={labelCls}>Name</label>
                <input
                  className={inputCls}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label className={labelCls}>Site</label>
                <input
                  className={inputCls}
                  value={form.site}
                  onChange={(e) => setForm({ ...form, site: e.target.value })}
                />
              </div>
              <div>
                <label className={labelCls}>Zone</label>
                <input
                  className={inputCls}
                  value={form.zone}
                  onChange={(e) => setForm({ ...form, zone: e.target.value })}
                />
              </div>
              <div>
                <label className={labelCls}>Status</label>
                <select
                  className={inputCls}
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as ParkingLot["status"] })}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
              <button
                onClick={closeEdit}
                className="px-4 py-2 text-sm font-medium text-[#6b7280] dark:text-[#94a3b8] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium bg-[#3b82f6] dark:bg-[#2563eb] text-white rounded-lg hover:bg-[#2563eb] dark:hover:bg-[#1d4ed8] transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

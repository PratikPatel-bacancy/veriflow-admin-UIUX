import { X, Info } from "lucide-react";
import { useState } from "react";

interface AddFacilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
}

export default function AddFacilityModal({ isOpen, onClose, onSubmit }: AddFacilityModalProps) {
  const [formData, setFormData] = useState({
    site: "",
    facilityName: "",
    facilityType: "",
    capacity: "",
    floor: "",
    status: "Active"
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-[#0f1f35] rounded-lg w-full max-w-[520px] z-50">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0f0f0] dark:border-[rgba(59,130,246,0.15)]">
          <p className="font-['Inter'] font-medium text-[16px] leading-[24px] text-[rgba(0,0,0,0.85)] dark:text-[#e8eef5]">
            Add Facility
          </p>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.3)] rounded transition-colors"
          >
            <X className="size-4 text-[#6b7280] dark:text-[#94a3b8]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-6">
          {/* Info Banner */}
          <div className="flex items-start gap-2 bg-[#e6f4ff] border border-[#91caff] rounded-[2px] p-3 mb-6">
            <Info className="size-4 text-[#1677ff] mt-0.5 flex-shrink-0" />
            <p className="text-[14px] text-[#1677ff]">
              Select a Site first. Hierarchy: Site → Facility → Zone
            </p>
          </div>

          <div className="space-y-6">
            {/* Site */}
            <div className="flex flex-col gap-[10px]">
              <label className="font-['Inter'] font-normal text-[14px] text-[rgba(0,0,0,0.85)] dark:text-[#e8eef5] flex items-center gap-2">
                Site <span className="text-[#ff4d4f]">*</span>
                <Info className="size-3.5 text-[#1890ff]" />
              </label>
              <select
                value={formData.site}
                onChange={(e) => setFormData({ ...formData, site: e.target.value })}
                className="bg-white dark:bg-[#1a2d47] border border-[#d9d9d9] dark:border-[rgba(59,130,246,0.15)] rounded-[2px] px-[15px] py-[5px] h-[32px] text-[14px] text-[#6b7280] dark:text-[#94a3b8] focus:outline-none focus:border-[#1890ff] focus:ring-1 focus:ring-[#1890ff] transition-colors appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTEiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTUgN2wzIDMgMy0zSDV6bTAtNEw4IDAgMiAzaDZ6IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9Ii44NSIvPjwvc3ZnPg==')] bg-[right_15px_center] bg-no-repeat"
              >
                <option value="">Select a site first</option>
                <option value="ucla">UCLA Campus Parking</option>
                <option value="stanford">Stanford University</option>
                <option value="umich">University of Michigan</option>
                <option value="utaustin">UT Austin Campus</option>
                <option value="harvard">Harvard University</option>
              </select>
              <p className="text-[12px] text-[#6b7280] dark:text-[#94a3b8]">
                Site is required — Facility must belong to a Site
              </p>
            </div>

            {/* Facility Name */}
            <div className="flex flex-col">
              <label className="font-['Inter'] font-normal text-[14px] leading-[22px] text-[rgba(0,0,0,0.85)] dark:text-[#e8eef5] pb-2">
                Facility Name
              </label>
              <input
                type="text"
                value={formData.facilityName}
                onChange={(e) => setFormData({ ...formData, facilityName: e.target.value })}
                placeholder="Enter facility name"
                className="bg-white dark:bg-[#1a2d47] border border-[#d9d9d9] dark:border-[rgba(59,130,246,0.15)] rounded-[2px] px-3 py-2 text-[16px] text-[#111827] dark:text-[#e8eef5] placeholder:text-[#6b7280] dark:text-[#94a3b8] focus:outline-none focus:border-[#1890ff] focus:ring-1 focus:ring-[#1890ff] transition-colors"
              />
            </div>

            {/* Facility Type */}
            <div className="flex flex-col gap-[10px]">
              <label className="font-['Inter'] font-normal text-[14px] text-[rgba(0,0,0,0.85)] dark:text-[#e8eef5]">
                Facility Type
              </label>
              <select
                value={formData.facilityType}
                onChange={(e) => setFormData({ ...formData, facilityType: e.target.value })}
                className="bg-white dark:bg-[#1a2d47] border border-[#d9d9d9] dark:border-[rgba(59,130,246,0.15)] rounded-[2px] px-[15px] py-[5px] h-[32px] text-[14px] text-[#6b7280] dark:text-[#94a3b8] focus:outline-none focus:border-[#1890ff] focus:ring-1 focus:ring-[#1890ff] transition-colors appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTEiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTUgN2wzIDMgMy0zSDV6bTAtNEw4IDAgMiAzaDZ6IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9Ii44NSIvPjwvc3ZnPg==')] bg-[right_15px_center] bg-no-repeat"
              >
                <option value="">Select type</option>
                <option value="corridor">On-street Corridor</option>
                <option value="surface">Off-street Surface Lot</option>
                <option value="structure">Multi-level Parking Structure</option>
                <option value="curb">Airport Curb Segment</option>
                <option value="campus-surface">Campus Surface Lot</option>
                <option value="campus-structure">Campus Parking Structure</option>
              </select>
            </div>

            {/* Capacity and Floor */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="font-['Inter'] font-normal text-[14px] leading-[22px] text-[rgba(0,0,0,0.85)] dark:text-[#e8eef5] pb-2">
                  Capacity
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  placeholder="0"
                  className="bg-white dark:bg-[#1a2d47] border border-[#d9d9d9] dark:border-[rgba(59,130,246,0.15)] rounded-[2px] px-3 py-2 text-[16px] text-[#111827] dark:text-[#e8eef5] placeholder:text-[#6b7280] dark:text-[#94a3b8] focus:outline-none focus:border-[#1890ff] focus:ring-1 focus:ring-[#1890ff] transition-colors"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-['Inter'] font-normal text-[14px] leading-[22px] text-[rgba(0,0,0,0.85)] dark:text-[#e8eef5] pb-2">
                  Floor/Level
                </label>
                <input
                  type="text"
                  value={formData.floor}
                  onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                  placeholder="e.g. Level 1"
                  className="bg-white dark:bg-[#1a2d47] border border-[#d9d9d9] dark:border-[rgba(59,130,246,0.15)] rounded-[2px] px-3 py-2 text-[16px] text-[#111827] dark:text-[#e8eef5] placeholder:text-[#6b7280] dark:text-[#94a3b8] focus:outline-none focus:border-[#1890ff] focus:ring-1 focus:ring-[#1890ff] transition-colors"
                />
              </div>
            </div>

            {/* Status */}
            <div className="flex flex-col gap-[10px]">
              <label className="font-['Inter'] font-normal text-[14px] text-[rgba(0,0,0,0.85)] dark:text-[#e8eef5]">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="bg-white dark:bg-[#1a2d47] border border-[#d9d9d9] dark:border-[rgba(59,130,246,0.15)] rounded-[2px] px-[15px] py-[5px] h-[32px] text-[14px] text-[#111827] dark:text-[#e8eef5] focus:outline-none focus:border-[#1890ff] focus:ring-1 focus:ring-[#1890ff] transition-colors appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTEiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTUgN2wzIDMgMy0zSDV6bTAtNEw4IDAgMiAzaDZ6IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9Ii44NSIvPjwvc3ZnPg==')] bg-[right_15px_center] bg-no-repeat"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-[#f0f0f0] dark:border-[rgba(59,130,246,0.15)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-[5px] text-[14px] font-normal text-[rgba(0,0,0,0.85)] dark:text-[#e8eef5] border border-[#d9d9d9] dark:border-[rgba(59,130,246,0.15)] rounded-[2px] hover:text-[#1890ff] hover:border-[#1890ff] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.site || !formData.facilityName || !formData.facilityType}
              className="px-4 py-[5px] text-[14px] font-normal text-white bg-[#1890ff] border border-[#1890ff] rounded-[2px] hover:bg-[#40a9ff] hover:border-[#40a9ff] transition-colors shadow-[0px_2px_0px_0px_rgba(0,0,0,0.04)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Facility
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

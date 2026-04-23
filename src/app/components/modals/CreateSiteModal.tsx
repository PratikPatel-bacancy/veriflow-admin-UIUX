import { X } from "lucide-react";
import { useState } from "react";

interface CreateSiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
}

export default function CreateSiteModal({ isOpen, onClose, onSubmit }: CreateSiteModalProps) {
  const [formData, setFormData] = useState({
    siteName: "",
    siteType: "",
    timezone: "",
    address: "",
    geoLat: "",
    geoLon: "",
    note: ""
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
            Create Site
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
          <div className="space-y-6">
            {/* Site Name */}
            <div className="flex flex-col">
              <label className="font-['Inter'] font-normal text-[14px] leading-[22px] text-[rgba(0,0,0,0.85)] dark:text-[#e8eef5] pb-2">
                Site Name
              </label>
              <input
                type="text"
                value={formData.siteName}
                onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                placeholder="Enter site name"
                className="bg-white dark:bg-[#1a2d47] border border-[#d9d9d9] dark:border-[rgba(59,130,246,0.15)] rounded-[2px] px-3 py-2 text-[16px] text-[#111827] dark:text-[#e8eef5] placeholder:text-[#6b7280] dark:placeholder:text-[#94a3b8] focus:outline-none focus:border-[#1890ff] focus:ring-1 focus:ring-[#1890ff] transition-colors"
              />
            </div>

            {/* Site Type and Timezone */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-[10px]">
                <label className="font-['Inter'] font-normal text-[14px] text-[rgba(0,0,0,0.85)] dark:text-[#e8eef5]">
                  Site Type
                </label>
                <select
                  value={formData.siteType}
                  onChange={(e) => setFormData({ ...formData, siteType: e.target.value })}
                  className="bg-white dark:bg-[#1a2d47] border border-[#d9d9d9] dark:border-[rgba(59,130,246,0.15)] rounded-[2px] px-[15px] py-[5px] h-[32px] text-[14px] text-[#6b7280] dark:text-[#94a3b8] focus:outline-none focus:border-[#1890ff] focus:ring-1 focus:ring-[#1890ff] transition-colors appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTEiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTUgN2wzIDMgMy0zSDV6bTAtNEw4IDAgMiAzaDZ6IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9Ii44NSIvPjwvc3ZnPg==')] bg-[right_15px_center] bg-no-repeat"
                >
                  <option value="">Select type</option>
                  <option value="university">University Campus</option>
                  <option value="airport">Airport</option>
                  <option value="municipality">Municipality</option>
                  <option value="private">Private Lot</option>
                </select>
              </div>

              <div className="flex flex-col gap-[10px]">
                <label className="font-['Inter'] font-normal text-[14px] text-[rgba(0,0,0,0.85)] dark:text-[#e8eef5]">
                  Timezone
                </label>
                <select
                  value={formData.timezone}
                  onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                  className="bg-white dark:bg-[#1a2d47] border border-[#d9d9d9] dark:border-[rgba(59,130,246,0.15)] rounded-[2px] px-[15px] py-[5px] h-[32px] text-[14px] text-[#6b7280] dark:text-[#94a3b8] focus:outline-none focus:border-[#1890ff] focus:ring-1 focus:ring-[#1890ff] transition-colors appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTEiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTUgN2wzIDMgMy0zSDV6bTAtNEw4IDAgMiAzaDZ6IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9Ii44NSIvPjwvc3ZnPg==')] bg-[right_15px_center] bg-no-repeat"
                >
                  <option value="">Select timezone</option>
                  <option value="PST">Pacific Time (PST)</option>
                  <option value="MST">Mountain Time (MST)</option>
                  <option value="CST">Central Time (CST)</option>
                  <option value="EST">Eastern Time (EST)</option>
                </select>
              </div>
            </div>

            {/* Address */}
            <div className="flex flex-col">
              <label className="font-['Inter'] font-normal text-[14px] leading-[22px] text-[rgba(0,0,0,0.85)] dark:text-[#e8eef5] pb-2">
                Address
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter full address"
                rows={3}
                className="bg-white dark:bg-[#1a2d47] border border-[#d9d9d9] dark:border-[rgba(59,130,246,0.15)] rounded-[2px] px-3 py-2 text-[14px] text-[#111827] dark:text-[#e8eef5] placeholder:text-[#6b7280] dark:placeholder:text-[#94a3b8] focus:outline-none focus:border-[#1890ff] focus:ring-1 focus:ring-[#1890ff] transition-colors resize-none"
              />
            </div>

            {/* Geo Lat and Geo Lon */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="font-['Inter'] font-normal text-[14px] leading-[22px] text-[rgba(0,0,0,0.85)] dark:text-[#e8eef5] pb-2">
                  Geo Lat
                </label>
                <input
                  type="text"
                  value={formData.geoLat}
                  onChange={(e) => setFormData({ ...formData, geoLat: e.target.value })}
                  placeholder="e.g., 37.7749"
                  className="bg-white dark:bg-[#1a2d47] border border-[#d9d9d9] dark:border-[rgba(59,130,246,0.15)] rounded-[2px] px-3 py-2 text-[14px] text-[#111827] dark:text-[#e8eef5] placeholder:text-[#6b7280] dark:placeholder:text-[#94a3b8] focus:outline-none focus:border-[#1890ff] focus:ring-1 focus:ring-[#1890ff] transition-colors"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-['Inter'] font-normal text-[14px] leading-[22px] text-[rgba(0,0,0,0.85)] dark:text-[#e8eef5] pb-2">
                  Geo Lon
                </label>
                <input
                  type="text"
                  value={formData.geoLon}
                  onChange={(e) => setFormData({ ...formData, geoLon: e.target.value })}
                  placeholder="e.g., -122.4194"
                  className="bg-white dark:bg-[#1a2d47] border border-[#d9d9d9] dark:border-[rgba(59,130,246,0.15)] rounded-[2px] px-3 py-2 text-[14px] text-[#111827] dark:text-[#e8eef5] placeholder:text-[#6b7280] dark:placeholder:text-[#94a3b8] focus:outline-none focus:border-[#1890ff] focus:ring-1 focus:ring-[#1890ff] transition-colors"
                />
              </div>
            </div>

            {/* Note */}
            <div className="flex flex-col">
              <label className="font-['Inter'] font-normal text-[14px] leading-[22px] text-[rgba(0,0,0,0.85)] dark:text-[#e8eef5] pb-2">
                Note
              </label>
              <textarea
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                placeholder="Add any additional notes"
                rows={3}
                className="bg-white dark:bg-[#1a2d47] border border-[#d9d9d9] dark:border-[rgba(59,130,246,0.15)] rounded-[2px] px-3 py-2 text-[14px] text-[#111827] dark:text-[#e8eef5] placeholder:text-[#6b7280] dark:placeholder:text-[#94a3b8] focus:outline-none focus:border-[#1890ff] focus:ring-1 focus:ring-[#1890ff] transition-colors resize-none"
              />
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
              className="px-4 py-[5px] text-[14px] font-normal text-white bg-[#1890ff] border border-[#1890ff] rounded-[2px] hover:bg-[#40a9ff] hover:border-[#40a9ff] transition-colors shadow-[0px_2px_0px_0px_rgba(0,0,0,0.04)]"
            >
              Create Site
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

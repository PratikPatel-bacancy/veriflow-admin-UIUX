import { X, Info } from "lucide-react";
import { useState } from "react";

interface AddZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
}

export default function AddZoneModal({ isOpen, onClose, onSubmit }: AddZoneModalProps) {
  const [formData, setFormData] = useState({
    site: "",
    zoneName: "",
    zoneType: "",
    policyTemplate: "",
    capacity: "",
    parkingLots: "",
    geometryMethod: "draw",
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
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-[#0f1f35] rounded-lg w-full max-w-[580px] max-h-[90vh] overflow-y-auto z-50">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0f0f0] dark:border-[rgba(59,130,246,0.15)] sticky top-0 bg-white dark:bg-[#0f1f35] z-10">
          <p className="font-['Inter'] font-medium text-[16px] leading-[24px] text-[rgba(0,0,0,0.85)] dark:text-[#e8eef5]">
            Add Zone
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
          <div className="flex items-start gap-2 bg-[#e6f4ff] dark:bg-[#1e3a8a] border border-[#91caff] dark:border-[rgba(59,130,246,0.3)] rounded-[2px] p-3 mb-6">
            <Info className="size-4 text-[#1677ff] dark:text-[#60a5fa] mt-0.5 flex-shrink-0" />
            <p className="text-[14px] text-[#1677ff] dark:text-[#60a5fa]">
              Site must be selected. Hierarchy: Site → Zone
            </p>
          </div>

          <div className="space-y-6">
            {/* Site */}
            <div className="flex flex-col gap-[10px]">
              <label className="font-['Inter'] font-normal text-[14px] text-[rgba(0,0,0,0.85)] dark:text-[#e8eef5] flex items-center gap-2">
                Site <span className="text-[#ff4d4f]">*</span>
                <Info className="size-3.5 text-[#1890ff] dark:text-[#60a5fa]" />
              </label>
              <select
                value={formData.site}
                onChange={(e) => setFormData({ ...formData, site: e.target.value })}
                className="bg-white dark:bg-[#1a2d47] border border-[#d9d9d9] dark:border-[rgba(59,130,246,0.15)] rounded-[2px] px-[15px] py-[5px] h-[32px] text-[14px] text-[#6b7280] dark:text-[#94a3b8] focus:outline-none focus:border-[#1890ff] focus:ring-1 focus:ring-[#1890ff] transition-colors appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTEiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTUgN2wzIDMgMy0zSDV6bTAtNEw4IDAgMiAzaDZ6IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9Ii44NSIvPjwvc3ZnPg==')] bg-[right_15px_center] bg-no-repeat"
              >
                <option value="">Select a site</option>
                <option value="ucla">UCLA Campus Parking</option>
                <option value="stanford">Stanford University</option>
                <option value="umich">University of Michigan</option>
                <option value="utaustin">UT Austin Campus</option>
                <option value="harvard">Harvard University</option>
              </select>
            </div>

            {/* Zone Name */}
            <div className="flex flex-col">
              <label className="font-['Inter'] font-normal text-[14px] leading-[22px] text-[rgba(0,0,0,0.85)] dark:text-[#e8eef5] pb-2">
                Zone Name <span className="text-[#ff4d4f]">*</span>
              </label>
              <input
                type="text"
                value={formData.zoneName}
                onChange={(e) => setFormData({ ...formData, zoneName: e.target.value })}
                placeholder="Enter zone name"
                className="bg-white dark:bg-[#1a2d47] border border-[#d9d9d9] dark:border-[rgba(59,130,246,0.15)] rounded-[2px] px-3 py-2 text-[14px] text-[#111827] dark:text-[#e8eef5] placeholder:text-[#6b7280] dark:placeholder:text-[#94a3b8] focus:outline-none focus:border-[#1890ff] focus:ring-1 focus:ring-[#1890ff] transition-colors"
              />
            </div>

            {/* Zone Type */}
            <div className="flex flex-col gap-[10px]">
              <label className="font-['Inter'] font-normal text-[14px] text-[rgba(0,0,0,0.85)] dark:text-[#e8eef5]">
                Zone Type <span className="text-[#ff4d4f]">*</span>
              </label>
              <select
                value={formData.zoneType}
                onChange={(e) => setFormData({ ...formData, zoneType: e.target.value })}
                className="bg-white dark:bg-[#1a2d47] border border-[#d9d9d9] dark:border-[rgba(59,130,246,0.15)] rounded-[2px] px-[15px] py-[5px] h-[32px] text-[14px] text-[#6b7280] dark:text-[#94a3b8] focus:outline-none focus:border-[#1890ff] focus:ring-1 focus:ring-[#1890ff] transition-colors appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTEiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTUgN2wzIDMgMy0zSDV6bTAtNEw4IDAgMiAzaDZ6IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9Ii44NSIvPjwvc3ZnPg==')] bg-[right_15px_center] bg-no-repeat"
              >
                <option value="">Select type</option>
                <option value="curb">Curb Segment</option>
                <option value="surface">Surface Lot Zone</option>
                <option value="structure">Structure Level & Aisle</option>
              </select>
            </div>

            {/* Policy Template */}
            <div className="flex flex-col gap-[10px]">
              <label className="font-['Inter'] font-normal text-[14px] text-[rgba(0,0,0,0.85)] dark:text-[#e8eef5]">
                Policy Template
              </label>
              <select
                value={formData.policyTemplate}
                onChange={(e) => setFormData({ ...formData, policyTemplate: e.target.value })}
                className="bg-white dark:bg-[#1a2d47] border border-[#d9d9d9] dark:border-[rgba(59,130,246,0.15)] rounded-[2px] px-[15px] py-[5px] h-[32px] text-[14px] text-[#6b7280] dark:text-[#94a3b8] focus:outline-none focus:border-[#1890ff] focus:ring-1 focus:ring-[#1890ff] transition-colors appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTEiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTUgN2wzIDMgMy0zSDV6bTAtNEw4IDAgMiAzaDZ6IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9Ii44NSIvPjwvc3ZnPg==')] bg-[right_15px_center] bg-no-repeat"
              >
                <option value="">None</option>
                <option value="30min">30-min Parking</option>
                <option value="1hour">1-Hour Parking</option>
                <option value="2hour">2-Hour Parking</option>
                <option value="permit">Permit Only</option>
                <option value="loading">Loading Zone</option>
                <option value="pay">Pay-to-Park</option>
                <option value="handicap">Handicap Stall</option>
                <option value="no-stop">No Stopping</option>
              </select>
            </div>

            {/* Capacity */}
            <div className="flex flex-col">
              <label className="font-['Inter'] font-normal text-[14px] leading-[22px] text-[rgba(0,0,0,0.85)] dark:text-[#e8eef5] pb-2">
                Capacity
              </label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                placeholder="0"
                className="bg-white dark:bg-[#1a2d47] border border-[#d9d9d9] dark:border-[rgba(59,130,246,0.15)] rounded-[2px] px-3 py-2 text-[14px] text-[#111827] dark:text-[#e8eef5] placeholder:text-[#6b7280] dark:placeholder:text-[#94a3b8] focus:outline-none focus:border-[#1890ff] focus:ring-1 focus:ring-[#1890ff] transition-colors"
              />
            </div>

            {/* Parking Lots */}
            <div className="flex flex-col">
              <label className="font-['Inter'] font-normal text-[14px] leading-[22px] text-[rgba(0,0,0,0.85)] dark:text-[#e8eef5] pb-2">
                Parking Lots
              </label>
              <input
                type="number"
                value={formData.parkingLots}
                onChange={(e) => setFormData({ ...formData, parkingLots: e.target.value })}
                placeholder="0"
                className="bg-white dark:bg-[#1a2d47] border border-[#d9d9d9] dark:border-[rgba(59,130,246,0.15)] rounded-[2px] px-3 py-2 text-[14px] text-[#111827] dark:text-[#e8eef5] placeholder:text-[#6b7280] dark:placeholder:text-[#94a3b8] focus:outline-none focus:border-[#1890ff] focus:ring-1 focus:ring-[#1890ff] transition-colors"
              />
            </div>

            {/* Geometry */}
            <div className="flex flex-col gap-3">
              <label className="font-['Inter'] font-normal text-[14px] text-[rgba(0,0,0,0.85)] dark:text-[#e8eef5]">
                Geometry
              </label>
              <div className="border border-[#d9d9d9] dark:border-[rgba(59,130,246,0.15)] rounded-[2px] overflow-hidden">
                <div className="flex border-b border-[#d9d9d9] dark:border-[rgba(59,130,246,0.15)]">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, geometryMethod: "draw" })}
                    className={`flex-1 px-4 py-2 text-[14px] transition-colors ${
                      formData.geometryMethod === "draw"
                        ? "bg-white dark:bg-[#0f1f35] text-[#1890ff] dark:text-[#60a5fa] border-b-2 border-[#1890ff] dark:border-[#60a5fa]"
                        : "bg-[#fafafa] dark:bg-[#1a2d47] text-[#6b7280] dark:text-[#94a3b8]"
                    }`}
                  >
                    Draw on Map
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, geometryMethod: "import" })}
                    className={`flex-1 px-4 py-2 text-[14px] transition-colors ${
                      formData.geometryMethod === "import"
                        ? "bg-white dark:bg-[#0f1f35] text-[#1890ff] dark:text-[#60a5fa] border-b-2 border-[#1890ff] dark:border-[#60a5fa]"
                        : "bg-[#fafafa] dark:bg-[#1a2d47] text-[#6b7280] dark:text-[#94a3b8]"
                    }`}
                  >
                    Import File
                  </button>
                </div>
                <div className="p-4 bg-white dark:bg-[#0f1f35]">
                  {formData.geometryMethod === "draw" ? (
                    <div className="bg-[#f5f5f5] dark:bg-[#1a2d47] border border-[#d9d9d9] dark:border-[rgba(59,130,246,0.15)] rounded h-40 flex items-center justify-center">
                      <p className="text-[13px] text-[#6b7280] dark:text-[#94a3b8] text-center px-4">
                        Click to place points. Min 3 points. Close polygon to finish.
                      </p>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-[#d9d9d9] dark:border-[rgba(59,130,246,0.15)] rounded h-40 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#1890ff] dark:hover:border-[#60a5fa] transition-colors">
                      <p className="text-[13px] text-[#6b7280] dark:text-[#94a3b8]">
                        Drop files here or click to upload
                      </p>
                      <p className="text-[12px] text-[#9ca3af] dark:text-[#94a3b8]">
                        Accepts GeoJSON, CSV, or Shapefile
                      </p>
                    </div>
                  )}
                </div>
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
              disabled={!formData.site || !formData.zoneName}
              className="px-4 py-[5px] text-[14px] font-normal text-white bg-[#1890ff] border border-[#1890ff] rounded-[2px] hover:bg-[#40a9ff] hover:border-[#40a9ff] transition-colors shadow-[0px_2px_0px_0px_rgba(0,0,0,0.04)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Zone
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

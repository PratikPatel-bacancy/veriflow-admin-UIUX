import PageHeader from "../../components/common/PageHeader";
import { BarChart3, TrendingUp, Download } from "lucide-react";

export default function Reports() {
  return (
    <div className="p-6">
      <PageHeader
        title="Reports"
        actions={
          <button className="border border-[#e5e7eb] text-[#111827] dark:text-[#e8eef5] font-medium rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-[#eff6ff] dark:hover:bg-[rgba(30,58,95,0.3)] transition-colors">
            <Download className="size-4" />
            Export
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#111827] dark:text-[#e8eef5]">Revenue Trend</h3>
            <TrendingUp className="size-5 text-[#10b981]" />
          </div>
          <div className="h-64 flex items-center justify-center text-[#6b7280] dark:text-[#94a3b8]">
            Revenue chart visualization
          </div>
        </div>
        <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#111827] dark:text-[#e8eef5]">Occupancy Trend</h3>
            <BarChart3 className="size-5 text-[#3b82f6]" />
          </div>
          <div className="h-64 flex items-center justify-center text-[#6b7280] dark:text-[#94a3b8]">
            Occupancy chart visualization
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6">
        <h2 className="font-semibold text-[#111827] dark:text-[#e8eef5] text-lg mb-4">
          Available Reports
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            "Daily Revenue Report",
            "Monthly Usage Report",
            "Violation Summary",
            "Device Status Report",
            "Tenant Performance",
            "Zone Analytics",
          ].map((report, index) => (
            <button
              key={index}
              className="border border-[#e5e7eb] rounded-lg p-4 text-left hover:bg-[#eff6ff] dark:hover:bg-[rgba(30,58,95,0.3)] transition-colors"
            >
              <p className="font-medium text-[#111827] dark:text-[#e8eef5] text-sm">{report}</p>
              <p className="text-xs text-[#6b7280] dark:text-[#94a3b8] mt-1">Click to generate</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

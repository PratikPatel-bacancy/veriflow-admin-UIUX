import PageHeader from "../../components/common/PageHeader";
import { Activity, Clock, Car } from "lucide-react";

export default function UsageStatistics() {
  return (
    <div className="p-6">
      <div className="grid grid-cols-4 gap-6 mb-6">
        <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Total Sessions</span>
            <Activity className="size-5 text-[#3b82f6]" />
          </div>
          <p className="text-3xl font-semibold text-[#111827] dark:text-[#e8eef5]">1,542</p>
          <p className="text-xs text-[#10b981] mt-2">+12.5% from last week</p>
        </div>
        <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Avg Duration</span>
            <Clock className="size-5 text-[#10b981]" />
          </div>
          <p className="text-3xl font-semibold text-[#111827] dark:text-[#e8eef5]">2.3h</p>
          <p className="text-xs text-[#10b981] mt-2">+5.2% from last week</p>
        </div>
        <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Peak Hours</span>
            <Car className="size-5 text-[#f59e0b]" />
          </div>
          <p className="text-3xl font-semibold text-[#111827] dark:text-[#e8eef5]">9-11AM</p>
          <p className="text-xs text-[#6b7280] dark:text-[#94a3b8] mt-2">Morning rush</p>
        </div>
        <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Utilization</span>
            <Activity className="size-5 text-[#8b5cf6]" />
          </div>
          <p className="text-3xl font-semibold text-[#111827] dark:text-[#e8eef5]">82%</p>
          <p className="text-xs text-[#10b981] mt-2">+3.8% from last week</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6">
        <h2 className="font-semibold text-[#111827] dark:text-[#e8eef5] text-lg mb-4">
          Usage Patterns
        </h2>
        <div className="h-96 flex items-center justify-center text-[#6b7280] dark:text-[#94a3b8]">
          Usage pattern visualization will be displayed here
        </div>
      </div>
    </div>
  );
}

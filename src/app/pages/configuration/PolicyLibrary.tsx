import PageHeader from "../../components/common/PageHeader";
import { Plus, Search } from "lucide-react";
import { useState } from "react";

const mockPolicies = [
  {
    id: 1,
    name: "Overstay Policy",
    description: "Rules for vehicles exceeding time limit",
    zones: 12,
    status: "Active",
  },
  {
    id: 2,
    name: "Permit Validation",
    description: "Validation rules for parking permits",
    zones: 8,
    status: "Active",
  },
  {
    id: 3,
    name: "Weekend Rates",
    description: "Special pricing for weekend parking",
    zones: 15,
    status: "Active",
  },
];

export default function PolicyLibrary() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="p-6">
      <PageHeader
        title="Policy Library"
        actions={
          <button className="bg-[#3b82f6] text-white font-medium rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-[#2563eb] transition-colors">
            <Plus className="size-4" />
            Add Policy
          </button>
        }
      />

      <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#6b7280] dark:text-[#94a3b8]" />
          <input
            type="text"
            placeholder="Search policies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#eff6ff] border border-[#e5e7eb] rounded-lg pl-10 pr-4 py-2 text-sm text-[#111827] dark:text-[#e8eef5] placeholder:text-[#6b7280] dark:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {mockPolicies.map((policy) => (
          <div
            key={policy.id}
            className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6 hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-[#111827] dark:text-[#e8eef5] mb-2">{policy.name}</h3>
            <p className="text-sm text-[#6b7280] dark:text-[#94a3b8] mb-4">{policy.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#6b7280] dark:text-[#94a3b8]">
                Applied to {policy.zones} zones
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#d1fae5] text-[#065f46]">
                {policy.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

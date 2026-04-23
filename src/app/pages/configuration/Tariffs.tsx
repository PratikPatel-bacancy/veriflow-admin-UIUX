import PageHeader from "../../components/common/PageHeader";
import { Plus } from "lucide-react";

const mockTariffs = [
  { id: 1, name: "Hourly Rate - Zone A", rate: "$5.00/hour", status: "Active" },
  { id: 2, name: "Daily Rate - Zone A", rate: "$40.00/day", status: "Active" },
  {
    id: 3,
    name: "Hourly Rate - Zone B",
    rate: "$4.50/hour",
    status: "Active",
  },
];

export default function Tariffs() {
  return (
    <div className="p-6">
      <PageHeader
        title="Tariffs"
        actions={
          <button className="bg-[#3b82f6] text-white font-medium rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-[#2563eb] transition-colors">
            <Plus className="size-4" />
            Add Tariff
          </button>
        }
      />

      <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#eff6ff] dark:bg-[#0a1628] border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
            <tr>
              <th className="text-left text-xs font-medium text-[#6b7280] dark:text-[#94a3b8] uppercase tracking-wider px-6 py-3">
                Tariff Name
              </th>
              <th className="text-left text-xs font-medium text-[#6b7280] dark:text-[#94a3b8] uppercase tracking-wider px-6 py-3">
                Rate
              </th>
              <th className="text-left text-xs font-medium text-[#6b7280] dark:text-[#94a3b8] uppercase tracking-wider px-6 py-3">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e7eb] dark:divide-[rgba(59,130,246,0.15)]">
            {mockTariffs.map((tariff) => (
              <tr key={tariff.id} className="hover:bg-[#eff6ff] dark:hover:bg-[rgba(30,58,95,0.3)]">
                <td className="px-6 py-4 font-medium text-[#111827] dark:text-[#e8eef5]">
                  {tariff.name}
                </td>
                <td className="px-6 py-4 text-sm text-[#111827] dark:text-[#e8eef5]">
                  {tariff.rate}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#d1fae5] text-[#065f46]">
                    {tariff.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

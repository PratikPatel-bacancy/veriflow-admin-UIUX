import PageHeader from "../../components/common/PageHeader";
import { Plus } from "lucide-react";

const mockPermits = [
  {
    id: 1,
    number: "P-2024-001",
    holder: "John Doe",
    type: "Monthly",
    zone: "Zone A - P1 Ground",
    validUntil: "2024-05-08",
    status: "Active",
  },
  {
    id: 2,
    number: "P-2024-002",
    holder: "Jane Smith",
    type: "Annual",
    zone: "Zone B - P2 Upper",
    validUntil: "2025-01-15",
    status: "Active",
  },
];

export default function Permits() {
  return (
    <div className="p-6">
      <PageHeader
        title="Permits"
        actions={
          <button className="bg-[#3b82f6] text-white font-medium rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-[#2563eb] transition-colors">
            <Plus className="size-4" />
            Issue Permit
          </button>
        }
      />

      <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#eff6ff] dark:bg-[#0a1628] border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
            <tr>
              <th className="text-left text-xs font-medium text-[#6b7280] dark:text-[#94a3b8] uppercase tracking-wider px-6 py-3">
                Permit Number
              </th>
              <th className="text-left text-xs font-medium text-[#6b7280] dark:text-[#94a3b8] uppercase tracking-wider px-6 py-3">
                Holder
              </th>
              <th className="text-left text-xs font-medium text-[#6b7280] dark:text-[#94a3b8] uppercase tracking-wider px-6 py-3">
                Type
              </th>
              <th className="text-left text-xs font-medium text-[#6b7280] dark:text-[#94a3b8] uppercase tracking-wider px-6 py-3">
                Zone
              </th>
              <th className="text-left text-xs font-medium text-[#6b7280] dark:text-[#94a3b8] uppercase tracking-wider px-6 py-3">
                Valid Until
              </th>
              <th className="text-left text-xs font-medium text-[#6b7280] dark:text-[#94a3b8] uppercase tracking-wider px-6 py-3">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e7eb] dark:divide-[rgba(59,130,246,0.15)]">
            {mockPermits.map((permit) => (
              <tr key={permit.id} className="hover:bg-[#eff6ff] dark:hover:bg-[rgba(30,58,95,0.3)]">
                <td className="px-6 py-4 font-medium text-[#111827] dark:text-[#e8eef5]">
                  {permit.number}
                </td>
                <td className="px-6 py-4 text-sm text-[#111827] dark:text-[#e8eef5]">
                  {permit.holder}
                </td>
                <td className="px-6 py-4 text-sm text-[#6b7280] dark:text-[#94a3b8]">
                  {permit.type}
                </td>
                <td className="px-6 py-4 text-sm text-[#6b7280] dark:text-[#94a3b8]">
                  {permit.zone}
                </td>
                <td className="px-6 py-4 text-sm text-[#6b7280] dark:text-[#94a3b8]">
                  {permit.validUntil}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#d1fae5] text-[#065f46]">
                    {permit.status}
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

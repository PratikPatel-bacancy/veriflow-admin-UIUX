import PageHeader from "../../components/common/PageHeader";
import { Plus, Calendar as CalendarIcon } from "lucide-react";

const mockEvents = [
  {
    id: 1,
    name: "Downtown Festival",
    date: "2024-04-15",
    zones: "Zone A, Zone B",
    impact: "High traffic expected",
    status: "Scheduled",
  },
  {
    id: 2,
    name: "Stadium Event",
    date: "2024-04-20",
    zones: "Zone D",
    impact: "Increased demand",
    status: "Scheduled",
  },
];

export default function EventsCalendar() {
  return (
    <div className="p-6">
      <PageHeader
        title="Events Calendar"
        actions={
          <button className="bg-[#3b82f6] text-white font-medium rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-[#2563eb] transition-colors">
            <Plus className="size-4" />
            Add Event
          </button>
        }
      />

      <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#eff6ff] dark:bg-[#0a1628] border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
            <tr>
              <th className="text-left text-xs font-medium text-[#6b7280] dark:text-[#94a3b8] uppercase tracking-wider px-6 py-3">
                Event Name
              </th>
              <th className="text-left text-xs font-medium text-[#6b7280] dark:text-[#94a3b8] uppercase tracking-wider px-6 py-3">
                Date
              </th>
              <th className="text-left text-xs font-medium text-[#6b7280] dark:text-[#94a3b8] uppercase tracking-wider px-6 py-3">
                Affected Zones
              </th>
              <th className="text-left text-xs font-medium text-[#6b7280] dark:text-[#94a3b8] uppercase tracking-wider px-6 py-3">
                Impact
              </th>
              <th className="text-left text-xs font-medium text-[#6b7280] dark:text-[#94a3b8] uppercase tracking-wider px-6 py-3">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e7eb] dark:divide-[rgba(59,130,246,0.15)]">
            {mockEvents.map((event) => (
              <tr key={event.id} className="hover:bg-[#eff6ff] dark:hover:bg-[rgba(30,58,95,0.3)]">
                <td className="px-6 py-4 font-medium text-[#111827] dark:text-[#e8eef5]">
                  {event.name}
                </td>
                <td className="px-6 py-4 text-sm text-[#111827] dark:text-[#e8eef5]">
                  {event.date}
                </td>
                <td className="px-6 py-4 text-sm text-[#6b7280] dark:text-[#94a3b8]">
                  {event.zones}
                </td>
                <td className="px-6 py-4 text-sm text-[#6b7280] dark:text-[#94a3b8]">
                  {event.impact}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#dbeafe] text-[#1e40af]">
                    {event.status}
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

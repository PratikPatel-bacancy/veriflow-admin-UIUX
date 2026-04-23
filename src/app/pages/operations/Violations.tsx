import PageHeader from "../../components/common/PageHeader";
import { Search, Filter, AlertTriangle, X, FileText } from "lucide-react";
import { useState } from "react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

const mockViolations = [
  {
    id: 1,
    plate: "7ABC123",
    type: "Over Time Limit",
    zone: "Zone D — Short-Term Visitor (2-Hour)",
    location: "Market Street, Meter #2145",
    timestamp: "04/08/2024 10:30 AM",
    fee: "$50.00",
    status: "Pending",
    rule: "2 Hour Parking Limit",
    duration: "4h 30m",
    explanation: "Vehicle exceeded the maximum allowed parking duration of 2 hours in a metered zone during business hours (8 AM - 6 PM weekdays).",
    imageUrl: "https://images.unsplash.com/photo-1758714542281-746d179a2b81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWhpY2xlJTIwcGFya2luZyUyMHZpb2xhdGlvbnxlbnwxfHx8fDE3NzU2NDExMjR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    vehicleInfo: { make: "Toyota", model: "Camry", color: "Silver", type: "Sedan" }
  },
  {
    id: 2,
    plate: "ABC-1234",
    type: "Unauthorized Zone Parking",
    zone: "Zone A — Permit Holders Only",
    location: "Oak Street, Block 400",
    timestamp: "04/08/2024 09:15 AM",
    fee: "$75.00",
    status: "Pending",
    rule: "Permit Required (Residential)",
    duration: "N/A",
    explanation: "Vehicle parked in a permit-only zone without displaying a valid Zone A residential parking permit.",
    imageUrl: "https://images.unsplash.com/photo-1758714542281-746d179a2b81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWhpY2xlJTIwcGFya2luZyUyMHZpb2xhdGlvbnxlbnwxfHx8fDE3NzU2NDExMjR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    vehicleInfo: { make: "Honda", model: "Civic", color: "Blue", type: "Sedan" }
  },
  {
    id: 3,
    plate: "DEF9012",
    type: "Expired Meter",
    zone: "Zone B — General Public Parking",
    location: "Mission Street, Meter #3421",
    timestamp: "04/07/2024 03:45 PM",
    fee: "$35.00",
    status: "Paid",
    rule: "Active Payment Required",
    duration: "1h 15m",
    explanation: "Parking meter expired with $0.00 balance remaining. Vehicle continued parking without adding payment for an additional 1 hour 15 minutes.",
    imageUrl: "https://images.unsplash.com/photo-1758714542281-746d179a2b81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWhpY2xlJTIwcGFya2luZyUyMHZpb2xhdGlvbnxlbnwxfHx8fDE3NzU2NDExMjR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    vehicleInfo: { make: "Ford", model: "Fusion", color: "Black", type: "Sedan" }
  },
];

export default function Violations() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedViolation, setSelectedViolation] = useState<typeof mockViolations[0] | null>(null);

  return (
    <div className="flex-1 overflow-auto bg-[#eff6ff] dark:bg-[#0a1628] p-6">
      <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-4 mb-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#6b7280] dark:text-[#94a3b8]" />
            <input
              type="text"
              placeholder="Search violations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#f9fafb] dark:bg-[#0a1628] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg pl-10 pr-4 py-2 text-sm text-[#111827] dark:text-[#e8eef5] placeholder:text-[#6b7280] dark:placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
            />
          </div>
          <button className="border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg px-4 py-2 flex items-center gap-2 text-sm text-[#111827] dark:text-[#e8eef5] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.3)] transition-colors">
            <Filter className="size-4" />
            Filter
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] overflow-hidden shadow-sm">
        <table className="w-full">
          <thead className="bg-[#f9fafb] dark:bg-[#0a1628] border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
            <tr>
              <th className="text-left text-xs font-medium text-[#6b7280] dark:text-[#94a3b8] uppercase tracking-wider px-6 py-3">
                Plate Number
              </th>
              <th className="text-left text-xs font-medium text-[#6b7280] dark:text-[#94a3b8] uppercase tracking-wider px-6 py-3">
                Violation Type
              </th>
              <th className="text-left text-xs font-medium text-[#6b7280] dark:text-[#94a3b8] uppercase tracking-wider px-6 py-3">
                Zone
              </th>
              <th className="text-left text-xs font-medium text-[#6b7280] dark:text-[#94a3b8] uppercase tracking-wider px-6 py-3">
                Timestamp
              </th>
              <th className="text-left text-xs font-medium text-[#6b7280] dark:text-[#94a3b8] uppercase tracking-wider px-6 py-3">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e7eb] dark:divide-[rgba(59,130,246,0.15)]">
            {mockViolations.map((violation) => (
              <tr
                key={violation.id}
                onClick={() => setSelectedViolation(violation)}
                className="hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)] cursor-pointer"
              >
                <td className="px-6 py-4 font-medium text-[#111827] dark:text-[#e8eef5]">
                  {violation.plate}
                </td>
                <td className="px-6 py-4 text-sm text-[#111827] dark:text-[#e8eef5]">
                  {violation.type}
                </td>
                <td className="px-6 py-4 text-sm text-[#6b7280] dark:text-[#94a3b8]">
                  {violation.zone}
                </td>
                <td className="px-6 py-4 text-sm text-[#6b7280] dark:text-[#94a3b8]">
                  {violation.timestamp}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      violation.status === "Paid"
                        ? "bg-[#d1fae5] dark:bg-[#065f46] text-[#065f46] dark:text-[#6ee7b7]"
                        : "bg-[#fef3c7] dark:bg-[#78350f] text-[#92400e] dark:text-[#fbbf24]"
                    }`}
                  >
                    {violation.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Violation Detail Modal */}
      {selectedViolation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#0f1f35] rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-[#0f1f35] border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-[#111827] dark:text-[#e8eef5] text-xl mb-1">
                  Violation Details
                </h2>
                <p className="text-sm text-[#6b7280] dark:text-[#94a3b8]">
                  {selectedViolation.type} - {selectedViolation.plate}
                </p>
              </div>
              <button
                onClick={() => setSelectedViolation(null)}
                className="p-2 hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.3)] rounded-lg transition-colors"
              >
                <X className="size-5 text-[#6b7280] dark:text-[#94a3b8]" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Badge */}
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium ${
                    selectedViolation.status === "Paid"
                      ? "bg-[#d1fae5] dark:bg-[#065f46] text-[#065f46] dark:text-[#6ee7b7]"
                      : "bg-[#fef3c7] dark:bg-[#78350f] text-[#92400e] dark:text-[#fbbf24]"
                  }`}
                >
                  {selectedViolation.status}
                </span>
                <span className="text-sm font-semibold text-[#111827] dark:text-[#e8eef5]">
                  Fee: {selectedViolation.fee}
                </span>
              </div>

              {/* Evidence Image */}
              <div>
                <label className="block text-sm font-medium text-[#111827] dark:text-[#e8eef5] mb-2">
                  Evidence Image
                </label>
                <div className="rounded-lg overflow-hidden border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
                  <ImageWithFallback
                    src={selectedViolation.imageUrl}
                    alt={`Evidence for ${selectedViolation.plate}`}
                    className="w-full h-64 object-cover"
                  />
                </div>
              </div>

              {/* Rule Summary */}
              <div className="bg-[#fef3c7] dark:bg-[#78350f] border border-[#fbbf24] dark:border-[#f59e0b] rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <FileText className="size-5 text-[#f59e0b] dark:text-[#fbbf24] flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-[#92400e] dark:text-[#fbbf24] mb-1">
                      Parking Rule
                    </h3>
                    <p className="text-sm text-[#78350f] dark:text-[#fde68a]">
                      {selectedViolation.rule}
                    </p>
                  </div>
                </div>
              </div>

              {/* Violation Explanation */}
              <div>
                <h3 className="font-semibold text-[#111827] dark:text-[#e8eef5] mb-2">
                  Violation Explanation
                </h3>
                <p className="text-sm text-[#6b7280] dark:text-[#94a3b8] leading-relaxed">
                  {selectedViolation.explanation}
                </p>
              </div>

              {/* Vehicle Information */}
              <div>
                <h3 className="font-semibold text-[#111827] dark:text-[#e8eef5] mb-3">
                  Vehicle Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#6b7280] dark:text-[#94a3b8] mb-1">
                      Plate Number
                    </label>
                    <p className="text-sm font-medium text-[#111827] dark:text-[#e8eef5]">
                      {selectedViolation.plate}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#6b7280] dark:text-[#94a3b8] mb-1">
                      Vehicle Type
                    </label>
                    <p className="text-sm text-[#111827] dark:text-[#e8eef5]">
                      {selectedViolation.vehicleInfo.type}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#6b7280] dark:text-[#94a3b8] mb-1">
                      Make & Model
                    </label>
                    <p className="text-sm text-[#111827] dark:text-[#e8eef5]">
                      {selectedViolation.vehicleInfo.make} {selectedViolation.vehicleInfo.model}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#6b7280] dark:text-[#94a3b8] mb-1">
                      Color
                    </label>
                    <p className="text-sm text-[#111827] dark:text-[#e8eef5]">
                      {selectedViolation.vehicleInfo.color}
                    </p>
                  </div>
                </div>
              </div>

              {/* Location & Time Details */}
              <div>
                <h3 className="font-semibold text-[#111827] dark:text-[#e8eef5] mb-3">
                  Location & Time Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#6b7280] dark:text-[#94a3b8] mb-1">
                      Zone
                    </label>
                    <p className="text-sm text-[#111827] dark:text-[#e8eef5]">
                      {selectedViolation.zone}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#6b7280] dark:text-[#94a3b8] mb-1">
                      Specific Location
                    </label>
                    <p className="text-sm text-[#111827] dark:text-[#e8eef5]">
                      {selectedViolation.location}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#6b7280] dark:text-[#94a3b8] mb-1">
                      Timestamp
                    </label>
                    <p className="text-sm text-[#111827] dark:text-[#e8eef5]">
                      {selectedViolation.timestamp}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#6b7280] dark:text-[#94a3b8] mb-1">
                      Duration
                    </label>
                    <p className="text-sm text-[#111827] dark:text-[#e8eef5]">
                      {selectedViolation.duration}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
                <button
                  onClick={() => setSelectedViolation(null)}
                  className="border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] text-[#111827] dark:text-[#e8eef5] font-medium rounded-lg px-4 py-2 hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.3)] transition-colors"
                >
                  Close
                </button>
                {selectedViolation.status === "Pending" && (
                  <>
                    <button className="border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] text-[#111827] dark:text-[#e8eef5] font-medium rounded-lg px-4 py-2 hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.3)] transition-colors">
                      Dismiss
                    </button>
                    <button className="bg-[#3b82f6] dark:bg-[#1e3a8a] text-white font-medium rounded-lg px-4 py-2 hover:bg-[#2563eb] dark:hover:bg-[#1e40af] transition-colors">
                      Send Notice
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
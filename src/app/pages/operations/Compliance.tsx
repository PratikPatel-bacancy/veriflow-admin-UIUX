import PageHeader from "../../components/common/PageHeader";
import { CheckCircle2, AlertTriangle, XCircle, Search, Filter, Calendar, X, FileText, Info } from "lucide-react";
import { useState } from "react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

const mockViolations = [
  {
    id: 1,
    plate: "7ABC123",
    type: "Over Time Limit",
    zone: "Downtown Metered Zone",
    location: "Market Street, Meter #2145",
    timestamp: "04/08/2024 10:30 AM",
    date: "04/08/2024",
    fee: "$50.00",
    status: "Pending",
    rule: "2 Hour Parking Limit",
    duration: "4h 30m",
    explanation: "Vehicle exceeded the maximum allowed parking duration of 2 hours in a metered zone during business hours (8 AM - 6 PM weekdays).",
    imageUrl: "https://images.unsplash.com/photo-1758714542281-746d179a2b81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWhpY2xlJTIwcGFya2luZyUyMHZpb2xhdGlvbnxlbnwxfHx8fDE3NzU2NDExMjR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    vehicleInfo: {
      make: "Toyota",
      model: "Camry",
      color: "Silver",
      type: "Sedan"
    }
  },
  {
    id: 2,
    plate: "ABC-1234",
    type: "Unauthorized Zone Parking",
    zone: "Residential Permit Zone",
    location: "Oak Street, Block 400",
    timestamp: "04/08/2024 09:15 AM",
    date: "04/08/2024",
    fee: "$75.00",
    status: "Pending",
    rule: "Permit Required (Residential)",
    duration: "N/A",
    explanation: "Vehicle parked in a residential permit-only zone without displaying a valid Zone A residential parking permit.",
    imageUrl: "https://images.unsplash.com/photo-1758714542281-746d179a2b81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWhpY2xlJTIwcGFya2luZyUyMHZpb2xhdGlvbnxlbnwxfHx8fDE3NzU2NDExMjR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    vehicleInfo: {
      make: "Honda",
      model: "Civic",
      color: "Blue",
      type: "Sedan"
    }
  },
  {
    id: 3,
    plate: "DEF9012",
    type: "Expired Meter",
    zone: "Downtown Metered Zone",
    location: "Mission Street, Meter #3421",
    timestamp: "04/07/2024 03:45 PM",
    date: "04/07/2024",
    fee: "$35.00",
    status: "Paid",
    rule: "Active Payment Required",
    duration: "1h 15m",
    explanation: "Parking meter expired with $0.00 balance remaining. Vehicle continued parking without adding payment for an additional 1 hour 15 minutes.",
    imageUrl: "https://images.unsplash.com/photo-1758714542281-746d179a2b81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWhpY2xlJTIwcGFya2luZyUyMHZpb2xhdGlvbnxlbnwxfHx8fDE3NzU2NDExMjR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    vehicleInfo: {
      make: "Ford",
      model: "Fusion",
      color: "Black",
      type: "Sedan"
    }
  },
  {
    id: 4,
    plate: "GHI3456",
    type: "No Parking Zone",
    zone: "Commercial Loading Zone",
    location: "Broadway & 5th, Loading Bay 2",
    timestamp: "04/07/2024 11:20 AM",
    date: "04/07/2024",
    fee: "$100.00",
    status: "Under Review",
    rule: "No Parking (Peak Hours)",
    duration: "N/A",
    explanation: "Vehicle parked in a commercial loading zone designated for active loading/unloading only during peak hours (7 AM - 7 PM).",
    imageUrl: "https://images.unsplash.com/photo-1758714542281-746d179a2b81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWhpY2xlJTIwcGFya2luZyUyMHZpb2xhdGlvbnxlbnwxfHx8fDE3NzU2NDExMjR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    vehicleInfo: {
      make: "Chevrolet",
      model: "Silverado",
      color: "White",
      type: "Pickup Truck"
    }
  },
  {
    id: 5,
    plate: "7JKL890",
    type: "Expired Meter",
    zone: "Downtown Metered Zone",
    location: "1st Avenue, Meter #1089",
    timestamp: "04/06/2024 02:30 PM",
    date: "04/06/2024",
    fee: "$35.00",
    status: "Paid",
    rule: "Active Payment Required",
    duration: "2h 45m",
    explanation: "Parking meter expired and vehicle remained parked without payment renewal for 2 hours and 45 minutes.",
    imageUrl: "https://images.unsplash.com/photo-1758714542281-746d179a2b81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWhpY2xlJTIwcGFya2luZyUyMHZpb2xhdGlvbnxlbnwxfHx8fDE3NzU2NDExMjR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    vehicleInfo: {
      make: "Nissan",
      model: "Altima",
      color: "Red",
      type: "Sedan"
    }
  },
  {
    id: 6,
    plate: "MNO-2468",
    type: "Unauthorized Zone Parking",
    zone: "Airport Pickup Zone",
    location: "Terminal 2, Cell Phone Lot",
    timestamp: "04/06/2024 10:00 AM",
    date: "04/06/2024",
    fee: "$150.00",
    status: "Pending",
    rule: "15 Minute Time Limit",
    duration: "3h 20m",
    explanation: "Vehicle exceeded 15-minute time limit in airport cell phone waiting lot. Zone designated for active passenger pickup only.",
    imageUrl: "https://images.unsplash.com/photo-1758714542281-746d179a2b81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWhpY2xlJTIwcGFya2luZyUyMHZpb2xhdGlvbnxlbnwxfHx8fDE3NzU2NDExMjR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    vehicleInfo: {
      make: "BMW",
      model: "X5",
      color: "Gray",
      type: "SUV"
    }
  },
  {
    id: 7,
    plate: "7PQR357",
    type: "Unauthorized Zone Parking",
    zone: "Residential Permit Zone",
    location: "Pine Street, Block 200",
    timestamp: "04/05/2024 08:45 AM",
    date: "04/05/2024",
    fee: "$75.00",
    status: "Dismissed",
    rule: "Permit Required (Residential)",
    duration: "N/A",
    explanation: "Vehicle parked in permit-only zone. Violation dismissed after owner provided proof of valid residential parking permit.",
    imageUrl: "https://images.unsplash.com/photo-1758714542281-746d179a2b81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWhpY2xlJTIwcGFya2luZyUyMHZpb2xhdGlvbnxlbnwxfHx8fDE3NzU2NDExMjR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    vehicleInfo: {
      make: "Tesla",
      model: "Model Y",
      color: "Blue",
      type: "SUV"
    }
  },
  {
    id: 8,
    plate: "STU9753",
    type: "Over Time Limit",
    zone: "Downtown Metered Zone",
    location: "Main Street, Meter #4567",
    timestamp: "04/05/2024 01:15 PM",
    date: "04/05/2024",
    fee: "$50.00",
    status: "Paid",
    rule: "2 Hour Parking Limit",
    duration: "3h 05m",
    explanation: "Vehicle exceeded maximum 2-hour parking limit in metered zone during peak business hours.",
    imageUrl: "https://images.unsplash.com/photo-1758714542281-746d179a2b81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWhpY2xlJTIwcGFya2luZyUyMHZpb2xhdGlvbnxlbnwxfHx8fDE3NzU2NDExMjR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    vehicleInfo: {
      make: "Hyundai",
      model: "Sonata",
      color: "White",
      type: "Sedan"
    }
  },
];

export default function Compliance() {
  const [searchQuery, setSearchQuery] = useState("");
  const [zoneFilter, setZoneFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedViolation, setSelectedViolation] = useState<typeof mockViolations[0] | null>(null);

  const filteredViolations = mockViolations.filter((violation) => {
    if (violation.status === "Paid") return false;
    if (searchQuery && !violation.plate.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (zoneFilter !== "all" && !violation.zone.includes(zoneFilter)) {
      return false;
    }
    if (typeFilter !== "all" && violation.type !== typeFilter) {
      return false;
    }
    if (statusFilter !== "all" && violation.status !== statusFilter) {
      return false;
    }
    return true;
  });

  const complianceRate = 94.2;
  const warningsCount = 12;
  const violationsCount = filteredViolations.filter(v => v.status === "Pending" || v.status === "Under Review").length;

  return (
    <div className="flex-1 overflow-auto bg-[#eff6ff] dark:bg-[#0a1628] p-6">
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6 shadow-sm relative">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 group">
              <span className="font-['Inter'] text-[13px] text-[#6b7280] dark:text-[#94a3b8]">Compliant</span>
              <Info className="size-4 text-[#6b7280] dark:text-[#94a3b8] cursor-help" />
              <div className="invisible group-hover:visible absolute left-6 top-12 w-64 bg-[#111827] dark:bg-[#1a2d47] text-white dark:text-[#e8eef5] text-xs rounded-lg px-3 py-2 shadow-lg z-50 border border-transparent dark:border-[rgba(59,130,246,0.15)]">
                Percentage of vehicles following all parking regulations and policies across monitored zones
              </div>
            </div>
            <CheckCircle2 className="size-5 text-[#16a34a] dark:text-[#34d399]" />
          </div>
          <p className="font-['Inter'] font-semibold text-[28px] leading-[32px] text-[#111827] dark:text-[#e8eef5]">{complianceRate}%</p>
        </div>
        <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6 shadow-sm relative">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 group">
              <span className="font-['Inter'] text-[13px] text-[#6b7280] dark:text-[#94a3b8]">Warnings</span>
              <Info className="size-4 text-[#6b7280] dark:text-[#94a3b8] cursor-help" />
              <div className="invisible group-hover:visible absolute left-6 top-12 w-64 bg-[#111827] dark:bg-[#1a2d47] text-white dark:text-[#e8eef5] text-xs rounded-lg px-3 py-2 shadow-lg z-50 border border-transparent dark:border-[rgba(59,130,246,0.15)]">
                Number of vehicles that received a warning for a minor parking rule infraction without a formal citation
              </div>
            </div>
            <AlertTriangle className="size-5 text-[#ea580c] dark:text-[#fb923c]" />
          </div>
          <p className="font-['Inter'] font-semibold text-[28px] leading-[32px] text-[#111827] dark:text-[#e8eef5]">{warningsCount}</p>
        </div>
        <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6 shadow-sm relative">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 group">
              <span className="font-['Inter'] text-[13px] text-[#6b7280] dark:text-[#94a3b8]">Active Violations</span>
              <Info className="size-4 text-[#6b7280] dark:text-[#94a3b8] cursor-help" />
              <div className="invisible group-hover:visible absolute left-6 top-12 w-64 bg-[#111827] dark:bg-[#1a2d47] text-white dark:text-[#e8eef5] text-xs rounded-lg px-3 py-2 shadow-lg z-50 border border-transparent dark:border-[rgba(59,130,246,0.15)]">
                Number of open parking violations that are currently pending review or awaiting action
              </div>
            </div>
            <XCircle className="size-5 text-[#dc2626] dark:text-[#f87171]" />
          </div>
          <p className="font-['Inter'] font-semibold text-[28px] leading-[32px] text-[#111827] dark:text-[#e8eef5]">{violationsCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-4 mb-6 shadow-sm">
        <div className="grid grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#6b7280] dark:text-[#94a3b8]" />
            <input
              type="text"
              placeholder="Search by plate number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#f9fafb] dark:bg-[#0a1628] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg pl-10 pr-4 py-2 text-sm text-[#111827] dark:text-[#e8eef5] placeholder:text-[#6b7280] dark:text-[#94a3b8] dark:placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
            />
          </div>
          <div>
            <select
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
              className="w-full bg-[#f9fafb] dark:bg-[#0a1628] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg px-4 py-2 text-sm text-[#111827] dark:text-[#e8eef5] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
            >
              <option value="all">All Zones</option>
              <option value="Zone A">Zone A</option>
              <option value="Zone B">Zone B</option>
              <option value="Zone C">Zone C</option>
              <option value="Zone D">Zone D</option>
            </select>
          </div>
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full bg-[#f9fafb] dark:bg-[#0a1628] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg px-4 py-2 text-sm text-[#111827] dark:text-[#e8eef5] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="Overstay">Overstay</option>
              <option value="No Permit">No Permit</option>
              <option value="No Payment">No Payment</option>
              <option value="Restricted Area">Restricted Area</option>
              <option value="Disabled Spot">Disabled Spot</option>
            </select>
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[#f9fafb] dark:bg-[#0a1628] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg px-4 py-2 text-sm text-[#111827] dark:text-[#e8eef5] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Under Review">Under Review</option>
              <option value="Dismissed">Dismissed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Violations Table */}
      <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] overflow-hidden shadow-sm">
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
          <tbody className="divide-y divide-[#e5e7eb] dark:divide-[rgba(59,130,246,0.15)] dark:divide-[#374151]">
            {filteredViolations.map((violation) => (
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
                      violation.status === "Pending"
                        ? "bg-[#fef3c7] dark:bg-[#78350f] text-[#92400e] dark:text-[#fbbf24]"
                        : violation.status === "Under Review"
                        ? "bg-[#dbeafe] dark:bg-[#1e3a8a] text-[#1e40af] dark:text-[#60a5fa]"
                        : "bg-[#f3f4f6] dark:bg-[#1a2d47] text-[#374151] dark:text-[#94a3b8]"
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
                      : selectedViolation.status === "Pending"
                      ? "bg-[#fef3c7] dark:bg-[#78350f] text-[#92400e] dark:text-[#fbbf24]"
                      : selectedViolation.status === "Under Review"
                      ? "bg-[#dbeafe] dark:bg-[#1e3a8a] text-[#1e40af] dark:text-[#60a5fa]"
                      : "bg-[#f3f4f6] dark:bg-[#1a2d47] text-[#374151] dark:text-[#94a3b8]"
                  }`}
                >
                  {selectedViolation.status}
                </span>
                <span className="text-sm font-semibold text-[#111827] dark:text-[#e8eef5]">
                  Fee: {selectedViolation.fee}
                </span>
              </div>

              {/* Evidence Images */}
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
import { Car, Clock, X, Play, AlertTriangle, Info } from "lucide-react";
import { useState } from "react";

const liveVehicles = [
  {
    id: 1,
    eventTime: "2025-04-22 14:23:41",
    plate: "8ECCLN",
    state: "USA / FL",
    makeModel: "Nissan Kicks",
    vehicleColor: "Blue (99%)",
    category: "SUV",
    direction: "Moving away",
    bgText: "White / Black",
    imageUrl: "https://images.unsplash.com/photo-1762095210510-68b5d6fadd9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjByZWFyJTIwdmlldyUyMGxpY2Vuc2UlMjBwbGF0ZSUyMHBhcmtpbmclMjBsb3QlMjBzdHJlZXR8ZW58MXx8fHwxNzc2OTM2NzU4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    enforcementVehicle: "Unit 04 Ford Explorer",
    site: "UCLA",
    zone: "Zone A — Permit Holders Only",
    lot: "Lot 2 — North Structure",
    violation: "Overstay",
    violationDetail: "Vehicle exceeded 2-hour parking limit by 45 minutes. Violation recorded at 14:23:41."
  },
  {
    id: 2,
    eventTime: "2025-04-22 14:21:33",
    plate: "H2T4933",
    state: "USA / TX",
    makeModel: "Ford F-150",
    vehicleColor: "Silver (99%)",
    category: "Pickup",
    direction: "Approaching",
    bgText: "White / Black",
    imageUrl: "https://images.unsplash.com/photo-1771634198013-38f38627029b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxjYXIlMjByZWFyJTIwdmlldyUyMGxpY2Vuc2UlMjBwbGF0ZSUyMHBhcmtpbmclMjBsb3QlMjBzdHJlZXR8ZW58MXx8fHwxNzc2OTM2NzU4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    enforcementVehicle: "Unit 07 Chevy Tahoe",
    site: "UCLA",
    zone: "Zone B — General Public Parking",
    lot: "Bruin Lot East — Surface",
    violation: null,
    violationDetail: null
  },
  {
    id: 3,
    eventTime: "2025-04-22 14:19:17",
    plate: "JNK7744",
    state: "USA / CA",
    makeModel: "Toyota Camry",
    vehicleColor: "Black (95%)",
    category: "Sedan",
    direction: "Moving away",
    bgText: "White / Black",
    imageUrl: "https://images.unsplash.com/photo-1776270042035-afe4e600b9dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxjYXIlMjByZWFyJTIwdmlldyUyMGxpY2Vuc2UlMjBwbGF0ZSUyMHBhcmtpbmclMjBsb3QlMjBzdHJlZXR8ZW58MXx8fHwxNzc2OTM2NzU4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    enforcementVehicle: "Unit 12 Ford F-150",
    site: "Stanford",
    zone: "Zone C — Faculty & Staff Reserved",
    lot: "Lot 8 — Visitor Overflow",
    violation: "No Permit",
    violationDetail: "Vehicle parked in faculty zone without required permit. Citation issued."
  },
  {
    id: 4,
    eventTime: "2025-04-22 14:17:06",
    plate: "MKV5547",
    state: "USA / NY",
    makeModel: "Honda CR-V",
    vehicleColor: "Red (99%)",
    category: "SUV",
    direction: "Moving away",
    bgText: "Yellow / Blue",
    imageUrl: "https://images.unsplash.com/photo-1769922927971-f569a7c85c48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxjYXIlMjByZWFyJTIwdmlldyUyMGxpY2Vuc2UlMjBwbGF0ZSUyMHBhcmtpbmclMjBsb3QlMjBzdHJlZXR8ZW58MXx8fHwxNzc2OTM2NzU4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    enforcementVehicle: "Unit 15 Dodge Durango",
    site: "U of Michigan",
    zone: "Zone D — Short-Term Visitor (2-Hour)",
    lot: "Faculty Lot 17 — West",
    violation: null,
    violationDetail: null
  },
  {
    id: 5,
    eventTime: "2025-04-22 14:15:00",
    plate: "DKL3381",
    state: "USA / GA",
    makeModel: "Chevrolet Equinox",
    vehicleColor: "White (98%)",
    category: "SUV",
    direction: "Approaching",
    bgText: "White / Black",
    imageUrl: "https://images.unsplash.com/photo-1766791656506-5b43e15064f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxjYXIlMjByZWFyJTIwdmlldyUyMGxpY2Vuc2UlMjBwbGF0ZSUyMHBhcmtpbmclMjBsb3QlMjBzdHJlZXR8ZW58MXx8fHwxNzc2OTM2NzU4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    enforcementVehicle: "Unit 19 Toyota 4Runner",
    site: "UT Austin",
    zone: "Zone E — EV Charging Stations",
    lot: "EV Priority Lot 32",
    violation: null,
    violationDetail: null
  },
  {
    id: 6,
    eventTime: "2025-04-22 14:13:12",
    plate: "BNQ7712",
    state: "USA / AZ",
    makeModel: "Tesla Model 3",
    vehicleColor: "Gray (99%)",
    category: "Sedan",
    direction: "Approaching",
    bgText: "White / Black",
    imageUrl: "https://images.unsplash.com/photo-1765614082903-f341253b9594?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHxjYXIlMjByZWFyJTIwdmlldyUyMGxpY2Vuc2UlMjBwbGF0ZSUyMHBhcmtpbmclMjBsb3QlMjBzdHJlZXR8ZW58MXx8fHwxNzc2OTM2NzU4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    enforcementVehicle: "Unit 23 Ford Explorer",
    site: "Harvard",
    zone: "Zone F — Accessible Parking (ADA)",
    lot: "Structure P6 — Level B1",
    violation: null,
    violationDetail: null
  },
  {
    id: 7,
    eventTime: "2025-04-22 14:11:44",
    plate: "VKT1148",
    state: "USA / OH",
    makeModel: "Jeep Grand Cherokee",
    vehicleColor: "Blue (98%)",
    category: "SUV",
    direction: "Moving away",
    bgText: "White / Black",
    imageUrl: "https://images.unsplash.com/photo-1736955902359-4d5c8bdb08f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw3fHxjYXIlMjByZWFyJTIwdmlldyUyMGxpY2Vuc2UlMjBwbGF0ZSUyMHBhcmtpbmclMjBsb3QlMjBzdHJlZXR8ZW58MXx8fHwxNzc2OTM2NzU4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    enforcementVehicle: "Unit 04 Ford Explorer",
    site: "UCLA",
    zone: "Zone G — Event Day Overflow",
    lot: "Lot 2 — North Structure",
    violation: "Expired Meter",
    violationDetail: "Parking meter expired 1 hour ago. No payment extension detected."
  },
  {
    id: 8,
    eventTime: "2025-04-22 14:09:07",
    plate: "PLK8993",
    state: "USA / IL",
    makeModel: "BMW 330i",
    vehicleColor: "Black (99%)",
    category: "Sedan",
    direction: "Approaching",
    bgText: "White / Blue",
    imageUrl: "https://images.unsplash.com/photo-1758406717204-e53530024477?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw4fHxjYXIlMjByZWFyJTIwdmlldyUyMGxpY2Vuc2UlMjBwbGF0ZSUyMHBhcmtpbmclMjBsb3QlMjBzdHJlZXR8ZW58MXx8fHwxNzc2OTM2NzU4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    enforcementVehicle: "Unit 07 Chevy Tahoe",
    site: "UCLA",
    zone: "Zone B — General Public Parking",
    lot: "Bruin Lot East — Surface",
    violation: null,
    violationDetail: null
  },
  {
    id: 9,
    eventTime: "2025-04-22 14:07:55",
    plate: "ZTW8845",
    state: "USA / WA",
    makeModel: "Subaru Outback",
    vehicleColor: "Green (96%)",
    category: "Wagon",
    direction: "Moving away",
    bgText: "White / Green",
    imageUrl: "https://images.unsplash.com/photo-1740479231174-43522f4eab3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw5fHxjYXIlMjByZWFyJTIwdmlldyUyMGxpY2Vuc2UlMjBwbGF0ZSUyMHBhcmtpbmclMjBsb3QlMjBzdHJlZXR8ZW58MXx8fHwxNzc2OTM2NzU4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    enforcementVehicle: "Unit 12 Ford F-150",
    site: "Stanford",
    zone: "Zone C — Faculty & Staff Reserved",
    lot: "Lot 8 — Visitor Overflow",
    violation: null,
    violationDetail: null
  },
  {
    id: 10,
    eventTime: "2025-04-22 14:05:34",
    plate: "KNQ2594",
    state: "USA / CO",
    makeModel: "Jeep Wrangler",
    vehicleColor: "Orange (97%)",
    category: "SUV",
    direction: "Approaching",
    bgText: "White / Green",
    imageUrl: "https://images.unsplash.com/photo-1771923065462-7f00a5ccccd6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxMHx8Y2FyJTIwcmVhciUyMHZpZXclMjBsaWNlbnNlJTIwcGxhdGUlMjBwYXJraW5nJTIwbG90JTIwc3RyZWV0fGVufDF8fHx8MTc3NjkzNjc1OHww&ixlib=rb-4.1.0&q=80&w=1080",
    enforcementVehicle: "Unit 15 Dodge Durango",
    site: "U of Michigan",
    zone: "Zone D — Short-Term Visitor (2-Hour)",
    lot: "Faculty Lot 17 — West",
    violation: "Wrong Zone",
    violationDetail: "Vehicle parked in visitor zone with invalid zone permit. Violation detected."
  },
  {
    id: 11,
    eventTime: "2025-04-22 14:03:15",
    plate: "VIP5563",
    state: "USA / NC",
    makeModel: "Hyundai Tucson",
    vehicleColor: "Silver (99%)",
    category: "SUV",
    direction: "Moving away",
    bgText: "White / Blue",
    imageUrl: "https://images.unsplash.com/photo-1764065806171-1a9d3766f019?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxMXx8Y2FyJTIwcmVhciUyMHZpZXclMjBsaWNlbnNlJTIwcGxhdGUlMjBwYXJraW5nJTIwbG90JTIwc3RyZWV0fGVufDF8fHx8MTc3NjkzNjc1OHww&ixlib=rb-4.1.0&q=80&w=1080",
    enforcementVehicle: "Unit 19 Toyota 4Runner",
    site: "UT Austin",
    zone: "Zone E — EV Charging Stations",
    lot: "EV Priority Lot 32",
    violation: null,
    violationDetail: null
  },
  {
    id: 12,
    eventTime: "2025-04-22 14:01:42",
    plate: "MRK7733",
    state: "USA / MA",
    makeModel: "Mazda CX-5",
    vehicleColor: "Red (98%)",
    category: "SUV",
    direction: "Approaching",
    bgText: "White / Red",
    imageUrl: "https://images.unsplash.com/photo-1573569149505-535aa1052e4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxMnx8Y2FyJTIwcmVhciUyMHZpZXclMjBsaWNlbnNlJTIwcGxhdGUlMjBwYXJraW5nJTIwbG90JTIwc3RyZWV0fGVufDF8fHx8MTc3NjkzNjc1OHww&ixlib=rb-4.1.0&q=80&w=1080",
    enforcementVehicle: "Unit 31 Ford Explorer",
    site: "Harvard",
    zone: "Zone H — Motorcycle & Bicycle",
    lot: "Structure P6 — Level B1",
    violation: null,
    violationDetail: null
  },
];

export default function LiveOperations() {
  const [selectedVehicle, setSelectedVehicle] = useState<typeof liveVehicles[0] | null>(null);
  const [activeTab, setActiveTab] = useState<"image" | "video">("image");

  return (
    <div className="flex-1 overflow-auto bg-[#eff6ff] dark:bg-[#0a1628] pb-6">
      {/* Stats */}
      <div className="px-8 pt-6 mb-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6 shadow-sm relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 group">
                <span className="font-['Inter'] text-[13px] text-[#6b7280] dark:text-[#94a3b8]">In session vehicles</span>
                <Info className="size-4 text-[#6b7280] dark:text-[#94a3b8] cursor-help" />
                <div className="invisible group-hover:visible absolute left-6 top-12 w-64 bg-[#111827] dark:bg-[#1a2d47] text-white dark:text-[#e8eef5] text-xs rounded-lg px-3 py-2 shadow-lg z-50 border border-transparent dark:border-[rgba(59,130,246,0.15)]">
                  Total number of vehicles currently active in a parking session across all monitored sites
                </div>
              </div>
              <Car className="size-5 text-[#3b82f6] dark:text-[#60a5fa]" />
            </div>
            <p className="font-['Inter'] font-semibold text-[28px] leading-[32px] text-[#111827] dark:text-[#e8eef5]">287</p>
          </div>
          <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6 shadow-sm relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 group">
                <span className="font-['Inter'] text-[13px] text-[#6b7280] dark:text-[#94a3b8]">Avg Duration</span>
                <Info className="size-4 text-[#6b7280] dark:text-[#94a3b8] cursor-help" />
                <div className="invisible group-hover:visible absolute left-6 top-12 w-64 bg-[#111827] dark:bg-[#1a2d47] text-white dark:text-[#e8eef5] text-xs rounded-lg px-3 py-2 shadow-lg z-50 border border-transparent dark:border-[rgba(59,130,246,0.15)]">
                  Average length of time vehicles have been parked during their current active session
                </div>
              </div>
              <Clock className="size-5 text-[#ea580c] dark:text-[#fb923c]" />
            </div>
            <p className="font-['Inter'] font-semibold text-[28px] leading-[32px] text-[#111827] dark:text-[#e8eef5]">2.5h</p>
          </div>
        </div>
      </div>

      {/* Live Events Table */}
      <div className="px-8">
        <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
            <h2 className="font-['Inter'] font-semibold text-[18px] text-[#111827] dark:text-[#e8eef5]">
              Live Vehicle Events
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f9fafb] dark:bg-[#0a1628] border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
                  <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">
                    Event time
                  </th>
                  <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">
                    License plate
                  </th>
                  <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">
                    Make / Model
                  </th>
                  <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">
                    Vehicle color
                  </th>
                  <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">
                    Enforcement Vehicle
                  </th>
                  <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">
                    Location
                  </th>
                  <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">
                    Direction
                  </th>
                </tr>
              </thead>
              <tbody>
                {liveVehicles.map((vehicle) => (
                  <tr
                    key={vehicle.id}
                    onClick={() => setSelectedVehicle(vehicle)}
                    className="border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)] transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 text-[14px] text-[#6b7280] dark:text-[#94a3b8]">
                      {vehicle.eventTime}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-['Inter'] font-semibold text-[14px] text-[#3b82f6] dark:text-[#60a5fa]">
                        {vehicle.plate}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[14px] text-[#111827] dark:text-[#e8eef5]">
                      {vehicle.makeModel}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`size-3 rounded-full ${
                          vehicle.vehicleColor.includes("Blue") ? "bg-[#3b82f6]" :
                          vehicle.vehicleColor.includes("Silver") || vehicle.vehicleColor.includes("Gray") ? "bg-[#94a3b8]" :
                          vehicle.vehicleColor.includes("Black") ? "bg-[#111827]" :
                          vehicle.vehicleColor.includes("Red") || vehicle.vehicleColor.includes("Orange") ? "bg-[#ef4444]" :
                          vehicle.vehicleColor.includes("White") ? "bg-[#f3f4f6] border border-[#e5e7eb]" :
                          "bg-[#16a34a]"
                        }`} />
                        <span className="text-[14px] text-[#111827] dark:text-[#e8eef5]">
                          {vehicle.vehicleColor}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[14px] text-[#111827] dark:text-[#e8eef5]">
                      {vehicle.enforcementVehicle}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[13px] space-y-0.5">
                        <div className="text-[#111827] dark:text-[#e8eef5] font-medium">{vehicle.site}</div>
                        <div className="text-[#6b7280] dark:text-[#94a3b8]">{vehicle.zone}</div>
                        <div className="text-[#6b7280] dark:text-[#94a3b8]">{vehicle.lot}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[14px] text-[#111827] dark:text-[#e8eef5]">
                      {vehicle.direction}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Vehicle Detail Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => { setSelectedVehicle(null); setActiveTab("image"); }}>
          <div className="bg-white dark:bg-[#0f1f35] rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white dark:bg-[#0f1f35] border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-['Inter'] font-semibold text-[20px] text-[#111827] dark:text-[#e8eef5] mb-1">
                    Vehicle Detection Details
                  </h2>
                  <p className="font-['Inter'] text-[14px] text-[#6b7280] dark:text-[#94a3b8]">
                    License Plate: {selectedVehicle.plate}
                  </p>
                </div>
                <button
                  onClick={() => { setSelectedVehicle(null); setActiveTab("image"); }}
                  className="p-2 hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)] rounded-lg transition-colors"
                >
                  <X className="size-5 text-[#6b7280] dark:text-[#94a3b8]" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Tabs */}
              <div className="flex gap-1 border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
                <button
                  onClick={() => setActiveTab("image")}
                  className={`px-4 py-2 font-['Inter'] text-[14px] font-medium transition-colors ${
                    activeTab === "image"
                      ? "text-[#3b82f6] dark:text-[#60a5fa] border-b-2 border-[#3b82f6] dark:border-[#60a5fa]"
                      : "text-[#6b7280] dark:text-[#94a3b8] hover:text-[#111827] dark:hover:text-[#e8eef5]"
                  }`}
                >
                  Image
                </button>
                <button
                  onClick={() => setActiveTab("video")}
                  className={`px-4 py-2 font-['Inter'] text-[14px] font-medium transition-colors ${
                    activeTab === "video"
                      ? "text-[#3b82f6] dark:text-[#60a5fa] border-b-2 border-[#3b82f6] dark:border-[#60a5fa]"
                      : "text-[#6b7280] dark:text-[#94a3b8] hover:text-[#111827] dark:hover:text-[#e8eef5]"
                  }`}
                >
                  Video
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === "image" ? (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block font-['Inter'] text-[14px] font-medium text-[#111827] dark:text-[#e8eef5]">
                      Captured Image
                    </label>
                    <button onClick={() => setActiveTab("video")} className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-[#3b82f6] dark:text-[#60a5fa] border border-[#3b82f6] dark:border-[#60a5fa] rounded-lg hover:bg-[#3b82f6] hover:text-white dark:hover:bg-[#60a5fa] dark:hover:text-[#0a1628] transition-colors">
                      <Play className="size-4" />
                      Playback Video
                    </button>
                  </div>
                  <div className="relative rounded-xl overflow-hidden border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] bg-[#111827]">
                    <img
                      src={selectedVehicle.imageUrl}
                      alt={`${selectedVehicle.makeModel} - ${selectedVehicle.plate}`}
                      className="w-full h-[450px] object-cover"
                    />
                    <div className="absolute bottom-[18%] left-1/2 -translate-x-1/2">
                      <div className="absolute -top-5 left-0 text-[10px] font-medium text-white bg-[#ea580c] px-2 py-0.5 rounded">
                        License Plate
                      </div>
                      <div className="border-2 border-[#ea580c] rounded-sm px-4 py-1.5 min-w-[120px]">
                        <div className="text-[11px] font-mono font-bold text-white tracking-wider text-center whitespace-nowrap">
                          {selectedVehicle.plate}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block font-['Inter'] text-[14px] font-medium text-[#111827] dark:text-[#e8eef5] mb-3">
                    Playback Video
                  </label>
                  <div className="relative rounded-xl overflow-hidden border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] bg-[#111827] h-[450px] flex items-center justify-center">
                    <div className="text-center">
                      <Play className="size-16 text-white/70 mx-auto mb-3" />
                      <p className="text-[14px] text-white/70">Video playback unavailable</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Location Information */}
              <div>
                <h3 className="font-['Inter'] font-semibold text-[16px] text-[#111827] dark:text-[#e8eef5] mb-4">
                  Location Information
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-[#f9fafb] dark:bg-[#1a2d47] rounded-lg">
                    <p className="text-[12px] text-[#6b7280] dark:text-[#94a3b8] mb-1">Site</p>
                    <p className="text-[15px] font-semibold text-[#111827] dark:text-[#e8eef5]">{selectedVehicle.site}</p>
                  </div>
                  <div className="p-4 bg-[#f9fafb] dark:bg-[#1a2d47] rounded-lg">
                    <p className="text-[12px] text-[#6b7280] dark:text-[#94a3b8] mb-1">Zone</p>
                    <p className="text-[15px] font-semibold text-[#111827] dark:text-[#e8eef5]">{selectedVehicle.zone}</p>
                  </div>
                  <div className="p-4 bg-[#f9fafb] dark:bg-[#1a2d47] rounded-lg">
                    <p className="text-[12px] text-[#6b7280] dark:text-[#94a3b8] mb-1">Lot</p>
                    <p className="text-[15px] font-semibold text-[#111827] dark:text-[#e8eef5]">{selectedVehicle.lot}</p>
                  </div>
                </div>
              </div>

              {/* Enforcement Vehicle */}
              <div>
                <h3 className="font-['Inter'] font-semibold text-[16px] text-[#111827] dark:text-[#e8eef5] mb-4">
                  Enforcement Vehicle
                </h3>
                <div className="p-4 bg-[#f9fafb] dark:bg-[#1a2d47] rounded-lg">
                  <p className="text-[15px] font-semibold text-[#111827] dark:text-[#e8eef5]">{selectedVehicle.enforcementVehicle}</p>
                </div>
              </div>

              {/* Violation Information */}
              {selectedVehicle.violation && (
                <div>
                  <h3 className="font-['Inter'] font-semibold text-[16px] text-[#111827] dark:text-[#e8eef5] mb-4">
                    Violation Information
                  </h3>
                  <div className="p-4 bg-[#fee2e2] dark:bg-[#7f1d1d] rounded-lg border border-[#dc2626] dark:border-[#f87171]">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-[#dc2626] rounded-lg">
                        <AlertTriangle className="size-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[15px] font-semibold text-[#dc2626] dark:text-[#f87171] mb-2">{selectedVehicle.violation}</p>
                        <p className="text-[14px] text-[#991b1b] dark:text-[#fca5a5]">{selectedVehicle.violationDetail}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Vehicle Information */}
              <div>
                <h3 className="font-['Inter'] font-semibold text-[16px] text-[#111827] dark:text-[#e8eef5] mb-4">
                  Vehicle Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-3 border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
                    <label className="font-['Inter'] text-[14px] font-medium text-[#6b7280] dark:text-[#94a3b8]">
                      License Plate
                    </label>
                    <p className="font-['Inter'] text-[16px] font-semibold text-[#111827] dark:text-[#e8eef5]">
                      {selectedVehicle.plate}
                    </p>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
                    <label className="font-['Inter'] text-[14px] font-medium text-[#6b7280] dark:text-[#94a3b8]">
                      Make & Model
                    </label>
                    <p className="font-['Inter'] text-[16px] font-semibold text-[#111827] dark:text-[#e8eef5]">
                      {selectedVehicle.makeModel}
                    </p>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
                    <label className="font-['Inter'] text-[14px] font-medium text-[#6b7280] dark:text-[#94a3b8]">
                      Vehicle Color
                    </label>
                    <p className="font-['Inter'] text-[16px] font-semibold text-[#111827] dark:text-[#e8eef5]">
                      {selectedVehicle.vehicleColor}
                    </p>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
                    <label className="font-['Inter'] text-[14px] font-medium text-[#6b7280] dark:text-[#94a3b8]">
                      Category
                    </label>
                    <p className="font-['Inter'] text-[16px] font-semibold text-[#111827] dark:text-[#e8eef5]">
                      {selectedVehicle.category}
                    </p>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <label className="font-['Inter'] text-[14px] font-medium text-[#6b7280] dark:text-[#94a3b8]">
                      Event Time
                    </label>
                    <p className="font-['Inter'] text-[16px] font-semibold text-[#111827] dark:text-[#e8eef5]">
                      {selectedVehicle.eventTime}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
                <button
                  onClick={() => { setSelectedVehicle(null); setActiveTab("image"); }}
                  className="border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] text-[#111827] dark:text-[#e8eef5] font-medium rounded-lg px-5 py-2.5 hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)] transition-colors"
                >
                  Close
                </button>
                <button className="bg-[#3b82f6] dark:bg-[#1e3a8a] text-white font-medium rounded-lg px-5 py-2.5 hover:bg-[#2563eb] dark:hover:bg-[#1e40af] transition-colors">
                  Download Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
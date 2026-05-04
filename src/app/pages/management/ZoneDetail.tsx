import { useParams, Link } from "react-router";
import { ArrowLeft } from "lucide-react";

const mockVehicles = [
  { id: 1, name: "Unit 04 — Ford Explorer", status: "Active", activeCameras: 4, totalCameras: 4 },
  { id: 2, name: "Unit 07 — Chevy Tahoe", status: "In Service", activeCameras: 3, totalCameras: 4 },
  { id: 3, name: "Unit 12 — Ford F-150", status: "Active", activeCameras: 2, totalCameras: 4 },
  { id: 4, name: "Unit 15 — Dodge Durango", status: "Inactive", activeCameras: 0, totalCameras: 2 },
  { id: 5, name: "Unit 19 — Toyota 4Runner", status: "Active", activeCameras: 3, totalCameras: 4 },
  { id: 6, name: "Unit 23 — Ford Explorer", status: "In Service", activeCameras: 4, totalCameras: 4 },
];

const mockParkingLots = [
  { id: 1, name: "Lot A — North Entry",        capacity: 40,  location: "37.77490, -122.41940", status: "Active" },
  { id: 2, name: "Lot B — South Wing",          capacity: 35,  location: "37.77510, -122.41960", status: "Active" },
  { id: 3, name: "Lot C — Visitor Bay",         capacity: 20,  location: "37.77530, -122.41980", status: "Inactive" },
  { id: 4, name: "Lot D — EV Charging",         capacity: 15,  location: "37.77550, -122.42010", status: "Active" },
  { id: 5, name: "Lot E — Overflow",            capacity: 50,  location: "37.77570, -122.42030", status: "Active" },
  { id: 6, name: "Lot F — Reserved Executive",  capacity: 10,  location: "37.77590, -122.42050", status: "Inactive" },
];

const zoneInfo = {
  site: "Pacific Plaza Garage",
  zoneType: "metered",
  capacity: 170,
  parkingLots: mockParkingLots.length,
};

export default function ZoneDetail() {
  const { id } = useParams();

  return (
    <div className="flex-1 overflow-auto bg-[#eff6ff] dark:bg-[#0a1628] pb-6">
      {/* Breadcrumb */}
      <div className="px-8 pt-6 pb-2">
        <nav className="flex items-center gap-2 text-[14px]">
          <Link to="/" className="text-[#6b7280] dark:text-[#94a3b8] hover:text-[#111827] dark:hover:text-[#e8eef5] transition-colors">
            Dashboard
          </Link>
          <span className="text-[#9ca3af] dark:text-[#4b5563]">/</span>
          <Link to="/management/sites" className="text-[#6b7280] dark:text-[#94a3b8] hover:text-[#111827] dark:hover:text-[#e8eef5] transition-colors">
            Sites
          </Link>
          <span className="text-[#9ca3af] dark:text-[#4b5563]">/</span>
          <span className="font-semibold text-[#111827] dark:text-[#e8eef5]">Zone Detail</span>
        </nav>
      </div>

      {/* Page Header */}
      <div className="px-8 pt-4 pb-6">
        <div className="flex items-center gap-3">
          <Link
            to={-1 as any}
            className="text-[#6b7280] dark:text-[#94a3b8] hover:text-[#111827] dark:hover:text-[#e8eef5] transition-colors"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <h1 className="font-['Inter'] font-semibold text-[24px] leading-[32px] text-[#111827] dark:text-[#e8eef5]">
            Zone A – P1 Ground
          </h1>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#d1fae5] dark:bg-[#065f46] text-[#065f46] dark:text-[#34d399]">
            Active
          </span>
        </div>
      </div>

      {/* Zone Information */}
      <div className="px-8 mb-6">
        <div className="grid grid-cols-4 gap-5">
          {/* Info card — spans 3 cols */}
          <div className="col-span-3 bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-5 shadow-sm">
            <p className="font-semibold text-[14px] text-[#111827] dark:text-[#e8eef5] mb-5">Zone Information</p>
            <div className="grid grid-cols-2 gap-x-12 gap-y-5">
              <div>
                <p className="text-[12px] text-[#6b7280] dark:text-[#94a3b8] mb-1">Site</p>
                <p className="text-[14px] font-semibold text-[#111827] dark:text-[#e8eef5]">{zoneInfo.site}</p>
              </div>
              <div>
                <p className="text-[12px] text-[#6b7280] dark:text-[#94a3b8] mb-1">Zone Type</p>
                <p className="text-[14px] font-semibold text-[#111827] dark:text-[#e8eef5] capitalize">{zoneInfo.zoneType}</p>
              </div>
              <div>
                <p className="text-[12px] text-[#6b7280] dark:text-[#94a3b8] mb-1">Capacity</p>
                <p className="text-[14px] font-semibold text-[#111827] dark:text-[#e8eef5]">{zoneInfo.capacity}</p>
              </div>
              <div>
                <p className="text-[12px] text-[#6b7280] dark:text-[#94a3b8] mb-1">Parking Lots</p>
                <p className="text-[14px] font-semibold text-[#111827] dark:text-[#e8eef5]">{zoneInfo.parkingLots}</p>
              </div>
            </div>
          </div>

          {/* KPI card */}
          <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-5 shadow-sm flex flex-col justify-center gap-5">
            <div>
              <p className="text-[12px] text-[#6b7280] dark:text-[#94a3b8] mb-0.5">Capacity</p>
              <p className="font-bold text-[32px] leading-[38px] text-[#111827] dark:text-[#e8eef5]">{zoneInfo.capacity}</p>
            </div>
            <div>
              <p className="text-[12px] text-[#6b7280] dark:text-[#94a3b8] mb-0.5">Parking Lots</p>
              <p className="font-bold text-[32px] leading-[38px] text-[#111827] dark:text-[#e8eef5]">{zoneInfo.parkingLots}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Parking Lots */}
      <div className="px-8 mb-6">
        <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
            <p className="font-semibold text-[15px] text-[#111827] dark:text-[#e8eef5]">Parking Lots</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f9fafb] dark:bg-[#0a1628] border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
                  <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">Parking Lot Name</th>
                  <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">Capacity</th>
                  <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">Location</th>
                  <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockParkingLots.map((lot) => (
                  <tr key={lot.id} className="border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)]">
                    <td className="px-6 py-4 text-[14px] font-medium text-[#111827] dark:text-[#e8eef5]">{lot.name}</td>
                    <td className="px-6 py-4 text-[14px] text-[#6b7280] dark:text-[#94a3b8]">
                      {lot.capacity != null ? lot.capacity : "—"}
                    </td>
                    <td className="px-6 py-4 text-[14px] text-[#6b7280] dark:text-[#94a3b8]">{lot.location}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium ${
                        lot.status === "Active"
                          ? "bg-[#d1fae5] dark:bg-[#065f46] text-[#065f46] dark:text-[#34d399]"
                          : "bg-[#f3f4f6] dark:bg-[#1e293b] text-[#6b7280] dark:text-[#94a3b8]"
                      }`}>
                        {lot.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Enforcement Vehicles */}
      <div className="px-8 mb-6">
        <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
            <p className="font-semibold text-[15px] text-[#111827] dark:text-[#e8eef5]">Enforcement Vehicles</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f9fafb] dark:bg-[#0a1628] border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
                  <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">Enforcement Vehicle</th>
                  <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">Status</th>
                  <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">Cameras</th>
                </tr>
              </thead>
              <tbody>
                {mockVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)]">
                    <td className="px-6 py-4 text-[14px] font-medium text-[#111827] dark:text-[#e8eef5]">{vehicle.name}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium ${
                        vehicle.status === "Active"
                          ? "bg-[#d1fae5] dark:bg-[#065f46] text-[#065f46] dark:text-[#34d399]"
                          : vehicle.status === "In Service"
                          ? "bg-[#dbeafe] dark:bg-[#1e3a8a] text-[#1e40af] dark:text-[#60a5fa]"
                          : "bg-[#f3f4f6] dark:bg-[#1e293b] text-[#6b7280] dark:text-[#94a3b8]"
                      }`}>
                        {vehicle.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[14px] text-[#111827] dark:text-[#e8eef5]">
                      {vehicle.activeCameras}/{vehicle.totalCameras}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

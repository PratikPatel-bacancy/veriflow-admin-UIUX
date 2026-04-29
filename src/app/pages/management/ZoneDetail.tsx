import { useParams } from "react-router";
import Breadcrumb from "../../components/common/Breadcrumb";
import PageHeader from "../../components/common/PageHeader";
import { Edit } from "lucide-react";
import imgMap from "../../../imports/VeriflowPlus/4ec8c1ebe587929a2c68dc53ed5215c139448b13.png";

const mockVehicles = [
  { id: 1, name: "Unit 04 — Ford Explorer", status: "Active", activeCameras: 4, totalCameras: 4 },
  { id: 2, name: "Unit 07 — Chevy Tahoe", status: "In Service", activeCameras: 3, totalCameras: 4 },
  { id: 3, name: "Unit 12 — Ford F-150", status: "Active", activeCameras: 2, totalCameras: 4 },
  { id: 4, name: "Unit 15 — Dodge Durango", status: "Inactive", activeCameras: 0, totalCameras: 2 },
  { id: 5, name: "Unit 19 — Toyota 4Runner", status: "Active", activeCameras: 3, totalCameras: 4 },
  { id: 6, name: "Unit 23 — Ford Explorer", status: "In Service", activeCameras: 4, totalCameras: 4 },
];

const mockParkingLots = [
  { id: 1, name: "Lot 2 — North Structure (UCLA)", size: 28, occupancy: 88 },
  { id: 2, name: "Bruin Lot East — Surface (UCLA)", size: 25, occupancy: 92 },
  { id: 3, name: "Lot 8 — Visitor Overflow (UCLA)", size: 22, occupancy: 65 },
  { id: 4, name: "Faculty Lot 17 — West (UCLA)", size: 30, occupancy: 72 },
  { id: 5, name: "EV Priority Lot 32 (UCLA)", size: 20, occupancy: 45 },
  { id: 6, name: "Structure P6 — Level B1 (UCLA)", size: 27, occupancy: 82 },
];

export default function ZoneDetail() {
  const { id } = useParams();

  return (
    <div className="p-6">
      <Breadcrumb
        items={[
          { label: "Zones", path: "/management/zones" },
          { label: "Zone A – P1 Ground" },
        ]}
      />

      <PageHeader
        title="Zone A – P1 Ground"
        actions={
          <button className="border border-[#3b82f6] text-[#3b82f6] font-medium rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-[#3b82f6] hover:text-white transition-colors">
            <Edit className="size-4" />
            Edit
          </button>
        }
      />

      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="col-span-2 bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6">
          <h2 className="font-semibold text-[#111827] dark:text-[#e8eef5] text-lg mb-4">
            Zone Information
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-[#6b7280] dark:text-[#94a3b8] mb-1">Facility</p>
              <p className="text-sm font-medium text-[#111827] dark:text-[#e8eef5]">
                North Wing Parking
              </p>
            </div>
            <div>
              <p className="text-xs text-[#6b7280] dark:text-[#94a3b8] mb-1">Site</p>
              <p className="text-sm font-medium text-[#111827] dark:text-[#e8eef5]">
                Main Street Garage
              </p>
            </div>
            <div>
              <p className="text-xs text-[#6b7280] dark:text-[#94a3b8] mb-1">Total Spaces</p>
              <p className="text-sm font-medium text-[#111827] dark:text-[#e8eef5]">50</p>
            </div>
            <div>
              <p className="text-xs text-[#6b7280] dark:text-[#94a3b8] mb-1">Available Spaces</p>
              <p className="text-sm font-medium text-[#111827] dark:text-[#e8eef5]">3</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6 flex items-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#d1fae5] text-[#065f46]">
            Active
          </span>
        </div>
      </div>

      {/* Map View */}
      <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6 mb-6">
        <h2 className="font-semibold text-[#111827] dark:text-[#e8eef5] text-lg mb-4">Zone Map</h2>
        <div className="rounded-lg overflow-hidden border border-[#e5e7eb]">
          <img
            src={imgMap}
            alt="Zone Map"
            className="w-full h-96 object-cover"
          />
        </div>
      </div>

      {/* Enforcement Vehicles */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-[#e5e7eb]">
          <h2 className="font-['Inter'] font-semibold text-[16px] text-[#111827] dark:text-[#e8eef5]">
            Enforcement Vehicles
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#eff6ff] dark:bg-[#0a1628] border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
                <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">Enforcement Vehicle</th>
                <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">Status</th>
                <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">Cameras</th>
              </tr>
            </thead>
            <tbody>
              {mockVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="border-b border-[#e5e7eb] hover:bg-[#eff6ff] dark:hover:bg-[rgba(30,58,95,0.3)]">
                  <td className="px-6 py-4 text-[14px] font-medium text-[#111827] dark:text-[#e8eef5]">{vehicle.name}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium ${
                      vehicle.status === "Active"
                        ? "bg-[#d1fae5] text-[#065f46]"
                        : vehicle.status === "In Service"
                        ? "bg-[#dbeafe] text-[#1e40af]"
                        : "bg-[#e5e7eb] text-[#6b7280] dark:text-[#94a3b8]"
                    }`}>
                      {vehicle.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[14px] text-[#111827] dark:text-[#e8eef5]">
                      {vehicle.activeCameras}/{vehicle.totalCameras}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Parking Lots */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#e5e7eb]">
          <h2 className="font-['Inter'] font-semibold text-[16px] text-[#111827] dark:text-[#e8eef5]">
            Parking Lots
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#eff6ff] dark:bg-[#0a1628] border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
                <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">Parking Lot Name</th>
                <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">Parking Lot Size</th>
              </tr>
            </thead>
            <tbody>
              {mockParkingLots.map((lot) => (
                <tr key={lot.id} className="border-b border-[#e5e7eb] hover:bg-[#eff6ff] dark:hover:bg-[rgba(30,58,95,0.3)]">
                  <td className="px-6 py-4 text-[14px] font-medium text-[#111827] dark:text-[#e8eef5]">{lot.name}</td>
                  <td className="px-6 py-4 text-[14px] text-[#6b7280] dark:text-[#94a3b8]">{lot.size} stalls</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Link } from "react-router";
import { Plus, Edit, Trash2 } from "lucide-react";

const mockTenants = [
  {
    id: "TEN-001",
    name: "Downtown Parking LLC",
    email: "contact@downtownparking.com",
    phone: "+1 (555) 123-4567",
    sites: 12,
    status: "Active",
  },
  {
    id: "TEN-002",
    name: "City Center Management",
    email: "info@citycenter.com",
    phone: "+1 (555) 234-5678",
    sites: 8,
    status: "Active",
  },
  {
    id: "TEN-003",
    name: "Metro Parking Services",
    email: "hello@metroparking.com",
    phone: "+1 (555) 345-6789",
    sites: 15,
    status: "Active",
  },
  {
    id: "TEN-004",
    name: "Suburban Lots Inc",
    email: "support@suburbanlots.com",
    phone: "+1 (555) 456-7890",
    sites: 6,
    status: "Inactive",
  },
  {
    id: "TEN-005",
    name: "Airport Parking Co",
    email: "info@airportparking.com",
    phone: "+1 (555) 567-8901",
    sites: 20,
    status: "Active",
  },
];

export default function TenantList() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="flex-1 overflow-auto bg-[#eff6ff] pb-6">
      {/* Page Header */}
      <div className="px-6 pt-6 pb-6">
        <div className="flex items-start gap-1">
          <div className="flex-1">
            <h1 className="font-['Inter'] font-semibold text-[32px] leading-[36px] text-[#111827] dark:text-[#e8eef5]">
              Tenants
            </h1>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-[#3b82f6] border border-[#3b82f6] rounded-[4px] px-4 py-[5px] flex items-center gap-2 text-white text-[14px] hover:bg-[#2563eb] transition-colors shadow-[0px_2px_0px_0px_rgba(0,0,0,0.04)]"
          >
            <Plus className="size-[14px]" strokeWidth={2} />
            Add Tenant
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 mb-6">
        <div className="bg-white rounded-lg border border-[#d9d9d9] p-[25px] w-full">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-2 flex-1">
              <p className="font-['Inter'] font-normal text-[14px] leading-[20px] tracking-[-0.1504px] text-[#6b7280] dark:text-[#94a3b8]">
                Total Tenants
              </p>
              <p className="font-['Inter'] font-semibold text-[30px] leading-[36px] tracking-[0.3955px] text-[#111827] dark:text-[#e8eef5]">
                {mockTenants.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="px-6">
        <div className="bg-white rounded-lg border border-[#d9d9d9] pb-[14px] pt-6 px-6">
          {/* Table Header */}
          <div className="mb-6">
            <h2 className="font-['Inter'] font-semibold text-[18px] leading-[28px] tracking-[-0.4395px] text-[#111827] dark:text-[#e8eef5]">
              All Tenants
            </h2>
          </div>

          {/* Table */}
          <div className="overflow-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e5e7eb]">
                  <th className="text-left py-3 px-4">
                    <p className="font-['Inter'] font-medium text-[14px] leading-[20px] text-[#6b7280] dark:text-[#94a3b8]">
                      Tenant ID
                    </p>
                  </th>
                  <th className="text-left py-3 px-4">
                    <p className="font-['Inter'] font-medium text-[14px] leading-[20px] text-[#6b7280] dark:text-[#94a3b8]">
                      Name
                    </p>
                  </th>
                  <th className="text-left py-3 px-4">
                    <p className="font-['Inter'] font-medium text-[14px] leading-[20px] text-[#6b7280] dark:text-[#94a3b8]">
                      Email
                    </p>
                  </th>
                  <th className="text-left py-3 px-4">
                    <p className="font-['Inter'] font-medium text-[14px] leading-[20px] text-[#6b7280] dark:text-[#94a3b8]">
                      Phone
                    </p>
                  </th>
                  <th className="text-left py-3 px-4">
                    <p className="font-['Inter'] font-medium text-[14px] leading-[20px] text-[#6b7280] dark:text-[#94a3b8]">
                      Sites
                    </p>
                  </th>
                  <th className="text-left py-3 px-4">
                    <p className="font-['Inter'] font-medium text-[14px] leading-[20px] text-[#6b7280] dark:text-[#94a3b8]">
                      Status
                    </p>
                  </th>
                  <th className="text-right py-3 px-4">
                    <p className="font-['Inter'] font-medium text-[14px] leading-[20px] text-[#6b7280] dark:text-[#94a3b8]">
                      Actions
                    </p>
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockTenants.map((tenant) => (
                  <tr key={tenant.id} className="border-b border-[#e5e7eb] last:border-0 hover:bg-[#eff6ff] dark:hover:bg-[rgba(30,58,95,0.3)] transition-colors">
                    <td className="py-[10px] px-4">
                      <Link 
                        to={`/management/tenants/${tenant.id}`}
                        className="font-['Inter'] font-medium text-[14px] leading-[20px] text-[#3b82f6] hover:underline"
                      >
                        {tenant.id}
                      </Link>
                    </td>
                    <td className="py-[10px] px-4">
                      <p className="font-['Inter'] font-normal text-[14px] leading-[20px] text-[#111827] dark:text-[#e8eef5]">
                        {tenant.name}
                      </p>
                    </td>
                    <td className="py-[10px] px-4">
                      <p className="font-['Inter'] font-normal text-[14px] leading-[20px] text-[#6b7280] dark:text-[#94a3b8]">
                        {tenant.email}
                      </p>
                    </td>
                    <td className="py-[10px] px-4">
                      <p className="font-['Inter'] font-normal text-[14px] leading-[20px] text-[#6b7280] dark:text-[#94a3b8]">
                        {tenant.phone}
                      </p>
                    </td>
                    <td className="py-[10px] px-4">
                      <p className="font-['Inter'] font-normal text-[14px] leading-[20px] text-[#111827] dark:text-[#e8eef5]">
                        {tenant.sites}
                      </p>
                    </td>
                    <td className="py-[10px] px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-[12px] font-medium ${
                        tenant.status === "Active"
                          ? "bg-[#d1fae5] text-[#065f46]"
                          : "bg-[#fee2e2] text-[#991b1b]"
                      }`}>
                        {tenant.status}
                      </span>
                    </td>
                    <td className="py-[10px] px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          className="p-1.5 rounded hover:bg-[#e5e7eb] transition-colors"
                          title="Edit"
                        >
                          <Edit className="size-4 text-[#6b7280] dark:text-[#94a3b8]" />
                        </button>
                        <button 
                          className="p-1.5 rounded hover:bg-[#fee2e2] transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="size-4 text-[#ef4444]" />
                        </button>
                      </div>
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

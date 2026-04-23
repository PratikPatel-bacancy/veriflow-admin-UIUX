import { useParams, Link } from "react-router";
import {
  Edit,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Building2,
  Calendar,
} from "lucide-react";
import Breadcrumb from "../../components/common/Breadcrumb";
import PageHeader from "../../components/common/PageHeader";

const mockTenant = {
  id: 1,
  name: "Downtown Parking LLC",
  email: "contact@downtownparking.com",
  phone: "+1 (555) 123-4567",
  address: "123 Main Street, Downtown, NY 10001",
  sites: 12,
  status: "Active",
  revenue: 45230,
  createdAt: "2024-01-15",
  description:
    "Premier parking management company serving the downtown business district.",
};

const tenantSites = [
  {
    id: 1,
    name: "Main Street Garage",
    address: "100 Main St",
    spaces: 450,
    occupancy: 85,
  },
  {
    id: 2,
    name: "City Center Lot",
    address: "250 Center Ave",
    spaces: 320,
    occupancy: 92,
  },
  {
    id: 3,
    name: "Business District",
    address: "45 Commerce Blvd",
    spaces: 280,
    occupancy: 78,
  },
];

export default function TenantDetail() {
  const { id } = useParams();

  return (
    <div className="p-6">
      <Breadcrumb
        items={[
          { label: "Management", path: "/management/tenants" },
          { label: "Tenants", path: "/management/tenants" },
          { label: mockTenant.name },
        ]}
      />

      <PageHeader
        title={mockTenant.name}
        actions={
          <button className="border border-[#3b82f6] text-[#3b82f6] font-medium rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-[#3b82f6] hover:text-white transition-colors">
            <Edit className="size-4" />
            Edit
          </button>
        }
      />

      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Details Card */}
        <div className="col-span-2 bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6">
          <h2 className="font-semibold text-[#111827] dark:text-[#e8eef5] text-lg mb-4">
            Tenant Information
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="bg-[#3b82f6] bg-opacity-10 rounded-lg p-2">
                <Mail className="size-5 text-[#3b82f6]" />
              </div>
              <div>
                <p className="text-xs text-[#6b7280] dark:text-[#94a3b8] mb-1">Email</p>
                <p className="text-sm font-medium text-[#111827] dark:text-[#e8eef5]">
                  {mockTenant.email}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-[#10b981] bg-opacity-10 rounded-lg p-2">
                <Phone className="size-5 text-[#10b981]" />
              </div>
              <div>
                <p className="text-xs text-[#6b7280] dark:text-[#94a3b8] mb-1">Phone</p>
                <p className="text-sm font-medium text-[#111827] dark:text-[#e8eef5]">
                  {mockTenant.phone}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-[#f59e0b] bg-opacity-10 rounded-lg p-2">
                <MapPin className="size-5 text-[#f59e0b]" />
              </div>
              <div>
                <p className="text-xs text-[#6b7280] dark:text-[#94a3b8] mb-1">Address</p>
                <p className="text-sm font-medium text-[#111827] dark:text-[#e8eef5]">
                  {mockTenant.address}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-[#8b5cf6] bg-opacity-10 rounded-lg p-2">
                <Calendar className="size-5 text-[#8b5cf6]" />
              </div>
              <div>
                <p className="text-xs text-[#6b7280] dark:text-[#94a3b8] mb-1">Member Since</p>
                <p className="text-sm font-medium text-[#111827] dark:text-[#e8eef5]">
                  {new Date(mockTenant.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-[#e5e7eb]">
            <p className="text-xs text-[#6b7280] dark:text-[#94a3b8] mb-2">Description</p>
            <p className="text-sm text-[#111827] dark:text-[#e8eef5]">{mockTenant.description}</p>
          </div>
        </div>

        {/* Stats Card */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Total Sites</span>
              <Building2 className="size-5 text-[#3b82f6]" />
            </div>
            <p className="text-3xl font-semibold text-[#111827] dark:text-[#e8eef5]">
              {mockTenant.sites}
            </p>
          </div>
          <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Monthly Revenue</span>
              <DollarSign className="size-5 text-[#10b981]" />
            </div>
            <p className="text-3xl font-semibold text-[#111827] dark:text-[#e8eef5]">
              ${mockTenant.revenue.toLocaleString()}
            </p>
          </div>
          <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Status</span>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#d1fae5] text-[#065f46]">
              {mockTenant.status}
            </span>
          </div>
        </div>
      </div>

      {/* Sites List */}
      <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
        <div className="px-6 py-4 border-b border-[#e5e7eb]">
          <h2 className="font-semibold text-[#111827] dark:text-[#e8eef5] text-lg">
            Associated Sites
          </h2>
        </div>
        <table className="w-full">
          <thead className="bg-[#eff6ff] dark:bg-[#0a1628] border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
            <tr>
              <th className="text-left text-xs font-medium text-[#6b7280] dark:text-[#94a3b8] uppercase tracking-wider px-6 py-3">
                Site Name
              </th>
              <th className="text-left text-xs font-medium text-[#6b7280] dark:text-[#94a3b8] uppercase tracking-wider px-6 py-3">
                Address
              </th>
              <th className="text-left text-xs font-medium text-[#6b7280] dark:text-[#94a3b8] uppercase tracking-wider px-6 py-3">
                Total Spaces
              </th>
              <th className="text-left text-xs font-medium text-[#6b7280] dark:text-[#94a3b8] uppercase tracking-wider px-6 py-3">
                Occupancy
              </th>
              <th className="text-left text-xs font-medium text-[#6b7280] dark:text-[#94a3b8] uppercase tracking-wider px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e7eb] dark:divide-[rgba(59,130,246,0.15)]">
            {tenantSites.map((site) => (
              <tr key={site.id} className="hover:bg-[#eff6ff] dark:hover:bg-[rgba(30,58,95,0.3)]">
                <td className="px-6 py-4">
                  <Link
                    to={`/management/sites/${site.id}`}
                    className="font-medium text-[#111827] dark:text-[#e8eef5] hover:text-[#3b82f6]"
                  >
                    {site.name}
                  </Link>
                </td>
                <td className="px-6 py-4 text-sm text-[#6b7280] dark:text-[#94a3b8]">
                  {site.address}
                </td>
                <td className="px-6 py-4 text-sm text-[#111827] dark:text-[#e8eef5]">
                  {site.spaces}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-[#e5e7eb] rounded-full h-2 w-20">
                      <div
                        className="bg-[#3b82f6] h-2 rounded-full"
                        style={{ width: `${site.occupancy}%` }}
                      />
                    </div>
                    <span className="text-sm text-[#111827] dark:text-[#e8eef5] min-w-[3rem] text-right">
                      {site.occupancy}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Link
                    to={`/management/sites/${site.id}`}
                    className="text-[#3b82f6] text-sm hover:underline"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

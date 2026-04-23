import PageHeader from "../../components/common/PageHeader";
import { DollarSign, CreditCard, CheckCircle, Search, Filter, Calendar, TrendingUp, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useState } from "react";

const mockTransactions = [
  {
    id: 1,
    plate: "7ABC123",
    amount: 18.50,
    method: "Credit Card",
    status: "Completed",
    zone: "Downtown Metered Zone",
    timestamp: "04/08/2024 01:05 PM",
    date: "04/08/2024",
    duration: "2h 15m",
    transactionId: "TXN-240408-001234"
  },
  {
    id: 2,
    plate: "ABC-1234",
    amount: 14.00,
    method: "Mobile App",
    status: "Completed",
    zone: "Commercial Loading Zone",
    timestamp: "04/08/2024 12:45 PM",
    date: "04/08/2024",
    duration: "1h 45m",
    transactionId: "TXN-240408-001235"
  },
  {
    id: 3,
    plate: "DEF9012",
    amount: 22.00,
    method: "Credit Card",
    status: "Completed",
    zone: "Residential Permit Zone",
    timestamp: "04/08/2024 12:30 PM",
    date: "04/08/2024",
    duration: "2h 45m",
    transactionId: "TXN-240408-001236"
  },
  {
    id: 4,
    plate: "GHI3456",
    amount: 45.00,
    method: "Credit Card",
    status: "Pending",
    zone: "Airport Pickup Zone",
    timestamp: "04/08/2024 12:15 PM",
    date: "04/08/2024",
    duration: "5h 30m",
    transactionId: "TXN-240408-001237"
  },
  {
    id: 5,
    plate: "7JKL890",
    amount: 16.50,
    method: "Mobile App",
    status: "Completed",
    zone: "Downtown Metered Zone",
    timestamp: "04/08/2024 11:50 AM",
    date: "04/08/2024",
    duration: "2h 05m",
    transactionId: "TXN-240408-001238"
  },
  {
    id: 6,
    plate: "MNO-2468",
    amount: 12.00,
    method: "Credit Card",
    status: "Failed",
    zone: "Commercial Loading Zone",
    timestamp: "04/08/2024 11:30 AM",
    date: "04/08/2024",
    duration: "1h 30m",
    transactionId: "TXN-240408-001239"
  },
  {
    id: 7,
    plate: "7PQR357",
    amount: 28.00,
    method: "Mobile App",
    status: "Completed",
    zone: "Downtown Metered Zone",
    timestamp: "04/08/2024 11:00 AM",
    date: "04/08/2024",
    duration: "3h 30m",
    transactionId: "TXN-240408-001240"
  },
  {
    id: 8,
    plate: "STU9753",
    amount: 19.50,
    method: "Credit Card",
    status: "Completed",
    zone: "Residential Permit Zone",
    timestamp: "04/08/2024 10:45 AM",
    date: "04/08/2024",
    duration: "2h 25m",
    transactionId: "TXN-240408-001241"
  },
  {
    id: 9,
    plate: "VWX-4680",
    amount: 24.50,
    method: "Credit Card",
    status: "Completed",
    zone: "Airport Pickup Zone",
    timestamp: "04/08/2024 10:20 AM",
    date: "04/08/2024",
    duration: "3h 05m",
    transactionId: "TXN-240408-001242"
  },
  {
    id: 10,
    plate: "YZA-1593",
    amount: 31.00,
    method: "Mobile App",
    status: "Completed",
    zone: "Commercial Loading Zone",
    timestamp: "04/08/2024 09:55 AM",
    date: "04/08/2024",
    duration: "3h 52m",
    transactionId: "TXN-240408-001243"
  },
];

export default function Payments() {
  const [searchQuery, setSearchQuery] = useState("");
  const [zoneFilter, setZoneFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState("today");

  const filteredTransactions = mockTransactions.filter((transaction) => {
    if (searchQuery && !transaction.plate.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (zoneFilter !== "all" && !transaction.zone.includes(zoneFilter)) {
      return false;
    }
    if (statusFilter !== "all" && transaction.status !== statusFilter) {
      return false;
    }
    return true;
  });

  const todayRevenue = filteredTransactions
    .filter(t => t.status === "Completed")
    .reduce((sum, t) => sum + t.amount, 0);
  const transactionCount = filteredTransactions.length;
  const successRate = ((filteredTransactions.filter(t => t.status === "Completed").length / filteredTransactions.length) * 100).toFixed(1);

  return (
    <div className="p-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Today's Revenue</span>
            <DollarSign className="size-5 text-[#10b981]" />
          </div>
          <p className="text-3xl font-semibold text-[#111827] dark:text-[#e8eef5]">
            ${todayRevenue.toFixed(2)}
          </p>
          <div className="flex items-center gap-1 text-sm text-[#10b981] mt-2">
            <ArrowUpRight className="size-4" />
            <span>+12.5%</span>
          </div>
        </div>
        <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Transactions</span>
            <CreditCard className="size-5 text-[#3b82f6]" />
          </div>
          <p className="text-3xl font-semibold text-[#111827] dark:text-[#e8eef5]">{transactionCount}</p>
          <div className="flex items-center gap-1 text-sm text-[#10b981] mt-2">
            <ArrowUpRight className="size-4" />
            <span>+8.3%</span>
          </div>
        </div>
        <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Success Rate</span>
            <CheckCircle className="size-5 text-[#10b981]" />
          </div>
          <p className="text-3xl font-semibold text-[#111827] dark:text-[#e8eef5]">{successRate}%</p>
          <div className="flex items-center gap-1 text-sm text-[#6b7280] dark:text-[#94a3b8] mt-2">
            <span className="text-xs">Target: 98%</span>
          </div>
        </div>
        <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Avg Transaction</span>
            <TrendingUp className="size-5 text-[#f59e0b]" />
          </div>
          <p className="text-3xl font-semibold text-[#111827] dark:text-[#e8eef5]">
            ${(todayRevenue / Math.max(filteredTransactions.filter(t => t.status === "Completed").length, 1)).toFixed(2)}
          </p>
          <div className="flex items-center gap-1 text-sm text-[#10b981] mt-2">
            <ArrowUpRight className="size-4" />
            <span>+5.2%</span>
          </div>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6">
          <h3 className="font-semibold text-[#111827] dark:text-[#e8eef5] mb-4">Payment Methods</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-[#3b82f6]" />
                <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Credit Card</span>
              </div>
              <span className="text-sm font-medium text-[#111827] dark:text-[#e8eef5]">45%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-[#10b981]" />
                <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Mobile App</span>
              </div>
              <span className="text-sm font-medium text-[#111827] dark:text-[#e8eef5]">40%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-[#f59e0b]" />
                <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Cash</span>
              </div>
              <span className="text-sm font-medium text-[#111827] dark:text-[#e8eef5]">15%</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6">
          <h3 className="font-semibold text-[#111827] dark:text-[#e8eef5] mb-4">Top Zones by Revenue</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Zone A - P1 Ground</span>
              <span className="text-sm font-medium text-[#111827] dark:text-[#e8eef5]">$1,245</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Zone D - Underground</span>
              <span className="text-sm font-medium text-[#111827] dark:text-[#e8eef5]">$1,089</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Zone B - P2 Upper</span>
              <span className="text-sm font-medium text-[#111827] dark:text-[#e8eef5]">$920</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6">
          <h3 className="font-semibold text-[#111827] dark:text-[#e8eef5] mb-4">Revenue Trend</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">This Week</span>
              <div className="flex items-center gap-1 text-sm font-medium text-[#10b981]">
                <ArrowUpRight className="size-3" />
                <span>$18,450</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Last Week</span>
              <span className="text-sm font-medium text-[#111827] dark:text-[#e8eef5]">$16,230</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Growth</span>
              <span className="text-sm font-medium text-[#10b981]">+13.7%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-4 mb-6">
        <div className="grid grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#6b7280] dark:text-[#94a3b8]" />
            <input
              type="text"
              placeholder="Search by plate number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#eff6ff] border border-[#e5e7eb] rounded-lg pl-10 pr-4 py-2 text-sm text-[#111827] dark:text-[#e8eef5] placeholder:text-[#6b7280] dark:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
            />
          </div>
          <div>
            <select
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
              className="w-full bg-[#eff6ff] border border-[#e5e7eb] rounded-lg px-4 py-2 text-sm text-[#111827] dark:text-[#e8eef5] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[#eff6ff] border border-[#e5e7eb] rounded-lg px-4 py-2 text-sm text-[#111827] dark:text-[#e8eef5] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
          <div>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full bg-[#eff6ff] border border-[#e5e7eb] rounded-lg px-4 py-2 text-sm text-[#111827] dark:text-[#e8eef5] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#e5e7eb]">
          <h2 className="font-semibold text-[#111827] dark:text-[#e8eef5] text-lg">
            Recent Transactions
          </h2>
        </div>
        <table className="w-full">
          <thead className="bg-[#eff6ff] dark:bg-[#0a1628] border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
            <tr>
              <th className="text-left text-xs font-medium text-[#6b7280] dark:text-[#94a3b8] uppercase tracking-wider px-6 py-3">
                Transaction ID
              </th>
              <th className="text-left text-xs font-medium text-[#6b7280] dark:text-[#94a3b8] uppercase tracking-wider px-6 py-3">
                Plate Number
              </th>
              <th className="text-left text-xs font-medium text-[#6b7280] dark:text-[#94a3b8] uppercase tracking-wider px-6 py-3">
                Zone
              </th>
              <th className="text-left text-xs font-medium text-[#6b7280] dark:text-[#94a3b8] uppercase tracking-wider px-6 py-3">
                Duration
              </th>
              <th className="text-left text-xs font-medium text-[#6b7280] dark:text-[#94a3b8] uppercase tracking-wider px-6 py-3">
                Amount
              </th>
              <th className="text-left text-xs font-medium text-[#6b7280] dark:text-[#94a3b8] uppercase tracking-wider px-6 py-3">
                Method
              </th>
              <th className="text-left text-xs font-medium text-[#6b7280] dark:text-[#94a3b8] uppercase tracking-wider px-6 py-3">
                Status
              </th>
              <th className="text-left text-xs font-medium text-[#6b7280] dark:text-[#94a3b8] uppercase tracking-wider px-6 py-3">
                Timestamp
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e7eb] dark:divide-[rgba(59,130,246,0.15)]">
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-[#eff6ff] dark:hover:bg-[rgba(30,58,95,0.3)]">
                <td className="px-6 py-4 text-sm font-mono text-[#6b7280] dark:text-[#94a3b8]">
                  {transaction.transactionId}
                </td>
                <td className="px-6 py-4 font-medium text-[#111827] dark:text-[#e8eef5]">
                  {transaction.plate}
                </td>
                <td className="px-6 py-4 text-sm text-[#6b7280] dark:text-[#94a3b8]">
                  {transaction.zone}
                </td>
                <td className="px-6 py-4 text-sm text-[#111827] dark:text-[#e8eef5]">
                  {transaction.duration}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-[#111827] dark:text-[#e8eef5]">
                  ${transaction.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm text-[#6b7280] dark:text-[#94a3b8]">
                  {transaction.method}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.status === "Completed"
                        ? "bg-[#d1fae5] text-[#065f46]"
                        : transaction.status === "Pending"
                        ? "bg-[#fef3c7] text-[#92400e]"
                        : "bg-[#fee2e2] text-[#991b1b]"
                    }`}
                  >
                    {transaction.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-[#6b7280] dark:text-[#94a3b8]">
                  {transaction.timestamp}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
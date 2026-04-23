import { Link } from "react-router";
import { useState } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Wifi,
  Maximize2,
  Info,
  Building2,
  MapPin,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [selectedSite, setSelectedSite] = useState("all");
  const [selectedZone, setSelectedZone] = useState("all");

  // Revenue data for April 1-30 with realistic fluctuations
  const revenueData = [
    { date: "Apr 1", day: 1, revenue: 180 },
    { date: "Apr 2", day: 2, revenue: 265 },
    { date: "Apr 3", day: 3, revenue: 310 },
    { date: "Apr 4", day: 4, revenue: 290 },
    { date: "Apr 5", day: 5, revenue: 95 },
    { date: "Apr 6", day: 6, revenue: 60 },
    { date: "Apr 7", day: 7, revenue: 230 },
    { date: "Apr 8", day: 8, revenue: 275 },
    { date: "Apr 9", day: 9, revenue: 190 },
    { date: "Apr 10", day: 10, revenue: 320 },
    { date: "Apr 11", day: 11, revenue: 340 },
    { date: "Apr 12", day: 12, revenue: 80 },
    { date: "Apr 13", day: 13, revenue: 55 },
    { date: "Apr 14", day: 14, revenue: 240 },
    { date: "Apr 15", day: 15, revenue: 285 },
    { date: "Apr 16", day: 16, revenue: 330 },
    { date: "Apr 17", day: 17, revenue: 210 },
    { date: "Apr 18", day: 18, revenue: 360 },
    { date: "Apr 19", day: 19, revenue: 90 },
    { date: "Apr 20", day: 20, revenue: 65 },
    { date: "Apr 21", day: 21, revenue: 195 },
    { date: "Apr 22", day: 22, revenue: 270 },
    { date: "Apr 23", day: 23, revenue: 315 },
    { date: "Apr 24", day: 24, revenue: 220 },
    { date: "Apr 25", day: 25, revenue: 380 },
    { date: "Apr 26", day: 26, revenue: 100 },
    { date: "Apr 27", day: 27, revenue: 70 },
    { date: "Apr 28", day: 28, revenue: 250 },
    { date: "Apr 29", day: 29, revenue: 295 },
    { date: "Apr 30", day: 30, revenue: 310 },
  ];

  return (
    <div className="flex-1 overflow-auto bg-[#eff6ff] dark:bg-[#0a1628] pb-6">
      {/* Company Title */}
      <div className="px-8 pt-8 pb-2">
        <h1 className="font-sans font-semibold text-[32px] leading-[40px] text-[#111827] dark:text-[#e8eef5]">
          Pacific Parking Authority
        </h1>
      </div>

      {/* KPI Cards - 5 Cards in Single Row */}
      <div className="px-8 pt-6 mb-6">
        <div className="grid grid-cols-4 gap-5">
          {/* Active Events */}
          <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-5 shadow-sm relative">
            <div className="flex items-start justify-between mb-3">
              <div className="bg-[#dbeafe] dark:bg-[#1e3a8a] rounded-lg p-2.5">
                <Activity
                  className="size-5 text-[#3b82f6] dark:text-[#60a5fa]"
                  strokeWidth={2}
                />
              </div>
              <div className="group">
                <Info className="size-4 text-[#6b7280] dark:text-[#94a3b8] cursor-help" />
                <div className="invisible group-hover:visible absolute right-5 top-14 w-64 bg-[#111827] dark:bg-[#1a2d47] text-white dark:text-[#e8eef5] text-xs rounded-lg px-3 py-2 shadow-lg z-50 border border-transparent dark:border-[rgba(59,130,246,0.15)]">
                  Total number of parking events currently
                  active across all sites and zones
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <p className="font-sans font-normal text-[13px] text-[#6b7280] dark:text-[#94a3b8]">
                Active Events
              </p>
              <p className="font-sans font-semibold text-[28px] leading-[32px] text-[#111827] dark:text-[#e8eef5]">
                1,234
              </p>
            </div>
          </div>

          {/* Violations Today */}
          <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-5 shadow-sm relative">
            <div className="flex items-start justify-between mb-3">
              <div className="bg-[#fee2e2] dark:bg-[#7f1d1d] rounded-lg p-2.5">
                <AlertTriangle
                  className="size-5 text-[#dc2626] dark:text-[#f87171]"
                  strokeWidth={2}
                />
              </div>
              <div className="group">
                <Info className="size-4 text-[#6b7280] dark:text-[#94a3b8] cursor-help" />
                <div className="invisible group-hover:visible absolute right-5 top-14 w-64 bg-[#111827] dark:bg-[#1a2d47] text-white dark:text-[#e8eef5] text-xs rounded-lg px-3 py-2 shadow-lg z-50 border border-transparent dark:border-[rgba(59,130,246,0.15)]">
                  Number of parking violations detected and
                  recorded today across all monitored locations
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <p className="font-sans font-normal text-[13px] text-[#6b7280] dark:text-[#94a3b8]">
                Violations Today
              </p>
              <p className="font-sans font-semibold text-[28px] leading-[32px] text-[#111827] dark:text-[#e8eef5]">
                293
              </p>
            </div>
          </div>

          {/* Compliance Rate */}
          <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-5 shadow-sm relative">
            <div className="flex items-start justify-between mb-3">
              <div className="bg-[#d1fae5] dark:bg-[#065f46] rounded-lg p-2.5">
                <CheckCircle
                  className="size-5 text-[#16a34a] dark:text-[#34d399]"
                  strokeWidth={2}
                />
              </div>
              <div className="group">
                <Info className="size-4 text-[#6b7280] dark:text-[#94a3b8] cursor-help" />
                <div className="invisible group-hover:visible absolute right-5 top-14 w-64 bg-[#111827] dark:bg-[#1a2d47] text-white dark:text-[#e8eef5] text-xs rounded-lg px-3 py-2 shadow-lg z-50 border border-transparent dark:border-[rgba(59,130,246,0.15)]">
                  Percentage of vehicles following parking
                  regulations and policies across all zones
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <p className="font-sans font-normal text-[13px] text-[#6b7280] dark:text-[#94a3b8]">
                Compliance Rate
              </p>
              <p className="font-sans font-semibold text-[28px] leading-[32px] text-[#111827] dark:text-[#e8eef5]">
                87.5%
              </p>
            </div>
          </div>

          {/* Revenue Today */}

          {/* Devices Online */}
          <Link
            to="/operations/devices"
            className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-5 shadow-sm relative hover:border-[#3b82f6] dark:hover:border-[#60a5fa] transition-colors cursor-pointer block"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="bg-[#dbeafe] dark:bg-[#1e3a8a] rounded-lg p-2.5">
                <Wifi
                  className="size-5 text-[#3b82f6] dark:text-[#60a5fa]"
                  strokeWidth={2}
                />
              </div>
              <div className="group">
                <Info className="size-4 text-[#6b7280] dark:text-[#94a3b8] cursor-help" />
                <div className="invisible group-hover:visible absolute right-5 top-14 w-64 bg-[#111827] dark:bg-[#1a2d47] text-white dark:text-[#e8eef5] text-xs rounded-lg px-3 py-2 shadow-lg z-50 border border-transparent dark:border-[rgba(59,130,246,0.15)]">
                  Number of active monitoring devices currently
                  connected and operational
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <p className="font-sans font-normal text-[13px] text-[#6b7280] dark:text-[#94a3b8]">
                Devices Online
              </p>
              <p className="font-sans font-semibold text-[28px] leading-[32px] text-[#111827] dark:text-[#e8eef5]">
                <span className="text-[#3b82f6] dark:text-[#60a5fa]">
                  14
                </span>
                /15
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Live Map Overview */}
      <div className="px-8 mb-6">
        <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h2 className="font-sans font-semibold text-[16px] text-[#111827] dark:text-[#e8eef5]">
                Live Map Overview
              </h2>
              <div className="flex items-center gap-1.5">
                <div className="size-2 rounded-full bg-[#10b981] animate-pulse" />
                <span className="font-sans font-medium text-[12px] text-[#10b981] dark:text-[#34d399]">
                  LIVE
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Site and Zone Filters */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedSite}
                  onChange={(e) =>
                    setSelectedSite(e.target.value)
                  }
                  className="px-3 py-1.5 text-[13px] font-medium text-[#111827] dark:text-[#e8eef5] bg-white dark:bg-[#1a2d47] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg hover:border-[#3b82f6] dark:hover:border-[#60a5fa] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] dark:focus:ring-[#60a5fa] transition-colors"
                >
                  <option value="all">All Sites</option>
                  <option value="pacific-plaza">
                    Pacific Plaza Garage
                  </option>
                  <option value="pacific-centre">
                    CF Pacific Centre
                  </option>
                  <option value="heritage-harbor">
                    Heritage Harbor Parking
                  </option>
                  <option value="pacific-beach">
                    875 Garnet Pacific Beach
                  </option>
                  <option value="pan-pacific">
                    Pan Pacific Park
                  </option>
                </select>
                <select
                  value={selectedZone}
                  onChange={(e) =>
                    setSelectedZone(e.target.value)
                  }
                  className="px-3 py-1.5 text-[13px] font-medium text-[#111827] dark:text-[#e8eef5] bg-white dark:bg-[#1a2d47] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg hover:border-[#3b82f6] dark:hover:border-[#60a5fa] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] dark:focus:ring-[#60a5fa] transition-colors"
                >
                  <option value="all">All Zones</option>
                  <option value="zone-a">Zone A</option>
                  <option value="zone-b">Zone B</option>
                  <option value="zone-c">Zone C</option>
                  <option value="zone-d">Zone D</option>
                  <option value="zone-e">Zone E</option>
                </select>
              </div>

              <div className="flex items-center gap-4 text-[12px] font-sans">
                <div className="flex items-center gap-1.5">
                  <div className="size-2.5 rounded-full bg-[#16a34a]" />
                  <span className="text-[#6b7280] dark:text-[#94a3b8]">
                    Compliant
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="size-2.5 rounded-full bg-[#ea580c]" />
                  <span className="text-[#6b7280] dark:text-[#94a3b8]">
                    Warning
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="size-2.5 rounded-full bg-[#dc2626]" />
                  <span className="text-[#6b7280] dark:text-[#94a3b8]">
                    Violation
                  </span>
                </div>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium text-[#3b82f6] dark:text-[#60a5fa] hover:bg-[#eff6ff] dark:hover:bg-[rgba(30,58,95,0.3)] dark:hover:bg-[#1e3a8a] rounded-lg transition-colors">
                <Maximize2 className="size-3.5" />
                Expand
              </button>
            </div>
          </div>

          {/* Realistic Map with Markers */}
          <div className="relative bg-[#f5f5f0] dark:bg-[#0f172a] rounded-lg h-[320px] overflow-hidden">
            {/* Street Grid Pattern */}
            <svg
              className="absolute inset-0 w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Base Map Background */}
              <rect width="100%" height="100%" fill="#f8f7f4" />

              {/* Green Park Areas */}
              <ellipse
                cx="15%"
                cy="35%"
                rx="8%"
                ry="12%"
                fill="#c8e6c9"
                opacity="0.7"
              />
              <rect
                x="5%"
                y="60%"
                width="12%"
                height="18%"
                fill="#c8e6c9"
                opacity="0.7"
                rx="2"
              />
              <polygon
                points="65,5 85,15 78,35 55,30"
                fill="#c8e6c9"
                opacity="0.7"
              />
              <ellipse
                cx="85%"
                cy="25%"
                rx="10%"
                ry="8%"
                fill="#c8e6c9"
                opacity="0.7"
              />

              {/* Water/River Area - Right Side */}
              <path
                d="M 85 0 Q 88 50 92 100 Q 94 150 96 200 L 100 200 L 100 0 Z"
                fill="#b3d9ff"
                opacity="0.4"
                transform="scale(1, 1.6)"
              />

              {/* Major Streets - Diagonal and Grid */}
              <line
                x1="0"
                y1="25%"
                x2="100%"
                y2="25%"
                stroke="#d4d4d8"
                strokeWidth="3"
              />
              <line
                x1="0"
                y1="50%"
                x2="100%"
                y2="50%"
                stroke="#d4d4d8"
                strokeWidth="4"
              />
              <line
                x1="0"
                y1="75%"
                x2="100%"
                y2="75%"
                stroke="#d4d4d8"
                strokeWidth="3"
              />

              <line
                x1="20%"
                y1="0"
                x2="20%"
                y2="100%"
                stroke="#d4d4d8"
                strokeWidth="2.5"
              />
              <line
                x1="40%"
                y1="0"
                x2="40%"
                y2="100%"
                stroke="#d4d4d8"
                strokeWidth="2.5"
              />
              <line
                x1="60%"
                y1="0"
                x2="60%"
                y2="100%"
                stroke="#d4d4d8"
                strokeWidth="3"
              />
              <line
                x1="80%"
                y1="0"
                x2="80%"
                y2="100%"
                stroke="#d4d4d8"
                strokeWidth="2.5"
              />

              {/* Diagonal Streets for Realism */}
              <line
                x1="0"
                y1="0"
                x2="30%"
                y2="100%"
                stroke="#e4e4e7"
                strokeWidth="2"
              />
              <line
                x1="70%"
                y1="0"
                x2="100%"
                y2="80%"
                stroke="#e4e4e7"
                strokeWidth="2"
              />
              <line
                x1="10%"
                y1="30%"
                x2="90%"
                y2="70%"
                stroke="#e4e4e7"
                strokeWidth="2.5"
              />

              {/* Minor Streets */}
              <line
                x1="0"
                y1="12%"
                x2="85%"
                y2="12%"
                stroke="#e8e8e6"
                strokeWidth="1.5"
                opacity="0.7"
              />
              <line
                x1="0"
                y1="37%"
                x2="85%"
                y2="37%"
                stroke="#e8e8e6"
                strokeWidth="1.5"
                opacity="0.7"
              />
              <line
                x1="0"
                y1="62%"
                x2="85%"
                y2="62%"
                stroke="#e8e8e6"
                strokeWidth="1.5"
                opacity="0.7"
              />
              <line
                x1="0"
                y1="87%"
                x2="85%"
                y2="87%"
                stroke="#e8e8e6"
                strokeWidth="1.5"
                opacity="0.7"
              />

              <line
                x1="10%"
                y1="0"
                x2="10%"
                y2="100%"
                stroke="#e8e8e6"
                strokeWidth="1.5"
                opacity="0.7"
              />
              <line
                x1="30%"
                y1="0"
                x2="30%"
                y2="100%"
                stroke="#e8e8e6"
                strokeWidth="1.5"
                opacity="0.7"
              />
              <line
                x1="50%"
                y1="0"
                x2="50%"
                y2="100%"
                stroke="#e8e8e6"
                strokeWidth="1.5"
                opacity="0.7"
              />
              <line
                x1="70%"
                y1="0"
                x2="70%"
                y2="100%"
                stroke="#e8e8e6"
                strokeWidth="1.5"
                opacity="0.7"
              />

              {/* Building Blocks - More Natural Shapes */}
              <rect
                x="22%"
                y="3%"
                width="16%"
                height="9%"
                fill="#e8e8e4"
                opacity="0.6"
                rx="1"
              />
              <rect
                x="42%"
                y="5%"
                width="12%"
                height="7%"
                fill="#e8e8e4"
                opacity="0.6"
                rx="1"
              />
              <rect
                x="62%"
                y="2%"
                width="15%"
                height="10%"
                fill="#e8e8e4"
                opacity="0.6"
                rx="1"
              />

              <rect
                x="3%"
                y="27%"
                width="10%"
                height="10%"
                fill="#e8e8e4"
                opacity="0.6"
                rx="1"
              />
              <rect
                x="22%"
                y="28%"
                width="14%"
                height="8%"
                fill="#e8e8e4"
                opacity="0.6"
                rx="1"
              />
              <rect
                x="42%"
                y="26%"
                width="16%"
                height="11%"
                fill="#e8e8e4"
                opacity="0.6"
                rx="1"
              />
              <rect
                x="65%"
                y="28%"
                width="11%"
                height="9%"
                fill="#e8e8e4"
                opacity="0.6"
                rx="1"
              />

              <rect
                x="22%"
                y="52%"
                width="12%"
                height="10%"
                fill="#e8e8e4"
                opacity="0.6"
                rx="1"
              />
              <rect
                x="42%"
                y="53%"
                width="15%"
                height="9%"
                fill="#e8e8e4"
                opacity="0.6"
                rx="1"
              />
              <rect
                x="62%"
                y="51%"
                width="13%"
                height="11%"
                fill="#e8e8e4"
                opacity="0.6"
                rx="1"
              />

              <rect
                x="22%"
                y="77%"
                width="14%"
                height="8%"
                fill="#e8e8e4"
                opacity="0.6"
                rx="1"
              />
              <rect
                x="42%"
                y="76%"
                width="11%"
                height="10%"
                fill="#e8e8e4"
                opacity="0.6"
                rx="1"
              />
              <rect
                x="62%"
                y="78%"
                width="15%"
                height="9%"
                fill="#e8e8e4"
                opacity="0.6"
                rx="1"
              />

              {/* Street Labels */}
              <text
                x="5%"
                y="24%"
                fill="#71717a"
                fontSize="7"
                fontFamily="Inter"
              >
                Broadway
              </text>
              <text
                x="5%"
                y="49%"
                fill="#71717a"
                fontSize="7"
                fontFamily="Inter"
              >
                Main Street
              </text>
              <text
                x="5%"
                y="74%"
                fill="#71717a"
                fontSize="7"
                fontFamily="Inter"
              >
                Pacific Ave
              </text>

              {/* District Labels */}
              <text
                x="25%"
                y="18%"
                fill="#52525b"
                fontSize="8"
                fontWeight="500"
                fontFamily="Inter"
              >
                Downtown
              </text>
              <text
                x="50%"
                y="43%"
                fill="#52525b"
                fontSize="8"
                fontWeight="500"
                fontFamily="Inter"
              >
                Financial District
              </text>
              <text
                x="8%"
                y="70%"
                fill="#52525b"
                fontSize="7"
                fontWeight="500"
                fontFamily="Inter"
              >
                Civic Center
              </text>
            </svg>

            {/* Status Markers */}
            {/* Green - Compliant */}
            <div className="absolute left-[22%] top-[35%] size-3 rounded-full bg-[#16a34a] border-2 border-white shadow-lg" />
            <div className="absolute left-[68%] top-[58%] size-3 rounded-full bg-[#16a34a] border-2 border-white shadow-lg" />
            <div className="absolute left-[82%] top-[25%] size-3 rounded-full bg-[#16a34a] border-2 border-white shadow-lg" />
            <div className="absolute left-[45%] top-[82%] size-3 rounded-full bg-[#16a34a] border-2 border-white shadow-lg" />

            {/* Orange - Warning */}
            <div className="absolute left-[38%] top-[28%] size-3 rounded-full bg-[#ea580c] border-2 border-white shadow-lg" />
            <div className="absolute left-[58%] top-[72%] size-3 rounded-full bg-[#ea580c] border-2 border-white shadow-lg" />
            <div className="absolute left-[12%] top-[65%] size-3 rounded-full bg-[#ea580c] border-2 border-white shadow-lg" />

            {/* Red - Violation */}
            <div className="absolute left-[75%] top-[48%] size-3 rounded-full bg-[#dc2626] border-2 border-white shadow-lg" />
            <div className="absolute left-[28%] top-[55%] size-3 rounded-full bg-[#dc2626] border-2 border-white shadow-lg" />
            <div className="absolute left-[88%] top-[78%] size-3 rounded-full bg-[#dc2626] border-2 border-white shadow-lg" />

            {/* Zone Labels */}
            <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-[#0f1f35]/90 backdrop-blur-sm px-2 py-1 rounded text-[11px] font-sans text-[#6b7280] dark:text-[#94a3b8]">
              ⬅ active events displayed
            </div>
            <div className="absolute bottom-3 right-3 bg-white/90 dark:bg-[#0f1f35]/90 backdrop-blur-sm px-2 py-1 rounded text-[11px] font-sans text-[#6b7280] dark:text-[#94a3b8]">
              Explore map →
            </div>
          </div>
        </div>
      </div>

      {/* Site Overview Table */}
      <div className="px-8 mb-6">
        <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
            <h2 className="font-sans font-semibold text-[16px] text-[#111827] dark:text-[#e8eef5]">
              Site Overview
            </h2>
            <button className="text-[13px] font-medium text-[#3b82f6] dark:text-[#60a5fa] hover:text-[#2563eb] dark:hover:text-[#93c5fd]">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f9fafb] dark:bg-[#0a1628] border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
                  <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">
                    Site
                  </th>
                  <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">
                    Zones
                  </th>
                  <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">
                    Active Devices
                  </th>
                  <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">
                    Created
                  </th>
                  <th className="text-left px-6 py-3 text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">
                    Site Status
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)]">
                  <td className="px-6 py-4 text-[14px] font-medium text-[#111827] dark:text-[#e8eef5]">
                    Pacific Plaza Garage
                  </td>
                  <td className="px-6 py-4 text-[14px] text-[#6b7280] dark:text-[#94a3b8]">
                    12
                  </td>
                  <td className="px-6 py-4 text-[14px] text-[#6b7280] dark:text-[#94a3b8]">
                    6
                  </td>
                  <td className="px-6 py-4 text-[14px] text-[#6b7280] dark:text-[#94a3b8]">
                    Jan 15, 2025
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#d1fae5] dark:bg-[#065f46] text-[#065f46] dark:text-[#34d399]">
                      Active
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)]">
                  <td className="px-6 py-4 text-[14px] font-medium text-[#111827] dark:text-[#e8eef5]">
                    CF Pacific Centre
                  </td>
                  <td className="px-6 py-4 text-[14px] text-[#6b7280] dark:text-[#94a3b8]">
                    18
                  </td>
                  <td className="px-6 py-4 text-[14px] text-[#6b7280] dark:text-[#94a3b8]">
                    10
                  </td>
                  <td className="px-6 py-4 text-[14px] text-[#6b7280] dark:text-[#94a3b8]">
                    Feb 3, 2025
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#d1fae5] dark:bg-[#065f46] text-[#065f46] dark:text-[#34d399]">
                      Active
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)]">
                  <td className="px-6 py-4 text-[14px] font-medium text-[#111827] dark:text-[#e8eef5]">
                    Heritage Harbor Parking
                  </td>
                  <td className="px-6 py-4 text-[14px] text-[#6b7280] dark:text-[#94a3b8]">
                    15
                  </td>
                  <td className="px-6 py-4 text-[14px] text-[#6b7280] dark:text-[#94a3b8]">
                    8
                  </td>
                  <td className="px-6 py-4 text-[14px] text-[#6b7280] dark:text-[#94a3b8]">
                    Mar 10, 2025
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#d1fae5] dark:bg-[#065f46] text-[#065f46] dark:text-[#34d399]">
                      Active
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)]">
                  <td className="px-6 py-4 text-[14px] font-medium text-[#111827] dark:text-[#e8eef5]">
                    875 Garnet Pacific Beach Parking
                  </td>
                  <td className="px-6 py-4 text-[14px] text-[#6b7280] dark:text-[#94a3b8]">
                    8
                  </td>
                  <td className="px-6 py-4 text-[14px] text-[#6b7280] dark:text-[#94a3b8]">
                    4
                  </td>
                  <td className="px-6 py-4 text-[14px] text-[#6b7280] dark:text-[#94a3b8]">
                    Dec 1, 2024
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#d1fae5] dark:bg-[#065f46] text-[#065f46] dark:text-[#34d399]">
                      Active
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)]">
                  <td className="px-6 py-4 text-[14px] font-medium text-[#111827] dark:text-[#e8eef5]">
                    Pan Pacific Park Parking
                  </td>
                  <td className="px-6 py-4 text-[14px] text-[#6b7280] dark:text-[#94a3b8]">
                    10
                  </td>
                  <td className="px-6 py-4 text-[14px] text-[#6b7280] dark:text-[#94a3b8]">
                    5
                  </td>
                  <td className="px-6 py-4 text-[14px] text-[#6b7280] dark:text-[#94a3b8]">
                    Jan 28, 2025
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#d1fae5] dark:bg-[#065f46] text-[#065f46] dark:text-[#34d399]">
                      Active
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Revenue Chart - Full Width */}
      <div className="px-8 mb-6">
        <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6 shadow-sm">
          <h2 className="font-sans font-semibold text-[16px] text-[#111827] dark:text-[#e8eef5] mb-4">Revenue (Last 30 days)</h2>
          <div style={{ width: "100%", height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={revenueData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -20,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient
                    id="revenueGradientDashboard"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      key="gradient-start"
                      offset="0%"
                      stopColor="#2563EB"
                      stopOpacity={0.2}
                    />
                    <stop
                      key="gradient-end"
                      offset="100%"
                      stopColor="#2563EB"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  stroke="#9ca3af"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                  interval="preserveStartEnd"
                  minTickGap={30}
                />
                <YAxis
                  stroke="#9ca3af"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 400]}
                  ticks={[0, 60, 120, 180, 240, 300, 360]}
                  tickFormatter={(value) => `$${value}`}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563EB"
                  strokeWidth={2}
                  fill="url(#revenueGradientDashboard)"
                  animationDuration={1000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Enforcement Vehicles - 2x2 Grid */}
      <div className="px-8 mb-6">
        <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] shadow-sm">
          <div className="px-6 py-4 border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] flex items-center justify-between">
            <h2 className="font-sans font-semibold text-[16px] text-[#111827] dark:text-[#e8eef5]">
              Enforcement Vehicles
            </h2>
            <Link
              to="/operations/devices"
              className="text-[13px] font-medium text-[#3b82f6] dark:text-[#60a5fa] hover:text-[#2563eb] dark:hover:text-[#93c5fd]"
            >
              View All
            </Link>
          </div>

          {/* 2x2 Grid of Vehicle Cards */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Vehicle 1 - Unit 04 Ford Explorer */}
            <div className="bg-white dark:bg-[#0f1f35] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-sans font-semibold text-[15px] text-[#111827] dark:text-[#e8eef5]">
                    Unit 04 Ford Explorer
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-[13px]">
                  <Building2 className="size-4 text-[#6b7280] dark:text-[#94a3b8]" />
                  <span className="text-[#6b7280] dark:text-[#94a3b8]">UCLA</span>
                </div>
                <div className="flex items-center gap-2 text-[13px]">
                  <MapPin className="size-4 text-[#6b7280] dark:text-[#94a3b8]" />
                  <span className="text-[#6b7280] dark:text-[#94a3b8]">Zone A — Permit Holders Only</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">Cameras:</span>
                <div className="flex gap-1.5">
                  <button className="px-2.5 py-1 bg-[#16a34a] text-white text-[11px] font-medium rounded hover:bg-[#15803d] transition-colors">
                    C1
                  </button>
                  <button className="px-2.5 py-1 bg-[#16a34a] text-white text-[11px] font-medium rounded hover:bg-[#15803d] transition-colors">
                    C2
                  </button>
                  <button className="px-2.5 py-1 bg-[#16a34a] text-white text-[11px] font-medium rounded hover:bg-[#15803d] transition-colors">
                    C3
                  </button>
                </div>
              </div>
            </div>

            {/* Vehicle 2 - Unit 07 Chevy Tahoe */}
            <div className="bg-white dark:bg-[#0f1f35] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-sans font-semibold text-[15px] text-[#111827] dark:text-[#e8eef5]">
                    Unit 07 Chevy Tahoe
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-[13px]">
                  <Building2 className="size-4 text-[#6b7280] dark:text-[#94a3b8]" />
                  <span className="text-[#6b7280] dark:text-[#94a3b8]">UCLA</span>
                </div>
                <div className="flex items-center gap-2 text-[13px]">
                  <MapPin className="size-4 text-[#6b7280] dark:text-[#94a3b8]" />
                  <span className="text-[#6b7280] dark:text-[#94a3b8]">Zone B — General Public Parking</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">Cameras:</span>
                <div className="flex gap-1.5">
                  <button className="px-2.5 py-1 bg-[#16a34a] text-white text-[11px] font-medium rounded hover:bg-[#15803d] transition-colors">
                    C1
                  </button>
                  <button className="px-2.5 py-1 bg-[#16a34a] text-white text-[11px] font-medium rounded hover:bg-[#15803d] transition-colors">
                    C2
                  </button>
                </div>
              </div>
            </div>

            {/* Vehicle 3 - Unit 12 Ford F-150 */}
            <div className="bg-white dark:bg-[#0f1f35] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-sans font-semibold text-[15px] text-[#111827] dark:text-[#e8eef5]">
                    Unit 12 Ford F-150
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-[13px]">
                  <Building2 className="size-4 text-[#6b7280] dark:text-[#94a3b8]" />
                  <span className="text-[#6b7280] dark:text-[#94a3b8]">Stanford</span>
                </div>
                <div className="flex items-center gap-2 text-[13px]">
                  <MapPin className="size-4 text-[#6b7280] dark:text-[#94a3b8]" />
                  <span className="text-[#6b7280] dark:text-[#94a3b8]">Zone C — Faculty & Staff Reserved</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">Cameras:</span>
                <div className="flex gap-1.5">
                  <button className="px-2.5 py-1 bg-[#dc2626] text-white text-[11px] font-medium rounded hover:bg-[#b91c1c] transition-colors">
                    C1
                  </button>
                  <button className="px-2.5 py-1 bg-[#dc2626] text-white text-[11px] font-medium rounded hover:bg-[#b91c1c] transition-colors">
                    C2
                  </button>
                </div>
              </div>
            </div>

            {/* Vehicle 4 - Unit 15 Dodge Durango */}
            <div className="bg-white dark:bg-[#0f1f35] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-sans font-semibold text-[15px] text-[#111827] dark:text-[#e8eef5]">
                    Unit 15 Dodge Durango
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-[13px]">
                  <Building2 className="size-4 text-[#6b7280] dark:text-[#94a3b8]" />
                  <span className="text-[#6b7280] dark:text-[#94a3b8]">U of Michigan</span>
                </div>
                <div className="flex items-center gap-2 text-[13px]">
                  <MapPin className="size-4 text-[#6b7280] dark:text-[#94a3b8]" />
                  <span className="text-[#6b7280] dark:text-[#94a3b8]">Zone D — Short-Term Visitor (2-Hour)</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[12px] font-medium text-[#6b7280] dark:text-[#94a3b8]">Cameras:</span>
                <div className="flex gap-1.5">
                  <button className="px-2.5 py-1 bg-[#16a34a] text-white text-[11px] font-medium rounded hover:bg-[#15803d] transition-colors">
                    C1
                  </button>
                  <button className="px-2.5 py-1 bg-[#16a34a] text-white text-[11px] font-medium rounded hover:bg-[#15803d] transition-colors">
                    C2
                  </button>
                  <button className="px-2.5 py-1 bg-[#16a34a] text-white text-[11px] font-medium rounded hover:bg-[#15803d] transition-colors">
                    C3
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Violations - Full Width */}
      <div className="px-8">
        <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
            <h2 className="font-sans font-semibold text-[16px] text-[#111827] dark:text-[#e8eef5]">
              Recent Violations
            </h2>
            <button className="text-[13px] font-medium text-[#3b82f6] dark:text-[#60a5fa] hover:text-[#2563eb] dark:hover:text-[#93c5fd]">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f9fafb] dark:bg-[#0a1628] border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
                  <th className="text-left px-4 py-3 text-[11px] font-medium text-[#6b7280] dark:text-[#94a3b8]">
                    ID
                  </th>
                  <th className="text-left px-4 py-3 text-[11px] font-medium text-[#6b7280] dark:text-[#94a3b8]">
                    Plate
                  </th>
                  <th className="text-left px-4 py-3 text-[11px] font-medium text-[#6b7280] dark:text-[#94a3b8]">
                    Zone
                  </th>
                  <th className="text-left px-4 py-3 text-[11px] font-medium text-[#6b7280] dark:text-[#94a3b8]">
                    Type
                  </th>
                  <th className="text-left px-4 py-3 text-[11px] font-medium text-[#6b7280] dark:text-[#94a3b8]">
                    Time
                  </th>
                  <th className="text-left px-4 py-3 text-[11px] font-medium text-[#6b7280] dark:text-[#94a3b8]">
                    Amount
                  </th>
                  <th className="text-left px-4 py-3 text-[11px] font-medium text-[#6b7280] dark:text-[#94a3b8]">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)]">
                  <td className="px-4 py-3 text-[13px] text-[#3b82f6] font-medium">
                    V-10251
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#111827] dark:text-[#e8eef5] font-mono">
                    CA · 7XRT423
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#6b7280] dark:text-[#94a3b8]">
                    Lot 2 — Permit A (North)
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#6b7280] dark:text-[#94a3b8]">
                    Overstay
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#6b7280] dark:text-[#94a3b8]">
                    14m ago
                  </td>
                  <td className="px-4 py-3 text-[13px] font-medium text-[#111827] dark:text-[#e8eef5]">
                    $75
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#fef3c7] dark:bg-[#78350f] text-[#92400e] dark:text-[#fbbf24]">
                      Pending
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)]">
                  <td className="px-4 py-3 text-[13px] text-[#3b82f6] font-medium">
                    V-10236
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#111827] dark:text-[#e8eef5] font-mono">
                    TX · HJK9821
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#6b7280] dark:text-[#94a3b8]">
                    EV Charging Bay — Lot 32
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#6b7280] dark:text-[#94a3b8]">
                    No Payment
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#6b7280] dark:text-[#94a3b8]">
                    32m ago
                  </td>
                  <td className="px-4 py-3 text-[13px] font-medium text-[#111827] dark:text-[#e8eef5]">
                    $50
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#d1fae5] dark:bg-[#065f46] text-[#065f46] dark:text-[#34d399]">
                      Resolved
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)]">
                  <td className="px-4 py-3 text-[13px] text-[#3b82f6] font-medium">
                    V-10234
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#111827] dark:text-[#e8eef5] font-mono">
                    MI · LPQ5543
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#6b7280] dark:text-[#94a3b8]">
                    Faculty Reserved — Lot 17
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#6b7280] dark:text-[#94a3b8]">
                    Permit Violation
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#6b7280] dark:text-[#94a3b8]">
                    1h ago
                  </td>
                  <td className="px-4 py-3 text-[13px] font-medium text-[#111827] dark:text-[#e8eef5]">
                    $40
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#fee2e2] dark:bg-[#7f1d1d] text-[#991b1b] dark:text-[#f87171]">
                      Escalated
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)]">
                  <td className="px-4 py-3 text-[13px] text-[#3b82f6] font-medium">
                    V-10228
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#111827] dark:text-[#e8eef5] font-mono">
                    CA · 3BNM771
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#6b7280] dark:text-[#94a3b8]">
                    Structure 6 — Level P2
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#6b7280] dark:text-[#94a3b8]">
                    Expired Session
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#6b7280] dark:text-[#94a3b8]">
                    2h ago
                  </td>
                  <td className="px-4 py-3 text-[13px] font-medium text-[#111827] dark:text-[#e8eef5]">
                    $75
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#fef3c7] dark:bg-[#78350f] text-[#92400e] dark:text-[#fbbf24]">
                      Pending
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)]">
                  <td className="px-4 py-3 text-[13px] text-[#3b82f6] font-medium">
                    V-10219
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#111827] dark:text-[#e8eef5] font-mono">
                    TX · 8WXZ002
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#6b7280] dark:text-[#94a3b8]">
                    Bruin Walk Curb — East Side
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#6b7280] dark:text-[#94a3b8]">
                    Wrong Zone
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#6b7280] dark:text-[#94a3b8]">
                    3h ago
                  </td>
                  <td className="px-4 py-3 text-[13px] font-medium text-[#111827] dark:text-[#e8eef5]">
                    $75
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#d1fae5] dark:bg-[#065f46] text-[#065f46] dark:text-[#34d399]">
                      Resolved
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
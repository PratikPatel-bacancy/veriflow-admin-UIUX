import { Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  Building2,
  MapPin,
  Warehouse,
  Map,
  FileText,
  DollarSign,
  CreditCard,
  AlertTriangle,
  Wallet,
  Tablet,
  CheckCircle2,
  BarChart3,
  TrendingUp,
  Users,
  Shield,
  Settings,
  ClipboardList,
  CalendarClock,
  Layers,
} from "lucide-react";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  children?: NavItem[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navigationSections: NavSection[] = [
  {
    title: "",
    items: [
      {
        label: "Home",
        path: "/",
        icon: <LayoutDashboard className="size-5" />,
      },
    ],
  },
  {
    title: "MANAGEMENT",
    items: [
      {
        label: "Sites",
        path: "/management/sites",
        icon: <MapPin className="size-5" />,
      },
      {
        label: "Zones",
        path: "/management/zones",
        icon: <Map className="size-5" />,
        children: [
          {
            label: "Parking Lots",
            path: "/management/parking-lots",
            icon: <Warehouse className="size-4" />,
          },
        ],
      },
    ],
  },
  {
    title: "OPERATIONS",
    items: [
      {
        label: "Live Operations",
        path: "/operations/live",
        icon: <TrendingUp className="size-5" />,
      },
      {
        label: "Compliance",
        path: "/operations/compliance",
        icon: <CheckCircle2 className="size-5" />,
      },
      {
        label: "Violations",
        path: "/operations/violations",
        icon: <AlertTriangle className="size-5" />,
      },
      {
        label: "Payments",
        path: "/operations/payments",
        icon: <Wallet className="size-5" />,
      },
      {
        label: "Devices",
        path: "/operations/devices",
        icon: <Tablet className="size-5" />,
      },
    ],
  },
  {
    title: "ANALYTICS",
    items: [
      {
        label: "Reports",
        path: "/analytics/reports",
        icon: <BarChart3 className="size-5" />,
      },
      {
        label: "Usage Statistics",
        path: "/analytics/usage",
        icon: <TrendingUp className="size-5" />,
      },
    ],
  },
  {
    title: "POLICY CONFIGURATION",
    items: [
      {
        label: "Policies",
        path: "/configuration/policies",
        icon: <Layers className="size-5" />,
        children: [
          {
            label: "Templates",
            path: "/configuration/policies/templates",
            icon: <FileText className="size-4" />,
          },
          {
            label: "Assignments",
            path: "/configuration/policies/assignments",
            icon: <ClipboardList className="size-4" />,
          },
          {
            label: "Special Events",
            path: "/configuration/events",
            icon: <CalendarClock className="size-4" />,
          },
          {
            label: "Permits",
            path: "/configuration/permits",
            icon: <CreditCard className="size-4" />,
          },
          {
            label: "Tariffs",
            path: "/configuration/tariffs",
            icon: <DollarSign className="size-4" />,
          },
        ],
      },
    ],
  },
  {
    title: "ADMINISTRATION",
    items: [
      {
        label: "Users",
        path: "/admin/users",
        icon: <Users className="size-5" />,
      },
      {
        label: "Audit Logs",
        path: "/admin/audit-logs",
        icon: <Shield className="size-5" />,
      },
      {
        label: "Settings",
        path: "/admin/settings",
        icon: <Settings className="size-5" />,
      },
    ],
  },
];

interface SidebarProps {
  isCollapsed?: boolean;
}

export default function Sidebar({ isCollapsed = false }: SidebarProps) {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className={`bg-white dark:bg-[#0f1f35] border-r border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] flex flex-col h-screen transition-all duration-300 ${
      isCollapsed ? "w-[80px]" : "w-[300px]"
    }`}>
      {/* Logo */}
      <div className="border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] h-16 px-4 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="bg-[#3b82f6] rounded-lg size-8 flex items-center justify-center flex-shrink-0">
            <svg className="size-5" fill="none" viewBox="0 0 20 20">
              <path
                d="M10 2L3 7v6c0 4.42 3.05 8.54 7 9.5 3.95-.96 7-5.08 7-9.5V7l-7-5z"
                stroke="white"
                strokeWidth="1.67"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          {!isCollapsed && (
            <span className="font-semibold text-[#111827] dark:text-[#e8eef5] text-xl tracking-tight whitespace-nowrap">
              VeriFlow
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 pt-4">
        <div className="flex flex-col gap-1">
          {navigationSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-4">
              {section.title && !isCollapsed && (
                <p className="font-medium text-[#6b7280] dark:text-[#94a3b8] text-xs tracking-tight uppercase mb-1 px-3">
                  {section.title}
                </p>
              )}
              <div className="flex flex-col gap-1">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex}>
                    <Link
                      to={item.path}
                      className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-lg transition-colors ${
                        isActive(item.path)
                          ? "bg-[#3b82f6] text-white"
                          : "text-[#111827] dark:text-[#e8eef5] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)]"
                      }`}
                      title={isCollapsed ? item.label : undefined}
                    >
                      {item.icon}
                      {!isCollapsed && (
                        <span className="font-medium text-base tracking-tight whitespace-nowrap">
                          {item.label}
                        </span>
                      )}
                    </Link>
                    {/* Sub-items */}
                    {item.children && !isCollapsed && (
                      <div className="flex flex-col gap-1 mt-1">
                        {item.children.map((child, childIndex) => (
                          <Link
                            key={childIndex}
                            to={child.path}
                            className={`flex items-center gap-3 pl-11 pr-3 py-2 rounded-lg transition-colors ${
                              isActive(child.path)
                                ? "bg-[#dbeafe] dark:bg-[#1e3a8a] text-[#3b82f6] dark:text-[#93c5fd]"
                                : "text-[#6b7280] dark:text-[#94a3b8] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)] hover:text-[#111827] dark:hover:text-[#f3f4f6]"
                            }`}
                          >
                            {child.icon}
                            <span className="font-medium text-sm tracking-tight whitespace-nowrap">
                              {child.label}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}
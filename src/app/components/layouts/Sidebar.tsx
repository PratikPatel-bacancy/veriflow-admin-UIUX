import { Link, useLocation } from "react-router";
import {
  LayoutDashboard,
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
  TrendingUp,
  Users,
  Shield,
  Settings,
  ClipboardList,
  CalendarClock,
  Layers,
  Car,
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
        icon: <LayoutDashboard className="size-6" />,
      },
    ],
  },
  {
    title: "OPERATIONS",
    items: [
      {
        label: "Live Operations",
        path: "/operations/live",
        icon: <TrendingUp className="size-6" />,
      },
      {
        label: "Compliance",
        path: "/operations/compliance",
        icon: <CheckCircle2 className="size-6" />,
      },
      {
        label: "Violations",
        path: "/operations/violations",
        icon: <AlertTriangle className="size-6" />,
      },
      {
        label: "Payments",
        path: "/operations/payments",
        icon: <Wallet className="size-6" />,
      },
      {
        label: "Devices",
        path: "/operations/devices",
        icon: <Tablet className="size-6" />,
      },
    ],
  },
  {
    title: "SITE CONFIGURATION",
    items: [
      {
        label: "Sites",
        path: "/management/sites",
        icon: <MapPin className="size-6" />,
        children: [
          {
            label: "Zones",
            path: "/management/zones",
            icon: <Map className="size-4" />,
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
    ],
  },
  {
    title: "POLICY CONFIGURATION",
    items: [
      {
        label: "Policies",
        path: "/configuration/policies",
        icon: <Layers className="size-6" />,
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
    title: "VEHICLE CONFIGURATION",
    items: [
      {
        label: "Enforcement Vehicles",
        path: "/operations/enforcement-vehicles",
        icon: <Car className="size-6" />,
      },
    ],
  },
  {
    title: "ADMINISTRATION",
    items: [
      {
        label: "Users",
        path: "/admin/users",
        icon: <Users className="size-6" />,
      },
      {
        label: "Audit Logs",
        path: "/admin/audit-logs",
        icon: <Shield className="size-6" />,
      },
      {
        label: "Settings",
        path: "/admin/settings",
        icon: <Settings className="size-6" />,
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
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div
      className={`bg-white dark:bg-[#0f1f35] border-r border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] flex flex-col h-screen transition-all duration-300 ${
        isCollapsed ? "w-[72px]" : "w-[280px]"
      }`}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-5 py-5 ${isCollapsed ? "justify-center" : ""}`}>
        <div className="bg-[#3b82f6] rounded-xl size-10 flex items-center justify-center flex-shrink-0">
          <svg className="size-6" fill="none" viewBox="0 0 20 20">
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
          <span className="font-bold text-[#111827] dark:text-[#e8eef5] text-[22px] tracking-tight whitespace-nowrap">
            VeriFlow
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 pb-6">
        {navigationSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className={sectionIndex > 0 ? "mt-6" : ""}>
            {section.title && !isCollapsed && (
              <p className="text-[10px] font-semibold text-[#9ca3af] dark:text-[#64748b] uppercase tracking-[0.12em] mb-2 px-2">
                {section.title}
              </p>
            )}
            <div className="flex flex-col gap-0.5">
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex}>
                  {/* Main item */}
                  <Link
                    to={item.path}
                    title={isCollapsed ? item.label : undefined}
                    className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"} px-3 py-2.5 rounded-xl transition-colors ${
                      isActive(item.path)
                        ? "bg-[#3b82f6] text-white"
                        : "text-[#111827] dark:text-[#e8eef5] hover:bg-[#f3f4f6] dark:hover:bg-[rgba(30,58,95,0.4)]"
                    }`}
                  >
                    <span
                      className={
                        isActive(item.path)
                          ? "text-white"
                          : "text-[#374151] dark:text-[#94a3b8]"
                      }
                    >
                      {item.icon}
                    </span>
                    {!isCollapsed && (
                      <span className="font-medium text-[17px] tracking-tight whitespace-nowrap">
                        {item.label}
                      </span>
                    )}
                  </Link>

                  {/* Level-1 children */}
                  {item.children && !isCollapsed && (
                    <div className="flex flex-col gap-0.5 mt-0.5">
                      {item.children.map((child, childIndex) => (
                        <div key={childIndex}>
                          <Link
                            to={child.path}
                            className={`flex items-center gap-2.5 pl-10 pr-3 py-2 rounded-lg transition-colors ${
                              isActive(child.path)
                                ? "text-[#3b82f6] dark:text-[#60a5fa]"
                                : "text-[#6b7280] dark:text-[#94a3b8] hover:text-[#111827] dark:hover:text-[#e8eef5]"
                            }`}
                          >
                            <span>{child.icon}</span>
                            <span className="font-medium text-[14px] tracking-tight whitespace-nowrap">
                              {child.label}
                            </span>
                          </Link>

                          {/* Level-2 grandchildren */}
                          {child.children && (
                            <div className="flex flex-col gap-0.5 mt-0.5">
                              {child.children.map((grand, grandIndex) => (
                                <Link
                                  key={grandIndex}
                                  to={grand.path}
                                  className={`flex items-center gap-2.5 pl-[3.5rem] pr-3 py-2 rounded-lg transition-colors ${
                                    isActive(grand.path)
                                      ? "text-[#3b82f6] dark:text-[#60a5fa]"
                                      : "text-[#6b7280] dark:text-[#94a3b8] hover:text-[#111827] dark:hover:text-[#e8eef5]"
                                  }`}
                                >
                                  <span>{grand.icon}</span>
                                  <span className="font-medium text-[14px] tracking-tight whitespace-nowrap">
                                    {grand.label}
                                  </span>
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}

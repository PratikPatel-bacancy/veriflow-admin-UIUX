import { createBrowserRouter, Navigate } from "react-router";
import App from "./App";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Dashboard from "./pages/Dashboard";
import SitesList from "./pages/management/SitesList";
import SiteDetail from "./pages/management/SiteDetail";
import CreateSite from "./pages/management/CreateSite";
import AddZone from "./pages/management/AddZone";
import ZoneList from "./pages/management/ZoneList";
import ZoneDetail from "./pages/management/ZoneDetail";
import ParkingLotList from "./pages/management/ParkingLotList";
import LiveOperations from "./pages/operations/LiveOperations";
import Violations from "./pages/operations/Violations";
import Payments from "./pages/operations/Payments";
import Devices from "./pages/operations/Devices";
import Compliance from "./pages/operations/Compliance";
import EnforcementVehicles from "./pages/operations/EnforcementVehicles";
import AddEnforcementVehicle from "./pages/operations/AddEnforcementVehicle";
import EnforcementVehicleDetail from "./pages/operations/EnforcementVehicleDetail";
import Reports from "./pages/analytics/Reports";
import UsageStatistics from "./pages/analytics/UsageStatistics";
import PolicyLibrary from "./pages/configuration/PolicyLibrary";
import PolicyAssignments from "./pages/configuration/PolicyAssignments";
import PoliciesHome from "./pages/configuration/PoliciesHome";
import CustomTemplateBuilder from "./pages/configuration/CustomTemplateBuilder";
import PolicyAssignmentWizard from "./pages/configuration/PolicyAssignmentWizard";
import PolicyDetail from "./pages/configuration/PolicyDetail";
import Tariffs from "./pages/configuration/Tariffs";
import Permits from "./pages/configuration/Permits";
import EventsCalendar from "./pages/configuration/EventsCalendar";
import Users from "./pages/admin/Users";
import AuditLogs from "./pages/admin/AuditLogs";
import Settings from "./pages/admin/Settings";
import MainLayout from "./components/layouts/MainLayout";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/forgot-password",
    Component: ForgotPassword,
  },
  {
    path: "/reset-password",
    Component: ResetPassword,
  },
  {
    path: "/",
    Component: MainLayout,
    children: [
      {
        index: true,
        Component: Dashboard,
      },
      {
        path: "management/sites",
        Component: SitesList,
      },
      {
        path: "management/sites/create",
        Component: CreateSite,
      },
      {
        path: "management/sites/:id",
        Component: SiteDetail,
      },
      {
        path: "management/zones",
        Component: ZoneList,
      },
      {
        path: "management/zones/add/:siteId",
        Component: AddZone,
      },
      {
        path: "management/zones/:id",
        Component: ZoneDetail,
      },
      {
        path: "management/parking-lots",
        Component: ParkingLotList,
      },
      {
        path: "operations/live",
        Component: LiveOperations,
      },
      {
        path: "operations/violations",
        Component: Violations,
      },
      {
        path: "operations/payments",
        Component: Payments,
      },
      {
        path: "operations/devices",
        Component: Devices,
      },
      {
        path: "operations/compliance",
        Component: Compliance,
      },
      {
        path: "operations/fleet",
        element: <Navigate to="/operations/enforcement-vehicles" replace />,
      },
      {
        path: "operations/fleet/enforcement-vehicles",
        element: <Navigate to="/operations/enforcement-vehicles" replace />,
      },
      {
        path: "operations/enforcement-vehicles",
        Component: EnforcementVehicles,
      },
      {
        path: "operations/enforcement-vehicles/new",
        Component: AddEnforcementVehicle,
      },
      {
        path: "operations/enforcement-vehicles/:id",
        Component: EnforcementVehicleDetail,
      },
      {
        path: "analytics/reports",
        Component: Reports,
      },
      {
        path: "analytics/usage",
        Component: UsageStatistics,
      },
      {
        path: "configuration/policies",
        Component: PoliciesHome,
      },
      {
        path: "configuration/policies/templates",
        Component: PolicyLibrary,
      },
      {
        path: "configuration/policies/assignments",
        Component: PolicyAssignments,
      },
      {
        path: "configuration/policies/assignments/new",
        Component: PolicyAssignmentWizard,
      },
      {
        path: "configuration/policies/:id",
        Component: PolicyDetail,
      },
      {
        path: "configuration/policies/templates/new",
        Component: CustomTemplateBuilder,
      },
      {
        path: "configuration/tariffs",
        Component: Tariffs,
      },
      {
        path: "configuration/permits",
        Component: Permits,
      },
      {
        path: "configuration/events",
        Component: EventsCalendar,
      },
      {
        path: "admin/users",
        Component: Users,
      },
      {
        path: "admin/audit-logs",
        Component: AuditLogs,
      },
      {
        path: "admin/settings",
        Component: Settings,
      },
    ],
  },
]);

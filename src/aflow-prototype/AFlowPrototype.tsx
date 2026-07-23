import { type CSSProperties, type ReactNode, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import BatteryChargingFullRoundedIcon from "@mui/icons-material/BatteryChargingFullRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import StopRoundedIcon from "@mui/icons-material/StopRounded";
import SyncRoundedIcon from "@mui/icons-material/SyncRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import "./AFlowPrototype.css";

type Role = "Configurator" | "Supervisor" | "Requester" | "Approver" | "Manager";
type DesktopPrototype = "Configurator" | "Supervisor";
type TabletPrototype = "Approver" | "Manager" | "Requester";
type NavItem = { label: string; path: string; icon: typeof DashboardRoundedIcon };
type NavGroup = { label?: string; items: NavItem[] };
type ViewMode = "grid" | "list";
type WorkflowTone = "start" | "material" | "station" | "turns" | "aiot" | "end";
type WorkflowNodeModel = { rows: string[]; title: string; tone: WorkflowTone };
type ConfigModule = { action: string; count: number; detail: string; title: string };
type TripRowModel = { id: string; kind: string; route: string; status: string };
type ConfiguratorScreen =
  | "dashboard"
  | "amrs"
  | "amr-configurations"
  | "maps"
  | "map-editor"
  | "triggers"
  | "fleets"
  | "fleets-amrs"
  | "fleet-maps"
  | "master-data"
  | "staging-area"
  | "staging-area-1"
  | "general-settings"
  | "general-settings-1"
  | "workflow-builder"
  | "workflow-builder-1"
  | "hover-list";
type SupervisorScreen =
  | "dashboard"
  | "dashboard-analytics"
  | "dashboard-1"
  | "dashboard-2"
  | "dashboard-3"
  | "dashboard-staging-area"
  | "analytics-board"
  | "analytics-board-1"
  | "live-status"
  | "live-status-pause"
  | "live-status-resume"
  | "live-status-legends-opened"
  | "live-status-with-staging-area"
  | "live-status-chat-attach"
  | "live-status-chat-describing"
  | "staging-area-cells";
type ApproverScreen = "pending" | "cancelled-list" | "cancelled-reason" | "cancelled-success" | "away";
type RequesterTabletScreen = "history" | "alerts" | "live-status" | "booking-start" | "booking-amr" | "booking-material" | "booking-review";
type ManagerTabletScreen = "action-center" | "staging-area" | "wip-inventory" | "notifications";

const asset = (name: string) => `${import.meta.env.BASE_URL}aflow/assets/${name}`;

const CONFIG_GROUPS: NavGroup[] = [
  { items: [{ label: "Dashboard", path: "/configurator", icon: SyncRoundedIcon }] },
  {
    label: "Base Level",
    items: [
      { label: "AMR", path: "/configurator/amr", icon: LocationOnOutlinedIcon },
      { label: "Maps", path: "/configurator/maps", icon: GridViewRoundedIcon },
      { label: "Devices", path: "/configurator/devices", icon: GridViewRoundedIcon },
      { label: "Users", path: "/configurator/users", icon: GridViewRoundedIcon },
      { label: "API Integration", path: "/configurator/api", icon: GridViewRoundedIcon },
    ],
  },
  {
    label: "Fleet Level",
    items: [
      { label: "Fleet", path: "/configurator/fleet", icon: LocationOnOutlinedIcon },
      { label: "Traffic Rules", path: "/configurator/traffic", icon: GridViewRoundedIcon },
      { label: "Triggers", path: "/configurator/triggers", icon: GridViewRoundedIcon },
    ],
  },
  {
    label: "Zone Level",
    items: [
      { label: "Processing Zones", path: "/configurator/zones", icon: LocationOnOutlinedIcon },
    ],
  },
  {
    label: "Alert Configuration",
    items: [
      { label: "Notifications", path: "/configurator/notifications", icon: LocationOnOutlinedIcon },
    ],
  },
];

const INTERFACE_GROUPS: NavGroup[] = [
  { items: [{ label: "Dashboard", path: "/supervisor", icon: HomeRoundedIcon }] },
  {
    label: "Monitor",
    items: [
      { label: "Live Status", path: "/supervisor/live", icon: LocationOnOutlinedIcon },
      { label: "Analytics", path: "/supervisor/analytics", icon: QueryStatsRoundedIcon },
    ],
  },
  {
    label: "Manage",
    items: [
      { label: "Trips", path: "/supervisor/trips", icon: RouteRoundedIcon },
      { label: "Staging Area", path: "/supervisor/staging", icon: GridViewRoundedIcon },
      { label: "WIP Inventory", path: "/supervisor/inventory", icon: GridViewRoundedIcon },
    ],
  },
  {
    label: "Make",
    items: [{ label: "Workflow", path: "/supervisor/workflow", icon: TuneRoundedIcon }],
  },
  {
    label: "Alerts",
    items: [{ label: "Notifications", path: "/supervisor/notifications", icon: NotificationsNoneRoundedIcon }],
  },
];

const SUPERVISOR_HOME_GROUPS: NavGroup[] = [
  { items: [{ label: "Dashboard", path: "/supervisor", icon: HomeRoundedIcon }] },
  {
    label: "Monitor your fleet",
    items: [
      { label: "Live Status", path: "/supervisor/live", icon: LocationOnOutlinedIcon },
      { label: "Analytics", path: "/supervisor/analytics", icon: QueryStatsRoundedIcon },
    ],
  },
  {
    label: "Manage your fleet",
    items: [
      { label: "Trip Details", path: "/supervisor/trips", icon: RouteRoundedIcon },
      { label: "Staging Area", path: "/supervisor/staging", icon: GridViewRoundedIcon },
    ],
  },
];

const REQUESTER_GROUPS: NavGroup[] = [
  {
    items: [
      { label: "Request History", path: "/requester/history", icon: SyncRoundedIcon },
      { label: "Live Status", path: "/requester/live", icon: LocationOnOutlinedIcon },
      { label: "Staging Area", path: "/requester/staging", icon: GridViewRoundedIcon },
      { label: "Alerts", path: "/requester/alerts", icon: NotificationsNoneRoundedIcon },
    ],
  },
];

const dashboardCards = [
  ["200", "AMRs", "Configure and assign autonomous movers", "/configurator/amr", LocalShippingRoundedIcon],
  ["15", "Maps", "Upload, publish, and edit facility maps", "/configurator/maps", LocationOnOutlinedIcon],
  ["15", "Devices", "Manage connected devices and gateways", "/configurator/devices", LayersOutlinedIcon],
  ["15", "Users", "Control access for every role", "/configurator/users", PersonOutlineRoundedIcon],
  ["15", "API Integration", "Connect fleet, BOM, MES, and HMI systems", "/configurator/api", RouteRoundedIcon],
  ["15", "Fleet", "Group AMRs into operating fleets", "/configurator/fleet", Inventory2OutlinedIcon],
  ["15", "Traffic Rules", "Configure route and movement rules", "/configurator/traffic", SettingsOutlinedIcon],
  ["15", "Processing Zones", "Create operational zones and mappings", "/configurator/zones", MapOutlinedIcon],
] as const;

const tabs = ["All", "Scheduled", "In progress", "Completed", "Cancelled"];
const roleOptions: Role[] = ["Configurator", "Supervisor", "Requester", "Manager"];
const workflowNodeTemplates: Record<WorkflowTone, WorkflowNodeModel> = {
  start: { tone: "start", title: "Start Node", rows: ["Start Trigger", "Auto API"] },
  material: { tone: "material", title: "Material Node", rows: ["Material", "SKU", "Sub- SKU", "Quantity", "100 units"] },
  station: { tone: "station", title: "Station Node", rows: ["Station", "From Mapping", "Map001", "Confirmation", "Manual"] },
  turns: { tone: "turns", title: "Turn Node", rows: ["Turn", "Left", "Speed limit", "1.2 m/s"] },
  aiot: { tone: "aiot", title: "AIoT Node", rows: ["Sensor", "Dock clear", "Timeout", "30 sec"] },
  end: { tone: "end", title: "End Node", rows: ["End Trigger", "Auto API"] },
};

const configuratorModules: Record<string, ConfigModule> = {
  "/configurator/devices": { action: "Test Device", count: 6, detail: "Toggle gateway status, test heartbeat, and assign a zone.", title: "Connected Devices" },
  "/configurator/users": { action: "Invite User", count: 6, detail: "Assign requester, supervisor, or configurator access.", title: "Users" },
  "/configurator/api": { action: "Test Connection", count: 6, detail: "Validate MES, WMS, ERP, and HMI endpoints.", title: "API Integrations" },
  "/configurator/fleet": { action: "Assign AMRs", count: 5, detail: "Group movers by fleet and operating area.", title: "Fleet" },
  "/configurator/traffic": { action: "Toggle Rule", count: 5, detail: "Set one-way aisles, priority lanes, and restricted zones.", title: "Traffic Rules" },
  "/configurator/triggers": { action: "Test Trigger", count: 5, detail: "Validate API, station, and schedule trigger conditions.", title: "Triggers" },
  "/configurator/zones": { action: "Review Zone Setup", count: 5, detail: "Assign maps, stations, staging, WIP, and material rules.", title: "Processing Zones" },
  "/configurator/notifications": { action: "Enable Alert", count: 5, detail: "Configure alert recipients and acknowledgement rules.", title: "Notifications" },
};

const configuratorScreens: ConfiguratorScreen[] = [
  "dashboard",
  "amrs",
  "amr-configurations",
  "maps",
  "map-editor",
  "triggers",
  "fleets",
  "fleets-amrs",
  "fleet-maps",
  "master-data",
  "staging-area",
  "staging-area-1",
  "general-settings",
  "general-settings-1",
  "workflow-builder",
  "workflow-builder-1",
  "hover-list",
];

const configuratorImages: Record<ConfiguratorScreen, { alt: string; file: string; title: string }> = {
  dashboard: { alt: "Configurator dashboard", file: "dashboard.png", title: "Dashboard" },
  amrs: { alt: "AMRs list", file: "amrs.jpg", title: "AMRs" },
  "amr-configurations": { alt: "AMR configurations", file: "amr-configurations.png", title: "AMR Configurations" },
  maps: { alt: "Maps list", file: "maps.jpg", title: "Maps" },
  "map-editor": { alt: "Map editor", file: "map-editor.jpg", title: "Map Editor" },
  triggers: { alt: "Triggers", file: "triggers.jpg", title: "Triggers" },
  fleets: { alt: "Fleets list", file: "fleets.jpg", title: "Fleets" },
  "fleets-amrs": { alt: "Fleet AMRs tab", file: "fleets-amrs.jpg", title: "Fleet AMRs" },
  "fleet-maps": { alt: "Fleet maps tab", file: "fleet-maps.jpg", title: "Fleet Maps" },
  "master-data": { alt: "Master data", file: "master-data.png", title: "Master Data" },
  "staging-area": { alt: "Staging area", file: "staging-area.png", title: "Staging Area" },
  "staging-area-1": { alt: "Staging area detail", file: "staging-area-1.png", title: "Staging Area Detail" },
  "general-settings": { alt: "General settings", file: "general-settings.png", title: "General Settings" },
  "general-settings-1": { alt: "General settings detail", file: "general-settings-1.png", title: "General Settings Detail" },
  "workflow-builder": { alt: "Workflow builder", file: "workflow-builder.png", title: "Workflow Builder" },
  "workflow-builder-1": { alt: "Workflow builder configured", file: "workflow-builder-1.png", title: "Workflow Builder Detail" },
  "hover-list": { alt: "Mode hover list", file: "hover-list.png", title: "Mode List" },
};

const supervisorScreens: SupervisorScreen[] = [
  "dashboard",
  "dashboard-analytics",
  "dashboard-1",
  "dashboard-2",
  "dashboard-3",
  "dashboard-staging-area",
  "analytics-board",
  "analytics-board-1",
  "live-status",
  "live-status-pause",
  "live-status-resume",
  "live-status-legends-opened",
  "live-status-with-staging-area",
  "live-status-chat-attach",
  "live-status-chat-describing",
  "staging-area-cells",
];

const supervisorImages: Record<SupervisorScreen, { alt: string; file: string; title: string }> = {
  dashboard: { alt: "Supervisor dashboard", file: "dashboard.jpg", title: "Supervisor Dashboard" },
  "dashboard-analytics": { alt: "Supervisor dashboard analytics selected", file: "dashboard.png", title: "Supervisor Dashboard Analytics" },
  "dashboard-1": { alt: "Supervisor dashboard variant one", file: "dashboard-1.png", title: "Supervisor Dashboard" },
  "dashboard-2": { alt: "Supervisor dashboard variant two", file: "dashboard-2.png", title: "Supervisor Dashboard" },
  "dashboard-3": { alt: "Supervisor dashboard variant three", file: "dashboard-3.png", title: "Supervisor Dashboard" },
  "dashboard-staging-area": { alt: "Supervisor staging area dashboard", file: "dashboard-staging-area.png", title: "Staging Area" },
  "analytics-board": { alt: "Supervisor analytics board", file: "analytics-errors.png", title: "Analytics Board" },
  "analytics-board-1": { alt: "Supervisor analytics board detail", file: "analytics-board-1.png", title: "Analytics Board Detail" },
  "live-status": { alt: "Supervisor live status", file: "live-status.png", title: "Live Status" },
  "live-status-pause": { alt: "Supervisor live status pause", file: "live-status-pause.png", title: "Pause AMR" },
  "live-status-resume": { alt: "Supervisor live status resume", file: "live-status-resume.png", title: "Resume AMR" },
  "live-status-legends-opened": { alt: "Supervisor live status legends opened", file: "live-status-legends-opened.png", title: "Map Legends" },
  "live-status-with-staging-area": { alt: "Supervisor live status with staging area", file: "live-status-with-staging-area.png", title: "Live Status Staging Area" },
  "live-status-chat-attach": { alt: "Supervisor chat support attach", file: "live-status-chat-attach.png", title: "Support Attachment" },
  "live-status-chat-describing": { alt: "Supervisor chat support describing", file: "live-status-chat-describing.png", title: "Support Description" },
  "staging-area-cells": { alt: "Supervisor staging area cells", file: "staging-area-cells.png", title: "Staging Area Cells" },
};

const approverScreens: ApproverScreen[] = ["pending", "cancelled-list", "cancelled-reason", "cancelled-success", "away"];

const approverImages: Record<ApproverScreen, { alt: string; file: string; title: string }> = {
  pending: { alt: "Approver tablet pending requests", file: "pending.jpg", title: "Pending Requests" },
  "cancelled-list": { alt: "Approver tablet cancelled requests", file: "cancelled-list.jpg", title: "Cancelled Requests" },
  "cancelled-reason": { alt: "Approver tablet cancellation reason dialog", file: "cancelled-reason.png", title: "Cancellation Reason" },
  "cancelled-success": { alt: "Approver tablet cancellation success", file: "cancelled-success.jpg", title: "Cancellation Success" },
  away: { alt: "Approver tablet away state", file: "away.jpg", title: "Away" },
};

const requesterTabletScreens: RequesterTabletScreen[] = ["history", "alerts", "live-status", "booking-start", "booking-amr", "booking-material", "booking-review"];

const requesterTabletImages: Record<RequesterTabletScreen, { alt: string; file: string; title: string }> = {
  history: { alt: "Requester tablet history", file: "history.jpg", title: "History" },
  alerts: { alt: "Requester tablet alerts", file: "alerts.jpg", title: "Alerts" },
  "live-status": { alt: "Requester tablet live status", file: "live-status.jpg", title: "Track Trip" },
  "booking-start": { alt: "Requester tablet trip option selection", file: "booking-start.jpg", title: "Book Trip" },
  "booking-amr": { alt: "Requester tablet AMR trip booking", file: "booking-amr.jpg", title: "Schedule AMR Trip" },
  "booking-material": { alt: "Requester tablet material delivery booking", file: "booking-material.jpg", title: "Schedule Material Delivery" },
  "booking-review": { alt: "Requester tablet booking review", file: "booking-review.jpg", title: "Confirm Trip" },
};

const managerTabletScreens: ManagerTabletScreen[] = ["action-center", "staging-area", "wip-inventory", "notifications"];

const managerTabletImages: Record<ManagerTabletScreen, { alt: string; file: string; title: string }> = {
  "action-center": { alt: "Manager tablet action center", file: "manual-trip-booking.jpg", title: "Action Center" },
  "staging-area": { alt: "Manager tablet staging area", file: "staging-area.jpg", title: "Staging Area" },
  "wip-inventory": { alt: "Manager tablet WIP inventory", file: "wip-inventory.jpg", title: "WIP Inventory" },
  notifications: { alt: "Manager tablet notifications", file: "notifications.jpg", title: "Notifications" },
};

function roleFor(pathname: string): Role {
  if (pathname.startsWith("/manager")) return "Manager";
  if (pathname.startsWith("/approver")) return "Approver";
  if (pathname.startsWith("/requester")) return "Requester";
  if (pathname.startsWith("/supervisor")) return "Supervisor";
  return "Configurator";
}

function homeFor(role: Role) {
  if (role === "Manager") return "/manager";
  if (role === "Approver") return "/approver";
  if (role === "Requester") return "/requester";
  if (role === "Supervisor") return "/supervisor";
  return "/configurator";
}

export default function AFlowPrototype() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const role = roleFor(pathname);
  const [processingZone, setProcessingZone] = useState("Processing Zone");
  const [machine, setMachine] = useState("Machine 101");
  const [supportOpen, setSupportOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [selectedSherpa, setSelectedSherpa] = useState("Sherpa Pallet Mover 05");
  const workflowMode = pathname.includes("/workflow/new");
  const figmaSupervisorHome = pathname === "/supervisor";

  if (pathname === "/" || pathname === "/prototype") {
    return <PrototypeHub />;
  }

  if (role === "Configurator") {
    return <FigmaConfiguratorPrototype />;
  }

  if (role === "Supervisor") {
    return <SupervisorPrototype />;
  }

  if (role === "Approver") {
    return <ApproverTabletPrototype />;
  }

  if (role === "Requester") {
    return <RequesterTabletPrototype />;
  }

  if (role === "Manager") {
    return <ManagerTabletPrototype />;
  }

  const content = useMemo(() => {
    if (pathname.endsWith("/settings")) return <OperationsPage title="Settings" primaryAction="Save settings" detail="Review role preferences, processing area defaults, and notification behavior." />;
    if (pathname.endsWith("/profile")) return <OperationsPage title="Profile" primaryAction="Update profile" detail="Review user role, active machine, support access, and notification routing." />;
    if (pathname === "/" || pathname === "/configurator") return <ConfiguratorDashboard />;
    if (pathname.startsWith("/configurator/amr")) return <AmrCatalog />;
    if (pathname.startsWith("/configurator/maps")) return <MapCatalog />;
    if (pathname.startsWith("/configurator")) return <ConfiguratorCollection path={pathname} />;
    if (pathname.startsWith("/supervisor/live"))
      return <LiveMonitor selectedSherpa={selectedSherpa} setSelectedSherpa={setSelectedSherpa} />;
    if (pathname.startsWith("/supervisor/workflow/new")) return <WorkflowMaker />;
    if (pathname.startsWith("/supervisor/workflow")) return <WorkflowCatalog />;
    if (pathname.startsWith("/supervisor/trips")) return <TripOperationsPage />;
    if (pathname.startsWith("/supervisor/staging")) return <StagingArea role="Supervisor" />;
    if (pathname.startsWith("/supervisor/inventory")) return <OperationsPage title="WIP Inventory" primaryAction="Reconcile WIP" detail="Review work-in-progress material and reconcile exceptions by station." />;
    if (pathname.startsWith("/supervisor/analytics")) return <OperationsPage title="Analytics" primaryAction="Export report" detail="Track throughput, utilization, queue delays, and exception trends." />;
    if (pathname.startsWith("/supervisor/notifications")) return <OperationsPage title="Notifications" primaryAction="Acknowledge alert" detail="Review fleet and workflow alerts assigned to this processing zone." />;
    if (pathname.startsWith("/supervisor")) return <SupervisorDashboard zone={processingZone} />;
    if (pathname.startsWith("/requester/live"))
      return <LiveMonitor selectedSherpa={selectedSherpa} setSelectedSherpa={setSelectedSherpa} />;
    if (pathname.startsWith("/requester/book/amr")) return <AmrTripBooking />;
    if (pathname.startsWith("/requester/book/material")) return <MaterialDeliveryBooking />;
    if (pathname.startsWith("/requester/book")) return <BookingChoice />;
    if (pathname.startsWith("/requester/staging")) return <StagingArea role="Requester" />;
    if (pathname.startsWith("/requester/alerts")) return <OperationsPage title="Alerts" primaryAction="Mark read" detail="Acknowledge requester alerts for delayed, cancelled, or completed trips." />;
    if (pathname.startsWith("/requester")) return <RequesterHistory />;
    return <ConfiguratorDashboard />;
  }, [pathname, processingZone, selectedSherpa]);

  function switchRole(nextRole: Role) {
    setRoleMenuOpen(false);
    setSupportOpen(false);
    navigate(homeFor(nextRole));
  }

  return (
    <div className={`af-app ${figmaSupervisorHome ? "is-figma-supervisor-home" : ""}`} style={{ "--af-floorplan-image": `url("${asset("facility-floorplan.png")}")` } as CSSProperties}>
      <header className="af-top">
        <div className="af-brand-card">
          <button className="af-logo" onClick={() => navigate(homeFor(role))} type="button">
            <span>Ati</span> <b>Flow</b>
          </button>
          <button
            aria-expanded={roleMenuOpen}
            aria-haspopup="menu"
            className="af-role-pill"
            type="button"
            onClick={() => setRoleMenuOpen((open) => !open)}
          >
            {figmaSupervisorHome ? "Supervisor Mode" : role}
            <KeyboardArrowDownRoundedIcon />
          </button>
          {roleMenuOpen && (
            <div className="af-role-menu" role="menu">
              {roleOptions.map((option) => (
                <button
                  className={option === role ? "active" : ""}
                  key={option}
                  role="menuitem"
                  type="button"
                  onClick={() => switchRole(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="af-command-card">
          <button className="af-round-button" type="button" aria-label="Go back" onClick={() => navigate(-1)}>
            <ArrowBackRoundedIcon />
          </button>
          <button className="af-round-button" type="button" aria-label="Go forward" onClick={() => navigate(1)}>
            <ArrowForwardRoundedIcon />
          </button>
          <div className="af-search">
            <SearchRoundedIcon />
            <span>{figmaSupervisorHome ? "Search Ati Flow" : "Super Search"}</span>
          </div>
        </div>
        <button className="af-support" aria-label="Open support agent" type="button" onClick={() => setSupportOpen(true)}>
          {role === "Requester" ? <HelpOutlineRoundedIcon /> : null}
          {figmaSupervisorHome ? "Go to support" : role === "Requester" ? "Support" : "Support/Agent"}
        </button>
      </header>

      <div className={`af-layout ${workflowMode ? "is-workflow-layout" : ""}`}>
        <Sidebar
          machine={machine}
          processingZone={processingZone}
          role={role}
          setMachine={setMachine}
          setProcessingZone={setProcessingZone}
        />
        <main className={`af-canvas ${workflowMode ? "is-workflow-maker" : ""}`}>
          {content}
        </main>
      </div>
      {supportOpen && <SupportPanel onClose={() => setSupportOpen(false)} />}
    </div>
  );
}

function PrototypeHub() {
  const [desktop, setDesktop] = useState<DesktopPrototype>("Configurator");
  const [tablet, setTablet] = useState<TabletPrototype>("Approver");

  return (
    <main className="prototype-hub">
      <section className="prototype-group">
        <div className="prototype-switcher" aria-label="Desktop prototype switcher">
          <span>Desktop</span>
          {(["Configurator", "Supervisor"] as const).map((option) => (
            <button className={desktop === option ? "active" : ""} key={option} type="button" onClick={() => setDesktop(option)}>
              {option}
            </button>
          ))}
        </div>
        {desktop === "Configurator" ? (
          <FigmaConfiguratorPrototype onModeSwitch={setDesktop} />
        ) : (
          <SupervisorPrototype onModeSwitch={setDesktop} />
        )}
      </section>

      <section className="prototype-group">
        <div className="prototype-switcher" aria-label="Tablet prototype switcher">
          <span>Tablet</span>
          {(["Approver", "Manager", "Requester"] as const).map((option) => (
            <button className={tablet === option ? "active" : ""} key={option} type="button" onClick={() => setTablet(option)}>
              {option}
            </button>
          ))}
        </div>
        {tablet === "Approver" && <ApproverTabletPrototype />}
        {tablet === "Manager" && <ManagerTabletPrototype />}
        {tablet === "Requester" && <RequesterTabletPrototype />}
      </section>
    </main>
  );
}

function FigmaConfiguratorPrototype({ onModeSwitch }: { onModeSwitch?: (next: DesktopPrototype) => void }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const initialPage: ConfiguratorScreen = pathname.includes("/maps")
    ? "maps"
    : pathname.includes("/triggers")
      ? "triggers"
      : pathname.includes("/fleet")
        ? "fleets"
        : pathname.includes("/amr")
          ? "amrs"
          : "dashboard";
  const [currentPage, setCurrentPage] = useState<ConfiguratorScreen>(initialPage);
  const [history, setHistory] = useState<ConfiguratorScreen[]>([initialPage]);
  const [historyIndex, setHistoryIndex] = useState(0);

  function showScreen(page: ConfiguratorScreen, recordHistory = true) {
    if (recordHistory && page !== currentPage) {
      const nextHistory = history.slice(0, historyIndex + 1).concat(page);
      setHistory(nextHistory);
      setHistoryIndex(nextHistory.length - 1);
    }
    setCurrentPage(page);
    document.title = `ATI Robotics - ${configuratorImages[page].title}`;
  }

  function goBack() {
    if (historyIndex <= 0) return;
    const nextIndex = historyIndex - 1;
    setHistoryIndex(nextIndex);
    showScreen(history[nextIndex], false);
  }

  function goForward() {
    if (historyIndex >= history.length - 1) return;
    const nextIndex = historyIndex + 1;
    setHistoryIndex(nextIndex);
    showScreen(history[nextIndex], false);
  }

  const assetPath = (file: string) => `${import.meta.env.BASE_URL}configurator-assets/${file}`;

  return (
    <DeviceFrame kind="desktop">
    <main className="configurator-prototype" aria-label="ATI Robotics configurator prototype">
      {configuratorScreens.map((screen) => (
        <img
          className={screen === currentPage ? "configurator-screen active" : "configurator-screen"}
          key={screen}
          src={assetPath(configuratorImages[screen].file)}
          alt={configuratorImages[screen].alt}
        />
      ))}
      <ScreenHotspot className="mode" label="Switch to supervisor mode" rect={[20, 20, 217, 60]} onClick={() => onModeSwitch ? onModeSwitch("Supervisor") : navigate("/supervisor")} />
      <ScreenHotspot label="Go back" rect={[269, 30, 40, 40]} disabled={historyIndex <= 0} onClick={goBack} />
      <ScreenHotspot label="Go forward" rect={[321, 30, 40, 40]} disabled={historyIndex >= history.length - 1} onClick={goForward} />
      <ScreenHotspot label="Go to support" rect={[1246, 20, 174, 60]} onClick={() => showScreen("general-settings")} />
      <ScreenHotspot label="Dashboard" rect={[20, 100, 217, 40]} onClick={() => showScreen("dashboard")} />
      <ScreenHotspot label="AMRs" rect={[20, 209, 217, 40]} onClick={() => showScreen("amrs")} />
      <ScreenHotspot label="Maps" rect={[20, 257, 217, 40]} onClick={() => showScreen("maps")} />
      <ScreenHotspot label="Triggers" rect={[20, 305, 217, 40]} onClick={() => showScreen("triggers")} />
      <ScreenHotspot label="Fleets" rect={[20, 414, 217, 40]} onClick={() => showScreen("fleets")} />
      <ScreenHotspot label="Traffic Rules" rect={[20, 462, 217, 40]} onClick={() => showScreen("maps")} />
      <ScreenHotspot label="Master Data" rect={[20, 571, 217, 40]} onClick={() => showScreen("master-data")} />
      <ScreenHotspot label="Workflow Builder" rect={[20, 619, 217, 40]} onClick={() => showScreen("workflow-builder")} />
      <ScreenHotspot label="General Settings" rect={[20, 916, 217, 40]} onClick={() => showScreen("general-settings")} />
      <ScreenHotspot label="Profile" rect={[20, 964, 217, 40]} onClick={() => showScreen("general-settings-1")} />

      {currentPage === "dashboard" && (
        <>
          <ScreenHotspot label="Manage AMRs" rect={[282, 624, 200, 160]} onClick={() => showScreen("amrs")} />
          <ScreenHotspot label="Manage Maps" rect={[502, 624, 200, 160]} onClick={() => showScreen("maps")} />
          <ScreenHotspot label="Manage Devices" rect={[722, 624, 200, 160]} onClick={() => showScreen("master-data")} />
          <ScreenHotspot label="Manage Fleets" rect={[282, 804, 200, 160]} onClick={() => showScreen("fleets")} />
          <ScreenHotspot label="Manage Workflows" rect={[502, 804, 200, 160]} onClick={() => showScreen("workflow-builder")} />
          <ScreenHotspot label="Manage Users" rect={[722, 804, 200, 160]} onClick={() => showScreen("master-data")} />
        </>
      )}

      {currentPage === "amrs" && <ScreenHotspot label="Configure AMR" rect={[257, 160, 1163, 740]} onClick={() => showScreen("amr-configurations")} />}
      {currentPage === "amr-configurations" && <ScreenHotspot label="Save AMR configuration" rect={[1312, 120, 88, 40]} onClick={() => showScreen("amrs")} />}
      {currentPage === "maps" && <ScreenHotspot label="Open map editor" rect={[257, 160, 1163, 740]} onClick={() => showScreen("map-editor")} />}
      {currentPage === "map-editor" && <ScreenHotspot label="Save map editor" rect={[1280, 120, 120, 40]} onClick={() => showScreen("maps")} />}
      {currentPage === "fleets" && <ScreenHotspot label="Open fleet details" rect={[257, 160, 1163, 740]} onClick={() => showScreen("fleets-amrs")} />}
      {["fleets-amrs", "fleet-maps"].includes(currentPage) && (
        <>
          <ScreenHotspot label="Fleet AMRs tab" rect={[283, 160, 140, 40]} onClick={() => showScreen("fleets-amrs")} />
          <ScreenHotspot label="Fleet Maps tab" rect={[463, 160, 140, 40]} onClick={() => showScreen("fleet-maps")} />
          <ScreenHotspot label="Back to fleets" rect={[289, 121, 120, 24]} onClick={() => showScreen("fleets")} />
        </>
      )}
      {currentPage === "workflow-builder" && <ScreenHotspot label="Configure workflow" rect={[360, 280, 520, 520]} onClick={() => showScreen("workflow-builder-1")} />}
      {currentPage === "workflow-builder-1" && <ScreenHotspot label="Save workflow" rect={[1280, 120, 120, 40]} onClick={() => showScreen("workflow-builder")} />}
      {currentPage === "master-data" && <ScreenHotspot label="Open staging area" rect={[257, 160, 1163, 740]} onClick={() => showScreen("staging-area")} />}
      {currentPage === "staging-area" && <ScreenHotspot label="Open staging detail" rect={[257, 160, 1163, 740]} onClick={() => showScreen("staging-area-1")} />}
      {currentPage === "staging-area-1" && <ScreenHotspot label="Back to staging area" rect={[269, 30, 40, 40]} onClick={() => showScreen("staging-area")} />}
      {currentPage === "general-settings" && <ScreenHotspot label="Save general settings" rect={[1312, 120, 88, 40]} onClick={() => showScreen("general-settings-1")} />}
      {currentPage === "hover-list" && <ScreenHotspot label="Return to configurator dashboard" rect={[20, 20, 217, 120]} onClick={() => showScreen("dashboard")} />}
    </main>
    </DeviceFrame>
  );
}

function SupervisorPrototype({ onModeSwitch }: { onModeSwitch?: (next: DesktopPrototype) => void }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const initialPage: SupervisorScreen = pathname.includes("/live")
    ? "live-status"
    : pathname.includes("/analytics")
      ? "analytics-board"
      : pathname.includes("/staging")
        ? "dashboard-staging-area"
        : pathname.includes("/inventory")
          ? "dashboard-3"
          : pathname.includes("/trips")
            ? "dashboard-1"
            : "dashboard";
  const [currentPage, setCurrentPage] = useState<SupervisorScreen>(initialPage);
  const [history, setHistory] = useState<SupervisorScreen[]>([initialPage]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  function showScreen(page: SupervisorScreen, recordHistory = true) {
    if (recordHistory && page !== currentPage) {
      const nextHistory = history.slice(0, historyIndex + 1).concat(page);
      setHistory(nextHistory);
      setHistoryIndex(nextHistory.length - 1);
    }
    setCurrentPage(page);
    setDatePickerOpen(false);
    document.title = `ATI Robotics - ${supervisorImages[page].title}`;
  }

  function goBack() {
    if (historyIndex <= 0) return;
    const nextIndex = historyIndex - 1;
    setHistoryIndex(nextIndex);
    showScreen(history[nextIndex], false);
  }

  function goForward() {
    if (historyIndex >= history.length - 1) return;
    const nextIndex = historyIndex + 1;
    setHistoryIndex(nextIndex);
    showScreen(history[nextIndex], false);
  }

  const assetPath = (file: string) => `${import.meta.env.BASE_URL}supervisor-assets/${file}`;
  const liveStatusOpen = currentPage.startsWith("live-status");
  const dashboardCycle: Record<SupervisorScreen, SupervisorScreen> = {
    dashboard: "dashboard-1",
    "dashboard-analytics": "dashboard",
    "dashboard-1": "dashboard-2",
    "dashboard-2": "dashboard-3",
    "dashboard-3": "dashboard-analytics",
    "dashboard-staging-area": "staging-area-cells",
    "analytics-board": "analytics-board-1",
    "analytics-board-1": "analytics-board",
    "live-status": "live-status-pause",
    "live-status-pause": "live-status-resume",
    "live-status-resume": "live-status-pause",
    "live-status-legends-opened": "live-status",
    "live-status-with-staging-area": "live-status",
    "live-status-chat-attach": "live-status-chat-describing",
    "live-status-chat-describing": "live-status",
    "staging-area-cells": "dashboard-staging-area",
  };

  return (
    <DeviceFrame kind="desktop">
    <main className="configurator-prototype" aria-label="ATI Robotics supervisor prototype">
      {supervisorScreens.map((screen) => (
        <img
          className={screen === currentPage ? "configurator-screen active" : "configurator-screen"}
          key={screen}
          src={assetPath(supervisorImages[screen].file)}
          alt={supervisorImages[screen].alt}
        />
      ))}

      <ScreenHotspot className="mode" label="Switch to configurator mode" rect={[20, 20, 217, 60]} onClick={() => onModeSwitch ? onModeSwitch("Configurator") : navigate("/configurator")} />
      <ScreenHotspot label="Go back" rect={[269, 30, 40, 40]} disabled={historyIndex <= 0} onClick={goBack} />
      <ScreenHotspot label="Go forward" rect={[321, 30, 40, 40]} disabled={historyIndex >= history.length - 1} onClick={goForward} />
      <ScreenHotspot label="Go to support" rect={[1246, 20, 174, 60]} onClick={() => showScreen("live-status-chat-attach")} />

      <ScreenHotspot label="Dashboard" rect={[20, 209, 217, 40]} onClick={() => showScreen("dashboard")} />
      <ScreenHotspot label="Live Status" rect={[20, 318, 217, 40]} onClick={() => showScreen("live-status")} />
      <ScreenHotspot label="Analytics" rect={[20, 366, 217, 40]} onClick={() => showScreen("analytics-board")} />
      <ScreenHotspot label="AMR Trips" rect={[20, 475, 217, 40]} onClick={() => showScreen("dashboard-1")} />
      <ScreenHotspot label="Staging Area" rect={[20, 527, 217, 40]} onClick={() => showScreen("dashboard-staging-area")} />
      <ScreenHotspot label="WIP Inventory" rect={[20, 579, 217, 40]} onClick={() => showScreen("dashboard-3")} />
      <ScreenHotspot label="Notifications" rect={[20, 868, 217, 40]} onClick={() => showScreen("dashboard-2")} />
      <ScreenHotspot label="Settings" rect={[20, 916, 217, 40]} onClick={() => showScreen("dashboard-3")} />
      <ScreenHotspot label="Profile" rect={[20, 964, 217, 40]} onClick={() => showScreen("dashboard-1")} />

      {currentPage === "dashboard" && (
        <>
          <ScreenHotspot className="silent" label="Open live fleet status" rect={[257, 100, 581, 550]} onClick={() => showScreen("live-status")} />
          <ScreenHotspot className="silent" label="Open trip overview" rect={[858, 100, 562, 550]} onClick={() => showScreen("dashboard-1")} />
          <ScreenHotspot className="silent" label="Open analytics board" rect={[257, 670, 1163, 334]} onClick={() => showScreen("analytics-board")} />
          <ScreenHotspot label="Expand analytics" rect={[1378, 678, 30, 30]} onClick={() => showScreen("analytics-board")} />
        </>
      )}

      {["dashboard-analytics", "dashboard-1", "dashboard-2", "dashboard-3"].includes(currentPage) && (
        <ScreenHotspot className="silent" label="Cycle dashboard state" rect={[257, 100, 1163, 904]} onClick={() => showScreen(dashboardCycle[currentPage])} />
      )}

      {liveStatusOpen && (
        <>
          <ScreenHotspot label="Toggle AMR pause resume" rect={[1054, 405, 120, 80]} onClick={() => showScreen(dashboardCycle[currentPage])} />
          <ScreenHotspot label="Open map legends" rect={[1271, 115, 131, 40]} onClick={() => showScreen("live-status-legends-opened")} />
          <ScreenHotspot label="Show staging area on map" rect={[294, 930, 100, 36]} onClick={() => showScreen("live-status-with-staging-area")} />
          <ScreenHotspot label="Close live status panel" rect={[1358, 178, 30, 30]} onClick={() => showScreen("live-status")} />
        </>
      )}

      {currentPage === "live-status-chat-attach" && (
        <ScreenHotspot label="Attach and describe support issue" rect={[1036, 884, 354, 104]} onClick={() => showScreen("live-status-chat-describing")} />
      )}
      {currentPage === "live-status-chat-describing" && (
        <ScreenHotspot label="Close support chat" rect={[1358, 178, 30, 30]} onClick={() => showScreen("live-status")} />
      )}

      {currentPage === "analytics-board" && (
        <>
          <ScreenHotspot className="silent" label="Open analytics detail" rect={[257, 160, 1163, 844]} onClick={() => showScreen("analytics-board-1")} />
          <ScreenHotspot label="Open date picker" rect={[1051, 112, 205, 40]} onClick={() => setDatePickerOpen((open) => !open)} />
          {datePickerOpen && <SupervisorDatePicker onClose={() => setDatePickerOpen(false)} />}
        </>
      )}
      {currentPage === "analytics-board-1" && (
        <ScreenHotspot className="silent" label="Return to analytics board" rect={[257, 100, 1163, 904]} onClick={() => showScreen("analytics-board")} />
      )}

      {currentPage === "dashboard-staging-area" && (
        <ScreenHotspot className="silent" label="Open staging area cells" rect={[257, 100, 1163, 904]} onClick={() => showScreen("staging-area-cells")} />
      )}
      {currentPage === "staging-area-cells" && (
        <ScreenHotspot className="silent" label="Return to staging dashboard" rect={[257, 100, 1163, 904]} onClick={() => showScreen("dashboard-staging-area")} />
      )}
    </main>
    </DeviceFrame>
  );
}

function DeviceFrame({ children, kind }: { children: ReactNode; kind: "desktop" | "tablet" }) {
  return (
    <div className={`device-stage ${kind}`}>
      <div className={`device-frame ${kind}`}>
        <div className="device-screen">{children}</div>
      </div>
    </div>
  );
}

function ScreenHotspot({ className = "", disabled = false, label, onClick, rect }: { className?: string; disabled?: boolean; label: string; onClick: () => void; rect: [number, number, number, number] }) {
  return (
    <button
      aria-label={label}
      className={`screen-hotspot ${className}`}
      disabled={disabled}
      style={{ left: rect[0], top: rect[1], width: rect[2], height: rect[3] }}
      type="button"
      onClick={onClick}
    />
  );
}

function SupervisorDatePicker({ onClose }: { onClose: () => void }) {
  const years = Array.from({ length: 28 }, (_, index) => 2015 + index);

  return (
    <div className="supervisor-date-picker" role="dialog" aria-label="Date picker">
      <div className="supervisor-date-picker__month">
        <button type="button" aria-label="Previous month">‹</button>
        <span>July 2026</span>
        <button type="button" aria-label="Next month">›</button>
      </div>
      <div className="supervisor-date-picker__grid">
        {years.map((year) => (
          <button className={year === 2026 ? "active" : ""} key={year} type="button" onClick={onClose}>
            {year}
          </button>
        ))}
      </div>
    </div>
  );
}

function ApproverTabletPrototype() {
  const [currentPage, setCurrentPage] = useState<ApproverScreen>("pending");
  const assetPath = (file: string) => `${import.meta.env.BASE_URL}approver-assets/${file}`;

  function showScreen(page: ApproverScreen) {
    setCurrentPage(page);
    document.title = `ATI Flow - ${approverImages[page].title}`;
  }

  return (
    <DeviceFrame kind="tablet">
    <main className="tablet-prototype" aria-label="ATI Flow approver tablet prototype">
      {approverScreens.map((screen) => (
        <img
          className={screen === currentPage ? "tablet-screen active" : "tablet-screen"}
          key={screen}
          src={assetPath(approverImages[screen].file)}
          alt={approverImages[screen].alt}
        />
      ))}

      <ScreenHotspot className="silent" label="Active requests" rect={[210, 25, 102, 40]} onClick={() => showScreen("pending")} />
      <ScreenHotspot className="silent" label="Cancelled requests" rect={[366, 25, 130, 40]} onClick={() => showScreen("cancelled-list")} />
      <ScreenHotspot className="silent" label="All requests" rect={[526, 25, 110, 40]} onClick={() => showScreen("cancelled-success")} />
      <ScreenHotspot label="Action Center" rect={[10, 164, 156, 40]} onClick={() => showScreen("pending")} />
      <ScreenHotspot label="Away toggle" rect={[132, 576, 32, 18]} onClick={() => showScreen(currentPage === "away" ? "pending" : "away")} />
      <ScreenHotspot label="RTLS toggle" rect={[132, 606, 32, 18]} onClick={() => showScreen("cancelled-list")} />

      {currentPage === "pending" && (
        <>
          {[90, 160, 230, 300].map((top) => (
            <div className="approver-row-actions" key={top} style={{ top }}>
              <button aria-label="Approve dispatch request" type="button" onClick={() => showScreen("cancelled-success")}>
                <CheckRoundedIcon />
              </button>
              <button aria-label="Cancel dispatch request" type="button" onClick={() => showScreen("cancelled-reason")}>
                <CloseRoundedIcon />
              </button>
            </div>
          ))}
        </>
      )}
      {currentPage === "cancelled-list" && (
        <ScreenHotspot className="silent" label="Return to pending requests" rect={[188, 90, 812, 280]} onClick={() => showScreen("pending")} />
      )}
      {currentPage === "cancelled-reason" && (
        <>
          <ScreenHotspot label="Close cancellation dialog" rect={[782, 490, 78, 35]} onClick={() => showScreen("pending")} />
          <button className="approver-dialog-cancel" type="button" onClick={() => showScreen("cancelled-list")}>
            <CloseRoundedIcon />
            Cancel
          </button>
        </>
      )}
      {currentPage === "cancelled-success" && (
        <ScreenHotspot className="silent" label="Return to cancelled list" rect={[188, 90, 812, 280]} onClick={() => showScreen("cancelled-list")} />
      )}
    </main>
    </DeviceFrame>
  );
}

function RequesterTabletPrototype() {
  const { pathname } = useLocation();
  const initialPage: RequesterTabletScreen = pathname.includes("/live")
    ? "live-status"
    : pathname.includes("/alerts")
      ? "alerts"
      : pathname.includes("/book")
        ? "booking-start"
        : "history";
  const [currentPage, setCurrentPage] = useState<RequesterTabletScreen>(initialPage);
  const assetPath = (file: string) => `${import.meta.env.BASE_URL}requester-assets/${file}`;

  function showScreen(page: RequesterTabletScreen) {
    setCurrentPage(page);
    document.title = `ATI Flow - ${requesterTabletImages[page].title}`;
  }

  return (
    <DeviceFrame kind="tablet">
    <main className="tablet-prototype" aria-label="ATI Flow requester tablet prototype">
      {requesterTabletScreens.map((screen) => (
        <img
          className={screen === currentPage ? "tablet-screen active" : "tablet-screen"}
          key={screen}
          src={assetPath(requesterTabletImages[screen].file)}
          alt={requesterTabletImages[screen].alt}
        />
      ))}

      <ScreenHotspot label="Profile" rect={[32, 572, 105, 54]} onClick={() => showScreen("history")} />
      <ScreenHotspot label="Alerts" rect={[152, 572, 100, 54]} onClick={() => showScreen("alerts")} />
      <ScreenHotspot label="History" rect={[268, 572, 106, 54]} onClick={() => showScreen("history")} />
      <ScreenHotspot label="Track Trip" rect={[392, 572, 128, 54]} onClick={() => showScreen("live-status")} />
      <ScreenHotspot label="Book Trip" rect={[881, 572, 133, 54]} onClick={() => showScreen("booking-start")} />

      {currentPage === "booking-start" && (
        <>
          <ScreenHotspot className="silent" label="Schedule AMR trip" rect={[27, 112, 175, 179]} onClick={() => showScreen("booking-amr")} />
          <ScreenHotspot className="silent" label="Schedule material delivery" rect={[27, 321, 175, 208]} onClick={() => showScreen("booking-material")} />
        </>
      )}
      {currentPage === "booking-amr" && (
        <>
          <ScreenHotspot className="silent" label="Edit AMR details" rect={[247, 123, 560, 360]} onClick={() => showScreen("booking-review")} />
          <ScreenHotspot label="Confirm AMR trip" rect={[881, 572, 133, 54]} onClick={() => showScreen("booking-review")} />
          <ScreenHotspot className="silent" label="Switch to material delivery" rect={[27, 321, 175, 208]} onClick={() => showScreen("booking-material")} />
        </>
      )}
      {currentPage === "booking-material" && (
        <>
          <ScreenHotspot className="silent" label="Edit material delivery details" rect={[239, 123, 745, 360]} onClick={() => showScreen("booking-review")} />
          <ScreenHotspot label="Confirm material delivery" rect={[881, 572, 133, 54]} onClick={() => showScreen("booking-review")} />
          <ScreenHotspot className="silent" label="Switch to AMR trip" rect={[27, 112, 175, 179]} onClick={() => showScreen("booking-amr")} />
        </>
      )}
      {currentPage === "booking-review" && (
        <ScreenHotspot label="Confirm trip booking" rect={[881, 572, 133, 54]} onClick={() => showScreen("history")} />
      )}
      {currentPage === "history" && (
        <>
          <ScreenHotspot label="Scheduled tab" rect={[140, 24, 130, 48]} onClick={() => showScreen("history")} />
          <ScreenHotspot label="In progress tab" rect={[300, 24, 150, 48]} onClick={() => showScreen("live-status")} />
          <ScreenHotspot className="silent" label="Track selected trip" rect={[10, 126, 1004, 420]} onClick={() => showScreen("live-status")} />
        </>
      )}
      {currentPage === "alerts" && (
        <ScreenHotspot className="silent" label="Open related trip" rect={[10, 90, 1004, 280]} onClick={() => showScreen("live-status")} />
      )}
    </main>
    </DeviceFrame>
  );
}

function ManagerTabletPrototype() {
  const { pathname } = useLocation();
  const initialPage: ManagerTabletScreen = pathname.includes("/staging")
    ? "staging-area"
    : pathname.includes("/wip") || pathname.includes("/inventory")
      ? "wip-inventory"
      : pathname.includes("/notifications")
        ? "notifications"
        : "action-center";
  const [currentPage, setCurrentPage] = useState<ManagerTabletScreen>(initialPage);
  const assetPath = (file: string) => `${import.meta.env.BASE_URL}manager-assets/${file}`;

  function showScreen(page: ManagerTabletScreen) {
    setCurrentPage(page);
    document.title = `ATI Flow - ${managerTabletImages[page].title}`;
  }

  return (
    <DeviceFrame kind="tablet">
    <main className="tablet-prototype" aria-label="ATI Flow manager tablet prototype">
      {managerTabletScreens.map((screen) => (
        <img
          className={screen === currentPage ? "tablet-screen active" : "tablet-screen"}
          key={screen}
          src={assetPath(managerTabletImages[screen].file)}
          alt={managerTabletImages[screen].alt}
        />
      ))}

      <ScreenHotspot label="Action Center" rect={[10, 164, 156, 40]} onClick={() => showScreen("action-center")} />
      <ScreenHotspot label="Staging Area" rect={[10, 224, 156, 40]} onClick={() => showScreen("staging-area")} />
      <ScreenHotspot label="WIP Inventory" rect={[10, 284, 156, 40]} onClick={() => showScreen("wip-inventory")} />
      <ScreenHotspot label="Notifications" rect={[10, 344, 156, 40]} onClick={() => showScreen("notifications")} />
      <ScreenHotspot label="Profile" rect={[10, 404, 156, 40]} onClick={() => showScreen("action-center")} />
      <ScreenHotspot label="Previous page" rect={[200, 581, 36, 36]} onClick={() => showScreen("action-center")} />
      <ScreenHotspot label="Next page" rect={[250, 581, 36, 36]} onClick={() => showScreen("staging-area")} />

      {currentPage === "action-center" && (
        <>
          <ScreenHotspot label="Active tab" rect={[210, 25, 92, 40]} onClick={() => showScreen("action-center")} />
          <ScreenHotspot label="Cancelled tab" rect={[350, 25, 132, 40]} onClick={() => showScreen("notifications")} />
          <ScreenHotspot label="Closed tab" rect={[520, 25, 112, 40]} onClick={() => showScreen("action-center")} />
          <ScreenHotspot className="silent" label="Open staging issue" rect={[182, 90, 832, 70]} onClick={() => showScreen("staging-area")} />
        </>
      )}
      {currentPage === "staging-area" && (
        <ScreenHotspot className="silent" label="Open blocked staging cell" rect={[238, 214, 55, 52]} onClick={() => showScreen("wip-inventory")} />
      )}
      {currentPage === "wip-inventory" && (
        <ScreenHotspot className="silent" label="Open inventory notification" rect={[182, 90, 832, 280]} onClick={() => showScreen("notifications")} />
      )}
      {currentPage === "notifications" && (
        <ScreenHotspot className="silent" label="Resolve notification" rect={[182, 90, 832, 280]} onClick={() => showScreen("action-center")} />
      )}
    </main>
    </DeviceFrame>
  );
}

function Sidebar({
  machine,
  processingZone,
  role,
  setMachine,
  setProcessingZone,
}: {
  machine: string;
  processingZone: string;
  role: Role;
  setMachine: (value: string) => void;
  setProcessingZone: (value: string) => void;
}) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const figmaSupervisorHome = role === "Supervisor" && pathname === "/supervisor";
  const groups = role === "Configurator" ? CONFIG_GROUPS : figmaSupervisorHome ? SUPERVISOR_HOME_GROUPS : role === "Supervisor" ? INTERFACE_GROUPS : REQUESTER_GROUPS;
  const compact = pathname.includes("/workflow/new");
  const isActivePath = (path: string) => {
    const exactOnly = path === "/configurator" || path === "/supervisor" || path === "/requester/history";
    return pathname === path || (!exactOnly && pathname.startsWith(`${path}/`));
  };

  return (
    <aside className={compact ? "af-sidebar is-rail" : "af-sidebar"}>
      {role !== "Configurator" && !compact && (
        <>
        {figmaSupervisorHome && <div className="af-nav-label af-zone-heading">Processing Zone</div>}
        <button className="af-zone-select" type="button" onClick={() => setProcessingZone(processingZone === "Processing Zone" ? "Assembly North" : "Processing Zone")}>
          {figmaSupervisorHome ? "Zone 24" : processingZone}
          <ExpandMoreRoundedIcon />
        </button>
        </>
      )}
      {role === "Requester" && (
        <button className="af-book-button" type="button" onClick={() => navigate("/requester/book")}>
          <span><AddRoundedIcon /></span>
          Book New Trip
        </button>
      )}
      {compact && (
        <nav className="af-rail-nav" aria-label="Supervisor workflow navigation">
          {INTERFACE_GROUPS.flatMap((group) => group.items).map((item) => {
            const Icon = item.icon;
            const active = isActivePath(item.path);
            return (
              <button className={active ? "active" : ""} key={item.path} type="button" aria-label={item.label} onClick={() => navigate(item.path)}>
                <Icon />
              </button>
            );
          })}
        </nav>
      )}
      {!compact && (
        <nav className="af-nav">
          {groups.map((group, index) => (
            <div className="af-nav-group" key={`${group.label ?? "root"}-${index}`}>
              {group.label && <div className="af-nav-label">{group.label}</div>}
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActivePath(item.path);
                return (
                  <button
                    className={`af-nav-item ${active ? "active" : ""} ${item.label === "Book New Trip" ? "book" : ""}`}
                    key={item.path}
                    type="button"
                    onClick={() => navigate(item.path)}
                  >
                    <Icon />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      )}
      <div className="af-sidebar-bottom">
        {figmaSupervisorHome && (
          <button className="af-nav-item" type="button" aria-label="Notifications" onClick={() => navigate("/supervisor/notifications")}>
            <NotificationsNoneRoundedIcon />
            <span>Notifications</span>
          </button>
        )}
        <button className="af-nav-item" type="button" aria-label="Settings" onClick={() => navigate(`${homeFor(role).split("/").slice(0, 2).join("/")}/settings`)}>
          <SettingsOutlinedIcon />
          {!compact && <span>Settings</span>}
        </button>
        <button className="af-nav-item" type="button" aria-label="Profile" onClick={() => navigate(`${homeFor(role).split("/").slice(0, 2).join("/")}/profile`)}>
          <PersonOutlineRoundedIcon />
          {!compact && <span>Profile</span>}
        </button>
        {role === "Requester" && !compact && (
          <label className="af-machine-select">
            <span>Machine</span>
            <button type="button" onClick={() => setMachine(machine === "Machine 101" ? "Machine 204" : "Machine 101")}>
              {machine}
              <ExpandMoreRoundedIcon />
            </button>
          </label>
        )}
      </div>
    </aside>
  );
}

function ConfiguratorDashboard() {
  const navigate = useNavigate();
  return (
    <section className="config-dashboard">
      {dashboardCards.map(([value, label, detail, path, Icon]) => (
        <article className="config-stat-card" key={label}>
          <Icon className="card-corner-icon" />
          <strong>{value}</strong>
          <h2>{label}</h2>
          <p>{detail}</p>
          <button type="button" onClick={() => navigate(path)}>
            Manage {label === "AMRs" ? "AMRs" : label}
          </button>
        </article>
      ))}
    </section>
  );
}

function AmrCatalog() {
  const [view, setView] = useState<ViewMode>("grid");
  const [selected, setSelected] = useState("");
  const [panelMode, setPanelMode] = useState("Configure");
  const [hidden, setHidden] = useState<string[]>([]);
  const handleAction = (mode: string, name: string) => {
    if (mode === "Delete") {
      setHidden([...hidden, name]);
      setSelected("Select an AMR");
      setPanelMode("Deleted");
      return;
    }
    setSelected(name);
    setPanelMode(mode);
  };
  return (
    <div className={`catalog-screen ${view} ${selected ? "has-detail" : ""}`}>
      <ViewToggle setView={setView} view={view} />
      <CatalogSection
        action="Configure AMRs"
        badge="Ready"
        count={5}
        hidden={hidden}
        image={asset("sherpa-pallet.png")}
        name="Sherpa Pallet Mover"
        onAction={(name) => handleAction("Configure", name)}
        title="Pallet Movers"
        view={view}
      />
      <Divider />
      <CatalogSection
        action="Configure AMRs"
        badge="Ready"
        count={5}
        hidden={hidden}
        image={asset("sherpa-xt.png")}
        name="Sherpa XT Lite"
        onAction={(name) => handleAction("Configure", name)}
        title="Tugger AMRs"
        view={view}
      />
      {selected && <AmrDetailRail mode={panelMode} title={selected} />}
    </div>
  );
}

function MapCatalog() {
  const [view, setView] = useState<ViewMode>("grid");
  const [selected, setSelected] = useState("Map 1");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadedMap, setUploadedMap] = useState("");
  return (
    <div className={`catalog-screen ${view} has-detail`}>
      <ViewToggle setView={setView} view={view} />
      <button className="upload-map-button" type="button" onClick={() => setUploadOpen(true)}><AddRoundedIcon /> Upload Map</button>
      <MapSection title="Published Maps" count={4} prefix="Map" view={view} onAction={setSelected} />
      <Divider />
      <MapSection title="Draft Maps" count={4} prefix="Map" view={view} onAction={setSelected} />
      {uploadedMap && <div className="flow-summary">Uploaded draft: {uploadedMap}</div>}
      <MapEditorRail title={selected} />
      {uploadOpen && <UploadMapPanel onClose={() => setUploadOpen(false)} onUpload={(name) => { setUploadedMap(name); setSelected(name); setUploadOpen(false); }} />}
    </div>
  );
}

function ConfiguratorCollection({ path }: { path: string }) {
  const [view, setView] = useState<ViewMode>("grid");
  const [selected, setSelected] = useState("");
  const basePath = Object.keys(configuratorModules).find((modulePath) => path === modulePath || path.startsWith(`${modulePath}/`));
  const module = configuratorModules[basePath ?? "/configurator/devices"];
  return (
    <div className={`catalog-screen ${view} ${selected ? "has-detail" : ""}`}>
      <ViewToggle setView={setView} view={view} />
      <CatalogSection
        action={module.action}
        count={module.count}
        detail={module.detail}
        name={module.title.replace(/s$/, "")}
        onAction={setSelected}
        title={module.title}
        view={view}
      />
      {selected && <DetailRail title={selected} subtitle={module.title} action={`${module.action} panel is active.`} />}
    </div>
  );
}

function CatalogSection({
  action,
  badge,
  count,
  detail = "Open configuration panel",
  hidden = [],
  image,
  name,
  onAction,
  onDelete,
  onDuplicate,
  onEdit,
  title,
  view,
}: {
  action: string;
  badge?: string;
  count: number;
  detail?: string;
  hidden?: string[];
  image?: string;
  name: string;
  onAction: (value: string) => void;
  onDelete?: (value: string) => void;
  onDuplicate?: (value: string) => void;
  onEdit?: (value: string) => void;
  title: string;
  view: ViewMode;
}) {
  return (
    <section className="catalog-section">
      <h2>{title}</h2>
      <div className={`asset-grid five ${view}`}>
        {Array.from({ length: count }, (_, index) => `${name} ${index + 1}`)
          .filter((cardName) => !hidden.includes(cardName))
          .map((cardName) => (
            <AssetCard
              action={action}
              badge={badge}
              detail={detail}
              image={image}
              key={`${title}-${cardName}`}
              name={cardName}
              onAction={onAction}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
              onEdit={onEdit}
            />
          ))}
      </div>
    </section>
  );
}

function MapSection({ count, onAction, prefix, title, view }: { count: number; onAction: (value: string) => void; prefix: string; title: string; view: ViewMode }) {
  return (
    <section className="catalog-section">
      <h2>{title}</h2>
      <div className={`asset-grid maps ${view}`}>
        {Array.from({ length: count }, (_, index) => (
          <MapCard key={`${title}-${index}`} name={`${prefix} ${index + 1}`} onAction={onAction} />
        ))}
      </div>
    </section>
  );
}

function AssetCard({
  action,
  badge = "Fleet A",
  detail,
  image,
  name,
  onAction,
  onDelete,
  onDuplicate,
  onEdit,
}: {
  action: string;
  badge?: string;
  detail: string;
  image?: string;
  name: string;
  onAction: (value: string) => void;
  onDelete?: (value: string) => void;
  onDuplicate?: (value: string) => void;
  onEdit?: (value: string) => void;
}) {
  const displayName = name.replace(/ \d+$/, "");
  return (
    <article className="asset-card">
      <span className="asset-dot" />
      <div className="asset-image">
        {image ? <img alt={name} src={image} /> : <div className="placeholder-thumb"><GridViewRoundedIcon /><span>{name}</span></div>}
      </div>
      <h3>{displayName}</h3>
      <span className="fleet-pill">{badge}</span>
      <p>{detail}</p>
      <button type="button" onClick={() => onAction(name)}>{action}</button>
      {(onEdit || onDuplicate || onDelete) && (
        <div className="card-actions">
          {onEdit && <button type="button" onClick={() => onEdit(name)}>Edit</button>}
          {onDuplicate && <button type="button" onClick={() => onDuplicate(name)}>Duplicate</button>}
          {onDelete && <button type="button" onClick={() => onDelete(name)}>Delete</button>}
        </div>
      )}
    </article>
  );
}

function MapCard({ name, onAction }: { name: string; onAction: (value: string) => void }) {
  return (
    <article className="asset-card map-card">
      <span className="asset-dot" />
      <div className="map-thumb" />
      <h3>{name}</h3>
      <span className="fleet-pill">Fleet A</span>
      <button type="button" onClick={() => onAction(name)}>Configure Map</button>
    </article>
  );
}

function ViewToggle({ setView, view }: { setView: (value: ViewMode) => void; view: ViewMode }) {
  return (
    <div className="view-toggle" aria-label="View mode">
      <button className={view === "list" ? "active" : ""} type="button" onClick={() => setView("list")}>List View</button>
      <button className={view === "grid" ? "active" : ""} type="button" onClick={() => setView("grid")}>Grid View</button>
    </div>
  );
}

function DetailRail({ action, subtitle, title }: { action: string; subtitle: string; title: string }) {
  const [saved, setSaved] = useState(false);
  return (
    <aside className="detail-rail" aria-live="polite">
      <strong>{title}</strong>
      <span>{subtitle}</span>
      <p>{saved ? "Changes saved for this item." : action}</p>
      <button type="button" onClick={() => setSaved(true)}>{saved ? "Saved" : "Save changes"}</button>
    </aside>
  );
}

function AmrDetailRail({ mode, title }: { mode: string; title: string }) {
  const [step, setStep] = useState("Identity");
  const [saved, setSaved] = useState(false);
  return (
    <aside className="detail-rail amr-editor" aria-live="polite">
      <strong>{title}</strong>
      <span>{mode === "Deleted" ? "Removed from this draft list" : `${mode} AMR setup`}</span>
      <p>{saved ? `${step} settings saved.` : "Review identity, operating limits, and map access before publishing this AMR."}</p>
      <div className="rail-actions">
        {["Identity", "Limits", "Maps"].map((item) => (
          <button className={step === item ? "active" : ""} key={item} type="button" onClick={() => setStep(item)}>{item}</button>
        ))}
      </div>
      <dl className="rail-details">
        <div><dt>Status</dt><dd>{mode === "Deleted" ? "Removed" : "Ready"}</dd></div>
        <div><dt>Battery rule</dt><dd>Return below 18%</dd></div>
        <div><dt>Map access</dt><dd>Assembly North v2.1</dd></div>
      </dl>
      <div className="rail-actions">
        <button type="button" onClick={() => { setStep("Identity"); setSaved(false); }}>Edit</button>
        <button type="button" onClick={() => { setStep("Identity"); setSaved(true); }}>Duplicate</button>
        <button type="button" onClick={() => { setStep("Limits"); setSaved(false); }}>Delete</button>
      </div>
      <button type="button" onClick={() => setSaved(true)}>{saved ? "Saved" : "Save AMR setup"}</button>
    </aside>
  );
}

function MapEditorRail({ title }: { title: string }) {
  const [mode, setMode] = useState("Zones");
  const [published, setPublished] = useState(false);
  return (
    <aside className="detail-rail map-editor" aria-live="polite">
      <strong>{title}</strong>
      <span>{published ? "Published" : "Draft editor"}</span>
      <p>{mode} editing active. Select map areas, define geometry, and save before publish.</p>
      <div className="rail-actions">
        {["Zones", "Stations", "Routes"].map((item) => (
          <button className={mode === item ? "active" : ""} key={item} type="button" onClick={() => setMode(item)}>{item}</button>
        ))}
      </div>
      <button type="button" onClick={() => setPublished(true)}>{published ? "Published" : "Publish Map"}</button>
    </aside>
  );
}

function UploadMapPanel({ onClose, onUpload }: { onClose: () => void; onUpload: (name: string) => void }) {
  const [name, setName] = useState("Assembly North");
  const [version, setVersion] = useState("v2.1");
  const [zone, setZone] = useState("Processing Zone");
  const [file, setFile] = useState("");
  const [step, setStep] = useState(1);
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Upload map">
      <section className="map-upload-modal">
        <header>
          <div>
            <strong>Upload Map</strong>
            <span>Step {step} of 2</span>
          </div>
          <button aria-label="Close upload map" type="button" onClick={onClose}><CloseRoundedIcon /></button>
        </header>
        {step === 1 ? (
          <div className="modal-form-grid">
            <label>Map name<input aria-label="Map name" value={name} onChange={(event) => setName(event.target.value)} /></label>
            <label>Version<input aria-label="Map version" value={version} onChange={(event) => setVersion(event.target.value)} /></label>
            <label>Processing area<input aria-label="Processing area" value={zone} onChange={(event) => setZone(event.target.value)} /></label>
            <label>Map file<input aria-label="Map file" type="file" accept=".png,.jpg,.jpeg,.svg,.pdf" onChange={(event) => setFile(event.currentTarget.files?.[0]?.name ?? "")} /></label>
          </div>
        ) : (
          <div className="upload-review">
            <WarehouseMap muted />
            <dl className="rail-details">
              <div><dt>Name</dt><dd>{name}</dd></div>
              <div><dt>Version</dt><dd>{version}</dd></div>
              <div><dt>Area</dt><dd>{zone}</dd></div>
              <div><dt>File</dt><dd>{file || "Viewport.png"}</dd></div>
            </dl>
          </div>
        )}
        <footer>
          <button type="button" onClick={step === 1 ? onClose : () => setStep(1)}>{step === 1 ? "Cancel" : "Back"}</button>
          <button type="button" onClick={() => step === 1 ? setStep(2) : onUpload(`${name} ${version}`)}>
            {step === 1 ? "Review upload" : "Create draft"}
          </button>
        </footer>
      </section>
    </div>
  );
}

function Divider() {
  return <div className="catalog-divider" />;
}

function SupervisorDashboard({ zone }: { zone: string }) {
  const navigate = useNavigate();
  return (
    <div className="supervisor-grid figma-dashboard">
      <Panel title="Live Status" className="live-preview" onOpen={() => navigate("/supervisor/live")}>
        <button className="panel-link-map" type="button" onClick={() => navigate("/supervisor/live")}><FigmaWarehouseMap /></button>
      </Panel>
      <Panel title="Trip Details" className="trip-details-panel" onOpen={() => navigate("/supervisor/trips")}>
        <SupervisorTripDetails />
      </Panel>
      <Panel title="Analytics" className="analytics-panel" onOpen={() => navigate("/supervisor/analytics")}>
        <div className="analytics-content">
          <div className="analytics-blank" />
          <div className="alert-stack">
            <StatusRow label={`${zone === "Processing Zone" ? "Fleet" : zone} running at 75 % efficiency`} status="Completed" />
            <StatusRow label="Fleet running at 75 % efficiency" status="Take action" danger />
            <StatusRow label="Fleet running at 75 % efficiency" status="Completed" />
          </div>
        </div>
      </Panel>
    </div>
  );
}

function SupervisorTripDetails() {
  const rows = [
    { id: "Req-001", kind: "Material", status: "Completed" },
    { id: "Req-002", kind: "Container", status: "In process" },
    { id: "Req-003", kind: "Container", status: "Cancelled" },
  ];
  return (
    <section className="figma-trip-table">
      <div className="trip-tabs">
        {["All", "Scheduled", "Inprogress", "Completed", "Cancelled"].map((tab, index) => (
          <button className={index === 0 ? "active" : ""} key={tab} type="button">{tab}</button>
        ))}
      </div>
      <div className="trip-head">
        <span>ID No.</span><span>Request Details</span><span>Request Time</span><span>Status</span>
      </div>
      {rows.map((row) => (
        <div className="trip-row" key={row.id}>
          <strong>{row.id}<small>{row.kind}</small></strong>
          <span><b>SKU 7765</b><small>100 units</small></span>
          <span><b>3:00 pm</b></span>
          <span className="status-cell"><StatusPill danger={row.status === "Cancelled"} warning={row.status === "In process"}>{row.status}</StatusPill></span>
        </div>
      ))}
    </section>
  );
}

function OperationsPage({ detail, primaryAction, title }: { detail: string; primaryAction: string; title: string }) {
  const [active, setActive] = useState("Queue");
  const [message, setMessage] = useState(detail);
  const rows = ["Station S-14", "Dock D-03", "Aisle A-07", "Machine 101"];
  return (
    <div className="operations-page">
      <header>
        <div>
          <h1>{title}</h1>
          <p>{message}</p>
        </div>
        <button type="button" onClick={() => setMessage(`${primaryAction} completed for ${active}.`)}><CheckRoundedIcon /> {primaryAction}</button>
      </header>
      <div className="operations-grid">
        <section>
          <h2>Work queue</h2>
          {rows.map((row) => (
            <button className={active === row ? "active" : ""} key={row} type="button" onClick={() => setActive(row)}>
              <span>{row}</span>
              <StatusPill>{row === active ? "Selected" : "Ready"}</StatusPill>
            </button>
          ))}
        </section>
        <section>
          <h2>{active}</h2>
          <WarehouseMap muted={false} />
          <div className="rail-actions">
            <button type="button" onClick={() => setMessage(`${active} inspected.`)}>Inspect</button>
            <button type="button" onClick={() => setMessage(`${active} assigned to Fleet A.`)}>Assign</button>
            <button type="button" onClick={() => setMessage(`${active} marked complete.`)}>Complete</button>
          </div>
        </section>
      </div>
    </div>
  );
}

function TripOperationsPage() {
  const [selected, setSelected] = useState<TripRowModel>({ id: "Req-002", kind: "Material", route: "S-14", status: "In progress" });
  const [message, setMessage] = useState("Review active trips, update priority, and hand off exceptions.");
  return (
    <div className="trip-ops-page">
      <header>
        <div>
          <h1>Trips</h1>
          <p>{message}</p>
        </div>
        <button type="button" onClick={() => setMessage(`${selected.id} assigned to Sherpa Pallet Mover 05.`)}><CheckRoundedIcon /> Assign trip</button>
      </header>
      <div className="trip-ops-grid">
        <TripTable onAction={setMessage} onTripSelect={setSelected} />
        <aside className="trip-detail-card">
          <strong>{selected.id}</strong>
          <span>{selected.kind} delivery</span>
          <dl className="rail-details">
            <div><dt>Route</dt><dd>{selected.route}</dd></div>
            <div><dt>Status</dt><dd>{selected.status}</dd></div>
            <div><dt>AMR</dt><dd>Sherpa Pallet Mover 05</dd></div>
            <div><dt>Next station</dt><dd>S-22</dd></div>
          </dl>
          <div className="trip-timeline">
            <span>Requested</span>
            <span>Assigned</span>
            <span className="active">Moving</span>
            <span>Delivered</span>
          </div>
          <div className="rail-actions">
            <button type="button" onClick={() => setMessage(`${selected.id} live route opened.`)}>View live route</button>
            <button type="button" onClick={() => setMessage(`${selected.id} priority raised.`)}>Prioritize</button>
            <button type="button" onClick={() => setMessage(`${selected.id} paused for review.`)}>Pause</button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function StagingArea({ role }: { role: "Supervisor" | "Requester" }) {
  const [selectedCell, setSelectedCell] = useState("A2");
  const [message, setMessage] = useState("Select a staging cell to review lane details.");
  const cells = [
    { id: "A1", material: "SKU 7765", status: "Ready", trip: "Req-001" },
    { id: "A2", material: "Container", status: "Loading", trip: "Req-002" },
    { id: "A3", material: "SKU 1180", status: "Hold", trip: "Req-003" },
    { id: "B1", material: "Empty", status: "Open", trip: "None" },
    { id: "B2", material: "SKU 4312", status: "Ready", trip: "Req-004" },
    { id: "B3", material: "Return", status: "Queued", trip: "Req-005" },
    { id: "C1", material: "SKU 9090", status: "Ready", trip: "Req-006" },
    { id: "C2", material: "Empty", status: "Open", trip: "None" },
    { id: "C3", material: "Container", status: "Inspection", trip: "Req-007" },
  ];
  const selected = cells.find((cell) => cell.id === selectedCell) ?? cells[0];
  const primary = role === "Supervisor" ? "Release lane" : "Confirm pickup";

  return (
    <div className="staging-page">
      <header>
        <div>
          <h1>Staging Area</h1>
          <p>{message}</p>
        </div>
        <StatusPill>{role}</StatusPill>
      </header>
      <section className="staging-layout">
        <div className="staging-grid" aria-label="Clickable staging cells">
          {cells.map((cell) => (
            <button
              className={`${cell.id === selectedCell ? "active" : ""} ${cell.status.toLowerCase()}`}
              key={cell.id}
              type="button"
              onClick={() => {
                setSelectedCell(cell.id);
                setMessage(`${cell.id} selected for ${cell.trip}.`);
              }}
            >
              <strong>{cell.id}</strong>
              <span>{cell.material}</span>
              <StatusPill danger={cell.status === "Hold"}>{cell.status}</StatusPill>
            </button>
          ))}
        </div>
        <aside className="staging-detail">
          <strong>Cell {selected.id}</strong>
          <dl>
            <div><dt>Trip</dt><dd>{selected.trip}</dd></div>
            <div><dt>Material</dt><dd>{selected.material}</dd></div>
            <div><dt>Status</dt><dd>{selected.status}</dd></div>
          </dl>
          <div className="rail-actions">
            <button type="button" onClick={() => setMessage(`${selected.id} inspected.`)}>Inspect</button>
            <button type="button" onClick={() => setMessage(`${selected.id} assigned to Machine 204.`)}>Assign</button>
            <button type="button" onClick={() => setMessage(`${primary} completed for ${selected.id}.`)}>{primary}</button>
          </div>
        </aside>
      </section>
    </div>
  );
}

function LiveMonitor({ selectedSherpa, setSelectedSherpa }: { selectedSherpa: string; setSelectedSherpa: (value: string) => void }) {
  const [status, setStatus] = useState("Running route to S-14");
  const [layer, setLayer] = useState("Routes");
  const [mapNote, setMapNote] = useState("Assembly North v2.1 is active.");
  return (
    <div className="live-monitor">
      <div className="live-main">
        <div className="panel-heading">
          <h2>Live Status</h2>
          <div className="layer-buttons">
            {["Routes", "Traffic", "Zones", "Alerts"].map((item) => (
              <button className={layer === item ? "active" : ""} key={item} type="button" onClick={() => setLayer(item)}>{item}</button>
            ))}
          </div>
        </div>
        <button className="big-map" type="button" onClick={() => setSelectedSherpa(selectedSherpa === "Sherpa Pallet Mover 05" ? "Sherpa XT Lite 02" : "Sherpa Pallet Mover 05")}>
          <WarehouseMap />
        </button>
      </div>
      <aside className="sherpa-panel">
        <img alt="Sherpa Pallet Mover 05" src={asset("sherpa-pallet-large.png")} />
        <h2>{selectedSherpa}</h2>
        <p className="sherpa-status">{status}</p>
        <span className="fleet-pill">{layer} layer active</span>
        <dl className="live-meta rail-details">
          <div><dt>Map version</dt><dd>Assembly North v2.1</dd></div>
          <div><dt>Zone set</dt><dd>Receiving, Storage, Assembly, Staging</dd></div>
          <div><dt>Last update</dt><dd>02:03:26</dd></div>
        </dl>
        <div className="battery-card">
          <strong>90 %</strong>
          <span>Battery</span>
        </div>
        <div className="sherpa-actions">
          <button type="button" onClick={() => setStatus("Stopped by supervisor")}><StopRoundedIcon /> Stop</button>
          <button type="button" onClick={() => setStatus("Paused for battery check")}><BatteryChargingFullRoundedIcon /> Pause</button>
          <button type="button" onClick={() => setStatus("Next station updated to S-22")}><RouteRoundedIcon /> Next station S-22</button>
          <button type="button" onClick={() => { setLayer("Zones"); setMapNote("Zone editor opened for Assembly North v2.1."); }}><MapOutlinedIcon /> Add zone</button>
          <button type="button" onClick={() => { setLayer("Routes"); setMapNote("Route layer saved as draft v2.2."); }}><CheckRoundedIcon /> Save map draft</button>
        </div>
        <div className="activity-log">
          <strong>Activity</strong>
          <span>{mapNote}</span>
          <span>{status}</span>
        </div>
      </aside>
    </div>
  );
}

function WorkflowCatalog() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("Workflow 1");
  return (
    <div className="workflow-catalog">
      <h1>Workflow &gt; Make New Workflow</h1>
      <section className="workflow-section">
        <h2>Published Workflows</h2>
        <div className="workflow-card-grid">
          {["Workflow 1", "Workflow 2", "Workflow 3"].map((name) => (
            <WorkflowCatalogCard key={name} name={name} onAction={setSelected} />
          ))}
          <button className="new-workflow-card" type="button" onClick={() => navigate("/supervisor/workflow/new")}>
            <span>+</span>
            <strong>Make New Workflow</strong>
          </button>
        </div>
      </section>
      <Divider />
      <section className="workflow-section">
        <h2>Draft Workflows</h2>
        <div className="workflow-card-grid two">
          {["Workflow 1", "Workflow 2"].map((name) => (
            <WorkflowCatalogCard key={`draft-${name}`} name={name} onAction={setSelected} />
          ))}
        </div>
      </section>
      <DetailRail title={selected} subtitle="Workflow" action="Open or edit this workflow from the card controls." />
    </div>
  );
}

function WorkflowCatalogCard({ name, onAction }: { name: string; onAction: (value: string) => void }) {
  return (
    <article className="workflow-catalog-card">
      <span className="asset-dot" />
      <div />
      <h3>{name}</h3>
      <span className="fleet-pill">Fleet A</span>
      <button type="button" onClick={() => onAction(name)}>Configure Workflow</button>
    </article>
  );
}

function WorkflowMaker() {
  const [published, setPublished] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [nodes, setNodes] = useState<WorkflowNodeModel[]>([
    workflowNodeTemplates.start,
    workflowNodeTemplates.material,
    workflowNodeTemplates.station,
    workflowNodeTemplates.end,
  ]);

  function addWorkflowNode(tone: WorkflowTone) {
    if (tone === "start") return setNodes([workflowNodeTemplates.start, ...nodes.filter((node) => node.tone !== "start")]);
    if (tone === "end") return setNodes([...nodes.filter((node) => node.tone !== "end"), workflowNodeTemplates.end]);
    const withoutEnd = nodes.filter((node) => node.tone !== "end");
    setNodes([...withoutEnd, workflowNodeTemplates[tone], workflowNodeTemplates.end]);
    setPublished(false);
  }

  function removeWorkflowNode(index: number) {
    const node = nodes[index];
    if (node.tone === "start" || node.tone === "end") return;
    setNodes(nodes.filter((_, nodeIndex) => nodeIndex !== index));
    setSelectedIndex(Math.max(0, selectedIndex - 1));
    setPublished(false);
  }

  function moveWorkflowNode(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    if (nextIndex <= 0 || nextIndex >= nodes.length - 1) return;
    const copy = [...nodes];
    [copy[index], copy[nextIndex]] = [copy[nextIndex], copy[index]];
    setNodes(copy);
    setSelectedIndex(nextIndex);
    setPublished(false);
  }

  function updateSelectedRow(value: string) {
    setNodes(nodes.map((node, index) => index === selectedIndex ? { ...node, rows: [value, ...node.rows.slice(1)] } : node));
    setPublished(false);
  }

  const selectedNode = nodes[selectedIndex] ?? nodes[0];

  return (
    <div className="workflow-maker-screen">
      <div className="workflow-header">
        <strong>Workflow</strong>
        <span>WF 101</span>
        <button type="button" onClick={() => setPublished(true)}><CheckRoundedIcon /> {published ? "Published" : "Publish"}</button>
      </div>
      <div className="workflow-builder-shell">
        <CompactNodeLibrary onAdd={addWorkflowNode} />
      <section className="workflow-board">
        <div className="workflow-canvas">
          <h2>Workflow Maker</h2>
          <div className="workflow-node-stack">
            {nodes.map((node, index) => (
              <WorkflowNode
                index={index + 1}
                isSelected={index === selectedIndex}
                key={`${node.tone}-${index}`}
                onDelete={() => removeWorkflowNode(index)}
                onMoveDown={() => moveWorkflowNode(index, 1)}
                onMoveUp={() => moveWorkflowNode(index, -1)}
                onSelect={() => setSelectedIndex(index)}
                tone={node.tone}
                title={node.title}
                rows={node.rows}
              />
            ))}
          </div>
          <label className="ai-workflow-prompt"><AutoAwesomeRoundedIcon /> <input aria-label="AI workflow prompt" placeholder="AI : Describe your requirement in plain language to get started" /></label>
        </div>
        <div className="map-preview-panel">
          <h2>Map Preview</h2>
          <WarehouseMap muted />
          <div className="node-inspector">
            <strong>{selectedNode.title}</strong>
            <label>Primary field<input value={selectedNode.rows[0]} onChange={(event) => updateSelectedRow(event.target.value)} /></label>
            <div>
              <button type="button" onClick={() => moveWorkflowNode(selectedIndex, -1)}>Move up</button>
              <button type="button" onClick={() => moveWorkflowNode(selectedIndex, 1)}>Move down</button>
              <button type="button" onClick={() => removeWorkflowNode(selectedIndex)}>Delete</button>
            </div>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}

function CompactNodeLibrary({ onAdd }: { onAdd: (tone: WorkflowTone) => void }) {
  return (
    <div className="node-library">
      <div className="node-tab active"><HomeRoundedIcon /></div>
      <strong>Node Library</strong>
      {[
        ["Start", "start"],
        ["End", "end"],
        ["Material", "material"],
        ["Station", "station"],
        ["Turns", "turns"],
        ["AIoT", "aiot"],
      ].map(([label, tone]) => (
        <button className={`node-tool ${tone}`} type="button" key={label} onClick={() => onAdd(tone as WorkflowTone)}>
          <span />
          {label}
        </button>
      ))}
    </div>
  );
}

function WorkflowNode({
  index,
  isSelected,
  onDelete,
  onMoveDown,
  onMoveUp,
  onSelect,
  rows,
  title,
  tone,
}: {
  index: number;
  isSelected: boolean;
  onDelete: () => void;
  onMoveDown: () => void;
  onMoveUp: () => void;
  onSelect: () => void;
  rows: string[];
  title: string;
  tone: WorkflowTone;
}) {
  return (
    <article className={`workflow-node ${tone} ${isSelected ? "selected" : ""}`}>
      <span className="node-index">{index}</span>
      <header><span /><strong>{title}</strong><button type="button" onClick={onMoveUp} aria-label={`Move ${title} up`}>Up</button><button type="button" onClick={onMoveDown} aria-label={`Move ${title} down`}>Down</button></header>
      <div className="node-fields">
        {rows.map((row) => <span key={row}>{row}</span>)}
      </div>
      <div className="node-actions">
        <button type="button" onClick={onSelect}>Edit fields</button>
        <button type="button" onClick={onDelete}>Delete</button>
      </div>
    </article>
  );
}

function RequesterHistory() {
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState("Trip queue stable. New alerts appear here.");
  return (
    <div className="requester-history">
      <TripTable onAction={setMessage} />
      <div className="history-footer">
        <button aria-label="Previous page" type="button" onClick={() => setPage(Math.max(1, page - 1))}><ArrowBackRoundedIcon /></button>
        <button aria-label="Next page" type="button" onClick={() => setPage(page + 1)}><ArrowForwardRoundedIcon /></button>
        <span>{(page - 1) * 15 + 1}-{page * 15} of 200</span>
        <div className="history-status"><i /><strong>{message}</strong></div>
      </div>
    </div>
  );
}

function BookingChoice() {
  const navigate = useNavigate();
  const [choice, setChoice] = useState<"amr" | "material">("material");
  return (
    <div className="booking-choice">
      <h1>Select an option to proceed</h1>
      <div className="booking-cards">
        <button className={choice === "amr" ? "selected" : ""} type="button" onClick={() => setChoice("amr")}>
          <span>Option 1: Vehicle Type + Route</span>
          <strong>Schedule AMR Trip</strong>
          <LocalShippingRoundedIcon />
        </button>
        <button className={choice === "material" ? "selected" : ""} type="button" onClick={() => setChoice("material")}>
          <span>Option 2: Material + Station</span>
          <strong>Schedule Material Delivery</strong>
          <Inventory2OutlinedIcon />
        </button>
      </div>
      <FrequentTrips />
      <button className="next-fab" type="button" onClick={() => navigate(choice === "amr" ? "/requester/book/amr" : "/requester/book/material")}>
        <ArrowForwardRoundedIcon /> Next
      </button>
    </div>
  );
}

function AmrTripBooking() {
  const [confirmed, setConfirmed] = useState(false);
  return (
    <div className="trip-booking">
      <h1>Book New Trip: AMR + Route</h1>
      {confirmed && <div className="flow-summary">Trip confirmed: Sherpa Pallet Mover on Route 101.</div>}
      <StepLine />
      <div className="booking-form-grid">
        <FormCard title="Select AMR">
          <FakeSelect label="Sherpa Pallet Mover" />
          <div className="amr-form-image"><img alt="Sherpa Pallet Mover" src={asset("sherpa-pallet-form.png")} /></div>
        </FormCard>
        <FormCard title="Select Route">
          <FakeSelect label="Route 101" />
          <div className="route-preview">Route Preview</div>
        </FormCard>
        <FormCard title="Select Scheduling details">
          <FakeSelect label="Date" />
          <div className="time-row"><span>Time</span><span>Time</span></div>
          <label>Frequency<input defaultValue="5" /></label>
        </FormCard>
      </div>
      <FrequentTrips />
      <button className="next-fab" type="button" onClick={() => setConfirmed(true)}><CheckRoundedIcon /> {confirmed ? "Confirmed" : "Confirm Trip"}</button>
    </div>
  );
}

function MaterialDeliveryBooking() {
  const [step, setStep] = useState(1);
  const [confirmed, setConfirmed] = useState(false);
  const [quantities, setQuantities] = useState([5, 0, 0, 0, 0, 0, 0]);
  const totalUnits = quantities.reduce((sum, value) => sum + value, 0);

  function updateQuantity(index: number, nextValue: number) {
    setQuantities(quantities.map((value, valueIndex) => valueIndex === index ? Math.max(0, nextValue) : value));
  }

  return (
    <div className="trip-booking material">
      <h1>Book New Trip: Schedule Material Delivery</h1>
      {confirmed && <div className="flow-summary">Req-008 created for Station S-14. Track it in Request History.</div>}
      <StepLine />
      <div className="material-form">
        <FormCard title="Select Material">
          <FakeSelect label="SKU" />
          {Array.from({ length: 7 }, (_, index) => (
            <input aria-label={`Sub-SKU ${index + 1}`} key={index} placeholder="Sub- SKU" />
          ))}
        </FormCard>
        <FormCard title="Select Quantity">
          {Array.from({ length: 7 }, (_, index) => (
            <div className="quantity-row" key={index}>
              <button aria-label={`Increase quantity ${index + 1}`} type="button" onClick={() => updateQuantity(index, quantities[index] + 1)}>+</button>
              <input
                aria-label={`Quantity ${index + 1}`}
                value={quantities[index] || ""}
                placeholder="Quantity"
                onChange={(event) => updateQuantity(index, Number(event.target.value) || 0)}
              />
              <button aria-label={`Decrease quantity ${index + 1}`} type="button" onClick={() => updateQuantity(index, quantities[index] - 1)}>-</button>
              <span>Units</span>
            </div>
          ))}
        </FormCard>
        <FormCard title="Return Container">
          <FakeSelect label="Container Type" />
          <FakeSelect label="Container SKU" />
          <label>Return station<input defaultValue="Dock D-03" /></label>
        </FormCard>
      </div>
      {step > 1 && (
        <section className="booking-review">
          <strong>Review material delivery</strong>
          <dl className="rail-details">
            <div><dt>Material</dt><dd>SKU 7765</dd></div>
            <div><dt>Total quantity</dt><dd>{totalUnits} units</dd></div>
            <div><dt>Station</dt><dd>S-14 Assembly</dd></div>
            <div><dt>Return</dt><dd>Container to Dock D-03</dd></div>
          </dl>
        </section>
      )}
      <button
        className="next-fab"
        type="button"
        onClick={() => {
          if (step === 1) setStep(2);
          else setConfirmed(true);
        }}
      >
        {step > 1 ? <CheckRoundedIcon /> : <ArrowForwardRoundedIcon />} {step > 1 ? "Confirm trip" : "Next"}
      </button>
    </div>
  );
}

function FrequentTrips() {
  return (
    <section className="frequent-trips">
      <h2>Frequently booked trips</h2>
      <div>
        {Array.from({ length: 4 }, (_, index) => <i key={index} />)}
      </div>
    </section>
  );
}

function FormCard({ children, title }: { children: ReactNode; title: string }) {
  return <section className="form-card"><h2>{title}</h2>{children}</section>;
}

function FakeSelect({ label }: { label: string }) {
  const [selected, setSelected] = useState(false);
  return (
    <button className={`fake-select ${selected ? "selected" : ""}`} type="button" onClick={() => setSelected(true)}>
      {selected ? `${label} selected` : label}
      <ExpandMoreRoundedIcon />
    </button>
  );
}

function StepLine() {
  return <div className="step-line"><span>1</span><span>2</span><span>3</span></div>;
}

function TripTable({
  compact = false,
  onAction,
  onTripSelect,
}: {
  compact?: boolean;
  onAction?: (message: string) => void;
  onTripSelect?: (trip: TripRowModel) => void;
}) {
  const [activeTab, setActiveTab] = useState("All");
  const [selectedTrip, setSelectedTrip] = useState("Req-001");
  const [cancelled, setCancelled] = useState(false);
  const rows = Array.from({ length: compact ? 5 : 4 }, (_, index) => ({
    id: `Req-00${index + 1}`,
    kind: index === 2 ? "Container" : "Material",
    route: index === 1 ? "S-14" : index === 2 ? "Return Dock" : "S-22",
    status: cancelled && index === 0 ? "Cancelled" : index === 1 ? "In progress" : "Completed",
  })).filter((row) => activeTab === "All" || row.status === activeTab);

  function selectTrip(row: TripRowModel) {
    setSelectedTrip(row.id);
    onTripSelect?.(row);
    onAction?.(`${row.id} details opened.`);
  }

  return (
    <section className={`trip-table ${compact ? "compact" : ""}`}>
      <div className="trip-tabs">{tabs.map((tab) => <button className={activeTab === tab ? "active" : ""} key={tab} type="button" onClick={() => setActiveTab(tab)}>{tab}</button>)}</div>
      <div className="trip-head">
        <span>ID No.</span><span>Request Details</span><span>Request Time</span><span>Status</span>{!compact && <span>Actions</span>}
      </div>
      {rows.map((row) => (
        <div
          className="trip-row"
          key={row.id}
          role="button"
          tabIndex={0}
          onClick={() => selectTrip(row)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") selectTrip(row);
          }}
        >
          <strong>{row.id}<small>{row.kind}</small></strong>
          <span><b>SKU 7765</b><small>100 units</small></span>
          <span><b>3:00 pm</b><small>02:03:26</small></span>
          <span className="status-cell"><StatusPill danger={row.status === "Cancelled"}>{row.status}</StatusPill></span>
          {!compact && (
            <span className="table-actions">
              <button aria-label={`Cancel ${row.id}`} type="button" onClick={(event) => { event.stopPropagation(); setCancelled(true); onAction?.(`${row.id} cancelled.`); }}><CloseRoundedIcon /></button>
              <button aria-label={`Show ${row.id} details`} type="button" onClick={(event) => { event.stopPropagation(); selectTrip(row); }}><ExpandMoreRoundedIcon /></button>
            </span>
          )}
        </div>
      ))}
      {!compact && <div className="trip-selection">Selected: {selectedTrip}</div>}
    </section>
  );
}

function Panel({ children, className = "", onOpen, title }: { children: ReactNode; className?: string; onOpen?: () => void; title: string }) {
  return (
    <section className={`soft-panel ${className}`}>
      <div className="panel-heading">
        <h2>{title}</h2>
        {onOpen ? (
          <button type="button" aria-label={`Open ${title}`} onClick={onOpen}><OpenInNewRoundedIcon /></button>
        ) : (
          <MoreHorizRoundedIcon />
        )}
      </div>
      {children}
    </section>
  );
}

function FigmaWarehouseMap() {
  return (
    <div className="figma-map" aria-label="Live fleet map preview" role="img">
      <span className="map-dot d1" /><span className="map-dot d2" /><span className="map-dot d3" /><span className="map-dot d4" /><span className="map-dot d5" />
      <span className="station-label s102">S102</span>
      <span className="station-label s101a">S101</span>
      <span className="station-label s100">S100</span>
      <span className="station-label s101b">S101</span>
      <span className="station-label s101c">S101</span>
      <span className="station-label s101d">S101</span>
      <span className="map-route r1" /><span className="map-route r2" /><span className="map-route r3" /><span className="map-route r4" />
      <img className="amr yellow" alt="Yellow AMR" src={asset("sherpa-pallet-form.png")} />
      <img className="amr orange" alt="Orange AMR" src={asset("sherpa-pallet-form.png")} />
      <img className="amr red" alt="Red AMR" src={asset("sherpa-pallet-form.png")} />
    </div>
  );
}

function WarehouseMap({ muted = false }: { muted?: boolean }) {
  return (
    <div className={`warehouse-map-replica ${muted ? "muted" : ""}`} aria-label="Warehouse map preview" role="img">
      <div className="warehouse-room receiving">Receiving</div>
      <div className="warehouse-room storage">Storage</div>
      <div className="warehouse-room assembly">Assembly</div>
      <div className="warehouse-room staging">Staging</div>
      <div className="warehouse-route a" />
      <div className="warehouse-route b" />
      <div className="warehouse-route c" />
      <span className="warehouse-pin p1">AMR 05</span>
      <span className="warehouse-pin p2">S-14</span>
    </div>
  );
}

function StatusRow({ danger = false, label, status }: { danger?: boolean; label: string; status: string }) {
  return <div className={danger ? "status-row danger" : "status-row"}><span>{label}</span><StatusPill danger={danger}>{status}</StatusPill></div>;
}

function StatusPill({ children, danger = false, warning = false }: { children: ReactNode; danger?: boolean; warning?: boolean }) {
  return <span className={`status-pill ${danger ? "danger" : ""} ${warning ? "warning" : ""}`}>{children}</span>;
}

function SupportPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState(["Ask about trip status, map configuration, workflow nodes, or fleet issues."]);
  const [draft, setDraft] = useState("");
  const [attachment, setAttachment] = useState("");

  function sendMessage() {
    if (!draft.trim() && !attachment) return;
    setMessages([...messages, draft.trim() || `Attached ${attachment}`]);
    setDraft("");
    setAttachment("");
  }

  return (
    <div className="support-overlay" role="dialog" aria-modal="true">
      <aside className="support-drawer">
        <header>
          <div><AutoAwesomeRoundedIcon /><strong>Support/Agent</strong></div>
          <button aria-label="Close support" type="button" onClick={onClose}><CloseRoundedIcon /></button>
        </header>
        <div className="support-thread">
          {messages.map((message, index) => <p key={`${message}-${index}`}>{message}</p>)}
        </div>
        <footer>
          <label><AddRoundedIcon /><input type="file" accept=".png,.jpg,.jpeg,.svg" onChange={(event) => setAttachment(event.currentTarget.files?.[0]?.name ?? "")} /></label>
          <input aria-label="Support message" placeholder={attachment || "Type a message"} value={draft} onChange={(event) => setDraft(event.target.value)} />
          <button aria-label="Send support message" type="button" onClick={sendMessage}><ArrowForwardRoundedIcon /></button>
        </footer>
      </aside>
    </div>
  );
}

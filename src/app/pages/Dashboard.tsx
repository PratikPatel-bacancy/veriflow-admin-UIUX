import "leaflet/dist/leaflet.css";
import { Link } from "react-router";
import { useState, useMemo } from "react";
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
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";

// ── Live Map data ─────────────────────────────────────────────────────────

type StallStatus = "compliant" | "warning" | "violation" | "empty";

const SEQ: StallStatus[] = [
  "compliant","compliant","compliant","compliant","compliant",
  "warning","compliant","compliant","compliant","violation",
  "compliant","compliant","compliant","compliant","warning",
  "compliant","compliant","violation","compliant","compliant",
  "compliant","warning","compliant","compliant","compliant",
  "empty","compliant","compliant","compliant","warning",
];

function genStalls(count: number, seed: number): StallStatus[] {
  return Array.from({ length: count }, (_, i) => SEQ[(seed + i) % SEQ.length]);
}

interface MapRow { zone: string; label: string; count: number; seed: number }

const SITE_ROWS: Record<string, MapRow[]> = {
  "pacific-plaza": [
    { zone: "zone-a", label: "Zone A", count: 14, seed: 0 },
    { zone: "zone-a", label: "Zone A", count: 14, seed: 7 },
    { zone: "zone-b", label: "Zone B", count: 12, seed: 12 },
    { zone: "zone-b", label: "Zone B", count: 12, seed: 18 },
    { zone: "zone-c", label: "Zone C", count: 10, seed: 23 },
  ],
  "pacific-centre": [
    { zone: "zone-a", label: "Zone A", count: 12, seed: 3 },
    { zone: "zone-b", label: "Zone B", count: 14, seed: 8 },
    { zone: "zone-b", label: "Zone B", count: 14, seed: 14 },
    { zone: "zone-c", label: "Zone C", count: 10, seed: 20 },
  ],
  "heritage-harbor": [
    { zone: "zone-b", label: "Zone B", count: 16, seed: 2 },
    { zone: "zone-c", label: "Zone C", count: 14, seed: 9 },
    { zone: "zone-d", label: "Zone D", count: 12, seed: 16 },
  ],
  "pacific-beach": [
    { zone: "zone-d", label: "Zone D", count: 12, seed: 5 },
    { zone: "zone-e", label: "Zone E", count: 10, seed: 12 },
  ],
  "pan-pacific": [
    { zone: "zone-a", label: "Zone A", count: 12, seed: 1 },
    { zone: "zone-b", label: "Zone B", count: 14, seed: 7 },
    { zone: "zone-b", label: "Zone B", count: 12, seed: 15 },
  ],
};

const SITE_LABELS: Record<string, string> = {
  "pacific-plaza":   "Pacific Plaza Garage",
  "pacific-centre":  "CF Pacific Centre",
  "heritage-harbor": "Heritage Harbor Parking",
  "pacific-beach":   "875 Garnet Pacific Beach Parking",
  "pan-pacific":     "Pan Pacific Park Parking",
};

const SITE_COORDS: Record<string, [number, number]> = {
  "pacific-plaza":   [37.7749, -122.4194],
  "pacific-centre":  [37.7849, -122.4050],
  "heritage-harbor": [37.7699, -122.3920],
  "pacific-beach":   [37.7580, -122.4380],
  "pan-pacific":     [37.7820, -122.4480],
};

const STALL_CLR: Record<StallStatus, string> = {
  compliant: "#16a34a",
  warning:   "#ea580c",
  violation: "#dc2626",
  empty:     "#d1d5db",
};

function siteAggStatus(site: string): StallStatus {
  const rows = SITE_ROWS[site] ?? [];
  const all = rows.flatMap((r) => genStalls(r.count, r.seed));
  if (all.some((s) => s === "violation")) return "violation";
  if (all.some((s) => s === "warning")) return "warning";
  return "compliant";
}

// ── Component ─────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [selectedSite, setSelectedSite] = useState("all");
  const [selectedZone, setSelectedZone] = useState("all");

  const activeRows = selectedSite !== "all" ? (SITE_ROWS[selectedSite] ?? []) : [];

  const mapStats = useMemo(() => {
    if (selectedSite === "all") return { compliant: 197, warning: 26, violation: 14 };
    let c = 0, w = 0, v = 0;
    activeRows.forEach((row) => {
      if (selectedZone !== "all" && row.zone !== selectedZone) return;
      genStalls(row.count, row.seed).forEach((s) => {
        if (s === "compliant") c++;
        else if (s === "warning") w++;
        else if (s === "violation") v++;
      });
    });
    return { compliant: c, warning: w, violation: v };
  }, [selectedSite, selectedZone, activeRows]);

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
          <Link
            to="/operations/live"
            className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-5 shadow-sm relative hover:border-[#3b82f6] dark:hover:border-[#60a5fa] transition-colors cursor-pointer block"
          >
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
          </Link>

          {/* Violations Today */}
          <Link
            to="/operations/violations"
            className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-5 shadow-sm relative hover:border-[#3b82f6] dark:hover:border-[#60a5fa] transition-colors cursor-pointer block"
          >
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
          </Link>

          {/* Compliance Rate */}
          <Link
            to="/operations/compliance"
            className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-5 shadow-sm relative hover:border-[#3b82f6] dark:hover:border-[#60a5fa] transition-colors cursor-pointer block"
          >
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
                76.25%
              </p>
            </div>
          </Link>

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

          {/* Live Map */}
          <div className="relative rounded-lg h-[320px] overflow-hidden">
            {/* ── All Sites: Leaflet Map ── */}
            {selectedSite === "all" && (
              <>
                <MapContainer
                  center={[37.775, -122.420]}
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
                  scrollWheelZoom={false}
                  className="z-0"
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution=""
                  />
                  {Object.entries(SITE_COORDS).map(([siteKey, coords]) => {
                    const aggStatus = siteAggStatus(siteKey);
                    const rows = SITE_ROWS[siteKey] ?? [];
                    const zoneMatch = selectedZone === "all" || rows.some((r) => r.zone === selectedZone);
                    const pinStalls = rows.flatMap((r) => genStalls(r.count, r.seed));
                    const pinC = pinStalls.filter((s) => s === "compliant").length;
                    const pinW = pinStalls.filter((s) => s === "warning").length;
                    const pinV = pinStalls.filter((s) => s === "violation").length;
                    return (
                      <CircleMarker
                        key={siteKey}
                        center={coords}
                        radius={13}
                        pathOptions={{
                          color: "white",
                          weight: 2.5,
                          fillColor: STALL_CLR[aggStatus],
                          fillOpacity: zoneMatch ? 1 : 0.25,
                        }}
                        eventHandlers={{ click: () => setSelectedSite(siteKey) }}
                      >
                        <Popup>
                          <div style={{ minWidth: 148 }}>
                            <p style={{ fontWeight: 600, marginBottom: 6 }}>{SITE_LABELS[siteKey]}</p>
                            <p style={{ color: "#16a34a", marginBottom: 2 }}>✓ {pinC} compliant</p>
                            <p style={{ color: "#ea580c", marginBottom: 2 }}>⚠ {pinW} warning</p>
                            <p style={{ color: "#dc2626" }}>✕ {pinV} violation</p>
                          </div>
                        </Popup>
                      </CircleMarker>
                    );
                  })}
                </MapContainer>

                {/* Stats overlay — bottom left */}
                <div className="absolute bottom-3 left-3 z-[1000] bg-white/90 dark:bg-[#0f1f35]/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-[11px] font-sans flex items-center gap-3 shadow">
                  <span className="flex items-center gap-1 text-[#16a34a] dark:text-[#34d399] font-medium"><span className="size-1.5 rounded-full bg-[#16a34a] dark:bg-[#34d399] inline-block" />{mapStats.compliant}</span>
                  <span className="flex items-center gap-1 text-[#ea580c] dark:text-[#fb923c] font-medium"><span className="size-1.5 rounded-full bg-[#ea580c] dark:bg-[#fb923c] inline-block" />{mapStats.warning}</span>
                  <span className="flex items-center gap-1 text-[#dc2626] dark:text-[#f87171] font-medium"><span className="size-1.5 rounded-full bg-[#dc2626] dark:bg-[#f87171] inline-block" />{mapStats.violation}</span>
                </div>
                <div className="absolute bottom-3 right-3 z-[1000] bg-white/90 dark:bg-[#0f1f35]/90 backdrop-blur-sm px-2 py-1 rounded text-[11px] font-sans text-[#6b7280] dark:text-[#94a3b8]">
                  5 sites monitored
                </div>
              </>
            )}

            {/* ── Site floor plan (specific site selected) ── */}
            {selectedSite !== "all" && (
              <div className="absolute inset-0 bg-[#f8f7f4] dark:bg-[#0f172a] p-5 overflow-auto">
                {/* Site header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[13px] font-semibold text-[#111827] dark:text-[#e8eef5]">{SITE_LABELS[selectedSite]}</p>
                    <p className="text-[11px] text-[#6b7280] dark:text-[#94a3b8] mt-0.5">
                      {selectedZone === "all" ? "All zones" : selectedZone.replace("zone-", "Zone ").toUpperCase()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="flex items-center gap-1 text-[#16a34a] dark:text-[#34d399] font-medium"><span className="size-1.5 rounded-full bg-[#16a34a] dark:bg-[#34d399] inline-block" />{mapStats.compliant} compliant</span>
                    <span className="flex items-center gap-1 text-[#ea580c] dark:text-[#fb923c] font-medium"><span className="size-1.5 rounded-full bg-[#ea580c] dark:bg-[#fb923c] inline-block" />{mapStats.warning} warning</span>
                    <span className="flex items-center gap-1 text-[#dc2626] dark:text-[#f87171] font-medium"><span className="size-1.5 rounded-full bg-[#dc2626] dark:bg-[#f87171] inline-block" />{mapStats.violation} violation</span>
                  </div>
                </div>

                {/* Stall rows */}
                <div className="flex flex-col gap-2">
                  {(() => {
                    let lastZone = "";
                    return activeRows.map((row, ri) => {
                      const isActive = selectedZone === "all" || row.zone === selectedZone;
                      const stalls = genStalls(row.count, row.seed);
                      const showLabel = row.label !== lastZone;
                      if (showLabel) lastZone = row.label;
                      return (
                        <div key={ri} className={`flex items-center gap-3 transition-opacity ${!isActive ? "opacity-20" : ""}`}>
                          <span className="w-12 text-right text-[10px] font-semibold text-[#6b7280] dark:text-[#94a3b8] flex-shrink-0">
                            {showLabel ? row.label : ""}
                          </span>
                          <div className="flex gap-[3px] flex-wrap">
                            {stalls.map((status, si) => (
                              <div
                                key={si}
                                style={{ backgroundColor: isActive ? STALL_CLR[status] : "#d1d5db" }}
                                className="w-[20px] h-[28px] rounded-[2px] hover:scale-110 transition-transform cursor-pointer shadow-sm"
                                title={`Row ${ri + 1} · Stall ${si + 1} · ${status}`}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>

                {activeRows.length === 0 && (
                  <p className="text-[13px] text-[#6b7280] dark:text-[#94a3b8] text-center mt-12">No data for selected zone at this site</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Site Overview Table */}
      <div className="px-8 mb-6">
        <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
            <div className="flex items-center gap-2">
              <h2 className="font-sans font-semibold text-[16px] text-[#111827] dark:text-[#e8eef5]">
                Site Overview
              </h2>
              <div className="group relative">
                <Info className="size-4 text-[#6b7280] dark:text-[#94a3b8] cursor-help" />
                <div className="invisible group-hover:visible absolute left-1/2 -translate-x-1/2 top-6 w-64 bg-[#111827] dark:bg-[#1a2d47] text-white dark:text-[#e8eef5] text-xs rounded-lg px-3 py-2 shadow-lg z-50 border border-transparent dark:border-[rgba(59,130,246,0.15)]">
                  A summary of all registered parking sites, their zone counts, active devices, and current operational status.
                </div>
              </div>
            </div>
            <Link
              to="/management/sites"
              className="text-[13px] font-medium text-[#3b82f6] dark:text-[#60a5fa] hover:text-[#2563eb] dark:hover:text-[#93c5fd]"
            >
              View All
            </Link>
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
      {/* <div className="px-8 mb-6">
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
      </div> */}

      {/* Enforcement Vehicles - 2x2 Grid */}
      <div className="px-8 mb-6">
        <div className="bg-white dark:bg-[#0f1f35] rounded-xl border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] shadow-sm">
          <div className="px-6 py-4 border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-sans font-semibold text-[16px] text-[#111827] dark:text-[#e8eef5]">
                Enforcement Vehicles
              </h2>
              <div className="group relative">
                <Info className="size-4 text-[#6b7280] dark:text-[#94a3b8] cursor-help" />
                <div className="invisible group-hover:visible absolute left-1/2 -translate-x-1/2 top-6 w-64 bg-[#111827] dark:bg-[#1a2d47] text-white dark:text-[#e8eef5] text-xs rounded-lg px-3 py-2 shadow-lg z-50 border border-transparent dark:border-[rgba(59,130,246,0.15)]">
                  Active patrol vehicles equipped with LPR cameras. Shows current site assignment, zone, and camera health status for each unit.
                </div>
              </div>
            </div>
            <Link
              to="/operations/enforcement-vehicles"
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
            <div className="flex items-center gap-2">
              <h2 className="font-sans font-semibold text-[16px] text-[#111827] dark:text-[#e8eef5]">
                Recent Violations
              </h2>
              <div className="group relative">
                <Info className="size-4 text-[#6b7280] dark:text-[#94a3b8] cursor-help" />
                <div className="invisible group-hover:visible absolute left-1/2 -translate-x-1/2 top-6 w-64 bg-[#111827] dark:bg-[#1a2d47] text-white dark:text-[#e8eef5] text-xs rounded-lg px-3 py-2 shadow-lg z-50 border border-transparent dark:border-[rgba(59,130,246,0.15)]">
                  The most recent parking violations detected across all sites, including plate number, zone, violation type, fine amount, and current resolution status.
                </div>
              </div>
            </div>
            <Link
              to="/operations/violations"
              className="text-[13px] font-medium text-[#3b82f6] dark:text-[#60a5fa] hover:text-[#2563eb] dark:hover:text-[#93c5fd]"
            >
              View All
            </Link>
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
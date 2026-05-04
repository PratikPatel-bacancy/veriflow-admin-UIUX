import "leaflet/dist/leaflet.css";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Plus, Edit, Check, ChevronRight, ChevronLeft, Loader2, Trash2 } from "lucide-react";
import { MapContainer, TileLayer, Polygon, CircleMarker, useMapEvents } from "react-leaflet";

// ── Map sub-components ────────────────────────────────────────────────────

function MapClickHandler({ onAdd }: { onAdd: (pt: [number, number]) => void }) {
  useMapEvents({ click: (e) => onAdd([e.latlng.lat, e.latlng.lng]) });
  return null;
}

function ZoneMap({
  points,
  setPoints,
}: {
  points: [number, number][];
  setPoints: (pts: [number, number][]) => void;
}) {
  return (
    <div style={{ position: "relative", height: 280, borderRadius: 8, overflow: "hidden" }}>
      <MapContainer
        center={[42.3314, -83.0458]}
        zoom={13}
        style={{ width: "100%", height: "100%" }}
        scrollWheelZoom={false}
        attributionControl={false}
        className="z-0"
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
        <MapClickHandler onAdd={(pt) => setPoints([...points, pt])} />
        {points.length >= 3 && (
          <Polygon
            positions={points}
            pathOptions={{ color: "#3b82f6", fillColor: "#3b82f6", fillOpacity: 0.15, weight: 2 }}
          />
        )}
        {points.map((pt, i) => (
          <CircleMarker
            key={i}
            center={pt}
            radius={i === 0 ? 9 : 6}
            pathOptions={{
              fillColor: i === 0 ? "#7C3AED" : "#3b82f6",
              fillOpacity: 0.9,
              color: "#ffffff",
              weight: 2,
            }}
          />
        ))}
      </MapContainer>

      {points.length === 0 && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 1000, pointerEvents: "none",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{
            background: "rgba(255,255,255,0.85)", backdropFilter: "blur(4px)",
            padding: "8px 16px", borderRadius: 8,
            fontSize: 13, color: "#6B7280", fontWeight: 500,
          }}>
            Click inside the site area to draw the zone boundary. Min 3 points.
          </span>
        </div>
      )}

      {points.length > 0 && (
        <div style={{
          position: "absolute", bottom: 12, right: 12, zIndex: 1000,
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <span style={{
            background: "rgba(255,255,255,0.92)", backdropFilter: "blur(4px)",
            padding: "4px 10px", borderRadius: 6,
            fontSize: 11, fontWeight: 600, color: "#374151",
          }}>
            {points.length} point{points.length !== 1 ? "s" : ""}
            {points.length >= 3 ? " · polygon ready" : ` · ${3 - points.length} more needed`}
          </span>
          <button
            type="button"
            onClick={() => setPoints([])}
            style={{
              background: "#FEE2E2", border: "none", borderRadius: 6,
              padding: "4px 10px", cursor: "pointer",
              fontSize: 11, fontWeight: 600, color: "#DC2626",
            }}
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────

interface ParkingLotEntry {
  id: string;
  name: string;
  lat: string;
  lng: string;
}

interface ZoneFormData {
  id: string;
  zoneName: string;
  zoneType: string;
  policyTemplate: string;
  capacity: string;
  parkingLots: ParkingLotEntry[];
  parkingLotDraft: { name: string; lat: string; lng: string };
  mapPoints: [number, number][];
  isCollapsed: boolean;
}

type Step = 1 | 2;

const allSites = [
  { id: 1, name: "UCLA Campus Parking",   type: "University Campus" },
  { id: 2, name: "Stanford University",   type: "University Campus" },
  { id: 3, name: "University of Michigan", type: "University Campus" },
  { id: 4, name: "UT Austin Campus",      type: "University Campus" },
  { id: 5, name: "Harvard University",    type: "University Campus" },
];

const inputCls =
  "w-full bg-white dark:bg-[#1a2d47] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg px-4 py-2 text-sm text-[#111827] dark:text-[#e8eef5] placeholder:text-[#6b7280] dark:placeholder:text-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent";
const labelCls = "block text-sm font-medium text-[#111827] dark:text-[#e8eef5] mb-2";

const newZone = (): ZoneFormData => ({
  id: `zone-${Date.now()}`,
  zoneName: "",
  zoneType: "",
  policyTemplate: "",
  capacity: "",
  parkingLots: [],
  parkingLotDraft: { name: "", lat: "", lng: "" },
  mapPoints: [],
  isCollapsed: false,
});

// ── Main component ────────────────────────────────────────────────────────

export default function AddZone() {
  const navigate = useNavigate();
  const { siteId } = useParams();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [completedSteps, setCompletedSteps] = useState<Step[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [lotFormOpen, setLotFormOpen] = useState<Record<string, boolean>>({});

  const currentSiteId = parseInt(siteId || "1");
  const currentSite = allSites.find((s) => s.id === currentSiteId) || allSites[0];

  const [zones, setZones] = useState<ZoneFormData[]>([newZone()]);

  const addZone = () => { if (zones.length < 10) setZones([...zones, newZone()]); };
  const removeZone = (id: string) => setZones(zones.filter((z: ZoneFormData) => z.id !== id));
  const updateZone = (id: string, field: keyof ZoneFormData, value: any) =>
    setZones(zones.map((z: ZoneFormData) => (z.id === id ? { ...z, [field]: value } : z)));
  const setZoneMapPoints = (id: string, pts: [number, number][]) =>
    setZones(zones.map((z: ZoneFormData) => (z.id === id ? { ...z, mapPoints: pts } : z)));
  const toggleZoneCollapse = (id: string) =>
    setZones(zones.map((z: ZoneFormData) => (z.id === id ? { ...z, isCollapsed: !z.isCollapsed } : z)));

  const addParkingLotToZone = (zoneId: string, draft: { name: string; lat: string; lng: string }) => {
    setZones(zones.map((z: ZoneFormData) =>
      z.id === zoneId
        ? { ...z, parkingLots: [...z.parkingLots, { id: `pl-${Date.now()}`, ...draft }], parkingLotDraft: { name: "", lat: "", lng: "" } }
        : z
    ));
    setLotFormOpen((prev: Record<string, boolean>) => ({ ...prev, [zoneId]: false }));
  };

  const handleBackStep = () => {
    if (currentStep > 1) setCurrentStep((currentStep - 1) as Step);
    else navigate(-1 as any);
  };

  const handleNextStep = () => {
    if (currentStep === 1 && atLeastOneZoneValid) {
      setCompletedSteps([...completedSteps, 1]);
      setCurrentStep(2);
    }
  };

  const handleStepClick = (step: Step) => {
    if (completedSteps.includes(step) || step < currentStep) setCurrentStep(step);
  };

  const handleSaveZones = async () => {
    setIsSaving(true);
    setTimeout(() => navigate("/management/zones"), 1000);
  };

  const totalCapacity = zones.reduce((sum: number, z: ZoneFormData) => sum + (parseInt(z.capacity) || 0), 0);
  const zoneIsComplete = (z: ZoneFormData) => z.zoneName && z.zoneType;
  const atLeastOneZoneValid = zones.some((z: ZoneFormData) => zoneIsComplete(z));

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto bg-[#eff6ff] dark:bg-[#0a1628] pb-6">
        {/* Breadcrumb */}
        <div className="px-8 pt-6">
          <div className="flex items-center gap-2 text-[14px] text-[#6b7280] dark:text-[#94a3b8]">
            <Link to="/" className="hover:text-[#3b82f6]">Home</Link>
            <span>›</span>
            <Link to="/management/zones" className="hover:text-[#3b82f6]">Zones</Link>
            <span>›</span>
            <span className="text-[#111827] dark:text-[#e8eef5]">Add Zone</span>
          </div>
        </div>

        {/* Page Title */}
        <div className="px-8 pt-4 pb-4">
          <h1 className="font-sans font-semibold text-[24px] leading-[32px] text-[#111827] dark:text-[#e8eef5]">Add Zone</h1>
        </div>

        {/* Stepper */}
        <div className="px-8 mb-6">
          <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6">
            <div className="flex items-center justify-between max-w-xl mx-auto">
              <div className="flex flex-col items-center flex-1">
                <button
                  onClick={() => handleStepClick(1)}
                  disabled={!completedSteps.includes(1) && currentStep !== 1}
                  className={`size-10 rounded-full flex items-center justify-center font-semibold text-sm mb-2 transition-colors ${
                    currentStep === 1 ? "bg-[#2563eb] text-white"
                    : completedSteps.includes(1) ? "bg-[#2563eb] text-white cursor-pointer hover:bg-[#1d4ed8]"
                    : "border-2 border-[#d1d5db] text-[#9ca3af] cursor-not-allowed"
                  }`}
                >
                  {completedSteps.includes(1) ? <Check className="size-5" /> : "1"}
                </button>
                <span className={`text-sm font-medium ${currentStep === 1 || completedSteps.includes(1) ? "text-[#111827] dark:text-[#e8eef5]" : "text-[#9ca3af]"}`}>
                  Add Zones
                </span>
              </div>
              <div className="flex-1 h-0.5 -mt-6 mx-4">
                <div className={`h-full ${completedSteps.includes(1) ? "bg-[#2563eb]" : "border-t-2 border-dashed border-[#d1d5db]"}`} />
              </div>
              <div className="flex flex-col items-center flex-1">
                <button
                  onClick={() => handleStepClick(2)}
                  disabled={!completedSteps.includes(1) && currentStep < 2}
                  className={`size-10 rounded-full flex items-center justify-center font-semibold text-sm mb-2 transition-colors ${
                    currentStep === 2 ? "bg-[#2563eb] text-white"
                    : "border-2 border-[#d1d5db] text-[#9ca3af] cursor-not-allowed"
                  }`}
                >
                  2
                </button>
                <span className={`text-sm font-medium ${currentStep === 2 ? "text-[#111827] dark:text-[#e8eef5]" : "text-[#9ca3af]"}`}>
                  Review
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-8">
          <div className="grid grid-cols-5 gap-6">
            {/* Left column */}
            <div className="col-span-3 space-y-4">

              {/* Step 1: Add Zones */}
              {currentStep === 1 && (
                <>
                  <div className="text-sm text-[#6b7280] dark:text-[#94a3b8] mb-2">
                    Adding zones to: <span className="font-medium text-[#111827] dark:text-[#e8eef5]">{currentSite.name}</span>
                  </div>

                  {zones.map((zone: ZoneFormData, index: number) => (
                    <div key={zone.id} className="space-y-4">

                      {/* Zone Details Card */}
                      <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm font-semibold text-[#111827] dark:text-[#e8eef5]">Zone {index + 1}</span>
                          {zones.length > 1 && (
                            <button
                              onClick={() => removeZone(zone.id)}
                              className="text-sm text-[#ef4444] hover:text-[#dc2626] transition-colors flex items-center gap-1"
                            >
                              <Trash2 className="size-3.5" /> Remove
                            </button>
                          )}
                        </div>

                        {zone.isCollapsed && zoneIsComplete(zone) ? (
                          <div className="flex items-center justify-between py-2">
                            <div className="flex items-center gap-3">
                              <span className="font-medium text-[#111827] dark:text-[#e8eef5]">{zone.zoneName}</span>
                              <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">• {zone.zoneType}</span>
                              {zone.capacity && <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">• {zone.capacity} capacity</span>}
                              {zone.parkingLots.length > 0 && <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">• {zone.parkingLots.length} lot{zone.parkingLots.length > 1 ? "s" : ""}</span>}
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleZoneCollapse(zone.id)}
                                className="p-1.5 hover:bg-[#eff6ff] dark:hover:bg-[rgba(30,58,95,0.3)] rounded transition-colors"
                              >
                                <Edit className="size-4 text-[#6b7280] dark:text-[#94a3b8]" />
                              </button>
                              <button onClick={() => removeZone(zone.id)} className="p-1.5 hover:bg-[#fee2e2] rounded transition-colors">
                                <Trash2 className="size-4 text-[#ef4444]" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-5">
                            {/* Zone Name */}
                            <div>
                              <label className={labelCls}>Zone Name <span className="text-[#ef4444]">*</span></label>
                              <input
                                type="text"
                                value={zone.zoneName}
                                onChange={(e) => updateZone(zone.id, "zoneName", e.target.value)}
                                placeholder="e.g. Lot 2 — Permit A (North)"
                                className={inputCls}
                              />
                            </div>

                            {/* Zone Type */}
                            <div>
                              <label className={labelCls}>Zone Type <span className="text-[#ef4444]">*</span></label>
                              <select
                                value={zone.zoneType}
                                onChange={(e) => updateZone(zone.id, "zoneType", e.target.value)}
                                className={inputCls}
                              >
                                <option value="">Select type</option>
                                <option value="Curb Segment">Curb Segment</option>
                                <option value="Surface Lot Zone">Surface Lot Zone</option>
                                <option value="Structure Level & Aisle">Structure Level & Aisle</option>
                              </select>
                            </div>

                            {/* Policy Template */}
                            <div>
                              <label className={labelCls}>Policy Template</label>
                              <select
                                value={zone.policyTemplate}
                                onChange={(e) => updateZone(zone.id, "policyTemplate", e.target.value)}
                                className={inputCls}
                              >
                                <option value="">None</option>
                                <option value="30-min Parking">30-min Parking</option>
                                <option value="1-Hour Parking">1-Hour Parking</option>
                                <option value="2-Hour Parking">2-Hour Parking</option>
                                <option value="Permit Only">Permit Only</option>
                                <option value="Loading Zone">Loading Zone</option>
                                <option value="Pay-to-Park">Pay-to-Park</option>
                                <option value="Handicap Stall">Handicap Stall</option>
                                <option value="No Stopping">No Stopping</option>
                              </select>
                            </div>

                            {/* Capacity */}
                            <div>
                              <label className={labelCls}>Capacity</label>
                              <input
                                type="number"
                                value={zone.capacity}
                                onChange={(e) => updateZone(zone.id, "capacity", e.target.value)}
                                placeholder="0"
                                className={inputCls}
                              />
                            </div>

                            {zoneIsComplete(zone) && (
                              <button
                                onClick={() => toggleZoneCollapse(zone.id)}
                                className="text-sm text-[#3b82f6] hover:text-[#2563eb] transition-colors"
                              >
                                Collapse
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Zone Boundary Card */}
                      <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-5">
                        {/* Card header */}
                        <div className="flex items-center mb-4">
                          <p className="font-semibold text-[14px] text-[#111827] dark:text-[#e8eef5]">Zone Boundary</p>
                          <span className="text-[11px] ms-2 font-medium px-2 py-0.5 rounded-full border border-[#bfdbfe] dark:border-[rgba(59,130,246,0.3)] text-[#3b82f6] bg-[#eff6ff] dark:bg-[rgba(59,130,246,0.08)]">
                            Site boundary shown
                          </span>
                        </div>

                        {/* Map */}
                        <ZoneMap
                          points={zone.mapPoints}
                          setPoints={(pts) => setZoneMapPoints(zone.id, pts)}
                        />

                        {/* Legend */}
                        <div className="flex items-center gap-5 mt-3">
                          <div className="flex items-center gap-1.5">
                            <svg width="24" height="8" viewBox="0 0 24 8">
                              <line x1="0" y1="4" x2="24" y2="4" stroke="#6b7280" strokeWidth="2" strokeDasharray="4 3" />
                            </svg>
                            <span className="text-[11px] text-[#6b7280] dark:text-[#94a3b8]">Site boundary</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="inline-block w-3.5 h-3.5 rounded-sm bg-[#3b82f6] opacity-50 flex-shrink-0" />
                            <span className="text-[11px] text-[#6b7280] dark:text-[#94a3b8]">Zone area</span>
                          </div>
                        </div>
                      </div>

                      {/* Parking Lots Card */}
                      <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-5">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-[14px] text-[#111827] dark:text-[#e8eef5]">Parking Lots</p>
                          <button
                            type="button"
                            onClick={() => setLotFormOpen((prev: Record<string, boolean>) => ({ ...prev, [zone.id]: !prev[zone.id] }))}
                            className="flex items-center gap-1 text-[13px] font-medium text-[#3b82f6] hover:text-[#2563eb] transition-colors"
                          >
                            <Plus className="size-3.5" /> Add Parking Lot
                          </button>
                        </div>

                        {/* Parking Lot inline form */}
                        {lotFormOpen[zone.id] && (
                          <div className="mt-4 border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg p-4 space-y-3 bg-[#f9fafb] dark:bg-[#0a1628]">
                            <div>
                              <label className="block text-xs font-medium text-[#6b7280] dark:text-[#94a3b8] mb-1.5">Parking Lot Name</label>
                              <input
                                type="text"
                                value={zone.parkingLotDraft.name}
                                onChange={(e) => updateZone(zone.id, "parkingLotDraft", { ...zone.parkingLotDraft, name: e.target.value })}
                                placeholder="e.g. Level 1 — North Wing"
                                className={inputCls}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-medium text-[#6b7280] dark:text-[#94a3b8] mb-1.5">Latitude</label>
                                <input
                                  type="text"
                                  value={zone.parkingLotDraft.lat}
                                  onChange={(e) => updateZone(zone.id, "parkingLotDraft", { ...zone.parkingLotDraft, lat: e.target.value })}
                                  placeholder="e.g. 42.3314"
                                  className={inputCls}
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-[#6b7280] dark:text-[#94a3b8] mb-1.5">Longitude</label>
                                <input
                                  type="text"
                                  value={zone.parkingLotDraft.lng}
                                  onChange={(e) => updateZone(zone.id, "parkingLotDraft", { ...zone.parkingLotDraft, lng: e.target.value })}
                                  placeholder="e.g. -83.0458"
                                  className={inputCls}
                                />
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                disabled={!zone.parkingLotDraft.name.trim()}
                                onClick={() => addParkingLotToZone(zone.id, zone.parkingLotDraft)}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#3b82f6] text-white text-sm font-medium rounded-lg hover:bg-[#2563eb] disabled:bg-[#e5e7eb] disabled:text-[#9ca3af] disabled:cursor-not-allowed transition-colors"
                              >
                                <Plus className="size-4" /> Add
                              </button>
                              <button
                                type="button"
                                onClick={() => setLotFormOpen((prev: Record<string, boolean>) => ({ ...prev, [zone.id]: false }))}
                                className="px-4 py-2 border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] text-sm text-[#6b7280] rounded-lg hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.3)] transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Added parking lots list */}
                        {zone.parkingLots.length > 0 && (
                          <div className="mt-4 border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-2.5 bg-[#eff6ff] dark:bg-[#1e3a5f] border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
                              <span className="text-xs font-semibold text-[#2563eb] dark:text-[#60a5fa] uppercase tracking-wide">Added Lots</span>
                              <span className="text-xs font-medium text-[#2563eb] dark:text-[#60a5fa] bg-white dark:bg-[#0f1f35] px-2 py-0.5 rounded-full border border-[#bfdbfe] dark:border-[rgba(59,130,246,0.3)]">
                                {zone.parkingLots.length} {zone.parkingLots.length === 1 ? "lot" : "lots"}
                              </span>
                            </div>
                            <div className="divide-y divide-[#e5e7eb] dark:divide-[rgba(59,130,246,0.1)]">
                              {zone.parkingLots.map((pl: ParkingLotEntry, idx: number) => (
                                <div key={pl.id} className="flex items-center justify-between px-4 py-3 bg-white dark:bg-[#0f1f35] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.4)] transition-colors">
                                  <div className="flex items-center gap-3">
                                    <span className="flex-shrink-0 size-6 rounded-full bg-[#dbeafe] dark:bg-[#1e3a8a] text-[#2563eb] dark:text-[#60a5fa] text-xs font-semibold flex items-center justify-center">
                                      {idx + 1}
                                    </span>
                                    <div>
                                      <p className="text-sm font-medium text-[#111827] dark:text-[#e8eef5]">{pl.name}</p>
                                      {(pl.lat || pl.lng) ? (
                                        <p className="text-xs text-[#6b7280] dark:text-[#94a3b8] mt-0.5">
                                          {pl.lat && `Lat: ${pl.lat}`}{pl.lat && pl.lng && "  ·  "}{pl.lng && `Lng: ${pl.lng}`}
                                        </p>
                                      ) : (
                                        <p className="text-xs text-[#9ca3af] dark:text-[#64748b] mt-0.5">No coordinates</p>
                                      )}
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => updateZone(zone.id, "parkingLots", zone.parkingLots.filter((p: ParkingLotEntry) => p.id !== pl.id))}
                                    className="p-1.5 rounded-lg hover:bg-[#fee2e2] dark:hover:bg-[#7f1d1d] transition-colors ml-2 flex-shrink-0"
                                  >
                                    <Trash2 className="size-3.5 text-[#dc2626] dark:text-[#f87171]" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  ))}

                  {zones.length < 10 && (
                    <button
                      onClick={addZone}
                      className="border-2 border-dashed border-[#3b82f6] text-[#3b82f6] rounded-lg px-4 py-3 flex items-center justify-center gap-2 text-sm font-medium hover:bg-[#eff6ff] dark:hover:bg-[rgba(30,58,95,0.3)] transition-colors w-full"
                    >
                      <Plus className="size-4" /> Add Another Zone
                    </button>
                  )}
                </>
              )}

              {/* Step 2: Review */}
              {currentStep === 2 && (
                <>
                  <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6">
                    <h2 className="font-semibold text-[#111827] dark:text-[#e8eef5] text-lg mb-6">Site</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-[#6b7280] dark:text-[#94a3b8] mb-1">Site Name</p>
                        <p className="text-sm font-medium text-[#6b7280] dark:text-[#94a3b8]">{currentSite.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#6b7280] dark:text-[#94a3b8] mb-1">Site Type</p>
                        <p className="text-sm font-medium text-[#6b7280] dark:text-[#94a3b8]">{currentSite.type}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <h2 className="font-semibold text-[#111827] dark:text-[#e8eef5] text-lg">Zones</h2>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#dbeafe] text-[#1e40af]">
                          {zones.length} {zones.length === 1 ? "Zone" : "Zones"}
                        </span>
                      </div>
                      <button onClick={() => setCurrentStep(1)} className="text-sm text-[#3b82f6] hover:text-[#2563eb] transition-colors">Edit</button>
                    </div>
                    <div className="space-y-3">
                      {zones.map((zone: ZoneFormData, index: number) => (
                        <div key={zone.id} className="border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg p-4">
                          <p className="font-medium text-[#111827] dark:text-[#e8eef5] mb-1">Zone {index + 1} — {zone.zoneName || "Unnamed"}</p>
                          <p className="text-sm text-[#6b7280] dark:text-[#94a3b8]">
                            {zone.zoneType}
                            {zone.capacity && ` · ${zone.capacity} capacity`}
                            {zone.policyTemplate && ` · ${zone.policyTemplate}`}
                            {zone.parkingLots.length > 0 && ` · ${zone.parkingLots.length} parking lot${zone.parkingLots.length > 1 ? "s" : ""}`}
                            {zone.mapPoints.length >= 3 && ` · boundary drawn`}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Right column — Summary */}
            <div className="col-span-2">
              <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6 sticky top-6">
                {currentStep === 2 ? (
                  <>
                    <h2 className="font-semibold text-[#111827] dark:text-[#e8eef5] text-lg mb-6">Ready to Add</h2>
                    <div className="flex flex-col items-center mb-6">
                      <div className="size-16 rounded-full bg-[#d1fae5] flex items-center justify-center mb-4">
                        <Check className="size-8 text-[#10b981]" />
                      </div>
                      <p className="text-sm text-center text-[#6b7280] dark:text-[#94a3b8] mb-6">
                        Your zones are configured and ready. Click Save Zones to finish.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="size-4 text-[#10b981]" />
                        <span className="text-[#111827] dark:text-[#e8eef5]">Site: {currentSite.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="size-4 text-[#10b981]" />
                        <span className="text-[#111827] dark:text-[#e8eef5]">{zones.length} {zones.length === 1 ? "Zone" : "Zones"} configured</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="size-4 text-[#10b981]" />
                        <span className="text-[#111827] dark:text-[#e8eef5]">Total Capacity: {totalCapacity}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="font-semibold text-[#111827] dark:text-[#e8eef5] text-lg mb-6">Summary</h2>
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center justify-between pb-4 border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
                        <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Site Name</span>
                        <span className="text-sm text-[#6b7280] dark:text-[#94a3b8] font-medium">{currentSite.name}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Zones Added</span>
                        <span className="text-sm text-[#111827] dark:text-[#e8eef5] font-medium">{zones.length}</span>
                      </div>
                      {zones.length > 0 && (
                        <div className="border-t border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] pt-4">
                          <p className="text-xs text-[#6b7280] dark:text-[#94a3b8] mb-2">Zones:</p>
                          <div className="space-y-1">
                            {zones.map((zone: ZoneFormData, index: number) => (
                              <p key={zone.id} className="text-xs text-[#111827] dark:text-[#e8eef5]">
                                {index + 1}. {zone.zoneName || "Unnamed Zone"}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="flex items-center justify-between border-t border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] pt-4">
                        <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Total Capacity</span>
                        <span className="text-sm text-[#111827] dark:text-[#e8eef5] font-medium">{totalCapacity}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-[#111827] dark:text-[#e8eef5]">Completion</span>
                        <span className="text-sm text-[#3b82f6] font-medium">{atLeastOneZoneValid ? "100%" : "0%"}</span>
                      </div>
                      <div className="w-full bg-[#e5e7eb] dark:bg-[#1a2d47] rounded-full h-2">
                        <div
                          className="bg-[#3b82f6] h-2 rounded-full transition-all duration-300"
                          style={{ width: atLeastOneZoneValid ? "100%" : "0%" }}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white dark:bg-[#0f1f35] border-t border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] px-8 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBackStep}
            className="border border-[#e5e7eb] text-[#111827] dark:text-[#e8eef5] font-medium rounded-lg px-6 py-2 hover:bg-[#eff6ff] dark:hover:bg-[rgba(30,58,95,0.3)] transition-colors flex items-center gap-2"
          >
            <ChevronLeft className="size-4" /> Back
          </button>

          <div className="flex items-center gap-3">
            {currentStep < 2 ? (
              <button
                onClick={handleNextStep}
                disabled={!atLeastOneZoneValid}
                className="bg-[#3b82f6] text-white font-medium rounded-lg px-6 py-2 hover:bg-[#2563eb] transition-colors disabled:bg-[#e5e7eb] disabled:text-[#9ca3af] disabled:cursor-not-allowed flex items-center gap-2"
              >
                Next: Review <ChevronRight className="size-4" />
              </button>
            ) : (
              <button
                onClick={handleSaveZones}
                disabled={isSaving}
                className="bg-[#3b82f6] text-white font-medium rounded-lg px-8 py-2.5 hover:bg-[#2563eb] transition-colors disabled:bg-[#e5e7eb] disabled:text-[#9ca3af] disabled:cursor-not-allowed flex items-center gap-2 text-base"
              >
                {isSaving ? <><Loader2 className="size-4 animate-spin" /> Saving...</> : "Save Zones"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

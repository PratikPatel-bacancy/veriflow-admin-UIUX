import "leaflet/dist/leaflet.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Plus, Edit, Info, Check, ChevronRight, ChevronLeft, Loader2, Trash2 } from "lucide-react";
import L from "leaflet";
import { MapContainer, TileLayer, Polygon, Marker, useMapEvents } from "react-leaflet";

// ── Constants ─────────────────────────────────────────────────────────────

const COUNTRIES = [
  "Australia", "Austria", "Belgium", "Brazil", "Canada", "Chile", "China",
  "Colombia", "Czech Republic", "Denmark", "Egypt", "Finland", "France",
  "Germany", "Greece", "Hungary", "India", "Israel", "Italy", "Japan",
  "Mexico", "Netherlands", "New Zealand", "Nigeria", "Norway", "Poland",
  "Portugal", "Romania", "Saudi Arabia", "Singapore", "South Africa",
  "South Korea", "Spain", "Sweden", "Switzerland", "Turkey", "UAE",
  "United Kingdom", "United States",
];

const inputCls =
  "w-full bg-white dark:bg-[#1a2d47] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg px-4 py-2 text-sm text-[#111827] dark:text-[#e8eef5] placeholder:text-[#6b7280] dark:placeholder:text-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent";

const labelCls = "block text-sm font-medium text-[#111827] dark:text-[#e8eef5] mb-2";

// Vertex icon for draggable map points
const vertexIcon = L.divIcon({
  className: "",
  html: `<div style="width:14px;height:14px;border-radius:50%;background:#3b82f6;border:2.5px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.35);cursor:grab"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

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
  geometryMethod: "draw" | "import";
  status: string;
  isCollapsed: boolean;
}

type Step = 1 | 2 | 3;

// ── Map sub-components ────────────────────────────────────────────────────

function MapClickHandler({
  onAdd,
  disabled,
}: {
  onAdd: (pt: [number, number]) => void;
  disabled: boolean;
}) {
  useMapEvents({
    click: (e) => {
      if (!disabled) onAdd([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

function TriangleMap({
  points,
  setPoints,
}: {
  points: [number, number][];
  setPoints: (pts: [number, number][]) => void;
}) {
  const isComplete = points.length === 3;

  return (
    <div>
      <div className="relative rounded-lg overflow-hidden border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
        <MapContainer
          center={[40.7128, -74.006]}
          zoom={11}
          style={{ height: "280px" }}
          className="w-full z-0"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />
          <MapClickHandler onAdd={(pt) => setPoints([...points, pt])} disabled={isComplete} />
          {isComplete && (
            <Polygon
              positions={points}
              pathOptions={{ color: "#3b82f6", fillColor: "#3b82f6", fillOpacity: 0.2, weight: 2 }}
            />
          )}
          {points.map((pt, i) => (
            <Marker
              key={i}
              position={pt}
              draggable={true}
              icon={vertexIcon}
              eventHandlers={{
                dragend: (e) => {
                  const { lat, lng } = (e.target as L.Marker).getLatLng();
                  const updated = [...points] as [number, number][];
                  updated[i] = [lat, lng];
                  setPoints(updated);
                },
              }}
            />
          ))}
        </MapContainer>

        {/* Reset button overlaid at bottom-right */}
        {points.length > 0 && (
          <button
            type="button"
            onClick={() => setPoints([])}
            className="absolute bottom-3 right-3 z-[1000] px-2.5 py-1.5 text-xs font-semibold bg-[#ef4444] text-white rounded-lg hover:bg-[#dc2626] shadow-md transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      {/* Status text below map */}
      <p className={`mt-2 text-xs ${isComplete ? "text-[#16a34a] dark:text-[#34d399] font-medium" : "text-[#6b7280] dark:text-[#94a3b8]"}`}>
        {isComplete
          ? "3 points · polygon ready"
          : `${points.length} / 3 points placed — click on map to add`}
      </p>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────

export default function CreateSite() {
  const navigate = useNavigate();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [completedSteps, setCompletedSteps] = useState<Step[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const [siteData, setSiteData] = useState({
    siteName: "",
    country: "",
    city: "",
    postalCode: "",
    geoLat: "",
    geoLon: "",
    note: "",
    status: "Active",
  });

  const [mapPoints, setMapPoints] = useState<[number, number][]>([]);
  const [zones, setZones] = useState<ZoneFormData[]>([]);

  const handleSiteDataChange = (field: string, value: string) => {
    setSiteData({ ...siteData, [field]: value });
  };

  const addZone = () => {
    if (zones.length >= 10) return;
    setZones([
      ...zones,
      {
        id: `zone-${Date.now()}`,
        zoneName: "",
        zoneType: "",
        policyTemplate: "",
        capacity: "",
        parkingLots: [],
        parkingLotDraft: { name: "", lat: "", lng: "" },
        geometryMethod: "draw",
        status: "Active",
        isCollapsed: false,
      },
    ]);
  };

  const removeZone = (id: string) => setZones(zones.filter((z) => z.id !== id));

  const updateZone = (id: string, field: keyof ZoneFormData, value: any) =>
    setZones(zones.map((z) => (z.id === id ? { ...z, [field]: value } : z)));

  const addParkingLotToZone = (zoneId: string, draft: { name: string; lat: string; lng: string }) =>
    setZones(zones.map((z) =>
      z.id === zoneId
        ? { ...z, parkingLots: [...z.parkingLots, { id: `pl-${Date.now()}`, ...draft }], parkingLotDraft: { name: "", lat: "", lng: "" } }
        : z
    ));

  const toggleZoneCollapse = (id: string) =>
    setZones(zones.map((z) => (z.id === id ? { ...z, isCollapsed: !z.isCollapsed } : z)));

  const handleCancel = () => setShowCancelDialog(true);
  const confirmCancel = () => navigate("/management/sites");

  const handleNextStep = () => {
    if (currentStep === 1 && requiredFieldsFilled) {
      setCompletedSteps([...completedSteps, 1]);
      setCurrentStep(2);
      if (zones.length === 0) addZone();
    } else if (currentStep === 2) {
      setCompletedSteps([...completedSteps, 2]);
      setCurrentStep(3);
    }
  };

  const handleBackStep = () => {
    if (currentStep > 1) setCurrentStep((currentStep - 1) as Step);
  };

  const handleStepClick = (step: Step) => {
    if (completedSteps.includes(step) || step < currentStep) setCurrentStep(step);
  };

  const handleSkipZones = () => {
    setCompletedSteps([...completedSteps, 2]);
    setCurrentStep(3);
  };

  const handleCreateSite = async () => {
    setIsCreating(true);
    setTimeout(() => navigate("/management/sites/1"), 1000);
  };

  const requiredFieldsFilled = siteData.siteName && siteData.country && siteData.city;
  const totalCapacity = zones.reduce((sum, z) => sum + (parseInt(z.capacity) || 0), 0);
  const zoneIsComplete = (z: ZoneFormData) => z.zoneName && z.zoneType;

  // Completion % for summary progress bar (8 trackable items)
  const filledCount =
    [siteData.siteName, siteData.country, siteData.city, siteData.postalCode, siteData.geoLat, siteData.geoLon, siteData.note]
      .filter(Boolean).length + (mapPoints.length === 3 ? 1 : 0);
  const completionPercentage = Math.round((filledCount / 8) * 100);

  return (
    <>
      <div className="flex-1 overflow-auto bg-[#eff6ff] dark:bg-[#0a1628] pb-24">
        {/* Breadcrumb */}
        <div className="px-8 pt-6">
          <div className="flex items-center gap-2 text-[14px] text-[#6b7280] dark:text-[#94a3b8]">
            <Link to="/" className="hover:text-[#3b82f6]">Home</Link>
            <span>›</span>
            <Link to="/management/sites" className="hover:text-[#3b82f6]">Sites</Link>
            <span>›</span>
            <span className="text-[#111827] dark:text-[#e8eef5]">Create Site</span>
          </div>
        </div>

        {/* Page Title */}
        <div className="px-8 pt-4 pb-4">
          <h1 className="font-sans font-semibold text-[24px] leading-[32px] text-[#111827] dark:text-[#e8eef5]">
            Create Site
          </h1>
        </div>

        {/* Stepper */}
        <div className="px-8 mb-6">
          <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6">
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              {([1, 2, 3] as Step[]).map((step, idx) => (
                <>
                  <div key={step} className="flex flex-col items-center flex-1">
                    <button
                      onClick={() => handleStepClick(step)}
                      disabled={!completedSteps.includes(step) && currentStep !== step && step > currentStep}
                      className={`size-10 rounded-full flex items-center justify-center font-semibold text-sm mb-2 transition-colors ${
                        currentStep === step
                          ? "bg-[#2563eb] text-white"
                          : completedSteps.includes(step)
                          ? "bg-[#2563eb] text-white cursor-pointer hover:bg-[#1d4ed8]"
                          : "border-2 border-[#d1d5db] text-[#9ca3af] cursor-not-allowed"
                      }`}
                    >
                      {completedSteps.includes(step) ? <Check className="size-5" /> : step}
                    </button>
                    <span className={`text-sm font-medium ${currentStep === step || completedSteps.includes(step) ? "text-[#111827] dark:text-[#e8eef5]" : "text-[#9ca3af]"}`}>
                      {step === 1 ? "Site Info" : step === 2 ? "Add Zones" : "Review"}
                    </span>
                  </div>
                  {idx < 2 && (
                    <div key={`conn-${step}`} className="flex-1 h-0.5 -mt-6 mx-4">
                      <div className={`h-full ${completedSteps.includes(step) ? "bg-[#2563eb]" : "border-t-2 border-dashed border-[#d1d5db]"}`} />
                    </div>
                  )}
                </>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-8">
          <div className="grid grid-cols-5 gap-6">
            {/* ── Left column ── */}
            <div className="col-span-3 space-y-6">

              {/* Step 1: Site Info */}
              {currentStep === 1 && (
                <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6">
                  <h2 className="font-semibold text-[#111827] dark:text-[#e8eef5] text-lg mb-6">
                    Site Information
                  </h2>

                  <div className="space-y-5">
                    {/* Site Name */}
                    <div>
                      <label className={labelCls}>
                        Site Name <span className="text-[#ef4444]">*</span>
                      </label>
                      <input
                        type="text"
                        value={siteData.siteName}
                        onChange={(e) => handleSiteDataChange("siteName", e.target.value)}
                        placeholder="Enter site name"
                        className={inputCls}
                      />
                    </div>

                    {/* Country */}
                    <div>
                      <label className={labelCls}>
                        Country <span className="text-[#ef4444]">*</span>
                      </label>
                      <select
                        value={siteData.country}
                        onChange={(e) => handleSiteDataChange("country", e.target.value)}
                        className={inputCls}
                      >
                        <option value="">Select country</option>
                        {COUNTRIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    {/* City + Postal Code */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>
                          City <span className="text-[#ef4444]">*</span>
                        </label>
                        <input
                          type="text"
                          value={siteData.city}
                          onChange={(e) => handleSiteDataChange("city", e.target.value)}
                          placeholder="Enter city"
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Postal Code</label>
                        <input
                          type="text"
                          value={siteData.postalCode}
                          onChange={(e) => handleSiteDataChange("postalCode", e.target.value)}
                          placeholder="e.g. 48226"
                          className={inputCls}
                        />
                      </div>
                    </div>

                    {/* Latitude + Longitude */}
                    {/* <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>Latitude</label>
                        <input
                          type="text"
                          value={siteData.geoLat}
                          onChange={(e) => handleSiteDataChange("geoLat", e.target.value)}
                          placeholder="e.g. 42.3314"
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Longitude</label>
                        <input
                          type="text"
                          value={siteData.geoLon}
                          onChange={(e) => handleSiteDataChange("geoLon", e.target.value)}
                          placeholder="e.g. -83.0458"
                          className={inputCls}
                        />
                      </div>
                    </div> */}

                    {/* Draw on Map */}
                    <div>
                      <label className={labelCls}>Draw Boundary on Map</label>
                      <p className="text-xs text-[#6b7280] dark:text-[#94a3b8] mb-3">
                        Click exactly 3 points on the map to define the site boundary triangle.
                      </p>
                      <TriangleMap points={mapPoints} setPoints={setMapPoints} />
                    </div>

                    {/* Note */}
                    <div>
                      <label className={labelCls}>Note</label>
                      <textarea
                        value={siteData.note}
                        onChange={(e) => handleSiteDataChange("note", e.target.value)}
                        placeholder="Add notes"
                        rows={3}
                        className={`${inputCls} resize-none`}
                      />
                    </div>

                    {/* Status */}
                    <div>
                      <label className={labelCls}>Status</label>
                      <select
                        value={siteData.status}
                        onChange={(e) => handleSiteDataChange("status", e.target.value)}
                        className={inputCls}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Draft">Draft</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Add Zones */}
              {currentStep === 2 && (
                <>
                  <div className="text-sm text-[#6b7280] dark:text-[#94a3b8] mb-4">
                    Adding zones to: <span className="font-medium text-[#111827] dark:text-[#e8eef5]">{siteData.siteName}</span>
                  </div>

                  {zones.map((zone, index) => (
                    <div key={zone.id} className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-[#6b7280] dark:text-[#94a3b8]">Zone {index + 1}</span>
                        {zones.length > 1 && (
                          <button onClick={() => removeZone(zone.id)} className="text-sm text-[#ef4444] hover:text-[#dc2626] transition-colors flex items-center gap-1">
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
                          <button onClick={() => toggleZoneCollapse(zone.id)} className="p-1.5 hover:bg-[#eff6ff] dark:hover:bg-[rgba(30,58,95,0.3)] rounded transition-colors">
                            <Edit className="size-4 text-[#6b7280] dark:text-[#94a3b8]" />
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-5">
                          <div>
                            <label className={labelCls}>Zone Name <span className="text-[#ef4444]">*</span></label>
                            <input type="text" value={zone.zoneName} onChange={(e) => updateZone(zone.id, "zoneName", e.target.value)} placeholder="e.g. Lot 2 — Permit A (North)" className={inputCls} />
                          </div>
                          <div>
                            <label className={labelCls}>Zone Type <span className="text-[#ef4444]">*</span></label>
                            <select value={zone.zoneType} onChange={(e) => updateZone(zone.id, "zoneType", e.target.value)} className={inputCls}>
                              <option value="">Select type</option>
                              <option value="Curb Segment">Curb Segment</option>
                              <option value="Surface Lot Zone">Surface Lot Zone</option>
                              <option value="Structure Level & Aisle">Structure Level & Aisle</option>
                            </select>
                          </div>
                          <div>
                            <label className={labelCls}>Policy Template</label>
                            <select value={zone.policyTemplate} onChange={(e) => updateZone(zone.id, "policyTemplate", e.target.value)} className={inputCls}>
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
                          <div>
                            <label className={labelCls}>Capacity</label>
                            <input type="number" value={zone.capacity} onChange={(e) => updateZone(zone.id, "capacity", e.target.value)} placeholder="0" className={inputCls} />
                          </div>
                          <div>
                            <label className={labelCls}>Parking Lots</label>
                            <div className="space-y-3">
                              <div className="border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg p-4 space-y-3 bg-[#f9fafb] dark:bg-[#0a1628]">
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
                                <button
                                  type="button"
                                  disabled={!zone.parkingLotDraft.name.trim()}
                                  onClick={() => addParkingLotToZone(zone.id, zone.parkingLotDraft)}
                                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#3b82f6] text-white text-sm font-medium rounded-lg hover:bg-[#2563eb] disabled:bg-[#e5e7eb] disabled:text-[#9ca3af] disabled:cursor-not-allowed transition-colors"
                                >
                                  <Plus className="size-4" /> Add Parking Lot
                                </button>
                              </div>

                              {zone.parkingLots.length > 0 && (
                                <div className="border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg overflow-hidden">
                                  <div className="flex items-center justify-between px-4 py-2.5 bg-[#eff6ff] dark:bg-[#1e3a5f] border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
                                    <span className="text-xs font-semibold text-[#2563eb] dark:text-[#60a5fa] uppercase tracking-wide">
                                      Added Parking Lots
                                    </span>
                                    <span className="text-xs font-medium text-[#2563eb] dark:text-[#60a5fa] bg-white dark:bg-[#0f1f35] px-2 py-0.5 rounded-full border border-[#bfdbfe] dark:border-[rgba(59,130,246,0.3)]">
                                      {zone.parkingLots.length} {zone.parkingLots.length === 1 ? "lot" : "lots"}
                                    </span>
                                  </div>
                                  <div className="divide-y divide-[#e5e7eb] dark:divide-[rgba(59,130,246,0.1)]">
                                    {zone.parkingLots.map((pl, idx) => (
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
                                          onClick={() => updateZone(zone.id, "parkingLots", zone.parkingLots.filter((p) => p.id !== pl.id))}
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
                          <div>
                            <label className={labelCls}>Geometry</label>
                            <div className="border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg overflow-hidden">
                              <div className="flex border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
                                {(["draw", "import"] as const).map((m) => (
                                  <button key={m} type="button" onClick={() => updateZone(zone.id, "geometryMethod", m)}
                                    className={`flex-1 px-4 py-2 text-sm transition-colors ${zone.geometryMethod === m ? "bg-white dark:bg-[#0f1f35] text-[#3b82f6] border-b-2 border-[#3b82f6]" : "bg-[#eff6ff] dark:bg-[#1a2d47] text-[#6b7280] dark:text-[#94a3b8]"}`}>
                                    {m === "draw" ? "Draw on Map" : "Import File"}
                                  </button>
                                ))}
                              </div>
                              <div className="p-4 bg-white dark:bg-[#0f1f35]">
                                {zone.geometryMethod === "draw" ? (
                                  <div className="bg-[#f5f5f5] dark:bg-[#1a2d47] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded h-32 flex items-center justify-center">
                                    <p className="text-sm text-[#6b7280] dark:text-[#94a3b8] text-center px-4">Click to place points. Min 3 points. Close polygon to finish.</p>
                                  </div>
                                ) : (
                                  <div className="border-2 border-dashed border-[#e5e7eb] rounded h-32 flex flex-col items-center justify-center gap-2">
                                    <p className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Drop files here or click to upload</p>
                                    <p className="text-xs text-[#9ca3af]">Accepts GeoJSON, CSV, or Shapefile</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className={labelCls}>Status</label>
                            <select value={zone.status} onChange={(e) => updateZone(zone.id, "status", e.target.value)} className={inputCls}>
                              <option value="Active">Active</option>
                              <option value="Inactive">Inactive</option>
                            </select>
                          </div>
                          {zoneIsComplete(zone) && (
                            <button onClick={() => toggleZoneCollapse(zone.id)} className="text-sm text-[#3b82f6] hover:text-[#2563eb] transition-colors">
                              Collapse
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}

                  {zones.length < 10 && (
                    <button onClick={addZone} className="border-2 border-dashed border-[#3b82f6] text-[#3b82f6] rounded-lg px-4 py-3 flex items-center justify-center gap-2 text-sm font-medium hover:bg-[#eff6ff] dark:hover:bg-[rgba(30,58,95,0.3)] transition-colors w-full">
                      <Plus className="size-4" /> Add Another Zone
                    </button>
                  )}
                </>
              )}

              {/* Step 3: Review */}
              {currentStep === 3 && (
                <>
                  <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-semibold text-[#111827] dark:text-[#e8eef5] text-lg">Site Information</h2>
                      <button onClick={() => setCurrentStep(1)} className="text-sm text-[#3b82f6] hover:text-[#2563eb] transition-colors">Edit</button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-[#6b7280] dark:text-[#94a3b8] mb-1">Site Name</p>
                        <p className="text-sm font-medium text-[#111827] dark:text-[#e8eef5]">{siteData.siteName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#6b7280] dark:text-[#94a3b8] mb-1">Country</p>
                        <p className="text-sm font-medium text-[#111827] dark:text-[#e8eef5]">{siteData.country || "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#6b7280] dark:text-[#94a3b8] mb-1">City</p>
                        <p className="text-sm font-medium text-[#111827] dark:text-[#e8eef5]">{siteData.city || "—"}</p>
                      </div>
                      {siteData.postalCode && (
                        <div>
                          <p className="text-xs text-[#6b7280] dark:text-[#94a3b8] mb-1">Postal Code</p>
                          <p className="text-sm font-medium text-[#111827] dark:text-[#e8eef5]">{siteData.postalCode}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-[#6b7280] dark:text-[#94a3b8] mb-1">Status</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${siteData.status === "Active" ? "bg-[#d1fae5] text-[#065f46]" : siteData.status === "Inactive" ? "bg-[#fee2e2] text-[#991b1b]" : "bg-[#e5e7eb] text-[#6b7280]"}`}>
                          {siteData.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-[#6b7280] dark:text-[#94a3b8] mb-1">Boundary Points</p>
                        <p className="text-sm font-medium text-[#111827] dark:text-[#e8eef5]">{mapPoints.length} / 3</p>
                      </div>
                      {(siteData.geoLat || siteData.geoLon) && (
                        <>
                          <div>
                            <p className="text-xs text-[#6b7280] dark:text-[#94a3b8] mb-1">Latitude</p>
                            <p className="text-sm font-medium text-[#111827] dark:text-[#e8eef5]">{siteData.geoLat || "—"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-[#6b7280] dark:text-[#94a3b8] mb-1">Longitude</p>
                            <p className="text-sm font-medium text-[#111827] dark:text-[#e8eef5]">{siteData.geoLon || "—"}</p>
                          </div>
                        </>
                      )}
                      {siteData.note && (
                        <div className="col-span-2">
                          <p className="text-xs text-[#6b7280] dark:text-[#94a3b8] mb-1">Note</p>
                          <p className="text-sm font-medium text-[#111827] dark:text-[#e8eef5]">{siteData.note}</p>
                        </div>
                      )}
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
                      <button onClick={() => setCurrentStep(2)} className="text-sm text-[#3b82f6] hover:text-[#2563eb] transition-colors">Edit</button>
                    </div>
                    {zones.length === 0 ? (
                      <p className="text-sm text-[#6b7280] dark:text-[#94a3b8]">No zones added. Zones can be added after site creation from the Site Detail page.</p>
                    ) : (
                      <div className="space-y-3">
                        {zones.map((zone, index) => (
                          <div key={zone.id} className="border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-[#111827] dark:text-[#e8eef5] mb-1">Zone {index + 1} — {zone.zoneName || "Unnamed"}</p>
                                <p className="text-sm text-[#6b7280] dark:text-[#94a3b8]">
                                  {zone.zoneType}{zone.capacity && ` · ${zone.capacity} capacity`}{zone.policyTemplate && ` · ${zone.policyTemplate}`}{zone.parkingLots.length > 0 && ` · ${zone.parkingLots.length} parking lot${zone.parkingLots.length > 1 ? "s" : ""}`}
                                </p>
                              </div>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${zone.status === "Active" ? "bg-[#d1fae5] text-[#065f46]" : "bg-[#e5e7eb] text-[#6b7280]"}`}>
                                {zone.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* ── Right column: Summary ── */}
            <div className="col-span-2">
              <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6 sticky top-6">
                {currentStep === 3 ? (
                  <>
                    <h2 className="font-semibold text-[#111827] dark:text-[#e8eef5] text-lg mb-6">Ready to Create</h2>
                    <div className="flex flex-col items-center mb-6">
                      <div className="size-16 rounded-full bg-[#d1fae5] flex items-center justify-center mb-4">
                        <Check className="size-8 text-[#10b981]" />
                      </div>
                      <p className="text-sm text-center text-[#6b7280] dark:text-[#94a3b8] mb-6">
                        Your site is configured and ready. Click Create Site to finish.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="size-4 text-[#10b981]" />
                        <span className="text-[#111827] dark:text-[#e8eef5]">Site Info complete</span>
                      </div>
                      {zones.length > 0 ? (
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="size-4 text-[#10b981]" />
                          <span className="text-[#111827] dark:text-[#e8eef5]">{zones.length} {zones.length === 1 ? "Zone" : "Zones"} configured</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-sm">
                          <Info className="size-4 text-[#6b7280] dark:text-[#94a3b8]" />
                          <span className="text-[#6b7280] dark:text-[#94a3b8]">No zones added</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="size-4 text-[#10b981]" />
                        <span className="text-[#111827] dark:text-[#e8eef5]">Ready to create</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="font-semibold text-[#111827] dark:text-[#e8eef5] text-lg mb-6">Summary</h2>

                    <div className="space-y-3 mb-6">
                      {/* Site Name */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Site Name</span>
                        <div className="flex items-center gap-2">
                          {siteData.siteName && <Check className="size-3.5 text-[#10b981]" />}
                          <span className={`text-sm ${siteData.siteName ? "text-[#111827] dark:text-[#e8eef5] font-medium" : "text-[#9ca3af]"}`}>
                            {siteData.siteName || "—"}
                          </span>
                        </div>
                      </div>

                      {/* Country */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Country</span>
                        <div className="flex items-center gap-2">
                          {siteData.country && <Check className="size-3.5 text-[#10b981]" />}
                          <span className={`text-sm ${siteData.country ? "text-[#111827] dark:text-[#e8eef5] font-medium" : "text-[#9ca3af]"}`}>
                            {siteData.country || "—"}
                          </span>
                        </div>
                      </div>

                      {/* City */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">City</span>
                        <div className="flex items-center gap-2">
                          {siteData.city && <Check className="size-3.5 text-[#10b981]" />}
                          <span className={`text-sm ${siteData.city ? "text-[#111827] dark:text-[#e8eef5] font-medium" : "text-[#9ca3af]"}`}>
                            {siteData.city || "—"}
                          </span>
                        </div>
                      </div>

                      {/* Boundary Points */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Boundary Points</span>
                        <div className="flex items-center gap-2">
                          {mapPoints.length === 3 && <Check className="size-3.5 text-[#10b981]" />}
                          <span className={`text-sm ${mapPoints.length === 3 ? "text-[#111827] dark:text-[#e8eef5] font-medium" : "text-[#9ca3af]"}`}>
                            {mapPoints.length} / 3
                          </span>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Status</span>
                        <div className="flex items-center gap-2">
                          <Check className="size-3.5 text-[#10b981]" />
                          <span className="text-sm text-[#111827] dark:text-[#e8eef5] font-medium">{siteData.status}</span>
                        </div>
                      </div>

                      {/* Zones section */}
                      <div className="border-t border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] pt-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Zones Added</span>
                          <span className="text-sm text-[#111827] dark:text-[#e8eef5] font-medium">{zones.length}</span>
                        </div>
                        {currentStep === 2 && zones.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {zones.map((zone, index) => (
                              <p key={zone.id} className="text-xs text-[#111827] dark:text-[#e8eef5]">
                                {index + 1}. {zone.zoneName || "Unnamed Zone"}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Progress bar on Step 1 */}
                    {currentStep === 1 && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-[#111827] dark:text-[#e8eef5]">Form Completion</span>
                          <span className="text-sm text-[#3b82f6] font-medium">{completionPercentage}%</span>
                        </div>
                        <div className="w-full bg-[#e5e7eb] dark:bg-[#1a2d47] rounded-full h-2">
                          <div
                            className="bg-[#3b82f6] h-2 rounded-full transition-all duration-300"
                            style={{ width: `${completionPercentage}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#0f1f35] border-t border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] px-8 py-4 z-10">
        <div className="flex items-center justify-between">
          <button
            onClick={currentStep === 1 ? handleCancel : handleBackStep}
            className="border border-[#e5e7eb] text-[#111827] dark:text-[#e8eef5] font-medium rounded-lg px-6 py-2 hover:bg-[#eff6ff] dark:hover:bg-[rgba(30,58,95,0.3)] transition-colors flex items-center gap-2"
          >
            {currentStep === 1 ? "Cancel" : <><ChevronLeft className="size-4" /> Back</>}
          </button>

          <div className="flex items-center gap-3">
            {currentStep === 2 && (
              <button onClick={handleSkipZones} className="text-[#6b7280] dark:text-[#94a3b8] hover:text-[#111827] text-sm font-medium transition-colors">
                Skip for now
              </button>
            )}
            {currentStep < 3 ? (
              <button
                onClick={handleNextStep}
                disabled={currentStep === 1 && !requiredFieldsFilled}
                className="bg-[#3b82f6] text-white font-medium rounded-lg px-6 py-2 hover:bg-[#2563eb] transition-colors disabled:bg-[#e5e7eb] disabled:text-[#9ca3af] disabled:cursor-not-allowed flex items-center gap-2"
              >
                {currentStep === 1 ? "Next: Add Zones" : "Next: Review"}
                <ChevronRight className="size-4" />
              </button>
            ) : (
              <button
                onClick={handleCreateSite}
                disabled={isCreating}
                className="bg-[#3b82f6] text-white font-medium rounded-lg px-8 py-2.5 hover:bg-[#2563eb] transition-colors disabled:bg-[#e5e7eb] disabled:text-[#9ca3af] disabled:cursor-not-allowed flex items-center gap-2 text-base"
              >
                {isCreating ? <><Loader2 className="size-4 animate-spin" /> Creating...</> : "Create Site"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Dialog */}
      {showCancelDialog && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowCancelDialog(false)} />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-[#0f1f35] border border-transparent dark:border-[rgba(59,130,246,0.15)] rounded-lg w-full max-w-md z-50 p-6">
            <h3 className="font-semibold text-[#111827] dark:text-[#e8eef5] text-lg mb-2">Cancel Site Creation?</h3>
            <p className="text-sm text-[#6b7280] dark:text-[#94a3b8] mb-6">Are you sure you want to cancel? All unsaved changes will be lost.</p>
            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setShowCancelDialog(false)} className="border border-[#e5e7eb] text-[#111827] dark:text-[#e8eef5] font-medium rounded-lg px-4 py-2 hover:bg-[#eff6ff] transition-colors">Keep Editing</button>
              <button onClick={confirmCancel} className="bg-[#ef4444] text-white font-medium rounded-lg px-4 py-2 hover:bg-[#dc2626] transition-colors">Yes, Cancel</button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

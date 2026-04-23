import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Plus, X, Edit, Info, Check, ChevronRight, ChevronLeft, Loader2, Trash2 } from "lucide-react";

interface ZoneFormData {
  id: string;
  zoneName: string;
  zoneType: string;
  policyTemplate: string;
  capacity: string;
  parkingLots: string;
  geometryMethod: "draw" | "import";
  status: string;
  isCollapsed: boolean;
}

type Step = 1 | 2 | 3;

export default function CreateSite() {
  const navigate = useNavigate();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [completedSteps, setCompletedSteps] = useState<Step[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const [siteData, setSiteData] = useState({
    siteName: "",
    siteType: "",
    timezone: "",
    address: "",
    geoLat: "",
    geoLon: "",
    note: "",
    status: "Active"
  });

  const [zones, setZones] = useState<ZoneFormData[]>([]);

  const handleSiteDataChange = (field: string, value: string) => {
    setSiteData({ ...siteData, [field]: value });
  };

  const addZone = () => {
    if (zones.length >= 10) return;
    const newZone: ZoneFormData = {
      id: `zone-${Date.now()}`,
      zoneName: "",
      zoneType: "",
      policyTemplate: "",
      capacity: "",
      parkingLots: "",
      geometryMethod: "draw",
      status: "Active",
      isCollapsed: false
    };
    setZones([...zones, newZone]);
  };

  const removeZone = (id: string) => {
    setZones(zones.filter(z => z.id !== id));
  };

  const updateZone = (id: string, field: keyof ZoneFormData, value: any) => {
    setZones(zones.map(z => z.id === id ? { ...z, [field]: value } : z));
  };

  const toggleZoneCollapse = (id: string) => {
    setZones(zones.map(z => z.id === id ? { ...z, isCollapsed: !z.isCollapsed } : z));
  };

  const handleCancel = () => {
    setShowCancelDialog(true);
  };

  const confirmCancel = () => {
    navigate("/management/sites");
  };

  const handleNextStep = () => {
    if (currentStep === 1 && requiredFieldsFilled) {
      setCompletedSteps([...completedSteps, 1]);
      setCurrentStep(2);
      // Add first zone automatically if none exist
      if (zones.length === 0) {
        addZone();
      }
    } else if (currentStep === 2) {
      setCompletedSteps([...completedSteps, 2]);
      setCurrentStep(3);
    }
  };

  const handleBackStep = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step);
    }
  };

  const handleStepClick = (step: Step) => {
    if (completedSteps.includes(step) || step < currentStep) {
      setCurrentStep(step);
    }
  };

  const handleSkipZones = () => {
    setCompletedSteps([...completedSteps, 2]);
    setCurrentStep(3);
  };

  const handleCreateSite = async () => {
    setIsCreating(true);
    // Simulate creation delay
    setTimeout(() => {
      navigate("/management/sites/1");
      // TODO: Show toast "Site created successfully! 🎉"
    }, 1000);
  };

  const requiredFieldsFilled = siteData.siteName && siteData.siteType && siteData.timezone;
  const totalCapacity = zones.reduce((sum, zone) => sum + (parseInt(zone.capacity) || 0), 0);

  const totalFields = 7;
  const filledFields = [
    siteData.siteName,
    siteData.siteType,
    siteData.timezone,
    siteData.address,
    siteData.geoLat,
    siteData.geoLon,
    siteData.note
  ].filter(Boolean).length;
  const completionPercentage = Math.round((filledFields / totalFields) * 100);

  const zoneIsComplete = (zone: ZoneFormData) => {
    return zone.zoneName && zone.zoneType;
  };

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

        {/* Stepper Bar */}
        <div className="px-8 mb-6">
          <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6">
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              {/* Step 1 */}
              <div className="flex flex-col items-center flex-1">
                <button
                  onClick={() => handleStepClick(1)}
                  disabled={!completedSteps.includes(1) && currentStep !== 1}
                  className={`size-10 rounded-full flex items-center justify-center font-semibold text-sm mb-2 transition-colors ${
                    currentStep === 1
                      ? "bg-[#2563eb] text-white"
                      : completedSteps.includes(1)
                      ? "bg-[#2563eb] text-white cursor-pointer hover:bg-[#1d4ed8]"
                      : "border-2 border-[#d1d5db] text-[#9ca3af] cursor-not-allowed"
                  }`}
                >
                  {completedSteps.includes(1) ? <Check className="size-5" /> : "1"}
                </button>
                <span className={`text-sm font-medium ${
                  currentStep === 1 || completedSteps.includes(1)
                    ? "text-[#111827] dark:text-[#e8eef5]"
                    : "text-[#9ca3af]"
                }`}>
                  Site Info
                </span>
              </div>

              {/* Connector 1-2 */}
              <div className="flex-1 h-0.5 -mt-6 mx-4">
                <div className={`h-full ${
                  completedSteps.includes(1) ? "bg-[#2563eb]" : "border-t-2 border-dashed border-[#d1d5db]"
                }`} />
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center flex-1">
                <button
                  onClick={() => handleStepClick(2)}
                  disabled={!completedSteps.includes(1) && currentStep < 2}
                  className={`size-10 rounded-full flex items-center justify-center font-semibold text-sm mb-2 transition-colors ${
                    currentStep === 2
                      ? "bg-[#2563eb] text-white"
                      : completedSteps.includes(2)
                      ? "bg-[#2563eb] text-white cursor-pointer hover:bg-[#1d4ed8]"
                      : "border-2 border-[#d1d5db] text-[#9ca3af] cursor-not-allowed"
                  }`}
                >
                  {completedSteps.includes(2) ? <Check className="size-5" /> : "2"}
                </button>
                <span className={`text-sm font-medium ${
                  currentStep === 2 || completedSteps.includes(2)
                    ? "text-[#111827] dark:text-[#e8eef5]"
                    : "text-[#9ca3af]"
                }`}>
                  Add Zones
                </span>
              </div>

              {/* Connector 2-3 */}
              <div className="flex-1 h-0.5 -mt-6 mx-4">
                <div className={`h-full ${
                  completedSteps.includes(2) ? "bg-[#2563eb]" : "border-t-2 border-dashed border-[#d1d5db]"
                }`} />
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center flex-1">
                <button
                  onClick={() => handleStepClick(3)}
                  disabled={!completedSteps.includes(2) && currentStep < 3}
                  className={`size-10 rounded-full flex items-center justify-center font-semibold text-sm mb-2 transition-colors ${
                    currentStep === 3
                      ? "bg-[#2563eb] text-white"
                      : "border-2 border-[#d1d5db] text-[#9ca3af] cursor-not-allowed"
                  }`}
                >
                  3
                </button>
                <span className={`text-sm font-medium ${
                  currentStep === 3 ? "text-[#111827] dark:text-[#e8eef5]" : "text-[#9ca3af]"
                }`}>
                  Review
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Based on Step */}
        <div className="px-8">
          <div className="grid grid-cols-5 gap-6">
            {/* Left Column */}
            <div className="col-span-3 space-y-6">
              {/* Step 1: Site Info */}
              {currentStep === 1 && (
                <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6">
                  <h2 className="font-semibold text-[#111827] dark:text-[#e8eef5] text-lg mb-6">
                    Site Information
                  </h2>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-[#111827] dark:text-[#e8eef5] mb-2">
                        Site Name <span className="text-[#ef4444]">*</span>
                      </label>
                      <input
                        type="text"
                        value={siteData.siteName}
                        onChange={(e) => handleSiteDataChange('siteName', e.target.value)}
                        placeholder="Enter site name"
                        className="w-full bg-white dark:bg-[#1a2d47] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg px-4 py-2 text-sm text-[#111827] dark:text-[#e8eef5] placeholder:text-[#6b7280] dark:placeholder:text-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#111827] dark:text-[#e8eef5] mb-2">
                        Site Type <span className="text-[#ef4444]">*</span>
                      </label>
                      <select
                        value={siteData.siteType}
                        onChange={(e) => handleSiteDataChange('siteType', e.target.value)}
                        className="w-full bg-white dark:bg-[#1a2d47] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg px-4 py-2 text-sm text-[#111827] dark:text-[#e8eef5] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
                      >
                        <option value="">Select type</option>
                        <option value="University Campus">University Campus</option>
                        <option value="Shopping Mall">Shopping Mall</option>
                        <option value="Office Complex">Office Complex</option>
                        <option value="Public Street">Public Street</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#111827] dark:text-[#e8eef5] mb-2">
                        Timezone <span className="text-[#ef4444]">*</span>
                      </label>
                      <select
                        value={siteData.timezone}
                        onChange={(e) => handleSiteDataChange('timezone', e.target.value)}
                        className="w-full bg-white dark:bg-[#1a2d47] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg px-4 py-2 text-sm text-[#111827] dark:text-[#e8eef5] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
                      >
                        <option value="">Select timezone</option>
                        <option value="PST">PST (Pacific Standard Time)</option>
                        <option value="MST">MST (Mountain Standard Time)</option>
                        <option value="CST">CST (Central Standard Time)</option>
                        <option value="EST">EST (Eastern Standard Time)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#111827] dark:text-[#e8eef5] mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        value={siteData.address}
                        onChange={(e) => handleSiteDataChange('address', e.target.value)}
                        placeholder="Enter address"
                        className="w-full bg-white dark:bg-[#1a2d47] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg px-4 py-2 text-sm text-[#111827] dark:text-[#e8eef5] placeholder:text-[#6b7280] dark:placeholder:text-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#111827] dark:text-[#e8eef5] mb-2">
                          Latitude
                        </label>
                        <input
                          type="text"
                          value={siteData.geoLat}
                          onChange={(e) => handleSiteDataChange('geoLat', e.target.value)}
                          placeholder="0.0000"
                          className="w-full bg-white dark:bg-[#1a2d47] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg px-4 py-2 text-sm text-[#111827] dark:text-[#e8eef5] placeholder:text-[#6b7280] dark:placeholder:text-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#111827] dark:text-[#e8eef5] mb-2">
                          Longitude
                        </label>
                        <input
                          type="text"
                          value={siteData.geoLon}
                          onChange={(e) => handleSiteDataChange('geoLon', e.target.value)}
                          placeholder="0.0000"
                          className="w-full bg-white dark:bg-[#1a2d47] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg px-4 py-2 text-sm text-[#111827] dark:text-[#e8eef5] placeholder:text-[#6b7280] dark:placeholder:text-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#111827] dark:text-[#e8eef5] mb-2">
                        Note
                      </label>
                      <textarea
                        value={siteData.note}
                        onChange={(e) => handleSiteDataChange('note', e.target.value)}
                        placeholder="Add notes"
                        rows={3}
                        className="w-full bg-white dark:bg-[#1a2d47] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg px-4 py-2 text-sm text-[#111827] dark:text-[#e8eef5] placeholder:text-[#6b7280] dark:placeholder:text-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#111827] dark:text-[#e8eef5] mb-2">
                        Status
                      </label>
                      <select
                        value={siteData.status}
                        onChange={(e) => handleSiteDataChange('status', e.target.value)}
                        className="w-full bg-white dark:bg-[#1a2d47] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg px-4 py-2 text-sm text-[#111827] dark:text-[#e8eef5] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
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
                        <span className="text-sm font-medium text-[#6b7280] dark:text-[#94a3b8]">
                          Zone {index + 1}
                        </span>
                        {zones.length > 1 && (
                          <button
                            onClick={() => removeZone(zone.id)}
                            className="text-sm text-[#ef4444] hover:text-[#dc2626] transition-colors flex items-center gap-1"
                          >
                            <Trash2 className="size-3.5" />
                            Remove
                          </button>
                        )}
                      </div>

                      {zone.isCollapsed && zoneIsComplete(zone) ? (
                        <div className="flex items-center justify-between py-2">
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-[#111827] dark:text-[#e8eef5]">{zone.zoneName}</span>
                            <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">• {zone.zoneType}</span>
                            {zone.capacity && <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">• {zone.capacity} capacity</span>}
                          </div>
                          <button
                            onClick={() => toggleZoneCollapse(zone.id)}
                            className="p-1.5 hover:bg-[#eff6ff] dark:hover:bg-[rgba(30,58,95,0.3)] rounded transition-colors"
                          >
                            <Edit className="size-4 text-[#6b7280] dark:text-[#94a3b8]" />
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-5">
                          <div>
                            <label className="block text-sm font-medium text-[#111827] dark:text-[#e8eef5] mb-2">
                              Zone Name <span className="text-[#ef4444]">*</span>
                            </label>
                            <input
                              type="text"
                              value={zone.zoneName}
                              onChange={(e) => updateZone(zone.id, 'zoneName', e.target.value)}
                              placeholder="e.g. Lot 2 — Permit A (North)"
                              className="w-full bg-white dark:bg-[#1a2d47] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg px-4 py-2 text-sm text-[#111827] dark:text-[#e8eef5] placeholder:text-[#6b7280] dark:placeholder:text-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-[#111827] dark:text-[#e8eef5] mb-2">
                              Zone Type <span className="text-[#ef4444]">*</span>
                            </label>
                            <select
                              value={zone.zoneType}
                              onChange={(e) => updateZone(zone.id, 'zoneType', e.target.value)}
                              className="w-full bg-white dark:bg-[#1a2d47] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg px-4 py-2 text-sm text-[#111827] dark:text-[#e8eef5] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
                            >
                              <option value="">Select type</option>
                              <option value="Curb Segment">Curb Segment</option>
                              <option value="Surface Lot Zone">Surface Lot Zone</option>
                              <option value="Structure Level & Aisle">Structure Level & Aisle</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-[#111827] dark:text-[#e8eef5] mb-2">
                              Policy Template
                            </label>
                            <select
                              value={zone.policyTemplate}
                              onChange={(e) => updateZone(zone.id, 'policyTemplate', e.target.value)}
                              className="w-full bg-white dark:bg-[#1a2d47] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg px-4 py-2 text-sm text-[#111827] dark:text-[#e8eef5] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
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

                          <div>
                            <label className="block text-sm font-medium text-[#111827] dark:text-[#e8eef5] mb-2">
                              Capacity
                            </label>
                            <input
                              type="number"
                              value={zone.capacity}
                              onChange={(e) => updateZone(zone.id, 'capacity', e.target.value)}
                              placeholder="0"
                              className="w-full bg-white dark:bg-[#1a2d47] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg px-4 py-2 text-sm text-[#111827] dark:text-[#e8eef5] placeholder:text-[#6b7280] dark:placeholder:text-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-[#111827] dark:text-[#e8eef5] mb-2">
                              Parking Lots
                            </label>
                            <input
                              type="number"
                              value={zone.parkingLots}
                              onChange={(e) => updateZone(zone.id, 'parkingLots', e.target.value)}
                              placeholder="0"
                              className="w-full bg-white dark:bg-[#1a2d47] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg px-4 py-2 text-sm text-[#111827] dark:text-[#e8eef5] placeholder:text-[#6b7280] dark:placeholder:text-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-[#111827] dark:text-[#e8eef5] mb-2">
                              Geometry
                            </label>
                            <div className="border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg overflow-hidden">
                              <div className="flex border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
                                <button
                                  type="button"
                                  onClick={() => updateZone(zone.id, 'geometryMethod', 'draw')}
                                  className={`flex-1 px-4 py-2 text-sm transition-colors ${
                                    zone.geometryMethod === "draw"
                                      ? "bg-white dark:bg-[#0f1f35] text-[#3b82f6] border-b-2 border-[#3b82f6]"
                                      : "bg-[#eff6ff] dark:bg-[#1a2d47] text-[#6b7280] dark:text-[#94a3b8]"
                                  }`}
                                >
                                  Draw on Map
                                </button>
                                <button
                                  type="button"
                                  onClick={() => updateZone(zone.id, 'geometryMethod', 'import')}
                                  className={`flex-1 px-4 py-2 text-sm transition-colors ${
                                    zone.geometryMethod === "import"
                                      ? "bg-white dark:bg-[#0f1f35] text-[#3b82f6] border-b-2 border-[#3b82f6]"
                                      : "bg-[#eff6ff] dark:bg-[#1a2d47] text-[#6b7280] dark:text-[#94a3b8]"
                                  }`}
                                >
                                  Import File
                                </button>
                              </div>
                              <div className="p-4 bg-white dark:bg-[#0f1f35]">
                                {zone.geometryMethod === "draw" ? (
                                  <div className="bg-[#f5f5f5] dark:bg-[#1a2d47] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded h-32 flex items-center justify-center">
                                    <p className="text-sm text-[#6b7280] dark:text-[#94a3b8] text-center px-4">
                                      Click to place points. Min 3 points. Close polygon to finish.
                                    </p>
                                  </div>
                                ) : (
                                  <div className="border-2 border-dashed border-[#e5e7eb] rounded h-32 flex flex-col items-center justify-center gap-2">
                                    <p className="text-sm text-[#6b7280] dark:text-[#94a3b8]">
                                      Drop files here or click to upload
                                    </p>
                                    <p className="text-xs text-[#9ca3af]">
                                      Accepts GeoJSON, CSV, or Shapefile
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-[#111827] dark:text-[#e8eef5] mb-2">
                              Status
                            </label>
                            <select
                              value={zone.status}
                              onChange={(e) => updateZone(zone.id, 'status', e.target.value)}
                              className="w-full bg-white dark:bg-[#1a2d47] border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg px-4 py-2 text-sm text-[#111827] dark:text-[#e8eef5] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
                            >
                              <option value="Active">Active</option>
                              <option value="Inactive">Inactive</option>
                            </select>
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
                  ))}

                  {zones.length < 10 && (
                    <button
                      onClick={addZone}
                      className="border-2 border-dashed border-[#3b82f6] text-[#3b82f6] rounded-lg px-4 py-3 flex items-center justify-center gap-2 text-sm font-medium hover:bg-[#eff6ff] dark:hover:bg-[rgba(30,58,95,0.3)] transition-colors w-full"
                    >
                      <Plus className="size-4" />
                      Add Another Zone
                    </button>
                  )}
                </>
              )}

              {/* Step 3: Review */}
              {currentStep === 3 && (
                <>
                  {/* Site Information Review */}
                  <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-semibold text-[#111827] dark:text-[#e8eef5] text-lg">
                        Site Information
                      </h2>
                      <button
                        onClick={() => setCurrentStep(1)}
                        className="text-sm text-[#3b82f6] hover:text-[#2563eb] transition-colors"
                      >
                        Edit
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-[#6b7280] dark:text-[#94a3b8] mb-1">Site Name</p>
                        <p className="text-sm font-medium text-[#111827] dark:text-[#e8eef5]">{siteData.siteName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#6b7280] dark:text-[#94a3b8] mb-1">Site Type</p>
                        <p className="text-sm font-medium text-[#111827] dark:text-[#e8eef5]">{siteData.siteType}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#6b7280] dark:text-[#94a3b8] mb-1">Timezone</p>
                        <p className="text-sm font-medium text-[#111827] dark:text-[#e8eef5]">{siteData.timezone}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#6b7280] dark:text-[#94a3b8] mb-1">Status</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          siteData.status === "Active"
                            ? "bg-[#d1fae5] text-[#065f46]"
                            : siteData.status === "Inactive"
                            ? "bg-[#fee2e2] text-[#991b1b]"
                            : "bg-[#e5e7eb] text-[#6b7280] dark:text-[#94a3b8]"
                        }`}>
                          {siteData.status}
                        </span>
                      </div>
                      {siteData.address && (
                        <div className="col-span-2">
                          <p className="text-xs text-[#6b7280] dark:text-[#94a3b8] mb-1">Address</p>
                          <p className="text-sm font-medium text-[#111827] dark:text-[#e8eef5]">{siteData.address}</p>
                        </div>
                      )}
                      {(siteData.geoLat || siteData.geoLon) && (
                        <>
                          <div>
                            <p className="text-xs text-[#6b7280] dark:text-[#94a3b8] mb-1">Latitude</p>
                            <p className="text-sm font-medium text-[#111827] dark:text-[#e8eef5]">{siteData.geoLat || '—'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-[#6b7280] dark:text-[#94a3b8] mb-1">Longitude</p>
                            <p className="text-sm font-medium text-[#111827] dark:text-[#e8eef5]">{siteData.geoLon || '—'}</p>
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

                  {/* Zones Review */}
                  <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <h2 className="font-semibold text-[#111827] dark:text-[#e8eef5] text-lg">
                          Zones
                        </h2>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#dbeafe] text-[#1e40af]">
                          {zones.length} {zones.length === 1 ? 'Zone' : 'Zones'}
                        </span>
                      </div>
                      <button
                        onClick={() => setCurrentStep(2)}
                        className="text-sm text-[#3b82f6] hover:text-[#2563eb] transition-colors"
                      >
                        Edit
                      </button>
                    </div>

                    {zones.length === 0 ? (
                      <p className="text-sm text-[#6b7280] dark:text-[#94a3b8]">
                        No zones added. Zones can be added after site creation from the Site Detail page.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {zones.map((zone, index) => (
                          <div key={zone.id} className="border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-[#111827] dark:text-[#e8eef5] mb-1">
                                  Zone {index + 1} — {zone.zoneName || 'Unnamed'}
                                </p>
                                <p className="text-sm text-[#6b7280] dark:text-[#94a3b8]">
                                  {zone.zoneType}
                                  {zone.capacity && ` · ${zone.capacity} capacity`}
                                  {zone.policyTemplate && ` · ${zone.policyTemplate}`}
                                </p>
                              </div>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                zone.status === "Active"
                                  ? "bg-[#d1fae5] text-[#065f46]"
                                  : "bg-[#e5e7eb] text-[#6b7280] dark:text-[#94a3b8]"
                              }`}>
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

            {/* Right Column - Summary */}
            <div className="col-span-2">
              <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6 sticky top-6">
                {currentStep === 3 ? (
                  <>
                    <h2 className="font-semibold text-[#111827] dark:text-[#e8eef5] text-lg mb-6">
                      Ready to Create
                    </h2>

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
                          <span className="text-[#111827] dark:text-[#e8eef5]">{zones.length} {zones.length === 1 ? 'Zone' : 'Zones'} configured</span>
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
                    <h2 className="font-semibold text-[#111827] dark:text-[#e8eef5] text-lg mb-6">
                      Summary
                    </h2>

                    <div className="space-y-4 mb-6">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Site Name</span>
                        <div className="flex items-center gap-2">
                          {siteData.siteName && <Check className="size-4 text-[#10b981]" />}
                          <span className={`text-sm ${siteData.siteName ? 'text-[#111827] dark:text-[#e8eef5] font-medium' : 'text-[#9ca3af]'}`}>
                            {siteData.siteName || '—'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Site Type</span>
                        <div className="flex items-center gap-2">
                          {siteData.siteType && <Check className="size-4 text-[#10b981]" />}
                          <span className={`text-sm ${siteData.siteType ? 'text-[#111827] dark:text-[#e8eef5] font-medium' : 'text-[#9ca3af]'}`}>
                            {siteData.siteType || '—'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Status</span>
                        <div className="flex items-center gap-2">
                          {siteData.status && <Check className="size-4 text-[#10b981]" />}
                          <span className={`text-sm ${siteData.status ? 'text-[#111827] dark:text-[#e8eef5] font-medium' : 'text-[#9ca3af]'}`}>
                            {siteData.status || '—'}
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] pt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Zones Added</span>
                          <span className="text-sm text-[#111827] dark:text-[#e8eef5] font-medium">{zones.length}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Total Capacity</span>
                          <span className="text-sm text-[#111827] dark:text-[#e8eef5] font-medium">{totalCapacity}</span>
                        </div>
                      </div>

                      {currentStep === 2 && zones.length > 0 && (
                        <div className="border-t border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] pt-4">
                          <p className="text-xs text-[#6b7280] dark:text-[#94a3b8] mb-2">Zones:</p>
                          <div className="space-y-1">
                            {zones.map((zone, index) => (
                              <p key={zone.id} className="text-xs text-[#111827] dark:text-[#e8eef5]">
                                {index + 1}. {zone.zoneName || 'Unnamed Zone'}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

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
            {currentStep === 1 ? (
              'Cancel'
            ) : (
              <>
                <ChevronLeft className="size-4" />
                Back
              </>
            )}
          </button>

          <div className="flex items-center gap-3">
            {currentStep === 2 && (
              <button
                onClick={handleSkipZones}
                className="text-[#6b7280] dark:text-[#94a3b8] hover:text-[#111827] dark:text-[#e8eef5] text-sm font-medium transition-colors"
              >
                Skip for now
              </button>
            )}
            {currentStep < 3 ? (
              <button
                onClick={handleNextStep}
                disabled={currentStep === 1 && !requiredFieldsFilled}
                className="bg-[#3b82f6] text-white font-medium rounded-lg px-6 py-2 hover:bg-[#2563eb] transition-colors disabled:bg-[#e5e7eb] disabled:text-[#9ca3af] disabled:cursor-not-allowed flex items-center gap-2"
              >
                {currentStep === 1 ? 'Next: Add Zones' : 'Next: Review'}
                <ChevronRight className="size-4" />
              </button>
            ) : (
              <button
                onClick={handleCreateSite}
                disabled={isCreating}
                className="bg-[#3b82f6] text-white font-medium rounded-lg px-8 py-2.5 hover:bg-[#2563eb] transition-colors disabled:bg-[#e5e7eb] disabled:text-[#9ca3af] disabled:cursor-not-allowed flex items-center gap-2 text-base"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Site'
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      {showCancelDialog && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setShowCancelDialog(false)}
          />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-[#0f1f35] border border-transparent dark:border-[rgba(59,130,246,0.15)] rounded-lg w-full max-w-md z-50 p-6">
            <h3 className="font-semibold text-[#111827] dark:text-[#e8eef5] text-lg mb-2">
              Cancel Site Creation?
            </h3>
            <p className="text-sm text-[#6b7280] dark:text-[#94a3b8] mb-6">
              Are you sure you want to cancel? All unsaved changes will be lost.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowCancelDialog(false)}
                className="border border-[#e5e7eb] text-[#111827] dark:text-[#e8eef5] font-medium rounded-lg px-4 py-2 hover:bg-[#eff6ff] dark:hover:bg-[rgba(30,58,95,0.3)] transition-colors"
              >
                Keep Editing
              </button>
              <button
                onClick={confirmCancel}
                className="bg-[#ef4444] text-white font-medium rounded-lg px-4 py-2 hover:bg-[#dc2626] transition-colors"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

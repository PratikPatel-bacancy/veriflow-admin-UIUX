export type DeviceType   = "LPR Camera" | "Controller";
export type DeviceStatus = "Online" | "Offline" | "Unreachable" | "Disabled";

export interface Device {
  id: number;
  name: string;
  type: DeviceType;
  mountPosition?: string;
  serial: string;
  mac: string;
  firmware: string;
  vehicleId: number;
  vehicleName: string;
  site: string;
  status: DeviceStatus;
  lastSeen: string;
}

export const MOCK_DEVICES: Device[] = [
  // ── Unit-047 · Online · Pacific Plaza Garage ──────────────────────────────
  { id: 1,  name: "OnLogic K410",  type: "Controller", serial: "K410-SN-00291", mac: "AA:BB:CC:10:20:30", firmware: "v4.2.1", vehicleId: 1, vehicleName: "Unit-047", site: "Pacific Plaza Garage",                 status: "Online",      lastSeen: "Just now"    },
  { id: 2,  name: "Lynet M504-01", type: "LPR Camera", mountPosition: "Front", serial: "CAM-SN-0091",  mac: "AA:BB:CC:01:02:03", firmware: "v3.1.4", vehicleId: 1, vehicleName: "Unit-047", site: "Pacific Plaza Garage",                 status: "Online",      lastSeen: "Just now"    },
  { id: 3,  name: "Lynet M504-02", type: "LPR Camera", mountPosition: "Rear",  serial: "CAM-SN-0092",  mac: "AA:BB:CC:01:02:04", firmware: "v3.1.4", vehicleId: 1, vehicleName: "Unit-047", site: "Pacific Plaza Garage",                 status: "Online",      lastSeen: "Just now"    },
  { id: 4,  name: "Lynet M504-03", type: "LPR Camera", mountPosition: "Left",  serial: "CAM-SN-0093",  mac: "AA:BB:CC:01:02:05", firmware: "v3.0.9", vehicleId: 1, vehicleName: "Unit-047", site: "Pacific Plaza Garage",                 status: "Online",      lastSeen: "Just now"    },
  { id: 5,  name: "Lynet M504-04", type: "LPR Camera", mountPosition: "Right", serial: "CAM-SN-0094",  mac: "AA:BB:CC:01:02:06", firmware: "v3.1.4", vehicleId: 1, vehicleName: "Unit-047", site: "Pacific Plaza Garage",                 status: "Disabled",    lastSeen: "Just now"    },

  // ── Unit-012 · Online · CF Pacific Centre ─────────────────────────────────
  { id: 6,  name: "OnLogic K300",  type: "Controller", serial: "K300-SN-00212", mac: "AA:BB:CC:20:30:40", firmware: "v4.2.1", vehicleId: 2, vehicleName: "Unit-012", site: "CF Pacific Centre",                    status: "Online",      lastSeen: "5 min ago"   },
  { id: 7,  name: "Lynet M504-01", type: "LPR Camera", mountPosition: "Front", serial: "CAM-SN-0121",  mac: "AA:BB:CC:02:03:04", firmware: "v3.1.4", vehicleId: 2, vehicleName: "Unit-012", site: "CF Pacific Centre",                    status: "Online",      lastSeen: "5 min ago"   },
  { id: 8,  name: "Lynet M504-02", type: "LPR Camera", mountPosition: "Rear",  serial: "CAM-SN-0122",  mac: "AA:BB:CC:02:03:05", firmware: "v3.1.4", vehicleId: 2, vehicleName: "Unit-012", site: "CF Pacific Centre",                    status: "Online",      lastSeen: "5 min ago"   },
  { id: 9,  name: "Lynet M504-03", type: "LPR Camera", mountPosition: "Left",  serial: "CAM-SN-0123",  mac: "AA:BB:CC:02:03:06", firmware: "v3.1.4", vehicleId: 2, vehicleName: "Unit-012", site: "CF Pacific Centre",                    status: "Online",      lastSeen: "5 min ago"   },

  // ── Unit-033 · Offline · Heritage Harbor Parking ──────────────────────────
  { id: 10, name: "OnLogic K300",  type: "Controller", serial: "K300-SN-00333", mac: "AA:BB:CC:30:40:50", firmware: "v4.1.0", vehicleId: 3, vehicleName: "Unit-033", site: "Heritage Harbor Parking",              status: "Offline",     lastSeen: "2 hrs ago"   },
  { id: 11, name: "Lynet M504-01", type: "LPR Camera", mountPosition: "Front", serial: "CAM-SN-0331",  mac: "AA:BB:CC:03:04:05", firmware: "v3.0.9", vehicleId: 3, vehicleName: "Unit-033", site: "Heritage Harbor Parking",              status: "Offline",     lastSeen: "2 hrs ago"   },
  { id: 12, name: "Lynet M504-02", type: "LPR Camera", mountPosition: "Rear",  serial: "CAM-SN-0332",  mac: "AA:BB:CC:03:04:06", firmware: "v3.0.9", vehicleId: 3, vehicleName: "Unit-033", site: "Heritage Harbor Parking",              status: "Offline",     lastSeen: "2 hrs ago"   },

  // ── Unit-021 · Unreachable · Pacific Plaza Garage ─────────────────────────
  { id: 13, name: "OnLogic K300",  type: "Controller", serial: "K300-SN-00221", mac: "AA:BB:CC:40:50:60", firmware: "v4.0.2", vehicleId: 4, vehicleName: "Unit-021", site: "Pacific Plaza Garage",                 status: "Unreachable", lastSeen: "1 day ago"   },
  { id: 14, name: "Lynet M504-01", type: "LPR Camera", mountPosition: "Front", serial: "CAM-SN-0211",  mac: "AA:BB:CC:04:05:06", firmware: "v3.1.4", vehicleId: 4, vehicleName: "Unit-021", site: "Pacific Plaza Garage",                 status: "Unreachable", lastSeen: "1 day ago"   },
  { id: 15, name: "Lynet M504-02", type: "LPR Camera", mountPosition: "Rear",  serial: "CAM-SN-0212",  mac: "AA:BB:CC:04:05:07", firmware: "v3.1.4", vehicleId: 4, vehicleName: "Unit-021", site: "Pacific Plaza Garage",                 status: "Unreachable", lastSeen: "1 day ago"   },
  { id: 16, name: "Lynet M504-03", type: "LPR Camera", mountPosition: "Left",  serial: "CAM-SN-0213",  mac: "AA:BB:CC:04:05:08", firmware: "v3.1.4", vehicleId: 4, vehicleName: "Unit-021", site: "Pacific Plaza Garage",                 status: "Unreachable", lastSeen: "1 day ago"   },
  { id: 17, name: "Lynet M504-04", type: "LPR Camera", mountPosition: "Right", serial: "CAM-SN-0214",  mac: "AA:BB:CC:04:05:09", firmware: "v3.1.4", vehicleId: 4, vehicleName: "Unit-021", site: "Pacific Plaza Garage",                 status: "Unreachable", lastSeen: "1 day ago"   },

  // ── Unit-009 · Online · 875 Garnet Pacific Beach Parking ─────────────────
  { id: 18, name: "OnLogic K300",  type: "Controller", serial: "K300-SN-00091", mac: "AA:BB:CC:50:60:70", firmware: "v4.2.1", vehicleId: 5, vehicleName: "Unit-009", site: "875 Garnet Pacific Beach Parking",    status: "Online",      lastSeen: "12 min ago"  },
  { id: 19, name: "Lynet M504-01", type: "LPR Camera", mountPosition: "Front", serial: "CAM-SN-0911",  mac: "AA:BB:CC:05:06:07", firmware: "v3.1.4", vehicleId: 5, vehicleName: "Unit-009", site: "875 Garnet Pacific Beach Parking",    status: "Online",      lastSeen: "12 min ago"  },

  // ── Unit-055 · Offline · Pan Pacific Park Parking (no cameras yet) ────────
  { id: 20, name: "OnLogic K300",  type: "Controller", serial: "K300-SN-00551", mac: "AA:BB:CC:60:70:80", firmware: "v4.2.1", vehicleId: 6, vehicleName: "Unit-055", site: "Pan Pacific Park Parking",             status: "Offline",     lastSeen: "Never"       },

  // ── Unit-003 · Offline · CF Pacific Centre (Decommissioned) ──────────────
  { id: 21, name: "OnLogic K300",  type: "Controller", serial: "K300-SN-00031", mac: "AA:BB:CC:70:80:90", firmware: "v3.9.0", vehicleId: 7, vehicleName: "Unit-003", site: "CF Pacific Centre",                    status: "Offline",     lastSeen: "30 days ago" },
  { id: 22, name: "Lynet M504-01", type: "LPR Camera", mountPosition: "Front", serial: "CAM-SN-0031",  mac: "AA:BB:CC:07:08:09", firmware: "v3.0.1", vehicleId: 7, vehicleName: "Unit-003", site: "CF Pacific Centre",                    status: "Offline",     lastSeen: "30 days ago" },
  { id: 23, name: "Lynet M504-02", type: "LPR Camera", mountPosition: "Rear",  serial: "CAM-SN-0032",  mac: "AA:BB:CC:07:08:10", firmware: "v3.0.1", vehicleId: 7, vehicleName: "Unit-003", site: "CF Pacific Centre",                    status: "Offline",     lastSeen: "30 days ago" },
  { id: 24, name: "Lynet M504-03", type: "LPR Camera", mountPosition: "Left",  serial: "CAM-SN-0033",  mac: "AA:BB:CC:07:08:11", firmware: "v3.0.1", vehicleId: 7, vehicleName: "Unit-003", site: "CF Pacific Centre",                    status: "Offline",     lastSeen: "30 days ago" },
];

export const CURRENT_FW: Record<DeviceType, string> = {
  "LPR Camera": "v3.1.4",
  "Controller": "v4.2.1",
};

// ─── Shared TypeScript interfaces ─────────────────────────────────────────────
// These mirror PostgreSQL table columns exactly.
// When Node.js API is ready, just swap the mock imports in services/index.ts.

export type Platform   = 'uber' | 'bolt' | 'yango' | 'careem';
export type CarStatus  = 'on_trip' | 'waiting' | 'offline' | 'break' | 'maintenance';
export type RiskLevel  = 'low' | 'medium' | 'high';
export type ScoreClass = 'top_performer' | 'acceptable' | 'underperformer' | 'critical_review';
export type AlertSeverity = 'critical' | 'warning' | 'info';
export type FleetDecision = 'keep' | 'rotate' | 'repair' | 'replace' | 'sell';
export type HealthStatus  = 'ok' | 'due_soon' | 'overdue';

export interface LatLng { lat: number; lng: number }

// ── Driver ────────────────────────────────────────────────────────────────────
export interface Driver {
  id: string;
  name: string;
  phone: string;
  licenseNo: string;
  licenseExpiry: string;         // ISO date
  carId: string;
  platform: Platform;
  // Live
  status: CarStatus;
  loginTime: string;             // ISO datetime (Dubai)
  tripsCompleted: number;        // today
  currentTripStatus: 'picking_up' | 'on_way' | 'arrived' | null;
  lastTripTime: string;
  idleMinutes: number;
  revenueToday: number;          // AED
  acceptanceRate: number;        // 0–100
  cancellationRate: number;      // 0–100
  customerRating: number;        // 1.0–5.0
  lastGpsPing: string;           // ISO datetime
  alertStatus: 'normal' | 'warning' | 'critical';
  currentZone: string;
  location: LatLng;
  // Performance (weekly aggregates)
  weeklyRevenue: number;
  tripsPerShift: number;
  revenuePerOnlineHour: number;
  avgTripValue: number;
  idleTimePct: number;           // 0–100
  peakHourUtilization: number;   // 0–100
  onlineDiscipline: number;      // 0–100
  cashCollectionMismatch: number;// AED
  customerComplaints: number;    // last 30 days
  driverScore: number;           // 0–100
  scoreClass: ScoreClass;
  riskLevel: RiskLevel;
  fraudReasons: string[];
}

// ── Car ───────────────────────────────────────────────────────────────────────
export interface Car {
  id: string;
  plateNumber: string;
  make: string;
  model: string;
  year: number;
  color: string;
  driverId: string;
  platform: Platform;
  // Live
  status: CarStatus;
  revenueToday: number;
  tripsToday: number;
  idleMinutes: number;
  lastActivity: string;          // ISO datetime
  currentZone: string;
  location: LatLng;
  alertStatus: 'normal' | 'warning' | 'critical';
  // Fleet health
  activeDays: number;
  maintenanceDue: string;        // ISO date
  tireChangeDue: string;
  insuranceExpiry: string;
  registrationExpiry: string;
  accidentHistory: number;
  downtimeDays: number;
  revenueLast30Days: number;
  netProfitLast30Days: number;
  fleetDecision: FleetDecision;
}

// ── Alert ─────────────────────────────────────────────────────────────────────
export interface Alert {
  id: string;
  severity: AlertSeverity;
  time: string;                  // ISO datetime
  driverId: string;
  driverName: string;
  carId: string;
  carPlate: string;
  issue: string;
  recommendedAction: string;
  status: 'open' | 'acknowledged' | 'resolved';
}

// ── Revenue ───────────────────────────────────────────────────────────────────
export interface RevenueRow {
  id: string;
  carPlate: string;
  driverName: string;
  platform: Platform;
  shift: 'morning' | 'evening' | 'night';
  date: string;
  grossRevenue: number;
  platformCommission: number;
  driverPayout: number;
  fuelCost: number;
  salikTolls: number;
  parking: number;
  leaseEmi: number;
  insuranceAlloc: number;
  maintenanceReserve: number;
  netContribution: number;
}

// ── Leakage / Fraud ───────────────────────────────────────────────────────────
export interface LeakageRecord {
  driverId: string;
  driverName: string;
  carPlate: string;
  platform: Platform;
  riskLevel: RiskLevel;
  riskScore: number;             // 0–100 (higher = more risk)
  patterns: string[];
  onlineHours: number;
  expectedTrips: number;
  actualTrips: number;
  revenueDiff: number;           // % vs peer average (negative = below)
  cashMismatch: number;          // AED
  peakIdleEvents: number;
  gpsWithoutTrips: number;       // occurrences last 7 days
}

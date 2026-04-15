/**
 * Service layer — all functions return Promises.
 * To connect to the real Node.js / PostgreSQL API, replace each function body with:
 *   return fetch(`${import.meta.env.VITE_API_BASE_URL}/endpoint`).then(r => r.json());
 *
 * No changes needed in the pages/components.
 */

import { mockDrivers, mockCars, mockAlerts, mockRevenue } from '../data';
import type { Driver, Car, Alert, LeakageRecord } from '../data/types';

const delay = <T>(data: T): Promise<T> =>
  new Promise((res) => setTimeout(() => res(data), 250)); // simulate network

// ── Drivers ───────────────────────────────────────────────────────────────────
export const driverService = {
  getAll:   ()              => delay(mockDrivers),
  getById:  (id: string)    => delay(mockDrivers.find((d) => d.id === id) as Driver),
  getLive:  ()              => delay(mockDrivers.filter((d) => d.status !== 'offline')),
};

// ── Cars ──────────────────────────────────────────────────────────────────────
export const carService = {
  getAll:  ()           => delay(mockCars),
  getById: (id: string) => delay(mockCars.find((c) => c.id === id) as Car),
};

// ── Alerts ────────────────────────────────────────────────────────────────────
export const alertService = {
  getAll:      ()                          => delay([...mockAlerts].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())),
  getOpen:     ()                          => delay(mockAlerts.filter((a) => a.status === 'open')),
  getBySeverity: (sev: Alert['severity'])  => delay(mockAlerts.filter((a) => a.severity === sev)),
};

// ── Revenue ───────────────────────────────────────────────────────────────────
export const revenueService = {
  getAll:       ()                    => delay(mockRevenue),
  getByDate:    (date: string)        => delay(mockRevenue.filter((r) => r.date === date)),
  getByPlatform:(p: string)           => delay(mockRevenue.filter((r) => r.platform === p)),
  getByDriver:  (name: string)        => delay(mockRevenue.filter((r) => r.driverName === name)),
};

// ── Leakage / Fraud ───────────────────────────────────────────────────────────
export const leakageService = {
  getAll: (): Promise<LeakageRecord[]> =>
    delay(
      mockDrivers
        .filter((d) => d.riskLevel !== 'low' || d.fraudReasons.length > 0)
        .map((d) => ({
          driverId:     d.id,
          driverName:   d.name,
          carPlate:     mockCars.find((c) => c.id === d.carId)?.plateNumber ?? '—',
          platform:     d.platform,
          riskLevel:    d.riskLevel,
          riskScore:    d.riskLevel === 'high' ? 75 + Math.floor(Math.random() * 25) :
                        d.riskLevel === 'medium' ? 40 + Math.floor(Math.random() * 35) : 15,
          patterns:     d.fraudReasons,
          onlineHours:  8 + Math.round(Math.random() * 4),
          expectedTrips: 12,
          actualTrips:   d.tripsCompleted,
          revenueDiff:   d.riskLevel === 'high' ? -42 : d.riskLevel === 'medium' ? -22 : -10,
          cashMismatch:  d.cashCollectionMismatch,
          peakIdleEvents: d.riskLevel === 'high' ? 4 : d.riskLevel === 'medium' ? 2 : 0,
          gpsWithoutTrips: d.riskLevel === 'high' ? 3 : 0,
        }))
    ),
  getAllDrivers: (): Promise<LeakageRecord[]> =>
    delay(
      mockDrivers.map((d) => ({
        driverId:     d.id,
        driverName:   d.name,
        carPlate:     mockCars.find((c) => c.id === d.carId)?.plateNumber ?? '—',
        platform:     d.platform,
        riskLevel:    d.riskLevel,
        riskScore:    d.riskLevel === 'high' ? 75 + (d.driverScore < 40 ? 20 : 10) :
                      d.riskLevel === 'medium' ? 45 : 15,
        patterns:     d.fraudReasons,
        onlineHours:  8,
        expectedTrips: 12,
        actualTrips:   d.tripsCompleted,
        revenueDiff:   Math.round(((d.revenueToday - 380) / 380) * 100),
        cashMismatch:  d.cashCollectionMismatch,
        peakIdleEvents: d.idleTimePct > 40 ? 4 : d.idleTimePct > 25 ? 2 : 0,
        gpsWithoutTrips: d.riskLevel === 'high' ? 3 : 0,
      }))
    ),
};

// ── Dashboard KPIs ────────────────────────────────────────────────────────────
export const dashboardService = {
  getKpis: () =>
    delay({
      totalCars:              mockCars.length,
      activeCars:             mockCars.filter((c) => c.status !== 'offline').length,
      offlineCars:            mockCars.filter((c) => c.status === 'offline').length,
      carsOnTrip:             mockCars.filter((c) => c.status === 'on_trip').length,
      carsIdle:               mockCars.filter((c) => c.status === 'waiting').length,
      totalRevenueToday:      mockCars.reduce((s, c) => s + c.revenueToday, 0),
      avgRevenuePerActiveCar: Math.round(
        mockCars.filter((c) => c.status !== 'offline').reduce((s, c) => s + c.revenueToday, 0) /
        mockCars.filter((c) => c.status !== 'offline').length
      ),
      estimatedProfitToday:   Math.round(
        mockRevenue.filter((r) => r.date === new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Dubai' }))
          .reduce((s, r) => s + r.netContribution, 0)
      ),
      driversFlagged:  mockDrivers.filter((d) => d.alertStatus !== 'normal').length,
      suspiciousDrivers: mockDrivers.filter((d) => d.riskLevel === 'high').length,
    }),
};

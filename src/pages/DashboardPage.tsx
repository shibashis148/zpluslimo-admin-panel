import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CarProfile, CurrencyDollar, Warning,
  ShieldWarning, ArrowUp, ArrowDown, ClockCountdown, ArrowSquareOut,
} from '@phosphor-icons/react';
import { dashboardService, carService } from '../services';
import { BoltIcon, UberIcon, YangoIcon, CareemIcon } from '../assets/integrationIcons';
import { fmtCurrency, dubaiFullDateTime } from '../lib/dubai';
import type { Car } from '../data/types';

const PLATFORM_ICONS: Record<string, React.ComponentType<{size?:number}>> = {
  uber: UberIcon, bolt: BoltIcon, yango: YangoIcon, careem: CareemIcon,
};

const STATUS_STYLE: Record<string, { dot: string; badge: string; label: string }> = {
  on_trip:     { dot: 'bg-blue-500',    badge: 'bg-blue-50 text-blue-700 border-blue-200',    label: 'On Trip'     },
  waiting:     { dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Waiting' },
  break:       { dot: 'bg-amber-400',   badge: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Break'       },
  offline:     { dot: 'bg-gray-400',    badge: 'bg-gray-100 text-gray-500 border-gray-200',   label: 'Offline'     },
  maintenance: { dot: 'bg-red-500',     badge: 'bg-red-50 text-red-700 border-red-200',       label: 'Maintenance' },
};

const ALERT_ROW: Record<string, string> = {
  normal:   '',
  warning:  'bg-amber-50/60',
  critical: 'bg-red-50/60',
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const [kpis, setKpis] = useState<Awaited<ReturnType<typeof dashboardService.getKpis>> | null>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const now = new Date();

  useEffect(() => {
    Promise.all([dashboardService.getKpis(), carService.getAll()])
      .then(([k, c]) => { setKpis(k); setCars(c); })
      .finally(() => setLoading(false));
  }, []);

  const KPI_CARDS = kpis ? [
    { label: 'Total Cars',              value: kpis.totalCars,              icon: CarProfile,       bg: 'bg-slate-100',   color: 'text-slate-600',   change: null },
    { label: 'Active Cars',             value: kpis.activeCars,             icon: CarProfile,       bg: 'bg-emerald-50',  color: 'text-emerald-600', change: '+2' },
    { label: 'Offline Cars',            value: kpis.offlineCars,            icon: CarProfile,       bg: 'bg-gray-100',    color: 'text-gray-500',    change: null },
    { label: 'Cars on Trip',            value: kpis.carsOnTrip,             icon: CarProfile,       bg: 'bg-blue-50',     color: 'text-blue-600',    change: null },
    { label: 'Cars Idle',               value: kpis.carsIdle,               icon: ClockCountdown,   bg: 'bg-amber-50',    color: 'text-amber-600',   change: '-1' },
    { label: "Today's Revenue",         value: fmtCurrency(kpis.totalRevenueToday), icon: CurrencyDollar, bg: 'bg-purple-50', color: 'text-purple-600', change: '+8%' },
    { label: 'Avg Revenue / Active Car',value: fmtCurrency(kpis.avgRevenuePerActiveCar), icon: CurrencyDollar, bg: 'bg-indigo-50', color: 'text-indigo-600', change: null },
    { label: 'Est. Profit Today',       value: fmtCurrency(kpis.estimatedProfitToday), icon: CurrencyDollar, bg: 'bg-teal-50',  color: 'text-teal-600',  change: '+12%' },
    { label: 'Drivers Flagged',         value: kpis.driversFlagged,         icon: Warning,          bg: 'bg-amber-50',    color: 'text-amber-600',   change: null },
    { label: 'Suspicious Drivers',      value: kpis.suspiciousDrivers,      icon: ShieldWarning,    bg: 'bg-red-50',      color: 'text-red-600',     change: null },
  ] : [];

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <svg className="animate-spin h-8 w-8 text-gold" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
      </svg>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Greeting ── */}
      <div className="lc-card p-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gold/5 to-transparent pointer-events-none rounded-2xl" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-slate-500 text-sm">Control Room — Live Overview</p>
            <h2 className="font-display font-bold text-xl text-slate-800 mt-0.5 text-gradient-gold">
              {dubaiFullDateTime(now.toISOString())}
            </h2>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <ClockCountdown size={13} className="text-gold" /> Dubai Time (GST, UTC+4)
            </p>
          </div>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-semibold self-start sm:self-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> All Systems Live
          </span>
        </div>
      </div>

      {/* ── 10 KPI cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
        {KPI_CARDS.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="lc-card p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl ${k.bg} flex items-center justify-center ${k.color}`}>
                  <Icon size={18} weight="duotone" />
                </div>
                {k.change && (
                  <span className={`flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-full ${k.change.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                    {k.change.startsWith('+') ? <ArrowUp size={10} weight="bold"/> : <ArrowDown size={10} weight="bold"/>}
                    {k.change.replace(/[+-]/, '')}
                  </span>
                )}
              </div>
              <p className="font-display font-bold text-xl text-slate-800 leading-none">{k.value}</p>
              <p className="text-xs text-slate-500 mt-1 leading-tight">{k.label}</p>
            </div>
          );
        })}
      </div>

      {/* ── Live fleet status panel ── */}
      <div className="lc-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="font-semibold text-slate-800">Live Fleet Status</h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block"/>On Trip</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"/>Waiting</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block"/>Break</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-400 inline-block"/>Offline</span>
            </div>
            <button
              onClick={() => navigate('/live-operations?view=table')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-sidebar text-gold border border-gold/30 hover:bg-gold/10 transition-colors"
            >
              <ArrowSquareOut size={13} weight="bold" />
              View All
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                {['Car','Driver','Platform','Status','Revenue Today','Trips','Idle (min)','Last Activity','Zone','Alert'].map((h) => (
                  <th key={h} className="lc-table-header">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => {
                const s = STATUS_STYLE[car.status] ?? STATUS_STYLE.offline;
                const PIcon = PLATFORM_ICONS[car.platform];
                const driver = car.driverId;
                void driver;
                return (
                  <tr key={car.id} className={`lc-table-row ${ALERT_ROW[car.alertStatus]}`}>
                    <td className="lc-table-cell font-mono font-semibold text-slate-800 whitespace-nowrap">{car.plateNumber}</td>
                    <td className="lc-table-cell whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gold/60 to-gold-dark/60 flex items-center justify-center text-white font-bold text-[10px] shrink-0">
                          {car.driverId.replace('DRV', '')}
                        </div>
                        <span className="text-slate-700 text-xs font-medium max-w-[110px] truncate">
                          {/* driver name — resolved via driverId in real API */}
                          {['Omar H.','Samir R.','Muhammad K.','Rajesh S.','Vikram C.','Ahmed A.','Faisal Z.','Ravi N.','Deepak V.','Jamal H.','Suresh P.','Babu T.','Zaid H.','Anil M.','Bilal H.'][parseInt(car.id.replace('CAR',''))-1]}
                        </span>
                      </div>
                    </td>
                    <td className="lc-table-cell">
                      <div className="w-6 h-6 flex items-center justify-center">
                        {PIcon && <PIcon size={18} />}
                      </div>
                    </td>
                    <td className="lc-table-cell whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${s.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                        {s.label}
                      </span>
                    </td>
                    <td className="lc-table-cell font-semibold text-slate-800 whitespace-nowrap">AED {car.revenueToday}</td>
                    <td className="lc-table-cell text-center">{car.tripsToday}</td>
                    <td className="lc-table-cell text-center">
                      <span className={car.idleMinutes > 45 ? 'text-red-500 font-semibold' : car.idleMinutes > 25 ? 'text-amber-600 font-semibold' : 'text-slate-600'}>
                        {car.idleMinutes}
                      </span>
                    </td>
                    <td className="lc-table-cell text-slate-400 text-xs whitespace-nowrap">
                      {new Date(car.lastActivity).toLocaleTimeString('en-AE', { timeZone:'Asia/Dubai', hour:'2-digit', minute:'2-digit', hour12:true })}
                    </td>
                    <td className="lc-table-cell text-slate-500 text-xs whitespace-nowrap max-w-[120px] truncate">{car.currentZone}</td>
                    <td className="lc-table-cell">
                      {car.alertStatus === 'critical' && <span className="lc-badge bg-red-50 text-red-600 border border-red-200">⚠ Critical</span>}
                      {car.alertStatus === 'warning'  && <span className="lc-badge bg-amber-50 text-amber-600 border border-amber-200">⚠ Warning</span>}
                      {car.alertStatus === 'normal'   && <span className="text-emerald-500 text-xs">✓ OK</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Color legend ── */}
      <div className="lc-card p-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Operational Color System</p>
        <div className="flex flex-wrap gap-4">
          {[
            { color: 'bg-emerald-100 border-emerald-300 text-emerald-700', label: '🟢  Green — Healthy / On track' },
            { color: 'bg-amber-100 border-amber-300 text-amber-700',   label: '🟡  Yellow — Below expected / Monitor' },
            { color: 'bg-red-100 border-red-300 text-red-700',         label: '🔴  Red — Action required' },
          ].map((c) => (
            <span key={c.label} className={`text-xs font-medium px-3 py-1.5 rounded-full border ${c.color}`}>
              {c.label}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}

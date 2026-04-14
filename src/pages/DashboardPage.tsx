import {
  CarProfile,
  Users,
  CurrencyDollar,
  ArrowUp,
  ArrowDown,
  IdentificationCard,
  ClockCountdown,
  ArrowsClockwise,
} from '@phosphor-icons/react';

// Dubai timezone formatter
const dubaiTime = (date: Date = new Date()) =>
  date.toLocaleString('en-AE', {
    timeZone: 'Asia/Dubai',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

const STATS = [
  {
    label: 'Total Vehicles',
    value: '248',
    change: '+4',
    up: true,
    sub: 'Active in fleet',
    icon: CarProfile,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500',
  },
  {
    label: 'Active Drivers',
    value: '182',
    change: '+9',
    up: true,
    sub: 'On shift today',
    icon: IdentificationCard,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
  },
  {
    label: 'Active Users',
    value: '64',
    change: '-3',
    up: false,
    sub: 'Logged in today',
    icon: Users,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500',
  },
  {
    label: "Today's Revenue",
    value: 'AED 38,420',
    change: '+12%',
    up: true,
    sub: 'vs last week',
    icon: CurrencyDollar,
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-500',
  },
];

interface BookingRow {
  id: string;
  platform: string;
  platformColor: string;
  platformBg: string;
  total: number;
  completed: number;
  active: number;
  cancelled: number;
  revenue: string;
  lastSync: string;
}

const BOOKINGS: BookingRow[] = [
  {
    id: 'bolt',
    platform: 'Bolt',
    platformColor: '#34D186',
    platformBg: '#ECFDF5',
    total: 247,
    completed: 198,
    active: 32,
    cancelled: 17,
    revenue: 'AED 14,820',
    lastSync: '2 min ago',
  },
  {
    id: 'uber',
    platform: 'Uber',
    platformColor: '#111827',
    platformBg: '#F3F4F6',
    total: 312,
    completed: 264,
    active: 38,
    cancelled: 10,
    revenue: 'AED 19,450',
    lastSync: '5 min ago',
  },
  {
    id: 'yango',
    platform: 'YANGO',
    platformColor: '#EF4444',
    platformBg: '#FEF2F2',
    total: 189,
    completed: 144,
    active: 28,
    cancelled: 17,
    revenue: 'AED 11,340',
    lastSync: '1 min ago',
  },
  {
    id: 'careem',
    platform: 'Careem',
    platformColor: '#10B981',
    platformBg: '#ECFDF5',
    total: 143,
    completed: 109,
    active: 21,
    cancelled: 13,
    revenue: 'AED 8,610',
    lastSync: '8 min ago',
  },
];

const SHIFT_SUMMARY = [
  { label: 'On Shift',   count: 84,  color: 'bg-emerald-500', text: 'text-emerald-600' },
  { label: 'Break',      count: 22,  color: 'bg-amber-400',   text: 'text-amber-600' },
  { label: 'Off Shift',  count: 76,  color: 'bg-slate-300',   text: 'text-slate-500' },
];

export default function DashboardPage() {
  const now = new Date();
  const hour = now.toLocaleString('en-AE', { timeZone: 'Asia/Dubai', hour: 'numeric', hour12: false });
  const h = parseInt(hour);
  const greeting = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';

  const totalBookings = BOOKINGS.reduce((s, b) => s + b.total, 0);
  const totalCompleted = BOOKINGS.reduce((s, b) => s + b.completed, 0);
  const totalActive = BOOKINGS.reduce((s, b) => s + b.active, 0);
  const totalCancelled = BOOKINGS.reduce((s, b) => s + b.cancelled, 0);

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Greeting banner ── */}
      <div className="lc-card p-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gold/5 via-transparent to-transparent pointer-events-none rounded-2xl" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-slate-500 text-sm">{greeting}, Admin 👋</p>
            <h2 className="font-display font-bold text-xl text-slate-800 mt-0.5">
              Control Room &mdash; <span className="text-gradient-gold">{dubaiTime(now)}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <ClockCountdown size={13} className="text-gold" />
              Dubai Time (GST, UTC+4)
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              All Systems Operational
            </span>
          </div>
        </div>
      </div>

      {/* ── KPI stats ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="lc-card p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl ${s.iconBg} flex items-center justify-center ${s.iconColor}`}>
                  <Icon size={22} weight="duotone" />
                </div>
                <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full
                  ${s.up ? 'text-emerald-600 bg-emerald-50' : 'text-red-500 bg-red-50'}`}>
                  {s.up ? <ArrowUp size={11} weight="bold" /> : <ArrowDown size={11} weight="bold" />}
                  {s.change}
                </span>
              </div>
              <p className="font-display font-bold text-2xl text-slate-800 mb-0.5">{s.value}</p>
              <p className="text-sm font-medium text-slate-600">{s.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{s.sub}</p>
            </div>
          );
        })}
      </div>

      {/* ── Bookings from integrations table ── */}
      <div className="lc-card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h3 className="font-semibold text-slate-800 text-base">Bookings by Integration</h3>
            <p className="text-slate-400 text-xs mt-0.5">
              Live data from all connected aggregators — Dubai time
            </p>
          </div>
          <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 transition-colors">
            <ArrowsClockwise size={13} weight="bold" />
            Sync now
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                {['Platform', 'Total', 'Completed', 'Active', 'Cancelled', 'Revenue', 'Last Sync'].map((h) => (
                  <th key={h} className="lc-table-header">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BOOKINGS.map((row) => (
                <tr key={row.id} className="lc-table-row">
                  {/* Platform */}
                  <td className="lc-table-cell">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shadow-sm"
                        style={{ backgroundColor: row.platformBg, color: row.platformColor, border: `1px solid ${row.platformColor}22` }}
                      >
                        {row.platform[0]}
                      </div>
                      <span className="font-semibold text-slate-700">{row.platform}</span>
                    </div>
                  </td>
                  {/* Total */}
                  <td className="lc-table-cell font-semibold text-slate-800">{row.total}</td>
                  {/* Completed */}
                  <td className="lc-table-cell">
                    <span className="lc-badge bg-emerald-50 text-emerald-600">{row.completed}</span>
                  </td>
                  {/* Active */}
                  <td className="lc-table-cell">
                    <span className="lc-badge bg-blue-50 text-blue-600">{row.active}</span>
                  </td>
                  {/* Cancelled */}
                  <td className="lc-table-cell">
                    <span className="lc-badge bg-red-50 text-red-500">{row.cancelled}</span>
                  </td>
                  {/* Revenue */}
                  <td className="lc-table-cell font-semibold text-slate-800">{row.revenue}</td>
                  {/* Last Sync */}
                  <td className="lc-table-cell">
                    <span className="flex items-center gap-1.5 text-slate-400 text-xs">
                      <ArrowsClockwise size={12} />
                      {row.lastSync}
                    </span>
                  </td>
                </tr>
              ))}

              {/* Totals row */}
              <tr className="bg-slate-50 border-t-2 border-slate-200">
                <td className="lc-table-cell font-bold text-slate-700">Total</td>
                <td className="lc-table-cell font-bold text-slate-800">{totalBookings}</td>
                <td className="lc-table-cell">
                  <span className="lc-badge bg-emerald-50 text-emerald-700 font-bold">{totalCompleted}</span>
                </td>
                <td className="lc-table-cell">
                  <span className="lc-badge bg-blue-50 text-blue-700 font-bold">{totalActive}</span>
                </td>
                <td className="lc-table-cell">
                  <span className="lc-badge bg-red-50 text-red-600 font-bold">{totalCancelled}</span>
                </td>
                <td className="lc-table-cell font-bold text-slate-800">AED 54,220</td>
                <td className="lc-table-cell text-slate-400 text-xs">—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Bottom row: Shift summary + Platform share ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Driver shift status */}
        <div className="lc-card p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-slate-800">Driver Shift Status</h3>
              <p className="text-xs text-slate-400 mt-0.5">182 drivers total today</p>
            </div>
          </div>
          {/* Bar */}
          <div className="flex h-2.5 rounded-full overflow-hidden gap-0.5 mb-4">
            {SHIFT_SUMMARY.map((s) => (
              <div
                key={s.label}
                className={`${s.color} h-full`}
                style={{ width: `${(s.count / 182) * 100}%` }}
              />
            ))}
          </div>
          <div className="space-y-3">
            {SHIFT_SUMMARY.map((s) => (
              <div key={s.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
                  <span className="text-sm text-slate-600">{s.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-semibold ${s.text}`}>{s.count}</span>
                  <span className="text-xs text-slate-400 w-8 text-right">
                    {Math.round((s.count / 182) * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Booking share by platform */}
        <div className="lc-card p-5">
          <div className="mb-5">
            <h3 className="font-semibold text-slate-800">Booking Share by Platform</h3>
            <p className="text-xs text-slate-400 mt-0.5">{totalBookings} total bookings today</p>
          </div>
          <div className="flex h-2.5 rounded-full overflow-hidden gap-0.5 mb-4">
            {BOOKINGS.map((b) => (
              <div
                key={b.id}
                className="h-full rounded-sm"
                style={{ width: `${(b.total / totalBookings) * 100}%`, backgroundColor: b.platformColor }}
              />
            ))}
          </div>
          <div className="space-y-3">
            {BOOKINGS.map((b) => (
              <div key={b.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: b.platformColor }}
                  />
                  <span className="text-sm text-slate-600">{b.platform}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-slate-700">{b.total}</span>
                  <span className="text-xs text-slate-400 w-8 text-right">
                    {Math.round((b.total / totalBookings) * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

import {
  CarProfile,
  Users,
  CalendarBlank,
  CurrencyDollar,
  ArrowUp,
  ArrowDown,
  TrendUp,
  MapPin,
  Warning,
  CheckCircle,
  Clock,
  Taxi,
  Star,
  ArrowRight,
  DotsThree,
} from '@phosphor-icons/react';

const STATS = [
  {
    label: 'Total Vehicles',
    value: '248',
    change: '+4',
    up: true,
    sub: 'Active in fleet',
    icon: CarProfile,
    color: 'from-gold/20 to-gold/5',
    iconColor: 'text-gold',
  },
  {
    label: 'Active Drivers',
    value: '182',
    change: '+9',
    up: true,
    sub: 'On shift today',
    icon: Users,
    color: 'from-emerald-500/20 to-emerald-600/5',
    iconColor: 'text-emerald-400',
  },
  {
    label: "Today's Bookings",
    value: '64',
    change: '-3',
    up: false,
    sub: 'vs yesterday 67',
    icon: CalendarBlank,
    color: 'from-blue-500/20 to-blue-600/5',
    iconColor: 'text-blue-400',
  },
  {
    label: "Today's Revenue",
    value: 'AED 38,420',
    change: '+12%',
    up: true,
    sub: 'vs last week',
    icon: CurrencyDollar,
    color: 'from-purple-500/20 to-purple-600/5',
    iconColor: 'text-purple-400',
  },
];

const RECENT_BOOKINGS = [
  { id: 'BK-0981', client: 'Emirates Group', from: 'DXB Terminal 3', to: 'DIFC', driver: 'Omar Hassan', status: 'active', amount: 'AED 420' },
  { id: 'BK-0980', client: 'Marriott Hotels', from: 'JBR Beach', to: 'EXPO City', driver: 'Samir Al-Rashid', status: 'completed', amount: 'AED 280' },
  { id: 'BK-0979', client: 'ADNOC LLC', from: 'Downtown Dubai', to: 'Abu Dhabi HQ', driver: 'Kareem Nasser', status: 'scheduled', amount: 'AED 1,240' },
  { id: 'BK-0978', client: 'HSBC MENA', from: 'Business Bay', to: 'DXB Terminal 1', driver: 'Jamal Yousef', status: 'completed', amount: 'AED 190' },
  { id: 'BK-0977', client: 'Unilever ME', from: 'Deira City Centre', to: 'Dubai Mall', driver: 'Faisal Al-Amin', status: 'cancelled', amount: 'AED 155' },
];

const FLEET_STATUS = [
  { label: 'Available', count: 98, color: 'bg-emerald-400', textColor: 'text-emerald-400' },
  { label: 'On Trip', count: 84, color: 'bg-blue-400', textColor: 'text-blue-400' },
  { label: 'Maintenance', count: 22, color: 'bg-yellow-400', textColor: 'text-yellow-400' },
  { label: 'Offline', count: 44, color: 'bg-gray-500', textColor: 'text-gray-400' },
];

const ALERTS = [
  { icon: Warning, color: 'text-yellow-400 bg-yellow-400/10', msg: '3 vehicles due for service this week', time: '2h ago' },
  { icon: CheckCircle, color: 'text-emerald-400 bg-emerald-400/10', msg: 'Monthly compliance report submitted', time: '4h ago' },
  { icon: Warning, color: 'text-red-400 bg-red-400/10', msg: "Driver Mohammed's license expires in 7 days", time: '5h ago' },
  { icon: Clock, color: 'text-blue-400 bg-blue-400/10', msg: '12 bookings scheduled for tomorrow', time: '6h ago' },
];

const TOP_DRIVERS = [
  { name: 'Omar Hassan', trips: 312, rating: 4.9, earning: 'AED 28,400' },
  { name: 'Samir Al-Rashid', trips: 298, rating: 4.8, earning: 'AED 26,900' },
  { name: 'Kareem Nasser', trips: 281, rating: 4.9, earning: 'AED 25,200' },
];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active:    'bg-blue-500/15 text-blue-400 border border-blue-500/20',
    completed: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
    scheduled: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20',
    cancelled: 'bg-red-500/15 text-red-400 border border-red-500/20',
  };
  return (
    <span className={`badge capitalize ${map[status] ?? ''}`}>{status}</span>
  );
}

export default function DashboardPage() {
  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Greeting banner ── */}
      <div className="card p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gold/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 w-64 h-full bg-[url()] opacity-5" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-gray-400 text-sm">{greeting}, Admin 👋</p>
            <h2 className="font-display font-bold text-2xl text-white mt-1">
              Fleet Overview — <span className="text-gradient-gold">
                {now.toLocaleDateString('en-AE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Systems Operational
            </span>
          </div>
        </div>
      </div>

      {/* ── KPI stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card p-5 relative overflow-hidden group hover:border-gold/20 transition-colors">
              <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl bg-surface-elevated flex items-center justify-center ${s.iconColor}`}>
                    <Icon size={22} weight="duotone" />
                  </div>
                  <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${s.up ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'}`}>
                    {s.up ? <ArrowUp size={11} weight="bold" /> : <ArrowDown size={11} weight="bold" />}
                    {s.change}
                  </span>
                </div>
                <p className="font-display font-bold text-2xl text-white mb-0.5">{s.value}</p>
                <p className="text-sm font-medium text-gray-300">{s.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Recent Bookings – takes 2 cols */}
        <div className="xl:col-span-2 card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border">
            <div className="flex items-center gap-2.5">
              <CalendarBlank size={18} weight="duotone" className="text-gold" />
              <h3 className="font-semibold text-white">Recent Bookings</h3>
            </div>
            <button className="btn-ghost text-xs py-1.5 px-3">
              View all <ArrowRight size={13} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-border">
                  {['Booking ID', 'Client', 'Route', 'Driver', 'Amount', 'Status'].map((h) => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {RECENT_BOOKINGS.map((b) => (
                  <tr key={b.id} className="hover:bg-surface-elevated/50 transition-colors group">
                    <td className="px-6 py-3.5 font-mono text-gold text-xs whitespace-nowrap">{b.id}</td>
                    <td className="px-6 py-3.5 text-white font-medium whitespace-nowrap">{b.client}</td>
                    <td className="px-6 py-3.5 text-gray-400 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="truncate max-w-[90px]">{b.from}</span>
                        <ArrowRight size={11} className="shrink-0 text-gray-600" />
                        <span className="truncate max-w-[90px]">{b.to}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-gray-300 whitespace-nowrap">{b.driver}</td>
                    <td className="px-6 py-3.5 text-white font-medium whitespace-nowrap">{b.amount}</td>
                    <td className="px-6 py-3.5 whitespace-nowrap">
                      <StatusBadge status={b.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">

          {/* Fleet status donut-like */}
          <div className="card p-5">
            <div className="flex items-center gap-2.5 mb-5">
              <Taxi size={18} weight="duotone" className="text-gold" />
              <h3 className="font-semibold text-white">Fleet Status</h3>
              <span className="ml-auto text-xs text-gray-500">248 total</span>
            </div>
            {/* Bar segments */}
            <div className="flex h-3 rounded-full overflow-hidden gap-0.5 mb-4">
              {FLEET_STATUS.map((fs) => (
                <div
                  key={fs.label}
                  className={`${fs.color} h-full rounded-sm`}
                  style={{ width: `${(fs.count / 248) * 100}%` }}
                />
              ))}
            </div>
            <div className="space-y-2.5">
              {FLEET_STATUS.map((fs) => (
                <div key={fs.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${fs.color}`} />
                    <span className="text-sm text-gray-400">{fs.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-semibold ${fs.textColor}`}>{fs.count}</span>
                    <span className="text-xs text-gray-600">{Math.round((fs.count / 248) * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top drivers */}
          <div className="card p-5">
            <div className="flex items-center gap-2.5 mb-5">
              <TrendUp size={18} weight="duotone" className="text-gold" />
              <h3 className="font-semibold text-white">Top Drivers</h3>
            </div>
            <div className="space-y-3">
              {TOP_DRIVERS.map((d, i) => (
                <div key={d.name} className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                    ${i === 0 ? 'bg-gold/20 text-gold' : i === 1 ? 'bg-gray-400/20 text-gray-300' : 'bg-yellow-700/20 text-yellow-600'}`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{d.name}</p>
                    <p className="text-xs text-gray-500">{d.trips} trips · {d.earning}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Star size={12} weight="fill" className="text-gold" />
                    <span className="text-xs font-semibold text-gold">{d.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Alerts & Map placeholder ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Alerts */}
        <div className="card p-5">
          <div className="flex items-center gap-2.5 mb-5">
            <Warning size={18} weight="duotone" className="text-gold" />
            <h3 className="font-semibold text-white">Recent Alerts</h3>
          </div>
          <div className="space-y-3">
            {ALERTS.map((a, i) => {
              const Icon = a.icon;
              return (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-surface-elevated border border-surface-border">
                  <span className={`mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${a.color}`}>
                    <Icon size={15} weight="duotone" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-200 leading-snug">{a.msg}</p>
                    <p className="text-xs text-gray-500 mt-1">{a.time}</p>
                  </div>
                  <button className="text-gray-600 hover:text-gray-400 transition-colors shrink-0">
                    <DotsThree size={18} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live tracking placeholder */}
        <div className="card overflow-hidden relative min-h-[260px]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-surface-border">
            <div className="flex items-center gap-2.5">
              <MapPin size={18} weight="duotone" className="text-gold" />
              <h3 className="font-semibold text-white">Live Fleet Map</h3>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              84 vehicles live
            </span>
          </div>
          {/* Map placeholder with grid */}
          <div className="relative flex-1 h-[200px] bg-surface-elevated flex items-center justify-center overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage: 'linear-gradient(to right, #C9A84C 1px, transparent 1px), linear-gradient(to bottom, #C9A84C 1px, transparent 1px)',
                backgroundSize: '30px 30px',
              }}
            />
            {/* Fake vehicle dots */}
            {[
              { top: '30%', left: '25%' }, { top: '55%', left: '50%' },
              { top: '20%', left: '70%' }, { top: '70%', left: '35%' },
              { top: '45%', left: '80%' }, { top: '60%', left: '15%' },
            ].map((pos, i) => (
              <span
                key={i}
                style={{ top: pos.top, left: pos.left }}
                className="absolute w-3 h-3 rounded-full bg-blue-400 ring-2 ring-blue-400/30 animate-pulse-slow"
              />
            ))}
            <div className="relative z-10 text-center">
              <MapPin size={36} weight="duotone" className="text-gold/40 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Live map module launching soon</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

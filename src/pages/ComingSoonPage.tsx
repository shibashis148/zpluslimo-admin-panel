import { useLocation } from 'react-router-dom';
import {
  Desktop,
  TrendUp,
  CurrencyDollar,
  ShieldWarning,
  Bell,
  Heartbeat,
  IdentificationCard,
  CarProfile,
  GearSix,
  RocketLaunch,
  Table,
  ChartBar,
  Warning,
} from '@phosphor-icons/react';

interface ModuleMeta {
  icon: React.ElementType;
  label: string;
  description: string;
  color: string;
  columns?: string[];
  metrics?: string[];
  actions?: string[];
}

const MODULE_META: Record<string, ModuleMeta> = {
  '/live-operations': {
    icon: Desktop,
    label: 'Live Operations',
    description: 'Real-time command centre — every active driver, car, platform and trip status on one screen.',
    color: 'from-emerald-500/15 to-emerald-600/5',
    columns: [
      'Driver', 'Car', 'Platform', 'Login time', 'Trips completed',
      'Current trip status', 'Last trip time', 'Idle time',
      'Revenue so far', 'Acceptance rate', 'Cancellation rate',
      'Customer rating', 'Last GPS ping', 'Alert status',
    ],
    actions: [
      'Call driver', 'Send reminder', 'Mark for supervisor follow-up',
      'Suspend from priority assignment', 'Add note',
    ],
  },
  '/driver-performance': {
    icon: TrendUp,
    label: 'Driver Performance',
    description: 'Full ranking, scoring and discipline view — know your top performers and flag at-risk drivers.',
    color: 'from-blue-500/15 to-blue-600/5',
    metrics: [
      'Daily revenue', 'Weekly revenue', 'Trips per shift',
      'Revenue per online hour', 'Average trip value', 'Idle time %',
      'Acceptance rate', 'Cancel rate', 'Peak hour utilization',
      'Online discipline', 'Cash collection mismatch',
      'Customer complaints', 'Driver score (out of 100)',
    ],
    columns: [
      '85–100 → Top Performer',
      '70–84 → Acceptable',
      '50–69 → Underperformer',
      'Below 50 → Critical Review',
    ],
  },
  '/revenue': {
    icon: CurrencyDollar,
    label: 'Revenue & Profitability',
    description: 'Understand exactly where money is made and lost — per car, driver, platform, shift and time period.',
    color: 'from-purple-500/15 to-purple-600/5',
    metrics: [
      'Gross revenue', 'Platform commission', 'Driver payout',
      'Fuel cost', 'Salik / tolls', 'Parking',
      'Lease / EMI allocation', 'Insurance allocation',
      'Maintenance reserve', 'Net contribution per car',
    ],
    columns: [
      'Profit per car per day', 'Profit per driver per day',
      'Best platform by profitability', 'Worst cars to keep active',
      'Break-even threshold per car',
    ],
  },
  '/leakage': {
    icon: ShieldWarning,
    label: 'Leakage & Fraud Detection',
    description: 'Automatically flag suspicious patterns — cash mismatches, GPS anomalies, peak-hour dropouts and more.',
    color: 'from-red-500/15 to-red-600/5',
    columns: [
      'Online many hours, too few trips',
      'Revenue below zone average',
      'Unusual long offline during peak',
      'Cash trips not matching logs',
      'Excessive cancellations',
      'GPS movement without platform revenue',
      'Driver ending shift early repeatedly',
      'High dead miles / empty driving',
      'Manual fare adjustments',
      'Too much time in low-demand areas',
    ],
    metrics: [
      'Low Risk', 'Medium Risk', 'High Risk',
    ],
    actions: [
      'View fraud reasons per driver',
      'Compare vs peer drivers',
      'Escalate to supervisor',
      'Freeze assignments',
    ],
  },
  '/alerts': {
    icon: Bell,
    label: 'Alerts Center',
    description: 'All system exceptions in one feed — severity-ranked with driver, car, issue and recommended action.',
    color: 'from-amber-500/15 to-amber-600/5',
    columns: [
      'Driver inactive for 30 min',
      'Driver idle in high-demand area',
      'Acceptance rate dropped below threshold',
      'Shift started late',
      'Driver offline during assigned shift',
      'Revenue below target after 4 hours',
      'Driver not responding to app notification',
      'Car entered unauthorized area',
      'Fuel anomaly detected',
      'Device location disabled',
    ],
    metrics: ['Severity', 'Time', 'Driver', 'Car', 'Issue', 'Recommended action'],
  },
  '/fleet-health': {
    icon: Heartbeat,
    label: 'Fleet Health',
    description: 'Per-vehicle health dashboard — maintenance, documents, revenue and a keep / rotate / replace decision engine.',
    color: 'from-teal-500/15 to-teal-600/5',
    metrics: [
      'Active days', 'Maintenance due', 'Tire change due',
      'Insurance expiry', 'Registration expiry', 'Accident history',
      'Downtime', 'Revenue last 30 days', 'Net profit last 30 days',
    ],
    columns: ['Keep', 'Rotate', 'Repair', 'Replace', 'Sell'],
  },
  '/drivers': {
    icon: IdentificationCard,
    label: 'Drivers',
    description: 'Driver profiles, licenses, documents, performance history and real-time availability.',
    color: 'from-cyan-500/15 to-cyan-600/5',
    metrics: ['Profile & documents', 'License expiry', 'Assigned car', 'Current platform', 'Shift history', 'Performance score'],
  },
  '/cars': {
    icon: CarProfile,
    label: 'Cars',
    description: 'Full vehicle registry — specs, documents, insurance, assignment history and maintenance schedule.',
    color: 'from-amber-500/15 to-amber-600/5',
    metrics: ['Vehicle details', 'Insurance & registration', 'Assigned driver', 'Active platform', 'Maintenance log', 'Revenue history'],
  },
  '/settings': {
    icon: GearSix,
    label: 'Settings',
    description: 'Platform configuration — user management, API keys, thresholds, alerts and billing.',
    color: 'from-slate-500/15 to-slate-600/5',
    metrics: ['User accounts & roles', 'Alert thresholds', 'API connections', 'Notification preferences', 'Billing & plan'],
  },
};

const ICON_MAP: Record<string, React.ElementType> = {
  columns: Table,
  metrics:  ChartBar,
  actions:  Warning,
};

export default function ComingSoonPage() {
  const { pathname } = useLocation();
  const meta = MODULE_META[pathname] ?? {
    icon: Desktop,
    label: 'Module',
    description: 'This section is currently under development.',
    color: 'from-gold/15 to-gold/5',
  };
  const Icon = meta.icon;

  const sections: { key: 'columns' | 'metrics' | 'actions'; heading: string; items: string[] }[] = [
    ...(meta.columns  ? [{ key: 'columns'  as const, heading: pathname === '/driver-performance' ? 'Score tiers' : pathname === '/revenue' ? 'Key outputs' : pathname === '/leakage' ? 'Detected patterns' : pathname === '/fleet-health' ? 'Decision options' : pathname === '/alerts' ? 'Alert fields' : 'Columns tracked',      items: meta.columns }]  : []),
    ...(meta.metrics  ? [{ key: 'metrics'  as const, heading: pathname === '/leakage' ? 'Risk levels' : pathname === '/fleet-health' ? 'Per-vehicle metrics' : pathname === '/driver-performance' ? 'Metrics tracked' : pathname === '/alerts' ? 'Each alert shows' : 'Metrics',              items: meta.metrics }]  : []),
    ...(meta.actions  ? [{ key: 'actions'  as const, heading: 'Admin actions',   items: meta.actions }]  : []),
  ];

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-start justify-center p-4 pt-8">
      <div className="w-full max-w-3xl animate-slide-up space-y-5">

        {/* Header card */}
        <div className="lc-card p-8 text-center relative overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-b ${meta.color} pointer-events-none`} />

          <div className="relative z-10 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white border border-slate-200 mb-5 shadow-sm mx-auto">
            <Icon size={32} weight="duotone" className="text-gold" />
          </div>

          <div className="relative z-10 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-600 text-xs font-semibold mb-4">
            <RocketLaunch size={13} weight="fill" />
            Under Development
          </div>

          <h2 className="relative z-10 font-display font-bold text-3xl text-slate-800 mb-2">{meta.label}</h2>
          <p className="relative z-10 text-slate-500 text-sm leading-relaxed max-w-lg mx-auto">{meta.description}</p>

          {/* Progress bar */}
          <div className="relative z-10 mt-6 max-w-xs mx-auto">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-slate-400">Development progress</span>
              <span className="text-xs font-semibold text-gold">68%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-gold to-gold-light" />
            </div>
          </div>
        </div>

        {/* Spec sections */}
        {sections.map(({ key, heading, items }) => {
          const SectionIcon = ICON_MAP[key];
          return (
            <div key={key} className="lc-card overflow-hidden">
              <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-200 bg-slate-50">
                <SectionIcon size={16} weight="duotone" className="text-gold" />
                <h3 className="font-semibold text-slate-700 text-sm">{heading}</h3>
                <span className="ml-auto text-xs text-slate-400">{items.length} items</span>
              </div>
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {items.map((item) => (
                  <div key={item} className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                    <span className="text-sm text-slate-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <p className="text-center text-xs text-slate-400 pb-4">
          zpluslimo Control Room · Module under active development
        </p>
      </div>
    </div>
  );
}

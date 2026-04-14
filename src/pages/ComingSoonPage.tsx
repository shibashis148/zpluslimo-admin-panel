import { useLocation } from 'react-router-dom';
import {
  CarProfile,
  ChartBarHorizontal,
  Users,
  MapPin,
  CurrencyDollar,
  FileText,
  Bell,
  GearSix,
  IdentificationCard,
  ChartLineUp,
  ClockCountdown,
  BookOpen,
  ChartBar,
  Warning,
  Gift,
  Receipt,
  RocketLaunch,
} from '@phosphor-icons/react';

const MODULE_META: Record<string, { icon: React.ElementType; label: string; description: string; color: string }> = {
  '/analytics':          { icon: ChartLineUp,    label: 'Analytics',          description: 'In-depth fleet performance metrics, revenue trends and KPI dashboards.', color: 'from-blue-500/20 to-blue-600/5' },
  '/cars':               { icon: CarProfile,     label: 'Cars',               description: 'Full vehicle registry, specs, documents, insurance and assignment history.', color: 'from-amber-500/20 to-amber-600/5' },
  '/drivers':            { icon: IdentificationCard, label: 'Drivers',        description: 'Driver profiles, licenses, performance scores and live availability.', color: 'from-cyan-500/20 to-cyan-600/5' },
  '/users':              { icon: Users,          label: 'Users',              description: 'Manage admin accounts, roles and access permissions across the platform.', color: 'from-pink-500/20 to-pink-600/5' },
  '/tracking':           { icon: MapPin,         label: 'Live Track',         description: 'Real-time GPS tracking with live map view and geofencing alerts.', color: 'from-emerald-500/20 to-emerald-600/5' },
  '/shift':              { icon: ClockCountdown, label: 'Shift',              description: 'Manage driver shifts, schedules, check-ins, breaks and handovers.', color: 'from-orange-500/20 to-orange-600/5' },
  '/reports':            { icon: FileText,       label: 'Reports',            description: 'Generate, filter and export detailed reports across all modules.', color: 'from-indigo-500/20 to-indigo-600/5' },
  '/reports/trips':      { icon: BookOpen,       label: 'Trip Reports',       description: 'Detailed trip history, routes, durations and completion rates.', color: 'from-indigo-500/20 to-indigo-600/5' },
  '/reports/drivers':    { icon: ChartBar,       label: 'Driver Reports',     description: 'Driver performance, ratings, trip counts and earnings breakdown.', color: 'from-violet-500/20 to-violet-600/5' },
  '/reports/finance':    { icon: CurrencyDollar, label: 'Finance Reports',    description: 'Revenue, invoices, expenses and financial reconciliation reports.', color: 'from-green-500/20 to-green-600/5' },
  '/reports/fines':      { icon: Warning,        label: 'Fine Reports',       description: 'Track driver fines, violations and deductions by period.', color: 'from-red-500/20 to-red-600/5' },
  '/reports/incentive':  { icon: Gift,           label: 'Incentive Reports',  description: 'Bonus schemes, performance incentives and rewards tracking.', color: 'from-purple-500/20 to-purple-600/5' },
  '/reports/expenses':   { icon: Receipt,        label: 'Driver Expenses',    description: 'Driver expense claims, reimbursements and approval workflow.', color: 'from-teal-500/20 to-teal-600/5' },
  '/notifications':      { icon: Bell,           label: 'Notifications',      description: 'System alerts, scheduled reminders and push notification center.', color: 'from-amber-500/20 to-amber-600/5' },
  '/settings':           { icon: GearSix,        label: 'Settings',           description: 'Platform configuration, API keys, billing and user preferences.', color: 'from-slate-500/20 to-slate-600/5' },
};

const UPCOMING_FEATURES = [
  'Real-time data sync',
  'Role-based access control',
  'Custom export formats',
  'Mobile companion app',
  'AI-powered insights',
  'Third-party integrations',
];

export default function ComingSoonPage() {
  const { pathname } = useLocation();
  const meta = MODULE_META[pathname] ?? {
    icon: ChartBarHorizontal,
    label: 'Module',
    description: 'This section is currently under development.',
    color: 'from-gold/20 to-gold/5',
  };
  const Icon = meta.icon;

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl animate-slide-up">

        {/* Main card */}
        <div className="lc-card p-8 md:p-12 text-center relative overflow-hidden">
          {/* Background gradient */}
          <div className={`absolute inset-0 bg-gradient-to-b ${meta.color} opacity-40 pointer-events-none`} />

          {/* Icon */}
          <div className="relative z-10 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white border border-slate-200 mb-6 shadow-sm mx-auto">
            <Icon size={40} weight="duotone" className="text-gold" />
          </div>

          {/* Badge */}
          <div className="relative z-10 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-600 text-xs font-semibold mb-4">
            <RocketLaunch size={13} weight="fill" />
            Coming Soon
          </div>

          <h2 className="relative z-10 font-display font-bold text-3xl md:text-4xl text-slate-800 mb-3">
            {meta.label}
          </h2>
          <p className="relative z-10 text-slate-500 text-base leading-relaxed max-w-md mx-auto mb-10">
            {meta.description}
          </p>

          {/* Divider */}
          <div className="relative z-10 w-16 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent mx-auto mb-10" />

          {/* Upcoming features grid */}
          <div className="relative z-10 text-left">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              What's included in this module
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {UPCOMING_FEATURES.map((f) => (
                <div
                  key={f}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                  <span className="text-sm text-slate-600">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Progress bar */}
          <div className="relative z-10 mt-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">Development Progress</span>
              <span className="text-xs font-semibold text-gold">68%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-gold to-gold-light"
                style={{ width: '68%' }}
              />
            </div>
          </div>
        </div>

        {/* Bottom hint */}
        <p className="text-center text-xs text-gray-600 mt-4">
          zpluslimo Control Room • Module under active development
        </p>
      </div>
    </div>
  );
}

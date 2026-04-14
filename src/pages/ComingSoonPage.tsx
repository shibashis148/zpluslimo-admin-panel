import { useLocation } from 'react-router-dom';
import {
  CarProfile,
  ChartBarHorizontal,
  Taxi,
  Users,
  CalendarBlank,
  MapPin,
  CurrencyDollar,
  Wrench,
  FileText,
  Bell,
  GearSix,
  Buildings,
  UserCircleGear,
  IdentificationCard,
  ChartLineUp,
  ChatCircleDots,
  ShieldCheck,
  ListBullets,
  RocketLaunch,
} from '@phosphor-icons/react';

const MODULE_META: Record<string, { icon: React.ElementType; label: string; description: string; color: string }> = {
  '/analytics':     { icon: ChartLineUp,     label: 'Analytics',     description: 'In-depth fleet performance metrics, revenue trends and KPI dashboards.', color: 'from-blue-500/20 to-blue-600/5' },
  '/vehicles':      { icon: CarProfile,      label: 'Vehicles',      description: 'Full vehicle registry, specs, documents, and assignment history.', color: 'from-gold/20 to-gold/5' },
  '/bookings':      { icon: CalendarBlank,   label: 'Bookings',      description: 'Manage reservations, itineraries, and real-time booking status.', color: 'from-purple-500/20 to-purple-600/5' },
  '/tracking':      { icon: MapPin,          label: 'Live Tracking', description: 'Real-time GPS tracking with live map view and geofencing alerts.', color: 'from-emerald-500/20 to-emerald-600/5' },
  '/dispatch':      { icon: Taxi,            label: 'Dispatch',      description: 'Smart dispatch console for assigning drivers and managing runs.', color: 'from-orange-500/20 to-orange-600/5' },
  '/drivers':       { icon: IdentificationCard, label: 'Drivers',   description: 'Driver profiles, licenses, performance scores and availability.', color: 'from-cyan-500/20 to-cyan-600/5' },
  '/clients':       { icon: Users,           label: 'Clients',       description: 'CRM for corporate and individual client accounts and preferences.', color: 'from-pink-500/20 to-pink-600/5' },
  '/staff':         { icon: UserCircleGear,  label: 'Staff',         description: 'HR management: roles, shifts, access control and permissions.', color: 'from-violet-500/20 to-violet-600/5' },
  '/finance':       { icon: CurrencyDollar,  label: 'Finance',       description: 'Invoices, payments, expense tracking and revenue reports.', color: 'from-green-500/20 to-green-600/5' },
  '/maintenance':   { icon: Wrench,          label: 'Maintenance',   description: 'Vehicle service schedules, repair logs and parts inventory.', color: 'from-yellow-500/20 to-yellow-600/5' },
  '/reports':       { icon: FileText,        label: 'Reports',       description: 'Generate custom reports and export data for any time period.', color: 'from-indigo-500/20 to-indigo-600/5' },
  '/messages':      { icon: ChatCircleDots,  label: 'Messages',      description: 'In-app messaging between dispatchers, drivers and management.', color: 'from-sky-500/20 to-sky-600/5' },
  '/notifications': { icon: Bell,            label: 'Notifications', description: 'System alerts, scheduled reminders and push notification center.', color: 'from-amber-500/20 to-amber-600/5' },
  '/compliance':    { icon: ShieldCheck,     label: 'Compliance',    description: 'Regulatory compliance tracking, audit logs and certification renewals.', color: 'from-teal-500/20 to-teal-600/5' },
  '/activity':      { icon: ListBullets,     label: 'Activity Log',  description: 'Full audit trail of all actions performed across the platform.', color: 'from-rose-500/20 to-rose-600/5' },
  '/company':       { icon: Buildings,       label: 'Company',       description: 'Company profile, branding, locations and integration settings.', color: 'from-lime-500/20 to-lime-600/5' },
  '/settings':      { icon: GearSix,         label: 'Settings',      description: 'Platform configuration, API keys, billing and user preferences.', color: 'from-gray-500/20 to-gray-600/5' },
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
        <div className={`card p-8 md:p-12 text-center relative overflow-hidden`}>
          {/* Background gradient */}
          <div className={`absolute inset-0 bg-gradient-to-b ${meta.color} pointer-events-none`} />

          {/* Icon */}
          <div className="relative z-10 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-surface-elevated border border-surface-border mb-6 shadow-card mx-auto">
            <Icon size={40} weight="duotone" className="text-gold" />
          </div>

          {/* Badge */}
          <div className="relative z-10 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-semibold mb-4">
            <RocketLaunch size={13} weight="fill" />
            Coming Soon
          </div>

          <h2 className="relative z-10 font-display font-bold text-3xl md:text-4xl text-white mb-3">
            {meta.label}
          </h2>
          <p className="relative z-10 text-gray-400 text-base leading-relaxed max-w-md mx-auto mb-10">
            {meta.description}
          </p>

          {/* Divider */}
          <div className="relative z-10 w-16 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent mx-auto mb-10" />

          {/* Upcoming features grid */}
          <div className="relative z-10 text-left">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              What's included in this module
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {UPCOMING_FEATURES.map((f) => (
                <div
                  key={f}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-elevated border border-surface-border"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                  <span className="text-sm text-gray-300">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Progress bar */}
          <div className="relative z-10 mt-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">Development Progress</span>
              <span className="text-xs font-semibold text-gold">68%</span>
            </div>
            <div className="h-1.5 w-full bg-surface-elevated rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-gold to-gold-light"
                style={{ width: '68%' }}
              />
            </div>
          </div>
        </div>

        {/* Bottom hint */}
        <p className="text-center text-xs text-gray-600 mt-4">
          Z+ Limo Fleet Management • Module under active development
        </p>
      </div>
    </div>
  );
}

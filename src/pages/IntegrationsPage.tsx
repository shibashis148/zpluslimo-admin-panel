import { useState } from 'react';
import {
  CheckCircle,
  ArrowSquareOut,
  Info,
  Lightning,
  CaretRight,
} from '@phosphor-icons/react';
import { BoltIcon, UberIcon, YangoIcon, CareemIcon } from '../assets/integrationIcons';

interface Integration {
  id: string;
  name: string;
  apiKey?: string;
  totalDrivers: number;
  notSynced: number;
  accentColor: string;
  bgColor: string;
  Icon: React.ComponentType<{ size?: number }>;
  status: 'action_required' | 'connected' | 'disconnected';
}

const INTEGRATIONS: Integration[] = [
  {
    id: 'bolt',
    name: 'Bolt',
    apiKey: 'bolt-api-4f9a…',
    totalDrivers: 124,
    notSynced: 100,
    accentColor: '#34D186',
    bgColor: '#ECFDF5',
    Icon: BoltIcon,
    status: 'action_required',
  },
  {
    id: 'uber',
    name: 'Uber',
    apiKey: 'uber-api-8c2b…',
    totalDrivers: 161,
    notSynced: 139,
    accentColor: '#111827',
    bgColor: '#F3F4F6',
    Icon: UberIcon,
    status: 'action_required',
  },
  {
    id: 'yango',
    name: 'YANGO',
    apiKey: 'yango-api-3e7d…',
    totalDrivers: 137,
    notSynced: 128,
    accentColor: '#FF0000',
    bgColor: '#FEF2F2',
    Icon: YangoIcon,
    status: 'action_required',
  },
  {
    id: 'careem',
    name: 'Careem',
    apiKey: 'careem-cfc78b…',
    totalDrivers: 84,
    notSynced: 82,
    accentColor: '#28bb4e',
    bgColor: '#F0FDF4',
    Icon: CareemIcon,
    status: 'action_required',
  },
];

function IntegrationCard({ integration }: { integration: Integration }) {
  const { Icon } = integration;
  const syncedPct = Math.round(
    ((integration.totalDrivers - integration.notSynced) / integration.totalDrivers) * 100
  );

  return (
    <div className="lc-card p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {/* Real SVG logo */}
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 overflow-hidden"
            style={{ backgroundColor: integration.bgColor, border: `1.5px solid ${integration.accentColor}25` }}
          >
            <Icon size={22} />
          </div>
          <div>
            <p className="font-semibold text-slate-800 text-sm leading-tight">{integration.name}</p>
            {integration.apiKey && (
              <p className="text-slate-400 text-[11px] flex items-center gap-1 mt-0.5">
                {integration.apiKey}
                <Info size={11} className="text-slate-300" />
              </p>
            )}
          </div>
        </div>

        {/* Status badge */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-400 text-white shadow-sm whitespace-nowrap">
          <CheckCircle size={13} weight="fill" />
          Action required
        </span>
      </div>

      {/* Stats */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-slate-500 text-xs">Total driver</span>
          <div className="flex-1 mx-3 h-px bg-slate-100" />
          <span className="text-slate-700 text-sm font-semibold">{integration.totalDrivers}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500 text-xs">Not synced drivers</span>
          <div className="flex-1 mx-3 h-px bg-slate-100" />
          <span className="text-red-500 text-sm font-semibold">{integration.notSynced}</span>
        </div>

        {/* Sync progress bar */}
        <div className="mt-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-slate-400">Sync status</span>
            <span className="text-[10px] font-semibold text-slate-500">{syncedPct}% synced</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${syncedPct}%`, backgroundColor: integration.accentColor }}
            />
          </div>
        </div>
      </div>

      {/* Open link */}
      <div className="pt-1 border-t border-slate-100">
        <button className="flex items-center gap-1.5 text-sm font-semibold text-gold hover:text-gold-dark transition-colors">
          <ArrowSquareOut size={15} weight="bold" />
          Open
        </button>
      </div>
    </div>
  );
}

export default function IntegrationsPage() {
  const [activeTab] = useState('taxi');

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-2xl text-slate-800">Integrations</h2>
          <p className="text-slate-500 text-sm mt-0.5">Connect and manage your aggregator platforms</p>
        </div>
        <button className="btn-primary text-sm">
          <Lightning size={16} weight="fill" />
          Add Integration
        </button>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Connected', value: 4, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
          { label: 'Total Drivers', value: 506, color: 'text-slate-700', bg: 'bg-slate-50 border-slate-200' },
          { label: 'Not Synced', value: 449, color: 'text-red-500', bg: 'bg-red-50 border-red-200' },
          { label: 'Action Required', value: 4, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
        ].map((s) => (
          <div key={s.label} className={`lc-card p-4 border ${s.bg}`}>
            <p className={`font-display font-bold text-2xl ${s.color}`}>{s.value}</p>
            <p className="text-slate-500 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 border-b border-slate-200">
        {['Taxi services', 'Payment gateways', 'Maps & Tracking', 'Other'].map((tab, i) => (
          <button
            key={tab}
            className={[
              'px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px',
              i === 0 && activeTab === 'taxi'
                ? 'border-gold text-gold'
                : 'border-transparent text-slate-500 hover:text-slate-700',
            ].join(' ')}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Section heading */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-700 text-base">Taxi services</h3>
        <button className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors">
          View all <CaretRight size={12} />
        </button>
      </div>

      {/* Integration cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {INTEGRATIONS.map((integration) => (
          <IntegrationCard key={integration.id} integration={integration} />
        ))}
      </div>

      {/* Coming-soon integrations */}
      <div>
        <h3 className="font-semibold text-slate-700 text-base mb-4">Coming soon</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {['inDriver', 'Ola', 'DiDi', 'Grab'].map((name) => (
            <div key={name} className="lc-card p-4 flex items-center gap-3 opacity-50 cursor-not-allowed">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-400">
                {name[0]}
              </div>
              <span className="text-sm text-slate-500 font-medium">{name}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

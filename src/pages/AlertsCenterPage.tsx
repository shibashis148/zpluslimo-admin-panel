import { useEffect, useState } from 'react';
import { Warning, CheckCircle, Info, Check, Eye, FunnelSimple } from '@phosphor-icons/react';
import { alertService } from '../services';
import type { Alert } from '../data/types';

const SEV: Record<string, { icon: React.ElementType; card: string; badge: string; iconColor: string; label: string }> = {
  critical: { icon: Warning,       card: 'border-l-4 border-l-red-500 bg-red-50/50',     badge: 'bg-red-100 text-red-700 border-red-200',    iconColor: 'text-red-500',    label: 'Critical' },
  warning:  { icon: Warning,       card: 'border-l-4 border-l-amber-400 bg-amber-50/40',  badge: 'bg-amber-100 text-amber-700 border-amber-200', iconColor: 'text-amber-500',  label: 'Warning'  },
  info:     { icon: Info,          card: 'border-l-4 border-l-blue-400 bg-blue-50/30',    badge: 'bg-blue-100 text-blue-700 border-blue-200',    iconColor: 'text-blue-500',   label: 'Info'     },
};

const STATUS_BADGE: Record<string, string> = {
  open:         'bg-red-50 text-red-600 border-red-200',
  acknowledged: 'bg-amber-50 text-amber-600 border-amber-200',
  resolved:     'bg-emerald-50 text-emerald-600 border-emerald-200',
};

export default function AlertsCenterPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all'|'critical'|'warning'|'info'>('all');
  const [statusFilter, setStatusFilter] = useState<'all'|'open'|'acknowledged'|'resolved'>('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => { alertService.getAll().then(setAlerts).finally(()=>setLoading(false)); }, []);

  const filtered = alerts.filter((a) =>
    (filter === 'all' || a.severity === filter) &&
    (statusFilter === 'all' || a.status === statusFilter)
  );

  const counts = {
    critical: alerts.filter(a=>a.severity==='critical').length,
    warning:  alerts.filter(a=>a.severity==='warning').length,
    info:     alerts.filter(a=>a.severity==='info').length,
    open:     alerts.filter(a=>a.status==='open').length,
  };

  if (loading) return <div className="flex items-center justify-center h-64"><svg className="animate-spin h-8 w-8 text-gold" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg></div>;

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label:'Critical',    count:counts.critical, bg:'bg-red-50 border-red-200',     text:'text-red-600',    key:'critical' },
          { label:'Warnings',    count:counts.warning,  bg:'bg-amber-50 border-amber-200',  text:'text-amber-600',  key:'warning'  },
          { label:'Info',        count:counts.info,     bg:'bg-blue-50 border-blue-200',    text:'text-blue-600',   key:'info'     },
          { label:'Open / Unresolved', count:counts.open, bg:'bg-slate-50 border-slate-200', text:'text-slate-700', key:'all'      },
        ].map((s) => (
          <div key={s.label} className={`lc-card p-4 border ${s.bg}`}>
            <p className={`font-display font-bold text-3xl ${s.text}`}>{s.count}</p>
            <p className="text-slate-500 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-1.5 text-xs text-slate-500"><FunnelSimple size={14}/>Severity:</div>
        {(['all','critical','warning','info'] as const).map((f) => (
          <button key={f} onClick={()=>setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors capitalize ${filter===f?'bg-gold text-surface':'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
            {f}
          </button>
        ))}
        <div className="w-px h-5 bg-slate-200 mx-1"/>
        {(['all','open','acknowledged','resolved'] as const).map((f) => (
          <button key={f} onClick={()=>setStatusFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors capitalize ${statusFilter===f?'bg-slate-800 text-white':'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
            {f}
          </button>
        ))}
        <span className="ml-auto text-xs text-slate-400">{filtered.length} alerts</span>
      </div>

      {/* Alert cards */}
      <div className="space-y-3">
        {filtered.map((alert) => {
          const s = SEV[alert.severity];
          const Icon = s.icon;
          const isOpen = expanded === alert.id;
          return (
            <div key={alert.id} className={`lc-card ${s.card} overflow-hidden transition-all`}>
              <div className="flex items-start gap-4 p-4 cursor-pointer" onClick={()=>setExpanded(isOpen?null:alert.id)}>
                <div className={`mt-0.5 shrink-0 ${s.iconColor}`}><Icon size={20} weight="duotone"/></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`lc-badge border text-[11px] ${s.badge}`}>{s.label}</span>
                    <span className={`lc-badge border text-[11px] capitalize ${STATUS_BADGE[alert.status]}`}>{alert.status}</span>
                    <span className="text-xs text-slate-400 ml-auto">
                      {new Date(alert.time).toLocaleString('en-AE',{timeZone:'Asia/Dubai',hour:'2-digit',minute:'2-digit',hour12:true,day:'numeric',month:'short'})}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-800 leading-snug">{alert.issue}</p>
                  <div className="flex items-center gap-4 mt-1.5 text-xs text-slate-500">
                    <span className="font-medium text-slate-600">{alert.driverName}</span>
                    <span>·</span>
                    <span className="font-mono">{alert.carPlate}</span>
                  </div>
                </div>
              </div>

              {isOpen && (
                <div className="px-4 pb-4 pt-0 ml-10 space-y-3 border-t border-slate-200/60">
                  <div className="mt-3 p-3 rounded-xl bg-white border border-slate-200">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Recommended Action</p>
                    <p className="text-sm text-slate-700">{alert.recommendedAction}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {alert.status === 'open' && (
                      <>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 text-xs font-semibold hover:bg-amber-100 transition-colors">
                          <Eye size={13}/> Acknowledge
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition-colors">
                          <Check size={13}/> Mark Resolved
                        </button>
                      </>
                    )}
                    {alert.status === 'acknowledged' && (
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition-colors">
                        <CheckCircle size={13}/> Mark Resolved
                      </button>
                    )}
                    {alert.status === 'resolved' && (
                      <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                        <CheckCircle size={13} weight="fill"/> Resolved
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="lc-card p-12 text-center">
            <CheckCircle size={40} weight="duotone" className="text-emerald-400 mx-auto mb-3"/>
            <p className="text-slate-500 text-sm">No alerts match the current filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}

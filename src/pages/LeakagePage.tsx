import { useEffect, useState } from 'react';
import { ShieldWarning, ShieldCheck, ShieldSlash, MagnifyingGlass } from '@phosphor-icons/react';
import { leakageService } from '../services';
import { BoltIcon, UberIcon, YangoIcon, CareemIcon } from '../assets/integrationIcons';
import type { LeakageRecord } from '../data/types';

const PLATFORM_ICONS: Record<string, React.ComponentType<{size?:number}>> = {
  uber: UberIcon, bolt: BoltIcon, yango: YangoIcon, careem: CareemIcon,
};

const RISK: Record<string, { icon: React.ElementType; badge: string; ring: string; label: string; bar: string }> = {
  high:   { icon: ShieldSlash,   badge:'bg-red-100 text-red-700 border-red-200',       ring:'ring-red-200',    label:'High Risk',   bar:'bg-red-500' },
  medium: { icon: ShieldWarning, badge:'bg-amber-100 text-amber-700 border-amber-200', ring:'ring-amber-200',  label:'Medium Risk', bar:'bg-amber-400' },
  low:    { icon: ShieldCheck,   badge:'bg-emerald-100 text-emerald-700 border-emerald-200', ring:'',            label:'Low Risk',    bar:'bg-emerald-400' },
};

export default function LeakagePage() {
  const [records, setRecords] = useState<LeakageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all'|'high'|'medium'|'low'>('all');
  const [search, setSearch] = useState('');

  useEffect(() => { leakageService.getAllDrivers().then(setRecords).finally(()=>setLoading(false)); }, []);

  const filtered = records
    .filter(r => (filter==='all'||r.riskLevel===filter) && r.driverName.toLowerCase().includes(search.toLowerCase()))
    .sort((a,b) => b.riskScore - a.riskScore);

  const counts = {
    high:   records.filter(r=>r.riskLevel==='high').length,
    medium: records.filter(r=>r.riskLevel==='medium').length,
    low:    records.filter(r=>r.riskLevel==='low').length,
  };

  if (loading) return <div className="flex items-center justify-center h-64"><svg className="animate-spin h-8 w-8 text-gold" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg></div>;

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { key:'high',   label:'High Risk Drivers',   count:counts.high,   bg:'bg-red-50 border-red-200',      text:'text-red-600'    },
          { key:'medium', label:'Medium Risk Drivers',  count:counts.medium, bg:'bg-amber-50 border-amber-200',  text:'text-amber-600'  },
          { key:'low',    label:'Low Risk Drivers',     count:counts.low,    bg:'bg-emerald-50 border-emerald-200', text:'text-emerald-600' },
        ].map((s) => (
          <div key={s.key} className={`lc-card p-4 border ${s.bg}`}>
            <p className={`font-display font-bold text-3xl ${s.text}`}>{s.count}</p>
            <p className="text-slate-500 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Detected patterns info */}
      <div className="lc-card p-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Monitored Fraud Patterns</p>
        <div className="flex flex-wrap gap-2">
          {['Online many hours, too few trips','Revenue below zone average','Unusual offline during peak','Cash trips not matching logs',
            'Excessive cancellations','GPS movement without platform revenue','Ending shift early repeatedly',
            'High dead miles / empty driving','Manual fare adjustments','Too much time in low-demand areas'].map((p) => (
            <span key={p} className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">{p}</span>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex rounded-xl overflow-hidden border border-slate-200">
          {(['all','high','medium','low'] as const).map((f) => (
            <button key={f} onClick={()=>setFilter(f)}
              className={`px-3 py-2 text-xs font-semibold transition-colors capitalize ${filter===f?'bg-gold text-surface':'bg-white text-slate-500 hover:bg-slate-50'}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="relative">
          <MagnifyingGlass size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
          <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search driver…"
            className="lc-input pl-8 py-2 text-xs w-44"/>
        </div>
        <span className="ml-auto text-xs text-slate-400">{filtered.length} drivers</span>
      </div>

      {/* Driver risk cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((r) => {
          const risk = RISK[r.riskLevel];
          const RiskIcon = risk.icon;
          const PIcon = PLATFORM_ICONS[r.platform];
          return (
            <div key={r.driverId} className={`lc-card p-5 ${r.riskLevel==='high'?'ring-1 ring-red-200':r.riskLevel==='medium'?'ring-1 ring-amber-200':''}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 ${r.riskLevel==='high'?'bg-red-500':r.riskLevel==='medium'?'bg-amber-500':'bg-emerald-500'}`}>
                    {r.driverName.split(' ').map(p=>p[0]).slice(0,2).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{r.driverName}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-xs text-slate-400">{r.carPlate}</span>
                      {PIcon && <PIcon size={14}/>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`lc-badge border text-xs ${risk.badge}`}>
                    <RiskIcon size={12}/>{risk.label}
                  </span>
                </div>
              </div>

              {/* Risk score bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-slate-500">Risk Score</span>
                  <span className={`text-sm font-bold ${r.riskLevel==='high'?'text-red-600':r.riskLevel==='medium'?'text-amber-600':'text-emerald-600'}`}>{r.riskScore}/100</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${risk.bar}`} style={{ width: `${r.riskScore}%` }}/>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { label:'Online Hrs', value: r.onlineHours, unit:'h' },
                  { label:'Expected Trips', value: r.expectedTrips },
                  { label:'Actual Trips', value: r.actualTrips },
                ].map((s) => (
                  <div key={s.label} className="bg-slate-50 rounded-xl p-2 text-center border border-slate-100">
                    <p className="font-bold text-slate-700 text-sm">{s.value}{s.unit??''}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-slate-50 rounded-xl p-2 text-center border border-slate-100">
                  <p className={`font-bold text-sm ${r.revenueDiff<-20?'text-red-600':r.revenueDiff<0?'text-amber-600':'text-emerald-600'}`}>{r.revenueDiff}%</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">vs Peer Avg</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-2 text-center border border-slate-100">
                  <p className={`font-bold text-sm ${r.cashMismatch>0?'text-red-600':'text-emerald-600'}`}>{r.cashMismatch>0?`AED ${r.cashMismatch}`:'—'}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Cash Mismatch</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-2 text-center border border-slate-100">
                  <p className={`font-bold text-sm ${r.gpsWithoutTrips>0?'text-red-600':'text-emerald-600'}`}>{r.gpsWithoutTrips}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">GPS ≠ Trips</p>
                </div>
              </div>

              {/* Fraud reasons */}
              {r.patterns.length > 0 && (
                <div className="space-y-1.5">
                  {r.patterns.map((p, i) => (
                    <div key={i} className={`flex items-start gap-2 text-xs px-3 py-2 rounded-lg ${r.riskLevel==='high'?'bg-red-50 text-red-700':r.riskLevel==='medium'?'bg-amber-50 text-amber-700':'bg-slate-50 text-slate-600'}`}>
                      <span className="mt-0.5 shrink-0">⚠</span>{p}
                    </div>
                  ))}
                </div>
              )}
              {r.patterns.length === 0 && (
                <p className="text-xs text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg">✓ No suspicious patterns detected</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

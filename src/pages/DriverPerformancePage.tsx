import { useEffect, useState } from 'react';
import { TrendUp, TrendDown, MagnifyingGlass, ArrowsDownUp } from '@phosphor-icons/react';
import { driverService } from '../services';
import { BoltIcon, UberIcon, YangoIcon, CareemIcon } from '../assets/integrationIcons';
import { fmtCurrency } from '../lib/dubai';
import type { Driver } from '../data/types';

const PLATFORM_ICONS: Record<string, React.ComponentType<{size?:number}>> = {
  uber: UberIcon, bolt: BoltIcon, yango: YangoIcon, careem: CareemIcon,
};

const SCORE_STYLE: Record<string, { badge: string; label: string }> = {
  top_performer:  { badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', label: 'Top Performer' },
  acceptable:     { badge: 'bg-blue-100 text-blue-700 border-blue-200',          label: 'Acceptable'    },
  underperformer: { badge: 'bg-amber-100 text-amber-700 border-amber-200',       label: 'Underperformer'},
  critical_review:{ badge: 'bg-red-100 text-red-700 border-red-200',             label: 'Critical Review'},
};

type SortKey = 'driverScore' | 'revenueToday' | 'weeklyRevenue' | 'acceptanceRate' | 'cancellationRate' | 'customerRating';

export default function DriverPerformancePage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('driverScore');
  const [sortAsc, setSortAsc] = useState(false);
  const [filterClass, setFilterClass] = useState('all');

  useEffect(() => { driverService.getAll().then(setDrivers).finally(()=>setLoading(false)); }, []);

  const handleSort = (k: SortKey) => {
    if (k === sortKey) setSortAsc(!sortAsc);
    else { setSortKey(k); setSortAsc(false); }
  };

  const sorted = [...drivers]
    .filter((d) => (filterClass === 'all' || d.scoreClass === filterClass) &&
      (d.name.toLowerCase().includes(search.toLowerCase())))
    .sort((a, b) => {
      const diff = (a[sortKey] as number) - (b[sortKey] as number);
      return sortAsc ? diff : -diff;
    });

  const SortBtn = ({ k, label }: { k: SortKey; label: string }) => (
    <button onClick={() => handleSort(k)}
      className={`flex items-center gap-1 ${sortKey===k?'text-gold font-bold':'text-slate-500'} hover:text-gold transition-colors`}>
      {label}
      {sortKey===k ? (sortAsc ? <TrendUp size={12}/> : <TrendDown size={12}/>) : <ArrowsDownUp size={11} className="opacity-40"/>}
    </button>
  );

  // Score ring component
  const ScoreRing = ({ score }: { score: number }) => {
    const cls = score>=85?'text-emerald-500':score>=70?'text-blue-500':score>=50?'text-amber-500':'text-red-500';
    return (
      <div className="relative w-10 h-10">
        <svg viewBox="0 0 36 36" className="w-10 h-10 -rotate-90">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" strokeWidth="3"/>
          <circle cx="18" cy="18" r="15.9" fill="none"
            stroke={score>=85?'#10b981':score>=70?'#3b82f6':score>=50?'#f59e0b':'#ef4444'}
            strokeWidth="3" strokeLinecap="round"
            strokeDasharray={`${(score/100)*100} 100`}/>
        </svg>
        <span className={`absolute inset-0 flex items-center justify-center text-[11px] font-bold ${cls}`}>
          {score}
        </span>
      </div>
    );
  };

  const counts = {
    top_performer:   drivers.filter(d=>d.scoreClass==='top_performer').length,
    acceptable:      drivers.filter(d=>d.scoreClass==='acceptable').length,
    underperformer:  drivers.filter(d=>d.scoreClass==='underperformer').length,
    critical_review: drivers.filter(d=>d.scoreClass==='critical_review').length,
  };

  if (loading) return <div className="flex items-center justify-center h-64"><svg className="animate-spin h-8 w-8 text-gold" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg></div>;

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Score tier summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { key:'top_performer',   label:'Top Performers (85–100)',   count:counts.top_performer,   bg:'bg-emerald-50 border-emerald-200', text:'text-emerald-700' },
          { key:'acceptable',      label:'Acceptable (70–84)',         count:counts.acceptable,      bg:'bg-blue-50 border-blue-200',       text:'text-blue-700' },
          { key:'underperformer',  label:'Underperformers (50–69)',    count:counts.underperformer,  bg:'bg-amber-50 border-amber-200',     text:'text-amber-700' },
          { key:'critical_review', label:'Critical Review (<50)',      count:counts.critical_review, bg:'bg-red-50 border-red-200',         text:'text-red-700' },
        ].map((t) => (
          <button key={t.key} onClick={()=>setFilterClass(filterClass===t.key?'all':t.key)}
            className={`lc-card p-4 text-left border transition-all hover:shadow-md ${filterClass===t.key?'ring-2 ring-gold':''}`}>
            <p className={`font-display font-bold text-3xl ${t.text}`}>{t.count}</p>
            <p className="text-slate-500 text-xs mt-1 leading-tight">{t.label}</p>
          </button>
        ))}
      </div>

      {/* Score formula */}
      <div className="lc-card p-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Score Formula (out of 100)</p>
        <div className="flex flex-wrap gap-2">
          {[
            { label:'Revenue Efficiency', pct:'25%', color:'bg-purple-100 text-purple-700' },
            { label:'Trip Count',          pct:'20%', color:'bg-blue-100 text-blue-700' },
            { label:'Idle Time Control',   pct:'15%', color:'bg-amber-100 text-amber-700' },
            { label:'Acceptance Rate',     pct:'10%', color:'bg-emerald-100 text-emerald-700' },
            { label:'Cancellation Rate',   pct:'10%', color:'bg-red-100 text-red-700' },
            { label:'Online Discipline',   pct:'10%', color:'bg-indigo-100 text-indigo-700' },
            { label:'Complaint Quality',   pct:'10%', color:'bg-pink-100 text-pink-700' },
          ].map((f) => (
            <span key={f.label} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${f.color}`}>
              <span className="font-bold">{f.pct}</span> {f.label}
            </span>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <MagnifyingGlass size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
          <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search driver…"
            className="lc-input pl-8 py-2 text-xs"/>
        </div>
        <span className="text-xs text-slate-400 ml-auto">{sorted.length} drivers</span>
      </div>

      {/* Table */}
      <div className="lc-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="lc-table-header">Driver</th>
                <th className="lc-table-header">Platform</th>
                <th className="lc-table-header"><SortBtn k="driverScore" label="Score"/></th>
                <th className="lc-table-header">Class</th>
                <th className="lc-table-header"><SortBtn k="revenueToday" label="Daily Rev"/></th>
                <th className="lc-table-header"><SortBtn k="weeklyRevenue" label="Weekly Rev"/></th>
                <th className="lc-table-header">Trips/Shift</th>
                <th className="lc-table-header">Rev/Hr</th>
                <th className="lc-table-header">Avg Trip</th>
                <th className="lc-table-header">Idle %</th>
                <th className="lc-table-header"><SortBtn k="acceptanceRate" label="Accept%"/></th>
                <th className="lc-table-header"><SortBtn k="cancellationRate" label="Cancel%"/></th>
                <th className="lc-table-header">Peak Util%</th>
                <th className="lc-table-header">Discipline</th>
                <th className="lc-table-header">Cash Mismatch</th>
                <th className="lc-table-header">Complaints</th>
                <th className="lc-table-header"><SortBtn k="customerRating" label="Rating"/></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((d) => {
                const PIcon = PLATFORM_ICONS[d.platform];
                const sc = SCORE_STYLE[d.scoreClass];
                return (
                  <tr key={d.id} className={`lc-table-row ${d.scoreClass==='critical_review'?'bg-red-50/30':d.scoreClass==='underperformer'?'bg-amber-50/20':''}`}>
                    <td className="lc-table-cell font-medium text-slate-800 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gold/60 to-gold-dark/60 flex items-center justify-center text-white font-bold text-[10px] shrink-0">
                          {d.name.split(' ').map(p=>p[0]).slice(0,2).join('')}
                        </div>
                        <span className="max-w-[120px] truncate text-xs">{d.name}</span>
                      </div>
                    </td>
                    <td className="lc-table-cell">{PIcon&&<PIcon size={18}/>}</td>
                    <td className="lc-table-cell"><ScoreRing score={d.driverScore}/></td>
                    <td className="lc-table-cell whitespace-nowrap">
                      <span className={`lc-badge border text-xs ${sc.badge}`}>{sc.label}</span>
                    </td>
                    <td className="lc-table-cell font-semibold text-slate-700 whitespace-nowrap">{fmtCurrency(d.revenueToday)}</td>
                    <td className="lc-table-cell font-semibold text-slate-700 whitespace-nowrap">{fmtCurrency(d.weeklyRevenue)}</td>
                    <td className="lc-table-cell text-center">{d.tripsPerShift}</td>
                    <td className="lc-table-cell text-center">{fmtCurrency(d.revenuePerOnlineHour)}</td>
                    <td className="lc-table-cell text-center">{fmtCurrency(d.avgTripValue)}</td>
                    <td className={`lc-table-cell text-center font-semibold ${d.idleTimePct>40?'text-red-500':d.idleTimePct>25?'text-amber-600':'text-emerald-600'}`}>{d.idleTimePct}%</td>
                    <td className={`lc-table-cell text-center font-semibold ${d.acceptanceRate<75?'text-red-500':d.acceptanceRate<85?'text-amber-600':'text-emerald-600'}`}>{d.acceptanceRate}%</td>
                    <td className={`lc-table-cell text-center font-semibold ${d.cancellationRate>15?'text-red-500':d.cancellationRate>10?'text-amber-600':'text-slate-600'}`}>{d.cancellationRate}%</td>
                    <td className={`lc-table-cell text-center font-semibold ${d.peakHourUtilization>80?'text-emerald-600':d.peakHourUtilization>60?'text-amber-600':'text-red-500'}`}>{d.peakHourUtilization}%</td>
                    <td className={`lc-table-cell text-center font-semibold ${d.onlineDiscipline>85?'text-emerald-600':d.onlineDiscipline>70?'text-amber-600':'text-red-500'}`}>{d.onlineDiscipline}</td>
                    <td className={`lc-table-cell text-center font-semibold ${d.cashCollectionMismatch>0?'text-red-500':'text-emerald-600'}`}>
                      {d.cashCollectionMismatch>0 ? `AED ${d.cashCollectionMismatch}` : '—'}
                    </td>
                    <td className={`lc-table-cell text-center font-semibold ${d.customerComplaints>3?'text-red-500':d.customerComplaints>0?'text-amber-600':'text-emerald-600'}`}>{d.customerComplaints}</td>
                    <td className={`lc-table-cell text-center font-semibold ${d.customerRating>=4.7?'text-emerald-600':d.customerRating>=4.2?'text-amber-600':'text-red-500'}`}>{d.customerRating}⭐</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Phone, Bell, Flag, Lock, Note,
  Table, MapPin, MagnifyingGlass, FunnelSimple,
} from '@phosphor-icons/react';
import { driverService } from '../services';
import { BoltIcon, UberIcon, YangoIcon, CareemIcon } from '../assets/integrationIcons';
import FleetMap from '../components/map/FleetMap';
import type { Driver } from '../data/types';

const PLATFORM_ICONS: Record<string, React.ComponentType<{size?:number}>> = {
  uber: UberIcon, bolt: BoltIcon, yango: YangoIcon, careem: CareemIcon,
};

const STATUS_BADGE: Record<string, string> = {
  on_trip:  'bg-blue-50 text-blue-700 border-blue-200',
  waiting:  'bg-emerald-50 text-emerald-700 border-emerald-200',
  break:    'bg-amber-50 text-amber-700 border-amber-200',
  offline:  'bg-gray-100 text-gray-500 border-gray-200',
};

const ALERT_BADGE: Record<string, string> = {
  normal:   'text-emerald-500',
  warning:  'bg-amber-50 text-amber-700 border border-amber-200',
  critical: 'bg-red-50 text-red-700 border border-red-200',
};

export default function LiveOperationsPage() {
  const [searchParams] = useSearchParams();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  // Default: map — unless caller passes ?view=table (e.g. from Dashboard "View All")
  const [view, setView] = useState<'table' | 'map'>(
    searchParams.get('view') === 'table' ? 'table' : 'map'
  );
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [actionDriver, setActionDriver] = useState<Driver | null>(null);
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    driverService.getAll().then(setDrivers).finally(() => setLoading(false));
  }, []);

  const filtered = drivers.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.currentZone.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || d.status === filterStatus;
    return matchSearch && matchStatus;
  });

  if (loading) return <div className="flex items-center justify-center h-64"><svg className="animate-spin h-8 w-8 text-gold" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg></div>;

  return (
    <div className="space-y-4 animate-fade-in">

      {/* ── Toolbar ── */}
      <div className="lc-card p-4 flex flex-wrap items-center gap-3">
        {/* View toggle */}
        <div className="flex rounded-xl overflow-hidden border border-slate-200">
          {[{ id:'table', Icon:Table, label:'Table' }, { id:'map', Icon:MapPin, label:'Map' }].map(({ id, Icon, label }) => (
            <button key={id} onClick={() => setView(id as 'table'|'map')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold transition-colors ${view===id ? 'bg-gold text-surface' : 'bg-white text-slate-500 hover:bg-slate-50'}`}>
              <Icon size={14}/>{label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <MagnifyingGlass size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
          <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search driver or zone…"
            className="lc-input pl-8 py-2 text-xs" />
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1.5">
          <FunnelSimple size={14} className="text-slate-400"/>
          <select value={filterStatus} onChange={(e)=>setFilterStatus(e.target.value)}
            className="lc-input py-2 text-xs w-32">
            <option value="all">All Status</option>
            <option value="on_trip">On Trip</option>
            <option value="waiting">Waiting</option>
            <option value="break">Break</option>
            <option value="offline">Offline</option>
          </select>
        </div>

        <div className="ml-auto text-xs text-slate-400">{filtered.length} drivers</div>
      </div>

      {view === 'map' ? (
        <div className="lc-card overflow-hidden" style={{ height: '560px' }}>
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block"/>
            Live GPS — Dubai Fleet ({filtered.length} vehicles)
          </div>
          <FleetMap drivers={filtered} />
        </div>
      ) : (
        <div className="lc-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  {['Driver','Car','Platform','Login','Trips','Trip Status','Last Trip','Idle','Revenue','Accept%','Cancel%','Rating','Last Ping','Alert','Actions'].map((h) => (
                    <th key={h} className="lc-table-header">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => {
                  const PIcon = PLATFORM_ICONS[d.platform];
                  return (
                    <tr key={d.id} className={`lc-table-row ${d.alertStatus==='critical'?'bg-red-50/40':d.alertStatus==='warning'?'bg-amber-50/40':''}`}>
                      <td className="lc-table-cell font-medium text-slate-800 whitespace-nowrap min-w-[140px]">
                        <div>
                          <p className="text-sm">{d.name.split(' ').slice(0,2).join(' ')}</p>
                          <p className="text-[11px] text-slate-400">{d.phone}</p>
                        </div>
                      </td>
                      <td className="lc-table-cell font-mono text-xs text-slate-600 whitespace-nowrap">
                        {/* car plate from car data — API would join */}
                        {`D ${d.id.replace('DRV','')}`}***
                      </td>
                      <td className="lc-table-cell">
                        {PIcon && <PIcon size={18}/>}
                      </td>
                      <td className="lc-table-cell text-xs text-slate-500 whitespace-nowrap">
                        {new Date(d.loginTime).toLocaleTimeString('en-AE',{timeZone:'Asia/Dubai',hour:'2-digit',minute:'2-digit',hour12:true})}
                      </td>
                      <td className="lc-table-cell text-center font-semibold text-slate-700">{d.tripsCompleted}</td>
                      <td className="lc-table-cell whitespace-nowrap">
                        <span className={`lc-badge border text-xs ${STATUS_BADGE[d.status]}`}>
                          {d.status.replace('_',' ')}
                        </span>
                      </td>
                      <td className="lc-table-cell text-xs text-slate-400 whitespace-nowrap">
                        {new Date(d.lastTripTime).toLocaleTimeString('en-AE',{timeZone:'Asia/Dubai',hour:'2-digit',minute:'2-digit',hour12:true})}
                      </td>
                      <td className={`lc-table-cell text-center font-semibold ${d.idleMinutes>45?'text-red-500':d.idleMinutes>25?'text-amber-600':'text-slate-600'}`}>
                        {d.idleMinutes}m
                      </td>
                      <td className="lc-table-cell font-semibold text-slate-800 whitespace-nowrap">AED {d.revenueToday}</td>
                      <td className={`lc-table-cell text-center font-semibold ${d.acceptanceRate<75?'text-red-500':d.acceptanceRate<85?'text-amber-600':'text-emerald-600'}`}>
                        {d.acceptanceRate}%
                      </td>
                      <td className={`lc-table-cell text-center font-semibold ${d.cancellationRate>15?'text-red-500':d.cancellationRate>10?'text-amber-600':'text-slate-600'}`}>
                        {d.cancellationRate}%
                      </td>
                      <td className="lc-table-cell text-center">
                        <span className={`font-semibold ${d.customerRating>=4.7?'text-emerald-600':d.customerRating>=4.2?'text-amber-600':'text-red-500'}`}>
                          {d.customerRating}⭐
                        </span>
                      </td>
                      <td className="lc-table-cell text-xs text-slate-400 whitespace-nowrap">
                        {new Date(d.lastGpsPing).toLocaleTimeString('en-AE',{timeZone:'Asia/Dubai',hour:'2-digit',minute:'2-digit',hour12:true})}
                      </td>
                      <td className="lc-table-cell">
                        {d.alertStatus==='critical' && <span className={`lc-badge border text-xs ${ALERT_BADGE.critical}`}>⚠ Critical</span>}
                        {d.alertStatus==='warning'  && <span className={`lc-badge border text-xs ${ALERT_BADGE.warning}`}>⚠ Warning</span>}
                        {d.alertStatus==='normal'   && <span className={ALERT_BADGE.normal}>✓ OK</span>}
                      </td>
                      <td className="lc-table-cell whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <button title="Call driver" onClick={()=>setActionDriver(d)} className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"><Phone size={13} weight="fill"/></button>
                          <button title="Send reminder" onClick={()=>setActionDriver(d)} className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"><Bell size={13} weight="fill"/></button>
                          <button title="Flag for supervisor" onClick={()=>setActionDriver(d)} className="p-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"><Flag size={13} weight="fill"/></button>
                          <button title="Suspend priority" onClick={()=>setActionDriver(d)} className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"><Lock size={13} weight="fill"/></button>
                          <button title="Add note" onClick={()=>{setActionDriver(d);setNoteText('');}} className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"><Note size={13} weight="fill"/></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Action modal ── */}
      {actionDriver && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={()=>setActionDriver(null)}>
          <div className="lc-card p-6 w-full max-w-sm" onClick={(e)=>e.stopPropagation()}>
            <h3 className="font-semibold text-slate-800 mb-1">{actionDriver.name}</h3>
            <p className="text-slate-400 text-xs mb-4">{actionDriver.currentZone} · {actionDriver.platform}</p>
            <div className="space-y-2">
              {[
                { icon:Phone,  label:'Call Driver',                      color:'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' },
                { icon:Bell,   label:'Send Reminder Notification',       color:'text-blue-600 bg-blue-50 hover:bg-blue-100' },
                { icon:Flag,   label:'Mark for Supervisor Follow-up',    color:'text-amber-600 bg-amber-50 hover:bg-amber-100' },
                { icon:Lock,   label:'Suspend from Priority Assignment', color:'text-red-600 bg-red-50 hover:bg-red-100' },
              ].map(({ icon: Icon, label, color }) => (
                <button key={label} className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${color}`}
                  onClick={()=>setActionDriver(null)}>
                  <Icon size={16} weight="fill"/>{label}
                </button>
              ))}
              <div>
                <textarea value={noteText} onChange={(e)=>setNoteText(e.target.value)}
                  placeholder="Add note…" rows={2}
                  className="lc-input text-xs mt-1 resize-none"/>
                <button onClick={()=>setActionDriver(null)}
                  className="btn-primary w-full mt-2 text-xs h-9">
                  <Note size={14}/> Save Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

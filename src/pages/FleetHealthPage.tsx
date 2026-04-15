import { useEffect, useState } from 'react';
import { Heartbeat, Wrench, Warning, CheckCircle, MagnifyingGlass } from '@phosphor-icons/react';
import { carService } from '../services';
import { fmtCurrency, fmtDubaiDate } from '../lib/dubai';
import { BoltIcon, UberIcon, YangoIcon, CareemIcon } from '../assets/integrationIcons';
import type { Car } from '../data/types';

const PLATFORM_ICONS: Record<string, React.ComponentType<{size?:number}>> = {
  uber: UberIcon, bolt: BoltIcon, yango: YangoIcon, careem: CareemIcon,
};

const DECISION: Record<string, { label:string; color:string; bg:string }> = {
  keep:    { label:'Keep',    color:'text-emerald-700', bg:'bg-emerald-100 border-emerald-200' },
  rotate:  { label:'Rotate', color:'text-blue-700',    bg:'bg-blue-100 border-blue-200'       },
  repair:  { label:'Repair', color:'text-amber-700',   bg:'bg-amber-100 border-amber-200'     },
  replace: { label:'Replace',color:'text-red-700',     bg:'bg-red-100 border-red-200'         },
  sell:    { label:'Sell',   color:'text-slate-700',   bg:'bg-slate-200 border-slate-300'     },
};

function expiryColor(dateStr: string): string {
  const days = Math.floor((new Date(dateStr).getTime() - Date.now()) / 86400000);
  if (days < 0)   return 'text-red-600 font-bold';
  if (days < 30)  return 'text-red-500 font-semibold';
  if (days < 90)  return 'text-amber-500 font-semibold';
  return 'text-slate-500';
}

function expiryIcon(dateStr: string) {
  const days = Math.floor((new Date(dateStr).getTime() - Date.now()) / 86400000);
  if (days < 30) return <Warning size={13} weight="fill" className="text-red-500"/>;
  if (days < 90) return <Warning size={13} weight="fill" className="text-amber-400"/>;
  return <CheckCircle size={13} weight="fill" className="text-emerald-400"/>;
}

export default function FleetHealthPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterDecision, setFilterDecision] = useState('all');

  useEffect(() => { carService.getAll().then(setCars).finally(()=>setLoading(false)); }, []);

  const filtered = cars.filter(c =>
    (filterDecision==='all'||c.fleetDecision===filterDecision) &&
    (c.plateNumber.toLowerCase().includes(search.toLowerCase()) ||
     `${c.make} ${c.model}`.toLowerCase().includes(search.toLowerCase()))
  );

  const decisionCounts = Object.fromEntries(
    ['keep','rotate','repair','replace','sell'].map(k => [k, cars.filter(c=>c.fleetDecision===k).length])
  );

  if (loading) return <div className="flex items-center justify-center h-64"><svg className="animate-spin h-8 w-8 text-gold" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg></div>;

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Decision summary */}
      <div className="grid grid-cols-3 lg:grid-cols-5 gap-3">
        {(['keep','rotate','repair','replace','sell'] as const).map((d) => {
          const dec = DECISION[d];
          return (
            <button key={d} onClick={()=>setFilterDecision(filterDecision===d?'all':d)}
              className={`lc-card p-4 text-left border transition-all hover:shadow-md ${filterDecision===d?'ring-2 ring-gold':''} ${dec.bg}`}>
              <p className={`font-display font-bold text-2xl ${dec.color}`}>{decisionCounts[d]}</p>
              <p className="text-slate-500 text-xs mt-1 capitalize">{dec.label}</p>
            </button>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <MagnifyingGlass size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
          <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search plate or model…"
            className="lc-input pl-8 py-2 text-xs w-52"/>
        </div>
        <span className="ml-auto text-xs text-slate-400">{filtered.length} vehicles</span>
      </div>

      {/* Fleet table */}
      <div className="lc-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                {['Plate','Car','Platform','Active Days','Maintenance Due','Tires Due','Insurance Exp.','Registration Exp.','Accidents','Downtime','Rev (30d)','Net (30d)','Decision'].map((h) => (
                  <th key={h} className="lc-table-header">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((car) => {
                const dec = DECISION[car.fleetDecision];
                const PIcon = PLATFORM_ICONS[car.platform];
                return (
                  <tr key={car.id} className={`lc-table-row ${car.fleetDecision==='replace'||car.fleetDecision==='sell'?'bg-red-50/30':car.fleetDecision==='repair'?'bg-amber-50/20':''}`}>
                    <td className="lc-table-cell font-mono font-semibold text-slate-800 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {car.alertStatus==='critical'?<Warning size={13} className="text-red-500" weight="fill"/>:
                         car.alertStatus==='warning'?<Warning size={13} className="text-amber-400" weight="fill"/>:
                         <CheckCircle size={13} className="text-emerald-400" weight="fill"/>}
                        {car.plateNumber}
                      </div>
                    </td>
                    <td className="lc-table-cell text-slate-600 whitespace-nowrap text-xs">{car.year} {car.make} {car.model}</td>
                    <td className="lc-table-cell">{PIcon&&<PIcon size={16}/>}</td>
                    <td className="lc-table-cell text-center text-slate-600">{car.activeDays}</td>
                    <td className={`lc-table-cell whitespace-nowrap text-xs ${expiryColor(car.maintenanceDue)}`}>
                      <div className="flex items-center gap-1">{expiryIcon(car.maintenanceDue)}{fmtDubaiDate(car.maintenanceDue)}</div>
                    </td>
                    <td className={`lc-table-cell whitespace-nowrap text-xs ${expiryColor(car.tireChangeDue)}`}>
                      <div className="flex items-center gap-1">{expiryIcon(car.tireChangeDue)}{fmtDubaiDate(car.tireChangeDue)}</div>
                    </td>
                    <td className={`lc-table-cell whitespace-nowrap text-xs ${expiryColor(car.insuranceExpiry)}`}>
                      <div className="flex items-center gap-1">{expiryIcon(car.insuranceExpiry)}{fmtDubaiDate(car.insuranceExpiry)}</div>
                    </td>
                    <td className={`lc-table-cell whitespace-nowrap text-xs ${expiryColor(car.registrationExpiry)}`}>
                      <div className="flex items-center gap-1">{expiryIcon(car.registrationExpiry)}{fmtDubaiDate(car.registrationExpiry)}</div>
                    </td>
                    <td className={`lc-table-cell text-center font-semibold ${car.accidentHistory>1?'text-red-500':car.accidentHistory===1?'text-amber-600':'text-emerald-600'}`}>
                      {car.accidentHistory}
                    </td>
                    <td className={`lc-table-cell text-center font-semibold ${car.downtimeDays>20?'text-red-500':car.downtimeDays>10?'text-amber-600':'text-slate-600'}`}>
                      {car.downtimeDays}d
                    </td>
                    <td className="lc-table-cell font-semibold text-slate-700 whitespace-nowrap">{fmtCurrency(car.revenueLast30Days)}</td>
                    <td className={`lc-table-cell font-bold whitespace-nowrap ${car.netProfitLast30Days>=0?'text-emerald-600':'text-red-600'}`}>
                      {car.netProfitLast30Days>=0?'+':''}{fmtCurrency(car.netProfitLast30Days)}
                    </td>
                    <td className="lc-table-cell whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {car.fleetDecision==='replace'||car.fleetDecision==='sell'?<Wrench size={13} className="text-red-500"/>:
                         car.fleetDecision==='repair'?<Wrench size={13} className="text-amber-500"/>:
                         <Heartbeat size={13} className="text-emerald-500"/>}
                        <span className={`lc-badge border text-xs ${dec.bg} ${dec.color}`}>{dec.label}</span>
                      </div>
                    </td>
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

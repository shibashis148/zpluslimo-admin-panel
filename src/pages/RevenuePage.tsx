import { useEffect, useState } from 'react';
import { revenueService } from '../services';
import { BoltIcon, UberIcon, YangoIcon, CareemIcon } from '../assets/integrationIcons';
import { fmtCurrency } from '../lib/dubai';
import type { RevenueRow } from '../data/types';

const PLATFORM_ICONS: Record<string, React.ComponentType<{size?:number}>> = {
  uber: UberIcon, bolt: BoltIcon, yango: YangoIcon, careem: CareemIcon,
};

export default function RevenuePage() {
  const [rows, setRows] = useState<RevenueRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [groupBy, setGroupBy] = useState<'car'|'driver'|'platform'>('driver');
  const [filterPlatform, setFilterPlatform] = useState('all');

  useEffect(() => { revenueService.getAll().then(setRows).finally(()=>setLoading(false)); }, []);

  const filtered = rows.filter(r => filterPlatform === 'all' || r.platform === filterPlatform);

  // Aggregate by groupBy
  const aggregated = (() => {
    const map = new Map<string, RevenueRow & { count: number }>();
    filtered.forEach((r) => {
      const key = groupBy === 'car' ? r.carPlate : groupBy === 'driver' ? r.driverName : r.platform;
      const ex = map.get(key);
      if (ex) {
        ex.grossRevenue += r.grossRevenue; ex.platformCommission += r.platformCommission;
        ex.driverPayout += r.driverPayout; ex.fuelCost += r.fuelCost;
        ex.salikTolls += r.salikTolls; ex.parking += r.parking;
        ex.leaseEmi += r.leaseEmi; ex.insuranceAlloc += r.insuranceAlloc;
        ex.maintenanceReserve += r.maintenanceReserve; ex.netContribution += r.netContribution;
        ex.count++;
      } else {
        map.set(key, { ...r, count: 1 });
      }
    });
    return [...map.values()].sort((a,b) => b.netContribution - a.netContribution);
  })();

  const totals = aggregated.reduce((acc, r) => ({
    grossRevenue: acc.grossRevenue + r.grossRevenue,
    platformCommission: acc.platformCommission + r.platformCommission,
    driverPayout: acc.driverPayout + r.driverPayout,
    fuelCost: acc.fuelCost + r.fuelCost,
    salikTolls: acc.salikTolls + r.salikTolls,
    parking: acc.parking + r.parking,
    leaseEmi: acc.leaseEmi + r.leaseEmi,
    insuranceAlloc: acc.insuranceAlloc + r.insuranceAlloc,
    maintenanceReserve: acc.maintenanceReserve + r.maintenanceReserve,
    netContribution: acc.netContribution + r.netContribution,
  }), { grossRevenue:0, platformCommission:0, driverPayout:0, fuelCost:0, salikTolls:0, parking:0, leaseEmi:0, insuranceAlloc:0, maintenanceReserve:0, netContribution:0 });

  // Platform profitability summary
  const platformSummary = ['uber','bolt','yango','careem'].map((p) => {
    const pr = rows.filter(r => r.platform === p);
    const rev = pr.reduce((s,r) => s + r.grossRevenue, 0);
    const net = pr.reduce((s,r) => s + r.netContribution, 0);
    return { platform: p, revenue: rev, net, margin: rev > 0 ? Math.round((net/rev)*100) : 0 };
  }).sort((a,b) => b.margin - a.margin);

  if (loading) return <div className="flex items-center justify-center h-64"><svg className="animate-spin h-8 w-8 text-gold" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg></div>;

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label:'Gross Revenue',   value:fmtCurrency(totals.grossRevenue),      color:'text-purple-700', bg:'bg-purple-50' },
          { label:'Net Contribution',value:fmtCurrency(totals.netContribution),   color:totals.netContribution>=0?'text-emerald-700':'text-red-600', bg:totals.netContribution>=0?'bg-emerald-50':'bg-red-50' },
          { label:'Platform Fees',   value:fmtCurrency(totals.platformCommission), color:'text-blue-700',  bg:'bg-blue-50' },
          { label:'Total Driver Pay',value:fmtCurrency(totals.driverPayout),       color:'text-amber-700', bg:'bg-amber-50' },
        ].map((k) => (
          <div key={k.label} className={`lc-card p-4 border ${k.bg}`}>
            <p className={`font-display font-bold text-2xl ${k.color}`}>{k.value}</p>
            <p className="text-slate-500 text-xs mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Platform profitability ranking */}
      <div className="lc-card p-5">
        <h3 className="font-semibold text-slate-800 mb-4">Best Platform by Profitability</h3>
        <div className="space-y-3">
          {platformSummary.map((p, i) => {
            const PIcon = PLATFORM_ICONS[p.platform];
            return (
              <div key={p.platform} className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${i===0?'bg-gold/20 text-gold':i===1?'bg-slate-200 text-slate-600':'bg-slate-100 text-slate-400'}`}>{i+1}</span>
                <div className="w-7 h-7 flex items-center justify-center shrink-0">{PIcon&&<PIcon size={18}/>}</div>
                <span className="text-sm font-medium text-slate-700 capitalize w-16">{p.platform}</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${p.margin>=0?'bg-emerald-400':'bg-red-400'}`} style={{ width: `${Math.abs(p.margin)}%`, maxWidth:'100%' }}/>
                </div>
                <span className={`text-xs font-bold w-16 text-right ${p.margin>=0?'text-emerald-600':'text-red-500'}`}>{p.margin}% margin</span>
                <span className="text-xs text-slate-400 w-28 text-right">{fmtCurrency(p.revenue)} gross</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters + groupBy */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex rounded-xl overflow-hidden border border-slate-200">
          {(['driver','car','platform'] as const).map((g) => (
            <button key={g} onClick={()=>setGroupBy(g)}
              className={`px-3 py-2 text-xs font-semibold transition-colors capitalize ${groupBy===g?'bg-gold text-surface':'bg-white text-slate-500 hover:bg-slate-50'}`}>
              By {g}
            </button>
          ))}
        </div>
        <select value={filterPlatform} onChange={(e)=>setFilterPlatform(e.target.value)}
          className="lc-input py-2 text-xs w-36">
          <option value="all">All Platforms</option>
          <option value="uber">Uber</option>
          <option value="bolt">Bolt</option>
          <option value="yango">Yango</option>
          <option value="careem">Careem</option>
        </select>
        <span className="ml-auto text-xs text-slate-400">{aggregated.length} rows</span>
      </div>

      {/* Breakdown table */}
      <div className="lc-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                {['#',groupBy==='platform'?'Platform':groupBy==='car'?'Car':'Driver','Gross Revenue','Platform Fee','Driver Payout','Fuel','Salik/Tolls','Parking','Lease/EMI','Insurance','Maint. Reserve','Net Contribution'].map((h) => (
                  <th key={h} className="lc-table-header capitalize">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {aggregated.map((r, i) => {
                const PIcon = PLATFORM_ICONS[r.platform];
                return (
                  <tr key={i} className={`lc-table-row ${r.netContribution<0?'bg-red-50/30':r.netContribution>80?'bg-emerald-50/20':''}`}>
                    <td className="lc-table-cell text-slate-400 text-xs">{i+1}</td>
                    <td className="lc-table-cell font-medium text-slate-800 whitespace-nowrap">
                      {groupBy==='platform' ? (
                        <div className="flex items-center gap-2">{PIcon&&<PIcon size={16}/>}<span className="capitalize">{r.platform}</span></div>
                      ) : (
                        <span>{groupBy==='car'?r.carPlate:r.driverName}</span>
                      )}
                    </td>
                    <td className="lc-table-cell font-semibold text-slate-800">{fmtCurrency(r.grossRevenue)}</td>
                    <td className="lc-table-cell text-red-500">{fmtCurrency(r.platformCommission)}</td>
                    <td className="lc-table-cell text-red-500">{fmtCurrency(r.driverPayout)}</td>
                    <td className="lc-table-cell text-red-500">{fmtCurrency(r.fuelCost)}</td>
                    <td className="lc-table-cell text-red-500">{fmtCurrency(r.salikTolls)}</td>
                    <td className="lc-table-cell text-red-500">{fmtCurrency(r.parking)}</td>
                    <td className="lc-table-cell text-red-500">{fmtCurrency(r.leaseEmi)}</td>
                    <td className="lc-table-cell text-red-500">{fmtCurrency(r.insuranceAlloc)}</td>
                    <td className="lc-table-cell text-red-500">{fmtCurrency(r.maintenanceReserve)}</td>
                    <td className={`lc-table-cell font-bold text-base ${r.netContribution>=0?'text-emerald-600':'text-red-600'}`}>
                      {r.netContribution>=0?'+':''}{fmtCurrency(r.netContribution)}
                    </td>
                  </tr>
                );
              })}
              {/* Totals */}
              <tr className="bg-slate-50 border-t-2 border-slate-300 font-bold">
                <td className="lc-table-cell text-xs text-slate-500" colSpan={2}>TOTAL</td>
                <td className="lc-table-cell text-slate-800">{fmtCurrency(totals.grossRevenue)}</td>
                <td className="lc-table-cell text-red-600">{fmtCurrency(totals.platformCommission)}</td>
                <td className="lc-table-cell text-red-600">{fmtCurrency(totals.driverPayout)}</td>
                <td className="lc-table-cell text-red-600">{fmtCurrency(totals.fuelCost)}</td>
                <td className="lc-table-cell text-red-600">{fmtCurrency(totals.salikTolls)}</td>
                <td className="lc-table-cell text-red-600">{fmtCurrency(totals.parking)}</td>
                <td className="lc-table-cell text-red-600">{fmtCurrency(totals.leaseEmi)}</td>
                <td className="lc-table-cell text-red-600">{fmtCurrency(totals.insuranceAlloc)}</td>
                <td className="lc-table-cell text-red-600">{fmtCurrency(totals.maintenanceReserve)}</td>
                <td className={`lc-table-cell text-lg ${totals.netContribution>=0?'text-emerald-700':'text-red-700'}`}>
                  {totals.netContribution>=0?'+':''}{fmtCurrency(totals.netContribution)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

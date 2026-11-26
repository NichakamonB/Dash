import { Card, ChartBox } from './ui';
export default function Workload({ m, dark }) {
  return (
    <Card className="p-5">
      <h2 className="text-base font-bold mb-4">Machine &amp; Team Workload (Active Jobs)</h2>
      <ChartBox dark={dark} height={300} type="bar"
        data={{ labels: m.machineList.map(x => x.name), datasets: [
          { label: 'Active (In-Process)', data: m.machineList.map(x => x.run.length), backgroundColor: '#8b5cf6' },
          { label: 'Queue (Waiting)', data: m.machineList.map(x => x.queue.length), backgroundColor: '#c4b5fd' },
        ] }}
        options={{ scales: { y: { stacked: true, beginAtZero: true, ticks: { precision: 0 } }, x: { stacked: true, grid: { display: false } } }, plugins: { legend: { position: 'top', align: 'end' } } }} />
      <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 my-4 border-t border-slate-100 dark:border-slate-700 pt-4">Workload Details per Machine (Active &amp; Queue)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {m.machineList.map(x => (
          <div key={x.name} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-bold text-sm text-slate-700 dark:text-slate-200">{x.name}</h4>
              <span className="text-[10px] bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full text-slate-500 dark:text-slate-400">Total: {x.run.length + x.queue.length}</span>
            </div>
            <p className="text-[10px] font-semibold text-slate-400 mb-1">กำลังรัน</p>
            <div className="bg-blue-50 dark:bg-blue-900/20 px-2 py-1.5 rounded border border-blue-100 dark:border-blue-800/50 text-sm mb-3">
              {x.run.length ? <b className="text-blue-600 dark:text-blue-400">{x.run.map(j => j.JobNo).join(', ')}</b> : <i className="text-xs text-slate-400">Idle</i>}
            </div>
            <p className="text-[10px] font-semibold text-slate-400 mb-1 border-b border-slate-100 dark:border-slate-700 pb-1">คิวถัดไป (Top 3)</p>
            {x.queue.length ? x.queue.slice(0, 3).map(j => (
              <div key={j.JobNo} className="flex justify-between text-xs py-1">
                <span className="font-medium text-slate-600 dark:text-slate-300">{j.JobNo}</span>
                <span className="text-slate-400">{j.Qty}p</span>
              </div>
            )) : <div className="text-xs text-slate-400 italic py-1">ไม่มีคิว</div>}
          </div>
        ))}
      </div>
    </Card>
  );
}

import { Card, ChartBox } from './ui';
import { STATUS } from '../data';

// สถานะที่นับเป็นงานค้าง (ไม่รวม Done) พร้อมชื่อที่แสดงในกราฟ
const STACK = [
  ['In-Process', 'กำลังผลิต'],
  ['Waiting', 'รอ'],
  ['Hold/Problem', 'ติดปัญหา'],
];

export default function Bottlenecks({ m, dark }) {
  const max = Math.max(1, ...m.deptNames.map(d => m.depts[d].length));

  return (
    <Card className="xl:col-span-2 p-6 flex flex-col">
      <h2 className="text-base font-bold mb-4">Bottlenecks (Active Jobs per Department)</h2>
      <ChartBox dark={dark} height={280} type="bar"
        data={{
          labels: m.deptNames,
          datasets: STACK.map(([status, label]) => ({
            label,
            data: m.deptNames.map(d => m.depts[d].filter(j => j.Status === status).length),
            backgroundColor: STATUS[status].color,
            borderRadius: 3,
            borderSkipped: false,
          })),
        }}
        options={{
          scales: {
            y: { stacked: true, beginAtZero: true, ticks: { precision: 0 } },
            x: { stacked: true, grid: { display: false } },
          },
          plugins: {
            legend: { position: 'top', align: 'end', labels: { usePointStyle: true, padding: 16 } },
          },
        }} />

      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
        <h3 className="text-sm font-bold text-slate-600 dark:text-slate-300 mb-4">
          Pending Jobs Breakdown by Department
        </h3>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-4">
          {m.deptNames.map(d => {
            const jobs = m.depts[d];
            return (
              <div key={d} className="rounded-xl p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 flex flex-col">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 truncate" title={d}>{d}</h4>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                    {jobs.length}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 mt-3 mb-3 overflow-hidden">
                  <div className="h-full rounded-full bg-indigo-500" style={{ width: `${(jobs.length / max) * 100}%` }} />
                </div>
                <div className="max-h-56 overflow-y-auto thin -mr-1 pr-1">
                  {jobs.map(j => (
                    <div key={j.JobNo} className="flex items-center gap-2 text-sm py-1.5 border-b border-slate-100 dark:border-slate-700/60 last:border-0">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: STATUS[j.Status].color }} title={j.Status} />
                      <span className="font-medium flex-1 truncate">{j.JobNo}</span>
                      <span className={`text-xs ${j.overdue ? 'text-red-500 font-semibold' : 'text-slate-500 dark:text-slate-400'}`}>
                        {j.Qty}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
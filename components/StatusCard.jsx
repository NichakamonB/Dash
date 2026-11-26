import { Card, ChartBox } from './ui';
import { STATUS } from '../data';
export default function StatusCard({ m, dark }) {
  return (
    <Card className="xl:col-span-1 p-5 flex flex-col">
      <h2 className="text-base font-bold mb-4">Overall Job Status</h2>
      <ChartBox dark={dark} height={250} type="doughnut"
        data={{ labels: Object.keys(STATUS), datasets: [{ data: m.statusCounts, backgroundColor: Object.values(STATUS).map(s => s.color), borderWidth: 0 }] }}
        options={{ cutout: '65%', plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } } } }} />
      <div className="mt-6 border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 rounded-lg p-3">
        <h3 className="text-xs font-bold text-red-600 dark:text-red-400 mb-2">Attention Needed (Hold/Problem)</h3>
        <div className="max-h-32 overflow-y-auto thin space-y-2">
          {m.hold.length ? m.hold.map(j => (
            <div key={j.JobNo} className="flex justify-between text-sm">
              <span className="font-medium">{j.JobNo}</span>
              <span className="text-xs text-red-500 dark:text-red-400">{j.Department}</span>
            </div>
          )) : <p className="text-xs text-slate-500 italic">ไม่มีงานที่ติดปัญหา</p>}
        </div>
      </div>
    </Card>
  );
}

import { Card, ChartBox } from './ui';

const COLORS = ['#2563eb', '#22a445', '#f59e0b', '#f97316', '#ef4444', '#94a3b8'];
const TOP = 5;

export default function LoadPie({ m, dark }) {
  const all = m.machineList.map(x => ({ name: x.name, n: x.run.length + x.queue.length }));
  const total = all.reduce((s, x) => s + x.n, 0);
  const top = all.slice(0, TOP);
  const rest = all.slice(TOP).reduce((s, x) => s + x.n, 0);
  if (rest) top.push({ name: 'อื่น ๆ', n: rest });

  const data = {
    labels: top.map(x => x.name),
    datasets: [{
      data: top.map(x => x.n),
      backgroundColor: top.map((_, i) => COLORS[i % COLORS.length]),
      borderColor: dark ? '#1e293b' : '#ffffff',
      borderWidth: 2,
    }],
  };
  const options = { plugins: { legend: { display: false } } };

  return (
    <Card className="p-5">
      <h3 className="font-semibold mb-4">สัดส่วนงานค้างตามเครื่อง / ทีม</h3>
      {total === 0 ? (
        <p className="text-sm text-slate-500">ไม่มีงานค้าง</p>
      ) : (
        <div className="flex flex-col 2xl:flex-row items-center gap-5">
          <div className="w-44 shrink-0">
            <ChartBox type="pie" data={data} options={options} dark={dark} height={176} />
          </div>
          <ul className="w-full min-w-0 2xl:flex-1 space-y-2.5 text-sm">
            {top.map((x, i) => (
              <li key={x.name} className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                <span className="flex-1 min-w-0 truncate" title={x.name}>{x.name}</span>
                <span className="tabular-nums whitespace-nowrap text-slate-700 dark:text-slate-200">{Math.round((x.n / total) * 100)}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
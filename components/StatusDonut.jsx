import { Card, ChartBox } from './ui';
import { STATUS } from '../data';

const LABEL = { 'Done': 'เสร็จสิ้น', 'In-Process': 'กำลังทำ', 'Waiting': 'รอ', 'Hold/Problem': 'ติดปัญหา' };

export default function StatusDonut({ m, dark }) {
  const keys = Object.keys(STATUS); // ลำดับตรงกับ m.statusCounts
  const total = m.data.length;

  const data = {
    labels: keys.map(k => LABEL[k] || k),
    datasets: [{
      data: m.statusCounts,
      backgroundColor: keys.map(k => STATUS[k].color),
      borderColor: dark ? '#1e293b' : '#ffffff',
      borderWidth: 2,
    }],
  };
  const options = { cutout: '64%', plugins: { legend: { display: false } } };

  return (
    <Card className="p-5">
      <h3 className="font-semibold mb-4">สถานะงานทั้งหมด (Job Status)</h3>
      <div className="flex flex-col 2xl:flex-row items-center gap-5">
        <div className="relative w-44 shrink-0">
          <ChartBox type="doughnut" data={data} options={options} dark={dark} height={176} />
          <div className="absolute inset-0 grid place-items-center pointer-events-none text-center">
            <div>
              <div className="text-3xl font-bold leading-none tabular-nums">{total}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">รายการ</div>
            </div>
          </div>
        </div>

        <ul className="w-full min-w-0 2xl:flex-1 space-y-2.5 text-sm">
          {keys.map((k, i) => (
            <li key={k} className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ background: STATUS[k].color }} />
              <span className="flex-1 min-w-0">{LABEL[k] || k}</span>
              <span className="tabular-nums whitespace-nowrap text-slate-700 dark:text-slate-200">
                {m.statusCounts[i]} ({total ? ((m.statusCounts[i] / total) * 100).toFixed(1) : '0.0'}%)
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
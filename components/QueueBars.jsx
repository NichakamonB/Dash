import { Card } from './ui';

const HOT_SHARE = 0.3; // แผนกที่ถืองานค้าง >= 30% ของทั้งหมด = คอขวด
const COLORS = ['bg-blue-600', 'bg-sky-500', 'bg-green-600', 'bg-amber-500', 'bg-orange-500', 'bg-slate-400'];

export default function QueueBars({ m }) {
  const rows = m.deptNames.map(name => {
    const jobs = m.depts[name];
    return {
      name,
      count: jobs.length,
      qty: jobs.reduce((s, j) => s + j.Qty, 0),
      hold: jobs.filter(j => j.Status === 'Hold/Problem').length,
    };
  });
  const active = rows.reduce((s, r) => s + r.count, 0);
  const max = rows[0]?.count || 1;
  const hot = rows[0] && active && rows[0].count / active >= HOT_SHARE ? rows[0] : null;

  return (
    <Card className="p-5">
      <h3 className="font-semibold mb-4">งานค้างแยกตามแผนก (คอขวด)</h3>

      {rows.length === 0 ? (
        <p className="text-sm text-slate-500">ไม่มีงานค้าง</p>
      ) : (
        <div className="space-y-3.5">
          {rows.slice(0, 6).map((r, i) => {
            const isHot = hot && r.name === hot.name;
            return (
              <div key={r.name} className="grid grid-cols-[110px_1fr_auto] items-center gap-3 text-sm">
                <span className={`truncate ${isHot ? 'font-semibold text-red-600 dark:text-red-400' : ''}`} title={r.name}>
                  {r.name}
                </span>
                <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${isHot ? 'bg-red-500' : COLORS[i % COLORS.length]}`}
                    style={{ width: `${(r.count / max) * 100}%` }}
                  />
                </div>
                <span className="tabular-nums text-right w-16">
                  {r.count}
                  {r.hold > 0 && <span className="ml-1 text-xs text-red-500" title="ติดปัญหา">!{r.hold}</span>}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {hot && (
        <p className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-block rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 font-semibold px-2 py-0.5 mr-2">
            คอขวด
          </span>
          {hot.name} ถือ {Math.round((hot.count / active) * 100)}% ของงานค้าง ({hot.qty.toLocaleString()} pcs)
        </p>
      )}
    </Card>
  );
}
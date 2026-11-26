import { useRef, useState } from 'react';
import { STATUS } from '../data';

const LABEL = { 'Done': 'เสร็จแล้ว', 'In-Process': 'กำลังผลิต', 'Waiting': 'รอ', 'Hold/Problem': 'ติดปัญหา' };
const RANK = { 'Hold/Problem': 0, 'In-Process': 1, 'Waiting': 2, 'Done': 3 };

function due(j) {
  if (j.daysLate === null) return ['ไม่ระบุกำหนด', 'text-slate-400'];
  if (j.Status === 'Done') return [`กำหนด ${j.DueDate}`, 'text-slate-400'];
  if (j.daysLate > 0) return [`เกิน ${j.daysLate} วัน`, 'text-red-600 dark:text-red-400 font-bold'];
  if (j.daysLate === 0) return ['ครบกำหนดวันนี้', 'text-amber-600 dark:text-amber-400 font-bold'];
  return [`เหลือ ${-j.daysLate} วัน`, 'text-slate-500 dark:text-slate-400'];
}

export default function Monitor({ data, updated, error }) {
  const [q, setQ] = useState('');
  const [showDone, setShowDone] = useState(false);
  const box = useRef(null);

  const jobs = data.filter(j =>
    (showDone || j.Status !== 'Done') && j.JobNo.toUpperCase().includes(q.trim().toUpperCase()));
  const cols = [...new Set(data.map(j => j.Department))].sort();

  const toggleFull = () =>
    document.fullscreenElement ? document.exitFullscreen() : box.current.requestFullscreen?.();

  return (
    <div ref={box} className="space-y-3 [&:fullscreen]:overflow-auto [&:fullscreen]:p-4 [&:fullscreen]:bg-slate-200 dark:[&:fullscreen]:bg-slate-900">
      <div className="flex flex-wrap items-center gap-3">
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="ค้นหา Job No..."
          className="h-10 w-full sm:w-64 px-3 rounded-lg bg-white dark:bg-slate-800 text-sm" />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={showDone} onChange={e => setShowDone(e.target.checked)} />
          แสดงงานที่เสร็จแล้ว
        </label>
        <span className={`ml-auto text-sm ${error ? 'text-red-600' : 'text-slate-500 dark:text-slate-400'}`}>
          {error ? 'เชื่อมต่อไม่ได้ ข้อมูลอาจเก่า' : updated ? `อัปเดต ${updated.toLocaleTimeString('th-TH')}` : ''}
        </span>
        <button onClick={toggleFull} className="h-10 px-4 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm">
          เต็มจอ / ออก
        </button>
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        {Object.keys(STATUS).map(s => (
          <span key={s} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ background: STATUS[s].color }} />
            {LABEL[s]} {data.filter(j => j.Status === s).length}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3 items-start">
        {cols.map(col => {
          const list = jobs.filter(j => j.Department === col)
            .sort((a, b) => RANK[a.Status] - RANK[b.Status] || (b.daysLate ?? -1e9) - (a.daysLate ?? -1e9));
          return (
            <section key={col} className="rounded-xl p-3 bg-white/70 dark:bg-slate-800/70">
              <h2 className="flex justify-between font-semibold mb-2">
                <span className="truncate">{col}</span>
                <span className="text-slate-500">{list.length}</span>
              </h2>
              <div className="space-y-2">
                {list.map(j => {
                  const [text, tone] = due(j);
                  return (
                    <article key={j.JobNo} className="rounded-lg bg-white dark:bg-slate-900 p-3 border-l-4 shadow-sm"
                      style={{ borderLeftColor: STATUS[j.Status].color }}>
                      <div className="flex justify-between gap-2">
                        <b className="truncate">{j.JobNo}</b>
                        <span className={`px-2 rounded text-xs whitespace-nowrap ${STATUS[j.Status].badge}`}>{LABEL[j.Status]}</span>
                      </div>
                      <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">{j.Responsible} · {j.Qty.toLocaleString()} pcs</div>
                      <div className={`mt-1 text-sm ${tone}`}>{text}</div>
                    </article>
                  );
                })}
                {!list.length && <p className="text-sm text-slate-400">ไม่มีงาน</p>}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
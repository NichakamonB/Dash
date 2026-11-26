import { useEffect, useState } from 'react';
import { Kpi } from './ui';
import { STATUS } from '../data';

const pct = (n, total) => (total ? `${Math.round((n / total) * 100)}%` : '0%');
const MAX_SHOWN = 3;

function OverdueModal({ list, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const sorted = [...list].sort((a, b) => (b.daysLate || 0) - (a.daysLate || 0));
  const totalQty = list.reduce((s, j) => s + Number(j.Qty || 0), 0);

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="w-full max-w-4xl max-h-[85vh] flex flex-col bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700"
        onClick={(e) => e.stopPropagation()}
        role="dialog" aria-modal="true"
      >
        <div className="p-5 flex items-center gap-3 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-base font-bold">งานเกินกำหนด (Overdue / Missed)</h2>
          <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">{list.length}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400">รวม {totalQty.toLocaleString()} pcs</span>
          <button onClick={onClose} aria-label="ปิด"
            className="ml-auto px-2.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500">✕</button>
        </div>

        <div className="overflow-auto thin">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-900 text-xs text-slate-500 sticky top-0">
              <tr>{['#', 'Job No.', 'แผนก', 'เครื่อง/ผู้รับผิดชอบ', 'Qty', 'กำหนดเสร็จ', 'เกินมา', 'สถานะ'].map(h => <th key={h} className="px-4 py-3">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {sorted.map((j, i) => (
                <tr key={`${j.JobNo}-${i}`}>
                  <td className="px-4 py-3">{i + 1}</td>
                  <td className="px-4 py-3 font-medium">{j.JobNo}</td>
                  <td className="px-4 py-3">{j.Department}</td>
                  <td className="px-4 py-3">{j.Responsible}</td>
                  <td className="px-4 py-3 tabular-nums">{Number(j.Qty).toLocaleString()}</td>
                  <td className="px-4 py-3">{j.DueDate}</td>
                  <td className="px-4 py-3 text-red-600 font-bold">{j.daysLate} วัน</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${STATUS[j.Status].badge}`}>{j.Status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function KpiRow({ m }) {
  const [showOverdue, setShowOverdue] = useState(false);
  const total = m.data.length;
  const extra = m.overdue.length - MAX_SHOWN;

  const overdueList = m.overdue.length ? (
    <ul className="space-y-1">
      {m.overdue.slice(0, MAX_SHOWN).map((j, i) => (
        <li key={`${j.JobNo}-${i}`} className="flex justify-between">
          <span className="font-mono">{j.JobNo}</span>
          <span className="font-semibold tabular-nums">{Number(j.Qty).toLocaleString()} pcs</span>
        </li>
      ))}
      {extra > 0 && <li className="text-red-500 dark:text-red-400">+{extra} รายการ · คลิกดูทั้งหมด</li>}
    </ul>
  ) : (
    <span className="text-green-600 dark:text-green-400">ไม่มีงานเกินกำหนด</span>
  );

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 items-stretch">
        <Kpi
          icon="layers" tone="blue" label="Total Jobs" value={total}
          note="งานทั้งหมดในระบบ"
          tag={<>{m.totalQty.toLocaleString()} pcs</>}
        />
        <Kpi
          icon="play" tone="green" label="In-Process" value={m.inProc}
          note="กำลังรันบนเครื่อง" tag={pct(m.inProc, total)}
        />
        <Kpi
          icon="clock" tone="amber" label="Waiting Queue" value={m.waiting}
          note="รอ setup หรือวัตถุดิบ" tag={pct(m.waiting, total)}
        />
        <Kpi
          icon="alert" tone="red" label="Overdue / Missed" value={m.overdue.length}
          note="งานที่เกินกำหนด" footer={overdueList}
          onClick={m.overdue.length ? () => setShowOverdue(true) : undefined}
        />
        <Kpi
          icon="check" tone="purple" label="Completed (Done)" value={m.done}
          note="งานที่เสร็จแล้ว" tag={pct(m.done, total)}
        />
      </div>
      {showOverdue && <OverdueModal list={m.overdue} onClose={() => setShowOverdue(false)} />}
    </>
  );
}
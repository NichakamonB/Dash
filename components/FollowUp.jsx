import { Card } from './ui';
import { STATUS } from '../data';

export function FollowUp({ list }) {
  return (
    <Card className="xl:col-span-2 overflow-hidden">
      <div className="p-5 flex items-center gap-2 border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-base font-bold">งานที่ต้องติดตาม (Follow-up)</h2>
        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">{list.length}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-slate-50 dark:bg-slate-900 text-xs text-slate-500">
            <tr>{['#', 'Job No.', 'แผนก', 'เครื่อง/ผู้รับผิดชอบ', 'Qty', 'กำหนดเสร็จ', 'เกินมา', 'สถานะ'].map(h => <th key={h} className="px-4 py-3">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {list.map((j, i) => (
              <tr key={j.JobNo}>
                <td className="px-4 py-3">{i + 1}</td>
                <td className="px-4 py-3 font-medium text-blue-600 dark:text-blue-400">{j.JobNo}</td>
                <td className="px-4 py-3">{j.Department}</td>
                <td className="px-4 py-3">{j.Responsible}</td>
                <td className="px-4 py-3">{j.Qty}</td>
                <td className="px-4 py-3">{j.DueDate}</td>
                <td className={`px-4 py-3 ${j.overdue ? 'text-red-600 font-bold' : 'text-slate-400'}`}>
                  {j.overdue ? `${j.daysLate} วัน` : '-'}
                </td>
                <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs ${STATUS[j.Status].badge}`}>{j.Status}</span></td>
              </tr>
            ))}
            {!list.length && <tr><td colSpan="8" className="px-4 py-6 text-slate-400">ไม่มีงานที่ต้องติดตาม</td></tr>}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export function Alerts({ m }) {
  const dot = c => <span className={`inline-block w-2 h-2 rounded-full mr-2 ${c}`} />;
  const items = [
    m.overdue.length > 0 && [dot('bg-red-500'), `มีงานเกินกำหนด ${m.overdue.length} รายการ`],
    m.hold.length > 0 && [dot('bg-orange-500'), `มีงานติดปัญหา/พักงาน ${m.hold.length} รายการ`],
    m.waiting > m.inProc && [dot('bg-blue-500'), `คิวรอ (${m.waiting}) มากกว่างานที่กำลังรัน (${m.inProc})`],
  ].filter(Boolean);
  return (
    <Card className="p-5 h-full">
      <h2 className="text-base font-bold mb-3">แจ้งเตือน</h2>
      {items.length
        ? items.map(([d, t]) => <p key={t} className="text-sm py-2 border-b last:border-0 border-slate-100 dark:border-slate-700">{d}{t}</p>)
        : <p className="text-sm text-slate-400">ไม่มีการแจ้งเตือน</p>}
    </Card>
  );
}
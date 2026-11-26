import { useState } from 'react';
import { Card } from './ui';
import { STATUS } from '../data';
import { ARCHIVE_DAYS } from '../config';

export default function History({ archive }) {
  const [q, setQ] = useState('');
  const [st, setSt] = useState('all');
  const rows = archive.filter(j =>
    j.JobNo.toUpperCase().includes(q.toUpperCase()) && (st === 'all' || j.Status === st));
  const field = "px-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <Card className="overflow-hidden">
      <div className="p-5 border-b border-slate-200 dark:border-slate-700 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-base font-bold">
            ข้อมูลย้อนหลัง <span className="text-slate-400 font-normal">({archive.length} รายการ)</span>
          </h2>
          <div className="flex gap-2">
            <select value={st} onChange={e => setSt(e.target.value)} className={field}>
              <option value="all">ทุกสถานะ</option>
              {Object.keys(STATUS).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="ค้นหา Job No..." className={`${field} w-48`} />
          </div>
        </div>
        <p className="text-xs text-slate-400">
          งานที่เลยกำหนดเกิน {ARCHIVE_DAYS} วันจะย้ายมาไว้ที่นี่ และไม่ถูกนับใน KPI/กราฟหน้าหลัก
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 text-xs font-semibold">
            <tr>{['Job No.', 'แผนก', 'เครื่อง/ผู้รับผิดชอบ', 'Qty', 'กำหนดเสร็จ', 'เลยมา', 'สถานะ'].map(h => <th key={h} className="px-6 py-4">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {rows.map(j => (
              <tr key={j.JobNo} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-6 py-3 font-medium">{j.JobNo}</td>
                <td className="px-6 py-3">{j.Department}</td>
                <td className="px-6 py-3">{j.Responsible}</td>
                <td className="px-6 py-3">{j.Qty}</td>
                <td className="px-6 py-3">{j.DueDate}</td>
                <td className="px-6 py-3 text-slate-500">{j.daysLate} วัน</td>
                <td className="px-6 py-3"><span className={`px-2 py-1 rounded text-xs font-medium ${STATUS[j.Status].badge}`}>{j.Status}</span></td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan="7" className="px-6 py-6 text-slate-400">ไม่พบข้อมูลย้อนหลัง</td></tr>}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
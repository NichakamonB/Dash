import { useState } from 'react';
import { Card } from './ui';
import { STATUS } from '../data';

const LABEL = { 'Done': 'เสร็จสิ้น', 'In-Process': 'กำลังทำ', 'Waiting': 'รอ', 'Hold/Problem': 'ติดปัญหา' };

export default function JobsTable({ data }) {
  const [q, setQ] = useState('');
  const [st, setSt] = useState('all');

  const rows = data.filter(j =>
    j.JobNo.toUpperCase().includes(q.toUpperCase()) && (st === 'all' || j.Status === st));

  const filtered = st !=='all' || q.trim() !== '';

  const field = 'px-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500';

  return (
    <Card className="overflow-hidden">
      <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-base font-bold">
          All Jobs Summary <span className="text-slate-400 font-normal">({rows.length}/{data.length})</span>
        </h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <select value={st} onChange={e => setSt(e.target.value)} className={field}>
            <option value="all">ทุกสถานะ</option>
            {Object.keys(STATUS).map(s => <option key={s} value={s}>{LABEL[s] || s}</option>)}
          </select>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="ค้นหา Job No..."
            className={`${field} flex-1 sm:flex-none sm:w-64`} />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <tr>{['Job No.', 'Department', 'Machine/Resp.', 'Qty', 'Due Date', 'Status'].map(h => <th key={h} className="px-6 py-4">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-slate-700 dark:text-slate-300">
            {rows.map(j => (
              <tr key={j.JobNo} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-6 py-3 font-medium">{j.JobNo}</td>
                <td className="px-6 py-3">{j.Department}</td>
                <td className="px-6 py-3">{j.Responsible}</td>
                <td className="px-6 py-3">{j.Qty}</td>
                <td className={`px-6 py-3 ${j.overdue ? 'text-red-600 dark:text-red-400 font-bold' : ''}`}>{j.DueDate}</td>
                <td className="px-6 py-3"><span className={`px-2 py-1 rounded text-xs font-medium ${STATUS[j.Status].badge}`}>{j.Status}</span></td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan="6" className="px-6 py-6 text-slate-400">ไม่พบงานที่ค้นหา</td></tr>}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
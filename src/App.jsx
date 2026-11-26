import { useMemo, useState } from 'react';
import { API_URL } from './config';
import { useJobs, useDark } from './hooks';
import { computeMetrics, followList, fmt } from './data';
import TopNav from './components/TopNav';
import Overview from './components/Overview';
import StatusCard from './components/StatusCard';
import Bottlenecks from './components/Bottlenecks';
import Workload from './components/Workload';
import JobsTable from './components/JobsTable';
import History from './components/History';
import { FollowUp, Alerts } from './components/FollowUp';

function downloadCsv(rows) {
  const cols = ['JobNo', 'Department', 'Responsible', 'Qty', 'DueDate', 'Status'];
  // กันค่าที่ขึ้นต้นด้วย = + - @ ถูก Excel ตีความเป็นสูตร
  const cell = v => `"${String(v).replace(/^[=+\-@](?=.)/, "'$&").replace(/"/g, '""')}"`;
  const csv = [cols, ...rows.map(r => cols.map(c => r[c]))].map(r => r.map(cell).join(',')).join('\r\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' }));
  a.download = `jobs-${fmt(new Date())}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

export default function App() {
  const { jobs, updated, error, loading, reload } = useJobs();
  const [dark, setDark] = useDark();
  const [view, setView] = useState('dash');

  const m = useMemo(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return computeMetrics(jobs, today);
  }, [jobs]);

  const list = followList(m);

  return (
    <div className="min-h-screen">
      <main className="max-w-[1400px] mx-auto px-4 py-5 space-y-4">
        <TopNav
          view={view} setView={setView} badge={list.length}
          error={error} updated={updated} reload={reload}
          dark={dark} setDark={setDark}
        />
        <div className="flex flex-wrap items-end justify-between gap-3 pt-3">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">MFG Track / Production</p>
            <h1 className="text-2xl">ภาพรวมการผลิต</h1>
          </div>
          <button onClick={() => downloadCsv(m.data)} disabled={!m.data.length}
            className="h-10 px-4 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm disabled:opacity-40">
            ดาวน์โหลดรายงาน (CSV)
          </button>
        </div>
        {!API_URL && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-sm p-3">
            กำลังแสดงข้อมูลตัวอย่าง ใส่ URL ที่ src/config.js เพื่อดึงข้อมูลจริง
          </div>
        )}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300 text-sm p-3">
            ดึงข้อมูลไม่สำเร็จ ({error}) จะแสดงข้อมูลล่าสุดที่โหลดได้ต่อไป
          </div>
        )}
        {loading && <p className="text-slate-500">กำลังโหลดข้อมูล…</p>}

        {view === 'dash' && !loading && <Overview m={m} onFollow={() => setView('attn')} />}

        {view === 'jobs' && <JobsTable data={m.data} />}
        {view === 'machines' && <Workload m={m} dark={dark} />}

        {view === 'depts' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <StatusCard m={m} dark={dark} />
            <Bottlenecks m={m} dark={dark} />
          </div>
        )}

        {view === 'attn' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <FollowUp list={list} />
            <Alerts m={m} />
          </div>
        )}

        {view === 'hist' && <History archive={m.archive} />}
      </main>
    </div>
  );
}
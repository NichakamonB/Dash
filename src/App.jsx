import { useMemo, useState } from 'react';
import { API_URL } from './config';
import { useJobs, useDark } from './hooks';
import { computeMetrics, followList } from './data';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import KpiRow from './components/KpiRow';
import StatusCard from './components/StatusCard';
import Bottlenecks from './components/Bottlenecks';
import StatusDonut from './components/StatusDonut';
import QueueBars from './components/QueueBars';
import LoadPie from './components/LoadPie';
import Workload from './components/Workload';
import JobsTable from './components/JobsTable';
import History from './components/History';
import { FollowUp, Alerts } from './components/FollowUp';

export default function App() {
  const { jobs, updated, error, loading, reload } = useJobs();
  const [dark, setDark] = useDark();
  const [view, setView] = useState('dash');
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const m = useMemo(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return computeMetrics(jobs, today);
  }, [jobs]);

  const list = followList(m);

  return (
    <div className={`min-h-screen transition-all duration-200 ${collapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
      <Sidebar
        view={view} setView={setView}
        open={open} setOpen={setOpen}
        collapsed={collapsed} onToggle={() => setCollapsed(c => !c)}
        badge={list.length}
      />
      <Header
        error={error} updated={updated} reload={reload}
        dark={dark} setDark={setDark}
        onMenu={() => setOpen(true)}
        alerts={list.length} onBell={() => setView('attn')}
      />
      <main className="max-w-[1600px] mx-auto px-4 py-6 space-y-6">
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

        {view === 'dash' && (
          <>
            <KpiRow m={m} />
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <StatusDonut m={m} dark={dark} />
              <QueueBars m={m} />
              <LoadPie m={m} dark={dark} />
            </div>
            <Workload m={m} dark={dark} />
            <JobsTable data={m.data} />
          </>
        )}

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
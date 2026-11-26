const NAV = [
  ['dash', 'ภาพรวม'], ['monitor', 'Monitor'], ['jobs', 'รายการงาน'], ['machines', 'เครื่องจักร'],
  ['depts', 'แผนก / คอขวด'], ['attn', 'ต้องติดตาม'], ['hist', 'ย้อนหลัง'],
];
const round = 'h-10 px-4 rounded-full bg-white/80 dark:bg-slate-800/80 text-sm hover:bg-white dark:hover:bg-slate-700';

export default function TopNav({ view, setView, badge, error, updated, reload, dark, setDark }) {
  return (
    <header className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 mr-3">
        <span className="w-8 h-8 rounded-lg bg-blue-500 text-white grid place-items-center font-bold">M</span>
        <span className="font-semibold">MFG Track</span>
      </div>
      <nav className="order-last xl:order-none w-full xl:w-auto flex gap-1.5 overflow-x-auto thin">
        {NAV.map(([id, label]) => (
          <button key={id} onClick={() => setView(id)} aria-current={view === id ? 'page' : undefined}
            className={`h-10 px-4 rounded-lg text-sm whitespace-nowrap transition ${view === id
              ? 'bg-blue-500 text-white'
              : 'bg-white/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-700'}`}>
            {label}
            {id === 'attn' && badge > 0 && (
              <span className="ml-2 px-1.5 rounded-full bg-rose-500 text-white text-xs">{badge}</span>
            )}
          </button>
        ))}
      </nav>
      <div className="ml-auto flex items-center gap-2">
        <span className="hidden sm:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className={`w-2 h-2 rounded-full ${error ? 'bg-rose-500' : 'bg-emerald-500'}`} />
          {error ? 'เชื่อมต่อไม่ได้' : updated ? `อัปเดต ${updated.toLocaleTimeString('th-TH')}` : 'กำลังโหลด…'}
        </span>
        <button onClick={reload} className={round}>รีเฟรช</button>
        <button onClick={() => setDark(!dark)} className={round}>{dark ? 'สว่าง' : 'มืด'}</button>
      </div>
    </header>
  );
}
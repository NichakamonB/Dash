const btn = 'px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm';

export default function Header({ error, updated, reload, dark, setDark, onMenu, alerts = 0, onBell }) {
  return (
    <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30">
      <div className="max-w-[1600px] mx-auto px-4 h-16 flex items-center gap-3">
        <button onClick={onMenu} className={`lg:hidden ${btn}`} aria-label="เปิดเมนู">☰</button>

        <h1 className="flex items-center gap-3 min-w-0">
          <span className="text-[17px] font-semibold tracking-tight truncate">Manufacturing Dashboard</span>
          <span className="hidden md:block h-5 w-px bg-slate-200 dark:bg-slate-600" />
          <span className="hidden md:block text-sm font-normal text-slate-500 dark:text-slate-400 truncate">
            ภาพรวมและคอขวดการผลิต
          </span>
        </h1>

        <div className="ml-auto flex items-center gap-3 text-sm">
          <span className="hidden sm:flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-700 px-3 py-1.5 text-slate-600 dark:text-slate-300">
            <span className={`w-2 h-2 rounded-full ${error ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
            {error ? 'เชื่อมต่อไม่ได้' : updated ? `อัปเดตล่าสุด ${updated.toLocaleTimeString('th-TH')}` : 'กำลังโหลด…'}
          </span>
          <button onClick={reload} className={btn}>รีเฟรช</button>
          <button onClick={() => setDark(!dark)} className={btn}>{dark ? 'โหมดสว่าง' : 'โหมดมืด'}</button>

          <button
            onClick={onBell}
            className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
            aria-label={`งานต้องติดตาม ${alerts} รายการ`}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {alerts > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 grid place-items-center rounded-full bg-red-500 text-white text-[11px] font-bold">
                {alerts}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
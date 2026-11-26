const I = ({ children }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);

const ICONS = {
  dash: <I><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></I>,
  jobs: <I><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /><path d="M9 13h6M9 17h6" /></I>,
  machines: <I><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></I>,
  depts: <I><path d="M3 21V9l6 4V9l6 4V5h3a3 3 0 0 1 3 3v13z" /><path d="M3 21h18" /><path d="M8 17h2M14 17h2" /></I>,
  attn: <I><path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /><path d="M12 9v4M12 17h.01" /></I>,
  hist: <I><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l3 2" /></I>,
};

const NAV = [
  ['dash', 'แดชบอร์ดภาพรวม'],
  ['jobs', 'รายการงานทั้งหมด'],
  ['machines', 'เครื่องจักร / ทีม'],
  ['depts', 'แผนก / คอขวด'],
  ['attn', 'งานต้องติดตาม'],
    ['hist', 'ข้อมูลย้อนหลัง'],
];

export default function Sidebar({ view, setView, open, setOpen, badge, collapsed, onToggle }) {
  const hide = collapsed ? 'lg:hidden' : '';
  const center = collapsed ? 'lg:justify-center lg:px-0' : '';
  return (
    <>
      {open && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setOpen(false)} />}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 ${collapsed ? 'lg:w-20' : 'lg:w-64'}
          flex flex-col text-white border-r border-white/5 shadow-2xl overflow-hidden
          bg-gradient-to-b from-[#0a1b45] via-[#0e2759] to-[#12306b]
          transition-all duration-200 ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        {/* โลโก้ */}
        <div className={`h-20 px-5 flex items-center gap-3 shrink-0 ${center}`}>
          <div className="w-11 h-11 shrink-0 rounded-xl grid place-items-center text-sky-200
            bg-gradient-to-br from-sky-400/30 to-blue-600/30 ring-1 ring-white/10">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" />
            </svg>
          </div>
          <div className={`leading-tight ${hide}`}>
            <div className="text-xl font-extrabold tracking-wide">MFG</div>
            <div className="text-[10px] text-blue-200/80 whitespace-nowrap">Production Tracking System</div>
          </div>
        </div>

        {/* เมนู */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto overflow-x-hidden thin">
          {NAV.map(([id, label]) => {
            const active = view === id;
            return (
              <button
                key={id}
                title={label}
                onClick={() => { setView(id); setOpen(false); }}
                className={`relative w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-[15px] text-left transition ${center}
                  ${active
                    ? 'bg-gradient-to-r from-sky-500/30 to-blue-500/5 ring-1 ring-sky-300/20 text-white font-semibold'
                    : 'text-blue-100/70 hover:bg-white/5 hover:text-white'}`}
              >
                {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-sky-300" />}
                <span className={`shrink-0 ${active ? 'text-sky-300' : ''}`}>{ICONS[id]}</span>
                <span className={`flex-1 whitespace-nowrap ${hide}`}>{label}</span>
                {id === 'attn' && badge > 0 && (
                  <span className={`min-w-[22px] h-[22px] px-1.5 grid place-items-center bg-red-500 text-white text-xs font-bold rounded-full
                    ${collapsed ? 'lg:absolute lg:top-1 lg:right-1 lg:min-w-[18px] lg:h-[18px] lg:text-[10px]' : ''}`}>
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* ปุ่มย่อ/ขยาย (เฉพาะจอคอม) */}
        <button
          onClick={onToggle}
          title={collapsed ? 'ขยายเมนู' : 'ย่อเมนู'}
          className={`hidden lg:flex items-center gap-3.5 mx-3 mb-4 px-4 py-2.5 rounded-xl text-sm text-blue-200/70
            hover:bg-white/5 hover:text-white transition ${center}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className={`shrink-0 transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`}>
            <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" />
          </svg>
          <span className={hide}>ย่อเมนู</span>
        </button>
      </aside>
    </>
  );
}
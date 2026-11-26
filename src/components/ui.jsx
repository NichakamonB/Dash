import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export function ChartBox({ type, data, options, dark, height }) {
  const ref = useRef(null);
  const inst = useRef(null);
  useEffect(() => {
    Chart.defaults.color = dark ? '#cbd5e1' : '#64748b';
    const grid = dark ? '#334155' : '#e2e8f0';
    const opts = JSON.parse(JSON.stringify(options || {}));
    if (opts.scales && opts.scales.y) opts.scales.y.grid = { color: grid };
    inst.current?.destroy();
    inst.current = new Chart(ref.current.getContext('2d'), {
      type, data, options: { responsive: true, maintainAspectRatio: false, animation: false, ...opts },
    });
    return () => inst.current?.destroy();
  }, [type, JSON.stringify(data), JSON.stringify(options), dark]);
  return <div style={{ height }} className="relative w-full"><canvas ref={ref}></canvas></div>;
}

export const Card = ({ className = '', children, ...rest }) => (
  <div {...rest} className={`min-w-0 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm ${className}`}>{children}</div>
);

// ไอคอน SVG ในตัว ไม่ต้องติดตั้งไลบรารีเพิ่ม
const ICONS = {
  layers: 'M12 2 2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5',
  play: 'M6 3l14 9-14 9V3z',
  clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 6v6l4 2',
  alert: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 8v4 M12 16h.01',
  check: 'M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4 12 14.01l-3-3',
};
export function Icon({ name, size = 20, className = '' }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}

const tones = {
  slate: 'text-slate-800 dark:text-white', blue: 'text-blue-600 dark:text-blue-400',
  amber: 'text-amber-600 dark:text-amber-400', green: 'text-emerald-600 dark:text-emerald-400',
  red: 'text-red-600 dark:text-red-400', purple: 'text-violet-600 dark:text-violet-400',
};
const iconBg = {
  slate: 'bg-slate-500', blue: 'bg-blue-600', amber: 'bg-amber-500',
  green: 'bg-green-600', red: 'bg-red-600', purple: 'bg-violet-600',
};

// ใช้แบบเดิมได้ (label, value, note, tone) ส่วน icon / tag / footer / onClick เป็นตัวเลือกใหม่
export function Kpi({ label, value, note, tone = 'slate', icon, tag, footer, onClick }) {
  return (
    <Card
      className={`p-4 flex flex-col ${onClick ? 'cursor-pointer transition hover:shadow-md hover:border-red-300 dark:hover:border-red-700' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); }
      } : undefined}
    >
      <div className="flex items-start gap-3.5">
        {icon && (
          <div className={`${iconBg[tone]} w-12 h-12 2xl:w-14 2xl:h-14 rounded-xl text-white grid place-items-center shrink-0`}>
            <Icon name={icon} size={28} />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-[13px] 2xl:text-sm font-medium text-slate-600 dark:text-slate-300">{label}</p>
          <h3 className={`text-3xl font-bold leading-tight tabular-nums ${icon ? 'text-slate-900 dark:text-white' : tones[tone]}`}>{value}</h3>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-start justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
        <span>{note}</span>
        {tag && <b className={`font-semibold whitespace-nowrap ${tones[tone]}`}>{tag}</b>}
      </div>
      {footer && <div className="mt-2 text-xs">{footer}</div>}
    </Card>
  );
}
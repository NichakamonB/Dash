import { useState } from 'react';
import { Card } from './ui';
import { OverdueModal } from './KpiRow';
import { fmt } from '../data';

const WEEK = ['จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.', 'อา.'];
const pct = (n, t) => (t ? Math.round((n / t) * 100) : 0);
const sub = 'text-xs text-slate-500 dark:text-slate-400';

// กราฟแท่งจิ๋ว: จำนวนงานในกลุ่มนั้น แยกตามแผนก
function Spark({ values, color }) {
  const max = Math.max(1, ...values.map(v => v[1]));
  return (
    <div className="hidden sm:flex items-end gap-1 h-10" aria-hidden="true">
      {values.map(([name, n]) => (
        <span key={name} title={`${name}: ${n}`} className="w-2 rounded-t-sm"
          style={{ height: `${Math.max(8, (n / max) * 100)}%`, background: color, opacity: n === max ? 1 : 0.25 }} />
      ))}
    </div>
  );
}

function Stat({ label, value, note, color, values, onClick }) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Card className="overflow-hidden">
      <Tag onClick={onClick} className="w-full h-full text-left p-4">
        <div className="flex justify-between items-center">
          <span className="text-sm">{label}</span>
          <span className="w-3 h-3 rounded-full" style={{ background: color }} />
        </div>
        <div className="mt-2 flex items-end justify-between gap-3">
          <div>
            <div className="text-3xl font-medium tabular-nums">{value}</div>
            <div className={`mt-1 ${sub}`}>{note}</div>
          </div>
          <Spark values={values} color={color} />
        </div>
      </Tag>
    </Card>
  );
}

// กำหนดส่งรายวัน: ย้อนหลังและล่วงหน้าเท่า ๆ กัน
function DueTrend({ data }) {
  const [span, setSpan] = useState(7);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const days = Array.from({ length: span * 2 + 1 }, (_, i) => {
    const d = new Date(today); d.setDate(d.getDate() + i - span);
    const key = fmt(d);
    return { d, n: data.filter(j => j.DueDate === key).length };
  });
  const max = Math.max(4, ...days.map(x => x.n));
  const W = 700, H = 210, L = 30, B = 24;
  const x = i => L + (i * (W - L - 8)) / (days.length - 1);
  const y = n => 8 + (1 - n / max) * (H - B - 8);
  const line = days.map((p, i) => `${x(i)},${y(p.n)}`).join(' ');
  const area = `${x(0)},${y(0)} ${line} ${x(days.length - 1)},${y(0)}`;
  const every = span > 7 ? 4 : 2;

  return (
    <Card className="p-5 md:col-span-2">
      <div className="flex flex-wrap justify-between items-start gap-3">
        <div>
          <h2 className="font-medium">กำหนดส่งรายวัน</h2>
          <p className={sub}>จำนวนงานตามวันกำหนดเสร็จ เส้นประคือวันนี้</p>
        </div>
        <div className="flex rounded-full bg-slate-200/70 dark:bg-slate-700 p-1 text-xs">
          {[7, 14].map(s => (
            <button key={s} onClick={() => setSpan(s)}
              className={`px-3 py-1 rounded-full whitespace-nowrap ${span === s ? 'bg-white dark:bg-slate-900 shadow-sm' : ''}`}>
              ±{s} วัน
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto thin mt-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[520px]" role="img" aria-label="กราฟจำนวนงานตามวันกำหนดเสร็จ">
          <defs>
            <pattern id="stripes" width="6" height="6" patternUnits="userSpaceOnUse">
              <rect width="6" height="6" fill="#60a5fa" opacity=".12" />
              <rect width="1.5" height="6" fill="#60a5fa" opacity=".35" />
            </pattern>
          </defs>
          {[0, max / 2, max].map(v => (
            <g key={v}>
              <line x1={L} x2={W - 8} y1={y(v)} y2={y(v)} stroke="#94a3b8" opacity=".25" />
              <text x="0" y={y(v) + 4} fontSize="11" fill="#94a3b8">{Math.round(v)}</text>
            </g>
          ))}
          <polygon points={area} fill="url(#stripes)" />
          <polyline points={line} fill="none" stroke="#3b82f6" strokeWidth="2" />
          <line x1={x(span)} x2={x(span)} y1="8" y2={y(0)} stroke="#64748b" strokeDasharray="4 4" />
          {days.map((p, i) => (
            <g key={i}>
              <circle cx={x(i)} cy={y(p.n)} r="3" fill="#3b82f6"><title>{`${fmt(p.d)}: ${p.n} งาน`}</title></circle>
              {(i - span) % every === 0 && (
                <text x={x(i)} y={H - 4} fontSize="11" textAnchor="middle" fill="#94a3b8">
                  {p.d.getDate()}/{p.d.getMonth() + 1}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>
    </Card>
  );
}

// วงแหวนแบบขีด
function StatusRing({ m }) {
  const items = [
    ['เสร็จแล้ว', m.done, '#3b82f6'], ['กำลังผลิต', m.inProc, '#10b981'],
    ['รอ', m.waiting, '#f59e0b'], ['ติดปัญหา', m.hold.length, '#f43f5e'],
  ];
  const total = m.data.length;
  const TICKS = 60;
  const colorAt = i => {
    let sum = 0;
    for (const [, n, c] of items) { sum += n; if ((i + 0.5) / TICKS <= sum / total) return c; }
    return '#cbd5e1';
  };
  return (
    <Card className="p-5">
      <h2 className="font-medium">สถานะงาน</h2>
      <p className={sub}>งานปัจจุบัน {total} รายการ</p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-5">
        <div className="relative w-40 h-40">
          <svg viewBox="-80 -80 160 160" className="w-full h-full" aria-hidden="true">
            {Array.from({ length: TICKS }, (_, i) => (
              <line key={i} y1="-76" y2="-56" strokeWidth="2.5" strokeLinecap="round"
                stroke={total ? colorAt(i) : '#cbd5e1'} transform={`rotate(${(i * 360) / TICKS})`} />
            ))}
          </svg>
          <div className="absolute inset-0 grid place-content-center text-center">
            <div className="text-3xl font-medium">{pct(m.done, total)}%</div>
            <div className={sub}>เสร็จแล้ว</div>
          </div>
        </div>
        <ul className="flex-1 min-w-[150px] space-y-3 text-sm">
          {items.map(([label, n, c]) => (
            <li key={label} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
              <span className="flex-1">{label}</span>
              <span className={sub}>{n}</span>
              <b className="w-10 text-right font-medium tabular-nums">{pct(n, total)}%</b>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

// สรุปอัตโนมัติจากกฎง่าย ๆ (ไม่ได้ใช้ AI)
function Insights({ m, active, onFollow }) {
  const top = m.deptNames[0];
  return (
    <Card className="p-5 flex flex-col">
      <h2 className="font-medium">สรุปประเด็นสำคัญ</h2>
      <div className="my-4 grid grid-cols-2 gap-4">
        <div>
          <div className={sub}>ใกล้ครบกำหนด</div>
          <div className="text-2xl text-amber-600 dark:text-amber-400">{m.dueSoon.length} งาน</div>
        </div>
        <div className="border-l border-slate-300/60 dark:border-slate-600 pl-4">
          <div className={sub}>ภาระสูงสุด</div>
          <p className="text-sm">{top ? `${top} มีงานค้าง ${m.depts[top].length} จาก ${active} งาน` : 'ไม่มีงานค้าง'}</p>
        </div>
      </div>
      <button onClick={onFollow}
        className="mt-auto flex justify-between rounded-lg bg-white dark:bg-slate-900 px-4 py-3 text-sm text-blue-600 dark:text-blue-400">
        <span>ดูงานที่ต้องติดตาม</span><span>›</span>
      </button>
    </Card>
  );
}

function Health({ m, active }) {
  const open = m.data.filter(j => j.Status !== 'Done');
  const rows = [
    ['งานค้างที่ยังไม่เกินกำหนด', pct(open.filter(j => !j.overdue).length, active), '#10b981'],
    ['งานค้างที่กำลังผลิต', pct(m.inProc, active), '#ec4899'],
    ['เครื่อง/ทีมที่มีงานรัน', pct(m.machineList.filter(x => x.run.length).length, m.machineList.length), '#f59e0b'],
  ];
  return (
    <Card className="p-5">
      <h2 className="font-medium mb-4">สุขภาพการผลิต</h2>
      <div className="space-y-4">
        {rows.map(([label, v, c]) => (
          <div key={label}>
            <div className="flex justify-between text-sm"><span>{label}</span><span className="tabular-nums">{v}%</span></div>
            <div className="mt-2 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700">
              <div className="h-full rounded-full" style={{ width: `${v}%`, background: c }} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function Weekday({ data }) {
  const n = WEEK.map(() => 0);
  data.forEach(j => { if (j.Status !== 'Done' && j.due) n[(new Date(j.due).getDay() + 6) % 7]++; });
  const max = Math.max(1, ...n);
  const avg = n.reduce((a, b) => a + b, 0) / 7;
  return (
    <Card className="p-5">
      <h2 className="font-medium">งานค้างตามวันกำหนดส่ง</h2>
      <p className={sub}>เส้นประ = เฉลี่ย {avg.toFixed(1)} งานต่อวัน</p>
      <div className="relative mt-6 h-32">
        <div className="absolute inset-x-0 border-t border-dashed border-blue-500" style={{ bottom: `${(avg / max) * 85}%` }} />
        <div className="flex items-end gap-2 h-full">
          {n.map((v, i) => (
            <div key={i} className="flex-1 h-full flex flex-col justify-end items-center">
              <span className={sub}>{v}</span>
              <div className="w-full rounded-t-md bg-gradient-to-b from-blue-500 to-blue-200 dark:to-blue-900"
                style={{ height: `${(v / max) * 85}%`, opacity: v === max ? 1 : 0.55 }} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-2 mt-2">{WEEK.map(d => <span key={d} className={`flex-1 text-center ${sub}`}>{d}</span>)}</div>
    </Card>
  );
}

export default function Overview({ m, onFollow }) {
  const [showOverdue, setShowOverdue] = useState(false);
  const open = m.data.filter(j => j.Status !== 'Done');
  const active = open.length;
  const depts = [...new Set(m.data.map(j => j.Department))].slice(0, 7);
  const by = list => depts.map(d => [d, list.filter(j => j.Department === d).length]);
  const total = m.data.length;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="งานทั้งหมด" value={total.toLocaleString()} note={`${m.totalQty.toLocaleString()} pcs`}
          color="#3b82f6" values={by(m.data)} />
        <Stat label="กำลังผลิต" value={m.inProc} note={`${pct(m.inProc, total)}% ของทั้งหมด`}
          color="#10b981" values={by(m.data.filter(j => j.Status === 'In-Process'))} />
        <Stat label="รอคิว" value={m.waiting} note={`${pct(m.waiting, total)}% ของทั้งหมด`}
          color="#f59e0b" values={by(m.data.filter(j => j.Status === 'Waiting'))} />
        <Stat label="เกินกำหนด" value={m.overdue.length} note={m.overdue.length ? 'กดเพื่อดูรายการ' : 'ไม่มีงานเกินกำหนด'}
          color="#f43f5e" values={by(m.overdue)} onClick={m.overdue.length ? () => setShowOverdue(true) : undefined} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        <DueTrend data={m.data} />
        <StatusRing m={m} />
        <Insights m={m} active={active} onFollow={onFollow} />
        <Health m={m} active={active} />
        <Weekday data={m.data} />
      </div>
      {showOverdue && <OverdueModal list={m.overdue} onClose={() => setShowOverdue(false)} />}
    </div>
  );
}
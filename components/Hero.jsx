import { useEffect, useState } from 'react';
import { Icon } from './ui';

const DAYS = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
const MONTHS = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
const FEATURES = [
  ['alert', 'เห็นคอขวดทันที'],
  ['layers', 'ติดตามทุกขั้นตอน'],
  ['clock', 'แจ้งงานเกินกำหนด'],
  ['check', 'ข้อมูลจาก Google Sheets'],
];

const two = (n) => String(n).padStart(2, '0');

// updated อาจเป็น Date, timestamp หรือข้อความ รับได้ทุกแบบ
function fmtUpdated(u) {
  if (!u) return '-';
  const d = u instanceof Date ? u : new Date(u);
  return isNaN(d) ? String(u) : `${two(d.getHours())}:${two(d.getMinutes())} น.`;
}

export default function Hero({ updated }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
      <section
        className="relative overflow-hidden rounded-xl p-6 md:p-7 text-white bg-gradient-to-br from-[#0B2455] to-[#134398]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(to bottom right,#0B2455,#134398)',
          backgroundSize: '28px 28px,28px 28px,100% 100%',
        }}
      >
        <h2 className="text-2xl md:text-3xl font-bold leading-snug">
          งานต่อเนื่อง ไม่มีคอขวด<br />ส่งมอบทันตามกำหนด
        </h2>
        <p className="mt-2 mb-5 text-sm md:text-base text-blue-100">
          เห็นปัญหาทุกขั้นตอนก่อนงานจะเลยกำหนด ตัดสินใจเร่งงานได้เร็วขึ้น
        </p>
        <div className="flex flex-wrap gap-x-7 gap-y-2 text-sm">
          {FEATURES.map(([icon, text]) => (
            <span key={text} className="flex items-center gap-2"><Icon name={icon} size={18} />{text}</span>
          ))}
        </div>
      </section>

      <section className="rounded-xl p-5 text-white bg-gradient-to-b from-[#0B2455] to-[#12326F] flex flex-col justify-center gap-1">
        <small className="text-blue-100">
          วัน{DAYS[now.getDay()]}ที่ {now.getDate()} {MONTHS[now.getMonth()]} {now.getFullYear()}
        </small>
        <div className="text-3xl font-semibold tabular-nums">{two(now.getHours())}:{two(now.getMinutes())} น.</div>
        <div className="mt-3 pt-3 border-t border-white/20 text-sm text-blue-100">
          อัปเดตข้อมูลล่าสุด {fmtUpdated(updated)}
        </div>
      </section>
    </div>
  );
}
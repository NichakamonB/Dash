import { ARCHIVE_DAYS, SOON_DAYS } from './config';

export const STATUS = {
  'Done':         { color: '#10b981', badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  'In-Process':   { color: '#3b82f6', badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  'Waiting':      { color: '#f59e0b', badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  'Hold/Problem': { color: '#ef4444', badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
};

export function fmt(d) {
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export const DEMO = [
  ['J-1001','Preparation','Saw-01',500,'-5','Done'],['J-1002','CNC','CNC-01',150,'-3','Hold/Problem'],
  ['J-1003','Milling','Milling-02',200,'-2','In-Process'],['J-1004','Finishing','Polisher-A',1000,'2','Waiting'],
  ['J-1005','CNC','CNC-02',80,'-1','In-Process'],['J-1006','QC','QC-Station-1',300,'1','In-Process'],
  ['J-1007','Milling','Milling-01',120,'0','Hold/Problem'],['J-1008','Grinding','Grind-01',400,'-1','Waiting'],
  ['J-1009','Preparation','Saw-02',600,'-2','Waiting'],['J-1010','CNC','CNC-03',50,'3','In-Process'],
  ['J-1011','Finishing','Polisher-B',200,'4','In-Process'],['J-1012','Milling','Milling-02',90,'5','Waiting'],
  ['J-1013','CNC','CNC-01',300,'-4','Waiting'],['J-1014','QC','QC-Station-2',800,'-3','Waiting'],
  ['J-1015','Grinding','Grind-02',150,'1','In-Process'],['J-1016','CNC','CNC-01',75,'7','Waiting'],
].map(([JobNo,Department,Responsible,Qty,off,Status]) => {
  const d = new Date(); d.setDate(d.getDate() + Number(off));
  return { JobNo, Department, Responsible, Qty, DueDate: fmt(d), Status };
});

function parseDate(v) {
  if (!v) return null;
  if (v instanceof Date) return v;
  const s = String(v).trim();
  const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return new Date(+iso[1], +iso[2] - 1, +iso[3]);
  const dmy = s.match(/^(\d{1,2})[-\/](\d{1,2})[-\/](\d{2,4})/);
  if (dmy) { let y = +dmy[3]; if (y < 100) y += 2000; return new Date(y, +dmy[2] - 1, +dmy[1]); }
  const d = new Date(s); return isNaN(d) ? null : d;
}

const TH_STATUS = { 'กำลังผลิต': 'In-Process', 'รอขึ้นเครื่อง': 'Waiting', 'เสร็จแล้ว': 'Done',
  'มีปัญหา': 'Hold/Problem', 'รอเครื่องซ่อม': 'Hold/Problem', 'พักงาน': 'Hold/Problem' };
const pick = (r, ...keys) => { for (const k of keys) if (r[k] !== undefined && r[k] !== null && String(r[k]).trim() !== '') return r[k]; };
const deptOf = p => String(p || '').replace(/-\d+$/, '').trim() || 'Uncategorized';

export function normalize(rows) {
  return rows.map(r => {
    const jobNo = pick(r, 'Job No', 'Job No.', 'JOB No', 'JobNo');
    if (!jobNo) return null;
    const proc = pick(r, 'Current Process', 'CNC-Machine', 'Machine', 'Responsible') || 'Unknown';
    const rawStatus = String(pick(r, 'Status', 'STATUS') || '').trim();
    const status = TH_STATUS[rawStatus] || rawStatus;
    const due = parseDate(pick(r, 'Due Date', 'DueDate', 'กำหนดเสร็จ'));
    return {
      JobNo: String(jobNo),
      Department: pick(r, 'Department') || deptOf(proc),
      Responsible: String(proc),
      Qty: parseInt(pick(r, 'Qty', 'Production Qty.')) || 0,
      DueDate: due ? fmt(due) : '-',
      due,
      Status: STATUS[status] ? status : 'Waiting',
    };
  }).filter(Boolean);
}

export function computeMetrics(jobs, today) {
  const DAY = 86400000;
  const all = jobs.map(j => {
    const daysLate = j.due ? Math.round((today - j.due) / DAY) : null; // บวก = เกินมาแล้ว, ลบ = ยังไม่ถึง
    return { ...j, daysLate, overdue: daysLate !== null && daysLate > 0 && j.Status !== 'Done' };
  });
  const archive = all.filter(j => j.daysLate !== null && j.daysLate > ARCHIVE_DAYS)
    .sort((a, b) => b.daysLate - a.daysLate);
  const old = new Set(archive);
  const data = all.filter(j => !old.has(j)); // งานปัจจุบัน (ไม่รวมย้อนหลัง)

  const count = s => data.filter(j => j.Status === s).length;
  const active = data.filter(j => j.Status !== 'Done');
  const depts = {};
  active.forEach(j => (depts[j.Department] ||= []).push(j));
  const deptNames = Object.keys(depts).sort((a, b) => depts[b].length - depts[a].length);
  const machines = {};
  active.forEach(j => {
    const mm = (machines[j.Responsible] ||= { name: j.Responsible, run: [], queue: [] });
    (j.Status === 'In-Process' ? mm.run : mm.queue).push(j);
  });
  const machineList = Object.values(machines)
    .sort((a, b) => b.run.length + b.queue.length - (a.run.length + a.queue.length));
  machineList.forEach(x => x.queue.sort((a, b) => (a.due || 0) - (b.due || 0)));

  return {
    data, archive, depts, deptNames, machineList,
    overdue: data.filter(j => j.overdue).sort((a, b) => b.daysLate - a.daysLate),
    dueSoon: active.filter(j => j.daysLate !== null && j.daysLate <= 0 && j.daysLate >= -SOON_DAYS)
      .sort((a, b) => b.daysLate - a.daysLate),
    hold: data.filter(j => j.Status === 'Hold/Problem'),
    totalQty: data.reduce((s, j) => s + j.Qty, 0),
    inProc: count('In-Process'), waiting: count('Waiting'), done: count('Done'),
    statusCounts: Object.keys(STATUS).map(count),
  };
}

// งานเกินกำหนด + งานติดปัญหา ไม่นับซ้ำ เรียงจากเกินมานานสุดก่อน
export function followList(m) {
  const map = new Map();
  [...m.overdue, ...m.hold].forEach(j => map.set(j.JobNo, j));
  return [...map.values()].sort((a, b) => (b.daysLate ?? -1e9) - (a.daysLate ?? -1e9));
}
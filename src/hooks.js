import { useState, useEffect, useCallback } from 'react';
import { API_URL, API_KEY, POLL_SECONDS } from './config';
import { DEMO, normalize } from './data';

export function useJobs() {
  const [jobs, setJobs] = useState([]);
  const [updated, setUpdated] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      let rows = DEMO;
      if (API_URL) {
        const sep = API_URL.includes('?') ? '&' : '?';
        const url = API_URL + sep + (API_KEY ? 'key=' + encodeURIComponent(API_KEY) + '&' : '') + 't=' + Date.now();
        const res = await fetch(url); // ห้ามใส่ option cache/headers เพราะจะติด CORS preflight
        if (!res.ok) throw new Error('HTTP ' + res.status);
        rows = await res.json();
        if (!Array.isArray(rows)) throw new Error(rows.error || 'รูปแบบข้อมูลไม่ถูกต้อง');
      }
      setJobs(normalize(rows));
      setUpdated(new Date());
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(() => { if (!document.hidden) load(); }, POLL_SECONDS * 1000);
    const vis = () => { if (!document.hidden) load(); };
    document.addEventListener('visibilitychange', vis);
    return () => { clearInterval(t); document.removeEventListener('visibilitychange', vis); };
  }, [load]);

  return { jobs, updated, error, loading, reload: load };
}

export function useDark() {
  const [dark, setDark] = useState(() => {
    try { const s = localStorage.getItem('theme'); if (s) return s === 'dark'; } catch (e) {}
    const h = new Date().getHours(); return h < 7 || h >= 17;
  });
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (e) {}
  }, [dark]);
  return [dark, setDark];
}

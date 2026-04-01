"use client";
import { useState, useEffect, useCallback } from "react";

// ── CONSTANTS ────────────────────────────────────────────────────────────────
const STATUS = {
  new:       { label: "New",       color: "#3b9eff", bg: "rgba(59,158,255,0.12)",  dot: "#3b9eff" },
  contacted: { label: "Contacted", color: "#f59e0b", bg: "rgba(245,158,11,0.12)", dot: "#f59e0b" },
  enrolled:  { label: "Enrolled",  color: "#10b981", bg: "rgba(16,185,129,0.12)", dot: "#10b981" },
  cancelled: { label: "Cancelled", color: "#ef4444", bg: "rgba(239,68,68,0.12)",  dot: "#ef4444" },
};

const CERTS = ["TCF Québec","TEF Québec","TCF Canada","TEF Canada","DELF A1","DELF A2","DILF","DALF C1","DALF C2","DFP"];

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@300;400;500&family=Instrument+Sans:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:        #080c12;
    --surface:   #0d1420;
    --surface2:  #121a28;
    --border:    rgba(255,255,255,0.06);
    --border2:   rgba(255,255,255,0.1);
    --gold:      #c9a84c;
    --gold2:     #e4c97e;
    --text:      #f0f4ff;
    --text2:     #8892a4;
    --text3:     #4a5568;
    --radius:    12px;
    --sidebar:   260px;
  }

  html, body { height: 100%; background: var(--bg); color: var(--text); font-family: 'Instrument Sans', sans-serif; }

  /* ── SCROLLBAR ── */
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

  /* ── LAYOUT ── */
  .admin-root { display: flex; height: 100vh; overflow: hidden; }

  /* ── SIDEBAR ── */
  .sidebar {
    width: var(--sidebar); flex-shrink: 0;
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex; flex-direction: column;
    padding: 0; overflow: hidden;
  }
  .sidebar-logo {
    padding: 24px 20px 20px;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 12px;
  }
  .logo-mark {
    width: 36px; height: 36px; background: linear-gradient(135deg, var(--gold), #a8893d);
    border-radius: 10px; display: flex; align-items: center; justify-content: center;
    font-size: 16px; flex-shrink: 0;
  }
  .logo-text { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 13px; color: var(--text); line-height: 1.2; }
  .logo-text span { display: block; color: var(--gold); font-size: 10px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; }

  .sidebar-nav { flex: 1; padding: 16px 12px; display: flex; flex-direction: column; gap: 2px; overflow-y: auto; }
  .nav-section-label { font-size: 10px; color: var(--text3); letter-spacing: 0.16em; text-transform: uppercase; font-weight: 600; padding: 12px 8px 6px; }

  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 12px; border-radius: 8px; cursor: pointer;
    color: var(--text2); font-size: 13.5px; font-weight: 500;
    transition: all 0.15s; border: none; background: none; width: 100%; text-align: left;
    position: relative;
  }
  .nav-item:hover { background: rgba(255,255,255,0.04); color: var(--text); }
  .nav-item.active { background: rgba(201,168,76,0.1); color: var(--gold); }
  .nav-item.active::before {
    content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%);
    width: 3px; height: 60%; background: var(--gold); border-radius: 0 2px 2px 0;
  }
  .nav-icon { font-size: 16px; width: 20px; text-align: center; flex-shrink: 0; }
  .nav-badge {
    margin-left: auto; background: var(--gold); color: #000;
    font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 20px;
    font-family: 'DM Mono', monospace;
  }

  .sidebar-footer {
    padding: 16px; border-top: 1px solid var(--border);
    display: flex; align-items: center; gap: 10px;
  }
  .avatar {
    width: 32px; height: 32px; background: linear-gradient(135deg, var(--gold), #a8893d);
    border-radius: 8px; display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; color: #000; flex-shrink: 0;
  }
  .avatar-info { flex: 1; min-width: 0; }
  .avatar-name { font-size: 12.5px; font-weight: 600; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .avatar-role { font-size: 10.5px; color: var(--text3); }
  .logout-btn {
    background: none; border: none; color: var(--text3); cursor: pointer;
    padding: 6px; border-radius: 6px; transition: all 0.15s; font-size: 14px;
  }
  .logout-btn:hover { background: rgba(239,68,68,0.1); color: #ef4444; }

  /* ── MAIN ── */
  .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

  .topbar {
    height: 60px; flex-shrink: 0;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 28px; background: var(--surface);
  }
  .page-title { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; }
  .topbar-right { display: flex; align-items: center; gap: 12px; }
  .topbar-search {
    display: flex; align-items: center; gap: 8px;
    background: var(--bg); border: 1px solid var(--border2);
    border-radius: 8px; padding: 7px 14px; width: 240px;
  }
  .topbar-search input {
    background: none; border: none; color: var(--text); font-size: 13px;
    font-family: 'Instrument Sans', sans-serif; width: 100%; outline: none;
  }
  .topbar-search input::placeholder { color: var(--text3); }

  .content { flex: 1; overflow-y: auto; padding: 28px; }

  /* ── STAT CARDS ── */
  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
  .stat-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 20px 22px;
    position: relative; overflow: hidden; transition: border-color 0.2s;
  }
  .stat-card:hover { border-color: var(--border2); }
  .stat-card::after {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: var(--accent-color, var(--gold));
  }
  .stat-label { font-size: 11px; color: var(--text2); letter-spacing: 0.1em; text-transform: uppercase; font-weight: 600; margin-bottom: 10px; }
  .stat-value { font-family: 'Syne', sans-serif; font-size: 32px; font-weight: 800; line-height: 1; margin-bottom: 6px; }
  .stat-sub { font-size: 11.5px; color: var(--text3); }
  .stat-icon { position: absolute; top: 18px; right: 18px; font-size: 22px; opacity: 0.5; }

  /* ── CHARTS ROW ── */
  .charts-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 28px; }
  .chart-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 20px 22px;
  }
  .chart-title { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; margin-bottom: 4px; }
  .chart-sub { font-size: 11.5px; color: var(--text3); margin-bottom: 20px; }

  /* Bar chart */
  .bar-chart { display: flex; align-items: flex-end; gap: 8px; height: 100px; }
  .bar-group { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; }
  .bar { width: 100%; border-radius: 4px 4px 0 0; transition: opacity 0.2s; min-height: 4px; }
  .bar:hover { opacity: 0.8; }
  .bar-label { font-size: 10px; color: var(--text3); font-family: 'DM Mono', monospace; }

  /* Donut */
  .donut-wrap { display: flex; align-items: center; gap: 24px; }
  .donut-legend { display: flex; flex-direction: column; gap: 10px; }
  .legend-item { display: flex; align-items: center; gap: 8px; font-size: 12.5px; color: var(--text2); }
  .legend-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .legend-val { font-family: 'DM Mono', monospace; font-size: 12px; color: var(--text); margin-left: auto; font-weight: 500; }

  /* ── TABLE ── */
  .table-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); overflow: hidden;
  }
  .table-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 22px; border-bottom: 1px solid var(--border);
  }
  .table-header-left { display: flex; align-items: center; gap: 16px; }
  .table-title { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; }
  .filter-tabs { display: flex; gap: 4px; }
  .filter-tab {
    padding: 5px 12px; border-radius: 6px; font-size: 12px; font-weight: 500;
    cursor: pointer; border: none; background: none; color: var(--text2); transition: all 0.15s;
  }
  .filter-tab:hover { background: rgba(255,255,255,0.04); color: var(--text); }
  .filter-tab.active { background: rgba(201,168,76,0.15); color: var(--gold); }
  .export-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: 8px; font-size: 12.5px; font-weight: 600;
    background: var(--bg); border: 1px solid var(--border2); color: var(--text2);
    cursor: pointer; transition: all 0.15s; font-family: 'Instrument Sans', sans-serif;
  }
  .export-btn:hover { border-color: var(--gold); color: var(--gold); }

  table { width: 100%; border-collapse: collapse; }
  thead tr { border-bottom: 1px solid var(--border); }
  th {
    padding: 11px 22px; text-align: left; font-size: 10.5px; color: var(--text3);
    font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
    font-family: 'DM Mono', monospace; white-space: nowrap;
  }
  tbody tr {
    border-bottom: 1px solid var(--border);
    cursor: pointer; transition: background 0.12s;
  }
  tbody tr:last-child { border-bottom: none; }
  tbody tr:hover { background: rgba(255,255,255,0.025); }
  tbody tr.selected { background: rgba(201,168,76,0.05); }
  td { padding: 13px 22px; font-size: 13px; }
  .td-name { font-weight: 600; color: var(--text); }
  .td-email { color: var(--text2); font-size: 12.5px; }
  .td-phone { font-family: 'DM Mono', monospace; font-size: 12px; color: var(--text2); }
  .td-cert { color: var(--gold); font-size: 12.5px; font-weight: 500; }
  .td-date { font-family: 'DM Mono', monospace; font-size: 11.5px; color: var(--text3); }

  .status-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 10px; border-radius: 20px; font-size: 11.5px; font-weight: 600;
    white-space: nowrap;
  }
  .status-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }

  /* ── DETAIL PANEL ── */
  .detail-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.5);
    backdrop-filter: blur(4px); z-index: 100;
    display: flex; align-items: center; justify-content: flex-end;
    animation: fadeIn 0.2s ease;
  }
  .detail-panel {
    width: 420px; height: 100vh; background: var(--surface);
    border-left: 1px solid var(--border2); overflow-y: auto;
    animation: slideIn 0.25s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideIn { from { transform: translateX(40px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

  .detail-top {
    padding: 24px; border-bottom: 1px solid var(--border);
    display: flex; align-items: flex-start; justify-content: space-between;
  }
  .detail-avatar {
    width: 52px; height: 52px; border-radius: 14px;
    background: linear-gradient(135deg, var(--gold), #a8893d);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800;
    color: #000; flex-shrink: 0; margin-bottom: 12px;
  }
  .detail-name { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800; margin-bottom: 4px; }
  .detail-cert { font-size: 12.5px; color: var(--gold); font-weight: 500; }
  .close-btn {
    background: rgba(255,255,255,0.05); border: 1px solid var(--border);
    color: var(--text2); width: 32px; height: 32px; border-radius: 8px;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    font-size: 16px; transition: all 0.15s; flex-shrink: 0;
  }
  .close-btn:hover { background: rgba(239,68,68,0.1); color: #ef4444; border-color: rgba(239,68,68,0.3); }

  .detail-section { padding: 20px 24px; border-bottom: 1px solid var(--border); }
  .detail-section-title { font-size: 10.5px; color: var(--text3); letter-spacing: 0.14em; text-transform: uppercase; font-weight: 600; margin-bottom: 14px; font-family: 'DM Mono', monospace; }

  .info-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
  .info-icon { width: 30px; height: 30px; background: rgba(255,255,255,0.04); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 13px; flex-shrink: 0; }
  .info-label { font-size: 10.5px; color: var(--text3); margin-bottom: 1px; }
  .info-value { font-size: 13px; color: var(--text); font-weight: 500; }
  .info-link { color: #3b9eff; text-decoration: none; }
  .info-link:hover { text-decoration: underline; }

  /* Status selector */
  .status-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .status-opt {
    padding: 8px 12px; border-radius: 8px; cursor: pointer; border: 1px solid transparent;
    display: flex; align-items: center; gap: 7px; font-size: 12.5px; font-weight: 600;
    transition: all 0.15s; background: rgba(255,255,255,0.03);
  }
  .status-opt:hover { border-color: var(--border2); }
  .status-opt.active { border-color: currentColor; }

  /* Notes */
  .notes-area {
    width: 100%; background: var(--bg); border: 1px solid var(--border);
    border-radius: 8px; padding: 12px; color: var(--text);
    font-family: 'Instrument Sans', sans-serif; font-size: 13px;
    resize: none; outline: none; min-height: 90px; line-height: 1.6;
    transition: border-color 0.15s;
  }
  .notes-area:focus { border-color: var(--gold); }
  .notes-area::placeholder { color: var(--text3); }

  /* Email compose */
  .email-input {
    width: 100%; background: var(--bg); border: 1px solid var(--border);
    border-radius: 8px; padding: 10px 12px; color: var(--text);
    font-family: 'Instrument Sans', sans-serif; font-size: 13px; outline: none;
    transition: border-color 0.15s; margin-bottom: 10px;
  }
  .email-input:focus { border-color: var(--gold); }
  .email-input::placeholder { color: var(--text3); }

  /* Buttons */
  .btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 6px;
    padding: 9px 16px; border-radius: 8px; font-size: 13px; font-weight: 600;
    cursor: pointer; border: none; transition: all 0.15s;
    font-family: 'Instrument Sans', sans-serif;
  }
  .btn-gold { background: var(--gold); color: #000; width: 100%; margin-top: 8px; }
  .btn-gold:hover { background: var(--gold2); transform: translateY(-1px); }
  .btn-ghost { background: rgba(255,255,255,0.04); color: var(--text2); border: 1px solid var(--border); width: 100%; margin-top: 8px; }
  .btn-ghost:hover { border-color: var(--border2); color: var(--text); }
  .btn-danger { background: rgba(239,68,68,0.1); color: #ef4444; border: 1px solid rgba(239,68,68,0.2); width: 100%; margin-top: 8px; }
  .btn-danger:hover { background: rgba(239,68,68,0.18); }
  .btn-sm { padding: 6px 12px; font-size: 12px; width: auto; margin-top: 0; }

  /* Empty / Loading */
  .empty-state { padding: 60px; text-align: center; color: var(--text3); }
  .empty-icon { font-size: 40px; margin-bottom: 12px; opacity: 0.4; }
  .empty-text { font-size: 14px; }
  .loading-row td { padding: 40px; text-align: center; color: var(--text3); }

  /* Toast */
  .toast {
    position: fixed; bottom: 24px; right: 24px; z-index: 999;
    background: var(--surface2); border: 1px solid var(--border2);
    padding: 12px 20px; border-radius: 10px; font-size: 13.5px;
    display: flex; align-items: center; gap: 8px;
    animation: toastIn 0.3s ease; box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  }
  @keyframes toastIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

  /* Login */
  .login-wrap {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: var(--bg);
    background-image: radial-gradient(ellipse at 20% 50%, rgba(201,168,76,0.05) 0%, transparent 60%),
                      radial-gradient(ellipse at 80% 20%, rgba(59,158,255,0.04) 0%, transparent 50%);
  }
  .login-card {
    width: 380px; background: var(--surface); border: 1px solid var(--border2);
    border-radius: 20px; padding: 40px; text-align: center;
  }
  .login-logo { width: 56px; height: 56px; background: linear-gradient(135deg, var(--gold), #a8893d); border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 26px; margin: 0 auto 20px; }
  .login-title { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; margin-bottom: 4px; }
  .login-sub { font-size: 13px; color: var(--text3); margin-bottom: 28px; }
  .login-input {
    width: 100%; background: var(--bg); border: 1px solid var(--border);
    border-radius: 10px; padding: 12px 16px; color: var(--text);
    font-size: 15px; font-family: 'Instrument Sans', sans-serif;
    outline: none; margin-bottom: 14px; transition: border-color 0.15s;
    text-align: center; letter-spacing: 0.08em;
  }
  .login-input:focus { border-color: var(--gold); }
  .login-btn {
    width: 100%; background: var(--gold); color: #000; border: none;
    border-radius: 10px; padding: 13px; font-size: 14px; font-weight: 700;
    cursor: pointer; font-family: 'Instrument Sans', sans-serif; transition: all 0.2s;
  }
  .login-btn:hover { background: var(--gold2); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(201,168,76,0.25); }
  .login-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .login-error { color: #ef4444; font-size: 12.5px; margin-bottom: 10px; }

  /* Calendar */
  .cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
  .cal-day-label { text-align: center; font-size: 10px; color: var(--text3); padding: 6px 0; font-family: 'DM Mono', monospace; letter-spacing: 0.06em; }
  .cal-day {
    aspect-ratio: 1; border-radius: 8px; display: flex; flex-direction: column;
    align-items: center; justify-content: center; font-size: 12px;
    cursor: pointer; transition: background 0.12s; position: relative;
    background: rgba(255,255,255,0.02); color: var(--text2);
  }
  .cal-day.empty { background: transparent; cursor: default; }
  .cal-day.today { background: rgba(201,168,76,0.12); color: var(--gold); font-weight: 700; }
  .cal-day.has-enroll { background: rgba(59,158,255,0.1); color: #3b9eff; }
  .cal-day.has-enroll::after {
    content: ''; position: absolute; bottom: 4px;
    width: 4px; height: 4px; background: #3b9eff; border-radius: 50%;
  }
  .cal-nav { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .cal-month { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; }
  .cal-btn { background: none; border: 1px solid var(--border); color: var(--text2); width: 28px; height: 28px; border-radius: 6px; cursor: pointer; font-size: 13px; transition: all 0.15s; }
  .cal-btn:hover { border-color: var(--border2); color: var(--text); }
`;

// ── MINI COMPONENTS ──────────────────────────────────────────────────────────
function Toast({ msg, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, [onDone]);
  return <div className="toast"><span>✓</span>{msg}</div>;
}

function DonutChart({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  let offset = 0;
  const R = 44, C = 2 * Math.PI * R;
  return (
    <div className="donut-wrap">
      <svg width="110" height="110" viewBox="0 0 110 110">
        <circle cx="55" cy="55" r={R} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="12"/>
        {data.map((d, i) => {
          const pct = d.value / total;
          const dash = pct * C;
          const gap = C - dash;
          const el = (
            <circle key={i} cx="55" cy="55" r={R} fill="none"
              stroke={d.color} strokeWidth="12"
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-offset * C}
              strokeLinecap="butt"
              style={{ transform: "rotate(-90deg)", transformOrigin: "55px 55px" }}
            />
          );
          offset += pct;
          return el;
        })}
        <text x="55" y="52" textAnchor="middle" fill="#f0f4ff" fontSize="18" fontWeight="800" fontFamily="Syne">{total}</text>
        <text x="55" y="65" textAnchor="middle" fill="#4a5568" fontSize="9" fontFamily="DM Mono">TOTAL</text>
      </svg>
      <div className="donut-legend">
        {data.map((d, i) => (
          <div key={i} className="legend-item">
            <span className="legend-dot" style={{ background: d.color }}/>
            {d.label}
            <span className="legend-val">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BarChart({ data }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="bar-chart">
      {data.map((d, i) => (
        <div key={i} className="bar-group">
          <div className="bar" style={{ height: `${(d.value / max) * 80}px`, background: `linear-gradient(180deg, ${d.color}, ${d.color}88)` }} title={d.value}/>
          <span className="bar-label">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function Calendar({ enrollments }) {
  const [date, setDate] = useState(new Date());
  const year = date.getFullYear(), month = date.getMonth();
  const first = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const DAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];
  const today = new Date();

  const enrollDays = new Set(
    enrollments
      .filter(e => { const d = new Date(e.createdAt); return d.getFullYear() === year && d.getMonth() === month; })
      .map(e => new Date(e.createdAt).getDate())
  );

  return (
    <div>
      <div className="cal-nav">
        <button className="cal-btn" onClick={() => setDate(new Date(year, month - 1))}>‹</button>
        <span className="cal-month">{MONTHS[month]} {year}</span>
        <button className="cal-btn" onClick={() => setDate(new Date(year, month + 1))}>›</button>
      </div>
      <div className="cal-grid">
        {DAYS.map(d => <div key={d} className="cal-day-label">{d}</div>)}
        {Array(first).fill(null).map((_, i) => <div key={`e${i}`} className="cal-day empty"/>)}
        {Array(days).fill(null).map((_, i) => {
          const day = i + 1;
          const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
          const hasE = enrollDays.has(day);
          return (
            <div key={day} className={`cal-day${isToday ? " today" : ""}${hasE ? " has-enroll" : ""}`}>{day}</div>
          );
        })}
      </div>
    </div>
  );
}

// ── LOGIN ─────────────────────────────────────────────────────────────────────
function Login({ onLogin }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true); setErr("");
    const res = await fetch("/api/admin/login", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    const d = await res.json();
    setLoading(false);
    if (d.success) onLogin();
    else setErr(d.error || "Invalid password");
  };

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-logo">🎓</div>
        <div className="login-title">IFA Admin</div>
        <div className="login-sub">International French Academy · Kigali</div>
        <input className="login-input" type="password" placeholder="Enter admin password"
          value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} />
        {err && <div className="login-error">{err}</div>}
        <button className="login-btn" onClick={submit} disabled={loading}>
          {loading ? "Authenticating…" : "Access Dashboard →"}
        </button>
      </div>
    </div>
  );
}

// ── DETAIL PANEL ──────────────────────────────────────────────────────────────
function DetailPanel({ enrollment, onClose, onUpdate, onDelete, onSendEmail }) {
  const [status, setStatus] = useState(enrollment.status);
  const [notes, setNotes] = useState(enrollment.notes || "");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [sending, setSending] = useState(false);
  const [tab, setTab] = useState("info");
  const initials = `${enrollment.firstName[0]}${enrollment.lastName[0]}`.toUpperCase();

  const updateStatus = async (s) => {
    setStatus(s);
    await fetch("/api/admin/enrollments", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: enrollment._id, status: s }),
    });
    onUpdate();
  };

  const saveNotes = async () => {
    await fetch("/api/admin/enrollments", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: enrollment._id, notes }),
    });
    onUpdate();
  };

  const sendEmail = async () => {
    if (!emailSubject || !emailBody) return;
    setSending(true);
    await onSendEmail(enrollment.email, emailSubject, emailBody);
    setEmailSubject(""); setEmailBody(""); setSending(false);
  };

  const del = async () => {
    if (!confirm(`Delete ${enrollment.firstName} ${enrollment.lastName}?`)) return;
    await fetch("/api/admin/enrollments", {
      method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: enrollment._id }),
    });
    onDelete(); onClose();
  };

  const sc = STATUS[status];

  return (
    <div className="detail-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="detail-panel">
        <div className="detail-top">
          <div>
            <div className="detail-avatar">{initials}</div>
            <div className="detail-name">{enrollment.firstName} {enrollment.lastName}</div>
            <div className="detail-cert">{enrollment.certificationGoal}</div>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--border)", padding: "0 24px" }}>
          {[["info","Info"],["status","Status"],["notes","Notes"],["email","Email"]].map(([k,l]) => (
            <button key={k} onClick={() => setTab(k)} style={{
              background: "none", border: "none", padding: "12px 14px", cursor: "pointer",
              fontSize: "12.5px", fontWeight: 600, fontFamily: "Instrument Sans, sans-serif",
              color: tab === k ? "var(--gold)" : "var(--text3)",
              borderBottom: tab === k ? "2px solid var(--gold)" : "2px solid transparent",
              marginBottom: "-1px", transition: "all 0.15s",
            }}>{l}</button>
          ))}
        </div>

        {tab === "info" && (
          <div className="detail-section">
            <div className="detail-section-title">Contact Information</div>
            <div className="info-row">
              <div className="info-icon">📧</div>
              <div>
                <div className="info-label">Email</div>
                <a className="info-value info-link" href={`mailto:${enrollment.email}`}>{enrollment.email}</a>
              </div>
            </div>
            <div className="info-row">
              <div className="info-icon">📱</div>
              <div>
                <div className="info-label">Phone / WhatsApp</div>
                <a className="info-value info-link" href={`https://wa.me/${enrollment.phone.replace(/\D/g,"")}`} target="_blank">{enrollment.phone}</a>
              </div>
            </div>
            <div className="info-row">
              <div className="info-icon">🎯</div>
              <div>
                <div className="info-label">Certification Goal</div>
                <div className="info-value" style={{ color: "var(--gold)" }}>{enrollment.certificationGoal}</div>
              </div>
            </div>
            <div className="info-row">
              <div className="info-icon">📅</div>
              <div>
                <div className="info-label">Enrolled On</div>
                <div className="info-value">{new Date(enrollment.createdAt).toLocaleDateString("en-GB", { day:"2-digit", month:"long", year:"numeric" })}</div>
              </div>
            </div>
            {enrollment.message && (
              <div style={{ marginTop: 14, padding: "12px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 8, border: "1px solid var(--border)", fontSize: 13, color: "var(--text2)", lineHeight: 1.6 }}>
                💬 {enrollment.message}
              </div>
            )}
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <a href={`https://wa.me/${enrollment.phone.replace(/\D/g,"")}`} target="_blank" style={{ flex:1 }}>
                <button className="btn btn-ghost btn-sm" style={{ width:"100%" }}>💬 WhatsApp</button>
              </a>
              <a href={`mailto:${enrollment.email}`} style={{ flex:1 }}>
                <button className="btn btn-ghost btn-sm" style={{ width:"100%" }}>📧 Email</button>
              </a>
            </div>
            <button className="btn btn-danger" onClick={del}>🗑 Delete Enrollment</button>
          </div>
        )}

        {tab === "status" && (
          <div className="detail-section">
            <div className="detail-section-title">Update Status</div>
            <div className="status-grid">
              {Object.entries(STATUS).map(([k, v]) => (
                <div key={k} className={`status-opt${status === k ? " active" : ""}`}
                  style={{ color: v.color, borderColor: status === k ? v.color : "transparent" }}
                  onClick={() => updateStatus(k)}>
                  <span className="status-dot" style={{ background: v.color }}/>
                  {v.label}
                  {status === k && <span style={{ marginLeft:"auto", fontSize:11 }}>✓</span>}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, padding: "12px 14px", background: "rgba(255,255,255,0.02)", borderRadius: 8, border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 6 }}>CURRENT STATUS</div>
              <span className="status-badge" style={{ background: sc.bg, color: sc.color }}>
                <span className="status-dot" style={{ background: sc.dot }}/>{sc.label}
              </span>
            </div>
          </div>
        )}

        {tab === "notes" && (
          <div className="detail-section">
            <div className="detail-section-title">Internal Notes</div>
            <textarea className="notes-area" placeholder="Add notes about this student…" value={notes} onChange={e => setNotes(e.target.value)}/>
            <button className="btn btn-gold" onClick={saveNotes}>Save Notes</button>
          </div>
        )}

        {tab === "email" && (
          <div className="detail-section">
            <div className="detail-section-title">Send Email to Student</div>
            <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 12 }}>To: {enrollment.email}</div>
            <input className="email-input" placeholder="Subject line…" value={emailSubject} onChange={e => setEmailSubject(e.target.value)}/>
            <textarea className="notes-area" placeholder="Write your message…" value={emailBody} onChange={e => setEmailBody(e.target.value)} style={{ marginBottom: 0 }}/>
            <button className="btn btn-gold" onClick={sendEmail} disabled={sending}>
              {sending ? "Sending…" : "📨 Send Email"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── MAIN DASHBOARD ────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [enrollments, setEnrollments] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState("enrollments");
  const [toast, setToast] = useState(null);
  const [calDate] = useState(new Date());

  const showToast = (msg) => setToast(msg);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filter !== "all") params.set("status", filter);
    if (search) params.set("search", search);
    const res = await fetch(`/api/admin/enrollments?${params}`);
    if (res.status === 401) { setAuthed(false); return; }
    const d = await res.json();
    setEnrollments(d.enrollments || []);
    setStats(d.stats || {});
    setLoading(false);
  }, [filter, search]);

  useEffect(() => { if (authed) fetchData(); }, [authed, fetchData]);

  const exportCSV = () => {
    const headers = ["First Name","Last Name","Email","Phone","Certification","Status","Date","Message"];
    const rows = enrollments.map(e => [
      e.firstName, e.lastName, e.email, e.phone,
      e.certificationGoal, e.status,
      new Date(e.createdAt).toLocaleDateString("en-GB"),
      e.message || ""
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `ifa-enrollments-${Date.now()}.csv`; a.click();
    showToast("Exported to CSV successfully!");
  };

  const sendEmail = async (to, subject, body) => {
    await fetch("/api/admin/send-email", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, subject, body }),
    });
    showToast(`Email sent to ${to}`);
  };

  const logout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    setAuthed(false);
  };

  if (!authed) return (
    <>
      <style>{STYLES}</style>
      <Login onLogin={() => setAuthed(true)} />
    </>
  );

  // Chart data
  const statusData = Object.entries(STATUS).map(([k, v]) => ({ label: v.label, value: stats[k] || 0, color: v.color }));
  const certData = CERTS.map(c => ({
    label: c.replace(" ", "\n"), value: enrollments.filter(e => e.certificationGoal === c).length,
    color: "#c9a84c"
  })).filter(d => d.value > 0);

  // Group by month for bar chart
  const monthData = Array(6).fill(null).map((_, i) => {
    const d = new Date(); d.setMonth(d.getMonth() - (5 - i));
    const m = d.toLocaleString("default", { month: "short" });
    const count = enrollments.filter(e => {
      const ed = new Date(e.createdAt);
      return ed.getMonth() === d.getMonth() && ed.getFullYear() === d.getFullYear();
    }).length;
    return { label: m, value: count, color: "#c9a84c" };
  });

  return (
    <>
      <style>{STYLES}</style>
      <div className="admin-root">

        {/* ── SIDEBAR ── */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-mark">🎓</div>
            <div className="logo-text">
              IFA Admin
              <span>Kigali, Rwanda</span>
            </div>
          </div>

          <nav className="sidebar-nav">
            <div className="nav-section-label">Main</div>
            {[
              { id: "overview", icon: "⬛", label: "Overview" },
              { id: "enrollments", icon: "📋", label: "Enrollments", badge: stats.new || 0 },
              { id: "calendar", icon: "📅", label: "Calendar" },
            ].map(item => (
              <button key={item.id} className={`nav-item${view === item.id ? " active" : ""}`} onClick={() => setView(item.id)}>
                <span className="nav-icon">{item.icon}</span>
                {item.label}
                {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
              </button>
            ))}

            <div className="nav-section-label">Status</div>
            {Object.entries(STATUS).map(([k, v]) => (
              <button key={k} className={`nav-item${view === "enrollments" && filter === k ? " active" : ""}`}
                onClick={() => { setView("enrollments"); setFilter(k); }}>
                <span className="nav-icon"><span className="status-dot" style={{ background: v.color, width: 8, height: 8, display:"inline-block", borderRadius:"50%" }}/></span>
                {v.label}
                <span style={{ marginLeft:"auto", fontSize:11, color:"var(--text3)", fontFamily:"DM Mono" }}>{stats[k] || 0}</span>
              </button>
            ))}
          </nav>

          <div className="sidebar-footer">
            <div className="avatar">A</div>
            <div className="avatar-info">
              <div className="avatar-name">Administrator</div>
              <div className="avatar-role">IFA · Full Access</div>
            </div>
            <button className="logout-btn" onClick={logout} title="Logout">⏻</button>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <div className="main">
          <div className="topbar">
            <div className="page-title">
              {view === "overview" ? "Overview" : view === "calendar" ? "Calendar" : "Enrollments"}
            </div>
            <div className="topbar-right">
              {view === "enrollments" && (
                <>
                  <div className="topbar-search">
                    <span style={{ color: "var(--text3)", fontSize: 14 }}>🔍</span>
                    <input placeholder="Search students…" value={search} onChange={e => setSearch(e.target.value)}/>
                  </div>
                  <button className="export-btn" onClick={exportCSV}>⬇ Export CSV</button>
                  <button className="export-btn" onClick={fetchData}>↻ Refresh</button>
                </>
              )}
            </div>
          </div>

          <div className="content">

            {/* ── OVERVIEW ── */}
            {view === "overview" && (
              <>
                <div className="stats-grid">
                  {[
                    { label: "Total Enrollments", value: stats.total || 0, icon: "👥", color: "#c9a84c", sub: "All time" },
                    { label: "New Requests", value: stats.new || 0, icon: "🆕", color: "#3b9eff", sub: "Awaiting contact" },
                    { label: "Enrolled", value: stats.enrolled || 0, icon: "✅", color: "#10b981", sub: "Active students" },
                    { label: "Contacted", value: stats.contacted || 0, icon: "📞", color: "#f59e0b", sub: "In progress" },
                  ].map((s, i) => (
                    <div key={i} className="stat-card" style={{ "--accent-color": s.color }}>
                      <div className="stat-label">{s.label}</div>
                      <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                      <div className="stat-sub">{s.sub}</div>
                      <div className="stat-icon">{s.icon}</div>
                    </div>
                  ))}
                </div>

                <div className="charts-row">
                  <div className="chart-card">
                    <div className="chart-title">Enrollment Trend</div>
                    <div className="chart-sub">Last 6 months</div>
                    <BarChart data={monthData} />
                  </div>
                  <div className="chart-card">
                    <div className="chart-title">Status Breakdown</div>
                    <div className="chart-sub">Current distribution</div>
                    <DonutChart data={statusData} />
                  </div>
                </div>

                <div className="charts-row">
                  <div className="chart-card">
                    <div className="chart-title">Top Certifications</div>
                    <div className="chart-sub">Most requested</div>
                    <BarChart data={certData.slice(0, 6)} />
                  </div>
                  <div className="chart-card">
                    <div className="chart-title">Recent Activity</div>
                    <div className="chart-sub">Latest enrollments</div>
                    {enrollments.slice(0, 4).map((e, i) => {
                      const sc = STATUS[e.status];
                      return (
                        <div key={i} onClick={() => { setSelected(e); setView("enrollments"); }}
                          style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom: i < 3 ? "1px solid var(--border)" : "none", cursor:"pointer" }}>
                          <div style={{ width:34, height:34, background:"linear-gradient(135deg,var(--gold),#a8893d)", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800, color:"#000", flexShrink:0 }}>
                            {e.firstName[0]}{e.lastName[0]}
                          </div>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontSize:13, fontWeight:600, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{e.firstName} {e.lastName}</div>
                            <div style={{ fontSize:11.5, color:"var(--text3)" }}>{e.certificationGoal}</div>
                          </div>
                          <span className="status-badge" style={{ background: sc.bg, color: sc.color, fontSize:11 }}>
                            <span className="status-dot" style={{ background: sc.dot }}/>{sc.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* ── ENROLLMENTS TABLE ── */}
            {view === "enrollments" && (
              <div className="table-card">
                <div className="table-header">
                  <div className="table-header-left">
                    <div className="table-title">All Enrollments</div>
                    <div className="filter-tabs">
                      {["all","new","contacted","enrolled","cancelled"].map(f => (
                        <button key={f} className={`filter-tab${filter === f ? " active" : ""}`} onClick={() => setFilter(f)}>
                          {f.charAt(0).toUpperCase() + f.slice(1)}
                          {f !== "all" && <span style={{ marginLeft:4, opacity:0.6, fontFamily:"DM Mono", fontSize:10 }}>({stats[f] || 0})</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button className="export-btn" onClick={exportCSV}>⬇ Export CSV</button>
                </div>

                {loading ? (
                  <table><tbody><tr className="loading-row"><td colSpan="7">Loading enrollments…</td></tr></tbody></table>
                ) : enrollments.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📭</div>
                    <div className="empty-text">No enrollments found</div>
                  </div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Phone</th>
                        <th>Certification</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enrollments.map(e => {
                        const sc = STATUS[e.status];
                        return (
                          <tr key={e._id} className={selected?._id === e._id ? "selected" : ""} onClick={() => setSelected(e)}>
                            <td>
                              <div className="td-name">{e.firstName} {e.lastName}</div>
                              <div className="td-email">{e.email}</div>
                            </td>
                            <td className="td-phone">{e.phone}</td>
                            <td className="td-cert">{e.certificationGoal}</td>
                            <td>
                              <span className="status-badge" style={{ background: sc.bg, color: sc.color }}>
                                <span className="status-dot" style={{ background: sc.dot }}/>{sc.label}
                              </span>
                            </td>
                            <td className="td-date">{new Date(e.createdAt).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" })}</td>
                            <td style={{ fontSize:12, color:"var(--text3)", maxWidth:140, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                              {e.notes || <span style={{ opacity:0.3 }}>—</span>}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}

                <div style={{ padding:"14px 22px", borderTop:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <span style={{ fontSize:12, color:"var(--text3)", fontFamily:"DM Mono" }}>{enrollments.length} record{enrollments.length !== 1 ? "s" : ""}</span>
                  <span style={{ fontSize:12, color:"var(--text3)" }}>Click a row to view details</span>
                </div>
              </div>
            )}

            {/* ── CALENDAR ── */}
            {view === "calendar" && (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:16 }}>
                <div className="chart-card">
                  <div className="chart-title" style={{ marginBottom:4 }}>Enrollment Calendar</div>
                  <div className="chart-sub">Days with enrollments are highlighted in blue</div>
                  <Calendar enrollments={enrollments} />
                </div>
                <div className="chart-card">
                  <div className="chart-title" style={{ marginBottom:4 }}>This Month</div>
                  <div className="chart-sub" style={{ marginBottom:16 }}>Recent enrollments</div>
                  {enrollments.filter(e => {
                    const d = new Date(e.createdAt); const n = new Date();
                    return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
                  }).slice(0, 6).map((e, i, arr) => {
                    const sc = STATUS[e.status];
                    return (
                      <div key={i} onClick={() => { setSelected(e); setView("enrollments"); }}
                        style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 0", borderBottom: i < arr.length-1 ? "1px solid var(--border)" : "none", cursor:"pointer" }}>
                        <div style={{ fontSize:11, color:"var(--text3)", fontFamily:"DM Mono", width:24, flexShrink:0 }}>
                          {new Date(e.createdAt).getDate()}
                        </div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontSize:13, fontWeight:600 }}>{e.firstName} {e.lastName}</div>
                          <div style={{ fontSize:11, color:"var(--text3)" }}>{e.certificationGoal}</div>
                        </div>
                        <span className="status-badge" style={{ background: sc.bg, color: sc.color, fontSize:10 }}>
                          <span className="status-dot" style={{ background: sc.dot }}/>{sc.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {selected && (
        <DetailPanel
          enrollment={selected}
          onClose={() => setSelected(null)}
          onUpdate={() => { fetchData(); }}
          onDelete={() => { fetchData(); setSelected(null); }}
          onSendEmail={sendEmail}
        />
      )}

      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </>
  );
}
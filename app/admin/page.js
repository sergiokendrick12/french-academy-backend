"use client";
import { useState, useEffect, useCallback, useRef } from "react";

const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Sora:wght@300;400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --ink: #0c1520; --ink2: #111e2e; --ink3: #172438; --ink4: #1d2e46;
  --border: #243650; --border2: #2e4468;
  --gold: #d4a843; --gold-lt: #e8c068; --gold-dim: rgba(212,168,67,.12); --gold-glow: rgba(212,168,67,.06);
  --blue: #4d9de0; --blue-dim: rgba(77,157,224,.12);
  --teal: #3ec9a7; --teal-dim: rgba(62,201,167,.12);
  --rose: #e05c7a; --rose-dim: rgba(224,92,122,.12);
  --amber: #e8a030; --amber-dim: rgba(232,160,48,.12);
  --text: #e8e2d9; --text2: #9aaabb; --text3: #607080;
  --font-display: "Playfair Display", Georgia, serif;
  --font-body: "Sora", system-ui, sans-serif;
  --r-sm: 6px; --r-md: 10px; --r-lg: 14px; --r-xl: 20px;
}

html, body { height: 100%; }
body { background: var(--ink); font-family: var(--font-body); color: var(--text); font-size: 14px; line-height: 1.5; -webkit-font-smoothing: antialiased; }
::-webkit-scrollbar { width: 3px; height: 3px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }

.ifa-shell { display: flex; height: 100vh; overflow: hidden; position: relative; }

.ifa-sidebar {
  width: 248px; flex-shrink: 0; background: var(--ink2);
  border-right: 1px solid var(--border); display: flex; flex-direction: column;
  height: 100vh; position: relative; z-index: 50;
  transition: transform .3s cubic-bezier(.4,0,.2,1); overflow: hidden;
}
.sidebar-brand { padding: 24px 20px 20px; border-bottom: 1px solid var(--border); flex-shrink: 0; }
.brand-emblem {
  width: 40px; height: 40px; background: var(--gold-dim);
  border: 1px solid rgba(212,168,67,.3); border-radius: var(--r-md);
  display: flex; align-items: center; justify-content: center; font-size: 20px; margin-bottom: 12px;
}
.brand-name { font-family: var(--font-display); font-size: 17px; font-weight: 500; color: var(--text); line-height: 1.25; }
.brand-tagline { font-size: 10px; color: var(--text3); letter-spacing: 2px; text-transform: uppercase; margin-top: 3px; }
.sidebar-nav { flex: 1; padding: 14px 12px; display: flex; flex-direction: column; gap: 1px; overflow-y: auto; }
.nav-section-label { font-size: 9px; letter-spacing: 2.5px; text-transform: uppercase; color: var(--text3); padding: 14px 8px 6px; font-weight: 600; }
.nav-item {
  display: flex; align-items: center; gap: 10px; padding: 9px 10px;
  border-radius: var(--r-md); cursor: pointer; border: none; background: transparent;
  color: var(--text2); font-size: 13px; font-weight: 400; font-family: var(--font-body);
  width: 100%; text-align: left; transition: all .15s; white-space: nowrap; position: relative;
}
.nav-item:hover { background: var(--gold-glow); color: var(--text); }
.nav-item.active { background: var(--gold-dim); color: var(--gold); font-weight: 500; }
.nav-item.active::before { content: ""; position: absolute; left: 0; top: 25%; bottom: 25%; width: 2px; background: var(--gold); border-radius: 1px; }
.nav-icon { font-size: 15px; width: 18px; text-align: center; flex-shrink: 0; }
.nav-label { flex: 1; }
.nav-badge { background: var(--gold); color: var(--ink); font-size: 10px; font-weight: 700; padding: 1px 7px; border-radius: 10px; flex-shrink: 0; }
.sidebar-footer { padding: 14px 12px; border-top: 1px solid var(--border); flex-shrink: 0; }
.sidebar-user { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: var(--r-md); margin-bottom: 4px; }
.user-avatar { width: 30px; height: 30px; border-radius: var(--r-sm); background: var(--gold-dim); border: 1px solid rgba(212,168,67,.3); display: flex; align-items: center; justify-content: center; font-size: 13px; color: var(--gold); font-weight: 600; flex-shrink: 0; }
.user-name { font-size: 12px; font-weight: 500; }
.user-role { font-size: 10px; color: var(--text3); }
.logout-btn { display: flex; align-items: center; gap: 8px; padding: 8px 10px; border-radius: var(--r-md); border: none; background: transparent; color: var(--text3); font-size: 12px; font-family: var(--font-body); cursor: pointer; width: 100%; transition: all .15s; }
.logout-btn:hover { color: var(--rose); background: var(--rose-dim); }

.sidebar-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,.6); z-index: 49; backdrop-filter: blur(2px); }

.ifa-main { flex: 1; display: flex; flex-direction: column; min-width: 0; height: 100vh; overflow: hidden; }

.ifa-topbar {
  height: 60px; background: var(--ink2); border-bottom: 1px solid var(--border);
  padding: 0 24px; display: flex; align-items: center; justify-content: space-between;
  flex-shrink: 0; gap: 12px;
}
.topbar-left { display: flex; align-items: center; gap: 12px; min-width: 0; }
.hamburger-btn {
  display: none; width: 34px; height: 34px; border-radius: var(--r-sm);
  border: 1px solid var(--border); background: transparent; color: var(--text2);
  cursor: pointer; font-size: 16px; align-items: center; justify-content: center;
  flex-shrink: 0; transition: all .15s;
}
.hamburger-btn:hover { border-color: var(--gold); color: var(--gold); }
.topbar-title { font-family: var(--font-display); font-size: 20px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.topbar-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

.btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: var(--r-md); border: none; font-size: 13px; font-weight: 500; font-family: var(--font-body); cursor: pointer; transition: all .15s; white-space: nowrap; }
.btn-gold { background: var(--gold); color: var(--ink); }
.btn-gold:hover { background: var(--gold-lt); transform: translateY(-1px); box-shadow: 0 4px 20px rgba(212,168,67,.25); }
.btn-outline { background: transparent; color: var(--text2); border: 1px solid var(--border); }
.btn-outline:hover { border-color: var(--gold); color: var(--gold); }
.btn-ghost { background: transparent; color: var(--text2); border: none; padding: 8px 10px; }
.btn-ghost:hover { color: var(--text); background: var(--ink3); }
.btn-danger { background: transparent; color: var(--rose); border: 1px solid rgba(224,92,122,.25); }
.btn-danger:hover { background: var(--rose-dim); }
.btn-sm { padding: 6px 12px; font-size: 12px; }
.btn-xs { padding: 4px 8px; font-size: 11px; border-radius: var(--r-sm); }
.btn:disabled { opacity: .5; cursor: not-allowed; transform: none !important; }

.ifa-content { flex: 1; overflow-y: auto; padding: 24px; }

.stats-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; margin-bottom: 24px; }
.stat-card {
  background: var(--ink2); border: 1px solid var(--border); border-radius: var(--r-lg);
  padding: 18px; position: relative; overflow: hidden;
  transition: transform .2s, border-color .2s, box-shadow .2s; cursor: default;
}
.stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,.3); }
.stat-card::after { content: ""; position: absolute; top: 0; right: 0; width: 60px; height: 60px; background: radial-gradient(circle at top right, var(--accent-glow), transparent 70%); pointer-events: none; }
.stat-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.stat-icon-wrap { width: 32px; height: 32px; border-radius: var(--r-sm); display: flex; align-items: center; justify-content: center; font-size: 15px; }
.stat-value { font-family: var(--font-display); font-size: 32px; font-weight: 500; line-height: 1; margin-bottom: 4px; }
.stat-label { font-size: 11px; color: var(--text3); text-transform: uppercase; letter-spacing: 1.5px; }
.stat-progress { height: 2px; background: var(--border); border-radius: 1px; margin-top: 14px; }
.stat-progress-fill { height: 100%; border-radius: 1px; transition: width .8s cubic-bezier(.4,0,.2,1); }

.filters-bar { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; }
.search-wrap { position: relative; flex: 1; min-width: 200px; max-width: 340px; }
.search-icon { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: var(--text3); font-size: 14px; pointer-events: none; }
.search-input { width: 100%; padding: 9px 12px 9px 34px; background: var(--ink2); border: 1px solid var(--border); border-radius: var(--r-md); color: var(--text); font-size: 13px; font-family: var(--font-body); outline: none; transition: border-color .15s; }
.search-input::placeholder { color: var(--text3); }
.search-input:focus { border-color: var(--gold); }
.filter-chips { display: flex; gap: 6px; flex-wrap: wrap; }
.chip { padding: 6px 13px; border-radius: 20px; border: 1px solid var(--border); background: transparent; color: var(--text2); font-size: 12px; font-weight: 500; font-family: var(--font-body); cursor: pointer; transition: all .15s; text-transform: capitalize; }
.chip:hover:not(.chip-active) { border-color: var(--text2); color: var(--text); }
.chip-active { border-color: var(--gold) !important; background: var(--gold-dim) !important; color: var(--gold) !important; }

.table-wrap { background: var(--ink2); border: 1px solid var(--border); border-radius: var(--r-lg); overflow: hidden; }
.table-header { display: grid; grid-template-columns: var(--cols); padding: 10px 18px; background: var(--ink3); border-bottom: 1px solid var(--border); font-size: 10px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: var(--text3); }
.table-body { max-height: 52vh; overflow-y: auto; }
.table-row { display: grid; grid-template-columns: var(--cols); padding: 13px 18px; align-items: center; border-bottom: 1px solid rgba(36,54,80,.6); cursor: pointer; transition: background .12s; position: relative; }
.table-row:last-child { border-bottom: none; }
.table-row:hover { background: var(--ink3); }
.table-row.row-selected { background: var(--gold-glow); border-left: 2px solid var(--gold); padding-left: 16px; }
.student-name { font-size: 13px; font-weight: 500; margin-bottom: 1px; }
.student-email { font-size: 11px; color: var(--text3); }
.cert-badge { display: inline-flex; align-items: center; background: var(--ink3); border: 1px solid var(--border2); color: var(--gold); font-size: 10px; font-weight: 600; padding: 3px 8px; border-radius: var(--r-sm); letter-spacing: .5px; }
.date-text { font-size: 11px; color: var(--text3); }
.delete-ico { width: 26px; height: 26px; border-radius: var(--r-sm); border: 1px solid var(--border); background: transparent; color: var(--text3); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 12px; transition: all .12s; opacity: 0; }
.table-row:hover .delete-ico { opacity: 1; }
.delete-ico:hover { border-color: var(--rose); color: var(--rose); background: var(--rose-dim); }

.status-pill { display: inline-flex; align-items: center; gap: 5px; padding: 3px 9px; border-radius: 12px; font-size: 11px; font-weight: 600; letter-spacing: .3px; }
.status-dot { width: 5px; height: 5px; border-radius: 50%; }

.empty-state { padding: 60px 20px; text-align: center; }
.empty-icon { font-size: 36px; margin-bottom: 10px; }
.empty-text { font-size: 14px; color: var(--text2); }
.empty-sub { font-size: 12px; color: var(--text3); margin-top: 4px; }

.detail-panel { width: 360px; flex-shrink: 0; background: var(--ink2); border-left: 1px solid var(--border); display: flex; flex-direction: column; height: 100vh; animation: panelSlide .2s cubic-bezier(.4,0,.2,1); overflow: hidden; }
@keyframes panelSlide { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
.panel-top { padding: 20px; border-bottom: 1px solid var(--border); flex-shrink: 0; }
.panel-head-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; margin-bottom: 14px; }
.panel-avatar { width: 46px; height: 46px; border-radius: var(--r-md); background: var(--gold-dim); border: 1px solid rgba(212,168,67,.3); display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 18px; color: var(--gold); flex-shrink: 0; }
.panel-name { font-family: var(--font-display); font-size: 18px; font-weight: 500; line-height: 1.2; }
.panel-since { font-size: 11px; color: var(--text3); margin-top: 3px; }
.close-btn { width: 28px; height: 28px; border-radius: var(--r-sm); border: 1px solid var(--border); background: transparent; color: var(--text2); cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all .12s; }
.close-btn:hover { border-color: var(--text); color: var(--text); }
.panel-tabs { display: flex; border-bottom: 1px solid var(--border); padding: 0 20px; flex-shrink: 0; }
.ptab { padding: 11px 14px; font-size: 12px; font-weight: 500; color: var(--text2); cursor: pointer; border: none; background: transparent; font-family: var(--font-body); border-bottom: 2px solid transparent; margin-bottom: -1px; transition: all .15s; }
.ptab:hover:not(.ptab-on) { color: var(--text); }
.ptab-on { color: var(--gold); border-bottom-color: var(--gold); }
.panel-body { flex: 1; overflow-y: auto; padding: 18px 20px; }
.panel-footer { padding: 14px 20px; border-top: 1px solid var(--border); display: flex; gap: 8px; flex-shrink: 0; }
.info-block { display: flex; gap: 12px; padding: 10px 0; border-bottom: 1px solid rgba(36,54,80,.6); }
.info-block:last-child { border-bottom: none; }
.info-ico { font-size: 14px; width: 18px; text-align: center; flex-shrink: 0; margin-top: 1px; }
.info-lbl { font-size: 10px; color: var(--text3); text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 2px; }
.info-val { font-size: 13px; }
.info-link { color: var(--blue); text-decoration: none; }
.info-link:hover { color: var(--gold); text-decoration: underline; }
.sec-label { font-size: 10px; color: var(--text3); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px; font-weight: 600; }
.status-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 16px; }
.status-opt { padding: 9px 12px; border-radius: var(--r-md); border: 1px solid var(--border); background: transparent; font-size: 12px; font-weight: 500; text-align: center; cursor: pointer; transition: all .12s; font-family: var(--font-body); }
.panel-textarea { width: 100%; padding: 10px 12px; background: var(--ink3); border: 1px solid var(--border); border-radius: var(--r-md); color: var(--text); font-size: 13px; font-family: var(--font-body); resize: none; outline: none; line-height: 1.6; transition: border-color .15s; }
.panel-textarea:focus { border-color: var(--gold); }
.panel-input { width: 100%; padding: 9px 12px; background: var(--ink3); border: 1px solid var(--border); border-radius: var(--r-md); color: var(--text); font-size: 13px; font-family: var(--font-body); outline: none; transition: border-color .15s; margin-bottom: 8px; }
.panel-input:focus { border-color: var(--gold); }

.bottom-nav { display: none; border-top: 1px solid var(--border); background: var(--ink2); padding: 4px 0 8px; flex-shrink: 0; justify-content: space-around; }
.bn-item { display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 6px 16px; cursor: pointer; border: none; background: transparent; font-family: var(--font-body); }
.bn-icon { font-size: 18px; }
.bn-lbl { font-size: 10px; color: var(--text3); }
.bn-item.bn-active .bn-icon { filter: drop-shadow(0 0 4px var(--gold)); }
.bn-item.bn-active .bn-lbl { color: var(--gold); }

.analytics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-bottom: 18px; }
.chart-card { background: var(--ink2); border: 1px solid var(--border); border-radius: var(--r-lg); padding: 22px; }
.chart-title { font-family: var(--font-display); font-size: 17px; margin-bottom: 2px; }
.chart-sub { font-size: 12px; color: var(--text3); margin-bottom: 18px; }
.bar-chart-wrap { display: flex; align-items: flex-end; gap: 7px; height: 130px; }
.bar-col-wrap { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 5px; }
.bar-col { width: 100%; border-radius: 4px 4px 0 0; transition: height .7s cubic-bezier(.4,0,.2,1); cursor: pointer; min-height: 2px; }
.bar-col:hover { filter: brightness(1.25); }
.bar-val { font-size: 10px; font-weight: 600; }
.bar-lbl { font-size: 9px; color: var(--text3); }
.donut-wrap { display: flex; align-items: center; gap: 20px; }
.donut-legend { display: flex; flex-direction: column; gap: 9px; flex: 1; }
.legend-row { display: flex; align-items: center; gap: 8px; }
.legend-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.legend-label { font-size: 12px; flex: 1; color: var(--text2); }
.legend-count { font-size: 13px; font-weight: 600; }
.cert-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.cert-lbl { font-size: 11px; color: var(--text2); width: 90px; flex-shrink: 0; }
.cert-track { flex: 1; height: 5px; background: var(--border); border-radius: 3px; }
.cert-fill { height: 100%; border-radius: 3px; background: var(--gold); transition: width .7s cubic-bezier(.4,0,.2,1); }
.cert-count { font-size: 11px; font-weight: 600; color: var(--gold); width: 20px; text-align: right; }

.toast-tray { position: fixed; bottom: 20px; right: 20px; z-index: 999; display: flex; flex-direction: column; gap: 8px; pointer-events: none; }
.toast-item { display: flex; align-items: center; gap: 10px; padding: 11px 16px; border-radius: var(--r-md); background: var(--ink3); border: 1px solid var(--border2); box-shadow: 0 8px 32px rgba(0,0,0,.5); font-size: 13px; font-weight: 500; animation: toastIn .2s cubic-bezier(.4,0,.2,1); min-width: 240px; }
@keyframes toastIn { from { transform: translateX(30px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
.toast-ico { font-size: 14px; }

.login-shell { min-height: 100vh; background: var(--ink); display: flex; align-items: center; justify-content: center; padding: 20px; position: relative; overflow: hidden; }
.login-bg { position: absolute; inset: 0; pointer-events: none; background: radial-gradient(ellipse 50% 50% at 30% 20%, rgba(212,168,67,.07) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 75% 75%, rgba(77,157,224,.05) 0%, transparent 60%); }
.login-card { position: relative; z-index: 1; background: var(--ink2); border: 1px solid var(--border); border-radius: var(--r-xl); padding: 44px 40px; width: 100%; max-width: 400px; box-shadow: 0 40px 80px rgba(0,0,0,.6); animation: cardUp .4s cubic-bezier(.4,0,.2,1); }
@keyframes cardUp { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.login-emblem { width: 52px; height: 52px; border-radius: var(--r-lg); background: var(--gold-dim); border: 1px solid rgba(212,168,67,.3); display: flex; align-items: center; justify-content: center; font-size: 26px; margin: 0 auto 16px; }
.login-title { font-family: var(--font-display); font-size: 26px; font-weight: 500; text-align: center; margin-bottom: 4px; }
.login-sub { font-size: 12px; color: var(--text3); text-align: center; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 36px; }
.login-label { font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: var(--text3); margin-bottom: 7px; }
.login-input { width: 100%; padding: 12px 14px; background: var(--ink3); border: 1px solid var(--border); border-radius: var(--r-md); color: var(--text); font-size: 14px; font-family: var(--font-body); outline: none; margin-bottom: 20px; transition: border-color .15s; }
.login-input:focus { border-color: var(--gold); }
.login-err { color: var(--rose); font-size: 12px; text-align: center; margin-bottom: 12px; }
.login-footer { margin-top: 24px; text-align: center; font-size: 11px; color: var(--text3); }

/* -- RESPONSIVE -- */
@media (max-width: 900px) {
  .stats-grid { grid-template-columns: repeat(3, 1fr); }
  .ifa-content { padding: 16px; }
  .ifa-topbar { padding: 0 16px; }
}

@media (max-width: 640px) {
  .ifa-sidebar {
    position: fixed; top: 0; left: 0; bottom: 0;
    width: 280px; transform: translateX(-100%); z-index: 50;
  }
  .ifa-sidebar.mobile-open { transform: translateX(0); box-shadow: 4px 0 24px rgba(0,0,0,.5); }
  .sidebar-overlay.visible { display: block; }
  .hamburger-btn { display: flex; }

  .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .stat-card:last-child { grid-column: span 2; }
  .stat-value { font-size: 26px; }

  .topbar-right .btn-outline { display: none; }
  .ifa-topbar { padding: 0 12px; height: 54px; }
  .topbar-title { font-size: 17px; }

  .filters-bar { gap: 8px; }
  .search-wrap { max-width: 100%; min-width: 0; }
  .filter-chips { overflow-x: auto; flex-wrap: nowrap; padding-bottom: 4px; }
  .filter-chips::-webkit-scrollbar { height: 0; }

  .table-body { max-height: 38vh; }
  .table-row { padding: 12px 14px; }

  .detail-panel {
    position: fixed; inset: 0; width: 100%; height: 100%;
    z-index: 100; border-left: none;
    animation: mobilePanel .25s cubic-bezier(.4,0,.2,1);
  }
  @keyframes mobilePanel { from { transform: translateY(100%); } to { transform: translateY(0); } }

  .analytics-grid { grid-template-columns: 1fr; }

  .bottom-nav { display: flex; }
  .ifa-content { padding: 10px; padding-bottom: 70px; }

  .toast-tray { bottom: 80px; right: 12px; left: 12px; }
  .toast-item { min-width: auto; }

  .login-card { padding: 32px 24px; }
}
`;

const S = {
  new:       { color: "#4d9de0", bg: "var(--blue-dim)",  label: "New" },
  contacted: { color: "#e8a030", bg: "var(--amber-dim)", label: "Contacted" },
  enrolled:  { color: "#3ec9a7", bg: "var(--teal-dim)",  label: "Enrolled" },
  cancelled: { color: "#e05c7a", bg: "var(--rose-dim)",  label: "Cancelled" },
};

const fmtDate = (d) => new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
const initials = (f = "", l = "") => `${f[0] || ""}${l[0] || ""}`.toUpperCase();
const exportCSV = (rows) => {
  const H = ["First Name","Last Name","Email","Phone","Certification","Status","Date","Notes"];
  const R = rows.map(e => [e.firstName,e.lastName,e.email,e.phone,e.certificationGoal,e.status,fmtDate(e.createdAt),(e.notes||"").replace(/,/g,";")]);
  const csv = [H,...R].map(r=>r.map(v=>`"${v}"`).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv],{type:"text/csv"}));
  Object.assign(document.createElement("a"),{href:url,download:"ifa_students.csv"}).click();
  URL.revokeObjectURL(url);
};

function StatusPill({ status }) {
  const s = S[status] || S.new;
  return (
    <span className="status-pill" style={{ background: s.bg, color: s.color }}>
      <span className="status-dot" style={{ background: s.color }} />
      {s.label}
    </span>
  );
}

function useToast() {
  const [list, setList] = useState([]);
  const show = useCallback((msg, type = "success") => {
    const id = Date.now();
    setList(l => [...l, { id, msg, type }]);
    setTimeout(() => setList(l => l.filter(x => x.id !== id)), 3000);
  }, []);
  return { list, show };
}
function ToastTray({ list }) {
  const icons = { success: "?", error: "?", info: "?" };
  const cols  = { success: "var(--teal)", error: "var(--rose)", info: "var(--blue)" };
  return (
    <div className="toast-tray">
      {list.map(t => (
        <div key={t.id} className="toast-item">
          <span className="toast-ico" style={{ color: cols[t.type] }}>{icons[t.type]}</span>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

function LoginPage({ onLogin }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async () => {
    if (!pw) return;
    setLoading(true); setErr("");
    try {
      const r = await fetch("/api/admin/login", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ password: pw }) });
      const d = await r.json();
      if (d.success) onLogin(); else setErr(d.error || "Incorrect password.");
    } catch { setErr("Connection error."); }
    finally { setLoading(false); }
  };
  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div className="login-shell">
        <div className="login-bg" />
        <div className="login-card">
          <div className="login-emblem">??</div>
          <h1 className="login-title">Admin Portal</h1>
          <p className="login-sub">International French Academy · Kigali</p>
          <div className="login-label">Password</div>
          <input type="password" className="login-input" autoFocus value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} placeholder="Enter admin password" />
          {err && <p className="login-err">{err}</p>}
          <button className="btn btn-gold" style={{width:"100%",justifyContent:"center",padding:"12px",fontSize:"14px"}} onClick={submit} disabled={loading}>
            {loading ? "Verifying…" : "Enter Dashboard ?"}
          </button>
          <p className="login-footer">International French Academy · Rwanda</p>
        </div>
      </div>
    </>
  );
}

function DonutChart({ stats }) {
  const total = Math.max(stats.total || 0, 1);
  const segs = [
    { key:"new",       color:"#4d9de0", label:"New",       count: stats.new       || 0 },
    { key:"contacted", color:"#e8a030", label:"Contacted", count: stats.contacted  || 0 },
    { key:"enrolled",  color:"#3ec9a7", label:"Enrolled",  count: stats.enrolled   || 0 },
    { key:"cancelled", color:"#e05c7a", label:"Cancelled", count: stats.cancelled  || 0 },
  ];
  const r = 46, cx = 58, cy = 58, sw = 13, circ = 2*Math.PI*r;
  let off = 0;
  const arcs = segs.map(s => { const dash = (s.count/total)*circ; const a = {...s, dash, off}; off += dash; return a; });
  return (
    <div className="donut-wrap">
      <svg width={116} height={116} style={{flexShrink:0}}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border)" strokeWidth={sw}/>
        {arcs.map(a => (
          <circle key={a.key} cx={cx} cy={cy} r={r} fill="none" stroke={a.color} strokeWidth={sw}
            strokeDasharray={`${a.dash} ${circ-a.dash}`} strokeDashoffset={circ/4-a.off}/>
        ))}
        <text x={cx} y={cy-5} textAnchor="middle" fill="var(--text)" fontSize={22} fontFamily="'Playfair Display',Georgia,serif" fontWeight="500">{stats.total||0}</text>
        <text x={cx} y={cy+9} textAnchor="middle" fill="var(--text3)" fontSize={9} fontFamily="'Sora',sans-serif" letterSpacing="1.5">TOTAL</text>
      </svg>
      <div className="donut-legend">
        {segs.map(s => (
          <div key={s.key} className="legend-row">
            <span className="legend-dot" style={{background:s.color}}/><span className="legend-label">{s.label}</span><span className="legend-count" style={{color:s.color}}>{s.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsPage({ enrollments, stats }) {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const counts = months.map((_,i) => enrollments.filter(e => new Date(e.createdAt).getMonth()===i).length);
  const maxC = Math.max(...counts, 1);
  const certMap = {};
  enrollments.forEach(e => { certMap[e.certificationGoal] = (certMap[e.certificationGoal]||0)+1; });
  const certs = Object.entries(certMap).sort((a,b)=>b[1]-a[1]).slice(0,8);
  const maxCert = certs[0]?.[1]||1;
  return (
    <div>
      <div className="analytics-grid">
        <div className="chart-card">
          <div className="chart-title">Monthly Trend</div>
          <div className="chart-sub">Enrollments by month</div>
          <div className="bar-chart-wrap">
            {months.map((m,i) => (
              <div key={m} className="bar-col-wrap">
                <span className="bar-val" style={{color: counts[i]?"var(--gold)":"var(--text3)"}}>{counts[i]||""}</span>
                <div className="bar-col" style={{height:`${(counts[i]/maxC)*100}%`,background: counts[i] ? "linear-gradient(to top,var(--gold),var(--gold-lt))" : "var(--border)"}}/>
                <span className="bar-lbl">{m}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="chart-card">
          <div className="chart-title">Status Breakdown</div>
          <div className="chart-sub">Current enrollment statuses</div>
          <DonutChart stats={stats}/>
        </div>
      </div>
      <div className="chart-card">
        <div className="chart-title">Top Certifications</div>
        <div className="chart-sub">Most requested certification goals</div>
        <div style={{marginTop:16}}>
          {certs.length === 0 ? <p style={{color:"var(--text3)",fontSize:13}}>No data yet.</p>
            : certs.map(([cert,count]) => (
              <div key={cert} className="cert-row">
                <span className="cert-lbl">{cert}</span>
                <div className="cert-track"><div className="cert-fill" style={{width:`${(count/maxCert)*100}%`}}/></div>
                <span className="cert-count">{count}</span>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

function DetailPanel({ e, onClose, onUpdate, onDelete, toast }) {
  const [tab, setTab] = useState("info");
  const [notes, setNotes] = useState(e.notes||"");
  const [subj, setSubj] = useState("Regarding your enrollment — IFA Kigali");
  const [body, setBody] = useState(`Dear ${e.firstName},\n\nThank you for your interest in the International French Academy.\n\n`);
  const [sending, setSending] = useState(false);

  const setStatus = async (status) => {
    await fetch("/api/admin/enrollments",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:e._id,status})});
    onUpdate({...e,status}); toast("Status updated","success");
  };
  const saveNotes = async () => {
    await fetch("/api/admin/enrollments",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:e._id,notes})});
    onUpdate({...e,notes}); toast("Notes saved","success");
  };
  const sendEmail = async () => {
    setSending(true);
    try {
      const r = await fetch("/api/admin/send-email",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({to:e.email,subject:subj,body,studentName:`${e.firstName} ${e.lastName}`})});
      const d = await r.json();
      if(d.success) toast("Email sent!","success"); else toast("Failed to send","error");
    } catch { toast("Failed to send","error"); }
    finally { setSending(false); }
  };
  const del = async () => {
    if(!confirm(`Delete ${e.firstName} ${e.lastName}?`)) return;
    await fetch("/api/admin/enrollments",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:e._id})});
    toast("Deleted","error"); onDelete(e._id);
  };

  return (
    <div className="detail-panel">
      <div className="panel-top">
        <div className="panel-head-row">
          <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
            <div className="panel-avatar">{initials(e.firstName,e.lastName)}</div>
            <div>
              <div className="panel-name">{e.firstName} {e.lastName}</div>
              <div className="panel-since">Since {fmtDate(e.createdAt)}</div>
              <div style={{marginTop:6}}><StatusPill status={e.status}/></div>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
      </div>
      <div className="panel-tabs">
        {[["info","Info"],["status","Status"],["notes","Notes"],["email","Email"]].map(([k,l])=>(
          <button key={k} className={`ptab${tab===k?" ptab-on":""}`} onClick={()=>setTab(k)}>{l}</button>
        ))}
      </div>
      <div className="panel-body">
        {tab==="info" && (
          <div>
            {[
              {ico:"??",lbl:"Full Name",val:<>{e.firstName} {e.lastName}</>},
              {ico:"??",lbl:"Email",val:<a href={`mailto:${e.email}`} className="info-link">{e.email}</a>},
              {ico:"??",lbl:"Phone / WhatsApp",val:<a href={`https://wa.me/${(e.phone||"").replace(/\D/g,"")}`} target="_blank" className="info-link">{e.phone}</a>},
              {ico:"??",lbl:"Certification Goal",val:<span style={{color:"var(--gold)",fontWeight:600}}>{e.certificationGoal}</span>},
            ].map((r,i)=>(
              <div key={i} className="info-block">
                <span className="info-ico">{r.ico}</span>
                <div><div className="info-lbl">{r.lbl}</div><div className="info-val">{r.val}</div></div>
              </div>
            ))}
            {e.message&&(
              <div className="info-block">
                <span className="info-ico">??</span>
                <div><div className="info-lbl">Message</div><div className="info-val" style={{color:"var(--text2)",lineHeight:1.6}}>{e.message}</div></div>
              </div>
            )}
          </div>
        )}
        {tab==="status" && (
          <div>
            <div className="sec-label">Update Status</div>
            <div className="status-grid">
              {Object.entries(S).map(([k,v])=>(
                <button key={k} className="status-opt" onClick={()=>setStatus(k)}
                  style={{background: e.status===k ? v.bg : "transparent", color: e.status===k ? v.color : "var(--text2)", borderColor: e.status===k ? v.color+"60" : "var(--border)", fontWeight: e.status===k ? 600 : 400}}>
                  {e.status===k ? "? " : "? "}{v.label}
                </button>
              ))}
            </div>
            <div style={{padding:"12px 14px",background:"var(--ink3)",borderRadius:"var(--r-md)",border:"1px solid var(--border)"}}>
              <div style={{fontSize:10,color:"var(--text3)",marginBottom:6,textTransform:"uppercase",letterSpacing:"1.5px"}}>Current</div>
              <StatusPill status={e.status}/>
            </div>
          </div>
        )}
        {tab==="notes" && (
          <div>
            <div className="sec-label" style={{marginBottom:6}}>Internal Notes</div>
            <p style={{fontSize:12,color:"var(--text3)",marginBottom:10,lineHeight:1.5}}>Private notes, only visible to admin.</p>
            <textarea className="panel-textarea" style={{height:100}} value={notes} onChange={ev=>setNotes(ev.target.value)} placeholder="Add notes about this student…"/>
            <button className="btn btn-gold btn-sm" style={{marginTop:8}} onClick={saveNotes}>Save Notes</button>
            {e.notes&&<div style={{marginTop:14,padding:"10px 12px",background:"var(--ink3)",borderRadius:"var(--r-md)",fontSize:13,color:"var(--text2)",lineHeight:1.6,borderLeft:"2px solid var(--gold)"}}>{e.notes}</div>}
          </div>
        )}
        {tab==="email" && (
          <div>
            <div className="sec-label" style={{marginBottom:6}}>Send Email</div>
            <p style={{fontSize:12,color:"var(--text3)",marginBottom:12}}>To: <span style={{color:"var(--gold)"}}>{e.email}</span></p>
            <div style={{fontSize:10,color:"var(--text3)",marginBottom:5,textTransform:"uppercase",letterSpacing:"1.5px"}}>Subject</div>
            <input className="panel-input" value={subj} onChange={ev=>setSubj(ev.target.value)}/>
            <div style={{fontSize:10,color:"var(--text3)",marginBottom:5,textTransform:"uppercase",letterSpacing:"1.5px"}}>Message</div>
            <textarea className="panel-textarea" style={{height:130}} value={body} onChange={ev=>setBody(ev.target.value)}/>
            <button className="btn btn-gold btn-sm" style={{marginTop:10}} onClick={sendEmail} disabled={sending}>{sending ? "Sending…" : "? Send Email"}</button>
          </div>
        )}
      </div>
      <div className="panel-footer">
        <a href={`https://wa.me/${(e.phone||"").replace(/\D/g,"")}`} target="_blank" style={{flex:1,textDecoration:"none"}}>
          <button className="btn btn-outline" style={{width:"100%",justifyContent:"center"}}>?? WhatsApp</button>
        </a>
        <button className="btn btn-danger btn-sm" onClick={del}>?? Delete</button>
      </div>
    </div>
  );
}

function useBreakpoint() {
  const [bp, setBp] = useState("desktop");
  useEffect(()=>{
    const check = () => { const w = window.innerWidth; setBp(w<=640?"mobile":w<=900?"tablet":"desktop"); };
    check(); window.addEventListener("resize",check); return ()=>window.removeEventListener("resize",check);
  },[]);
  return bp;
}

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [page, setPage] = useState("enrollments");
  const [enrollments, setEnrollments] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { list: toasts, show: toast } = useToast();
  const bp = useBreakpoint();

  const fetchData = useCallback(async () => {
    setLoading(true);
    const p = new URLSearchParams();
    if (filter!=="all") p.set("status",filter);
    if (search) p.set("search",search);
    try {
      const r = await fetch(`/api/admin/enrollments?${p}`);
      if (r.status===401){setAuthed(false);return;}
      const d = await r.json();
      setEnrollments(d.enrollments||[]); setStats(d.stats||{});
    } catch{}
    finally{setLoading(false);}
  },[filter,search]);

  useEffect(()=>{if(authed)fetchData();},[authed,fetchData]);

  const handleUpdate = useCallback((upd)=>{
    setEnrollments(l=>l.map(x=>x._id===upd._id?upd:x));
    setSelected(upd); fetchData();
  },[fetchData]);

  const handleDelete = useCallback((id)=>{
    setEnrollments(l=>l.filter(x=>x._id!==id));
    setSelected(null); fetchData();
  },[fetchData]);

  const logout = async () => { await fetch("/api/admin/login",{method:"DELETE"}); setAuthed(false); };

  if (!authed) return <LoginPage onLogin={()=>setAuthed(true)}/>;

  const colsDef = {
    desktop: "220px 1fr 130px 150px 105px 85px 40px",
    tablet:  "180px 1fr 130px 105px 85px 40px",
    mobile:  "1fr 95px 40px",
  }[bp];

  const navItems = [
    {id:"enrollments",icon:"??",label:"Enrollments",badge:stats.new||0},
    {id:"analytics",  icon:"??",label:"Analytics"},
  ];

  const statCards = [
    {label:"Total",     value:stats.total||0,     color:"var(--text)",  accent:"rgba(212,168,67,.4)", iconBg:"var(--gold-dim)"},
    {label:"New",       value:stats.new||0,       color:"var(--blue)",  accent:"rgba(77,157,224,.4)", iconBg:"var(--blue-dim)"},
    {label:"Contacted", value:stats.contacted||0, color:"var(--amber)", accent:"rgba(232,160,48,.4)", iconBg:"var(--amber-dim)"},
    {label:"Enrolled",  value:stats.enrolled||0,  color:"var(--teal)",  accent:"rgba(62,201,167,.4)", iconBg:"var(--teal-dim)"},
    {label:"Cancelled", value:stats.cancelled||0, color:"var(--rose)",  accent:"rgba(224,92,122,.4)", iconBg:"var(--rose-dim)"},
  ];

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div className={`sidebar-overlay${sidebarOpen?" visible":""}`} onClick={()=>setSidebarOpen(false)}/>
      <div className="ifa-shell">
        <aside className={`ifa-sidebar${sidebarOpen?" mobile-open":""}`}>
          <div className="sidebar-brand">
            <div className="brand-emblem">??</div>
            <div className="brand-name">International<br/>French Academy</div>
            <div className="brand-tagline">Kigali · Rwanda</div>
          </div>
          <nav className="sidebar-nav">
            <div className="nav-section-label">Management</div>
            {navItems.map(n=>(
              <button key={n.id} className={`nav-item${page===n.id?" active":""}`} onClick={()=>{setPage(n.id);setSidebarOpen(false);}}>
                <span className="nav-icon">{n.icon}</span>
                <span className="nav-label">{n.label}</span>
                {n.badge>0&&<span className="nav-badge">{n.badge}</span>}
              </button>
            ))}
            <div className="nav-section-label">Actions</div>
            <button className="nav-item" onClick={()=>{exportCSV(enrollments);toast("CSV exported","success");}}>
              <span className="nav-icon">?</span><span className="nav-label">Export CSV</span>
            </button>
            <button className="nav-item" onClick={fetchData}>
              <span className="nav-icon">?</span><span className="nav-label">Refresh Data</span>
            </button>
          </nav>
          <div className="sidebar-footer">
            <div className="sidebar-user">
              <div className="user-avatar">A</div>
              <div><div className="user-name">Admin</div><div className="user-role">Academy Portal</div></div>
            </div>
            <button className="logout-btn" onClick={logout}><span>?</span><span>Sign Out</span></button>
          </div>
        </aside>

        <div className="ifa-main">
          <header className="ifa-topbar">
            <div className="topbar-left">
              <button className="hamburger-btn" onClick={()=>setSidebarOpen(o=>!o)}>?</button>
              <h1 className="topbar-title">{page==="enrollments"?"Enrollments":"Analytics"}</h1>
            </div>
            <div className="topbar-right">
              <button className="btn btn-outline btn-sm" onClick={()=>{exportCSV(enrollments);toast("Exported","success");}}>? Export</button>
              <button className="btn btn-gold btn-sm" onClick={fetchData}>? Refresh</button>
            </div>
          </header>

          <main className="ifa-content">
            {page==="enrollments" && (
              <>
                <div className="stats-grid">
                  {statCards.map((s,i)=>(
                    <div key={i} className="stat-card" style={{"--accent-glow":s.accent, borderColor: i===0?"var(--border)":s.color+"25"}}>
                      <div className="stat-top">
                        <div className="stat-icon-wrap" style={{background:s.iconBg}}>{["??","??","??","?","?"][i]}</div>
                      </div>
                      <div className="stat-value" style={{color:s.color}}>{s.value}</div>
                      <div className="stat-label">{s.label}</div>
                      <div className="stat-progress">
                        <div className="stat-progress-fill" style={{width: stats.total ? `${(s.value/stats.total)*100}%` : "0%", background: s.color}}/>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="filters-bar">
                  <div className="search-wrap">
                    <span className="search-icon">?</span>
                    <input className="search-input" placeholder="Search name, email, phone…" value={search} onChange={e=>setSearch(e.target.value)}/>
                  </div>
                  <div className="filter-chips">
                    {["all","new","contacted","enrolled","cancelled"].map(f=>(
                      <button key={f} className={`chip${filter===f?" chip-active":""}`} onClick={()=>setFilter(f)}>{f}</button>
                    ))}
                  </div>
                </div>

                <div className="table-wrap">
                  <div className="table-header" style={{"--cols":colsDef}}>
                    <span>Student</span>
                    {bp!=="mobile"&&<><span>Email</span><span>Phone</span><span>Certification</span></>}
                    <span>Status</span>
                    {bp==="desktop"&&<span>Date</span>}
                    <span/>
                  </div>
                  <div className="table-body">
                    {loading?(
                      <div className="empty-state"><div className="empty-icon">?</div><p className="empty-text">Loading…</p></div>
                    ):enrollments.length===0?(
                      <div className="empty-state"><div className="empty-icon">??</div><p className="empty-text">No enrollments found</p><p className="empty-sub">Try adjusting your search or filter</p></div>
                    ):enrollments.map(row=>(
                      <div key={row._id} className={`table-row${selected?._id===row._id?" row-selected":""}`} style={{"--cols":colsDef}} onClick={()=>setSelected(selected?._id===row._id?null:row)}>
                        <div>
                          <div className="student-name">{row.firstName} {row.lastName}</div>
                          {bp==="mobile"&&<div className="student-email">{row.certificationGoal}</div>}
                        </div>
                        {bp!=="mobile"&&<><div className="student-email" style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{row.email}</div><div className="student-email">{row.phone}</div><div><span className="cert-badge">{row.certificationGoal}</span></div></>}
                        <div><StatusPill status={row.status}/></div>
                        {bp==="desktop"&&<div className="date-text">{fmtDate(row.createdAt)}</div>}
                        <div style={{display:"flex",justifyContent:"center"}}>
                          <button className="delete-ico" onClick={ev=>{ev.stopPropagation();if(!confirm("Delete?"))return;fetch("/api/admin/enrollments",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:row._id})}).then(()=>{handleDelete(row._id);toast("Deleted","error");});}}>??</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
            {page==="analytics"&&<AnalyticsPage enrollments={enrollments} stats={stats}/>}
          </main>

          <nav className="bottom-nav">
            {[{id:"enrollments",icon:"??",label:"Students"},{id:"analytics",icon:"??",label:"Analytics"}].map(n=>(
              <button key={n.id} className={`bn-item${page===n.id?" bn-active":""}`} onClick={()=>setPage(n.id)}>
                <span className="bn-icon">{n.icon}</span><span className="bn-lbl">{n.label}</span>
              </button>
            ))}
            <button className="bn-item" onClick={()=>{exportCSV(enrollments);toast("Exported","success");}}><span className="bn-icon">?</span><span className="bn-lbl">Export</span></button>
            <button className="bn-item" onClick={logout}><span className="bn-icon">?</span><span className="bn-lbl">Logout</span></button>
          </nav>
        </div>

        {selected&&(
          <DetailPanel e={selected} onClose={()=>setSelected(null)} onUpdate={handleUpdate} onDelete={handleDelete} toast={toast}/>
        )}
      </div>
      <ToastTray list={toasts}/>
    </>
  );
}

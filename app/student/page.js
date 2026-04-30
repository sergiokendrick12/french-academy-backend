"use client";
import { useState, useEffect, useRef } from "react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#0b0e1a;--bg2:#111527;--bg3:#161b30;
  --border:rgba(255,255,255,0.07);--border2:rgba(255,255,255,0.12);
  --text:#f0f2ff;--text2:#9aa0be;--text3:#5a6080;
  --g-purple:linear-gradient(135deg,#2a1f5e 0%,#3d2b8a 100%);
  --g-teal:linear-gradient(135deg,#0d3d35 0%,#0f5e4e 100%);
  --g-rose:linear-gradient(135deg,#3d1028 0%,#621840 100%);
  --g-blue:linear-gradient(135deg,#0f2a50 0%,#163d7a 100%);
  --g-amber:linear-gradient(135deg,#3a1f00 0%,#5e3500 100%);
  --g-green:linear-gradient(135deg,#0d3320 0%,#0f4d2e 100%);
  --purple:#9b8dff;--teal:#2dd4bf;--rose:#fb7aac;
  --blue:#60a5fa;--amber:#fbbf24;--green:#4ade80;--gold:#c9a843;
}
*{font-family:'DM Sans',sans-serif;}
body{background:var(--bg);color:var(--text);min-height:100vh;}
::-webkit-scrollbar{width:6px;height:6px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:3px;}

/* ── LOGIN ── */
.login-wrap{min-height:100vh;background:var(--bg);display:flex;align-items:center;justify-content:center;padding:20px;position:relative;overflow:hidden;}
.login-glow{position:absolute;border-radius:50%;filter:blur(80px);pointer-events:none;}
.login-glow.a{width:400px;height:400px;background:rgba(155,141,255,0.12);top:-100px;left:-100px;}
.login-glow.b{width:300px;height:300px;background:rgba(45,212,191,0.08);bottom:-50px;right:-50px;}
.tricolor{position:absolute;top:0;left:0;right:0;height:3px;display:flex;}
.tc1{flex:1;background:#002395;}.tc2{flex:1;background:#fff;}.tc3{flex:1;background:#ED2939;}
.login-card{background:var(--bg2);border:1px solid var(--border2);border-radius:24px;padding:44px 40px;width:100%;max-width:420px;position:relative;z-index:1;}
.login-logo-ring{width:70px;height:70px;border-radius:50%;background:rgba(155,141,255,0.1);border:2px solid rgba(155,141,255,0.3);display:flex;align-items:center;justify-content:center;font-size:30px;margin:0 auto 20px;}
.login-title{font-family:'Sora',sans-serif;font-size:26px;font-weight:800;color:var(--text);text-align:center;margin-bottom:6px;}
.login-sub{font-size:11px;color:var(--text3);text-align:center;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:32px;}
.login-flag{display:flex;align-items:center;gap:6px;justify-content:center;margin-bottom:28px;}
.login-flag span{font-size:11px;color:var(--text3);}
.flag-bar{height:10px;border-radius:2px;}
.login-lbl{font-size:10px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:var(--text3);margin-bottom:8px;}
.login-in{width:100%;padding:13px 16px;background:rgba(255,255,255,0.05);border:1px solid var(--border2);border-radius:10px;color:var(--text);font-size:14px;outline:none;margin-bottom:18px;transition:border-color .2s;}
.login-in:focus{border-color:var(--purple);}
.login-in::placeholder{color:var(--text3);}
.login-err{font-size:12px;color:var(--rose);margin-bottom:12px;text-align:center;}
.login-btn{width:100%;padding:14px;background:linear-gradient(135deg,#7c6fff,#9b8dff);color:#fff;border:none;border-radius:10px;font-family:'Sora',sans-serif;font-size:14px;font-weight:700;cursor:pointer;transition:opacity .2s,transform .2s;}
.login-btn:hover{opacity:0.9;transform:translateY(-1px);}
.login-btn:disabled{opacity:0.6;cursor:not-allowed;transform:none;}
.login-note{font-size:11px;color:var(--text3);text-align:center;margin-top:14px;}

/* ── NAV ── */
.pnav{background:var(--bg2);border-bottom:1px solid var(--border);height:62px;padding:0 28px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100;}
.pnav-logo{display:flex;align-items:center;gap:12px;}
.pnav-ifa{width:40px;height:40px;border-radius:10px;background:linear-gradient(135deg,#7c6fff,#9b8dff);display:flex;align-items:center;justify-content:center;font-family:'Sora',sans-serif;font-size:14px;font-weight:800;color:#fff;flex-shrink:0;}
.pnav-name{font-family:'Sora',sans-serif;font-size:14px;font-weight:700;color:var(--text);}
.pnav-sub{font-size:10px;color:var(--text3);letter-spacing:1px;text-transform:uppercase;}
.pnav-right{display:flex;align-items:center;gap:10px;}

/* ── NOTIFICATIONS ── */
.notif-bell{position:relative;width:38px;height:38px;border-radius:10px;background:rgba(255,255,255,0.05);border:1px solid var(--border2);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:16px;transition:background .2s;flex-shrink:0;}
.notif-bell:hover{background:rgba(255,255,255,0.1);}
.notif-badge{position:absolute;top:-4px;right:-4px;background:var(--rose);color:#fff;border-radius:999px;font-size:9px;font-weight:700;padding:2px 5px;min-width:16px;text-align:center;}
.notif-dropdown{position:absolute;top:50px;right:0;background:var(--bg2);border:1px solid var(--border2);border-radius:14px;width:min(300px,90vw);z-index:200;overflow:hidden;}
.notif-header{padding:12px 16px;border-bottom:1px solid var(--border);font-size:12px;font-weight:700;color:var(--text);display:flex;justify-content:space-between;align-items:center;}
.notif-item{padding:12px 16px;border-bottom:1px solid var(--border);cursor:pointer;transition:background .15s;}
.notif-item:hover{background:rgba(255,255,255,0.04);}
.notif-item:last-child{border-bottom:none;}
.notif-title{font-size:12px;font-weight:600;margin-bottom:2px;}
.notif-msg{font-size:11px;color:var(--text3);line-height:1.4;}
.notif-unread{background:rgba(155,141,255,0.06);}

/* ── STUDENT CHIP ── */
.student-chip{display:flex;align-items:center;gap:8px;background:rgba(155,141,255,0.1);border:1px solid rgba(155,141,255,0.2);border-radius:999px;padding:6px 14px 6px 8px;cursor:pointer;}
.student-avatar{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#7c6fff,#fb7aac);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;flex-shrink:0;}
.student-chip-name{font-size:13px;font-weight:500;color:var(--text);}
.logout-btn{background:rgba(255,255,255,0.05);border:1px solid var(--border2);color:var(--text2);padding:8px 18px;border-radius:8px;font-size:12px;cursor:pointer;font-family:'DM Sans',sans-serif;transition:background .2s;white-space:nowrap;}
.logout-btn:hover{background:rgba(255,255,255,0.1);color:var(--text);}

/* ── CONTENT ── */
.pcontent{max-width:100%;padding:28px 32px 80px;}

/* ── ANNOUNCEMENTS ── */
.ann-bar{border-radius:14px;padding:14px 18px;display:flex;align-items:flex-start;gap:12px;margin-bottom:16px;border-left:3px solid;}
.ann-ico{font-size:17px;flex-shrink:0;margin-top:1px;}
.ann-title-txt{font-size:13px;font-weight:700;margin-bottom:3px;}
.ann-body-txt{font-size:12px;line-height:1.6;color:var(--text2);}
.ann-date-txt{font-size:10px;margin-top:5px;opacity:0.6;}

/* ── WELCOME CARD ── */
.welcome-card{background:linear-gradient(135deg,#1c1652 0%,#271e7a 45%,#1c2e5e 100%);border:1px solid rgba(155,141,255,0.2);border-radius:18px;padding:24px 28px;display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;position:relative;overflow:hidden;gap:16px;}
.welcome-card::before{content:'';position:absolute;right:-60px;top:-60px;width:200px;height:200px;border-radius:50%;background:rgba(155,141,255,0.08);}
.welcome-card::after{content:'';position:absolute;right:60px;bottom:-40px;width:120px;height:120px;border-radius:50%;background:rgba(45,212,191,0.06);}
.welcome-hi{font-family:'Sora',sans-serif;font-size:24px;font-weight:800;color:var(--text);margin-bottom:8px;}
.welcome-meta{display:flex;flex-wrap:wrap;gap:10px 16px;}
.welcome-meta span{font-size:12px;color:rgba(255,255,255,0.5);}
.enrolled-pill{background:rgba(74,222,128,0.12);border:1px solid rgba(74,222,128,0.25);color:var(--green);padding:8px 18px;border-radius:999px;font-size:12px;font-weight:700;display:flex;align-items:center;gap:7px;white-space:nowrap;z-index:1;flex-shrink:0;}
.e-dot{width:7px;height:7px;border-radius:50%;background:var(--green);}

/* ── TABS ── */
.tabs-row{display:flex;gap:4px;background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:5px;margin-bottom:22px;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;}
.tabs-row::-webkit-scrollbar{display:none;}
.tab-btn{flex-shrink:0;padding:9px 14px;border-radius:10px;border:none;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:500;cursor:pointer;white-space:nowrap;transition:all .18s;color:var(--text3);background:transparent;}
.tab-btn.active{background:linear-gradient(135deg,#7c6fff,#9b8dff);color:#fff;}
.tab-btn:hover:not(.active){color:var(--text);background:rgba(255,255,255,0.05);}

/* ── STATS GRID ── */
.stats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:16px;}
.stat-card{border-radius:16px;padding:20px;position:relative;overflow:hidden;border:1px solid rgba(255,255,255,0.07);transition:transform .2s;}
.stat-card:hover{transform:translateY(-3px);}
.stat-card.purple{background:var(--g-purple);}
.stat-card.teal{background:var(--g-teal);}
.stat-card.rose{background:var(--g-rose);}
.stat-card.blue{background:var(--g-blue);}
.stat-card.amber{background:var(--g-amber);}
.stat-card.green{background:var(--g-green);}
.stat-ico{font-size:22px;margin-bottom:12px;}
.stat-lbl{font-size:9px;letter-spacing:1.8px;text-transform:uppercase;color:rgba(255,255,255,0.45);margin-bottom:6px;}
.stat-val{font-family:'Sora',sans-serif;font-size:26px;font-weight:800;margin-bottom:4px;line-height:1;}
.stat-card.purple .stat-val{color:var(--purple);}
.stat-card.teal .stat-val{color:var(--teal);}
.stat-card.rose .stat-val{color:var(--rose);}
.stat-card.blue .stat-val{color:var(--blue);}
.stat-card.amber .stat-val{color:var(--amber);}
.stat-card.green .stat-val{color:var(--green);}
.stat-sub{font-size:11px;color:rgba(255,255,255,0.35);}

/* ── LAYOUT BLOCKS ── */
.bottom-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
.section{background:var(--bg2);border:1px solid var(--border);border-radius:16px;padding:22px;margin-bottom:14px;}
.section-title{font-family:'Sora',sans-serif;font-size:15px;font-weight:700;color:var(--text);margin-bottom:4px;}
.section-sub{font-size:12px;color:var(--text3);margin-bottom:18px;}

/* ── HELP / CONTACT ── */
.help-card{background:linear-gradient(135deg,#0d2e1a,#0f4228);border:1px solid rgba(74,222,128,0.15);border-radius:16px;padding:22px;}
.help-btns{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px;}
.btn-wa{background:#25D366;color:#fff;border:none;padding:10px 20px;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;display:flex;align-items:center;gap:6px;}
.btn-email{background:rgba(155,141,255,0.15);color:var(--purple);border:1px solid rgba(155,141,255,0.25);padding:10px 20px;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;}

/* ── SCHEDULE ── */
.sched-item{background:var(--bg3);border:1px solid var(--border);border-radius:12px;padding:14px 18px;display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;gap:12px;}
.sched-day{font-size:10px;color:var(--purple);font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:3px;}
.sched-name{font-size:14px;font-weight:600;color:var(--text);}
.sched-meta{font-size:11px;color:var(--text3);margin-top:3px;}

/* ── TABLES ── */
.tbl-head{display:grid;padding:8px 14px;font-size:10px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;color:var(--text3);margin-bottom:4px;}
.tbl-row{display:grid;background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:12px 14px;margin-bottom:6px;align-items:center;font-size:13px;color:var(--text);}
.pill{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:999px;font-size:11px;font-weight:600;}
.pdot{width:5px;height:5px;border-radius:50%;}

/* ── MINI STATS ── */
.mini-stats{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:18px;}
.mini-stat{background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:12px 18px;text-align:center;}
.mini-stat-val{font-family:'Sora',sans-serif;font-size:20px;font-weight:800;margin-bottom:2px;}
.mini-stat-lbl{font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:1px;}

/* ── EMPTY / MSG ── */
.empty-state{text-align:center;padding:40px 20px;color:var(--text3);}
.empty-ico{font-size:36px;margin-bottom:12px;opacity:0.5;}
.empty-state p{font-size:14px;}
.msg-card{background:var(--bg3);border:1px solid var(--border);border-radius:16px;padding:22px;}
.msg-text{font-size:15px;color:var(--text2);font-style:italic;line-height:1.6;}

/* ── PROGRESS ── */
.progress-bar-wrap{background:rgba(255,255,255,0.07);border-radius:999px;height:8px;margin-top:8px;overflow:hidden;}
.progress-bar-fill{height:100%;border-radius:999px;transition:width .6s ease;}
.journey-step{display:flex;align-items:center;gap:14px;padding:14px 0;border-bottom:1px solid var(--border);}
.journey-step:last-child{border-bottom:none;}
.step-circle{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;font-weight:700;}
.step-done{background:rgba(74,222,128,0.15);color:var(--green);border:1px solid rgba(74,222,128,0.3);}
.step-current{background:rgba(155,141,255,0.15);color:var(--purple);border:1px solid rgba(155,141,255,0.3);}
.step-future{background:rgba(255,255,255,0.05);color:var(--text3);border:1px solid var(--border);}

/* ── PROFILE ── */
.profile-avatar-big{width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#7c6fff,#fb7aac);display:flex;align-items:center;justify-content:center;font-family:'Sora',sans-serif;font-size:28px;font-weight:800;color:#fff;margin:0 auto 16px;}
.profile-field{margin-bottom:16px;}
.profile-lbl{font-size:10px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:var(--text3);margin-bottom:6px;}
.profile-in{width:100%;padding:11px 14px;background:rgba(255,255,255,0.05);border:1px solid var(--border2);border-radius:10px;color:var(--text);font-size:14px;outline:none;transition:border-color .2s;}
.profile-in:focus{border-color:var(--purple);}
.profile-in:disabled{opacity:0.5;cursor:not-allowed;}
.profile-in::placeholder{color:var(--text3);}
.save-btn{background:linear-gradient(135deg,#7c6fff,#9b8dff);color:#fff;border:none;padding:12px 28px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;font-family:'Sora',sans-serif;}
.save-btn:disabled{opacity:0.5;cursor:not-allowed;}

/* ── RESOURCES ── */
.resource-item{background:var(--bg3);border:1px solid var(--border);border-radius:12px;padding:16px 18px;display:flex;align-items:center;gap:14px;margin-bottom:10px;}
.resource-ico{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;}
.resource-name{font-size:14px;font-weight:600;margin-bottom:3px;}
.resource-desc{font-size:11px;color:var(--text3);}
.dl-btn{background:rgba(155,141,255,0.12);color:var(--purple);border:1px solid rgba(155,141,255,0.2);padding:7px 14px;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;white-space:nowrap;font-family:'DM Sans',sans-serif;margin-left:auto;flex-shrink:0;}

/* ── BOTTOM NAV (mobile only) ── */
.bottom-nav{display:none;position:fixed;bottom:0;left:0;right:0;background:var(--bg2);border-top:1px solid var(--border2);z-index:200;padding:6px 4px env(safe-area-inset-bottom,6px);}
.bottom-nav-inner{display:flex;justify-content:space-around;align-items:center;}
.bnav-btn{display:flex;flex-direction:column;align-items:center;gap:3px;padding:6px 8px;border-radius:10px;border:none;background:transparent;color:var(--text3);cursor:pointer;transition:all .18s;min-width:44px;}
.bnav-btn.active{color:var(--purple);}
.bnav-btn.active .bnav-dot{background:var(--purple);}
.bnav-ico{font-size:18px;line-height:1;}
.bnav-lbl{font-size:9px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;}
.bnav-dot{width:4px;height:4px;border-radius:50%;background:transparent;margin-top:1px;}

/* ════════════════════════════════════════
   RESPONSIVE BREAKPOINTS
   ════════════════════════════════════════ */

/* ── Tablet (≤900px) ── */
@media(max-width:900px){
  .stats-grid{grid-template-columns:repeat(2,1fr);}
  .bottom-grid{grid-template-columns:1fr;}
  .profile-grid{grid-template-columns:1fr!important;}
  .pcontent{padding:20px 20px 80px;}
}

/* ── Mobile (≤640px) ── */
@media(max-width:640px){
  .pnav{padding:0 12px;height:56px;}
  .pnav-sub{display:none;}
  .pnav-name{font-size:12px;}
  .student-chip-name{display:none;}
  .student-chip{padding:6px;}
  .logout-btn{display:none;}
  .bottom-nav{display:block;}
  .tabs-row{display:none;}
  .pcontent{padding:14px 12px 76px;}
  .welcome-card{flex-direction:column;align-items:flex-start;padding:18px 18px;gap:12px;}
  .welcome-card::before{display:none;}
  .welcome-hi{font-size:20px;}
  .welcome-meta{gap:6px 12px;}
  .welcome-meta span{font-size:11px;}
  .enrolled-pill{align-self:flex-start;}
  .ann-bar{border-radius:10px;padding:12px 14px;}
  .stats-grid{grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:12px;}
  .stat-card{padding:14px 14px;}
  .stat-ico{font-size:18px;margin-bottom:8px;}
  .stat-val{font-size:20px;}
  .stat-sub{font-size:10px;}
  .section{padding:16px 14px;}
  .section-title{font-size:14px;}
  .sched-item{flex-wrap:wrap;gap:8px;}
  .sched-name{font-size:13px;}
  .sched-meta{font-size:10px;}
  .tbl-head{display:none;}
  .tbl-row-pay{display:flex!important;flex-direction:column;gap:8px;padding:14px;}
  .pay-row-top{display:flex;justify-content:space-between;align-items:center;}
  .pay-row-bot{display:flex;justify-content:space-between;align-items:center;}
  .tbl-row-att{display:flex!important;flex-direction:column;gap:4px;padding:12px 14px;}
  .tbl-row-cert{display:flex!important;flex-wrap:wrap;gap:6px;padding:12px 14px;align-items:center;}
  .tbl-row{padding:10px 12px;}
  .mini-stats{gap:8px;}
  .mini-stat{padding:10px 14px;flex:1;min-width:calc(50% - 4px);}
  .mini-stat-val{font-size:18px;}
  .resource-item{padding:12px 14px;gap:10px;}
  .resource-name{font-size:13px;}
  .dl-btn{padding:6px 10px;font-size:10px;}
  .help-card{padding:16px 14px;}
  .help-btns{flex-direction:column;}
  .btn-wa,.btn-email{width:100%;justify-content:center;padding:12px;}
  .profile-avatar-big{width:64px;height:64px;font-size:22px;}
  .msg-card{padding:16px 14px;}
  .msg-text{font-size:13px;}
  .bottom-grid{grid-template-columns:1fr;gap:10px;}
  .journey-step{gap:10px;}
  .step-circle{width:30px;height:30px;font-size:12px;}
}

/* ── Small mobile (≤380px) ── */
@media(max-width:380px){
  .stats-grid{grid-template-columns:1fr 1fr;}
  .stat-val{font-size:18px;}
  .welcome-hi{font-size:17px;}
  .pnav-ifa{width:34px;height:34px;font-size:12px;}
}
`;

const STATUS_MAP={
  new:      {color:"#60a5fa",bg:"rgba(96,165,250,.12)",border:"rgba(96,165,250,.25)",label:"New"},
  contacted:{color:"#fbbf24",bg:"rgba(251,191,36,.12)",border:"rgba(251,191,36,.25)",label:"Contacted"},
  enrolled: {color:"#4ade80",bg:"rgba(74,222,128,.12)",border:"rgba(74,222,128,.25)",label:"Enrolled"},
  cancelled:{color:"#fb7aac",bg:"rgba(251,122,172,.12)",border:"rgba(251,122,172,.25)",label:"Cancelled"},
};
const PAY_MAP={
  paid:   {color:"#4ade80",bg:"rgba(74,222,128,.12)",label:"Paid"},
  pending:{color:"#fbbf24",bg:"rgba(251,191,36,.12)",label:"Pending"},
  partial:{color:"#9b8dff",bg:"rgba(155,141,255,.12)",label:"Partial"},
  waived: {color:"#94a3b8",bg:"rgba(148,163,184,.10)",label:"Waived"},
};
const ATT_MAP={
  present:{color:"#4ade80",bg:"rgba(74,222,128,.12)",label:"Present"},
  absent: {color:"#fb7aac",bg:"rgba(251,122,172,.12)",label:"Absent"},
  late:   {color:"#fbbf24",bg:"rgba(251,191,36,.12)",label:"Late"},
};
const ANN_STYLES={
  info:   {color:"#60a5fa",bg:"rgba(96,165,250,.08)",border:"rgba(96,165,250,.25)",ico:"ℹ️"},
  warning:{color:"#fbbf24",bg:"rgba(251,191,36,.08)",border:"rgba(251,191,36,.25)",ico:"⚠️"},
  success:{color:"#4ade80",bg:"rgba(74,222,128,.08)",border:"rgba(74,222,128,.25)",ico:"✅"},
  urgent: {color:"#fb7aac",bg:"rgba(251,122,172,.08)",border:"rgba(251,122,172,.25)",ico:"🚨"},
};
const LEVELS=[
  {code:"A1",name:"Débutant",desc:"Complete beginner",color:"#4ade80"},
  {code:"A2",name:"Élémentaire",desc:"Basic communication",color:"#2dd4bf"},
  {code:"B1",name:"Intermédiaire",desc:"Everyday situations",color:"#60a5fa"},
  {code:"B2",name:"Avancé",desc:"Complex topics",color:"#9b8dff"},
  {code:"C1",name:"Autonome",desc:"Fluent expression",color:"#fbbf24"},
  {code:"C2",name:"Maîtrise",desc:"Near-native mastery",color:"#fb7aac"},
];
const RESOURCES=[
  {ico:"📄",name:"French Alphabet Guide",desc:"PDF · Beginner",color:"rgba(96,165,250,.15)"},
  {ico:"🎧",name:"Listening Practice Pack",desc:"Audio ZIP · A1-A2",color:"rgba(74,222,128,.15)"},
  {ico:"📝",name:"TCF Québec Sample Tests",desc:"PDF · B1-B2",color:"rgba(155,141,255,.15)"},
  {ico:"🎬",name:"French Conversation Videos",desc:"Links · All levels",color:"rgba(251,191,36,.15)"},
  {ico:"📚",name:"Grammar Reference Book",desc:"PDF · All levels",color:"rgba(251,122,172,.15)"},
  {ico:"🗣️",name:"Pronunciation Guide",desc:"PDF + Audio · A1",color:"rgba(45,212,191,.15)"},
];

const BOTTOM_NAV_TABS=[
  {id:"overview",ico:"🏠",lbl:"Home"},
  {id:"progress",ico:"📈",lbl:"Progress"},
  {id:"schedule",ico:"📅",lbl:"Schedule"},
  {id:"payments",ico:"💳",lbl:"Pay"},
  {id:"profile",ico:"👤",lbl:"Me"},
];

const ALL_TABS=[

  {id:"overview",label:"🏠 Overview"},
  {id:"courses",label:"🎓 Courses"},
  {id:"quiz",label:"📝 Quiz"},
  {id:"progress",label:"📈 Progress"},
  {id:"schedule",label:"📅 Schedule"},
  {id:"payments",label:"💳 Payments"},
  {id:"certifications",label:"🏆 Certs"},
  {id:"attendance",label:"📋 Attendance"},
  {id:"resources",label:"📚 Resources"},
  {id:"profile",label:"👤 Profile"},
];

function Pill({status,map}){const s=map[status]||Object.values(map)[0];return <span className="pill" style={{background:s.bg,color:s.color}}><span className="pdot" style={{background:s.color}}/>{s.label}</span>;}
function fmtDate(d){if(!d)return"—";return new Date(d).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"});}
function initials(f,l){return`${(f||"")[0]||""}${(l||"")[0]||""}`.toUpperCase();}
function AnnouncementBar({a}){const c=ANN_STYLES[a.type]||ANN_STYLES.info;return(<div className="ann-bar" style={{background:c.bg,borderColor:c.border}}><span className="ann-ico">{c.ico}</span><div style={{flex:1}}><div className="ann-title-txt" style={{color:c.color}}>{a.title}</div><div className="ann-body-txt">{a.message}</div><div className="ann-date-txt">📅 {fmtDate(a.createdAt)}</div></div></div>);}

export default function StudentPortal(){
  const [student,setStudent]=useState(null);
  const [data,setData]=useState(null);
  const [announcements,setAnnouncements]=useState([]);
  const [email,setEmail]=useState("");
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState("");
  const [tab,setTab]=useState("overview");
  const [showNotif,setShowNotif]=useState(false);
  const [readNotifs,setReadNotifs]=useState([]);
  const [profileEdit,setProfileEdit]=useState(false);
  const [profileForm,setProfileForm]=useState({});
  const [profileSaving,setProfileSaving]=useState(false);
  const [profileMsg,setProfileMsg]=useState("");
  const notifRef=useRef(null);

  useEffect(()=>{
    const h=(e)=>{if(notifRef.current&&!notifRef.current.contains(e.target))setShowNotif(false);};
    document.addEventListener("mousedown",h);
    return()=>document.removeEventListener("mousedown",h);
  },[]);

  const login=async()=>{
    if(!email.trim())return;
    setLoading(true);setErr("");
    try{
      const r=await fetch("/api/student/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email})});
      const d=await r.json();
      if(d.success){
        setStudent(d.student);
        setProfileForm({firstName:d.student.firstName,lastName:d.student.lastName,email:d.student.email,phone:d.student.phone||""});
        fetchData(d.student._id);fetchAnnouncements();
      }else setErr(d.error||"Student not found.");
    }catch{setErr("Connection error.");}
    finally{setLoading(false);}
  };

  const fetchData=async(id)=>{
    try{const r=await fetch("/api/student/data",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({studentId:id})});const d=await r.json();if(d.success)setData(d);}catch{}
  };
  const fetchAnnouncements=async()=>{
    try{const r=await fetch("/api/admin/announcements");const d=await r.json();setAnnouncements((d.announcements||[]).filter(a=>a.active&&(a.audience==="all"||a.audience==="students")));}catch{}
  };
  const logout=()=>{setStudent(null);setData(null);setEmail("");setTab("overview");};

  const saveProfile=async()=>{
    setProfileSaving(true);setProfileMsg("");
    try{
      const r=await fetch("/api/student/data",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({studentId:student._id,...profileForm})});
      const d=await r.json();
      if(d.success){setStudent(s=>({...s,...profileForm}));setProfileMsg("✅ Profile updated!");setProfileEdit(false);}
      else setProfileMsg("❌ Failed to update.");
    }catch{setProfileMsg("❌ Connection error.");}
    finally{setProfileSaving(false);}
  };

  const printReceipt=(p)=>{
    const w=window.open("","_blank");
    w.document.write(`<html><head><title>Receipt - IFA</title><style>body{font-family:sans-serif;padding:40px;max-width:500px;margin:0 auto;}.hdr{background:#1c1652;color:#fff;padding:20px;border-radius:8px;text-align:center;margin-bottom:24px;}.row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee;font-size:13px;}.total{display:flex;justify-content:space-between;font-weight:700;font-size:16px;color:#1c1652;border-top:2px solid #1c1652;margin-top:8px;padding-top:12px;}</style></head><body><div class="hdr"><h2 style="color:#fff;margin:0">International French Academy</h2><p style="opacity:0.7;margin:4px 0">Payment Receipt</p></div><div class="row"><span>Student</span><span>${student.firstName} ${student.lastName}</span></div><div class="row"><span>Amount</span><span>${(p.amount||0).toLocaleString()} RWF</span></div><div class="row"><span>Method</span><span>${p.method||"—"}</span></div><div class="row"><span>Date</span><span>${p.date||"—"}</span></div><div class="row"><span>Status</span><span>${p.status||"—"}</span></div><div class="total"><span>Total</span><span>${(p.amount||0).toLocaleString()} RWF</span></div><p style="margin-top:20px;font-size:11px;color:#888">IFA · frenchacademyinternational@gmail.com · +250 785 302 957</p><script>window.print();</script></body></html>`);
    w.document.close();
  };

  const totalPaid=data?.payments?.filter(p=>p.status==="paid").reduce((a,p)=>a+p.amount,0)||0;
  const totalPending=data?.payments?.filter(p=>p.status==="pending").reduce((a,p)=>a+p.amount,0)||0;
  const certCount=data?.certifications?.length||0;
  const passRate=certCount>0?Math.round((data.certifications.filter(c=>c.passed).length/certCount)*100):null;
  const attTotal=data?.attendance?.length||0;
  const attPresent=data?.attendance?.filter(a=>a.status==="present").length||0;
  const attendanceRate=attTotal>0?Math.round((attPresent/attTotal)*100):null;
  const unreadNotifs=announcements.filter(a=>!readNotifs.includes(a._id)).length;

  if(!student)return(
    <><style>{CSS}</style>
    <div className="login-wrap">
      <div className="tricolor"><div className="tc1"/><div className="tc2"/><div className="tc3"/></div>
      <div className="login-glow a"/><div className="login-glow b"/>
      <div className="login-card">
        <div className="login-logo-ring"><img src="/logo.png" style={{width:60,height:60,borderRadius:"50%",objectFit:"cover"}}/></div>
        <h1 className="login-title">Student Portal</h1>
        <p className="login-sub">International French Academy</p>
        <div className="login-flag">
          <div className="flag-bar" style={{width:18,background:"#002395"}}/>
          <div className="flag-bar" style={{width:18,background:"#fff"}}/>
          <div className="flag-bar" style={{width:18,background:"#ED2939"}}/>
          <span>France · Rwanda</span>
        </div>
        <div className="login-lbl">Your Email Address</div>
        <input className="login-in" type="email" placeholder="your@email.com" value={email}
          onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&login()}/>
        {err&&<p className="login-err">⚠️ {err}</p>}
        <button className="login-btn" onClick={login} disabled={loading}>{loading?"Checking…":"Access My Portal →"}</button>
        <p className="login-note">Enter the email address you used when enrolling</p>
      </div>
    </div></>
  );

  const ss=STATUS_MAP[student.status]||STATUS_MAP.new;
  const currentLevelIdx=data?.progress?.currentLevelIndex??1;
  const currentLevel=LEVELS[currentLevelIdx]||LEVELS[0];
  const levelProgress=data?.progress?.levelProgress??45;

  return(
    <><style>{CSS}</style>
    <div style={{background:"var(--bg)",minHeight:"100vh"}}>

      {/* ── TOP NAV ── */}
      <nav className="pnav">
        <div className="pnav-logo">
          <div className="pnav-ifa">IFA</div>
          <div><div className="pnav-name">International French Academy</div><div className="pnav-sub">Student Portal</div></div>
        </div>
        <div className="pnav-right">
          <div style={{position:"relative"}} ref={notifRef}>
            <div className="notif-bell" onClick={()=>setShowNotif(v=>!v)}>
              🔔{unreadNotifs>0&&<span className="notif-badge">{unreadNotifs}</span>}
            </div>
            {showNotif&&(
              <div className="notif-dropdown">
                <div className="notif-header">
                  <span>Notifications</span>
                  {unreadNotifs>0&&<span style={{fontSize:11,color:"var(--purple)",cursor:"pointer"}} onClick={()=>setReadNotifs(announcements.map(a=>a._id))}>Mark all read</span>}
                </div>
                {announcements.length===0?<div style={{padding:"20px",textAlign:"center",color:"var(--text3)",fontSize:12}}>No notifications</div>
                :announcements.map((a,i)=>{
                  const isRead=readNotifs.includes(a._id);
                  const c=ANN_STYLES[a.type]||ANN_STYLES.info;
                  return(<div key={i} className={`notif-item${isRead?"":" notif-unread"}`} onClick={()=>setReadNotifs(r=>[...new Set([...r,a._id])])}>
                    <div className="notif-title" style={{color:c.color}}>{c.ico} {a.title}</div>
                    <div className="notif-msg">{a.message}</div>
                  </div>);
                })}
              </div>
            )}
          </div>
          <div className="student-chip" onClick={()=>setTab("profile")}>
            <div className="student-avatar">{initials(student.firstName,student.lastName)}</div>
            <span className="student-chip-name">{student.firstName} {student.lastName}</span>
          </div>
          <button className="logout-btn" onClick={logout}>Sign Out</button>
        </div>
      </nav>

      {/* ── MAIN CONTENT ── */}
      <div className="pcontent">
        {announcements.map((a,i)=><AnnouncementBar key={i} a={a}/>)}

        <div className="welcome-card">
          <div style={{position:"relative",zIndex:1,flex:1}}>
            <div className="welcome-hi">Welcome back, {student.firstName}! 👋</div>
            <div className="welcome-meta">
              <span>🎯 {student.certificationGoal||"—"}</span>
              <span>📅 {fmtDate(student.createdAt)}</span>
              <span>📊 {currentLevel.code} — {currentLevel.name}</span>
            </div>
          </div>
          <span className="enrolled-pill" style={{background:ss.bg,color:ss.color,borderColor:ss.border}}>
            <span className="e-dot" style={{background:ss.color}}/>{ss.label}
          </span>
        </div>

        {/* Desktop tab row */}
        <div className="tabs-row">
          {ALL_TABS.map(t=><button key={t.id} className={`tab-btn${tab===t.id?" active":""}`} onClick={()=>setTab(t.id)}>{t.label}</button>)}
        </div>

        {/* OVERVIEW */}
        {tab==="overview"&&(<>
          <div className="stats-grid">
            {[
              {cls:"purple",ico:"💰",lbl:"Total Paid",val:`${totalPaid.toLocaleString()}`,sub:"RWF · Confirmed"},
              {cls:"teal",ico:"⏳",lbl:"Pending",val:`${totalPending.toLocaleString()}`,sub:"RWF · Outstanding"},
              {cls:"rose",ico:"🏆",lbl:"Pass Rate",val:passRate!==null?`${passRate}%`:"—",sub:`${certCount} exam(s)`},
              {cls:"blue",ico:"📋",lbl:"Attendance",val:attendanceRate!==null?`${attendanceRate}%`:"—",sub:`${attTotal} sessions`},
              {cls:"amber",ico:"🎯",lbl:"Goal",val:student.certificationGoal||"—",sub:"Certification"},
              {cls:"green",ico:"📚",lbl:"Classes",val:data?.schedules?.length||"—",sub:"Available"},
            ].map((c,i)=>(
              <div key={i} className={`stat-card ${c.cls}`}>
                <div className="stat-ico">{c.ico}</div>
                <div className="stat-lbl">{c.lbl}</div>
                <div className="stat-val" style={c.lbl==="Goal"?{fontSize:"15px",paddingTop:"6px"}:{}}>{c.val}</div>
                <div className="stat-sub">{c.sub}</div>
              </div>
            ))}
          </div>
          <div className="bottom-grid">
            <div className="msg-card">
              <div className="section-title" style={{marginBottom:10}}>💬 Your Message</div>
              <p className="msg-text">{student.message?`"${student.message}"`:<span style={{opacity:0.4}}>No message yet.</span>}</p>
            </div>
            <div className="help-card">
              <div className="section-title">📞 Need Help?</div>
              <div className="section-sub">Contact the academy directly</div>
              <div className="help-btns">
                <a href="https://wa.me/250785302957" target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}><button className="btn-wa">💬 WhatsApp</button></a>
                <a href="mailto:frenchacademyinternational@gmail.com" style={{textDecoration:"none"}}><button className="btn-email">📧 Send Email</button></a>
              </div>
            </div>
          </div>
        </>)}

        {/* PROGRESS */}
        {tab==="progress"&&(
          <div className="section">
            <div className="section-title">📈 My Learning Journey</div>
            <div className="section-sub">Track your French language progress through the CEFR levels</div>
            <div style={{background:"linear-gradient(135deg,rgba(155,141,255,0.1),rgba(45,212,191,0.08))",border:"1px solid rgba(155,141,255,0.2)",borderRadius:14,padding:"20px 20px",marginBottom:20}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14,flexWrap:"wrap"}}>
                <div style={{width:52,height:52,borderRadius:12,background:"rgba(155,141,255,0.15)",border:"1px solid rgba(155,141,255,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Sora',sans-serif",fontSize:18,fontWeight:800,color:"var(--purple)",flexShrink:0}}>
                  {currentLevel.code}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"'Sora',sans-serif",fontSize:17,fontWeight:700}}>{currentLevel.name}</div>
                  <div style={{fontSize:12,color:"var(--text3)"}}>{currentLevel.desc}</div>
                </div>
                <span style={{background:"rgba(155,141,255,0.12)",color:"var(--purple)",border:"1px solid rgba(155,141,255,0.2)",padding:"6px 14px",borderRadius:999,fontSize:12,fontWeight:700,whiteSpace:"nowrap"}}>Current Level</span>
              </div>
              <div style={{fontSize:12,color:"var(--text3)",marginBottom:6}}>Level progress — {levelProgress}%</div>
              <div className="progress-bar-wrap"><div className="progress-bar-fill" style={{width:`${levelProgress}%`,background:"linear-gradient(90deg,#7c6fff,#9b8dff)"}}/></div>
            </div>
            <div style={{fontSize:12,color:"var(--text3)",fontWeight:600,letterSpacing:"1px",textTransform:"uppercase",marginBottom:8}}>Full Learning Path</div>
            {LEVELS.map((l,i)=>{
              const done=i<currentLevelIdx,curr=i===currentLevelIdx;
              return(
                <div key={i} className="journey-step">
                  <div className={`step-circle ${done?"step-done":curr?"step-current":"step-future"}`}>{done?"✓":l.code}</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:600,fontSize:13,color:done?"var(--green)":curr?"var(--text)":"var(--text3)"}}>{l.name} ({l.code})</div>
                    <div style={{fontSize:11,color:"var(--text3)"}}>{l.desc}</div>
                    {curr&&<div style={{marginTop:6}}><div className="progress-bar-wrap" style={{maxWidth:200}}><div className="progress-bar-fill" style={{width:`${levelProgress}%`,background:l.color}}/></div><div style={{fontSize:10,color:"var(--text3)",marginTop:3}}>{levelProgress}% complete</div></div>}
                  </div>
                  <span style={{fontSize:10,fontWeight:600,color:done?"var(--green)":curr?"var(--purple)":"var(--text3)",flexShrink:0}}>{done?"✅ Done":curr?"🔥 Active":"🔒 Locked"}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* SCHEDULE */}
        {tab==="schedule"&&(
          <div className="section">
            <div className="section-title">📅 Class Schedule</div>
            <div className="section-sub">All available classes at IFA</div>
            {!data?.schedules?.length?<div className="empty-state"><div className="empty-ico">📅</div><p>No classes scheduled yet</p></div>
            :data.schedules.map((c,i)=>(
              <div key={i} className="sched-item">
                <div style={{flex:1,minWidth:0}}>
                  <div className="sched-day">{c.day}</div>
                  <div className="sched-name">{c.name}</div>
                  <div className="sched-meta">🕐 {c.time} · {c.level} · 👨‍🏫 {c.teacher} · 📍 {c.room}</div>
                </div>
                <span className="pill" style={{background:"rgba(155,141,255,.12)",color:"var(--purple)",flexShrink:0}}>{c.level}</span>
              </div>
            ))}
          </div>
        )}

        {/* PAYMENTS */}
        {tab==="payments"&&(
          <div className="section">
            <div className="section-title">💳 Payment History</div>
            <div className="section-sub">Your complete payment records</div>
            {!data?.payments?.length?<div className="empty-state"><div className="empty-ico">💳</div><p>No payment records yet</p></div>:(
              <>
                <div className="mini-stats">
                  {[{lbl:"Total Paid",val:`${totalPaid.toLocaleString()} RWF`,color:"var(--green)"},{lbl:"Pending",val:`${totalPending.toLocaleString()} RWF`,color:"var(--amber)"},{lbl:"Transactions",val:data.payments.length,color:"var(--blue)"}].map((s,i)=>(
                    <div key={i} className="mini-stat"><div className="mini-stat-val" style={{color:s.color}}>{s.val}</div><div className="mini-stat-lbl">{s.lbl}</div></div>
                  ))}
                </div>
                <div className="tbl-head" style={{gridTemplateColumns:"1fr 1fr 100px 80px 90px"}}>
                  <span>Amount</span><span>Method</span><span>Date</span><span>Status</span><span>Receipt</span>
                </div>
                {data.payments.map((p,i)=>(
                  <div key={i} className="tbl-row tbl-row-pay" style={{gridTemplateColumns:"1fr 1fr 100px 80px 90px"}}>
                    <div className="pay-row-top">
                      <span style={{fontWeight:700,color:"var(--green)",fontFamily:"'Sora',sans-serif"}}>{p.amount.toLocaleString()} RWF</span>
                      <Pill status={p.status} map={PAY_MAP}/>
                    </div>
                    <div className="pay-row-bot">
                      <span style={{fontSize:12,color:"var(--text2)"}}>{p.method}</span>
                      <span style={{fontSize:11,color:"var(--text3)"}}>{p.date}</span>
                    </div>
                    <div style={{display:"flex",justifyContent:"flex-end"}}>
                      <button onClick={()=>printReceipt(p)} style={{background:"rgba(74,222,128,0.1)",color:"var(--green)",border:"1px solid rgba(74,222,128,0.2)",padding:"7px 12px",borderRadius:6,fontSize:12,cursor:"pointer",fontWeight:600,width:"100%",maxWidth:120}}>🖨️ Print Receipt</button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* CERTIFICATIONS */}
        {tab==="certifications"&&(
          <div className="section">
            <div className="section-title">🏆 Exam Results</div>
            <div className="section-sub">Your certification exam history</div>
            {!data?.certifications?.length?<div className="empty-state"><div className="empty-ico">📝</div><p>No exam results yet. Keep studying!</p></div>:(
              <>
                <div className="tbl-head" style={{gridTemplateColumns:"1fr 80px 100px 80px"}}><span>Certification</span><span>Score</span><span>Date</span><span>Result</span></div>
                {data.certifications.map((c,i)=>(
                  <div key={i} className="tbl-row tbl-row-cert" style={{gridTemplateColumns:"1fr 80px 100px 80px"}}>
                    <span style={{fontWeight:600,flex:1}}>{c.cert}</span>
                    <span style={{fontWeight:700,color:"var(--purple)"}}>{c.score||"—"}</span>
                    <span style={{fontSize:11,color:"var(--text3)"}}>{c.examDate||"—"}</span>
                    <Pill status={c.passed?"pass":"fail"} map={{"pass":{color:"var(--green)",bg:"rgba(74,222,128,.12)",label:"Pass"},"fail":{color:"var(--rose)",bg:"rgba(251,122,172,.12)",label:"Fail"}}}/>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* ATTENDANCE */}
        {tab==="attendance"&&(
          <div className="section">
            <div className="section-title">📋 My Attendance</div>
            <div className="section-sub">Your class attendance record</div>
            {!data?.attendance?.length?<div className="empty-state"><div className="empty-ico">📋</div><p>No attendance records yet</p></div>:(
              <>
                <div className="mini-stats">
                  {[{lbl:"Present",val:attPresent,color:"var(--green)"},{lbl:"Absent",val:data.attendance.filter(a=>a.status==="absent").length,color:"var(--rose)"},{lbl:"Late",val:data.attendance.filter(a=>a.status==="late").length,color:"var(--amber)"},{lbl:"Rate",val:attendanceRate!==null?`${attendanceRate}%`:"—",color:"var(--blue)"}].map((s,i)=>(
                    <div key={i} className="mini-stat"><div className="mini-stat-val" style={{color:s.color}}>{s.val}</div><div className="mini-stat-lbl">{s.lbl}</div></div>
                  ))}
                </div>
                <div className="tbl-head" style={{gridTemplateColumns:"110px 1fr 80px"}}><span>Date</span><span>Class</span><span>Status</span></div>
                {data.attendance.map((a,i)=>(
                  <div key={i} className="tbl-row tbl-row-att" style={{gridTemplateColumns:"110px 1fr 80px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{fontSize:12,color:"var(--text3)"}}>{a.date}</span>
                      <span style={{fontWeight:500}}>{a.className}</span>
                      <Pill status={a.status} map={ATT_MAP}/>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* COURSES */}
        {tab==="courses"&&(
          <div className="section">
            <div className="section-title">🎓 Mes Cours</div>
            <div className="section-sub">Vos supports de cours assignés</div>
            {!data?.courses?.length?<div className="empty-state"><div className="empty-ico">🎓</div><p>Aucun cours disponible pour l'instant.</p></div>
            :data.courses.map((c,i)=>(
              <div key={i} className="resource-item">
                <div className="resource-ico" style={{background:"rgba(155,141,255,0.15)"}}>
                  {c.fileType?.includes("pdf")?"📄":c.fileType?.includes("pptx")?"📊":"📁"}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div className="resource-name">{c.title}</div>
                  <div className="resource-desc">{c.description} · {c.level}</div>
                </div>
                <a href={c.fileUrl} target="_blank" rel="noopener noreferrer">
                  <button className="dl-btn">⬇️ Télécharger</button>
                </a>
              </div>
            ))}
          </div>
        )}

        {/* RESOURCES */}
        {tab==="resources"&&(
          <div className="section">
            <div className="section-title">📚 Study Resources</div>
            <div className="section-sub">Download materials for your French learning journey</div>
            {RESOURCES.map((r,i)=>(
              <div key={i} className="resource-item">
                <div className="resource-ico" style={{background:r.color}}>{r.ico}</div>
                <div style={{flex:1,minWidth:0}}><div className="resource-name">{r.name}</div><div className="resource-desc">{r.desc}</div></div>
                <button className="dl-btn">⬇️ Download</button>
              </div>
            ))}
            <div style={{marginTop:16,padding:"14px 18px",background:"rgba(251,191,36,0.07)",border:"1px solid rgba(251,191,36,0.2)",borderRadius:12,fontSize:12,color:"var(--amber)"}}>
              💡 More resources are added regularly. Contact the academy for additional materials.
            </div>
          </div>
        )}

        {/* PROFILE */}
        {tab==="profile"&&(
          <div className="profile-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div className="section">
              <div className="section-title">👤 My Profile</div>
              <div className="section-sub">View and update your information</div>
              <div className="profile-avatar-big">{initials(student.firstName,student.lastName)}</div>
              <div style={{textAlign:"center",marginBottom:24}}>
                <div style={{fontFamily:"'Sora',sans-serif",fontSize:18,fontWeight:700}}>{student.firstName} {student.lastName}</div>
                <div style={{fontSize:12,color:"var(--text3)",marginTop:4,wordBreak:"break-all"}}>{student.email}</div>
                <span className="pill" style={{background:ss.bg,color:ss.color,marginTop:8,display:"inline-flex"}}>{ss.label}</span>
              </div>
              {profileMsg&&<div style={{padding:"10px 14px",borderRadius:8,marginBottom:16,fontSize:12,background:profileMsg.includes("✅")?"rgba(74,222,128,0.1)":"rgba(251,122,172,0.1)",color:profileMsg.includes("✅")?"var(--green)":"var(--rose)"}}>{profileMsg}</div>}
              {["firstName","lastName","email","phone"].map(f=>(
                <div key={f} style={{marginBottom:16}}>
                  <div style={{fontSize:10,fontWeight:600,letterSpacing:"1.5px",textTransform:"uppercase",color:"var(--text3)",marginBottom:6}}>{f==="firstName"?"First Name":f==="lastName"?"Last Name":f==="email"?"Email":"Phone"}</div>
                  <input className="profile-in" value={profileForm[f]||""} disabled={!profileEdit} placeholder={f==="phone"?"+250 ...":""} onChange={e=>setProfileForm(p=>({...p,[f]:e.target.value}))}/>
                </div>
              ))}
              <div style={{display:"flex",gap:10,marginTop:8,flexWrap:"wrap"}}>
                {!profileEdit?<button className="save-btn" onClick={()=>setProfileEdit(true)}>✏️ Edit Profile</button>:(
                  <>
                    <button className="save-btn" onClick={saveProfile} disabled={profileSaving}>{profileSaving?"Saving…":"💾 Save"}</button>
                    <button onClick={()=>{setProfileEdit(false);setProfileMsg("");}} style={{background:"rgba(255,255,255,0.05)",border:"1px solid var(--border2)",color:"var(--text2)",padding:"12px 20px",borderRadius:10,cursor:"pointer",fontSize:13}}>Cancel</button>
                  </>
                )}
              </div>
            </div>
            <div className="section">
              <div className="section-title">🎓 Enrollment Info</div>
              <div className="section-sub">Your academy details</div>
              {[
                {lbl:"Certification Goal",val:student.certificationGoal||"—"},
                {lbl:"Enrolled Date",val:fmtDate(student.createdAt)},
                {lbl:"Student Status",val:ss.label},
                {lbl:"Classes Available",val:data?.schedules?.length||"—"},
                {lbl:"Total Paid",val:`${totalPaid.toLocaleString()} RWF`},
                {lbl:"Attendance Rate",val:attendanceRate!==null?`${attendanceRate}%`:"—"},
                {lbl:"Current Level",val:`${currentLevel.code} — ${currentLevel.name}`},
              ].map((r,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:"1px solid var(--border)",gap:8}}>
                  <span style={{fontSize:12,color:"var(--text3)",flexShrink:0}}>{r.lbl}</span>
                  <span style={{fontSize:13,fontWeight:600,textAlign:"right"}}>{r.val}</span>
                </div>
              ))}
              <div style={{marginTop:20}}>
                <div style={{fontSize:13,fontWeight:700,marginBottom:12}}>📞 Contact Academy</div>
                <div className="help-btns">
                  <a href="https://wa.me/250785302957" target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}><button className="btn-wa" style={{fontSize:12,padding:"8px 16px"}}>💬 WhatsApp</button></a>
                  <a href="mailto:frenchacademyinternational@gmail.com" style={{textDecoration:"none"}}><button className="btn-email" style={{fontSize:12,padding:"8px 16px"}}>📧 Email</button></a>
                </div>
              </div>
              <button onClick={logout} style={{marginTop:20,width:"100%",padding:"12px",background:"rgba(251,122,172,0.08)",border:"1px solid rgba(251,122,172,0.2)",color:"var(--rose)",borderRadius:10,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>🚪 Sign Out</button>
            </div>
          </div>
        )}

      </div>

      {/* ── BOTTOM NAV (mobile) ── */}
      <div className="bottom-nav">
        <div className="bottom-nav-inner">
          {BOTTOM_NAV_TABS.map(t=>(
            <button key={t.id} className={`bnav-btn${tab===t.id?" active":""}`} onClick={()=>setTab(t.id)}>
              <span className="bnav-ico">{t.ico}</span>
              <span className="bnav-lbl">{t.lbl}</span>
              <span className="bnav-dot"/>
            </button>
          ))}
          <button className={`bnav-btn${!BOTTOM_NAV_TABS.find(t=>t.id===tab)&&tab!=="overview"?" active":""}`}
            onClick={()=>{
              const moreTabs=["certifications","attendance","resources"];
              const cur=moreTabs.indexOf(tab);
              setTab(moreTabs[cur<0?0:(cur+1)%moreTabs.length]);
            }}>
            <span className="bnav-ico">•••</span>
            <span className="bnav-lbl">More</span>
            <span className="bnav-dot"/>
          </button>
        </div>
      </div>

    </div></>
  );
}
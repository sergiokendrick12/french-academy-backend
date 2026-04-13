"use client";
import { useState, useEffect, useCallback } from "react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Sora:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --ink:#0c1520;--ink2:#111e2e;--ink3:#172438;--ink4:#1d2e46;
  --border:#243650;--border2:#2e4468;
  --gold:#d4a843;--gold-lt:#e8c068;--gold-dim:rgba(212,168,67,.12);--gold-glow:rgba(212,168,67,.06);
  --blue:#4d9de0;--blue-dim:rgba(77,157,224,.12);
  --teal:#3ec9a7;--teal-dim:rgba(62,201,167,.12);
  --rose:#e05c7a;--rose-dim:rgba(224,92,122,.12);
  --amber:#e8a030;--amber-dim:rgba(232,160,48,.12);
  --green:#4ade80;--green-dim:rgba(74,222,128,.12);
  --purple:#a78bfa;--purple-dim:rgba(167,139,250,.12);
  --text:#e8e2d9;--text2:#9aaabb;--text3:#607080;
  --font-d:"Playfair Display",Georgia,serif;
  --font-b:"Sora",system-ui,sans-serif;
  --r-sm:6px;--r-md:10px;--r-lg:14px;--r-xl:20px;
}
html,body{height:100%;}
body{background:var(--ink);font-family:var(--font-b);color:var(--text);font-size:14px;line-height:1.5;-webkit-font-smoothing:antialiased;}
::-webkit-scrollbar{width:3px;height:3px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:var(--border2);border-radius:2px;}
.shell{display:flex;height:100vh;overflow:hidden;}
.sidebar{width:252px;flex-shrink:0;background:var(--ink2);border-right:1px solid var(--border);display:flex;flex-direction:column;height:100vh;transition:transform .3s;overflow:hidden;position:relative;z-index:50;}
.sb-brand{padding:20px;border-bottom:1px solid var(--border);flex-shrink:0;display:flex;align-items:center;gap:12px;}
.sb-logo{width:38px;height:38px;border-radius:var(--r-md);background:var(--gold-dim);border:1px solid rgba(212,168,67,.3);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;}
.sb-name{font-family:var(--font-d);font-size:14px;font-weight:500;line-height:1.2;}
.sb-tag{font-size:9px;color:var(--text3);letter-spacing:2px;text-transform:uppercase;margin-top:2px;}
.sb-nav{flex:1;padding:12px;display:flex;flex-direction:column;gap:1px;overflow-y:auto;}
.sb-section{font-size:9px;letter-spacing:2.5px;text-transform:uppercase;color:var(--text3);padding:12px 8px 5px;font-weight:600;}
.nav-btn{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:var(--r-md);cursor:pointer;border:none;background:transparent;color:var(--text2);font-size:13px;font-family:var(--font-b);width:100%;text-align:left;transition:all .15s;position:relative;}
.nav-btn:hover{background:var(--gold-glow);color:var(--text);}
.nav-btn.on{background:var(--gold-dim);color:var(--gold);font-weight:500;}
.nav-btn.on::before{content:"";position:absolute;left:0;top:25%;bottom:25%;width:2px;background:var(--gold);border-radius:1px;}
.nav-ico{font-size:16px;width:20px;text-align:center;flex-shrink:0;}
.nav-lbl{flex:1;}
.nav-badge{background:var(--gold);color:var(--ink);font-size:10px;font-weight:700;padding:1px 7px;border-radius:10px;}
.sb-foot{padding:12px;border-top:1px solid var(--border);flex-shrink:0;}
.sb-user{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:var(--r-md);margin-bottom:4px;}
.u-av{width:30px;height:30px;border-radius:var(--r-sm);background:var(--gold-dim);border:1px solid rgba(212,168,67,.3);display:flex;align-items:center;justify-content:center;font-size:13px;color:var(--gold);font-weight:600;flex-shrink:0;}
.u-name{font-size:12px;font-weight:500;}
.u-role{font-size:10px;color:var(--text3);}
.logout-btn{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:var(--r-md);border:none;background:transparent;color:var(--text3);font-size:12px;font-family:var(--font-b);cursor:pointer;width:100%;transition:all .15s;}
.logout-btn:hover{color:var(--rose);background:var(--rose-dim);}
.overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:49;backdrop-filter:blur(2px);}
.main{flex:1;display:flex;flex-direction:column;min-width:0;height:100vh;overflow:hidden;}
.topbar{height:58px;background:var(--ink2);border-bottom:1px solid var(--border);padding:0 20px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;gap:12px;}
.tb-left{display:flex;align-items:center;gap:10px;min-width:0;}
.hbg{display:none;width:34px;height:34px;border-radius:var(--r-sm);border:1px solid var(--border);background:transparent;color:var(--text2);cursor:pointer;font-size:18px;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s;}
.hbg:hover{border-color:var(--gold);color:var(--gold);}
.tb-title{font-family:var(--font-d);font-size:19px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.tb-right{display:flex;align-items:center;gap:8px;flex-shrink:0;}
.btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:var(--r-md);border:none;font-size:13px;font-weight:500;font-family:var(--font-b);cursor:pointer;transition:all .15s;white-space:nowrap;}
.btn-gold{background:var(--gold);color:var(--ink);}
.btn-gold:hover{background:var(--gold-lt);transform:translateY(-1px);box-shadow:0 4px 20px rgba(212,168,67,.25);}
.btn-outline{background:transparent;color:var(--text2);border:1px solid var(--border);}
.btn-outline:hover{border-color:var(--gold);color:var(--gold);}
.btn-danger{background:transparent;color:var(--rose);border:1px solid rgba(224,92,122,.25);}
.btn-danger:hover{background:var(--rose-dim);}
.btn-teal{background:var(--teal-dim);color:var(--teal);border:1px solid rgba(62,201,167,.25);}
.btn-teal:hover{background:rgba(62,201,167,.2);}
.btn-blue{background:var(--blue-dim);color:var(--blue);border:1px solid rgba(77,157,224,.25);}
.btn-blue:hover{background:rgba(77,157,224,.2);}
.btn-sm{padding:6px 12px;font-size:12px;}
.btn-xs{padding:4px 8px;font-size:11px;}
.btn:disabled{opacity:.5;cursor:not-allowed;}
.content{flex:1;overflow-y:auto;padding:22px;}
.card{background:var(--ink2);border:1px solid var(--border);border-radius:var(--r-lg);padding:20px;}
.card-title{font-family:var(--font-d);font-size:16px;font-weight:500;margin-bottom:4px;}
.card-sub{font-size:12px;color:var(--text3);}
.stats-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:20px;}
.stat-card{background:var(--ink2);border:1px solid var(--border);border-radius:var(--r-lg);padding:16px;transition:transform .2s,box-shadow .2s;cursor:default;}
.stat-card:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.3);}
.stat-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;}
.stat-ico{width:30px;height:30px;border-radius:var(--r-sm);display:flex;align-items:center;justify-content:center;font-size:14px;}
.stat-val{font-family:var(--font-d);font-size:28px;font-weight:500;line-height:1;margin-bottom:3px;}
.stat-lbl{font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:1.5px;}
.stat-bar{height:2px;background:var(--border);border-radius:1px;margin-top:12px;}
.stat-bar-fill{height:100%;border-radius:1px;transition:width .8s;}
.filters{display:flex;align-items:center;gap:10px;margin-bottom:14px;flex-wrap:wrap;}
.search-wrap{position:relative;flex:1;min-width:180px;max-width:320px;}
.search-ico{position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--text3);font-size:13px;pointer-events:none;}
.search-in{width:100%;padding:8px 12px 8px 32px;background:var(--ink2);border:1px solid var(--border);border-radius:var(--r-md);color:var(--text);font-size:13px;font-family:var(--font-b);outline:none;transition:border-color .15s;}
.search-in::placeholder{color:var(--text3);}
.search-in:focus{border-color:var(--gold);}
.chips{display:flex;gap:5px;flex-wrap:wrap;}
.chip{padding:5px 12px;border-radius:20px;border:1px solid var(--border);background:transparent;color:var(--text2);font-size:11px;font-weight:500;font-family:var(--font-b);cursor:pointer;transition:all .15s;text-transform:capitalize;}
.chip.on{border-color:var(--gold)!important;background:var(--gold-dim)!important;color:var(--gold)!important;}
.tbl-wrap{background:var(--ink2);border:1px solid var(--border);border-radius:var(--r-lg);overflow:hidden;}
.tbl-head{display:grid;grid-template-columns:var(--cols);padding:9px 16px;background:var(--ink3);border-bottom:1px solid var(--border);font-size:10px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:var(--text3);}
.tbl-body{max-height:50vh;overflow-y:auto;}
.tbl-row{display:grid;grid-template-columns:var(--cols);padding:12px 16px;align-items:center;border-bottom:1px solid rgba(36,54,80,.5);cursor:pointer;transition:background .12s;}
.tbl-row:last-child{border-bottom:none;}
.tbl-row:hover{background:var(--ink3);}
.tbl-row.sel{background:var(--gold-glow);border-left:2px solid var(--gold);padding-left:14px;}
.s-name{font-size:13px;font-weight:500;}
.s-sub{font-size:11px;color:var(--text3);margin-top:1px;}
.cert-tag{display:inline-flex;align-items:center;background:var(--ink3);border:1px solid var(--border2);color:var(--gold);font-size:10px;font-weight:600;padding:2px 7px;border-radius:var(--r-sm);}
.del-ico{width:24px;height:24px;border-radius:var(--r-sm);border:1px solid var(--border);background:transparent;color:var(--text3);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:11px;transition:all .12s;opacity:0;}
.tbl-row:hover .del-ico{opacity:1;}
.del-ico:hover{border-color:var(--rose);color:var(--rose);background:var(--rose-dim);}
.pill{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:12px;font-size:11px;font-weight:600;}
.dot{width:5px;height:5px;border-radius:50%;}
.empty{padding:50px 20px;text-align:center;}
.empty-ico{font-size:32px;margin-bottom:8px;}
.empty-txt{font-size:13px;color:var(--text2);}
.empty-sub{font-size:11px;color:var(--text3);margin-top:3px;}
.panel{width:340px;flex-shrink:0;background:var(--ink2);border-left:1px solid var(--border);display:flex;flex-direction:column;height:100vh;overflow:hidden;}
.panel-top{padding:18px 20px;border-bottom:1px solid var(--border);flex-shrink:0;}
.panel-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:12px;}
.p-av{width:44px;height:44px;border-radius:var(--r-md);background:var(--gold-dim);border:1px solid rgba(212,168,67,.3);display:flex;align-items:center;justify-content:center;font-family:var(--font-d);font-size:17px;color:var(--gold);flex-shrink:0;}
.p-name{font-family:var(--font-d);font-size:17px;font-weight:500;line-height:1.2;}
.p-since{font-size:11px;color:var(--text3);margin-top:2px;}
.close-btn{width:26px;height:26px;border-radius:var(--r-sm);border:1px solid var(--border);background:transparent;color:var(--text2);cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.ptabs{display:flex;border-bottom:1px solid var(--border);padding:0 20px;flex-shrink:0;overflow-x:auto;}
.ptab{padding:10px 12px;font-size:12px;font-weight:500;color:var(--text2);cursor:pointer;border:none;background:transparent;font-family:var(--font-b);border-bottom:2px solid transparent;margin-bottom:-1px;transition:all .15s;white-space:nowrap;}
.ptab.on{color:var(--gold);border-bottom-color:var(--gold);}
.pbody{flex:1;overflow-y:auto;padding:16px 20px;}
.pfoot{padding:12px 20px;border-top:1px solid var(--border);display:flex;gap:8px;flex-shrink:0;}
.info-row{display:flex;gap:10px;padding:9px 0;border-bottom:1px solid rgba(36,54,80,.5);}
.info-row:last-child{border-bottom:none;}
.info-ico{font-size:13px;width:16px;text-align:center;flex-shrink:0;margin-top:1px;}
.info-lbl{font-size:9px;color:var(--text3);text-transform:uppercase;letter-spacing:1.2px;margin-bottom:2px;}
.info-val{font-size:13px;}
.info-link{color:var(--blue);text-decoration:none;}
.info-link:hover{color:var(--gold);}
.sec-lbl{font-size:9px;color:var(--text3);text-transform:uppercase;letter-spacing:2px;margin-bottom:8px;font-weight:600;}
.st-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:14px;}
.st-opt{padding:8px 10px;border-radius:var(--r-md);border:1px solid var(--border);background:transparent;font-size:12px;font-weight:500;text-align:center;cursor:pointer;transition:all .12s;font-family:var(--font-b);}
.p-textarea{width:100%;padding:9px 11px;background:var(--ink3);border:1px solid var(--border);border-radius:var(--r-md);color:var(--text);font-size:13px;font-family:var(--font-b);resize:none;outline:none;line-height:1.6;transition:border-color .15s;}
.p-textarea:focus{border-color:var(--gold);}
.p-input{width:100%;padding:8px 11px;background:var(--ink3);border:1px solid var(--border);border-radius:var(--r-md);color:var(--text);font-size:13px;font-family:var(--font-b);outline:none;transition:border-color .15s;margin-bottom:7px;}
.p-input:focus{border-color:var(--gold);}
.p-select{width:100%;padding:8px 11px;background:var(--ink3);border:1px solid var(--border);border-radius:var(--r-md);color:var(--text);font-size:13px;font-family:var(--font-b);outline:none;margin-bottom:7px;}
.bnav{display:none;border-top:1px solid var(--border);background:var(--ink2);padding:4px 0 6px;flex-shrink:0;justify-content:space-around;}
.bn{display:flex;flex-direction:column;align-items:center;gap:2px;padding:5px 10px;cursor:pointer;border:none;background:transparent;font-family:var(--font-b);}
.bn-ico{font-size:17px;}
.bn-lbl{font-size:9px;color:var(--text3);}
.bn.on .bn-lbl{color:var(--gold);}
.bn.on .bn-ico{filter:sepia(1) saturate(3) hue-rotate(5deg);}
.a-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;}
.chart-card{background:var(--ink2);border:1px solid var(--border);border-radius:var(--r-lg);padding:20px;}
.chart-title{font-family:var(--font-d);font-size:16px;margin-bottom:2px;}
.chart-sub{font-size:11px;color:var(--text3);margin-bottom:16px;}
.bar-wrap{display:flex;align-items:flex-end;gap:6px;height:120px;}
.bar-col-w{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;}
.bar-col{width:100%;border-radius:4px 4px 0 0;transition:height .7s;min-height:2px;}
.bar-v{font-size:9px;font-weight:600;}
.bar-l{font-size:8px;color:var(--text3);}
.donut-w{display:flex;align-items:center;gap:18px;}
.leg{display:flex;flex-direction:column;gap:8px;flex:1;}
.leg-row{display:flex;align-items:center;gap:7px;}
.leg-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;}
.leg-lbl{font-size:11px;flex:1;color:var(--text2);}
.leg-cnt{font-size:12px;font-weight:600;}
.cert-row{display:flex;align-items:center;gap:8px;margin-bottom:8px;}
.cert-lbl{font-size:11px;color:var(--text2);width:90px;flex-shrink:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.cert-track{flex:1;height:4px;background:var(--border);border-radius:2px;}
.cert-fill{height:100%;border-radius:2px;background:var(--gold);transition:width .7s;}
.cert-cnt{font-size:11px;font-weight:600;color:var(--gold);width:18px;text-align:right;}
.pay-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px;}
.pay-row{display:grid;grid-template-columns:1fr 1fr 1fr 1fr 100px;gap:12px;padding:12px 16px;align-items:center;border-bottom:1px solid rgba(36,54,80,.5);font-size:13px;}
.pay-head{background:var(--ink3);font-size:10px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:var(--text3);}
.pay-badge{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:12px;font-size:11px;font-weight:600;}
.pay-form{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;}
.form-group{display:flex;flex-direction:column;gap:5px;}
.form-label{font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:1.5px;font-weight:600;}
.form-input{padding:9px 12px;background:var(--ink3);border:1px solid var(--border);border-radius:var(--r-md);color:var(--text);font-size:13px;font-family:var(--font-b);outline:none;transition:border-color .15s;}
.form-input:focus{border-color:var(--gold);}
.form-select{padding:9px 12px;background:var(--ink3);border:1px solid var(--border);border-radius:var(--r-md);color:var(--text);font-size:13px;font-family:var(--font-b);outline:none;}
.sched-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-bottom:20px;}
.class-card{background:var(--ink2);border:1px solid var(--border);border-radius:var(--r-lg);padding:16px;transition:all .2s;}
.class-card:hover{border-color:rgba(212,168,67,.3);transform:translateY(-2px);}
.class-day{font-size:10px;color:var(--gold);text-transform:uppercase;letter-spacing:2px;margin-bottom:4px;font-weight:600;}
.class-name{font-family:var(--font-d);font-size:16px;margin-bottom:6px;}
.class-info{display:flex;gap:12px;flex-wrap:wrap;}
.class-tag{font-size:11px;color:var(--text2);background:var(--ink3);padding:3px 8px;border-radius:var(--r-sm);border:1px solid var(--border);}
.msg-templates{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:20px;}
.msg-tmpl{background:var(--ink3);border:1px solid var(--border);border-radius:var(--r-md);padding:14px;cursor:pointer;transition:all .15s;}
.msg-tmpl:hover{border-color:var(--gold);background:var(--gold-glow);}
.msg-tmpl-title{font-size:13px;font-weight:500;margin-bottom:4px;}
.msg-tmpl-sub{font-size:11px;color:var(--text3);}
.msg-compose{background:var(--ink2);border:1px solid var(--border);border-radius:var(--r-lg);padding:20px;}
.staff-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;}
.staff-card{background:var(--ink2);border:1px solid var(--border);border-radius:var(--r-lg);padding:16px;text-align:center;transition:all .2s;}
.staff-card:hover{border-color:rgba(212,168,67,.3);transform:translateY(-2px);}
.staff-av{width:56px;height:56px;border-radius:50%;background:var(--gold-dim);border:2px solid rgba(212,168,67,.3);display:flex;align-items:center;justify-content:center;font-family:var(--font-d);font-size:22px;color:var(--gold);margin:0 auto 12px;}
.staff-name{font-family:var(--font-d);font-size:15px;font-weight:500;margin-bottom:3px;}
.staff-role{font-size:11px;color:var(--text3);margin-bottom:10px;line-height:1.4;}
.cert-track-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-bottom:20px;}
.cert-prog-card{background:var(--ink2);border:1px solid var(--border);border-radius:var(--r-lg);padding:16px;}
.settings-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
.settings-section{background:var(--ink2);border:1px solid var(--border);border-radius:var(--r-lg);padding:20px;}
.settings-title{font-family:var(--font-d);font-size:16px;margin-bottom:4px;}
.settings-sub{font-size:12px;color:var(--text3);margin-bottom:16px;}
.toast-tray{position:fixed;bottom:20px;right:20px;z-index:999;display:flex;flex-direction:column;gap:8px;pointer-events:none;}
.toast{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:var(--r-md);background:var(--ink3);border:1px solid var(--border2);box-shadow:0 8px 32px rgba(0,0,0,.5);font-size:13px;font-weight:500;min-width:220px;}
.toast-ico{font-size:13px;}
.login-shell{min-height:100vh;background:var(--ink);display:flex;align-items:center;justify-content:center;padding:20px;}
.login-card{background:var(--ink2);border:1px solid var(--border);border-radius:var(--r-xl);padding:40px;width:100%;max-width:380px;box-shadow:0 40px 80px rgba(0,0,0,.6);}
.login-emblem{width:50px;height:50px;border-radius:var(--r-lg);background:var(--gold-dim);border:1px solid rgba(212,168,67,.3);display:flex;align-items:center;justify-content:center;font-size:24px;margin:0 auto 14px;}
.login-title{font-family:var(--font-d);font-size:24px;font-weight:500;text-align:center;margin-bottom:4px;}
.login-sub{font-size:11px;color:var(--text3);text-align:center;letter-spacing:1px;text-transform:uppercase;margin-bottom:30px;}
.login-lbl{font-size:10px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:var(--text3);margin-bottom:6px;}
.login-in{width:100%;padding:11px 13px;background:var(--ink3);border:1px solid var(--border);border-radius:var(--r-md);color:var(--text);font-size:14px;font-family:var(--font-b);outline:none;margin-bottom:18px;transition:border-color .15s;}
.login-in:focus{border-color:var(--gold);}
.login-err{color:var(--rose);font-size:12px;text-align:center;margin-bottom:10px;}
.login-foot{margin-top:20px;text-align:center;font-size:11px;color:var(--text3);}
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px);}
.modal{background:var(--ink2);border:1px solid var(--border);border-radius:var(--r-xl);padding:28px;width:100%;max-width:480px;max-height:90vh;overflow-y:auto;}
.modal-title{font-family:var(--font-d);font-size:20px;margin-bottom:4px;}
.modal-sub{font-size:12px;color:var(--text3);margin-bottom:20px;}
.modal-foot{display:flex;gap:8px;justify-content:flex-end;margin-top:20px;}
@media(max-width:900px){
  .stats-grid{grid-template-columns:repeat(3,1fr);}
  .content{padding:14px;}
  .topbar{padding:0 14px;}
  .a-grid{grid-template-columns:1fr;}
  .pay-grid{grid-template-columns:repeat(2,1fr);}
  .sched-grid{grid-template-columns:1fr;}
  .msg-templates{grid-template-columns:1fr 1fr;}
  .staff-grid{grid-template-columns:repeat(2,1fr);}
  .settings-grid{grid-template-columns:1fr;}
}
@media(max-width:640px){
  .sidebar{position:fixed;top:0;left:0;bottom:0;width:270px;transform:translateX(-100%);z-index:50;}
  .sidebar.open{transform:translateX(0);box-shadow:4px 0 24px rgba(0,0,0,.5);}
  .overlay.show{display:block;}
  .hbg{display:flex;}
  .stats-grid{grid-template-columns:repeat(2,1fr);gap:8px;}
  .stat-card:last-child{grid-column:span 2;}
  .stat-val{font-size:24px;}
  .topbar{padding:0 10px;height:52px;}
  .tb-title{font-size:16px;}
  .tb-right .btn-outline{display:none;}
  .filters{gap:6px;}
  .search-wrap{max-width:100%;min-width:0;}
  .chips{overflow-x:auto;flex-wrap:nowrap;padding-bottom:3px;}
  .tbl-body{max-height:36vh;}
  .panel{position:fixed;inset:0;width:100%;height:100%;z-index:100;border-left:none;}
  .bnav{display:flex;}
  .content{padding:8px;padding-bottom:65px;}
  .toast-tray{bottom:75px;right:10px;left:10px;}
  .toast{min-width:auto;}
  .login-card{padding:28px 20px;}
  .pay-grid{grid-template-columns:1fr;}
  .msg-templates{grid-template-columns:1fr;}
  .staff-grid{grid-template-columns:1fr 1fr;}
  .pay-form{grid-template-columns:1fr;}
}
`;

const S = {
  new:       { color:"#4d9de0", bg:"rgba(77,157,224,.12)",  label:"New" },
  contacted: { color:"#e8a030", bg:"rgba(232,160,48,.12)",  label:"Contacted" },
  enrolled:  { color:"#3ec9a7", bg:"rgba(62,201,167,.12)",  label:"Enrolled" },
  cancelled: { color:"#e05c7a", bg:"rgba(224,92,122,.12)",  label:"Cancelled" },
};
const PAY_STATUS = {
  paid:    { color:"#3ec9a7", bg:"rgba(62,201,167,.12)",   label:"Paid" },
  pending: { color:"#e8a030", bg:"rgba(232,160,48,.12)",   label:"Pending" },
  partial: { color:"#a78bfa", bg:"rgba(167,139,250,.12)",  label:"Partial" },
  waived:  { color:"#607080", bg:"rgba(96,112,128,.12)",   label:"Waived" },
};
const fmtDate = d => new Date(d).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"});
const initials = (f="",l="") => `${f[0]||""}${l[0]||""}`.toUpperCase();
const exportCSV = rows => {
  const H = ["First Name","Last Name","Email","Phone","Certification","Status","Date","Notes"];
  const R = rows.map(e=>[e.firstName,e.lastName,e.email,e.phone,e.certificationGoal,e.status,fmtDate(e.createdAt),(e.notes||"").replace(/,/g,";")]);
  const csv = [H,...R].map(r=>r.map(v=>`"${v}"`).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv],{type:"text/csv"}));
  Object.assign(document.createElement("a"),{href:url,download:"ifa_students.csv"}).click();
  URL.revokeObjectURL(url);
};

function Pill({status, map=S}) {
  const s = map[status] || map[Object.keys(map)[0]];
  return <span className="pill" style={{background:s.bg,color:s.color}}><span className="dot" style={{background:s.color}}/>{s.label}</span>;
}
function useToast() {
  const [list,setList] = useState([]);
  const show = useCallback((msg,type="success")=>{
    const id = Date.now();
    setList(l=>[...l,{id,msg,type}]);
    setTimeout(()=>setList(l=>l.filter(x=>x.id!==id)),3200);
  },[]);
  return {list,show};
}
function ToastTray({list}) {
  const ico = {success:"✓",error:"✕",info:"ℹ"};
  const col = {success:"var(--teal)",error:"var(--rose)",info:"var(--blue)"};
  return <div className="toast-tray">{list.map(t=><div key={t.id} className="toast"><span className="toast-ico" style={{color:col[t.type]}}>{ico[t.type]}</span>{t.msg}</div>)}</div>;
}

function LoginPage({onLogin}) {
  const [pw,setPw] = useState("");
  const [err,setErr] = useState("");
  const [loading,setLoading] = useState(false);
  const submit = async () => {
    if(!pw)return;
    setLoading(true);setErr("");
    try {
      const r = await fetch("/api/admin/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:pw})});
      const d = await r.json();
      if(d.success) onLogin(); else setErr(d.error||"Incorrect password.");
    } catch { setErr("Connection error."); }
    finally { setLoading(false); }
  };
  return (
    <><style>{CSS}</style>
    <div className="login-shell">
      <div className="login-card">
        <div className="login-emblem" style={{padding:0,overflow:"hidden"}}><img src="/logo.png" alt="IFA Logo" style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"var(--r-lg)"}}/></div>
        <h1 className="login-title">Admin Portal</h1>
        <p className="login-sub">International French Academy · Kigali</p>
        <div className="login-lbl">Password</div>
        <input type="password" className="login-in" autoFocus value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="Enter admin password"/>
        {err&&<p className="login-err">{err}</p>}
        <button className="btn btn-gold" style={{width:"100%",justifyContent:"center",padding:"12px",fontSize:"14px"}} onClick={submit} disabled={loading}>{loading?"Verifying...":"Enter Dashboard →"}</button>
        <p className="login-foot">International French Academy · Rwanda</p>
      </div>
    </div></>
  );
}

// ═══════════════════════════════════════════
// 🏠 HOME DASHBOARD — NEW!
// ═══════════════════════════════════════════
function HomeDashboard({enrollments, stats, payments, tracking, onNavigate}) {
  const recentEnrollments = [...enrollments]
    .sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const totalRevenue = payments.filter(p=>p.status==="paid").reduce((a,p)=>a+p.amount,0);
  const pendingRevenue = payments.filter(p=>p.status==="pending").reduce((a,p)=>a+p.amount,0);
  const passRate = tracking.length > 0
    ? Math.round((tracking.filter(t=>t.passed).length/tracking.length)*100) : 0;

  const today = new Date();
  const dayName = today.toLocaleDateString("en-US",{weekday:"long"});

  const allClasses = [
    {id:1,name:"TCF Canada Preparation",time:"8H00–10H00",teacher:"Banda Clément",room:"Room A",days:["Monday","Wednesday","Friday"]},
    {id:2,name:"DELF A1–A2 Beginners",time:"18H00–20H00",teacher:"KWIBUKA Erick",room:"Room B",days:["Tuesday","Thursday"]},
    {id:3,name:"TEF Québec Intensive",time:"9H00–12H00",teacher:"Banda Clément",room:"Main Hall",days:["Monday","Tuesday","Wednesday","Thursday","Friday"]},
    {id:4,name:"DALF C1/C2 Advanced",time:"15H00–18H00",teacher:"KWIBUKA Erick",room:"Room A",days:["Saturday","Sunday"]},
    {id:5,name:"General French Beginners",time:"18H00–20H00",teacher:"Ingabire Germaine",room:"Room C",days:["Monday","Wednesday"]},
    {id:6,name:"DILF Weekend",time:"9H00–12H00",teacher:"Ingabire Germaine",room:"Room B",days:["Saturday"]},
  ];
  const todayClasses = allClasses.filter(c=>c.days.includes(dayName));
  const pendingPayments = payments.filter(p=>p.status==="pending");

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{background:"linear-gradient(135deg,var(--ink3) 0%,var(--ink4) 100%)",border:"1px solid var(--border)",borderLeft:"3px solid var(--gold)",borderRadius:"var(--r-lg)",padding:"18px 22px",marginBottom:20,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{fontFamily:"var(--font-d)",fontSize:20,marginBottom:3}}>
            Good {today.getHours()<12?"Morning":today.getHours()<17?"Afternoon":"Evening"}, Admin 👋
          </div>
          <div style={{fontSize:12,color:"var(--text3)"}}>
            {today.toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric"})} · International French Academy
          </div>
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <button className="btn btn-gold btn-sm" onClick={()=>onNavigate("enrollments")}>View Enrollments</button>
          <button className="btn btn-outline btn-sm" onClick={()=>onNavigate("messages")}>Send Message</button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
        {[
          {label:"Total Students",value:stats.total||0,color:"var(--gold)",ico:"👥",sub:`${stats.new||0} new this week`,page:"enrollments"},
          {label:"Revenue Collected",value:`${totalRevenue.toLocaleString()} RWF`,color:"var(--teal)",ico:"💰",sub:`${pendingRevenue.toLocaleString()} RWF pending`,page:"payments"},
          {label:"Enrolled",value:stats.enrolled||0,color:"var(--blue)",ico:"✅",sub:"Active students",page:"enrollments"},
          {label:"Pass Rate",value:`${passRate}%`,color:"var(--purple)",ico:"🏆",sub:`${tracking.length} exam results`,page:"certifications"},
        ].map((s,i)=>(
          <div key={i} className="stat-card" style={{borderColor:s.color+"30",cursor:"pointer"}} onClick={()=>onNavigate(s.page)}>
            <div className="stat-top">
              <div className="stat-ico" style={{fontSize:18}}>{s.ico}</div>
            </div>
            <div style={{fontFamily:"var(--font-d)",fontSize:26,color:s.color,marginBottom:2}}>{s.value}</div>
            <div className="stat-lbl">{s.label}</div>
            <div style={{fontSize:10,color:"var(--text3)",marginTop:4}}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Middle Row */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        {/* Recent Enrollments */}
        <div className="card">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div><div className="card-title">Recent Enrollments</div><div className="card-sub">Latest students who signed up</div></div>
            <button className="btn btn-outline btn-xs" onClick={()=>onNavigate("enrollments")}>View All</button>
          </div>
          {recentEnrollments.length===0?(
            <div className="empty" style={{padding:"20px"}}><div className="empty-ico">📭</div><p className="empty-txt">No enrollments yet</p></div>
          ):recentEnrollments.map((e,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:i<recentEnrollments.length-1?"1px solid rgba(36,54,80,.5)":"none"}}>
              <div style={{width:34,height:34,borderRadius:"var(--r-sm)",background:"var(--gold-dim)",border:"1px solid rgba(212,168,67,.3)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-d)",fontSize:13,color:"var(--gold)",flexShrink:0}}>
                {initials(e.firstName,e.lastName)}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:500}}>{e.firstName} {e.lastName}</div>
                <div style={{fontSize:11,color:"var(--text3)"}}>{e.certificationGoal}</div>
              </div>
              <Pill status={e.status}/>
            </div>
          ))}
        </div>

        {/* Today's Classes */}
        <div className="card">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div><div className="card-title">Today's Classes</div><div className="card-sub">{dayName} schedule</div></div>
            <button className="btn btn-outline btn-xs" onClick={()=>onNavigate("schedule")}>View All</button>
          </div>
          {todayClasses.length===0?(
            <div className="empty" style={{padding:"20px"}}><div className="empty-ico">🎉</div><p className="empty-txt">No classes today!</p><p className="empty-sub">Enjoy your day off</p></div>
          ):todayClasses.map((c,i)=>(
            <div key={i} style={{padding:"10px 12px",background:"var(--ink3)",borderRadius:"var(--r-md)",border:"1px solid var(--border)",marginBottom:i<todayClasses.length-1?8:0}}>
              <div style={{fontWeight:500,fontSize:13,marginBottom:4}}>{c.name}</div>
              <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                <span style={{fontSize:10,color:"var(--gold)"}}>🕐 {c.time}</span>
                <span style={{fontSize:10,color:"var(--text3)"}}>👨‍🏫 {c.teacher}</span>
                <span style={{fontSize:10,color:"var(--text3)"}}>📍 {c.room}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        {/* Pending Payments */}
        <div className="card">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div><div className="card-title">Pending Payments</div><div className="card-sub">Outstanding balances</div></div>
            <button className="btn btn-outline btn-xs" onClick={()=>onNavigate("payments")}>View All</button>
          </div>
          {pendingPayments.length===0?(
            <div className="empty" style={{padding:"20px"}}><div className="empty-ico">✅</div><p className="empty-txt">All payments up to date!</p></div>
          ):pendingPayments.map((p,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 0",borderBottom:i<pendingPayments.length-1?"1px solid rgba(36,54,80,.5)":"none"}}>
              <div>
                <div style={{fontSize:13,fontWeight:500}}>{p.studentName}</div>
                <div style={{fontSize:11,color:"var(--text3)"}}>{p.method}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:13,fontWeight:600,color:"var(--amber)"}}>{p.amount.toLocaleString()} RWF</div>
                <Pill status={p.status} map={PAY_STATUS}/>
              </div>
            </div>
          ))}
        </div>

        {/* Enrollment Overview */}
        <div className="card">
          <div style={{marginBottom:14}}><div className="card-title">Enrollment Overview</div><div className="card-sub">Current status breakdown</div></div>
          {[
            {label:"New",value:stats.new||0,color:"var(--blue)"},
            {label:"Contacted",value:stats.contacted||0,color:"var(--amber)"},
            {label:"Enrolled",value:stats.enrolled||0,color:"var(--teal)"},
            {label:"Cancelled",value:stats.cancelled||0,color:"var(--rose)"},
          ].map((s,i)=>(
            <div key={i} style={{marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontSize:12,color:"var(--text2)"}}>{s.label}</span>
                <span style={{fontSize:12,fontWeight:600,color:s.color}}>{s.value}</span>
              </div>
              <div style={{height:5,background:"var(--border)",borderRadius:3}}>
                <div style={{height:"100%",borderRadius:3,background:s.color,width:`${((s.value/(stats.total||1))*100)}%`,transition:"width .7s"}}/>
              </div>
            </div>
          ))}
          <div style={{marginTop:16,padding:"10px 12px",background:"var(--ink3)",borderRadius:"var(--r-md)",display:"flex",justifyContent:"space-between"}}>
            <span style={{fontSize:12,color:"var(--text3)"}}>Total Students</span>
            <span style={{fontSize:14,fontWeight:600,color:"var(--gold)",fontFamily:"var(--font-d)"}}>{stats.total||0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DonutChart({stats}) {
  const total = Math.max(stats.total||0,1);
  const segs = [
    {key:"new",color:"#4d9de0",label:"New",count:stats.new||0},
    {key:"contacted",color:"#e8a030",label:"Contacted",count:stats.contacted||0},
    {key:"enrolled",color:"#3ec9a7",label:"Enrolled",count:stats.enrolled||0},
    {key:"cancelled",color:"#e05c7a",label:"Cancelled",count:stats.cancelled||0},
  ];
  const r=46,cx=58,cy=58,sw=13,circ=2*Math.PI*r;
  let off=0;
  const arcs=segs.map(s=>{const dash=(s.count/total)*circ;const a={...s,dash,off};off+=dash;return a;});
  return (
    <div className="donut-w">
      <svg width={116} height={116} style={{flexShrink:0}}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border)" strokeWidth={sw}/>
        {arcs.map(a=><circle key={a.key} cx={cx} cy={cy} r={r} fill="none" stroke={a.color} strokeWidth={sw} strokeDasharray={`${a.dash} ${circ-a.dash}`} strokeDashoffset={circ/4-a.off}/>)}
        <text x={cx} y={cy-4} textAnchor="middle" fill="var(--text)" fontSize={20} fontFamily="Playfair Display,Georgia,serif" fontWeight="500">{stats.total||0}</text>
        <text x={cx} y={cy+9} textAnchor="middle" fill="var(--text3)" fontSize={9} fontFamily="Sora,sans-serif" letterSpacing="1.5">TOTAL</text>
      </svg>
      <div className="leg">{segs.map(s=><div key={s.key} className="leg-row"><span className="leg-dot" style={{background:s.color}}/><span className="leg-lbl">{s.label}</span><span className="leg-cnt" style={{color:s.color}}>{s.count}</span></div>)}</div>
    </div>
  );
}

function AnalyticsPage({enrollments,stats}) {
  const months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const counts=months.map((_,i)=>enrollments.filter(e=>new Date(e.createdAt).getMonth()===i).length);
  const maxC=Math.max(...counts,1);
  const certMap={};
  enrollments.forEach(e=>{certMap[e.certificationGoal]=(certMap[e.certificationGoal]||0)+1;});
  const certs=Object.entries(certMap).sort((a,b)=>b[1]-a[1]).slice(0,8);
  const maxCert=certs[0]?.[1]||1;
  const avgPerMonth = enrollments.length > 0 ? (enrollments.length/12).toFixed(1) : 0;
  const thisMonth = counts[new Date().getMonth()];
  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:20}}>
        {[
          {label:"Total Students",value:stats.total||0,color:"var(--gold)",ico:"👥"},
          {label:"This Month",value:thisMonth,color:"var(--teal)",ico:"📅"},
          {label:"Avg/Month",value:avgPerMonth,color:"var(--blue)",ico:"📊"},
        ].map((s,i)=>(
          <div key={i} className="card" style={{borderColor:s.color+"30"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
              <span style={{fontSize:20}}>{s.ico}</span>
              <span style={{fontSize:11,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"1.5px"}}>{s.label}</span>
            </div>
            <div style={{fontFamily:"var(--font-d)",fontSize:32,color:s.color}}>{s.value}</div>
          </div>
        ))}
      </div>
      <div className="a-grid">
        <div className="chart-card">
          <div className="chart-title">Monthly Trend</div>
          <div className="chart-sub">Enrollments by month</div>
          <div className="bar-wrap">
            {months.map((m,i)=>(
              <div key={m} className="bar-col-w">
                <span className="bar-v" style={{color:counts[i]?"var(--gold)":"var(--text3)"}}>{counts[i]||""}</span>
                <div className="bar-col" style={{height:`${(counts[i]/maxC)*100}%`,background:counts[i]?"linear-gradient(to top,var(--gold),var(--gold-lt))":"var(--border)"}}/>
                <span className="bar-l">{m}</span>
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
        <div style={{marginTop:14}}>
          {certs.length===0?<p style={{color:"var(--text3)",fontSize:13}}>No data yet.</p>
            :certs.map(([cert,count])=>(
              <div key={cert} className="cert-row">
                <span className="cert-lbl">{cert}</span>
                <div className="cert-track"><div className="cert-fill" style={{width:`${(count/maxCert)*100}%`}}/></div>
                <span className="cert-cnt">{count}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

function PaymentsPage({enrollments,toast}) {
  const [payments,setPayments] = useState([]);
  const [showModal,setShowModal] = useState(false);
  const [form,setForm] = useState({studentId:"",amount:"",method:"Mobile Money",status:"paid",date:new Date().toISOString().split("T")[0],note:""});
  const fetchPayments = async () => { try { const r = await fetch("/api/admin/payments"); const d = await r.json(); setPayments(d.payments||[]); } catch {} };
useEffect(()=>{ fetchPayments(); },[]);
  const addPayment = async () => {
    if(!form.studentId||!form.amount) return;
    const student = enrollments.find(e=>e._id===form.studentId);
    const body = {...form,amount:Number(form.amount),studentName:`${student?.firstName||""} ${student?.lastName||""}`};
    const r = await fetch("/api/admin/payments",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
    const d = await r.json();
    if(d.success){ fetchPayments(); setShowModal(false); toast("Payment recorded!","success"); setForm({studentId:"",amount:"",method:"Mobile Money",status:"paid",date:new Date().toISOString().split("T")[0],note:""}); }
  };
  const delPayment = async (id) => { if(!confirm("Delete payment?"))return; await fetch("/api/admin/payments",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id})}); fetchPayments(); toast("Deleted","error"); };
  const totalPaid = payments.filter(p=>p.status==="paid").reduce((a,p)=>a+p.amount,0);
  const totalPending = payments.filter(p=>p.status==="pending").reduce((a,p)=>a+p.amount,0);
  const totalPartial = payments.filter(p=>p.status==="partial").reduce((a,p)=>a+p.amount,0);
  return (
    <div>
      <div className="pay-grid">
        {[
          {label:"Total Collected",value:`${totalPaid.toLocaleString()} RWF`,color:"var(--teal)",ico:"💰"},
          {label:"Pending",value:`${totalPending.toLocaleString()} RWF`,color:"var(--amber)",ico:"⏳"},
          {label:"Partial",value:`${totalPartial.toLocaleString()} RWF`,color:"var(--purple)",ico:"⚡"},
        ].map((s,i)=>(
          <div key={i} className="card" style={{borderColor:s.color+"30"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
              <span style={{fontSize:18}}>{s.ico}</span>
              <span style={{fontSize:10,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"1.5px"}}>{s.label}</span>
            </div>
            <div style={{fontFamily:"var(--font-d)",fontSize:22,color:s.color}}>{s.value}</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div style={{fontFamily:"var(--font-d)",fontSize:18}}>Payment Records</div>
        <button className="btn btn-gold btn-sm" onClick={()=>setShowModal(true)}>+ Add Payment</button>
      </div>
      <div className="tbl-wrap">
        <div className="pay-row pay-head"><span>Student</span><span>Amount</span><span>Method</span><span>Status</span><span>Date</span></div>
        {payments.length===0?(
          <div className="empty"><div className="empty-ico">💳</div><p className="empty-txt">No payments recorded</p><p className="empty-sub">Add your first payment record</p></div>
        ):payments.map(p=>(
          <div key={p._id} className="pay-row" style={{cursor:"default"}}>
            <div style={{fontWeight:500}}>{p.studentName}</div>
            <div style={{color:"var(--gold)",fontWeight:600}}>{p.amount.toLocaleString()} RWF</div>
            <div style={{fontSize:12,color:"var(--text2)"}}>{p.method}</div>
            <div><Pill status={p.status} map={PAY_STATUS}/></div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <span style={{fontSize:11,color:"var(--text3)"}}>{p.date}</span>
              <button className="del-ico" style={{opacity:1}} onClick={()=>delPayment(p._id)}>✕</button>
            </div>
          </div>
        ))}
      </div>
      {showModal&&(
        <div className="modal-bg" onClick={()=>setShowModal(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-title">Record Payment</div>
            <div className="modal-sub">Add a payment record for a student</div>
            <div className="pay-form">
              <div className="form-group" style={{gridColumn:"span 2"}}>
                <label className="form-label">Student</label>
                <select className="form-select" value={form.studentId} onChange={e=>setForm({...form,studentId:e.target.value})}>
                  <option value="">Select student...</option>
                  {enrollments.map(e=><option key={e._id} value={e._id}>{e.firstName} {e.lastName} — {e.certificationGoal}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Amount (RWF)</label>
                <input className="form-input" type="number" placeholder="150000" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})}/>
              </div>
              <div className="form-group">
                <label className="form-label">Method</label>
                <select className="form-select" value={form.method} onChange={e=>setForm({...form,method:e.target.value})}>
                  {["Mobile Money","Bank Transfer","Cash","Airtel Money"].map(m=><option key={m}>{m}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-select" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
                  {Object.entries(PAY_STATUS).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input className="form-input" type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/>
              </div>
              <div className="form-group" style={{gridColumn:"span 2"}}>
                <label className="form-label">Note (optional)</label>
                <input className="form-input" placeholder="e.g. First installment" value={form.note} onChange={e=>setForm({...form,note:e.target.value})}/>
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn btn-outline" onClick={()=>setShowModal(false)}>Cancel</button>
              <button className="btn btn-gold" onClick={addPayment}>Save Payment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SchedulePage({toast}) {
  const defaultClasses = [
    {id:1,name:"TCF Canada Preparation",day:"Mon, Wed, Fri",time:"8H00 – 10H00",level:"B1–B2",teacher:"Banda Clément",students:12,room:"Room A"},
    {id:2,name:"DELF A1–A2 Beginners",day:"Tue, Thu",time:"18H00 – 20H00",level:"A1–A2",teacher:"KWIBUKA Erick",students:8,room:"Room B"},
    {id:3,name:"TEF Québec Intensive",day:"Mon – Fri",time:"9H00 – 12H00",level:"B2–C1",teacher:"Banda Clément",students:15,room:"Main Hall"},
    {id:4,name:"DALF C1/C2 Advanced",day:"Sat, Sun",time:"15H00 – 18H00",level:"C1–C2",teacher:"KWIBUKA Erick",students:6,room:"Room A"},
    {id:5,name:"General French Beginners",day:"Mon, Wed",time:"18H00 – 20H00",level:"A1",teacher:"Ingabire Germaine",students:20,room:"Room C"},
    {id:6,name:"DILF Weekend",day:"Sat",time:"9H00 – 12H00",level:"A1.1",teacher:"Ingabire Germaine",students:10,room:"Room B"},
  ];
  const [classes,setClasses] = useState(defaultClasses);
  const [showModal,setShowModal] = useState(false);
  const [form,setForm] = useState({name:"",day:"",time:"",level:"",teacher:"",students:"",room:""});
  const addClass = () => {
    if(!form.name||!form.day) return;
    setClasses([...classes,{id:Date.now(),...form,students:Number(form.students)||0}]);
    setShowModal(false); toast("Class added!","success");
    setForm({name:"",day:"",time:"",level:"",teacher:"",students:"",room:""});
  };
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
        <div>
          <div style={{fontFamily:"var(--font-d)",fontSize:22}}>Class Schedule</div>
          <div style={{fontSize:12,color:"var(--text3)",marginTop:2}}>Manage your academy's class timetable</div>
        </div>
        <button className="btn btn-gold" onClick={()=>setShowModal(true)}>+ Add Class</button>
      </div>
      <div className="sched-grid">
        {classes.map(c=>(
          <div key={c.id} className="class-card">
            <div className="class-day">{c.day}</div>
            <div className="class-name">{c.name}</div>
            <div className="class-info">
              <span className="class-tag">🕐 {c.time}</span>
              <span className="class-tag">📊 {c.level}</span>
              <span className="class-tag">👨‍🏫 {c.teacher}</span>
              <span className="class-tag">👥 {c.students} students</span>
              <span className="class-tag">📍 {c.room}</span>
            </div>
            <div style={{marginTop:12,display:"flex",gap:6}}>
              <button className="btn btn-outline btn-xs" onClick={()=>{setClasses(classes.filter(x=>x.id!==c.id));toast("Class removed","error");}}>Remove</button>
            </div>
          </div>
        ))}
      </div>
      {showModal&&(
        <div className="modal-bg" onClick={()=>setShowModal(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-title">Add New Class</div>
            <div className="modal-sub">Create a new class schedule entry</div>
            <div className="pay-form">
              <div className="form-group" style={{gridColumn:"span 2"}}>
                <label className="form-label">Class Name</label>
                <input className="form-input" placeholder="e.g. TCF Canada Preparation" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
              </div>
              <div className="form-group">
                <label className="form-label">Days</label>
                <input className="form-input" placeholder="e.g. Mon, Wed, Fri" value={form.day} onChange={e=>setForm({...form,day:e.target.value})}/>
              </div>
              <div className="form-group">
                <label className="form-label">Time</label>
                <input className="form-input" placeholder="e.g. 8H00 – 10H00" value={form.time} onChange={e=>setForm({...form,time:e.target.value})}/>
              </div>
              <div className="form-group">
                <label className="form-label">Level</label>
                <select className="form-select" value={form.level} onChange={e=>setForm({...form,level:e.target.value})}>
                  <option value="">Select level...</option>
                  {["A1","A1.1","A2","B1","B2","C1","C2","A1–A2","B1–B2","C1–C2"].map(l=><option key={l}>{l}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Teacher</label>
                <select className="form-select" value={form.teacher} onChange={e=>setForm({...form,teacher:e.target.value})}>
                  <option value="">Select teacher...</option>
                  {["KWIBUKA Erick","Banda Clément","Ingabire Germaine"].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Max Students</label>
                <input className="form-input" type="number" placeholder="20" value={form.students} onChange={e=>setForm({...form,students:e.target.value})}/>
              </div>
              <div className="form-group">
                <label className="form-label">Room</label>
                <input className="form-input" placeholder="e.g. Room A" value={form.room} onChange={e=>setForm({...form,room:e.target.value})}/>
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn btn-outline" onClick={()=>setShowModal(false)}>Cancel</button>
              <button className="btn btn-gold" onClick={addClass}>Add Class</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MessagesPage({enrollments,toast}) {
  const [to,setTo] = useState("all");
  const [subject,setSubject] = useState("");
  const [body,setBody] = useState("");
  const [sending,setSending] = useState(false);
  const [sent,setSent] = useState([]);
  const templates = [
    {title:"Welcome Message",sub:"For new enrollments",subject:"Welcome to IFA Kigali! 🎓",body:"Dear Student,\n\nWelcome to the International French Academy! We are thrilled to have you join our community.\n\nYour French learning journey begins now. Please contact us for your class schedule.\n\nBest regards,\nIFA Team"},
    {title:"Class Reminder",sub:"Upcoming class reminder",subject:"Class Reminder — IFA Kigali",body:"Dear Student,\n\nThis is a friendly reminder about your upcoming French class.\n\nPlease arrive on time and bring your study materials.\n\nBest regards,\nIFA Team"},
    {title:"Exam Notice",sub:"Certification exam update",subject:"Important Exam Notice — IFA Kigali",body:"Dear Student,\n\nWe have an important update regarding your French certification exam.\n\nPlease contact us for more details.\n\nBest regards,\nIFA Team"},
    {title:"Payment Reminder",sub:"Outstanding payment",subject:"Payment Reminder — IFA Kigali",body:"Dear Student,\n\nThis is a friendly reminder that your tuition payment is due.\n\nPlease contact us to arrange your payment.\n\nBest regards,\nIFA Team"},
    {title:"Holiday Notice",sub:"Academy closure notice",subject:"Holiday Notice — IFA Kigali",body:"Dear Student,\n\nPlease be informed that the academy will be closed for the upcoming holiday.\n\nClasses will resume on the scheduled date.\n\nBest regards,\nIFA Team"},
    {title:"Congratulations",sub:"For enrolled students",subject:"Congratulations! — IFA Kigali",body:"Dear Student,\n\nCongratulations on your enrollment at the International French Academy!\n\nWe look forward to helping you achieve your French language goals.\n\nBest regards,\nIFA Team"},
  ];
  const sendBulk = async () => {
    if(!subject||!body) return;
    setSending(true);
    const targets = to==="all" ? enrollments : enrollments.filter(e=>e.status===to);
    let success = 0;
    for(const e of targets) {
      try {
        const r = await fetch("/api/admin/send-email",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({to:e.email,subject,body,studentName:`${e.firstName} ${e.lastName}`})});
        const d = await r.json();
        if(d.success) success++;
      } catch {}
    }
    setSending(false);
    setSent([...sent,{id:Date.now(),to,subject,count:success,date:new Date().toLocaleDateString()}]);
    toast(`Sent to ${success} students!`,"success");
  };
  return (
    <div>
      <div style={{fontFamily:"var(--font-d)",fontSize:22,marginBottom:4}}>Bulk Messages</div>
      <div style={{fontSize:12,color:"var(--text3)",marginBottom:20}}>Send emails to all or specific groups of students</div>
      <div style={{marginBottom:16}}>
        <div style={{fontSize:11,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"2px",marginBottom:10,fontWeight:600}}>Quick Templates</div>
        <div className="msg-templates">
          {templates.map((t,i)=>(
            <div key={i} className="msg-tmpl" onClick={()=>{setSubject(t.subject);setBody(t.body);}}>
              <div className="msg-tmpl-title">{t.title}</div>
              <div className="msg-tmpl-sub">{t.sub}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="msg-compose">
        <div style={{fontFamily:"var(--font-d)",fontSize:17,marginBottom:16}}>Compose Message</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
          <div className="form-group">
            <label className="form-label">Send To</label>
            <select className="form-select" value={to} onChange={e=>setTo(e.target.value)}>
              <option value="all">All Students ({enrollments.length})</option>
              <option value="new">New Students ({enrollments.filter(e=>e.status==="new").length})</option>
              <option value="contacted">Contacted ({enrollments.filter(e=>e.status==="contacted").length})</option>
              <option value="enrolled">Enrolled ({enrollments.filter(e=>e.status==="enrolled").length})</option>
              <option value="cancelled">Cancelled ({enrollments.filter(e=>e.status==="cancelled").length})</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Subject</label>
            <input className="form-input" placeholder="Email subject..." value={subject} onChange={e=>setSubject(e.target.value)}/>
          </div>
        </div>
        <div className="form-group" style={{marginBottom:14}}>
          <label className="form-label">Message</label>
          <textarea className="p-textarea" style={{height:160}} value={body} onChange={e=>setBody(e.target.value)} placeholder="Write your message here... Use 'Dear Student' as greeting."/>
        </div>
        <button className="btn btn-gold" onClick={sendBulk} disabled={sending||!subject||!body}>{sending?"Sending...":"Send Message →"}</button>
      </div>
      {sent.length>0&&(
        <div style={{marginTop:20}}>
          <div style={{fontSize:11,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"2px",marginBottom:10,fontWeight:600}}>Sent History</div>
          <div className="tbl-wrap">
            {sent.map(s=>(
              <div key={s.id} style={{display:"grid",gridTemplateColumns:"1fr 1fr 80px 80px",padding:"11px 16px",borderBottom:"1px solid rgba(36,54,80,.5)",fontSize:13,alignItems:"center"}}>
                <span style={{fontWeight:500}}>{s.subject}</span>
                <span style={{fontSize:11,color:"var(--text3)"}}>To: {s.to}</span>
                <span style={{color:"var(--teal)",fontWeight:600}}>{s.count} sent</span>
                <span style={{fontSize:11,color:"var(--text3)"}}>{s.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StaffPage({toast}) {
  const staff = [
    {name:"KWIBUKA Erick",role:"Certification Manager & Head of Pedagogy",email:"erick@ifa.rw",phone:"+250785302957",status:"active",classes:2},
    {name:"Banda Clément",role:"Lead Teacher & Sound Technician",email:"clement@ifa.rw",phone:"+250785302957",status:"active",classes:3},
    {name:"Ingabire Germaine",role:"Secretary General & Communications",email:"germaine@ifa.rw",phone:"+250785302957",status:"active",classes:1},
    {name:"Kabandana Ghislaine",role:"Reception & Media Library Assistant",email:"ghislaine@ifa.rw",phone:"+250785302957",status:"active",classes:0},
    {name:"Iragi Michaël",role:"Cooperation Attaché & Legal Advisor",email:"michael@ifa.rw",phone:"+250785302957",status:"active",classes:0},
    {name:"Joas Irahoza",role:"Multi-skilled Agent",email:"joas@ifa.rw",phone:"+250785302957",status:"active",classes:0},
  ];
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div>
          <div style={{fontFamily:"var(--font-d)",fontSize:22}}>Staff Management</div>
          <div style={{fontSize:12,color:"var(--text3)",marginTop:2}}>Academy team members and roles</div>
        </div>
        <div style={{background:"var(--teal-dim)",border:"1px solid rgba(62,201,167,.25)",borderRadius:"var(--r-md)",padding:"6px 12px",fontSize:12,color:"var(--teal)",fontWeight:600}}>{staff.length} Active Staff</div>
      </div>
      <div className="staff-grid">
        {staff.map((s,i)=>(
          <div key={i} className="staff-card">
            <div className="staff-av">{initials(s.name.split(" ")[0],s.name.split(" ")[1])}</div>
            <div className="staff-name">{s.name}</div>
            <div className="staff-role">{s.role}</div>
            <div style={{display:"flex",gap:6,justifyContent:"center",flexWrap:"wrap",marginBottom:12}}>
              {s.classes>0&&<span style={{fontSize:10,background:"var(--gold-dim)",color:"var(--gold)",padding:"2px 8px",borderRadius:10,fontWeight:600}}>{s.classes} classes</span>}
              <span style={{fontSize:10,background:"var(--teal-dim)",color:"var(--teal)",padding:"2px 8px",borderRadius:10,fontWeight:600}}>Active</span>
            </div>
            <div style={{display:"flex",gap:6,justifyContent:"center"}}>
              <a href={`mailto:${s.email}`}><button className="btn btn-outline btn-xs">Email</button></a>
              <a href={`https://wa.me/${s.phone.replace(/\D/g,"")}`} target="_blank"><button className="btn btn-teal btn-xs">WhatsApp</button></a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CertificationsPage({enrollments,toast}) {
  const enrolled = enrollments.filter(e=>e.status==="enrolled");
  const [tracking,setTracking] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ifa_cert_tracking")||"[]"); } catch { return []; }
  });
  const [showModal,setShowModal] = useState(false);
  const [form,setForm] = useState({studentId:"",examDate:"",score:"",passed:false,notes:""});
  const save = t => { localStorage.setItem("ifa_cert_tracking",JSON.stringify(t)); setTracking(t); };
  const addResult = () => {
    if(!form.studentId) return;
    const student = enrollments.find(e=>e._id===form.studentId);
    const t = [...tracking,{id:Date.now(),studentName:`${student?.firstName||""} ${student?.lastName||""}`,cert:student?.certificationGoal||"",...form}];
    save(t); setShowModal(false); toast("Result recorded!","success");
    setForm({studentId:"",examDate:"",score:"",passed:false,notes:""});
  };
  const passRate = tracking.length > 0 ? Math.round((tracking.filter(t=>t.passed).length/tracking.length)*100) : 0;
  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:20}}>
        {[
          {label:"Enrolled Students",value:enrolled.length,color:"var(--teal)",ico:"📚"},
          {label:"Exam Results",value:tracking.length,color:"var(--blue)",ico:"📝"},
          {label:"Pass Rate",value:`${passRate}%`,color:"var(--gold)",ico:"🏆"},
        ].map((s,i)=>(
          <div key={i} className="card" style={{borderColor:s.color+"30"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
              <span style={{fontSize:18}}>{s.ico}</span>
              <span style={{fontSize:10,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"1.5px"}}>{s.label}</span>
            </div>
            <div style={{fontFamily:"var(--font-d)",fontSize:28,color:s.color}}>{s.value}</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div style={{fontFamily:"var(--font-d)",fontSize:18}}>Exam Results Tracker</div>
        <button className="btn btn-gold btn-sm" onClick={()=>setShowModal(true)}>+ Add Result</button>
      </div>
      <div className="tbl-wrap">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 80px 80px 80px",padding:"9px 16px",background:"var(--ink3)",borderBottom:"1px solid var(--border)",fontSize:10,fontWeight:600,letterSpacing:"1.5px",textTransform:"uppercase",color:"var(--text3)"}}>
          <span>Student</span><span>Certification</span><span>Score</span><span>Result</span><span>Date</span>
        </div>
        {tracking.length===0?(
          <div className="empty"><div className="empty-ico">📝</div><p className="empty-txt">No exam results yet</p><p className="empty-sub">Add exam results for enrolled students</p></div>
        ):tracking.map(t=>(
          <div key={t.id} style={{display:"grid",gridTemplateColumns:"1fr 1fr 80px 80px 80px",padding:"12px 16px",borderBottom:"1px solid rgba(36,54,80,.5)",fontSize:13,alignItems:"center"}}>
            <span style={{fontWeight:500}}>{t.studentName}</span>
            <span style={{fontSize:12,color:"var(--gold)"}}>{t.cert}</span>
            <span style={{fontWeight:600}}>{t.score||"—"}</span>
            <span><span className="pill" style={{background:t.passed?"var(--teal-dim)":"var(--rose-dim)",color:t.passed?"var(--teal)":"var(--rose)"}}>{t.passed?"Passed":"Failed"}</span></span>
            <span style={{fontSize:11,color:"var(--text3)"}}>{t.examDate||"—"}</span>
          </div>
        ))}
      </div>
      {showModal&&(
        <div className="modal-bg" onClick={()=>setShowModal(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-title">Add Exam Result</div>
            <div className="modal-sub">Record a student's certification exam result</div>
            <div className="pay-form">
              <div className="form-group" style={{gridColumn:"span 2"}}>
                <label className="form-label">Student</label>
                <select className="form-select" value={form.studentId} onChange={e=>setForm({...form,studentId:e.target.value})}>
                  <option value="">Select student...</option>
                  {enrollments.map(e=><option key={e._id} value={e._id}>{e.firstName} {e.lastName} — {e.certificationGoal}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Exam Date</label>
                <input className="form-input" type="date" value={form.examDate} onChange={e=>setForm({...form,examDate:e.target.value})}/>
              </div>
              <div className="form-group">
                <label className="form-label">Score</label>
                <input className="form-input" placeholder="e.g. 75/100" value={form.score} onChange={e=>setForm({...form,score:e.target.value})}/>
              </div>
              <div className="form-group" style={{gridColumn:"span 2"}}>
                <label className="form-label">Result</label>
                <div style={{display:"flex",gap:10}}>
                  <button className="btn btn-sm" style={{background:form.passed?"var(--teal-dim)":"transparent",color:form.passed?"var(--teal)":"var(--text2)",border:`1px solid ${form.passed?"var(--teal)":"var(--border)"}`}} onClick={()=>setForm({...form,passed:true})}>✓ Passed</button>
                  <button className="btn btn-sm" style={{background:!form.passed?"var(--rose-dim)":"transparent",color:!form.passed?"var(--rose)":"var(--text2)",border:`1px solid ${!form.passed?"var(--rose)":"var(--border)"}`}} onClick={()=>setForm({...form,passed:false})}>✕ Failed</button>
                </div>
              </div>
              <div className="form-group" style={{gridColumn:"span 2"}}>
                <label className="form-label">Notes</label>
                <input className="form-input" placeholder="Optional notes..." value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/>
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn btn-outline" onClick={()=>setShowModal(false)}>Cancel</button>
              <button className="btn btn-gold" onClick={addResult}>Save Result</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsPage({toast}) {
  const [pwd,setPwd] = useState({current:"",newPwd:"",confirm:""});
  const [info,setInfo] = useState({name:"International French Academy",email:"frenchacademyinternational@gmail.com",phone:"+250 785 302 957",address:"Norrsken House, Kigali, Rwanda",website:"french-app-new.vercel.app"});
  const changePwd = async () => {
    if(pwd.newPwd!==pwd.confirm){toast("Passwords don't match","error");return;}
    if(pwd.newPwd.length<8){toast("Password too short","error");return;}
    toast("Password change requires backend update — contact your developer","info");
    setPwd({current:"",newPwd:"",confirm:""});
  };
  return (
    <div>
      <div style={{fontFamily:"var(--font-d)",fontSize:22,marginBottom:4}}>Settings</div>
      <div style={{fontSize:12,color:"var(--text3)",marginBottom:20}}>Manage your academy portal settings</div>
      <div className="settings-grid">
        <div className="settings-section">
          <div className="settings-title">Academy Information</div>
          <div className="settings-sub">Basic information about your academy</div>
          {[{label:"Academy Name",key:"name"},{label:"Email",key:"email"},{label:"Phone",key:"phone"},{label:"Address",key:"address"},{label:"Website",key:"website"}].map(f=>(
            <div key={f.key} className="form-group" style={{marginBottom:12}}>
              <label className="form-label">{f.label}</label>
              <input className="form-input" value={info[f.key]} onChange={e=>setInfo({...info,[f.key]:e.target.value})}/>
            </div>
          ))}
          <button className="btn btn-gold btn-sm" onClick={()=>toast("Info saved!","success")}>Save Changes</button>
        </div>
        <div className="settings-section">
          <div className="settings-title">Change Password</div>
          <div className="settings-sub">Update your admin portal password</div>
          {[{label:"Current Password",key:"current",value:pwd.current},{label:"New Password",key:"newPwd",value:pwd.newPwd},{label:"Confirm Password",key:"confirm",value:pwd.confirm}].map(f=>(
            <div key={f.key} className="form-group" style={{marginBottom:12}}>
              <label className="form-label">{f.label}</label>
              <input className="form-input" type="password" value={f.value} onChange={e=>setPwd({...pwd,[f.key]:e.target.value})}/>
            </div>
          ))}
          <button className="btn btn-gold btn-sm" onClick={changePwd}>Update Password</button>
        </div>
        <div className="settings-section">
          <div className="settings-title">Quick Links</div>
          <div className="settings-sub">Important links for your academy</div>
          {[
            {label:"Live Website",url:"https://french-app-new.vercel.app",ico:"🌐"},
            {label:"Admin Dashboard",url:"https://french-academy-backend-six.vercel.app/admin",ico:"⚙️"},
            {label:"MongoDB Atlas",url:"https://cloud.mongodb.com",ico:"🗄️"},
            {label:"Vercel Dashboard",url:"https://vercel.com",ico:"▲"},
            {label:"GitHub Repo",url:"https://github.com/sergiokendrick12",ico:"🐙"},
          ].map((l,i)=>(
            <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:"var(--r-md)",border:"1px solid var(--border)",marginBottom:8,cursor:"pointer",transition:"all .15s"}} onMouseEnter={e=>e.currentTarget.style.borderColor="var(--gold)"} onMouseLeave={e=>e.currentTarget.style.borderColor="var(--border)"}>
                <span style={{fontSize:16}}>{l.ico}</span>
                <span style={{fontSize:13,color:"var(--text2)"}}>{l.label}</span>
                <span style={{marginLeft:"auto",fontSize:11,color:"var(--text3)"}}>↗</span>
              </div>
            </a>
          ))}
        </div>
        <div className="settings-section">
          <div className="settings-title">System Info</div>
          <div className="settings-sub">Current system status and info</div>
          {[
            {label:"Frontend",value:"french-app-new.vercel.app",color:"var(--teal)"},
            {label:"Backend",value:"french-academy-backend-six.vercel.app",color:"var(--teal)"},
            {label:"Database",value:"MongoDB Atlas — Connected",color:"var(--teal)"},
            {label:"Email",value:"Gmail SMTP — Active",color:"var(--teal)"},
            {label:"Version",value:"IFA Admin v2.0",color:"var(--gold)"},
          ].map((s,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:"1px solid rgba(36,54,80,.5)"}}>
              <span style={{fontSize:12,color:"var(--text3)"}}>{s.label}</span>
              <span style={{fontSize:11,fontWeight:600,color:s.color}}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DetailPanel({e,onClose,onUpdate,onDelete,toast}) {
  const [tab,setTab] = useState("info");
  const [notes,setNotes] = useState(e.notes||"");
  const [subj,setSubj] = useState("Regarding your enrollment — IFA Kigali");
  const [body,setBody] = useState(`Dear ${e.firstName},\n\nThank you for your interest in the International French Academy.\n\n`);
  const [sending,setSending] = useState(false);
  const setStatus = async status => {
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
    if(!confirm(`Delete ${e.firstName} ${e.lastName}?`))return;
    await fetch("/api/admin/enrollments",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:e._id})});
    toast("Deleted","error"); onDelete(e._id);
  };
  return (
    <div className="panel">
      <div className="panel-top">
        <div className="panel-head">
          <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
            <div className="p-av">{initials(e.firstName,e.lastName)}</div>
            <div>
              <div className="p-name">{e.firstName} {e.lastName}</div>
              <div className="p-since">Since {fmtDate(e.createdAt)}</div>
              <div style={{marginTop:5}}><Pill status={e.status}/></div>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
      </div>
      <div className="ptabs">
        {[["info","Info"],["status","Status"],["notes","Notes"],["email","Email"]].map(([k,l])=>(
          <button key={k} className={`ptab${tab===k?" on":""}`} onClick={()=>setTab(k)}>{l}</button>
        ))}
      </div>
      <div className="pbody">
        {tab==="info"&&(
          <div>
            {[
              {ico:"👤",lbl:"Full Name",val:<>{e.firstName} {e.lastName}</>},
              {ico:"📧",lbl:"Email",val:<a href={`mailto:${e.email}`} className="info-link">{e.email}</a>},
              {ico:"📞",lbl:"Phone",val:<a href={`https://wa.me/${(e.phone||"").replace(/\D/g,"")}`} target="_blank" className="info-link">{e.phone}</a>},
              {ico:"🎯",lbl:"Certification Goal",val:<span style={{color:"var(--gold)",fontWeight:600}}>{e.certificationGoal}</span>},
            ].map((r,i)=>(
              <div key={i} className="info-row">
                <span className="info-ico">{r.ico}</span>
                <div><div className="info-lbl">{r.lbl}</div><div className="info-val">{r.val}</div></div>
              </div>
            ))}
            {e.message&&<div className="info-row"><span className="info-ico">💬</span><div><div className="info-lbl">Message</div><div className="info-val" style={{color:"var(--text2)",lineHeight:1.6}}>{e.message}</div></div></div>}
          </div>
        )}
        {tab==="status"&&(
          <div>
            <div className="sec-lbl">Update Status</div>
            <div className="st-grid">
              {Object.entries(S).map(([k,v])=>(
                <button key={k} className="st-opt" onClick={()=>setStatus(k)} style={{background:e.status===k?v.bg:"transparent",color:e.status===k?v.color:"var(--text2)",borderColor:e.status===k?v.color+"60":"var(--border)",fontWeight:e.status===k?600:400}}>{v.label}</button>
              ))}
            </div>
            <div style={{padding:"10px 12px",background:"var(--ink3)",borderRadius:"var(--r-md)",border:"1px solid var(--border)"}}>
              <div style={{fontSize:9,color:"var(--text3)",marginBottom:5,textTransform:"uppercase",letterSpacing:"1.5px"}}>Current</div>
              <Pill status={e.status}/>
            </div>
          </div>
        )}
        {tab==="notes"&&(
          <div>
            <div className="sec-lbl">Internal Notes</div>
            <textarea className="p-textarea" style={{height:100}} value={notes} onChange={ev=>setNotes(ev.target.value)} placeholder="Add notes about this student..."/>
            <button className="btn btn-gold btn-sm" style={{marginTop:8}} onClick={saveNotes}>Save Notes</button>
            {e.notes&&<div style={{marginTop:12,padding:"10px 12px",background:"var(--ink3)",borderRadius:"var(--r-md)",fontSize:13,color:"var(--text2)",lineHeight:1.6,borderLeft:"2px solid var(--gold)"}}>{e.notes}</div>}
          </div>
        )}
        {tab==="email"&&(
          <div>
            <div className="sec-lbl">Send Email</div>
            <p style={{fontSize:12,color:"var(--text3)",marginBottom:10}}>To: <span style={{color:"var(--gold)"}}>{e.email}</span></p>
            <div style={{fontSize:9,color:"var(--text3)",marginBottom:4,textTransform:"uppercase",letterSpacing:"1.5px"}}>Subject</div>
            <input className="p-input" value={subj} onChange={ev=>setSubj(ev.target.value)}/>
            <div style={{fontSize:9,color:"var(--text3)",marginBottom:4,textTransform:"uppercase",letterSpacing:"1.5px"}}>Message</div>
            <textarea className="p-textarea" style={{height:120}} value={body} onChange={ev=>setBody(ev.target.value)}/>
            <button className="btn btn-gold btn-sm" style={{marginTop:8}} onClick={sendEmail} disabled={sending}>{sending?"Sending...":"Send Email"}</button>
          </div>
        )}
      </div>
      <div className="pfoot">
        <a href={`https://wa.me/${(e.phone||"").replace(/\D/g,"")}`} target="_blank" style={{flex:1,textDecoration:"none"}}>
          <button className="btn btn-teal" style={{width:"100%",justifyContent:"center"}}>💬 WhatsApp</button>
        </a>
        <button className="btn btn-danger btn-sm" onClick={del}>Delete</button>
      </div>
    </div>
  );
}

function useBreakpoint() {
  const [bp,setBp] = useState("desktop");
  useEffect(()=>{
    const check=()=>{const w=window.innerWidth;setBp(w<=640?"mobile":w<=900?"tablet":"desktop");};
    check();window.addEventListener("resize",check);return()=>window.removeEventListener("resize",check);
  },[]);
  return bp;
}

export default function AdminDashboard() {
  const [authed,setAuthed] = useState(false);
  const [page,setPage] = useState("home"); // ← CHANGED to "home"
  const [enrollments,setEnrollments] = useState([]);
  const [stats,setStats] = useState({});
  const [loading,setLoading] = useState(false);
  const [filter,setFilter] = useState("all");
  const [search,setSearch] = useState("");
  const [selected,setSelected] = useState(null);
  const [sidebarOpen,setSidebarOpen] = useState(false);
  const {list:toasts,show:toast} = useToast();
  const bp = useBreakpoint();

  const payments = (() => { try { return JSON.parse(localStorage.getItem("ifa_payments")||"[]"); } catch { return []; } })();
  const tracking = (() => { try { return JSON.parse(localStorage.getItem("ifa_cert_tracking")||"[]"); } catch { return []; } })();

  const fetchData = useCallback(async()=>{
    setLoading(true);
    const p = new URLSearchParams();
    if(filter!=="all")p.set("status",filter);
    if(search)p.set("search",search);
    try {
      const r = await fetch(`/api/admin/enrollments?${p}`);
      if(r.status===401){setAuthed(false);return;}
      const d = await r.json();
      setEnrollments(d.enrollments||[]);setStats(d.stats||{});
    } catch{}
    finally{setLoading(false);}
  },[filter,search]);

  useEffect(()=>{if(authed)fetchData();},[authed,fetchData]);

  const handleUpdate = useCallback(upd=>{setEnrollments(l=>l.map(x=>x._id===upd._id?upd:x));setSelected(upd);fetchData();},[fetchData]);
  const handleDelete = useCallback(id=>{setEnrollments(l=>l.filter(x=>x._id!==id));setSelected(null);fetchData();},[fetchData]);
  const logout = async()=>{await fetch("/api/admin/login",{method:"DELETE"});setAuthed(false);};

  if(!authed) return <LoginPage onLogin={()=>setAuthed(true)}/>;

  const colsDef = {
    desktop:"220px 1fr 130px 150px 105px 85px 40px",
    tablet: "180px 1fr 130px 105px 85px 40px",
    mobile: "1fr 95px 40px",
  }[bp];

  const navItems = [
    {id:"home",          ico:"🏠", label:"Dashboard"},           // ← NEW
    {id:"enrollments",   ico:"👥", label:"Enrollments", badge:stats.new||0},
    {id:"analytics",     ico:"📊", label:"Analytics"},
    {id:"payments",      ico:"💰", label:"Payments"},
    {id:"schedule",      ico:"📅", label:"Schedule"},
    {id:"messages",      ico:"📧", label:"Messages"},
    {id:"staff",         ico:"👨‍🏫", label:"Staff"},
    {id:"certifications",ico:"🏆", label:"Certifications"},
    {id:"settings",      ico:"⚙️", label:"Settings"},
  ];

  const pageTitles = {
    home:"Dashboard",                                              // ← NEW
    enrollments:"Enrollments",analytics:"Analytics",payments:"Payments",
    schedule:"Schedule",messages:"Messages",staff:"Staff",
    certifications:"Certifications",settings:"Settings"
  };

  const statCards = [
    {label:"Total",     value:stats.total||0,    color:"var(--text)",  iconBg:"var(--gold-dim)",  ico:"👥"},
    {label:"New",       value:stats.new||0,      color:"var(--blue)",  iconBg:"var(--blue-dim)",  ico:"🆕"},
    {label:"Contacted", value:stats.contacted||0,color:"var(--amber)", iconBg:"var(--amber-dim)", ico:"📞"},
    {label:"Enrolled",  value:stats.enrolled||0, color:"var(--teal)",  iconBg:"var(--teal-dim)",  ico:"✅"},
    {label:"Cancelled", value:stats.cancelled||0,color:"var(--rose)",  iconBg:"var(--rose-dim)",  ico:"❌"},
  ];

  const mobileNavItems = [
    {id:"home",       ico:"🏠",label:"Home"},
    {id:"enrollments",ico:"👥",label:"Students"},
    {id:"analytics",  ico:"📊",label:"Analytics"},
    {id:"payments",   ico:"💰",label:"Payments"},
    {id:"settings",   ico:"⚙️",label:"Settings"},
  ];

  return (
    <><style>{CSS}</style>
    <div className={`overlay${sidebarOpen?" show":""}`} onClick={()=>setSidebarOpen(false)}/>
    <div className="shell">
      <aside className={`sidebar${sidebarOpen?" open":""}`}>
        <div className="sb-brand">
          <div className="sb-logo">🎓</div>
          <div>
            <div className="sb-name">International<br/>French Academy</div>
            <div className="sb-tag">Kigali · Rwanda</div>
          </div>
        </div>
        <nav className="sb-nav">
          <div className="sb-section">Overview</div>
          {navItems.slice(0,1).map(n=>(
            <button key={n.id} className={`nav-btn${page===n.id?" on":""}`} onClick={()=>{setPage(n.id);setSidebarOpen(false);}}>
              <span className="nav-ico">{n.ico}</span><span className="nav-lbl">{n.label}</span>
            </button>
          ))}
          <div className="sb-section">Management</div>
          {navItems.slice(1,3).map(n=>(
            <button key={n.id} className={`nav-btn${page===n.id?" on":""}`} onClick={()=>{setPage(n.id);setSidebarOpen(false);}}>
              <span className="nav-ico">{n.ico}</span>
              <span className="nav-lbl">{n.label}</span>
              {n.badge>0&&<span className="nav-badge">{n.badge}</span>}
            </button>
          ))}
          <div className="sb-section">Finance</div>
          {navItems.slice(3,4).map(n=>(
            <button key={n.id} className={`nav-btn${page===n.id?" on":""}`} onClick={()=>{setPage(n.id);setSidebarOpen(false);}}>
              <span className="nav-ico">{n.ico}</span><span className="nav-lbl">{n.label}</span>
            </button>
          ))}
          <div className="sb-section">Academy</div>
          {navItems.slice(4,8).map(n=>(
            <button key={n.id} className={`nav-btn${page===n.id?" on":""}`} onClick={()=>{setPage(n.id);setSidebarOpen(false);}}>
              <span className="nav-ico">{n.ico}</span><span className="nav-lbl">{n.label}</span>
            </button>
          ))}
          <div className="sb-section">System</div>
          {navItems.slice(8).map(n=>(
            <button key={n.id} className={`nav-btn${page===n.id?" on":""}`} onClick={()=>{setPage(n.id);setSidebarOpen(false);}}>
              <span className="nav-ico">{n.ico}</span><span className="nav-lbl">{n.label}</span>
            </button>
          ))}
          <div className="sb-section">Actions</div>
          <button className="nav-btn" onClick={()=>{exportCSV(enrollments);toast("CSV exported","success");}}>
            <span className="nav-ico">📥</span><span className="nav-lbl">Export CSV</span>
          </button>
          <button className="nav-btn" onClick={fetchData}>
            <span className="nav-ico">🔄</span><span className="nav-lbl">Refresh Data</span>
          </button>
        </nav>
        <div className="sb-foot">
          <div className="sb-user">
            <div className="u-av">A</div>
            <div><div className="u-name">Admin</div><div className="u-role">Academy Portal</div></div>
          </div>
          <button className="logout-btn" onClick={logout}>🚪 Sign Out</button>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <div className="tb-left">
            <button className="hbg" onClick={()=>setSidebarOpen(o=>!o)}>☰</button>
            <h1 className="tb-title">{pageTitles[page]}</h1>
          </div>
          <div className="tb-right">
            {page==="enrollments"&&<><button className="btn btn-outline btn-sm" onClick={()=>{exportCSV(enrollments);toast("Exported","success");}}>📥 Export</button><button className="btn btn-gold btn-sm" onClick={fetchData}>🔄 Refresh</button></>}
            {page==="home"&&<button className="btn btn-gold btn-sm" onClick={fetchData}>🔄 Refresh</button>}
          </div>
        </header>

        <main className="content">
          {page==="home"&&<HomeDashboard enrollments={enrollments} stats={stats} payments={payments} tracking={tracking} onNavigate={setPage}/>}
          {page==="enrollments"&&(
            <>
              <div className="stats-grid">
                {statCards.map((s,i)=>(
                  <div key={i} className="stat-card" style={{borderColor:i===0?"var(--border)":s.color+"25"}}>
                    <div className="stat-top"><div className="stat-ico" style={{background:s.iconBg}}>{s.ico}</div></div>
                    <div className="stat-val" style={{color:s.color}}>{s.value}</div>
                    <div className="stat-lbl">{s.label}</div>
                    <div className="stat-bar"><div className="stat-bar-fill" style={{width:stats.total?`${(s.value/stats.total)*100}%`:"0%",background:s.color}}/></div>
                  </div>
                ))}
              </div>
              <div className="filters">
                <div className="search-wrap">
                  <span className="search-ico">🔍</span>
                  <input className="search-in" placeholder="Search name, email, phone..." value={search} onChange={e=>setSearch(e.target.value)}/>
                </div>
                <div className="chips">
                  {["all","new","contacted","enrolled","cancelled"].map(f=>(
                    <button key={f} className={`chip${filter===f?" on":""}`} onClick={()=>setFilter(f)}>{f}</button>
                  ))}
                </div>
              </div>
              <div className="tbl-wrap">
                <div className="tbl-head" style={{"--cols":colsDef}}>
                  <span>Student</span>
                  {bp!=="mobile"&&<><span>Email</span><span>Phone</span><span>Certification</span></>}
                  <span>Status</span>
                  {bp==="desktop"&&<span>Date</span>}
                  <span/>
                </div>
                <div className="tbl-body">
                  {loading?(
                    <div className="empty"><div className="empty-ico">⏳</div><p className="empty-txt">Loading...</p></div>
                  ):enrollments.length===0?(
                    <div className="empty"><div className="empty-ico">📭</div><p className="empty-txt">No enrollments found</p><p className="empty-sub">Try adjusting your search or filter</p></div>
                  ):enrollments.map(row=>(
                    <div key={row._id} className={`tbl-row${selected?._id===row._id?" sel":""}`} style={{"--cols":colsDef}} onClick={()=>setSelected(selected?._id===row._id?null:row)}>
                      <div>
                        <div className="s-name">{row.firstName} {row.lastName}</div>
                        {bp==="mobile"&&<div className="s-sub">{row.certificationGoal}</div>}
                      </div>
                      {bp!=="mobile"&&<><div className="s-sub" style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{row.email}</div><div className="s-sub">{row.phone}</div><div><span className="cert-tag">{row.certificationGoal}</span></div></>}
                      <div><Pill status={row.status}/></div>
                      {bp==="desktop"&&<div style={{fontSize:11,color:"var(--text3)"}}>{fmtDate(row.createdAt)}</div>}
                      <div style={{display:"flex",justifyContent:"center"}}>
                        <button className="del-ico" onClick={ev=>{ev.stopPropagation();if(!confirm("Delete?"))return;fetch("/api/admin/enrollments",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:row._id})}).then(()=>{handleDelete(row._id);toast("Deleted","error");});}}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          {page==="analytics"&&<AnalyticsPage enrollments={enrollments} stats={stats}/>}
          {page==="payments"&&<PaymentsPage enrollments={enrollments} toast={toast}/>}
          {page==="schedule"&&<SchedulePage toast={toast}/>}
          {page==="messages"&&<MessagesPage enrollments={enrollments} toast={toast}/>}
          {page==="staff"&&<StaffPage toast={toast}/>}
          {page==="certifications"&&<CertificationsPage enrollments={enrollments} toast={toast}/>}
          {page==="settings"&&<SettingsPage toast={toast}/>}
        </main>

        <nav className="bnav">
          {mobileNavItems.map(n=>(
            <button key={n.id} className={`bn${page===n.id?" on":""}`} onClick={()=>setPage(n.id)}>
              <span className="bn-ico">{n.ico}</span>
              <span className="bn-lbl">{n.label}</span>
            </button>
          ))}
          <button className="bn" onClick={logout}>
            <span className="bn-ico">🚪</span>
            <span className="bn-lbl">Logout</span>
          </button>
        </nav>
      </div>

      {selected&&<DetailPanel e={selected} onClose={()=>setSelected(null)} onUpdate={handleUpdate} onDelete={handleDelete} toast={toast}/>}
    </div>
    <ToastTray list={toasts}/>
    </>
  );
}
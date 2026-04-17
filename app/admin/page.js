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
.pay-row{display:grid;grid-template-columns:1fr 1fr 1fr 1fr 120px;gap:12px;padding:12px 16px;align-items:center;border-bottom:1px solid rgba(36,54,80,.5);font-size:13px;}
.pay-head{background:var(--ink3);font-size:10px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:var(--text3);}
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

function useNotifications(enrollments) {
  const [read,setRead] = useState(()=>{ try { return JSON.parse(localStorage.getItem("ifa_notif_read")||"[]"); } catch { return []; } });
  const notifications = [...enrollments].sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).slice(0,10).map(e=>({id:e._id,message:`New enrollment: ${e.firstName} ${e.lastName}`,sub:e.certificationGoal,time:fmtDate(e.createdAt),type:"enrollment"}));
  const unread = notifications.filter(n=>!read.includes(n.id)).length;
  const markAllRead = () => { const ids=notifications.map(n=>n.id); localStorage.setItem("ifa_notif_read",JSON.stringify(ids)); setRead(ids); };
  return {notifications,unread,markAllRead};
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
        <div className="login-emblem" style={{padding:0,overflow:"hidden",width:80,height:80,borderRadius:"50%",margin:"0 auto 14px"}}><img src="/logo.png" alt="IFA Logo" style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"var(--r-lg)"}}/></div>
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
// 🏠 HOME DASHBOARD
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
          <button className="btn btn-outline btn-sm" onClick={()=>onNavigate("bulk-email")}>Send Message</button>
        </div>
      </div>

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

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
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

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
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
  const [payments,setPayments] = useState([]);
  useEffect(()=>{ fetch("/api/admin/payments").then(r=>r.json()).then(d=>setPayments(d.payments||[])); },[]);
  const months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const counts=months.map((_,i)=>enrollments.filter(e=>new Date(e.createdAt).getMonth()===i).length);
  const maxC=Math.max(...counts,1);
  const certMap={};
  enrollments.forEach(e=>{certMap[e.certificationGoal]=(certMap[e.certificationGoal]||0)+1;});
  const certs=Object.entries(certMap).sort((a,b)=>b[1]-a[1]).slice(0,8);
  const maxCert=certs[0]?.[1]||1;
  const avgPerMonth = enrollments.length > 0 ? (enrollments.length/12).toFixed(1) : 0;
  const thisMonth = counts[new Date().getMonth()];
  const totalRevenue = payments.filter(p=>p.status==="paid").reduce((a,p)=>a+p.amount,0);
  const pendingRevenue = payments.filter(p=>p.status==="pending").reduce((a,p)=>a+p.amount,0);
  const monthlyRevenue = months.map((_,i)=>payments.filter(p=>p.status==="paid"&&new Date(p.createdAt).getMonth()===i).reduce((a,p)=>a+p.amount,0));
  const maxRev = Math.max(...monthlyRevenue,1);
  const methodMap={};
  payments.forEach(p=>{methodMap[p.method]=(methodMap[p.method]||0)+p.amount;});
  const methods = Object.entries(methodMap).sort((a,b)=>b[1]-a[1]);
  const maxMethod = methods[0]?.[1]||1;
  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
        {[
          {label:"Total Students",value:stats.total||0,color:"var(--gold)",ico:"👥"},
          {label:"This Month",value:thisMonth,color:"var(--teal)",ico:"📅"},
          {label:"Avg/Month",value:avgPerMonth,color:"var(--blue)",ico:"📊"},
          {label:"Total Revenue",value:`${totalRevenue.toLocaleString()} RWF`,color:"var(--purple)",ico:"💰"},
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
      <div className="chart-card" style={{marginBottom:16}}>
        <div className="chart-title">Monthly Revenue</div>
        <div className="chart-sub">RWF collected per month</div>
        <div className="bar-wrap" style={{marginTop:14}}>
          {months.map((m,i)=>(
            <div key={m} className="bar-col-w">
              <span className="bar-v" style={{color:monthlyRevenue[i]?"var(--teal)":"var(--text3)",fontSize:8}}>{monthlyRevenue[i]?`${(monthlyRevenue[i]/1000).toFixed(0)}k`:""}</span>
              <div className="bar-col" style={{height:`${(monthlyRevenue[i]/maxRev)*100}%`,background:monthlyRevenue[i]?"linear-gradient(to top,var(--teal),#6ee7c7)":"var(--border)"}}/>
              <span className="bar-l">{m}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="a-grid" style={{marginBottom:16}}>
        <div className="chart-card">
          <div className="chart-title">Revenue vs Pending</div>
          <div className="chart-sub">Collected vs outstanding</div>
          <div style={{marginTop:14}}>
            {[{label:"Collected",value:totalRevenue,color:"var(--teal)"},{label:"Pending",value:pendingRevenue,color:"var(--amber)"}].map((s,i)=>(
              <div key={i} style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:12,color:"var(--text2)"}}>{s.label}</span>
                  <span style={{fontSize:12,fontWeight:600,color:s.color}}>{s.value.toLocaleString()} RWF</span>
                </div>
                <div style={{height:6,background:"var(--border)",borderRadius:3}}>
                  <div style={{height:"100%",borderRadius:3,background:s.color,width:`${(s.value/Math.max(totalRevenue+pendingRevenue,1))*100}%`,transition:"width .7s"}}/>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="chart-card">
          <div className="chart-title">Payment Methods</div>
          <div className="chart-sub">Revenue by payment method</div>
          <div style={{marginTop:14}}>
            {methods.length===0?<p style={{color:"var(--text3)",fontSize:13}}>No payment data yet.</p>:methods.map(([method,amount])=>(
              <div key={method} style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:12,color:"var(--text2)"}}>{method}</span>
                  <span style={{fontSize:12,fontWeight:600,color:"var(--gold)"}}>{amount.toLocaleString()} RWF</span>
                </div>
                <div style={{height:4,background:"var(--border)",borderRadius:2}}>
                  <div style={{height:"100%",borderRadius:2,background:"var(--gold)",width:`${(amount/maxMethod)*100}%`,transition:"width .7s"}}/>
                </div>
              </div>
            ))}
          </div>
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

  const fetchPayments = async () => {
    try { const r = await fetch("/api/admin/payments"); const d = await r.json(); setPayments(d.payments||[]); } catch {}
  };
  useEffect(()=>{ fetchPayments(); },[]);

  const addPayment = async () => {
    if(!form.studentId||!form.amount) return;
    const student = enrollments.find(e=>e._id===form.studentId);
    const body = {...form,amount:Number(form.amount),studentName:`${student?.firstName||""} ${student?.lastName||""}`};
    const r = await fetch("/api/admin/payments",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
    const d = await r.json();
    if(d.success){ fetchPayments(); setShowModal(false); toast("Payment recorded!","success"); setForm({studentId:"",amount:"",method:"Mobile Money",status:"paid",date:new Date().toISOString().split("T")[0],note:""}); }
  };

  const printReceipt = (p) => {
    const win = window.open("","_blank","width=800,height=600");
    win.document.write(`<!DOCTYPE html><html><head><title>Receipt — ${p.studentName}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:'Segoe UI',Arial,sans-serif;background:#fff;color:#1a1a2e;padding:40px;}.receipt{max-width:600px;margin:0 auto;border:2px solid #1a2e47;border-radius:12px;overflow:hidden;}.header{background:linear-gradient(135deg,#0d1b2a,#1a2e47);padding:28px 32px;text-align:center;}.academy-name{color:#fff;font-size:20px;font-weight:700;}.receipt-badge{display:inline-block;background:rgba(201,168,76,0.15);border:1px solid #c9a84c;color:#c9a84c;padding:4px 16px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-top:12px;}.body{padding:32px;}.amount-box{background:linear-gradient(135deg,#0d1b2a,#1a2e47);border-radius:10px;padding:20px 24px;text-align:center;margin-bottom:24px;}.amount-value{color:#c9a84c;font-size:36px;font-weight:900;}.details{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px;}.detail-item{background:#f8f4ee;border-radius:8px;padding:12px 16px;}.detail-label{font-size:10px;color:#6b7a8d;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:4px;}.detail-value{font-size:14px;font-weight:600;color:#1a1a2e;}.footer{background:#f8f4ee;padding:20px 32px;text-align:center;border-top:1px solid #ede8df;}.footer p{font-size:11px;color:#6b7a8d;line-height:1.8;}@media print{.no-print{display:none;}}</style></head><body><div class="receipt"><div class="header"><div class="academy-name">International French Academy</div><div class="receipt-badge">✓ Payment Receipt</div></div><div class="body"><div class="amount-box"><div style="color:rgba(255,255,255,0.5);font-size:10px;letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;">Amount Paid</div><div class="amount-value">${p.amount.toLocaleString()} RWF</div></div><div class="details"><div class="detail-item"><div class="detail-label">Student Name</div><div class="detail-value">${p.studentName}</div></div><div class="detail-item"><div class="detail-label">Status</div><div class="detail-value">${p.status.toUpperCase()}</div></div><div class="detail-item"><div class="detail-label">Method</div><div class="detail-value">${p.method}</div></div><div class="detail-item"><div class="detail-label">Date</div><div class="detail-value">${p.date}</div></div>${p.note?`<div class="detail-item" style="grid-column:span 2"><div class="detail-label">Note</div><div class="detail-value">${p.note}</div></div>`:""}</div></div><div class="footer"><p><strong>International French Academy</strong><br/>📍 Norrsken House · 📍 Sainte Famille, Kigali<br/>📧 frenchacademyinternational@gmail.com · 📞 +250 785 302 957</p></div></div><div class="no-print" style="text-align:center;margin-top:24px;"><button onclick="window.print()" style="background:#c9a84c;color:#1a1a2e;border:none;padding:12px 32px;border-radius:6px;font-size:14px;font-weight:700;cursor:pointer;">🖨️ Print / Save as PDF</button></div></body></html>`);
    win.document.close();
  };

  const delPayment = async (id) => {
    if(!confirm("Delete payment?"))return;
    await fetch("/api/admin/payments",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id})});
    fetchPayments(); toast("Deleted","error");
  };

  const [paySearch,setPaySearch] = useState("");
  const [payFilter,setPayFilter] = useState("all");
  const filtered = payments.filter(p=>{
    const matchSearch = p.studentName?.toLowerCase().includes(paySearch.toLowerCase());
    const matchFilter = payFilter==="all" || p.status===payFilter;
    return matchSearch && matchFilter;
  });
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
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:10}}>
        <div style={{fontFamily:"var(--font-d)",fontSize:18}}>Payment Records</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
          <div className="search-wrap" style={{minWidth:180}}>
            <span className="search-ico">🔍</span>
            <input className="search-in" placeholder="Search student..." value={paySearch} onChange={e=>setPaySearch(e.target.value)}/>
          </div>
          <div className="chips">
            {["all","paid","pending","partial"].map(f=>(
              <button key={f} className={`chip${payFilter===f?" on":""}`} onClick={()=>setPayFilter(f)}>{f}</button>
            ))}
          </div>
          <button className="btn btn-gold btn-sm" onClick={()=>setShowModal(true)}>+ Add Payment</button>
        </div>
      </div>
      <div className="tbl-wrap">
        <div className="pay-row pay-head"><span>Student</span><span>Amount</span><span>Method</span><span>Status</span><span>Date</span></div>
        {payments.length===0?(
          <div className="empty"><div className="empty-ico">💳</div><p className="empty-txt">No payments recorded</p><p className="empty-sub">Add your first payment record</p></div>
        ):filtered.map(p=>(
          <div key={p._id} className="pay-row" style={{cursor:"default"}}>
            <div style={{fontWeight:500}}>{p.studentName}</div>
            <div style={{color:"var(--gold)",fontWeight:600}}>{p.amount.toLocaleString()} RWF</div>
            <div style={{fontSize:12,color:"var(--text2)"}}>{p.method}</div>
            <div><Pill status={p.status} map={PAY_STATUS}/></div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:4}}>
              <span style={{fontSize:11,color:"var(--text3)"}}>{p.date}</span>
              <div style={{display:"flex",gap:4}}>
                <button className="btn btn-outline btn-xs" onClick={()=>printReceipt(p)} title="Print Receipt">🧾</button>
                <button className="del-ico" style={{opacity:1}} onClick={()=>delPayment(p._id)}>✕</button>
              </div>
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
  const [classes,setClasses] = useState([]);
  const [showModal,setShowModal] = useState(false);
  const [form,setForm] = useState({name:"",day:"",time:"",level:"",teacher:"",students:"",room:""});

  useEffect(()=>{ fetchClasses(); },[]);

  const fetchClasses = async () => {
    try { const r = await fetch("/api/admin/schedule"); const d = await r.json(); setClasses(d.classes||[]); } catch {}
  };

  const addClass = async () => {
    if(!form.name||!form.day) return;
    const r = await fetch("/api/admin/schedule",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...form,students:Number(form.students)||0})});
    const d = await r.json();
    if(d.success){ fetchClasses(); setShowModal(false); toast("Class added!","success"); setForm({name:"",day:"",time:"",level:"",teacher:"",students:"",room:""}); }
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
          <div key={c._id} className="class-card">
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
              <button className="btn btn-outline btn-xs" onClick={async()=>{await fetch("/api/admin/schedule",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:c._id})});fetchClasses();toast("Class removed","error");}}>Remove</button>
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

// ═══════════════════════════════════════════
// 📧 MESSAGES INBOX (from enrollment form)
// ═══════════════════════════════════════════
function BulkEmailPage({enrollments, toast}) {
  const [form, setForm] = useState({ subject:"", message:"", audience:"all" });
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);
  const [preview, setPreview] = useState(false);

  const audienceCount = {
    all: enrollments.length,
    enrolled: enrollments.filter(e=>e.status==="enrolled").length,
    contacted: enrollments.filter(e=>e.status==="contacted").length,
    new: enrollments.filter(e=>e.status==="new").length,
  };

  const send = async () => {
    if(!form.subject||!form.message){ toast("Subject and message required","error"); return; }
    if(!confirm(`Send email to ${audienceCount[form.audience]} students?`)) return;
    setSending(true); setResult(null);
    try {
      const r = await fetch("/api/admin/bulk-email",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
      const d = await r.json();
      if(d.success){ setResult(d); toast(`✅ Sent to ${d.sent} students!`,"success"); setForm({subject:"",message:"",audience:"all"}); }
      else toast(d.error||"Error sending","error");
    } catch { toast("Error sending emails","error"); }
    finally { setSending(false); }
  };

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{fontFamily:"var(--font-d)",fontSize:22}}>Bulk Email</div>
          <div style={{fontSize:12,color:"var(--text3)",marginTop:2}}>Send email to all or selected students at once</div>
        </div>
      </div>

      {result&&(
        <div style={{background:"rgba(62,201,167,0.08)",border:"1px solid rgba(62,201,167,0.25)",borderRadius:"var(--r-lg)",padding:"16px 20px",marginBottom:20,display:"flex",gap:16,flexWrap:"wrap"}}>
          <div style={{textAlign:"center",flex:1}}>
            <div style={{fontFamily:"var(--font-d)",fontSize:28,color:"var(--teal)"}}>{result.sent}</div>
            <div style={{fontSize:11,color:"var(--teal)",textTransform:"uppercase",letterSpacing:"1px"}}>Sent</div>
          </div>
          <div style={{textAlign:"center",flex:1}}>
            <div style={{fontFamily:"var(--font-d)",fontSize:28,color:"var(--rose)"}}>{result.failed}</div>
            <div style={{fontSize:11,color:"var(--rose)",textTransform:"uppercase",letterSpacing:"1px"}}>Failed</div>
          </div>
          <div style={{textAlign:"center",flex:1}}>
            <div style={{fontFamily:"var(--font-d)",fontSize:28,color:"var(--gold)"}}>{result.total}</div>
            <div style={{fontSize:11,color:"var(--gold)",textTransform:"uppercase",letterSpacing:"1px"}}>Total</div>
          </div>
        </div>
      )}

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        <div style={{background:"var(--ink2)",border:"1px solid var(--border)",borderRadius:"var(--r-lg)",padding:"20px"}}>
          <div style={{fontFamily:"var(--font-d)",fontSize:16,marginBottom:16}}>Compose Email</div>

          <div className="form-group" style={{marginBottom:14}}>
            <label className="form-label">Audience</label>
            <select className="form-select" value={form.audience} onChange={e=>setForm(f=>({...f,audience:e.target.value}))}>
              <option value="all">Everyone ({audienceCount.all} students)</option>
              <option value="enrolled">Enrolled only ({audienceCount.enrolled} students)</option>
              <option value="contacted">Contacted only ({audienceCount.contacted} students)</option>
              <option value="new">New only ({audienceCount.new} students)</option>
            </select>
          </div>

          <div className="form-group" style={{marginBottom:14}}>
            <label className="form-label">Subject</label>
            <input className="form-input" placeholder="e.g. Important update from IFA" value={form.subject} onChange={e=>setForm(f=>({...f,subject:e.target.value}))}/>
          </div>

          <div className="form-group" style={{marginBottom:16}}>
            <label className="form-label">Message</label>
            <textarea className="form-input" rows={8} placeholder="Write your message here...&#10;&#10;Each student will receive this email personally addressed to them." value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} style={{resize:"vertical"}}/>
          </div>

          <div style={{display:"flex",gap:8}}>
            <button className="btn btn-outline" onClick={()=>setPreview(v=>!v)} style={{flex:1}}>
              {preview?"✕ Hide Preview":"👁 Preview Email"}
            </button>
            <button className="btn btn-gold" onClick={send} disabled={sending} style={{flex:1}}>
              {sending?`Sending...`:`📧 Send to ${audienceCount[form.audience]} Students`}
            </button>
          </div>
        </div>

        <div style={{background:"var(--ink2)",border:"1px solid var(--border)",borderRadius:"var(--r-lg)",padding:"20px"}}>
          <div style={{fontFamily:"var(--font-d)",fontSize:16,marginBottom:16}}>
            {preview?"Email Preview":"Recipient List"}
          </div>

          {preview?(
            <div style={{background:"#fff",borderRadius:8,padding:20,color:"#1a1a2e"}}>
              <div style={{background:"#c9a84c",padding:"16px",borderRadius:"8px 8px 0 0",textAlign:"center",marginBottom:16}}>
                <div style={{fontWeight:700,fontSize:16,color:"#0d1b2a"}}>International French Academy</div>
                <div style={{fontSize:12,color:"#0d1b2a"}}>Kigali, Rwanda</div>
              </div>
              <p style={{fontSize:14,marginBottom:8}}>Dear <strong>Student Name</strong>,</p>
              <p style={{fontSize:13,color:"#555",lineHeight:1.7,whiteSpace:"pre-wrap",marginBottom:16}}>{form.message||"Your message will appear here..."}</p>
              <div style={{background:"rgba(201,168,76,0.1)",borderLeft:"3px solid #c9a84c",padding:"12px",borderRadius:4,fontSize:12,color:"#555"}}>
                <div style={{fontWeight:700,color:"#c9a84c",marginBottom:4}}>International French Academy</div>
                <div>📧 frenchacademyinternational@gmail.com</div>
                <div>📱 +250 785 302 957</div>
                <div>📍 Norrsken House · Sainte Famille, Kigali</div>
              </div>
              <p style={{fontSize:12,color:"#888",marginTop:12}}>— The IFA Team 🇫🇷</p>
            </div>
          ):(
            <div style={{maxHeight:400,overflowY:"auto"}}>
              {enrollments.filter(e=> form.audience==="all" ? true : e.status===form.audience).map((e,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid rgba(36,54,80,.5)"}}>
                  <div style={{width:32,height:32,borderRadius:"50%",background:"rgba(201,168,67,0.1)",border:"1px solid rgba(201,168,67,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"var(--gold)",flexShrink:0}}>
                    {e.firstName?.[0]}{e.lastName?.[0]}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:12,fontWeight:500,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{e.firstName} {e.lastName}</div>
                    <div style={{fontSize:11,color:"var(--text3)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{e.email}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MessagesPage({enrollments, toast}) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [read, setRead] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ifa_read_msgs")||"[]"); } catch { return []; }
  });

  const messages = enrollments
    .filter(e => e.message && e.message.trim() !== "")
    .sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));

  const markRead = (id) => {
    const updated = [...new Set([...read, id])];
    setRead(updated);
    try { localStorage.setItem("ifa_read_msgs", JSON.stringify(updated)); } catch {}
  };

  const markAllRead = () => {
    const ids = messages.map(m => m._id);
    const updated = [...new Set([...read, ...ids])];
    setRead(updated);
    try { localStorage.setItem("ifa_read_msgs", JSON.stringify(updated)); } catch {}
    toast("All marked as read ✓", "success");
  };

  const filtered = messages.filter(m => {
    const isRead = read.includes(m._id);
    if(filter === "unread" && isRead) return false;
    if(filter === "read" && !isRead) return false;
    if(search && !`${m.firstName} ${m.lastName} ${m.message}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const unreadCount = messages.filter(m => !read.includes(m._id)).length;
  const STATUS_COLORS = {
    new:       {color:"#4d9de0", bg:"rgba(77,157,224,.12)"},
    contacted: {color:"#e8a030", bg:"rgba(232,160,48,.12)"},
    enrolled:  {color:"#3ec9a7", bg:"rgba(62,201,167,.12)"},
    cancelled: {color:"#e05c7a", bg:"rgba(224,92,122,.12)"},
  };

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{fontFamily:"var(--font-d)",fontSize:22,display:"flex",alignItems:"center",gap:10}}>
            Messages
            {unreadCount>0&&<span style={{background:"var(--rose)",color:"#fff",borderRadius:20,padding:"2px 10px",fontSize:12,fontWeight:700}}>{unreadCount} new</span>}
          </div>
          <div style={{fontSize:12,color:"var(--text3)",marginTop:2}}>Student messages from enrollment form</div>
        </div>
        {unreadCount>0&&<button className="btn btn-outline btn-sm" onClick={markAllRead}>✓ Mark all as read</button>}
      </div>
      <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
        <input className="form-input" placeholder="🔍 Search messages..." value={search} onChange={e=>setSearch(e.target.value)} style={{flex:1,minWidth:200,maxWidth:320}}/>
        <div style={{display:"flex",gap:0,background:"var(--ink3)",borderRadius:"var(--r-md)",padding:4,border:"1px solid var(--border)"}}>
          {[{id:"all",label:"All"},{id:"unread",label:"Unread"},{id:"read",label:"Read"}].map(f=>(
            <button key={f.id} onClick={()=>setFilter(f.id)} style={{padding:"6px 16px",borderRadius:"var(--r-sm)",border:"none",fontFamily:"var(--font-b)",fontSize:12,fontWeight:500,cursor:"pointer",background:filter===f.id?"var(--gold)":"transparent",color:filter===f.id?"var(--ink)":"var(--text2)",transition:"all .15s"}}>
              {f.label}{f.id==="unread"&&unreadCount>0?` (${unreadCount})`:""}
            </button>
          ))}
        </div>
      </div>
      {filtered.length===0?(
        <div className="card"><div className="empty"><div className="empty-ico">💬</div><p className="empty-txt">{messages.length===0?"No messages yet":"No messages match your filter"}</p></div></div>
      ):filtered.map((m,i)=>{
        const isRead = read.includes(m._id);
        const sc = STATUS_COLORS[m.status]||STATUS_COLORS.new;
        return (
          <div key={i} onClick={()=>markRead(m._id)} style={{background:"var(--ink2)",border:`1px solid ${isRead?"var(--border)":"rgba(201,168,67,0.35)"}`,borderRadius:"var(--r-lg)",padding:"16px 20px",marginBottom:10,cursor:"pointer",transition:"all .2s",position:"relative"}}>
            {!isRead&&<div style={{position:"absolute",top:16,right:16,width:8,height:8,borderRadius:"50%",background:"var(--gold)"}}/>}
            <div style={{display:"flex",alignItems:"flex-start",gap:14,flexWrap:"wrap"}}>
              <div style={{width:42,height:42,borderRadius:"50%",background:"rgba(201,168,67,0.1)",border:"1.5px solid rgba(201,168,67,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-d)",fontSize:16,color:"var(--gold)",flexShrink:0}}>
                {m.firstName?.[0]}{m.lastName?.[0]}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
                  <span style={{fontWeight:600,fontSize:14}}>{m.firstName} {m.lastName}</span>
                  <span style={{background:sc.bg,color:sc.color,padding:"1px 8px",borderRadius:10,fontSize:10,fontWeight:700,textTransform:"uppercase"}}>{m.status}</span>
                  {!isRead&&<span style={{background:"rgba(201,168,67,0.12)",color:"var(--gold)",padding:"1px 8px",borderRadius:10,fontSize:10,fontWeight:700}}>NEW</span>}
                </div>
                <div style={{fontSize:13,color:"var(--text2)",lineHeight:1.6,marginBottom:8,fontStyle:"italic"}}>"{m.message}"</div>
                <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                  <span style={{fontSize:11,color:"var(--text3)"}}>🎯 {m.certificationGoal}</span>
                  <span style={{fontSize:11,color:"var(--text3)"}}>📅 {new Date(m.createdAt).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})}</span>
                </div>
                <div style={{display:"flex",gap:8,marginTop:10,flexWrap:"wrap"}}>
                  <a href={`https://wa.me/${(m.phone||"").replace(/\D/g,"")}`} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}>
                    <button className="btn btn-teal btn-xs">💬 WhatsApp</button>
                  </a>
                  <a href={`mailto:${m.email}?subject=Re: Your enrollment at IFA&body=Dear ${m.firstName},%0D%0A%0D%0A`} style={{textDecoration:"none"}}>
                    <button className="btn btn-outline btn-xs">📧 Reply by Email</button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
"use client";
import { useState, useEffect, useRef } from "react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#0b0e1a;--bg2:#111527;--bg3:#161b30;
  --border:rgba(255,255,255,0.07);--border2:rgba(255,255,255,0.12);
  --text:#f0f2ff;--text2:#9aa0be;--text3:#5a6080;
  --purple:#9b8dff;--teal:#2dd4bf;--rose:#fb7aac;
  --blue:#60a5fa;--amber:#fbbf24;--green:#4ade80;
  --g-blue:linear-gradient(135deg,#0f2a50,#163d7a);
  --g-teal:linear-gradient(135deg,#0d3d35,#0f5e4e);
  --g-green:linear-gradient(135deg,#0d3320,#0f4d2e);
  --g-amber:linear-gradient(135deg,#3a1f00,#5e3500);
}
*{font-family:'DM Sans',sans-serif;}
body{background:var(--bg);color:var(--text);min-height:100vh;}
::-webkit-scrollbar{width:6px;height:6px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:3px;}

.login-wrap{min-height:100vh;background:var(--bg);display:flex;align-items:center;justify-content:center;padding:20px;position:relative;overflow:hidden;}
.login-glow{position:absolute;border-radius:50%;filter:blur(80px);pointer-events:none;}
.login-glow.a{width:400px;height:400px;background:rgba(96,165,250,0.1);top:-100px;right:-100px;}
.login-glow.b{width:300px;height:300px;background:rgba(45,212,191,0.08);bottom:-50px;left:-50px;}
.tricolor{position:absolute;top:0;left:0;right:0;height:3px;display:flex;}
.tc1{flex:1;background:#002395;}.tc2{flex:1;background:#fff;}.tc3{flex:1;background:#ED2939;}
.login-card{background:var(--bg2);border:1px solid var(--border2);border-radius:24px;padding:44px 40px;width:100%;max-width:420px;position:relative;z-index:1;}
.login-logo-ring{width:70px;height:70px;border-radius:50%;background:rgba(96,165,250,0.1);border:2px solid rgba(96,165,250,0.3);display:flex;align-items:center;justify-content:center;font-size:30px;margin:0 auto 20px;}
.login-title{font-family:'Sora',sans-serif;font-size:26px;font-weight:800;color:var(--text);text-align:center;margin-bottom:6px;}
.login-sub{font-size:11px;color:var(--text3);text-align:center;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:28px;}
.login-lbl{font-size:10px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:var(--text3);margin-bottom:8px;}
.login-in{width:100%;padding:13px 16px;background:rgba(255,255,255,0.05);border:1px solid var(--border2);border-radius:10px;color:var(--text);font-size:14px;outline:none;margin-bottom:16px;transition:border-color .2s;}
.login-in:focus{border-color:var(--blue);}
.login-in::placeholder{color:var(--text3);}
.login-err{font-size:12px;color:var(--rose);margin-bottom:12px;text-align:center;}
.login-btn{width:100%;padding:14px;background:linear-gradient(135deg,#2563eb,#60a5fa);color:#fff;border:none;border-radius:10px;font-family:'Sora',sans-serif;font-size:14px;font-weight:700;cursor:pointer;transition:opacity .2s,transform .2s;}
.login-btn:hover{opacity:0.9;transform:translateY(-1px);}
.login-btn:disabled{opacity:0.6;cursor:not-allowed;transform:none;}
.login-hint{font-size:11px;color:var(--text3);text-align:center;margin-top:14px;line-height:1.6;}

.snav{background:var(--bg2);border-bottom:1px solid var(--border);height:62px;padding:0 28px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100;}
.snav-logo{display:flex;align-items:center;gap:12px;}
.snav-badge{width:40px;height:40px;border-radius:10px;background:linear-gradient(135deg,#2563eb,#60a5fa);display:flex;align-items:center;justify-content:center;font-family:'Sora',sans-serif;font-size:14px;font-weight:800;color:#fff;}
.snav-name{font-family:'Sora',sans-serif;font-size:14px;font-weight:700;color:var(--text);}
.snav-sub{font-size:10px;color:var(--text3);letter-spacing:1px;text-transform:uppercase;}
.snav-right{display:flex;align-items:center;gap:10px;}
.staff-chip{display:flex;align-items:center;gap:8px;background:rgba(96,165,250,0.1);border:1px solid rgba(96,165,250,0.2);border-radius:999px;padding:6px 14px 6px 8px;cursor:pointer;}
.staff-avatar{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#2563eb,#60a5fa);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;}
.staff-chip-name{font-size:13px;font-weight:500;color:var(--text);}
.logout-btn{background:rgba(255,255,255,0.05);border:1px solid var(--border2);color:var(--text2);padding:8px 18px;border-radius:8px;font-size:12px;cursor:pointer;font-family:'DM Sans',sans-serif;}
.logout-btn:hover{background:rgba(255,255,255,0.1);color:var(--text);}

.scontent{max-width:100%;padding:28px 32px 60px;}

.welcome-card{background:linear-gradient(135deg,#0f2a50 0%,#163d7a 50%,#0f3d35 100%);border:1px solid rgba(96,165,250,0.2);border-radius:18px;padding:24px 28px;display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;position:relative;overflow:hidden;gap:16px;}
.welcome-card::before{content:'';position:absolute;right:-60px;top:-60px;width:200px;height:200px;border-radius:50%;background:rgba(96,165,250,0.08);}
.welcome-hi{font-family:'Sora',sans-serif;font-size:22px;font-weight:800;color:var(--text);margin-bottom:6px;}
.welcome-meta{display:flex;flex-wrap:wrap;gap:10px 16px;}
.welcome-meta span{font-size:12px;color:rgba(255,255,255,0.5);}
.active-pill{background:rgba(74,222,128,0.12);border:1px solid rgba(74,222,128,0.25);color:var(--green);padding:8px 18px;border-radius:999px;font-size:12px;font-weight:700;display:flex;align-items:center;gap:7px;white-space:nowrap;z-index:1;flex-shrink:0;}
.a-dot{width:7px;height:7px;border-radius:50%;background:var(--green);}

.tabs-row{display:flex;gap:4px;background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:5px;margin-bottom:22px;overflow-x:auto;scrollbar-width:none;}
.tabs-row::-webkit-scrollbar{display:none;}
.tab-btn{flex-shrink:0;padding:9px 16px;border-radius:10px;border:none;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:500;cursor:pointer;white-space:nowrap;transition:all .18s;color:var(--text3);background:transparent;}
.tab-btn.active{background:linear-gradient(135deg,#2563eb,#60a5fa);color:#fff;}
.tab-btn:hover:not(.active){color:var(--text);background:rgba(255,255,255,0.05);}

.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:20px;}
.stat-card{border-radius:16px;padding:20px;border:1px solid rgba(255,255,255,0.07);transition:transform .2s;}
.stat-card:hover{transform:translateY(-3px);}
.stat-card.blue{background:var(--g-blue);}
.stat-card.teal{background:var(--g-teal);}
.stat-card.green{background:var(--g-green);}
.stat-card.amber{background:var(--g-amber);}
.stat-ico{font-size:22px;margin-bottom:12px;}
.stat-lbl{font-size:9px;letter-spacing:1.8px;text-transform:uppercase;color:rgba(255,255,255,0.45);margin-bottom:6px;}
.stat-val{font-family:'Sora',sans-serif;font-size:26px;font-weight:800;margin-bottom:4px;line-height:1;}
.stat-card.blue .stat-val{color:var(--blue);}
.stat-card.teal .stat-val{color:var(--teal);}
.stat-card.green .stat-val{color:var(--green);}
.stat-card.amber .stat-val{color:var(--amber);}
.stat-sub{font-size:11px;color:rgba(255,255,255,0.35);}

.section{background:var(--bg2);border:1px solid var(--border);border-radius:16px;padding:22px;margin-bottom:14px;}
.section-title{font-family:'Sora',sans-serif;font-size:15px;font-weight:700;color:var(--text);margin-bottom:4px;}
.section-sub{font-size:12px;color:var(--text3);margin-bottom:18px;}

.sched-item{background:var(--bg3);border:1px solid var(--border);border-radius:12px;padding:14px 18px;display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;gap:12px;}
.sched-day{font-size:10px;color:var(--blue);font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:3px;}
.sched-name{font-size:14px;font-weight:600;color:var(--text);}
.sched-meta{font-size:11px;color:var(--text3);margin-top:3px;}

.student-item{background:var(--bg3);border:1px solid var(--border);border-radius:12px;padding:14px 18px;display:flex;align-items:center;gap:14px;margin-bottom:8px;}
.student-ava{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#2563eb,#60a5fa);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff;flex-shrink:0;}
.student-name{font-size:14px;font-weight:600;}
.student-meta{font-size:11px;color:var(--text3);margin-top:2px;}

.att-form{background:var(--bg3);border:1px solid rgba(96,165,250,0.2);border-radius:14px;padding:18px;margin-bottom:16px;}
.att-select{width:100%;padding:10px 14px;background:rgba(255,255,255,0.05);border:1px solid var(--border2);border-radius:8px;color:var(--text);font-size:13px;outline:none;margin-bottom:10px;}
.att-select option{background:#111527;}
.att-date{width:100%;padding:10px 14px;background:rgba(255,255,255,0.05);border:1px solid var(--border2);border-radius:8px;color:var(--text);font-size:13px;outline:none;margin-bottom:10px;}
.att-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:8px;margin-bottom:12px;}
.att-student-row{background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:10px 14px;display:flex;align-items:center;justify-content:space-between;gap:8px;}
.att-name{font-size:12px;font-weight:500;flex:1;}
.att-status-select{padding:5px 8px;background:rgba(255,255,255,0.05);border:1px solid var(--border2);border-radius:6px;color:var(--text);font-size:11px;outline:none;}
.submit-att-btn{background:linear-gradient(135deg,#2563eb,#60a5fa);color:#fff;border:none;padding:11px 24px;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;font-family:'Sora',sans-serif;}
.submit-att-btn:disabled{opacity:0.5;cursor:not-allowed;}

.tbl-head{display:grid;padding:8px 14px;font-size:10px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;color:var(--text3);margin-bottom:4px;}
.tbl-row{display:grid;background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:12px 14px;margin-bottom:6px;align-items:center;font-size:13px;color:var(--text);}
.pill{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:999px;font-size:11px;font-weight:600;}
.pdot{width:5px;height:5px;border-radius:50%;}

.profile-avatar-big{width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#2563eb,#60a5fa);display:flex;align-items:center;justify-content:center;font-family:'Sora',sans-serif;font-size:28px;font-weight:800;color:#fff;margin:0 auto 16px;}
.profile-in{width:100%;padding:11px 14px;background:rgba(255,255,255,0.05);border:1px solid var(--border2);border-radius:10px;color:var(--text);font-size:14px;outline:none;transition:border-color .2s;margin-bottom:14px;}
.profile-in:focus{border-color:var(--blue);}
.profile-in:disabled{opacity:0.5;cursor:not-allowed;}
.profile-lbl{font-size:10px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:var(--text3);margin-bottom:6px;}
.save-btn{background:linear-gradient(135deg,#2563eb,#60a5fa);color:#fff;border:none;padding:12px 28px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;}
.save-btn:disabled{opacity:0.5;cursor:not-allowed;}

.empty-state{text-align:center;padding:40px 20px;color:var(--text3);}
.empty-ico{font-size:36px;margin-bottom:12px;opacity:0.5;}
.empty-state p{font-size:14px;}

.toast-wrap{position:fixed;top:80px;right:20px;z-index:999;display:flex;flex-direction:column;gap:8px;}
.toast{padding:12px 18px;border-radius:10px;font-size:13px;font-weight:500;animation:slideIn .3s ease;}
.toast.success{background:rgba(74,222,128,0.15);border:1px solid rgba(74,222,128,0.3);color:var(--green);}
.toast.error{background:rgba(251,122,172,0.15);border:1px solid rgba(251,122,172,0.3);color:var(--rose);}
@keyframes slideIn{from{transform:translateX(100px);opacity:0;}to{transform:translateX(0);opacity:1;}}

.att-session{margin-bottom:12px;}
.att-session-header{padding:10px 14px;background:var(--bg3);border-radius:10px 10px 0 0;border:1px solid var(--border);border-bottom:none;display:flex;justify-content:space-between;align-items:center;}
.att-session-row{display:grid;grid-template-columns:1fr 80px;background:var(--bg3);border:1px solid var(--border);border-top:1px solid rgba(255,255,255,0.04);padding:10px 14px;align-items:center;font-size:13px;}
.att-session-row:last-child{border-radius:0 0 10px 10px;}

@media(max-width:900px){.stats-grid{grid-template-columns:repeat(2,1fr);}}
@media(max-width:640px){
  .stats-grid{grid-template-columns:1fr 1fr;}
  .scontent{padding:16px 12px 40px;}
  .snav{padding:0 14px;}
  .welcome-hi{font-size:18px;}
  .welcome-card{flex-direction:column;align-items:flex-start;}
}
`;

const ATT_MAP={
  present:{color:"#4ade80",bg:"rgba(74,222,128,.12)",label:"Present"},
  absent: {color:"#fb7aac",bg:"rgba(251,122,172,.12)",label:"Absent"},
  late:   {color:"#fbbf24",bg:"rgba(251,191,36,.12)",label:"Late"},
};
const STATUS_MAP={
  new:      {color:"#60a5fa",bg:"rgba(96,165,250,.12)",label:"New"},
  contacted:{color:"#fbbf24",bg:"rgba(251,191,36,.12)",label:"Contacted"},
  enrolled: {color:"#4ade80",bg:"rgba(74,222,128,.12)",label:"Enrolled"},
  cancelled:{color:"#fb7aac",bg:"rgba(251,122,172,.12)",label:"Cancelled"},
};

function Pill({status,map}){
  const s=map[status]||Object.values(map)[0];
  return <span className="pill" style={{background:s.bg,color:s.color}}><span className="pdot" style={{background:s.color}}/>{s.label}</span>;
}
function initials(name){return(name||"").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();}
function todayStr(){return new Date().toISOString().split("T")[0];}

export default function StaffPortal(){
  const [staff,setStaff]               = useState(null);
  const [data,setData]                 = useState(null);
  const [email,setEmail]               = useState("");
  const [password,setPassword]         = useState("");
  const [loading,setLoading]           = useState(false);
  const [err,setErr]                   = useState("");
  const [tab,setTab]                   = useState("overview");
  const [toasts,setToasts]             = useState([]);
  const [attClass,setAttClass]         = useState("");
  const [attDate,setAttDate]           = useState(todayStr());
  const [attStatuses,setAttStatuses]   = useState({});
  const [attSubmitting,setAttSubmitting] = useState(false);
  const [attSuccess,setAttSuccess]     = useState("");
  const [profileEdit,setProfileEdit]   = useState(false);
  const [profilePhone,setProfilePhone] = useState("");
  const [profileSaving,setProfileSaving] = useState(false);
  const [profileMsg,setProfileMsg]     = useState("");

  const toast=(msg,type="success")=>{
    const id=Date.now();
    setToasts(t=>[...t,{id,msg,type}]);
    setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),3500);
  };

  const login=async()=>{
    if(!email.trim()||!password.trim())return;
    setLoading(true);setErr("");
    try{
      const r=await fetch("/api/staff/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password})});
      const d=await r.json();
      if(d.success){setStaff(d.staff);setProfilePhone(d.staff.phone||"");fetchData(d.staff._id);}
      else setErr(d.error||"Login failed");
    }catch{setErr("Connection error.");}
    finally{setLoading(false);}
  };

  const fetchData=async(id)=>{
    try{
      const r=await fetch("/api/staff/data",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({staffId:id})});
      const d=await r.json();
      if(d.success)setData(d);
    }catch{}
  };

  const logout=()=>{setStaff(null);setData(null);setEmail("");setPassword("");setTab("overview");};

  // ── SUBMIT ATTENDANCE using records[] array ──
  const submitAttendance=async()=>{
    if(!attClass){toast("Please select a class","error");return;}
    const marked=Object.entries(attStatuses).filter(([,v])=>v);
    if(marked.length===0){toast("Please mark at least one student","error");return;}
    setAttSubmitting(true);setAttSuccess("");
    try{
      const records=marked.map(([studentId,status])=>{
        const s=enrolledStudents.find(x=>String(x._id)===studentId);
        return{personId:studentId,personName:`${s?.firstName||""} ${s?.lastName||""}`.trim(),status};
      });
      const r=await fetch("/api/staff/data",{
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({className:attClass,classId:attClass,date:attDate,markedBy:staff.name,records})
      });
      const d=await r.json();
      if(d.success){
        setAttSuccess(`✅ Attendance saved for ${records.length} student(s)!`);
        toast(`Attendance saved for ${records.length} students!`);
        setAttStatuses({});
        fetchData(staff._id);
      }else toast(d.error||"Error saving","error");
    }catch{toast("Connection error","error");}
    finally{setAttSubmitting(false);}
  };

  const saveProfile=async()=>{
    setProfileSaving(true);setProfileMsg("");
    try{
      const r=await fetch("/api/staff/data",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({staffId:staff._id,phone:profilePhone})});
      const d=await r.json();
      if(d.success){setStaff(s=>({...s,phone:profilePhone}));setProfileMsg("✅ Profile updated!");setProfileEdit(false);}
      else setProfileMsg("❌ Update failed.");
    }catch{setProfileMsg("❌ Connection error.");}
    finally{setProfileSaving(false);}
  };

  if(!staff)return(
    <><style>{CSS}</style>
    <div className="login-wrap">
      <div className="tricolor"><div className="tc1"/><div className="tc2"/><div className="tc3"/></div>
      <div className="login-glow a"/><div className="login-glow b"/>
      <div className="login-card">
        <div className="login-logo-ring"><img src="/logo.png" style={{width:60,height:60,borderradius:"50%",objectfit:"cover"}}/></div>
        <h1 className="login-title">Staff Portal</h1>
        <p className="login-sub">International French Academy</p>
        <div className="login-lbl">Email Address</div>
        <input className="login-in" type="email" placeholder="yourname@ifa.rw"
          value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&login()}/>
        <div className="login-lbl">Password</div>
        <input className="login-in" type="password" placeholder="••••••••"
          value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&login()}/>
        {err&&<p className="login-err">⚠️ {err}</p>}
        <button className="login-btn" onClick={login} disabled={loading}>{loading?"Signing in…":"Sign In →"}</button>
        <p className="login-hint">Default password: your phone number<br/>or contact admin if you forgot</p>
      </div>
    </div></>
  );

  const mySchedules      = data?.schedules||[];
  const allStudents      = data?.students||[];
  const myAttendance     = data?.attendance||[];
  const enrolledStudents = allStudents.filter(s=>s.status==="enrolled");

  // Calculate present count from records[]
  const totalPresent = myAttendance.reduce((sum,a)=>
    sum+(a.records||[]).filter(r=>r.status==="present").length,0);
  const totalRecords = myAttendance.reduce((sum,a)=>sum+(a.records||[]).length,0);
  const presentRate  = totalRecords>0?`${Math.round((totalPresent/totalRecords)*100)}%`:"—";

  const TABS=[
    {id:"overview",   label:"🏠 Overview"},
    {id:"schedule",   label:"📅 My Schedule"},
    {id:"attendance", label:"✅ Mark Attendance"},
    {id:"students",   label:"👥 Students"},
    {id:"history",    label:"📋 Att. History"},
    {id:"profile",    label:"👤 Profile"},
  ];

  return(
    <><style>{CSS}</style>
    <div style={{background:"var(--bg)",minHeight:"100vh"}}>

      <div className="toast-wrap">
        {toasts.map(t=><div key={t.id} className={`toast ${t.type}`}>{t.msg}</div>)}
      </div>

      <nav className="snav">
        <div className="snav-logo">
          <div className="snav-badge">IFA</div>
          <div><div className="snav-name">International French Academy</div><div className="snav-sub">Staff Portal</div></div>
        </div>
        <div className="snav-right">
          <div className="staff-chip" onClick={()=>setTab("profile")}>
            <div className="staff-avatar">{initials(staff.name)}</div>
            <span className="staff-chip-name">{staff.name}</span>
          </div>
          <button className="logout-btn" onClick={logout}>Sign Out</button>
        </div>
      </nav>

      <div className="scontent">
        <div className="welcome-card">
          <div style={{position:"relative",zIndex:1,flex:1}}>
            <div className="welcome-hi">Good day, {staff.name.split(" ")[0]}! 👋</div>
            <div className="welcome-meta">
              <span>💼 {staff.role}</span>
              <span>📧 {staff.email}</span>
              <span>📚 {staff.classes} class(es)</span>
            </div>
          </div>
          <div className="active-pill"><div className="a-dot"/>{staff.status==="active"?"Active":"Inactive"}</div>
        </div>

        <div className="tabs-row">
          {TABS.map(t=><button key={t.id} className={`tab-btn${tab===t.id?" active":""}`} onClick={()=>setTab(t.id)}>{t.label}</button>)}
        </div>

        {/* OVERVIEW */}
        {tab==="overview"&&(<>
          <div className="stats-grid">
            {[
              {cls:"blue", ico:"📅",lbl:"My Classes",      val:mySchedules.length,     sub:"Assigned schedules"},
              {cls:"teal", ico:"👥",lbl:"Students",        val:enrolledStudents.length, sub:"Enrolled students"},
              {cls:"green",ico:"✅",lbl:"Sessions Marked", val:myAttendance.length,     sub:"Attendance sessions"},
              {cls:"amber",ico:"🎯",lbl:"Present Rate",    val:presentRate,             sub:"Student presence"},
            ].map((c,i)=>(
              <div key={i} className={`stat-card ${c.cls}`}>
                <div className="stat-ico">{c.ico}</div>
                <div className="stat-lbl">{c.lbl}</div>
                <div className="stat-val">{c.val}</div>
                <div className="stat-sub">{c.sub}</div>
              </div>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <div className="section">
              <div className="section-title">💼 My Role</div>
              <div className="section-sub">Your position at IFA</div>
              {[{lbl:"Full Name",val:staff.name},{lbl:"Role",val:staff.role},{lbl:"Email",val:staff.email},{lbl:"Phone",val:staff.phone||"—"},{lbl:"Classes",val:staff.classes},{lbl:"Status",val:staff.status}].map((r,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid var(--border)",gap:8}}>
                  <span style={{fontSize:12,color:"var(--text3)"}}>{r.lbl}</span>
                  <span style={{fontSize:13,fontWeight:600,textAlign:"right"}}>{r.val}</span>
                </div>
              ))}
            </div>
            <div className="section">
              <div className="section-title">📅 My Classes</div>
              <div className="section-sub">Your assigned schedule</div>
              {mySchedules.length===0?(
                <div className="empty-state"><div className="empty-ico">📅</div><p>No classes assigned yet</p></div>
              ):mySchedules.slice(0,4).map((s,i)=>(
                <div key={i} className="sched-item" style={{marginBottom:8}}>
                  <div><div className="sched-day">{s.day}</div><div className="sched-name" style={{fontSize:13}}>{s.name}</div><div className="sched-meta">🕐 {s.time} · 📍 {s.room}</div></div>
                  <span className="pill" style={{background:"rgba(96,165,250,.12)",color:"var(--blue)",flexShrink:0}}>{s.level}</span>
                </div>
              ))}
            </div>
          </div>
        </>)}

        {/* SCHEDULE */}
        {tab==="schedule"&&(
          <div className="section">
            <div className="section-title">📅 My Class Schedule</div>
            <div className="section-sub">All classes assigned to you</div>
            {mySchedules.length===0?(
              <div className="empty-state"><div className="empty-ico">📅</div><p>No classes assigned yet</p></div>
            ):mySchedules.map((s,i)=>(
              <div key={i} className="sched-item">
                <div style={{flex:1}}><div className="sched-day">{s.day}</div><div className="sched-name">{s.name}</div><div className="sched-meta">🕐 {s.time} · 📊 {s.level} · 📍 {s.room}</div></div>
                <span className="pill" style={{background:"rgba(96,165,250,.12)",color:"var(--blue)",flexShrink:0}}>{s.level}</span>
              </div>
            ))}
          </div>
        )}

        {/* MARK ATTENDANCE */}
        {tab==="attendance"&&(
          <div className="section">
            <div className="section-title">✅ Mark Attendance</div>
            <div className="section-sub">Record student attendance for your class</div>
            <div className="att-form">
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
                <div>
                  <div className="profile-lbl">Select Class</div>
                  <select className="att-select" value={attClass} onChange={e=>{setAttClass(e.target.value);setAttStatuses({});}}>
                    <option value="">— Choose class —</option>
                    {mySchedules.map((s,i)=><option key={i} value={s.name}>{s.name} ({s.level})</option>)}
                    {mySchedules.length===0&&<option value="General">General Class</option>}
                  </select>
                </div>
                <div>
                  <div className="profile-lbl">Date</div>
                  <input type="date" className="att-date" value={attDate} onChange={e=>setAttDate(e.target.value)}/>
                </div>
              </div>
              {attClass&&(<>
                <div className="profile-lbl" style={{marginBottom:10}}>Mark Students ({enrolledStudents.length} enrolled)</div>
                {enrolledStudents.length===0?(
                  <div style={{fontSize:13,color:"var(--text3)",padding:"12px 0"}}>No enrolled students found</div>
                ):(
                  <div className="att-grid">
                    {enrolledStudents.map((s,i)=>(
                      <div key={i} className="att-student-row">
                        <div style={{display:"flex",alignItems:"center",gap:8,flex:1}}>
                          <div className="student-ava" style={{width:28,height:28,fontSize:10}}>{(s.firstName?.[0]||"")+(s.lastName?.[0]||"")}</div>
                          <span className="att-name">{s.firstName} {s.lastName}</span>
                        </div>
                        <select className="att-status-select" value={attStatuses[String(s._id)]||""}
                          onChange={e=>setAttStatuses(prev=>({...prev,[String(s._id)]:e.target.value}))}>
                          <option value="">—</option>
                          <option value="present">✅ Present</option>
                          <option value="absent">❌ Absent</option>
                          <option value="late">⏰ Late</option>
                        </select>
                      </div>
                    ))}
                  </div>
                )}
                {attSuccess&&<div style={{padding:"10px 14px",borderRadius:8,marginBottom:12,fontSize:12,background:"rgba(74,222,128,0.1)",color:"var(--green)"}}>{attSuccess}</div>}
                <button className="submit-att-btn" onClick={submitAttendance} disabled={attSubmitting}>
                  {attSubmitting?"Saving…":"💾 Save Attendance"}
                </button>
              </>)}
            </div>
          </div>
        )}

        {/* STUDENTS */}
        {tab==="students"&&(
          <div className="section">
            <div className="section-title">👥 Enrolled Students</div>
            <div className="section-sub">{enrolledStudents.length} students currently enrolled</div>
            {enrolledStudents.length===0?(
              <div className="empty-state"><div className="empty-ico">👥</div><p>No enrolled students</p></div>
            ):enrolledStudents.map((s,i)=>(
              <div key={i} className="student-item">
                <div className="student-ava">{(s.firstName?.[0]||"")+(s.lastName?.[0]||"")}</div>
                <div style={{flex:1}}><div className="student-name">{s.firstName} {s.lastName}</div><div className="student-meta">🎯 {s.certificationGoal} · 📧 {s.email}</div></div>
                <Pill status={s.status} map={STATUS_MAP}/>
              </div>
            ))}
          </div>
        )}

        {/* ATTENDANCE HISTORY — uses records[] array */}
        {tab==="history"&&(
          <div className="section">
            <div className="section-title">📋 Attendance History</div>
            <div className="section-sub">Sessions you have marked</div>
            {myAttendance.length===0?(
              <div className="empty-state"><div className="empty-ico">📋</div><p>No attendance records yet</p></div>
            ):myAttendance.map((a,i)=>(
              <div key={i} className="att-session">
                <div className="att-session-header">
                  <span style={{fontWeight:600,fontSize:13}}>{a.className}</span>
                  <span style={{fontSize:11,color:"var(--text3)"}}>{a.date}</span>
                </div>
                {(a.records||[]).length===0?(
                  <div className="att-session-row"><span style={{color:"var(--text3)"}}>No records</span></div>
                ):(a.records||[]).map((rec,j)=>(
                  <div key={j} className="att-session-row">
                    <span style={{fontSize:12,fontWeight:500}}>{rec.personName||"Unknown"}</span>
                    <Pill status={rec.status} map={ATT_MAP}/>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* PROFILE */}
        {tab==="profile"&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div className="section">
              <div className="section-title">👤 My Profile</div>
              <div className="section-sub">Your staff information</div>
              <div className="profile-avatar-big">{initials(staff.name)}</div>
              <div style={{textAlign:"center",marginBottom:24}}>
                <div style={{fontFamily:"'Sora',sans-serif",fontSize:18,fontWeight:700}}>{staff.name}</div>
                <div style={{fontSize:12,color:"var(--text3)",marginTop:4}}>{staff.role}</div>
                <div style={{fontSize:12,color:"var(--blue)",marginTop:4}}>{staff.email}</div>
              </div>
              {profileMsg&&<div style={{padding:"10px 14px",borderRadius:8,marginBottom:16,fontSize:12,background:profileMsg.includes("✅")?"rgba(74,222,128,0.1)":"rgba(251,122,172,0.1)",color:profileMsg.includes("✅")?"var(--green)":"var(--rose)"}}>{profileMsg}</div>}
              <div className="profile-lbl">Phone Number</div>
              <input className="profile-in" value={profilePhone} disabled={!profileEdit} placeholder="+250 ..." onChange={e=>setProfilePhone(e.target.value)}/>
              <div className="profile-lbl">Email (read only)</div>
              <input className="profile-in" value={staff.email} disabled/>
              <div className="profile-lbl">Role (read only)</div>
              <input className="profile-in" value={staff.role} disabled/>
              <div style={{display:"flex",gap:10,marginTop:8}}>
                {!profileEdit?<button className="save-btn" onClick={()=>setProfileEdit(true)}>✏️ Edit Profile</button>:(
                  <>
                    <button className="save-btn" onClick={saveProfile} disabled={profileSaving}>{profileSaving?"Saving…":"💾 Save"}</button>
                    <button onClick={()=>{setProfileEdit(false);setProfileMsg("");}} style={{background:"rgba(255,255,255,0.05)",border:"1px solid var(--border2)",color:"var(--text2)",padding:"12px 20px",borderRadius:10,cursor:"pointer",fontSize:13}}>Cancel</button>
                  </>
                )}
              </div>
            </div>
            <div className="section">
              <div className="section-title">📊 My Stats</div>
              <div className="section-sub">Your activity summary</div>
              {[
                {lbl:"Classes Assigned",         val:staff.classes},
                {lbl:"My Schedules",             val:mySchedules.length},
                {lbl:"Attendance Sessions",      val:myAttendance.length},
                {lbl:"Total Records Marked",     val:totalRecords},
                {lbl:"Students Present",         val:totalPresent},
                {lbl:"Students Absent",          val:myAttendance.reduce((s,a)=>s+(a.records||[]).filter(r=>r.status==="absent").length,0)},
                {lbl:"Students Late",            val:myAttendance.reduce((s,a)=>s+(a.records||[]).filter(r=>r.status==="late").length,0)},
                {lbl:"Present Rate",             val:presentRate},
              ].map((r,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"12px 0",borderBottom:"1px solid var(--border)"}}>
                  <span style={{fontSize:12,color:"var(--text3)"}}>{r.lbl}</span>
                  <span style={{fontSize:13,fontWeight:600,color:"var(--blue)"}}>{r.val}</span>
                </div>
              ))}
              <button onClick={logout} style={{marginTop:20,width:"100%",padding:"12px",background:"rgba(251,122,172,0.08)",border:"1px solid rgba(251,122,172,0.2)",color:"var(--rose)",borderRadius:10,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>🚪 Sign Out</button>
            </div>
          </div>
        )}

      </div>
    </div></>
  );
}
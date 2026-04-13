"use client";
import { useState, useEffect } from "react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --navy:#0d1b2a;--deep:#1a2e47;--gold:#c9a843;--gold-lt:#e8c068;
  --teal:#3ec9a7;--rose:#e05c7a;--amber:#e8a030;--blue:#4d9de0;--purple:#a78bfa;
  --cream:#f8f4ee;--cream-dark:#ede8df;--white:#ffffff;
  --text:#1a1a2e;--text2:#3d4a5c;--text3:#6b7a8d;
  --border:#e0d8cc;
}
*{font-family:'DM Sans',sans-serif;}
body{background:var(--cream);color:var(--text);min-height:100vh;}
.shell{min-height:100vh;}

/* LOGIN */
.login-bg{min-height:100vh;background:linear-gradient(135deg,var(--navy) 0%,var(--deep) 100%);display:flex;align-items:center;justify-content:center;padding:20px;position:relative;overflow:hidden;}
.login-bg::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 30% 50%,rgba(201,168,67,.08) 0%,transparent 50%),radial-gradient(circle at 70% 20%,rgba(62,201,167,.06) 0%,transparent 40%);}
.tricolor{position:absolute;top:0;left:0;right:0;height:4px;display:flex;}
.tc1{flex:1;background:#002395;}.tc2{flex:1;background:#fff;}.tc3{flex:1;background:#ED2939;}
.login-card{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:20px;padding:40px;width:100%;max-width:400px;backdrop-filter:blur(20px);position:relative;z-index:1;}
.login-logo{width:64px;height:64px;border-radius:50%;background:rgba(201,168,67,.12);border:2px solid rgba(201,168,67,.3);display:flex;align-items:center;justify-content:center;font-size:28px;margin:0 auto 16px;}
.login-title{font-family:'Playfair Display',serif;font-size:24px;font-weight:700;color:#fff;text-align:center;margin-bottom:4px;}
.login-sub{font-size:12px;color:rgba(255,255,255,0.4);text-align:center;letter-spacing:1px;text-transform:uppercase;margin-bottom:28px;}
.login-lbl{font-size:10px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.4);margin-bottom:6px;}
.login-in{width:100%;padding:12px 14px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:8px;color:#fff;font-size:14px;outline:none;margin-bottom:16px;transition:border-color .2s;}
.login-in::placeholder{color:rgba(255,255,255,0.25);}
.login-in:focus{border-color:var(--gold);}
.login-btn{width:100%;padding:13px;background:var(--gold);color:var(--navy);border:none;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer;letter-spacing:0.5px;transition:all .2s;}
.login-btn:hover{background:var(--gold-lt);transform:translateY(-1px);}
.login-btn:disabled{opacity:.6;cursor:not-allowed;transform:none;}
.login-err{color:#e05c7a;font-size:12px;text-align:center;margin-bottom:12px;}
.login-note{margin-top:16px;text-align:center;font-size:11px;color:rgba(255,255,255,0.25);}

/* PORTAL */
.portal{background:var(--cream);min-height:100vh;}
.pnav{background:var(--navy);padding:0 24px;height:60px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100;border-bottom:1px solid rgba(201,168,67,.15);}
.pnav-logo{display:flex;align-items:center;gap:10px;}
.pnav-logo-img{width:36px;height:36px;border-radius:50%;background:rgba(201,168,67,.12);border:1.5px solid rgba(201,168,67,.3);display:flex;align-items:center;justify-content:center;font-size:16px;}
.pnav-name{font-family:'Playfair Display',serif;font-size:14px;color:#fff;font-weight:700;}
.pnav-sub{font-size:9px;color:rgba(255,255,255,.4);letter-spacing:1.5px;text-transform:uppercase;}
.pnav-right{display:flex;align-items:center;gap:10px;}
.student-badge{background:rgba(62,201,167,.1);border:1px solid rgba(62,201,167,.25);color:#3ec9a7;padding:5px 12px;border-radius:20px;font-size:12px;font-weight:600;}
.logout-btn{background:transparent;border:1px solid rgba(255,255,255,.15);color:rgba(255,255,255,.5);padding:5px 12px;border-radius:6px;font-size:12px;cursor:pointer;transition:all .2s;}
.logout-btn:hover{border-color:var(--rose);color:var(--rose);}
.pcontent{max-width:900px;margin:0 auto;padding:28px 20px;}

/* WELCOME BANNER */
.welcome-banner{background:linear-gradient(135deg,var(--navy),var(--deep));border-radius:16px;padding:24px 28px;margin-bottom:24px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px;border:1px solid rgba(201,168,67,.15);}
.welcome-text h2{font-family:'Playfair Display',serif;font-size:22px;color:#fff;margin-bottom:4px;}
.welcome-text p{font-size:12px;color:rgba(255,255,255,.45);}
.status-pill{display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:20px;font-size:12px;font-weight:700;}

/* CARDS GRID */
.cards-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:24px;}
.info-card{background:#fff;border-radius:14px;padding:18px;border:1px solid var(--border);transition:all .2s;}
.info-card:hover{transform:translateY(-3px);box-shadow:0 12px 30px rgba(13,27,42,.1);}
.card-ico{font-size:22px;margin-bottom:10px;}
.card-lbl{font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:1.5px;margin-bottom:4px;}
.card-val{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;}
.card-sub{font-size:11px;color:var(--text3);margin-top:3px;}

/* SECTIONS */
.section{background:#fff;border-radius:14px;padding:20px;border:1px solid var(--border);margin-bottom:16px;}
.section-title{font-family:'Playfair Display',serif;font-size:17px;margin-bottom:4px;color:var(--text);}
.section-sub{font-size:11px;color:var(--text3);margin-bottom:16px;}
.table-row{display:grid;padding:11px 0;border-bottom:1px solid var(--cream-dark);font-size:13px;align-items:center;}
.table-row:last-child{border-bottom:none;}
.table-head{font-size:10px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:var(--text3);padding-bottom:8px;border-bottom:2px solid var(--cream-dark);margin-bottom:4px;}
.pill{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:12px;font-size:11px;font-weight:600;}
.dot{width:5px;height:5px;border-radius:50%;}
.empty-state{text-align:center;padding:28px;color:var(--text3);}
.empty-state .ico{font-size:28px;margin-bottom:8px;}
.empty-state p{font-size:13px;}

/* SCHEDULE */
.sched-item{display:flex;gap:14px;padding:12px 0;border-bottom:1px solid var(--cream-dark);}
.sched-item:last-child{border-bottom:none;}
.sched-day{background:var(--navy);color:#fff;border-radius:8px;padding:6px 10px;font-size:10px;font-weight:700;text-align:center;min-width:60px;line-height:1.4;}
.sched-info h4{font-size:13px;font-weight:600;margin-bottom:3px;}
.sched-info p{font-size:11px;color:var(--text3);}

@media(max-width:600px){
  .cards-grid{grid-template-columns:1fr 1fr;}
  .pcontent{padding:16px 12px;}
  .welcome-banner{padding:18px;}
}
`;

const STATUS_COLORS = {
  new:       {color:"#4d9de0",bg:"rgba(77,157,224,.12)",label:"New"},
  contacted: {color:"#e8a030",bg:"rgba(232,160,48,.12)",label:"Contacted"},
  enrolled:  {color:"#3ec9a7",bg:"rgba(62,201,167,.12)",label:"Enrolled"},
  cancelled: {color:"#e05c7a",bg:"rgba(224,92,122,.12)",label:"Cancelled"},
};
const PAY_COLORS = {
  paid:    {color:"#3ec9a7",bg:"rgba(62,201,167,.12)",label:"Paid"},
  pending: {color:"#e8a030",bg:"rgba(232,160,48,.12)",label:"Pending"},
  partial: {color:"#a78bfa",bg:"rgba(167,139,250,.12)",label:"Partial"},
  waived:  {color:"#607080",bg:"rgba(96,112,128,.12)",label:"Waived"},
};
const ATT_COLORS = {
  present:{color:"#3ec9a7",bg:"rgba(62,201,167,.12)",label:"Present"},
  absent: {color:"#e05c7a",bg:"rgba(224,92,122,.12)",label:"Absent"},
  late:   {color:"#e8a030",bg:"rgba(232,160,48,.12)",label:"Late"},
};

function Pill({status, map}) {
  const s = map[status]||map[Object.keys(map)[0]];
  return <span className="pill" style={{background:s.bg,color:s.color}}><span className="dot" style={{background:s.color}}/>{s.label}</span>;
}

function fmtDate(d) { return new Date(d).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}); }

export default function StudentPortal() {
  const [student, setStudent] = useState(null);
  const [data, setData] = useState(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [tab, setTab] = useState("overview");

  const login = async () => {
    if(!email) return;
    setLoading(true); setErr("");
    try {
      const r = await fetch("/api/student/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email})});
      const d = await r.json();
      if(d.success) {
        setStudent(d.student);
        fetchData(d.student._id);
      } else { setErr(d.error||"Not found"); }
    } catch { setErr("Connection error."); }
    finally { setLoading(false); }
  };

  const fetchData = async (studentId) => {
    try {
      const r = await fetch("/api/student/data",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({studentId})});
      const d = await r.json();
      if(d.success) setData(d);
    } catch {}
  };

  const logout = () => { setStudent(null); setData(null); setEmail(""); setTab("overview"); };

  if(!student) return (
    <>
      <style>{CSS}</style>
      <div className="login-bg">
        <div className="tricolor"><div className="tc1"/><div className="tc2"/><div className="tc3"/></div>
        <div className="login-card">
          <div className="login-logo">🎓</div>
          <h1 className="login-title">Student Portal</h1>
          <p className="login-sub">International French Academy</p>
          <div className="login-lbl">Your Email Address</div>
          <input className="login-in" type="email" placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&login()}/>
          {err&&<p className="login-err">{err}</p>}
          <button className="login-btn" onClick={login} disabled={loading}>{loading?"Checking...":"Access My Portal →"}</button>
          <p className="login-note">Enter the email you used when enrolling</p>
        </div>
      </div>
    </>
  );

  const totalPaid = data?.payments?.filter(p=>p.status==="paid").reduce((a,p)=>a+p.amount,0)||0;
  const totalPending = data?.payments?.filter(p=>p.status==="pending").reduce((a,p)=>a+p.amount,0)||0;
  const passRate = data?.certifications?.length>0 ? Math.round((data.certifications.filter(c=>c.passed).length/data.certifications.length)*100) : null;
  const attendanceRate = data?.attendance?.length>0 ? Math.round((data.attendance.filter(a=>a.status==="present").length/data.attendance.length)*100) : null;
  const statusStyle = STATUS_COLORS[student.status]||STATUS_COLORS.new;

  const tabs = ["overview","schedule","payments","certifications","attendance"];

  return (
    <>
      <style>{CSS}</style>
      <div className="portal">
        <nav className="pnav">
          <div className="pnav-logo">
            <div className="pnav-logo-img">🎓</div>
            <div>
              <div className="pnav-name">International French Academy</div>
              <div className="pnav-sub">Student Portal</div>
            </div>
          </div>
          <div className="pnav-right">
            <span className="student-badge">👤 {student.firstName} {student.lastName}</span>
            <button className="logout-btn" onClick={logout}>Sign Out</button>
          </div>
        </nav>

        <div className="pcontent">
          {/* Welcome Banner */}
          <div className="welcome-banner">
            <div className="welcome-text">
              <h2>Welcome back, {student.firstName}! 👋</h2>
              <p>🎯 Goal: {student.certificationGoal} · 📅 Enrolled: {fmtDate(student.createdAt)}</p>
            </div>
            <span className="status-pill" style={{background:statusStyle.bg,color:statusStyle.color}}>
              <span style={{width:6,height:6,borderRadius:"50%",background:statusStyle.color,display:"inline-block"}}/>
              {statusStyle.label}
            </span>
          </div>

          {/* Tabs */}
          <div style={{display:"flex",gap:4,marginBottom:20,background:"#fff",borderRadius:10,padding:4,border:"1px solid var(--border)",overflowX:"auto"}}>
            {tabs.map(t=>(
              <button key={t} onClick={()=>setTab(t)} style={{padding:"7px 16px",borderRadius:7,border:"none",fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:500,cursor:"pointer",background:tab===t?"var(--navy)":"transparent",color:tab===t?"#fff":"var(--text3)",transition:"all .15s",whiteSpace:"nowrap",textTransform:"capitalize"}}>
                {t==="overview"?"🏠 Overview":t==="schedule"?"📅 Schedule":t==="payments"?"💰 Payments":t==="certifications"?"🏆 Certifications":"📋 Attendance"}
              </button>
            ))}
          </div>

          {/* OVERVIEW */}
          {tab==="overview"&&(
            <>
              <div className="cards-grid">
                {[
                  {ico:"💰",lbl:"Total Paid",val:`${totalPaid.toLocaleString()} RWF`,sub:"Confirmed payments",color:"#3ec9a7"},
                  {ico:"⏳",lbl:"Pending",val:`${totalPending.toLocaleString()} RWF`,sub:"Outstanding balance",color:"#e8a030"},
                  {ico:"🏆",lbl:"Pass Rate",val:passRate!==null?`${passRate}%`:"—",sub:`${data?.certifications?.length||0} exam(s)`,color:"#a78bfa"},
                  {ico:"📋",lbl:"Attendance",val:attendanceRate!==null?`${attendanceRate}%`:"—",sub:`${data?.attendance?.length||0} sessions`,color:"#4d9de0"},
                  {ico:"🎯",lbl:"Certification",val:student.certificationGoal,sub:"Your goal",color:"#c9a843"},
                  {ico:"📅",lbl:"Classes",val:data?.schedules?.length||0,sub:"Available classes",color:"#e05c7a"},
                ].map((c,i)=>(
                  <div key={i} className="info-card">
                    <div className="card-ico">{c.ico}</div>
                    <div className="card-lbl">{c.lbl}</div>
                    <div className="card-val" style={{color:c.color}}>{c.val}</div>
                    <div className="card-sub">{c.sub}</div>
                  </div>
                ))}
              </div>
              {student.message&&(
                <div className="section">
                  <div className="section-title">📝 Your Message</div>
                  <p style={{fontSize:13,color:"var(--text2)",lineHeight:1.7,fontStyle:"italic"}}>"{student.message}"</p>
                </div>
              )}
              <div className="section">
                <div className="section-title">📞 Need Help?</div>
                <div className="section-sub">Contact the academy directly</div>
                <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                  <a href="https://wa.me/250785302957" target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}>
                    <button style={{background:"#25D366",color:"#fff",border:"none",padding:"10px 20px",borderRadius:8,fontWeight:700,fontSize:13,cursor:"pointer"}}>💬 WhatsApp Us</button>
                  </a>
                  <a href="mailto:frenchacademyinternational@gmail.com" style={{textDecoration:"none"}}>
                    <button style={{background:"var(--navy)",color:"#fff",border:"none",padding:"10px 20px",borderRadius:8,fontWeight:700,fontSize:13,cursor:"pointer"}}>📧 Send Email</button>
                  </a>
                </div>
              </div>
            </>
          )}

          {/* SCHEDULE */}
          {tab==="schedule"&&(
            <div className="section">
              <div className="section-title">📅 Class Schedule</div>
              <div className="section-sub">All available classes at IFA</div>
              {!data?.schedules?.length?(
                <div className="empty-state"><div className="ico">📅</div><p>No classes found</p></div>
              ):data.schedules.map((c,i)=>(
                <div key={i} className="sched-item">
                  <div className="sched-day">{c.day}</div>
                  <div className="sched-info">
                    <h4>{c.name}</h4>
                    <p>🕐 {c.time} · 📊 {c.level} · 👨‍🏫 {c.teacher} · 📍 {c.room}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PAYMENTS */}
          {tab==="payments"&&(
            <div className="section">
              <div className="section-title">💰 Payment History</div>
              <div className="section-sub">Your payment records</div>
              {!data?.payments?.length?(
                <div className="empty-state"><div className="ico">💳</div><p>No payment records yet</p></div>
              ):(
                <>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}}>
                    {[
                      {lbl:"Total Paid",val:`${totalPaid.toLocaleString()} RWF`,color:"#3ec9a7"},
                      {lbl:"Pending",val:`${totalPending.toLocaleString()} RWF`,color:"#e8a030"},
                      {lbl:"Transactions",val:data.payments.length,color:"#4d9de0"},
                    ].map((s,i)=>(
                      <div key={i} style={{background:"var(--cream)",borderRadius:10,padding:"12px 16px",border:"1px solid var(--cream-dark)"}}>
                        <div style={{fontSize:10,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"1.5px",marginBottom:4}}>{s.lbl}</div>
                        <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:s.color}}>{s.val}</div>
                      </div>
                    ))}
                  </div>
                  <div className="table-head" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 80px"}}>
                    <span>Amount</span><span>Method</span><span>Date</span><span>Status</span>
                  </div>
                  {data.payments.map((p,i)=>(
                    <div key={i} className="table-row" style={{gridTemplateColumns:"1fr 1fr 1fr 80px"}}>
                      <span style={{fontWeight:600,color:"#3ec9a7"}}>{p.amount.toLocaleString()} RWF</span>
                      <span style={{fontSize:12,color:"var(--text2)"}}>{p.method}</span>
                      <span style={{fontSize:12,color:"var(--text3)"}}>{p.date}</span>
                      <Pill status={p.status} map={PAY_COLORS}/>
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
              {!data?.certifications?.length?(
                <div className="empty-state"><div className="ico">📝</div><p>No exam results yet</p></div>
              ):(
                <>
                  <div className="table-head" style={{display:"grid",gridTemplateColumns:"1fr 80px 80px 80px"}}>
                    <span>Certification</span><span>Score</span><span>Date</span><span>Result</span>
                  </div>
                  {data.certifications.map((c,i)=>(
                    <div key={i} className="table-row" style={{gridTemplateColumns:"1fr 80px 80px 80px"}}>
                      <span style={{fontWeight:500}}>{c.cert}</span>
                      <span style={{fontWeight:600}}>{c.score||"—"}</span>
                      <span style={{fontSize:11,color:"var(--text3)"}}>{c.examDate||"—"}</span>
                      <span className="pill" style={{background:c.passed?"rgba(62,201,167,.12)":"rgba(224,92,122,.12)",color:c.passed?"#3ec9a7":"#e05c7a"}}>{c.passed?"✓ Pass":"✕ Fail"}</span>
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
              {!data?.attendance?.length?(
                <div className="empty-state"><div className="ico">📋</div><p>No attendance records yet</p></div>
              ):(
                <>
                  <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
                    {[
                      {lbl:"Present",val:data.attendance.filter(a=>a.status==="present").length,color:"#3ec9a7"},
                      {lbl:"Absent",val:data.attendance.filter(a=>a.status==="absent").length,color:"#e05c7a"},
                      {lbl:"Late",val:data.attendance.filter(a=>a.status==="late").length,color:"#e8a030"},
                      {lbl:"Rate",val:`${attendanceRate}%`,color:"#4d9de0"},
                    ].map((s,i)=>(
                      <div key={i} style={{background:"var(--cream)",borderRadius:10,padding:"10px 16px",border:"1px solid var(--cream-dark)",minWidth:80,textAlign:"center"}}>
                        <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:s.color}}>{s.val}</div>
                        <div style={{fontSize:10,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"1px"}}>{s.lbl}</div>
                      </div>
                    ))}
                  </div>
                  <div className="table-head" style={{display:"grid",gridTemplateColumns:"100px 1fr 80px"}}>
                    <span>Date</span><span>Class</span><span>Status</span>
                  </div>
                  {data.attendance.map((a,i)=>(
                    <div key={i} className="table-row" style={{gridTemplateColumns:"100px 1fr 80px"}}>
                      <span style={{fontSize:12,color:"var(--text3)"}}>{a.date}</span>
                      <span style={{fontSize:13,fontWeight:500}}>{a.className}</span>
                      <Pill status={a.status} map={ATT_COLORS}/>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

        </div>
      </div>
    </>
  );
}
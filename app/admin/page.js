"use client";
import { useState, useEffect, useCallback, useRef } from "react";

// ─── THEME ───────────────────────────────────────────────────────────────────
const C = {
  bg:        "#080f1a",
  surface:   "#0d1829",
  card:      "#111f35",
  border:    "#1a2e4a",
  borderHover:"#2a4a70",
  gold:      "#c9a84c",
  goldLight: "#e8c86a",
  goldDim:   "#c9a84c33",
  blue:      "#3b82f6",
  blueDim:   "#3b82f620",
  green:     "#22c55e",
  greenDim:  "#22c55e20",
  amber:     "#f59e0b",
  amberDim:  "#f59e0b20",
  red:       "#ef4444",
  redDim:    "#ef444420",
  purple:    "#a855f7",
  purpleDim: "#a855f720",
  text:      "#f0f4ff",
  textMuted: "#7a92b0",
  textDim:   "#3d5470",
};

const STATUS = {
  new:       { color: C.blue,   bg: C.blueDim,   label: "New",       icon: "✦" },
  contacted: { color: C.amber,  bg: C.amberDim,  label: "Contacted", icon: "✉" },
  enrolled:  { color: C.green,  bg: C.greenDim,  label: "Enrolled",  icon: "✓" },
  cancelled: { color: C.red,    bg: C.redDim,    label: "Cancelled", icon: "✕" },
};

const CERTS = ["TCF Québec","TEF Québec","TCF Canada","TEF Canada","DELF A1","DELF A2","DILF","DALF C1","DALF C2","DFP"];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function fmt(date) {
  return new Date(date).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" });
}
function fmtTime(date) {
  return new Date(date).toLocaleTimeString("en-GB", { hour:"2-digit", minute:"2-digit" });
}
function timeAgo(date) {
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s/60)}m ago`;
  if (s < 86400) return `${Math.floor(s/3600)}h ago`;
  return `${Math.floor(s/86400)}d ago`;
}

// ─── TOAST ───────────────────────────────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState([]);
  const show = useCallback((msg, type="success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);
  return { toasts, show };
}

function Toasts({ toasts }) {
  return (
    <div style={{ position:"fixed", bottom:24, right:24, zIndex:9999, display:"flex", flexDirection:"column", gap:10 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          padding:"12px 20px", borderRadius:10, fontSize:14, fontWeight:600,
          background: t.type==="success" ? C.green : t.type==="error" ? C.red : C.amber,
          color:"#fff", boxShadow:"0 8px 32px #00000060",
          animation:"slideIn .3s ease",
        }}>{t.type==="success"?"✓ ":t.type==="error"?"✕ ":"⚠ "}{t.msg}</div>
      ))}
    </div>
  );
}

// ─── CHARTS ──────────────────────────────────────────────────────────────────
function BarChart({ data, label }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display:"flex", alignItems:"flex-end", gap:6, height:90, padding:"0 4px" }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
          <div style={{ fontSize:10, color:C.textMuted, fontWeight:600 }}>{d.value||""}</div>
          <div style={{
            width:"100%", background:`${C.gold}22`, borderRadius:"4px 4px 0 0",
            height: `${(d.value/max)*70}px`, minHeight: d.value ? 4 : 0,
            background: `linear-gradient(to top, ${C.gold}, ${C.goldLight}88)`,
            transition:"height .5s ease",
          }}/>
          <div style={{ fontSize:9, color:C.textDim, whiteSpace:"nowrap" }}>{d.label}</div>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ data, size=120 }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  let offset = 0;
  const r = 40, cx = size/2, cy = size/2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} style={{ overflow:"visible" }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.border} strokeWidth={14}/>
      {data.map((d, i) => {
        const pct = d.value / total;
        const dash = pct * circ;
        const gap = circ - dash;
        const rot = offset * 360 - 90;
        offset += pct;
        return (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={d.color} strokeWidth={14}
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={0}
            style={{ transformOrigin:`${cx}px ${cy}px`, transform:`rotate(${rot}deg)`, transition:"stroke-dasharray .6s ease" }}
          />
        );
      })}
      <text x={cx} y={cy-6} textAnchor="middle" fill={C.text} fontSize={20} fontWeight={700}>{total}</text>
      <text x={cx} y={cy+14} textAnchor="middle" fill={C.textMuted} fontSize={10}>Total</text>
    </svg>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!pw) return;
    setLoading(true); setErr("");
    const res = await fetch("/api/admin/login", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ password: pw }),
    });
    const d = await res.json();
    setLoading(false);
    if (d.success) onLogin();
    else setErr("Invalid password. Please try again.");
  };

  return (
    <div style={{
      minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center",
      justifyContent:"center", fontFamily:"'Georgia', serif",
      backgroundImage:`radial-gradient(ellipse at 30% 50%, #0d2040 0%, transparent 60%), radial-gradient(ellipse at 70% 20%, #1a0d30 0%, transparent 50%)`,
    }}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}} @keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}`}</style>
      <div style={{
        width:420, animation:"fadeUp .6s ease",
      }}>
        {/* Logo area */}
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <div style={{
            width:72, height:72, borderRadius:20, background:`linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
            margin:"0 auto 16px", display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:32, boxShadow:`0 0 40px ${C.gold}44`,
          }}>🎓</div>
          <div style={{ fontSize:22, fontWeight:700, color:C.text, letterSpacing:1 }}>IFA Admin Portal</div>
          <div style={{ fontSize:13, color:C.textMuted, marginTop:4 }}>International French Academy — Kigali</div>
        </div>

        {/* Card */}
        <div style={{
          background:C.card, border:`1px solid ${C.border}`, borderRadius:20,
          padding:40, boxShadow:"0 24px 80px #00000080",
        }}>
          <div style={{ fontSize:13, color:C.textMuted, marginBottom:8, fontWeight:600, letterSpacing:.5 }}>ADMIN PASSWORD</div>
          <input
            type="password" value={pw} placeholder="Enter your password"
            onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key==="Enter" && login()}
            style={{
              width:"100%", padding:"14px 16px", borderRadius:10, boxSizing:"border-box",
              border:`1px solid ${C.border}`, background:C.surface, color:C.text,
              fontSize:15, outline:"none", transition:"border .2s",
            }}
            onFocus={e => e.target.style.border=`1px solid ${C.gold}`}
            onBlur={e => e.target.style.border=`1px solid ${C.border}`}
          />
          {err && <div style={{ color:C.red, fontSize:13, marginTop:10 }}>{err}</div>}
          <button onClick={login} disabled={loading} style={{
            marginTop:20, width:"100%", padding:"14px",
            background:`linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
            color:"#0a1220", fontWeight:700, fontSize:15, border:"none",
            borderRadius:10, cursor:"pointer", letterSpacing:.5,
            boxShadow:`0 4px 20px ${C.gold}44`, opacity: loading ? .7 : 1,
            transition:"opacity .2s, transform .1s",
          }}>{loading ? "Authenticating..." : "Enter Dashboard →"}</button>
        </div>

        <div style={{ textAlign:"center", marginTop:20, fontSize:12, color:C.textDim }}>
          🔒 Secure Admin Access
        </div>
      </div>
    </div>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color, trend }) {
  return (
    <div style={{
      background:C.card, border:`1px solid ${C.border}`, borderRadius:16,
      padding:"22px 24px", flex:1, minWidth:140,
      borderTop:`3px solid ${color}`,
      transition:"transform .2s, box-shadow .2s",
      cursor:"default",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow=`0 12px 40px ${color}22`; }}
      onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="none"; }}
    >
      <div style={{ fontSize:24, marginBottom:10 }}>{icon}</div>
      <div style={{ fontSize:32, fontWeight:800, color, lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:13, color:C.textMuted, marginTop:6, fontWeight:600 }}>{label}</div>
      {sub && <div style={{ fontSize:11, color:C.textDim, marginTop:4 }}>{sub}</div>}
      {trend !== undefined && (
        <div style={{ fontSize:11, color: trend >= 0 ? C.green : C.red, marginTop:6, fontWeight:600 }}>
          {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)} vs last week
        </div>
      )}
    </div>
  );
}

// ─── EMAIL MODAL ──────────────────────────────────────────────────────────────
function EmailModal({ enrollment, onClose, toast }) {
  const [subject, setSubject] = useState(`Your enrollment at International French Academy`);
  const [body, setBody] = useState(
    `Dear ${enrollment.firstName},\n\nThank you for your interest in our ${enrollment.certificationGoal} program.\n\n`
  );
  const [sending, setSending] = useState(false);

  const send = async () => {
    setSending(true);
    try {
      const res = await fetch("/api/admin/send-email", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ to: enrollment.email, subject, body, enrollmentId: enrollment._id }),
      });
      const d = await res.json();
      if (d.success) { toast("Email sent successfully!", "success"); onClose(); }
      else toast("Failed to send email", "error");
    } catch { toast("Failed to send email", "error"); }
    setSending(false);
  };

  return (
    <div style={{
      position:"fixed", inset:0, background:"#00000099", backdropFilter:"blur(4px)",
      zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center",
    }} onClick={e => e.target===e.currentTarget && onClose()}>
      <div style={{
        background:C.card, border:`1px solid ${C.border}`, borderRadius:20,
        width:560, padding:32, boxShadow:"0 32px 80px #000000a0",
        animation:"fadeUp .3s ease",
      }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
          <div>
            <div style={{ fontSize:18, fontWeight:700, color:C.text }}>📨 Send Email</div>
            <div style={{ fontSize:13, color:C.textMuted, marginTop:2 }}>To: {enrollment.firstName} {enrollment.lastName} — {enrollment.email}</div>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", color:C.textMuted, cursor:"pointer", fontSize:20 }}>✕</button>
        </div>

        <label style={{ fontSize:12, color:C.textMuted, fontWeight:600, letterSpacing:.5 }}>SUBJECT</label>
        <input value={subject} onChange={e => setSubject(e.target.value)} style={{
          width:"100%", marginTop:6, marginBottom:16, padding:"11px 14px", boxSizing:"border-box",
          background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, color:C.text, fontSize:14, outline:"none",
        }}/>

        <label style={{ fontSize:12, color:C.textMuted, fontWeight:600, letterSpacing:.5 }}>MESSAGE</label>
        <textarea value={body} onChange={e => setBody(e.target.value)} rows={8} style={{
          width:"100%", marginTop:6, padding:"11px 14px", boxSizing:"border-box",
          background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, color:C.text,
          fontSize:14, resize:"vertical", outline:"none", lineHeight:1.6,
        }}/>

        <div style={{ display:"flex", gap:12, marginTop:20 }}>
          <button onClick={onClose} style={{
            flex:1, padding:"11px", background:"none", border:`1px solid ${C.border}`,
            color:C.textMuted, borderRadius:8, cursor:"pointer", fontSize:14,
          }}>Cancel</button>
          <button onClick={send} disabled={sending} style={{
            flex:2, padding:"11px", background:`linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
            color:"#0a1220", fontWeight:700, borderRadius:8, border:"none",
            cursor:"pointer", fontSize:14, opacity: sending ? .7 : 1,
          }}>{sending ? "Sending..." : "Send Email ✈"}</button>
        </div>
      </div>
    </div>
  );
}

// ─── DETAIL PANEL ─────────────────────────────────────────────────────────────
function DetailPanel({ e, onClose, onUpdate, onDelete, toast }) {
  const [tab, setTab] = useState("info");
  const [notes, setNotes] = useState(e.notes || "");
  const [savingNotes, setSavingNotes] = useState(false);
  const [showEmail, setShowEmail] = useState(false);

  const sc = STATUS[e.status];

  const updateStatus = async (status) => {
    const res = await fetch("/api/admin/enrollments", {
      method:"PATCH", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ id: e._id, status }),
    });
    if (res.ok) { onUpdate({ ...e, status }); toast(`Status → ${STATUS[status].label}`, "success"); }
  };

  const saveNotes = async () => {
    setSavingNotes(true);
    await fetch("/api/admin/enrollments", {
      method:"PATCH", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ id: e._id, notes }),
    });
    setSavingNotes(false);
    onUpdate({ ...e, notes });
    toast("Notes saved", "success");
  };

  const del = async () => {
    if (!confirm(`Delete ${e.firstName} ${e.lastName}?`)) return;
    await fetch("/api/admin/enrollments", {
      method:"DELETE", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ id: e._id }),
    });
    onDelete(e._id);
    toast("Enrollment deleted", "success");
    onClose();
  };

  const print = () => {
    const w = window.open("", "_blank");
    w.document.write(`<html><head><title>Enrollment — ${e.firstName} ${e.lastName}</title>
    <style>body{font-family:Georgia,serif;padding:40px;color:#111;max-width:600px;margin:0 auto}
    h1{font-size:22px;margin-bottom:4px}h2{font-size:16px;color:#555;margin:0 0 32px}
    table{width:100%;border-collapse:collapse}td{padding:10px 0;border-bottom:1px solid #eee;font-size:14px}
    td:first-child{color:#888;width:40%}.badge{display:inline-block;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:bold}
    .footer{margin-top:40px;font-size:12px;color:#aaa;text-align:center}</style></head><body>
    <h1>${e.firstName} ${e.lastName}</h1>
    <h2>IFA Enrollment Details</h2>
    <table>
      <tr><td>Email</td><td>${e.email}</td></tr>
      <tr><td>Phone</td><td>${e.phone}</td></tr>
      <tr><td>Certification</td><td>${e.certificationGoal}</td></tr>
      <tr><td>Status</td><td>${e.status.toUpperCase()}</td></tr>
      <tr><td>Applied</td><td>${fmt(e.createdAt)} at ${fmtTime(e.createdAt)}</td></tr>
      ${e.message ? `<tr><td>Message</td><td>${e.message}</td></tr>` : ""}
      ${e.notes ? `<tr><td>Notes</td><td>${e.notes}</td></tr>` : ""}
    </table>
    <div class="footer">International French Academy — Kigali, Rwanda | Printed ${new Date().toLocaleDateString()}</div>
    </body></html>`);
    w.document.close(); w.print();
  };

  const TABS = [
    { id:"info", label:"👤 Info" },
    { id:"status", label:"🔄 Status" },
    { id:"notes", label:"📝 Notes" },
    { id:"actions", label:"⚡ Actions" },
  ];

  return (
    <>
      {showEmail && <EmailModal enrollment={e} onClose={() => setShowEmail(false)} toast={toast}/>}
      <div style={{
        width:340, background:C.card, borderLeft:`1px solid ${C.border}`,
        display:"flex", flexDirection:"column", flexShrink:0, overflowY:"auto",
      }}>
        {/* Header */}
        <div style={{ padding:"24px 24px 0", borderBottom:`1px solid ${C.border}`, paddingBottom:20 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div style={{
              width:48, height:48, borderRadius:14, background:`linear-gradient(135deg, ${C.gold}33, ${C.gold}11)`,
              border:`1px solid ${C.gold}44`, display:"flex", alignItems:"center",
              justifyContent:"center", fontSize:20, fontWeight:700, color:C.gold,
            }}>{e.firstName[0]}{e.lastName[0]}</div>
            <button onClick={onClose} style={{ background:"none", border:"none", color:C.textMuted, cursor:"pointer", fontSize:18 }}>✕</button>
          </div>
          <div style={{ marginTop:14 }}>
            <div style={{ fontSize:17, fontWeight:700, color:C.text }}>{e.firstName} {e.lastName}</div>
            <div style={{ fontSize:13, color:C.textMuted, marginTop:2 }}>{e.certificationGoal}</div>
            <div style={{ marginTop:10, display:"inline-flex", alignItems:"center", gap:6,
              background: sc.bg, borderRadius:20, padding:"4px 12px",
            }}>
              <span style={{ color:sc.color, fontSize:11, fontWeight:700 }}>{sc.icon} {sc.label}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", borderBottom:`1px solid ${C.border}`, padding:"0 8px" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex:1, padding:"10px 4px", background:"none", border:"none",
              color: tab===t.id ? C.gold : C.textMuted, fontSize:11, cursor:"pointer",
              borderBottom: tab===t.id ? `2px solid ${C.gold}` : "2px solid transparent",
              fontWeight: tab===t.id ? 700 : 400, transition:"color .2s",
              whiteSpace:"nowrap",
            }}>{t.label}</button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ padding:24, flex:1 }}>
          {tab==="info" && (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              {[
                { icon:"📧", label:"Email", val:e.email, link:`mailto:${e.email}` },
                { icon:"📱", label:"Phone", val:e.phone, link:`https://wa.me/${e.phone.replace(/\D/g,"")}` },
                { icon:"🎯", label:"Goal", val:e.certificationGoal },
                { icon:"📅", label:"Applied", val:`${fmt(e.createdAt)} at ${fmtTime(e.createdAt)}` },
                { icon:"⏱", label:"Time ago", val:timeAgo(e.createdAt) },
              ].map(row => (
                <div key={row.label} style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                  <div style={{ fontSize:16, width:24, flexShrink:0 }}>{row.icon}</div>
                  <div>
                    <div style={{ fontSize:11, color:C.textDim, fontWeight:600, letterSpacing:.5, textTransform:"uppercase" }}>{row.label}</div>
                    {row.link
                      ? <a href={row.link} target="_blank" rel="noreferrer" style={{ color:C.gold, fontSize:13, textDecoration:"none" }}>{row.val}</a>
                      : <div style={{ fontSize:13, color:C.text, marginTop:2 }}>{row.val}</div>
                    }
                  </div>
                </div>
              ))}
              {e.message && (
                <div style={{ marginTop:4, padding:14, background:C.surface, borderRadius:10, border:`1px solid ${C.border}` }}>
                  <div style={{ fontSize:11, color:C.textDim, fontWeight:600, letterSpacing:.5, marginBottom:6 }}>MESSAGE</div>
                  <div style={{ fontSize:13, color:C.textMuted, lineHeight:1.6 }}>{e.message}</div>
                </div>
              )}
            </div>
          )}

          {tab==="status" && (
            <div>
              <div style={{ fontSize:12, color:C.textMuted, fontWeight:600, marginBottom:16, letterSpacing:.5 }}>UPDATE STATUS</div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {Object.entries(STATUS).map(([key, s]) => (
                  <button key={key} onClick={() => updateStatus(key)} style={{
                    display:"flex", alignItems:"center", gap:12, padding:"14px 16px",
                    borderRadius:10, border:`1px solid ${e.status===key ? s.color+"66" : C.border}`,
                    background: e.status===key ? s.bg : "none",
                    cursor:"pointer", transition:"all .2s", textAlign:"left",
                  }}>
                    <span style={{ fontSize:18 }}>{s.icon}</span>
                    <div>
                      <div style={{ fontSize:14, fontWeight:600, color: e.status===key ? s.color : C.text }}>{s.label}</div>
                    </div>
                    {e.status===key && <span style={{ marginLeft:"auto", fontSize:12, color:s.color }}>● Current</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {tab==="notes" && (
            <div>
              <div style={{ fontSize:12, color:C.textMuted, fontWeight:600, marginBottom:10, letterSpacing:.5 }}>INTERNAL NOTES</div>
              <textarea value={notes} onChange={e => setNotes(e.target.value)}
                placeholder="Add notes about this student — follow-up dates, conversation details, preferences..."
                rows={10} style={{
                  width:"100%", padding:14, boxSizing:"border-box",
                  background:C.surface, border:`1px solid ${C.border}`, borderRadius:10,
                  color:C.text, fontSize:13, resize:"none", outline:"none",
                  lineHeight:1.7, fontFamily:"inherit",
                }}
                onFocus={e => e.target.style.border=`1px solid ${C.gold}`}
                onBlur={e => e.target.style.border=`1px solid ${C.border}`}
              />
              <button onClick={saveNotes} disabled={savingNotes} style={{
                marginTop:12, width:"100%", padding:"11px",
                background:`linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
                color:"#0a1220", fontWeight:700, border:"none", borderRadius:8,
                cursor:"pointer", fontSize:14, opacity: savingNotes ? .7 : 1,
              }}>{savingNotes ? "Saving..." : "💾 Save Notes"}</button>
            </div>
          )}

          {tab==="actions" && (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              <button onClick={() => setShowEmail(true)} style={{
                padding:"14px 16px", borderRadius:10, border:`1px solid ${C.border}`,
                background:C.surface, color:C.text, cursor:"pointer",
                fontSize:14, fontWeight:600, textAlign:"left", display:"flex", alignItems:"center", gap:12,
                transition:"border .2s",
              }} onMouseEnter={e => e.currentTarget.style.border=`1px solid ${C.gold}`}
                 onMouseLeave={e => e.currentTarget.style.border=`1px solid ${C.border}`}>
                <span style={{ fontSize:20 }}>📨</span>
                <div>
                  <div>Send Email</div>
                  <div style={{ fontSize:11, color:C.textMuted, marginTop:2 }}>Compose a message to this student</div>
                </div>
              </button>

              <a href={`https://wa.me/${e.phone.replace(/\D/g,"")}`} target="_blank" rel="noreferrer" style={{
                padding:"14px 16px", borderRadius:10, border:`1px solid ${C.border}`,
                background:C.surface, color:C.text, cursor:"pointer",
                fontSize:14, fontWeight:600, textAlign:"left", display:"flex", alignItems:"center", gap:12,
                textDecoration:"none", transition:"border .2s",
              }} onMouseEnter={e => e.currentTarget.style.border=`1px solid ${C.green}`}
                 onMouseLeave={e => e.currentTarget.style.border=`1px solid ${C.border}`}>
                <span style={{ fontSize:20 }}>💬</span>
                <div>
                  <div>WhatsApp</div>
                  <div style={{ fontSize:11, color:C.textMuted, marginTop:2 }}>Open WhatsApp chat</div>
                </div>
              </a>

              <button onClick={print} style={{
                padding:"14px 16px", borderRadius:10, border:`1px solid ${C.border}`,
                background:C.surface, color:C.text, cursor:"pointer",
                fontSize:14, fontWeight:600, textAlign:"left", display:"flex", alignItems:"center", gap:12,
              }}>
                <span style={{ fontSize:20 }}>🖨</span>
                <div>
                  <div>Print Details</div>
                  <div style={{ fontSize:11, color:C.textMuted, marginTop:2 }}>Print enrollment summary</div>
                </div>
              </button>

              <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:10, marginTop:4 }}>
                <button onClick={del} style={{
                  padding:"14px 16px", borderRadius:10, border:`1px solid ${C.redDim}`,
                  background:"none", color:C.red, cursor:"pointer",
                  fontSize:14, fontWeight:600, width:"100%", textAlign:"left",
                  display:"flex", alignItems:"center", gap:12,
                }}>
                  <span style={{ fontSize:20 }}>🗑</span>Delete Enrollment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [enrollments, setEnrollments] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState("list"); // list | analytics | calendar
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState(-1);
  const { toasts, show: toast } = useToast();
  const searchRef = useRef(null);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filter !== "all") params.set("status", filter);
    if (search) params.set("search", search);
    const res = await fetch(`/api/admin/enrollments?${params}`);
    if (res.status === 401) { setAuthed(false); return; }
    const data = await res.json();
    setEnrollments(data.enrollments || []);
    setStats(data.stats || {});
    setLoading(false);
  }, [filter, search]);

  useEffect(() => { if (authed) fetch_(); }, [authed, fetch_]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key==="k") {
        e.preventDefault(); searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const logout = async () => {
    await fetch("/api/admin/login", { method:"DELETE" });
    setAuthed(false);
  };

  const exportCSV = () => {
    const header = ["First Name","Last Name","Email","Phone","Certification","Status","Date","Notes"];
    const rows = enrollments.map(e => [
      e.firstName, e.lastName, e.email, e.phone,
      e.certificationGoal, e.status, fmt(e.createdAt), e.notes||""
    ]);
    const csv = [header, ...rows].map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    a.download = `ifa-enrollments-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    toast("CSV exported!", "success");
  };

  // Chart data
  const monthlyData = (() => {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const now = new Date();
    const last6 = Array.from({length:6}, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth()-5+i, 1);
      return { label: months[d.getMonth()], month: d.getMonth(), year: d.getFullYear(), value: 0 };
    });
    enrollments.forEach(e => {
      const d = new Date(e.createdAt);
      const slot = last6.find(s => s.month===d.getMonth() && s.year===d.getFullYear());
      if (slot) slot.value++;
    });
    return last6;
  })();

  const certData = (() => {
    const counts = {};
    enrollments.forEach(e => { counts[e.certificationGoal] = (counts[e.certificationGoal]||0)+1; });
    return Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,5);
  })();

  const donutData = [
    { label:"New", value: stats.new||0, color:C.blue },
    { label:"Contacted", value: stats.contacted||0, color:C.amber },
    { label:"Enrolled", value: stats.enrolled||0, color:C.green },
    { label:"Cancelled", value: stats.cancelled||0, color:C.red },
  ].filter(d => d.value > 0);

  // Calendar data
  const calendarData = (() => {
    const map = {};
    enrollments.forEach(e => {
      const day = new Date(e.createdAt).toISOString().slice(0,10);
      map[day] = (map[day]||0)+1;
    });
    return map;
  })();

  const calDays = (() => {
    const now = new Date();
    const year = now.getFullYear(), month = now.getMonth();
    const first = new Date(year, month, 1).getDay();
    const days = new Date(year, month+1, 0).getDate();
    return { first, days, year, month };
  })();

  const sorted = [...enrollments].sort((a,b) => {
    const av = a[sortBy], bv = b[sortBy];
    return sortDir * (av < bv ? -1 : av > bv ? 1 : 0);
  });

  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  if (!authed) return <LoginPage onLogin={() => setAuthed(true)} />;

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'Georgia', serif", color:C.text, display:"flex", flexDirection:"column" }}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
        ::-webkit-scrollbar{width:6px;height:6px}
        ::-webkit-scrollbar-track{background:${C.surface}}
        ::-webkit-scrollbar-thumb{background:${C.border};border-radius:3px}
        ::-webkit-scrollbar-thumb:hover{background:${C.borderHover}}
        * { box-sizing:border-box }
      `}</style>

      {/* TOP NAV */}
      <div style={{
        background:C.surface, borderBottom:`1px solid ${C.border}`,
        padding:"0 32px", display:"flex", alignItems:"center", gap:16,
        height:60, flexShrink:0, position:"sticky", top:0, zIndex:100,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginRight:16 }}>
          <div style={{
            width:34, height:34, borderRadius:8,
            background:`linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:16,
          }}>🎓</div>
          <div>
            <div style={{ fontSize:14, fontWeight:700, color:C.text, lineHeight:1 }}>IFA Admin</div>
            <div style={{ fontSize:10, color:C.textMuted }}>Management Portal</div>
          </div>
        </div>

        {/* View tabs */}
        {["list","analytics","calendar"].map(v => (
          <button key={v} onClick={() => setView(v)} style={{
            padding:"6px 16px", borderRadius:20, border:"none",
            background: view===v ? C.goldDim : "none",
            color: view===v ? C.gold : C.textMuted,
            cursor:"pointer", fontSize:13, fontWeight: view===v ? 700 : 400,
            textTransform:"capitalize", transition:"all .2s",
          }}>{v==="list"?"📋 Enrollments":v==="analytics"?"📊 Analytics":"📅 Calendar"}</button>
        ))}

        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:12 }}>
          <button onClick={exportCSV} style={{
            padding:"7px 14px", borderRadius:8, border:`1px solid ${C.border}`,
            background:"none", color:C.textMuted, cursor:"pointer", fontSize:12, fontWeight:600,
          }}>⬇ Export CSV</button>
          <button onClick={logout} style={{
            padding:"7px 14px", borderRadius:8, border:`1px solid ${C.border}`,
            background:"none", color:C.textMuted, cursor:"pointer", fontSize:12,
          }}>Sign out</button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex:1, padding:32, maxWidth:1400, margin:"0 auto", width:"100%", animation:"fadeUp .4s ease" }}>

        {/* STAT CARDS */}
        <div style={{ display:"flex", gap:16, marginBottom:32, flexWrap:"wrap" }}>
          <StatCard icon="👥" label="Total Enrollments" value={stats.total||0} color={C.gold}
            sub="All time" />
          <StatCard icon="✦" label="New Requests" value={stats.new||0} color={C.blue}
            sub="Awaiting contact" />
          <StatCard icon="✉" label="Contacted" value={stats.contacted||0} color={C.amber}
            sub="In progress" />
          <StatCard icon="✓" label="Enrolled" value={stats.enrolled||0} color={C.green}
            sub={`${stats.total ? Math.round((stats.enrolled/stats.total)*100) : 0}% conversion`} />
          <StatCard icon="📅" label="This Week" color={C.purple}
            value={enrollments.filter(e => (Date.now()-new Date(e.createdAt))<7*86400000).length}
            sub="New applications" />
        </div>

        {/* ─── LIST VIEW ─── */}
        {view==="list" && (
          <div style={{ display:"flex", gap:20, height:"calc(100vh - 280px)", minHeight:400 }}>
            {/* Table */}
            <div style={{ flex:1, display:"flex", flexDirection:"column", background:C.card, borderRadius:16, border:`1px solid ${C.border}`, overflow:"hidden" }}>
              {/* Filters bar */}
              <div style={{ padding:"16px 20px", borderBottom:`1px solid ${C.border}`, display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
                <div style={{ display:"flex", gap:6 }}>
                  {["all","new","contacted","enrolled","cancelled"].map(s => {
                    const sc = s==="all" ? null : STATUS[s];
                    return (
                      <button key={s} onClick={() => setFilter(s)} style={{
                        padding:"6px 14px", borderRadius:20, border:"none", cursor:"pointer",
                        fontSize:12, fontWeight:600, textTransform:"capitalize",
                        background: filter===s ? (sc ? sc.bg : C.goldDim) : "none",
                        color: filter===s ? (sc ? sc.color : C.gold) : C.textMuted,
                        transition:"all .2s",
                      }}>{s} {s!=="all" && stats[s] ? `(${stats[s]})` : ""}</button>
                    );
                  })}
                </div>
                <div style={{ marginLeft:"auto", display:"flex", gap:8, alignItems:"center" }}>
                  <div style={{ position:"relative" }}>
                    <input ref={searchRef} placeholder="Search... (Ctrl+K)"
                      value={search} onChange={e => setSearch(e.target.value)}
                      style={{
                        padding:"7px 14px 7px 34px", borderRadius:8,
                        border:`1px solid ${C.border}`, background:C.surface,
                        color:C.text, fontSize:13, outline:"none", width:220,
                      }}
                      onFocus={e => e.target.style.border=`1px solid ${C.gold}`}
                      onBlur={e => e.target.style.border=`1px solid ${C.border}`}
                    />
                    <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:C.textDim, fontSize:14 }}>🔍</span>
                  </div>
                  <button onClick={fetch_} style={{
                    padding:"7px 12px", borderRadius:8, border:`1px solid ${C.border}`,
                    background:"none", color:C.textMuted, cursor:"pointer", fontSize:13,
                  }}>↻</button>
                </div>
              </div>

              {/* Table body */}
              <div style={{ overflowY:"auto", flex:1 }}>
                {loading ? (
                  <div style={{ padding:60, textAlign:"center", color:C.textMuted }}>
                    <div style={{ fontSize:32, marginBottom:12 }}>⌛</div>Loading enrollments...
                  </div>
                ) : sorted.length === 0 ? (
                  <div style={{ padding:60, textAlign:"center", color:C.textMuted }}>
                    <div style={{ fontSize:48, marginBottom:12 }}>📭</div>
                    No enrollments found
                    {search && <div style={{ fontSize:13, marginTop:8, color:C.textDim }}>Try a different search</div>}
                  </div>
                ) : (
                  <table style={{ width:"100%", borderCollapse:"collapse" }}>
                    <thead style={{ position:"sticky", top:0, zIndex:1 }}>
                      <tr style={{ background:C.surface }}>
                        {[
                          { key:"firstName", label:"Student" },
                          { key:"certificationGoal", label:"Certification" },
                          { key:"phone", label:"Contact" },
                          { key:"status", label:"Status" },
                          { key:"createdAt", label:"Applied" },
                        ].map(col => (
                          <th key={col.key} onClick={() => { setSortBy(col.key); setSortDir(sortBy===col.key ? -sortDir : -1); }}
                            style={{
                              padding:"11px 16px", textAlign:"left", fontSize:11, color:C.textMuted,
                              fontWeight:700, letterSpacing:.8, textTransform:"uppercase", cursor:"pointer",
                              userSelect:"none", whiteSpace:"nowrap",
                            }}>
                            {col.label} {sortBy===col.key && (sortDir===-1 ? "↓" : "↑")}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sorted.map((e, i) => {
                        const sc = STATUS[e.status];
                        const isSelected = selected?._id===e._id;
                        return (
                          <tr key={e._id}
                            onClick={() => setSelected(isSelected ? null : e)}
                            style={{
                              borderBottom:`1px solid ${C.border}22`, cursor:"pointer",
                              background: isSelected ? `${C.gold}08` : "transparent",
                              transition:"background .15s",
                            }}
                            onMouseEnter={ev => { if(!isSelected) ev.currentTarget.style.background=C.surface; }}
                            onMouseLeave={ev => { ev.currentTarget.style.background = isSelected ? `${C.gold}08` : "transparent"; }}
                          >
                            <td style={{ padding:"13px 16px" }}>
                              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                                <div style={{
                                  width:34, height:34, borderRadius:10, flexShrink:0,
                                  background:`linear-gradient(135deg, ${C.gold}22, ${C.gold}08)`,
                                  border:`1px solid ${C.gold}22`, display:"flex", alignItems:"center",
                                  justifyContent:"center", fontSize:12, fontWeight:700, color:C.gold,
                                }}>{e.firstName[0]}{e.lastName[0]}</div>
                                <div>
                                  <div style={{ fontSize:14, fontWeight:600, color:C.text }}>{e.firstName} {e.lastName}</div>
                                  <div style={{ fontSize:12, color:C.textMuted }}>{e.email}</div>
                                </div>
                              </div>
                            </td>
                            <td style={{ padding:"13px 16px" }}>
                              <span style={{
                                fontSize:12, fontWeight:600, color:C.gold,
                                background:C.goldDim, padding:"3px 10px", borderRadius:20,
                              }}>{e.certificationGoal}</span>
                            </td>
                            <td style={{ padding:"13px 16px", fontSize:13, color:C.textMuted }}>{e.phone}</td>
                            <td style={{ padding:"13px 16px" }}>
                              <span style={{
                                fontSize:11, fontWeight:700, background:sc.bg, color:sc.color,
                                padding:"4px 10px", borderRadius:20, whiteSpace:"nowrap",
                              }}>{sc.icon} {sc.label}</span>
                            </td>
                            <td style={{ padding:"13px 16px" }}>
                              <div style={{ fontSize:12, color:C.textMuted }}>{fmt(e.createdAt)}</div>
                              <div style={{ fontSize:11, color:C.textDim }}>{timeAgo(e.createdAt)}</div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Footer */}
              <div style={{ padding:"10px 20px", borderTop:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div style={{ fontSize:12, color:C.textDim }}>{sorted.length} enrollment{sorted.length!==1?"s":""} shown</div>
                <div style={{ fontSize:11, color:C.textDim }}>Click a row to view details</div>
              </div>
            </div>

            {/* Detail panel */}
            {selected && (
              <DetailPanel
                e={selected}
                onClose={() => setSelected(null)}
                onUpdate={(updated) => {
                  setEnrollments(prev => prev.map(x => x._id===updated._id ? updated : x));
                  setSelected(updated);
                }}
                onDelete={(id) => setEnrollments(prev => prev.filter(x => x._id!==id))}
                toast={toast}
              />
            )}
          </div>
        )}

        {/* ─── ANALYTICS VIEW ─── */}
        {view==="analytics" && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
            {/* Monthly trend */}
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:24 }}>
              <div style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:4 }}>Monthly Enrollments</div>
              <div style={{ fontSize:12, color:C.textMuted, marginBottom:20 }}>Last 6 months trend</div>
              <BarChart data={monthlyData} />
            </div>

            {/* Status donut */}
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:24 }}>
              <div style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:4 }}>Enrollment Status</div>
              <div style={{ fontSize:12, color:C.textMuted, marginBottom:20 }}>Current breakdown</div>
              <div style={{ display:"flex", gap:24, alignItems:"center" }}>
                <DonutChart data={donutData} size={130} />
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {donutData.map(d => (
                    <div key={d.label} style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{ width:10, height:10, borderRadius:"50%", background:d.color, flexShrink:0 }}/>
                      <div style={{ fontSize:13, color:C.textMuted }}>{d.label}</div>
                      <div style={{ fontSize:13, fontWeight:700, color:C.text, marginLeft:"auto", paddingLeft:12 }}>{d.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Certification popularity */}
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:24, gridColumn:"1 / -1" }}>
              <div style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:4 }}>Certification Popularity</div>
              <div style={{ fontSize:12, color:C.textMuted, marginBottom:20 }}>Most requested programs</div>
              {certData.length === 0 ? (
                <div style={{ color:C.textDim, fontSize:13, textAlign:"center", padding:20 }}>No data yet</div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {certData.map(([cert, count], i) => {
                    const pct = Math.round((count / (stats.total||1)) * 100);
                    const colors = [C.gold, C.blue, C.green, C.amber, C.purple];
                    return (
                      <div key={cert} style={{ display:"flex", alignItems:"center", gap:14 }}>
                        <div style={{ fontSize:13, color:C.textMuted, width:28, textAlign:"right", flexShrink:0 }}>#{i+1}</div>
                        <div style={{ fontSize:13, fontWeight:600, color:C.text, width:140, flexShrink:0 }}>{cert}</div>
                        <div style={{ flex:1, height:8, background:C.surface, borderRadius:4, overflow:"hidden" }}>
                          <div style={{
                            height:"100%", width:`${pct}%`, borderRadius:4,
                            background:`linear-gradient(90deg, ${colors[i]}, ${colors[i]}88)`,
                            transition:"width .8s ease",
                          }}/>
                        </div>
                        <div style={{ fontSize:13, color:colors[i], fontWeight:700, width:50, textAlign:"right" }}>{count} ({pct}%)</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Conversion funnel */}
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:24 }}>
              <div style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:4 }}>Conversion Funnel</div>
              <div style={{ fontSize:12, color:C.textMuted, marginBottom:20 }}>Student journey stages</div>
              {[
                { label:"Applications received", value:stats.total||0, color:C.blue },
                { label:"Contacted by team", value:(stats.contacted||0)+(stats.enrolled||0), color:C.amber },
                { label:"Successfully enrolled", value:stats.enrolled||0, color:C.green },
              ].map((s, i) => {
                const pct = stats.total ? Math.round((s.value/stats.total)*100) : 0;
                return (
                  <div key={s.label} style={{ marginBottom:16 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                      <div style={{ fontSize:13, color:C.textMuted }}>{s.label}</div>
                      <div style={{ fontSize:13, fontWeight:700, color:s.color }}>{s.value} ({pct}%)</div>
                    </div>
                    <div style={{ height:6, background:C.surface, borderRadius:3, overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${pct}%`, background:s.color, borderRadius:3, transition:"width .8s ease" }}/>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recent activity */}
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:24 }}>
              <div style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:4 }}>Recent Activity</div>
              <div style={{ fontSize:12, color:C.textMuted, marginBottom:20 }}>Latest enrollments</div>
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {enrollments.slice(0,6).map(e => {
                  const sc = STATUS[e.status];
                  return (
                    <div key={e._id} style={{ display:"flex", alignItems:"center", gap:12 }}>
                      <div style={{
                        width:32, height:32, borderRadius:8, background:sc.bg,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:12, fontWeight:700, color:sc.color, flexShrink:0,
                      }}>{e.firstName[0]}{e.lastName[0]}</div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:13, fontWeight:600, color:C.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                          {e.firstName} {e.lastName}
                        </div>
                        <div style={{ fontSize:11, color:C.textMuted }}>{e.certificationGoal}</div>
                      </div>
                      <div style={{ fontSize:11, color:C.textDim, flexShrink:0 }}>{timeAgo(e.createdAt)}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ─── CALENDAR VIEW ─── */}
        {view==="calendar" && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:20 }}>
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:28 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
                <div style={{ fontSize:20, fontWeight:700, color:C.text }}>
                  {MONTHS[calDays.month]} {calDays.year}
                </div>
                <div style={{ fontSize:13, color:C.textMuted }}>Enrollment calendar</div>
              </div>
              {/* Day headers */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4, marginBottom:8 }}>
                {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
                  <div key={d} style={{ textAlign:"center", fontSize:11, color:C.textDim, fontWeight:600, padding:"4px 0" }}>{d}</div>
                ))}
              </div>
              {/* Days grid */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4 }}>
                {Array.from({ length: calDays.first }, (_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: calDays.days }, (_, i) => {
                  const day = i + 1;
                  const dateStr = `${calDays.year}-${String(calDays.month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
                  const count = calendarData[dateStr] || 0;
                  const isToday = new Date().toISOString().slice(0,10) === dateStr;
                  return (
                    <div key={day} style={{
                      aspectRatio:"1", display:"flex", flexDirection:"column",
                      alignItems:"center", justifyContent:"center", borderRadius:10,
                      background: isToday ? C.goldDim : count > 0 ? `${C.blue}15` : C.surface,
                      border: isToday ? `1px solid ${C.gold}66` : `1px solid ${C.border}33`,
                      cursor: count > 0 ? "pointer" : "default",
                      transition:"background .15s",
                    }}>
                      <div style={{ fontSize:13, fontWeight: isToday ? 700 : 400, color: isToday ? C.gold : C.text }}>{day}</div>
                      {count > 0 && (
                        <div style={{
                          width:20, height:14, borderRadius:7, background:C.blue,
                          fontSize:9, fontWeight:700, color:"#fff",
                          display:"flex", alignItems:"center", justifyContent:"center",
                          marginTop:2,
                        }}>{count}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Calendar sidebar */}
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:24 }}>
              <div style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:4 }}>This Month</div>
              <div style={{ fontSize:12, color:C.textMuted, marginBottom:20 }}>
                {enrollments.filter(e => {
                  const d = new Date(e.createdAt);
                  return d.getMonth()===calDays.month && d.getFullYear()===calDays.year;
                }).length} new enrollments
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:10, maxHeight:500, overflowY:"auto" }}>
                {enrollments
                  .filter(e => {
                    const d = new Date(e.createdAt);
                    return d.getMonth()===calDays.month && d.getFullYear()===calDays.year;
                  })
                  .sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt))
                  .map(e => {
                    const sc = STATUS[e.status];
                    return (
                      <div key={e._id} onClick={() => { setView("list"); setSelected(e); }}
                        style={{
                          padding:"12px 14px", borderRadius:10, border:`1px solid ${C.border}`,
                          cursor:"pointer", transition:"border .15s",
                          background:C.surface,
                        }}
                        onMouseEnter={ev => ev.currentTarget.style.border=`1px solid ${C.gold}`}
                        onMouseLeave={ev => ev.currentTarget.style.border=`1px solid ${C.border}`}
                      >
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                          <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{e.firstName} {e.lastName}</div>
                          <span style={{ fontSize:10, fontWeight:700, background:sc.bg, color:sc.color, padding:"2px 8px", borderRadius:10 }}>{sc.label}</span>
                        </div>
                        <div style={{ fontSize:11, color:C.textMuted, marginTop:4 }}>{e.certificationGoal}</div>
                        <div style={{ fontSize:11, color:C.textDim, marginTop:4 }}>
                          {new Date(e.createdAt).getDate()} {MONTHS[new Date(e.createdAt).getMonth()]}
                        </div>
                      </div>
                    );
                  })
                }
              </div>
            </div>
          </div>
        )}
      </div>

      <Toasts toasts={toasts} />
    </div>
  );
}
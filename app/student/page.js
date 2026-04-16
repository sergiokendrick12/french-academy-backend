"use client";
import { useState, useEffect } from "react";

/* ─────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:       #0b0e1a;
  --bg2:      #111527;
  --bg3:      #161b30;
  --border:   rgba(255,255,255,0.07);
  --border2:  rgba(255,255,255,0.12);
  --text:     #f0f2ff;
  --text2:    #9aa0be;
  --text3:    #5a6080;

  /* card gradients */
  --g-purple: linear-gradient(135deg, #2a1f5e 0%, #3d2b8a 100%);
  --g-teal:   linear-gradient(135deg, #0d3d35 0%, #0f5e4e 100%);
  --g-rose:   linear-gradient(135deg, #3d1028 0%, #621840 100%);
  --g-blue:   linear-gradient(135deg, #0f2a50 0%, #163d7a 100%);
  --g-amber:  linear-gradient(135deg, #3a1f00 0%, #5e3500 100%);
  --g-green:  linear-gradient(135deg, #0d3320 0%, #0f4d2e 100%);

  /* accent colours */
  --purple: #9b8dff;
  --teal:   #2dd4bf;
  --rose:   #fb7aac;
  --blue:   #60a5fa;
  --amber:  #fbbf24;
  --green:  #4ade80;
  --gold:   #c9a843;
}

* { font-family: 'DM Sans', sans-serif; }

body { background: var(--bg); color: var(--text); min-height: 100vh; }

/* ── SCROLLBAR ── */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }

/* ── LOGIN ── */
.login-wrap {
  min-height: 100vh;
  background: var(--bg);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.login-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
}
.login-glow.a { width: 400px; height: 400px; background: rgba(155,141,255,0.12); top: -100px; left: -100px; }
.login-glow.b { width: 300px; height: 300px; background: rgba(45,212,191,0.08); bottom: -50px; right: -50px; }

.tricolor { position: absolute; top: 0; left: 0; right: 0; height: 3px; display: flex; }
.tc1 { flex: 1; background: #002395; }
.tc2 { flex: 1; background: #ffffff; }
.tc3 { flex: 1; background: #ED2939; }

.login-card {
  background: var(--bg2);
  border: 1px solid var(--border2);
  border-radius: 24px;
  padding: 44px 40px;
  width: 100%;
  max-width: 420px;
  position: relative;
  z-index: 1;
}

.login-logo-ring {
  width: 70px; height: 70px; border-radius: 50%;
  background: rgba(155,141,255,0.1);
  border: 2px solid rgba(155,141,255,0.3);
  display: flex; align-items: center; justify-content: center;
  font-size: 30px;
  margin: 0 auto 20px;
}

.login-title {
  font-family: 'Sora', sans-serif;
  font-size: 26px; font-weight: 800;
  color: var(--text);
  text-align: center;
  margin-bottom: 6px;
}

.login-sub {
  font-size: 11px; color: var(--text3);
  text-align: center; letter-spacing: 1.5px;
  text-transform: uppercase;
  margin-bottom: 32px;
}

.login-flag {
  display: flex; align-items: center; gap: 6px;
  justify-content: center;
  margin-bottom: 28px;
}
.login-flag span { font-size: 11px; color: var(--text3); letter-spacing: 0.5px; }
.flag-bar { height: 10px; border-radius: 2px; }

.login-lbl {
  font-size: 10px; font-weight: 600;
  letter-spacing: 1.5px; text-transform: uppercase;
  color: var(--text3); margin-bottom: 8px;
}

.login-in {
  width: 100%; padding: 13px 16px;
  background: rgba(255,255,255,0.05);
  border: 1px solid var(--border2);
  border-radius: 10px;
  color: var(--text); font-size: 14px;
  outline: none; margin-bottom: 18px;
  transition: border-color .2s;
}
.login-in:focus { border-color: var(--purple); }
.login-in::placeholder { color: var(--text3); }

.login-err {
  font-size: 12px; color: var(--rose);
  margin-bottom: 12px; text-align: center;
}

.login-btn {
  width: 100%; padding: 14px;
  background: linear-gradient(135deg, #7c6fff, #9b8dff);
  color: #fff;
  border: none; border-radius: 10px;
  font-family: 'Sora', sans-serif;
  font-size: 14px; font-weight: 700;
  cursor: pointer; letter-spacing: 0.3px;
  transition: opacity .2s, transform .2s;
}
.login-btn:hover { opacity: 0.9; transform: translateY(-1px); }
.login-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

.login-note {
  font-size: 11px; color: var(--text3);
  text-align: center; margin-top: 14px;
}

/* ── NAV ── */
.pnav {
  background: var(--bg2);
  border-bottom: 1px solid var(--border);
  height: 62px; padding: 0 28px;
  display: flex; align-items: center; justify-content: space-between;
  position: sticky; top: 0; z-index: 100;
}

.pnav-logo { display: flex; align-items: center; gap: 12px; }
.pnav-ifa {
  width: 40px; height: 40px; border-radius: 10px;
  background: linear-gradient(135deg, #7c6fff, #9b8dff);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 800; color: #fff;
}
.pnav-name {
  font-family: 'Sora', sans-serif;
  font-size: 14px; font-weight: 700; color: var(--text);
}
.pnav-sub { font-size: 10px; color: var(--text3); letter-spacing: 1px; text-transform: uppercase; }

.pnav-right { display: flex; align-items: center; gap: 10px; }

.student-chip {
  display: flex; align-items: center; gap: 8px;
  background: rgba(155,141,255,0.1);
  border: 1px solid rgba(155,141,255,0.2);
  border-radius: 999px; padding: 6px 14px 6px 8px;
}
.student-avatar {
  width: 28px; height: 28px; border-radius: 50%;
  background: linear-gradient(135deg, #7c6fff, #fb7aac);
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700; color: #fff;
}
.student-chip-name { font-size: 13px; font-weight: 500; color: var(--text); }

.logout-btn {
  background: rgba(255,255,255,0.05);
  border: 1px solid var(--border2);
  color: var(--text2); padding: 8px 18px;
  border-radius: 8px; font-size: 12px; font-weight: 500;
  cursor: pointer; font-family: 'DM Sans', sans-serif;
  transition: background .2s;
}
.logout-btn:hover { background: rgba(255,255,255,0.1); color: var(--text); }

/* ── MAIN CONTENT ── */
.pcontent { max-width: 940px; margin: 0 auto; padding: 28px 20px 60px; }

/* ── ANNOUNCEMENT ── */
.ann-bar {
  border-radius: 14px; padding: 14px 18px;
  display: flex; align-items: flex-start; gap: 12px;
  margin-bottom: 16px;
  border-left: 3px solid;
}
.ann-ico { font-size: 17px; flex-shrink: 0; margin-top: 1px; }
.ann-title-txt { font-size: 13px; font-weight: 700; margin-bottom: 3px; }
.ann-body-txt { font-size: 12px; line-height: 1.6; color: var(--text2); }
.ann-date-txt { font-size: 10px; margin-top: 5px; opacity: 0.6; }

/* ── WELCOME ── */
.welcome-card {
  background: linear-gradient(135deg, #1c1652 0%, #271e7a 45%, #1c2e5e 100%);
  border: 1px solid rgba(155,141,255,0.2);
  border-radius: 18px; padding: 24px 28px;
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 20px; position: relative; overflow: hidden;
}
.welcome-card::before {
  content: ''; position: absolute;
  right: -60px; top: -60px;
  width: 200px; height: 200px; border-radius: 50%;
  background: rgba(155,141,255,0.08);
}
.welcome-card::after {
  content: ''; position: absolute;
  right: 60px; bottom: -40px;
  width: 120px; height: 120px; border-radius: 50%;
  background: rgba(45,212,191,0.06);
}
.welcome-hi {
  font-family: 'Sora', sans-serif;
  font-size: 24px; font-weight: 800;
  color: var(--text); margin-bottom: 8px;
}
.welcome-meta { display: flex; flex-wrap: wrap; gap: 16px; }
.welcome-meta span {
  font-size: 12px; color: rgba(255,255,255,0.5);
  display: flex; align-items: center; gap: 5px;
}
.enrolled-pill {
  background: rgba(74,222,128,0.12);
  border: 1px solid rgba(74,222,128,0.25);
  color: var(--green);
  padding: 8px 18px; border-radius: 999px;
  font-size: 12px; font-weight: 700;
  display: flex; align-items: center; gap: 7px;
  white-space: nowrap; z-index: 1;
  flex-shrink: 0;
}
.e-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--green); }

/* STATUS PILLS */
.s-new      { color: #60a5fa; background: rgba(96,165,250,.12); border: 1px solid rgba(96,165,250,.2); }
.s-contacted{ color: #fbbf24; background: rgba(251,191,36,.12);  border: 1px solid rgba(251,191,36,.2); }
.s-enrolled { color: #4ade80; background: rgba(74,222,128,.12);  border: 1px solid rgba(74,222,128,.2); }
.s-cancelled{ color: #fb7aac; background: rgba(251,122,172,.12); border: 1px solid rgba(251,122,172,.2); }

/* ── TABS ── */
.tabs-row {
  display: flex; gap: 4px;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 14px; padding: 5px;
  margin-bottom: 22px; overflow-x: auto;
}
.tab-btn {
  flex: 1; min-width: 100px;
  padding: 9px 14px; border-radius: 10px; border: none;
  font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500;
  cursor: pointer; white-space: nowrap;
  transition: all .18s; color: var(--text3); background: transparent;
}
.tab-btn.active {
  background: linear-gradient(135deg, #7c6fff, #9b8dff);
  color: #fff;
}
.tab-btn:hover:not(.active) { color: var(--text); background: rgba(255,255,255,0.05); }

/* ── STAT CARDS ── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px; margin-bottom: 16px;
}

.stat-card {
  border-radius: 16px; padding: 20px;
  position: relative; overflow: hidden;
  border: 1px solid rgba(255,255,255,0.07);
  cursor: default;
  transition: transform .2s;
}
.stat-card:hover { transform: translateY(-3px); }

.stat-card.purple { background: var(--g-purple); }
.stat-card.teal   { background: var(--g-teal);   }
.stat-card.rose   { background: var(--g-rose);   }
.stat-card.blue   { background: var(--g-blue);   }
.stat-card.amber  { background: var(--g-amber);  }
.stat-card.green  { background: var(--g-green);  }

.stat-ico { font-size: 22px; margin-bottom: 12px; }
.stat-lbl {
  font-size: 9px; letter-spacing: 1.8px;
  text-transform: uppercase; color: rgba(255,255,255,0.45);
  margin-bottom: 6px;
}
.stat-val {
  font-family: 'Sora', sans-serif;
  font-size: 26px; font-weight: 800;
  margin-bottom: 4px; line-height: 1;
}
.stat-card.purple .stat-val { color: var(--purple); }
.stat-card.teal   .stat-val { color: var(--teal);   }
.stat-card.rose   .stat-val { color: var(--rose);   }
.stat-card.blue   .stat-val { color: var(--blue);   }
.stat-card.amber  .stat-val { color: var(--amber);  }
.stat-card.green  .stat-val { color: var(--green);  }

.stat-sub { font-size: 11px; color: rgba(255,255,255,0.35); }

/* ── BOTTOM GRID ── */
.bottom-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

/* ── SECTION CARD ── */
.section {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 16px; padding: 22px;
  margin-bottom: 14px;
}
.section-title {
  font-family: 'Sora', sans-serif;
  font-size: 15px; font-weight: 700;
  color: var(--text); margin-bottom: 4px;
}
.section-sub { font-size: 12px; color: var(--text3); margin-bottom: 18px; }

/* ── HELP CARD ── */
.help-card {
  background: linear-gradient(135deg, #0d2e1a, #0f4228);
  border: 1px solid rgba(74,222,128,0.15);
  border-radius: 16px; padding: 22px;
}
.help-btns { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 14px; }
.btn-wa {
  background: #25D366; color: #fff;
  border: none; padding: 10px 20px; border-radius: 8px;
  font-size: 13px; font-weight: 700; cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  display: flex; align-items: center; gap: 6px;
  transition: opacity .2s;
}
.btn-wa:hover { opacity: 0.85; }
.btn-email {
  background: rgba(155,141,255,0.15); color: var(--purple);
  border: 1px solid rgba(155,141,255,0.25);
  padding: 10px 20px; border-radius: 8px;
  font-size: 13px; font-weight: 700; cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  display: flex; align-items: center; gap: 6px;
  transition: background .2s;
}
.btn-email:hover { background: rgba(155,141,255,0.22); }

/* ── SCHEDULE LIST ── */
.sched-item {
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 12px; padding: 14px 18px;
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 10px; gap: 12px;
}
.sched-day { font-size: 10px; color: var(--purple); font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 3px; }
.sched-name { font-size: 14px; font-weight: 600; color: var(--text); }
.sched-meta { font-size: 11px; color: var(--text3); margin-top: 3px; }

/* ── TABLE ── */
.tbl-head {
  display: grid; padding: 8px 14px;
  font-size: 10px; font-weight: 600;
  letter-spacing: 1.2px; text-transform: uppercase;
  color: var(--text3); margin-bottom: 4px;
}
.tbl-row {
  display: grid;
  background: var(--bg3); border: 1px solid var(--border);
  border-radius: 10px; padding: 12px 14px;
  margin-bottom: 6px; align-items: center;
  font-size: 13px; color: var(--text);
}

/* ── PILL ── */
.pill {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 4px 10px; border-radius: 999px;
  font-size: 11px; font-weight: 600;
}
.pdot { width: 5px; height: 5px; border-radius: 50%; }

/* ── MINI STATS ── */
.mini-stats { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 18px; }
.mini-stat {
  background: var(--bg3); border: 1px solid var(--border);
  border-radius: 10px; padding: 12px 18px; text-align: center;
}
.mini-stat-val {
  font-family: 'Sora', sans-serif; font-size: 20px; font-weight: 800;
  margin-bottom: 2px;
}
.mini-stat-lbl { font-size: 10px; color: var(--text3); text-transform: uppercase; letter-spacing: 1px; }

/* ── EMPTY STATE ── */
.empty-state {
  text-align: center; padding: 40px 20px; color: var(--text3);
}
.empty-ico { font-size: 36px; margin-bottom: 12px; opacity: 0.5; }
.empty-state p { font-size: 14px; }

/* ── MSG CARD ── */
.msg-card {
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 16px; padding: 22px;
}
.msg-text { font-size: 15px; color: var(--text2); font-style: italic; line-height: 1.6; }

/* ── MOBILE ── */
@media (max-width: 640px) {
  .stats-grid  { grid-template-columns: 1fr 1fr; }
  .bottom-grid { grid-template-columns: 1fr; }
  .pcontent    { padding: 16px 12px 40px; }
  .pnav        { padding: 0 14px; }
  .welcome-hi  { font-size: 18px; }
  .tab-btn     { font-size: 11px; padding: 8px 10px; min-width: 80px; }
}
@media (max-width: 400px) {
  .stats-grid { grid-template-columns: 1fr; }
}
`;

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
const STATUS_MAP = {
  new:       { color:"#60a5fa", bg:"rgba(96,165,250,.12)",   border:"rgba(96,165,250,.25)",   label:"New"       },
  contacted: { color:"#fbbf24", bg:"rgba(251,191,36,.12)",   border:"rgba(251,191,36,.25)",   label:"Contacted" },
  enrolled:  { color:"#4ade80", bg:"rgba(74,222,128,.12)",   border:"rgba(74,222,128,.25)",   label:"Enrolled"  },
  cancelled: { color:"#fb7aac", bg:"rgba(251,122,172,.12)",  border:"rgba(251,122,172,.25)",  label:"Cancelled" },
};
const PAY_MAP = {
  paid:    { color:"#4ade80", bg:"rgba(74,222,128,.12)",  label:"Paid"    },
  pending: { color:"#fbbf24", bg:"rgba(251,191,36,.12)",  label:"Pending" },
  partial: { color:"#9b8dff", bg:"rgba(155,141,255,.12)", label:"Partial" },
  waived:  { color:"#94a3b8", bg:"rgba(148,163,184,.10)", label:"Waived"  },
};
const ATT_MAP = {
  present: { color:"#4ade80", bg:"rgba(74,222,128,.12)",  label:"Present" },
  absent:  { color:"#fb7aac", bg:"rgba(251,122,172,.12)", label:"Absent"  },
  late:    { color:"#fbbf24", bg:"rgba(251,191,36,.12)",  label:"Late"    },
};

function Pill({ status, map }) {
  const s = map[status] || Object.values(map)[0];
  return (
    <span className="pill" style={{ background: s.bg, color: s.color }}>
      <span className="pdot" style={{ background: s.color }} />
      {s.label}
    </span>
  );
}

function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" });
}

function initials(first, last) {
  return `${(first||"")[0]||""}${(last||"")[0]||""}`.toUpperCase();
}

/* ─────────────────────────────────────────────
   ANNOUNCEMENT BANNER
───────────────────────────────────────────── */
const ANN_STYLES = {
  info:    { color:"#60a5fa", bg:"rgba(96,165,250,.08)",   border:"rgba(96,165,250,.25)",   ico:"ℹ️"  },
  warning: { color:"#fbbf24", bg:"rgba(251,191,36,.08)",   border:"rgba(251,191,36,.25)",   ico:"⚠️"  },
  success: { color:"#4ade80", bg:"rgba(74,222,128,.08)",   border:"rgba(74,222,128,.25)",   ico:"✅"  },
  urgent:  { color:"#fb7aac", bg:"rgba(251,122,172,.08)",  border:"rgba(251,122,172,.25)",  ico:"🚨"  },
};

function AnnouncementBar({ a }) {
  const c = ANN_STYLES[a.type] || ANN_STYLES.info;
  return (
    <div className="ann-bar" style={{ background: c.bg, borderColor: c.border }}>
      <span className="ann-ico">{c.ico}</span>
      <div style={{ flex: 1 }}>
        <div className="ann-title-txt" style={{ color: c.color }}>{a.title}</div>
        <div className="ann-body-txt">{a.message}</div>
        <div className="ann-date-txt">📅 {fmtDate(a.createdAt)}</div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function StudentPortal() {
  const [student, setStudent]           = useState(null);
  const [data, setData]                 = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [email, setEmail]               = useState("");
  const [loading, setLoading]           = useState(false);
  const [err, setErr]                   = useState("");
  const [tab, setTab]                   = useState("overview");

  /* ── AUTH ── */
  const login = async () => {
    if (!email.trim()) return;
    setLoading(true); setErr("");
    try {
      const r = await fetch("/api/student/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const d = await r.json();
      if (d.success) {
        setStudent(d.student);
        fetchData(d.student._id);
        fetchAnnouncements();
      } else {
        setErr(d.error || "Student not found. Please check your email.");
      }
    } catch {
      setErr("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async (studentId) => {
    try {
      const r = await fetch("/api/student/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId }),
      });
      const d = await r.json();
      if (d.success) setData(d);
    } catch {}
  };

  const fetchAnnouncements = async () => {
    try {
      const r = await fetch("/api/admin/announcements");
      const d = await r.json();
      setAnnouncements(
        (d.announcements || []).filter(
          (a) => a.active && (a.audience === "all" || a.audience === "students")
        )
      );
    } catch {}
  };

  const logout = () => {
    setStudent(null); setData(null);
    setEmail(""); setTab("overview");
  };

  /* ── DERIVED DATA ── */
  const totalPaid    = data?.payments?.filter(p => p.status === "paid").reduce((a, p) => a + p.amount, 0) || 0;
  const totalPending = data?.payments?.filter(p => p.status === "pending").reduce((a, p) => a + p.amount, 0) || 0;
  const certCount    = data?.certifications?.length || 0;
  const passRate     = certCount > 0
    ? Math.round((data.certifications.filter(c => c.passed).length / certCount) * 100)
    : null;
  const attTotal     = data?.attendance?.length || 0;
  const attPresent   = data?.attendance?.filter(a => a.status === "present").length || 0;
  const attendanceRate = attTotal > 0 ? Math.round((attPresent / attTotal) * 100) : null;

  /* ── LOGIN SCREEN ── */
  if (!student) return (
    <>
      <style>{CSS}</style>
      <div className="login-wrap">
        <div className="tricolor"><div className="tc1"/><div className="tc2"/><div className="tc3"/></div>
        <div className="login-glow a" />
        <div className="login-glow b" />

        <div className="login-card">
          <div className="login-logo-ring">🎓</div>
          <h1 className="login-title">Student Portal</h1>
          <p className="login-sub">International French Academy</p>

          <div className="login-flag">
            <div className="flag-bar" style={{ width:18, background:"#002395" }} />
            <div className="flag-bar" style={{ width:18, background:"#fff"    }} />
            <div className="flag-bar" style={{ width:18, background:"#ED2939" }} />
            <span>France · Rwanda</span>
          </div>

          <div className="login-lbl">Your Email Address</div>
          <input
            className="login-in"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && login()}
          />

          {err && <p className="login-err">⚠️ {err}</p>}

          <button className="login-btn" onClick={login} disabled={loading}>
            {loading ? "Checking…" : "Access My Portal →"}
          </button>
          <p className="login-note">Enter the email address you used when enrolling</p>
        </div>
      </div>
    </>
  );

  /* ── STATUS STYLE ── */
  const ss = STATUS_MAP[student.status] || STATUS_MAP.new;

  /* ── TABS CONFIG ── */
  const TABS = [
    { id:"overview",       label:"🏠 Overview"       },
    { id:"schedule",       label:"📅 Schedule"       },
    { id:"payments",       label:"💳 Payments"       },
    { id:"certifications", label:"🏆 Certifications" },
    { id:"attendance",     label:"📋 Attendance"     },
  ];

  /* ── PORTAL ── */
  return (
    <>
      <style>{CSS}</style>
      <div style={{ background:"var(--bg)", minHeight:"100vh" }}>

        {/* NAV */}
        <nav className="pnav">
          <div className="pnav-logo">
            <div className="pnav-ifa">IFA</div>
            <div>
              <div className="pnav-name">International French Academy</div>
              <div className="pnav-sub">Student Portal</div>
            </div>
          </div>
          <div className="pnav-right">
            <div className="student-chip">
              <div className="student-avatar">
                {initials(student.firstName, student.lastName)}
              </div>
              <span className="student-chip-name">
                {student.firstName} {student.lastName}
              </span>
            </div>
            <button className="logout-btn" onClick={logout}>Sign Out</button>
          </div>
        </nav>

        {/* CONTENT */}
        <div className="pcontent">

          {/* Announcements */}
          {announcements.map((a, i) => <AnnouncementBar key={i} a={a} />)}

          {/* Welcome */}
          <div className="welcome-card">
            <div style={{ position:"relative", zIndex:1 }}>
              <div className="welcome-hi">Welcome back, {student.firstName}! 👋</div>
              <div className="welcome-meta">
                <span>🎯 Goal: {student.certificationGoal || "—"}</span>
                <span>📅 Enrolled: {fmtDate(student.createdAt)}</span>
              </div>
            </div>
            <span
              className="enrolled-pill"
              style={{ background: ss.bg, color: ss.color, borderColor: ss.border }}
            >
              <span className="e-dot" style={{ background: ss.color }} />
              {ss.label}
            </span>
          </div>

          {/* Tabs */}
          <div className="tabs-row">
            {TABS.map(t => (
              <button
                key={t.id}
                className={`tab-btn ${tab === t.id ? "active" : ""}`}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* ── OVERVIEW ── */}
          {tab === "overview" && (
            <>
              <div className="stats-grid">
                {[
                  { cls:"purple", ico:"💰", lbl:"Total Paid",   val:`${totalPaid.toLocaleString()}`,  sub:"RWF · Confirmed"         },
                  { cls:"teal",   ico:"⏳", lbl:"Pending",      val:`${totalPending.toLocaleString()}`,sub:"RWF · Outstanding"       },
                  { cls:"rose",   ico:"🏆", lbl:"Pass Rate",    val: passRate !== null ? `${passRate}%` : "—", sub:`${certCount} exam(s)` },
                  { cls:"blue",   ico:"📋", lbl:"Attendance",   val: attendanceRate !== null ? `${attendanceRate}%` : "—", sub:`${attTotal} sessions` },
                  { cls:"amber",  ico:"🎯", lbl:"Certification",val: student.certificationGoal || "—", sub:"Your goal"              },
                  { cls:"green",  ico:"📚", lbl:"Classes",      val: data?.schedules?.length || "—",   sub:"Available"              },
                ].map((c, i) => (
                  <div key={i} className={`stat-card ${c.cls}`}>
                    <div className="stat-ico">{c.ico}</div>
                    <div className="stat-lbl">{c.lbl}</div>
                    <div className="stat-val"
                      style={ c.lbl === "Certification" ? { fontSize:"16px", paddingTop:"6px" } : {} }>
                      {c.val}
                    </div>
                    <div className="stat-sub">{c.sub}</div>
                  </div>
                ))}
              </div>

              <div className="bottom-grid">
                {/* Message */}
                {student.message ? (
                  <div className="msg-card">
                    <div className="section-title" style={{ marginBottom:10 }}>💬 Your Message</div>
                    <p className="msg-text">"{student.message}"</p>
                  </div>
                ) : (
                  <div className="msg-card">
                    <div className="section-title" style={{ marginBottom:10 }}>💬 Your Message</div>
                    <p className="msg-text" style={{ opacity:0.4 }}>No message yet.</p>
                  </div>
                )}

                {/* Help */}
                <div className="help-card">
                  <div className="section-title">📞 Need Help?</div>
                  <div className="section-sub">Contact the academy directly</div>
                  <div className="help-btns">
                    <a href="https://wa.me/250785302957" target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none" }}>
                      <button className="btn-wa">💬 WhatsApp</button>
                    </a>
                    <a href="mailto:frenchacademyinternational@gmail.com" style={{ textDecoration:"none" }}>
                      <button className="btn-email">📧 Send Email</button>
                    </a>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── SCHEDULE ── */}
          {tab === "schedule" && (
            <div className="section">
              <div className="section-title">📅 Class Schedule</div>
              <div className="section-sub">All available classes at IFA</div>
              {!data?.schedules?.length ? (
                <div className="empty-state">
                  <div className="empty-ico">📅</div>
                  <p>No classes scheduled yet</p>
                </div>
              ) : data.schedules.map((c, i) => (
                <div key={i} className="sched-item">
                  <div style={{ flex:1 }}>
                    <div className="sched-day">{c.day}</div>
                    <div className="sched-name">{c.name}</div>
                    <div className="sched-meta">
                      🕐 {c.time} &nbsp;·&nbsp; 📊 {c.level} &nbsp;·&nbsp;
                      👨‍🏫 {c.teacher} &nbsp;·&nbsp; 📍 {c.room}
                    </div>
                  </div>
                  <span
                    className="pill"
                    style={{ background:"rgba(155,141,255,.12)", color:"var(--purple)", flexShrink:0 }}
                  >
                    {c.level}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* ── PAYMENTS ── */}
          {tab === "payments" && (
            <div className="section">
              <div className="section-title">💳 Payment History</div>
              <div className="section-sub">Your complete payment records</div>

              {!data?.payments?.length ? (
                <div className="empty-state">
                  <div className="empty-ico">💳</div>
                  <p>No payment records yet</p>
                </div>
              ) : (
                <>
                  {/* Mini summary */}
                  <div className="mini-stats">
                    {[
                      { lbl:"Total Paid",    val:`${totalPaid.toLocaleString()} RWF`,    color:"var(--green)"  },
                      { lbl:"Pending",       val:`${totalPending.toLocaleString()} RWF`, color:"var(--amber)"  },
                      { lbl:"Transactions",  val: data.payments.length,                  color:"var(--blue)"   },
                    ].map((s, i) => (
                      <div key={i} className="mini-stat">
                        <div className="mini-stat-val" style={{ color:s.color }}>{s.val}</div>
                        <div className="mini-stat-lbl">{s.lbl}</div>
                      </div>
                    ))}
                  </div>

                  <div className="tbl-head" style={{ gridTemplateColumns:"1fr 1fr 100px 80px" }}>
                    <span>Amount</span><span>Method</span><span>Date</span><span>Status</span>
                  </div>
                  {data.payments.map((p, i) => (
                    <div key={i} className="tbl-row" style={{ gridTemplateColumns:"1fr 1fr 100px 80px" }}>
                      <span style={{ fontWeight:700, color:"var(--green)", fontFamily:"'Sora',sans-serif" }}>
                        {p.amount.toLocaleString()} RWF
                      </span>
                      <span style={{ fontSize:12, color:"var(--text2)" }}>{p.method}</span>
                      <span style={{ fontSize:11, color:"var(--text3)" }}>{p.date}</span>
                      <Pill status={p.status} map={PAY_MAP} />
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {/* ── CERTIFICATIONS ── */}
          {tab === "certifications" && (
            <div className="section">
              <div className="section-title">🏆 Exam Results</div>
              <div className="section-sub">Your certification exam history</div>

              {!data?.certifications?.length ? (
                <div className="empty-state">
                  <div className="empty-ico">📝</div>
                  <p>No exam results yet. Keep studying!</p>
                </div>
              ) : (
                <>
                  <div className="tbl-head" style={{ gridTemplateColumns:"1fr 80px 100px 80px" }}>
                    <span>Certification</span><span>Score</span><span>Date</span><span>Result</span>
                  </div>
                  {data.certifications.map((c, i) => (
                    <div key={i} className="tbl-row" style={{ gridTemplateColumns:"1fr 80px 100px 80px" }}>
                      <span style={{ fontWeight:600 }}>{c.cert}</span>
                      <span style={{ fontWeight:700, color:"var(--purple)", fontFamily:"'Sora',sans-serif" }}>
                        {c.score || "—"}
                      </span>
                      <span style={{ fontSize:11, color:"var(--text3)" }}>{c.examDate || "—"}</span>
                      <span
                        className="pill"
                        style={{
                          background: c.passed ? "rgba(74,222,128,.12)" : "rgba(251,122,172,.12)",
                          color:      c.passed ? "var(--green)"          : "var(--rose)",
                        }}
                      >
                        {c.passed ? "✓ Pass" : "✕ Fail"}
                      </span>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {/* ── ATTENDANCE ── */}
          {tab === "attendance" && (
            <div className="section">
              <div className="section-title">📋 My Attendance</div>
              <div className="section-sub">Your class attendance record</div>

              {!data?.attendance?.length ? (
                <div className="empty-state">
                  <div className="empty-ico">📋</div>
                  <p>No attendance records yet</p>
                </div>
              ) : (
                <>
                  <div className="mini-stats">
                    {[
                      { lbl:"Present", val: attPresent,                                color:"var(--green)" },
                      { lbl:"Absent",  val: data.attendance.filter(a=>a.status==="absent").length, color:"var(--rose)"  },
                      { lbl:"Late",    val: data.attendance.filter(a=>a.status==="late").length,   color:"var(--amber)" },
                      { lbl:"Rate",    val: attendanceRate !== null ? `${attendanceRate}%` : "—",  color:"var(--blue)"  },
                    ].map((s, i) => (
                      <div key={i} className="mini-stat">
                        <div className="mini-stat-val" style={{ color:s.color }}>{s.val}</div>
                        <div className="mini-stat-lbl">{s.lbl}</div>
                      </div>
                    ))}
                  </div>

                  <div className="tbl-head" style={{ gridTemplateColumns:"110px 1fr 80px" }}>
                    <span>Date</span><span>Class</span><span>Status</span>
                  </div>
                  {data.attendance.map((a, i) => (
                    <div key={i} className="tbl-row" style={{ gridTemplateColumns:"110px 1fr 80px" }}>
                      <span style={{ fontSize:12, color:"var(--text3)" }}>{a.date}</span>
                      <span style={{ fontWeight:500 }}>{a.className}</span>
                      <Pill status={a.status} map={ATT_MAP} />
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
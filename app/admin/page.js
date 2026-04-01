"use client";
import { useState, useEffect, useCallback } from "react";

const STATUS_COLORS = {
  new: { bg: "#1a3a5c", text: "#5bc4ff", label: "New" },
  contacted: { bg: "#2a3a1a", text: "#7ed957", label: "Contacted" },
  enrolled: { bg: "#2a1a3a", text: "#c9a84c", label: "Enrolled" },
  cancelled: { bg: "#3a1a1a", text: "#ff6b6b", label: "Cancelled" },
};

function StatCard({ label, value, color }) {
  return (
    <div style={{
      background: "#111c2d", border: `1px solid ${color}33`,
      borderRadius: 12, padding: "20px 24px", flex: 1, minWidth: 120,
    }}>
      <div style={{ fontSize: 28, fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>{label}</div>
    </div>
  );
}

function LoginPage({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) onLogin();
    else setError(data.error || "Invalid password");
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0a1628", display: "flex",
      alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif",
    }}>
      <div style={{
        background: "#111c2d", border: "1px solid #c9a84c44",
        borderRadius: 16, padding: 48, width: 380, textAlign: "center",
      }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>🎓</div>
        <h1 style={{ color: "#fff", margin: "0 0 4px", fontSize: 22 }}>IFA Admin</h1>
        <p style={{ color: "#888", margin: "0 0 32px", fontSize: 14 }}>International French Academy</p>
        <input
          type="password"
          placeholder="Admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          style={{
            width: "100%", padding: "12px 16px", borderRadius: 8,
            border: "1px solid #333", background: "#0a1628", color: "#fff",
            fontSize: 15, marginBottom: 16, boxSizing: "border-box", outline: "none",
          }}
        />
        {error && <p style={{ color: "#ff6b6b", fontSize: 13, marginBottom: 12 }}>{error}</p>}
        <button onClick={handleLogin} disabled={loading} style={{
          width: "100%", padding: "12px", background: "#c9a84c",
          color: "#0a1628", fontWeight: 700, fontSize: 15,
          border: "none", borderRadius: 8, cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.7 : 1,
        }}>
          {loading ? "Logging in..." : "Enter Dashboard"}
        </button>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [enrollments, setEnrollments] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [notesInput, setNotesInput] = useState("");

  const fetchEnrollments = useCallback(async () => {
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

  useEffect(() => {
    if (authed) fetchEnrollments();
  }, [authed, fetchEnrollments]);

  const updateStatus = async (id, status) => {
    await fetch("/api/admin/enrollments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchEnrollments();
    if (selected?._id === id) setSelected((p) => ({ ...p, status }));
  };

  const saveNotes = async () => {
    await fetch("/api/admin/enrollments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: selected._id, notes: notesInput }),
    });
    fetchEnrollments();
    setSelected((p) => ({ ...p, notes: notesInput }));
  };

  const deleteEnrollment = async (id) => {
    if (!confirm("Delete this enrollment?")) return;
    await fetch("/api/admin/enrollments", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setSelected(null);
    fetchEnrollments();
  };

  const logout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    setAuthed(false);
  };

  if (!authed) return <LoginPage onLogin={() => setAuthed(true)} />;

  return (
    <div style={{ minHeight: "100vh", background: "#0a1628", fontFamily: "Georgia, serif", color: "#fff" }}>
      <div style={{ background: "#111c2d", borderBottom: "1px solid #1e3050", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 24 }}>🎓</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>IFA Admin Dashboard</div>
            <div style={{ fontSize: 12, color: "#888" }}>International French Academy</div>
          </div>
        </div>
        <button onClick={logout} style={{ background: "transparent", border: "1px solid #333", color: "#888", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>
          Logout
        </button>
      </div>

      <div style={{ padding: 32 }}>
        <div style={{ display: "flex", gap: 16, marginBottom: 32, flexWrap: "wrap" }}>
          <StatCard label="Total" value={stats.total || 0} color="#c9a84c" />
          <StatCard label="New" value={stats.new || 0} color="#5bc4ff" />
          <StatCard label="Contacted" value={stats.contacted || 0} color="#7ed957" />
          <StatCard label="Enrolled" value={stats.enrolled || 0} color="#c9a84c" />
          <StatCard label="Cancelled" value={stats.cancelled || 0} color="#ff6b6b" />
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
          {["all", "new", "contacted", "enrolled", "cancelled"].map((s) => (
            <button key={s} onClick={() => setFilter(s)} style={{
              padding: "8px 18px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, textTransform: "capitalize",
              background: filter === s ? "#c9a84c" : "#111c2d",
              color: filter === s ? "#0a1628" : "#888",
            }}>{s}</button>
          ))}
          <input
            placeholder="Search name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              marginLeft: "auto", padding: "8px 16px", borderRadius: 8,
              border: "1px solid #1e3050", background: "#111c2d", color: "#fff",
              fontSize: 14, width: 260, outline: "none",
            }}
          />
          <button onClick={fetchEnrollments} style={{
            padding: "8px 16px", background: "#c9a84c", color: "#0a1628",
            border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 13,
          }}>↻ Refresh</button>
        </div>

        <div style={{ display: "flex", gap: 24 }}>
          <div style={{ flex: 1, background: "#111c2d", borderRadius: 12, overflow: "hidden", border: "1px solid #1e3050" }}>
            {loading ? (
              <div style={{ padding: 48, textAlign: "center", color: "#888" }}>Loading...</div>
            ) : enrollments.length === 0 ? (
              <div style={{ padding: 48, textAlign: "center", color: "#888" }}>No enrollments found.</div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #1e3050" }}>
                    {["Name", "Email", "Phone", "Goal", "Status", "Date"].map((h) => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {enrollments.map((e) => {
                    const sc = STATUS_COLORS[e.status];
                    const isSelected = selected?._id === e._id;
                    return (
                      <tr key={e._id} onClick={() => { setSelected(e); setNotesInput(e.notes || ""); }}
                        style={{ borderBottom: "1px solid #1a2a3a", cursor: "pointer", background: isSelected ? "#162033" : "transparent" }}>
                        <td style={{ padding: "12px 16px", fontWeight: 600, fontSize: 14 }}>{e.firstName} {e.lastName}</td>
                        <td style={{ padding: "12px 16px", fontSize: 13, color: "#aaa" }}>{e.email}</td>
                        <td style={{ padding: "12px 16px", fontSize: 13, color: "#aaa" }}>{e.phone}</td>
                        <td style={{ padding: "12px 16px", fontSize: 13, color: "#c9a84c" }}>{e.certificationGoal}</td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ background: sc.bg, color: sc.text, padding: "3px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600 }}>{sc.label}</span>
                        </td>
                        <td style={{ padding: "12px 16px", fontSize: 12, color: "#666" }}>
                          {new Date(e.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {selected && (
            <div style={{ width: 320, background: "#111c2d", borderRadius: 12, border: "1px solid #1e3050", padding: 24, flexShrink: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                <h3 style={{ margin: 0, fontSize: 16 }}>{selected.firstName} {selected.lastName}</h3>
                <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "#888", cursor: "pointer", fontSize: 18 }}>×</button>
              </div>
              <div style={{ fontSize: 13, color: "#aaa", lineHeight: 2 }}>
                <div>📧 <a href={`mailto:${selected.email}`} style={{ color: "#5bc4ff" }}>{selected.email}</a></div>
                <div>📱 <a href={`https://wa.me/${selected.phone.replace(/\D/g, "")}`} target="_blank" style={{ color: "#7ed957" }}>{selected.phone}</a></div>
                <div>🎯 <span style={{ color: "#c9a84c" }}>{selected.certificationGoal}</span></div>
                {selected.message && <div style={{ marginTop: 8, padding: 10, background: "#0a1628", borderRadius: 8 }}>💬 {selected.message}</div>}
              </div>
              <div style={{ marginTop: 20 }}>
                <div style={{ fontSize: 12, color: "#888", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Update Status</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {Object.entries(STATUS_COLORS).map(([s, c]) => (
                    <button key={s} onClick={() => updateStatus(selected._id, s)} style={{
                      padding: "6px 12px", borderRadius: 8, border: "none", cursor: "pointer",
                      fontSize: 12, fontWeight: 600, textTransform: "capitalize",
                      background: selected.status === s ? c.bg : "#0a1628",
                      color: selected.status === s ? c.text : "#666",
                      outline: selected.status === s ? `1px solid ${c.text}44` : "none",
                    }}>{c.label}</button>
                  ))}
                </div>
              </div>
              <div style={{ marginTop: 20 }}>
                <div style={{ fontSize: 12, color: "#888", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Internal Notes</div>
                <textarea value={notesInput} onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="Add notes about this student..."
                  style={{ width: "100%", height: 90, padding: "10px 12px", background: "#0a1628", border: "1px solid #1e3050", borderRadius: 8, color: "#fff", fontSize: 13, resize: "none", outline: "none", boxSizing: "border-box" }}
                />
                <button onClick={saveNotes} style={{ marginTop: 8, width: "100%", padding: "9px", background: "#c9a84c", color: "#0a1628", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 13 }}>
                  Save Notes
                </button>
              </div>
              <button onClick={() => deleteEnrollment(selected._id)} style={{ marginTop: 16, width: "100%", padding: "9px", background: "transparent", color: "#ff6b6b", border: "1px solid #ff6b6b44", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>
                Delete Enrollment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
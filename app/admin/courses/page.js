"use client";
import { useState, useEffect } from "react";

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2", "All levels"];

export default function CoursesAdmin() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", level: "All levels" });
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/courses");
      const d = await r.json();
      if (d.success) setCourses(d.courses);
    } catch {}
    setLoading(false);
  };

  const handleUpload = async () => {
    if (!form.title || !file) { setMsg("❌ Please fill title and select a file."); return; }
    setUploading(true); setMsg("");
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("level", form.level);
      fd.append("file", file);
      const r = await fetch("/api/admin/courses", { method: "POST", body: fd });
      const d = await r.json();
      if (d.success) {
        setMsg("✅ Course uploaded successfully!");
        setForm({ title: "", description: "", level: "All levels" });
        setFile(null);
        setShowForm(false);
        fetchCourses();
      } else setMsg("❌ " + d.error);
    } catch { setMsg("❌ Upload failed."); }
    setUploading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this course?")) return;
    await fetch("/api/admin/courses", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    fetchCourses();
  };

  const fileIcon = (type) => {
    if (type?.includes("pdf")) return "📄";
    if (type?.includes("presentation") || type?.includes("pptx")) return "📊";
    return "📁";
  };

  const fmtSize = (bytes) => {
    if (!bytes) return "";
    if (bytes > 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
    return `${(bytes / 1024).toFixed(0)} KB`;
  };

  return (
    <div style={{ padding: "24px", maxWidth: 900, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#f0f2ff" }}>🎓 Courses</h1>
          <p style={{ fontSize: 12, color: "#5a6080", marginTop: 4 }}>Upload and manage course materials</p>
        </div>
        <button onClick={() => setShowForm(v => !v)} style={{ background: "linear-gradient(135deg,#7c6fff,#9b8dff)", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          {showForm ? "✕ Cancel" : "+ New Course"}
        </button>
      </div>

      {showForm && (
        <div style={{ background: "#111527", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 24, marginBottom: 24 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#f0f2ff", marginBottom: 16 }}>📤 Upload New Course</h2>
          {msg && <div style={{ padding: "10px 14px", borderRadius: 8, marginBottom: 14, fontSize: 12, background: msg.includes("✅") ? "rgba(74,222,128,0.1)" : "rgba(251,122,172,0.1)", color: msg.includes("✅") ? "#4ade80" : "#fb7aac" }}>{msg}</div>}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "#5a6080", marginBottom: 6 }}>Course Title *</div>
              <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. TCF Québec Preparation" style={{ width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "#f0f2ff", fontSize: 14, outline: "none" }} />
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "#5a6080", marginBottom: 6 }}>Level</div>
              <select value={form.level} onChange={e => setForm(p => ({ ...p, level: e.target.value }))} style={{ width: "100%", padding: "11px 14px", background: "#161b30", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "#f0f2ff", fontSize: 14, outline: "none" }}>
                {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "#5a6080", marginBottom: 6 }}>Description</div>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Brief description..." rows={2} style={{ width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "#f0f2ff", fontSize: 14, outline: "none", resize: "vertical" }} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "#5a6080", marginBottom: 6 }}>File (PDF, PPTX, etc.) *</div>
            <label style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", background: "rgba(155,141,255,0.06)", border: "2px dashed rgba(155,141,255,0.3)", borderRadius: 10, cursor: "pointer" }}>
              <span style={{ fontSize: 24 }}>📁</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#9b8dff" }}>{file ? file.name : "Click to select file"}</div>
                <div style={{ fontSize: 11, color: "#5a6080" }}>{file ? fmtSize(file.size) : "PDF, PPTX, DOC, ZIP supported"}</div>
              </div>
              <input type="file" accept=".pdf,.pptx,.ppt,.doc,.docx,.zip" style={{ display: "none" }} onChange={e => setFile(e.target.files[0])} />
            </label>
          </div>
          <button onClick={handleUpload} disabled={uploading} style={{ background: "linear-gradient(135deg,#7c6fff,#9b8dff)", color: "#fff", border: "none", padding: "12px 28px", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: uploading ? "not-allowed" : "pointer", opacity: uploading ? 0.7 : 1 }}>
            {uploading ? "⏳ Uploading..." : "⬆️ Upload Course"}
          </button>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: "#5a6080" }}>Loading...</div>
      ) : courses.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: "#5a6080" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🎓</div>
          <p>No courses yet. Create your first one!</p>
        </div>
      ) : (
        courses.map((c, i) => (
          <div key={i} style={{ background: "#111527", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "16px 20px", marginBottom: 10, display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(155,141,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
              {fileIcon(c.fileType)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#f0f2ff", marginBottom: 3 }}>{c.title}</div>
              <div style={{ fontSize: 11, color: "#5a6080" }}>{c.description}</div>
              <div style={{ fontSize: 11, color: "#5a6080", marginTop: 3 }}>📊 {c.level} · 📁 {c.fileName} · {fmtSize(c.fileSize)}</div>
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <a href={c.fileUrl} target="_blank" rel="noopener noreferrer" style={{ background: "rgba(74,222,128,0.1)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.2)", padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: "none" }}>⬇️ View</a>
              <button onClick={() => handleDelete(c._id)} style={{ background: "rgba(251,122,172,0.1)", color: "#fb7aac", border: "1px solid rgba(251,122,172,0.2)", padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>🗑️ Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
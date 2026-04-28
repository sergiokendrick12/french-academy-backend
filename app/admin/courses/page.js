"use client";
import { useState, useEffect } from "react";

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const CLOUD_NAME = "dpwqj15y7";
const UPLOAD_PRESET = "ifa_courses";

export default function CoursesAdmin() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", level: "B1" });
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");
  const [progress, setProgress] = useState(0);

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
    if (!form.title || !file) { setMsg("❌ Veuillez remplir le titre et sélectionner un fichier."); return; }
    setUploading(true); setMsg(""); setProgress(0);
    try {
      // Upload directly to Cloudinary
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", UPLOAD_PRESET);
      fd.append("folder", "ifa-courses");

      const xhr = new XMLHttpRequest();
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 80));
      };

      const cloudRes = await new Promise((resolve, reject) => {
        xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`);
        xhr.onload = () => resolve(JSON.parse(xhr.responseText));
        xhr.onerror = reject;
        xhr.send(fd);
      });

      if (!cloudRes.secure_url) throw new Error("Cloudinary upload failed");
      setProgress(90);

      // Save to MongoDB
      const r = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          level: form.level,
          fileName: file.name,
          fileUrl: cloudRes.secure_url,
          fileType: file.type,
          fileSize: file.size,
        }),
      });
      const d = await r.json();
      if (d.success) {
        setProgress(100);
        setMsg("✅ Cours téléchargé avec succès!");
        setForm({ title: "", description: "", level: "B1" });
        setFile(null);
        setShowForm(false);
        fetchCourses();
      } else setMsg("❌ " + d.error);
    } catch(e) { setMsg("❌ Échec du téléchargement: " + e.message); }
    setUploading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer ce cours?")) return;
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
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#f0f2ff" }}>🎓 Cours</h1>
          <p style={{ fontSize: 12, color: "#5a6080", marginTop: 4 }}>Télécharger et gérer les supports de cours</p>
        </div>
        <button onClick={() => setShowForm(v => !v)} style={{ background: "linear-gradient(135deg,#7c6fff,#9b8dff)", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          {showForm ? "✕ Annuler" : "+ Nouveau Cours"}
        </button>
      </div>

      {showForm && (
        <div style={{ background: "#111527", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 24, marginBottom: 24 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#f0f2ff", marginBottom: 16 }}>📤 Télécharger un nouveau cours</h2>
          {msg && <div style={{ padding: "10px 14px", borderRadius: 8, marginBottom: 14, fontSize: 12, background: msg.includes("✅") ? "rgba(74,222,128,0.1)" : "rgba(251,122,172,0.1)", color: msg.includes("✅") ? "#4ade80" : "#fb7aac" }}>{msg}</div>}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "#5a6080", marginBottom: 6 }}>Titre du cours *</div>
              <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="ex: Préparation TCF Québec" style={{ width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "#f0f2ff", fontSize: 14, outline: "none" }} />
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "#5a6080", marginBottom: 6 }}>Niveau</div>
              <select value={form.level} onChange={e => setForm(p => ({ ...p, level: e.target.value }))} style={{ width: "100%", padding: "11px 14px", background: "#161b30", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "#f0f2ff", fontSize: 14, outline: "none" }}>
                {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "#5a6080", marginBottom: 6 }}>Description</div>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Brève description du cours..." rows={2} style={{ width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "#f0f2ff", fontSize: 14, outline: "none", resize: "vertical" }} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "#5a6080", marginBottom: 6 }}>Fichier (PDF, PPTX, etc.) *</div>
            <label style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", background: "rgba(155,141,255,0.06)", border: "2px dashed rgba(155,141,255,0.3)", borderRadius: 10, cursor: "pointer" }}>
              <span style={{ fontSize: 24 }}>📁</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#9b8dff" }}>{file ? file.name : "Cliquez pour sélectionner un fichier"}</div>
                <div style={{ fontSize: 11, color: "#5a6080" }}>{file ? fmtSize(file.size) : "PDF, PPTX, DOC, ZIP supportés"}</div>
              </div>
              <input type="file" accept=".pdf,.pptx,.ppt,.doc,.docx,.zip" style={{ display: "none" }} onChange={e => setFile(e.target.files[0])} />
            </label>
          </div>
          {uploading && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: "#9b8dff", marginBottom: 6 }}>Téléchargement en cours... {progress}%</div>
              <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 999, height: 8, overflow: "hidden" }}>
                <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg,#7c6fff,#9b8dff)", borderRadius: 999, transition: "width 0.3s" }} />
              </div>
            </div>
          )}
          <button onClick={handleUpload} disabled={uploading} style={{ background: "linear-gradient(135deg,#7c6fff,#9b8dff)", color: "#fff", border: "none", padding: "12px 28px", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: uploading ? "not-allowed" : "pointer", opacity: uploading ? 0.7 : 1 }}>
            {uploading ? `⏳ Téléchargement... ${progress}%` : "⬆️ Télécharger le cours"}
          </button>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: "#5a6080" }}>Chargement...</div>
      ) : courses.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: "#5a6080" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🎓</div>
          <p>Aucun cours pour l'instant. Créez le premier!</p>
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
              <a href={c.fileUrl} target="_blank" rel="noopener noreferrer" style={{ background: "rgba(74,222,128,0.1)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.2)", padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: "none" }}>⬇️ Voir</a>
              <button onClick={() => handleDelete(c._id)} style={{ background: "rgba(251,122,172,0.1)", color: "#fb7aac", border: "1px solid rgba(251,122,172,0.2)", padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>🗑️ Supprimer</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
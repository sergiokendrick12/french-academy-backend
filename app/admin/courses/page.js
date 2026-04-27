"use client";
import { useState, useEffect } from "react";

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const LESSON_TYPE_ICONS = { text: "📝", pdf: "📄", quiz: "❓" };

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list");
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({
    title: "", description: "", level: "A1",
    isPublished: false, assignedStudents: "", lessons: [],
  });
  const [lessonForm, setLessonForm] = useState({
    title: "", type: "text", content: "", pdfUrl: "", quiz: [],
  });
  const [quizQ, setQuizQ] = useState({
    question: "", options: ["", "", "", ""], correctIndex: 0,
  });
  const [showLessonEditor, setShowLessonEditor] = useState(false);
  const [editingLessonIdx, setEditingLessonIdx] = useState(null);

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

  const openCreate = () => {
    setForm({ title: "", description: "", level: "A1", isPublished: false, assignedStudents: "", lessons: [] });
    setSelected(null);
    setMsg("");
    setView("create");
  };

  const openEdit = (course) => {
    setForm({
      title: course.title,
      description: course.description,
      level: course.level,
      isPublished: course.isPublished,
      assignedStudents: (course.assignedStudents || []).join(", "),
      lessons: course.lessons || [],
    });
    setSelected(course);
    setMsg("");
    setView("edit");
  };

  const saveCourse = async () => {
    if (!form.title.trim()) { setMsg("❌ Title is required."); return; }
    setSaving(true); setMsg("");
    const payload = {
      ...form,
      assignedStudents: form.assignedStudents
        .split(",").map((e) => e.trim().toLowerCase()).filter(Boolean),
    };
    try {
      let r;
      if (view === "create") {
        r = await fetch("/api/admin/courses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        r = await fetch("/api/admin/courses", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: selected._id, ...payload }),
        });
      }
      const d = await r.json();
      if (d.success) {
        setMsg("✅ Saved!");
        fetchCourses();
        setTimeout(() => setView("list"), 800);
      } else setMsg("❌ " + (d.error || "Failed"));
    } catch { setMsg("❌ Connection error"); }
    setSaving(false);
  };

  const deleteCourse = async (id) => {
    if (!confirm("Delete this course?")) return;
    await fetch("/api/admin/courses", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchCourses();
  };

  const togglePublish = async (course) => {
    await fetch("/api/admin/courses", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: course._id, isPublished: !course.isPublished }),
    });
    fetchCourses();
  };

  const addLesson = () => {
    if (!lessonForm.title.trim()) return;
    const newLesson = { ...lessonForm, order: form.lessons.length, _id: Date.now().toString() };
    if (editingLessonIdx !== null) {
      const updated = [...form.lessons];
      updated[editingLessonIdx] = { ...updated[editingLessonIdx], ...newLesson };
      setForm((f) => ({ ...f, lessons: updated }));
    } else {
      setForm((f) => ({ ...f, lessons: [...f.lessons, newLesson] }));
    }
    setLessonForm({ title: "", type: "text", content: "", pdfUrl: "", quiz: [] });
    setEditingLessonIdx(null);
    setShowLessonEditor(false);
  };

  const removeLesson = (idx) =>
    setForm((f) => ({ ...f, lessons: f.lessons.filter((_, i) => i !== idx) }));

  const editLesson = (idx) => {
    setLessonForm(form.lessons[idx]);
    setEditingLessonIdx(idx);
    setShowLessonEditor(true);
  };

  const addQuizQuestion = () => {
    if (!quizQ.question.trim()) return;
    setLessonForm((lf) => ({ ...lf, quiz: [...lf.quiz, { ...quizQ }] }));
    setQuizQ({ question: "", options: ["", "", "", ""], correctIndex: 0 });
  };

  const S = {
    wrap: { padding: "28px 32px 80px", maxWidth: 900, margin: "0 auto" },
    hdr: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 },
    title: { fontFamily: "'Sora',sans-serif", fontSize: 22, fontWeight: 800, color: "#f0f2ff" },
    btn: { background: "linear-gradient(135deg,#7c6fff,#9b8dff)", color: "#fff", border: "none", padding: "10px 22px", borderRadius: 10, fontFamily: "'Sora',sans-serif", fontSize: 13, fontWeight: 700, cursor: "pointer" },
    btnSm: { background: "rgba(155,141,255,0.12)", color: "#9b8dff", border: "1px solid rgba(155,141,255,0.25)", padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" },
    btnDanger: { background: "rgba(251,122,172,0.1)", color: "#fb7aac", border: "1px solid rgba(251,122,172,0.2)", padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" },
    card: { background: "#111527", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "22px", marginBottom: 14 },
    lbl: { fontSize: 10, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "#5a6080", marginBottom: 6, display: "block" },
    input: { width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "#f0f2ff", fontSize: 14, outline: "none", marginBottom: 16, boxSizing: "border-box" },
    textarea: { width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "#f0f2ff", fontSize: 14, outline: "none", marginBottom: 16, boxSizing: "border-box", minHeight: 80, resize: "vertical" },
    select: { width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "#f0f2ff", fontSize: 14, outline: "none", marginBottom: 16, cursor: "pointer" },
    lessonRow: { display: "flex", alignItems: "center", gap: 10, background: "#161b30", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "10px 14px", marginBottom: 8 },
  };

  if (loading) return <div style={{ ...S.wrap, color: "#9aa0be" }}>Loading courses…</div>;

  if (view === "list") return (
    <div style={S.wrap}>
      <div style={S.hdr}>
        <h1 style={S.title}>📚 Courses</h1>
        <button style={S.btn} onClick={openCreate}>+ New Course</button>
      </div>
      {courses.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#5a6080" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📚</div>
          <p>No courses yet. Create your first one!</p>
        </div>
      )}
      {courses.map((c) => (
        <div key={c._id} style={S.card}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 14, flexWrap: "wrap" }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                <span style={{ fontFamily: "'Sora',sans-serif", fontSize: 16, fontWeight: 700, color: "#f0f2ff" }}>{c.title}</span>
                <span style={{ background: "rgba(155,141,255,0.12)", color: "#9b8dff", padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700 }}>{c.level}</span>
                <span style={{ background: c.isPublished ? "rgba(74,222,128,0.1)" : "rgba(255,255,255,0.05)", color: c.isPublished ? "#4ade80" : "#5a6080", padding: "3px 10px", borderRadius: 999, fontSize: 11 }}>
                  {c.isPublished ? "✅ Published" : "⏸ Draft"}
                </span>
              </div>
              <p style={{ fontSize: 13, color: "#9aa0be", marginBottom: 6 }}>{c.description || "No description"}</p>
              <div style={{ fontSize: 11, color: "#5a6080" }}>
                📖 {c.lessons?.length || 0} lessons · 👤 {c.assignedStudents?.length || 0} students
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button style={S.btnSm} onClick={() => openEdit(c)}>✏️ Edit</button>
              <button style={S.btnSm} onClick={() => togglePublish(c)}>
                {c.isPublished ? "⏸ Unpublish" : "✅ Publish"}
              </button>
              <button style={S.btnDanger} onClick={() => deleteCourse(c._id)}>🗑 Delete</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div style={S.wrap}>
      <div style={S.hdr}>
        <h1 style={S.title}>{view === "create" ? "➕ New Course" : "✏️ Edit Course"}</h1>
        <button style={S.btnSm} onClick={() => setView("list")}>← Back</button>
      </div>
      {msg && (
        <div style={{ padding: "10px 14px", borderRadius: 8, marginBottom: 14, fontSize: 12, background: msg.startsWith("✅") ? "rgba(74,222,128,0.1)" : "rgba(251,122,172,0.1)", color: msg.startsWith("✅") ? "#4ade80" : "#fb7aac" }}>
          {msg}
        </div>
      )}
      <div style={S.card}>
        <label style={S.lbl}>Course Title</label>
        <input style={S.input} value={form.title} placeholder="e.g. French for Beginners"
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
        <label style={S.lbl}>Description</label>
        <textarea style={S.textarea} value={form.description} placeholder="What will students learn?"
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
        <label style={S.lbl}>Level</label>
        <select style={S.select} value={form.level}
          onChange={(e) => setForm((f) => ({ ...f, level: e.target.value }))}>
          {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        <label style={S.lbl}>Assign Students (comma-separated emails)</label>
        <textarea style={S.textarea} value={form.assignedStudents}
          placeholder="student1@email.com, student2@email.com"
          onChange={(e) => setForm((f) => ({ ...f, assignedStudents: e.target.value }))} />
        <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", marginBottom: 20 }}>
          <input type="checkbox" checked={form.isPublished}
            onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))}
            style={{ width: 16, height: 16 }} />
          <span style={{ fontSize: 13, color: "#f0f2ff" }}>Published (visible to students)</span>
        </label>
      </div>

      <div style={S.card}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 15, fontWeight: 700, color: "#f0f2ff" }}>
            📖 Lessons ({form.lessons.length})
          </div>
          <button style={S.btnSm} onClick={() => {
            setLessonForm({ title: "", type: "text", content: "", pdfUrl: "", quiz: [] });
            setEditingLessonIdx(null);
            setShowLessonEditor(true);
          }}>+ Add Lesson</button>
        </div>

        {form.lessons.length === 0 && (
          <div style={{ textAlign: "center", padding: "30px 0", color: "#5a6080", fontSize: 13 }}>
            No lessons yet. Add your first lesson!
          </div>
        )}

        {form.lessons.map((l, i) => (
          <div key={i} style={S.lessonRow}>
            <span>{LESSON_TYPE_ICONS[l.type]}</span>
            <span style={{ flex: 1, fontSize: 13, color: "#f0f2ff", fontWeight: 600 }}>{l.title}</span>
            <span style={{ fontSize: 11, color: "#5a6080", background: "rgba(255,255,255,0.05)", padding: "3px 8px", borderRadius: 6 }}>{l.type}</span>
            <button style={{ ...S.btnSm, padding: "4px 10px" }} onClick={() => editLesson(i)}>✏️</button>
            <button style={{ ...S.btnDanger, padding: "4px 10px" }} onClick={() => removeLesson(i)}>🗑</button>
          </div>
        ))}

        {showLessonEditor && (
          <div style={{ marginTop: 16, background: "#0b0e1a", border: "1px solid rgba(155,141,255,0.2)", borderRadius: 12, padding: 20 }}>
            <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 14, fontWeight: 700, color: "#9b8dff", marginBottom: 14 }}>
              {editingLessonIdx !== null ? "✏️ Edit Lesson" : "➕ New Lesson"}
            </div>
            <label style={S.lbl}>Lesson Title</label>
            <input style={S.input} value={lessonForm.title} placeholder="e.g. French Greetings"
              onChange={(e) => setLessonForm((lf) => ({ ...lf, title: e.target.value }))} />
            <label style={S.lbl}>Type</label>
            <select style={S.select} value={lessonForm.type}
              onChange={(e) => setLessonForm((lf) => ({ ...lf, type: e.target.value }))}>
              <option value="text">📝 Text / Article</option>
              <option value="pdf">📄 PDF Document</option>
              <option value="quiz">❓ Quiz</option>
            </select>

            {lessonForm.type === "text" && (
              <>
                <label style={S.lbl}>Content</label>
                <textarea style={{ ...S.textarea, minHeight: 160 }} value={lessonForm.content}
                  placeholder="Write your lesson content here…"
                  onChange={(e) => setLessonForm((lf) => ({ ...lf, content: e.target.value }))} />
              </>
            )}

            {lessonForm.type === "pdf" && (
              <>
                <label style={S.lbl}>PDF URL</label>
                <input style={S.input} value={lessonForm.pdfUrl} placeholder="https://..."
                  onChange={(e) => setLessonForm((lf) => ({ ...lf, pdfUrl: e.target.value }))} />
                <label style={S.lbl}>Notes (optional)</label>
                <textarea style={S.textarea} value={lessonForm.content}
                  onChange={(e) => setLessonForm((lf) => ({ ...lf, content: e.target.value }))} />
              </>
            )}

            {lessonForm.type === "quiz" && (
              <div>
                <label style={S.lbl}>Questions ({lessonForm.quiz.length})</label>
                {lessonForm.quiz.map((q, qi) => (
                  <div key={qi} style={{ background: "rgba(155,141,255,0.06)", border: "1px solid rgba(155,141,255,0.15)", borderRadius: 10, padding: "12px 14px", marginBottom: 10 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#f0f2ff" }}>Q{qi + 1}: {q.question}</div>
                    {q.options.map((o, oi) => (
                      <div key={oi} style={{ fontSize: 12, color: oi === q.correctIndex ? "#4ade80" : "#9aa0be", marginTop: 4 }}>
                        {oi === q.correctIndex ? "✅" : "○"} {o}
                      </div>
                    ))}
                  </div>
                ))}
                <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 14, marginTop: 8 }}>
                  <label style={S.lbl}>Question</label>
                  <input style={S.input} value={quizQ.question} placeholder="Enter question…"
                    onChange={(e) => setQuizQ((q) => ({ ...q, question: e.target.value }))} />
                  <label style={S.lbl}>Options</label>
                  {quizQ.options.map((o, oi) => (
                    <div key={oi} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
                      <input type="radio" name="correct" checked={quizQ.correctIndex === oi}
                        onChange={() => setQuizQ((q) => ({ ...q, correctIndex: oi }))} />
                      <input style={{ ...S.input, marginBottom: 0, flex: 1 }} value={o}
                        placeholder={`Option ${oi + 1}`}
                        onChange={(e) => setQuizQ((q) => {
                          const opts = [...q.options]; opts[oi] = e.target.value; return { ...q, options: opts };
                        })} />
                    </div>
                  ))}
                  <button style={S.btnSm} onClick={addQuizQuestion}>+ Add Question</button>
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button style={S.btn} onClick={addLesson}>
                {editingLessonIdx !== null ? "💾 Update Lesson" : "➕ Add Lesson"}
              </button>
              <button style={S.btnSm} onClick={() => { setShowLessonEditor(false); setEditingLessonIdx(null); }}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <button style={S.btn} onClick={saveCourse} disabled={saving}>
          {saving ? "Saving…" : "💾 Save Course"}
        </button>
        <button style={S.btnSm} onClick={() => setView("list")}>Cancel</button>
      </div>
    </div>
  );
}
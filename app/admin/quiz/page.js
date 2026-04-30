"use client";
import { useState, useEffect } from "react";

const LEVELS = ["All levels", "A1", "A2", "B1", "B2", "C1", "C2"];

export default function QuizAdmin() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({ title: "", description: "", level: "All levels", timeLimit: 10 });
  const [questions, setQuestions] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchQuizzes(); }, []);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/quiz");
      const d = await r.json();
      if (d.success) setQuizzes(d.quizzes);
    } catch {}
    setLoading(false);
  };

  const addQuestion = (type) => {
    setQuestions(prev => [...prev, {
      type,
      question: "",
      options: type === "multiple" ? ["", "", "", ""] : [],
      correctAnswer: "",
      points: 1,
    }]);
  };

  const updateQuestion = (i, field, value) => {
    setQuestions(prev => prev.map((q, idx) => idx === i ? { ...q, [field]: value } : q));
  };

  const updateOption = (qi, oi, value) => {
    setQuestions(prev => prev.map((q, idx) => {
      if (idx !== qi) return q;
      const opts = [...q.options];
      opts[oi] = value;
      return { ...q, options: opts };
    }));
  };

  const removeQuestion = (i) => setQuestions(prev => prev.filter((_, idx) => idx !== i));

  const handleSave = async (publish) => {
    if (!form.title) { setMsg("❌ Title required"); return; }
    if (questions.length === 0) { setMsg("❌ Add at least one question"); return; }
    setSaving(true); setMsg("");
    try {
      const r = await fetch("/api/admin/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, questions, isPublished: publish }),
      });
      const d = await r.json();
      if (d.success) {
        setMsg(publish ? "✅ Quiz published!" : "✅ Quiz saved as draft!");
        setForm({ title: "", description: "", level: "All levels", timeLimit: 10 });
        setQuestions([]);
        setShowForm(false);
        fetchQuizzes();
      } else setMsg("❌ " + d.error);
    } catch { setMsg("❌ Failed to save"); }
    setSaving(false);
  };

  const togglePublish = async (quiz) => {
    await fetch("/api/admin/quiz", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: quiz._id, isPublished: !quiz.isPublished }),
    });
    fetchQuizzes();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this quiz?")) return;
    await fetch("/api/admin/quiz", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchQuizzes();
  };

  return (
    <div style={{ padding: "24px", maxWidth: 900, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#f0f2ff" }}>📝 Quiz & Assessments</h1>
          <p style={{ fontSize: 12, color: "#5a6080", marginTop: 4 }}>Create and manage student assessments</p>
        </div>
        <button onClick={() => setShowForm(v => !v)} style={{ background: "linear-gradient(135deg,#7c6fff,#9b8dff)", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          {showForm ? "✕ Cancel" : "+ New Quiz"}
        </button>
      </div>

      {msg && <div style={{ padding: "10px 14px", borderRadius: 8, marginBottom: 16, fontSize: 13, background: msg.includes("✅") ? "rgba(74,222,128,0.1)" : "rgba(251,122,172,0.1)", color: msg.includes("✅") ? "#4ade80" : "#fb7aac" }}>{msg}</div>}

      {showForm && (
        <div style={{ background: "#111527", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 24, marginBottom: 24 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#f0f2ff", marginBottom: 16 }}>Create New Quiz</h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "#5a6080", marginBottom: 6 }}>Quiz Title *</div>
              <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="ex: TCF Practice Test" style={{ width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "#f0f2ff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "#5a6080", marginBottom: 6 }}>Level</div>
              <select value={form.level} onChange={e => setForm(p => ({ ...p, level: e.target.value }))} style={{ width: "100%", padding: "11px 14px", background: "#161b30", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "#f0f2ff", fontSize: 14, outline: "none" }}>
                {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "#5a6080", marginBottom: 6 }}>Description</div>
              <input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Brief description..." style={{ width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "#f0f2ff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "#5a6080", marginBottom: 6 }}>⏱ Time Limit (minutes) *</div>
              <input type="number" min="1" max="180" value={form.timeLimit} onChange={e => setForm(p => ({ ...p, timeLimit: Number(e.target.value) }))} style={{ width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "#f0f2ff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#f0f2ff", marginBottom: 12 }}>Questions ({questions.length})</div>
            {questions.map((q, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 16, marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#9b8dff", textTransform: "uppercase", letterSpacing: "1px" }}>
                    {q.type === "multiple" ? "Multiple Choice" : q.type === "truefalse" ? "True / False" : "Written"} — Q{i + 1}
                  </span>
                  <button onClick={() => removeQuestion(i)} style={{ background: "rgba(251,122,172,0.1)", color: "#fb7aac", border: "none", padding: "4px 10px", borderRadius: 6, fontSize: 11, cursor: "pointer" }}>✕ Remove</button>
                </div>
                <input value={q.question} onChange={e => updateQuestion(i, "question", e.target.value)} placeholder="Question text..." style={{ width: "100%", padding: "10px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#f0f2ff", fontSize: 13, outline: "none", marginBottom: 10, boxSizing: "border-box" }} />

                {q.type === "multiple" && (
                  <div style={{ marginBottom: 10 }}>
                    {q.options.map((opt, oi) => (
                      <div key={oi} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <span style={{ fontSize: 11, color: "#5a6080", width: 20 }}>{["A","B","C","D"][oi]}.</span>
                        <input value={opt} onChange={e => updateOption(i, oi, e.target.value)} placeholder={`Option ${["A","B","C","D"][oi]}`} style={{ flex: 1, padding: "8px 12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#f0f2ff", fontSize: 13, outline: "none" }} />
                      </div>
                    ))}
                    <div style={{ marginTop: 8 }}>
                      <div style={{ fontSize: 10, color: "#5a6080", marginBottom: 4 }}>CORRECT ANSWER</div>
                      <select value={q.correctAnswer} onChange={e => updateQuestion(i, "correctAnswer", e.target.value)} style={{ padding: "8px 12px", background: "#161b30", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "#f0f2ff", fontSize: 13, outline: "none" }}>
                        <option value="">Select correct answer</option>
                        {q.options.map((opt, oi) => <option key={oi} value={opt}>{["A","B","C","D"][oi]}. {opt}</option>)}
                      </select>
                    </div>
                  </div>
                )}

                {q.type === "truefalse" && (
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 10, color: "#5a6080", marginBottom: 4 }}>CORRECT ANSWER</div>
                    <select value={q.correctAnswer} onChange={e => updateQuestion(i, "correctAnswer", e.target.value)} style={{ padding: "8px 12px", background: "#161b30", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "#f0f2ff", fontSize: 13, outline: "none" }}>
                      <option value="">Select</option>
                      <option value="True">True</option>
                      <option value="False">False</option>
                    </select>
                  </div>
                )}

                {q.type === "written" && (
                  <div style={{ fontSize: 11, color: "#5a6080", fontStyle: "italic" }}>Written answers are manually reviewed by admin.</div>
                )}

                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                  <span style={{ fontSize: 11, color: "#5a6080" }}>Points:</span>
                  <input type="number" min="1" max="10" value={q.points} onChange={e => updateQuestion(i, "points", Number(e.target.value))} style={{ width: 60, padding: "6px 10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#f0f2ff", fontSize: 13, outline: "none" }} />
                </div>
              </div>
            ))}

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button onClick={() => addQuestion("multiple")} style={{ background: "rgba(124,111,255,0.15)", color: "#9b8dff", border: "1px solid rgba(124,111,255,0.3)", padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>+ Multiple Choice</button>
              <button onClick={() => addQuestion("truefalse")} style={{ background: "rgba(74,222,128,0.1)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.2)", padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>+ True/False</button>
              <button onClick={() => addQuestion("written")} style={{ background: "rgba(251,191,36,0.1)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.2)", padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>+ Written</button>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => handleSave(false)} disabled={saving} style={{ background: "rgba(255,255,255,0.07)", color: "#f0f2ff", border: "1px solid rgba(255,255,255,0.15)", padding: "12px 24px", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>💾 Save Draft</button>
            <button onClick={() => handleSave(true)} disabled={saving} style={{ background: "linear-gradient(135deg,#7c6fff,#9b8dff)", color: "#fff", border: "none", padding: "12px 24px", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>🚀 Publish Quiz</button>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: "#5a6080" }}>Loading...</div>
      ) : quizzes.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: "#5a6080" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📝</div>
          <p>No quizzes yet. Create the first one!</p>
        </div>
      ) : (
        quizzes.map((q, i) => (
          <div key={i} style={{ background: "#111527", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "16px 20px", marginBottom: 10, display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(155,141,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>📝</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#f0f2ff" }}>{q.title}</div>
              <div style={{ fontSize: 11, color: "#5a6080", marginTop: 3 }}>⏱ {q.timeLimit} min · 📊 {q.level} · ❓ {q.questions.length} questions · {q.isPublished ? <span style={{ color: "#4ade80" }}>● Published</span> : <span style={{ color: "#fb7aac" }}>● Draft</span>}</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => togglePublish(q)} style={{ background: q.isPublished ? "rgba(251,122,172,0.1)" : "rgba(74,222,128,0.1)", color: q.isPublished ? "#fb7aac" : "#4ade80", border: `1px solid ${q.isPublished ? "rgba(251,122,172,0.2)" : "rgba(74,222,128,0.2)"}`, padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>{q.isPublished ? "Unpublish" : "Publish"}</button>
              <button onClick={() => handleDelete(q._id)} style={{ background: "rgba(251,122,172,0.1)", color: "#fb7aac", border: "1px solid rgba(251,122,172,0.2)", padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>🗑️</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
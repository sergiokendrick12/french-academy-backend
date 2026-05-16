import os

quiz_page = '''
function QuizPage({toast}) {
  const [quizzes,setQuizzes] = useState([]);
  const [showCreate,setShowCreate] = useState(false);
  const [showQuestions,setShowQuestions] = useState(null);
  const [form,setForm] = useState({title:"",description:"",duration:30,active:true});
  const [questions,setQuestions] = useState([]);
  const [qForm,setQForm] = useState({question:"",type:"multiple",options:["","","",""],correct:0,correctText:""});

  const fetchQuizzes = async () => {
    try { const r = await fetch("/api/admin/quiz"); const d = await r.json(); setQuizzes(d.quizzes||[]); } catch {}
  };
  useEffect(()=>{ fetchQuizzes(); },[]);

  const createQuiz = async () => {
    if(!form.title) return;
    const r = await fetch("/api/admin/quiz",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...form,questions})});
    const d = await r.json();
    if(d.success){ fetchQuizzes(); setShowCreate(false); setForm({title:"",description:"",duration:30,active:true}); setQuestions([]); toast("Quiz created!","success"); }
  };
  const deleteQuiz = async (id) => {
    if(!confirm("Delete this quiz?")) return;
    await fetch("/api/admin/quiz",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id})});
    fetchQuizzes(); toast("Quiz deleted!","success");
  };
  const addQuestion = () => {
    if(!qForm.question) return;
    setQuestions([...questions,{...qForm}]);
    setQForm({question:"",type:"multiple",options:["","","",""],correct:0,correctText:""});
    toast("Question added!","success");
  };
  const removeQuestion = (i) => setQuestions(questions.filter((_,idx)=>idx!==i));

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div style={{fontFamily:"var(--font-d)",fontSize:22}}>Quiz & Assessments</div>
        <button className="btn btn-gold" onClick={()=>setShowCreate(true)}>+ Create Quiz</button>
      </div>
      <div style={{display:"grid",gap:12}}>
        {quizzes.length===0?(<div className="empty"><div className="empty-ico">📝</div><p className="empty-txt">No quizzes yet</p></div>
        ):quizzes.map(q=>(
          <div key={q._id} className="card" style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontWeight:600,fontSize:15}}>{q.title}</div>
              <div style={{fontSize:12,color:"var(--text3)",marginTop:4}}>{q.description}</div>
              <div style={{display:"flex",gap:12,marginTop:8}}>
                <span className="pill" style={{background:"var(--blue-dim)",color:"var(--blue)"}}>{q.questions?.length||0} questions</span>
                <span className="pill" style={{background:"var(--gold-dim)",color:"var(--gold)"}}>{q.duration} min</span>
                <span className="pill" style={{background:q.active?"var(--teal-dim)":"var(--rose-dim)",color:q.active?"var(--teal)":"var(--rose)"}}>{q.active?"Active":"Inactive"}</span>
              </div>
            </div>
            <button onClick={()=>deleteQuiz(q._id)} style={{background:"var(--rose-dim)",border:"none",color:"var(--rose)",borderRadius:6,padding:"6px 12px",cursor:"pointer",fontSize:12}}>Delete</button>
          </div>
        ))}
      </div>

      {showCreate&&(
        <div className="modal-bg" onClick={()=>setShowCreate(false)}>
          <div className="modal" style={{maxWidth:700,width:"95%",maxHeight:"90vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
            <div className="modal-title">Create New Quiz</div>
            <div className="pay-form">
              <div className="form-group" style={{gridColumn:"span 2"}}><label className="form-label">Title</label><input className="form-input" placeholder="e.g. TCF Canada Practice Test" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></div>
              <div className="form-group" style={{gridColumn:"span 2"}}><label className="form-label">Description</label><input className="form-input" placeholder="Short description..." value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></div>
              <div className="form-group"><label className="form-label">Duration (minutes)</label><input className="form-input" type="number" min="1" value={form.duration} onChange={e=>setForm({...form,duration:Number(e.target.value)})}/></div>
              <div className="form-group" style={{display:"flex",alignItems:"center",gap:8,marginTop:20}}><input type="checkbox" checked={form.active} onChange={e=>setForm({...form,active:e.target.checked})}/><label className="form-label" style={{margin:0}}>Active (visible to students)</label></div>
            </div>

            <div style={{marginTop:20,borderTop:"1px solid var(--border)",paddingTop:16}}>
              <div style={{fontWeight:600,marginBottom:12}}>Questions ({questions.length})</div>
              {questions.map((q,i)=>(
                <div key={i} style={{background:"var(--ink3)",borderRadius:8,padding:"10px 14px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <span style={{fontSize:11,color:"var(--text3)",marginRight:8}}>[{q.type}]</span>
                    <span style={{fontSize:13}}>{q.question}</span>
                  </div>
                  <button onClick={()=>removeQuestion(i)} style={{background:"var(--rose-dim)",border:"none",color:"var(--rose)",borderRadius:6,padding:"2px 8px",cursor:"pointer",fontSize:11}}>Remove</button>
                </div>
              ))}

              <div style={{background:"var(--ink3)",borderRadius:8,padding:14,marginTop:12}}>
                <div style={{fontWeight:500,marginBottom:10,fontSize:13}}>Add Question</div>
                <div className="pay-form">
                  <div className="form-group" style={{gridColumn:"span 2"}}><label className="form-label">Question</label><input className="form-input" placeholder="Enter question..." value={qForm.question} onChange={e=>setQForm({...qForm,question:e.target.value})}/></div>
                  <div className="form-group"><label className="form-label">Type</label>
                    <select className="form-select" value={qForm.type} onChange={e=>setQForm({...qForm,type:e.target.value})}>
                      <option value="multiple">Multiple Choice</option>
                      <option value="truefalse">True / False</option>
                      <option value="open">Open Answer</option>
                    </select>
                  </div>
                  {qForm.type==="multiple"&&(<>
                    <div className="form-group" style={{gridColumn:"span 2"}}>
                      {["A","B","C","D"].map((l,i)=>(
                        <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                          <input type="radio" checked={qForm.correct===i} onChange={()=>setQForm({...qForm,correct:i})}/>
                          <span style={{fontSize:12,color:"var(--text3)",width:16}}>{l}</span>
                          <input className="form-input" style={{margin:0}} placeholder={Option } value={qForm.options[i]||""} onChange={e=>{const o=[...qForm.options];o[i]=e.target.value;setQForm({...qForm,options:o});}}/>
                        </div>
                      ))}
                      <div style={{fontSize:11,color:"var(--text3)"}}>Select the radio button next to the correct answer</div>
                    </div>
                  </>)}
                  {qForm.type==="truefalse"&&(
                    <div className="form-group"><label className="form-label">Correct Answer</label>
                      <select className="form-select" value={qForm.correct} onChange={e=>setQForm({...qForm,correct:Number(e.target.value)})}>
                        <option value={0}>True</option><option value={1}>False</option>
                      </select>
                    </div>
                  )}
                  {qForm.type==="open"&&(
                    <div className="form-group" style={{gridColumn:"span 2"}}><label className="form-label">Model Answer (for reference)</label><input className="form-input" placeholder="Expected answer..." value={qForm.correctText} onChange={e=>setQForm({...qForm,correctText:e.target.value})}/></div>
                  )}
                </div>
                <button className="btn btn-gold btn-sm" onClick={addQuestion} style={{marginTop:8}}>+ Add Question</button>
              </div>
            </div>

            <div className="modal-foot" style={{marginTop:16}}>
              <button className="btn btn-outline" onClick={()=>setShowCreate(false)}>Cancel</button>
              <button className="btn btn-gold" onClick={createQuiz}>Create Quiz ({questions.length} questions)</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
'''

f = open('app/admin/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

old = 'function ResourcesPage'
new = quiz_page + 'function ResourcesPage'
c = c.replace(old, new, 1)

f = open('app/admin/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done! QuizPage count:', c.count('function QuizPage'))

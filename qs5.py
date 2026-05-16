f = open('app/student/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

quiz_section = '''{/* QUIZ */}
        {tab==="quiz"&&(
          <div className="section">
            <div className="section-title">Quiz & Assessments</div>
            <div className="section-sub">Test your French knowledge</div>
            {activeQuiz?(
              <div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                  <div style={{fontWeight:600,fontSize:16}}>{activeQuiz.title}</div>
                  <div style={{background:"var(--rose-dim)",color:"var(--rose)",padding:"6px 14px",borderRadius:8,fontWeight:600,fontSize:14}}>
                    {Math.floor(quizTimeLeft/60)}:{String(quizTimeLeft%60).padStart(2,"0")}
                  </div>
                </div>
                {quizSubmitted?(
                  <div style={{textAlign:"center",padding:40}}>
                    <div style={{fontSize:48,marginBottom:12}}>🎉</div>
                    <div style={{fontFamily:"var(--font-d)",fontSize:28,color:"var(--gold)",marginBottom:8}}>{quizSubmitted.score}/{quizSubmitted.total}</div>
                    <div style={{color:"var(--text3)",marginBottom:20}}>Quiz completed!</div>
                    <button className="btn btn-gold" onClick={()=>{setActiveQuiz(null);setQuizSubmitted(null);setQuizAnswers({});}}>Back to Quizzes</button>
                  </div>
                ):(
                  <div>
                    {activeQuiz.questions.map((q,i)=>(
                      <div key={i} style={{background:"var(--ink3)",borderRadius:12,padding:16,marginBottom:12}}>
                        <div style={{fontWeight:500,marginBottom:12}}>{i+1}. {q.question}</div>
                        {q.type==="multiple"&&q.options.map((o,j)=>(
                          <div key={j} onClick={()=>setQuizAnswers({...quizAnswers,[i]:j})} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",borderRadius:8,marginBottom:6,cursor:"pointer",background:quizAnswers[i]===j?"var(--gold-dim)":"var(--ink2)",border:quizAnswers[i]===j?"1px solid var(--gold)":"1px solid transparent"}}>
                            <span style={{fontWeight:600,color:"var(--gold)",width:20}}>{["A","B","C","D"][j]}</span>
                            <span>{o}</span>
                          </div>
                        ))}
                        {q.type==="truefalse"&&["True","False"].map((o,j)=>(
                          <div key={j} onClick={()=>setQuizAnswers({...quizAnswers,[i]:j})} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",borderRadius:8,marginBottom:6,cursor:"pointer",background:quizAnswers[i]===j?"var(--gold-dim)":"var(--ink2)",border:quizAnswers[i]===j?"1px solid var(--gold)":"1px solid transparent"}}>
                            <span>{o}</span>
                          </div>
                        ))}
                        {q.type==="open"&&(
                          <textarea style={{width:"100%",background:"var(--ink2)",border:"1px solid var(--border)",borderRadius:8,padding:10,color:"var(--text)",fontSize:13,minHeight:80}} placeholder="Type your answer..." value={quizAnswers[i]||""} onChange={e=>setQuizAnswers({...quizAnswers,[i]:e.target.value})}/>
                        )}
                      </div>
                    ))}
                    <button className="btn btn-gold" style={{width:"100%",marginTop:8}} onClick={async()=>{
                      const r=await fetch("/api/student/quiz/submit",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({quizId:activeQuiz._id,studentId:student?._id,studentName:student?.firstName+" "+student?.lastName,answers:quizAnswers,timeTaken:activeQuiz.duration*60-quizTimeLeft})});
                      const d=await r.json();
                      if(d.success)setQuizSubmitted(d);
                    }}>Submit Quiz</button>
                  </div>
                )}
              </div>
            ):(
              <div>
                {quizzes.length===0?(<div style={{textAlign:"center",padding:40,color:"var(--text3)"}}>No quizzes available yet</div>
                ):quizzes.map(q=>(
                  <div key={q._id} style={{background:"var(--ink3)",borderRadius:12,padding:16,marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <div style={{fontWeight:600,marginBottom:4}}>{q.title}</div>
                      <div style={{fontSize:12,color:"var(--text3)",marginBottom:8}}>{q.description}</div>
                      <div style={{display:"flex",gap:8}}>
                        <span className="pill" style={{background:"var(--blue-dim)",color:"var(--blue)"}}>{q.questions?.length||0} questions</span>
                        <span className="pill" style={{background:"var(--gold-dim)",color:"var(--gold)"}}>{q.duration} min</span>
                      </div>
                    </div>
                    <button className="btn btn-gold" onClick={()=>{setActiveQuiz(q);setQuizAnswers({});setQuizTimeLeft(q.duration*60);setQuizSubmitted(null);const t=setInterval(()=>{setQuizTimeLeft(p=>{if(p<=1){clearInterval(t);return 0;}return p-1;});},1000);}}>Start Quiz</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        '''

old = '{/* RESOURCES */}'
new = quiz_section + '{/* RESOURCES */}'
c = c.replace(old, new, 1)

f = open('app/student/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done! quiz section:', c.count('tab==="quiz"'))

f = open('app/student/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

# Fix 1: Show score AND correct answer feedback on completion screen
old = '''<div style={{textAlign:"center",padding:40}}>
                    <div style={{fontSize:48,marginBottom:12}}>🎉</div>
                    <div style={{fontFamily:"var(--font-d)",fontSize:28,color:"var(--gold)",marginBottom:8}}>{quizSubmitted.score}/{quizSubmitted.total}</div>
                    <div style={{color:"var(--text3)",marginBottom:20}}>Quiz completed!</div>
                    <button className="btn btn-gold" onClick={()=>{setActiveQuiz(null);setQuizSubmitted(null);setQuizAnswers({});if(student?._id)fetch("/api/student/quiz/results?studentId="+student._id).then(r=>r.json()).then(d=>setQuizResults(d.results||[])).catch(()=>{});}}>Back to Quizzes</button>
                  </div>'''
new = '''<div style={{padding:20}}>
                    <div style={{textAlign:"center",marginBottom:24}}>
                      <div style={{fontSize:48,marginBottom:8}}>🎉</div>
                      <div style={{fontFamily:"var(--font-d)",fontSize:32,color:"var(--gold)",marginBottom:4}}>{quizSubmitted.score}/{quizSubmitted.total}</div>
                      <div style={{color:"var(--text3)",fontSize:14,marginBottom:4}}>Quiz completed!</div>
                      <div style={{fontSize:13,color:quizSubmitted.score===quizSubmitted.total?"var(--teal)":quizSubmitted.score>quizSubmitted.total/2?"var(--gold)":"var(--rose)",fontWeight:600}}>
                        {quizSubmitted.score===quizSubmitted.total?"Perfect score! 🏆":quizSubmitted.score>quizSubmitted.total/2?"Good job! Keep it up 👍":"Keep practicing! 💪"}
                      </div>
                    </div>
                    <div style={{marginBottom:16}}>
                      {activeQuiz.questions.map((q,i)=>{
                        const ans=quizAnswers[i];
                        const isOpen=q.type==="open";
                        const isCorrect=!isOpen&&Number(ans)===Number(q.correct);
                        return(
                          <div key={i} style={{background:"var(--ink3)",borderRadius:10,padding:14,marginBottom:10,borderLeft:3px solid }}>
                            <div style={{fontWeight:500,marginBottom:8,fontSize:13}}>{i+1}. {q.question}</div>
                            {q.type==="multiple"&&q.options.map((o,j)=>(
                              <div key={j} style={{fontSize:12,padding:"4px 10px",borderRadius:6,marginBottom:4,background:j===Number(q.correct)?"var(--teal-dim)":j===ans&&ans!==q.correct?"var(--rose-dim)":"transparent",color:j===Number(q.correct)?"var(--teal)":j===ans&&ans!==q.correct?"var(--rose)":"var(--text3)"}}>
                                {["A","B","C","D"][j]}. {o} {j===Number(q.correct)?" ✓":""}
                              </div>
                            ))}
                            {q.type==="truefalse"&&["True","False"].map((o,j)=>(
                              <div key={j} style={{fontSize:12,padding:"4px 10px",borderRadius:6,marginBottom:4,background:j===Number(q.correct)?"var(--teal-dim)":j===ans&&ans!==q.correct?"var(--rose-dim)":"transparent",color:j===Number(q.correct)?"var(--teal)":j===ans&&ans!==q.correct?"var(--rose)":"var(--text3)"}}>
                                {o} {j===Number(q.correct)?" ✓":""}
                              </div>
                            ))}
                            {isOpen&&<div style={{fontSize:12,color:"var(--text3)"}}>Your answer: {ans||"(no answer)"}</div>}
                          </div>
                        );
                      })}
                    </div>
                    <button className="btn btn-gold" style={{width:"100%"}} onClick={()=>{setActiveQuiz(null);setQuizSubmitted(null);setQuizAnswers({});if(student?._id)fetch("/api/student/quiz/results?studentId="+student._id).then(r=>r.json()).then(d=>setQuizResults(d.results||[])).catch(()=>{});}}>Back to Quizzes</button>
                  </div>'''
c = c.replace(old, new, 1)

# Fix 2: Show score on the quiz list next to "Completed"
old2 = '''{quizResults.some(r=>r.quizId===q._id)?(<span style={{fontSize:12,color:"var(--teal)",fontWeight:600}}>Completed</span>)'''
new2 = '''{quizResults.some(r=>r.quizId===q._id)?(()=>{const res=quizResults.find(r=>r.quizId===q._id);return(<div style={{textAlign:"right"}}><div style={{fontSize:13,color:"var(--teal)",fontWeight:600}}>Completed</div><div style={{fontSize:12,color:"var(--gold)"}}>{res.score}/{res.total} marks</div></div>);})()'''
c = c.replace(old2, new2, 1)

f = open('app/student/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done!')
print('feedback:', c.count('isCorrect'))
print('marks on list:', c.count('res.score'))

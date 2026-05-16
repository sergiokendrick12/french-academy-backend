f = open('app/student/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

old = '''(()=>{const done=quizResults.some(r=>r.quizId===q._id);return done?(<span style={{fontSize:12,color:"var(--teal)",fontWeight:600}}>✅ Completed</span>):(<button className="btn btn-gold" onClick={()=>{setActiveQuiz(q);setQuizAnswers({});setQuizTimeLeft(q.duration*60);setQuizSubmitted(null);const t=setInterval(()=>{setQuizTimeLeft(p=>{if(p<=1){clearInterval(t);return 0;}return p-1;});},1000);}}>Start Quiz</button>);})()'''
new = '''{quizResults.some(r=>r.quizId===q._id)?(<span style={{fontSize:12,color:"var(--teal)",fontWeight:600}}>Completed</span>):(<button className="btn btn-gold" onClick={()=>{setActiveQuiz(q);setQuizAnswers({});setQuizTimeLeft(q.duration*60);setQuizSubmitted(null);const t=setInterval(()=>{setQuizTimeLeft(p=>{if(p<=1){clearInterval(t);return 0;}return p-1;});},1000);}}>Start Quiz</button>)}'''
c = c.replace(old, new, 1)

f = open('app/student/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done! Completed check:', c.count('Completed'))

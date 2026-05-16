f = open('app/student/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

# Fix 1: Add useEffect to auto-submit when timer hits 0
old = 'useEffect(()=>{fetch(\'/api/student/quiz\').then(r=>r.json()).then(d=>setQuizzes(d.quizzes||[])).catch(()=>{});},[]);'
new = '''useEffect(()=>{fetch('/api/student/quiz').then(r=>r.json()).then(d=>setQuizzes(d.quizzes||[])).catch(()=>{});},[]);
  useEffect(()=>{
    if(activeQuiz && quizTimeLeft===0 && !quizSubmitted){
      fetch("/api/student/quiz/submit",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({quizId:activeQuiz._id,studentId:student?._id,studentName:(student?.firstName||"")+" "+(student?.lastName||""),answers:quizAnswers,timeTaken:activeQuiz.duration*60})}).then(r=>r.json()).then(d=>{if(d.success)setQuizSubmitted(d);});
    }
  },[quizTimeLeft]);'''
c = c.replace(old, new, 1)

# Fix 2: Block restart - replace "Back to Quizzes" button logic to also refetch results
old2 = '<button className="btn btn-gold" onClick={()=>{setActiveQuiz(null);setQuizSubmitted(null);setQuizAnswers({});}}>Back to Quizzes</button>'
new2 = '<button className="btn btn-gold" onClick={()=>{setActiveQuiz(null);setQuizSubmitted(null);setQuizAnswers({});if(student?._id)fetch("/api/student/quiz/results?studentId="+student._id).then(r=>r.json()).then(d=>setQuizResults(d.results||[])).catch(()=>{});}}>Back to Quizzes</button>'
c = c.replace(old2, new2, 1)

# Fix 3: Disable Start Quiz if already attempted
old3 = '<button className="btn btn-gold" onClick={()=>{setActiveQuiz(q);setQuizAnswers({});setQuizTimeLeft(q.duration*60);setQuizSubmitted(null);const t=setInterval(()=>{setQuizTimeLeft(p=>{if(p<=1){clearInterval(t);return 0;}return p-1;});},1000);}}>Start Quiz</button>'
new3 = '''(()=>{const done=quizResults.some(r=>r.quizId===q._id);return done?(<span style={{fontSize:12,color:"var(--teal)",fontWeight:600}}>✅ Completed</span>):(<button className="btn btn-gold" onClick={()=>{setActiveQuiz(q);setQuizAnswers({});setQuizTimeLeft(q.duration*60);setQuizSubmitted(null);const t=setInterval(()=>{setQuizTimeLeft(p=>{if(p<=1){clearInterval(t);return 0;}return p-1;});},1000);}}>Start Quiz</button>);})()'''
c = c.replace(old3, new3, 1)

f = open('app/student/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done!')
print('auto-submit useEffect:', c.count('quizTimeLeft===0'))
print('Back to Quizzes:', c.count('Back to Quizzes'))
print('Completed check:', c.count('Completed'))

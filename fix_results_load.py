f = open('app/student/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

old = "useEffect(()=>{fetch('/api/student/quiz').then(r=>r.json()).then(d=>setQuizzes(d.quizzes||[])).catch(()=>{});},[]);"
new = "useEffect(()=>{fetch('/api/student/quiz').then(r=>r.json()).then(d=>setQuizzes(d.quizzes||[])).catch(()=>{});},[]);useEffect(()=>{if(student?._id){fetch('/api/student/quiz/results?studentId='+student._id).then(r=>r.json()).then(d=>setQuizResults(d.results||[])).catch(()=>{});}},[student]);"
c = c.replace(old, new, 1)

f = open('app/student/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done!')
print('results fetch on load:', c.count('[student]'))

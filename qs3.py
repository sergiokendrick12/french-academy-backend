f = open('app/student/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

# Add quiz state and fetch inside component
old = 'const [RESOURCES,setRESOURCES]=useState([]);'
new = '''const [RESOURCES,setRESOURCES]=useState([]);
  const [quizzes,setQuizzes]=useState([]);
  const [activeQuiz,setActiveQuiz]=useState(null);
  const [quizAnswers,setQuizAnswers]=useState({});
  const [quizTimeLeft,setQuizTimeLeft]=useState(0);
  const [quizSubmitted,setQuizSubmitted]=useState(null);
  const [quizResults,setQuizResults]=useState([]);
  useEffect(()=>{fetch('/api/student/quiz').then(r=>r.json()).then(d=>setQuizzes(d.quizzes||[])).catch(()=>{});},[]);
  useEffect(()=>{if(student?._id)fetch('/api/student/quiz/results?studentId='+student._id).then(r=>r.json()).then(d=>setQuizResults(d.results||[])).catch(()=>{});},[student]);'''
c = c.replace(old, new, 1)

# Add quiz tab button - find resources tab button
old2 = '{tab==="resources"?"active":""} onClick={()=>setTab("resources")}'
new2 = '{tab==="resources"?"active":""} onClick={()=>setTab("resources")}>{ico("resources")} Resources</button>
          <button className={"tab-btn "+(tab==="quiz"?"active":"")} onClick={()=>setTab("quiz")}> Quiz</button'
c = c.replace(old2, new2, 1)

f = open('app/student/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done! quiz states:', c.count('setQuizzes'))

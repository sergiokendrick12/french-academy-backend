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
  useEffect(()=>{fetch('/api/student/quiz').then(r=>r.json()).then(d=>setQuizzes(d.quizzes||[])).catch(()=>{});},[]);'''
c = c.replace(old, new, 1)

f = open('app/student/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done! quizzes state:', c.count('setQuizzes'))

f = open('app/student/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

# Add quizTimer ref to store interval ID
old1 = 'const [quizzes,setQuizzes]=useState([]);'
new1 = 'const [quizzes,setQuizzes]=useState([]);const quizTimerRef=useRef(null);'
c = c.replace(old1, new1, 1)

# Store interval in ref when starting quiz
old2 = 'const t=setInterval(()=>{setQuizTimeLeft(p=>{if(p<=1){clearInterval(t);return 0;}return p-1;});},1000);'
new2 = 'const t=setInterval(()=>{setQuizTimeLeft(p=>{if(p<=1){clearInterval(t);return 0;}return p-1;});},1000);quizTimerRef.current=t;'
c = c.replace(old2, new2, 1)

# Stop timer on manual submit
old3 = 'const r=await fetch("/api/student/quiz/submit"'
new3 = 'if(quizTimerRef.current){clearInterval(quizTimerRef.current);quizTimerRef.current=null;}const r=await fetch("/api/student/quiz/submit"'
c = c.replace(old3, new3, 1)

# Check useRef is imported
if 'useRef' not in c:
    c = c.replace("useState,", "useState,useRef,")

f = open('app/student/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done!')
print('quizTimerRef:', c.count('quizTimerRef'))

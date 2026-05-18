f = open('app/student/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

old = '          setStudent(d.student);\n          setProfileForm({firstName:d.student.firstName,lastName:d.student.lastName,email:d.student.email,phone:d.student.phone||""});\n          fetchData(d.student._id);fetchAnnouncements();\n          return;'
new = '          setStudent(d.student);\n          setProfileForm({firstName:d.student.firstName,lastName:d.student.lastName,email:d.student.email,phone:d.student.phone||""});\n          fetchData(d.student._id);\n          fetchAnnouncements();\n          fetch("/api/student/quiz/results?studentId="+d.student._id).then(r=>r.json()).then(dd=>setQuizResults(dd.results||[])).catch(()=>{});\n          return;'
count = c.count(old)
print('Found:', count)
c = c.replace(old, new, 1)

f = open('app/student/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done!')

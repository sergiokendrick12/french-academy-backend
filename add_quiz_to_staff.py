f = open('app/api/staff/data/route.js', 'r', encoding='utf-8')
c = f.read()
f.close()

old = 'import Enrollment from "@/models/Enrollment";'
new = 'import Enrollment from "@/models/Enrollment";\nimport QuizResult from "@/models/QuizResult";'
c = c.replace(old, new, 1)

old2 = '    return NextResponse.json({ success: true, staff, schedules, students, attendance });'
new2 = '    const quizResults = await QuizResult.find().sort({ createdAt: -1 }).lean();\n    return NextResponse.json({ success: true, staff, schedules, students, attendance, quizResults });'
c = c.replace(old2, new2, 1)

f = open('app/api/staff/data/route.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done! quizResults:', c.count('quizResults'))

f = open('app/api/student/data/route.js', 'r', encoding='utf-8')
c = f.read()
f.close()

old = '    const { studentId, firstName, lastName, email, phone } = await req.json();\n    const Student = (await import("@/models/Enrollment")).default;\n    const student = await Student.findByIdAndUpdate(\n      studentId,\n      { firstName, lastName, email, phone },'
new = '    const { studentId, firstName, lastName, email, phone, photo } = await req.json();\n    const Student = (await import("@/models/Enrollment")).default;\n    const student = await Student.findByIdAndUpdate(\n      studentId,\n      { firstName, lastName, email, phone, ...(photo && { photo }) },'
c = c.replace(old, new, 1)

f = open('app/api/student/data/route.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done!')

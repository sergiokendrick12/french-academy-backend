f = open('app/student/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

# Find the resources section and get more context
idx = c.find('{/* RESOURCES */}')
out = open('student_res.txt', 'w', encoding='utf-8')
out.write(c[idx:idx+2000])
out.close()
print('done, length:', len(c[idx:idx+2000]))

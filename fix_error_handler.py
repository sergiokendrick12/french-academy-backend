f = open('app/student/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

old = '}else setErr(d.error||"Student not found.");'
new = '}else if(d.error==="Password required"){setShowPwField(true);setLoading(false);return;}else setErr(d.error||"Student not found.");'
count = c.count(old)
print('Found:', count)
c = c.replace(old, new, 1)

f = open('app/student/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done!')

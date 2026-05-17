f = open('app/staff/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

old = '<div className="student-ava">{(s.firstName?.[0]||"")+(s.lastName?.[0]||"")}</div>'
new = '<div className="student-ava" style={{overflow:"hidden",padding:0}}>{s.photo?<img src={s.photo} style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%"}} alt=""/>:(s.firstName?.[0]||"")+(s.lastName?.[0]||"")}</div>'
count = c.count(old)
print('Found:', count)
c = c.replace(old, new, 1)

f = open('app/staff/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done!')

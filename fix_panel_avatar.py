f = open('app/admin/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

old = '<div className="p-av">{initials(e.firstName,e.lastName)}</div>'
new = '<div className="p-av" style={{overflow:"hidden",padding:0}}>{e.photo?<img src={e.photo} style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%"}} alt=""/>:initials(e.firstName,e.lastName)}</div>'
count = c.count(old)
print('Found:', count)
c = c.replace(old, new, 1)
f = open('app/admin/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done!')

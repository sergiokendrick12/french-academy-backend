f = open('app/admin/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

old = '{initials(e.firstName,e.lastName)}'
new = '{e.photo?<img src={e.photo} alt="" style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%"}}/>:initials(e.firstName,e.lastName)}'
c = c.replace(old, new, 1)

f = open('app/admin/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done! photo in admin:', c.count('e.photo'))

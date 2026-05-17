f = open('app/admin/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

# Fix staff card avatar to show photo
old = '<div className="staff-av">{initials(s.name.split(" ")[0],s.name.split(" ")[1])}</div>'
new = '<div className="staff-av" style={{overflow:"hidden",padding:0}}>{s.photo?<img src={s.photo} style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%"}} alt=""/>:initials(s.name.split(" ")[0],s.name.split(" ")[1])}</div>'
count = c.count(old)
print('staff avatar found:', count)
c = c.replace(old, new, 1)

# Add photo to staff model - find the add staff API call
old2 = "const addStaff = async () => {"
idx = c.find(old2)
print('addStaff found:', idx)

f = open('app/admin/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done!')

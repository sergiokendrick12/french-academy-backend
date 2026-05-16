f = open('app/admin/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

old = 'page==="progress"'
new = 'page==="resources"?<ResourcesPage toast={toast}/>:page==="progress"'
c = c.replace(old, new, 1)

f = open('app/admin/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done! resources router:', c.count('page==="resources"'))

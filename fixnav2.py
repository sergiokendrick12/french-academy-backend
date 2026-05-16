f = open('app/admin/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

old = '{id:"staff",        ico:"'
new = '{id:"resources",    ico:"📚", label:"Resources",      section:"academy"},\n    {id:"staff",        ico:"'
c = c.replace(old, new, 1)

f = open('app/admin/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done! resources count:', c.count('id:"resources"'))

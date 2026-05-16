f = open('app/admin/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

# Find exact position and insert
old = '{id:"certifications",'
new = '{id:"resources",ico:"R",label:"Resources",section:"academy"},{id:"certifications",'
c = c.replace(old, new, 1)

f = open('app/admin/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done! resources count:', c.count('id:"resources"'))

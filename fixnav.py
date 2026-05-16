f = open('app/admin/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

# Remove from wrong place (attendance tabs)
old = ',{id:"resources",  ico:"📚", label:"Resources",   section:"academy"},'
c = c.replace(old, ',', 1)

# Add to correct navItems
old2 = '{id:"staff",ico:'
new2 = '{id:"resources",ico:"📚",label:"Resources",section:"academy"},{id:"staff",ico:'
c = c.replace(old2, new2, 1)

f = open('app/admin/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done! resources count:', c.count('id:"resources"'))

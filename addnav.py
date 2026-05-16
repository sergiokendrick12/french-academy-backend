f = open('app/admin/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

old = '{id:"staff",'
new = '{id:"resources",  ico:"📚", label:"Resources",   section:"academy"},\n    {id:"staff",'
c = c.replace(old, new, 1)

old2 = "case 'progress': return <ProgressPage"
new2 = "case 'resources': return <ResourcesPage toast={toast}/>\n      case 'progress': return <ProgressPage"
c = c.replace(old2, new2, 1)

f = open('app/admin/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done! resources count:', c.count('id:"resources"'))

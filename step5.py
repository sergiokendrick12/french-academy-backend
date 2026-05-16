f = open('app/admin/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

# Add Resources to sidebar menu
old = "['staff','Staff','👥'],"
new = "['staff','Staff','👥'],['resources','Resources','📚'],"
c = c.replace(old, new, 1)

# Add Resources to page router
old = "case 'progress': return <ProgressPage"
new = "case 'resources': return <ResourcesPage toast={toast}/>\n      case 'progress': return <ProgressPage"
c = c.replace(old, new, 1)

f = open('app/admin/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done! resources in sidebar:', c.count("'resources','Resources'"))

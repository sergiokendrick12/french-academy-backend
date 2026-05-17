f = open('app/admin/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

# Find exact form state
idx = c.find("name:'',role:''")
print('form state:', repr(c[idx-20:idx+60]))

# Find staff card avatar
idx2 = c.find('initials(s.name)')
print('staff avatar:', repr(c[idx2-200:idx2+50]))

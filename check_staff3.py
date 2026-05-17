f = open('app/admin/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

# Find staff form state
idx = c.find('setStaffForm')
if idx == -1:
    idx = c.find('staffForm')
print('staffForm:', repr(c[idx-20:idx+100]))

# Find staff card
idx2 = c.find('s.name')
print('s.name:', repr(c[idx2-200:idx2+100]))

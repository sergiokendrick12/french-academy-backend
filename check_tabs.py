f = open('app/staff/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()
# Check existing tabs
idx = c.find('id:"students"')
print(repr(c[idx-50:idx+200]))

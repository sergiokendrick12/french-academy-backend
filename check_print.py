f = open('app/admin/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()
idx = c.find('printId')
if idx == -1:
    idx = c.find('Print ID')
print('idx:', idx)
print(repr(c[idx-100:idx+400]))

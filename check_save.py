f = open('app/staff/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()
idx = c.find('saveProfile')
if idx == -1:
    idx = c.find('Save')
print(repr(c[idx-100:idx+400]))

f = open('app/admin/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()
print('editItem&& count:', c.count('editItem&&'))
print('Save Changes count:', c.count('Save Changes'))
idx = c.find('Save Changes')
if idx > 0:
    print(repr(c[idx-100:idx+50]))

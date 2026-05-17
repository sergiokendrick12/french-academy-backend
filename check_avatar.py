f = open('app/admin/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()
idx = c.find('Since 16 May')
if idx == -1:
    idx = c.find('Since ${')
print(repr(c[idx-300:idx+100]))

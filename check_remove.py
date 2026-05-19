f = open('app/admin/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()
print(repr(c[53950:54500]))

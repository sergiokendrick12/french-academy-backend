f = open('app/admin/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()
idx = c.find('const idNum')
idx2 = c.rfind('const printId', 0, idx)
if idx2 == -1:
    idx2 = c.rfind('printId', 0, idx)
print(repr(c[idx2-200:idx2+400]))

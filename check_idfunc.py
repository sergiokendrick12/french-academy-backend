f = open('app/admin/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()
idx = c.find('Print ID Card')
# Go back to find the function start
idx2 = c.rfind('const ', 0, idx)
print(repr(c[idx2:idx2+200]))

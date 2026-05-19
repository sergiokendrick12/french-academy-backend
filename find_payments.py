f = open('app/admin/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()
idx = c.find("payments")
while idx != -1:
    snippet = c[idx:idx+50]
    print(idx, repr(snippet))
    idx = c.find("payments", idx+1)
    if idx > 50000:
        break

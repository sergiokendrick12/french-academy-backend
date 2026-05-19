f = open('app/admin/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()
idx = c.find('PaymentsPage')
while idx != -1:
    print(idx, repr(c[idx:idx+80]))
    idx = c.find('PaymentsPage', idx+1)

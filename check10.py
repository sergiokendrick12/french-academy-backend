f = open('app/admin/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()
idx = c.find('function CertificationsPage')
section = c[idx:idx+800]
print(repr(section))

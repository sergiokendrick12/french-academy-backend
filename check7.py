f = open('app/admin/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()
# Find CertificationsPage showModal
idx = c.find('function CertificationsPage')
section = c[idx:idx+5000]
pos = section.find('{showModal&&(')
print('showModal found at offset:', pos)
print(repr(section[pos-50:pos+20]))

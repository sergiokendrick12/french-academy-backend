f = open('app/staff/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()
print(c[:3000])

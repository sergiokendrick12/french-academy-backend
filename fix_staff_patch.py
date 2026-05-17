f = open('app/api/staff/data/route.js', 'r', encoding='utf-8')
c = f.read()
f.close()

old = '    const { staffId, phone } = await req.json();\n    const staff = await Staff.findByIdAndUpdate(staffId, { phone }, { new: true });'
new = '    const { staffId, phone, photo } = await req.json();\n    const staff = await Staff.findByIdAndUpdate(staffId, { phone, ...(photo && { photo }) }, { new: true });'
count = c.count(old)
print('PATCH API found:', count)
c = c.replace(old, new, 1)

f = open('app/api/staff/data/route.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done!')

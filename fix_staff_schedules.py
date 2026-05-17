f = open('app/api/staff/data/route.js', 'r', encoding='utf-8')
c = f.read()
f.close()

old = '    const schedules = await Schedule.find({ teacher: staff.name }).lean();'
new = '    const schedules = await Schedule.find({ teacher: { $regex: new RegExp("^" + staff.name + "$", "i") } }).lean();'
count = c.count(old)
print('Found:', count)
c = c.replace(old, new, 1)

f = open('app/api/staff/data/route.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done!')

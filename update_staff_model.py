f = open('models/Staff.js', 'r', encoding='utf-8')
c = f.read()
f.close()

old = '    photo:  { type: String, default: "" },'
new = '    photo:  { type: String, default: "" },\n    passwordHash: { type: String, default: "" },'
count = c.count(old)
print('Found:', count)
c = c.replace(old, new, 1)

f = open('models/Staff.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done!')

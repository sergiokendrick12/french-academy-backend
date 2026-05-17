# Fix Staff model to include photo
f = open('models/Staff.js', 'r', encoding='utf-8')
c = f.read()
f.close()

old = "    status: { type: String, default: 'active' },"
new = "    status: { type: String, default: 'active' },\n    photo: { type: String, default: '' },"
count = c.count(old)
print('model found:', count)
c = c.replace(old, new, 1)

f = open('models/Staff.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Model updated!')

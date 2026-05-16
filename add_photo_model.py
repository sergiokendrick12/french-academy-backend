f = open('models/Enrollment.js', 'r', encoding='utf-8')
c = f.read()
f.close()

old = '  notes: { type: String, default: "" },'
new = '  notes: { type: String, default: "" },\n  photo: { type: String, default: "" },'
c = c.replace(old, new, 1)

f = open('models/Enrollment.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done! photo field:', c.count('photo'))

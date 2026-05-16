# Fix 1: Add totalMarks to Quiz model
f = open('models/Quiz.js', 'r', encoding='utf-8')
c = f.read()
f.close()

old = '  active: { type: Boolean, default: true },'
new = '  active: { type: Boolean, default: true },\n  totalMarks: { type: Number, default: 0 },'
c = c.replace(old, new, 1)

f = open('models/Quiz.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Model updated!')

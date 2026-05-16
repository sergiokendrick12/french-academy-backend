f = open('app/student/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

old = 'borderLeft:3px solid '
new = 'borderLeft:"3px solid "+(isOpen?"var(--blue)":isCorrect?"var(--teal)":"var(--rose)")'
count = c.count(old)
print('Found:', count)
c = c.replace(old, new, 1)

f = open('app/student/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Fixed!')

f = open('app/admin/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

old = 'class="photo"></div>'
new = 'class="photo">' + ("${student.photo ? '<img src=\"' + student.photo + '\" style=\"width:100%;height:100%;object-fit:cover;border-radius:6px;\">' : ''}") + '</div>'
count = c.count(old)
print('Found:', count)
c = c.replace(old, new, 1)
f = open('app/admin/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done!')

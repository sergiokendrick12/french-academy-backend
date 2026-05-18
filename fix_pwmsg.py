f = open('app/student/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

# Clear pwMsg when switching to profile tab
old = 'setTab("profile")'
new = 'setTab("profile");setPwMsg("");setPwForm({current:"",newPw:"",confirm:""})'
count = c.count(old)
print('Found:', count)
c = c.replace(old, new)

f = open('app/student/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done!')

f = open('app/staff/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

old = '  const [profileSaving,setProfileSaving] = useState(false);'
new = '  const [profileSaving,setProfileSaving] = useState(false);\n  const [profileForm,setProfileForm] = useState({});'
count = c.count(old)
print('Found:', count)
c = c.replace(old, new, 1)

f = open('app/staff/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done!')

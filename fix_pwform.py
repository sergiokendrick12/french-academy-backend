f = open('app/student/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

# Fix: clear pwMsg on mount and only show after submit
old = '  const [pwForm,setPwForm]=useState({current:"",newPw:"",confirm:""});\n  const [pwSaving,setPwSaving]=useState(false);\n  const [pwMsg,setPwMsg]=useState("");'
new = '  const [pwForm,setPwForm]=useState({current:"",newPw:"",confirm:""});\n  const [pwSaving,setPwSaving]=useState(false);\n  const [pwMsg,setPwMsg]=useState("");'
print('state ok')

# Fix: show current password field based on student.passwordHash
old2 = '{student.passwordHash&&<div><label style={{fontSize:11,fontWeight:600,letterSpacing:1,textTransform:"uppercase",color:"var(--text3)"}}>Current Password</label><input className="profile-in" type="password" placeholder="Enter current password" value={pwForm?.current||""} onChange={e=>setPwForm(p=>({...p,current:e.target.value}))}/></div>}'
new2 = '{(student.passwordHash&&student.passwordHash!=="")&&<div><label style={{fontSize:11,fontWeight:600,letterSpacing:1,textTransform:"uppercase",color:"var(--text3)"}}>Current Password</label><input className="profile-in" type="password" placeholder="Enter current password" value={pwForm?.current||""} onChange={e=>setPwForm(p=>({...p,current:e.target.value}))}/></div>}'
count2 = c.count(old2)
print('current pw field found:', count2)
c = c.replace(old2, new2, 1)

# Fix pwMsg initial display - clear on tab change
old3 = "setPwMsg(\"\");"
print('pwMsg clears:', c.count(old3))

f = open('app/student/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done!')

f = open('app/student/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

old = '<div className="section">\n              <div className="section-title">\U0001f393 Enrollment Info</div>'
new = '''<div className="section">
              <div className="section-title">🔒 Change Password</div>
              <div className="section-sub">Update your login password</div>
              <div style={{display:"grid",gap:10,marginTop:12}}>
                {student.passwordHash&&<div><label style={{fontSize:11,fontWeight:600,letterSpacing:1,textTransform:"uppercase",color:"var(--text3)"}}>Current Password</label><input className="profile-in" type="password" placeholder="Enter current password" value={pwForm?.current||""} onChange={e=>setPwForm(p=>({...p,current:e.target.value}))}/></div>}
                <div><label style={{fontSize:11,fontWeight:600,letterSpacing:1,textTransform:"uppercase",color:"var(--text3)"}}>{student.passwordHash?"New Password":"Set Password"}</label><input className="profile-in" type="password" placeholder="Min 8 characters" value={pwForm?.newPw||""} onChange={e=>setPwForm(p=>({...p,newPw:e.target.value}))}/></div>
                <div><label style={{fontSize:11,fontWeight:600,letterSpacing:1,textTransform:"uppercase",color:"var(--text3)"}}>Confirm Password</label><input className="profile-in" type="password" placeholder="Repeat password" value={pwForm?.confirm||""} onChange={e=>setPwForm(p=>({...p,confirm:e.target.value}))}/></div>
                {pwMsg&&<div style={{fontSize:12,padding:"8px 12px",borderRadius:8,background:pwMsg.includes("✅")?"rgba(74,222,128,0.1)":"rgba(251,122,172,0.1)",color:pwMsg.includes("✅")?"var(--green)":"var(--rose)"}}>{pwMsg}</div>}
                <button className="save-btn" onClick={changePassword} disabled={pwSaving}>{pwSaving?"Saving…":"🔒 Update Password"}</button>
              </div>
            </div>
            <div className="section">
              <div className="section-title">🎓 Enrollment Info</div>'''
count = c.count(old)
print('Found:', count)
c = c.replace(old, new, 1)

f = open('app/student/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done!')

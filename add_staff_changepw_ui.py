f = open('app/staff/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

old = '            <div className="section">\n              <div className="section-title">\U0001f4ca My Stats</div>'
new = '''            <div className="section">
              <div className="section-title">🔒 Change Password</div>
              <div className="section-sub">Update your login password</div>
              <div style={{display:"grid",gap:10,marginTop:12}}>
                <div><label style={{fontSize:11,fontWeight:600,letterSpacing:1,textTransform:"uppercase",color:"var(--text2)"}}>Current Password</label><input className="profile-in" type="password" placeholder="Enter current password" value={staffPwForm.current} onChange={e=>setStaffPwForm(p=>({...p,current:e.target.value}))}/></div>
                <div><label style={{fontSize:11,fontWeight:600,letterSpacing:1,textTransform:"uppercase",color:"var(--text2)"}}>New Password</label><input className="profile-in" type="password" placeholder="Min 8 characters" value={staffPwForm.newPw} onChange={e=>setStaffPwForm(p=>({...p,newPw:e.target.value}))}/></div>
                <div><label style={{fontSize:11,fontWeight:600,letterSpacing:1,textTransform:"uppercase",color:"var(--text2)"}}>Confirm Password</label><input className="profile-in" type="password" placeholder="Repeat password" value={staffPwForm.confirm} onChange={e=>setStaffPwForm(p=>({...p,confirm:e.target.value}))}/></div>
                {staffPwMsg&&<div style={{fontSize:12,padding:"8px 12px",borderRadius:8,background:staffPwMsg.includes("✅")?"rgba(74,222,128,0.1)":"rgba(251,122,172,0.1)",color:staffPwMsg.includes("✅")?"var(--green)":"var(--rose)"}}>{staffPwMsg}</div>}
                <button className="save-btn" onClick={changeStaffPassword} disabled={staffPwSaving}>{staffPwSaving?"Saving…":"🔒 Update Password"}</button>
              </div>
            </div>
            <div className="section">
              <div className="section-title">📊 My Stats</div>'''
count = c.count(old)
print('Found:', count)
c = c.replace(old, new, 1)

f = open('app/staff/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done!')

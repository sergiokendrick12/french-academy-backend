f = open('app/student/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

old = '        <div className="login-lbl">Your Email Address</div>\n        <input className="login-in" type="email" placeholder="your@email.com" value={email}\n          onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&login()}/>\n        {err&&<p className="login-err">\u26a0\ufe0f {err}</p>}\n        <button className="login-btn" onClick={login} disabled={loading}>{loading?"Checking\u2026":"Access My Portal \u2192"}</button>\n        <p className="login-note">Enter the email address you used when enrolling</p>'
new = '''        <div className="login-lbl">Your Email Address</div>
        <input className="login-in" type="email" placeholder="your@email.com" value={email}
          onChange={e=>{setEmail(e.target.value);setShowPwField(false);}} onKeyDown={e=>e.key==="Enter"&&login()} disabled={showPwField}/>
        {showPwField&&(
          <>
            <div className="login-lbl" style={{marginTop:12}}>{firstLogin?"Set Your Password":"Password"}</div>
            <input className="login-in" type="password" placeholder={firstLogin?"Create a password...":"Enter your password..."} value={password}
              onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&login()} autoFocus/>
            {firstLogin&&<p style={{fontSize:11,color:"#9aa0be",marginBottom:8}}>First time login — please set a password for future logins</p>}
          </>
        )}
        {err&&<p className="login-err">⚠️ {err}</p>}
        <button className="login-btn" onClick={login} disabled={loading}>{loading?"Checking…":"Access My Portal →"}</button>
        <p className="login-note">{showPwField?"":"Enter the email address you used when enrolling"}</p>'''
count = c.count(old)
print('Found:', count)
c = c.replace(old, new, 1)

f = open('app/student/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done!')

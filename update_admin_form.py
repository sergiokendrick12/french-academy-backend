f = open('app/admin/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

# Add username state
old1 = "const [pw,setPw]=useState(\"\");"
new1 = "const [pw,setPw]=useState(\"\");\n  const [username,setUsername]=useState(\"\");"
count1 = c.count(old1)
print('pw state found:', count1)
c = c.replace(old1, new1, 1)

# Update submit to send username
old2 = "const{password}=await request.json();"
# Find the frontend submit function
old2 = 'body:JSON.stringify({password:pw})'
new2 = 'body:JSON.stringify({username,password:pw})'
count2 = c.count(old2)
print('submit found:', count2)
c = c.replace(old2, new2, 1)

# Add username field to login form
old3 = '        <div className="login-lbl">Password</div>\n        <input type="password" className="login-in" autoFocus value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="Enter admin password"/>'
new3 = '        <div className="login-lbl">Username</div>\n        <input type="text" className="login-in" autoFocus value={username} onChange={e=>setUsername(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="Enter admin username"/>\n        <div className="login-lbl">Password</div>\n        <input type="password" className="login-in" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="Enter admin password"/>'
count3 = c.count(old3)
print('login form found:', count3)
c = c.replace(old3, new3, 1)

f = open('app/admin/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done!')

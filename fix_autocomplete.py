f = open('app/admin/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

old = 'value={username} onChange={e=>setUsername(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="Enter admin username"'
new = 'value={username} onChange={e=>setUsername(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="Enter admin username" autoComplete="off"'
c = c.replace(old, new, 1)

old2 = 'value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="Enter admin password"'
new2 = 'value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="Enter admin password" autoComplete="new-password"'
c = c.replace(old2, new2, 1)

f = open('app/admin/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done!')

f = open('app/student/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

old = '<div className="resource-name">{r.name}</div><div className="resource-desc">{r.desc}</div>'
new = '<div className="resource-name">{r.title||r.name}</div><div className="resource-desc">{r.description||r.desc}</div>'
c = c.replace(old, new, 1)

old2 = '<button className="dl-btn">'
new2 = '<a href={r.url||"#"} target="_blank" rel="noreferrer" className="dl-btn" style={{textDecoration:"none"}}>'
c = c.replace(old2, new2, 1)

old3 = 'Download</button>'
new3 = 'Download</a>'
c = c.replace(old3, new3, 1)

f = open('app/student/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done!')

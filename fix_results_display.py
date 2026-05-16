f = open('app/admin/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

old = 'const pct=Math.round((r.score/r.total)*100);return('
new = 'const pct=r.total?Math.round((r.score/r.total)*100):null;return('

c = c.replace(old, new, 1)

old2 = '{pct}%</span></td>'
new2 = '{pct!==null?pct+"%":"N/A"}</span></td>'
c = c.replace(old2, new2, 1)

old3 = 'background:pct>=70?"var(--teal-dim)":pct>=50?"var(--gold-dim)":"var(--rose-dim)",color:pct>=70?"var(--teal)":pct>=50?"var(--gold)":"var(--rose)"'
new3 = 'background:pct===null?"var(--ink3)":pct>=70?"var(--teal-dim)":pct>=50?"var(--gold-dim)":"var(--rose-dim)",color:pct===null?"var(--text3)":pct>=70?"var(--teal)":pct>=50?"var(--gold)":"var(--rose)"'
c = c.replace(old3, new3, 1)

old4 = '{new Date(r.createdAt).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})}'
new4 = '{r.createdAt?new Date(r.createdAt).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}):"N/A"}'
c = c.replace(old4, new4, 1)

old5 = '<td style={{padding:"10px 12px",color:"var(--text3)"}}>{r.quizTitle}</td>'
new5 = '<td style={{padding:"10px 12px",color:"var(--text3)"}}>{r.quizTitle||"N/A"}</td>'
c = c.replace(old5, new5, 1)

f = open('app/admin/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done!')

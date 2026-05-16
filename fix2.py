f = open('app/admin/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()
old = '<span style={{fontSize:11,color:"var(--text3)"}}>{t.examDate||"\u2014"}</span>'
new = '<span style={{fontSize:11,color:"var(--text3)"}}>{t.examDate||"-"}</span><span style={{display:"flex",gap:6}}><button onClick={()=>setEditItem({...t})} style={{background:"var(--ink3)",border:"1px solid var(--border)",color:"var(--gold)",borderRadius:6,padding:"3px 8px",cursor:"pointer",fontSize:11}}>Edit</button><button onClick={()=>deleteResult(t._id)} style={{background:"var(--rose-dim)",border:"none",color:"var(--rose)",borderRadius:6,padding:"3px 8px",cursor:"pointer",fontSize:11}}>Delete</button></span>'
c = c.replace(old, new, 1)
f = open('app/admin/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done!')

f = open('app/admin/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

# Fix 1: Add quizResults state
old1 = 'quizzes,setQuizzes] = useState([]);'
new1 = 'quizzes,setQuizzes] = useState([]);const [quizResults,setQuizResults]=useState([]);'
c = c.replace(old1, new1, 1)

# Fix 2: Add results fetch
old2 = 'api/admin/quiz"); const d = await r.json(); setQuizzes(d.quizzes||[]); } catch {}'
new2 = 'api/admin/quiz"); const d = await r.json(); setQuizzes(d.quizzes||[]); } catch {} try { const r2=await fetch("/api/admin/quiz/results"); const d2=await r2.json(); setQuizResults(d2.results||[]); } catch {}'
c = c.replace(old2, new2, 1)

# Fix 3: Add results table before showCreate modal
old3 = 'showCreate&&(\n        <div className="modal-bg" onClick={()=>setShowCreate(false)'
new3 = '''showCreate&&(
        <div className="modal-bg" onClick={()=>setShowCreate(false)'''
c = c.replace(old3, new3, 1)

# Add results section before showCreate
old4 = 'showCreate&&(\n        <div className="modal-bg" onClick={()=>setShowCreate(false)'
new4 = '''showCreate&&(
        <div className="modal-bg" onClick={()=>setShowCreate(false)'''

# Insert results table
insert = '''<div style={{marginTop:32}}>
        <div style={{fontFamily:"var(--font-d)",fontSize:18,marginBottom:12}}>📊 Student Results</div>
        {quizResults.length===0?(<div className="empty"><div className="empty-ico">📊</div><p className="empty-txt">No results yet</p></div>):(
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
              <thead><tr style={{borderBottom:"1px solid var(--ink3)"}}>
                <th style={{textAlign:"left",padding:"8px 12px",color:"var(--text3)",fontWeight:500}}>Student</th>
                <th style={{textAlign:"left",padding:"8px 12px",color:"var(--text3)",fontWeight:500}}>Quiz</th>
                <th style={{textAlign:"center",padding:"8px 12px",color:"var(--text3)",fontWeight:500}}>Score</th>
                <th style={{textAlign:"center",padding:"8px 12px",color:"var(--text3)",fontWeight:500}}>Result</th>
                <th style={{textAlign:"left",padding:"8px 12px",color:"var(--text3)",fontWeight:500}}>Date</th>
              </tr></thead>
              <tbody>{quizResults.map((r,i)=>{const pct=Math.round((r.score/r.total)*100);return(
                <tr key={i} style={{borderBottom:"1px solid var(--ink3)"}}>
                  <td style={{padding:"10px 12px",fontWeight:500}}>{r.studentName}</td>
                  <td style={{padding:"10px 12px",color:"var(--text3)"}}>{r.quizTitle}</td>
                  <td style={{padding:"10px 12px",textAlign:"center"}}><span style={{fontWeight:600,color:"var(--gold)"}}>{r.score}/{r.total}</span></td>
                  <td style={{padding:"10px 12px",textAlign:"center"}}><span style={{fontSize:11,padding:"3px 10px",borderRadius:20,fontWeight:600,background:pct>=70?"var(--teal-dim)":pct>=50?"var(--gold-dim)":"var(--rose-dim)",color:pct>=70?"var(--teal)":pct>=50?"var(--gold)":"var(--rose)"}}>{pct}%</span></td>
                  <td style={{padding:"10px 12px",color:"var(--text3)",fontSize:12}}>{new Date(r.createdAt).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})}</td>
                </tr>);})}</tbody>
            </table>
          </div>
        )}
      </div>'''

c = c.replace('showCreate&&(', insert+'\n      {showCreate&&(', 1)

f = open('app/admin/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done!')
print('quizResults:', c.count('quizResults'))
print('Student Results:', c.count('Student Results'))

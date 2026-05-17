f = open('app/staff/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

# Add marks tab
old = '    {id:"history",    label:"📋 Att. History"},'
new = '    {id:"history",    label:"📋 Att. History"},\n    {id:"marks",      label:"📊 Marks"},'
c = c.replace(old, new, 1)

# Add quizResults to data
old2 = '  const myAttendance     = data?.attendance||[];'
new2 = '  const myAttendance     = data?.attendance||[];\n  const quizResults      = data?.quizResults||[];'
c = c.replace(old2, new2, 1)

# Add marks tab content - find where history tab ends
old3 = "{tab===\"profile\"&&("
new3 = """{tab===\"marks\"&&(
            <div>
              <div className="section-title">📊 Student Marks</div>
              <div className="section-sub" style={{marginBottom:16}}>Quiz results for all students</div>
              {quizResults.length===0?(<div className="empty-state"><div className="empty-ico">📊</div><p>No quiz results yet</p></div>):(
                <div style={{overflowX:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                    <thead>
                      <tr style={{borderBottom:"1px solid var(--border)"}}>
                        <th style={{textAlign:"left",padding:"8px 12px",color:"var(--text2)",fontWeight:500}}>Student</th>
                        <th style={{textAlign:"left",padding:"8px 12px",color:"var(--text2)",fontWeight:500}}>Quiz</th>
                        <th style={{textAlign:"center",padding:"8px 12px",color:"var(--text2)",fontWeight:500}}>Score</th>
                        <th style={{textAlign:"center",padding:"8px 12px",color:"var(--text2)",fontWeight:500}}>Result</th>
                        <th style={{textAlign:"left",padding:"8px 12px",color:"var(--text2)",fontWeight:500}}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quizResults.map((r,i)=>{
                        const pct=r.total?Math.round((r.score/r.total)*100):null;
                        return(
                          <tr key={i} style={{borderBottom:"1px solid var(--border)"}}>
                            <td style={{padding:"10px 12px",fontWeight:500}}>{r.studentName}</td>
                            <td style={{padding:"10px 12px",color:"var(--text2)"}}>{r.quizTitle||"N/A"}</td>
                            <td style={{padding:"10px 12px",textAlign:"center"}}><span style={{fontWeight:600,color:"var(--amber)"}}>{r.score}/{r.total}</span></td>
                            <td style={{padding:"10px 12px",textAlign:"center"}}><span style={{fontSize:11,padding:"3px 10px",borderRadius:20,fontWeight:600,background:pct===null?"rgba(255,255,255,0.05)":pct>=70?"rgba(74,222,128,0.1)":pct>=50?"rgba(251,191,36,0.1)":"rgba(251,122,172,0.1)",color:pct===null?"var(--text2)":pct>=70?"var(--green)":pct>=50?"var(--amber)":"var(--rose)"}}>{pct!==null?pct+"%":"N/A"}</span></td>
                            <td style={{padding:"10px 12px",color:"var(--text2)",fontSize:12}}>{r.createdAt?new Date(r.createdAt).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}):"N/A"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          {tab===\"profile\"&&("""
count = c.count(old3)
print('Found:', count)
c = c.replace(old3, new3, 1)

f = open('app/staff/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done!')
print('marks tab:', c.count('Student Marks'))

f = open('app/admin/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

# Add delete result function after removeQuestion
old1 = 'const removeQuestion = (i) => setQuestions(questions.filter((_,idx)=>idx!==i));'
new1 = '''const removeQuestion = (i) => setQuestions(questions.filter((_,idx)=>idx!==i));
  const deleteResult = async (id) => {
    if(!confirm("Delete this result?")) return;
    await fetch("/api/admin/quiz/results",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id})});
    setQuizResults(quizResults.filter(r=>r._id!==id));
  };'''
c = c.replace(old1, new1, 1)

# Add delete button and Date column header
old2 = '<th style={{textAlign:"left",padding:"8px 12px",color:"var(--text3)",fontWeight:500}}>Date</th>'
new2 = '<th style={{textAlign:"left",padding:"8px 12px",color:"var(--text3)",fontWeight:500}}>Date</th><th style={{padding:"8px 12px"}}></th>'
c = c.replace(old2, new2, 1)

# Add delete button to each row
old3 = '</tr>);})}</tbody>'
new3 = '<td style={{padding:"10px 12px"}}><button onClick={()=>deleteResult(r._id)} style={{background:"var(--rose-dim)",border:"none",color:"var(--rose)",borderRadius:6,padding:"4px 10px",cursor:"pointer",fontSize:11}}>Delete</button></td></tr>);})}</tbody>'
c = c.replace(old3, new3, 1)

f = open('app/admin/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done!')
print('deleteResult:', c.count('deleteResult'))

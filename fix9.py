f = open('app/admin/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

# Remove the wrongly placed editItem modal from PaymentsPage
wrong = '{editItem&&(<div className="modal-bg" onClick={()=>setEditItem(null)}><div className="modal" onClick={e=>e.stopPropagation()}><div className="modal-title">Edit Exam Result</div><div className="pay-form"><div className="form-group"><label className="form-label">Score</label><input className="form-input" value={editItem.score||""} onChange={e=>setEditItem({...editItem,score:e.target.value})}/></div><div className="form-group"><label className="form-label">Exam Date</label><input className="form-input" type="date" value={editItem.examDate||""} onChange={e=>setEditItem({...editItem,examDate:e.target.value})}/></div><div className="form-group" style={{gridColumn:"span 2"}}><label className="form-label">Notes</label><input className="form-input" value={editItem.notes||""} onChange={e=>setEditItem({...editItem,notes:e.target.value})}/></div><div style={{display:"flex",alignItems:"center",gap:8,gridColumn:"span 2"}}><input type="checkbox" checked={editItem.passed||false} onChange={e=>setEditItem({...editItem,passed:e.target.checked})}/><label className="form-label" style={{margin:0}}>Passed</label></div></div><div style={{display:"flex",gap:10,marginTop:16}}><button className="btn btn-gold" onClick={saveEdit}>Save Changes</button><button className="btn" onClick={()=>setEditItem(null)}>Cancel</button></div></div></div>)}'
c = c.replace(wrong, '', 1)
f = open('app/admin/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Removed! Save Changes count:', c.count('Save Changes'))

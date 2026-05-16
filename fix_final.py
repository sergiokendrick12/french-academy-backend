f = open('app/admin/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

old = '''function CertificationsPage({enrollments,toast}) {
  const [editItem,setEditItem] = useState(null);
  const deleteResult = async (id) => { if(!confirm("Delete this result?")) return; await fetch("/api/admin/certifications",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id})}); fetchTracking(); toast("Result deleted!","success"); };
  const saveEdit = async () => { await fetch("/api/admin/certifications",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(editItem)}); setEditItem(null); fetchTracking(); toast("Result updated!","success"); };
  const enrolled = enrollments.filter(e=>e.status==="enrolled");
  const [tracking,setTracking] = useState([]);
  const [showModal,setShowModal] = useState(false);
  const [form,setForm] = useState({studentId:"",examDate:"",score:"",passed:false,notes:""});'''

new = '''function CertificationsPage({enrollments,toast}) {
  const enrolled = enrollments.filter(e=>e.status==="enrolled");
  const [tracking,setTracking] = useState([]);
  const [showModal,setShowModal] = useState(false);
  const [editItem,setEditItem] = useState(null);
  const [form,setForm] = useState({studentId:"",examDate:"",score:"",passed:false,notes:""});'''

c = c.replace(old, new, 1)

old2 = '  const addResult = async () => {'
new2 = '''  const deleteResult = async (id) => { if(!confirm("Delete this result?")) return; await fetch("/api/admin/certifications",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id})}); fetchTracking(); toast("Result deleted!","success"); };
  const saveEdit = async () => { await fetch("/api/admin/certifications",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(editItem)}); setEditItem(null); fetchTracking(); toast("Result updated!","success"); };
  const addResult = async () => {'''

c = c.replace(old2, new2, 1)

old3 = '      {showModal&&('
new3 = '''      {editItem&&(<div className="modal-bg" onClick={()=>setEditItem(null)}><div className="modal" onClick={e=>e.stopPropagation()}><div className="modal-title">Edit Exam Result</div><div className="pay-form"><div className="form-group"><label className="form-label">Score</label><input className="form-input" value={editItem.score||""} onChange={e=>setEditItem({...editItem,score:e.target.value})}/></div><div className="form-group"><label className="form-label">Exam Date</label><input className="form-input" type="date" value={editItem.examDate||""} onChange={e=>setEditItem({...editItem,examDate:e.target.value})}/></div><div className="form-group" style={{gridColumn:"span 2"}}><label className="form-label">Notes</label><input className="form-input" value={editItem.notes||""} onChange={e=>setEditItem({...editItem,notes:e.target.value})}/></div><div style={{display:"flex",alignItems:"center",gap:8,gridColumn:"span 2"}}><input type="checkbox" checked={editItem.passed||false} onChange={e=>setEditItem({...editItem,passed:e.target.checked})}/><label className="form-label" style={{margin:0}}>Passed</label></div></div><div style={{display:"flex",gap:10,marginTop:16}}><button className="btn btn-gold" onClick={saveEdit}>Save Changes</button><button className="btn" onClick={()=>setEditItem(null)}>Cancel</button></div></div></div>)}
      {showModal&&('''

c = c.replace(old3, new3, 1)

f = open('app/admin/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done! editItem count:', c.count('editItem&&'))

f = open('app/admin/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

resources_page = '''
function ResourcesPage({toast}) {
  const [resources,setResources] = useState([]);
  const [showModal,setShowModal] = useState(false);
  const [form,setForm] = useState({title:"",description:"",type:"PDF",level:"All levels",url:""});

  const fetchResources = async () => {
    try { const r = await fetch("/api/admin/resources"); const d = await r.json(); setResources(d.resources||[]); } catch {}
  };
  useEffect(()=>{ fetchResources(); },[]);

  const addResource = async () => {
    if(!form.title||!form.url) return;
    await fetch("/api/admin/resources",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
    fetchResources(); setShowModal(false); toast("Resource added!","success");
    setForm({title:"",description:"",type:"PDF",level:"All levels",url:""});
  };
  const deleteResource = async (id) => {
    if(!confirm("Delete this resource?")) return;
    await fetch("/api/admin/resources",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id})});
    fetchResources(); toast("Resource deleted!","success");
  };

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div style={{fontFamily:"var(--font-d)",fontSize:22}}>Study Resources</div>
        <button className="btn btn-gold" onClick={()=>setShowModal(true)}>+ Add Resource</button>
      </div>
      <div className="tbl-wrap">
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 2fr 80px",padding:"9px 16px",background:"var(--ink3)",borderBottom:"1px solid var(--border)",fontSize:10,fontWeight:600,letterSpacing:"1.5px",textTransform:"uppercase",color:"var(--text3)"}}>
          <span>Title</span><span>Type</span><span>Level</span><span>URL</span><span>Action</span>
        </div>
        {resources.length===0?(
          <div className="empty"><div className="empty-ico">📚</div><p className="empty-txt">No resources yet</p><p className="empty-sub">Add study materials for students</p></div>
        ):resources.map(r=>(
          <div key={r._id} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 2fr 80px",padding:"12px 16px",borderBottom:"1px solid rgba(36,54,80,.5)",fontSize:13,alignItems:"center"}}>
            <span style={{fontWeight:500}}>{r.title}</span>
            <span><span className="pill" style={{background:"var(--blue-dim)",color:"var(--blue)"}}>{r.type}</span></span>
            <span style={{fontSize:12,color:"var(--text3)"}}>{r.level}</span>
            <a href={r.url} target="_blank" rel="noreferrer" style={{color:"var(--gold)",fontSize:12,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",display:"block"}}>{r.url}</a>
            <button onClick={()=>deleteResource(r._id)} style={{background:"var(--rose-dim)",border:"none",color:"var(--rose)",borderRadius:6,padding:"3px 8px",cursor:"pointer",fontSize:11}}>Delete</button>
          </div>
        ))}
      </div>
      {showModal&&(
        <div className="modal-bg" onClick={()=>setShowModal(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-title">Add Study Resource</div>
            <div className="pay-form">
              <div className="form-group" style={{gridColumn:"span 2"}}><label className="form-label">Title</label><input className="form-input" placeholder="e.g. TCF Sample Test" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></div>
              <div className="form-group"><label className="form-label">Type</label>
                <select className="form-select" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
                  <option>PDF</option><option>Audio</option><option>Video</option><option>Link</option>
                </select>
              </div>
              <div className="form-group"><label className="form-label">Level</label>
                <select className="form-select" value={form.level} onChange={e=>setForm({...form,level:e.target.value})}>
                  <option>All levels</option><option>Beginner</option><option>A1</option><option>A2</option><option>B1</option><option>B1-B2</option><option>B2</option><option>C1</option><option>C2</option>
                </select>
              </div>
              <div className="form-group" style={{gridColumn:"span 2"}}><label className="form-label">URL (Google Drive, YouTube, etc.)</label><input className="form-input" placeholder="https://drive.google.com/..." value={form.url} onChange={e=>setForm({...form,url:e.target.value})}/></div>
              <div className="form-group" style={{gridColumn:"span 2"}}><label className="form-label">Description (optional)</label><input className="form-input" placeholder="Short description..." value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></div>
            </div>
            <div className="modal-foot">
              <button className="btn btn-outline" onClick={()=>setShowModal(false)}>Cancel</button>
              <button className="btn btn-gold" onClick={addResource}>Add Resource</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
'''

# Add before function ProgressPage
old = 'function ProgressPage'
new = resources_page + 'function ProgressPage'
c = c.replace(old, new, 1)
f = open('app/admin/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done! ResourcesPage count:', c.count('function ResourcesPage'))

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
  const [form,setForm] = useState({studentId:"",examDate:"",score:"",passed:false,notes:""});

  const fetchTracking = async () => {'''

new = '''function CertificationsPage({enrollments,toast}) {
  const enrolled = enrollments.filter(e=>e.status==="enrolled");
  const [tracking,setTracking] = useState([]);
  const [showModal,setShowModal] = useState(false);
  const [editItem,setEditItem] = useState(null);
  const [form,setForm] = useState({studentId:"",examDate:"",score:"",passed:false,notes:""});

  const fetchTracking = async () => {'''

c = c.replace(old, new, 1)

old2 = '  const addResult = async () => {'
new2 = '''  const deleteResult = async (id) => { if(!confirm("Delete this result?")) return; await fetch("/api/admin/certifications",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id})}); fetchTracking(); toast("Result deleted!","success"); };
  const saveEdit = async () => { await fetch("/api/admin/certifications",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(editItem)}); setEditItem(null); fetchTracking(); toast("Result updated!","success"); };
  const addResult = async () => {'''

c = c.replace(old2, new2, 1)

f = open('app/admin/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done! deleteResult count:', c.count('deleteResult'))

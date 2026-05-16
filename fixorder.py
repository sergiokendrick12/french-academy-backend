f = open('app/admin/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()
old = '''function CertificationsPage({enrollments,toast}) {
  const enrolled = enrollments.filter(e=>e.status==="enrolled");
  const [tracking,setTracking] = useState([]);
  const [showModal,setShowModal] = useState(false);
  const [editItem,setEditItem] = useState(null);
  const [form,setForm] = useState({studentId:"",examDate:"",score:"",passed:false,notes:""});'''
new = '''function CertificationsPage({enrollments,toast}) {
  const [tracking,setTracking] = useState([]);
  const [showModal,setShowModal] = useState(false);
  const [editItem,setEditItem] = useState(null);
  const [form,setForm] = useState({studentId:"",examDate:"",score:"",passed:false,notes:""});
  const enrolled = enrollments.filter(e=>e.status==="enrolled");'''
c = c.replace(old, new, 1)
f = open('app/admin/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done!')

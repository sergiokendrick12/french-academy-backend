f = open('app/student/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

# Remove the useState from outside component
old = '''const [RESOURCES, setRESOURCES] = useState([]);
  useEffect(()=>{
    fetch('/api/admin/resources').then(r=>r.json()).then(d=>setRESOURCES(d.resources||[])).catch(()=>{});
  },[]);'''
new = 'const RESOURCES_PLACEHOLDER = [];'
c = c.replace(old, new, 1)

# Find where to add it inside the student component
old2 = 'const [tab,setTab] = useState("overview");'
new2 = '''const [tab,setTab] = useState("overview");
  const [RESOURCES, setRESOURCES] = useState([]);
  useEffect(()=>{
    fetch('/api/admin/resources').then(r=>r.json()).then(d=>setRESOURCES(d.resources||[])).catch(()=>{});
  },[]);'''
c = c.replace(old2, new2, 1)

f = open('app/student/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done! RESOURCES count:', c.count('setRESOURCES'))

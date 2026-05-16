f = open('app/student/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

old = 'const [tab,setTab]=useState("overview");'
new = '''const [tab,setTab]=useState("overview");
  const [RESOURCES,setRESOURCES]=useState([]);
  useEffect(()=>{fetch('/api/admin/resources').then(r=>r.json()).then(d=>setRESOURCES(d.resources||[])).catch(()=>{});},[]);'''
c = c.replace(old, new, 1)

f = open('app/student/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done! setRESOURCES count:', c.count('setRESOURCES'))

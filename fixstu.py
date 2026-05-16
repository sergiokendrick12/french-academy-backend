f = open('app/student/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

# Find and replace the hardcoded RESOURCES array
idx_start = c.find('const RESOURCES=[')
idx_end = c.find('];', idx_start) + 2
old = c[idx_start:idx_end]

new = '''const [RESOURCES, setRESOURCES] = useState([]);
  useEffect(()=>{
    fetch('/api/admin/resources').then(r=>r.json()).then(d=>setRESOURCES(d.resources||[])).catch(()=>{});
  },[]);'''

c = c.replace(old, new, 1)
f = open('app/student/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done! RESOURCES fetch count:', c.count("fetch('/api/admin/resources')"))

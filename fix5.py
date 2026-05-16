f = open('app/admin/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

# Step 1: Add functions inside CertificationsPage after addResult
old1 = '    const addResult = async () => {'
new1 = '''    const [editItem,setEditItem] = useState(null);
    const deleteResult = async (id) => { if(!confirm("Delete this result?")) return; await fetch("/api/admin/certifications",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id})}); fetchTracking(); toast("Result deleted!","success"); };
    const saveEdit = async () => { await fetch("/api/admin/certifications",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(editItem)}); setEditItem(null); fetchTracking(); toast("Result updated!","success"); };
    const addResult = async () => {'''
c = c.replace(old1, new1, 1)

f = open('app/admin/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done! deleteResult count:', c.count('deleteResult'))

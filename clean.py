f = open('app/admin/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()
# Remove the wrongly placed functions
c = c.replace('''function CertificationsPage({enrollments,toast}) {
    const [editItem,setEditItem] = React.useState(null);
    const deleteResult = async (id) => { if(!confirm("Delete this result?")) return; await fetch("/api/admin/certifications",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id})}); fetchTracking(); toast("Result deleted!","success"); };
    const saveEdit = async () => { await fetch("/api/admin/certifications",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(editItem)}); setEditItem(null); fetchTracking(); toast("Result updated!","success"); };''', 'function CertificationsPage({enrollments,toast}) {', 1)
f = open('app/admin/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Cleaned! deleteResult count:', c.count('deleteResult'))
